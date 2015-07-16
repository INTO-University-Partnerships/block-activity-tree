<?php

namespace block_activity_tree;

use Functional as F;

defined('MOODLE_INTERNAL') || die();

require_once __DIR__ . '/../../vendor/autoload.php';

/**
 * is_current_section :: section_info -> integer -> context -> boolean
 * @param \section_info $section_info
 * @param integer $section_number
 * @param \context $context
 * @return boolean
 */
function is_current_section(\section_info $section_info, $section_number, \context $context) {
    if (!($context instanceof \context_course)) {
        return false;
    }
    return $section_number >= 0 && (integer)$section_info->section === $section_number;
}

/**
 * is_current_mod :: cm_info -> context -> boolean
 * @param \cm_info $cm_info
 * @param \context $context
 * @return boolean
 */
function is_current_mod(\cm_info $cm_info, \context $context) {
    if (!($context instanceof \context_module)) {
        return false;
    }
    $c = \context_module::instance($cm_info->id);
    return (integer)$context->id === (integer)$c->id;
}

/**
 * get_activity_tree :: course_modinfo -> integer -> context -> array
 * @param \course_modinfo $modinfo
 * @param integer $section_number
 * @param \context $context
 * @return array
 */
function get_activity_tree(\course_modinfo $modinfo, $section_number, \context $context) {
    $completion_info = new \completion_info($modinfo->get_course());
    return F\map(
        F\filter(
            $modinfo->get_section_info_all(),
            function (\section_info $section_info) {
                return $section_info->visible;
            }
        ),
        function (\section_info $section_info) use ($completion_info, $section_number, $context) {
            $mods = F\map(
                F\filter(
                    $section_info->modinfo->cms,
                    function (\cm_info $cm_info) use ($section_info) {
                        global $CFG;
                        return
                            ($cm_info->uservisible || ($CFG->enableavailability && !empty($cm_info->availableinfo)))
                            &&
                            (integer)$cm_info->sectionnum === (integer)$section_info->section;
                    }
                ),
                function (\cm_info $cm_info) use ($completion_info, $context) {
                    global $CFG;
                    $canComplete =
                        $CFG->enablecompletion
                        &&
                        isloggedin()
                        &&
                        !isguestuser()
                        &&
                        (integer)$completion_info->is_enabled($cm_info) === COMPLETION_TRACKING_MANUAL;
                    $hasCompleted = false;
                    if ($canComplete) {
                        $completion_data = $completion_info->get_data($cm_info, true);
                        $hasCompleted = F\contains(
                            [COMPLETION_COMPLETE, COMPLETION_COMPLETE_PASS],
                            (integer)$completion_data->completionstate
                        );
                    }
                    return (object)[
                        'id'           => (integer)$cm_info->id,
                        'name'         => $cm_info->name,
                        'modname'      => $cm_info->modname,
                        'current'      => is_current_mod($cm_info, $context),
                        'available'    => $cm_info->available,
                        'canComplete'  => $canComplete,
                        'hasCompleted' => $hasCompleted,
                    ];
                }
            );
            return (object)[
                'id'         => (integer)$section_info->id,
                'section'    => (integer)$section_info->section,
                'name'       => \get_section_name($section_info->modinfo->courseid, $section_info->section),
                'current'    => is_current_section($section_info, $section_number, $context),
                'activities' => array_values($mods),
            ];
        }
    );
}
