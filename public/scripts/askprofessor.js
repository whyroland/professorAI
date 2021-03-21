const fetch = require('node-fetch');
const request = require('request');

/**
 * Retrieves trending headlines in America for the given topic
 * @param {} keyTerm The term to be searched for
 */
function scrapeNews(keyTerm) {
  return new Promise((resolve, reject) => {
    // To query /v2/everything
    // You must include at least one q, source, or domain
    
  });
}


async function getArticles(keyTerm) {
  var response = await getNews(keyTerm);
  console.log(response);
  return response;
}