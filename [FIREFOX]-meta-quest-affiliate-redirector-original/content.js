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

function getBaseUrl(url) {
  const urlObj = new URL(url);
  return urlObj.origin + urlObj.pathname;
}

function processAffiliateLink() {
  const currentUrl = window.location.href;

  if (currentUrl.includes("cjevent")) {
    console.log(`Skipping processing for: ${currentUrl} (already contains cjevent)`);
    return;
  }

  const currentBaseUrl = getBaseUrl(currentUrl);

  if (currentUrl.includes("https://www.meta.com/en-gb/experiences/")) {
    const urlParts = currentBaseUrl.split("/");
    const rawName = urlParts[5];
    const normalizedGameName = normalizeName(rawName);

    const matchingAffiliateLink = affiliateLinks[normalizedGameName];

    if (matchingAffiliateLink) {
      console.log(`Redirecting to affiliate link for: ${rawName}`);
      window.location.href = matchingAffiliateLink;
    } else {
      console.log(`No affiliate link found for: ${rawName}`);
      
      const fallbackQuery = "?cjevent=6507f720a92211ef81d400bc0a82b821&utm_source=cj&utm_medium=affiliate&utm_campaign=creatoraffiliate&utm_parent=frl";
      const newUrl = currentBaseUrl + fallbackQuery;
      console.log(`Appending fallback query and redirecting: ${newUrl}`);
      window.location.href = newUrl;
    }
  }
}

function observeUrlChanges() {
  let lastUrl = window.location.href;

  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      console.log(`URL changed: ${currentUrl}`);
      lastUrl = currentUrl;
      processAffiliateLink();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("popstate", () => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      console.log(`popstate detected URL change: ${currentUrl}`);
      lastUrl = currentUrl;
      processAffiliateLink();
    }
  });

  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function (...args) {
    pushState.apply(this, args);
    window.dispatchEvent(new Event("popstate"));
  };

  history.replaceState = function (...args) {
    replaceState.apply(this, args);
    window.dispatchEvent(new Event("popstate"));
  };

  processAffiliateLink();
}

const runtime = typeof browser !== "undefined" ? browser.runtime : chrome.runtime;

runtime.sendMessage({ action: "getAffiliateLinks" }, (receivedLinks) => {
  if (receivedLinks) {
    affiliateLinks = receivedLinks;
    observeUrlChanges();
  } else {
    console.error("No affiliate links received from background script.");
  }
});
