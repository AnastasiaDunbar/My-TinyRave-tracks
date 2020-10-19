importScripts("https://gist.githack.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/b3f445b7cbdd083af8d9743c5b2550c8b1987061/TinyRave%20functions.js");
var strMatch=(s,r)=>(s.match(r)||[""])[0],
    objectMap=(o,f)=>Object.fromEntries(Object.entries(o).map(([k,v],i)=>[k,f(v,k,i)])),
    chordProgression=
    "4Abmaj7 4Bb7/Ab 4Gm7b5 4C7 4Fm7 4Ab/Eb 2D7 2D7/F# Gm7 Gbm7 Fm7 Bb7" //“Ah-Choo”
    //"4F 4F7/D# 4Dm7 2Aaug/C# 2F/C 2Bdim 2A# 7Dm Dm/E 4F6 4F7/Eb 4Dm9 2A7/Db 2Fmaj7/C 2Dm6/9/B 2Fmaj13/Bb 7Dmadd2 Dm/E" //“Im Nin'Alu”
    //"4Dbmaj7 4C7 2Fm 2Em7 2Ebm7 2Ab7 4Bbm7 4Eb7 4Abmaj7 4Fm7 3Fm6 Fm7/Ab 2G7 2Fdim7/B 2Cm7 2Bm7 2Bbm7 2Eb 4Gm 4C 4Fm7 2Ebm7 2Ab7/C"
    //"Bmaj7 D7 Gmaj7 Bb13 2Ebmaj7 Am9 D7 Gmaj9 Bb13 Ebmaj7 F#7 2Bmaj7 Fm7 Bb7 2Ebmaj7 Am7 D7 2Gmaj9 C#m7 F#13 2Bmaj7 Fm9 Bb13 2Ebmaj7 C#madd11 F#7" //“Giant Steps”
    //"3Amaj7/F# 5Dmaj7/B 3Dm9 5A#maj7 3D#maj7/C 5G#maj7/F 3Abm9/G# 5Amaj9/C#" //Something I made.
    //"4Fmaj7 4Am7 4Dm7 4F7 4Bbmaj7 4Am7 4Gm7 4C7"
    .split(/\s+/g).map(
	s=>{
		var object={},t=strMatch(s,/^\d+/);object.length=+t||1;
		s=s.slice(t.length);
		t=strMatch(s,/^[A-G][b#]?/);object.note=t;
		s=s.slice(t.length);
		t=strMatch(s,/^([a-z0-9#]|\/[0-9])+/);object.chord=t;
		s=s.slice(t.length);
		if(/^\/[A-G][b#]?$/.test(s)){
			object.slash=strMatch(s,/[A-G][b#]?$/);
		}
		return object;
	}
),chords=objectMap({
	"":[4,7], //major
	m:[3,7], //minor
	aug:[4,8],
	augsus4:[5,8],
	b5:[4,6],
	dim:[3,6],mb5:[3,6],
	sus2:[2,7],
	sus4:[5,7],
	sus24:[2,5,7],
	add2:[2,4,7],add9:[4,7,14],
	add4:[4,5,7],add11:[4,7,17],
	madd2:[2,3,7],madd9:[3,7,14],
	madd4:[3,5,7],madd11:[3,7,17],
	5:[7],
	6:[4,7,9],
	m6:[3,7,9],
	m69:[3,7,9,14],"m6/9":[3,7,9,14],
	69:[4,7,9,14],"6/9":[4,7,9,14],
	7:[4,7,10],dom7:[4,7,10],
	maj7:[4,7,11],
	m7:[3,7,10],
	m7add11:[3,7,10,17],
	maj7b5:[4,6,11],
	m7b5:[3,6,10], //half-diminished
	m7b9:[1,3,7,10],
	m7b13:[3,7,8,10],
	dim7:[3,6,9],
	maj7sus2:[2,7,11],
	maj7sus4:[5,7,11],
	"maj7#11":[4,7,11,18],
	"7sus2":[2,7,10],
	"7sus4":[5,7,10],
	mmaj7:[3,7,11],"m#7":[3,7,11],
	"7#5":[4,8,10],"9#5":[4,8,14],
	"7b9":[4,7,10,13],
	"7#9":[4,7,10,15],
	9:[4,7,10,14],
	maj9:[4,7,11,14],
	m9:[3,7,10,14],
	"9sus4":[5,7,10,14],
	"9b5":[4,6,10,14],
	11:[4,7,10,14,17],
	m11:[3,7,10,14,17],
	13:[4,7,10,14,21],
	maj13:[7,11,14,16,21]
},x=>[0].concat(x));
function findChords(notes){
	if(!(Array.isArray(notes)&&notes.length>0)){return[];}
	var minimum=Math.min(...notes),out=[];
	notes=notes.map(x=>(x-minimum)%12);
	for(var key in chords){
		var chord=chords[key].map(x=>x%12);
		if(notes.length!==chord.length){continue;}
		for(var i=0;i<chord.length;i++){
			if(notes.every(x=>chord.includes(x))){
				out.push(key);break;
			}
			chord=chord.map((x,i)=>mod(x-chord[1],12)); //The inversion could give the same notes.
		}
	}
	return out;
}
//noteHz(49) is A4, 37 is A3, 25 is A2, 13 is A1, 1 is A0, 0 is G#0.
var noteToNum=s=>({A:0,B:2,C:3,D:5,E:7,F:8,G:10}[s[0]])+({b:-1,"#":1}[s[1]]||0)+1,bpm=120,timer={value:0,i:0,end:chordProgression[0].length},
chordRange=36,bassRange=8;
function noteToRange(n,r){return mod(n-r,12)+r;}
function buildSample(time){
	var master=[0,0];
	var a=chordProgression[timer.i];
	var chord=chords[a.chord];
	for(var i=0;i<chord.length;i++){
		master[i%2]+=saw(noteHz(noteToRange(noteToNum(a.note)+chord[i],chordRange))*time);
	}
	master[(1+floor(timer.value*8))%2]+=saw(noteHz(36+noteToNum(a.note)+chord[floor(timer.value*8)%chord.length]+[0,12].read(timer.value*2))*time)/2;
	var t=saw(noteHz(noteToRange(noteToNum(a.slash||a.note),bassRange)+[0,12].read(timer.value*2))*time);
	t+=pulse(noteHz(48+noteToNum(a.note)+chord.read([0,2,1,3].read(floor(timer.value*2))))*time)/2;
	master[0]+=t;master[1]+=t;
	timer.value+=(bpm/60)/sampleRate;
	if(timer.value>=timer.end){
		timer.value-=timer.end;
		timer.i=mod(timer.i+1,chordProgression.length);
		timer.end=chordProgression[timer.i].length;
	}
	return[master[0]*.05,master[1]*.05];
}
