//start new audio session. Do this only once
var context = new (window.webkitAudioContext || window.AudioContext || window.mozAudioContext)

var compressor = context.createDynamicsCompressor();
	compressor.threshold.value = -24;
	compressor.knee.value = 40;
	compressor.ratio.value = 12;
	compressor.reduction.value = -20;
	compressor.attack.value = 0;
	compressor.release.value = 0.25;
	compressor.connect(context.destination);


//main function for crearing sound
function playSound(note, time) {
	oscillator = context.createOscillator();
	
	//create volume controller
	var gainNode = context.createGain();
	
	//connect signal to audio to gain; gain to compressor (compressor to output)
 	oscillator.connect(gainNode);
 	gainNode.connect(compressor); 	
 	
 	//adjusts frequency played by 50%, 100% or 200% 
	var octave = document.getElementById('octave').value;

	//sets oscillator frequency
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	//oscillator wave type
 	oscillator.type = document.getElementById('waveSelect').value;

 	
 	//initialize gain at 0 and ramp up to full volume very quikcly (prevents audible 'pop')
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.5, context.currentTime, 0.1);
 	
 	//starts oscillator. Delayed start can be achieved by adding time(in secs) after currentTime
 	oscillator.start(context.currentTime);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
 		//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		compressor.connect(gainNode);
		gainNode.connect(delay);
		delay.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
	//distortion curve taken from MDN which they in turn took from Stack Overflow
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '2x';
		
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
	
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
		//decrease gain
 		quickFadeOut;
	} 
	
	if (document.getElementById('toggleDelay').value == 'true'){delayNode();}	
	if (document.getElementById('toggleDistortion').value == 'true'){distortionNode();}
 	
 	//determines note duration
 	var sustain = parseFloat(document.getElementById('sustain').value);
 	
 	//stops oscillator by exponentially ramping down sound over .015 seconds to avoid audible click
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.05);
 	oscillator.stop(context.currentTime + sustain + .5);
 	
	//change key color on keypress

	//append the word "note" to the object.name note to identify the correct key div
	var divId = "note" + String(note);
	var element = document.getElementById(divId);
    
	//change background color for durarion of note length
	var currentColor = element.style.backgroundColor;
	element.style.backgroundColor = '#3cf7ac';
	
	setTimeout(function () {
		if (currentColor != 'rgb(60, 247, 172)') {
    		element.style.backgroundColor = currentColor
  	  	}
 	}, 1000 * sustain);    

 	//for testing
 	console.log('playSound Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime.toFixed(2));
}

 //controls 2nd keyboard.  Same logic as playSound()
function playSoundb(note, time) {
	oscillator = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillator.connect(gainNode);
 	gainNode.connect(compressor);
 	
	var octave = document.getElementById('octaveb').value;
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	oscillator.type = document.getElementById('waveSelectb').value;
 	
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.5, context.currentTime, .1);
 	oscillator.start(context.currentTime);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
	//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		gainNode.connect(delay);
		delay.connect(gainNode);
		compressor.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		quickFadeIn;
		
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
 		quickFadeOut;
	}
	
	if (document.getElementById('toggleDelayb').value == 'true'){delayNode();}
	if (document.getElementById('toggleDistortionb').value == 'true'){distortionNode();}		
 	
  	var sustain = parseFloat(document.getElementById('sustainb').value);
 	
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.05);
 	oscillator.stop(context.currentTime + sustain + .5);
 	
 	//change key color on keypress
	var divId = "note" + String(note) + "b";
    var element = document.getElementById(divId);
    var currentColor = element.style.backgroundColor;
    element.style.backgroundColor = '#3ce4f7';
    setTimeout(function () {
    	if (currentColor != 'rgb(60, 228, 247)') {
        	element.style.backgroundColor = currentColor
        }
     }, 1000 * sustain);
 	
	//for testing
 	console.log('playSound*B* Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime); 
}

