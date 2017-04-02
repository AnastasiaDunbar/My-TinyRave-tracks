//Look at the clock while playing this.
var vol = 1;
function buildSample(time) {
  var d = new Date();
  var sound = 0;
  vol = mix(vol,fract(1-(d.getMilliseconds()/1000)),0.0002);
  sound += sine(noteHz(d.getSeconds()+10)*time)*vol;
  return sound;
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
//Extra
function rand(t) { return fract(sin(t*(421.3458))*47453.5453); }
function pow2(a,b) { return pow(abs(a),b)*sign(a); }
function sign(x) {return (x>0?1:(x===0?0:-1));}
function sine(x) {return sin(PI*2*x);}
function saw(x) {return (fract(x)*2)-1;}
function pulse(x) {return (floor(sin(x*2*PI))*2)+1;}
function tri(x) {return (abs(mod((x-.25)*2,2)-1)*2)-1;}
function noteHz(x) {return pow(2,(x-49)/12)*440;}
function fibonacci(n) { return ((pow(1+sqrt(5),n))-(pow(1-sqrt(5),n)))/(pow(2,n)*sqrt(5)); }
