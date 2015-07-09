'use strict';

import React from 'react';
import _ from 'lodash';
import Activity from './Activity';

export default class Section extends React.Component {

    /**
     * c'tor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        this.state = {
            expanded: _.any(props.section.activities, activity => activity.current)
        };
    }

    /**
     * gets activities to render (when expanded)
     * @returns {?XML[]}
     */
    getActivitiesToRender() {
        if (this.state.expanded) {
            return _.map(this.props.section.activities, activity => <Activity key={activity.id} activity={activity}/>);
        }
        return null;
    }

    /**
     * toggles expanded state
     */
    toggleExpanded() {
        const expanded = !this.state.expanded;
        this.setState({
            expanded
        });
    }

    /**
     * render
     * @returns {XML}
     */
    render() {
        const fontWeight = this.props.section.current ? 'bold' : 'normal';
        return (
            <div className="section">
                <div style={{fontWeight: fontWeight}}>
                    <a href="javascript:;" className="toggle" onClick={_.bind(this.toggleExpanded, this)}>{this.props.section.name}</a>
                </div>
                {this.getActivitiesToRender()}
            </div>
        );
    }

}

Section.propTypes = {
    section: React.PropTypes.object.isRequired
};
