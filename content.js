// this file will be used to read the data from the document on the tab
function getArticleText(){
    const article = document.querySelector("article"); // This will be used to read the content in the article tag in the browser , because generaly the articles are writtern inside article tag
    
    if(article) return article.innerText;

    const paragraphs = Array.from(document.querySelectorAll("p")); // if the article is in the paragraph tag
    return paragraphs.map((p) => p.innerText).join("\n");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_ARTICLE_TEXT") {
        const text = getArticleText();
        sendResponse({ text: text });
    }
    return true; 
});
