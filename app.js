//test
var watch = require('watch');
var xml2js = require('xml2js');
var fs = require('fs');
var through = require('through2');
var path = require('path');


var read = process.argv[2];
var write = process.argv[3];

watch.createMonitor(read, function (monitor) {

	monitor.on("created", function (f, stat) {
		if(stat.isFile())
			convertToJson(f);
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

function convertToJson(f){

	console.log(f);
	var pathInfo = path.parse(f)
	var parser = new xml2js.Parser()

	if(pathInfo.ext !== '.xml') return;
	
	var toXML = fs.readFile(f, function(err, data){
		parser.parseString(data, function(err, result){
			fs.writeFile(pathInfo.dir + "/" + pathInfo.name + ".json", result, function(err){
				if(err){
					console.log("Couldn't write JSON: " + e)
					return
				}
			})
		})
	})
}
