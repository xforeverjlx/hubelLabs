// import AWS from 'aws-sdk'

// const AWS = require('aws-sdk');
// const Busboy = require('busboy');

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var words = ['包子', '書包', '大嫂', '老實'];
var initText = document.getElementById("initText")
initText.innerHTML = words[0]
var count = 0;
// var cur = document.getElementById('output');


var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
// var encodingType = "mp3"
var encodeAfterRecord = true;       // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

var encodingTypeSelect = document.getElementById("encodingTypeSelect");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var skipButton = document.getElementById("skipButton");
var submitButton = document.getElementById("submitButton");
var saveDetails = document.getElementById("saveDetails");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
skipButton.addEventListener("click", skip);
submitButton.addEventListener("click", submit);
saveDetails.addEventListener("click", save);

function skip(){
//  for (var i = 0; i < words.length; i++) {
//     cur.innerHTML = words[i];
//  }
 	count += 1;
	count = count % words.length;
 	let span = document.querySelectorAll('p span').item(0);
//  console.log(span);
 	span.textContent = words[count];
//  let randomWord = words[Math.round(Math.random() * (words.length - 1))];
//  span.textContent = randomWord;
}

function submit(){
	//store sound file to aws:
	//https://medium.com/@shresthshruti09/uploading-files-in-aws-s3-bucket-through-javascript-sdk-with-progress-bar-d2a4b3ee77b5
	const bucketName = "maomi-johann";
	const bucketRegion = "ap-southeast-1";
	const userKey = "AKIAJIRUW4VT3RKJQYQA";
	const userSecret = "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";
	var fileName = recordingsList.firstChild;
		
	var s3 = new AWS.S3();
	buffer = new Buffer(obj.contents, "base64");
	audioBlob = this.GetAudioBlob()
	var params = {
              Bucket: "maomi-johann",
              Key: "audio_file_test.mp3",
              Body: audioBlob,                                                        
              ACL: 'private',
              ContentType: 'audio/mp3',
          };
	s3.putObject(params, function(err,data){ console.log(err); } );

	//store document to database:

	skip();
}



function save(){
	var sdialect = dialect.options[dialect.selectedIndex].value;
	var sform = form.options[form.selectedIndex].value;
	var sgender = gender.options[gender.selectedIndex].value;
	var sage = document.getElementById("age").value;
	var semail = document.getElementById("emails").value;

	console.log(semail);
}

// function s3upload(file) {
// //    var files = document.getElementById('fileUpload').files;
//     files = [file]
// 	if (files) 
//    {
//      var file = files[0];
//      var fileName = file.name;
//      var filePath = 'my-first-bucket-path/' + fileName;
//      var fileUrl = 'https://' + bucketRegion + '.amazonaws.com/my-    first-bucket/' +  filePath;
//      s3.upload({
//         Key: filePath,
//         Body: file,
//         ACL: 'public-read'
//         }, function(err, data) {
//         if(err) {
//         reject('error');
//         }
//         alert('Successfully Uploaded!');
//         }).on('httpUploadProgress', function (progress) {
//         var uploaded = parseInt((progress.loaded * 100) / progress.total);
//         $("progress").attr('value', uploaded);
//       });
//    }
// };

// export function uploadToS3(file): Promise<any> {
//   const readStream = fs.createReadStream(file);

//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: "myapp" + "/" + fileName,
//     Body: readStream
//   };

//   return new Promise((resolve, reject) => {
//     s3bucket.upload(params, function(err, data) {
//       readStream.destroy();
      
//       if (err) {
//         return reject(err);
//       }
      
//       return resolve(data);
//     });
//   });
// }

function uploadToS3(fileName) {
  let s3bucket = new AWS.S3({
    accessKeyId: userKey,
    secretAccessKey: userSecret,
    Bucket: bucketNAme
  });
  s3bucket.createBucket(function () {
      var params = {
        Bucket: bucketName,
        Key: file.name,
        Body: file.data
      };
      s3bucket.upload(params, function (err, data) {
        if (err) {
          console.log('error in callback');
          console.log(err);
        }
        console.log('success');
        console.log(data);
      });
  });
}

module.exports = (app) => {
  // The following is an example of making file upload with additional body parameters.
  // To make a call with PostMan
  // Don't put any headers (content-type)
  // Under body:
  // check form-data
  // Put the body with "element1": "test", "element2": image file

  app.post('/api/upload', function (req, res, next) {
    // This grabs the additional parameters so in this case passing in
    // "element1" with a value.
    const element1 = req.body.element1;

    var busboy = new Busboy({ headers: req.headers });

    // The file upload has completed
    busboy.on('finish', function() {
      console.log('Upload finished');
      
      // Your files are stored in req.files. In this case,
      // you only have one and it's req.files.element2:
      // This returns:
      // {
      //    element2: {
      //      data: ...contents of the file...,
      //      name: 'Example.jpg',
      //      encoding: '7bit',
      //      mimetype: 'image/png',
      //      truncated: false,
      //      size: 959480
      //    }
      // }
      
      // Grabs your file object from the request.
      const file = req.files.element2;
      console.log(file);
      
      // Begins the upload to the AWS S3
      uploadToS3(file);
    });

    req.pipe(busboy);
  });
}

function startRecording() {
	console.log("startRecording() called");

	/*
		Simple constraints object, for more advanced features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

    /*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/
	// recordingsList.removeChild();


	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		__log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
		document.getElementById("formats").innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz"

		//assign to gumStream for later use
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		
		//stop the input from playing back through the speakers
		//input.connect(audioContext.destination)

		//get the encoding 
		encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
		
		//disable the encoding selector
		encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "js/", // must end with slash
		  encoding: encodingType,
		  numChannels:2, //2 is the default, mp3 encoding supports only 2
		  onEncoderLoading: function(recorder, encoding) {
		    // show "loading encoder..." display
		    __log("Loading "+encoding+" encoder...");
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    // hide "loading encoder..." display
		    __log(encoding+" encoder loaded");
		  }
		});

		recorder.onComplete = function(recorder, blob) { 
			__log("Encoding complete");
			createDownloadLink(blob,recorder.encoding);
			encodingTypeSelect.disabled = false;
		}

		recorder.setOptions({
		  timeLimit:120,
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: 0.5},
	      mp3: {bitRate: 160}
	    });

		//start the recording process
		recorder.startRecording();

		 __log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUSerMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;

	});

	//disable the record button
    recordButton.disabled = true;
    stopButton.disabled = false;
}

function stopRecording() {
	console.log("stopRecording() called");
	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//disable the stop button
	stopButton.disabled = true;
	recordButton.disabled = false;
	
	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();

	__log('Recording stopped');
}

function createDownloadLink(blob,encoding) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//link the a element to the blob
	link.href = url;
	link.download = new Date().toISOString() + '.'+encoding;
	link.innerHTML = link.download;

	//add the new audio and a elements to the li element
	li.appendChild(au);
	li.appendChild(link);

	//add the li element to the ordered list
	recordingsList.appendChild(li);
	if(recordingsList.childElementCount > 1){
		recordingsList.removeChild(recordingsList.firstChild);
	}
}


//helper function
function __log(e, data) {
	log.innerHTML += "\n" + e + " " + (data || '');
}