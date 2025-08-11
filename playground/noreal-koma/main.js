let mangaData = [];
const originalTitle = document.title;

// --- Pagination Variables ---

let currentOffset = 0;
let currentItems = [];
let currentTitle = "";

// --- Utility Functions ---

const $ = (id) => document.getElementById(id);

function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const getUrlParam = (key) =>
    new URLSearchParams(window.location.search).get(key);

const setDocumentTitle = (title = "") => {
    if (title) {
        title = `${title} - ${originalTitle}`;
    } else {
        title = originalTitle;
    }
    document.title = title;
};

const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

function syncClearButtonVisibility() {
    const searchBox = $("search-box");
    const clearButton = $("clear-button");
    if (!searchBox || !clearButton) return;

    if (searchBox.value) {
        clearButton.style.display = "block";
    } else {
        clearButton.style.display = "none";
    }
}

// --- Data Loading ---

async function loadMangaData() {
    const response = await fetch("merged.json");
    mangaData = await response.json();
    initializeSuggestedKeywords();
    handleInitialView();
}

function handleInitialView() {
    const idParam = getUrlParam("id");
    const searchQuery = getUrlParam("search");

    if (idParam) {
        showMangaById(idParam);
    } else if (searchQuery) {
        $("search-box").value = searchQuery;
        searchManga(searchQuery);
    } else {
        showLatestManga();
    }
    syncClearButtonVisibility();
}

// --- URL & History Handling ---

function updateSearchQuery(queryOverride = null, usePush = false) {
    const query = queryOverride ?? $("search-box").value.trim();
    const newUrl = new URL(window.location);

    syncClearButtonVisibility();

    // id指定は検索時に無効
    newUrl.searchParams.delete("id");

    if (query) {
        newUrl.searchParams.set("search", query);
    } else {
        newUrl.searchParams.delete("search");
    }

    if (usePush) {
        window.history.pushState({}, "", newUrl);
    } else {
        window.history.replaceState({}, "", newUrl);
    }

    if (query) {
        searchManga(query);
    } else {
        showLatestManga();
    }
}

// --- Rendering ---

function createInfoBlock(label, content) {
    if (!content?.length) return "";
    let valueHtml;

    if (Array.isArray(content)) {
        valueHtml = content
            .map(
                (item) =>
                    `<a href="?search=${encodeURIComponent(item)}" class="clickable" data-key="${item}">${item}</a>`,
            )
            .join(" ");
    } else {
        valueHtml = content;
    }

    return `<div>${label}: ${valueHtml}</div>`;
}

function createLinkBlock(label, items) {
    if (!items?.length) return "";
    const links = items
        .map(
            (item) => `<a href="${item.url}" target="_blank">${item.title}</a>`,
        )
        .join(" ");
    return `<div>${label}: ${links}</div>`;
}

function createTextBlock(item, isSingleItem) {
    if (!isSingleItem || !item?.text?.length) return "";
    return item.text.map((t) => `<div class="manga-text">${t}</div>`).join("");
}

function renderMangaItems(items, isSingleItem = false, append = false) {
    const resultsContainer = $("result-container");
    if (!append) resultsContainer.innerHTML = "";

    items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "result-item";

        let blockquote = "";
        if (item.id.includes("twitter.com")) {
            blockquote = `<blockquote class="twitter-tweet" data-media-max-width="560">
                <a href="${item.id}" target="_blank">X で見る</a>
                </blockquote>`;
        }
        else if (item.id.includes("instagram.com")) {
            blockquote = `<blockquote class="instagram-media"
                data-instgrm-permalink="${item.id}" data-instgrm-version="14">
                <a href="${item.id}" target="_blank">Instagram で見る</a>
                </blockquote>`;
        }

        div.innerHTML = [
            blockquote,
            `<div><a href="?id=${encodeURIComponent(item.id)}">${formatDate(item.publishDate)}</a></div>`,
            createInfoBlock("タグ", item.tag),
            createInfoBlock("シリーズ", item.series),
            createInfoBlock("キャラ", item.characters),
            createLinkBlock("Instagram", item.instagram),
            createLinkBlock("SUZURI", item.suzuri),
            createLinkBlock("LINEスタンプ", item.lineSticker),
            createLinkBlock("QRコード", item.QRCode),
            createTextBlock(item, isSingleItem),
        ].join("");

        resultsContainer.appendChild(div);
    });

    if (window.twttr?.widgets) {
        window.twttr.widgets.load();
    }
    if (window.instgrm) {
        window.instgrm.Embeds.process();
    }
}

// --- "More" Button Management ---

function addMoreButton(display = "block") {
    let button = $("more-button");
    if (!button) {
        button = document.createElement("button");
        button.id = "more-button";
        button.textContent = "もっと見る";
        button.type = "button";
        button.style.display = display;
        button.className = "more-button"
        button.onclick = showMoreManga;
        $("result-container").after(button);
    }
    button.style.display = display;
}

function hideMoreButton() {
    const button = $("more-button");
    if (button) button.style.display = "none";
}

function showMoreManga() {
    const nextItems = currentItems.slice(currentOffset, currentOffset + 10);
    renderMangaItems(nextItems, false, true);
    currentOffset += 10;
    if (currentOffset >= currentItems.length) {
        hideMoreButton();
    }
}

// --- Search Logic ---

function parseSearchQuery(query) {
    // ORで分割（大文字小文字両対応、両端の空白も除去）
    const orParts = query
        .split(/\s+OR\s+/i)
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

    // 各ORパートをAND・マイナスで分解
    return orParts.map((orPart) => {
        const andWords = [];
        const notWords = [];
        // スペース区切りで分割
        orPart.split(/\s+/).forEach((word) => {
            if (word.startsWith("-") && word.length > 1) {
                notWords.push(word.slice(1));
            } else if (word.length > 0) {
                andWords.push(word);
            }
        });
        return { andWords, notWords };
    });
}

