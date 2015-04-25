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

	//console.log(f);
	var pathInfo = path.parse(f)
	var parser = new xml2js.Parser()
	var xmlFile = '';
	var jsonString;

	var outFileDir = (pathInfo.dir + '/').replace(readRootDir, writeRootDir) 
	//console.log(readRootDir);
	//console.log(pathInfo.dir)
	//console.log(writeRootDir);
	//console.log(outFile);
	console.log(pathInfo.ext)
	if(pathInfo.ext !== '.xml') return console.log("Not XML, no changes");
	
	mkdirp(outFileDir, function (err) {
		if (err) return console.log("Couldn't create directory");
		console.log('hi')
		//console.log(f)
		fs.createReadStream(f).pipe(through(read, done)).pipe(through(write, end))
			.pipe(fs.createWriteStream(outFileDir + pathInfo.name + ".json")
			.on('error', function(err){ console.log(err)}));
			done();
		console.log('done');
	})	

	function read(buff, enc, next){
		console.log("talk to me " + buff.toString());
		xmlFile += buff.toString();
		next();
	}

	function done(done){
		console.log("this is the xml file " + xmlFile);
		this.push(xmlFile);
		done();
	}

	function write(buff, enc, next){

		parser.parseString(xmlFile, function(err, result){
			if(err) return console.log("there was an error " + err);
			console.log(result);
			jsonString = result;
			next();
		})
	}

	function end(done){
		this.push(JSON.stringify(jsonString));
		console.log("writing JSON")
	}

	function mkdir(dirPath, todo){
		console.log(dirPath);
		fs.mkdirParent = function(dirPath, mode, callback) {
			console.log(dirPath);
			fs.mkdir(dirPath, mode, function(error){
				if(error && error.errno === 34){
					console.log(dirPath)
					fs.mkdirParent(path.dirname(dirPath), mode, callback);
					fs.mkdirParent(path, mode, calback);
				}
				callback && callback(error);
			});
		};
	};
}

