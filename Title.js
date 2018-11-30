var sampleRate=44100;
importScripts("https://rawgit.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/a8eb14aac571d2916f9a5fabb01f863c26980988/TinyRave%2520functions.js");
var a=[],
s=[2,2,1,2,2,2,1.02],
br=[13,10,7],
base=10;
function buildSample(time){
  var master=[0,0];
  base=br.read(time/3)+(time/150);
  if(Math.random()<35/sampleRate){
    a.push({
      t:0,
      f:[0,Math.random()*4],
      d:mix(.5,2.8,Math.random()),
      p:noteHz(base+cyclicSum(s,Math.floor(29*Math.pow(Math.random(),1.5)))),
      s:(Math.random()-.5)*7,
      S:(Math.random()*2)-1,
      D:(Math.random()-.5)*.1,
      lp:FastLP(mix(2,7,Math.random()))
    });
  }
  for(var i=a.length-1;i>=0;i--){
    var m=a[i].lp(saw(a[i].f[0])+saw(a[i].f[1]))*Math.pow(Math.sin((a[i].t/a[i].d)*PI),.4);
    master[0]+=m*max(0,-a[i].S);
    master[1]+=m*max(0,a[i].S);
    a[i].p+=a[i].s/sampleRate;
    a[i].f[0]+=a[i].p/sampleRate;
    a[i].f[1]+=(a[i].p*a[i].D)/sampleRate;
    a[i].t+=1/sampleRate;
    if(a[i].t>a[i].d){
      a.splice(i,1);
    }
  }
  return[master[0]/20,master[1]/20];
}