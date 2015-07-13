'use strict';

import React from 'react/addons';
import _ from 'lodash';

const TestUtils = React.addons.TestUtils;

describe('App', () => {
    let App,
        Section;

    beforeEach(() => {
        App = require('../../components/App.js');
        Section = require('../../components/Section.js');
    });

    describe('layout and initialization', () => {
        let activityTree,
            appComponent;

        beforeEach(() => {
            activityTree = [
                {
                    id: 1,
                    name: 'Section 0',
                    section: 0,
                    current: true,
                    activities: [
                        {}
                    ]
                },
                {
                    id: 2,
                    name: 'Section 1',
                    section: 1,
                    current: false,
                    activities: [
                        {}
                    ]
                },
                {
                    id: 3,
                    name: 'Section 2',
                    section: 2,
                    current: false,
                    activities: [
                        {}
                    ]
                }
            ];
            appComponent = TestUtils.renderIntoDocument(
                <App activityTree={activityTree}/>
            );
        });

        afterEach(() => {
            React.unmountComponentAtNode(React.findDOMNode(appComponent).parentElement);
        });

        it('should render successfully', () => {
            expect(TestUtils.isCompositeComponentWithType(appComponent, App)).toBeTruthy();
        });

        it('should be rendered into an element with the "into-block-activity-tree" class', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'into-block-activity-tree');
            expect(React.findDOMNode(appComponent)).toBe(React.findDOMNode(renderedDOMComponent));
        });

        it('should render a "Section" component per section in its given "activityTree" prop', () => {
            const sectionComponents = TestUtils.scryRenderedComponentsWithType(appComponent, Section);
            expect(_.size(sectionComponents)).toBe(_.size(activityTree));
        });

        it('should pass each "Section" component a section prop', () => {
            const sectionComponents = TestUtils.scryRenderedComponentsWithType(appComponent, Section);
            expect(_.all(_.map(sectionComponents, sectionComponent => _.isObject(sectionComponent.props.section)))).toBeTruthy();
        });
    });

    describe('sections with no activities', () => {
        let activityTree,
            appComponent;

        beforeEach(() => {
            activityTree = [
                {
                    id: 1,
                    name: 'Section 0',
                    section: 0,
                    current: false,
                    activities: [
                    ]
                },
                {
                    id: 2,
                    name: 'Section 1',
                    section: 1,
                    current: false,
                    activities: [
                    ]
                },
                {
                    id: 3,
                    name: 'Section 2',
                    section: 2,
                    current: false,
                    activities: [
                        {}
                    ]
                }
            ];
            appComponent = TestUtils.renderIntoDocument(
                <App activityTree={activityTree}/>
            );
        });

        afterEach(() => {
            React.unmountComponentAtNode(React.findDOMNode(appComponent).parentElement);
        });

        it('should render a "Section" component per section with at least one activity', () => {
            const sectionComponents = TestUtils.scryRenderedComponentsWithType(appComponent, Section);
            expect(_.size(sectionComponents)).toBe(_.size(_.filter(activityTree, section => section.activities.length)));
        });
    });
});
