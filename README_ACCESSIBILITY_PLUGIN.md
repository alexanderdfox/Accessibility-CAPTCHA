# Accessibility Plugin - Plug and Play

## Overview

This accessibility plugin provides comprehensive accessibility features that can be easily added to any webpage. It's extracted from the CAPTCHA demo and guidelines pages into standalone, reusable files.

## Files

- **accessibility.css** - All accessibility-related CSS styles
- **accessibility.js** - Complete accessibility JavaScript with auto-injection of panel
- **index.html** - CAPTCHA demo page (uses the plugin)
- **guidelines.html** - Guidelines reader page (uses the plugin)

## Quick Start

To add accessibility features to any webpage, simply include these two lines in your HTML:

```html
<link rel="stylesheet" href="accessibility.css">
<script src="accessibility.js"></script>
```

That's it! The plugin will:
- Auto-inject the accessibility settings panel
- Auto-inject SVG filters for color blindness
- Initialize all accessibility features
- Work with any webpage structure

## Features Included

### Visual Settings
- High contrast mode
- Text size control (100%-200%)
- Color schemes (Protanopia, Deuteranopia, Tritanopia, Monochrome)
- Enhanced focus indicators

### Motion & Animation
- Reduce motion

### Language & Reading
- Simplified language
- Reading guide (line highlight)

### Keyboard & Navigation
- Keyboard shortcuts (Alt+A to open menu, Escape to close)
- Visual tab order indicator

### Screen Reader
- Auto-detection of screen readers
- Optimizations for NVDA, JAWS, VoiceOver, TalkBack, Orca, Narrator
- Announce all changes
- Enhanced ARIA live regions

### Audio
- Audio alerts for events
- Success, error, and info sounds
- Audio toggle control

## API

The plugin exposes a global `window.A11yPlugin` object with useful functions:

```javascript
// Announce to screen readers
A11yPlugin.announceToScreenReader('Message');

// Play sounds
A11yPlugin.playSuccessSound();
A11yPlugin.playErrorSound();
A11yPlugin.playInfoSound();

// Control features programmatically
A11yPlugin.toggleHighContrast(true);
A11yPlugin.setTextSize(150);
A11yPlugin.setColorScheme('protanopia');
A11yPlugin.toggleAudioAlerts();
```

## Settings Persistence

All accessibility settings are automatically saved using `safeStorage`, which falls back gracefully if localStorage is unavailable.

## Browser Compatibility

The plugin includes:
- Cross-browser compatibility layer
- Safe storage wrapper (localStorage → sessionStorage → memory)
- Feature detection
- Graceful degradation

## Customization

The accessibility panel is automatically injected. If you want to customize the panel HTML, you can:
1. Modify the `injectAccessibilityPanel()` function in accessibility.js
2. Or provide your own panel HTML and the plugin will detect it

## Integration with Existing Code

The plugin is designed to work alongside existing code. It:
- Uses a namespace (`A11yPlugin`) to avoid conflicts
- Checks for existing elements before injecting
- Can be initialized multiple times safely

## License

Free to use and modify for accessibility purposes.

