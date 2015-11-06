'use strict';

import _ from 'lodash';
import Cookies from 'cookies-js';

import {toggleCompletion} from './WebAPI';

const COOKIE_KEY = 'ExpandedSections';

/**
 * @param {object} cookie
 * @returns {number[]}
 */
const getExpandedSectionsFromCookie = cookie => {
    if (!Cookies.enabled) {
        return [];
    }
    return _.size(cookie) === 0 ? [] : _.map(cookie.split(','), id => parseInt(id));
};

/**
 * sets the cookie that stores which sections are expanded
 * @param {object} section
 */
const setExpandedCookie = section => {
    if (!Cookies.enabled) {
        return;
    }
    let expandedSections = getExpandedSectionsFromCookie(Cookies.get(COOKIE_KEY));
    if (section.expanded) {
        if (!_.contains(expandedSections, section.id)) {
            expandedSections = _.sortBy([section.id].concat(expandedSections));
        }
    } else {
        if (_.contains(expandedSections, section.id)) {
            expandedSections = _.without(expandedSections, section.id);
        }
    }
    if (_.size(expandedSections) === 0) {
        Cookies.expire(COOKIE_KEY);
    } else {
        Cookies.set(COOKIE_KEY, expandedSections.join(','));
    }
};

/**
 * sets initial state
 * sets each section's expanded state from cookies
 * @param {object} state
 * @returns {object}
 */
const setInitialState = state => {
    const newState = _.cloneDeep(state);
    const expandedSections = getExpandedSectionsFromCookie(Cookies.get(COOKIE_KEY));
    _.each(newState.activityTree, section => {
        section.expanded = _.any(section.activities, activity => activity.current) || _.contains(expandedSections, section.id);
    });
    return newState;
};

/**
 * toggles completion state of an activity
 * @param {object} state
 * @param {integer} activityId
 * @param {boolean} hasCompleted
 * @returns {object}
 */
const toggleCompl = (state, activityId, hasCompleted) => {
    toggleCompletion(state.config, activityId, hasCompleted, () => {});
    const newState = _.cloneDeep(state);
    const nonEmptySections = _.filter(newState.activityTree, section => section.activities.length);
    _.each(nonEmptySections, section => {
        _.each(section.activities, activity => {
            if (activity.id === activityId) {
                activity.hasCompleted = !activity.hasCompleted;
            }
        });
    });
    return newState;
};

/**
 * toggles expanded state of a section
 * @param {object} state
 * @param {object} section
 * @returns {object}
 */
const toggleExpanded = (state, section) => {
    const newState = _.cloneDeep(state);
    section.expanded = !section.expanded;
    setExpandedCookie(section);
    _.each(newState.activityTree, s => {
        if (s.id === section.id) {
            s.expanded = !s.expanded;
        }
    });
    return newState;
};

/**
 * the reducer
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
const reducer = (state = {}, action = {}) => {
    switch (action.type) {
        case 'SET_INITIAL_STATE':
            return setInitialState(action.state);
        case 'TOGGLE_COMPL':
            return toggleCompl(state, action.activityId, action.hasCompleted);
        case 'TOGGLE_EXPANDED':
            return toggleExpanded(state, action.section);
    }
    return state;
};

export default reducer;
