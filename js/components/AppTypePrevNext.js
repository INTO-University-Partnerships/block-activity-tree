'use strict';

import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

export class AppTypePrevNext extends React.Component {

    /**
     * @returns {XML}
     */
    getPrevLinkToRender() {
        if (_.isNull(this.props.section) || _.isNull(this.props.activity)) {
            return <span className="unavailable">{this.props.config.trans.prev}</span>;
        }
        const prevActivity = _.last(_.filter(_.takeWhile(this.props.allActivities, a => !a.current), a => a.available));
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
        if (_.isNull(this.props.section) || _.isNull(this.props.activity)) {
            return <span className="unavailable">{this.props.config.trans.next}</span>;
        }
        const nextActivity = _.head(_.filter(_.tail(_.dropWhile(this.props.allActivities, a => !a.current)), a => a.available));
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
        const sectionName = _.isNull(this.props.section) ? '' : this.props.section.name;
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
    section: React.PropTypes.object,
    activity: React.PropTypes.object,
    allActivities: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    config: React.PropTypes.object.isRequired
};

export const AppTypePrevNextContainer = connect(state => {
    const sec = _.find(_.filter(state.activityTree, s => s.activities.length), s => {
        return _.isObject(_.find(s.activities, a => a.current));
    });
    const act = _.isObject(sec) ? _.find(sec.activities, a => a.current) : null;
    const section = _.isObject(sec) ? sec : null;
    const activity = _.isObject(act) ? act : null;
    const allActivities = _.flatten(_.map(state.activityTree, s => s.activities));
    return {
        section,
        activity,
        allActivities,
        config: state.config
    };
})(AppTypePrevNext);