//third keyboard
function playSoundc(note, time) {
	oscillator = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillator.connect(gainNode);
 	gainNode.connect(compressor);
 	
	var octave = document.getElementById('octavec').value;
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	oscillator.type = document.getElementById('waveSelectc').value;
 	
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.5, context.currentTime, .1);
 	oscillator.start(context.currentTime);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
	//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		gainNode.connect(delay);
		delay.connect(gainNode);
		compressor.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		quickFadeIn;
		
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
 		quickFadeOut;
	}
	
	if (document.getElementById('toggleDelayc').value == 'true'){delayNode();}
	if (document.getElementById('toggleDistortionc').value == 'true'){distortionNode();}		
 	
  	var sustain = parseFloat(document.getElementById('sustainc').value);
 	
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.05);
 	oscillator.stop(context.currentTime + sustain + .5);
 	
 	//change key color on keypress
	var divId = "note" + String(note) + "c";
    var element = document.getElementById(divId);
    var currentColor = element.style.backgroundColor;
    element.style.backgroundColor = '#fa0a8b';
    setTimeout(function () {
    	if (currentColor != 'rgb(250, 10, 139)') {
        	element.style.backgroundColor = currentColor
        }
     }, 1000 * sustain);
 	
	//for testing
 	console.log('playSound*C* Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime); 
}

//fourth keyboard
function playSoundd(note, time) {
	oscillator = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillator.connect(gainNode);
 	gainNode.connect(compressor);
 	
	var octave = document.getElementById('octaved').value;
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	oscillator.type = document.getElementById('waveSelectd').value;
 	
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.5, context.currentTime, .1);
 	oscillator.start(context.currentTime);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
	//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		gainNode.connect(delay);
		delay.connect(gainNode);
		compressor.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 10,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 40,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		quickFadeIn;
		
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
 		quickFadeOut;
	}
	
	if (document.getElementById('toggleDelayd').value == 'true'){delayNode();}
	if (document.getElementById('toggleDistortiond').value == 'true'){distortionNode();}		
 	
  	var sustain = parseFloat(document.getElementById('sustaind').value);
 	
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.05);
 	oscillator.stop(context.currentTime + sustain + .5);
 	
 	//change key color on keypress
	var divId = "note" + String(note) + "d";
    var element = document.getElementById(divId);
    var currentColor = element.style.backgroundColor;
    element.style.backgroundColor = '#ad3cf7';
    setTimeout(function () {
    	if (currentColor != 'rgb(173, 60, 247)') {
        	element.style.backgroundColor = currentColor
        }
     }, 1000 * sustain);
 	
	//for testing
 	console.log('playSound*D* Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime); 
}


//triggers playSound() to create note
document.getElementById('note1').addEventListener(ifTouch() ,function() { playSound('1');});
document.getElementById('note2').addEventListener(ifTouch() ,function() { playSound('2');});
document.getElementById('note3').addEventListener(ifTouch() ,function() { playSound('3');});
document.getElementById('note4').addEventListener(ifTouch() ,function() { playSound('4');});
document.getElementById('note5').addEventListener(ifTouch() ,function() { playSound('5');});
document.getElementById('note6').addEventListener(ifTouch() ,function() { playSound('6');});
document.getElementById('note7').addEventListener(ifTouch() ,function() { playSound('7');});
document.getElementById('note8').addEventListener(ifTouch() ,function() { playSound('8');});
document.getElementById('note9').addEventListener(ifTouch() ,function() { playSound('9');});
document.getElementById('note10').addEventListener(ifTouch() ,function() { playSound('10');});
document.getElementById('note11').addEventListener(ifTouch() ,function() { playSound('11');});
document.getElementById('note12').addEventListener(ifTouch() ,function() { playSound('12');});
document.getElementById('note13').addEventListener(ifTouch() ,function() { playSound('13');});
document.getElementById('note14').addEventListener(ifTouch() ,function() { playSound('14');});
document.getElementById('note15').addEventListener(ifTouch() ,function() { playSound('15');});
document.getElementById('note16').addEventListener(ifTouch() ,function() { playSound('16');});
document.getElementById('note17').addEventListener(ifTouch() ,function() { playSound('17');});
document.getElementById('note18').addEventListener(ifTouch() ,function() { playSound('18');});
document.getElementById('note19').addEventListener(ifTouch() ,function() { playSound('19');});
document.getElementById('note20').addEventListener(ifTouch() ,function() { playSound('20');});
document.getElementById('note21').addEventListener(ifTouch() ,function() { playSound('21');});
document.getElementById('note22').addEventListener(ifTouch() ,function() { playSound('22');});
document.getElementById('note23').addEventListener(ifTouch() ,function() { playSound('23');});
document.getElementById('note24').addEventListener(ifTouch() ,function() { playSound('24');});
document.getElementById('note25').addEventListener(ifTouch() ,function() { playSound('25');});

