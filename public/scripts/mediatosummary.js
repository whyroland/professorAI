const speech = require('@google-cloud/speech');
const request = require('request');
const {Storage} = require('@google-cloud/storage');
const language = require('@google-cloud/language');

// Any function that you want to be used in other files put it in here
module.exports = {
  getSummary
}
async function transcribe(file) {
  // Imports the Google Cloud client library
  // const speech = require('@google-cloud/speech');

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
    .join('\n');
  // console.log('Transcription: ' + transcription);
  return transcription
}

async function uploadFile(file) {
  // Imports the Google Cloud client library
  // const {Storage} = require('@google-cloud/storage');

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

async function entities(transcription) {
  // Imports the Google Cloud client library
  // const language = require('@google-cloud/language');

  // Credentials
  const projectId = 'linghacks';
  const keyFilename = 'LingHacks-7227ba75112d.json';

  // Creates a client
  const client = new language.LanguageServiceClient({projectId, keyFilename});

  // Text data
  const text = transcription;

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects entities in the document
  const [result] = await client.analyzeEntities({document});

  const entities = result.entities;

  // console.log('Entities:');
  // entities.forEach(entity => {
  //   console.log(entity.name);
  //   console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
  //   if (entity.metadata && entity.metadata.wikipedia_url) {
  //     console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
  //   }
  // });

  return entities;
}

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

function getExtract(query) {
  return new Promise((resolve, reject) => {
    // var request = require('request');

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
  })
}

// For MP3s
async function getSummary(file) {
  var transcript = await transcribe(file);
  var topics = await entities(transcript);
  var summary = [];
  for (var i = 0; i < parseInt(topics.length*0.5); i++) {
    var wiki = await getWiki(topics[i].name);
    var title = wiki.split('/');
    title = title[title.length-1];
    if (title.length > 0) {
      var extract = await getExtract(title);
      if (extract.length > 0 && !extract.includes('may refer to:')) {
        summary.push({
          title: title,
          summary: extract,
          link: wiki
        })
      }
    }
  }
  var result = Array.from(new Set(summary.map(a => a.title)))
  .map(title => {
    return summary.find(a => a.title === title)
  })
  console.log(result);
  return result;
}

getSummary('samples/macro_video_notes_day_1.mp3');
