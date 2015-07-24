'use strict';

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {toggleCompletion} from '../WebAPI';

export default class Activity extends React.Component {

    /**
     * c'tor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        const hasCompleted = props.activity.hasCompleted;
        this.state = {
            hasCompleted
        };
    }

    /**
     * invoked when manual completion toggled
     */
    onToggleCompletion() {
        const hasCompleted = !this.state.hasCompleted;
        this.setState({
            hasCompleted
        }, () => {
            toggleCompletion(this.props.config, this.props.activity.id, hasCompleted, () => {});
        });
    }

    /**
     * gets the manual completion checkbox to render (if the activity is configured appropriately)
     * @returns {?XML}
     */
    getManualCompletionCheckboxToRender() {
        return this.props.activity.canComplete && this.props.activity.available ? (
            <div className="pull-right">
                <input
                    type="checkbox"
                    checked={this.state.hasCompleted}
                    onChange={_.bind(this.onToggleCompletion, this)}
                />
            </div>
        ) : null;
    }

    /**
     * gets the activity name to render, either in a link (if the activity is available) or just text (if it's unavailable)
     * @returns {XML}
     */
    getActivityNameToRender() {
        if (this.props.activity.available) {
            const href = `${this.props.config.wwwroot}/mod/${this.props.activity.modname}/view.php?id=${this.props.activity.id}`;
            return <a href={href}>{this.props.activity.name}</a>;
        } else {
            return <span className="unavailable">{this.props.activity.name}</span>;
        }
    }

    /**
     * render
     * @returns {XML}
     */
    render() {
        const cn = classNames({
            'pull-left': true,
            'current': this.props.activity.current
        });
        return (
            <div className="activity">
                <div className={cn}>
                    {this.getActivityNameToRender()}
                </div>
                {this.getManualCompletionCheckboxToRender()}
                <div className="clearfix"></div>
            </div>
        );
    }

}

Activity.propTypes = {
    activity: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired
};
