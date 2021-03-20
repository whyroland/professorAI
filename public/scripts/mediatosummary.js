const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const speech = require('@google-cloud/speech');
const {Storage} = require('@google-cloud/storage');
const MonkeyLearn = require('monkeylearn');
const TextRazor = require('textrazor');
const request = require('request');
// const language = require('@google-cloud/language');


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
    //enableAutomaticPunctation: true,
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

/**
 * Gets the keywords from the transcript
 * @param {*} transcription 
 * @returns 
 */
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


// // Gets Entities for Transcription
// async function entities(transcription) {
//   // Credentials
//   const projectId = 'linghacks';
//   const keyFilename = 'LingHacks-7227ba75112d.json';
//
//   // Creates a client
//   const client = new language.LanguageServiceClient({projectId, keyFilename});
//
//   // Text data
//   const text = transcription;
//
//   // Prepares a document, representing the provided text
//   const document = {
//     content: text,
//     type: 'PLAIN_TEXT',
//   };
//
//   // Detects entities in the document
//   const [result] = await client.analyzeEntities({document});
//
//   const entities = result.entities;
//
//   return entities;
// }

// Gets Keywords off of a Transcription
// function getKeywords(text) {
//   return new Promise((resolve, reject) => {
//     const ml = new MonkeyLearn('5d6540906d152488fbf5bf05613fda1f0fbdc028');
//     let model_id = 'ex_YCya9nrn';
//     let data = []
//     data.push(text);
//     ml.extractors.extract(model_id, data).then((res, err) => {
//       if (err) {
//         var error = "cannot make request";
//         return reject(error);
//       }
//       console.log('keywords generated')
//       return resolve(res.body[0].extractions);
//     });
//   });
// }

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

<<<<<<< HEAD
//<<<<<<< HEAD
// Gets Wikipedia Link for Topic
//||||||| effe22d

// Gets Wikipedia Link for Topic
//=======
=======
>>>>>>> 975807c955fc3c7ff747b82be78d46631a5e9504
/**
 * Webscrapes Wikipedia for pages on the terms
 * @param {} query 
 * @returns 
 */
<<<<<<< HEAD
//>>>>>>> 7bda78edd4d2bbfcbdaf588dfd47aa9e2857a45e
=======
>>>>>>> 975807c955fc3c7ff747b82be78d46631a5e9504
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
  })
}

