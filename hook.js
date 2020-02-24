const express = require( 'express' );
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_TOKEN,
    secret: process.env.PUSHER_SECRET,
    cluster: 'eu',
    encrypted: true
});

const app = express();
app.use( express.json() );

app.post('/webhook', ( req, res ) => {
    console.log( 'received webhook', req.body );
    pusher.trigger('my-channel', 'my-event', req.body, undefined, (err) => {
        if (err) {
            res.sendStatus( 500 );
        } else {
            res.sendStatus( 200 );
        }
    });
} );

app.listen(3000, () =>
    console.log('app running on 3000'));
