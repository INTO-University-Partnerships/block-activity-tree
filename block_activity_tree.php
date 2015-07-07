<?php

defined('MOODLE_INTERNAL') || die();

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/lib.php';

class block_activity_tree extends block_base {

    /**
     * @var Twig_Loader_Filesystem
     */
    protected $twig_loader_filesystem;

    /**
     * @var Twig_Environment
     */
    protected $twig_environment;

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
        if (empty($this->twig_loader_filesystem)) {
            $this->twig_loader_filesystem = new Twig_Loader_Filesystem(realpath(__DIR__));
        }
        if (empty($this->twig_environment)) {
            $this->twig_environment = new Twig_Environment($this->twig_loader_filesystem, [
                'cache' => false,
            ]);
        }

        // get the course tree (i.e. sections and their child course modules)
        $course_tree = get_course_tree(
            get_fast_modinfo($this->page->course),
            optional_param('section', -1, PARAM_INT),
            $this->page->context
        );

        // render the course tree
        $this->content = new stdClass();
        $this->content->text = $this->twig_environment->render('template.twig', [
            'wwwroot' => $CFG->wwwroot,
            'courseid' => $this->page->course->id,
            'sections' => $course_tree,
        ]);
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
