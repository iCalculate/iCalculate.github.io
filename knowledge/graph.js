(function () {
  'use strict';

  const canvas = document.getElementById('atlas');
  const context = canvas.getContext('2d');
  const search = document.getElementById('graph-search');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const enabledTypes = new Set(['post', 'note', 'topic']);
  const state = {
    nodes: [], links: [], selected: null, hovered: null, dragging: null,
    query: '', layout: 'domain', transform: { x: 0, y: 0, k: 1 },
    pointer: {}, alpha: 1, hierarchyWidth: 1200
  };
  let width = innerWidth;
  let height = innerHeight;
  let pixelRatio = Math.min(devicePixelRatio || 1, 2);

  const domainPalette = {
    'Semiconductor Devices': '#2f6fce',
    'Quantum & Condensed Matter': '#7962ad',
    'Electrochemistry & Energy': '#2f9b72',
    'Experimental Methods': '#df765c',
    'Scientific Computing': '#4589a6',
    'Artificial Intelligence': '#16a5a3',
    'Research Practice': '#c65f86',
    'Essays & Culture': '#b7893f'
  };
  const fallbackColor = '#82909a';

  function hash(value) {
    let result = 2166136261;
    for (let index = 0; index < value.length; index += 1) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
    return (result >>> 0) / 4294967295;
  }

  function resize() {
    width = innerWidth;
    height = innerHeight;
    pixelRatio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  function primaryDomain(node) {
    return (node.domains || [])[0] || node.inferredDomain || (node.topicType === 'domain' ? node.title : '');
  }

  function domainColor(node) { return domainPalette[primaryDomain(node)] || fallbackColor; }

  function mixWithWhite(hex, amount) {
    const value = hex.replace('#', '');
    const channels = [0, 2, 4].map(index => parseInt(value.slice(index, index + 2), 16));
    return `rgb(${channels.map(channel => Math.round(channel + (255 - channel) * amount)).join(',')})`;
  }

  function withAlpha(hex, alpha) {
    const value = hex.replace('#', '');
    return `rgba(${parseInt(value.slice(0, 2), 16)},${parseInt(value.slice(2, 4), 16)},${parseInt(value.slice(4, 6), 16)},${alpha})`;
  }

  function color(node) {
    const base = domainColor(node);
    if (node.type === 'note') return mixWithWhite(base, .08);
    if (node.type === 'topic' && node.topicType !== 'domain') return mixWithWhite(base, .38);
    return base;
  }

  function radius(node) {
    if (node.topicType === 'domain') return 9 + Math.min(node.degree, 18) * .22;
    if (node.topicType === 'hierarchy-group') return 6.8;
    if (node.topicType === 'hierarchy-tag') return 4.6;
    if (node.type === 'topic') return 3.4 + Math.min(node.frequency || node.degree, 8) * .28;
    return 5.2 + Math.min(node.degree, 12) * .32;
  }

  function visible(node) {
    if (!enabledTypes.has(node.type)) return false;
    if (node.type !== 'topic') return true;
    if (state.layout === 'hierarchy') return ['domain', 'hierarchy-group', 'hierarchy-tag'].includes(node.topicType);
    if (node.topicType === 'hierarchy-group' || node.topicType === 'hierarchy-tag') return false;
    if (state.layout === 'concept') return node.topicType === 'tag';
    return node.topicType === 'domain' || (node.topicType === 'tag' && (node.frequency || 0) > 1);
  }

  function visibleLink(link) {
    if (!visible(link.source) || !visible(link.target)) return false;
    if (state.layout === 'hierarchy') return link.kind === 'hierarchy';
    if (link.kind === 'hierarchy') return false;
    if (state.layout === 'concept') return link.kind === 'tag' || link.kind === 'reference';
    return true;
  }

  function matches(node) {
    if (!state.query) return true;
    return [node.title, node.excerpt, ...(node.domains || []), ...(node.tags || []), ...(node.categories || [])]
      .join(' ').toLowerCase().includes(state.query);
  }

  function screen(node) {
    return { x: node.x * state.transform.k + state.transform.x, y: node.y * state.transform.k + state.transform.y };
  }

  function graphCenter() {
    return { x: width <= 850 ? width * .52 : 335 + (width - 335 - 320) / 2, y: height * .53 };
  }

  function hierarchyCenter() {
    return { x: width <= 850 ? width * .52 : 335 + (width - 335) / 2, y: height * .53 };
  }

  function layoutDomains() {
    const center = graphCenter();
    const domains = state.nodes.filter(node => node.topicType === 'domain');
    const ringX = Math.max(145, Math.min(285, (width - (width <= 850 ? 90 : 690)) * .42));
    const ringY = Math.max(165, Math.min(260, height * .33));
    domains.forEach((node, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / Math.max(1, domains.length);
      node.anchorX = center.x + Math.cos(angle) * ringX;
      node.anchorY = center.y + Math.sin(angle) * ringY;
    });
    const domainByName = new Map(domains.map(node => [node.title, node]));
    state.nodes.filter(node => node.type !== 'topic').forEach(node => {
      const domain = domainByName.get(primaryDomain(node));
      if (!domain) return;
      const angle = hash(`${node.id}:domain-angle`) * Math.PI * 2;
      const distance = 42 + hash(`${node.id}:domain-radius`) * 115;
      node.anchorX = domain.anchorX;
      node.anchorY = domain.anchorY;
      node.x = domain.anchorX + Math.cos(angle) * distance;
      node.y = domain.anchorY + Math.sin(angle) * distance;
    });
    state.nodes.filter(node => node.topicType === 'tag').forEach(node => {
      const related = state.links.filter(link => link.kind === 'tag' && (link.source === node || link.target === node))
        .map(link => link.source === node ? link.target : link.source).filter(item => item.type !== 'topic');
      const relatedDomains = related.map(primaryDomain).map(name => domainByName.get(name)).filter(Boolean);
      const baseX = relatedDomains.length ? relatedDomains.reduce((sum, item) => sum + item.anchorX, 0) / relatedDomains.length : center.x;
      const baseY = relatedDomains.length ? relatedDomains.reduce((sum, item) => sum + item.anchorY, 0) / relatedDomains.length : center.y;
      const angle = hash(`${node.id}:tag`) * Math.PI * 2;
      node.anchorX = baseX;
      node.anchorY = baseY;
      node.x = baseX + Math.cos(angle) * 65;
      node.y = baseY + Math.sin(angle) * 65;
    });
    domains.forEach(node => { node.x = node.anchorX; node.y = node.anchorY; });
  }

  function layoutConcepts() {
    const center = graphCenter();
    const tags = state.nodes.filter(node => node.topicType === 'tag')
      .sort((a, b) => (b.frequency || 0) - (a.frequency || 0) || a.title.localeCompare(b.title));
    tags.forEach((node, index) => {
      const angle = index * 2.399963229728653;
      const distance = 42 + Math.sqrt(index) * 58;
      node.anchorX = center.x + Math.cos(angle) * distance;
      node.anchorY = center.y + Math.sin(angle) * distance * .72;
      node.x = node.anchorX;
      node.y = node.anchorY;
    });
    const tagByName = new Map(tags.map(node => [node.title, node]));
    state.nodes.filter(node => node.type !== 'topic').forEach(node => {
      const tag = (node.tags || []).map(name => tagByName.get(name)).find(Boolean);
      const baseX = tag ? tag.anchorX : center.x;
      const baseY = tag ? tag.anchorY : center.y;
      const angle = hash(`${node.id}:concept`) * Math.PI * 2;
      const distance = 30 + hash(`${node.id}:concept-radius`) * 52;
      node.anchorX = baseX;
      node.anchorY = baseY;
      node.x = baseX + Math.cos(angle) * distance;
      node.y = baseY + Math.sin(angle) * distance;
    });
  }

  function layoutHierarchy() {
    const domains = state.nodes.filter(node => node.topicType === 'domain');
    const links = state.links.filter(link => link.kind === 'hierarchy');
    const center = hierarchyCenter();
    const children = new Map();
    links.forEach(link => {
      if (!children.has(link.source.id)) children.set(link.source.id, []);
      children.get(link.source.id).push(link.target);
    });
    const sector = Math.PI * 2 / Math.max(1, domains.length);
    domains.forEach((domain, domainIndex) => {
      const middleAngle = -Math.PI / 2 + domainIndex * sector;
      const wedge = sector * .8;
      const groups = (children.get(domain.id) || []).filter(node => node.topicType === 'hierarchy-group');
      const direct = (children.get(domain.id) || []).filter(node => node.type !== 'topic');
      const domainRadius = 108 + (hash(`${domain.id}:radial-depth`) - .5) * 12;
      domain.anchorX = center.x + Math.cos(middleAngle) * domainRadius;
      domain.anchorY = center.y + Math.sin(middleAngle) * domainRadius;
      groups.forEach((group, groupIndex) => {
        const groupSlot = wedge / Math.max(1, groups.length);
        const groupAngle = middleAngle + ((groupIndex + .5) / Math.max(1, groups.length) - .5) * wedge + (hash(`${group.id}:angular-drift`) - .5) * groupSlot * .42;
        const groupSpan = wedge / Math.max(1, groups.length) * .82;
        const tags = (children.get(group.id) || []).filter(node => node.topicType === 'hierarchy-tag');
        const groupRadius = 168 + hash(`${group.id}:radial-depth`) * 76;
        group.anchorX = center.x + Math.cos(groupAngle) * groupRadius;
        group.anchorY = center.y + Math.sin(groupAngle) * groupRadius;
        tags.forEach((tag, tagIndex) => {
          const tagAngle = groupAngle + (hash(`${tag.id}:angular-drift`) - .5) * groupSpan * .94;
          const tagSpan = groupSpan / Math.max(1, tags.length) * .78;
          const content = (children.get(tag.id) || []).filter(node => node.type !== 'topic');
          const tagRadius = 258 + hash(`${tag.id}:radial-depth`) * 102;
          tag.anchorX = center.x + Math.cos(tagAngle) * tagRadius;
          tag.anchorY = center.y + Math.sin(tagAngle) * tagRadius;
          content.forEach((node, contentIndex) => {
            const contentAngle = tagAngle + (hash(`${node.id}:angular-drift`) - .5) * Math.max(tagSpan, .035) * 1.25;
            const contentRadius = 382 + hash(`${node.id}:radial-depth`) * 142;
            node.anchorX = center.x + Math.cos(contentAngle) * contentRadius;
            node.anchorY = center.y + Math.sin(contentAngle) * contentRadius;
          });
        });
      });
      direct.forEach((node, index) => {
        const angle = middleAngle + ((index + .5) / Math.max(1, direct.length) - .5) * wedge;
        const contentRadius = 420 + hash(`${node.id}:radial-depth`) * 74;
        node.anchorX = center.x + Math.cos(angle) * contentRadius;
        node.anchorY = center.y + Math.sin(angle) * contentRadius;
      });
    });
    state.nodes.filter(visible).forEach(node => { node.x = node.anchorX; node.y = node.anchorY; node.vx = 0; node.vy = 0; });
  }

  function applyLayout(mode) {
    state.layout = mode;
    state.selected = null;
    state.hovered = null;
    document.getElementById('inspector').hidden = true;
    document.querySelectorAll('[data-layout]').forEach(button => button.classList.toggle('active', button.dataset.layout === mode));
    if (mode === 'concept') layoutConcepts();
    else if (mode === 'hierarchy') layoutHierarchy();
    else layoutDomains();
    state.nodes.forEach(node => { node.vx = 0; node.vy = 0; });
    if (mode === 'hierarchy' && !reducedMotion) {
      state.nodes.filter(visible).forEach(node => {
        const spread = node.type === 'topic' ? 30 : 52;
        node.x += (hash(`${node.id}:hierarchy-enter-x`) - .5) * spread;
        node.y += (hash(`${node.id}:hierarchy-enter-y`) - .5) * spread;
      });
    }
    state.alpha = reducedMotion ? .06 : 1;
    resetView(false);
    updateVisibleCount();
  }

  function initialize(data) {
    const center = graphCenter();
    state.nodes = data.nodes.map((node, index) => ({
      ...node, index, x: center.x + (hash(node.id) - .5) * 240,
      y: center.y + (hash(`${node.id}:y`) - .5) * 240, vx: 0, vy: 0
    }));
    const byId = new Map(state.nodes.map(node => [node.id, node]));
    state.links = data.links.map(link => ({ ...link, source: byId.get(link.source), target: byId.get(link.target) }))
      .filter(link => link.source && link.target);
    state.nodes.filter(node => node.topicType === 'tag').forEach(node => {
      const frequency = new Map();
      state.links.filter(link => link.kind === 'tag' && (link.source === node || link.target === node)).forEach(link => {
        const content = link.source === node ? link.target : link.source;
        const domain = primaryDomain(content);
        if (domain) frequency.set(domain, (frequency.get(domain) || 0) + 1);
      });
      node.inferredDomain = Array.from(frequency.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || '';
    });
    applyLayout('domain');
    setTimeout(() => document.getElementById('loading-state').classList.add('done'), 350);
  }

  function simulate() {
    if (state.alpha < .004 || state.dragging) return;
    state.alpha *= state.layout === 'hierarchy' ? .995 : .992;
    const nodes = state.nodes.filter(visible);
    const center = graphCenter();
    nodes.forEach(node => {
      const hierarchyStrength = node.topicType === 'domain' ? .007 : node.topicType === 'hierarchy-group' ? .0032 : node.topicType === 'hierarchy-tag' ? .0022 : .0012;
      const strength = state.layout === 'hierarchy' ? hierarchyStrength : node.topicType === 'domain' ? .012 : node.type === 'topic' ? .0032 : .0016;
      node.vx += ((node.anchorX || center.x) - node.x) * strength * state.alpha;
      node.vy += ((node.anchorY || center.y) - node.y) * strength * state.alpha;
    });
    state.links.filter(visibleLink).forEach(link => {
        const dx = link.target.x - link.source.x;
        const dy = link.target.y - link.source.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        if (state.layout === 'hierarchy') {
          const desired = link.level === 1 ? 104 : link.level === 2 ? 118 : 142;
          const force = (distance - desired) * .00016 * state.alpha;
          link.source.vx += dx * force;
          link.source.vy += dy * force;
          link.target.vx -= dx * force;
          link.target.vy -= dy * force;
          return;
        }
        const primary = state.layout === 'concept' && link.kind === 'tag' && (link.source.tags || [])[0] === link.target.title;
        const desired = link.kind === 'reference' ? 145 : link.kind === 'domain' ? 82 : primary ? 62 : 120;
        const strength = primary ? .00068 : link.kind === 'domain' ? .00055 : .00028;
        const force = (distance - desired) * strength * state.alpha;
        link.source.vx += dx * force;
        link.source.vy += dy * force;
        link.target.vx -= dx * force;
        link.target.vy -= dy * force;
    });
    for (let first = 0; first < nodes.length; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        const a = nodes[first];
        const b = nodes[second];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let squared = dx * dx + dy * dy;
        const basePadding = a.type === 'topic' && b.type === 'topic' ? 8 : 13;
        const hierarchyPadding = a.type === 'post' || a.type === 'note' || b.type === 'post' || b.type === 'note' ? 20 : 14;
        const minimum = radius(a) + radius(b) + (state.layout === 'hierarchy' ? hierarchyPadding : basePadding);
        if (squared >= minimum * minimum) continue;
        if (squared < .01) {
          const angle = hash(`${a.id}|${b.id}`) * Math.PI * 2;
          dx = Math.cos(angle) * .1;
          dy = Math.sin(angle) * .1;
          squared = .01;
        }
        const distance = Math.sqrt(squared);
        const push = ((minimum - distance) / distance) * (state.layout === 'hierarchy' ? .052 : .045) * state.alpha;
        a.vx -= dx * push;
        a.vy -= dy * push;
        b.vx += dx * push;
        b.vy += dy * push;
      }
    }
    nodes.forEach(node => {
      if (node === state.dragging) return;
      const damping = state.layout === 'hierarchy' ? .92 : .86;
      const velocityLimit = state.layout === 'hierarchy' ? 4.8 : 6;
      node.vx = Math.max(-velocityLimit, Math.min(velocityLimit, node.vx * damping));
      node.vy = Math.max(-velocityLimit, Math.min(velocityLimit, node.vy * damping));
      node.x += node.vx;
      node.y += node.vy;
    });
  }

  function connected(node) {
    const result = new Set(node ? [node.id] : []);
    if (!node) return result;
    state.links.filter(visibleLink).forEach(link => {
      if (link.source === node) result.add(link.target.id);
      if (link.target === node) result.add(link.source.id);
    });
    return result;
  }

  function drawHierarchyArrow(source, target, edgeColor, highlighted) {
    const angle = Math.atan2(target.y - source.y, target.x - source.x);
    const endX = target.x - Math.cos(angle) * 8;
    const endY = target.y - Math.sin(angle) * 8;
    context.beginPath();
    context.moveTo(source.x, source.y);
    context.lineTo(endX, endY);
    context.strokeStyle = withAlpha(edgeColor, highlighted ? .62 : .18);
    context.lineWidth = highlighted ? 1.4 : .75;
    context.stroke();
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(endX - Math.cos(angle - .5) * 6, endY - Math.sin(angle - .5) * 6);
    context.lineTo(endX - Math.cos(angle + .5) * 6, endY - Math.sin(angle + .5) * 6);
    context.closePath();
    context.fillStyle = withAlpha(edgeColor, highlighted ? .72 : .28);
    context.fill();
  }

  function shouldLabel(node, active, faded) {
    if (faded) return false;
    if (active || (matches(node) && state.query)) return true;
    if (node.topicType === 'domain') return true;
    if (state.layout === 'hierarchy' && node.topicType === 'hierarchy-group') return state.transform.k >= 1;
    if (state.layout === 'hierarchy' && node.topicType === 'hierarchy-tag') return state.transform.k >= 1.55;
    if (node.type === 'note') return state.transform.k >= 1.55;
    if (node.type === 'post') return state.transform.k >= 2.65;
    return node.topicType === 'tag' && state.transform.k >= 2.15;
  }

  function draw() {
    requestAnimationFrame(draw);
    simulate();
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    const focus = state.selected || state.hovered;
    const neighborhood = connected(focus);
    context.save();
    context.strokeStyle = 'rgba(0,0,0,.035)';
    context.lineWidth = 1;
    const grid = 64 * state.transform.k;
    if (grid > 20) {
      for (let x = state.transform.x % grid; x < width; x += grid) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
      for (let y = state.transform.y % grid; y < height; y += grid) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
    }
    context.restore();
    if (state.layout === 'hierarchy') {
      const center = hierarchyCenter();
      const point = screen(center);
      context.save();
      context.setLineDash([2, 7]);
      context.strokeStyle = 'rgba(70,82,88,.045)';
      context.lineWidth = 1;
      [112, 205, 310, 452].forEach(ring => {
        context.beginPath();
        context.arc(point.x, point.y, ring * state.transform.k, 0, Math.PI * 2);
        context.stroke();
      });
      context.restore();
    }
    state.links.filter(visibleLink).forEach(link => {
      const source = screen(link.source);
      const target = screen(link.target);
      const highlighted = focus && neighborhood.has(link.source.id) && neighborhood.has(link.target.id);
      const queryMatch = matches(link.source) && matches(link.target);
      const edgeNode = link.source.type === 'topic' ? link.source : link.target.type === 'topic' ? link.target : link.source;
      const edgeColor = domainColor(edgeNode);
      if (link.kind === 'hierarchy') { drawHierarchyArrow(source, target, edgeColor, highlighted); return; }
      context.beginPath();
      context.moveTo(source.x, source.y);
      context.lineTo(target.x, target.y);
      context.strokeStyle = withAlpha(edgeColor, highlighted ? .58 : state.query && !queryMatch ? .025 : .115);
      context.lineWidth = highlighted ? 1.4 : .65;
      context.stroke();
    });
    state.nodes.forEach(node => {
      if (!visible(node)) return;
      const point = screen(node);
      const size = radius(node) * Math.sqrt(state.transform.k);
      const active = node === state.selected || node === state.hovered;
      const related = neighborhood.has(node.id);
      const faded = Boolean((state.query && !matches(node)) || (focus && !related));
      const base = domainColor(node);
      const stroke = faded ? mixWithWhite(base, .72) : color(node);
      const fill = node.type === 'topic' ? '#fff' : faded ? mixWithWhite(base, .82) : color(node);
      context.save();
      context.translate(point.x, point.y);
      if (active) {
        context.beginPath();
        context.arc(0, 0, size + 8, 0, Math.PI * 2);
        context.strokeStyle = withAlpha(base, .32);
        context.stroke();
      }
      context.beginPath();
      if (node.type === 'note') { context.rotate(Math.PI / 4); context.rect(-size, -size, size * 2, size * 2); }
      else context.arc(0, 0, size, 0, Math.PI * 2);
      context.fillStyle = fill;
      context.fill();
      context.strokeStyle = stroke;
      context.lineWidth = node.topicType === 'domain' ? 2 : node.type === 'topic' ? 1 : .75;
      context.stroke();
      context.restore();
      if (shouldLabel(node, active, faded)) {
        context.fillStyle = domainColor(node);
        context.font = `${node.topicType === 'domain' && state.layout === 'hierarchy' ? 10 : active || node.topicType === 'domain' ? 12 : 10}px AtlasText, Georgia`;
        let labelX = point.x;
        let labelY = point.y - size - 10;
        context.textAlign = 'center';
        if (state.layout === 'hierarchy' && node.topicType === 'domain') {
          const centerPoint = screen(hierarchyCenter());
          const angle = Math.atan2(point.y - centerPoint.y, point.x - centerPoint.x);
          const cosine = Math.cos(angle);
          labelX = point.x + cosine * (size + 10);
          labelY = point.y + Math.sin(angle) * (size + 10) + 3;
          context.textAlign = cosine > .3 ? 'left' : cosine < -.3 ? 'right' : 'center';
        }
        const label = node.title.length > 42 ? `${node.title.slice(0, 40)}…` : node.title;
        context.fillText(label, labelX, labelY);
      }
    });
  }

  function hitTest(x, y) {
    for (let index = state.nodes.length - 1; index >= 0; index -= 1) {
      const node = state.nodes[index];
      if (!visible(node)) continue;
      const point = screen(node);
      const dx = point.x - x;
      const dy = point.y - y;
      if (dx * dx + dy * dy < Math.pow(Math.max(10, radius(node) * state.transform.k + 5), 2)) return node;
    }
    return null;
  }

  function escapeMarkup(value) {
    const span = document.createElement('span');
    span.textContent = value;
    return span.innerHTML;
  }

  function updateInspector(node) {
    state.selected = node;
    const inspector = document.getElementById('inspector');
    inspector.hidden = !node;
    document.documentElement.style.setProperty('--active-domain', node ? domainColor(node) : '#f75357');
    if (!node) return;
    document.getElementById('inspector-type').textContent = node.type === 'post' ? 'Archived article' : node.type === 'note' ? 'Knowledge note' : node.topicType || 'Topic';
    document.getElementById('inspector-title').textContent = node.title;
    document.getElementById('inspector-date').textContent = node.date || `${node.degree} connections`;
    document.getElementById('inspector-excerpt').textContent = node.excerpt || 'A connecting point in the atlas.';
    const tags = [...(node.domains || []), ...(node.tags || [])];
    document.getElementById('inspector-tags').innerHTML = tags.map(tag => `<span>${escapeMarkup(tag)}</span>`).join('');
    const neighbors = [];
    state.links.filter(visibleLink).forEach(link => {
      if (link.source === node) neighbors.push(link.target);
      else if (link.target === node) neighbors.push(link.source);
    });
    document.getElementById('inspector-links').innerHTML = neighbors.slice(0, 12)
      .map(neighbor => `<button type="button" data-id="${escapeMarkup(neighbor.id)}">${escapeMarkup(neighbor.title)}</button>`).join('') || '<small>No direct links yet</small>';
    const open = document.getElementById('open-node');
    open.hidden = !node.url;
    open.href = node.url || '#';
  }

  function updateVisibleCount() {
    ['post', 'note', 'topic'].forEach(type => {
      document.getElementById(`${type}-count`).textContent = state.nodes.filter(node => node.type === type && visible(node)).length;
    });
    const nodes = state.nodes.filter(node => visible(node) && matches(node)).length;
    const links = state.links.filter(visibleLink).length;
    document.getElementById('visible-count').textContent = `${nodes} visible points · ${links} connections · ${state.layout} layout`;
  }

  function resetView(clearSelection = true) {
    if (state.layout === 'hierarchy') {
      const center = hierarchyCenter();
      const availableWidth = width <= 850 ? width - 34 : width - 335 - 44;
      const availableHeight = height - (width <= 850 ? 92 : 118);
      const scale = Math.max(.42, Math.min(.88, Math.min(availableWidth, availableHeight) / 950));
      state.transform = { x: center.x * (1 - scale), y: center.y * (1 - scale) + 16, k: scale };
    } else if (state.layout === 'concept') {
      const center = graphCenter();
      const scale = .82;
      state.transform = { x: center.x * (1 - scale), y: center.y * (1 - scale), k: scale };
    } else state.transform = { x: 0, y: 0, k: 1 };
    if (clearSelection) updateInspector(null);
  }

  function reheat() {
    state.alpha = 1;
    const seed = Date.now();
    state.nodes.filter(visible).forEach(node => {
      const impulse = state.layout === 'hierarchy' ? 5.5 : 4;
      node.vx += (hash(`${node.id}:${seed}`) - .5) * impulse;
      node.vy += (hash(`${seed}:${node.id}`) - .5) * impulse;
    });
  }

  canvas.addEventListener('pointerdown', event => {
    canvas.setPointerCapture(event.pointerId);
    const node = hitTest(event.clientX, event.clientY);
    state.pointer = { originX: event.clientX, originY: event.clientY, tx: state.transform.x, ty: state.transform.y };
    state.dragging = node || 'pan';
  });
  canvas.addEventListener('pointermove', event => {
    document.getElementById('coordinates').textContent = `X ${String(Math.round(event.clientX)).padStart(3, '0')} · Y ${String(Math.round(event.clientY)).padStart(3, '0')}`;
    if (state.dragging && state.dragging !== 'pan') {
      const node = state.dragging;
      node.x = (event.clientX - state.transform.x) / state.transform.k;
      node.y = (event.clientY - state.transform.y) / state.transform.k;
      node.anchorX = node.x;
      node.anchorY = node.y;
      node.vx = node.vy = 0;
      state.alpha = Math.max(state.alpha, .2);
    } else if (state.dragging === 'pan') {
      state.transform.x = state.pointer.tx + event.clientX - state.pointer.originX;
      state.transform.y = state.pointer.ty + event.clientY - state.pointer.originY;
    } else {
      state.hovered = hitTest(event.clientX, event.clientY);
      canvas.style.cursor = state.hovered ? 'pointer' : 'crosshair';
    }
  });
  canvas.addEventListener('pointerup', event => {
    const moved = Math.hypot(event.clientX - state.pointer.originX, event.clientY - state.pointer.originY);
    const node = state.dragging !== 'pan' ? state.dragging : null;
    state.dragging = null;
    if (node && moved < 5) updateInspector(node);
  });
  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    const old = state.transform.k;
    const next = Math.max(.2, Math.min(7, old * Math.exp(-event.deltaY * .001)));
    state.transform.x = event.clientX - (event.clientX - state.transform.x) * (next / old);
    state.transform.y = event.clientY - (event.clientY - state.transform.y) * (next / old);
    state.transform.k = next;
  }, { passive: false });
  canvas.addEventListener('dblclick', event => {
    const node = hitTest(event.clientX, event.clientY);
    if (node && node.url) location.href = node.url;
  });

  search.addEventListener('input', () => { state.query = search.value.trim().toLowerCase(); updateVisibleCount(); });
  document.querySelectorAll('.filters input').forEach(input => input.addEventListener('change', () => {
    input.checked ? enabledTypes.add(input.value) : enabledTypes.delete(input.value);
    state.alpha = .35;
    updateInspector(null);
    updateVisibleCount();
  }));
  document.querySelectorAll('[data-layout]').forEach(button => button.addEventListener('click', () => applyLayout(button.dataset.layout)));
  document.getElementById('reset-view').addEventListener('click', () => resetView());
  document.getElementById('reheat-graph').addEventListener('click', reheat);
  document.getElementById('inspector-close').addEventListener('click', () => updateInspector(null));
  document.getElementById('inspector-links').addEventListener('click', event => {
    const button = event.target.closest('[data-id]');
    if (button) updateInspector(state.nodes.find(node => node.id === button.dataset.id));
  });
  document.getElementById('panel-toggle').addEventListener('click', () => document.querySelector('.atlas-panel').classList.toggle('open'));
  addEventListener('keydown', event => {
    if (event.key === '/' && document.activeElement !== search) { event.preventDefault(); search.focus(); }
    if (event.key === 'Escape') { search.value = ''; state.query = ''; search.blur(); updateInspector(null); updateVisibleCount(); }
  });
  addEventListener('resize', () => { resize(); applyLayout(state.layout); });

  resize();
  draw();
  fetch('graph-data.json')
    .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(initialize)
    .catch(error => { document.getElementById('loading-state').innerHTML = `<span>The atlas could not be loaded · ${escapeMarkup(error.message)}</span>`; });
}());
