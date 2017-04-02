//Thought of this when thinking about self-convolution reverb.
importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/c80855b132c29eab3e1f9c396a2a78d89b1bbe5f/TinyRave%2520functions.js");
//Balance waveform so it stays on the center.
//Lower the volume if it's too loud.
//Basically should prevent loudness.
//---//
function inputSample(time) {
	return(sine(time*500)*mix(0.2,3,(sin(time)+1)/2))+(sin(time/2)*4);
}
//---//
var balance={
	cv:0, //Center value
	cm:0.01, //Center mix
	mm:0.01, //Volume mix
	
	min:-1, //Minimum
	max:1, //Maximum
	mov:0.0001, //Move
	spc:1 //Spacing, to avoid stretching out quiet very loudly
};
function buildSample(time){
	var input=inputSample(time);
	balance.cv=mix(balance.cv,input,balance.cm);
	input-=balance.cv;
	balance.min=min(input-balance.spc,mix(balance.min+balance.mov,min(balance.min,input),balance.mm));
	balance.max=max(input+balance.spc,mix(balance.max-balance.mov,max(balance.max,input),balance.mm));
	return mix(-1,1,invMix(balance.min,balance.max,input));
	//Comment out everything inside here, and put `return inputSample(time)` to hear without normalizer.
}
