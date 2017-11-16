var buildSample=function(time){return Math.random();};
fetch("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/f9bd534370edf68df52942e4c9afd41b29ca53ea/TinyRave%2520functions.js").then(response=>{response.text().then(script=>{
	eval(script);
	buildSample=function(time){
	for(var master=0,loops=3,speed=6,i=0;i<loops;i++){
		master+=([sine,saw,tri,pulse].read(time*(2**i)/4))(time*[1,3,6,4,8,6,7,10].read(time*speed*(2**i))*50)*(1-fract(time*speed));
	}
		return master/loops;
	};
});});
