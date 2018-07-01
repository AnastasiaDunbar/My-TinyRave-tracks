importScripts("https://rawgit.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/40bbff8cd9a8a9703cb087a7eabed95610d4415c/TinyRave%2520functions.js");
var speed = 2;
var Bass={
	//[note,start,end]
	melody: [[60,0.0625,0.09375],[60,0.125,0.21875],[58,0.21875,0.25],[60,0.25,0.3125],[56,0.3125,0.375],[60,0.375,0.4375],[61,0.4375,0.5],[60,0.5625,0.59375],[63,0.625,0.6875],[60,0.6875,0.71875],[58,0.71875,0.75],[60,0.75,0.8125],[56,0.8125,0.875],[60,0.875,0.9375],[68,0.9375,1]],
	tone: .15,
	speed: speed/16,
	wave: function wave(time,freq,dur) {return (pow2(tri(time*freq),2)+sine(time*freq*.5))*exp(-(time*2))*pow(1-(time/dur),.1);},
	out: function(time){
		var out = 0;
		var ftime = mod(time,1/this.speed);
		for(var i=0;i<this.melody.length;i++){
			if (ftime>=this.melody[i][1]/this.speed && ftime<this.melody[i][2]/this.speed) {
				var t = ftime-(this.melody[i][1]/this.speed);
				out += this.wave(t,noteHz(this.melody[i][0])*this.tone,(this.melody[i][2]-this.melody[i][1])/this.speed);
			}
		}
		return out*((time*speed)>16);
	}
}
var UFOsine = {
	time: 0,
	melody: createArray(8,function a(t){return (floor(sin(t)*100,50))+200;}),
	out: function(gt){var t=this.time;return mix(sine(t),tri(t*3),(sine(gt*2*speed)+1)/16);}
};
function buildSample(time) {
	UFOsine.time += (UFOsine.melody.readSmooth(floorSmooth(time*speed,20))+(sine(time*speed*2)*5))/SAMPLE_RATE;
	var beat = sin(pow(fract(-time*speed),10)*40); //kick
	if (time*speed>64) { beat += (noise(time)+sin(time*2e4))*pow(fract(-time*speed*4),10)*.1; } //hi-hat
	return ((Bass.out(time)+beat+UFOsine.out(time))/3.8)*clamps(time/2);
}
/* (Updated midi to array)
import mido
filename = 'yourMidi.mid'
t = ['note_off','note_on']
velocity = True
interval = False
time = 0
stack = []
print('//[note'+(',vel'if velocity else'')+',start,end]')
array_name = "melody"
s = 'var '+array_name+'=['
endtime = 0
myMidi = mido.MidiFile(filename)
midiStack = [myMidi.tracks[1][1]]
for i, track in enumerate(myMidi.tracks):
    for message in track[2:][:-1]:
        midiStack.append(message)
if interval:
    for message in midiStack:
        time += message.time
        if(not t.index(message.type)):
            endtime = max(endtime,time)
    time = 0
    for message in midiStack:
        time += message.time
        if(t.index(message.type)): #Note on
            stack.append('['+str(message.note)+(','+str(message.velocity)if velocity else'')+','+str(time/float(endtime))+',')
        else: #Note off
            s += stack.pop(0)+str(time/float(endtime))+'],'
    print(s[:-1]+'];')
else:
    for message in midiStack:
        time += message.time
        if(t.index(message.type)): #Note on
            stack.append('['+str(message.note)+(','+str(message.velocity)if velocity else'')+','+str(time)+',')
        else: #Note off
            s += stack.pop(0)+str(time)+'],'
            endtime = max(endtime,time)
    print(s[:-1]+'];')
    print('var melodyduration='+str(endtime)+';')
*/

//FUNCTIONS ---------------------------------------------------------

