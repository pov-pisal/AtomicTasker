# 🎯 AtomicTasker v1.1.0 - Quick Reference

## What's New ✨

### 📝 Long Notes
Add up to 1000 characters of detailed notes to each task
- Preview shown on task list (first 50 chars)
- Full editor in advanced add and edit modals

### 🔗 Link Attachment  
Attach URLs to tasks for quick reference
- Click to open links in new tab
- Auto-validation for HTTP/HTTPS URLs

### 📅 Due Dates
Set and track task deadlines
- Visual overdue detection (red highlighting)
- Automatic calculation of overdue status
- Clears when task is completed

---

## How to Use

### Quick Add (Fast) ⚡
```
1. Type task name
2. Pick category (optional)
3. Click "+ Quick Add" or press Enter
```

### Advanced Add (Full Details) ⚙️
```
1. Click "⚙️ Advanced" button
2. Fill in all details:
   - Task name ✓
   - Category (optional)
   - Notes (up to 1000 chars)
   - Link (any URL)
   - Due date (date picker)
3. Click "Add Task"
```

### Edit Task ✏️
```
Click ✏️ button on any task → Edit all fields → Save
```

### Complete Task ✅
```
Click checkbox to mark complete/incomplete
```

### Delete Task 🗑️
```
Click 🗑️ button → Confirm deletion
```

---

## Task Display

Each task shows:
- ✅ Checkbox for completion
- 📝 Task title and category
- 🔗 Link (if attached)
- 📅 Due date (RED if overdue)
- 📝 Notes preview
- ✏️ Edit and 🗑️ Delete buttons

---

## Key Features

| Feature | Quick Add | Advanced |
|---------|-----------|----------|
| Task Name | ✅ | ✅ |
| Category | ✅ | ✅ |
| Notes | ❌ | ✅ |
| Link | ❌ | ✅ |
| Due Date | ❌ | ✅ |

---

## Keyboard Shortcuts

- **Enter** (quick add field) → Add task
- **Enter** (edit modal) → Save changes
- **Click ✏️** → Edit task
- **Click 🗑️** → Delete task
- **Click checkbox** → Complete/uncomplete

---

## Pro Tips 💡

1. **Prioritize**: Set due dates to organize workload
2. **Document**: Use notes for instructions/context
3. **Reference**: Attach links to resources
4. **Organize**: Create categories for different areas
5. **Quick Tasks**: Use Quick Add for speed
6. **Complex Tasks**: Use Advanced for detailed setup

---

## Files Modified

- ✅ `popup.html` - Added modals and form fields
- ✅ `popup.js` - Added 4 new functions + enhancements
- ✅ `style.css` - Added 12 new CSS classes + styling
- ✅ `manifest.json` - No changes needed

---

## Data Persistence

✅ All tasks auto-save to Chrome Storage
✅ Backward compatible with old tasks
✅ No data loss or migration needed
✅ Works offline

---

## Troubleshooting

**Links not opening?**
- Ensure URL includes http:// or https://
- Invalid URLs are disabled (greyed out)

**Due dates not showing as overdue?**
- Check if task is already marked complete
- Overdue only shows for incomplete tasks

**Notes not saving?**
- Click "Save Changes" in edit modal
- Check browser storage is enabled

---

## Version Info

- **Version**: 1.1.0
- **Release Date**: January 31, 2026
- **Status**: ✅ Production Ready
- **Browser**: Chrome Extension (Manifest V3)

---

## Support

📚 Full documentation: See `FEATURES.md` and `USER_GUIDE.md`
💬 Questions? Check `CHANGELOG.md` for technical details

---

**Happy Task Management! 🚀**

*"Small actions, big results over time."*
