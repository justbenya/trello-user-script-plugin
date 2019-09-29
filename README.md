# Скрипты для подключения к страницам
🙋

## Установка
- Установить [tampermonkey](https://www.tampermonkey.net/) — браузерный плагин для выполнения пользовательских скриптов
- Скопировать код из `trello-toc.js`

## Функционал для улучшения [Trello](https://trello.com)
1. Добавление всех карточек (не архивных) в виде оглавления.
![Screenshot](docs/toc.png)

2. Открытые карточки всегда будут развернуты
![Screenshot](docs/not-show.png)

3. Увеличенный размер карточки, когда она открыта

4. Добавление всех ссылок расположенных на карточке во вложение

## Разработка
- Нужно в [tampermonkey](https://www.tampermonkey.net/) активировать доступ к файлам
![Screenshot](docs/tm.png)
- Добавить скрипт, удалить все кроме: 
```
// ==UserScript==
…
// ==/UserScript==
```
- Добавить в `// ==UserScript==` строку:
```
// @require file:///YOU_DIRECTORY/trello-toc.js
```
- Теперь меняя код в IDE, он автоматически сохраняется в плагине
