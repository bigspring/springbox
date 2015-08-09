#! /usr/bin/env node

var prompt = require('prompt');

var args = process.argv.slice(2);
var config = {
	name: args[0] || 'springbox-project',
	path: '~/htdocs/'
};

console.log(config);

var wp = require('./lib/wordpress.js')(config);
