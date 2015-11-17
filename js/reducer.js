'use strict';

import _ from 'lodash';

/**
 * sets state
 * @param {object} state
 * @returns {object}
 */
const setState = state => _.cloneDeep(state);

/**
 * toggles completion state of an activity
 * @param {object} state
 * @param {integer} activityId
 * @returns {object}
 */
const toggleCompl = (state, activityId) => {
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
 * @param {integer} sectionId
 * @returns {object}
 */
const toggleExpanded = (state, sectionId) => {
    const newState = _.cloneDeep(state);
    const section = _.find(newState.activityTree, sec => sec.id === sectionId);
    if (_.isObject(section) && _.has(section, 'expanded')) {
        section.expanded = !section.expanded;
    }
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
        case 'SET_STATE':
            return setState(action.state);
        case 'TOGGLE_COMPL':
            return toggleCompl(state, action.activityId);
        case 'TOGGLE_EXPANDED':
            return toggleExpanded(state, action.sectionId);
    }
    return state;
};

export default reducer;
