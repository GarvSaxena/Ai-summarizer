const summarizeButton = document.getElementById("summarize");
const result = document.getElementById("result");
const summaryTypeSelect = document.getElementById("summaryType");
const loader = document.getElementById("loader");

summarizeButton.addEventListener("click", async () => {
    result.innerText = "Extracting text from page...";
    loader.style.display = "block"; // Show loader

    try {
        // 1. Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Check if it's a restricted Chrome page before trying to inject
        if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("about:")) {
            result.innerText = "Error: Cannot summarize browser settings or new tab pages. Please try on a real website.";
            loader.style.display = "none";
            return;
        }

        // 2. Inject function directly into the page (Bypasses the need for content.js!)
        const injectionResults = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const article = document.querySelector("article");
                if (article) return article.innerText;

                const paragraphs = Array.from(document.querySelectorAll("p"));
                return paragraphs.map((p) => p.innerText).join("\n");
            }
        });

        const extractedText = injectionResults[0].result;

        if (extractedText) {
            result.innerText = "Generating summary with Gemini...";
            
            // 3. Get the API Key
            chrome.storage.sync.get(["geminiApiKey"], async (storageResult) => {
                const apiKey = storageResult.geminiApiKey;
                
                if (!apiKey) {
                    result.innerText = "Error: Please set your Gemini API key in the extension settings.";
                    loader.style.display = "none";
                    chrome.runtime.openOptionsPage();
                    return;
                }

                // 4. Call the Gemini API
                try {
                    const summaryType = summaryTypeSelect.value;
                    const prompt = `Summarize the following article. Style: ${summaryType}. \n\n Article Text: ${extractedText}`;

                    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: prompt }]
                            }]
                        })
                    });

                    const data = await apiResponse.json();
                    
                    if (data.error) {
                        result.innerText = "API Error: " + data.error.message;
                        return;
                    }

                    // 5. Display the final summary
                    let summaryText = data.candidates[0].content.parts[0].text;
                    
                    // Convert Markdown bold (**text**) to HTML bold tags
                    summaryText = summaryText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                    
                    // Use innerHTML so the HTML tags render correctly
                    result.innerHTML = summaryText;

                } catch (error) {
                    result.innerText = "Error calling Gemini API: " + error.message;
                } finally {
                    loader.style.display = "none";
                }
            });
        } else {
            result.innerText = "Error extracting the article text from this page. No paragraphs found.";  
            loader.style.display = "none";
        }
    } catch (error) {
        console.error(error);
        result.innerText = "Could not establish connection. Make sure you are on a valid webpage.";
        loader.style.display = "none";
    }
});

// Copy Button Functionality
document.getElementById("copyResult").addEventListener("click", () => {
    const txt = document.getElementById("result").innerText;
    
    // Don't copy if it's empty or just a loading/error message
    if (!txt || txt === "Select a type and click summarize..." || txt.includes("Error") || txt.includes("...")) {
        return;
    }

    navigator.clipboard.writeText(txt).then(() => {
        const btn = document.getElementById("copyResult");
        const old = btn.textContent;
        btn.textContent = "Copied!";
        
        // Revert back to "Copy" after 2 seconds
        setTimeout(() => (btn.textContent = old), 2000);
    });
});

// Settings Button Functionality
document.getElementById("settingsBtn").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
});