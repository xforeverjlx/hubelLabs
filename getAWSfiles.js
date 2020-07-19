const aws = require('aws-sdk');
const config = require('./config.json');

(async function() {
	try{
		aws.config.setPromisesDependency();
		aws.config.update({
			accessKeyId: "AKIAJIRUW4VT3RKJQYQA",
			secretAccessKey: "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"
		});

		const s3 = new aws.S3();
		const response = await s3.listObjectsV2({
			Bucket: "maomi-johann"
		}).promise();

		console.log(response)

	} catch (e){
		console.log('error is ', e);
	}

	debugger;

})();