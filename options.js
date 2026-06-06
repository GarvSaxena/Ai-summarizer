document.addEventListener("DOMContentLoaded",()=>{
    const apiKeyinput = document.getElementById("api-key");
    const savebtn = document.getElementById("savebtn");
    const successmsg = document.getElementById("successmsg");
    savebtn.addEventListener("click", ()=>{
        const ApiInputValue = apiKeyinput.value;

        if (!ApiInputValue) {
            successmsg.innerHTML = `<p style="color: red;">Please enter an API key.</p>`;
            return;
        }

        chrome.storage.sync.set({geminiApiKey: ApiInputValue}, ()=> {
            successmsg.innerHTML = `
        <p id = "success-saved-msg" class = "success-message">
        Settings saved successfully
        </p>`
        });
        
    });
});