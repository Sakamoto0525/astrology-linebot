'use strict';

const line = require('@line/bot-sdk');
const crypto = require('crypto');

const client = new line.Client({ channelAccessToken: process.env.ACCESSTOKEN });

exports.handler = (event, context) => {
    // 署名検証
    let signature = crypto.createHmac('sha256', process.env.CHANNELSECRET).update(event.body).digest('base64');
    let checkHeader = (event.headers || {})['X-Line-Signature'];
    if(!checkHeader){
        checkHeader = (event.headers || {})['x-line-signature'];
    }
    let body = JSON.parse(event.body);
    const events = body.events;

    if (signature !== checkHeader) {
        console.log('署名認証エラー');
    }

    events.forEach(async (event) => {
        let message;

        if (event.type === 'message') {
            message = messageFunc(event);
        }

        // メッセージ返信
        if (message != undefined) {
            client.replyMessage(body.events[0].replyToken, message)
                .then((response) => {
                    let lambdaResponse = {
                        statusCode: 200,
                        headers: { "X-Line-Status": "OK" },
                        body: '{"result":"completed"}'
                    };
                    context.succeed(lambdaResponse);
                }).catch((err) => console.log(err));
        }
    });
};

const messageFunc = (e) => {
    if (e.message.type != "text") {
        return "テキストを入力してください。"
    }

    return {
        type: "text",
        text: e.message.text
    }
};