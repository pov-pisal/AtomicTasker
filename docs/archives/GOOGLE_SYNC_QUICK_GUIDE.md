# Google Sync Quick Reference

## What Changed

Your AtomicTasker extension now has Google Tasks synchronization!

## New Features

### 1. **Sign In with Google** (Header)
- Click blue **"🔐 Sign In"** button
- Authorizes extension to access your Google Tasks
- Shows your email when logged in

### 2. **Automatic Sync** 
- Tasks sync automatically when you:
  - ✅ Create a new task
  - ✅ Mark task as complete
  - ✅ Delete a task
  - ✅ Edit task details

### 3. **Sync Status** (Header)
- Shows current sync status:
  - **✓ Synced** - All synced
  - **⏳ Syncing...** - Currently syncing
  - **⚠ Offline** - No internet connection
  - **✕ Error** - Sync failed

### 4. **Manual Sync Button**
- Click **"↻ Sync"** in header anytime
- Forces immediate sync with Google Tasks

### 5. **Offline Support**
- Tasks are saved locally when offline
- Automatically syncs when online
- Never loses data

### 6. **Sign Out**
- Click your email to reveal options
- Click **✕** to sign out

## Getting Started

### 1. Get Your Google Client ID

1. Go to https://console.cloud.google.com/
2. Create a new project: "Atomic Tasker"
3. Enable Google Tasks API
4. Create OAuth 2.0 credentials (Chrome App)
5. Copy the **Client ID**

### 2. Update Extension

1. Open `manifest.json`
2. Find: `"client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"`
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID
4. Save file

### 3. Load in Chrome

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the extension folder
5. Note your Extension ID

### 4. Complete OAuth Setup

1. Go back to Google Cloud Console
2. Edit your OAuth credential
3. Set "Application ID" to your Extension ID
4. Save

### 5. Start Using!

1. Open extension
2. Click **"🔐 Sign In"**
3. Approve permissions
4. Start adding tasks!

## File Changes

| File | Changes |
|------|---------|
| `manifest.json` | Added OAuth config |
| `popup.html` | Added auth UI + sync status |
| `popup.js` | Added sync integration |
| `style.css` | Added auth + sync styling |
| `google-sync.js` | NEW - All sync logic |

## Common Issues

| Problem | Solution |
|---------|----------|
| Sign In not working | Verify Client ID in manifest.json |
| Tasks not syncing | Click "↻ Sync" button, check status |
| No Google Tasks API | Enable it in Google Cloud Console |
| Extension not loading | Reload at chrome://extensions/ |

## How to Check Sync

1. **Add task in extension**
   - Status should show "✓ Synced"
   - Task appears in Google Tasks

2. **Go to Google Tasks** (tasks.google.com)
   - Your tasks are there!
   - Mark one complete

3. **Come back to extension**
   - Task shows as completed
   - Latest status shown

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Quick add task | Enter ↵ |
| Sign in | Click "🔐 Sign In" |
| Manual sync | Click "↻ Sync" |
| Sign out | Click email, then "✕" |

## Data Sync Details

### What Syncs
- ✅ Task name/title
- ✅ Completion status
- ✅ Due dates
- ✅ Notes (includes links & category)
- ✅ Creation date

### What Doesn't Sync (by Google's design)
- ❌ Categories (stored in notes instead)
- ❌ Favorites (local only)
- ❌ Tasks deleted in Google (one-way only)

## Privacy

- Only syncs with Google Tasks (secure)
- OAuth token encrypted by Chrome
- No data sent to other services
- You can sign out anytime
- Data remains on your Google Account

## Need Help?

See detailed guide: `GOOGLE_SYNC_SETUP.md`

## Version Info

- **Extension**: 1.1.0
- **API**: Google Tasks API v1
- **Date**: January 31, 2026

---

**Enjoy synchronized task management! 🚀**
