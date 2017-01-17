var async = require('async');
var fs = require('fs');
var prompt = require('prompt');
var wpcli = require('wp-cli');

var WpInstall = function(wp, options, config) {
	return [
		function(callback) {
			log('Downloading core files...'.green.bgBlue);
			wp.core.download(function(err, res) {
				console.log(res);
				callback(err, res);
			});
		},
		function(callback) {
			log('Setting up config...'.green.bgBlue);
			wp.core.config(config.db, function(err, res) {
				console.log(res);
				callback(err, res);
			});
		},
		function(callback) {
			var dbHost = config.db.dbhost.join(''); // WP-CLI turns db config strings into arrays
			if ('127.0.0.1' === dbHost) {
				log('Creating database...'.green.bgBlue);
				wp.db.create(function(err, res) {
					console.log(res);
					callback(err, res);
				});
			} else {
				callback();
			}
		},
		function(callback) {
			log('Installing core files...'.green.bgBlue);
			wp.core.install(config.install, function(err, res) {
				console.log(res);
				callback(err, res);
			});
		},
		function(callback) {
			log('Installing Monolith...'.green.bgBlue);
			var theme = options.wp.theme;
			wp.theme.install(theme, function(err, res) {
				console.log(res);
				callback(err, res);
			});
		},
		function(callback) {
			log('Renaming Monolith directory...'.green.bgBlue);
			fs.rename(
				options.name.default + '/wp-content/themes/M3',
				options.name.default + '/wp-content/themes/' + options.name.default,
				function(err, res) {
					callback(err, res);
				}
			);
		},
		function(callback) {
			log('Activating Monolith...'.green.bgBlue);
			wp.theme.activate(options.name.default, function(err, res) {
				console.log(res);
				callback(err, res);
			});
		},
		function(callback) {
			log('Installing plugins...'.green.bgBlue);
			wp.plugin.install(options.wp.plugins.join(' '), function(err, res) {
				console.log(res);
				callback(err, res);
			});
		},
		function(callback) {
			log('Removing default plugins...'.green.bgBlue);
			var byePlugins = ['hello', 'akismet'];
			wp.plugin.uninstall(byePlugins.join(' '), function(err, res) {
				console.log(res);
				callback(err, res);
			});
		}
	];
};

function log(msg) {
	console.log(('SPRINGBOX > ' + msg).green.bgBlue);
}

module.exports = function(config, options) {
	config.db = {
		dbname: config.db_name ? config.db_name : 'sbx_' + options.name.short,
		dbuser: config.db_username,
		dbpass: config.db_password,
		dbprefix: config.wp_prefix + '_',
		dbhost: config.db_host ? config.db_host : '127.0.0.1'
	};

	config.install = {
		url: 'http://localhost/' + options.name.default,
		title: options.name.title,
		admin_user: config.wp_username,
		admin_password: config.wp_password,
		admin_email: config.wp_email
	};

	log('Starting Wordpress install...'.bold.green.bgBlue);

	wpcli.discover({path: options.name.default}, function(wp) {
		async.series(WpInstall(wp, options, config), function(err, res) {
			if (err) {
				log('An error occurred:'.red.bgBlack);
				console.log(err);
				return false;
			}
			log('Wordpress install complete.'.bold.green.bgBlue);
			return true;
		});
	});
};
