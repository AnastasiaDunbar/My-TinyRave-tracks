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

var pickRandom=a=>a[Math.floor(Math.random()*a.length)],
    voices=[],
    oscillators=[tri,x=>pow2(sine(x),4),x=>fractSmooth(x,.05)-.5,x=>Math.sign(sine(x)+Math.sin(x*.05)),saw],
    envelopes=[x=>Math.min(1-x,x*2e3),x=>Math.sin(Math.pow(x,.5)*Math.PI),x=>Math.min(x,(1-x)*40)];

var timer={init:1/8,value:0};

var scale=[2,2,1,2,2,2,1];
class Delay{
	constructor(s,feedback){
		this.seconds=s;
		this.feedback=feedback;
		this.buffer=[];
		for(var i=0;i<s*sampleRate;i++){
			this.buffer.push(0);
		}
		this.at=0;
	}
	process(input){
		var out=this.buffer[this.at];
		this.buffer[mod(this.at-1,this.buffer.length)]*=this.feedback;
		this.buffer[this.at]+=input*this.feedback;
		this.at+=1;
		if(this.at>=this.buffer.length){
			/*for(var i=0;i<this.buffer.length;i++){
				this.buffer[i]*=this.feedback;
			}*/
			this.at=0;
		}
		return input+out;
	}
}

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

var masterDelay=new Delay(3/4,.7);

function buildSample(time){
	if(timer.value<=0){
		for(var i=0;i<2+(Math.random()*6);i++){
			voices.push({
				oscillator:pickRandom(oscillators),
				envelope:pickRandom(envelopes),
				pitch:noteHz(17.5+cyclicSum(scale,Math.floor(Math.pow(Math.random(),1.5)*25))),
				slide:pow2((Math.random()*2)-1,16)*10,
				oscTime:0,
				volume:mix(.2,1,Math.pow(Math.random(),2)),
				duration:mix(.3,4,Math.pow(Math.random(),5)),
				time:0,
				filter:new Filter(LOWPASS)
			});
			timer.init=pickRandom([1/8,1/4]);
		}
		timer.value=timer.init+timer.value;
	}
	timer.value-=1/sampleRate;
	var master=0;
	for(var i=voices.length-1,v;i>=0;i--){
		v=voices[i];
		v.time+=1/sampleRate;
		v.pitch+=v.slide/sampleRate;
		v.oscTime+=v.pitch/sampleRate;
		v.filter.setCutoff(v.envelope(v.time/v.duration));
		master+=v.filter.process(v.oscillator(v.oscTime)*v.envelope(v.time/v.duration))*v.volume;
		if(v.time>=v.duration){
			voices.splice(i,1);
		}
	}
	//master+=sine(Math.pow(timer.value/timer.init,4)*10)*2;
	return masterDelay.process(master)/15;
}
