'use strict';

import React from 'react';
import App from './components/App';

const elem = document.querySelector('#into_block_activity_tree_json');
const activityTree = JSON.parse(elem.innerHTML);

React.render(
    <App activityTree={activityTree}/>,
    document.querySelector('#into_block_activity_tree_render_target')
);
