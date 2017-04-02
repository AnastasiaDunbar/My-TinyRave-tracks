function clamps(x) { return clamp(x,0,1); }
function smooth_fract(x,m) { return fract(x)*smoothstep(0,1,fract(1-x)*m); }
function smooth_mod(x,l,m) { return mod(x,l)*smoothstep(0,1,mod(l-x,l)*m); }
function isPrime(value) {
    for(var i = 2; i < value; i++) {
        if(value % i === 0) {
            return false;
        }
    }
    return value > 1;
}
var list = [];
for (var i = 1; i < 40; i++) {
  if (isPrime(i)) {
    list.push(i);
  }
}
var attack = 200;
var speed = 30;
var release = 3;
function buildSample(time) {
  var s = 0;
  for (var i = 0; i < list.length; i++) {
    s += sin(time*noteHz(i+(12*6)))*(1-clamps(release*smooth_mod(time,speed/list[i],attack)));
  }
  return s/list.length;
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
