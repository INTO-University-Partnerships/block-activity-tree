<?php

defined('MOODLE_INTERNAL') || die();

require_once __DIR__ . '/lib.php';

class block_activity_tree extends block_base {

    /**
     * @throws coding_exception
     */
    public function init() {
        $this->title = get_string('pluginname', 'block_activity_tree');
    }

    /**
     * @return stdClass
     */
    public function get_content() {
        // lazy initialization
        if (!empty($this->content)) {
            return $this->content;
        }

        // get the activity tree as JSON
        $activity_tree = json_encode(block_activity_tree\get_activity_tree(
            get_fast_modinfo($this->page->course),
            optional_param('section', -1, PARAM_INT),
            $this->page->context
        ));

        // render the activity tree
        $this->content = new stdClass();
        $this->content->text = <<<HTML
            <div id="into_block_activity_tree_render_target"></div>
            <script id="into_block_activity_tree_json" type="application/json">{$activity_tree}</script>
            <script src="http://moodle.coursenav.local/blocks/activity_tree/static/js/build/activity_tree.js"></script>
HTML;
        $this->content->footer = '';
        return $this->content;
    }

    /**
     * @return string
     */
    public function get_aria_role() {
        return 'navigation';
    }

}