function matchMangaItem(item, parsedQuery) {
    const text = item.searchText ?? "";

    // OR条件のいずれかを満たせばOK
    return parsedQuery.some(({ andWords, notWords }) => {
        // AND条件：すべて含む
        const andOk = andWords.every((w) => text.includes(w));
        // NOT条件：どれも含まない
        const notOk = notWords.every((w) => !text.includes(w));
        return andOk && notOk;
    });
}

function searchManga(query) {
    if (!query) return;
    const parsedQuery = parseSearchQuery(query);
    const matchedResults = mangaData.filter((item) =>
        matchMangaItem(item, parsedQuery),
    );
    currentItems = matchedResults.reverse();
    currentOffset = 0;
    currentTitle = query;
    showPagedManga();
}

function showPagedManga() {
    const firstItems = currentItems.slice(0, 10);
    renderMangaItems(firstItems);
    currentOffset = 10;
    setDocumentTitle(currentTitle);
    if (currentItems.length > currentOffset) {
        addMoreButton();
    } else {
        hideMoreButton();
    }
}

// --- View Functions ---

function showMangaById(id) {
    const matchedResults = mangaData.filter((item) => item.id === id);
    if (matchedResults.length > 0) {
        renderMangaItems(matchedResults.reverse(), true);

        const first = matchedResults[0];
        if (first.text && Array.isArray(first.text) && first.text.length > 0) {
            setDocumentTitle(first.text.join(" "));
        } else {
            setDocumentTitle();
        }
    } else {
        $("result-container").innerHTML = "<p>該当する漫画が見つかりません。</p>";
        setDocumentTitle();
    }
    hideMoreButton();
}

function showLatestManga() {
    currentItems = mangaData.slice().reverse();
    currentOffset = 0;
    currentTitle = "";
    showPagedManga();
}

function showRandomManga() {
    if (!mangaData.length) return;

    $("search-box").value = "";
    updateSearchQuery("", true);

    currentItems = shuffleArray(mangaData);
    currentOffset = 0;
    currentTitle = "";
    showPagedManga();
}

// --- Suggested Keywords ---

function addRandomButton() {
    const keywordContainer = $("keyword-container");
    const button = document.createElement("button");
    button.textContent = "ランダム";
    button.type = "button";
    button.onclick = showRandomManga;
    keywordContainer.appendChild(button);
    keywordContainer.appendChild(document.createTextNode("\n"));
}

function extractSuggestedKeywords() {
    const seriesCounts = new Map();
    const characterCounts = new Map();
    const seriesCharacters = new Map();

    for (const item of mangaData) {
        if (Array.isArray(item.series)) {
            for (const series of item.series) {
                if (series && typeof series === 'string') {
                    seriesCounts.set(series, (seriesCounts.get(series) || 0) + 1);

                    if (!seriesCharacters.has(series)) {
                        seriesCharacters.set(series, new Set());
                    }
                }
            }
        }

        if (Array.isArray(item.characters)) {
            for (const character of item.characters) {
                if (character && typeof character === 'string') {
                    characterCounts.set(character, (characterCounts.get(character) || 0) + 1);

                    if (Array.isArray(item.series)) {
                        for (const series of item.series) {
                            if (series && typeof series === 'string' && seriesCharacters.has(series)) {
                                seriesCharacters.get(series).add(character);
                            }
                        }
                    }
                }
            }
        }
    }

    const result = [];
    const usedCharacters = new Set();

    // 3回以上登場するシリーズを出現回数でソート
    const validSeries = Array.from(seriesCounts.entries())
        .filter(([, count]) => count >= 3)
        .sort((a, b) => b[1] - a[1])
        .map(([series]) => series);

    // シリーズとそのキャラクターを順番に配列に格納
    for (const series of validSeries) {
        result.push(series);

        // このシリーズのキャラクターで3回以上登場するものを取得・ソート
        const seriesChars = seriesCharacters.get(series);
        if (seriesChars && seriesChars.size > 0) {
            const validCharacters = Array.from(seriesChars)
                .filter(character => characterCounts.get(character) >= 3)
                .sort((a, b) => characterCounts.get(b) - characterCounts.get(a));

            for (const character of validCharacters) {
                result.push(character);
                usedCharacters.add(character);
            }
        }
    }

    // シリーズに属していないが3回以上登場するキャラクターを追加
    const standaloneCharacters = Array.from(characterCounts.entries())
        .filter(([character, count]) => count >= 3 && !usedCharacters.has(character))
        .sort((a, b) => b[1] - a[1])
        .map(([character]) => character);

    result.push(...standaloneCharacters);

    return result;
}

function initializeSuggestedKeywords() {
    const keywords = extractSuggestedKeywords();

    const keywordContainer = $("keyword-container");
    keywords.forEach((keyword) => {
        const link = document.createElement("a");
        link.className = "clickable";
        link.dataset.key = keyword;
        link.href = `?search=${encodeURIComponent(keyword)}`;
        link.textContent = keyword;
        keywordContainer.appendChild(link);
        keywordContainer.appendChild(document.createTextNode("\n"));
    });
}

// --- Main Entry Point ---

function main() {
    loadMangaData();
    addRandomButton();
    addMoreButton("none");

    $("clear-button").addEventListener("click", () => {
        const searchBox = $("search-box");
        searchBox.value = "";
        updateSearchQuery("", true);
        searchBox.focus();
    });
}

// --- Popstate (Back/Forward Navigation) ---

window.addEventListener("popstate", handleInitialView);

// --- DOM Ready ---

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
} else {
    main();
}
