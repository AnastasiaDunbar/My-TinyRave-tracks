var sampleRate=48000;
//Mandatory numerical functions.
function mod(a,b){return((a%b)+b)%b;}
function fract(x){return((x%1)+1)%1;}
function fractSmooth(x,a){return(a>0)?Math.max(1-(fract(x)/a),fract(x)):Math.min(fract(x),fract(-x)/-a);}
function mix(x,y,a){return(a*(y-x))+x;}
function clamp(x,minVal,maxVal){return Math.min(Math.max(x,minVal),maxVal);}
function pow2(a,b){return Math.pow(Math.abs(a),b)*Math.sign(a);}
//Musical functions.
function noteHz(x){return Math.pow(2,(x-49)/12)*440;}
//Arrays.
function read(array,index){return array[mod(Math.floor(index),array.length)];}
const LOWPASS=0,HIGHPASS=1,BANDPASS=2;
class Filter{
    constructor(mode){
        this.cutoff=.99;this.resonance=0;this.mode=mode;
        this.b0=0;this.b1=0;this.b2=0;this.b3=0;
        this.feedbackAmount=0;this.cutoffMod=0;
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
    getCalculatedCutoff(){return Math.max(Math.min(this.cutoff+this.cutoffMod,.99),.01);}
    calculateFeedbackAmount(){this.feedbackAmount=this.resonance+this.resonance/(1-this.getCalculatedCutoff());}
    setCutoffMod(value){this.cutoffMod=value;this.calculateFeedbackAmount();}
    setCutoff(value){this.cutoff=value;this.calculateFeedbackAmount();}
    setResonance(value){this.resonance=value;this.calculateFeedbackAmount();}
}
class PWMsynth{
	constructor(){
		this.time=0;
		this.pitch=440;
		this.currentWidth=.5;
		this.nextWidth=.5;
	}
	setPitch(value){
		this.pitch=value;
	}
	setWidth(value){
		this.nextWidth=value;
	}
	process(){
		var out=fract(this.time)>=this.currentWidth?1:-1;
		this.time+=this.pitch/sampleRate;
		if(this.time>=1){
			this.time=mod(this.time,1);
			this.currentWidth=this.nextWidth;
		}
		return out;
	}
}
var synths=[],
    filters=[],
    iterations=7;
for(var i=0;i<iterations;i++){
	synths[i]=new PWMsynth();
	filters[i]=new Filter(LOWPASS);
	filters[i].setResonance(.85);
}
function buildSample(time){
	var master=0;
	for(var i=0;i<iterations;i++){
		synths[i].setPitch(
			noteHz(35+read([0,2,-5,4],time)+read([0,2,4,5,7,9,11,12],time*Math.pow(2,i)))
		);
		synths[i].setWidth(
			mix(((pow2(Math.sin(time*Math.PI*(Math.pow(2,i)/16)),.75)+1)/2),.5,.1)
		);
		filters[i].setCutoff(
			mix(.5,.1,Math.pow(fractSmooth(time*Math.pow(2,3-(i%4)),.05),.6))
		);
		master+=filters[i].process(synths[i].process())/iterations;
	}
	return master*.2;
}
