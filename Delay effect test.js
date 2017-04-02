function mod(a,b) {
    return ((a%b)+b)%b;
}
function fract(a) {
    return mod(a,1);
}
function mix(a,b,c) {
    return (a*(1-c))+(b*c)
}
function clamp(a,b,c) {
  if (a > c) { return c; }
  else if (a < b) { return b; }
  else { return a; }
}
var echo = []; //For storing waves in an array
for (var i = 0; i < 10000; i++) { //Time
  echo.push(0);
}
var at = 0; //For playing back

//You can replace this. --------------------------------------------------------------------
var min_random = 1000;
var max_random = 3000;
var sine_pitch = mix(min_random,max_random,Math.random());
//------------------------------------------------------------------------------------------

function buildSample(t) {
  //You can replace this. --------------------------------------------------------------------
  var soundin = Math.sin(t*sine_pitch)*(1-Math.pow(fract(t*2),0.4))*clamp(fract(t*2)*200,0,1); 
  if (fract(t*2)<4/SAMPLE_RATE) { sine_pitch = mix(min_random,max_random,Math.random()); } //My bad way at giving it a random pitch.
  //------------------------------------------------------------------------------------------
  echo[at] = echo[at]+soundin; //Add sound input
  at = mod(at+1,echo.length); //Move variable at one step.
  if (at === 0) { //If at is back at zero?
    for (var i = 0; i < echo.length; i++) {
      echo[i] *= 0.8; //Feedback
    }
  }
  return echo[at]*.5;
}
