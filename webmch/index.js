// ==UserScript==
// @name         Webmch-video
// @version      0.0.1
// @description  Added table of contents for trello card. Some little fixes for trello card.
// @author       Andrew Solomonov
// @match        https://webmch.ru/*
// @grant        none
// ==/UserScript==

;(function () {
    'use strict';

    const style = `
        .b-button {
             position: absolute;
             z-index: 10000;
        }
        
        .b-button--next-video {
             top: 50%;
             right: 10px;
             transform: translate(0, -50%);
        }
        
        .b-button--prev-video {
            top: 50%;
            left: 10px;
            transform: translate(0, -50%);
        }
        
        .b-button--exit {
            top: 10px;
            right: 10px;
        }
    `;

    addGlobalStyle(style);

    const player = document.querySelector('.modal-document');
    const buttons = `
            <button class="b-button b-button--exit js-btn-exit">Закрыть видео</button>  
            <button class="b-button b-button--prev-video js-btn-prev">Предыдущее видео</button>  
            <button class="b-button b-button--next-video js-btn-next">Следующее видео</button>  
        `;
    player.insertAdjacentHTML('beforeend', buttons);

    document.querySelector('.js-btn-exit').addEventListener('click', () => {
        simulateKey(document.querySelector('#player'), '27');
    });

    document.querySelector('.js-btn-prev').addEventListener('click', () => {
        simulateKey(document.querySelector('#player'), 37, 'up');
    });

    document.querySelector('.js-btn-next').addEventListener('click', () => {
        simulateKey(document.querySelector('#player'), 39, 'up');
    });

    /**
     * Simulate a key event.
     * @param {Number} keyCode The keyCode of the key to simulate
     * @param {String} type (optional) The type of event : down, up or press. The default is down
     * @param {Object} modifiers (optional) An object which contains modifiers keys { ctrlKey: true, altKey: false, ...}
     */
    function simulateKey(element, keyCode, type, modifiers) {
        var evtName = (typeof (type) === 'string') ? 'key' + type : 'keydown';
        var modifier = (typeof (modifiers) === 'object') ? modifier : {};

        var event = document.createEvent('HTMLEvents');
        event.initEvent(evtName, true, false);
        event.keyCode = keyCode;

        for (var i in modifiers) {
            event[i] = modifiers[i];
        }

        element.dispatchEvent(event);
    }

    function addGlobalStyle(css) {
        let head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();
