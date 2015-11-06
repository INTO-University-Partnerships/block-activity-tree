'use strict';

import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import * as actionCreators from '../actionCreators';
import Section from './Section';

export class AppTypeTree extends React.Component {

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
                toggleComplThunk={this.props.toggleComplThunk}
                toggleExpandedThunk={this.props.toggleExpandedThunk}
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
    config: React.PropTypes.object.isRequired,
    toggleComplThunk: React.PropTypes.func.isRequired,
    toggleExpandedThunk: React.PropTypes.func.isRequired
};

export const AppTypeTreeContainer = connect(state => ({
    activityTree: state.activityTree,
    config: state.config
}), actionCreators)(AppTypeTree);
