# Chrome Web Store Deployment Guide

## Pre-Deployment Checklist

- [ ] Version bumped in `manifest.json`
- [ ] `CHANGELOG.md` updated with changes
- [ ] No console errors or warnings
- [ ] All features tested
- [ ] README.md is current
- [ ] PRIVACY_POLICY.md is complete
- [ ] LICENSE file included
- [ ] Icons are high quality
- [ ] Code is clean and commented

## Icons Requirements

### Sizes Needed
- 128x128 - App icon (displayed in Chrome Web Store)
- 48x48 - Task bar icon
- 16x16 - Favicon

### Format
- PNG or SVG format
- Transparent background recommended
- Must be recognizable at small sizes
- Professional appearance

### Location
All icons should be in `assets/` folder:
```
assets/
├── icon-128.png
├── icon-128.svg
├── icon-48.png
├── icon-48.svg
├── icon-16.png
└── icon-16.svg
```

## Publishing to Chrome Web Store

### Step 1: Create Developer Account
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click "Create new item"
3. Pay $5 registration fee (one-time)
4. Accept terms

### Step 2: Package Extension
```bash
# Create a ZIP file with all necessary files
zip -r atomic-tasker-v1.1.0.zip \
  popup.html \
  popup.js \
  style.css \
  setup-wizard.html \
  setup-wizard.js \
  wizard.css \
  chrome-sync.js \
  google-sync.js \
  manifest.json \
  assets/ \
  LICENSE \
  README.md
```

### Step 3: Upload to Store
1. In Developer Dashboard, click "Package"
2. Select the ZIP file you created
3. Upload the 128x128 icon
4. Add screenshots (up to 5)
5. Write compelling description

### Step 4: Store Listing

**Name**
```
Atomic Tasker
```

**Category**
```
Productivity
```

**Short Description (132 characters max)**
```
Privacy-first task manager with automatic cross-device sync. Build habits, one task at a time.
```

**Long Description**
```
Atomic Tasker helps you build consistent habits through simple task management.

✨ Features:
• Quick task creation with one click
• Smart categories with custom emojis
• Complete tasks, add notes, and set due dates
• Automatically sync across all Chrome devices
• 100% private - no accounts or tracking
• Works offline, syncs when online
• Beautiful, modern interface

Perfect for:
• Daily habits and routines
• Todo lists and task management
• Project planning and breakdown
• Shopping lists and organization

Privacy First:
• No external accounts required
• No data tracking or analytics
• No information sent to servers
• Open source and auditable

Built for people who want simple, private task management.
```

**Language**
```
English - United States
```

**Official Website**
```
https://github.com/yourusername/atomic-tasker
```

**Support Email**
```
your-email@example.com
```

### Step 5: Screenshots

Create 5 screenshots (1280x800 recommended):
1. Main task list view
2. Adding a new task
3. Categories management
4. Task details with notes
5. Completed tasks section

### Step 6: Content Rating

Answer content rating questionnaire (usually straightforward for productivity apps)

### Step 7: Review and Submit

1. Review all information
2. Ensure all content is correct
3. Submit for review
4. Google typically reviews within 24-72 hours

## After Publication

### Monitoring
- Monitor user reviews
- Fix reported bugs quickly
- Update regularly with improvements

### Updates
To submit an update:
1. Bump version in `manifest.json`
2. Update `CHANGELOG.md`
3. Package new ZIP
4. Upload to Developer Dashboard
5. Submit for review

### Feedback
- Respond to reviews professionally
- Fix issues promptly
- Communicate updates

## Version History

Track all versions in `CHANGELOG.md`:

```markdown
# Changelog

## [1.1.0] - 2026-02-01
### Added
- Chrome Sync Storage for cross-device sync
- Setup wizard for first-time users

### Fixed
- Manifest permission issues

### Changed
- Removed Google OAuth requirement

## [1.0.0] - 2026-01-01
### Added
- Initial release
```

## Troubleshooting

### Common Review Issues

**Issue**: Privacy policy missing
**Solution**: Include PRIVACY_POLICY.md link in store listing

**Issue**: Permissions not justified
**Solution**: Only request `storage` permission, clearly explain why

**Issue**: Icon too small
**Solution**: Use 128x128 PNG with clear design

**Issue**: Description misleading
**Solution**: Be honest about features and limitations

## Support

- GitHub Issues for bug reports
- Email for security concerns
- Documentation for user help

---

**Ready to launch? Good luck!** 🚀
