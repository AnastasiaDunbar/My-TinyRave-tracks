importScripts("https://gist.githack.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/b3f445b7cbdd083af8d9743c5b2550c8b1987061/TinyRave%20functions.js");
/* The triads (three note chords) of the seven modern modes:
Ionian (major):          I,  ii,  iii,  IV,   V,  vi,  vii°.
Dorian:                  i,  ii,  bIII, IV,   v,  vi°, bVII.
Phrygian:                i,  bII, bIII, iv,   v°, bVI, bvii.
Lydian:                  I,  II,  iii,  ♯iv°, V,  vi,  vii.
Mixolydian:              I,  ii,  iii°, IV,   v,  vi,  bVII.
Aeolian (natural minor): i,  ii°, bIII, iv,   v,  bVI, bVII.
Locrian:                 i°, bII, biii, iv,   bV, bVI, bvii.
*/
var whites=[2,2,1,2,2,2,1], //or intervals.
    mode=0,modes=[],tonic=39,
    degree=0; //tonic, supertonic, mediant, subdominant, dominant, submediant, subtonic/leading tone.
for(var i=0;i<7;i++){modes.push(whites.rotate(i));} //Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian.
var mods=(x,y,s)=>((((x-s)%y)+y)%y)+s;
function buildSample(time){
  var master=0,s=1.5;
  //degree=mod(floor(time*s),8);
  
  //Circle progression.
  degree=mods(mod(floor(time*s),8)*3,7,-3);
  mode=floor((time*s)/8)*5;
  
  //I–V–vi–IV progression (Ionian).
  //degree=[0,4,5,3].read(time*s);
  
  //Royal Road (王道進行) (Ionian): IVΔ7→V7→IIIm7→VIm… +(IIm, Vm, I)
  //degree=[3,4,2,5,1,4,0,0].read(time*s);
  //master+=saw(time*noteHz(tonic+[0,0,2,0,-1,-1,4,4,-3,-3,2,2,0,0,-2,-2].read(time*s*2)))*3;
  //master+=saw(time*noteHz(tonic+[-3,-3,-4,-4,-5,-5,0,-8,-7,-7,-10,-10,-8,-8,-8,-8].read(time*s*2)))*2;
  
  //Pachelbel's Canon (Ionian): I→V→vi→iii→IV→I→IV→V.
  //tonic=30;degree=[0,4,5,2,3,0,3,4].read(time*s);
  
  //Testing…
  //mode  =[0,1,2,3,4,4,5,2,4,4,0,0,6,5,5,3,3,4,1].read(time*s);
  //degree=[0,1,1,3,4,5,5,8,8,4,2,5,5,4,7,6,9,5,8].read(time*s);
  
  var m=modes.read(mode);
  master+=saw(time*noteHz(tonic+cyclicSum(m,degree)-(12*(1+mod(floor(time*s*2),2)))))*2; //Bass.
  for(var i=0;i<3;i++){
    master+=saw(time*noteHz(tonic+cyclicSum(m,degree+(i*2))));
  }
  return master/30;
}
