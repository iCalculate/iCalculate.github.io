(() => {
  "use strict";

  const all = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const isChinese = root => /[\u3400-\u9fff]/.test(root.textContent);
  const palette = { night: "#071b21", grid: "rgba(190,224,218,.13)", cyan: "#20b9b2", coral: "#ef755c", acid: "#c5df6f", gold: "#e9bd53", blue: "#6a9dff", violet: "#cf79e8" };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupCanvas(canvas) {
    const context = canvas.getContext("2d");
    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.max(280, Math.round(rect.width));
      const height = Math.max(260, Math.round(rect.height));
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      return { width, height };
    };
    return { context, fit };
  }

  function pointerAt(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  class Instrument {
    constructor(root, runtime) {
      this.root = root;
      this.runtime = runtime;
      this.kind = root.dataset.lmSim;
      this.canvas = root.querySelector("[data-lm-canvas]");
      this.status = root.querySelector("[data-lm-status]");
      this.state = root.querySelector("[data-lm-state]");
      this.pointer = { x: 0, y: 0, down: false, inside: false };
      const surface = setupCanvas(this.canvas);
      this.context = surface.context;
      this.fit = surface.fit;
      this.size = this.fit();
      this.model = factories[this.kind](this);
      this.bind();
      this.model.draw();
    }
    bind() {
      const move = event => {
        this.pointer = { ...pointerAt(event, this.canvas), down: this.pointer.down, inside: true };
        this.runtime.prefer(this);
        if (this.model.pointer) this.model.pointer("move", this.pointer);
        if (reduced) this.model.draw();
      };
      this.canvas.addEventListener("pointermove", move);
      this.canvas.addEventListener("pointerdown", event => {
        this.canvas.setPointerCapture(event.pointerId);
        this.pointer = { ...pointerAt(event, this.canvas), down: true, inside: true };
        this.runtime.prefer(this);
        if (this.model.pointer) this.model.pointer("down", this.pointer);
      });
      this.canvas.addEventListener("pointerup", event => {
        this.pointer.down = false;
        if (this.model.pointer) this.model.pointer("up", this.pointer);
        try { this.canvas.releasePointerCapture(event.pointerId); } catch (error) { /* capture may already be released */ }
      });
      this.canvas.addEventListener("pointerleave", () => { this.pointer.inside = false; });
      all("button[data-action], button[data-charge]", this.root).forEach(button => {
        button.addEventListener("click", () => {
          this.runtime.prefer(this);
          if (button.dataset.charge) this.model.action("charge", Number(button.dataset.charge));
          else this.model.action(button.dataset.action, button);
          if (button.dataset.action === "grow" || button.dataset.action === "contract" || button.dataset.action === "cut" || button.dataset.action === "food" || button.dataset.action === "barrier" || button.dataset.charge) {
            all("button", button.parentElement).forEach(item => item.classList.toggle("is-active", item === button));
          }
          this.model.draw();
        });
      });
      all("input", this.root).forEach(input => input.addEventListener("input", () => {
        this.runtime.prefer(this);
        this.model.action(input.dataset.density ? "density" : "affinity", Number(input.value));
      }));
      new ResizeObserver(() => {
        const old = this.size;
        this.size = this.fit();
        if (this.model.resize) this.model.resize(old, this.size);
        this.model.draw();
      }).observe(this.canvas);
    }
    setActive(active) {
      this.root.classList.toggle("is-active", active);
      this.state.textContent = active ? (isChinese(this.root) ? "运行中" : "live") : (isChinese(this.root) ? "已暂停" : "paused");
    }
    frame(time) { this.model.update(time); this.model.draw(); }
  }

  const factories = {
    ants(lab) {
      const ants = [];
      const trails = [];
      const barriers = [];
      let mode = "food";
      let food = { x: lab.size.width * .82, y: lab.size.height * .28 };
      const nest = () => ({ x: lab.size.width * .16, y: lab.size.height * .72 });
      const reset = () => {
        ants.length = 0; trails.length = 0; barriers.length = 0;
        const count = lab.size.width > 520 ? 58 : 34;
        for (let i = count; i--;) ants.push({ ...nest(), a: Math.random() * 6.28, home: false, phase: Math.random() * 10 });
      };
      reset();
      return {
        update() {
          const home = nest();
          ants.forEach((ant, index) => {
            const target = ant.home ? home : food;
            const wanted = Math.atan2(target.y - ant.y, target.x - ant.x);
            ant.a += Math.sin(wanted - ant.a) * .035 + (Math.random() - .5) * .2;
            barriers.forEach(barrier => {
              if (Math.hypot(ant.x - barrier.x, ant.y - barrier.y) > 26) return;
              ant.a = Math.atan2(ant.y - barrier.y, ant.x - barrier.x) + (Math.random() - .5);
            });
            ant.x += Math.cos(ant.a) * 1.25; ant.y += Math.sin(ant.a) * 1.25;
            if (distance(ant, target) > 13) { /* continue */ } else ant.home = !ant.home;
            if (ant.x > lab.size.width || 0 > ant.x || ant.y > lab.size.height || 0 > ant.y) { ant.x = clamp(ant.x, 2, lab.size.width - 2); ant.y = clamp(ant.y, 2, lab.size.height - 2); ant.a += 3.14; }
            if (index % 3 === 0 && Math.random() > .82) trails.push({ x: ant.x, y: ant.y, life: 1, home: ant.home });
          });
          trails.forEach(point => { point.life -= .006; });
          while (trails.length > 900 || (trails[0] && 0 > trails[0].life)) trails.shift();
        },
        draw() {
          const { context: c, size: s } = lab; c.fillStyle = palette.night; c.fillRect(0,0,s.width,s.height);
          c.lineWidth = 2; trails.forEach(point => { c.fillStyle = point.home ? `rgba(32,185,178,${point.life * .17})` : `rgba(233,189,83,${point.life * .2})`; c.fillRect(point.x,point.y,2,2); });
          barriers.forEach(b => { c.fillStyle = "rgba(236,241,231,.22)"; c.beginPath(); c.arc(b.x,b.y,10,0,6.29); c.fill(); });
          const home = nest(); c.strokeStyle = palette.cyan; c.lineWidth = 2; c.beginPath(); c.arc(home.x,home.y,18,0,6.29); c.stroke();
          c.fillStyle = palette.gold; c.beginPath(); c.arc(food.x,food.y,12,0,6.29); c.fill();
          ants.forEach(ant => { c.save(); c.translate(ant.x,ant.y); c.rotate(ant.a); c.fillStyle = ant.home ? palette.gold : "#dce7df"; c.fillRect(-4,-1.5,8,3); c.beginPath(); c.arc(3.5,0,2.3,0,6.29); c.fill(); c.restore(); });
        },
        pointer(type, point) { if (type === "down" || (type === "move" && point.down)) { if (mode === "food") food = { x: point.x, y: point.y }; else if (!barriers.some(b => 16 > distance(b,point))) barriers.push({ x: point.x, y: point.y }); } },
        action(name) { if (name === "reset") reset(); else mode = name; lab.status.textContent = mode === "food" ? (isChinese(lab.root) ? "点击场地移动食物" : "click the field to relocate food") : (isChinese(lab.root) ? "拖动以绘制障碍" : "drag to paint a barrier"); }
      };
    },

    jamming(lab) {
      const particles = []; let density = 72; let probe = { x: lab.size.width*.58, y: lab.size.height*.5 }; let dragging = false;
      const seed = () => { particles.length = 0; for (let i = 86; i--;) particles.push({ u: Math.random(), v: Math.random(), r: 5 + Math.random()*5, phase: Math.random()*6 }); };
      seed();
      return {
        update(time) { const jam = clamp((density-68)/18,0,1); particles.forEach(p => { p.phase += .025; p.dx = Math.sin(time*.001+p.phase)*(1-jam)*2; p.dy = Math.cos(time*.0013+p.phase)*(1-jam)*2; }); },
        draw() {
          const { context:c,size:s }=lab; c.fillStyle=palette.night;c.fillRect(0,0,s.width,s.height); const right=s.width*(1.04-density*.0062); const jam=clamp((density-68)/18,0,1);
          c.fillStyle="rgba(239,117,92,.16)";c.fillRect(right,0,s.width-right,s.height);c.strokeStyle=palette.coral;c.lineWidth=3;c.beginPath();c.moveTo(right,0);c.lineTo(right,s.height);c.stroke();
          particles.forEach((p,index)=>{ const x=18+p.u*(right-36)+(p.dx||0), y=18+p.v*(s.height-36)+(p.dy||0); p.x=x;p.y=y; c.fillStyle=`hsl(${170+index%30} 38% ${54+p.r}%)`;c.beginPath();c.arc(x,y,p.r*(1+jam*.28),0,6.29);c.fill(); if(jam>.45 && index%4===0){const q=particles[(index+7)%particles.length];if(q.x){c.strokeStyle=`rgba(239,117,92,${jam*.32})`;c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(q.x,q.y);c.stroke();}}});
          c.fillStyle=palette.coral;c.beginPath();c.arc(probe.x,probe.y,12,0,6.29);c.fill();c.strokeStyle="#fff";c.stroke();
        },
        pointer(type,p){ if(type==="down" && 28>distance(p,probe)) dragging=true; if(type==="up") dragging=false; if(dragging){probe={x:clamp(p.x,14,lab.size.width-14),y:clamp(p.y,14,lab.size.height-14)};} },
        action(name,value){ if(name!=="density")return;density=value;lab.root.querySelector("[data-density-out]").textContent=value+"%";const jam=value>78;lab.status.textContent=jam?(isChinese(lab.root)?"已拥塞 · 力链锁定运动":"jammed · force chains lock motion"):(isChinese(lab.root)?"类流体 · 拖动珊瑚色探针":"fluid-like · drag the coral probe"); }
      };
    },

    defect(lab) {
      let core={x:lab.size.width*.55,y:lab.size.height*.5},charge=.5,activity=0,drag=false;
      return {
        update(){activity*=.985;},
        draw(){const {context:c,size:s}=lab;c.fillStyle=palette.night;c.fillRect(0,0,s.width,s.height);c.lineWidth=1.5;for(let y=18;s.height>y;y+=18)for(let x=18;s.width>x;x+=18){const a=charge*Math.atan2(y-core.y,x-core.x)+activity*Math.sin(x*.03+y*.02);c.strokeStyle=`rgba(116,220,210,${.28+Math.abs(Math.cos(a))*.45})`;c.beginPath();c.moveTo(x-Math.cos(a)*7,y-Math.sin(a)*7);c.lineTo(x+Math.cos(a)*7,y+Math.sin(a)*7);c.stroke();}c.fillStyle=palette.coral;c.beginPath();c.arc(core.x,core.y,8+activity*5,0,6.29);c.fill();},
        pointer(type,p){if(type==="down"&&40>distance(p,core))drag=true;if(type==="up")drag=false;if(drag)core={x:p.x,y:p.y};},
        action(name,value){if(name==="charge"){charge=value;lab.status.textContent=(isChinese(lab.root)?"拓扑荷 ":"charge ")+(value>0?"+½":"−½");}if(name==="stir")activity=1.3;}
      };
    },

    morph(lab) {
      const cols=19,rows=13,growth=new Float32Array(cols*rows);let mode="grow";
      const edit=p=>{const gx=Math.round(p.x/lab.size.width*(cols-1)),gy=Math.round(p.y/lab.size.height*(rows-1));for(let y=-2;y!==3;y++)for(let x=-2;x!==3;x++){const ix=gx+x,iy=gy+y;if(ix>=0&&iy>=0&&cols>ix&&rows>iy){const d=Math.hypot(x,y);growth[iy*cols+ix]=clamp(growth[iy*cols+ix]+(mode==="grow"?1:-1)*Math.max(0,1-d/3)*.22,-1,1);}}};
      return {update(){for(let i=growth.length;i--;)growth[i]*=.9995;},draw(){const {context:c,size:s}=lab;c.fillStyle=palette.night;c.fillRect(0,0,s.width,s.height);const pts=[];for(let y=rows;y--;)for(let x=cols;x--;){const g=growth[y*cols+x],px=x/(cols-1)*s.width,py=y/(rows-1)*s.height;pts[y*cols+x]={x:px+Math.sin(y*.8)*g*10,y:py-Math.sin(x*.65+y*.28)*g*28};}c.lineWidth=1;for(let y=rows;y--;)for(let x=cols;x--;){const p=pts[y*cols+x];c.strokeStyle=`rgba(${gColor(growth[y*cols+x])},.5)`;if(cols-1>x){const q=pts[y*cols+x+1];c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}if(rows-1>y){const q=pts[(y+1)*cols+x];c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}}},pointer(type,p){if(type==="down"||(type==="move"&&p.down))edit(p);},action(name){if(name==="reset")growth.fill(0);else mode=name;}};
      function gColor(v){return v>0?"167,217,112":"106,157,255";}
    },

    waves(lab) {
      const cols=42,rows=24,state=new Uint8Array(cols*rows),next=new Uint8Array(cols*rows),scar=new Uint8Array(cols*rows);
      const pulse=(gx,gy)=>{for(let y=-1;y!==2;y++)for(let x=-1;x!==2;x++){const ix=gx+x,iy=gy+y;if(ix>=0&&iy>=0&&cols>ix&&rows>iy)state[iy*cols+ix]=12;}};
      let tick=0;
      return {update(){if(++tick%3)return;next.fill(0);for(let y=rows;y--;)for(let x=cols;x--;){const i=y*cols+x;if(scar[i])continue;if(state[i]){next[i]=state[i]-1;continue;}let hot=0;for(let dy=-1;dy!==2;dy++)for(let dx=-1;dx!==2;dx++){const q=(y+dy)*cols+x+dx;if(dx===0&&dy===0)continue;if(y+dy>=0&&x+dx>=0&&rows>y+dy&&cols>x+dx&&state[q]>8)hot++;}if(hot>1)next[i]=12;}state.set(next);},draw(){const {context:c,size:s}=lab;c.fillStyle=palette.night;c.fillRect(0,0,s.width,s.height);const cw=s.width/cols,ch=s.height/rows;for(let y=rows;y--;)for(let x=cols;x--;){const i=y*cols+x;c.fillStyle=scar[i]?"#28353a":state[i]?`hsla(${205+state[i]*4},90%,65%,${.25+state[i]/16})`:"rgba(120,165,166,.12)";c.beginPath();c.roundRect(x*cw+1,y*ch+1,cw-2,ch-2,Math.min(4,cw*.2));c.fill();}},pointer(type,p){if(type==="down")pulse(Math.floor(p.x/lab.size.width*cols),Math.floor(p.y/lab.size.height*rows));},action(name){if(name==="pulse")pulse(Math.floor(cols/2),Math.floor(rows/2));if(name==="reset"){state.fill(0);scar.fill(0);}if(name==="obstacle"){for(let y=6;y!==18;y++)scar[y*cols+Math.floor(cols*.58)]=scar[y*cols+Math.floor(cols*.58)]?0:1;}}};
    },

    drops(lab) {
      const drops=[];let affinity=.64;
      const seed=()=>{drops.length=0;for(let i=18;i--;)drops.push({x:20+Math.random()*(lab.size.width-40),y:20+Math.random()*(lab.size.height-40),r:5+Math.random()*9,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5});};seed();
      return {update(){drops.forEach((d,index)=>{d.vx+=(Math.random()-.5)*.035;d.vy+=(Math.random()-.5)*.035;if(lab.pointer.inside){const dx=lab.pointer.x-d.x,dy=lab.pointer.y-d.y,m=Math.hypot(dx,dy)||1;d.vx+=dx/m*.008*affinity;d.vy+=dy/m*.008*affinity;}d.x+=d.vx;d.y+=d.vy;d.vx*=.99;d.vy*=.99;if(d.r>d.x||d.x>lab.size.width-d.r)d.vx*=-1;if(d.r>d.y||d.y>lab.size.height-d.r)d.vy*=-1;for(let j=drops.length;j--;)if(j!==index&&drops[j]&&(d.r+drops[j].r)*.75>distance(d,drops[j])&&30>d.r){d.r=Math.sqrt(d.r*d.r+drops[j].r*drops[j].r);drops.splice(j,1);break;}});},draw(){const {context:c,size:s}=lab;c.fillStyle=palette.night;c.fillRect(0,0,s.width,s.height);drops.forEach(d=>{const g=c.createRadialGradient(d.x-d.r*.3,d.y-d.r*.35,1,d.x,d.y,d.r);g.addColorStop(0,"rgba(244,192,255,.95)");g.addColorStop(1,"rgba(160,70,190,.3)");c.fillStyle=g;c.beginPath();c.arc(d.x,d.y,d.r,0,6.29);c.fill();c.strokeStyle="rgba(255,220,255,.55)";c.stroke();});},action(name,value){if(name==="seed")seed();if(name==="affinity"){affinity=value/100;lab.root.querySelector("[data-affinity-out]").textContent=value+"%";}if(name==="split"){const big=drops.find(d=>d.r>10);if(big){big.r*=.72;drops.push({x:big.x+big.r*1.4,y:big.y,r:big.r,vx:1.3,vy:-.4});}}}};
    },

    repair(lab) {
      const cols=15,rows=10,nodes=[],bonds=[];let mode="cut",stress=0;
      const reset=()=>{nodes.length=0;bonds.length=0;for(let y=rows;y--;)for(let x=cols;x--;)nodes.push({u:(x+.5)/(cols),v:(y+.5)/(rows),dx:0,dy:0});for(let y=rows;y--;)for(let x=cols;x--;){const i=y*cols+x;if(cols-1>x)bonds.push({a:i,b:i+1,h:1});if(rows-1>y)bonds.push({a:i,b:i+cols,h:1});}};reset();
      const pos=n=>({x:n.u*lab.size.width+n.dx+stress*(n.u-.5)*45,y:n.v*lab.size.height+n.dy});
      return {update(){bonds.forEach(b=>{if(b.h>0&&1>b.h)b.h=Math.min(1,b.h+.003);if(b.h===0&&Math.random()>.992)b.h=.06;});nodes.forEach(n=>{n.dx*=.96;n.dy*=.96;});stress*=.995;},draw(){const {context:c,size:s}=lab;c.fillStyle=palette.night;c.fillRect(0,0,s.width,s.height);bonds.forEach(b=>{if(b.h===0)return;const a=pos(nodes[b.a]),d=pos(nodes[b.b]);c.strokeStyle=b.h>.5?`rgba(241,149,115,${.25+b.h*.55})`:`rgba(197,223,111,${b.h})`;c.lineWidth=1+b.h*1.5;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(d.x,d.y);c.stroke();});nodes.forEach(n=>{const p=pos(n);c.fillStyle=palette.coral;c.beginPath();c.arc(p.x,p.y,3,0,6.29);c.fill();});},pointer(type,p){if(mode!=="cut"||!(type==="down"||(type==="move"&&p.down)))return;bonds.forEach(b=>{const a=pos(nodes[b.a]),d=pos(nodes[b.b]);const mx=(a.x+d.x)/2,my=(a.y+d.y)/2;if(18>Math.hypot(p.x-mx,p.y-my))b.h=0;});},action(name){if(name==="reset")reset();else if(name==="stress")stress=1;else mode=name;}};
    }
  };

  class Runtime {
    constructor() { this.instruments=[];this.ratios=new Map();this.active=null;this.raf=0; }
    add(root) { const item=new Instrument(root,this);this.instruments.push(item);this.observer.observe(root); }
    init() {
      this.observer=new IntersectionObserver(entries=>{entries.forEach(entry=>this.ratios.set(entry.target,entry.intersectionRatio));this.select();},{threshold:[0,.15,.3,.5,.7]});
      all("[data-lm-sim]").forEach(root=>this.add(root));
      document.addEventListener("visibilitychange",()=>{if(document.hidden)this.stop();else{this.select();this.start();}});
    }
    select() { let best=null,bestRatio=.12;this.instruments.forEach(item=>{const ratio=this.ratios.get(item.root)||0;if(ratio>bestRatio&&item.root.getBoundingClientRect().height>0){best=item;bestRatio=ratio;}});this.activate(best); }
    prefer(item) { if((this.ratios.get(item.root)||0)>.05)this.activate(item); }
    activate(item) { if(this.active===item)return;if(this.active)this.active.setActive(false);this.active=item;if(item)item.setActive(true);item?this.start():this.stop(); }
    start() { if(this.raf||document.hidden||!this.active)return;const loop=time=>{this.raf=0;if(!this.active||document.hidden)return;if(!reduced)this.active.frame(time);this.raf=requestAnimationFrame(loop);};this.raf=requestAnimationFrame(loop); }
    stop() { if(this.raf)cancelAnimationFrame(this.raf);this.raf=0; }
  }

  function initObservatories() {
    all("[data-lm-observatory]").forEach(root=>{const output=root.querySelector("[data-lm-observe-out]");const buttons=all("button",root);const select=button=>{buttons.forEach(item=>item.classList.toggle("is-active",item===button));output.textContent=button.dataset.detail;};buttons.forEach((button,index)=>{button.addEventListener("pointerenter",()=>select(button));button.addEventListener("focus",()=>select(button));button.addEventListener("click",()=>select(button));button.addEventListener("keydown",event=>{if(event.key!=="ArrowRight"&&event.key!=="ArrowLeft")return;event.preventDefault();const next=event.key==="ArrowRight"?(index+1)%buttons.length:(index+buttons.length-1)%buttons.length;buttons[next].focus();});});root.addEventListener("pointermove",event=>{const rect=root.getBoundingClientRect();root.style.setProperty("--mx",((event.clientX-rect.left)/rect.width*100)+"%");root.style.setProperty("--my",((event.clientY-rect.top)/rect.height*100)+"%");});select(buttons[0]);});
  }

  function initGenealogies() {
    const copy={drive:["Where is free energy consumed?","Locate the microscopic engine and the channel through which its work reaches collective motion.","自由能在哪里被消耗？","找到微观引擎，以及它的功如何传递到集体运动。"],pattern:["Which variables make the movie predictable?","Turn images into fields: orientation, stress, voltage, curvature, density or information flow.","哪些变量能让影像变得可预测？","把影像变成场：取向、应力、电压、曲率、密度或信息流。"],feedback:["What senses what—and with which delay?","Separate passive response from a loop in which the material changes the rule that changes the material.","谁在感知什么，又延迟多久？","区分被动响应与闭合反馈：材料会改变那个反过来改变材料的规则。"],history:["Why these parameters, not others?","Ask how development, adaptation and selection constrained the material law now being measured.","为什么是这些参数，而不是别的？","追问发育、适应与选择如何约束今天测到的材料定律。"],build:["Can an intervention falsify the story?","Change energy, geometry or communication. A model earns trust by predicting the response, not only fitting a movie.","干预能否证伪这个故事？","改变能量、几何或通信。模型的可信度来自预测响应，而不只是拟合影像。"]};
    all("[data-lm-genealogy]").forEach(root=>{const buttons=all("button",root),zh=isChinese(root);buttons.forEach((button,index)=>button.addEventListener("click",()=>{buttons.forEach(item=>item.classList.toggle("is-active",item===button));const item=copy[button.dataset.step],offset=zh?2:0;root.querySelector("[data-step-count]").textContent=(zh?"步骤 ":"STEP ")+String(index+1).padStart(2,"0")+" / 05";root.querySelector("[data-step-title]").textContent=item[offset];root.querySelector("[data-step-text]").textContent=item[offset+1];}));});
  }

  function initReadingEffects() {
    const bar=document.createElement("div");bar.className="lm-reading-progress";document.body.appendChild(bar);
    addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.setProperty("--lm-progress",(max>0?scrollY/max*100:0)+"%");},{passive:true});
    if(reduced)return;document.documentElement.classList.add("lm-motion-ready");const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.12});all(".lm-direction").forEach(section=>{section.classList.add("lm-reveal");observer.observe(section);});
  }

  if(all(".lm-page").length){initObservatories();initGenealogies();const runtime=new Runtime();runtime.init();initReadingEffects();}
})();
