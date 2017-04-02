//var at_sample = 0;
var times = [];
var pitches = [];
var times_length = 1; //In seconds
function buildSample(time) {
  if (Math.random()>.99985) { //Play notes here randomly.
    times.push(0); //Start at 0.
    pitches.push(mix(500,4000,Math.random())); //Give it a random pitch.
  }
  var sound_out = 0;
  for (var i = 0; i < times.length; i++) { //Play each note
    times[i] += 1/SAMPLE_RATE; //(1/SAMPLE_RATE) makes it increase 1 per second.
    var t = times[i];
    sound_out += sin(t*pitches[i])*exp(-t*11);
    if (times[i] > times_length) { //Is note finished? Then delete from array.
      times.splice(i,1); pitches.splice(i,1);
    }
  }
  //at_sample++;
  return sound_out*0.3;
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
