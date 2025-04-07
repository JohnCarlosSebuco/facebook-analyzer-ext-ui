// Use your deployed backend URL here
const BACKEND_URL = 'https://facebook-analyzer-ext-server.onrender.com/analyze';

// Add this at the top for debugging
console.log('Background script loaded');

async function analyzeWithGemini(text) {
  try {
    console.log('Received text for analysis:', text.slice(0, 100) + '...');

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    console.log('Response from backend:', data);

    if (!response.ok) {
      throw new Error(`Backend Error: ${response.status} - ${data.error?.message}`);
    }

    return data.result || 'No analysis available';

  } catch (error) {
    console.error('Analysis error:', error);
    return `Analysis failed: ${error.message}`;
  }
}

// Message listener for the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeText") {
    analyzeWithGemini(request.text)
      .then(analysis => sendResponse(analysis))
      .catch(error => sendResponse(`Error: ${error.message}`));
    return true; // Keep the message channel open
  }
});
