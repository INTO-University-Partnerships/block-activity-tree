'use strict';

import React from 'react';

export default class Activity extends React.Component {

    /**
     * render
     * @returns {XML}
     */
    render() {
        const fontWeight = this.props.activity.current ? 'bold' : 'normal';
        const href = `/mod/${this.props.activity.modname}/view.php?id=${this.props.activity.id}`;
        return (
            <div className="activity" style={{marginLeft: '20px'}}>
                <div style={{fontWeight: fontWeight}}>
                    <a href={href}>{this.props.activity.name}</a>
                </div>
            </div>
        );
    }

}

Activity.propTypes = {
    activity: React.PropTypes.object.isRequired
};
