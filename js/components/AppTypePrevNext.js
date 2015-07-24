'use strict';

import React from 'react';
import _ from 'lodash';

export default class AppTypePrevNext extends React.Component {

    /**
     * c'tor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        const section = _.find(_.filter(this.props.activityTree, s => s.activities.length), s => {
            return _.isObject(_.find(s.activities, a => a.current));
        });
        const activity = _.isObject(section) ? _.find(section.activities, a => a.current) : null;
        this.section = _.isObject(section) ? section : null;
        this.activity = _.isObject(activity) ? activity : null;
        this.allActivities = _.flatten(_.map(this.props.activityTree, s => s.activities));
    }

    /**
     * @returns {XML}
     */
    getPrevLinkToRender() {
        if (_.isNull(this.section) || _.isNull(this.activity)) {
            return <span className="unavailable">{this.props.config.trans.prev}</span>;
        }
        const prevActivity = _.last(_.filter(_.takeWhile(this.allActivities, a => !a.current), a => a.available));
        if (!_.isObject(prevActivity)) {
            return <span className="unavailable">{this.props.config.trans.prev}</span>;
        }
        const href = `${this.props.config.wwwroot}/mod/${prevActivity.modname}/view.php?id=${prevActivity.id}`;
        return (
            <a href={href} title={this.props.config.trans.prev}>
                <span className="prev-text">{this.props.config.trans.prev}</span>
                <i className="icon-arrow-left"></i><span>{prevActivity.name}</span>
            </a>
        );
    }

    /**
     * @returns {XML}
     */
    getNextLinkToRender() {
        if (_.isNull(this.section) || _.isNull(this.activity)) {
            return <span className="unavailable">{this.props.config.trans.next}</span>;
        }
        const nextActivity = _.head(_.filter(_.tail(_.dropWhile(this.allActivities, a => !a.current)), a => a.available));
        if (!_.isObject(nextActivity)) {
            return <span className="unavailable">{this.props.config.trans.next}</span>;
        }
        const href = `${this.props.config.wwwroot}/mod/${nextActivity.modname}/view.php?id=${nextActivity.id}`;
        return (
            <a href={href} title={this.props.config.trans.next}>
                <span className="next-text">{this.props.config.trans.next}</span>
                <span>{nextActivity.name}</span><i className="icon-arrow-right"></i>
            </a>
        );
    }

    /**
     * render
     * @returns {XML}
     */
    render() {
        const sectionName = _.isNull(this.section) ? '' : this.section.name;
        return (
            <div className="type-prev-next">
                <div className="row-fluid">
                    <div className="span4 prev">
                        {this.getPrevLinkToRender()}
                    </div>
                    <div className="span4 section">
                        {sectionName}
                    </div>
                    <div className="span4 next">
                        {this.getNextLinkToRender()}
                    </div>
                </div>
            </div>
        );
    }

}

AppTypePrevNext.propTypes = {
    activityTree: React.PropTypes.array.isRequired,
    config: React.PropTypes.object.isRequired
};
