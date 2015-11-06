'use strict';

export const setInitialState = state => ({
    type: 'SET_INITIAL_STATE',
    state
});

export const toggleCompl = (activityId, hasCompleted) => ({
    type: 'TOGGLE_COMPL',
    activityId,
    hasCompleted
});

export const toggleExpanded = section => ({
    type: 'TOGGLE_EXPANDED',
    section
});
