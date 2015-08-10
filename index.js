#! /usr/bin/env node

var prompt = require('prompt');

var args = process.argv.slice(2);
var projectname = args[0] || 'springbox-project'

var options = {
	wp: {
		theme: "https://github.com/bigspring/monolith/archive/master.zip"
	}
};

options.wp.plugins = [
	"advanced-text-widget",
	"better-wp-security",
	"breadcrumb-navxt",
	"bulk-page-creator",
	"cms-tree-page-view",
	"force-regenerate-thumbnails",
	"imsanity",
	"widget-logic",
	"wp-password-generator",
	"wordpress-seo"
];

var promptSchema = {
	properties: {
		projectname: {
			description: 'Project name',
			pattern: /^[a-zA-Z0-9\-]+$/,
			message: 'Project name must be only letters, numbers or dashes',
			required: true
		},
		db_username: {
			description: 'Database username',
			pattern: /^[a-zA-Z0-9\-]+$/,
			message: 'Username must be only letters, numbers or dashes',
			required: true
		},
		db_password: {
			description: 'Database password',
			hidden: true
		},
		wp_username: {
			description: 'Wordpress username',
			pattern: /^[a-zA-Z0-9]+$/,
			message: 'Username must be only letters and numbers',
			required: true
		},
		wp_password: {
			description: 'Wordpress Password',
			required: true
		},
		wp_prefix: {
			description: 'Wordpress table prefix (excluding underscore)',
			required: true
		}
	}
};

prompt.start();
prompt.get(
	promptSchema,
	function (err, res) {
		if (err) {
			console.log('SPRINGBOX > An error occurred: ');
			console.log(err);
			return false;
		}
		console.log('SPRINGBOX > Installing WP...');

		options.name = {
			default: res.projectname,
			short: res.projectname.replace('-', ''),
			title: res.projectname.replace('-', ' ')
		}

		var wp = require('./lib/wordpress.js')(res, options);
	}
);
