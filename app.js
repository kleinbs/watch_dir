//test
var watch = require('watch');
var xml2js = require('xml2js');
var fs = require('fs');
var through = require('through2');
var path = require('path');
var mkdirp = require('mkdirp');

var readRootDir;
var writeRootDir;

watch.createMonitor(process.argv[2], function (monitor) {

	if(process.argv.length < 2)
		return console.log("need at least three arguements")
	if(process.argv.length === 3){
		readRootDir = process.argv[2];
		writeRootDir = process.argv[2];
	} else if(process.argv.length === 4){
		readRootDir = process.argv[2];
		writeRootDir = process.argv[3];
	}

	console.log(process.argv.length)

	initalizeFiles(readRootDir);

	monitor.on("created", function (f, stat) {
		if(stat.isFile())
			convertToJson(f);
	})
	monitor.on("changed", function (f, curr, prev) {
	  if(curr.isFile())
			convertToJson(f);
	})
	monitor.on("removed", function (f, stat) {
	  		removeFile(f);
	})
})

function convertToJson(f){

	console.log(f);
	var pathInfo = path.parse(f)
	var parser = new xml2js.Parser()
	var xmlFile = '';
	var jsonString;
	var outFileDir = (pathInfo.dir + '/').replace(readRootDir, writeRootDir) 

	if(pathInfo.ext !== '.xml') return console.log("Not XML, no changes");

	console.log("Converting " + pathInfo.base);

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
		console.log("File converted: " + pathInfo.base);
		this.push(JSON.stringify(jsonString));
		done();
	}
}

function removeFile(f){
	console.log(f.lastIndexOf('.xml') + 4)
	console.log(f.length);
	if(f.lastIndexOf('.xml') + 4 !== f.length) return console.log("unable to delete file: " + f)

	var outFile = (f).replace(readRootDir, writeRootDir).replace(f.substring(f.lastIndexOf('.xml'), f.lastIndexOf('.xml') + 4), '.json')
	console.log(outFile)
	console.log('attempting to remove ' + outFile) 
	fs.unlink(outFile, function(err){
		if(err) return console.log("unable to remove file: " + err)
	})
}

function initalizeFiles(rootDir){
	//console.log("initalizing Files")
	console.log(rootDir);
	fs.readdir(rootDir, function(err, files){
		for (var i in files){
			var stats = fs.lstatSync(rootDir + '/' + files[i]);
			if(stats.isFile()){
				convertToJson(rootDir + "/" + files[i]);
			}
			else if(stats.isDirectory()){
				initalizeFiles(rootDir + "/" + files[i])
			}
		}
	})
}

