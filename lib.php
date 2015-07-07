<?php

use Functional as F;

defined('MOODLE_INTERNAL') || die();

/**
 * is_current_section :: section_info -> integer -> context -> boolean
 * @param section_info $section_info
 * @param integer $section_number
 * @param context $context
 * @return boolean
 */
function is_current_section(section_info $section_info, $section_number, context $context) {
    if (!($context instanceof context_course)) {
        return false;
    }
    return $section_number >= 0 && (integer)$section_info->section === $section_number;
}

/**
 * is_current_mod :: cm_info -> context -> boolean
 * @param cm_info $cm_info
 * @param context $context
 * @return boolean
 */
function is_current_mod(cm_info $cm_info, context $context) {
    if (!($context instanceof context_module)) {
        return false;
    }
    $c = context_module::instance($cm_info->id);
    return (integer)$context->id === (integer)$c->id;
}

/**
 * get_course_tree :: course_modinfo -> integer -> context -> [section_info, [cm_info, boolean], boolean]
 * @param course_modinfo $modinfo
 * @param integer $section_number
 * @param context $context
 * @return array
 */
function get_course_tree(course_modinfo $modinfo, $section_number, context $context) {
    return F\map(
        $modinfo->get_section_info_all(),
        function (section_info $section_info) use ($section_number, $context) {
            $mods = F\map(
                F\filter(
                    $section_info->modinfo->cms,
                    function (cm_info $cm_info) use ($section_info) {
                        return (integer)$cm_info->sectionnum === (integer)$section_info->section;
                    }
                ),
                function (cm_info $cm_info) use ($context) {
                    return [
                        $cm_info,
                        is_current_mod($cm_info, $context)
                    ];
                }
            );
            $section_info->name = get_section_name($section_info->modinfo->courseid, $section_info->section);
            return [
                $section_info,
                array_values($mods),
                is_current_section($section_info, $section_number, $context)
            ];
        }
    );
}
