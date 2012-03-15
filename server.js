var http = require('http');
var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');

var awesomeCount = 0;
var coolCount = 0;

//create redis client

var client = redis.createClient();

//if the 'awesome' key doesn't exist, create it

client.exists('awesome', function(error, exists) {
	if(error) {
	   console.log('ERROR: '+error);
	} else if(!exists) {
	    client.set('awesome', 0); //creates the awesome key
	};
});

var t = new twitter({
	consumer_key: credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
});

t.stream(
	'statuses/filter',
	{ track: ['awesome', 'cool', 'love', 'hate', 'groovy'] },
	function(stream) {
		stream.on('data', function(tweet) {
			console.log(tweet.text);
			//if awesome is in the tweet text, increment the counter

			if (tweet.text.match(/awesome/)) {
				client.incr('awesome');
			}
		});
	}
);

//sets up http server
http.createServer(function (req, res) {
	client.mget(['love', 'hate'], function(err, results) {
		var response = '<b>Hello!</b><br/>';
		response += '<p>There are ' + results[0] + 'occurrences of Love</p>';
		response += '<p>There are ' + results[1] + 'occurrences of Hate</p>';
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(response);
	});
}).listen(3000);

console.log('Server running on port 3000');


