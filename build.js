const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, 'main.js');
const outputHtmlPath = path.join(__dirname, 'bookmarklet.html');

try {
  const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');

  const bookmarkletCode = `javascript:(function(){${encodeURIComponent(mainJsContent)}})();`;

  const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>SUUMO NGリスト ブックマークレット</title>
  <style>
    body { font-family: sans-serif; padding: 2em; line-height: 1.6; }
    a {
      display: inline-block;
      padding: 10px 20px;
      background-color: #ff7600;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 1.2em;
      font-weight: bold;
    }
    p { max-width: 600px; }
  </style>
</head>
<body>
  <h1>SUUMO NGリスト ブックマークレット</h1>
  <p>以下のリンクをブラウザのブックマークバーにドラッグ＆ドロップして登録してください。</p>
  <a href="${bookmarkletCode}">SUUMO NGリスト</a>
  <p>登録後、SUUMOの物件一覧ページでこのブックマークレットをクリックすると、NG機能が有効になります。</p>
</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, htmlContent);

  console.log(`ブックマークレットのHTMLファイルを作成しました: ${outputHtmlPath}`);
  console.log('ターミナルで `node build.js` を実行してから、`bookmarklet.html` をブラウザで開いてください。');

} catch (error) {
  console.error('エラーが発生しました:', error.message);
}
