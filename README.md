# Block activity tree

A Moodle block plugin that shows activities in a tree structure.

Commands are relative to the directory in which Moodle is installed.

## Dependencies

Moodle 2.9

The following package must be added to `composer.json`:

    "require": {
        "lstrojny/functional-php": "1.0.0"
    }

## Installation

Install [Composer](https://getcomposer.org/download/) if it isn't already.

    ./composer.phar self-update
    ./composer.phar update
    cd blocks
    git clone https://github.com/INTO-University-Partnerships/block-activity-tree activity_tree
    cd ..
    php admin/cli/upgrade.php

## Tests

### PHPUnit

    php admin/tool/phpunit/cli/util.php --buildcomponentconfigs
    vendor/bin/phpunit -c blocks/activity_tree

### Jasmine

    cd blocks/activity_tree
    npm install
    node_modules/karma/bin/karma start
