<?php

use Functional as F;

defined('MOODLE_INTERNAL') || die();

require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../lib.php';

class activity_tree_lib_test extends advanced_testcase {

    const NUM_SECTIONS = 10;

    /**
     * @var stdClass
     */
    protected $_course;

    /**
     * @var stdClass
     */
    protected $_forum;

    /**
     * @var stdClass
     */
    protected $_wiki;

    /**
     * @var array
     */
    protected $_section_info_all;

    /**
     * setUp
     */
    public function setUp() {
        $this->_course = $this->getDataGenerator()->create_course([
            'numsections' => self::NUM_SECTIONS,
        ], [
            'createsections' => true,
        ]);
        $this->_forum = $this->getDataGenerator()->create_module('forum', [
            'course' => $this->_course->id,
            'section' => 5,
        ]);
        $this->_wiki = $this->getDataGenerator()->create_module('wiki', [
            'course' => $this->_course->id,
            'section' => 6,
        ]);
        $course_modinfo = get_fast_modinfo($this->_course);
        $this->_section_info_all = $course_modinfo->get_section_info_all();
        $this->resetAfterTest();
    }

    /**
     * tests is_current_section when the given context is not a course context
     */
    public function test_is_current_section_when_not_course_context() {
        $section_info = F\head($this->_section_info_all);
        $result = is_current_section($section_info, 0, context_system::instance());
        $this->assertFalse($result);
    }

    /**
     * tests is_current_section when the given section number doesn't correspond to the given section's number
     */
    public function test_is_current_section_when_course_context_but_not_section_number() {
        $nine = 9;
        $section_info = F\head($this->_section_info_all);
        $this->assertNotEquals($nine, $section_info->section);
        $result = is_current_section($section_info, $nine, context_course::instance($this->_course->id));
        $this->assertFalse($result);
    }

    /**
     * tests is_current_section when the given section number corresponds to the given section's number
     */
    public function test_is_current_section_when_course_context_and_section_number() {
        $five = 5;
        $section_info = F\head(F\filter(
            $this->_section_info_all,
            function (section_info $section_info) use ($five) {
                return (integer)$section_info->section === $five;
            }
        ));
        $this->assertEquals($five, $section_info->section);
        $result = is_current_section($section_info, $five, context_course::instance($this->_course->id));
        $this->assertTrue($result);
    }

    /**
     * tests is_current_mod when the given context is a course context (i.e. not a module context)
     */
    public function test_is_current_mod_when_course_context() {
        $section_info = F\head($this->_section_info_all);
        $cm_info = F\head($section_info->modinfo->cms);
        $result = is_current_mod($cm_info, context_course::instance($this->_course->id));
        $this->assertFalse($result);
    }

    /**
     * tests is_current_mod when the given context is not the context of the given module
     */
    public function test_is_current_mod_when_not_module_context() {
        $section_info = F\head($this->_section_info_all);
        $cm_info = F\head(F\filter(
            $section_info->modinfo->cms,
            function (cm_info $cm_info) {
                return (integer)$cm_info->id === $this->_forum->cmid;
            }
        ));
        $result = is_current_mod($cm_info, context_module::instance($this->_wiki->cmid));
        $this->assertFalse($result);
    }

    /**
     * tests is_current_mod when the given context is the context of the given module
     */
    public function test_is_current_mod_when_module_context() {
        $section_info = F\head($this->_section_info_all);
        $cm_info = F\head(F\filter(
            $section_info->modinfo->cms,
            function (cm_info $cm_info) {
                return (integer)$cm_info->id === $this->_wiki->cmid;
            }
        ));
        $result = is_current_mod($cm_info, context_module::instance($this->_wiki->cmid));
        $this->assertTrue($result);
    }

    /**
     * tests get_course_tree returns [section_info, [cm_info, boolean], boolean]
     */
    public function test_get_course_tree() {
        $course_tree = get_course_tree(
            get_fast_modinfo($this->_course),
            -1,
            context_course::instance($this->_course->id)
        );
        $this->assertTrue(is_array($course_tree));
        $this->assertCount(1 + self::NUM_SECTIONS, $course_tree);
        $this->assertTrue(F\true(F\map(
            $course_tree,
            function (array $section) {
                return
                    count($section) === 3
                    &&
                    $section[0] instanceof section_info
                    &&
                    is_array($section[1])
                    &&
                    F\true(F\map(
                        $section[1],
                        function (array $module) {
                            return
                                count($module) == 2
                                &&
                                $module[0] instanceof cm_info
                                &&
                                is_bool($module[1])
                                &&
                                $module[1] === false;
                        }
                    ))
                    &&
                    is_bool($section[2])
                    &&
                    $section[2] === false;
            }
        )));
    }

    /**
     * tests get_course_tree flags section zero
     */
    public function test_get_course_tree_flags_section_zero() {
        $zero = 0;
        $course_tree = get_course_tree(
            get_fast_modinfo($this->_course),
            $zero,
            context_course::instance($this->_course->id)
        );
        $this->assertTrue($course_tree[$zero][2]);
    }

    /**
     * tests get_course_tree flags the current section
     */
    public function test_get_course_tree_flags_current_section() {
        $five = 5;
        $course_tree = get_course_tree(
            get_fast_modinfo($this->_course),
            $five,
            context_course::instance($this->_course->id)
        );
        $this->assertTrue($course_tree[$five][2]);
    }

    /**
     * tests get_course_tree flags the current module
     */
    public function test_get_course_tree_flags_current_module() {
        $section_info = F\head($this->_section_info_all);
        $cm_info = F\head(F\filter(
            $section_info->modinfo->cms,
            function (cm_info $cm_info) {
                return (integer)$cm_info->id === $this->_wiki->cmid;
            }
        ));
        $course_tree = get_course_tree(
            get_fast_modinfo($this->_course),
            -1,
            context_module::instance($this->_wiki->cmid)
        );
        $this->assertTrue($course_tree[(integer)$cm_info->sectionnum][1][0][1]);
    }

}
