var async = require('async');
var fs = require('fs');
var prompt = require('prompt');
var wpcli = require('wp-cli');

var WpInstall = function(wp, options, config) {
	return [
		function(callback) {
			console.log('SPRINGBOX > Downloading core files...'.green.bgBlue);
			wp.core.download(function(err, res) {
				callback(err, res);
			});
		},
		function(callback) {
			console.log('SPRINGBOX > Setting up config...'.green.bgBlue);
			wp.core.config(config.db, function(err, res) {
				callback(err, res);
			});
		},
		function(callback) {
			console.log('SPRINGBOX > Creating local database...'.green.bgBlue);
			wp.db.create(function(err, res) {
				callback(err, res);
			});
		},
		function(callback) {
			console.log('SPRINGBOX > Installing core files...'.green.bgBlue);
			wp.core.install(config.install, function(err, res) {
				callback(err, res);
			});
		},
		function(callback) {
			console.log('SPRINGBOX > Installing Monolith...'.green.bgBlue);
			var theme = options.wp.theme;
			wp.theme.install(theme, function(err, res) {
				callback(err, res);
			});
		},
		function(callback) {
			console.log('SPRINGBOX > Renaming Monolith directory...'.green.bgBlue);
			fs.rename(
				options.name.default + '/wp-content/themes/monolith-master',
				options.name.default + '/wp-content/themes/' + options.name.default,
				function(err, res) {
					callback(err, res);
				}
			);
		},
		function(callback) {
			console.log('SPRINGBOX > Activating Monolith...'.green.bgBlue);
			wp.theme.activate(options.name.default, function(err, res) {
				callback(err, res);
			});
		},
		function(callback) {
			console.log('SPRINGBOX > Removing default themes...'.green.bgBlue);
			var byeThemes = ['twentythirteen', 'twentyfourteen', 'twentyfifteen'];
			wp.theme.delete(byeThemes.join(' '), function(err, res) {
				callback(err, res);
			});
		},
		function(callback) {
			console.log('SPRINGBOX > Installing plugins...'.green.bgBlue);
			wp.plugin.install(options.wp.plugins.join(' '), function(err, res) {
				callback(err, res);
			});
		},
		function(callback) {
			console.log('SPRINGBOX > Removing default plugins...'.green.bgBlue);
			var byePlugins = ['hello', 'akismet'];
			wp.plugin.uninstall(byePlugins.join(' '), function(err, res) {
				callback(err, res);
			});
		},
		function(callback) {
			prompt.start();
			prompt.get({
					properties: {
						wp_export_db: {
							description: 'Do you want to export the database?',
							pattern: /[yn]/,
							message: 'y or n?',
							required: true
						}
					}
				},
				function (err, res) {
					if (err) {
						callback(err, res);
					}
					if (res.wp_export_db === 'n') {
						callback(err, res);
					} else {
						console.log('SPRINGBOX > Exporting database...'.green.bgBlue);
						wpinst.wp.db.export(null, function(err, res) {
							callback(err, res);
						});
					}
				}
			)
		}
	];
}

function WpInstaller (wpcli, config, options) {
	this.wp = null;
	this.wpcli = wpcli;
	this.config = config;
	this.options = options;
	this.init();
};

WpInstaller.prototype.init = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Starting Wordpress install...'.bold.green.bgBlue);
	wpinst.wpcli.discover({path: wpinst.options.name.default}, function(wp) {
		wpinst.wp = wp;
		wpinst.downloadCore();
	});
};

WpInstaller.prototype.downloadCore = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Downloading core files...'.green.bgBlue);
	wpinst.wp.core.download(function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.setupConfig();
	});
};

WpInstaller.prototype.setupConfig = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Setting up config...'.green.bgBlue);
	wpinst.wp.core.config(wpinst.config.db, function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.createDb();
	});
};

WpInstaller.prototype.createDb = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Creating local database...'.green.bgBlue);
	wpinst.wp.db.create(function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.installCore();
	});
};

WpInstaller.prototype.installCore = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Installing core files...'.green.bgBlue);
	wpinst.wp.core.install(wpinst.config.install, function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.installTheme();
	});
};

WpInstaller.prototype.installTheme = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Installing Monolith...'.green.bgBlue);
	var theme = wpinst.options.wp.theme;
	wpinst.wp.theme.install(theme, function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		fs.rename(
			wpinst.options.name.default + '/wp-content/themes/monolith-master',
			wpinst.options.name.default + '/wp-content/themes/monolith',
			function(err) {
				if (wpinst.errorHandler(err)) return false;
				wpinst.activateTheme();
			}
		);
	});
};

WpInstaller.prototype.activateTheme = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Activating Monolith...'.green.bgBlue);
	wpinst.wp.theme.activate('monolith', function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.removeThemes();
	});
};

WpInstaller.prototype.removeThemes = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Removing default themes...'.green.bgBlue);
	var byeThemes = ['twentythirteen', 'twentyfourteen', 'twentyfifteen'];
	wpinst.wp.theme.delete(byeThemes.join(' '), function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.installPlugins();
	});
};

WpInstaller.prototype.installPlugins = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Installing plugins...'.green.bgBlue);
	wpinst.wp.plugin.install(wpinst.options.wp.plugins.join(' '), function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.removePlugins();
	});
};

WpInstaller.prototype.removePlugins = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Removing default plugins...'.green.bgBlue);
	var byePlugins = ['hello', 'akismet'];
	wpinst.wp.plugin.uninstall(byePlugins.join(' '), function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.exportDb();
	});
};

WpInstaller.prototype.exportDb = function() {
	var wpinst = this;
	prompt.start();
	prompt.get({
			properties: {
				wp_export_db: {
					description: 'Do you want to export the database?',
					pattern: /[yn]/,
					message: 'y or n?',
					required: true
				}
			}
		},
		function (err, res) {
			if (wpinst.errorHandler(err)) return false;
			if (res.wp_export_db === 'n') {
				wpinst.finish();
				return false;
			}
			console.log('SPRINGBOX > Exporting database...'.green.bgBlue);
			wpinst.wp.db.export(null, function(err, res) {
				if (wpinst.errorHandler(err)) return false;
				console.log(res);
				wpinst.finish();
			});
		}
	);
};

WpInstaller.prototype.errorHandler = function(err) {
	if (err) {
		console.log('SPRINGBOX > An error occurred:'.red.bgBlack);
		console.log(err);
	}
	return err;
};

WpInstaller.prototype.finish = function() {
	console.log('SPRINGBOX > Wordpress install complete.'.bold.green.bgBlue);
};

module.exports = function(config, options) {
	config.db = {
		dbname: 'sbx_' + options.name.short,
		dbuser: config.db_username,
		dbpass: config.db_password,
		dbprefix: config.wp_prefix + '_',
		dbhost: '127.0.0.1'
	};

	config.install = {
		url: 'http://localhost/' + options.name.default,
		title: options.name.title,
		admin_user: config.wp_username,
		admin_password: config.wp_password,
		admin_email: config.wp_email
	};

	//new WpInstaller(wpcli, config, options);

	console.log('SPRINGBOX > Starting Wordpress install...'.bold.green.bgBlue);

	wpcli.discover({path: options.name.default}, function(wp) {
		async.series(WpInstall(wp, options, config), function(err, res) {
			if (err) {
				console.log('SPRINGBOX > An error occurred:'.red.bgBlack);
				console.log(err);
				return false;
			}
			console.log('SPRINGBOX > Wordpress install complete.'.bold.green.bgBlue);
			return true;
		});
	});
};
