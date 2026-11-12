// Generated from quality-colors.mjs; run build:token-policy.
// Shared numeric colour math. These values are measurements, never output CSS.
function parseColor(value){
 const s=String(value||'').trim();if(s==='transparent')return [0,0,0,0];
 const hex=s.match(/^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i);
 if(hex){let h=hex[1];if(h.length===3)h=[...h].map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)).concat(h.length===8?parseInt(h.slice(6),16)/255:1);}
 const rgb=s.match(/^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i);
 if(!rgb)return null;const c=rgb.slice(1,4).map(Number),a=rgb[4]===undefined?1:Number(rgb[4]);return c.every(n=>n>=0&&n<=255)&&a>=0&&a<=1?[...c,a]:null;
}
function composite(foreground,background){
 if(!foreground)return background;if(!background)return foreground;
 const a=foreground[3]+background[3]*(1-foreground[3]);return a?[...foreground.slice(0,3).map((c,i)=>(c*foreground[3]+background[i]*background[3]*(1-foreground[3]))/a),a]:[0,0,0,0];
}
function contrast(foreground,background){
 const luminance=c=>c.slice(0,3).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((v,n,i)=>v+n*[.2126,.7152,.0722][i],0);
 const a=luminance(composite(foreground,background)),b=luminance(background);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
function gradientColor(value,x,y){
 const match=String(value||'').match(/^linear-gradient\((.*)\)$/i);if(!match)return null;
 const parts=match[1].split(/,(?![^()]*\))/).map(s=>s.trim());let direction='to bottom';
 if(/^(?:to |[-\d.]+deg)/.test(parts[0]))direction=parts.shift();
 const stops=parts.map((s,i)=>{const m=s.match(/^(.*?)(?:\s+([\d.]+)%)?$/);return {color:parseColor(m[1]),position:m[2]===undefined?i/(parts.length-1):Number(m[2])/100};});
 if(stops.length<2||stops.some(s=>!s.color))return null;
 const angles={'to top':0,'to right':90,'to bottom':180,'to left':270,'to top right':45,'to right top':45,'to bottom right':135,'to right bottom':135,'to bottom left':225,'to left bottom':225,'to top left':315,'to left top':315};
 const angle=direction in angles?angles[direction]:parseFloat(direction);if(!Number.isFinite(angle))return null;
 const r=angle*Math.PI/180,dx=Math.sin(r),dy=-Math.cos(r),t=Math.max(0,Math.min(1,.5+((x-.5)*dx+(y-.5)*dy)/(Math.abs(dx)+Math.abs(dy))));
 if(t<=stops[0].position)return stops[0].color;
 for(let i=1;i<stops.length;i++)if(t<=stops[i].position){const a=stops[i-1],b=stops[i],fraction=(t-a.position)/(b.position-a.position||1),alpha=a.color[3]+(b.color[3]-a.color[3])*fraction;return [0,1,2].map(j=>alpha?(a.color[j]*a.color[3]*(1-fraction)+b.color[j]*b.color[3]*fraction)/alpha:0).concat(alpha);}
 return stops.at(-1).color;
}

module.exports={parseColor,composite,contrast,gradientColor};
