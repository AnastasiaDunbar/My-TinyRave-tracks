importScripts("https://gist.githack.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/79025f36d1db69af83a2628020340338e2fcfffb/TinyRave%20functions.js");
var nH=noteHz;
var r=(x,y)=>{
  var a=[];
  for(let i=0;i<y;i++){a.push(x);}
  return a;
};
var eT=(a,t)=>a.reduce((p,c)=>p.concat(r(c,t)),[]);
var m=[
  [[49,48,46,44,42,39,44,44],1],
  [[56,56,49,47,54,51,54,54],1],
  [[...eT([41,39,44,44,46,46,46,47,46],4),46,46,37,34,...r(44,6),37,34,...eT([42,44],4),37,39,39,39,...r(36,4)],8],
  [[37,37,36,39,34,34,34,35,...eT([30,27,32,32],2)],2],
  //[[56,56,56,53],2],
  [[44,44,44,41],2,2], [[46,49,49,48],4,3],
  [[...eT([41,49,48,44, 37,46,44,41, 34,44,42],2),37,39, ...eT([32,41,39],2),37,36],4], //47,49 (+35,34)?
  [[46,47,49,54],4],
  [[53,54,58,61,63,61,58,54],4,3]
];
var sample=[];
var sampleReset=()=>{
  for(let i=0;i<16;i++){
    sample[i]=(fract(sin(i*55.2325)*3272.426)*2)-1;
  }
};
sampleReset();
var st={};
var syn=(i,x)=>{
  if(!(i in st)){st[i]=0;}
  st[i]+=x/sampleRate;
  return sample.readSmooth(st[i]*sample.length);
};
function buildSample1(time){
  var master=0,s=time*3.2;//time/1.5;
  //((49)) (53,54,56)*2 (53,49,51)*2
  //47,46, 42,39,44,37
  //49,47,46
  //master+=saw(time*nH([49,48,46,44,42,39,44,44].read(s)));
  if(Math.random()<4/sampleRate){
    sampleReset();
  }
  let i=floor(random(sample.length));
  sample[i]=mix(sample[i],random(-1,1),((sin(time)+1)/2)/(sampleRate/60));
  for(let i=0;i<m.length;i++){
    master+=syn(i,nH(
      m[i][0].read((s*m[i][1])+(i/10))+(i/22)+(-16.982+(sin(time/3.5)/13.5))
    ))/(m[i][2]||1);
  }
  return master/20;
}
const LOWPASS=0,HIGHPASS=1,BANDPASS=2;class Filter{constructor(t){this.cutoff=.99,this.resonance=0,this.mode=t,this.b0=0,this.b1=0,this.b2=0,this.b3=0,this.feedbackAmount=0,this.cutoffMod=0}process(t){if(0===t)return 0;var s=this.getCalculatedCutoff();switch(this.b0+=s*(t-this.b0+this.feedbackAmount*(this.b0-this.b1)),this.b1+=s*(this.b0-this.b1),this.b2+=s*(this.b1-this.b2),this.b3+=s*(this.b2-this.b3),this.mode){case LOWPASS:return this.b3;case HIGHPASS:return t-this.b3;case BANDPASS:return this.b0-this.b3}return 0}getCalculatedCutoff(){return Math.max(Math.min(this.cutoff+this.cutoffMod,.99),.001)}calculateFeedbackAmount(){this.feedbackAmount=this.resonance+this.resonance/(1-this.getCalculatedCutoff())}setCutoffMod(t){this.cutoffMod=t,this.calculateFeedbackAmount()}setCutoff(t){this.cutoff=t,this.calculateFeedbackAmount()}setResonance(t){this.resonance=t,this.calculateFeedbackAmount()}}
var buildSample2=(()=>{
let recorded=[],atIndex=0,maxLength=floor(sampleRate*1.5),pulses=[],i;
for(let i=0;i<24;i++){
  let a=pow(random(),2);
  let f=new Filter(LOWPASS);
  f.setCutoff(random(.01,.2));
  f.setResonance(random(.8,.9));
  pulses.push([a,random(1)*(1-a),f]);
}
return time=>{
  recorded[atIndex]=buildSample1(time);
  var master=[0,0];
  for(i=0;i<pulses.length;i++){
    master[i%2]+=pulses[i][2].process(recorded.read(atIndex-(pulses[i][0]*recorded.length))*pulses[i][1]);
  }
  atIndex=(atIndex+1)%maxLength;
  return[master[0]/7,master[1]/7];
};
})();
let recorded=[],atIndex=0,maxLength=floor(sampleRate*.01);
function readSmooth2(x,y){
  return[
    mix(x.read(y)[0],x.read(y+1)[0],fract(y)),
    mix(x.read(y)[1],x.read(y+1)[1],fract(y))
  ];
}
function buildSample(time){
  recorded[atIndex]=buildSample2(time);
  atIndex=(atIndex+1)%maxLength;
  if(time>34){maxLength*=.99999;}
  var a=readSmooth2(recorded,atIndex-(((sin(time*.7)+1)/2)*recorded.length)),
      b=readSmooth2(recorded,atIndex-(((sin(time*.8)+1)/2)*recorded.length)),
      c=readSmooth2(recorded,atIndex-(((sin(time*.2)+1)/2)*recorded.length));
  return[a[0]+b[0]-c[0],a[1]-b[1]+c[1]];
}
