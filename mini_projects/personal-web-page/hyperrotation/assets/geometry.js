/* Pure geometry shared by the illustrations and Node checks. Column vectors. */
(function (root) {
  'use strict';
  const identity = n => Array.from({length:n}, (_,i) => Array.from({length:n}, (_,j) => +(i===j)));
  const multiply = (a,b) => a.map(row => b[0].map((_,j) => row.reduce((s,v,k) => s+v*b[k][j],0)));
  const apply = (a,v) => a.map(row => row.reduce((s,x,i) => s+x*v[i],0));
  function plane(n,i,j,angle) {
    const m=identity(n), c=Math.cos(angle), s=Math.sin(angle);
    m[i][i]=c; m[i][j]=-s; m[j][i]=s; m[j][j]=c; return m;
  }
  function cube(n) {
    const vertices=Array.from({length:2**n},(_,i)=>Array.from({length:n},(_,d)=>i & (1<<d) ? 1:-1));
    const edges=[];
    vertices.forEach((_,i)=>{for(let d=0;d<n;d++){const j=i^(1<<d);if(i<j)edges.push([i,j]);}});
    return {vertices,edges};
  }
  function orthonormalize(q) {
    const n=q.length, out=identity(n);
    for(let j=0;j<n;j++) {
      const v=q.map(row=>row[j]);
      for(let k=0;k<j;k++) {
        const dot=v.reduce((s,x,i)=>s+x*out[i][k],0);
        for(let i=0;i<n;i++)v[i]-=dot*out[i][k];
      }
      const norm=Math.hypot(...v);
      if(norm<1e-12)throw new Error('Degenerate orientation');
      for(let i=0;i<n;i++)out[i][j]=v[i]/norm;
    }
    return out;
  }
  // Same dimensional reduction as the app, then a camera at (0,0,5).
  // Illustrations use scale .8 and near-plane extent 1 at distance 3.
  function project(v,width,height) {
    const scale=.8, depth=5-scale*(v[2]||0), focal=1.5*height;
    return [width/2+focal*scale*v[0]/depth,height/2-focal*scale*v[1]/depth,depth];
  }
  // Bounded rolling history. Timestamps are active simulation seconds.
  class Trail {
    constructor(duration=10){this.duration=duration;this.capacity=1877;this.clear();}
    clear(){this.buffer=new Array(this.capacity);this.start=0;this.size=0;}
    trim(time){while(this.size && this.buffer[this.start].time < time-this.duration){this.start=(this.start+1)%this.capacity;this.size--;}}
    push(time,v){
      this.trim(time);
      const last=this.size ? this.buffer[(this.start+this.size-1)%this.capacity] : null;
      if(last && v.every((x,i)=>Math.abs(x-last.v[i])<1e-12))return;
      if(this.size===this.capacity){this.start=(this.start+1)%this.capacity;this.size--;}
      this.buffer[(this.start+this.size)%this.capacity]={time,v:v.slice()}; this.size++;
    }
    points(){return Array.from({length:this.size},(_,i)=>this.buffer[(this.start+i)%this.capacity]);}
  }
  root.HyperGeometry={identity,multiply,apply,plane,cube,orthonormalize,project,Trail};
})(globalThis);
