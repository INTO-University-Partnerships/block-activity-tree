'use strict';

import React from 'react';
import App from './components/App';

const activityTree = JSON.parse(document.querySelector('#into_block_activity_tree_json').innerHTML);

React.render(
    <App activityTree={activityTree}/>,
    document.querySelector('#into_block_activity_tree_render_target')
);
