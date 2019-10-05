// ==UserScript==
// @name         Trello TOC
// @version      1.3.4
// @description  Added table of contents for trello card. Some little fixes for trello card.
// @author       Andrew Solomonov
// @match        https://trello.com/*
// @grant        none
// ==/UserScript==

;(function () {
    'use strict';

    const TRELLO_CARD_LINK_PATTERN = /\/c\/([\d\w]+)\/?/;
    const TRELLO_URL = /https:\/\/trello.com\/c\/.+\//g;

    let mutationObserver;
    let tocBtn, tocTextarea, autoAttachBtn;

    function getLinksAllCardsFromLists() {
        return Array.from(document.querySelectorAll('.js-list-content')).map(list => {
            let listLinks = Array.from(list.querySelectorAll('.js-member-droppable'))
                .map(link => link.href.match(TRELLO_URL));

            let listName = list.querySelector('.js-list-name-assist').innerText;
            return { listName, listLinks };
        });
    }

    function convertDataFromListsToMarkdown(array) {
        let tableOfContent = '# Table of Contents:\n';

        array.forEach(({ listName, listLinks }) => {
            let lists = listLinks.map(link => `  - ${ link }\n`).join('');

            if (listLinks.length) {
                tableOfContent += `\n- ${ listName }\n${ lists }`;
            }
        });

        return tableOfContent;
    }

    function createButtonAutoAttach() {
        const desc = document.querySelector('.js-desc');
        if (!desc) return;
        const cardLinks = [];
        desc.querySelectorAll('a').forEach((ele) => {
            const href = ele.href;
            const matches = TRELLO_CARD_LINK_PATTERN.test(href);
            if (matches) {
                cardLinks.push({ href });
            }
        });

        if (autoAttachBtn) {
            autoAttachBtn.remove();
            autoAttachBtn = null;
        }

        if (cardLinks.length) {
            const attachBtn = document.querySelector('.button-link.js-attach');
            if (attachBtn) {
                autoAttachBtn = document.createElement('div');
                autoAttachBtn.classList.add(['button-link']);
                autoAttachBtn.textContent = 'Auto Attach Cards';
                attachBtn.parentElement.appendChild(autoAttachBtn);

                autoAttachBtn.onclick = function () {
                    attachLinks(cardLinks);
                };
            }
        }
    }

    function createButtonTableOfContents() {
        const desc = document.querySelector('.js-desc');
        if (!desc) return;

        if (tocBtn) {
            tocBtn.remove();
            tocBtn = null;
        }

        const trelloAttachBtn = document.querySelector('.button-link.js-attach');
        if (trelloAttachBtn) {
            tocBtn = document.createElement('div');
            tocBtn.classList.add('button-link');
            tocBtn.textContent = 'Create table of contents';
            trelloAttachBtn.parentElement.appendChild(tocBtn);

            tocBtn.onclick = function () {
                createTextareaTableOfContents(getLinksAllCardsFromLists());
            };
        }
    }

    function createTextareaTableOfContents(array) {
        const desc = document.querySelector('.js-desc');
        if (!desc) return;

        if (tocTextarea) {
            tocTextarea.remove();
            tocTextarea = null;
        }

        let trelloCardDetail = document.querySelector('.js-fill-card-detail-desc');
        if (trelloCardDetail) {
            tocTextarea = document.createElement('textarea');
            tocTextarea.classList.add('js-textarea-md');
            tocTextarea.innerHTML = convertDataFromListsToMarkdown(array);
            let message;

            tocTextarea.onclick = function () {
                this.focus();
                this.select();

                if (!message) {
                    message = document.createElement('p');
                    message.style.cssText = `
                        display: inline-block;
                        color: #000;
                        background: #48ff002e;
                        border-radius: 10px;
                        padding: 5px 10px;`;

                    try {
                        var successful = document.execCommand('copy');
                        var msg = successful ? 'удачно 🐝' : 'неудачно 🐝';
                        message.innerText = `Текст скопирован ${ msg }`;
                    } catch (err) {
                        message.innerText = 'К сожалению, невозможно скопировать';
                    }

                    trelloCardDetail.appendChild(message);

                    setTimeout(function () {
                        message.remove();
                        message = null;
                    }, 2000);
                }
            };

            trelloCardDetail.appendChild(tocTextarea);
        }
    }

    function attachLinks(cardLinks) {
        let curLinkIndex = 0;
        const curAttachHrefs = [];
        document.querySelectorAll('.trello-card-attachment').forEach((elem) => {
            const firstA = elem.querySelector('a');
            if (firstA) {
                curAttachHrefs.push(firstA.href);
            }
        });

        const hrefs = cardLinks.map(o => o.href).filter((href) => {
            return curAttachHrefs.indexOf(href) < 0;
        });

        function attachNextLink() {
            if (!hrefs[curLinkIndex]) return;
            setTimeout(() => {
                const attachBtn = document.querySelector('.button-link.js-attach');
                attachBtn.click();

                setTimeout(() => {
                    const tryAdd = (retryTimes) => {
                        const addLinkInput = document.getElementById('addLink');
                        if (!addLinkInput) {
                            if (!retryTimes) return;
                            setTimeout(() => {
                                tryAdd(--retryTimes);
                            }, 300);
                            return;
                        }
                        addLinkInput.value = hrefs[curLinkIndex];
                        const attachSubmitBtn = document.querySelector('.js-add-attachment-url');
                        attachSubmitBtn.click();
                        curLinkIndex++;

                        setTimeout(() => {
                            attachNextLink();
                        }, 500);
                    };

                    tryAdd(4);

                }, 500);
            }, 100);
        }

        attachNextLink();
    }

    function oversizedCardSize() {
        let style = document.createElement('style');
        style.innerText = '.window { width: 1155px; } .window-main-col { width: 882px; color: #000;}';
        document.querySelector('body').appendChild(style);
    }

    function alwaysExpandedTextInCards() {
        let trelloFadeBtn = document.querySelector('.description-content-fade-button');
        let trelloDescContent = document.querySelector('.js-desc-content');

        if (trelloFadeBtn && (trelloDescContent && trelloDescContent.classList.contains('is-hide-full'))) {
            trelloFadeBtn.style.display = 'none';
            trelloDescContent.classList.remove('is-hide-full');
        }
    }

    function bindOverlayEvents() {
        const tabParentEle = document.querySelector('.js-tab-parent');
        if (!mutationObserver) {
            mutationObserver = new MutationObserver(mutations => {
                let hasCardDetail = false;
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        hasCardDetail = true;
                    }
                });

                if (hasCardDetail) {
                    createButtonAutoAttach();
                    createButtonTableOfContents();
                    alwaysExpandedTextInCards();
                }
            });
        }
        mutationObserver.observe(tabParentEle, { childList: true });
    }

    createButtonAutoAttach();
    createButtonTableOfContents();
    oversizedCardSize();
    alwaysExpandedTextInCards();
    bindOverlayEvents();

