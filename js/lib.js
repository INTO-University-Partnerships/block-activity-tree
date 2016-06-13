'use strict';

import _ from 'lodash';
import Cookies from 'cookies-js';

const COOKIE_KEY = 'ExpandedSections';

/**
 * impure function that gets expanded sections from cookie
 * @returns {number[]}
 */
export const getExpandedSectionsFromCookie = () => {
    const cookie = Cookies.get(COOKIE_KEY);
    if (!Cookies.enabled) {
        return [];
    }
    return _.size(cookie) === 0 ? [] : _.map(cookie.split(','), id => parseInt(id));
};

/**
 * impure function that sets the cookie that stores which sections are expanded
 * @param {number} sectionId
 * @param {boolean} expanded
 */
export const setExpandedCookie = (sectionId, expanded) => {
    if (!Cookies.enabled) {
        return;
    }
    let expandedSections = getExpandedSectionsFromCookie(Cookies.get(COOKIE_KEY));
    if (expanded) {
        if (!_.includes(expandedSections, sectionId)) {
            expandedSections = _.sortBy([sectionId].concat(expandedSections));
        }
    } else {
        if (_.includes(expandedSections, sectionId)) {
            expandedSections = _.without(expandedSections, sectionId);
        }
    }
    if (_.size(expandedSections) === 0) {
        Cookies.expire(COOKIE_KEY);
    } else {
        Cookies.set(COOKIE_KEY, expandedSections.join(','));
    }
};
