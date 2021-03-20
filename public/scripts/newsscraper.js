// const fetch = require('node-fetch');
// const request = require('request');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('92e3f4d9cf4648a9894aba080ab53935');

/**
 * Retrieves trending headlines in America for the given topic
 * @param {} keyTerm The term to be searched for
 */
function scrapeNews(keyTerm) {
  return new Promise((resolve, reject) => {
    // To query /v2/everything
    // You must include at least one q, source, or domain
    newsapi.v2.everything({
      q: keyTerm,
      language: 'en'
    }).then(response => {
      return resolve(response);
    }).catch(error => {
      return reject(error);
    });
  });
}


async function getArticles(keyTerm) {
  var response = await getNews(keyTerm);
  console.log(response);
  return response;
}