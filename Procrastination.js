importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/920eacc79e176c87fb5e746a8d43f5679ec47612/TinyRave%2520functions.js");
var chords=[[0,3,7,12,19],[-1,5,8,11,20,20.1]];
var time=0;
function buildSample(t){
  time+=(1+(sin(t*10)*0.01))/SAMPLE_RATE;
  var at=chords.read(time/4);
  var m=[0,0];
  for(var i=0;i<at.length;i++){
    m[0]+=pow2(sine(time*noteHz(at[i]+31+(mod(floor(time*2),2)*(fract(time/8)<0.5?5:3)))),3);
    m[1]+=pow2(sine(1.02*time*noteHz(at[i]+31+(mod(floor(time*2),2)*(fract(time/8)<0.5?5:3+(mod(floor(time/2),2)*6))))),3);
  }
  m.mult(1-(pow(fract(-time*2),4)*0.5));
  m.add(sin(pow(fract(-time*2),8)*40)+(noise(t*20)*0.05*pow(fract(-time*4),10))+saw(time*noteHz([26,27,24,22,21,19,15,[14,17,22,27].read(time/2)].read(time/8))));
  return m.div(10);
}
