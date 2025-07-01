'use strict';

const NG_LIST_KEY = 'suumoNgList';

/**
 * localStorageからNG物件IDのリストを取得します。
 * @returns {string[]} NG物件IDの配列
 */
function getNgList() {
    const list = localStorage.getItem(NG_LIST_KEY);
    return list ? JSON.parse(list) : [];
}

/**
 * NGリストに物件IDを追加し、localStorageに保存します。
 * @param {string} bukkenId - NGリストに追加する物件ID
 */
function addNgId(bukkenId) {
    const ngList = getNgList();
    if (!ngList.includes(bukkenId)) {
        ngList.push(bukkenId);
        localStorage.setItem(NG_LIST_KEY, JSON.stringify(ngList));
    }
}

/**
 * NGリストに含まれる物件を非表示にします。
 */
function hideNgItems() {
    const ngList = getNgList();
    if (ngList.length === 0) return;

    const items = document.querySelectorAll('.cassetteitem');
    items.forEach(item => {
        const clipkeyInput = item.querySelector('input.js-clipkey');
        if (clipkeyInput && ngList.includes(clipkeyInput.value)) {
            // cassetteitem全体を非表示にする
            const parentLi = item.closest('li');
            if (parentLi) {
                parentLi.style.display = 'none';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

/**
 * 各物件に「NG」ボタンを追加します。
 */
function addNgButtons() {
    const items = document.querySelectorAll('.cassetteitem');
    items.forEach(item => {
        const clipkeyInput = item.querySelector('input.js-clipkey');
        if (!clipkeyInput) return;

        const bukkenId = clipkeyInput.value;

        // 既にボタンが追加されている場合はスキップ
        if (item.querySelector('.ng-button')) return;

        const ngButton = document.createElement('button');
        ngButton.textContent = 'NG';
        ngButton.className = 'ng-button';
        ngButton.style.cssText = `
            margin-left: 8px;
            padding: 5px 10px;
            font-size: 12px;
            color: white;
            background-color: #d9534f;
            border: 1px solid #d43f3a;
            border-radius: 3px;
            cursor: pointer;
        `;

        ngButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm(`この物件をNGリストに追加しますか？\nID: ${bukkenId}`)) {
                addNgId(bukkenId);
                const parentLi = item.closest('li');
                 if (parentLi) {
                    parentLi.style.display = 'none';
                } else {
                    item.style.display = 'none';
                }
            }
        });

        const favoriteButtonContainer = item.querySelector('.js-property');
        if (favoriteButtonContainer) {
            favoriteButtonContainer.appendChild(ngButton);
        }
    });
}

/**
 * ページが動的に更新されるのを監視し、更新のたびにボタン追加と非表示処理を実行します。
 */
function observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
        // DOMの変更があるたびに処理を実行
        init();
    });

    const bukkenList = document.getElementById('js-bukkenList');
    if (bukkenList) {
        observer.observe(bukkenList, {
            childList: true,
            subtree: true
        });
    }
}

/**
 * 初期化処理
 */
function init() {
    hideNgItems();
    addNgButtons();
}

// メイン処理の実行
init();
observeDOMChanges();