# 🔧 Installation & Setup Guide

## Prerequisites
- Google Chrome browser
- Ability to load unpacked extensions

## Installation Steps

### 1. **Verify Files**
Ensure you have the following files in the project directory:
- ✅ manifest.json
- ✅ popup.html
- ✅ popup.js
- ✅ style.css
- ✅ icon-16.png, icon-48.png, icon-128.png

### 2. **Load into Chrome**

#### Option A: Development Mode
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the AtomicTasker folder
5. Extension should appear in your extensions list

#### Option B: Pin Extension
1. Click the Extensions icon in Chrome toolbar
2. Find "Atomic Tasker"
3. Click the pin icon to pin to toolbar
4. Now you can quickly access it!

### 3. **Start Using**
1. Click the Atomic Tasker icon in your toolbar
2. The popup opens with the task manager
3. Start adding tasks!

## Features Overview

### Quick Add Tasks
```
1. Type task name
2. Select category (optional)
3. Click "+ Quick Add" or press Enter
```

### Advanced Add Tasks
```
1. Click "⚙️ Advanced" button
2. Fill in all details:
   - Task name
   - Category
   - Long notes (up to 1000 chars)
   - Link URL
   - Due date
3. Click "Add Task"
```

### Manage Tasks
- ✏️ Click to edit any task
- ✅ Check box to mark complete
- 🗑️ Delete unwanted tasks

### Organize with Categories
1. Click "📂 Manage Categories"
2. Choose emoji and enter name
3. Assign to tasks for organization

## Troubleshooting

### Extension not appearing?
1. Make sure Developer mode is ON
2. Try refreshing the page
3. Reload the extension

### Data not saving?
1. Check that Chrome Storage is enabled
2. Try adding a simple task first
3. Reload the extension

### Links not working?
1. Make sure URL starts with http:// or https://
2. Invalid URLs are disabled (greyed out)

## First-Time Setup

### Recommended First Steps
1. **Create Categories**: Organize your task areas
   - Try: Work, Personal, Health, Learning
2. **Add Sample Tasks**: Test the features
   - Quick add some simple tasks
   - Use advanced add for complex ones
3. **Set Due Dates**: Practice deadline tracking
4. **Add Notes & Links**: Fill in details

## Tips for Best Results

✨ **Best Practices**:
- Use Quick Add for simple, immediate tasks
- Use Advanced Add for complex tasks needing detail
- Create meaningful category names with emojis
- Set due dates for time-sensitive items
- Keep notes brief but descriptive
- Attach links to reference materials

## Data Backup

Your tasks are stored in Chrome Storage. To backup:
1. Open Chrome DevTools (F12)
2. Go to Application > Storage > Chrome Storage
3. Export tasks object (if needed)

## Uninstallation

To remove the extension:
1. Go to `chrome://extensions/`
2. Find "Atomic Tasker"
3. Click the trash icon
4. Confirm removal

⚠️ **Note**: This will delete all stored tasks.

## Support

For issues or questions:
- Check USER_GUIDE.md for usage help
- See FEATURES.md for technical details
- Review CHANGELOG.md for version info

## Version Info

- **Current Version**: 1.1.0
- **Browser**: Chrome (Manifest V3)
- **Status**: Production Ready
- **Last Updated**: January 31, 2026

---

**Happy Task Management!** 🚀

*Remember: Small actions, big results over time.*
