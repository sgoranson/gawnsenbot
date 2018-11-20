'use strict';

// https://stackoverflow.com/questions/45395369/how-to-get-console-log-line-numbers-shown-in-nodejs
['log', 'warn', 'error'].forEach((methodName) => {
    const originalMethod = console[methodName];
    console[methodName] = (...args) => {
        let initiator = 'unknown place';
        try {
            throw new Error();
        } catch (e) {
            if (typeof e.stack === 'string') {
                let isFirst = true;
                for (const line of e.stack.split('\n')) {
                    const matches = line.match(/^\s+at\s+(.*)/);
                    if (matches) {
                        if (!isFirst) { // first line - current function
                            // second line - caller (what we are looking for)
                            initiator = matches[1];
                            break;
                        }
                        isFirst = false;
                    }
                }
            }
        }
        originalMethod.apply(console, [...args, '\n', `  at ${initiator}`]);
    };
});


const TeleBot = require('telebot');
const https = require('https');

const bot = new TeleBot('533296527:AAEqhLiXxpxm8T5EIVKAQ__DdLMDvUnYNco');
const bingKey = '7746e1401749408ba5a70fc145406335';


// On inline query
bot.on('inlineQuery', msg => {

    if(msg.query) {
        let query = msg.query;
        console.log(`inline query: ${ query }`);
        console.log(msg);


        const answers = bot.answerList(msg.id, {cacheTime: 600});

        // Article

        answers.addPhoto({
            id: 'photo',
            caption: 'cat',
            photo_url: 'http://thecatapi.com/api/images/get',
            thumb_url: 'http://thecatapi.com/api/images/get'
        });

        console.log('Searching images for: ' + query);

        let request_params = {
            method : 'GET',
            hostname : 'api.cognitive.microsoft.com',
            path :  '/bing/v7.0/images/search?q=' + encodeURIComponent(query) + '&imageType=AnimatedGif&safeSearch=Off',
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


                    for(let i = 0; i < imageResults.value.length && i < 25; i++) {
                        const gif_url = imageResults.value[i].contentUrl;
                        console.log(`gif_url: ${ gif_url }`);

                        answers.addGif({
                            id: '' + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
                            gif_url: gif_url,
                            thumb_url: gif_url
                        });


                    }

                }
                else {
                    console.log("Couldn't find image results!");
                }

                bot.answerQuery(answers);
            });

            response.on('error', function (e) {
                console.log('Error: ' + e.message);
                bot.answerQuery(answers);
            });
        });

        req.end();

    }
});

bot.start();
