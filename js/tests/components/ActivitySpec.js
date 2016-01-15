'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import TestUtils from 'react-addons-test-utils';
import 'jasmine-expect';

describe('Activity', () => {
    let Activity;

    beforeEach(() => {
        // require component
        Activity = require('../../components/Activity.js').default;
    });

    describe('layout and initialization', () => {
        let activity,
            activityComponent;

        beforeEach(() => {
            activity = {
                id: 17,
                name: 'Forum 001',
                modname: 'forum',
                current: true,
                available: true,
                canComplete: false,
                hasCompleted: false
            };
            activityComponent = TestUtils.renderIntoDocument(
                <Activity
                    activity={activity}
                    config={{wwwroot: '', sesskey: ''}}
                    toggleComplThunk={sinon.spy()}
                />
            );
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(activityComponent).parentElement);
        });

        it('should render successfully', () => {
            expect(TestUtils.isCompositeComponentWithType(activityComponent, Activity)).toBeTruthy();
        });

        it('should be rendered into an element with the "activity" class', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(activityComponent, 'activity');
            expect(ReactDOM.findDOMNode(activityComponent)).toBe(ReactDOM.findDOMNode(renderedDOMComponent));
        });

        it('should render a link to the activity of the form mod/modname/view.php?id=id', () => {
            const links = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'a');
            expect(_.size(links)).toBe(1);
            const link = _.head(links);
            expect(link.href).toEndWith(`/mod/${activity.modname}/view.php?id=${activity.id}`);
        });

        it('should render a link to the activity with a title of the activity name', () => {
            const links = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'a');
            expect(_.size(links)).toBe(1);
            const link = _.head(links);
            expect(link.innerHTML).toBe(activity.name);
        });
    });

    describe('manual completion', () => {
        let activity,
            activityComponent;

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(activityComponent).parentElement);
        });

        describe('when an activity cannot be completed', () => {
            beforeEach(() => {
                activity = {
                    id: 17,
                    name: 'Forum 001',
                    modname: 'forum',
                    current: true,
                    available: true,
                    canComplete: false,
                    hasCompleted: false
                };
                activityComponent = TestUtils.renderIntoDocument(
                    <Activity
                        activity={activity}
                        config={{wwwroot: '', sesskey: ''}}
                        toggleComplThunk={sinon.spy()}
                    />
                );
            });

            it('should not render a manual completion checkbox', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(0);
            });
        });

        describe('when an activity can be completed, but has not yet been completed', () => {
            const toggleComplThunkSpy = sinon.spy();

            beforeEach(() => {
                activity = {
                    id: 17,
                    name: 'Forum 001',
                    modname: 'forum',
                    current: true,
                    available: true,
                    canComplete: true,
                    hasCompleted: false
                };
                activityComponent = TestUtils.renderIntoDocument(
                    <Activity
                        activity={activity}
                        config={{wwwroot: '', sesskey: ''}}
                        toggleComplThunk={toggleComplThunkSpy}
                    />
                );
            });

            it('should render a manual completion checkbox', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(1);
                expect(_.head(inputs).type).toBe('checkbox');
            });

            it('should not check the checkbox initially', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(1);
                expect(_.head(inputs).checked).toBeFalsy();
            });

            it('should invoke its toggleCompl prop (to mark the activity as complete) when the checkbox is clicked', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                TestUtils.Simulate.change(ReactDOM.findDOMNode(_.head(inputs)));
                expect(toggleComplThunkSpy.withArgs(activity.id, !activity.hasCompleted).calledOnce).toBeTruthy();
            });
        });

        describe('when an activity can be completed, and has been completed', () => {
            const toggleComplThunkSpy = sinon.spy();

            beforeEach(() => {
                activity = {
                    id: 17,
                    name: 'Forum 001',
                    modname: 'forum',
                    current: true,
                    available: true,
                    canComplete: true,
                    hasCompleted: true
                };
                activityComponent = TestUtils.renderIntoDocument(
                    <Activity
                        activity={activity}
                        config={{wwwroot: '', sesskey: ''}}
                        toggleComplThunk={toggleComplThunkSpy}
                    />
                );
            });

            it('should render a manual completion checkbox', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(1);
                expect(_.head(inputs).type).toBe('checkbox');
            });

            it('should check the checkbox initially', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(1);
                expect(_.head(inputs).checked).toBeTruthy();
            });

            it('should invoke its toggleCompl prop (to mark the activity as incomplete) when the checkbox is clicked', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                TestUtils.Simulate.change(ReactDOM.findDOMNode(_.head(inputs)));
                expect(toggleComplThunkSpy.withArgs(activity.id, !activity.hasCompleted).calledOnce).toBeTruthy();
            });
        });
    });

    describe('availability', () => {
        describe('when an activity is not available', () => {
            let activity,
                activityComponent;

            beforeEach(() => {
                activity = {
                    id: 17,
                    name: 'Forum 001',
                    modname: 'forum',
                    current: true,
                    available: false,
                    canComplete: true,
                    hasCompleted: false
                };
                activityComponent = TestUtils.renderIntoDocument(
                    <Activity
                        activity={activity}
                        config={{wwwroot: '', sesskey: ''}}
                        toggleComplThunk={sinon.spy()}
                    />
                );
            });

            it('should not render a link to the activity', () => {
                const links = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'a');
                expect(_.size(links)).toBe(0);
            });

            it('should not render a manual completion checkbox', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(0);
            });

            it('should render the activity name with class "unavailable"', () => {
                const spans = TestUtils.scryRenderedDOMComponentsWithClass(activityComponent, 'unavailable');
                expect(_.size(spans)).toBe(1);
                expect(_.head(spans).innerHTML).toBe(activity.name);
            });
        });
    });
});
