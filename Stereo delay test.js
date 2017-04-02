importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/e2618269295dbac54cd8dfa941f9a06b42e76bcd/TinyRave%2520functions.js");
function inputSample(time){
  var m=[0,0];
  m[0]+=sin(1500*time)*pow(fract(-time*1.2),9);
  m[1]+=sin(2700*time)*pow(fract(-time*1.4),9);
  return m.mult(0.6);
}
function arrayMix(a,b,c){
  var n=[];
  for(var i=0;i<a.length;i++){
    n.push(mix(a[i],b[i],c));
  }
  return n;
}
function stereoDelay(time){
  var t=0;
  var m=createArray(time*SAMPLE_RATE,[0,0]);
  return function(input,feedback,pingpong){
    if(t>=m.length){
      m=m.map(function(e){
        var n=e.mult(feedback);
        if(pingpong){
          n=arrayMix(n,n.slice(0).reverse(),pingpong);
        }
        return n;
      });
      t=0;
    }
    m[t]=m[t].add(input);
    t++;
    return m[t-1];
  };
}
var myDelay=stereoDelay(0.1);
function buildSample(time){
  return myDelay(inputSample(time),0.6,(pow2(sin(time/3),0.2)+1)/2).mult(0.6);
}