//    ----

    function highlight(md) {
        if (!md.hasChildNodes() || md.getAttribute('card-highlighted') === 'true') {
            return;
        }
        md.setAttribute('card-highlighted', 'true');
        md.querySelectorAll('pre > code').forEach(function (code, id) {
            code.parentNode.className += ' hljs';
            hljs.highlightBlock(code);
        });
    }

    function withDomReady(fn) {
        // If we're early to the party
        document.addEventListener('DOMContentLoaded', fn);
        // If late; I mean on time.
        if (
            document.readyState === 'interactive' ||
            document.readyState === 'complete'
        ) {
            fn();
        }
    }

    withDomReady(function () {
        document.head.appendChild(addFileScript('//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js'));
        document.head.appendChild(addFileStyle('//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github.min.css'));
        document.head.appendChild(addGlobalStyle(`
            .window-wrapper.js-tab-parent .hljs {
                background: #f8f8f8;
                overflow-x: initial;
            }`));

        function addFileScript(src) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            return script;
        }

        function addFileStyle(src) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = src;
            return link;
        }

        function addGlobalStyle(css) {
            let style = document.createElement('style');
            style.innerHTML = css;
            return style;
        }

        var observer = new MutationObserver(function (mutations) {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    if (mutation.target.className === 'js-fill-card-detail-desc') {
                        // card description
                        let md = mutation.target.querySelector('.current');
                        if (md) {
                            highlight(md);
                        }
                    }
                    if (mutation.target.classList.contains('mod-card-back')) {
                        // card comment
                        let md = mutation.target.querySelector('.current-comment');
                        if (md) {
                            highlight(md);
                        }
                    }
                    if (mutation.target.classList.contains('current')) {
                        highlight(mutation.target);
                    }
                    if (mutation.target.classList.contains('mod-comment-type')) {
                        let md = mutation.target.querySelector('.current-comment');
                        if (md) {
                            highlight(md);
                        }
                    }
                }
            }
        });

        observer.observe(document.querySelector('.window-wrapper.js-tab-parent'), {
            childList: true,
            subtree: true
        });
    });
})();
