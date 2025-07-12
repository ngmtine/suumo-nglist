import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// package.jsonを読み込む
const packageJsonPath = join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

// Tampermonkeyのメタデータブロックを定義
const userscriptHeader = `// ==UserScript==
// @name        ${packageJson.name}
// @namespace   http://tampermonkey.net/
// @version     ${packageJson.version}
// @description SUUMOの物件一覧ページにNG機能を追加します
// @author      ${packageJson.author}
// @match       https://suumo.jp/jj/chintai/*
// @grant       none
// @license     MIT
// ==/UserScript==
`;

// main.jsとCSSファイルのコードを読み込む
let mainJsContent = readFileSync(join(__dirname, "main.js"), "utf8");
const mainStyleContent = readFileSync(join(__dirname, "main.css"), "utf8");

// スタイルをmain.jsに埋め込む
mainJsContent = mainJsContent.replace("__STYLE_PLACEHOLDER__", mainStyleContent.replace(/\n/g, ""));

// 即時関数でラップする
const fullScript = `${userscriptHeader}
(function() {
    'use strict';

${mainJsContent}
})();
`;

// 出力ディレクトリを作成
const outputDir = join(__dirname, "..", "out");
if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
}

// 出力ファイルパス
const outputFile = join(outputDir, "suumo-nglist.user.js");

// ファイルに書き出す
writeFileSync(outputFile, fullScript);

console.log(`Tampermonkey script generated at: ${outputFile}`);
