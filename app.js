//test
var watch = require('watch');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var through = require('through2');

var stream = through(write, end);

watch.createMonitor(process.argv[2], function (monitor) {
	monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
	monitor.on("created", function (f, stat) {
		if(stat.isFile())
			var xml = fs.createReadStream(f).pipe(stream);

			//console.log(xml);

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
	//this.push(buffer.toString().toUpperCase());
	console.log(buffer.toString());
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