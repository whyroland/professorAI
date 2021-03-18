async function transcribe(file) {
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');

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
  const {Storage} = require('@google-cloud/storage');

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
  const language = require('@google-cloud/language');

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

async function getTopics(file) {
  const text = await transcribe(file);
  const topics = await entities(text);
  // console.log(topics);
  return topics
}

getTopics('samples/blockchain_simply_explained.mp3');
