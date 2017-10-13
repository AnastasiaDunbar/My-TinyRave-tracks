//Aphex Twin bouncer delay
function fract(x){return((x%1)+1)%1;}
function mod(a,b){return((a%b)+b)%b;}
function mix(a,b,c){return(c*(b-a))+a;}
function clamp(a,b,c){return Math.min(Math.max(a,b),c);}
function clamps(x){return clamp(x,0,1);}
/* desmos.com/calculator/l53sj0xcqk
 __ L        /    n\   (L + 1)(2S * T - SL + EL)
\         mix|S,E,-| = -------------------------
/__ n = 0    \    T/              2T
*/
var bouncer={
	start:10,
	end:.5e4,
	taps:20
};
bouncer.position=loops=>{return((loops+1)*((2*bouncer.start)*bouncer.taps-(bouncer.start*loops)+(bouncer.end*loops)))/(2*bouncer.taps);};
bouncer.sample=[];
for(var i=0;i<Math.floor(bouncer.position(bouncer.taps-1))+1;i++){bouncer.sample[i]=0;}
bouncer.effect=input=>{
	bouncer.sample.pop();
	bouncer.sample.unshift(input);
	for(var sum=input,i=0;i<bouncer.taps;i++){
		sum+=bouncer.sample[Math.floor(bouncer.position(i))]*(1-((i+1)/(bouncer.taps+1))); //1-((a+1)/(b+1))=(b-a)/(b+1)
	}
	return sum;
};
function buildSample(time){
	var master=0;
	master+=Math.sin(time*6e3)*Math.max(0,1-(fract(time)*90))*.5;
	master=bouncer.effect(master);
	return master;
}
