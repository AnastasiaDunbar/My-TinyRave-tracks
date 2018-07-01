var SAMPLE_RATE=48000; //SAMPLE_RATE is undefined outside of buildSample().
//Example:
var delay = FastDelay(1.5,0.6);
var buildSample = function(time) {
  function a(x){return delay(pow2(x,sin(time)+2)*.2);}
  return arrayfunc([sin(time*readarray([1225,3163,4123,6143],time*3)),sin(time*readarray([1225,3163,4123,6143,8242],time*2))],a);
}

//FUNCTIONS--------------------------------------------------------------------------------------------------------------------------------------------------------------
var PI = Math.PI;
var TAU = Math.PI*2;
function asin(x){return Math.asin(x);}
function acos(x){return Math.acos(x);}
function sin(x){return Math.sin(x);}
function cos(x){return Math.cos(x);}
function tan(x){return Math.tan(x);}
function exp(x){return Math.exp(x);}
function log(x){return Math.log(x);}
function pow(a,b){return Math.pow(a,b);}
function floor(x){return Math.floor(x);}
function ceil(x){return Math.ceil(x);}
function abs(x){return Math.abs(x);}
function sqrt(x){return Math.sqrt(x);}
function min(a,b){return Math.min(a,b);}
function max(a,b){return Math.max(a,b);}
function mod(a,b){return((a%b)+b)%b;}
function fract(x){return mod(x,1);} 
function mix(a,b,c){return(c*(b-a))+a;}
function clamp(a,b,c){return Math.min(Math.max(a,b),c);}
function clamps(x){return clamp(x,0,1);}
function sign(x){return(x>0?1:(x===0?0:-1));}
function smoothstep(a,b,x){var t=clamp((x-a)/(b-a),0,1);return t*t*(3-(2*t));}
function atan(x){return Math.atan(x); }
function atan(a,b){return Math.atan2(a,b);}
//Extra
var RNDVAL = mix(400,500,Math.random()); function rand(t) { return fract(sin(t*RNDVAL)*47453.5453); }
function pow2(a,b){return pow(abs(a),b)*sign(a);}
function sine(x){return sin(PI*2*x);}
function saw(x){return(fract(x)*2)-1;}
function pulse(x){return fract(x)>0.5?-1:1;}
function tri(x){return(abs(mod((x-.25)*2,2)-1)*2)-1;}
function noteHz(x){return pow(2,(x-49)/12)*440;}
function fibonacci(n){return((pow(1+sqrt(5),n))-(pow(1-sqrt(5),n)))/(pow(2,n)*sqrt(5));}
function isPrime(v){for(var i=2;i<v;i++){if(v%i===0){return false;}}return v>1;}
function smooth_curve(x,a){var b=pow(x*2,a)/2;if(x>0.5){b=1-pow(2-(x*2),a)/2;}return b;}
function smooth_fract(x,a){return(a>0)?max(1-(fract(x)/a),fract(x)):min(fract(x),fract(-x)/-a);}
function noise(x){return(rand(x)*2)-1;}
function smooth_noise(x,p){return mix(noise(floor(x*p)),noise(floor(x*p)+1),fract(x*p));}
function smooth_floor(x,c){var a=fract(x);var b=floor(x);return((pow(a,c)-pow(1-a,c))/2)+b;}
//Arrays
function createarray(size,val){var arr=[];for(var i=0;i<size;i++){arr[i]=val;}return arr;}
function arraydiv(arr,n){for(var i=0;i<arr.length;i++){arr[i]/=n;}return arr;}
function arraymult(arr,n){for(var i=0;i<arr.length;i++){arr[i]*=n;}return arr;}
function arrayadd(arr,n){for(var i=0;i<arr.length;i++){arr[i]+=n;}return arr;}
function arraysubt(arr,n){for(var i=0;i<arr.length;i++){arr[i]-=n;}return arr;}
function arrayfunc(arr,f){for(var i=0;i<arr.length;i++){arr[i]=f(arr[i]);}return arr;}
function arrayfuncid(arr,f){for(var i=0;i<arr.length;i++){arr[i]=f(arr[i],i);}return arr;}
function maxarray(arr){var n=arr[0];for(var i=0;i<arr.length;i++){n=Math.max(n,arr[i])}return n;}
function minarray(arr){var n=arr[0];for(var i=0;i<arr.length;i++){n=Math.min(n,arr[i])}return n;}
function maxarrayid(arr){var n=0;for(var i=0;i<arr.length;i++){if(arr[i]>arr[n]){n=i;}}return n;}
function minarrayid(arr){var n=0;for(var i=0;i<arr.length;i++){if(arr[i]<arr[n]){n=i;}}return n;}
function sumarray(arr){var s=0;for(var i=0;i<arr.length;i++){s+=arr[i];}return s;}
function addarrays(arr1,arr2){for(var i=0;i<arr1.length;i++){arr1[i]+=arr2[i];}return arr1;}
function readarray(arr,indx){return arr[mod(floor(indx),arr.length)];}
function readarrayf(arr,indx){return arr[mod(floor(indx*arr.length),arr.length)];}
function readarraysmooth(arr,indx){return mix(arr[mod(floor(indx),arr.length)],arr[mod(floor(indx)+1,arr.length)],fract(indx));}
Array.prototype.insert=function(i,v){this.splice(i,0,v);};
//Sound Effects
function FastLP(n){var v=0;return function(x){return v+=(x-v)/n;};}
function FastHP(n){var v=0;return function(x){return v+=x-v*n;};}
function FastDelay(t,f){var a=0;var b=[];for(var i=0;i<t*SAMPLE_RATE;i++){b.push(0);}return function(x){a++;if(a>=b.length){a=0;for(var i=0;i<b.length;i++){b[i]*=f;};}b[a]+=x;return b[a];};}
//Strings
String.prototype.reversed=function(){return this.split('').reverse().join('');}
String.prototype.replaceAll=function(o,n){return this.split(o).join(n);};
String.prototype.stringCopy=function(a,b){return this.substr(a,b);};
String.prototype.repeatCharacters=function(t){var s='';for(var i=0;i<this.length;i++){s+=this[i].repeat(t);}return s;};
String.prototype.regexReplace=function(regex,n){return this.replace(regex,n);};
String.prototype.stringInsert=function(s,at){return this.substr(0,at)+s+this.substr(at,this.length-1);};
String.prototype.indexOfList=function(word){var result=[];var i=0;while(this.includes(word, i)){var match=this.indexOf(word,i);result.push(match);i=match+1;}return result;}
String.prototype.rot13=function(n){return this.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+n)?c:c-26);});}
