importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/93ae0d764488038143723ccc1ccb01f6320e48f7/TinyRave%2520functions.js");
//thx4daPizza
var melody = [[A_4],[A_4,D_4,E_4],[A_4,C_SHARP_4,E_4],[A_1,A_4,C_SHARP_4,E_4,E_5]];
function buildSample(time) {
  var master=0;
  var m=melody.read(time);
  for(var i=0;i<m.length;i++){
    var e=m[i];
    master+=sine(time*e);
    master+=tri(time*e*(floor((fract(time)*4))+1))*fract(-time*4)*clamps((time-8)/8);
  }
  return master/10;
}
