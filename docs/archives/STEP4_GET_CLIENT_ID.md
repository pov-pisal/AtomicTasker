# Step 4: How to Get Your CLIENT ID - Visual Guide

Complete visual walkthrough for creating and copying your Google OAuth Client ID.

---

## Prerequisites

Before Step 4, you must complete:
- ✅ **Step 1:** Create Google Cloud Project
- ✅ **Step 2:** Enable Google Tasks API  
- ✅ **Step 3:** Configure OAuth Consent Screen (with 3 scopes added)

---

## Step 4.1: Go to Credentials Page

**Open this URL in your browser:**
```
https://console.cloud.google.com/apis/credentials
```

Or navigate manually:
1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Look at **left sidebar** (gray menu)
4. Click **"APIs & Services"** (might say "Products & solutions" first)
5. Click **"Credentials"** (in the submenu)

**You should see a page titled: "Credentials"**

---

## Step 4.2: Click CREATE CREDENTIALS Button

Look at the **top of the page**, you should see:

```
┌─────────────────────────────────────┐
│  Search  🔍  │  [+ CREATE CREDENTIALS]  │
└─────────────────────────────────────┘
```

**Click the blue button: "+ CREATE CREDENTIALS"**

---

## Step 4.3: Select Application Type

A dropdown menu appears with options:
```
○ API Key
○ OAuth 2.0 Client ID  ← SELECT THIS
○ Service Account
```

**Click: "OAuth 2.0 Client ID"**

---

## Step 4.4: Choose Application Type

A new dialog appears asking:
```
"Select the type of application you're building"
```

You see checkboxes:
```
○ Web application
○ Desktop application
○ Mobile application
○ Chrome App  ← SELECT THIS
○ Other
```

**IMPORTANT: Click the circle/radio button next to "Chrome App"**

(NOT "Web application" - that's different!)

---

## Step 4.5: Enter Name

You'll see a form field:

```
Name: [___________________________]
```

**Type: "Atomic Tasker"**

---

## Step 4.6: Click CREATE Button

Look for the blue button at the bottom right:

**Click: "CREATE"** or **"Create"**

---

## Step 4.7: You'll See a Popup - THIS IS WHERE YOUR CLIENT ID IS! ⭐

**A dialog or notification will appear showing:**

```
╔═════════════════════════════════════════════════════════╗
║                  OAuth Client Created                    ║
├─────────────────────────────────────────────────────────┤
║                                                           ║
║  Client ID:                                              ║
║  📋 123456789012-abc1def2ghi3jkl4mno5pqr6stu7vwx        ║
║      .apps.googleusercontent.com                         ║
║                                                           ║
║  Client Secret:                                          ║
║  📋 GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxx                  ║
║                                                           ║
║  [Close]  [Download JSON]                                ║
║                                                           ║
╚═════════════════════════════════════════════════════════╝
```

---

## Step 4.8: COPY THE CLIENT ID

The **Client ID** is the long string that includes `.apps.googleusercontent.com`

It looks like ONE of these formats:

**Format 1 (Numbers and letters):**
```
123456789012-abc1def2ghi3jkl4mno5pqr6stu7vwx.apps.googleusercontent.com
```

**Format 2 (All numbers):**
```
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

### How to Copy:

**Method A: Click the Copy Icon**
- There should be a 📋 icon next to the Client ID
- Click it
- It will copy to your clipboard

**Method B: Manual Copy**
- Triple-click on the Client ID text to select all
- Press **Ctrl+C** (or **Cmd+C** on Mac)
- Now it's in your clipboard

**Method C: Select and Copy**
- Click at the start of the text
- Hold Shift and click at the end
- Press **Ctrl+C** (or **Cmd+C** on Mac)

---

## Step 4.9: SAVE IT SOMEWHERE SAFE

After copying, immediately save it:

**Option 1: Save in a Text File**
```
1. Open Notepad (or any text editor)
2. Paste the Client ID
3. Save as: "google-client-id.txt"
4. Keep it somewhere safe
```

**Option 2: Save in Password Manager**
```
1. Open your password manager (LastPass, 1Password, etc.)
2. Create new entry: "Atomic Tasker Google"
3. Paste Client ID
4. Save
```

**Option 3: Write it Down**
```
Write down the Client ID on paper
Keep it in a safe place
```

---

## Step 4.10: Go Back to Credentials List

After closing the dialog, you should see your new credential listed:

```
┌─────────────────────────────────────────┐
│ OAuth 2.0 Client IDs                    │
├─────────────────────────────────────────┤
│ Name: Atomic Tasker                     │
│ Type: Chrome App                        │
│ Created: Jan 31, 2026                   │
│ Client ID: 123456789012-abc1def...     │
└─────────────────────────────────────────┘
```

---

## What Your Client ID Looks Like

Your Client ID will be a long string with this pattern:

```
[NUMBERS]-[RANDOM_CHARACTERS].apps.googleusercontent.com
```

Examples:
```
123456789012-abc1def2ghi3jkl4mno5pqr6stu7vwx.apps.googleusercontent.com
987654321098-xyz9yba8xcd7wef6vug5tsh4rqp3ono.apps.googleusercontent.com
111111111111-aabbccddeeffgghhiijjkkllmmnnoo.apps.googleusercontent.com
```

---

## ✅ Verification Checklist

After Step 4, check:

✅ You can see the "OAuth 2.0 Client IDs" section in Credentials page
✅ You see "Atomic Tasker" listed as a Chrome App type
✅ You have copied the full Client ID
✅ It ends with `.apps.googleusercontent.com`
✅ You saved it somewhere safe

---

## Troubleshooting Step 4

### Problem: Don't see "+ CREATE CREDENTIALS" button
**Solution:** 
- Make sure you're on the "Credentials" page
- If not, go to: https://console.cloud.google.com/apis/credentials
- Refresh the page (press F5)

### Problem: Can't find "Chrome App" option
**Solution:**
- Make sure you selected "OAuth 2.0 Client ID" first
- Then you should see the application type choices
- If still missing, scroll down in the dialog

### Problem: Got "Web application" by mistake
**Solution:**
- Delete that credential
- Create a NEW one
- This time select "Chrome App" type
- The Web application one won't work for extensions

### Problem: Dialog closed but don't have Client ID
**Solution:**
- Go back to Credentials page
- You should see "Atomic Tasker" listed
- Click on it (the row)
- It will show the Client ID again

---

## Next Steps

Once you have your Client ID:

1. ✅ You now have your CLIENT ID (copied and saved)
2. Go to **Step 5:** Update manifest.json with this Client ID
3. I can help you update manifest.json automatically

---

## Ready?

**Share your Client ID here and I will:**
1. Update your manifest.json automatically
2. You can then reload the extension
3. Sign in will work! 🚀

Or if you have any questions about this step, let me know! 💬
