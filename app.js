//test
var watch = require('watch');
var xml2js = require('xml2js');
var fs = require('fs');
var through = require('through2');
var path = require('path');
var mkdirp = require('mkdirp');

//var buffer = through(start, end);


var readRootDir = process.argv[2];
var writeRootDir = process.argv[3];

watch.createMonitor(readRootDir, function (monitor) {

	convertExistingToJson(readRootDir)

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
	var xmlFile = '';
	var jsonString;
	var outFileDir = (pathInfo.dir + '/').replace(readRootDir, writeRootDir) 

	if(pathInfo.ext !== '.xml') return console.log("Not XML, no changes");

	console.log("attempting to convert " + pathInfo.base);

	mkdirp(outFileDir, function (err) {
		fs.createReadStream(f).pipe(through(read, done))
			.pipe(through(write, end))
			.pipe(fs.createWriteStream(outFileDir + pathInfo.name + ".json")
				.on('error', function(err){ console.log(err)}));
	});

	function read(buff, enc, next){
		xmlFile += buff.toString();
		next();
	}

	function done(done){
		this.push(xmlFile);
		done();
	}

	function write(buff, enc, next){

		parser.parseString(xmlFile, function(err, result){
			if(err) return console.log("there was an error " + err);
			jsonString = result;
			next();
		})
	}

	function end(done){
		this.push(JSON.stringify(jsonString));
		done();
	}
}

function convertExistingToJson(rootDir){

	fs.readdir(rootDir, function(err, files){
		for (var i in files){
			var stats = fs.lstatSync(rootDir + '/' + files[i]);
			if(stats.isFile())
				convertToJson(rootDir + "/" + files[i]);
			else if(stats.isDirectory())
				convertExistingToJson(rootDir + "/" + files[i])
		}
	})
}

