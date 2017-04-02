importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/c80855b132c29eab3e1f9c396a2a78d89b1bbe5f/TinyRave%2520functions.js");
var mySong = {
	melody: [[A_4],[A_4,D_4,E_4],[A_4,C_SHARP_4,E_4],[A_1,A_4,C_SHARP_4,E_4,E_5]],
	buildSample: function(time){
		var master=0;
		var m=mySong.melody.read(time);
		for(var i=0;i<m.length;i++){
			var e=m[i];
			master+=sine(time*e)*fract(-time);
			master+=tri(time*e*(floor((fract(time)*4))+1))*fract(-time*4)*clamps((time-8)/8);
		}
		return master/10;
	}
};
Array.prototype.stretchArray=function(to){
	var n=[];
	for(var i=0;i<to;i++){
		n.push(this.readIntervalSmooth(i/to));
	}
	return n;
};
var delaySettings = {
	lowres: 2,
	time: 1,
	feedback: 0.9,
	at: 0
};
var delay = {
	memory: createArray((delaySettings.time*SAMPLE_RATE)/delaySettings.lowres,0),
	mix: function(sound){
		delaySettings.at+=1/delaySettings.lowres;
		if(delaySettings.at>=delay.memory.length){
			delaySettings.at-=delay.memory.length;
			delay.memory=delay.memory.map(x=>x*delaySettings.feedback);
		}
		//return delay.memory[floor(delaySettings.at)]+=sound; //Not smooth when having lowres. We need interpolation between index.
		delay.memory[floor(delaySettings.at)]+=(sound*(1-fract(delaySettings.at)))/delaySettings.lowres;
		delay.memory[mod(floor(delaySettings.at)+1,delay.memory.length)]+=(sound*(fract(delaySettings.at)))/delaySettings.lowres;
		return delay.memory.readSmooth(delaySettings.at);
	},
	changeTime: function(newTime){
		delaySettings.at=delaySettings.at/(delaySettings.time/newTime);
		delaySettings.time=newTime;
		delay.memory=delay.memory.stretchArray((newTime*SAMPLE_RATE)/delaySettings.lowres);
	}
};
var frame=0;
function buildSample(time){
	frame++;
	var input=mySong.buildSample(time);
	if(frame%512===0){
		delay.changeTime((sin(time)+1.2)/10);
	}
	return delay.mix(input);
}
