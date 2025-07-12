import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 入力元と出力先を定義
const mainJsFile = join(__dirname, "main.js");
const mainStyleFile = join(__dirname, "main.css");
const outputDir = join(__dirname, "..", "out");
const outputFile = join(outputDir, "bookmarklet.js");

// 出力ディレクトリが存在しない場合は作成
if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
}

// main.jsとCSSファイルのコードを読み込む
// なぜcssまで分割しているのかはmain.jsの冒頭参照
let mainJsContent = readFileSync(mainJsFile, "utf8");
const mainStyleContent = readFileSync(mainStyleFile, "utf8");

// スタイルをmain.jsに埋め込む
mainJsContent = mainJsContent.replace("__STYLE_PLACEHOLDER__", mainStyleContent.replace(/\n/g, ""));

// 即時関数でラップし、`javascript:` スキームを追加
const bookmarkletContent = `javascript:(function(){${mainJsContent}})();`;

// ファイルに書き出す
writeFileSync(outputFile, bookmarkletContent);

console.log(`Bookmarklet generated at: ${outputFile}`);
