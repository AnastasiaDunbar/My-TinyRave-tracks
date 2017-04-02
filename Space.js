var Sampleloops = SAMPLE_RATE*1.5;
var savedSamples = [];
var SampleAt = 0;
for (var i = 0; i < Sampleloops; i++) {
  savedSamples.push(0);
}
function buildSample(time) {
  time *= .22;
  var loops = 5;
  var s = 0;
  for (var i = 0; i < loops; i++) {
    var volume = fract(time*(2+i));
    s += pow2(sine((time*(2000+(i*(fract(time*.4)>.5?(fract(time*.2)>.5?2000:1000):1400))))/PI),(sin(time)*3.4)+6)*volume*clamp((1-volume)*100,0,1);
  }
  savedSamples[SampleAt] += s/loops;
  SampleAt++;
  if (SampleAt >= Sampleloops) {
    for (var i = 0; i < Sampleloops; i++) {
      savedSamples[i] *= 0.7;
    }
    SampleAt = 0;
  }
  var s = (sin(4000*time)+sin(8000*time))*.02*mix(0.9,1,rand(floor(time*20000)/20000))*sin(time);
  return (savedSamples[SampleAt]*0.1)+s;
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
function pulse(x) {return fract(x)>0.5?-1:1;} //1-(floor(fract(x)*2)*2); //(floor(sin(x*2*PI))*2)+1;}
function tri(x) {return (abs(mod((x-.25)*2,2)-1)*2)-1;}
function noteHz(x) {return pow(2,(x-49)/12)*440;}
function fibonacci(n) { return ((pow(1+sqrt(5),n))-(pow(1-sqrt(5),n)))/(pow(2,n)*sqrt(5)); }
