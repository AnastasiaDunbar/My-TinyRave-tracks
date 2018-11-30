importScripts("https://gist.githack.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/7d36c57a334fd410c703d7a705236254670077d7/TinyRave%20functions.js");
var m=[
	[26,30,33,38,47],
	[26,30,33,38,40],

	[25,31,33,37,47],
	[25,31,33,37,45],

	[24,30,33,36,43],
	[24,30,33,36,40],

	[23,29,33,35,41],
	[23,29,33,35,45],

	[23,27,33,35,40],
	[23,27,33,35,44],

	[23,28,32,35,47],
	[23,28,32,35,40],

	[23,26,31,34,47],
	[23,26,31,34,45],

	[23,24,30,36,47],
	[23,24,30,36,40,52]
],t={
	init:1.1,
	value:0,
	at:0
},voices=[];
function buildSample(time){
	var master=0;
	t.value+=1/sampleRate;
	if(t.value>=t.init){
		t.value-=t.init+(1/sampleRate);
		for(var i=0;i<6+(Math.random()*5);i++){
			voices.push({
				pitch:noteHz(6.4+m.read(Math.min(t.at,8+mod(t.at,8))).readInterval(Math.random())+((Math.random()-.5)/3)),
				duration:3.7+Math.random(),
				time:0,
				fadeIn:.01+(Math.random()*.2)
			});
		}
		t.at++;
	}
	for(var i=voices.length-1;i>=0;i--){
		master+=((fractSmooth(voices[i].pitch*voices[i].time,.09)*2)-1)*Math.pow(1-(voices[i].time/voices[i].duration),.5)*Math.min(1,voices[i].time/voices[i].fadeIn);
		voices[i].time+=1/sampleRate;
		if(voices[i].time>=voices[i].duration){
			voices.splice(i,1);
		}
	}
	return master/11;
}