//second keyboard
document.getElementById('note1b').addEventListener(ifTouch() ,function() { playSoundb('1');});
document.getElementById('note2b').addEventListener(ifTouch() ,function() { playSoundb('2');});
document.getElementById('note3b').addEventListener(ifTouch() ,function() { playSoundb('3');});
document.getElementById('note4b').addEventListener(ifTouch() ,function() { playSoundb('4');});
document.getElementById('note5b').addEventListener(ifTouch() ,function() { playSoundb('5');});
document.getElementById('note6b').addEventListener(ifTouch() ,function() { playSoundb('6');});
document.getElementById('note7b').addEventListener(ifTouch() ,function() { playSoundb('7');});
document.getElementById('note8b').addEventListener(ifTouch() ,function() { playSoundb('8');});
document.getElementById('note9b').addEventListener(ifTouch() ,function() { playSoundb('9');});
document.getElementById('note10b').addEventListener(ifTouch() ,function() { playSoundb('10');});
document.getElementById('note11b').addEventListener(ifTouch() ,function() { playSoundb('11');});
document.getElementById('note12b').addEventListener(ifTouch() ,function() { playSoundb('12');});
document.getElementById('note13b').addEventListener(ifTouch() ,function() { playSoundb('13');});
document.getElementById('note14b').addEventListener(ifTouch() ,function() { playSoundb('14');});
document.getElementById('note15b').addEventListener(ifTouch() ,function() { playSoundb('15');});
document.getElementById('note16b').addEventListener(ifTouch() ,function() { playSoundb('16');});
document.getElementById('note17b').addEventListener(ifTouch() ,function() { playSoundb('17');});
document.getElementById('note18b').addEventListener(ifTouch() ,function() { playSoundb('18');});
document.getElementById('note19b').addEventListener(ifTouch() ,function() { playSoundb('19');});
document.getElementById('note20b').addEventListener(ifTouch() ,function() { playSoundb('20');});
document.getElementById('note21b').addEventListener(ifTouch() ,function() { playSoundb('21');});
document.getElementById('note22b').addEventListener(ifTouch() ,function() { playSoundb('22');});
document.getElementById('note23b').addEventListener(ifTouch() ,function() { playSoundb('23');});
document.getElementById('note24b').addEventListener(ifTouch() ,function() { playSoundb('24');});
document.getElementById('note25b').addEventListener(ifTouch() ,function() { playSoundb('25');});

