const fetch = require('node-fetch');
const request = require('request');
const apiKey = '92e3f4d9cf4648a9894aba080ab53935';

/**
 * Retrieves trending headlines in America for the given topic
 * @param {} keyTerm The term to be searched for
 */
async function getNews(keyTerm) {
  // const apiKey = '92e3f4d9cf4648a9894aba080ab53935';

  let url = 'https://newsapi.org/v2/everything?q=' + keyTerm + '&apiKey=' + apiKey;
  // var url = 'https://newsapi.org/v2/everything?q=apple&apiKey=92e3f4d9cf4648a9894aba080ab53935';

  // var data;

  return fetch(url)
  .then((res) => {
    return res.json();
  }).then((data) => {
    return data;
  }).catch((error) => {
    console.log(error);
  });

  // const articles = await result;
  
  // console.log(articles);

  // return articles;

}

function getArticles(keyTerm) {
  /*
  getNews().then((articles) => {
      return articles;
  }).catch((error) => {
      console.log("You took an L");
  })*/
  // let data;
  getNews(keyTerm).then(response => {
    return response;
  });
  // return data;
}

// getNews("Apple").then(response => console.log(response));
console.log(getArticles("Apple"));
