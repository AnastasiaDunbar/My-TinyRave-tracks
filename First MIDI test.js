importScripts("https://gist.githubusercontent.com/AnastasiaDunbar/d75e19d93a5c439d8185343f1fd54da1/raw/9d3a58c7e47eac587e45f657ac5afebb178ac867/TinyRave%2520functions.js");
//[note,vel,start,end]
var melody=[[52,100,0.2142855,0.32142825],[55,100,0.32142825,0.428571],[64,100,0.428571,1.0714275],[62,100,1.0714275,1.4999985],[59,100,1.4999985,1.714284],[60,100,1.714284,1.9285695],[48,100,1.714284,2.142855],[55,100,1.714284,2.3571405],[64,100,1.9285695,2.571426],[71,100,2.142855,2.7857115],[72,100,2.3571405,2.999997],[71,100,2.571426,2.999997],[64,100,2.7857115,2.999997],[52,100,2.999997,3.2142825],[45,100,2.999997,3.428568],[57,100,2.999997,3.6428535],[64,100,3.2142825,3.857139],[71,100,3.428568,4.0714245],[72,100,3.6428535,4.28571],[71,100,3.857139,4.28571],[74,100,4.0714245,4.28571],[62,100,4.28571,4.4999955],[50,100,4.28571,4.714281],[57,100,4.28571,4.9285665],[74,100,4.4999955,5.142852],[77,100,4.714281,5.3571375],[74,100,4.9285665,5.571423],[71,100,5.142852,5.571423],[62,100,5.3571375,5.571423],[55,100,5.571423,5.999994],[43,100,5.571423,6.2142795],[59,100,5.7857085,6.428565],[64,100,5.999994,6.6428505],[69,100,6.2142795,6.857136],[67,100,6.428565,6.857136],[71,100,6.6428505,6.857136],[60,100,6.857136,7.0714215],[48,100,6.857136,7.285707],[55,100,6.857136,7.4999925],[64,100,7.0714215,7.714278],[71,100,7.285707,7.9285635],[72,100,7.4999925,8.142849],[71,100,7.714278,8.142849],[64,100,7.9285635,8.142849],[52,100,8.142849,8.3571345],[45,100,8.142849,8.57142],[57,100,8.142849,8.7857055],[64,100,8.3571345,8.999991],[71,100,8.57142,9.2142765],[72,100,8.7857055,9.428562],[71,100,8.999991,9.428562],[74,100,9.2142765,9.428562],[57,100,9.428562,9.6428475],[50,100,9.428562,9.857133],[62,100,9.428562,10.0714185],[74,100,9.6428475,10.285704],[77,100,9.857133,10.4999895],[74,100,10.0714185,10.714275],[71,100,10.285704,10.714275],[62,100,10.4999895,10.714275],[52,100,10.714275,10.9285605],[64,104,10.714275,11.142846],[41,100,10.714275,11.3571315],[62,104,10.9285605,11.3571315],[59,104,11.142846,11.571417],[50,100,11.3571315,11.7857025],[67,104,11.3571315,11.999988],[59,104,11.571417,11.999988],[60,104,11.7857025,11.999988],[36,100,11.999988,13.714272],[60,100,11.999988,13.714272],[48,100,11.999988,13.714272]];
var speed = 1.5;
var tone = .25;

function wave(time,freq,dur) {
  return tri(time*freq)*exp(-(time*2))*pow(1-(time/dur),.1);
}

function buildSample(time) {
  var out = 0;
  //var deletelist = [];
  for(var i=0;i<melody.length;i++){
    if (time>=melody[i][2]*speed && time<melody[i][3]*speed) {
      var t = time-(melody[i][2]*speed);
      out += (wave(t,noteHz(melody[i][0])*tone,(melody[i][3]-melody[i][2])*speed)*melody[i][1])/100;
    }
    //if (time>melody[i][3]*speed) { deletelist.push(i); }
  }
  /*for (var i=deletelist.length-1;i>=0;i--) {
    melody.splice(deletelist.pop(),1);
  }*/
  return out/4;
}

/*
import mido
filename = 'yourMidi.mid'
t = ['note_off','note_on']
time = 0
stack = []
print('//[note,vel,start,end]')
array_name = "melody"
s = 'var '+array_name+'=['
for message in mido.MidiFile(filename).play():
    time += message.time
    if(t.index(message.type)): #Note on
        stack.append('['+str(message.note)+','+str(message.velocity)+','+str(time)+',')
    else: #Note off
        s += stack.pop(0)+str(time)+'],'
print(s[:-1]+'];')
*/