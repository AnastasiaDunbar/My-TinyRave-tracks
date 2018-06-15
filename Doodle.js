importScripts("https://rawgit.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/169887380c87fb4b0d59b04753dfdac4a9a0d878/TinyRave%2520functions.js");
var step=0,bpm=85,timerLength=(60/bpm)/4,timer=timerLength,sampleRate=48000,time=0;
sampleRate*=1.2;
//melody=[[note,steps]...], note=0, step=0, time=0.
var aa=[[24,14],[22,2],[20,8],[22,4],[23,4]],ab=0,ac=0,ad=0,
    ba=[
      [48,2],[51,2],[50,1],[51,1],[55,2],
      [48,2],[51,2],[50,1],[51,1],[55,1],[46,1],
      [48,1],[44,1],[51,2],[50,1],[51,1],[55,2],
      [48,2],[51,2],[50,1],[51,1],[55,1],[67,1],
      
      [48,2],[51,2],[50,1],[51,1],[55,2],
      [48,2],[51,2],[50,1],[51,1],[58,2],
      [56,2],[60,2],[53,2],[50,1],[51,1],
      [55,2],[47,2],[48,1],[55,1],[60,1],[67,1]
    ],bb=0,bc=0,bd=0,
    //[[note,time]...], length.
    ca=[],cb=2.8;
function buildSample(){
  var master=0,stepTime=step+(1-(timer/timerLength));
  master+=(pulse(ad/2)+tri(ad))/1.5;
  master+=saw(bd)/3;
  for(var i=ca.length-1;i>=0;i--){
    master+=
      pow2(saw(time*noteHz(ca[i][0])),2)* //Synth.
      (1-(ca[i][1]/cb))* //Fade out.
      clamps(ca[i][1]*10)* //Anti-click on push().
      pow(fract(1-(stepTime/32)),.1)* //Anti-click when ab equals to 0.
      .5; //Volume.
    ca[i][1]+=1/sampleRate;
    if(ca[i][1]>=cb){
      ca.splice(i,1);
    }
  }
  master*=pow(fract(stepTime/2),.4);
  master+=pow2(sin(pow(fract(1-(stepTime/2)),9.2)*60),.6)*(1-pow(fract(stepTime/2),2));
  
  bd+=(sin(time*30)*2)/sampleRate;
  ad=mod(ad+(noteHz(aa[ab][0]+(12*mod(step,2)))/sampleRate),2);
  bd=fract(bd+(noteHz(ba[bb][0])/sampleRate));
  
  timer-=1/sampleRate;
  if(timer<=0){
    ac++;if(ac>=aa[ab][1]){ac=0;ab=mod(ab+1,aa.length);if(ab==0){ca=[];}}
    bc++;
    if(bc>=ba[bb][1]){
      bc=0;bb=mod(bb+1,ba.length);
      ca.push([(ba[bb][0]+((Math.random()-.5)*.09))-12,0]);
    }
    
    timer=timerLength;
    step++;
  }
  time+=1/sampleRate;
  return master*.2;
}
