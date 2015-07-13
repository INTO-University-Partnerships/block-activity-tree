'use strict';

import React from 'react';
import _ from 'lodash';
import {toggleCompletion} from '../WebAPI';
import Config from '../Config';

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
            toggleCompletion(this.props.activity.id, hasCompleted, () => {});
        });
    }

    /**
     * gets the manual completion checkbox to render (if the activity is configured appropriately)
     * @returns {?XML}
     */
    getManualCompletionCheckboxToRender() {
        return this.props.activity.canComplete ? (
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
     * render
     * @returns {XML}
     */
    render() {
        const fontWeight = this.props.activity.current ? 'bold' : 'normal';
        const href = `${Config.wwwroot}/mod/${this.props.activity.modname}/view.php?id=${this.props.activity.id}`;
        return (
            <div className="activity" style={{marginLeft: '20px'}}>
                <div className="pull-left" style={{fontWeight: fontWeight}}>
                    <a href={href}>{this.props.activity.name}</a>
                </div>
                {this.getManualCompletionCheckboxToRender()}
                <div className="clearfix"></div>
            </div>
        );
    }

}

Activity.propTypes = {
    activity: React.PropTypes.object.isRequired
};
