importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/9d3a58c7e47eac587e45f657ac5afebb178ac867/TinyRave%2520functions.js");

var s = 0;
var m = [1,3,5,6,8,10,11,13];

var speed = 10;

var delay = FastDelay(0.4,0.2);

function buildSample(time) {
  var out = 0;
  s += noteHz(readarray(m,time*speed)+(fract((time*speed)/32)>.5))/SAMPLE_RATE;
  var a = sine(s*12)*(fract(-time*speed)*clamps(fract(time*speed)/0.01));
  a += tri(s*12)*(fract(-time*speed*.5)*clamps(fract(time*speed*.5)/0.01))*(time*speed*(.25/32)>.5);
  a += tri(s*24)*(fract(-time*speed*.5)*clamps(fract(time*speed*.5)/0.01))*(time*speed*(.25/128)>.5);
  out += delay(a)
  out += sin(pow(1-fract(time*speed*.25),10)*30);
  out += noise(time)*pow2(1-fract(time*speed),15)*sine(time*speed*.0625);
  out += pow2(sine(time*12*.125*noteHz(readarray([1,2],time*speed*.0625))),.7)*(time*speed*(.25/64)>.5);
  return out/4;
}
