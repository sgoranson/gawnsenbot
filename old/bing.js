//Copyright (c) Microsoft Corporation. All rights reserved.
//Licensed under the MIT License.

'use strict';

let https = require('https');

let bingKey = '7746e1401749408ba5a70fc145406335';


let search = 'sissy';
console.log('Searching images for: ' + search);
let request_params = {
    method : 'GET',
    hostname : 'api.cognitive.microsoft.com',
    path :  '/bing/v7.0/images/search?q=' + encodeURIComponent(search) + '&imageType=AnimatedGif&safeSearch=Off',
    headers : {
        'Ocp-Apim-Subscription-Key' : bingKey,
    }
};

let req = https.request(request_params, (response) => {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });

    response.on('end', function () {
        let imageResults = JSON.parse(body);
        if (imageResults.value.length > 0) {
            imageResults.value.forEach(img => console.log(img.contentUrl));
            // let firstImageResult = imageResults.value[0];
        }
        else {
            console.log("Couldn't find image results!");
        }
    });

    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
});

req.end();



