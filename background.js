
// types of schrome storage - sync, local
// local - stores inside the current session/browser/account
// sync - across all session/accounts
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["geminiApiKey"], (result)=>{
        if(!result.geminiApiKey){
            chrome.tabs.create({url: "option.html"}); // if the gemini api key is not stored then open the options page
        };
    });
});