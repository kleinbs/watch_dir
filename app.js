//test
var watch = require('watch');
var xml2js = require('xml2js');
var fs = require('fs');
var through = require('through2');
var path = require('path');

//var buffer = through(start, end);


var read = process.argv[2];
var write = process.argv[3];

watch.createMonitor(read, function (monitor) {

	monitor.on("created", function (f, stat) {
		if(stat.isFile())
			convertToJson(f);
	})
	monitor.on("changed", function (f, curr, prev) {
	  if(curr.isFile())
			convertToJson(f);
	})
	monitor.on("removed", function (f, stat) {
	  // Handle removed files
	})
	//monitor.stop(); // Stop watching
})

function convertToJson(f){

	console.log(f);
	var pathInfo = path.parse(f)
	var parser = new xml2js.Parser()
	var jsonString;

	if(pathInfo.ext !== '.xml') return console.log("Not XML, no changes");
	
	fs.createReadStream(f).pipe(through(write, end)).pipe(fs.createWriteStream(pathInfo.dir + "/" + pathInfo.name + ".json").on('error', function(err){ console.log(err)}));

	function write(buff, enc, next){

		console.log("Incoming XML \n" + buff.toString());
		parser.parseString(buff.toString(), function(err, result){
			if(err) return console.log("there was an error");

			jsonString = result;
			console.log(result);
			//this.push(result);
			
			next();
		})

		
	}

	function end(done){
		console.log("outgoing json " + JSON.stringify(jsonString));
		this.push(JSON.stringify(jsonString));
		done();
	}
}


