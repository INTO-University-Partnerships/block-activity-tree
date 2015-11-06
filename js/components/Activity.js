'use strict';

import React from 'react';
import classNames from 'classnames';

export default class Activity extends React.Component {

    /**
     * gets the manual completion checkbox to render (if the activity is configured appropriately)
     * @returns {?XML}
     */
    getManualCompletionCheckboxToRender() {
        return this.props.activity.canComplete && this.props.activity.available ? (
            <div className="pull-right">
                <input
                    type="checkbox"
                    checked={this.props.activity.hasCompleted}
                    onChange={() => this.props.toggleCompl(this.props.activity.id, !this.props.activity.hasCompleted)}
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
    config: React.PropTypes.object.isRequired,
    toggleCompl: React.PropTypes.func.isRequired
};
