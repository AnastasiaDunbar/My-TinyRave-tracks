//Thanks to Ed McManus converted my Wavepot code into TinyRave.
var at_time = 0;
var pitch = 300;
var f = FastHP(1.92);
function buildSample(time) {
  var s = 0;
  at_time += pitch/SAMPLE_RATE;
  pitch = noteHz([24,36,24,46,25,36,34,23][mod(floor(time*4),8)]);
  pitch += (sin(time*43)*2)+.2;
  s += pow2(sine(at_time/4)*fract(time*2)*mix(0.3,1,1-fract(time*8)),.4)*1.4*(mod(time,16)>8);
  s += pulse(at_time)*fract(time*2)*mix(0.3,1,1-fract(time*8))*.7;
  s += pulse(at_time*1.02)*fract(time*2)*mix(0.3,1,1-fract(time*8))*.3;
  s += pow2(sin(pow(fract(-(time*2)),10)*70),.5);
  s += f(mix(-1,1,rand(time))*pow(fract(time*-8),10));
  return s*.3;
}
function FastHP(n){
  var value=0;
  return function(x){
    return value +=x-value*n;
  };
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
function tri(x) {return (abs(mod((x-0.25)*2,2)-1)*2)-1;}
function noteHz(x) {return pow(2,(x-49)/12)*440;}
function fibonacci(n) { return ((pow(1+sqrt(5),n))-(pow(1-sqrt(5),n)))/(pow(2,n)*sqrt(5)); }
