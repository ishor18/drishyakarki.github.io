# Google Sheets Integration Setup Guide

Follow these steps to connect your contact form to Google Sheets:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Portfolio Contact Form Submissions"
4. In the first row, add these headers:
   - Column A: **Timestamp**
   - Column B: **Name**
   - Column C: **Email**
   - Column D: **Message**

## Step 2: Add the Script (The Extension)

1.  Open your Google Sheet.
2.  Click on **Extensions** in the top menu, then select **Apps Script**.
    *   *If you see an error, close the tab, open an Incognito window, log in to Google, and try again.*
3.  Delete any code currently in the file (like `function myFunction()...`).
4.  Copy and paste the code below EXACTLY:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Add row to sheet
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.message
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

5.  Click the **Save** icon (floppy disk) on the toolbar. Name it "Contact Form".

## Step 3: Deploy (Make it Live)

**This is the most important part. Read carefully!**

1.  Click the blue **Deploy** button (top right).
2.  Select **New deployment**.
3.  Click the **gear icon** (User Settings) next to "Select type" and choose **Web app**.
4.  Fill in the form:
    *   **Description**: Contact Form V1
    *   **Execute as**: **Me** (your email address)
    *   **Who has access**: **Anyone** (This is crucial! If you choose "Only myself", it won't work).
5.  Click **Deploy**.
6.  You will be asked to **Authorize Access**.
    *   Click **Authorize access**.
    *   Select your Google Account.
    *   If you see a "Google hasn't verified this app" screen:
        *   Click **Advanced**.
        *   Click **Go to Contact Form (unsafe)** at the bottom.
    *   Click **Allow**.
7.  Copy the **Web app URL** provided (it ends in `/exec`).
8.  Paste this URL into your `script.js` file where it says `const GOOGLE_SCRIPT_URL = '...';`.

## Step 4: Update Your Website

1. Open the file `PASTE_SCRIPT_URL_HERE.txt` that was created
2. Paste your Web app URL in that file
3. Let me know when you're done, and I'll update the contact form code

## Testing

Once set up:
1. Fill out the contact form on your website
2. Click "Send Message"
3. Check your Google Sheet - the submission should appear!

## Troubleshooting

- **"Authorization required"**: Make sure you clicked "Allow" in Step 3
- **Form not submitting**: Check browser console (F12) for errors
- **Data not appearing**: Verify the Web app URL is correct
