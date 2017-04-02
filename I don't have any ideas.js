importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/93ae0d764488038143723ccc1ccb01f6320e48f7/TinyRave%2520functions.js");
var t=0;
var a=createArray(16,function(){return floor(random(12))+1});
var h=createArray(16,function(){return floor(random(4))+1});
function buildSample(time){
  var master=0;
  var pitch=a.readSmooth(floorSmooth(mod(time,4)*6,60));
  t+=noteHz(pitch+(sin(time)/4))/SAMPLE_RATE;
  master+=tri(t*4);
  if(time>8){master+=pow2(tri(t),0.8)*2;}
  if(time>16){master+=tri(t*(fract(time/4)<.5?8:16))*(fract(mod(time,4)*12)<.5)*0.5;}
  master+=sine(pow(fract(-time*2),25)*5)*fract(-time)*2;
  master+=noise(time)*pow(fract(-time*4*h.read(time*4)),16)*0.1;
  return master/3;
}
