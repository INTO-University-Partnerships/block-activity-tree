'use strict';

import React from 'react/addons';
import _ from 'lodash';

const TestUtils = React.addons.TestUtils;

describe('Activity', () => {
    let Activity;

    beforeEach(() => {
        Activity = require('../../components/Activity.js');
    });

    describe('layout and initialization', () => {
        let activity,
            activityComponent;

        beforeEach(() => {
            activity = {
                id: 17,
                name: 'Forum 001',
                modname: 'forum',
                current: true
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
});
