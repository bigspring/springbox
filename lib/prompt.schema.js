module.exports = {
	properties: {
		projectname: {
			description: 'Project name',
			pattern: /^[a-zA-Z0-9\-]+$/,
			message: 'Project name must be only letters, numbers or dashes',
			required: true
		},
		db_username: {
			description: 'Database username',
			required: true
		},
		db_password: {
			description: 'Database password',
			hidden: true
		},
		wp_username: {
			description: 'Wordpress username',
			pattern: /^[a-zA-Z0-9\_]+$/,
			message: 'Username must be only letters and numbers',
			required: true
		},
		wp_password: {
			description: 'Wordpress password',
			required: true
		},
		wp_prefix: {
			description: 'Wordpress table prefix (excluding underscore)',
			required: true
		}
	}
};
