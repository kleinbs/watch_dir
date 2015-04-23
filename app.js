//test
var watch = require('watch');
var fs = require('fs');

watch.createMonitor(process.argv[2], function (monitor) {
	monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
	monitor.on("created", function (f, stat) {
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