//third keyboard
document.getElementById('note1c').addEventListener(ifTouch() ,function() { playSoundc('1');});
document.getElementById('note2c').addEventListener(ifTouch() ,function() { playSoundc('2');});
document.getElementById('note3c').addEventListener(ifTouch() ,function() { playSoundc('3');});
document.getElementById('note4c').addEventListener(ifTouch() ,function() { playSoundc('4');});
document.getElementById('note5c').addEventListener(ifTouch() ,function() { playSoundc('5');});
document.getElementById('note6c').addEventListener(ifTouch() ,function() { playSoundc('6');});
document.getElementById('note7c').addEventListener(ifTouch() ,function() { playSoundc('7');});
document.getElementById('note8c').addEventListener(ifTouch() ,function() { playSoundc('8');});
document.getElementById('note9c').addEventListener(ifTouch() ,function() { playSoundc('9');});
document.getElementById('note10c').addEventListener(ifTouch() ,function() { playSoundc('10');});
document.getElementById('note11c').addEventListener(ifTouch() ,function() { playSoundc('11');});
document.getElementById('note12c').addEventListener(ifTouch() ,function() { playSoundc('12');});
document.getElementById('note13c').addEventListener(ifTouch() ,function() { playSoundc('13');});
document.getElementById('note14c').addEventListener(ifTouch() ,function() { playSoundc('14');});
document.getElementById('note15c').addEventListener(ifTouch() ,function() { playSoundc('15');});
document.getElementById('note16c').addEventListener(ifTouch() ,function() { playSoundc('16');});
document.getElementById('note17c').addEventListener(ifTouch() ,function() { playSoundc('17');});
document.getElementById('note18c').addEventListener(ifTouch() ,function() { playSoundc('18');});
document.getElementById('note19c').addEventListener(ifTouch() ,function() { playSoundc('19');});
document.getElementById('note20c').addEventListener(ifTouch() ,function() { playSoundc('20');});
document.getElementById('note21c').addEventListener(ifTouch() ,function() { playSoundc('21');});
document.getElementById('note22c').addEventListener(ifTouch() ,function() { playSoundc('22');});
document.getElementById('note23c').addEventListener(ifTouch() ,function() { playSoundc('23');});
document.getElementById('note24c').addEventListener(ifTouch() ,function() { playSoundc('24');});
document.getElementById('note25c').addEventListener(ifTouch() ,function() { playSoundc('25');});

//fourth keyboard
document.getElementById('note1d').addEventListener(ifTouch() ,function() { playSoundd('1');});
document.getElementById('note2d').addEventListener(ifTouch() ,function() { playSoundd('2');});
document.getElementById('note3d').addEventListener(ifTouch() ,function() { playSoundd('3');});
document.getElementById('note4d').addEventListener(ifTouch() ,function() { playSoundd('4');});
document.getElementById('note5d').addEventListener(ifTouch() ,function() { playSoundd('5');});
document.getElementById('note6d').addEventListener(ifTouch() ,function() { playSoundd('6');});
document.getElementById('note7d').addEventListener(ifTouch() ,function() { playSoundd('7');});
document.getElementById('note8d').addEventListener(ifTouch() ,function() { playSoundd('8');});
document.getElementById('note9d').addEventListener(ifTouch() ,function() { playSoundd('9');});
document.getElementById('note10d').addEventListener(ifTouch() ,function() { playSoundd('10');});
document.getElementById('note11d').addEventListener(ifTouch() ,function() { playSoundd('11');});
document.getElementById('note12d').addEventListener(ifTouch() ,function() { playSoundd('12');});
document.getElementById('note13d').addEventListener(ifTouch() ,function() { playSoundd('13');});
document.getElementById('note14d').addEventListener(ifTouch() ,function() { playSoundd('14');});
document.getElementById('note15d').addEventListener(ifTouch() ,function() { playSoundd('15');});
document.getElementById('note16d').addEventListener(ifTouch() ,function() { playSoundd('16');});
document.getElementById('note17d').addEventListener(ifTouch() ,function() { playSoundd('17');});
document.getElementById('note18d').addEventListener(ifTouch() ,function() { playSoundd('18');});
document.getElementById('note19d').addEventListener(ifTouch() ,function() { playSoundd('19');});
document.getElementById('note20d').addEventListener(ifTouch() ,function() { playSoundd('20');});
document.getElementById('note21d').addEventListener(ifTouch() ,function() { playSoundd('21');});
document.getElementById('note22d').addEventListener(ifTouch() ,function() { playSoundd('22');});
document.getElementById('note23d').addEventListener(ifTouch() ,function() { playSoundd('23');});
document.getElementById('note24d').addEventListener(ifTouch() ,function() { playSoundd('24');});
document.getElementById('note25d').addEventListener(ifTouch() ,function() { playSoundd('25');});

