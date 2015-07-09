# Block activity tree

A Moodle block plugin that shows activities in a tree structure.

## Dependencies

Moodle 2.9

The following package must be added to `composer.json`:

    "require": {
        "lstrojny/functional-php": "1.0.0"
    }

Relative to the directory in which Moodle is installed:

    ./composer.phar self-update
    ./composer.phar update

## Installation

Relative to the directory in which Moodle is installed:

    cd blocks
    git clone https://github.com/INTO-University-Partnerships/block-activity-tree activity_tree
    cd ..
    php admin/cli/upgrade.php

## Tests

Relative to the directory in which Moodle is installed:

    php admin/tool/phpunit/cli/util.php --buildcomponentconfigs
    vendor/bin/phpunit -c blocks/activity_tree
