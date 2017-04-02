//https://www.youtube.com/watch?v=3Z8CuAC_-bg
importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/acb278ad2cb662813166d7f04edbf053df1086fa/TinyRave%2520functions.js");

function noteToDecimal(string){ //For noteHz(x).
	string=string.replace(/\s/g,"");
	var a="CDEFGAB";
	var b=a.indexOf(string[0].toUpperCase());
	var c;
	if(string.indexOf("#")>-1){//Is sharp?
		c=[1,3,undefined,6,8,1,undefined][b];
	}else if(string.indexOf("b")>0){//Is flat? To avoid confusing note with "B", the index must be after the first letter.
		c=[undefined,1,3,undefined,6,8,10][b];
	}else{
		c=[0,2,4,5,7,9,11][b];
	}
	if(/\d/.test(string)){//Has a number for octave?
		c+=12*string.split(/ /)[0].replace(/[^\d]/g,'');
	}
	return c;
}

var beatSize=8, initalNote=noteToDecimal("E1"), initalLength=4*beatSize, secondLength=3*beatSize, tempo=120, loopLength=beatSize*8;
//Divide tempo by 60 to get it in seconds.
var recorded=[], at=0, timerMax=((60/tempo)/beatSize)*SAMPLE_RATE, timer=0, voices=[];
for(var i=0;i<loopLength;i++){
	recorded[i]=[];
}

/*
var loops=(loopLength*4)/beatSize;
for(var i=0;i<loops;i++){
	recorded[(i*beatSize)%recorded.length].push({note:i+12,duration:beatSize,volume:sin((i/loops)*PI)});
}
*/

var iterations=32,noteAt=initalNote,where=0;
for(var i=0;i<iterations;i++){
	var length=i%4<2?initalLength:secondLength;
	recorded[where%recorded.length].push({note:noteAt,duration:length,volume:1});
	recorded[(where+4)%recorded.length].push({note:noteAt+7,duration:length,volume:((i%4)+1)/2});
	where+=length;
	noteAt+=[2,2,1,2,2,2,1].read(i);
}

function cloneObject(obj){
	var copy={};
	for(var key in obj){
		if(obj.hasOwnProperty(key)){
			copy[key]=obj[key];
		}
	}
	return copy;
}

function buildSample(time){
	if(timer<=0){
		var voiceArray=recorded[at].map(e=>cloneObject(e));
		for(var i=0;i<voiceArray.length;i++){voiceArray[i].timer=voiceArray[i].duration;}
		voices=voices.concat(voiceArray); //Add voice
		at=(at+1)%recorded.length; //Next step
		timer=timerMax; //Reset timer
	}else{
		timer--;
	}
	var master=0;
	for(var i=0;i<voices.length;i++){
		if(voices[i].timer<=0){
			voices.splice(i,1);i--;
		}else{
			master+=sine(time*noteHz(voices[i].note))*(voices[i].timer/voices[i].duration)*voices[i].volume;
			voices[i].timer-=((tempo/60)*beatSize)/SAMPLE_RATE;
		}
	}
	master/=16;
	return master;
}
