# Google Account Synchronization Setup Guide

This guide walks you through setting up Google Tasks synchronization for AtomicTasker.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Google Cloud Console Setup](#google-cloud-console-setup)
3. [Installation Steps](#installation-steps)
4. [Testing the Sync](#testing-the-sync)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

- A Google Account
- Chrome browser
- AtomicTasker extension files
- Admin access to Google Cloud Console

## Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google Account
3. Click on the project dropdown at the top
4. Click "NEW PROJECT"
5. Enter "Atomic Tasker" as the project name
6. Click "CREATE"
7. Wait for the project to be created (may take a few moments)

### Step 2: Enable Google Tasks API

1. In the Google Cloud Console, search for "Google Tasks API" in the search bar
2. Click on "Google Tasks API"
3. Click the "ENABLE" button
4. Wait for it to enable

### Step 3: Configure OAuth 2.0 Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen** (left sidebar)
2. Select **External** as the user type
3. Click "CREATE"
4. Fill in the form:
   - **App name**: Atomic Tasker
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Click "SAVE AND CONTINUE"
6. On the "Scopes" page, click "ADD OR REMOVE SCOPES"
7. Search for "tasks" and select:
   - `https://www.googleapis.com/auth/tasks`
8. Click "UPDATE"
9. Click "SAVE AND CONTINUE"
10. Review and click "SAVE AND CONTINUE" again

### Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials** (left sidebar)
2. Click "CREATE CREDENTIALS" > "OAuth 2.0 Client ID"
3. Select "Chrome App"
4. Enter "Atomic Tasker" as the name
5. In the "Application ID" field, you'll need your extension ID:
   - First, load the extension in Chrome to get its ID
   - Or use a placeholder for now
6. Click "CREATE"
7. Copy the **Client ID** from the dialog

### Step 5: Update the Extension with Your Client ID

1. Open `/manifest.json` in your extension folder
2. Find this line:
   ```json
   "client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
   ```
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID (the long string before `.apps.googleusercontent.com`)
4. Save the file

Example:
```json
"client_id": "123456789-abc123xyz456.apps.googleusercontent.com",
```

## Installation Steps

### Step 1: Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Navigate to your AtomicTasker folder and select it
5. The extension should now appear in your extensions list
6. **Note the Extension ID** displayed (format: abcdefghijklmnopqrstuvwxyzabc)

### Step 2: Update OAuth Credentials with Extension ID

1. Go back to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Find your "Chrome App" OAuth credential
3. Click the edit icon (pencil)
4. In the "Application ID" field, enter your extension ID
5. Click "SAVE"

### Step 3: Verify manifest.json is Correct

Make sure your `manifest.json` has:
- The correct `client_id` with your Google Client ID
- The `oauth2` section with the proper scopes
- Host permissions for Google Tasks API

```json
{
  "oauth2": {
    "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
    "scopes": ["https://www.googleapis.com/auth/tasks"]
  },
  "permissions": ["storage", "identity", "identity.getAuthToken"],
  "host_permissions": [
    "https://www.googleapis.com/tasks/v1/*"
  ]
}
```

## Testing the Sync

### First Use

1. Open the AtomicTasker extension
2. Click the **"🔐 Sign In"** button in the header
3. You'll be prompted to authorize the extension
4. Review permissions and click "Allow"
5. The button should change to show your email address

### Add a Task

1. Add a new task in the extension
2. You should see **"✓ Synced"** status in the header
3. Check your [Google Tasks](https://tasks.google.com) - your task should appear there
4. Go back to the extension and add it to a category

### Sync Back

1. Go to [Google Tasks](https://tasks.google.com)
2. Mark a task as complete
3. Return to the extension and click **"↻ Sync"** button
4. Your task should update

### Offline Mode

1. Disconnect your internet
2. Add a new task in the extension
3. The task will be queued locally
4. Reconnect to the internet
5. Click **"↻ Sync"** and tasks will be sent to Google

## Features

### Real-time Sync
- Tasks automatically sync when created, completed, or deleted
- Shows sync status in the header

### Manual Sync
- Click the **"↻ Sync"** button to manually trigger sync
- Displays sync status (Syncing, Synced, Error, Offline)

### Offline Support
- Changes are queued when offline
- Automatically syncs when back online
- No data loss

### Sign In/Out
- Click email to see options
- Click **✕** to sign out
- Tokens are securely stored in Chrome storage

## Troubleshooting

### "Sign in failed" Error

**Problem**: Click Sign In but nothing happens

**Solutions**:
1. Verify the `client_id` in `manifest.json` is correct
2. Ensure the extension ID matches in Google Cloud Console
3. Check that permissions are correct in `manifest.json`
4. Try clearing Chrome cache and reloading extension

### Sync Not Working

**Problem**: Tasks aren't syncing to Google

**Solutions**:
1. Verify you're signed in (email should show in header)
2. Click **"↻ Sync"** button manually
3. Check browser console for errors (F12 > Console tab)
4. Ensure Google Tasks API is enabled in Google Cloud Console

### "Rate limit exceeded" Error

**Problem**: Seeing API rate limit errors

**Solutions**:
1. Wait 1 hour before trying again (rate limit resets)
2. Avoid creating/deleting many tasks in quick succession
3. Check your Cloud Project quotas

### Tasks Not Appearing

**Problem**: Created tasks in extension but don't appear in Google Tasks

**Solutions**:
1. Check sync status in extension header
2. Look for error messages in console (F12)
3. Try signing out and signing back in
4. Verify the task list was created in Google Tasks
5. Check if extension has proper permissions

## Advanced: How Sync Works

### Architecture

```
Extension (popup.js) 
    ↓
    google-sync.js (handles API calls)
    ↓
    Chrome Storage (local tasks)
    ↓
    Google Tasks API
```

### Sync Process

1. **Create Task**: Task is saved locally and sent to Google Tasks API
2. **Update Task**: Status/details updated both locally and on Google
3. **Delete Task**: Task removed from both locations
4. **Offline Queue**: Changes cached if no internet, synced when online

### Data Mapping

- **Task ID**: Local ID used, Google Task ID stored separately
- **Task Title**: Task text from extension
- **Status**: Complete or needs action
- **Notes**: Includes category ID and link info
- **Due Date**: Preserved from extension

## API Limits

Google Tasks API has the following quotas:
- 1,000,000 requests per day
- 10 requests per second per user

For a personal extension, you won't hit these limits.

## Privacy & Security

- Tokens stored in `chrome.storage.sync` (encrypted by Chrome)
- No data sent to external servers except Google
- API key never exposed in code
- Extension validates all responses

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Look at browser console for error messages
3. Verify all setup steps were completed
4. Check Google Cloud Console configuration

---

**Last Updated**: January 31, 2026
**Version**: 1.1.0
