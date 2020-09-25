// ==UserScript==
// @name         Notion Upgrade
// @version      0.0.1
// @description  Improving the visual appearance of kanban board like in trello
// @author       Andrei Solomonov
// @match        https://www.notion.so/*
// @grant        none
// ==/UserScript==

;(function () {
    'use strict';

    const style = `
        .notion-board-group {
            height: 80vh;
            overflow: auto;
            background-color: #ebecf0;
            border-radius: 3px;
        }
        
        .notion-board-view {
            height: 80vh;
        }
        
        .notion-board-view > div[data-block-id] {
            padding-bottom: 0 !important;
        }
    `;

    addGlobalStyle(style);

    function addGlobalStyle(css) {
        let head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();
