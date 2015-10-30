'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import TestUtils from 'react-addons-test-utils';

describe('AppTypeTree', () => {
    let AppTypeTree,
        Section;

    beforeEach(() => {
        AppTypeTree = require('../../components/AppTypeTree.js');
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
                <AppTypeTree
                    activityTree={activityTree}
                    config={{wwwroot: '', sesskey: ''}}
                />
            );
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(appComponent).parentElement);
        });

        it('should render successfully', () => {
            expect(TestUtils.isCompositeComponentWithType(appComponent, AppTypeTree)).toBeTruthy();
        });

        it('should be rendered into an element with the "type-tree" class', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'type-tree');
            expect(ReactDOM.findDOMNode(appComponent)).toBe(ReactDOM.findDOMNode(renderedDOMComponent));
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
                <AppTypeTree
                    activityTree={activityTree}
                    config={{wwwroot: '', sesskey: ''}}
                />
            );
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(appComponent).parentElement);
        });

        it('should render a "Section" component per section with at least one activity', () => {
            const sectionComponents = TestUtils.scryRenderedComponentsWithType(appComponent, Section);
            expect(_.size(sectionComponents)).toBe(_.size(_.filter(activityTree, section => section.activities.length)));
        });
    });
});
