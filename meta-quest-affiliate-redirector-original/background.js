let affiliateLinks = {};

function normalizeName(name) {
  return name.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, ""); 
}

async function fetchAffiliateLinks() {
  const url = "https://raw.githubusercontent.com/Minibattle/Meta-Quest-Affiliate-Codes/main/README.md";
  try {
    const response = await fetch(url);
    if (!response.ok) return;
    const text = await response.text();
    const lines = text.split("\n");
    lines.forEach((line) => {
      const match = /\[(.*?)\]\((.*?)\)/.exec(line);
      if (match) {
        const gameName = normalizeName(match[1]);
        const affiliateLink = match[2];
        affiliateLinks[gameName] = affiliateLink;
      }
    });
    console.log("Affiliate links loaded:", affiliateLinks);
  } catch (error) {
    console.error("Error fetching affiliate links:", error);
  }
}

fetchAffiliateLinks();
setInterval(fetchAffiliateLinks, 300000);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getAffiliateLinks") {
    sendResponse(affiliateLinks);
  }
});