/*
var PI = Math.PI;
var TAU = Math.PI*2;
var E = Math.E;
var asin=Math.asin;
var acos=Math.acos;
var sin=Math.sin;
var cos=Math.cos;
var tan=Math.tan;
var exp=Math.exp;
var log=Math.log;
function floor(x){var a=(arguments.length==2?arguments[1]:1);return Math.floor(x/a)*a;};
var ceil=Math.ceil;
var abs=Math.abs;
var sqrt=Math.sqrt;
var atan=Math.atan;
function random(x){if(x==undefined){x=1}return Math.random()*x};
function pow(a,b){return Math.pow(a,b);}
function min(a,b){return Math.min(a,b);}
function max(a,b){return Math.max(a,b);}
function mod(a,b){return((a%b)+b)%b;}
function fract(x){return mod(x,1);} 
function mix(a,b,c){return(c*(b-a))+a;}
function clamp(a,b,c){return Math.min(Math.max(a,b),c);}
function clamps(x){return clamp(x,0,1);}
function sign(x){return(x>0?1:(x===0?0:-1));}
function smoothstep(a,b,x){var t=clamp((x-a)/(b-a),0,1);return t*t*(3-(2*t));}
function atan(a,b){return Math.atan2(a,b);}
//Extra
var RNDSEED = mix(400,500,Math.random()); function prandom(t){t+=RNDSEED/100;return fract(sin(t*RNDSEED)*47453.5453);}
function pow2(a,b){return pow(abs(a),b)*sign(a);}
function sine(x){return sin(PI*2*x);}
function saw(x){return(fract(x)*2)-1;}
function pulse(x){return fract(x)>0.5?-1:1;}
function tri(x){return(abs(mod((x-.25)*2,2)-1)*2)-1;}
function noteHz(x){return pow(2,(x-49)/12)*440;}
function fibonacci(n){return((pow(1+sqrt(5),n))-(pow(1-sqrt(5),n)))/(pow(2,n)*sqrt(5));}
function isPrime(v){for(var i=2;i<v;i++){if(v%i===0){return false;}}return v>1;}
function curveSmooth(x,a){var b=pow(x*2,a)/2;if(x>0.5){b=1-pow(2-(x*2),a)/2;}return b;}
function fractSmooth(x,a){return(a>0)?max(1-(fract(x)/a),fract(x)):min(fract(x),fract(-x)/-a);}
function noise(x){return(prandom(x)*2)-1;}
function noiseSmooth(x,p){return mix(noise(floor(x*p)),noise(floor(x*p)+1),fract(x*p));}
function floorSmooth(x,c){var a=fract(x);var b=floor(x);return((pow2(a,c)-pow2(1-a,c))/2)+b;}
//Arrays
function createArray(size,val){var f=(typeof val==="function");var arr=[];for(var i=0;i<size;i++){arr[i]=f?val(i):val;}return arr;}
Array.prototype.repeat=function(n){var a=[];for(var i=0;i<n;i++){a=a.concat(this);}return a;}
Array.prototype.div=function(n){for(var i=0;i<this.length;i++){this[i]/=n;}return this;};
Array.prototype.mult=function(n){for(var i=0;i<this.length;i++){this[i]*=n;}return this;};
Array.prototype.add=function(n){if(Array.isArray(n)){for(var i=0;i<this.length;i++){this[i]+=n[i];}return this;}else{for(var i=0;i<this.length;i++){this[i]+=n;}return this;}};
Array.prototype.sub=function(n){for(var i=0;i<this.length;i++){this[i]-=n;}return this;};
Array.prototype.func=function(f){for(var i=0;i<this.length;i++){this[i]=f(this[i]);}return this;};
Array.prototype.funcID=function(f){for(var i=0;i<this.length;i++){this[i]=f(this[i],i);}return this;};
Array.prototype.maximum=function(){var n=this[0];for(var i=0;i<this.length;i++){n=Math.max(n,this[i])}return n;};
Array.prototype.minimum=function(){var n=this[0];for(var i=0;i<this.length;i++){n=Math.min(n,this[i])}return n;};
Array.prototype.maxID=function(){var n=0;for(var i=0;i<this.length;i++){if(this[i]>this[n]){n=i;}}return n;};
Array.prototype.minID=function(){var n=0;for(var i=0;i<this.length;i++){if(this[i]<this[n]){n=i;}}return n;};
Array.prototype.sum=function(){var s=0;for(var i=0;i<this.length;i++){s+=this[i];}return s;};
Array.prototype.mean=function(){var s=0;for(var i=0;i<this.length;i++){s+=this[i];}return s/this.length;};
Array.prototype.read=function(indx){return this[mod(floor(indx),this.length)];};
Array.prototype.readInterval=function(indx){return this.read(indx*this.length);};
Array.prototype.readSmooth=function(indx){return mix(this.read(indx),this.read(indx+1),fract(indx));};
Array.prototype.readIntervalSmooth=function(indx){return this.readSmooth(indx*this.length);};
Array.prototype.copy=function(){return this.slice(0);};
Array.prototype.insert=function(i,v){this.splice(i,0,v);};
Array.prototype.swap=function(a,b){var e=this[a];this[a]=this[b];this[b]=e;return this;};
Array.prototype.sortIndex=function(){var l=this.map(function(e,i){return{v: e,i: i};});l.sort(function(a,b){return((a.v<b.v)?-1:((a.v==b.v)?0:1));});return l.map(function(e){return e.i;});};
Array.prototype.shuffle=function(){var r=this.map(Math.random);this.sort(function(a,b){return r[a]-r[b];});};
//Strings
String.prototype.read=function(indx){return this[mod(floor(indx),this.length)];};
String.prototype.count=function(s){return this.split(s).length-1;};
String.prototype.reversed=function(){return this.split('').reverse().join('');};
String.prototype.replaceAll=function(o,n){return this.split(o).join(n);};
String.prototype.stringCopy=function(a,b){return this.substr(a,b);};
String.prototype.replaceAt=function(i,s){return this.substr(0,i)+s+this.substr(i+s.length);};
String.prototype.swap=function(a,b){var s=this;s=s.replaceAt(a,s[b]);s=s.replaceAt(b,this[a]);return s;};
String.prototype.repeatCharacters=function(t){var s='';for(var i=0;i<this.length;i++){s+=this[i].repeat(t);}return s;};
String.prototype.regexReplace=function(regex,n){return this.replace(regex,n);};
String.prototype.stringInsert=function(s,at){return this.substr(0,at)+s+this.substr(at,this.length-1);};
String.prototype.indexOfList=function(word){var result=[];var i=0;while(this.includes(word, i)){var match=this.indexOf(word,i);result.push(match);i=match+1;}return result;};
String.prototype.rot13=function(n){return this.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+n)?c:c-26);});};
String.prototype.tr=function(from,to){var str=this;var subst;for(var i=0;i<from.length;i++){subst=(to[i])?to[i]:to[to.length-1];str=str.replace(new RegExp(str[str.indexOf(from[i])],'g'),subst);}return str;};
String.prototype.leftpad=function(len,chr){var str=String(this);chr=String(chr);var l=len-str.length;for(var i=0;i<l;i++){str=chr[((l-i)-1)%chr.length]+str;}return str;};
String.prototype.splitNChars=function(num){var a=[];for(var i=0;i<this.length;i+=num){a.push(this.substr(i, num));}return a;};
function decToBinary(d){return(d>>>0).toString(2);}
function binaryToDec(d){return parseInt(d,2);}
function decToHex(d){return d.toString(16);}
function hexToDec(d){return parseInt(d,16);}
String.prototype.stringToChar=function(){var s=this.split('');return s.map(function(e){return e.charCodeAt(0);}).join(' ');};
String.prototype.charToString=function(){var s=this.split(' ');return s.map(function(e){return String.fromCharCode(e);}).join('');};
String.prototype.stringToBinary=function(){var s=this.split('');return s.map(function(e){return decToBinary(e.charCodeAt(0)).leftpad(8,0);}).join(' ');};
String.prototype.binaryToString=function(){var s=this.replaceAll(' ','').splitNChars(8);return s.map(function(e){return String.fromCharCode(binaryToDec(e));}).join('');};
String.prototype.stringToHex=function(){var s=this.split('');return s.map(function(e){return decToHex(e.charCodeAt(0));}).join(' ');};
String.prototype.hexToString=function(){var s=this.split(' ');return s.map(function(e){return String.fromCharCode(hexToDec(e));}).join('');};
//Sound Effects
function FastLP(n){var v=0;return function(x){return v+=(x-v)/n;};}
function FastHP(n){var v=0;return function(x){return v+=x-v*n;};}
function FastDelay(t,f){var a=0;var b=[];for(var i=0;i<t*SAMPLE_RATE;i++){b.push(0);}return function(x){a++;if(a>=b.length){a=0;for(var i=0;i<b.length;i++){b[i]*=f;};}b[a]+=x;return b[a];};}
*/
