'use strict';

import request from 'superagent';

/**
 * toggles the completion (state) of the given activity
 * @param {object} config
 * @param {number} id
 * @param {boolean} hasCompleted
 * @param {function} cb
 */
export function toggleCompletion(config, id, hasCompleted, cb) {
    request.post(config.wwwroot + '/course/togglecompletion.php')
        .type('form')
        .send({
            id,
            completionstate: hasCompleted ? 1 : 0,
            fromajax: 1,
            sesskey: config.sesskey
        }, id)
        .end(cb);
}
