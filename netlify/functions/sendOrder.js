const https = require('https');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const orderMessage = data.message;

        // Apna asli Telegram Bot Token aur Chat ID yahan dalein
        const BOT_TOKEN = '8955915195:AAELKsPmB8C0FOUZ8ru0J4FcnScQajJtfA8';
        const CHAT_ID = '8391325461';

        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const postData = JSON.stringify({
            chat_id: CHAT_ID,
            text: orderMessage,
            parse_mode: 'HTML'
        });

        const sendToTelegram = () => {
            return new Promise((resolve, reject) => {
                const req = https.request(telegramUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                }, (res) => {
                    let responseBody = '';
                    res.on('data', (chunk) => responseBody += chunk);
                    res.on('end', () => resolve(responseBody));
                });

                req.on('error', (err) => reject(err));
                req.write(postData);
                req.end();
            });
        };

        await sendToTelegram();

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Order sent successfully!' })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
