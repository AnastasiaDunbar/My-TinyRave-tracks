importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/acb278ad2cb662813166d7f04edbf053df1086fa/TinyRave%2520functions.js");
//length=2^iter
function thueMorse(iter){
  var a=[0];
  for(var i=0;i<iter;i++){
    a=a.concat(a.map(e=>1-e));
  }
  return a;
}
var patterns=[thueMorse(5),thueMorse(4),euclideanRhythm(16,7),euclideanRhythm(16,8),euclideanRhythm(16,5)],speed=8;
function buildSample(time){
  var m=0;
  for(var i=0;i<patterns.length;i++){
    var pattern=patterns[i];
    m+=sine(time*200*((i/2)+1))*pattern.read(time*speed)*fract(-time*speed);
  }
  return m/patterns.length;
}
