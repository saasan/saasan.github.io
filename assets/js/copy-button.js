function addCopyButtons() {
    document.querySelectorAll("pre code").forEach(block => {
        let outer = block.parentElement.parentElement.parentElement;

        // classにhighlighter-rougeがない場合はスキップ
        if (!outer.classList.contains("highlighter-rouge")) return;
        // すでにボタンがある場合はスキップ
        if (outer.querySelector(".copy-button")) return;

        let button = document.createElement("button");
        button.innerText = "Copy";
        button.className = "copy-button";
        outer.appendChild(button);

        button.addEventListener("click", async () => {
            let code = outer.querySelector("pre code");
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
