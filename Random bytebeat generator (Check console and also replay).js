/*
	Interesting stuff that came out of this:
	mod(t,(((t-(mod(t,t)*962))^((t+(16<<t))*((t<<16)&(t+t))))|(t^(((t/421)|(t*32))&((t<<16)+(t/16))))));
	(((t-mod((mod(t,t)|32),(4<<(t/t))))^(t+((t<<32)/(2*16))))|8);
	(t^(mod(((4>>(t&t))+t),622)+(8>>t)));
	((32^23)/mod((((16/t)*((t>>8)/(t|32)))+(t&((t<<t)<<t))),(t+(mod(mod(t,t),8)>>mod(t,8)))));
	(t*(mod(t,(32+((t&8)>>(t|977))))/((((16*t)^(t-t))&t)-(((t>>t)<<(149/330))*(t^t)))));
*/
function mod(a,b){return((a%b)+b)%b;}
function fract(x){return((x%1)+1)%1;}
function clamp(a,b,c){return Math.min(Math.max(a,b),c);}
function mix(a,b,c){return(c*(b-a))+a;}
function curveSmooth(x,a){var b=Math.pow(x*2,a)/2;if(x>.5){b=1-Math.pow(2-(x*2),a)/2;}return b;}
var operators=[
	{call:(a,b)=>a+b,toString:(a,b)=>`(${a}+${b})`},
	{call:(a,b)=>a-b,toString:(a,b)=>`(${a}-${b})`},
	{call:(a,b)=>a*b,toString:(a,b)=>`(${a}*${b})`},
	{call:(a,b)=>a/b,toString:(a,b)=>`(${a}/${b})`},
	
	{call:(a,b)=>a&b,toString:(a,b)=>`(${a}&${b})`},
	{call:(a,b)=>a|b,toString:(a,b)=>`(${a}|${b})`},
	{call:(a,b)=>a^b,toString:(a,b)=>`(${a}^${b})`},
	
	{call:(a,b)=>a>>b,toString:(a,b)=>`(${a}>>${b})`},
	{call:(a,b)=>a<<b,toString:(a,b)=>`(${a}<<${b})`},
	
	{call:(a,b)=>a<<b,toString:(a,b)=>`mod(${a},${b})`}
	
	/*
	{call:x=>Math.sin(x),toString:x=>`Math.sin(${x})`},
	{call:x=>Math.tan(x),toString:x=>`Math.tan(${x})`},
	{call:(a,b)=>a>b,toString:(a,b)=>`(${a}>${b})`},
	{call:(a,b)=>a<b,toString:(a,b)=>`(${a}<${b})`},
	{call:(a,b)=>a>=b,toString:(a,b)=>`(${a}>=${b})`},
	{call:(a,b)=>a<=b,toString:(a,b)=>`(${a}<=${b})`},
	{call:(a,b,c)=>a?b:c,toString:(a,b,c)=>`(${a}?${b}:${c})`}
	*/
];
function makeNumber(){return Math.random()<.2?1+Math.floor(Math.random()*1024):Math.pow(2,1+Math.floor(Math.random()*5));}
function makeExpression(depth,variables){ //Recursion, amount of variables.
	var op=operators[Math.floor(Math.random()*operators.length)],args=[];
	for(var i=0;i<op.call.length;i++){
		var choose=Math.min(Math.floor(Math.random()*5),2);
		if(depth<=0&&choose==2){choose=variables<1?0:1;}
		switch(choose){
			case 0:
			args.push({type:"number",value:makeNumber()});
			break;
			case 1:
			args.push({type:"variable",value:Math.floor(Math.random()*variables)});
			break;
			case 2:
			args.push(makeExpression(depth-1,variables));
			break;
		}
	}
	return{type:"operator",value:op,arguments:args};
}
function stringifyExpression(object,variables){ //Expression, [strings...].
	switch(object.type){
		case"operator":
		return object.value.toString(...object.arguments.map(x=>stringifyExpression(x,variables)));
		case"number":
		return""+object.value;
		case"variable":
		return variables[object.value];
	}
}
function evaluateExpression(object,variables){ //Expression, [values...].
	switch(object.type){
		case"operator":
		return object.value.call(...object.arguments.map(x=>stringifyExpression(x,variables)));
		case"number":
		return object.value;
		case"variable":
		return variables[object.value];
	}
}
var myExpression;
/*
	Just so you know, doing this instead of using `eval` is much slower:
		var myExpression=makeExpression(5,1);
		function bytebeat(t){return evaluateExpression(myExpression,[t]);}
*/
eval("myExpression=t=>"+stringifyExpression(makeExpression(5,1),["t"])+";");
console.log(myExpression.toString());
function bytebeat(t){
	return myExpression(t);
}
var sampleRate=8000,volume=.6,linearInterpolation=true,crispiness=4; //[default=8000,11000,22000,32000,44000],0 to 1,[false,true],1 to +Infinity.
function buildSample(time){
	var music=x=>(fract(Math.floor(bytebeat(x))/256)*2)-1,
	    out=linearInterpolation
	    ?mix(music(Math.floor(time*sampleRate)),music(Math.floor(time*sampleRate)+1),curveSmooth(fract(time*sampleRate),crispiness))
	    :music(Math.floor(time*sampleRate));
	return isFinite(out)?out*volume:0;
}
