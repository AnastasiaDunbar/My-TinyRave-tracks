importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/93ae0d764488038143723ccc1ccb01f6320e48f7/TinyRave%2520functions.js");
var sample, sampleMax, samplePitch, fractSpeed, fractAmount;
function sampleUpdate() {
  sample = createArray((random(60))+1,function(i){return (random()-.5)*4;})
  sampleMax = max(-sample.minimum(),sample.maximum())+.1;
  samplePitch = 100+random(300);
  fractSpeed = random(24);
  fractAmount = random(.5);
}
sampleUpdate();
var mute = false;
function buildSample(time) {
  if (random()<0.00005) { sampleUpdate(); }
  if (random()<0.001) { mute = floor(pow(random(),4)*2); }
  if (mute) {
    return 0;
  } else {
    return sample.readIntervalSmooth((time*samplePitch)+(fract(time*fractSpeed)*fractAmount))/sampleMax;
  }
}
