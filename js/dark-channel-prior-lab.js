(function () {
  'use strict';

  const IMAGE_SRC = '/images/dark-channel-prior/haze-to-clarity-hero.png';
  const MAX_WIDTH = 720;

  const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));

  function loadSource() {
    if (window.__dcpSourcePromise) return window.__dcpSourcePromise;
    window.__dcpSourcePromise = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const width = Math.min(MAX_WIDTH, image.naturalWidth);
        const height = Math.round(width * image.naturalHeight / image.naturalWidth);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0, width, height);
        resolve({ canvas, width, height, imageData: context.getImageData(0, 0, width, height) });
      };
      image.onerror = reject;
      image.src = IMAGE_SRC;
    });
    return window.__dcpSourcePromise;
  }

  function minFilter(source, width, height, radius) {
    const horizontal = new Float32Array(source.length);
    const output = new Float32Array(source.length);
    const rowExtended = width + 2 * radius;
    const colExtended = height + 2 * radius;

    for (let y = 0; y < height; y += 1) {
      const dequeIndex = new Int32Array(rowExtended);
      const dequeValue = new Float32Array(rowExtended);
      let head = 0;
      let tail = 0;
      for (let i = 0; i < rowExtended; i += 1) {
        const x = clamp(i - radius, 0, width - 1);
        const value = source[y * width + x];
        while (tail > head && dequeValue[tail - 1] >= value) tail -= 1;
        dequeIndex[tail] = i;
        dequeValue[tail] = value;
        tail += 1;
        while (dequeIndex[head] < i - 2 * radius) head += 1;
        if (i >= 2 * radius) horizontal[y * width + i - 2 * radius] = dequeValue[head];
      }
    }

    for (let x = 0; x < width; x += 1) {
      const dequeIndex = new Int32Array(colExtended);
      const dequeValue = new Float32Array(colExtended);
      let head = 0;
      let tail = 0;
      for (let i = 0; i < colExtended; i += 1) {
        const y = clamp(i - radius, 0, height - 1);
        const value = horizontal[y * width + x];
        while (tail > head && dequeValue[tail - 1] >= value) tail -= 1;
        dequeIndex[tail] = i;
        dequeValue[tail] = value;
        tail += 1;
        while (dequeIndex[head] < i - 2 * radius) head += 1;
        if (i >= 2 * radius) output[(i - 2 * radius) * width + x] = dequeValue[head];
      }
    }
    return output;
  }

  function boxMean(source, width, height, radius) {
    const stride = width + 1;
    const integral = new Float64Array((width + 1) * (height + 1));
    for (let y = 0; y < height; y += 1) {
      let rowSum = 0;
      for (let x = 0; x < width; x += 1) {
        rowSum += source[y * width + x];
        integral[(y + 1) * stride + x + 1] = integral[y * stride + x + 1] + rowSum;
      }
    }
    const output = new Float32Array(source.length);
    for (let y = 0; y < height; y += 1) {
      const y0 = Math.max(0, y - radius);
      const y1 = Math.min(height - 1, y + radius);
      for (let x = 0; x < width; x += 1) {
        const x0 = Math.max(0, x - radius);
        const x1 = Math.min(width - 1, x + radius);
        const sum = integral[(y1 + 1) * stride + x1 + 1]
          - integral[y0 * stride + x1 + 1]
          - integral[(y1 + 1) * stride + x0]
          + integral[y0 * stride + x0];
        output[y * width + x] = sum / ((x1 - x0 + 1) * (y1 - y0 + 1));
      }
    }
    return output;
  }

  function guidedFilter(guidance, input, width, height, radius, epsilon) {
    const meanI = boxMean(guidance, width, height, radius);
    const meanP = boxMean(input, width, height, radius);
    const ii = new Float32Array(input.length);
    const ip = new Float32Array(input.length);
    for (let i = 0; i < input.length; i += 1) {
      ii[i] = guidance[i] * guidance[i];
      ip[i] = guidance[i] * input[i];
    }
    const corrI = boxMean(ii, width, height, radius);
    const corrIp = boxMean(ip, width, height, radius);
    const a = new Float32Array(input.length);
    const b = new Float32Array(input.length);
    for (let i = 0; i < input.length; i += 1) {
      const variance = Math.max(0, corrI[i] - meanI[i] * meanI[i]);
      const covariance = corrIp[i] - meanI[i] * meanP[i];
      a[i] = covariance / (variance + epsilon);
      b[i] = meanP[i] - a[i] * meanI[i];
    }
    const meanA = boxMean(a, width, height, radius);
    const meanB = boxMean(b, width, height, radius);
    const output = new Float32Array(input.length);
    for (let i = 0; i < input.length; i += 1) output[i] = clamp(meanA[i] * guidance[i] + meanB[i], 0, 1);
    return output;
  }

  function grayscaleImage(values, width, height, invert) {
    const image = new ImageData(width, height);
    for (let i = 0; i < values.length; i += 1) {
      const value = Math.round(255 * (invert ? 1 - values[i] : values[i]));
      const offset = i * 4;
      image.data[offset] = value;
      image.data[offset + 1] = value;
      image.data[offset + 2] = value;
      image.data[offset + 3] = 255;
    }
    return image;
  }

  function imageDataCanvas(imageData) {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    canvas.getContext('2d').putImageData(imageData, 0, 0);
    return canvas;
  }

  function process(source, settings) {
    const { width, height, imageData } = source;
    const count = width * height;
    const red = new Float32Array(count);
    const green = new Float32Array(count);
    const blue = new Float32Array(count);
    const guidance = new Float32Array(count);
    const minimum = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const offset = i * 4;
      red[i] = imageData.data[offset] / 255;
      green[i] = imageData.data[offset + 1] / 255;
      blue[i] = imageData.data[offset + 2] / 255;
      minimum[i] = Math.min(red[i], green[i], blue[i]);
      guidance[i] = 0.299 * red[i] + 0.587 * green[i] + 0.114 * blue[i];
    }

    const dark = minFilter(minimum, width, height, settings.radius);
    const histogram = new Uint32Array(256);
    dark.forEach(value => { histogram[Math.round(value * 255)] += 1; });
    const target = Math.max(1, Math.round(count * 0.001));
    let accumulated = 0;
    let threshold = 255;
    while (threshold > 0 && accumulated < target) {
      accumulated += histogram[threshold];
      threshold -= 1;
    }
    const thresholdValue = threshold / 255;
    let atmosphericIndex = 0;
    let atmosphericBrightness = -1;
    for (let i = 0; i < count; i += 1) {
      if (dark[i] < thresholdValue) continue;
      const brightness = red[i] + green[i] + blue[i];
      if (brightness > atmosphericBrightness) {
        atmosphericBrightness = brightness;
        atmosphericIndex = i;
      }
    }
    const atmosphere = [
      Math.max(red[atmosphericIndex], 1 / 255),
      Math.max(green[atmosphericIndex], 1 / 255),
      Math.max(blue[atmosphericIndex], 1 / 255)
    ];

    const normalizedMinimum = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      normalizedMinimum[i] = Math.min(red[i] / atmosphere[0], green[i] / atmosphere[1], blue[i] / atmosphere[2]);
    }
    const normalizedDark = minFilter(normalizedMinimum, width, height, settings.radius);
    const rawTransmission = new Float32Array(count);
    for (let i = 0; i < count; i += 1) rawTransmission[i] = clamp(1 - settings.omega * normalizedDark[i], 0, 1);
    const transmission = settings.refine
      ? guidedFilter(guidance, rawTransmission, width, height, Math.max(4, settings.radius * 2), 0.001)
      : rawTransmission;

    const restored = new ImageData(width, height);
    let meanTransmission = 0;
    for (let i = 0; i < count; i += 1) {
      const t = Math.max(settings.t0, transmission[i]);
      const offset = i * 4;
      restored.data[offset] = Math.round(255 * clamp((red[i] - atmosphere[0]) / t + atmosphere[0], 0, 1));
      restored.data[offset + 1] = Math.round(255 * clamp((green[i] - atmosphere[1]) / t + atmosphere[1], 0, 1));
      restored.data[offset + 2] = Math.round(255 * clamp((blue[i] - atmosphere[2]) / t + atmosphere[2], 0, 1));
      restored.data[offset + 3] = 255;
      meanTransmission += transmission[i];
    }

    return {
      atmosphere,
      meanTransmission: meanTransmission / count,
      dark,
      transmission,
      restored,
      darkImage: grayscaleImage(dark, width, height, false),
      transmissionImage: grayscaleImage(transmission, width, height, false)
    };
  }

  function fitCanvas(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
    canvas.style.aspectRatio = width + ' / ' + height;
  }

  function initLab(lab, source) {
    const main = lab.querySelector('[data-dcp-main]');
    const darkCanvas = lab.querySelector('[data-dcp-dark]');
    const transmissionCanvas = lab.querySelector('[data-dcp-transmission]');
    const patch = lab.querySelector('[data-dcp-patch]');
    const omega = lab.querySelector('[data-dcp-omega]');
    const floor = lab.querySelector('[data-dcp-floor]');
    const refine = lab.querySelector('[data-dcp-refine]');
    const compare = lab.querySelector('[data-dcp-compare]');
    const status = lab.querySelector('[data-dcp-status]');
    const viewButtons = lab.querySelectorAll('[data-dcp-view]');
    const outputs = {
      patch: lab.querySelector('[data-dcp-patch-output]'),
      omega: lab.querySelector('[data-dcp-omega-output]'),
      floor: lab.querySelector('[data-dcp-floor-output]'),
      compare: lab.querySelector('[data-dcp-compare-output]')
    };
    const metricA = lab.querySelector('[data-dcp-a]');
    const metricT = lab.querySelector('[data-dcp-t]');
    const swatch = lab.querySelector('[data-dcp-swatch]');
    let result = null;
    let selectedView = 'compare';
    let frame = null;

    [main, darkCanvas, transmissionCanvas].forEach(canvas => fitCanvas(canvas, source.width, source.height));

    function renderMain() {
      if (!result) return;
      const context = main.getContext('2d');
      context.clearRect(0, 0, main.width, main.height);
      const restoredCanvas = imageDataCanvas(result.restored);
      const darkImageCanvas = imageDataCanvas(result.darkImage);
      const transmissionImageCanvas = imageDataCanvas(result.transmissionImage);
      if (selectedView === 'input') context.drawImage(source.canvas, 0, 0);
      if (selectedView === 'restored') context.drawImage(restoredCanvas, 0, 0);
      if (selectedView === 'dark') context.drawImage(darkImageCanvas, 0, 0);
      if (selectedView === 'transmission') context.drawImage(transmissionImageCanvas, 0, 0);
      if (selectedView === 'compare') {
        const split = Number(compare.value) / 100;
        context.drawImage(source.canvas, 0, 0);
        context.save();
        context.beginPath();
        context.rect(main.width * split, 0, main.width * (1 - split), main.height);
        context.clip();
        context.drawImage(restoredCanvas, 0, 0);
        context.restore();
        context.fillStyle = 'rgba(255,255,255,.95)';
        context.fillRect(main.width * split - 1, 0, 2, main.height);
        context.fillStyle = '#e1b955';
        context.beginPath();
        context.arc(main.width * split, main.height / 2, 9, 0, Math.PI * 2);
        context.fill();
      }
      viewButtons.forEach(button => button.classList.toggle('is-active', button.dataset.dcpView === selectedView));
    }

    function recompute() {
      frame = null;
      status.classList.add('is-working');
      outputs.patch.textContent = (Number(patch.value) * 2 + 1) + ' × ' + (Number(patch.value) * 2 + 1);
      outputs.omega.textContent = Number(omega.value).toFixed(2);
      outputs.floor.textContent = Number(floor.value).toFixed(2);
      requestAnimationFrame(() => {
        result = process(source, {
          radius: Number(patch.value),
          omega: Number(omega.value),
          t0: Number(floor.value),
          refine: refine.checked
        });
        darkCanvas.getContext('2d').putImageData(result.darkImage, 0, 0);
        transmissionCanvas.getContext('2d').putImageData(result.transmissionImage, 0, 0);
        const rgb = result.atmosphere.map(value => Math.round(value * 255));
        metricA.textContent = rgb.join(' · ');
        metricT.textContent = result.meanTransmission.toFixed(3);
        swatch.style.backgroundColor = 'rgb(' + rgb.join(',') + ')';
        renderMain();
        status.classList.remove('is-working');
      });
    }

    function schedule() {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(recompute);
    }

    [patch, omega, floor].forEach(control => control.addEventListener('input', schedule));
    refine.addEventListener('change', schedule);
    compare.addEventListener('input', () => {
      outputs.compare.textContent = compare.value + '%';
      renderMain();
    });
    viewButtons.forEach(button => button.addEventListener('click', () => {
      selectedView = button.dataset.dcpView;
      renderMain();
    }));
    outputs.compare.textContent = compare.value + '%';
    recompute();
  }

  function initHardwareExplainer(root) {
    const buttons = root.querySelectorAll('[data-dcp-hw]');
    const stages = root.querySelectorAll('[data-dcp-stage]');
    buttons.forEach(button => button.addEventListener('click', () => {
      const selected = button.dataset.dcpHw;
      buttons.forEach(item => item.classList.toggle('is-active', item === button));
      stages.forEach(stage => stage.classList.toggle('is-active', stage.dataset.dcpStage === selected));
    }));
  }

  document.querySelectorAll('[data-dcp-hardware]').forEach(initHardwareExplainer);
  loadSource()
    .then(source => document.querySelectorAll('[data-dcp-lab]').forEach(lab => initLab(lab, source)))
    .catch(() => document.querySelectorAll('[data-dcp-status]').forEach(node => { node.textContent = 'IMAGE LOAD ERROR'; }));
}());
