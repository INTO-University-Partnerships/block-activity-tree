'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import {setState} from './actionCreators';
import {AppTypeTreeContainer} from './components/AppTypeTree';
import {AppTypePrevNextContainer} from './components/AppTypePrevNext';
import {getExpandedSectionsFromCookie} from './lib';

const APP_TYPE_MAP = {
    tree: AppTypeTreeContainer,
    prev_next: AppTypePrevNextContainer
};

_.each(document.querySelectorAll('.block.block_activity_tree'), blockElement => {
    const config = JSON.parse(blockElement.querySelector('.into_block_config').innerHTML);
    if (_.has(config, 'type') && _.has(APP_TYPE_MAP, config.type)) {
        // get activity tree and determine which sections are initially expanded
        const activityTree = _.toArray(JSON.parse(blockElement.querySelector('.into_block_json').innerHTML));
        const expandedSections = getExpandedSectionsFromCookie();
        _.each(activityTree, section => {
            section.expanded = _.any(section.activities, activity => activity.current) || _.contains(expandedSections, section.id);
        });

        // create store (with thunk middleware)
        const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
        const store = createStoreWithMiddleware(reducer);
        store.dispatch(setState({
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
