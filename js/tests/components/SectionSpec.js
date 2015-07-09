'use strict';

import React from 'react/addons';
import _ from 'lodash';

const TestUtils = React.addons.TestUtils;

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
                name: 'Section 0',
                section: 0,
                current: true,
                activities: [
                    {
                        id: 1,
                        name: 'Forum 001',
                        modname: 'forum',
                        current: true
                    },
                    {
                        id: 2,
                        name: 'Wiki 001',
                        modname: 'wiki',
                        current: false
                    },
                    {
                        id: 3,
                        name: 'Url 001',
                        modname: 'url',
                        current: false
                    }
                ]
            };
            sectionComponent = TestUtils.renderIntoDocument(
                <Section section={section}/>
            );
        });

        afterEach(() => {
            React.unmountComponentAtNode(React.findDOMNode(sectionComponent).parentElement);
        });

        it('should render successfully', () => {
            expect(TestUtils.isCompositeComponentWithType(sectionComponent, Section)).toBeTruthy();
        });

        it('should be rendered into an element with the "section" class', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(sectionComponent, 'section');
            expect(React.findDOMNode(sectionComponent)).toBe(React.findDOMNode(renderedDOMComponent));
        });

        it('should render a "Activity" component per section in its given "section.activities" prop', () => {
            const activityComponents = TestUtils.scryRenderedComponentsWithType(sectionComponent, Activity);
            expect(_.size(activityComponents)).toBe(_.size(section.activities));
        });

        it('should pass each "Activity" component an activity prop', () => {
            const activityComponents = TestUtils.scryRenderedComponentsWithType(sectionComponent, Activity);
            expect(_.all(_.map(activityComponents, activityComponent => _.isObject(activityComponent.props.activity)))).toBeTruthy();
        });
    });
});
