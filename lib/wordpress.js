module.exports = function() {
	var wpcli = require('wp-cli');

	wpcli.discover({path:'~/htdocs/springbox-test'}, function(wpcli) {
		wpcli.cli.info(function(err,info) {
			console.log(info);
		});
	});
}
