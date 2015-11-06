'use strict';

import {toggleCompletion} from './WebAPI';
import {setExpandedCookie} from './lib';

export const setState = state => ({
    type: 'SET_STATE',
    state
});

const toggleCompl = activityId => ({
    type: 'TOGGLE_COMPL',
    activityId
});

const toggleExpanded = sectionId => ({
    type: 'TOGGLE_EXPANDED',
    sectionId
});

export const toggleComplThunk = (activityId, hasCompleted) => (dispatch, getState) => {
    toggleCompletion(getState().config, activityId, hasCompleted, () => {
        dispatch(toggleCompl(activityId));
    });
};

export const toggleExpandedThunk = (sectionId, expanded) => dispatch => {
    setExpandedCookie(sectionId, expanded);
    dispatch(toggleExpanded(sectionId));
};
