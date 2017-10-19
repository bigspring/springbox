# springbox
---
###### Requirements

- [WP-CLI](http://wp-cli.org/)

###### Installation

`npm install -g springbox`

###### Usage

1. Move into your htdocs directory (or wherever localhost points).
2. Run the command `springbox`.
3. Enter project name (used for the directory and database names).
4. Enter database details when prompted.
5. Enter Wordpress details when prompted.

###### Notes

- Installs the [Monolith Wordpress theme](https://github.com/bigspring/monolith).
- Deletes default themes and plugins.
- Databases created by springbox have the prefix 'sbx_'.
- Currently assumes WP is to be installed to a local database.
- Conditionally dumps a database export in the parent directory when done.
- Will print error messages but doesn't do much about the reported errors. If something goes wrong, delete the install directory and database (if they were created), resolve any other errors and try again.

###### Configuration

No configuration available yet.
