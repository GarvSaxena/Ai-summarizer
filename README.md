# AI Article Summarizer Chrome Extension

A lightweight, vanilla JavaScript Chrome extension that extracts text from web articles and uses the Google Gemini API to generate concise summaries.

## Features

- **Text Extraction:** Automatically extracts text from article tags or paragraphs on the active webpage without relying on background content scripts.
- **Customizable Summaries:** Choose between Brief, Detailed, or Bullet Point summary styles.
- **Powered by Gemini:** Uses the fast Gemini 3.5 Flash model for quick generation.
- **Secure Key Storage:** Save your Gemini API key locally in your browser's secure Chrome Storage.
- **Quick Copy:** One-click button to copy the generated summary to your clipboard.

## Setup and Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the `Article Summariser` folder. The extension will now be added to your browser.

## Usage

1. **Set your API Key:** 
   - Click the extension icon in your Chrome toolbar.
   - Click the settings button in the top right corner of the popup to open the Options page.
   - Enter your Gemini API key (obtainable from Google AI Studio) and click Save Settings.
2. **Summarize an Article:**
   - Navigate to any web page containing an article or blog post.
   - Click the extension icon.
   - Select your preferred summary style from the dropdown menu.
   - Click **Summarize**.
   - Once the summary is generated, you can read it in the popup or click **Copy** to save it to your clipboard.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Chrome Extensions API (Manifest V3)
- Google Generative AI API (Gemini)
