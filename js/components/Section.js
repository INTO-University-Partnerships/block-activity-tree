'use strict';

import React from 'react/addons';
import _ from 'lodash';
import Cookies from 'cookies-js';
import classNames from 'classnames';
import Activity from './Activity';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
const COOKIE_KEY = 'ExpandedSections';

export default class Section extends React.Component {

    /**
     * c'tor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        const expandedSections = this.getExpandedSectionsFromCookie(Cookies.get(COOKIE_KEY));
        this.state = {
            expanded: _.any(props.section.activities, activity => activity.current) || _.contains(expandedSections, props.section.id)
        };
    }

    /**
     * @param {object} cookie
     * @returns {number[]}
     */
    getExpandedSectionsFromCookie(cookie) {
        if (!Cookies.enabled) {
            return [];
        }
        return _.size(cookie) === 0 ? [] : _.map(cookie.split(','), id => parseInt(id));
    }

    /**
     * gets activities to render
     * @returns {XML}
     */
    getActivitiesToRender() {
        const items = this.state.expanded ? _.map(this.props.section.activities, activity => <Activity key={activity.id} activity={activity}/>) : [];
        return (
            <ReactCSSTransitionGroup transitionName="activities">
                {items}
            </ReactCSSTransitionGroup>
        );
    }

    /**
     * sets the cookie that stores which sections are expanded
     */
    setExpandedCookie() {
        if (!Cookies.enabled) {
            return;
        }
        let expandedSections = this.getExpandedSectionsFromCookie(Cookies.get(COOKIE_KEY));
        if (this.state.expanded) {
            if (!_.contains(expandedSections, this.props.section.id)) {
                expandedSections = _.sortBy([this.props.section.id].concat(expandedSections));
            }
        } else {
            if (_.contains(expandedSections, this.props.section.id)) {
                expandedSections = _.without(expandedSections, this.props.section.id);
            }
        }
        if (_.size(expandedSections) === 0) {
            Cookies.expire(COOKIE_KEY);
        } else {
            Cookies.set(COOKIE_KEY, expandedSections.join(','));
        }
    }

    /**
     * toggles expanded state
     */
    toggleExpanded() {
        const expanded = !this.state.expanded;
        this.setState({
            expanded
        }, this.setExpandedCookie);
    }

    /**
     * render
     * @returns {XML}
     */
    render() {
        const cn = classNames({
            'current': this.props.section.current
        });
        return (
            <div className="section">
                <div className={cn}>
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
