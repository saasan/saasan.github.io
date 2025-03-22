function addCopyButtons() {
    document.querySelectorAll(".highlighter-rouge").forEach(block => {
        // すでにボタンがある場合はスキップ
        if (block.querySelector(".copy-button")) return;

        let button = document.createElement("button");
        button.innerText = "Copy";
        button.className = "copy-button";
        block.appendChild(button);

        button.addEventListener("click", async () => {
            let code = block.querySelector("pre code");
            if (!code) return;

            let text = code.innerText;
            try {
                await navigator.clipboard.writeText(text);
                button.innerText = "Copied!";
                setTimeout(() => button.innerText = "Copy", 2000);
            } catch (err) {
                console.error("コピーに失敗しました", err);
            }
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addCopyButtons);
} else {
    addCopyButtons();
}
