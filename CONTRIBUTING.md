# Contributing to Atomic Tasker

Thank you for your interest in contributing to Atomic Tasker! We welcome bug reports, feature requests, and pull requests.

## Getting Started

### Prerequisites
- Google Chrome (latest version)
- Text editor (VS Code recommended)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/atomic-tasker.git
   cd atomic-tasker
   ```

2. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the project folder

3. **Make changes** and refresh the extension

## Project Structure

```
atomic-tasker/
├── src/                    # Source files
│   ├── popup.html         # Main UI
│   ├── popup.js           # Main logic
│   ├── style.css          # Main styles
│   ├── chrome-sync.js     # Chrome Sync implementation
│   ├── setup-wizard.html  # First-time setup
│   └── setup-wizard.js    # Wizard logic
├── assets/                # Icons and images
│   └── icon-*.png/svg
├── docs/                  # Documentation
│   ├── PRIVACY_POLICY.md
│   └── USER_GUIDE.md
├── manifest.json          # Extension configuration
├── LICENSE                # MIT License
├── README.md              # Main documentation
└── CONTRIBUTING.md        # This file
```

## Code Standards

### JavaScript
- Use `const` by default, `let` if reassignment needed
- Avoid `var`
- Add JSDoc comments for functions
- Keep functions focused and small
- Use async/await for asynchronous code

### HTML/CSS
- Use semantic HTML elements
- BEM naming convention for CSS classes
- Mobile-responsive design
- Accessibility-first approach

### Comments
```javascript
/**
 * Brief description of what function does
 * @param {type} paramName - Description
 * @returns {type} Description
 */
function myFunction(paramName) {
    // Implementation
}
```

## Making Changes

### Bug Fixes
1. Create branch: `git checkout -b fix/bug-description`
2. Fix the bug
3. Test thoroughly
4. Commit: `git commit -m "Fix: description"`
5. Push and create PR

### Features
1. Open an issue first to discuss
2. Create branch: `git checkout -b feature/feature-name`
3. Implement feature
4. Test thoroughly
5. Update documentation
6. Commit: `git commit -m "Add: feature description"`
7. Push and create PR

### Documentation
1. Create branch: `git checkout -b docs/change-description`
2. Update relevant files
3. Commit: `git commit -m "Docs: description"`
4. Push and create PR

## Testing

Before submitting:
1. Test in Chrome (latest version)
2. Test on different screens/devices
3. Verify no console errors
4. Check new features work properly
5. Ensure backward compatibility

## Commit Messages

Use clear, descriptive commits:
- `Fix: Correct task sync issue` ✅
- `Add: Keyboard shortcuts feature` ✅
- `Update: Improve UI responsiveness` ✅
- `Docs: Add usage examples` ✅

Avoid:
- `Fixed stuff` ❌
- `WIP` ❌
- `Update` ❌

## Pull Request Process

1. **Before submitting:**
   - Rebase on latest `main`
   - Run tests
   - Update documentation
   - Verify no conflicts

2. **PR Description:**
   - Clear title
   - Description of changes
   - Link related issues
   - Screenshots if UI changes

3. **Review process:**
   - Address feedback
   - Keep commits clean
   - Respond to questions
   - Be respectful

## Code Review Checklist

Reviewers check for:
- [ ] Code quality and style
- [ ] Tests are adequate
- [ ] Documentation is updated
- [ ] No breaking changes
- [ ] Performance impact
- [ ] Accessibility compliance
- [ ] Browser compatibility

## Feature Request

Have a great idea? 
1. Open an issue with title: `Feature: Description`
2. Describe the feature
3. Explain the use case
4. Provide mockups if UI-related
5. Wait for feedback

## Bug Report

Found a bug?
1. Open an issue with title: `Bug: Description`
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots
6. Chrome version

## Questions?

- Check existing issues
- Read documentation
- Ask in issue comments
- Respect response times

## License

By contributing, you agree your code will be licensed under the MIT License.

---

**Happy coding!** 🚀
