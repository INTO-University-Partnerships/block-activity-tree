'use strict';

import React from 'react';
import _ from 'lodash';
import Activity from './Activity';

export default class Section extends React.Component {

    /**
     * render
     * @returns {XML}
     */
    render() {
        const fontWeight = this.props.section.current ? 'bold' : 'normal';
        return (
            <div className="section">
                <div style={{fontWeight: fontWeight}}>{this.props.section.name}</div>
                {_.map(this.props.section.activities, activity => <Activity key={activity.id} activity={activity}/>)}
            </div>
        );
    }

}

Section.propTypes = {
    section: React.PropTypes.object.isRequired
};
