document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const btn = document.getElementById('analyzeBtn');
  const loading = document.getElementById('loading');
  const extractedContainer = document.getElementById('extractedContainer');
  const analysisContainer = document.getElementById('analysisContainer');
  const errorMessage = document.getElementById('errorMessage');
  const extractedText = document.getElementById('extractedText');
  const analysisContent = document.getElementById('analysisContent');


  btn.disabled = true;
  loading.style.display = 'block';
  extractedContainer.style.display = 'none';
  analysisContainer.style.display = 'none';
  errorMessage.style.display = 'none';

  try {
      const [tab] = await chrome.tabs.query({ 
          active: true, 
          currentWindow: true 
      });

      await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content-script.js']
      });


      const response = await chrome.tabs.sendMessage(tab.id, { 
          action: "getPostText" 
      });

      if (!response?.text) throw new Error('No post text found');

      extractedText.textContent = response.text;
      extractedContainer.style.display = 'block';

      const analysis = await chrome.runtime.sendMessage({
          action: "analyzeText",
          text: response.text
      });

      analysisContent.textContent = analysis || 'No analysis generated';
      analysisContainer.style.display = 'block';
      extractedContainer.style.display = 'none';

  } catch (error) {
      console.error('Error:', error);
      errorMessage.textContent = `Error: ${error.message}`;
      errorMessage.style.display = 'block';
  } finally {
      btn.disabled = false;
      loading.style.display = 'none';
  }
});

document.getElementById('toggleExtracted').addEventListener('click', () => {
  const extractedContent = document.getElementById('extractedText');
  const toggleBtn = document.getElementById('toggleExtracted');
  
  if (extractedContent.style.display === 'none') {
      extractedContent.style.display = 'block';
      toggleBtn.textContent = 'Hide';
  } else {
      extractedContent.style.display = 'none';
      toggleBtn.textContent = 'Show';
  }
});

document.getElementById('toggleAnalysisExtracted').addEventListener('click', () => {
  const extractedContainer = document.getElementById('extractedContainer');
  
  if (extractedContainer.style.display === 'none') {
      extractedContainer.style.display = 'block';
  } else {
      extractedContainer.style.display = 'none';
  }
});