// // Gets Summary using Google NLP
// async function getSummary(file) {
//   // var transcript = await transcribe(file);
//   // Text data
//   var transcript = "hello I forgot to do this in one of the classes this week she'll be here I am want to play to get a recording of this these notes from day 3 of our unit here on monetary policy we've been working through the chapter here we started with some very basic information about the Federal Reserve nothing too strenuous there and we got into those bank balance sheets we've done practice rounds with with the difficult I'm so if your cancel fuzzy bear turn off me a final move here is into a new grass so bring back those for tools at which the Federal Reserve has and monetary policy to help address inflationary and recessionary gaps in the economy back for aggregate demand and aggregate supply graph the same way we looked at fiscal policy right we looked at changes in government spending and Taxation that cause a shift in aggregate demand here working out okay I'll come then why the Federal Reserve influence the money supply thus influencing aggregate demand and these are our for tools Reserve rate right dictating how much banks have to keep in cash versus how much they can loan out the discount rate at the interest rate banks are charging they borrow money from the Federal Reserve in the federal funds rate interest rate banks are charged when they borrow from one another and then finally open market operations the buying and selling of bonds between the Federal Reserve and Commercial Banks open market operations is the one the Federal Reserve uses the most because its effects are much more immediate than the others Beverly open market operations again find Vons means the Federal Reserve is putting money in Banks they're buying the bonds from the Federal Reserve that money is going directly into the excess reserves of the bank thus it's immediately available to be loaned out right now. Us walking through this process with our money multiplier causing an increase in the money supply or they sell bonds to the banks take money out of banks excess reserves decreasing the amount of money available for loans decreasing the supply of money I'm just as we did with fiscal policy we can look at expansion a monetary policy to help the economy close a recessionary gap or contractionary monetary policy to help the economy close an inflationary Gap so if you're looking at expansionary monetary policy of the Federal Reserve will do one of these four things or combination of these things if they decrease the reserve rate more cash can be put in excess reserves that's more cash can we loan out if you decrease the discount rate or the federal funds rate right thanks might be more willing to take out loans to have more money in excess reserves to be able to loan it out to customers or the buy bonds from the bank took money right in excess reserves us there was more than one out okay all of them equate she was Banks having more money to loan out and if that's the case we'll see what happens here in a minute but first we have a new graph the money market graph that's helpless analyze changes in the money supply does changes in the nominal interest rates are graph shows us the nominal interest rate on an x-axis that just a quantity of money we have our money supply curve here our money demand curve here just like any other demand curve downward sloping where the two meet if the nominal interest rate right this will be the price to borrow money and also the rate of return on these government bonds so back to our conversation here about expansion are monetary policy right this is what's going to occur should the Federal Reserve enact policy of expansion a variety should be do one of these four things all them add up to more money in excess reserves is an increase in the money supply when the Bank loaned out money from excess reserves it goes to that money multiplier process we can calculate the total increase in the money supply based on a loan so thanks have more money in Access and see if I pay more money is getting loan out it's causing the money supply to increase so did my supply curve shifts to the right and this makes sense logically right if the bank has more money to loan out they can do so at a cheaper interest rate I there's more available so they want to get it out to customers will be able to do it at a cheaper interest rate the one that occurs our money supply curve will shift to the right that's the interest rate has fallen I am we can take a look at that affects over here on our aggregate demand aggregate supply graph right in black or in a recessionary gap right current output why one is below full employment output so we know unemployment High we have a standard recessionary Gap here after the Federal Reserve takes action monetary policy to help address the problem we see the shift in Rent-A-Car from now in Dreadnaught of the cost less to borrow money interest-sensitive consumption government spending a private investment can increase all those categories will be willing to borrow money to spend so those areas are increasing aggregate demand is increasing bringing the economy back to full employment so I can flip it right we can talk about what if the economy is experiencing inflation what can the Federal Reserve do when they can do just the opposite of what we looked at on the previous slide they can increase these rates or sell bonds all of those equate to the bank having less money available to Loyal less money in excess reserves that's the case we're obviously going to see a higher interest rate is less money available let somebody get a loan out it's going to drive the interest rate up the supply of money decreases I'd say we have not shift gear in red and back here or on our Anchorman Agri Supply graph again in Black we're starting in that inflationary Gap the economy is trying to produce AB of Full Employment that's not going to work out so the Pharaohs are says hey let's get that under control as get inflation under control as decrease the money supply has caused the interest rate to increase right now cost more to borrow money so interest sensitive consumption government spending private investment decreases if those things decrease we know aggregate demand decreases back the phone appointment inflation under control so this money supply curve is only influence by action by the Federal Reserve at this point right in either direction so they're going to enact a contractionary policy we're going to see the my supply curve shift to the left decrease in the money supply expansion era policies to help grow from a recession we're going to see an increase in the money supply but we also have to be aware of that second curve on this new money market graph our money demand curve and this demand for money curve here represents the demand for money and its M1 form basically represents the demand for money in cash people have again when the Federal Reserve does something it's going to cause our vertical curve our money supply curve to shift but we can talk about really one specific way that the demand for money Curve will shift right and here's our example in the fourth bullet point let's say for some reason credit card interest rates dropped dramatically if that was the case people might be more willing to use their credit card more often than they are right now so it reduces the demand for people to carry cash in their pocket that reduces the demand for M1 money if that's the case we would see this curve or demand for my curve decrease and shift to the left if we have a new demand for money curve here we have a new interest rate on his lower we're going to see that it's still going to cause all the same things that cause fear when the interest rate is lower it's going to cause what happened in red here again that's an area to write if credit card interest rates Skyrocket people won't want to use their credit card the demand for M1 money will increase causing this curve to shift to the right causing a higher interest rate it's going to cause all these things yeah that would seein red right higher interest rate causes a decrease in aggregate demand who's going to be aware of this new graph and understand how shift occur right now write a shift of the money supply curve is caused by action by the Federal Reserve contractionary shift to the left expansionary shift to the right okay the last thing I want to talk about is bonds specifically and we were talking now about if you and I purchased a Government Bond so if I bought a bond I'm going to be getting it at a fixed interest rate meaning of fixed rate of return for example if I buy a Government Bond for $500 at a fixed interest rate of 6% interest rate is not going to change for the time. I have that Bond Jose I buy it for 10 year. At the end of the 10-year period the bottocks spires and goes back the Federal Government I get the $500 back plus I've been earning 6% interest on this Bond typically twice a year over the 10-year. So I've made some money on an investment based on that fix by the take on point hear the point that makes that we need to carry with us forward is that the interest rate is fixed and it will not change when we see changes to the interest rate on this graph when I buy that Bond it's locked in Forever it's not going to change so it's important to understand the inverse relationship between these bond prices and changes in the interest rate it says I want to sell my bond before the end of those 10 years its value is going to depend on what has happened to the interest rate from the time I bought the bonds to the time I'm looking to sell the bond so for example if I buy a bond at a fixed interest rate of 5% year in black on both grass on the left side let's say the interest rate increases to 8% any new bonds the government will issue will be done so at an\ interest rate of 8%. The new interest rate so that would be the new rate of return for anyone buy one of these new girl Redbox the bond I bought previously is only returning at a rate of 5% so if I look the cell that on the open market the value has plummeted right because you can go out and get a new Bond returning at a rate of 8% so the demand for my bond only returning 5% drops dramatically in the window man falls for anything right price Falls so the price of that Bond Falls does interest rates rise the price of these previously issued bonds false and vice-versa over here right same scenario let's say I buy the bond at 5% rate of return and Federal Reserve does some sort of action that caused the interest rates for the 3% all new bonds will be issued at 3% so the demand for my bond that's returning at 5% skyrockets bus if the demand Rises the price so the value of my Banas increases interest rates for the price of those bonds increase and that is the gist of what we went through last time so this recording is now available to you to watch as many times of courses you need please reach out to me if you're lost or confused this is really be really getting into it here right from Agri Supply on word now this is the meat of this course this is where the majority of the AP exam comes from so if you're struggling with some of these Concepts it's important imperative that you reach out to me and I help you clear as best I can All Rights all right";
//   var topics = await entities(transcript);
//   var summary = [];
//   for (var i = 0; i < parseInt(topics.length*0.5); i++) {
//     var wiki = await getWiki(topics[i].name);
//     var title = wiki.split('/');
//     title = title[title.length-1];
//     if (title.length > 0) {
//       var extract = await getExtract(title);
//       if (extract.length > 0 && !extract.includes('may refer to:')) {
//         summary.push({
//           title: title,
//           summary: extract,
//           link: wiki
//         })
//       }
//     }
//   }
//   var result = Array.from(new Set(summary.map(a => a.title)))
//   .map(title => {
//     return summary.find(a => a.title === title)
//   })
//   console.log(result);
//   return result;
// }

