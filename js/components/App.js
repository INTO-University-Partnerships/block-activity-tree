'use strict';

import React from 'react';
import _ from 'lodash';
import Section from './Section';

export default class App extends React.Component {

    /**
     * render
     * @returns {XML}
     */
    render() {
        return (
            <div className="into-block-activity-tree">
                {_.map(_.filter(this.props.activityTree, section => section.activities.length), section => <Section key={section.section} section={section}/>)}
            </div>
        );
    }

}

App.propTypes = {
    activityTree: React.PropTypes.array.isRequired
};
