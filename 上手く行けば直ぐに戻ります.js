importScripts("https://gist.githack.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/79025f36d1db69af83a2628020340338e2fcfffb/TinyRave%20functions.js");
const LOWPASS=0,HIGHPASS=1,BANDPASS=2;
class Filter{
	constructor(mode){
		this.cutoff=.99;
		this.resonance=0;
		this.mode=mode;
		this.b0=0;this.b1=0;this.b2=0;this.b3=0;
		
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
			case LOWPASS:return this.b3;
			case HIGHPASS:return input-this.b3;
			case BANDPASS:return this.b0-this.b3;
		}
		return 0;
	}
	getCalculatedCutoff(){
		return Math.max(Math.min(this.cutoff+this.cutoffMod,.99),.001);
	}
	calculateFeedbackAmount(){
		this.feedbackAmount=this.resonance+this.resonance/(1-this.getCalculatedCutoff());
	}
	setCutoffMod(value){this.cutoffMod=value;this.calculateFeedbackAmount();}
	setCutoff(value){this.cutoff=value;this.calculateFeedbackAmount();}
	setResonance(value){this.resonance=value;this.calculateFeedbackAmount();}
}
var f=new Filter(LOWPASS);
f.setResonance(.55);
function songSample(time){
	var master=0;
	time*=0.6746;
	var chord=[
		[ 2, 5, 9,12,24],//,29],
		[-2, 1, 4, 8,24],
		[ 1, 4, 8,11,24],//,28],
		[-5,-2, 0, 2,10,22],
		[-2, 0, 3,10,24],
		[ 0, 3, 7, 9,22],
		[-1, 3, 5,10,22],
		[ 2, 5, 9,12,22],
		[ 7,10,12,17,21]
	].read(time*2.5).map(x=>[0,0,0,2.85].read(time*.5)+x+3.7+(.3*prandom(floor(time*4))));
	for(var i=0;i<chord.length;i++){
		master+=saw(time*noteHz(37.1+chord[i]))/2;
		master+=saw(time*noteHz(36.9+chord[i]))/2;
		master+=tri(time*noteHz(25+chord[i]))/2;
	}
	f.setCutoff(mix(.01,.3,pow(1-fract((pow(fract(time*4),1.31)*2)),2)));
	master+=sin(45*exp(mod(time,.25)*-60))*10*pow(1-fract(time*4),25);
	return clamp(f.process(master/10),-.5,.5);//+(random(-1,1)*.1*pow(1-fract(time*8),90));
}
var what=[];
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
var startAt=random(0,100);
(async()=>{
	for(var i=0;i<sampleRate*10;i++){
		what.push(songSample((i/sampleRate)+startAt));
		if(i%7000===0){
			await sleep(10);
		}
	}
})();
function readDeclick(sample,time,samples){
	var l=sample.length,t=mod(time,l);
	return mix(
		sample.readSmooth(t),
		sample.readSmooth(t-l),
		max(0,(t-(l-samples))/samples)
	);
}
var declick=100;
function stretchRead(sample,time,chunkLength=1,step=1,speed=1){
	var fade=fract(time/chunkLength),
	    x=mod(time,chunkLength),
	    s=step*floor(time/chunkLength),
	    a=(x*speed)+step,b=a-((speed*chunkLength)-step);
	return mix(
		readDeclick(sample,a*sampleRate,declick),
		readDeclick(sample,b*sampleRate,declick),
		fade
	);
}
var mf=[new Filter(LOWPASS),new Filter(LOWPASS)];
mf.forEach(x=>{x.setCutoff(.07);x.setResonance(.7);});
function buildSample(time){
	var master=[0,0];
	if(what.length){
		for(var i=0;i<6;i++){
			//master[i%2]+=what.read((time+(i/4.5))*sampleRate*pow(2,mod(i,3)-1));
			master[i%2]+=stretchRead(
				what,
				time,
				.15+(i*.02),
				prandom(i+floor(time*(i+1)*.5))*.25,
				(1+(i%2))*[.8,.9,1,.78,.95,1.1].read((time*.52)+(i*.21))
			);
		}
	}
	return[mf[0].process(master[0]/2),mf[1].process(master[1]/2)];
}
