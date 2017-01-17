# springbox
---
###### Requirements

- [WP-CLI](http://wp-cli.org/)
- Ensure that mysql is available via command line. This can be checked with the `which mysql` command; if this doesn't return anything then you'll need to add your mysql directory to your paths.

###### Installation

`npm install springbox -g`

###### Usage

1. Move into your htdocs directory (or wherever localhost points).
2. Run the command `springbox`.
3. Enter project name (used for the directory and database names).
4. Enter database details when prompted (leave host blank to use 127.0.0.1).
5. Enter Wordpress details when prompted.

###### Notes

- Installs the [Monolith Wordpress theme](https://github.com/bigspring/M3).
- Deletes default plugins.
- Will print error messages but doesn't do much about the reported errors.
- If something goes wrong, delete the install directory and database (if they were created), resolve any other errors and try again.

###### Configuration

No configuration available yet.
