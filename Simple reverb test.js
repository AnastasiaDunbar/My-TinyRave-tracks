importScripts("https://rawgit.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/40bbff8cd9a8a9703cb087a7eabed95610d4415c/TinyRave%2520functions.js");
var delay=[];
var filter=[];
var count=30;
for(var i=0;i<count;i++){
  delay.push(FastDelay(random(0.01)+0.01,0.97));
  filter.push(FastLP(50));
}
function buildSample(time){
  var speed=5;
  var input=tri(time*noteHz(24+(12*floor(prandom(floor(time*speed)+0.5)*6))+[0,2,4,5,7,9,11].readInterval(prandom(floor(time*speed)))))*pow(fract(-time*speed),50/speed);
  var mix=0;
  for(var i=0;i<count;i++){
    mix+=filter[i](delay[i](input));
  }
  mix*=1.5;
	mix+=input;
  return mix/count;
}
