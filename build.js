const fs = require("fs");
const path = require("path");

const mainJsPath = path.join(__dirname, "main.js");
const outputHtmlPath = path.join(__dirname, "index.html");

try {
    const mainJsContent = fs.readFileSync(mainJsPath, "utf8");

    const bookmarkletCode = `javascript:(function(){${encodeURIComponent(mainJsContent)}})();`;

    const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>SUUMO NGリスト ブックマークレット</title>
  <style>
    body { padding: 0px; margin: 0px; font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; padding: 2em; line-height: 1.8; color: #333; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { border-bottom: 2px solid #ff7600; padding-bottom: 10px; }
    a.bookmarklet {
      display: inline-block;
      padding: 12px 24px;
      background-color: #ff7600;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 1.3em;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: background-color 0.3s;
    }
    a.bookmarklet:hover { background-color: #e66a00; }
    .instructions { margin-top: 2em; }
    .instructions h2 { border-left: 5px solid #ff7600; padding-left: 10px; }
    .instructions ul { list-style: none; padding-left: 0; }
    .instructions li { background: #f9f9f9; border: 1px solid #eee; padding: 15px; margin-bottom: 10px; border-radius: 5px; }
    .instructions code { background: #eee; padding: 2px 5px; border-radius: 3px; }
    .caution { padding: 15px; background: #fffbe6; border: 1px solid #ffe58f; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>SUUMO NGリスト ブックマークレット</h1>
    <p>下のボタンをブラウザのブックマークバーにドラッグ＆ドロップして登録してください。</p>
    <p><a href="${bookmarkletCode}" class="bookmarklet">SUUMO NGリスト</a></p>

    <div class="instructions">
      <h2>使い方</h2>
      <ul>
        <li>
          <strong>ブックマークレットの実行</strong><br>
          SUUMOの物件一覧ページを開いた状態で、登録したブックマークレットをクリックします。
          NG登録した物件は、マウスカーソルを乗せる（ホバーする）と一時的に詳細情報を確認できます。
        </li>
        <li>
          <strong>NG登録</strong><br>
          各物件のタイトル横に NG ボタンが表示されます。このボタンをクリックすると、その物件はNGリストに登録され、非表示になります。
          NG登録した物件のタイトル横には NG解除 ボタンが表示されます。これをクリックすると、その物件をNGリストから削除できます。
        </li>
        <li>
          <strong>NGリストのリセット</strong><br>
          ページ内の「まとめて問い合わせ」ボタンの隣に「NGリストを全件リセット」ボタンが追加されます。これをクリックすると、保存されている全てのNG物件情報をリセットできます。
        </li>
      </ul>
    </div>

    <div class="caution">
      <strong>注意:</strong> NGリストの情報は、お使いのブラウザのLocalStorageに保存されます。他のブラウザや他のPCとは共有されません。また、ブラウザのキャッシュやデータを削除すると、NGリストもリセットされる可能性があります。
    </div>
  </div>
</body>
</html>`;

    fs.writeFileSync(outputHtmlPath, htmlContent);

    console.log(`ブックマークレットのHTMLファイルを作成しました: ${outputHtmlPath}`);
    console.log("ターミナルで `node build.js` を実行してから、`index.html` をブラウザで開いてください。");
} catch (error) {
    console.error("エラーが発生しました:", error.message);
}