//Frequencies in Hz of notes to be played. 
var frequencies = {
 	'1': 130.81,
 	'2': 139.00,
 	'3': 146.83,
 	'4': 156.00,
 	'5': 164.81,
 	'6': 174.61,
 	'7': 185.00,
 	'8': 196.00,
 	'9': 208.00,
 	'10': 220.00,
 	'11': 233.00,
 	'12': 246.94,
 	'13': 261.63,
 	'14': 277.00,
 	'15': 293.66,
 	'16': 311.00,
 	'17': 329.63,
 	'18': 349.23,
 	'19': 370.00,
 	'20': 392.00,
 	'21': 415.00,
 	'22': 440.00,
 	'23': 466.00,
 	'24': 493.88,
 	'25': 523.25,
 };

/**
 *	UI
 */
 

//hides the chromatic notes of the keyboard
function ezMode() {
	var chromaticNotes = document.getElementsByClassName('black-keys');
		
	for (var i = 0; i < chromaticNotes.length; i++) {
		if (chromaticNotes[i].style.display == 'block') {
			chromaticNotes[i].style.display = 'none';
			document.getElementById('note13').style.backgroundColor = 'rgba(0,0,0,.2)';
			document.getElementById('note13b').style.backgroundColor = 'rgba(0,0,0,.2)';
			document.getElementById('note13c').style.backgroundColor = 'rgba(0,0,0,.2)';
			document.getElementById('note13d').style.backgroundColor = 'rgba(0,0,0,.2)';
		}
		
		else {
			chromaticNotes[i].style.display = 'block';
			document.getElementById('note13').style.backgroundColor = 'rgba(0,0,0,0)';
			document.getElementById('note13b').style.backgroundColor = 'rgba(0,0,0,0)';	
			document.getElementById('note13c').style.backgroundColor = 'rgba(0,0,0,0)';
			document.getElementById('note13d').style.backgroundColor = 'rgba(0,0,0,0)';	
		}
	}
}

//change UI color theme
function themeChange() {
	var skin = document.getElementById('wrapper');
	var nav = document.getElementById('navigation');
	var toggleTheme = document.getElementById('theme');
	var burger = document.getElementById('burger');	
	var select = document.getElementsByTagName('select');
	
	for (var i = 0; i < select.length; i++) {

		if (toggleTheme.value == 'true') {
			skin.style.background = 'linear-gradient(to bottom right, #ddd 40%, #bbb)';
			nav.style.backgroundColor = '#fff';
			burger.style.color ='#555';
			select[i].style.color ='#000';
		}
		
		else {
			skin.style.background = 'linear-gradient(to bottom right, #333 40%, #000)';
			nav.style.backgroundColor = '#000';
			burger.style.color ='#777';
			select[i].style.color ='#fff';
			
		}console.log(i);
	}
}
	

//check for touchscreen and provide correct event for listener
function ifTouch() {
    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
    	return 'touchstart';
    
    else {
    	return 'click';
	}
}

function playString() {
var said = document.getElementById("userString");
var msg = said.value;
var noteArr = [];
var interval = Math.random() * 1000;

for (var i = 0; i < msg.length; i++) {

	noteArr.push(msg.charCodeAt(i)%25+1);
} 

	playAllNotes(0);
	playAllNotesd(0);
	playAllNotesc(0);
	playAllNotesb(0);	
	
	function playAllNotes(index) {
		if (noteArr.length > index) {
			setTimeout(function() {
			    playSound(noteArr[index]);
			    playAllNotes(++index);
			}, Math.random() * 1000);
		}
	}
	
	function playAllNotesb(index) {
		if (noteArr.length > index * .5) {
			setTimeout(function() {
			    playSoundb(noteArr[index]);
			    playAllNotesb(++index);
			}, Math.random() * 500);
		}
	}
	
	function playAllNotesc(index) {
		if (noteArr.length > index * .5) {
			setTimeout(function() {
			    playSoundc(noteArr[index]);
			    playAllNotesc(++index);
			}, Math.random() * 500);
		}
	}

		function playAllNotesd(index) {
		if (noteArr.length > index) {
			setTimeout(function() {
			    playSoundd(noteArr[index]);
			    playAllNotesd(++index);
			}, Math.random() * 1000);
		}
	}

}	