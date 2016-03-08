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
        global $CFG;

        // lazy initialization
        if (!empty($this->content)) {
            return $this->content;
        }

        // get the activity tree JSON
        $activity_tree_json = json_encode(block_activity_tree\get_activity_tree(
            get_fast_modinfo($this->page->course),
            optional_param('section', -1, PARAM_INT),
            $this->page->context
        ));

        // get the activity tree config
        $activity_tree_config = json_encode((object)[
            'wwwroot' => $CFG->wwwroot,
            'sesskey' => sesskey(),
            'trans' => (object)[
                'prev' => get_string('previous'),
                'next' => get_string('next'),
            ],
            'type' => empty($this->config->type) ? 'tree' : $this->config->type,
        ]);

        // render the activity tree
        $this->content = new stdClass();
        $this->content->text = <<<HTML
            <div class="into_block_render_target"></div>
            <script class="into_block_json" type="application/json">{$activity_tree_json}</script>
            <script class="into_block_config" type="application/json">{$activity_tree_config}</script>
HTML;
        $this->content->footer = '';
        return $this->content;
    }

    /**
     * The block depends upon a React app (which should only be loaded once).
     * Unfortunately, it is necessary to use the Moodle page requirements manager.
     */
    public function get_required_javascript() {
        parent::get_required_javascript();

        // if debugging, load unminified script
        $script_src = 'build/activity_tree.min.js';
        if (debugging()) {
            $script_src = str_replace('.min.js', '.js', $script_src);
        }

        /** @var page_requirements_manager $prm */
        $prm = $this->page->requires;
        $prm->js(new moodle_url('/blocks/activity_tree/static/js/' . $script_src));
    }

    /**
     * @return string
     */
    public function get_aria_role() {
        return 'navigation';
    }

    /**
     * @return boolean
     */
    public function instance_allow_multiple() {
        return true;
    }

    /**
     * @return boolean
     */
    public function instance_can_be_docked() {
        return false;
    }

}
