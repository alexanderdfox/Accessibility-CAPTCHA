# Accessibility Plugin - Integration Guide

## Overview

The accessibility features have been extracted into standalone, plug-and-play files:
- **accessibility.css** - All accessibility styles
- **accessibility.js** - Complete accessibility functionality with auto-injection

## Files Structure

```
captcha/
├── accessibility.css          # Standalone accessibility styles
├── accessibility.js           # Standalone accessibility plugin
├── index.html                # CAPTCHA demo (uses plugin)
├── guidelines.html           # Guidelines reader (uses plugin)
├── README_ACCESSIBILITY_PLUGIN.md  # Plugin documentation
└── PLUGIN_INTEGRATION.md     # This file - integration details
```

## Quick Start

To add accessibility to any webpage:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="accessibility.css">
  <!-- Your other CSS -->
</head>
<body>
  <!-- Your content -->
  
  <script src="accessibility.js"></script>
  <!-- Your other scripts -->
</body>
</html>
```

That's it! The plugin automatically:
- ✅ Injects the accessibility settings panel
- ✅ Injects SVG filters for color blindness
- ✅ Initializes all accessibility features
- ✅ Saves user preferences
- ✅ Works with any webpage structure

## What's Included

### Visual Accessibility
- High contrast mode
- Text size control (100%-200%)
- Color blindness filters (Protanopia, Deuteranopia, Tritanopia, Monochrome)
- Enhanced focus indicators

### Motion & Animation
- Reduce motion option

### Language & Reading
- Simplified language
- Reading guide (line highlight)

### Keyboard & Navigation
- Keyboard shortcuts (Alt+A to open menu, Escape to close)
- Visual tab order indicator

### Screen Reader Support
- Auto-detection of screen readers
- Optimizations for: NVDA, JAWS, VoiceOver, TalkBack, Orca, Narrator
- Announce all changes option
- Enhanced ARIA live regions

### Audio Feedback
- Audio alerts (success, error, info sounds)
- Audio toggle control

## API Reference

The plugin exposes `window.A11yPlugin` with these methods:

```javascript
// Screen reader announcements
A11yPlugin.announceToScreenReader('Message', 'polite' | 'assertive');

// Audio alerts
A11yPlugin.playSuccessSound();
A11yPlugin.playErrorSound();
A11yPlugin.playInfoSound();
A11yPlugin.toggleAudioAlerts();

// Visual settings
A11yPlugin.toggleHighContrast(true);
A11yPlugin.setTextSize(150);  // percentage
A11yPlugin.setColorScheme('protanopia');  // 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome'
```

## Storage

All settings are automatically saved using `window.safeStorage`, which:
- Tries localStorage first
- Falls back to sessionStorage
- Falls back to in-memory storage if both unavailable

## Keyboard Shortcuts

- **Alt+A** - Open accessibility menu (always available)
- **Escape** - Close accessibility menu (always available)
- **Alt+T** - Back to top (page-specific, can be added)

## Customization

### Custom Panel Position

The panel is positioned at `top: 20px; right: 20px` by default. To change:

```css
.a11y-panel {
  top: 50px;
  right: 50px;
}
```

### Custom Panel HTML

If you want to provide your own panel HTML instead of auto-injection:

1. Create the panel HTML with IDs: `a11yToggle`, `a11yMenu`
2. Include all required control IDs (see accessibility.js for list)
3. The plugin will detect and use your panel

### Extending Features

To add custom accessibility features:

```javascript
// After plugin loads
if (window.A11yPlugin) {
  // Your custom accessibility code
  // Use A11yPlugin API for consistency
}
```

## Integration Notes

### index.html
- Uses plugin for all accessibility features
- Keeps page-specific CAPTCHA code (WebAuthn, behavior scoring, text questions)
- Header audio toggle wired to plugin API

### guidelines.html
- Uses plugin for all accessibility features
- Keeps page-specific markdown parsing code
- Header audio toggle wired to plugin API

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ⚠️ IE11 (limited support, graceful degradation)

## Testing Checklist

- [ ] Accessibility panel appears on page load
- [ ] All controls work (high contrast, text size, etc.)
- [ ] Settings persist across page reloads
- [ ] Keyboard shortcuts work (Alt+A, Escape)
- [ ] Screen reader announcements work
- [ ] Audio alerts work (if enabled)
- [ ] Works in all target browsers

## Troubleshooting

### Panel doesn't appear
- Check browser console for errors
- Verify accessibility.js is loaded
- Check that body tag exists before script runs

### Settings don't persist
- Check browser storage permissions
- Verify safeStorage is working (check console)
- Settings fallback to sessionStorage/memory if localStorage unavailable

### Styles not applying
- Verify accessibility.css is loaded
- Check for CSS conflicts (inspect element)
- Verify CSS file path is correct

## Support

For issues or questions, check:
1. Browser console for errors
2. Network tab to verify files load
3. README_ACCESSIBILITY_PLUGIN.md for API details

