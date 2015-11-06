'use strict';

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Activity from './Activity';

export default class Section extends React.Component {

    /**
     * gets activities to render
     * @returns {XML}
     */
    getActivitiesToRender() {
        const items = this.props.section.expanded ? _.map(
            this.props.section.activities,
            activity => <Activity key={activity.id} activity={activity} config={this.props.config} toggleComplThunk={this.props.toggleComplThunk}/>
        ) : [];
        return (
            <ReactCSSTransitionGroup transitionName="activities" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                {items}
            </ReactCSSTransitionGroup>
        );
    }

    /**
     * render
     * @returns {XML}
     */
    render() {
        const cn = classNames({
            current: this.props.section.current
        });
        return (
            <div className="section">
                <div className={cn}>
                    <a href="javascript:;" className="toggle" onClick={() =>
                        this.props.toggleExpandedThunk(this.props.section.id, !this.props.section.expanded)}>{this.props.section.name
                    }</a>
                </div>
                {this.getActivitiesToRender()}
            </div>
        );
    }

}

Section.propTypes = {
    section: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired,
    toggleComplThunk: React.PropTypes.func.isRequired,
    toggleExpandedThunk: React.PropTypes.func.isRequired
};
