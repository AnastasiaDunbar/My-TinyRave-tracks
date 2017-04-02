//Might be an inspiration from 180db_
importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/a30c5a34419842fa7a136d668e5e432833852396/TinyRave%2520functions.js");
var from=[2,6,8];
var to=[-1,2,7];
var times=new Array(from.length).fill(0);
function buildSample(time){
  var fade=min(pow(fract(time/4)*2,.75),1);
  var master=0;
  for(var i=0;i<times.length;i++){
    times[i]+=noteHz(mix(from[i],to[i],fade))/SAMPLE_RATE;
    master+=(saw(times[i]*3.92)+saw(times[i]*3.9)+saw(times[i]*6.9))/4;
  }
  if(fract(time/16)>=0.5){
    master*=[1,1,1,0,1,1,1,0, 1,1,1,0,1,1,1,1].readInterval(time);
  }
  master*=pow(fract(time*2),0.5);
  master+=sin(pow(fract(-time*2),4)*70)*2;
  master+=(sine(time*10000)+noise(time))*pow(fract((0.25-time)*2),10)*0.3;
  return master/times.length;
}
