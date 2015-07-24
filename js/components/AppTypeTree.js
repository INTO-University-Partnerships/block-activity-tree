'use strict';

import React from 'react';
import _ from 'lodash';
import Section from './Section';

export default class AppTypeTree extends React.Component {

    /**
     * render
     * @returns {XML}
     */
    render() {
        const sections = _.map(_.filter(this.props.activityTree, section => section.activities.length), section => (
            <Section
                key={section.section}
                section={section}
                config={this.props.config}
            />
        ));
        return (
            <div className="type-tree">
                {sections}
            </div>
        );
    }

}

AppTypeTree.propTypes = {
    activityTree: React.PropTypes.array.isRequired,
    config: React.PropTypes.object.isRequired
};
