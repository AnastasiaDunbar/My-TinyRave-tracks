//This version is kind of more laggier due to 24 sine waves which causes it to make clicks.
//This was my first version of Shepard tone.
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
function shepard_tone(t) {
  var shepard = 0;
  var loops = 8;
  var loops2 = 3;
  var sum = 0;
  var slow = 8;
  for (var k = 0; k < loops2; k++) {
    for (var j = 0; j < loops; j++) {
      var i = j+mod((Math.floor(t+(k/loops2))/slow)-((k/loops2)/slow),1);
      shepard += Math.sin((t+((j+2.42)*2.13))*notepitch(i*12))*Math.sin((i/loops)*Math.PI)*Math.sin(fract(t+(k/loops2))*Math.PI);
      sum += Math.sin((j/loops)*Math.PI);
    }
  }
  return shepard/sum;
}

function buildSample(t) {
  return shepard_tone(t);
}
