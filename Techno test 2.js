var st = 0; //Synth time (To avoid clicking.)
SAMPLE_RATE *= 1.09; //Giving it a Wavepot pitch.
function buildSample(time) {
  //Synth
  st += ((mod(floor(time*16),8)+1)*[500,500,700,600][mod(floor(time),4)])/SAMPLE_RATE;
  st = mod(st,PI*2);
  var s = pow2(sin(st),2)*clamp(pow2(sin(PI*2*time*3),.2),.05,1);
  //Kick
  s += pow2(sin(pow(1-fract(time*2),5)*150),.8)*2;
  //Hihat
  s += mix(-1,1,rand(time))*pow(1-fract(time*8),4)*mix(0.2,1,abs(sin(time*PI*4)));
  s += pow2(sin(time*30000),2)*.2*(1-fract(time*8));
  //Chord
  var c = [500,700,600,200,800];
  for(var i=0;i<c.length;i++) {
    s += (pow2(sin(time*5*c[i]),4)*.2)*sin((time+(i*.24))*PI*8);
  }
  return s*.1;
}

var PI = Math.PI;
function asin(x) {return Math.asin(x);}
function acos(x) {return Math.acos(x);}
function sin(x) {return Math.sin(x);}
function cos(x) {return Math.cos(x);}
function exp(x) {return Math.exp(x);}
function log(x) {return Math.log(x);}
function pow(a,b) {return Math.pow(a,b);}
function floor(x) {return Math.floor(x);}
function ceil(x) {return Math.ceil(x);}
function abs(x) {return Math.abs(x);}
function sqrt(x) {return Math.sqrt(x);}
function min(a,b) {return Math.min(a,b);}
function max(a,b) {return Math.max(a,b);}
function mod(a,b) {return ((a%b)+b)%b;}
function fract(x) {return mod(x,1);} 
function mix(a,b,c) {return (a*(1-c))+(b*c);}
function clamp(a,b,c) {return Math.min(Math.max(a,b),c);}
function smoothstep(a,b,x) {var t = clamp((x - a)/(b - a),0,1); return t*t*(3-(2*t));}
//Extra
var RNDVAL = mix(400,500,Math.random()); function rand(t) { return fract(sin(t*RNDVAL)*47453.5453); }
function pow2(a,b) { return pow(abs(a),b)*sign(a); }
function sign(x) {return (x>0?1:(x===0?0:-1));}
function sine(x) {return sin(PI*2*x);}
function saw(x) {return (fract(x)*2)-1;}
function pulse(x) {return fract(x)>0.5?-1:1;} //1-(floor(fract(x)*2)*2); //(floor(sin(x*2*PI))*2)+1;}
function tri(x) {return (abs(mod((x-.25)*2,2)-1)*2)-1;}
function noteHz(x) {return pow(2,(x-49)/12)*440;}
function fibonacci(n) { return ((pow(1+sqrt(5),n))-(pow(1-sqrt(5),n)))/(pow(2,n)*sqrt(5)); }
