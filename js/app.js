'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import reducer from './reducer';
import {setInitialState} from './actionCreators';
import {AppTypeTreeContainer} from './components/AppTypeTree';
import {AppTypePrevNextContainer} from './components/AppTypePrevNext';

const APP_TYPE_MAP = {
    tree: AppTypeTreeContainer,
    prev_next: AppTypePrevNextContainer
};

_.each(document.querySelectorAll('.block.block_activity_tree'), blockElement => {
    const config = JSON.parse(blockElement.querySelector('.into_block_config').innerHTML);
    if (_.has(config, 'type') && _.has(APP_TYPE_MAP, config.type)) {
        // create store
        const activityTree = JSON.parse(blockElement.querySelector('.into_block_json').innerHTML);
        const store = createStore(reducer);
        store.dispatch(setInitialState({
            activityTree,
            config
        }));

        // render
        const T = APP_TYPE_MAP[config.type];
        const renderTarget = blockElement.querySelector('.content .into_block_render_target');
        ReactDOM.render(
            <Provider store={store}><T/></Provider>,
            renderTarget
        );
    }
});
