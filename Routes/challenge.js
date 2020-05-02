const express = require('express');
const router = express.Router();
const crypto = require('crypto');
require('dotenv/config');

var fs = require('fs');
var request = require('request');

const numCasas = 1;

router.get('/', (req, res) => {

    request.get({ url: 'https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=' + process.env.TOKEN_FELIPE }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            console.log(err);
            return console.error('upload failed:', err);
        }
        let cifrado = JSON.parse(body.toString())['cifrado'];
        let decifrado = "";

        for (let j = 0; j < cifrado.length; j++) {
            let code = cifrado.charCodeAt(j)
            decifrado += (code > 97 && code <= 122) ? String.fromCharCode((code - numCasas)) : ((code == 97) ? String.fromCharCode((code - numCasas) + 26) : cifrado.charAt(j));
        }

        //criptografia do texto decifrado
        let cr = crypto.createHash('sha1').update(decifrado).digest('hex');

        let obj = {
            numero_casas: numCasas,
            token: process.env.TOKEN_FELIPE,
            cifrado: JSON.parse(body.toString())['cifrado'],
            decifrado: decifrado,
            resumo_criptografico: cr
        }

        let json = JSON.stringify(obj);
        //console.log(json);

        fs.writeFile('answer.json', json, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
});

router.get('/submit', (req, res) => {
    const formData =
    {
        'answer': {
            'value': fs.createReadStream('answer.json'),
            'options': {
                'filetype': 'json',
                'contentType': 'multipart/form-data'
            }
        }
    };

    request.post(
        { url: 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=' + process.env.TOKEN_FELIPE, 
          formData: formData,
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }, function callback(err, httpResponse, body) {
            if (err) {
                console.log(err);
                return console.error('upload failed:', err);
            }
            if(httpResponse.statusCode != 200){
                console.log('HTTP code returned:' + httpResponse.statusCode + '. Error returned:', body);
            } else{
                console.log('HTTP code returned:' + httpResponse.statusCode + '. Upload successful!  Server responded with:', body);
            }
        }
    );
});

module.exports = router;
