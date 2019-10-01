// ==UserScript==
// @name         Webmch-video
// @version      0.0.1
// @description  Added buttons to use mouse with video.
// @author       Andrew Solomonov
// @match        https://webmch.ru/*
// @grant        none
// ==/UserScript==

;(function () {
    'use strict';

    const style = `
        .vjs-user-inactive ~ .b-button {
            opacity: 0.2;
            transition: all 500ms;
        }
        
        .b-button {
            background-repeat: no-repeat;
            background-position: 15px center;
            background-size: 10px 10px;
            width: 40px;
            height: 40px;
            position: absolute;
            z-index: 10000;
            border: none;
            background-color: #ffffff12;
            border-radius: 50%;
        }
        
        .b-button:hover {
            background-color: #fffffff5;
            transition: all 400ms;
        }
        
        .b-button:active {
            background-color: #e60074;
            box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);
        }
        
        .b-button:focus {
            outline: 0;
        }
        
        .b-button:before, 
        .b-button:after {
            position: absolute;
            content: '';
            display: block;
            width: 140%;
            height: 100%;
            left: -20%;
            z-index: -1000;
            transition: all ease-in-out 0.5s;
            background-repeat: no-repeat;
        }
        
        .b-button:before {
            display: none;
            top: -75%;
            background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 20%, #ff0081 20%, transparent 30%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);
            background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;
        }
        
        .b-button:after {
            display: none;
            bottom: -75%;
            background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);
            background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
        }
        
        .b-button.animate:before {
            display: block;
            animation: topBubbles ease-in-out 0.75s forwards;
        }
        
        .b-button.animate:after {
            display: block;
            animation: bottomBubbles ease-in-out 0.75s forwards;
        }
        
        @keyframes topBubbles {
            0% {
            background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
            }
            50% {
            background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
            }
            100% {
            background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
            background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
            }
        }
        
        @keyframes bottomBubbles {
            0% {
            background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
            }
            50% {
            background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
            }
            100% {
            background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
            background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
            }
        }
        
        .b-button--next-video {
           background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='451.846' height='451.847'%3E%3Cpath d='M345.44 248.292l-194.287 194.28c-12.36 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.39 0-44.744l171.914-171.91L106.41 54.017c-12.354-12.36-12.354-32.394 0-44.748s32.39-12.36 44.75 0l194.287 194.284a31.53 31.53 0 0 1 9.262 22.366c0 8.1-3.09 16.196-9.267 22.373z'/%3E%3C/svg%3E");
            top: 50%;
            right: 10px;
            transform: translate(0, -50%);
        }
        
        .b-button--prev-video {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='451.846' height='451.847'%3E%3Cpath d='M345.44 248.292l-194.287 194.28c-12.36 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.39 0-44.744l171.914-171.91L106.41 54.017c-12.354-12.36-12.354-32.394 0-44.748s32.39-12.36 44.75 0l194.287 194.284a31.53 31.53 0 0 1 9.262 22.366c0 8.1-3.09 16.196-9.267 22.373z'/%3E%3C/svg%3E");
            top: 50%;
            left: 10px;
            transform: translate(0, -50%) rotate(-180deg);
        }
        
        .b-button--exit {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 47.971 47.971'%3E%3Cpath d='M28.228 23.986L47.092 5.122a3 3 0 0 0 0-4.242 3 3 0 0 0-4.242 0L23.986 19.744 5.12.88a3 3 0 0 0-4.242 0 3 3 0 0 0 0 4.242l18.865 18.864L.88 42.85a3 3 0 0 0 0 4.242c.586.585 1.354.878 2.12.878a2.99 2.99 0 0 0 2.121-.879l18.865-18.864L42.85 47.09a2.99 2.99 0 0 0 4.242 0 3 3 0 0 0 0-4.242L28.228 23.986z'/%3E%3C/svg%3E");
            top: 10px;
            right: 10px;
        }
        
        .b-button--reduce-player {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Cpath d='M198 354h-40v-40c22.09 0 40 17.91 40 40zm-119 0h40v-40H79v40zm-79 0h40v-40c-22.09 0-40 17.91-40 40zm158 158c22.09 0 40-17.91 40-40h-40v40zm-79 0h40v-40H79v40zM0 433h40v-40H0v40zm158 0h40v-40h-40v40zM40 512v-40H0c0 22.09 17.91 40 40 40zM452 0H60C26.916 0 0 26.916 0 60v214h40V60c0-11.028 8.972-20 20-20h384.715L277 207.715V141h-40v135h135v-40h-66.715L472 69.285V452c0 11.028-8.972 20-20 20H238v40h214c33.084 0 60-26.916 60-60V60c0-33.084-26.916-60-60-60z'/%3E%3C/svg%3E");
            top: 10px;
            left: 10px;
        }
        
        .b-button--expand-player {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 489.3 489.3'%3E%3Cpath d='M0 12.3V477c0 6.8 5.5 12.3 12.3 12.3h224c6.8 0 12.3-5.5 12.3-12.3s-5.5-12.3-12.3-12.3H24.5V24.5h440.2V235c0 6.8 5.5 12.3 12.3 12.3s12.3-5.5 12.3-12.3V12.3C489.3 5.5 483.8 0 477 0H12.3C5.5 0 0 5.5 0 12.3zm489.2 464.6V306.6c0-6.8-5.5-12.3-12.3-12.3H306.6c-6.8 0-12.3 5.5-12.3 12.3V477c0 6.8 5.5 12.3 12.3 12.3H477c6.7-.1 12.2-5.6 12.2-12.4zm-24.5-12.2H318.8V318.8h145.9v145.9zM219.8 98.1c0-6.8-5.5-12.3-12.3-12.3H98.1c-6.8 0-12.3 5.5-12.3 12.3v109.5c0 6.8 5.5 12.3 12.3 12.3s12.3-5.5 12.3-12.3v-80l138.7 138.7a12.18 12.18 0 0 0 8.7 3.6 12.18 12.18 0 0 0 8.7-3.6 12.19 12.19 0 0 0 0-17.3L127.6 110.3h79.9c6.8 0 12.3-5.5 12.3-12.2z'/%3E%3C/svg%3E");
            top: 10px;
            left: 10px;
        }
        
        .reduce-player .modal-backdrop.in,
        .reduce-player .modal.in,
        .reduce-player .video-js {
            position: fixed;
            right: 0;
            bottom: 0;
            top: unset;
            left: unset;
            width: 400px;
            height: 225px;
        }
        
        .reduce-player.modal-open {
            overflow: unset;
        }
     
    `;

    addGlobalStyle(style);

    const player = document.querySelector('.modal-document');
    const buttons = `
            <button title="Закрыть видео" class="b-button b-button--exit js-btn-exit"></button>  
            <button title="Предыдущее видео" class="b-button b-button--prev-video js-btn-prev"></button>  
            <button title="Следующее видео" class="b-button b-button--next-video js-btn-next"></button>  
            <button title="Мини-проигрыватель" class="b-button b-button--reduce-player js-btn-reduce-player"></button> 
        `;
    player.insertAdjacentHTML('beforeend', buttons);

    document.querySelector('.js-btn-exit').addEventListener('click', (e) => {
        animateButton(e);
        simulateKey(document.querySelector('#player'), '27');
    });

    document.querySelector('.js-btn-prev').addEventListener('click', (e) => {
        animateButton(e);
        simulateKey(document.querySelector('#player'), 37, 'up');
    });

    document.querySelector('.js-btn-next').addEventListener('click', (e) => {
        animateButton(e);
        simulateKey(document.querySelector('#player'), 39, 'up');
    });

    document.querySelector('.js-btn-reduce-player').addEventListener('click', (e) => {
        animateButton(e);
        e.target.classList.toggle('b-button--expand-player');
        e.target.classList.toggle('b-button--reduce-player');

        if (e.target.classList.contains('b-button--expand-player')) {
            e.target.setAttribute('title', 'Развернуть');
        } else {
            e.target.setAttribute('title', 'Мини-проигрыватель');
        }
        document.querySelector('body').classList.toggle('reduce-player');
    });

    function animateButton(e) {
        e.preventDefault;
        e.target.classList.remove('animate');
        e.target.classList.add('animate');
        setTimeout(function () {
            e.target.classList.remove('animate');
        }, 700);
    }


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
        if (!head) {
            return;
        }
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();
