'use strict';

const NG_LIST_KEY = 'suumoNgList';

/**
 * スタイルをページに注入します。
 * NG物件の見た目やホバー時の動作を制御します。
 */
function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* NG物件の親li要素に付与 */
        .ng-item-hidden .cassetteitem_content-body,
        .ng-item-hidden .cassetteitem-item {
            display: none; /* 詳細とテーブルを非表示 */
        }
        /* ホバー時に詳細とテーブルを再表示 */
        .ng-item-hidden:hover .cassetteitem_content-body,
        .ng-item-hidden:hover .cassetteitem-item {
            display: revert;
        }
        .ng-item-hidden .cassetteitem-detail {
            border-bottom: none;
        }
        .ng-item-hidden .cassetteitem_content-title {
            text-decoration: line-through; /* タイトルに打ち消し線 */
            color: #999;
        }
        .ng-item-hidden .cassetteitem-detail-object {
            opacity: 0.3;
        }
        .ng-item-hidden:hover .cassetteitem-detail-object {
            opacity: 1;
        }
        .ng-controls {
            display: inline-block; /* ボタンを横並びにするため */
            margin-left: 15px;
            vertical-align: middle;
        }
        .ng-controls button {
            padding: 3px 8px;
            font-size: 11px;
            color: white;
            border-radius: 3px;
            cursor: pointer;
            border: none;
        }
        .ng-button {
            background-color: #d9534f; /* 赤色 */
        }
        .undo-ng-button {
            background-color: #5bc0de; /* 水色 */
        }
    `;
    document.head.appendChild(style);
}

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
 * NGリストから物件IDを削除し、localStorageに保存します。
 * @param {string} bukkenId - NGリストから削除する物件ID
 */
function removeNgId(bukkenId) {
    let ngList = getNgList();
    ngList = ngList.filter(id => id !== bukkenId);
    localStorage.setItem(NG_LIST_KEY, JSON.stringify(ngList));
}

/**
 * 各物件の状態（NG/通常）に応じて、ボタンの表示とスタイルを更新します。
 * @param {HTMLElement} item - cassetteitem要素
 */
function setupCassetteItem(item) {
    const clipkeyInput = item.querySelector('input.js-clipkey');
    if (!clipkeyInput) return;
    const bukkenId = clipkeyInput.value;

    // 既存のコントロールを削除して再描画に備える
    let controlContainer = item.querySelector('.ng-controls');
    if (controlContainer) {
        controlContainer.remove();
    }

    // ボタンを格納するコンテナを作成
    controlContainer = document.createElement('div');
    controlContainer.className = 'ng-controls';

    const parentLi = item.closest('li');
    const isNg = getNgList().includes(bukkenId);

    if (isNg) {
        // --- NG状態の物件 ---
        if (parentLi) parentLi.classList.add('ng-item-hidden');

        const undoButton = document.createElement('button');
        undoButton.textContent = 'NG解除';
        undoButton.className = 'undo-ng-button';
        undoButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeNgId(bukkenId);
            if (parentLi) parentLi.classList.remove('ng-item-hidden');
            setupCassetteItem(item); // ボタンの状態を再描画
        };
        controlContainer.appendChild(undoButton);

    } else {
        // --- 通常状態の物件 ---
        if (parentLi) parentLi.classList.remove('ng-item-hidden');

        const ngButton = document.createElement('button');
        ngButton.textContent = 'NG';
        ngButton.className = 'ng-button';
        ngButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            addNgId(bukkenId);
            if (parentLi) parentLi.classList.add('ng-item-hidden');
            setupCassetteItem(item); // ボタンの状態を再描画
        };
        controlContainer.appendChild(ngButton);
    }

    // 物件タイトルの隣にNGコントロールを配置
    const titleContainer = item.querySelector('.cassetteitem_content-title');
    if (titleContainer) {
        titleContainer.appendChild(controlContainer);
    }
}

/**
 * NGリストを全件リセットするボタンをページに追加します。
 */
function addClearAllButton() {
    const buttonId = 'clear-ng-list-button';
    if (document.getElementById(buttonId)) return; // 既にボタンがあれば何もしない

    const clearButton = document.createElement('button');
    clearButton.id = buttonId;
    clearButton.textContent = 'NGリストを全件リセット';
    clearButton.style.cssText = `
        padding: 8px 12px;
        font-size: 14px;
        color: white;
        background-color: #f0ad4e;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 20px;
    `;

    clearButton.onclick = () => {
        const ngList = getNgList();
        if (ngList.length === 0) {
            alert('NGリストは空です。');
            return;
        }
        if (confirm(`現在 ${ngList.length} 件の物件がNG登録されています。
すべてリセットしますか？`)) {
            localStorage.removeItem(NG_LIST_KEY);
            alert('NGリストをリセットしました。ページを再読み込みします。');
            location.reload();
        }
    };

    // 「まとめて問い合わせ」の隣にボタンを配置
    const targetContainer = document.querySelector('.inquiry_item');
    if (targetContainer) {
        targetContainer.appendChild(clearButton);
    }
}


/**
 * ページ上の全物件を初期化・更新します。
 */
function initialize() {
    document.querySelectorAll('.cassetteitem').forEach(item => {
        // まだ処理されていない物件のみを対象
        if (!item.querySelector('.ng-controls')) {
            setupCassetteItem(item);
        }
    });
}

/**
 * ページが動的に更新されるのを監視し、更新のたびに処理を実行します。
 */
function observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
        // DOMの変更があるたびに初期化処理を実行
        // 新しく読み込まれた物件にも対応
        initialize();
    });

    const bukkenList = document.getElementById('js-bukkenList');
    if (bukkenList) {
        observer.observe(bukkenList, {
            childList: true,
            subtree: true
        });
    }
}

// --- メイン処理の実行 ---
injectStyles();
initialize();
addClearAllButton();
observeDOMChanges();

