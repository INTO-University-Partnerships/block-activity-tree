'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import 'jasmine-expect';

describe('AppTypePrevNext', () => {
    let AppTypePrevNext;

    beforeEach(() => {
        AppTypePrevNext = require('../../components/AppTypePrevNext.js').AppTypePrevNext;
    });

    describe('layout and initialization', () => {
        let customSectionName,
            activityTree,
            config,
            appComponent;

        beforeEach(() => {
            customSectionName = 'A fancy custom section name';
            activityTree = [
                {
                    id: 1,
                    name: customSectionName,
                    section: 0,
                    current: false,
                    activities: [
                        {
                            id: 1,
                            name: 'Forum 001',
                            modname: 'forum',
                            current: false,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        },
                        {
                            id: 2,
                            name: 'Wiki 001',
                            modname: 'wiki',
                            current: true,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        },
                        {
                            id: 3,
                            name: 'Url 001',
                            modname: 'url',
                            current: false,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                }
            ];
            config = {
                wwwroot: '',
                sesskey: '',
                trans: {
                    prev: 'Previous',
                    next: 'Next'
                }
            };
            appComponent = TestUtils.renderIntoDocument(
                <AppTypePrevNext
                    activityTree={activityTree}
                    config={config}
                />
            );
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(appComponent).parentElement);
        });

        it('should render successfully', () => {
            expect(TestUtils.isCompositeComponentWithType(appComponent, AppTypePrevNext)).toBeTruthy();
        });

        it('should be rendered into an element with the "type-prev-next" class', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'type-prev-next');
            expect(ReactDOM.findDOMNode(appComponent)).toBe(ReactDOM.findDOMNode(renderedDOMComponent));
        });

        it('should render the section name (corresponding to the current activity)', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'section');
            expect(renderedDOMComponent.innerHTML).toBe(customSectionName);
        });

        it('should render a link to the previous activity (relative to the current activity)', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'prev');
            const link = renderedDOMComponent.querySelector('a');
            expect(link.href).toEndWith('/mod/forum/view.php?id=1');
        });

        it('should render a link to the next activity (relative to the current activity)', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'next');
            const link = renderedDOMComponent.querySelector('a');
            expect(link.href).toEndWith('/mod/url/view.php?id=3');
        });
    });

    describe('when the previous activity is unavailable', () => {
        let activityTree,
            config,
            appComponent;

        beforeEach(() => {
            activityTree = [
                {
                    id: 1,
                    name: 'Section 0',
                    section: 0,
                    current: false,
                    activities: [
                        {
                            id: 1,
                            name: 'Forum 001',
                            modname: 'forum',
                            current: false,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        },
                        {
                            id: 2,
                            name: 'Wiki 001',
                            modname: 'wiki',
                            current: true,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        },
                        {
                            id: 3,
                            name: 'Url 001',
                            modname: 'url',
                            current: false,
                            available: false,
                            canComplete: false,
                            hasCompleted: false
                        },
                        {
                            id: 4,
                            name: 'Quiz 001',
                            modname: 'quiz',
                            current: false,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                }
            ];
            config = {
                wwwroot: '',
                sesskey: '',
                trans: {
                    prev: 'Previous',
                    next: 'Next'
                }
            };
            appComponent = TestUtils.renderIntoDocument(
                <AppTypePrevNext
                    activityTree={activityTree}
                    config={config}
                />
            );
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(appComponent).parentElement);
        });

        it('should render a link to the "nearest" available activity', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'next');
            const link = renderedDOMComponent.querySelector('a');
            expect(link.href).toEndWith('/mod/quiz/view.php?id=4');
        });
    });

    describe('when the next activity is unavailable', () => {
        let activityTree,
            config,
            appComponent;

        beforeEach(() => {
            activityTree = [
                {
                    id: 1,
                    name: 'Section 0',
                    section: 0,
                    current: false,
                    activities: [
                        {
                            id: 1,
                            name: 'Forum 001',
                            modname: 'forum',
                            current: false,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        },
                        {
                            id: 2,
                            name: 'Wiki 001',
                            modname: 'wiki',
                            current: false,
                            available: false,
                            canComplete: false,
                            hasCompleted: false
                        },
                        {
                            id: 3,
                            name: 'Url 001',
                            modname: 'url',
                            current: true,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        },
                        {
                            id: 4,
                            name: 'Quiz 001',
                            modname: 'quiz',
                            current: false,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                }
            ];
            config = {
                wwwroot: '',
                sesskey: '',
                trans: {
                    prev: 'Previous',
                    next: 'Next'
                }
            };
            appComponent = TestUtils.renderIntoDocument(
                <AppTypePrevNext
                    activityTree={activityTree}
                    config={config}
                />
            );
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(appComponent).parentElement);
        });

        it('should render a link to the "nearest" available activity', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'prev');
            const link = renderedDOMComponent.querySelector('a');
            expect(link.href).toEndWith('/mod/forum/view.php?id=1');
        });
    });

    describe('when there is no available previous or next activity', () => {
        let activityTree,
            config,
            appComponent;

        beforeEach(() => {
            activityTree = [
                {
                    id: 1,
                    name: 'Section 0',
                    section: 0,
                    current: false,
                    activities: [
                        {
                            id: 1,
                            name: 'Forum 001',
                            modname: 'forum',
                            current: false,
                            available: false,
                            canComplete: false,
                            hasCompleted: false
                        },
                        {
                            id: 2,
                            name: 'Wiki 001',
                            modname: 'wiki',
                            current: true,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        },
                        {
                            id: 3,
                            name: 'Url 001',
                            modname: 'url',
                            current: false,
                            available: false,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                }
            ];
            config = {
                wwwroot: '',
                sesskey: '',
                trans: {
                    prev: 'Previous',
                    next: 'Next'
                }
            };
            appComponent = TestUtils.renderIntoDocument(
                <AppTypePrevNext
                    activityTree={activityTree}
                    config={config}
                />
            );
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(appComponent).parentElement);
        });

        it('should render "Previous" with the "unavailable" class', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'prev');
            const elem = renderedDOMComponent.querySelector('.unavailable');
            expect(elem.innerHTML).toBe(config.trans.prev);
        });

        it('should render "Next" with the "unavailable" class', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'next');
            const elem = renderedDOMComponent.querySelector('.unavailable');
            expect(elem.innerHTML).toBe(config.trans.next);
        });
    });

    describe('when the previous and next activities are in the previous and next sections', () => {
        let activityTree,
            config,
            appComponent;

        beforeEach(() => {
            activityTree = [
                {
                    id: 1,
                    name: 'Section 0',
                    section: 0,
                    current: false,
                    activities: [
                        {
                            id: 1,
                            name: 'Forum 001',
                            modname: 'forum',
                            current: false,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'Section 1',
                    section: 1,
                    current: false,
                    activities: [
                        {
                            id: 2,
                            name: 'Quiz 001',
                            modname: 'quiz',
                            current: true,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                },
                {
                    id: 3,
                    name: 'Section 2',
                    section: 2,
                    current: false,
                    activities: [
                        {
                            id: 3,
                            name: 'Glossary 001',
                            modname: 'glossary',
                            current: false,
                            available: true,
                            canComplete: false,
                            hasCompleted: false
                        }
                    ]
                }
            ];
            config = {
                wwwroot: '',
                sesskey: '',
                trans: {
                    prev: 'Previous',
                    next: 'Next'
                }
            };
            appComponent = TestUtils.renderIntoDocument(
                <AppTypePrevNext
                    activityTree={activityTree}
                    config={config}
                />
            );
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(appComponent).parentElement);
        });

        it('should render a link to the activity in the previous section', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'prev');
            const link = renderedDOMComponent.querySelector('a');
            expect(link.href).toEndWith('/mod/forum/view.php?id=1');
        });

        it('should render a link to the activity in the next section', () => {
            const renderedDOMComponent = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'next');
            const link = renderedDOMComponent.querySelector('a');
            expect(link.href).toEndWith('/mod/glossary/view.php?id=3');
        });
    });
});
