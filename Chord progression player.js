importScripts("https://gist.githack.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/b3f445b7cbdd083af8d9743c5b2550c8b1987061/TinyRave%20functions.js");
var strMatch=(s,r)=>(s.match(r)||[""])[0],
    objectMap=(o,f)=>Object.fromEntries(Object.entries(o).map(([k,v],i)=>[k,f(v,k,i)])),
    chordProgression=
    "4F#m7 2B7 2A7/B 2Em7b5 2Gsus#2#4/E 2Aadd9 2Gdim7" //Nostalgic chord progression.
    //"4Gmaj7 2Cmaj7 Em7/B Cmaj7sus2/D 4Am9 2Dsus4 2D/C 4Bm7 4Cmaj9/E 4Am9 4D" //Nostalgic chord progression.
    //"2Ebmaj7 2Gm7/Eb 2Dm7 2Gm7 2Eb/C 2Gm/C 2F Eb/F F" //Something I made, kept at a distance from the real thing.
    //"2Bmmaj9/13/F# 2A#m7b6b11/D 2Faug6#4/C# 2C#7b9/A# 4F#maj9 4D#m11" //Forgotten assembly.
    //"4Gm11/C 4Ebm11/Ab 4Fm11 4Bbm11 4Am11 4Em11 4Dm11 4G13sus4" //Something I made.
    //"4B69 4F#6/C# 4A#m11 4F#m9/A 4Dmaj13 4D#m9 4Bmaj9/6/G#" //Something I made.
    //"4Cmaj7 4D7/C 4Bm7 4Em7 4F#m7b5/A 2B7b5 2B7 2G69/E 2Em7 2Dm9 2G9 4C#m7b5 4Cm#7 3Bm7 5Em7 6Am9 2Am9/E 8D13 4Gadd9 2.5G6 1.5C#7b5" //“馬鹿みたい”
    //"4Fmaj7 4Am7 4Dm7 4F7 4Bbmaj7 4Am7 4Gm7 4C7" //Common chord progression.
    //"3A#maj7 1Gm7/A# 2C 2Gm6 4Am7 4Dm" //Common chord progression.
    //"2Dmaj7 2B7 2Em7 2A7#5 2Dmaj9 2B9 2Em9 2A9#5" //Common chord progression.
    //"2Dm 2C 2Bb 2F 2Gm7 2C7 2Fmaj7 2F7 2Bbmaj7 2Bbdim7 2Am7 2Abdim7 2Gm7 2Edim7 2Asus4 2A 6Bbmaj7 2A7#9 4Dm9 2Cm7 2F7 6Bbmaj7 2A7#5 8Dm 6Bbmaj7#11 2A7#9 4Dm9 2Cm 2F7 6Bbmaj7#11 2A7#5 6Dm 2A7#5" //“i” by x髥莏
    //"4Abmaj7 4Bb7/Ab 4Gm7b5 4C7 4Fm7 4Ab/Eb 2D7 2D7/F# Gm7 Gbm7 Fm7 Bb7" //“Ah-Choo”
    //"4F 4F7/D# 4Dm7 2Aaug/C# 2F/C 2Bdim 2A# 7Dm Dm/E 4F6 4F7/Eb 4Dm9 2A7/Db 2Fmaj7/C 2Dm6/9/B 2Fmaj13/Bb 7Dmadd2 Dm/E" //“Im Nin'Alu”
    //"4Dbmaj7 4C7 2Fm 2Em7 2Ebm7 2Ab7 4Bbm7 4Eb7 4Abmaj7 4Fm7 3Fm6 Fm7/Ab 2G7 2Fdim7/B 2Cm7 2Bm7 2Bbm7 2Eb 4Gm 4C 4Fm7 2Ebm7 2Ab7/C"
    //"Bmaj7 D7 Gmaj7 Bb13 2Ebmaj7 Am9 D7 Gmaj9 Bb13 Ebmaj7 F#7 2Bmaj7 Fm7 Bb7 2Ebmaj7 Am7 D7 2Gmaj9 C#m7 F#13 2Bmaj7 Fm9 Bb13 2Ebmaj7 C#madd11 F#7" //“Giant Steps”
    //"4D#maj9 2A#69/D 2A#69/G 4D69/F# 2Dmaj9/B 2G69/E 4G69/A 4A69/D 2Amaj13/C# 2F#m11 1C#add9/F 1C#9sus4/F 2C#11/F 2A#m9 4C#69/D# 4Amaj7/F" //“Gotta Be Another Way”
    //"1Am9/C 1Am9/A# 2Am11 2Emaj9/6/G# 1C#69/G# 1C#69 1C#69/F .5C#69/A# 2.5D69/B 2C69/A 2C6" //“Gotta Be Another Way”
    //"3Amaj7/F# 5Dmaj7/B 3Dm9 5A#maj7 3D#maj7/C 5G#maj7/F 3Abm9/G# 5Amaj9/C#" //Something I made.
    //"4Gmaj9/E 4C9/13/D 4Dmaj7/9/B 2Amaj7/9/F# 2F#m6/9/11" //Something I made.
    //"4Emaj7/9 4Gdim7b9/Bb 4A69 4B9" //Something I made.
    //"4Em7 3A7/F# Dadd9 4Dadd9/A 2Am7/G 2D7/A" //Something I made.
    //"4Bm11 4Eadd9 2Am7b5b9 2Am9 2D9 2D11/C" //Something I made.
    .split(/\s+/g).map(
	s=>{
		var object={},t=strMatch(s,/^(\d*\.)?\d+/);object.length=+t||1;
		s=s.slice(t.length);
		t=strMatch(s,/^[A-G][b#]?/);object.note=t;
		s=s.slice(t.length);
		t=strMatch(s,/^([a-z0-9#()+]|\/[0-9]+)+/);object.chord=t;
		s=s.slice(t.length);
		if(/^\/[A-G][b#]?$/.test(s)){
			object.slash=strMatch(s,/[A-G][b#]?$/);
		}
		return object;
	}
),chords=objectMap({
	"":[4,7], //major
	m:[3,7], //minor
	aug:[4,8],"+":[4,8],
	augsus4:[5,8],
	"(b5)":[4,6],majb5:[4,6],
	dim:[3,6],mb5:[3,6],
	sus2:[2,7],
	sus4:[5,7],
	sus24:[2,5,7],
	"sus#2#4":[3,6,7],
	add2:[2,4,7],add9:[4,7,14],
	add2b6:[2,4,7,8],
	add4:[4,5,7],add11:[4,7,17],
	madd2:[2,3,7],madd9:[3,7,14],
	madd4:[3,5,7],madd11:[3,7,17],
	add24:[2,4,5,7],
	"5":[7],
	"6":[4,7,9],
	"6add9":[4,7,9,14],
	"6sus4":[5,7,9],
	"6/9sus4":[5,7,9,14],
	m6:[3,7,9],
	mb6:[3,7,8],
	m6add9:[3,7,9,14],
	m69:[3,7,9,14],"m6/9":[3,7,9,14],
	"69":[4,7,9,14],"6/9":[4,7,9,14],
	"m6/9/11":[3,7,9,10,14,17],
	"6/11":[4,5,7,9],
	aug6:[4,8,9],
	"aug6#4":[4,6,8,9],
	"7":[4,7,10],dom7:[4,7,10],
	maj7:[4,7,11],
	"maj7/9":[4,7,11,14],
	m7:[3,7,10],
	m7add11:[3,7,10,17],m7add4:[3,5,7,10],
	m7add13:[3,7,10,21],
	maj7b5:[4,6,11],
	m7b5:[3,6,10], //half-diminished
	"m7#5":[3,8,10],
	m7b5b9:[3,6,10,13],
	m7b9:[1,3,7,10],
	m7b13:[3,7,8,10],m7b6:[3,7,8,10],
	"m7/6":[3,7,9,10],
	m7b6b11:[3,4,7,8,10],
	"7/6":[4,7,9,10],
	dim7:[3,6,9],tri:[3,6,9],
	"dim7b9":[1,3,6,9],
	dim9:[3,6,10,14],
	dimmaj7:[3,6,11],
	dimmaj9:[3,6,11,14],
	dimmaj11:[3,5,6,11],
	dimmaj13:[3,6,9,11],
	maj7sus2:[2,7,11],
	maj7sus4:[5,7,11],
	"maj7#5":[4,8,11],maj7aug5:[4,8,11],"maj7+5":[4,8,11],
	"maj7#5/6":[4,8,9,11],"maj7#5add6":[4,8,9,11],
	"maj7#5/6#11":[4,6,8,9,11],"maj7#5add6#11":[4,6,8,9,11],
	"maj7#11":[4,7,11,18],
	"maj7#5#9":[4,8,11,15],
	"maj7#5#9#11":[4,6,8,11,15],
	"maj7#9#11":[4,6,7,11,15],
	"maj7/6":[4,7,9,11],maj7add13:[4,7,11,21],
	"maj7b6":[4,7,8,11],
	"maj7b6/9":[4,7,8,11,14],
	"maj7b9":[4,7,11,13],
	"7sus2":[2,7,10],
	"7sus4":[5,7,10],
	mmaj7:[3,7,11],"m#7":[3,7,11],
	mmaj7add11:[3,7,11,17],
	mmaj7add13:[3,7,11,21],
	"7b5":[4,6,10],
	"7b5b9":[4,6,10,13],
	"7#5":[4,8,10],aug7:[4,8,10],"7aug5":[4,8,10],
	"7#5b9":[4,8,10,13],"7aug5b9":[4,8,10,13],
	"7#5#9":[4,8,10,15],"7aug5#9":[4,8,10,15],
	"7b9":[4,7,10,13],
	"7#9":[4,7,10,15],
	"7#9#11":[4,7,10,15,18],
	"7b9b13":[4,7,8,10,13],
	"7#9b13":[4,7,8,10,15],"7b13#9":[4,7,10,15,20],
	"7b9#9":[4,7,10,13,15],
	"7add4":[4,5,7,10],
	"7add11":[4,7,10,17],
	"7#11":[4,7,10,18],
	"7#11b9":[4,7,10,13,18],
	"7add13":[4,7,10,21],
	"9":[4,7,10,14],
	maj9:[4,7,11,14],
	"maj9#5":[4,8,11,14],
	"maj9#11":[4,7,11,14,18],
	maj9sus4:[5,7,11,14],
	"maj9/6":[4,7,9,11,14],"maj9add6":[4,7,9,11,14],"maj9/13":[4,7,11,14,21],"maj9add13":[4,7,11,14,21],
	"maj9/11":[2,4,5,7,11],
	m9:[3,7,10,14],
	"m9/11":[3,5,7,10,14],
	m9b5:[3,6,10,14],
	"9/13":[4,7,9,10,14],"9add13":[4,7,9,10,14],
	"m9/13":[2,3,7,9,10],
	"9sus4":[5,7,10,14],
	mmaj9:[3,7,11,14],m9maj7:[3,7,11,14],
	"mmaj9/13":[3,7,9,11,14],"mmaj9add13":[3,7,9,11,14],
	"9b":[4,7,10,13],
	"9#":[4,7,10,15],
	"9b5":[4,6,10,14],
	"9#5":[4,8,10,14],
	"9#11":[4,7,10,14,18],
	"9b13":[4,7,10,14,20],
	"11":[4,7,10,14,17],
	maj11:[4,7,11,14,17],
	m11:[3,7,10,14,17],
	"11b9":[4,7,10,13,17],
	mmaj11:[3,7,11,14,17],
	"13":[4,7,10,14,21],
	"13#11":[4,7,10,14,18,21],
	"13add11":[4,7,10,14,17,21],
	"13sus4":[5,7,10,14,21],
	"13b9":[4,7,10,13,21],
	"13#9":[4,7,10,15,21],
	"13b5b9":[4,6,10,13,21],
	maj13:[7,11,14,16,21],
	"maj13#11":[4,7,11,14,18,21],
	m13:[3,7,10,14,21],
	mmaj13:[3,7,11,14,21]
},x=>[0].concat(x));
function findChords(notes){
	//TODO: Detect key.
	
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
var pitchShift=0,
noteToNum=s=>({A:0,B:2,C:3,D:5,E:7,F:8,G:10}[s[0]])+({b:-1,"#":1}[s[1]]||0)+1+pitchShift,bpm=115,timer={value:0,i:0,end:chordProgression[0].length},
chordRange=36,bassRange=8;
function noteToRange(n,r){return mod(n-r,12)+r;}
function buildSample(time){
	var master=[0,0];
	var current=chordProgression[timer.i],chord=chords[current.chord],t=time*(bpm/60);
	for(var i=0;i<chord.length;i++){
		master[i%2]+=saw(noteHz(noteToRange(noteToNum(current.note)+chord[i],chordRange))*time);
	}
	master[(1+floor(timer.value*8))%2]+=saw(noteHz(36+noteToNum(current.note)+chord.read(timer.value*8)+[0,12].read(timer.value*2))*time)/2;
	var add=saw(noteHz(noteToRange(noteToNum(current.slash||current.note),bassRange)+[0,12].read(t*2))*time),
	    arp=chord.map(x=>noteToRange(noteToNum(current.note)+x,48));
	arp.sort((a,b)=>a-b);
	add+=pulse(noteHz(arp.read([0,0,3,3,2,2,1,2,3,4,3,2,1,1,2,2].read(floor(t))))*time)/2;
	//add+=pulse(noteHz(48+noteToNum(current.note)+chord.read([0,2,1,3].read(floor(timer.value*2))))*time)/2;
	master[0]+=add;master[1]+=add;
	timer.value+=(bpm/60)/sampleRate;
	if(timer.value>=timer.end){
		timer.value-=timer.end;
		timer.i=mod(timer.i+1,chordProgression.length);
		timer.end=chordProgression[timer.i].length;
	}
	return[master[0]*.05,master[1]*.05];
}
