import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 入力元と出力先を定義
const inputFile = path.join(__dirname, "main.js");
const outputDir = path.join(__dirname, "..", "out");
const outputFile = path.join(outputDir, "bookmarklet.js");

// 出力ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// main.jsのコードを読み込む
const mainJsContent = fs.readFileSync(inputFile, "utf8");

// 即時関数でラップし、`javascript:` スキームを追加
const bookmarkletContent = `// biome-ignore lint/suspicious/noConfusingLabels: 無視
javascript:(function(){${mainJsContent}})();`;

// ファイルに書き出す
fs.writeFileSync(outputFile, bookmarkletContent);

console.log(`Bookmarklet generated at: ${outputFile}`);
