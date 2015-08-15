var fs = require('fs');
var wpcli = require('wp-cli');

function WpInstaller (wpcli, config, options) {
	this.wp = null;
	this.wpcli = wpcli;
	this.config = config;
	this.options = options;
	this.init();
};

WpInstaller.prototype.init = function() {
	var wpinst = this;
	console.log('SPRINGBOX > BEGIN.');
	wpinst.wpcli.discover({path: wpinst.options.name.default}, function(wp) {
		wpinst.wp = wp;
		wpinst.downloadCore();
	});
};

WpInstaller.prototype.downloadCore = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Downloading core files...');
	wpinst.wp.core.download(function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.setupConfig();
	});
};

WpInstaller.prototype.setupConfig = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Setting up config...');
	wpinst.wp.core.config(wpinst.config.db, function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.createDb();
	});
};

WpInstaller.prototype.createDb = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Creating local database...');
	wpinst.wp.db.create(function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.installCore();
	});
};

WpInstaller.prototype.installCore = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Installing core files...');
	wpinst.wp.core.install(wpinst.config.install, function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.installTheme();
	});
};

WpInstaller.prototype.installTheme = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Installing Monolith...');
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
	console.log('SPRINGBOX > Activating Monolith...');
	wpinst.wp.theme.activate('monolith', function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.removeThemes();
	});
};

WpInstaller.prototype.removeThemes = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Removing themes...');
	var byeThemes = ['twentythirteen', 'twentyfourteen', 'twentyfifteen'];
	wpinst.wp.theme.delete(byeThemes.join(' '), function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.installPlugins();
	});
};

WpInstaller.prototype.installPlugins = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Installing plugins...');
	wpinst.wp.plugin.install(wpinst.options.wp.plugins.join(' '), function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		wpinst.removePlugins();
	});
};

WpInstaller.prototype.removePlugins = function() {
	var wpinst = this;
	console.log('SPRINGBOX > Removing default plugins...');
	var byePlugins = ['hello', 'akismet'];
	wpinst.wp.plugin.uninstall(byePlugins.join(' '), function(err, res) {
		if (wpinst.errorHandler(err)) return false;
		console.log(res);
		console.log('SPRINGBOX > FIN.')
	});
};

WpInstaller.prototype.errorHandler = function(err) {
	if (err) {
		console.log('SPRINGBOX > An error occurred:');
		console.log(err);
	}
	return err;
};

module.exports = function(config, options) {
	config.db = {
		dbname: 'sbx_' + options.name.short,
		dbuser: config.db_username,
		dbpass: config.db_password,
		dbprefix: config.wp_prefix + '_',
		dbhost: 'localhost'
	};

	config.install = {
		url: 'http://localhost/' + options.name.default,
		title: options.name.title,
		admin_user: config.wp_username,
		admin_password: config.wp_password,
		admin_email: options.name.short + '@bigspring.co.uk'
	};
	new WpInstaller(wpcli, config, options);
};
