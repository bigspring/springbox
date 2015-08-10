module.exports = function(config, options) {
	var fs = require('fs');
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
		console.log('SPRINGBOX > Downloading core files...');
		wpcli.core.download(function(err, res) {
			if (err) return false;
			console.log(res);
			console.log('SPRINGBOX > Setting up config...');
			wpcli.core.config(config.db, function(err, res) {
				if (err) return false;
				console.log(res);
				console.log('SPRINGBOX > Creating local database...');
				wpcli.db.create(function(err, res) {
					if (err) return false;
					console.log(res);
					console.log('SPRINGBOX > Installing core files...');
					wpcli.core.install(config.install, function(err, res) {
						if (err) return false;
						console.log(res);
						console.log('SPRINGBOX > Installing Monolith...');
						var theme = options.wp.theme;
						wpcli.theme.install(theme, function(err, res) {
							if (err) return false;
							console.log(res);
							fs.rename(
								options.name.default + '/wp-content/themes/monolith-master',
								options.name.default + '/wp-content/themes/monolith',
								function(err) {
									if (err) return false;
									console.log('SPRINGBOX > Activating Monolith...');
									wpcli.theme.activate('monolith', function(err, res) {
										if (err) return false;
										console.log(res);
										console.log('SPRINGBOX > Installing plugins...');
										wpcli.plugin.install(options.wp.plugins.join(' '), function(err, res) {
											if (err) return false;
											console.log(res);
											console.log('SPRINGBOX > Removing default plugins...');
											var terriblePlugins = ['hello', 'akismet'];
											wpcli.plugin.uninstall(terriblePlugins.join(' '), function(err, res) {
												if (err) return false;
												console.log(res);
											});
										});
									});
								}
							);
						});
					});
				});
			});
		});
	});
};
