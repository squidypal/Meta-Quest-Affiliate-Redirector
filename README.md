# Meta Quest Store Affiliate Redirector

This Chrome extension redirects Meta Quest Store links to corresponding affiliate links, based on game names fetched from a GitHub README. It dynamically updates links in real-time and ensures they point to affiliate URLs.

## Features
- **Game Name Normalization**: Handles differences in formatting, ensuring game names match between the Meta Quest Store and the GitHub README.
  - Converts spaces to hyphens (`Beat Saber` → `beat-saber`).
- **Dynamic Link Updates**: Checks for changes to links on the page every second and updates them as needed.
- **Redundant Update Prevention**: Marks processed links with a `data-affiliate="true"` attribute to avoid unnecessary reprocessing.
- **Affiliate Link Management**: Reads and matches game names with affiliate links defined in a GitHub README.

---

## Installation
- [Chrome Page]("")
- [FireFox Page]("")

---

## How It Works
1. **Fetching Affiliate Links**:
   - The extension fetches affiliate links from a GitHub README, formatted as:
     ```markdown
     [Game Name](https://affiliate-link.com)
     ```
   - Example:
     ```markdown
     [Beat Saber](https://www.meta.com/affiliates/5GtTEYLtw)
     [Superhot VR](https://www.meta.com/affiliates/2jdfTeYdsf)
     ```

2. **Normalizing Game Names**:
   - Game names are converted to lowercase, special characters are removed, and spaces are replaced with hyphens.
   - Consecutive hyphens are limited to two.
     - Example: `The Walking Dead: Saints & Sinners` → `the-walking-dead-saints-sinners`.

3. **Dynamic Updates**:
   - When a matching affiliate link is found, the link is updated to the affiliate URL.

---

## File Descriptions
- **manifest.json**:
  Defines the extension's permissions, scripts, and host rules.
  
- **background.js**:
  - Fetches affiliate links from the GitHub README.
  - Normalizes game names and stores them for matching.

- **content.js**:
  - Dynamically updates links on the Meta Quest Store.

---

## Example Use Case
1. Open the Meta Quest Store.
2. Click on a game link, such as `https://www.meta.com/en-gb/experiences/beat-saber/`.
3. The extension redirects to the corresponding affiliate link fetched from the GitHub README, such as:
   ```
   https://www.meta.com/affiliates/5GtTEYLtw
   ```

---

## GitHub README Format
Ensure the GitHub README has entries formatted as:
```markdown
[Game Name](https://affiliate-link.com)
```
Example:
```markdown
[Beat Saber](https://www.meta.com/affiliates/5GtTEYLtw)
[Superhot VR](https://www.meta.com/affiliates/2jdfTeYdsf)
```

---

## Troubleshooting
- **No Affiliate Link Found**:
  Ensure the game name in the Meta Quest Store URL matches (after normalization) the name in the GitHub README.
  
- **Extension Not Updating Links**:
  - Check the console logs for errors (`chrome://extensions/ > Inspect Views`).
  - Verify that the GitHub README is accessible and properly formatted.

---

## License
This extension is distributed under the MIT License. See the LICENSE file for details.
