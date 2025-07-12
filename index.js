document.addEventListener("DOMContentLoaded", () => {
    const loadBookmarklet = async () => {
        const bookmarkletLink = document.getElementById("bookmarklet-link");
        try {
            const response = await fetch("./out/bookmarklet.js");
            if (!response.ok) {
                throw new Error('Bookmarklet file not found. Please run "npm run build".');
            }
            const text = await response.text();
            if (bookmarkletLink) {
                bookmarkletLink.href = text;
            }
        } catch (err) {
            console.error("Failed to load bookmarklet:", err);
            if (bookmarkletLink) {
                bookmarkletLink.textContent = "ビルドが必要です";
                bookmarkletLink.href = "#";
                bookmarkletLink.style.backgroundColor = "#d9534f";
                bookmarkletLink.style.cursor = "not-allowed";
            }
        }
    };

    const loadVersion = async () => {
        const versionElm = document.getElementById("app-version");
        try {
            const response = await fetch("./package.json");
            if (!response.ok) {
                throw new Error("package.json not found.");
            }
            const pkg = await response.json();
            if (versionElm) {
                versionElm.textContent = `v${pkg.version}`;
            }
        } catch (err) {
            console.error("Failed to load version:", err);
            if (versionElm) {
                versionElm.textContent = "";
            }
        }
    };

    loadBookmarklet();
    loadVersion();
});
