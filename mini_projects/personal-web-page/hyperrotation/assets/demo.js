(function(){
  'use strict';
  const G=globalThis.HyperGeometry;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-demo]').forEach((host,index)=>{
    const id='demo-'+index, compact=host.dataset.demo==='hero';
    host.innerHTML=`<div class="demo-view"><span class="demo-label">N-D → 3D → SCREEN</span><canvas role="img" aria-label="Interactive projected hypercube. A gold trail follows the highlighted white vertex." aria-describedby="${id}-description"></canvas></div>
      <div class="demo-controls"><label>Dimensions<select data-control="dimension"><option value="3">3D · cube</option><option value="4" selected>4D · tesseract</option><option value="5">5D · hypercube</option><option value="6">6D · hypercube</option></select></label>
      <label>Rotation<select data-control="pattern"><option value="single">One plane · XW</option><option value="shared" selected>Two planes · XW + YW</option><option value="disjoint">Two planes · XY + ZW</option></select></label>
      <label>Speed <output data-value="speed">1×</output><input data-control="speed" type="range" min="0" max="2" step="0.1" value="1" aria-label="Rotation speed"></label>
      ${compact?'':`<label>Trail duration <output data-value="duration">10 s</output><input data-control="duration" type="range" min="1" max="60" step="1" value="10" aria-label="Trail duration in seconds"></label><label class="check"><input data-control="trace" type="checkbox" checked> Trace vertex</label>`}
      <button type="button" data-action="pause">Pause</button><button type="button" data-action="restart">Restart trace</button><button type="button" data-action="reset">Reset</button></div>
      <p class="demo-status" id="${id}-description">Educational browser illustration. Gold shows the recent path; white marks its moving endpoint.</p>`;
    const canvas=host.querySelector('canvas'), ctx=canvas.getContext('2d');
    if(!ctx){host.innerHTML='<p>Canvas is unavailable. The text and diagrams below explain the same geometry.</p>';return;}
    const control=name=>host.querySelector('[data-control="'+name+'"]');
    const pause=host.querySelector('[data-action="pause"]');
    let n=4, shape=G.cube(n), q=G.identity(n), time=0, stepCount=0, accumulator=0, last=null, running=!reduced.matches, visible=true;
    const trail=new G.Trail(10);
    let width=600,height=350;
    function seed(){trail.clear();trail.push(time,G.apply(q,shape.vertices[0]));}
    function updatePause(){pause.textContent=running?'Pause':'Resume';pause.setAttribute('aria-label',running?'Pause illustration':'Resume illustration');}
    function reset(){n=+control('dimension').value;shape=G.cube(n);q=G.identity(n);time=0;stepCount=0;accumulator=0;last=null;seed();draw();}
    function stepMatrix(){
      const speed=+control('speed').value, a=.0096*speed, w=n===3?2:3;
      const pattern=control('pattern').value;
      if(pattern==='single')return G.plane(n,0,w,a);
      if(pattern==='disjoint')return G.multiply(G.plane(n,0,1,a),G.plane(n,n===3?0:2,w,a*Math.SQRT2));
      return G.multiply(G.plane(n,0,w,a),G.plane(n,1,w,a*.7));
    }
    function setPatternLabels(){const options=control('pattern').options;options[0].textContent=n===3?'One plane · XZ':'One plane · XW';options[1].textContent=n===3?'Two planes · XZ + YZ':'Two planes · XW + YW';options[2].textContent=n===3?'Two planes · XY + XZ':'Two planes · XY + ZW';}
    function draw(){
      ctx.clearRect(0,0,width,height);
      // A fixed display, with no additional orbit applied to historical samples.
      const points=shape.vertices.map(v=>G.project(G.apply(q,v),width,height));
      const tracing=compact || control('trace').checked;
      ctx.lineWidth=1;ctx.strokeStyle=tracing?'#425773':'#7da5df';
      shape.edges.forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(...points[a].slice(0,2));ctx.lineTo(...points[b].slice(0,2));ctx.stroke();});
      if(tracing){
        ctx.lineWidth=2;ctx.strokeStyle='#ffc574';ctx.beginPath();
        trail.points().forEach(({v},i)=>{const p=G.project(v,width,height);if(!i)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);});ctx.stroke();
      }
      points.forEach((p,i)=>{if(tracing&&i===0)return;ctx.fillStyle=tracing?'#657d9a':'#b8d5ff';ctx.beginPath();ctx.arc(p[0],p[1],2.5,0,Math.PI*2);ctx.fill();});
      // Paint the selected corner last so overlapping projected vertices cannot hide it.
      if(tracing){ctx.fillStyle='#fff8e9';ctx.beginPath();ctx.arc(points[0][0],points[0][1],5,0,Math.PI*2);ctx.fill();}
    }
    function frame(stamp){
      if(last!==null && running && visible && !document.hidden){
        accumulator+=Math.min((stamp-last)/1000,.25);
        const s=stepMatrix();
        while(accumulator>=.016){
          q=G.multiply(s,q);time+=.016;accumulator-=.016;stepCount++;
          if(stepCount%256===0)q=G.orthonormalize(q);
          if(stepCount%2===0 && (compact || control('trace').checked))trail.push(time,G.apply(q,shape.vertices[0]));
        }
        draw();
      }
      last=stamp;requestAnimationFrame(frame);
    }
    host.querySelector('[data-action="pause"]').addEventListener('click',()=>{running=!running;last=null;updatePause();});
    host.querySelector('[data-action="restart"]').addEventListener('click',()=>{seed();draw();});
    host.querySelector('[data-action="reset"]').addEventListener('click',()=>{reset();setPatternLabels();});
    control('dimension').addEventListener('change',()=>{reset();setPatternLabels();});
    control('pattern').addEventListener('change',()=>{seed();draw();});
    control('speed').addEventListener('input',()=>{host.querySelector('[data-value="speed"]').textContent=control('speed').value+'×';seed();draw();});
    if(!compact){
      control('duration').addEventListener('input',()=>{trail.duration=+control('duration').value;trail.trim(time);host.querySelector('[data-value="duration"]').textContent=trail.duration+' s';draw();});
      control('trace').addEventListener('change',()=>{seed();draw();});
    }
    document.addEventListener('visibilitychange',()=>{last=null;});
    reduced.addEventListener('change',()=>{if(reduced.matches){running=false;last=null;updatePause();}});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=null;}).observe(host);
    new ResizeObserver(()=>{
      width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();
    }).observe(canvas);
    seed();updatePause();requestAnimationFrame(frame);
  });
})();
