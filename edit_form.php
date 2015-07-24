<?php

defined('MOODLE_INTERNAL') || die();

class block_activity_tree_edit_form extends block_edit_form {

    /**
     * @param MoodleQuickForm $mform
     */
    protected function specific_definition(MoodleQuickForm $mform) {
        $mform->addElement('header', 'configheader', get_string('blocksettings', 'block'));

        $options = [
            'tree' => get_string('config_type_tree', 'block_activity_tree'),
            'prev_next' => get_string('config_type_prev_next', 'block_activity_tree'),
        ];
        $mform->addElement(
            'select',
            'config_type',
            get_string('config_type', 'block_activity_tree'),
            $options
        );
        $mform->setDefault('config_type', 'tree');
    }

}
