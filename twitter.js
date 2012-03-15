var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');

var client = redis.createClient();

client.exists('awesome', function(err, exists) {
    if(err) {
    	console.log('ERROR: ' + err);
    } if(!exists) {
    	client.set('awesome', 0);
    }
});

var t = new twitter({
	consumer_key: credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
});

t.stream(
	'statuses/filter',
	{ track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
	function(stream) {
		stream.on('data', function(tweet) {
			if(tweet.text.match(/awesome/)) {
				client.incr('awesome', function(err, value) {
				//	client.publish('awesome', value);
				});
				console.log(tweet.text);
				//tweet.created_at
				//tweet.profile_image_url
			}
		});
	}
);
