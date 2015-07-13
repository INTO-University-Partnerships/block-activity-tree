<?php

use block_activity_tree as B;
use Functional as F;

defined('MOODLE_INTERNAL') || die();

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
        global $CFG;
        require_once $CFG->libdir . '/completionlib.php';
        $CFG->enablecompletion = true;
        $this->_course = $this->getDataGenerator()->create_course([
            'numsections' => self::NUM_SECTIONS,
            'enablecompletion' => COMPLETION_ENABLED,
        ], [
            'createsections' => true,
        ]);
        $this->_forum = $this->getDataGenerator()->create_module('forum', [
            'course' => $this->_course->id,
            'section' => 5,
            'completion' => COMPLETION_TRACKING_NONE,
        ]);
        $this->_wiki = $this->getDataGenerator()->create_module('wiki', [
            'course' => $this->_course->id,
            'section' => 6,
            'completion' => COMPLETION_TRACKING_MANUAL,
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
        $result = B\is_current_section($section_info, 0, context_system::instance());
        $this->assertFalse($result);
    }

    /**
     * tests is_current_section when the given section number doesn't correspond to the given section's number
     */
    public function test_is_current_section_when_course_context_but_not_section_number() {
        $nine = 9;
        $section_info = F\head($this->_section_info_all);
        $this->assertNotEquals($nine, $section_info->section);
        $result = B\is_current_section($section_info, $nine, context_course::instance($this->_course->id));
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
        $result = B\is_current_section($section_info, $five, context_course::instance($this->_course->id));
        $this->assertTrue($result);
    }

    /**
     * tests is_current_mod when the given context is a course context (i.e. not a module context)
     */
    public function test_is_current_mod_when_course_context() {
        $section_info = F\head($this->_section_info_all);
        $cm_info = F\head($section_info->modinfo->cms);
        $result = B\is_current_mod($cm_info, context_course::instance($this->_course->id));
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
        $result = B\is_current_mod($cm_info, context_module::instance($this->_wiki->cmid));
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
        $result = B\is_current_mod($cm_info, context_module::instance($this->_wiki->cmid));
        $this->assertTrue($result);
    }

    /**
     * tests get_activity_tree returns an array of sections
     */
    public function test_get_activity_tree() {
        $activity_tree = B\get_activity_tree(
            get_fast_modinfo($this->_course),
            -1,
            context_course::instance($this->_course->id)
        );
        $this->assertTrue(is_array($activity_tree));
        $this->assertCount(1 + self::NUM_SECTIONS, $activity_tree);
        $this->assertTrue(F\true(F\map(
            $activity_tree,
            function (stdClass $section) {
                return
                    is_integer($section->id)
                    &&
                    is_integer($section->section)
                    &&
                    is_string($section->name)
                    &&
                    is_bool($section->current)
                    &&
                    is_array($section->activities)
                    &&
                    F\true(F\map(
                        $section->activities,
                        function (stdClass $activity) {
                            return
                                is_integer($activity->id)
                                &&
                                is_string($activity->name)
                                &&
                                is_string($activity->modname)
                                &&
                                is_bool($activity->current)
                                &&
                                is_bool($activity->canComplete)
                                &&
                                $activity->canComplete === false
                                &&
                                is_bool($activity->hasCompleted)
                                &&
                                $activity->hasCompleted === false;
                        }
                    ));
            }
        )));
    }

    /**
     * tests get_activity_tree flags section zero
     */
    public function test_get_activity_tree_flags_section_zero() {
        $zero = 0;
        $activity_tree = B\get_activity_tree(
            get_fast_modinfo($this->_course),
            $zero,
            context_course::instance($this->_course->id)
        );
        $this->assertTrue($activity_tree[$zero]->current);
    }

    /**
     * tests get_activity_tree flags the current section
     */
    public function test_get_activity_tree_flags_current_section() {
        $five = 5;
        $activity_tree = B\get_activity_tree(
            get_fast_modinfo($this->_course),
            $five,
            context_course::instance($this->_course->id)
        );
        $this->assertTrue($activity_tree[$five]->current);
    }

    /**
     * tests get_activity_tree flags the current module
     */
    public function test_get_activity_tree_flags_current_module() {
        $section_info = F\head($this->_section_info_all);
        $cm_info = F\head(F\filter(
            $section_info->modinfo->cms,
            function (cm_info $cm_info) {
                return (integer)$cm_info->id === $this->_wiki->cmid;
            }
        ));
        $activity_tree = B\get_activity_tree(
            get_fast_modinfo($this->_course),
            -1,
            context_module::instance($this->_wiki->cmid)
        );
        $this->assertTrue($activity_tree[(integer)$cm_info->sectionnum]->activities[0]->current);
    }

    /**
     * tests get_activity_tree flags activities which can be manually completed
     * (according to standard Moodle configuration)
     */
    public function test_get_activity_tree_flags_activities_which_can_be_manually_completed() {
        // log in a (non-guest) user
        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        // ensure the activity configured with manual completion settings can be completed
        $section_info = F\head($this->_section_info_all);
        $cm_info = F\head(F\filter(
            $section_info->modinfo->cms,
            function (cm_info $cm_info) {
                return (integer)$cm_info->id === $this->_wiki->cmid;
            }
        ));
        $this->assertEquals(COMPLETION_TRACKING_MANUAL, $cm_info->completion);
        $activity_tree = B\get_activity_tree(
            get_fast_modinfo($this->_course),
            -1,
            context_module::instance($this->_wiki->cmid)
        );
        $this->assertTrue($activity_tree[(integer)$cm_info->sectionnum]->activities[0]->canComplete);
    }

    /**
     * tests get_activity_tree flags activities which cannot be manually completed
     * (according to standard Moodle configuration)
     */
    public function test_get_activity_tree_flags_activities_which_cannot_be_manually_completed() {
        // log in a (non-guest) user
        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        // ensure the activity configured with no completion settings cannot be completed
        $section_info = F\head($this->_section_info_all);
        $cm_info = F\head(F\filter(
            $section_info->modinfo->cms,
            function (cm_info $cm_info) {
                return (integer)$cm_info->id === $this->_forum->cmid;
            }
        ));
        $this->assertEquals(COMPLETION_TRACKING_NONE, $cm_info->completion);
        $activity_tree = B\get_activity_tree(
            get_fast_modinfo($this->_course),
            -1,
            context_module::instance($this->_forum->cmid)
        );
        $this->assertFalse($activity_tree[(integer)$cm_info->sectionnum]->activities[0]->canComplete);
    }

    /**
     * tests get_activity_tree flags activities which have been manually completed
     * (by the logged in user)
     */
    public function test_get_activity_tree_flags_activities_which_have_been_manually_completed() {
        // log in a (non-guest) user
        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        // ensure the activity configured with manual completion settings has been completed
        $section_info = F\head($this->_section_info_all);
        $cm_info = F\head(F\filter(
            $section_info->modinfo->cms,
            function (cm_info $cm_info) {
                return (integer)$cm_info->id === $this->_wiki->cmid;
            }
        ));
        $this->assertEquals(COMPLETION_TRACKING_MANUAL, $cm_info->completion);
        $completion = new completion_info($this->_course);
        $completion->update_state($cm_info, COMPLETION_COMPLETE);
        $activity_tree = B\get_activity_tree(
            get_fast_modinfo($this->_course),
            -1,
            context_module::instance($this->_wiki->cmid)
        );
        $this->assertTrue($activity_tree[(integer)$cm_info->sectionnum]->activities[0]->hasCompleted);
    }

    /**
     * tests get_activity_tree flags activities which have not been manually completed
     * (by the logged in user)
     */
    public function test_get_activity_tree_flags_activities_which_have_not_been_manually_completed() {
        // log in a (non-guest) user
        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        // ensure the activity configured with manual completion settings has been completed
        $section_info = F\head($this->_section_info_all);
        $cm_info = F\head(F\filter(
            $section_info->modinfo->cms,
            function (cm_info $cm_info) {
                return (integer)$cm_info->id === $this->_wiki->cmid;
            }
        ));
        $this->assertEquals(COMPLETION_TRACKING_MANUAL, $cm_info->completion);
        $completion = new completion_info($this->_course);
        $completion->update_state($cm_info, COMPLETION_INCOMPLETE);
        $activity_tree = B\get_activity_tree(
            get_fast_modinfo($this->_course),
            -1,
            context_module::instance($this->_wiki->cmid)
        );
        $this->assertFalse($activity_tree[(integer)$cm_info->sectionnum]->activities[0]->hasCompleted);
    }

}
