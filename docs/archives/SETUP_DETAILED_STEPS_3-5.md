# Detailed Setup Guide - Steps 3, 4, 5

Complete guide for configuring OAuth Consent Screen and getting your Google Client ID.

---

## Step 3: Configure OAuth Consent Screen (5 minutes)

After **Step 2** (Enable Google Tasks API), you'll see a blue banner at the top saying:
> "To use this API, you may need credentials. Click 'Create credentials' below."

**BUT FIRST**, you must configure the OAuth consent screen.

### 3.1: Go to OAuth Consent Screen
```
URL: https://console.cloud.google.com/apis/credentials/consent
```

OR navigate manually:
1. In Google Cloud Console, left sidebar click **"APIs & Services"**
2. Click **"OAuth consent screen"**

### 3.2: Choose User Type
You'll see two options:
- **Internal** (only for Google Workspace account users)
- **External** (for everyone)

**Click: "External"** ← This is what you need
Then click blue **"CREATE"** button

### 3.3: Fill the OAuth Consent Screen Form

You'll see a form with these required fields:

#### App Name
```
Field: "App name"
Enter: "Atomic Tasker"
Description: "A Chrome extension for managing tasks and syncing with Google"
```

#### User Support Email
```
Field: "User support email"
Enter: YOUR_EMAIL@gmail.com
(Use your personal Google account email)
```

#### Scopes (IMPORTANT - Don't skip this!)
```
Scroll down to "Scopes"
Click button: "ADD OR REMOVE SCOPES"
```

A modal will pop up with a search box.

**Search for and select these 3 scopes:**

1. Search: `tasks`
   - Select: `https://www.googleapis.com/auth/tasks`
   - ✅ Check the checkbox

2. Search: `email`
   - Select: `https://www.googleapis.com/auth/userinfo.email`
   - ✅ Check the checkbox

3. Search: `profile`
   - Select: `https://www.googleapis.com/auth/userinfo.profile`
   - ✅ Check the checkbox

Then click **"UPDATE"** button

#### Developer Contact Information
```
Field: "Developer contact information"
Emails: YOUR_EMAIL@gmail.com
(Your Google account email)
```

### 3.4: Click "SAVE AND CONTINUE"
- Click the **blue "SAVE AND CONTINUE"** button
- It will take you to "Scopes" page
- Click **"SAVE AND CONTINUE"** again
- It will take you to "Test users" page
- Click **"SAVE AND CONTINUE"** one more time
- You'll see a summary - click **"BACK TO DASHBOARD"**

---

## Step 4: Create OAuth Credentials (5 minutes)

Now you'll create the actual OAuth 2.0 Client ID that the extension needs.

### 4.1: Go to Credentials Page
```
URL: https://console.cloud.google.com/apis/credentials
```

OR navigate manually:
1. Left sidebar click **"APIs & Services"**
2. Click **"Credentials"**

### 4.2: Create New Credential

Look for the blue **"+ CREATE CREDENTIALS"** button at the top

Click it and select: **"OAuth 2.0 Client ID"**

### 4.3: Choose Application Type

A dialog appears asking "Application type":

**Select: "Chrome App"** ← Very important!

(NOT "Web application", NOT "Desktop app", specifically "Chrome App")

### 4.4: Fill in the Name

```
Field: "Name"
Enter: "Atomic Tasker"
```

### 4.5: Click CREATE

Click the blue **"CREATE"** button

### 4.6: Copy Your Client ID ⭐⭐⭐ IMPORTANT ⭐⭐⭐

A modal will appear showing your new credentials. You'll see:

```
Client ID:    123456789012-abc1def2ghi3jkl4mno5pqr6stu7vwx.apps.googleusercontent.com
Client Secret: (you won't need this)
```

**COPY THE ENTIRE CLIENT ID**
- The long string that ends with `.apps.googleusercontent.com`
- It looks like: `123456789012-abc1def2ghi3jkl4mno5pqr6stu7vwx.apps.googleusercontent.com`

### 4.7: Save It Somewhere Safe
- Write it down in a text file
- Save it in your password manager
- You'll need it in Step 5

---

## Step 5: Update manifest.json (2 minutes)

Now you have your Client ID. Let's update the extension with it.

### 5.1: Open manifest.json

In your extension folder, open the file:
```
manifest.json
```

You should see:
```json
"oauth2": {
  "client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/tasks",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ]
},
```

### 5.2: Replace the Placeholder

Find the line:
```json
"client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
```

Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID from Step 4.6

**EXAMPLE:**

Before:
```json
"client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
```

After:
```json
"client_id": "123456789012-abc1def2ghi3jkl4mno5pqr6stu7vwx.apps.googleusercontent.com",
```

### 5.3: Save the File

- Press **Ctrl+S** (or Cmd+S on Mac)
- File should show as saved

---

## Verification Checklist

Before moving to Step 6, verify:

✅ **Step 3 Done:**
- OAuth Consent Screen configured
- App name: "Atomic Tasker"
- 3 scopes added (tasks, userinfo.email, userinfo.profile)
- All required emails filled

✅ **Step 4 Done:**
- OAuth 2.0 Client ID created (Chrome App type)
- Client ID copied and saved

✅ **Step 5 Done:**
- manifest.json updated with real Client ID
- NO more "YOUR_GOOGLE_CLIENT_ID" text in the file
- File saved

---

## Common Mistakes to Avoid

❌ **Mistake 1:** Created "Web application" instead of "Chrome App"
- **Fix:** Delete it and create a new one, select "Chrome App"

❌ **Mistake 2:** Forgot to add scopes in Step 3
- **Fix:** Go back to OAuth Consent Screen, add the 3 scopes

❌ **Mistake 3:** Didn't save manifest.json
- **Fix:** Open manifest.json and press Ctrl+S to save

❌ **Mistake 4:** Only copied part of the Client ID
- **Fix:** Copy the ENTIRE string including `.apps.googleusercontent.com`

---

## Next Steps

After completing Steps 3, 4, 5:

1. Go to `chrome://extensions/`
2. Click refresh button ↻ on Atomic Tasker
3. Click "Sign In" button in the extension
4. You should see Google sign-in dialog
5. Sign in with your Google account
6. You'll see "Synced" status

---

## Still Having Issues?

If you get error: **"bad client id: {}"**
- Check that Client ID in manifest.json has NO quotes around the placeholder
- Make sure the Client ID ends with `.apps.googleusercontent.com`
- Try removing the extension and reloading it

If you get error: **"invalid_client"**
- Check that you created "Chrome App" type (not Web application)
- Make sure Client ID is pasted completely

If Google sign-in dialog doesn't appear:
- Check browser console (F12 → Console tab)
- Look for any error messages
- Share the error with me

---

**You're almost done! Just follow these steps and you'll have Google sync working! 🚀**
