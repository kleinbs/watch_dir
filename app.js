//test
var watch = require('watch');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var through = require('through2');

var retrieveXml = through(write, end);
var read = process.argv[2];
var write = process.argv[3];

watch.createMonitor(read, function (monitor) {
	monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
	monitor.on("created", function (f, stat) {
		if(stat.isFile()){

			fs.readFile(f, function (err, data){
				parseString(data.toString(), function(err, result){
					if(err) return;
					console.log(result);
					fs.writeFile(f + ".json", result, function(err){
						if (err) return console.log(err);
						else return console.log("success");
					})
				})
			})
			//var xml = fs.createReadStream(f)//.pipe(retrieveXml);
		}
			//console.log(xml.buffer.toString());
			//parseString(xml, function(err, result){
			//	console.log(result);
			//})
		console.log("created " + f)// Handle new files
	})
	monitor.on("changed", function (f, curr, prev) {
	  // Handle file changes
	})
	monitor.on("removed", function (f, stat) {
	  // Handle removed files
	})
	//monitor.stop(); // Stop watching
})

function write(buffer, encoding, next){

	this.push(parseString(buffer.toString(), function(err, result){
		if(err) return;
		console.log(result);
		fs.writeFile(f + ".xml", result, function(err){
			if (err) return console.log(err);
			else return console.log("success");
		})
	}))
	next();
}

function end(done){
	done();
}

function readFile(err, data){
	console.log(data);
	if(err) {
		return;
	}
	return data;
}

function xml2json(err, result){
	console.log(result);
}