'use strict';

import reducer from '../reducer';

describe('reducer', () => {
    it('should handle the "SET_STATE" action', () => {
        const oldState = {
            foo: 'bar'
        };
        const newState = reducer(oldState, {
            type: 'SET_STATE',
            state: {
                wibble: 'woo'
            }
        });
        expect(oldState).toEqual({
            foo: 'bar'
        });
        expect(newState).toEqual({
            wibble: 'woo'
        });
    });

    it('should handle the "TOGGLE_COMPL" action', () => {
        const oldState = {
            activityTree: [
                {
                    id: 11,
                    activities: [{id: 1, hasCompleted: true}, {id: 2, hasCompleted: false}, {id: 3, hasCompleted: false}]
                }
            ]
        };
        const newState = reducer(oldState, {
            type: 'TOGGLE_COMPL',
            activityId: 2
        });
        expect(oldState).toEqual({
            activityTree: [
                {
                    id: 11,
                    activities: [{id: 1, hasCompleted: true}, {id: 2, hasCompleted: false}, {id: 3, hasCompleted: false}]
                }
            ]
        });
        expect(newState).toEqual({
            activityTree: [
                {
                    id: 11,
                    activities: [{id: 1, hasCompleted: true}, {id: 2, hasCompleted: true}, {id: 3, hasCompleted: false}]
                }
            ]
        });
    });

    it('should handle the "TOGGLE_EXPANDED" action', () => {
        const oldState = {
            activityTree: [
                {
                    id: 11,
                    expanded: false,
                    activities: [{id: 1, hasCompleted: true}, {id: 2, hasCompleted: false}, {id: 3, hasCompleted: false}]
                },
                {
                    id: 12,
                    expanded: false,
                    activities: [{id: 4, hasCompleted: true}, {id: 5, hasCompleted: false}, {id: 6, hasCompleted: false}]
                }
            ]
        };
        const newState = reducer(oldState, {
            type: 'TOGGLE_EXPANDED',
            sectionId: 12
        });
        expect(oldState).toEqual({
            activityTree: [
                {
                    id: 11,
                    expanded: false,
                    activities: [{id: 1, hasCompleted: true}, {id: 2, hasCompleted: false}, {id: 3, hasCompleted: false}]
                },
                {
                    id: 12,
                    expanded: false,
                    activities: [{id: 4, hasCompleted: true}, {id: 5, hasCompleted: false}, {id: 6, hasCompleted: false}]
                }
            ]
        });
        expect(newState).toEqual({
            activityTree: [
                {
                    id: 11,
                    expanded: false,
                    activities: [{id: 1, hasCompleted: true}, {id: 2, hasCompleted: false}, {id: 3, hasCompleted: false}]
                },
                {
                    id: 12,
                    expanded: true,
                    activities: [{id: 4, hasCompleted: true}, {id: 5, hasCompleted: false}, {id: 6, hasCompleted: false}]
                }
            ]
        });
    });
});
