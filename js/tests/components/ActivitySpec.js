'use strict';

import React from 'react/addons';
import _ from 'lodash';

const TestUtils = React.addons.TestUtils;

describe('Activity', () => {
    let xhr,
        requests,
        Activity;

    beforeEach(() => {
        // fake xhrs
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = x => {
            requests.push(x);
        };

        // require components
        Activity = require('../../components/Activity.js');
    });

    afterEach(() => {
        xhr.restore();
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
                <Activity activity={activity}/>
            );
        });

        afterEach(() => {
            React.unmountComponentAtNode(React.findDOMNode(activityComponent).parentElement);
        });

        it('should render successfully', () => {
            expect(TestUtils.isCompositeComponentWithType(activityComponent, Activity)).toBeTruthy();
        });

        it('should be rendered into an element with the "activity" class', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(activityComponent, 'activity');
            expect(React.findDOMNode(activityComponent)).toBe(React.findDOMNode(renderedDOMComponent));
        });

        it('should render a link to the activity of the form mod/modname/view.php?id=id', () => {
            const links = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'a');
            expect(_.size(links)).toBe(1);
            const link = _.head(links);
            expect(link.props.href).toBe(`/mod/${activity.modname}/view.php?id=${activity.id}`);
        });

        it('should render a link to the activity with a title of the activity name', () => {
            const links = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'a');
            expect(_.size(links)).toBe(1);
            const link = _.head(links);
            expect(link.props.children).toBe(activity.name);
        });
    });

    describe('manual completion', () => {
        let activity,
            activityComponent;

        afterEach(() => {
            React.unmountComponentAtNode(React.findDOMNode(activityComponent).parentElement);
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
                    <Activity activity={activity}/>
                );
            });

            it('should not render a manual completion checkbox', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(0);
            });
        });

        describe('when an activity can be completed, but has not yet been completed', () => {
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
                    <Activity activity={activity}/>
                );
            });

            it('should render a manual completion checkbox', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(1);
                expect(_.head(inputs).props.type).toBe('checkbox');
            });

            it('should not check the checkbox initially', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(1);
                expect(_.head(inputs).props.checked).toBeFalsy();
            });

            it('should invoke a JSON endpoint (to mark the activity as complete) when the checkbox is clicked', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                TestUtils.Simulate.change(React.findDOMNode(_.head(inputs)));
                expect(_.size(requests)).toBe(1);
                expect(_.head(requests).url).toBe('/course/togglecompletion.php');
                expect(_.head(requests).method).toBe('POST');
                expect(_.head(requests).requestBody).toMatch(/completionstate=1/);
            });
        });

        describe('when an activity can be completed, and has been completed', () => {
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
                    <Activity activity={activity}/>
                );
            });

            it('should render a manual completion checkbox', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(1);
                expect(_.head(inputs).props.type).toBe('checkbox');
            });

            it('should check the checkbox initially', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                expect(_.size(inputs)).toBe(1);
                expect(_.head(inputs).props.checked).toBeTruthy();
            });

            it('should invoke a JSON endpoint (to mark the activity as incomplete) when the checkbox is clicked', () => {
                const inputs = TestUtils.scryRenderedDOMComponentsWithTag(activityComponent, 'input');
                TestUtils.Simulate.change(React.findDOMNode(_.head(inputs)));
                expect(_.size(requests)).toBe(1);
                expect(_.head(requests).url).toBe('/course/togglecompletion.php');
                expect(_.head(requests).method).toBe('POST');
                expect(_.head(requests).requestBody).toMatch(/completionstate=0/);
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
                    <Activity activity={activity}/>
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
                expect(_.head(spans).props.children).toBe(activity.name);
            });
        });
    });
});
