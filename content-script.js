chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPostText") {
      const posts = document.querySelectorAll(`
        div[role="article"],
        div[data-ad-preview="message"],
        div[data-pagelet^="FeedUnit_"],
        div[data-testid="post_message"]
      `);
        

      let mostVisiblePost = null;
      let maxVisibleArea = 0;
  
      posts.forEach(post => {
        const rect = post.getBoundingClientRect();
  
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
  
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
        const visibleArea = visibleHeight * visibleWidth;
  
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          mostVisiblePost = post;
        }
      });
  
      const postText = mostVisiblePost
        ? Array.from(mostVisiblePost.querySelectorAll('p, span, div'))
            .map(el => el.textContent.trim())
            .filter(text => text.length > 0)
            .filter((text, index, self) => self.indexOf(text) === index) 
            .join('\n')
            .replace(/\s+/g, ' ')
            .trim()
        : null;
  
      sendResponse({ text: postText || null });

      console.log("Visible posts found:", posts.length);
      console.log("Most visible post:", mostVisiblePost);
      console.log("Extracted post text:", postText);
    }
  
    return true;
  });
  