module.exports = function(config, options) {
	var wpcli = require('wp-cli');

	config.db = {
		dbname: 'sbx_' + options.name.short,
		dbuser: config.db_username,
		dbpass: config.db_password,
		dbprefix: config.wp_prefix + '_'
	};

	config.install = {
		url: 'http://localhost/' + options.name.default,
		title: options.name.title,
		admin_user: config.wp_username,
		admin_password: config.wp_password,
		admin_email: options.name.short + '@bigspring.co.uk'
	};

	wpcli.discover({path: options.name.default}, function(wpcli) {
		console.log('  Downloading core files...');
		wpcli.core.download(function(err, res) {
			console.log('  Setting up config...');
			wpcli.core.config(config.db, function(err, res) {
				console.log('  Creating local database...');
				wpcli.db.create(function(err, res) {
					console.log('  Installing core files...');
					wpcli.core.install(config.install, function(err, res) {
						console.log('  Installing themes...');
						for (var t in options.wp.themes) {
							var theme = [options.wp.themes[t]];
							if (t === 0) theme.push('--activate');
							wpcli.theme.install(theme, function(err, res) {
								console.log('  Installed "' + options.wp.themes[t] + '" theme.');
								if (t === 0) console.log('  Activated ' + options.wp.themes[t] + ' theme.');
							});
						}
						for (var p in options.wp.plugins) {
							console.log('    Precallback: ' + p);
							wpcli.plugin.install([options.wp.plugins[p], 'activate'], function(err, res) {
								console.log('    Postcallback: ' + p);
								console.log('  Installed "' + options.wp.plugins[p] + '" plugin.');
							});
						}
						console.log('  Removing terrible plugins...');
						var terriblePlugins = ['dolly', 'akismet'];
						for (var tp in terriblePlugins) {
							wpcli.plugin.uninstall([terriblePlugins[tp]], function(err, res) {
								console.log('  Removed "' + terriblePlugins[tp] + '" plugin.');
							});
						}
					});
				});
			});
		});
	});
};
