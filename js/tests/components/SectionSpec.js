'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import TestUtils from 'react-addons-test-utils';

describe('Section', () => {
    let Section,
        Activity;

    beforeEach(() => {
        Section = require('../../components/Section.js');
        Activity = require('../../components/Activity.js');
    });

    describe('layout and initialization', () => {
        let section,
            sectionComponent;

        beforeEach(() => {
            section = {
                id: 1,
                name: 'Section 0',
                section: 0,
                current: true,
                expanded: true,
                activities: [
                    {
                        id: 1,
                        name: 'Forum 001',
                        modname: 'forum',
                        current: true,
                        available: true,
                        canComplete: false,
                        hasCompleted: false
                    },
                    {
                        id: 2,
                        name: 'Wiki 001',
                        modname: 'wiki',
                        current: false,
                        available: true,
                        canComplete: false,
                        hasCompleted: false
                    },
                    {
                        id: 3,
                        name: 'Url 001',
                        modname: 'url',
                        current: false,
                        available: true,
                        canComplete: false,
                        hasCompleted: false
                    }
                ]
            };
            sectionComponent = TestUtils.renderIntoDocument(
                <Section
                    section={section}
                    config={{wwwroot: '', sesskey: ''}}
                    toggleComplThunk={sinon.spy()}
                    toggleExpandedThunk={sinon.spy()}
                />
            );
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sectionComponent).parentElement);
        });

        it('should render successfully', () => {
            expect(TestUtils.isCompositeComponentWithType(sectionComponent, Section)).toBeTruthy();
        });

        it('should be rendered into an element with the "section" class', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(sectionComponent, 'section');
            expect(ReactDOM.findDOMNode(sectionComponent)).toBe(ReactDOM.findDOMNode(renderedDOMComponent));
        });

        it('should render a "Activity" component per activity in its given "section.activities" prop', () => {
            const activityComponents = TestUtils.scryRenderedComponentsWithType(sectionComponent, Activity);
            expect(_.size(activityComponents)).toBe(_.size(section.activities));
        });

        it('should pass each "Activity" component an activity prop', () => {
            const activityComponents = TestUtils.scryRenderedComponentsWithType(sectionComponent, Activity);
            expect(_.all(_.map(activityComponents, activityComponent => _.isObject(activityComponent.props.activity)))).toBeTruthy();
        });
    });

    describe('initial expanded state', () => {
        let section,
            sectionComponent;

        describe('when expanded', () => {
            beforeEach(() => {
                section = {
                    id: 1,
                    name: 'Section 0',
                    section: 0,
                    current: true,
                    expanded: true,
                    activities: [
                        {
                            id: 1,
                            name: 'Forum 001',
                            modname: 'forum',
                            current: true,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                };
                sectionComponent = TestUtils.renderIntoDocument(
                    <Section
                        section={section}
                        config={{wwwroot: '', sesskey: ''}}
                        toggleComplThunk={sinon.spy()}
                        toggleExpandedThunk={sinon.spy()}
                    />
                );
            });

            afterEach(() => {
                ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sectionComponent).parentElement);
            });

            it('should render an "Activity" component', () => {
                const activityComponents = TestUtils.scryRenderedComponentsWithType(sectionComponent, Activity);
                expect(_.size(activityComponents)).toBe(_.size(section.activities));
            });
        });

        describe('when collapsed', () => {
            beforeEach(() => {
                section = {
                    id: 1,
                    name: 'Section 0',
                    section: 0,
                    current: true,
                    expanded: false,
                    activities: [
                        {
                            id: 1,
                            name: 'Forum 001',
                            modname: 'forum',
                            current: false,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                };
                sectionComponent = TestUtils.renderIntoDocument(
                    <Section
                        section={section}
                        config={{wwwroot: '', sesskey: ''}}
                        toggleComplThunk={sinon.spy()}
                        toggleExpandedThunk={sinon.spy()}
                    />
                );
            });

            afterEach(() => {
                ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sectionComponent).parentElement);
            });

            it('should not render any "Activity" components', () => {
                const activityComponents = TestUtils.scryRenderedComponentsWithType(sectionComponent, Activity);
                expect(_.size(activityComponents)).toBe(0);
            });
        });
    });

    describe('when clicked', () => {
        let toggleExpandedThunkSpy,
            section,
            sectionComponent;

        describe('and its list of activities is collapsed', () => {
            beforeEach(() => {
                toggleExpandedThunkSpy = sinon.spy();
                section = {
                    id: 123,
                    name: 'Section 0',
                    section: 0,
                    current: true,
                    expanded: false,
                    activities: [
                        {
                            id: 1,
                            name: 'Forum 001',
                            modname: 'forum',
                            current: false,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                };
                sectionComponent = TestUtils.renderIntoDocument(
                    <Section
                        section={section}
                        config={{wwwroot: '', sesskey: ''}}
                        toggleComplThunk={sinon.spy()}
                        toggleExpandedThunk={toggleExpandedThunkSpy}
                    />
                );
                const link = TestUtils.findRenderedDOMComponentWithClass(sectionComponent, 'toggle');
                TestUtils.Simulate.click(link);
            });

            afterEach(() => {
                ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sectionComponent).parentElement);
            });

            it('should invoke its toggleExpanded prop', () => {
                expect(toggleExpandedThunkSpy.withArgs(section.id, !section.expanded).calledOnce).toBeTruthy();
            });
        });

        describe('and its list of activities is expanded', () => {
            beforeEach(() => {
                toggleExpandedThunkSpy = sinon.spy();
                section = {
                    id: 123,
                    name: 'Section 0',
                    section: 0,
                    current: true,
                    expanded: true,
                    activities: [
                        {
                            id: 1,
                            name: 'Forum 001',
                            modname: 'forum',
                            current: true,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                };
                sectionComponent = TestUtils.renderIntoDocument(
                    <Section
                        section={section}
                        config={{wwwroot: '', sesskey: ''}}
                        toggleComplThunk={sinon.spy()}
                        toggleExpandedThunk={toggleExpandedThunkSpy}
                    />
                );
                const link = TestUtils.findRenderedDOMComponentWithClass(sectionComponent, 'toggle');
                TestUtils.Simulate.click(link);
            });

            afterEach(() => {
                ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sectionComponent).parentElement);
            });

            it('should invoke its toggleExpanded prop', () => {
                expect(toggleExpandedThunkSpy.withArgs(section.id, !section.expanded).calledOnce).toBeTruthy();
            });
        });
    });
});
