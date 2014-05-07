var express = require('express'), app = express(), request = require('request'), path = require('path'), moment = require('moment');

var envInfo = process.env.VCAP_SERVICES;

if (process.env.VCAP_SERVICES) {
	var env = JSON.parse(process.env.VCAP_SERVICES);
	if (env['mongodb-2.2']) {
		var mongo = env['mongodb-2.2'][0]['credentials'];
	}

}

var port = (process.env.VCAP_APP_PORT || 1337);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0');

app.use(express.static(path.join(__dirname + "/public", '')));

app.get('/getmessages', function(req, res) {
	require('mongodb').connect(mongo.url, function(err, conn) {
		var collection = conn.collection('messages');

		// list messages
		collection.find({}, {
			limit : 10,
			sort : [ [ '_id', 'desc' ] ]
		}, function(err, cursor) {
			cursor.toArray(function(err, items) {
				res.writeHead(200, {
					'Content-Type' : 'text/plain'
				});
				console.log("items are " + items);
				res.write(JSON.stringify(items));
				res.end();
			});
		});
	});

});

app.get('/deletemessage/:messageId', function(req, res) {
	var messageId = req.params.messageId;

	require('mongodb').connect(mongo.url, function(err, conn) {
		var ObjectID = require('mongodb').ObjectID;
		var collection = conn.collection('messages');
		// list messages
		// Remove all the document
		collection.remove({
			"_id" : ObjectID(messageId)
		}, function(err, numberOfRemovedDocs) {
			res.writeHead(200, {
				'Content-Type' : 'text/plain'
			});
			if (err) {
				res.write('error deleting entry: ' + err);
			}
			else {
				res.write(JSON.stringify({'action':'Deleted ' + numberOfRemovedDocs + ' record from the guestbook'}));
			}

			res.end('\n');

		});

	});
});

app.get('/postmessage/:message/:name/:favoriteKeyword', function(req, res) {
	var messageText = req.params.message;
	var name = req.params.name;
	var favoriteKeyword = req.params.favoriteKeyword;

	require('mongodb').connect(mongo.url, function(err, conn) {
		var collection = conn.collection('messages');
		var message = {
			'guestName' : name,
			'messageText' : messageText,
			'favoriteKeyword' : favoriteKeyword,
			'ts' : new Date()
		};
		collection.insert(message, {
			safe : true
		}, function(err) {
			if (err) {
				console.log(err.stack);
			}
			res.writeHead(200, {
				'Content-Type' : 'text/plain'
			});
			res.write(JSON.stringify(message));
			res.end('\n');
		});
	});

});

app.listen(port);
