# springbox
### Installs Wordpress, the Monolith theme and a selection of useful plugins. Deletes Hello Dolly and Akismet. :)
---
###### Requirements

- [Node](http://www.nodejs.org)
- [WP-CLI](http://wp-cli.org/)

###### Installation

`npm install -g springbox`

###### Notes

- Currently assumes WP is to be installed locally.
- Will print error messages but doesn't do much about the reported errors. If something goes wrong, delete the install directory and database (if they were created), and try again.

###### Configuration

No configuration available yet.

###### Usage

1. Move into your htdocs directory (or wherever localhost points).
2. Run the command `springbox`
3. Enter database details when prompted.
4. Enter Wordpress details when prompted.
