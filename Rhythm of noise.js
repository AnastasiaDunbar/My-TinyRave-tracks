importScripts("https://rawgit.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/4d5e5d91ec9b025b2585c5c3083cb1b6255456fc/TinyRave%2520functions.js");
function buildSample(time){
  time*=.85;
  var master=0;
  for(var i=0;i<4;i++){
    var s=time*pow(2,i+floor(prandom(floor(time*2))*2));
    master+=noiseSmooth(time,pow(prandom(floor(s)),3)*5e4)*pow(fract(prandom(floor(s))>.9?s:1-(s)),4+(10*prandom(632.643+floor(time*pow(2,i)))));
    s=time*pow(2,i+floor(prandom(4.6+floor(time*2))*2));
    master+=sine(fract(1-s)*(30+(30*prandom(floor(s)+.752)))*sine(time*(40+(20*prandom(floor(s))))))*pow(prandom(floor(s))>.2?1-fract(s):fract(s),20)*2;
  }
  return master*.3;
}
