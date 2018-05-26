function mod(a,b){return((a%b)+b)%b;}
function fract(x){return((x%1)+1)%1;}
function clamp(a,b,c){return Math.min(Math.max(a,b),c);}
function mix(a,b,c){return(c*(b-a))+a;}
function curveSmooth(x,a){var b=Math.pow(x*2,a)/2;if(x>.5){b=1-Math.pow(2-(x*2),a)/2;}return b;}

var sampleRate=8000,volume=.7,clampMode=true,linearInterpolation=true,crispiness=2; //[default=8000,11000,22000,32000,44000],0 to 1,[default=false,true],[false,true],1 to +Infinity.
function bytebeat(t){
  /*
  w=t>>9,k=32,m=2048,a=1-t/m%1,d=(14*t*t
  ^t)%m*a,y=[3,3,4.7,2][p=w/k&3]*t/4,h=
  "IQNNNN!!]]!Q!IW]WQNN??!!W]WQNNN?"
  .charCodeAt(w/2&15|p/3<<4)/33*t-t,s=y*
  .98%80+y%80+(w>>7&&a*((5*t%m*a&128)*(
  0x53232323>>w/4&1)+(d&127)*(0xa444c444
  >>w/4&1)*1.5+(d*w&1)+(h%k+h*1.99%k+h*.4
  9%k+h*.97%k-64)*(4-a-a))),s*s>>14?127:s
  
  From: mu6k
  Optimized by ryg, p01 et al.
  */
  var w=t>>9,
      k=32,
      m=2048,
      a=1-t/m%1,
      d=(14*t*t^t)%m*a,
      p=w/k&3,
      y=[3,3,4.7,2][p]*t/4,
      h="IQNNNN!!]]!Q!IW]WQNN??!!W]WQNNN?".charCodeAt(w/2&15|p/3<<4)/33*t-t,
      s=y*.98%80+y%80+(w>>7&&a*((5*t%m*a&128)*(0x53232323>>w/4&1)+(d&127)*(0xa444c444>>w/4&1)*1.5+(d*w&1)+(h%k+h*1.99%k+h*.49%k+h*.97%k-64)*(4-a-a)));
  return s*s>>14?127:s;
}

function buildSample(time){
  time*=44100/48000; //Ed McManus, pls fix dis.
  var music=x => clampMode ? clamp(Math.floor(bytebeat(x))/256,-1,1) : ((fract(Math.floor(bytebeat(x))/256)*2)-1),
      out=linearInterpolation ? mix(music(Math.floor(time*sampleRate)),music(Math.floor(time*sampleRate)+1),curveSmooth(fract(time*sampleRate),crispiness)) : music(Math.floor(time*sampleRate));
  return isFinite(out)?out*volume:0; //Firefox would mute audio from all tabs if the output is infinite.
}
