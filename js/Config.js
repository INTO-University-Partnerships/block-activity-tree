'use strict';

import _ from 'lodash';

const elem = document.querySelector('#into_block_activity_tree_config');

let Config = {
    wwwroot: '',
    sesskey: ''
};

if (!_.isNull(elem)) {
    Config = JSON.parse(elem.innerHTML);
}

export default Config;