// Gets Summary using MonkeyLearn NLP
async function getSummary(videoFile) {
  console.log('Video File: ' + videoFile);
  var filename = videoFile.split('/');
  filename = filename[filename.length-1].split('.')[0];
  var audioFile = 'tmp/' + filename + '.mp3';
  console.log('Audio File: ' + audioFile);
  await convertToMP3(videoFile);
  console.log();
  var transcript = await transcribe(audioFile);
  // // Text data
  // var transcript = "hello I forgot to do this in one of the classes this week she'll be here I am want to play to get a recording of this these notes from day 3 of our unit here on monetary policy we've been working through the chapter here we started with some very basic information about the Federal Reserve nothing too strenuous there and we got into those bank balance sheets we've done practice rounds with with the difficult I'm so if your cancel fuzzy bear turn off me a final move here is into a new grass so bring back those for tools at which the Federal Reserve has and monetary policy to help address inflationary and recessionary gaps in the economy back for aggregate demand and aggregate supply graph the same way we looked at fiscal policy right we looked at changes in government spending and Taxation that cause a shift in aggregate demand here working out okay I'll come then why the Federal Reserve influence the money supply thus influencing aggregate demand and these are our for tools Reserve rate right dictating how much banks have to keep in cash versus how much they can loan out the discount rate at the interest rate banks are charging they borrow money from the Federal Reserve in the federal funds rate interest rate banks are charged when they borrow from one another and then finally open market operations the buying and selling of bonds between the Federal Reserve and Commercial Banks open market operations is the one the Federal Reserve uses the most because its effects are much more immediate than the others Beverly open market operations again find Vons means the Federal Reserve is putting money in Banks they're buying the bonds from the Federal Reserve that money is going directly into the excess reserves of the bank thus it's immediately available to be loaned out right now. Us walking through this process with our money multiplier causing an increase in the money supply or they sell bonds to the banks take money out of banks excess reserves decreasing the amount of money available for loans decreasing the supply of money I'm just as we did with fiscal policy we can look at expansion a monetary policy to help the economy close a recessionary gap or contractionary monetary policy to help the economy close an inflationary Gap so if you're looking at expansionary monetary policy of the Federal Reserve will do one of these four things or combination of these things if they decrease the reserve rate more cash can be put in excess reserves that's more cash can we loan out if you decrease the discount rate or the federal funds rate right thanks might be more willing to take out loans to have more money in excess reserves to be able to loan it out to customers or the buy bonds from the bank took money right in excess reserves us there was more than one out okay all of them equate she was Banks having more money to loan out and if that's the case we'll see what happens here in a minute but first we have a new graph the money market graph that's helpless analyze changes in the money supply does changes in the nominal interest rates are graph shows us the nominal interest rate on an x-axis that just a quantity of money we have our money supply curve here our money demand curve here just like any other demand curve downward sloping where the two meet if the nominal interest rate right this will be the price to borrow money and also the rate of return on these government bonds so back to our conversation here about expansion are monetary policy right this is what's going to occur should the Federal Reserve enact policy of expansion a variety should be do one of these four things all them add up to more money in excess reserves is an increase in the money supply when the Bank loaned out money from excess reserves it goes to that money multiplier process we can calculate the total increase in the money supply based on a loan so thanks have more money in Access and see if I pay more money is getting loan out it's causing the money supply to increase so did my supply curve shifts to the right and this makes sense logically right if the bank has more money to loan out they can do so at a cheaper interest rate I there's more available so they want to get it out to customers will be able to do it at a cheaper interest rate the one that occurs our money supply curve will shift to the right that's the interest rate has fallen I am we can take a look at that affects over here on our aggregate demand aggregate supply graph right in black or in a recessionary gap right current output why one is below full employment output so we know unemployment High we have a standard recessionary Gap here after the Federal Reserve takes action monetary policy to help address the problem we see the shift in Rent-A-Car from now in Dreadnaught of the cost less to borrow money interest-sensitive consumption government spending a private investment can increase all those categories will be willing to borrow money to spend so those areas are increasing aggregate demand is increasing bringing the economy back to full employment so I can flip it right we can talk about what if the economy is experiencing inflation what can the Federal Reserve do when they can do just the opposite of what we looked at on the previous slide they can increase these rates or sell bonds all of those equate to the bank having less money available to Loyal less money in excess reserves that's the case we're obviously going to see a higher interest rate is less money available let somebody get a loan out it's going to drive the interest rate up the supply of money decreases I'd say we have not shift gear in red and back here or on our Anchorman Agri Supply graph again in Black we're starting in that inflationary Gap the economy is trying to produce AB of Full Employment that's not going to work out so the Pharaohs are says hey let's get that under control as get inflation under control as decrease the money supply has caused the interest rate to increase right now cost more to borrow money so interest sensitive consumption government spending private investment decreases if those things decrease we know aggregate demand decreases back the phone appointment inflation under control so this money supply curve is only influence by action by the Federal Reserve at this point right in either direction so they're going to enact a contractionary policy we're going to see the my supply curve shift to the left decrease in the money supply expansion era policies to help grow from a recession we're going to see an increase in the money supply but we also have to be aware of that second curve on this new money market graph our money demand curve and this demand for money curve here represents the demand for money and its M1 form basically represents the demand for money in cash people have again when the Federal Reserve does something it's going to cause our vertical curve our money supply curve to shift but we can talk about really one specific way that the demand for money Curve will shift right and here's our example in the fourth bullet point let's say for some reason credit card interest rates dropped dramatically if that was the case people might be more willing to use their credit card more often than they are right now so it reduces the demand for people to carry cash in their pocket that reduces the demand for M1 money if that's the case we would see this curve or demand for my curve decrease and shift to the left if we have a new demand for money curve here we have a new interest rate on his lower we're going to see that it's still going to cause all the same things that cause fear when the interest rate is lower it's going to cause what happened in red here again that's an area to write if credit card interest rates Skyrocket people won't want to use their credit card the demand for M1 money will increase causing this curve to shift to the right causing a higher interest rate it's going to cause all these things yeah that would seein red right higher interest rate causes a decrease in aggregate demand who's going to be aware of this new graph and understand how shift occur right now write a shift of the money supply curve is caused by action by the Federal Reserve contractionary shift to the left expansionary shift to the right okay the last thing I want to talk about is bonds specifically and we were talking now about if you and I purchased a Government Bond so if I bought a bond I'm going to be getting it at a fixed interest rate meaning of fixed rate of return for example if I buy a Government Bond for $500 at a fixed interest rate of 6% interest rate is not going to change for the time. I have that Bond Jose I buy it for 10 year. At the end of the 10-year period the bottocks spires and goes back the Federal Government I get the $500 back plus I've been earning 6% interest on this Bond typically twice a year over the 10-year. So I've made some money on an investment based on that fix by the take on point hear the point that makes that we need to carry with us forward is that the interest rate is fixed and it will not change when we see changes to the interest rate on this graph when I buy that Bond it's locked in Forever it's not going to change so it's important to understand the inverse relationship between these bond prices and changes in the interest rate it says I want to sell my bond before the end of those 10 years its value is going to depend on what has happened to the interest rate from the time I bought the bonds to the time I'm looking to sell the bond so for example if I buy a bond at a fixed interest rate of 5% year in black on both grass on the left side let's say the interest rate increases to 8% any new bonds the government will issue will be done so at an\ interest rate of 8%. The new interest rate so that would be the new rate of return for anyone buy one of these new girl Redbox the bond I bought previously is only returning at a rate of 5% so if I look the cell that on the open market the value has plummeted right because you can go out and get a new Bond returning at a rate of 8% so the demand for my bond only returning 5% drops dramatically in the window man falls for anything right price Falls so the price of that Bond Falls does interest rates rise the price of these previously issued bonds false and vice-versa over here right same scenario let's say I buy the bond at 5% rate of return and Federal Reserve does some sort of action that caused the interest rates for the 3% all new bonds will be issued at 3% so the demand for my bond that's returning at 5% skyrockets bus if the demand Rises the price so the value of my Banas increases interest rates for the price of those bonds increase and that is the gist of what we went through last time so this recording is now available to you to watch as many times of courses you need please reach out to me if you're lost or confused this is really be really getting into it here right from Agri Supply on word now this is the meat of this course this is where the majority of the AP exam comes from so if you're struggling with some of these Concepts it's important imperative that you reach out to me and I help you clear as best I can All Rights all right";
  var topics = await getKeywords(transcript);
  var summary = [];
  for (var i = 0; i < 20; i++) {
    var wiki = await getWiki(topics[i].label);
    var title = wiki.split('/');
    title = title[title.length-1];
    if (title.length > 0) {
      var extract = await getExtract(title);
      if (extract.length > 0 && !extract.includes('may refer to:')) {
        summary.push({
          title: title.replace(/_/g, ' '),
          summary: extract,
          link: wiki
        })
      }
    }
  }
  console.log();
  console.log('Summary: ')
  console.log(summary);

  const path = audioFile;
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      return
    }
    //audioFile removed
  })

  return summary;
}}

getSummary('samples/datastructures_sample_vid_1.mp4');
