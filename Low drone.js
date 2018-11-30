var sampleRate=48000;
function mod(a,b){return((a%b)+b)%b;}
function fract(x){return((x%1)+1)%1;}
function mix(x,y,a){return(a*(y-x))+x;}
function clamp(x,minVal,maxVal){return Math.min(Math.max(x,minVal),maxVal);}
function pow2(a,b){return Math.pow(Math.abs(a),b)*Math.sign(a);}
function noteHz(x){return Math.pow(2,(x-49)/12)*440;}
function inverseNoteHz(y){return(12*Math.log(y/55)+13*Math.LN2)/Math.LN2;}
function cyclicSum(a,x){for(var s=0,i=0;i<a.length;i++){s+=a[i]*Math.floor((x+(a.length-i-1))/a.length);}return s+fract(x)*a[Math.floor(mod(x,a.length))];}
function fractSmooth(x,a){return(a>0)?Math.max(1-(fract(x)/a),fract(x)):Math.min(fract(x),fract(-x)/-a);}
var sine=x=>Math.sin(Math.PI*2*x),
    saw=x=>(fract(x)*2)-1,
    pulse=x=>fract(x)>0.5?-1:1,
    tri=x=>(Math.abs(mod((x-0.25)*2,2)-1)*2)-1,
    randSeed=[(Math.random()*2)-1,2e3+(Math.random()*7e3),2e3+(Math.random()*7e3),10+(Math.random()*90),10+(Math.random()*90)],
    rand=x=>fract(Math.sin((x+randSeed[0])*randSeed[1])*randSeed[2]),
    rand2=(x,y)=>fract(Math.sin(((x*randSeed[3])+(y*randSeed[4])+randSeed[0])*randSeed[1])*randSeed[2]);
function catmullRomInterpolation(p0,p1,p2,p3,t){return((2*p1)+((-p0+p2)*t)+((2*p0-5*p1+4*p2-p3)*Math.pow(t,2))+((-p0+3*p1-3*p2+p3)*Math.pow(t,3)))/2;}

const LOWPASS=0,HIGHPASS=1,BANDPASS=2;
class Filter{
	constructor(mode){
		this.cutoff=.99;
		this.resonance=0;
		this.mode=mode;
		this.b0=0;
		this.b1=0;
		this.b2=0;
		this.b3=0;
		
		this.feedbackAmount=0;
		this.cutoffMod=0;
	}
	process(input){
		if(input===0){return 0;}
		var calculatedCutoff=this.getCalculatedCutoff();
		this.b0+=calculatedCutoff*(input-this.b0+this.feedbackAmount*(this.b0-this.b1));
		this.b1+=calculatedCutoff*(this.b0-this.b1);
		this.b2+=calculatedCutoff*(this.b1-this.b2);
		this.b3+=calculatedCutoff*(this.b2-this.b3);
		switch(this.mode){
			case LOWPASS:
				return this.b3;
			case HIGHPASS:
				return input-this.b3;
			case BANDPASS:
				return this.b0-this.b3;
			default:
				return 0;
		}
	}
	getCalculatedCutoff(){
		return Math.max(Math.min(this.cutoff+this.cutoffMod,.99),.01);
	}
	calculateFeedbackAmount(){
		this.feedbackAmount=this.resonance+this.resonance/(1-this.getCalculatedCutoff());
	}
	setCutoffMod(value){
		this.cutoffMod=value;
		this.calculateFeedbackAmount();
	}
	setCutoff(value){
		this.cutoff=value;
		this.calculateFeedbackAmount();
	}
	setResonance(value){
		this.resonance=value;
		this.calculateFeedbackAmount();
	}
}

var noise=(x,y)=>{var i=Math.floor(x);return catmullRomInterpolation(rand2(i-1,y),rand2(i,y),rand2(i+1,y),rand2(i+2,y),fract(x));};
var mixRandom=(a,b)=>(Math.random()*(b-a))+a;

var a=[],b=[];
for(var i=0;i<3;i++){
	b.push(mixRandom(100,195));
}
for(var i=0;i<b.length;i++){
	a.push([0,0]);
}
var filter=[new Filter(LOWPASS),new Filter(LOWPASS)];
filter.forEach(f=>f.setResonance(.65));
function buildSample(time){
	var master=[0,0];
	for(var i=0;i<a.length;i++){
		a[i][0]+=(b[i]+(6*((noise(time*40,i)*2)-1)))/sampleRate;
		a[i][1]+=(b[i]+(6*((noise(time*40,i+1)*2)-1)))/sampleRate;
		master[0]+=saw(a[i][0]);
		master[1]+=saw(a[i][1]);
	}
	master[0]=(master[0]/a.length)*.5;
	master[1]=(master[1]/a.length)*.5;
	filter.forEach(f=>f.setCutoff(mix(.1,.2,noise(time/4,0))));
	return filter.map((f,i)=>f.process(master[i]));
}