# 🚀 AtomicTasker - Google Tasks Sync Integration

Welcome to the Google Tasks synchronization feature for AtomicTasker!

## ✨ What's New

Your AtomicTasker extension can now sync with your Google Tasks account:

- **🔐 Sign in with Google** - Securely connect your Google account
- **↔️ Bidirectional Sync** - Tasks sync both ways automatically
- **📱 Offline Support** - Changes queue when offline, sync when online
- **⚡ Real-time Updates** - See sync status instantly
- **🔄 Manual Refresh** - Click to sync anytime

## 🎯 Quick Start

### Minimal Setup (5 minutes)

1. **Get OAuth Credentials**
   - Visit: https://console.cloud.google.com/
   - Create project: "Atomic Tasker"
   - Enable "Google Tasks API"
   - Create OAuth 2.0 credentials (Chrome App type)
   - Copy your Client ID

2. **Update Extension**
   - Open `manifest.json`
   - Replace `YOUR_GOOGLE_CLIENT_ID` with your Client ID
   - Save

3. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked"
   - Select extension folder

4. **Complete OAuth Setup**
   - Back in Google Cloud: edit your OAuth credential
   - Set "Application ID" to your Extension ID
   - Save

5. **Sign In**
   - Click "🔐 Sign In" in extension
   - Approve permissions
   - Done! 🎉

**→ See `GOOGLE_SYNC_SETUP.md` for detailed steps**

## 🎨 New UI Features

### Header Changes
```
┌─────────────────────────────────────────┐
│  ⚛ Atomic Tasker    [🔐 Sign In]        │
│                                          │
│  ✓ Synced      [↻ Sync]                 │
└─────────────────────────────────────────┘
```

### After Sign In
```
┌─────────────────────────────────────────┐
│  ⚛ Atomic Tasker    [user@gmail.com] [✕]│
│                                          │
│  ✓ Synced      [↻ Sync]                 │
└─────────────────────────────────────────┘
```

### Sync Status Indicators
- **✓ Synced** - All tasks synchronized
- **⏳ Syncing...** - Currently syncing
- **⚠ Offline** - No internet (changes queued)
- **✕ Error** - Sync failed
- **Ready to sync** - Idle state

## 📋 What Syncs

| Item | Syncs? | Notes |
|------|--------|-------|
| Task Title | ✅ Yes | Main task text |
| Completion Status | ✅ Yes | Complete/Incomplete |
| Due Date | ✅ Yes | Task deadline |
| Notes | ✅ Yes | Includes links & category ID |
| Category | ⚠️ Partial | Stored in notes field |
| Favorites | ❌ No | Local extension only |
| Created Date | ✅ Yes | Metadata |

## 🔄 Sync Behavior

### Automatic Sync
Triggered when you:
- ✅ Add a new task
- ✅ Complete/uncomplete task
- ✅ Delete a task
- ✅ Edit task details

### Manual Sync
- Click **"↻ Sync"** button in header
- Useful after offline period
- Forces immediate sync

### Offline Support
- Changes stored locally when offline
- Automatically queued for later
- Processes when back online
- **No data loss**

### Periodic Sync
- Checks every 5 minutes (when authenticated)
- Updates from Google Tasks automatically
- Processes offline queue

## 🛡️ Security & Privacy

### What's Protected
- ✅ OAuth tokens encrypted by Chrome
- ✅ HTTPS for all API calls
- ✅ Minimal permissions requested
- ✅ No third-party access
- ✅ Data stays on your Google Account

### What You Control
- ✅ Sign out anytime
- ✅ Revoke access in Google Account
- ✅ Choose what to sync
- ✅ Delete local tasks independently

## 📂 Implementation Files

### New File
- **`google-sync.js`** (450+ lines)
  - OAuth authentication
  - API communication
  - Sync management
  - Offline queuing

### Modified Files
- **`manifest.json`** - OAuth config added
- **`popup.html`** - Auth UI & sync status
- **`popup.js`** - Sync integration
- **`style.css`** - Auth/sync styling

### Documentation
- **`GOOGLE_SYNC_SETUP.md`** - Detailed setup guide (this you need!)
- **`GOOGLE_SYNC_QUICK_GUIDE.md`** - User quick reference
- **`GOOGLE_SYNC_IMPLEMENTATION.md`** - Technical details

