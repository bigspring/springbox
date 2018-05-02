#! /usr/bin/env node

var colors = require('colors');
var prompt = require('prompt');
var promptSchema = require('./lib/prompt.schema.js');

console.log('SPRINGBOX > BEGIN.'.bold.green.bgBlue);

var options = {
	wp: {
		theme: 'https://github.com/bigspring/M3/archive/master.zip'
	}
};

options.wp.plugins = [
	'advanced-text-widget',
	'amp',
	'breadcrumb-navxt',
	'cms-tree-page-view',
	'custom-post-type-ui',
	'force-regenerate-thumbnails',
	'gathercontent-import',
	'imsanity',
	'widget-logic',
	'wordpress-seo'
];

prompt.start();
prompt.get(
	promptSchema,
	function (err, res) {
		if (err) {
			console.log('SPRINGBOX > An error occurred: '.red.bgBlack);
			console.log(err);
			return false;
		}

		options.name = {
			default: res.projectname,
			short: res.projectname.replace('-', ''),
			title: res.projectname.replace('-', ' ')
		};

		var wp = require('./lib/wordpress.js')(res, options);
	}
);
