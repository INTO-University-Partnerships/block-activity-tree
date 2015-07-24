'use strict';

import React from 'react';
import _ from 'lodash';
import AppTypeTree from './components/AppTypeTree';
import AppTypePrevNext from './components/AppTypePrevNext';

const APP_TYPE_MAP = {
    'tree': AppTypeTree,
    'prev_next': AppTypePrevNext
};

_.each(document.querySelectorAll('.block.block_activity_tree'), blockElement => {
    const config = JSON.parse(blockElement.querySelector('.into_block_config').innerHTML);
    if (_.has(config, 'type') && _.has(APP_TYPE_MAP, config.type)) {
        const T = APP_TYPE_MAP[config.type];
        const activityTree = JSON.parse(blockElement.querySelector('.into_block_json').innerHTML);
        const renderTarget = blockElement.querySelector('.content .into_block_render_target');
        React.render(
            <T
                activityTree={activityTree}
                config={config}
            />,
            renderTarget
        );
    }
});
