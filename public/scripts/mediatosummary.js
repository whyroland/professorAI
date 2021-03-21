//Any function that you want to be used in other files put it in here
module.exports = {
  getSummaryFromVideo,
  getSummaryFromAudio,
  getInfo,
  getTopics
}

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');
const speech = require('@google-cloud/speech');
const {Storage} = require('@google-cloud/storage');
const TextRazor = require('textrazor');
const request = require('request');
const news = require(__dirname + "/newsscraper.js");
// const language = require('@google-cloud/language');
// const MonkeyLearn = require('monkeylearn');

// Converts MP4 file to MP3
function convertToMP3(videoFile) {
  return new Promise((resolve, reject) => {
    var filename = videoFile.split('/');
    filename = filename[filename.length-1];
    var audioFile = 'tmp/' + filename.split('.')[0] + '.mp3';

    var stream  = fs.createWriteStream(audioFile);
    ffmpeg(videoFile)
    .format('mp3')
    // .output(stream, { end:true })
    .on('start', function(cmd) {
      console.log('Started ' + cmd);
    })
    .on('error', function(err) {
      console.log(err);
      return reject();
    })
    .on('end', function() {
      console.log('Finished processing');
      return resolve();
    })
    .pipe(stream, { end:true })
  });
}

// Transcribes Audio File
async function transcribe(file) {
  // Credentials
  const projectId = 'linghacks';
  const keyFilename = 'LingHacks-7227ba75112d.json';

  // Creates a client
  const client = new speech.SpeechClient({projectId, keyFilename});

  // Uploads file to Cloud Storage
  await uploadFile(file).catch(console.error);

  // Gets path
  let path = file.split('/');
  path = path[path.length-1];

  // Audio File variables
  const gcsUri = 'gs://linghacks_input_files/' + path;
  const encoding = 'CBR';
  const sampleRateHertz = 48000;
  const languageCode = 'en-US';

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    enableAutomaticPunctation: true,
  };

  const audio = {
    uri: gcsUri,
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results
  .map(result => result.alternatives[0].transcript)
  .join('. ');
  console.log('transcription generated')
  return transcription
}

/**
 * Uploads the file to use
 * @param {} file
 */
async function uploadFile(file) {
  // Credentials
  const projectId = 'linghacks';
  const keyFilename = 'LingHacks-7227ba75112d.json';

  // Creates a client
  const storage = new Storage({projectId, keyFilename});

  // Bucket Info
  const bucketName = 'linghacks_input_files';
  const filename = file;
  const destination = file.split('/')[file.split('/').length];

  // Uploads a local file to the bucket
  await storage.bucket(bucketName).upload(filename, {
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    destination: destination,
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000',
    },
  });

  console.log(`${filename} uploaded to storage bucket.`);
}

// Gets Keywords off of a Transcription
function getKeywords(text) {
  return new Promise((resolve, reject) => {
    var textRazor = new TextRazor('483af9cbdcfc5bab7c1c9f563fb7cfe7a0d366a4edcbe53ff5860861');
    var options = { extractors: 'topics' }
    var content = text;
    textRazor.exec(content, options)
    .then(res => resolve(res.response.topics))
    .catch(err => reject(err))
  });
}

/**
 * Webscrapes Wikipedia for pages on the terms
 * @param {} query
 * @returns
 */
function getWiki(query) {
  return new Promise((resolve, reject) => {
    var url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&format=json`;
    request(url, function (err, response, body) {
      if(err){
        var error = 'cannot connect to the server';
        return reject(error);
      }
      else {
        var wiki = JSON.parse(body);
        var str1 = query.toLowerCase();
        var str2 = ''
        if (wiki[1][0] != undefined) {
          str2 = wiki[1][0].toLowerCase();
        }
        if (
          str1 === str2 ||
          (str1.substring(str1.length-1) === 's' && str1.substring(0, str1.length-1) === str2) ||
          (str2.substring(str2.length-1) === 's' && str2.substring(0, str2.length-1) === str1)
        ) {
          return resolve(wiki[3][0]);
        }
        else {
          return resolve('');
        }
      }
    });
  });
}

/**
 * Obtains summary on the wikipedia pages
 * @param {} query
 * @returns
 */
function getExtract(query) {
  return new Promise((resolve, reject) => {
    var url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${query}&formatversion=2&exsentences=10&exlimit=1&explaintext=1`;
    request(url, function (err, response, body) {
      if(err){
        var error = 'cannot connect to the server';
        reject(error);
      }
      else {
        var extract = JSON.parse(body).query.pages[0].extract;
        if (extract.includes('\n')) {
          return resolve(extract.substring(0, extract.indexOf('\n')));
        }
        else {
          return resolve(extract);
        }
      }
    });
  });
}

async function getSummaryFromVideo(videoFile) {
  console.log('Video File: ' + videoFile);
  var filename = videoFile.split('/');
  filename = filename[filename.length-1].split('.')[0];
  var audioFile = 'tmp/' + filename + '.mp3';
  console.log('Audio File: ' + audioFile);
  await convertToMP3(videoFile);
  console.log();
  var summary = await getSummaryFromAudio(audioFile);
  fs.unlink(videoFile, (err) => {
    if (err) {
      console.error(err)
      return
    }
    //videoFile removed
  })
  return summary;
}

async function getSummaryFromAudio(audioFile) {
  var transcript = await transcribe(audioFile);
  var summary = getInfo(transcript);
  const path = audioFile;
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      return
    }
    //audioFile removed
  });
  return summary;
}
// Gets Summary using TextRazor NLP
async function getInfo(transcript) {
  var topics = await getKeywords(transcript);
  var summary = {};
  summary.transcript = transcript;
  summary.topics = [];
  summary.topics = await getTopics(topics, summary);
  
  console.log();
  console.log('Summary: ')
  console.log(summary);
  

  return summary;
}

async function getTopics(topics, summary) {
  for (var i = 0; i < 20; i++) {
    var wiki = await getWiki(topics[i].label);
    var title = wiki.split('/');
    title = title[title.length-1];
    if (title.length > 0) {
      var extract = await getExtract(title);
      if (extract.length > 0 && !extract.includes('may refer to:')) {
        var currevents = await news.getArticles(title.replace(/_/g, ' '), 3);
        summary.topics.push({
          title: title.replace(/_/g, ' '),
          summary: extract,
          link: wiki,
          articles: await currevents
        })
      }
    }
  }
  return summary.topics;
}

//getSummary('samples/transcript-test.mp4');
