'use strict';

import request from 'superagent';
import Config from './Config';

/**
 * toggles the completion (state) of the given activity
 * @param {number} id
 * @param {boolean} hasCompleted
 * @param {function} cb
 */
export function toggleCompletion(id, hasCompleted, cb) {
    request.post(Config.wwwroot + '/course/togglecompletion.php')
        .type('form')
        .send({
            id: id,
            completionstate: hasCompleted ? 1 : 0,
            fromajax: 1,
            sesskey: Config.sesskey
        }, id)
        .end(cb);
}
