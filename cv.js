const imageAna = (file,callback)=> {
  let subscriptionKey = '';
let endpoint = '';
const request = require('request')


  var uriBase = endpoint + 'vision/v3.1/analyze';

  const imageUrl =file;

// Request parameters.
  const params = {
    'visualFeatures': 'Adult,Brands,Objects,Faces',
    'details': '',
    'language': 'en'
  };
  const options = {
      uri: uriBase,
      qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
};
request.post(options, (error, response, body) => {

  if (error) {
    console.log('Error: ', error);
    return callback(error,undefined);
  }
  let jsonResponse = JSON.parse(body);
  return callback(undefined,jsonResponse)
});
}


module.exports={imageAna}
