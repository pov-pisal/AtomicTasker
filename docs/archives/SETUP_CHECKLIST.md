# 🚀 Google Sync Setup Checklist

Complete this checklist to set up Google Tasks synchronization for your AtomicTasker extension.

## Phase 1: Google Cloud Console Setup (10 minutes)

### Step 1: Create Google Cloud Project
- [ ] Go to https://console.cloud.google.com/
- [ ] Click project dropdown → "NEW PROJECT"
- [ ] Name: "Atomic Tasker"
- [ ] Click "CREATE"
- [ ] Wait for project to be created

### Step 2: Enable Google Tasks API
- [ ] Search for "Google Tasks API"
- [ ] Click "Google Tasks API"
- [ ] Click "ENABLE"
- [ ] Wait for API to enable

### Step 3: Configure OAuth Consent Screen
- [ ] Go to: APIs & Services → OAuth consent screen
- [ ] Select: "External"
- [ ] Click "CREATE"
- [ ] Fill form:
  - App name: "Atomic Tasker"
  - Support email: Your email
  - Developer contact: Your email
- [ ] Click "SAVE AND CONTINUE"
- [ ] Click "SAVE AND CONTINUE" (skip scopes for now)
- [ ] On scopes page: "ADD OR REMOVE SCOPES"
- [ ] Search: "tasks"
- [ ] Select: `https://www.googleapis.com/auth/tasks`
- [ ] Click "UPDATE"
- [ ] Click "SAVE AND CONTINUE"
- [ ] Review and click "SAVE AND CONTINUE"

### Step 4: Create OAuth Credentials
- [ ] Go to: APIs & Services → Credentials
- [ ] Click "CREATE CREDENTIALS"
- [ ] Select: "OAuth 2.0 Client ID"
- [ ] Choose: "Chrome App"
- [ ] Name: "Atomic Tasker"
- [ ] Click "CREATE"
- [ ] **Copy your CLIENT ID** (long string with .apps.googleusercontent.com)
- [ ] Save it somewhere safe

## Phase 2: Extension Setup (5 minutes)

### Step 5: Update manifest.json
- [ ] Open your extension folder
- [ ] Open `manifest.json` file
- [ ] Find line: `"client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",`
- [ ] Replace `YOUR_GOOGLE_CLIENT_ID` with the Client ID from Step 4
- [ ] Example: `"client_id": "123456789-abc123xyz456.apps.googleusercontent.com",`
- [ ] Save the file

### Step 6: Load Extension in Chrome
- [ ] Open Chrome
- [ ] Go to: `chrome://extensions/`
- [ ] Toggle "Developer mode" (top right)
- [ ] Click "Load unpacked"
- [ ] Select your extension folder
- [ ] Wait for extension to load
- [ ] **Note your EXTENSION ID** (shown below extension name, format: abcdefghijklmnopqrstuvwxyzabcd)
- [ ] Copy it somewhere safe

## Phase 3: Complete OAuth Setup (5 minutes)

### Step 7: Update OAuth Credentials
- [ ] Go back to Google Cloud Console
- [ ] Go to: APIs & Services → Credentials
- [ ] Find your "Chrome App" credential
- [ ] Click the edit/pencil icon
- [ ] In "Application ID" field: paste your Extension ID from Step 6
- [ ] Click "SAVE"

### Step 8: Verify Setup
- [ ] All steps above completed? ✅
- [ ] manifest.json has correct Client ID? ✅
- [ ] Google Cloud has correct Extension ID? ✅
- [ ] Both IDs match their sources? ✅

## Phase 4: Test the Extension (5 minutes)

### Step 9: Test Sign In
- [ ] Open your extension (should be in top right)
- [ ] Look for "🔐 Sign In" button
- [ ] Click it
- [ ] You'll see Google sign-in prompt
- [ ] Choose your Google account
- [ ] Review permissions
- [ ] Click "Allow"
- [ ] Wait for redirect

### Step 10: Verify Sign In
- [ ] Extension should show your email
- [ ] Sign-in button should become "✕"
- [ ] Should see "✓ Synced" status
- [ ] Should see "↻ Sync" button

### Step 11: Test Sync
- [ ] Add a new task in extension
- [ ] Type: "Test Task"
- [ ] Click "+ Quick Add"
- [ ] Check status shows "✓ Synced"
- [ ] Open Google Tasks: https://tasks.google.com/
- [ ] Look for task list "Atomic Tasker Tasks"
- [ ] Your task should appear there!

### Step 12: Test Bidirectional Sync
- [ ] Go to Google Tasks
- [ ] Mark the test task complete
- [ ] Go back to extension
- [ ] Click "↻ Sync" button
- [ ] Task should show as completed

## ✅ Success Criteria

You'll know it's working when:
- ✅ You can sign in
- ✅ Email shows in extension
- ✅ Sync status shows "Synced"
- ✅ Tasks appear in Google Tasks
- ✅ Completed tasks sync back
- ✅ Manual sync works

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Sign in failed" | Check manifest.json Client ID |
| Tasks not syncing | Check your Extension ID in Google Cloud |
| No Google Tasks list appears | Wait 1 minute after first sync |
| Still having issues? | Check browser console (F12) for errors |

## 📚 Documentation

If you get stuck:
1. Read: `GOOGLE_SYNC_SETUP.md` (detailed guide)
2. Check: `GOOGLE_SYNC_QUICK_GUIDE.md` (quick reference)
3. Review: `GOOGLE_SYNC_README.md` (feature overview)

## 🎉 Next Steps

Once working:
- ✅ Start adding tasks daily
- ✅ Complete tasks in extension
- ✅ Watch them sync to Google
- ✅ Access from Google Tasks too
- ✅ Work offline, sync automatically

## 📝 Notes

- Save your Client ID and Extension ID somewhere safe
- Manifest.json will always have your Client ID
- Never share your Client ID publicly
- You can update Extension ID later if needed

---

**Expected Time**: 25 minutes total
**Difficulty**: Easy (mostly copy-paste)
**Support**: Check documentation files above

Good luck! 🚀
