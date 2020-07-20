// //webkitURL is deprecated but nevertheless
// URL = window.URL || window.webkitURL;

// var words = ['包子', '書包', '大嫂', '老實'];
// var initText = document.getElementById("initText")
// initText.innerHTML = words[0]
// var count = 0;


// var gumStream; 						//stream from getUserMedia()
// var rec;
// var recorder; 						//WebAudioRecorder object
// var input; 							//MediaStreamAudioSourceNode  we'll be recording
// var encodingType; 					//holds selected encoding for resulting audio (file)
// var encodeAfterRecord = true;       // when to encode

// // shim for AudioContext when it's not avb. 
// var AudioContext = window.AudioContext || window.webkitAudioContext;
// var audioContext; //new audio context to help us record

// var encodingTypeSelect = document.getElementById("encodingTypeSelect");
// var recordButton = document.getElementById("recordButton");
// var stopButton = document.getElementById("stopButton");
// var skipButton = document.getElementById("skipButton");
// var submitButton = document.getElementById("submitButton");
// var saveDetails = document.getElementById("saveDetails");

// //add events to those 2 buttons
// recordButton.addEventListener("click", startRecording);
// stopButton.addEventListener("click", stopRecording);
// skipButton.addEventListener("click", skip);
// submitButton.addEventListener("click", submit);

// function skip(){
//  	count += 1;
// 	count = count % words.length;
//  	let span = document.querySelectorAll('p span').item(0);
//  	span.textContent = words[count];
// }

// function submit(){
// 	//store sound file to aws:
// 	//https://medium.com/@shresthshruti09/uploading-files-in-aws-s3-bucket-through-javascript-sdk-with-progress-bar-d2a4b3ee77b5
// 	const bucketName = BUCKETNAME;
// 	const ID = ID;
// 	const SECRET = SECRETID;
// 	console.log(recordingsList.firstChild);
// 	var fileName = new Buffer(recordingsList.firstChild.firstChild.src, 'binary');
	
// 	var s3 = new AWS.S3({
// 		accessKeyId: ID,
// 		secretAccessKey: SECRET
// 	});

// 	const params = {
// 		Bucket: bucketName,
// 		Key: "audio_file_test.wav",
// 		Body: fileName
// 	}
// 	// Uploading files to the bucket
//     s3.upload(params, function(err, data) {
//         if (err) {
//             throw err;
//         }
//         console.log(`File uploaded successfully. ${data.Location}`);
//     });

// 	skip();
// }



// function save(){
// 	var sdialect = dialect.options[dialect.selectedIndex].value;
// 	var sform = form.options[form.selectedIndex].value;
// 	var sgender = gender.options[gender.selectedIndex].value;
// 	var sage = document.getElementById("age").value;
// 	var semail = document.getElementById("emails").value;

// 	console.log(semail);
// }

// function uploadToS3(fileName) {
//   let s3bucket = new AWS.S3({
//     accessKeyId: userKey,
//     secretAccessKey: userSecret,
//     Bucket: bucketNAme
//   });
//   s3bucket.createBucket(function () {
//       var params = {
//         Bucket: bucketName,
//         Key: file.name,
//         Body: file.data
//       };
//       s3bucket.upload(params, function (err, data) {
//         if (err) {
//           console.log('error in callback');
//           console.log(err);
//         }
//         console.log('success');
//         console.log(data);
//       });
//   });
// }

// function startRecording() {
// 	console.log("startRecording() called");

// 	/*
// 		Simple constraints object, for more advanced features see
// 		https://addpipe.com/blog/audio-constraints-getusermedia/
// 	*/
    
//     var constraints = { audio: true, video:false }

// 	//disable the record button
//     recordButton.disabled = true;
//     stopButton.disabled = false;
	
//     /*
//     	We're using the standard promise based getUserMedia() 
//     	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
// 	*/

// 	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
// 		console.log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

// 		/*
// 			create an audio context after getUserMedia is called
// 			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
// 			the sampleRate defaults to the one set in your OS for your playback device
// 		*/
// 		audioContext = new AudioContext();

// 		//update the format 
// 		document.getElementById("formats").innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz"

// 		//assign to gumStream for later use
// 		gumStream = stream;
		
// 		/* use the stream */
// 		input = audioContext.createMediaStreamSource(stream);

// 		rec = new Recorder(input,{numChannels:1})

// 		//start the recording process
// 		rec.record()

// 		console.log("Recording started");


// 	}).catch(function(err) {
// 	  	//enable the record button if getUSerMedia() fails
//     	recordButton.disabled = false;
//     	stopButton.disabled = true;

// 	});
// }

// function stopRecording() {
// 	console.log("stopRecording() called");
	
// 	//stop microphone access
// 	// gumStream.getAudioTracks()[0].stop();

// 	//disable the stop button
// 	stopButton.disabled = true;
// 	recordButton.disabled = false;
	
// 	//tell the recorder to stop the recording
// 	rec.stop();

// 	//stop microphone access
// 	gumStream.getAudioTracks()[0].stop();

// 	//create the wav blob and pass it on to createDownloadLink
// 	rec.exportWAV(createDownloadLink);

// 	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
// 	//recorder.finishRecording();

// 	console.log('Recording stopped');
// }

// function createDownloadLink(blob,encoding) {
	
// 	var url = URL.createObjectURL(blob);
// 	var au = document.createElement('audio');
// 	var li = document.createElement('li');
// 	var link = document.createElement('a');

// 	//add controls to the <audio> element
// 	au.controls = true;
// 	au.src = url;

// 	//link the a element to the blob
// 	link.href = url;
// 	link.download = new Date().toISOString() + '.wav';
// 	link.innerHTML = link.download;

// 	//add the new audio and a elements to the li element
// 	li.appendChild(au);
// 	li.appendChild(link);

// 	//add the li element to the ordered list
// 	recordingsList.appendChild(li);
// 	if(recordingsList.childElementCount > 1){
// 		recordingsList.removeChild(recordingsList.firstChild);
// 	}
// }


// //helper function
// function __log(e, data) {
// 	log.innerHTML += "\n" + e + " " + (data || '');
// }