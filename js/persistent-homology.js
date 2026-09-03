(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const COLORS = { ink: '#23394d', accent: '#f75357', teal: '#0cb49d', gold: '#d9a441', grid: '#dedede' };

  function ring(count, cx, cy, radius, phase) {
    const jitter = [0, 4, -3, 3, -2, 2, -1, 3, -3, 2, -2, 1, 0, -2, 3, -1, 2, -3];
    return Array.from({ length: count }, (_, i) => {
      const angle = (phase || 0) + i * Math.PI * 2 / count;
      const rr = radius + jitter[i % jitter.length];
      return { x: cx + Math.cos(angle) * rr, y: cy + Math.sin(angle) * rr };
    });
  }

  const DATASETS = {
    ring: () => ring(12, 210, 155, 96, -Math.PI / 2),
    clusters: () => [[112,126],[131,112],[151,129],[118,151],[143,158],[162,145],[126,176],[153,181],[264,122],[290,111],[309,134],[273,151],[302,159],[323,149],[281,180],[314,181]].map(pair => ({ x: pair[0], y: pair[1] })),
    double: () => ring(10, 155, 155, 55, 0).concat(ring(10, 265, 155, 55, Math.PI)),
    random: () => [[72,79],[123,56],[181,83],[247,61],[337,86],[94,137],[156,132],[226,146],[301,127],[354,160],[67,211],[142,236],[205,198],[274,231],[346,218],[183,268]].map(pair => ({ x: pair[0], y: pair[1] }))
  };

  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(key => node.setAttribute(key, attrs[key]));
    if (parent) parent.appendChild(node);
    return node;
  }

  function rankGF2(rows, columns) {
    const matrix = rows.map(row => row.slice());
    let rank = 0;
    for (let col = 0; columns > col && matrix.length > rank; col += 1) {
      let pivot = rank;
      while (matrix.length > pivot && matrix[pivot][col] === 0) pivot += 1;
      if (pivot === matrix.length) continue;
      [matrix[rank], matrix[pivot]] = [matrix[pivot], matrix[rank]];
      for (let row = 0; matrix.length > row; row += 1) {
        if (row !== rank && matrix[row][col]) {
          for (let k = col; columns > k; k += 1) matrix[row][k] ^= matrix[rank][k];
        }
      }
      rank += 1;
    }
    return rank;
  }

  function complexAt(points, r) {
    const edgeLimit = 2 * r;
    const edges = [];
    const edgeIndex = new Map();
    points.forEach((p, i) => points.forEach((q, j) => {
      if (i >= j || Math.hypot(p.x - q.x, p.y - q.y) > edgeLimit) return;
      edgeIndex.set(i + '-' + j, edges.length);
      edges.push([i, j]);
    }));
    const triangles = [];
    for (let i = 0; points.length > i; i += 1) {
      for (let j = i + 1; points.length > j; j += 1) {
        for (let k = j + 1; points.length > k; k += 1) {
          if (edgeIndex.has(i + '-' + j) && edgeIndex.has(i + '-' + k) && edgeIndex.has(j + '-' + k)) triangles.push([i, j, k]);
        }
      }
    }
    const b1Rows = Array.from({ length: points.length }, () => Array(edges.length).fill(0));
    edges.forEach(([i, j], col) => { b1Rows[i][col] = 1; b1Rows[j][col] = 1; });
    const b2Rows = Array.from({ length: edges.length }, () => Array(triangles.length).fill(0));
    triangles.forEach(([i, j, k], col) => { [[i, j], [i, k], [j, k]].forEach(([a, b]) => { b2Rows[edgeIndex.get(a + '-' + b)][col] = 1; }); });
    const rankB1 = rankGF2(b1Rows, edges.length);
    const rankB2 = rankGF2(b2Rows, triangles.length);
    return { edges, triangles, beta0: points.length - rankB1, beta1: edges.length - rankB1 - rankB2 };
  }

  function mstDeaths(points) {
    const candidates = [];
    points.forEach((p, i) => points.forEach((q, j) => { if (j > i) candidates.push({ i, j, r: Math.hypot(p.x - q.x, p.y - q.y) / 2 }); }));
    candidates.sort((a, b) => a.r - b.r);
    const parent = points.map((_, i) => i);
    const find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
    const deaths = [];
    candidates.forEach(edge => { const a = find(edge.i), b = find(edge.j); if (a !== b) { parent[a] = b; deaths.push(edge.r); } });
    return deaths.sort((a, b) => a - b);
  }

  function curveData(points) {
    const data = [];
    for (let r = 0; 112 >= r; r += 2) data.push({ r, ...complexAt(points, r) });
    return data;
  }

  function stageLabel(state) {
    if (state.beta0 > 1) return ['多分量 / components', 'components'];
    if (state.beta1 > 0) return ['成环 / loop born', 'loop'];
    return ['填充 / filled', 'filled'];
  }

  function initLab(lab) {
    const slider = lab.querySelector('[data-ph-radius]');
    const output = lab.querySelector('[data-ph-radius-output]');
    const cloud = lab.querySelector('[data-ph-cloud]');
    const barcode = lab.querySelector('[data-ph-barcode]');
    const curves = lab.querySelector('[data-ph-curves]');
    const beta0 = lab.querySelector('[data-ph-beta0]');
    const beta1 = lab.querySelector('[data-ph-beta1]');
    const stage = lab.querySelector('[data-ph-stage]');
    const presets = lab.querySelectorAll('[data-ph-preset]');
    const shapeButtons = lab.querySelectorAll('[data-ph-shape]');
    let shapeKey = 'ring';
    let points = DATASETS[shapeKey]();
    let curve = curveData(points);
    let deaths = mstDeaths(points);

    function drawCloud(r, state) {
      cloud.textContent = '';
      el('rect', { x: 0, y: 0, width: 420, height: 310, fill: '#fff' }, cloud);
      state.triangles.forEach(([i, j, k]) => el('polygon', { points: `${points[i].x},${points[i].y} ${points[j].x},${points[j].y} ${points[k].x},${points[k].y}`, fill: COLORS.gold, opacity: .13 }, cloud));
      points.forEach(p => el('circle', { cx: p.x, cy: p.y, r, fill: COLORS.teal, 'fill-opacity': .09, stroke: COLORS.teal, 'stroke-opacity': .42, 'stroke-width': 1 }, cloud));
      state.edges.forEach(([i, j]) => el('line', { x1: points[i].x, y1: points[i].y, x2: points[j].x, y2: points[j].y, stroke: COLORS.accent, 'stroke-opacity': .48, 'stroke-width': 1.25 }, cloud));
      points.forEach((p, i) => {
        el('circle', { cx: p.x, cy: p.y, r: 4.5, fill: COLORS.ink, stroke: '#fff', 'stroke-width': 2 }, cloud);
        const t = el('text', { x: p.x + 6, y: p.y - 6, fill: '#777', 'font-size': 7.5, 'font-family': 'monospace' }, cloud); t.textContent = 'x' + (i + 1);
      });
    }

    function drawBarcode(r) {
      barcode.textContent = '';
      const x = value => 48 + value / 112 * 330;
      [0, 40, 80, 112].forEach(v => {
        el('line', { x1: x(v), y1: 16, x2: x(v), y2: 148, stroke: COLORS.grid, 'stroke-width': 1 }, barcode);
        const label = el('text', { x: x(v), y: 166, fill: '#888', 'text-anchor': 'middle', 'font-size': 9, 'font-family': 'monospace' }, barcode); label.textContent = v;
      });
      const spacing = Math.min(7, 88 / Math.max(1, deaths.length));
      deaths.forEach((death, i) => el('line', { x1: x(0), y1: 27 + i * spacing, x2: x(death), y2: 27 + i * spacing, stroke: COLORS.teal, 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: .72 }, barcode));
      el('line', { x1: x(0), y1: 19, x2: x(112), y2: 19, stroke: COLORS.teal, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, barcode);
      const maxLoops = Math.max.apply(null, curve.map(d => d.beta1));
      for (let level = 1; maxLoops >= level; level += 1) {
        let start = null;
        curve.forEach((d, i) => {
          if (d.beta1 >= level && start === null) start = d.r;
          if (start !== null && (level > d.beta1 || i === curve.length - 1)) {
            const end = level > d.beta1 ? d.r : 112;
            el('line', { x1: x(start), y1: 127 + (level - 1) * 8, x2: x(end), y2: 127 + (level - 1) * 8, stroke: COLORS.accent, 'stroke-width': 5, 'stroke-linecap': 'round' }, barcode);
            start = null;
          }
        });
      }
      el('line', { x1: x(r), y1: 10, x2: x(r), y2: 148, stroke: COLORS.gold, 'stroke-width': 2, 'stroke-dasharray': '3 3' }, barcode);
      const b0 = el('text', { x: 8, y: 22, fill: COLORS.teal, 'font-size': 10, 'font-weight': 700, 'font-family': 'monospace' }, barcode); b0.textContent = 'H₀';
      const b1 = el('text', { x: 8, y: 132, fill: COLORS.accent, 'font-size': 10, 'font-weight': 700, 'font-family': 'monospace' }, barcode); b1.textContent = 'H₁';
      const axis = el('text', { x: 402, y: 166, fill: '#888', 'text-anchor': 'end', 'font-size': 9, 'font-family': 'monospace' }, barcode); axis.textContent = 'r →';
    }

    function drawCurves(r) {
      curves.textContent = '';
      const x = value => 38 + value / 112 * 345;
      const beta0Max = points.length;
      const beta1Max = Math.max(1, Math.max.apply(null, curve.map(d => d.beta1)));
      const y0 = value => 142 - value / beta0Max * 108;
      const y1 = value => 142 - value / beta1Max * 76;
      [0, Math.round(beta0Max / 2), beta0Max].forEach(v => {
        el('line', { x1: 38, y1: y0(v), x2: 383, y2: y0(v), stroke: '#e8e8e8', 'stroke-width': 1 }, curves);
        const t = el('text', { x: 30, y: y0(v) + 3, fill: '#888', 'text-anchor': 'end', 'font-size': 8, 'font-family': 'monospace' }, curves); t.textContent = v;
      });
      const path = (key, yFn) => curve.map((d, i) => `${i ? 'L' : 'M'}${x(d.r)},${yFn(d[key])}`).join(' ');
      el('path', { d: path('beta0', y0), fill: 'none', stroke: COLORS.teal, 'stroke-width': 3 }, curves);
      el('path', { d: path('beta1', y1), fill: 'none', stroke: COLORS.accent, 'stroke-width': 3 }, curves);
      el('line', { x1: x(r), y1: 18, x2: x(r), y2: 145, stroke: COLORS.gold, 'stroke-width': 2, 'stroke-dasharray': '3 3' }, curves);
      const axis = el('text', { x: 400, y: 158, fill: '#888', 'text-anchor': 'end', 'font-size': 9, 'font-family': 'monospace' }, curves); axis.textContent = 'r →';
    }

    function render() {
      const r = Number(slider.value);
      const state = complexAt(points, r);
      const label = stageLabel(state);
      output.textContent = r.toFixed(0) + ' px'; beta0.textContent = state.beta0; beta1.textContent = state.beta1; stage.textContent = label[0];
      drawCloud(r, state); drawBarcode(r); drawCurves(r);
      presets.forEach(button => button.classList.toggle('is-active', button.dataset.phPreset === label[1]));
      shapeButtons.forEach(button => button.classList.toggle('is-active', button.dataset.phShape === shapeKey));
    }

    slider.addEventListener('input', render);
    presets.forEach(button => button.addEventListener('click', () => { slider.value = button.dataset.radius; render(); }));
    shapeButtons.forEach(button => button.addEventListener('click', () => {
      shapeKey = button.dataset.phShape; points = DATASETS[shapeKey](); curve = curveData(points); deaths = mstDeaths(points); slider.value = button.dataset.radius; render();
    }));
    render();
  }

  document.querySelectorAll('[data-ph-lab]').forEach(initLab);
}());
