function fract(x) {
    return ((x%1)+1)%1;
}
function mix(a,b,c) {
    return (a*(1-c))+(b*c)
}
function mod(a,b) {
    return ((a%b)+b)%b;
}
function clamp(a,b,c) {
    return Math.max(Math.min(a,c),b);
}
function notepitch(n) {
  return Math.pow(2,(n- 49)/12)*4400;
}
function divide(a,b) {
  if (b === 0) {
    return 0;
  } else {
    return a/b;
  }
}
//Math.signum(a) = sign(a);
var loops = 8;
var at_time = []
for (var i = 0; i < loops; i++) {
  at_time.push(0);
}
function shepard_tone(t) {
  var shepard = 0;
  var sum = 0;
  var speed = 0.1;
  for (var i = 0; i < loops; i++) {
    var vol = Math.sin(((i+mod(t*speed,1))/loops)*Math.PI);
    var pitch = notepitch((i+mod(t*speed,1))*12);
    at_time[i] += pitch/SAMPLE_RATE;
    shepard += Math.sin(at_time[i])*vol;
    sum += vol;
  }
  return shepard/sum;
}
var buildSample = function(time) {
  return shepard_tone(time);
}