## 🔧 Technical Architecture

```
┌─────────────────┐
│  User Clicks    │
│  (Add/Edit)     │
└────────┬────────┘
         │
         ↓
    ┌─────────────────┐
    │   popup.js      │
    │ (Event Handler) │
    └────────┬────────┘
             │
             ↓
    ┌─────────────────┐
    │ google-sync.js  │
    │  (API Logic)    │
    └────────┬────────┘
             │
             ├─→ Chrome Storage (Local)
             │
             └─→ Google Tasks API (Cloud)
```

### Data Flow
1. **Create**: Local → Google Tasks API
2. **Update**: Local → Google Tasks API
3. **Delete**: Local → Google Tasks API
4. **Pull**: Google Tasks API → Local

## 🐛 Troubleshooting

### Sign In Doesn't Work
- Check Client ID in `manifest.json`
- Verify Extension ID in Google Cloud
- Try reloading extension
- Check browser console (F12)

### Tasks Not Syncing
- Click "↻ Sync" to try manually
- Check sync status message
- Verify you're signed in (email showing)
- Check internet connection

### Google Tasks API Issues
- Ensure API is enabled in Cloud Console
- Check OAuth consent screen is configured
- Verify permissions include tasks scope

### Offline Queue Not Processing
- Check internet connection status
- Click "↻ Sync" button manually
- Wait 5 minutes (auto-sync interval)
- Check browser console for errors

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `GOOGLE_SYNC_SETUP.md` | Complete setup instructions |
| `GOOGLE_SYNC_QUICK_GUIDE.md` | User reference guide |
| `GOOGLE_SYNC_IMPLEMENTATION.md` | Technical implementation details |
| `README.md` | Extension overview |

**→ Start with `GOOGLE_SYNC_SETUP.md` to get set up!**

## 🚀 Getting Started Checklist

- [ ] Read `GOOGLE_SYNC_SETUP.md`
- [ ] Create Google Cloud Project
- [ ] Enable Google Tasks API
- [ ] Get OAuth Client ID
- [ ] Update `manifest.json`
- [ ] Load extension in Chrome
- [ ] Note your Extension ID
- [ ] Complete OAuth setup in Cloud Console
- [ ] Sign in from extension
- [ ] Test adding a task
- [ ] Verify sync to Google Tasks

## 💡 Pro Tips

1. **Check Sync Status First**
   - Look at header status before troubleshooting
   - "Offline" = no internet (expected)
   - "✓ Synced" = all good

2. **Use Manual Sync**
   - After offline period, click "↻ Sync"
   - After network issues, click "↻ Sync"
   - Before important work, click "↻ Sync"

3. **Categories in Notes**
   - Categories stored in task notes on Google
   - They're preserved when syncing back
   - Links also saved in notes field

4. **Offline Confidence**
   - Add tasks while offline freely
   - They automatically sync when online
   - Never delete your local tasks manually

## 🤝 Feedback

This is beta implementation. If you encounter issues:
1. Check troubleshooting section
2. Review `GOOGLE_SYNC_SETUP.md` setup steps
3. Check browser console (F12) for errors
4. Verify Google Cloud configuration

## 📝 Version Information

- **Extension Version**: 1.1.0
- **API**: Google Tasks API v1
- **Implementation Date**: January 31, 2026
- **Status**: Beta (feature complete, testing recommended)

## 🎓 Learning Resources

- [Google Tasks API Docs](https://developers.google.com/tasks)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

## ⚠️ Important Notes

1. **Extension ID Required**
   - You must get your Extension ID from Chrome
   - Register it in Google Cloud OAuth settings
   - This is required for authentication to work

2. **OAuth Limitations**
   - Only you can use the extension (personal use)
   - Each person needs their own Client ID
   - To share, would need multi-user OAuth

3. **Data Independence**
   - Local tasks independent from Google
   - Google Tasks changes don't auto-pull
   - Click "↻ Sync" to pull latest

4. **Privacy**
   - Extension has no analytics
   - No data collection
   - Local processing only

---

## 🎉 You're All Set!

**Next Step**: Open `GOOGLE_SYNC_SETUP.md` and follow the setup guide!

**Questions?** Check the troubleshooting section first!

**Happy task syncing!** 🚀

---

*Last Updated: January 31, 2026*
*For support, refer to the included documentation files*
