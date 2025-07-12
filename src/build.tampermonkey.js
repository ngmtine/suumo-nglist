import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// package.jsonを読み込む
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// Tampermonkeyのメタデータブロックを定義
const userscriptHeader = `// ==UserScript==
// @name        ${packageJson.name}
// @namespace   http://tampermonkey.net/
// @version     0.1.0
// @description SUUMOの物件一覧ページにNG機能を追加します。
// @author      ${packageJson.author || ""}
// @match       https://suumo.jp/jj/chintai/ichiran/*
// @grant       none
// @license     MIT
// ==/UserScript==
`;

// main.jsのコードを読み込む
const mainJsContent = fs.readFileSync(path.join(__dirname, "main.js"), "utf8");

// 即時関数でラップする
const fullScript = `${userscriptHeader}
(function() {
    'use strict';

${mainJsContent}
})();
`;

// 出力ディレクトリを作成
const outputDir = path.join(__dirname, "..", "out");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 出力ファイルパス
const outputFile = path.join(outputDir, "suumo-nglist.user.js");

// ファイルに書き出す
fs.writeFileSync(outputFile, fullScript);

console.log(`Tampermonkey script generated at: ${outputFile}`);
