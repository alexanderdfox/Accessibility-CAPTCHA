# Accessibility CAPTCHA

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/alexanderdfox/Accessibility-CAPTCHA)

A comprehensive accessibility-focused CAPTCHA demonstration with a plug-and-play accessibility plugin that can be integrated into any webpage.

## Overview

This project demonstrates accessible CAPTCHA verification methods and provides a complete, standalone accessibility plugin. The CAPTCHA demo includes multiple verification modes (behavioral scoring, WebAuthn/passkey, and screen-reader-friendly text questions), while the accessibility plugin offers comprehensive features for users with various disabilities.

## Features

### Accessible CAPTCHA Demo

- **Multiple Verification Modes:**
  - Invisible behavioral scoring
  - WebAuthn/Passkey authentication
  - Screen-reader-friendly text questions
  - Keyboard-only mode

- **Accessibility Features:**
  - Full keyboard navigation
  - Screen reader support (NVDA, JAWS, VoiceOver, TalkBack, Orca, Narrator)
  - Audio alerts for events
  - ARIA labels and live regions
  - High contrast mode support

### Accessibility Plugin

A standalone, plug-and-play accessibility plugin that can be added to any webpage:

- **Visual Settings:**
  - High contrast mode
  - Text size control (100%-200%)
  - Color blindness filters (Protanopia, Deuteranopia, Tritanopia, Monochrome)
  - Enhanced focus indicators

- **Motion & Animation:**
  - Reduce motion option

- **Language & Reading:**
  - Simplified language mode
  - Reading guide (line highlight)

- **Keyboard & Navigation:**
  - Keyboard shortcuts (Alt+A, Escape)
  - Visual tab order indicator

- **Screen Reader Support:**
  - Auto-detection of screen readers
  - Optimizations for major screen readers
  - Enhanced ARIA live regions
  - Announce all changes option

- **Audio Feedback:**
  - Audio alerts for events
  - Success, error, and info sounds
  - Audio toggle control

## Quick Start

### Using the Accessibility Plugin

To add accessibility features to any webpage, simply include these two files:

```html
<!DOCTYPE html>
<html lang="en">
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

That's it! The plugin will automatically:
- ✅ Inject the accessibility settings panel
- ✅ Inject SVG filters for color blindness
- ✅ Initialize all accessibility features
- ✅ Save user preferences
- ✅ Work with any webpage structure

### Running the Demo

1. Clone the repository:
   ```bash
   git clone https://github.com/alexanderdfox/Accessibility-CAPTCHA.git
   cd Accessibility-CAPTCHA
   ```

2. Open `index.html` in a web browser (or use a local server):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

## Project Structure

```
Accessibility-CAPTCHA/
├── index.html                    # Home page hub with navigation grid
├── captcha.html                  # CAPTCHA demo page
├── guidelines.html               # Accessibility guidelines viewer
├── viewer.html                   # Generic markdown viewer (works with any .md file)
├── accessibility.css             # Standalone accessibility styles
├── accessibility.js              # Standalone accessibility plugin
├── README.md                     # This file
├── LICENSE                       # GPL-3.0 license
│
├── Documentation/
│   ├── ACCESSIBILITY_GUIDELINES.md      # Comprehensive accessibility guide
│   ├── README_ACCESSIBILITY_PLUGIN.md   # Plugin quick start guide
│   ├── PLUGIN_INTEGRATION.md            # Plugin integration details
│   └── REFACTORING_SUMMARY.md           # Technical refactoring notes
│
└── .github/
    └── workflows/                # GitHub Actions workflows
```

## Pages

- **Home** (`index.html`) - Central hub with links to all pages and download buttons
- **CAPTCHA Demo** (`captcha.html`) - Interactive CAPTCHA verification demonstration
- **Accessibility Guidelines** (`guidelines.html`) - Comprehensive accessibility implementation guide
- **Generic Viewer** (`viewer.html?file=FILENAME.md`) - View any markdown file with full accessibility features

## Documentation

- **[Accessibility Guidelines](ACCESSIBILITY_GUIDELINES.md)** - Complete guide for implementing accessibility features
- **[Plugin README](README_ACCESSIBILITY_PLUGIN.md)** - Quick start guide for the accessibility plugin
- **[Plugin Integration Guide](PLUGIN_INTEGRATION.md)** - Detailed integration instructions and API reference
- **[Refactoring Summary](REFACTORING_SUMMARY.md)** - Technical notes on the plugin architecture

## Plugin API

The accessibility plugin exposes a global `window.A11yPlugin` object:

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

## Keyboard Shortcuts

- **Alt+A** - Open accessibility menu (always available)
- **Escape** - Close accessibility menu (always available)
- **Alt+T** - Back to top (on viewer pages)

## Browser Compatibility

✅ **Supported:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

⚠️ **Limited Support:**
- IE11 (graceful degradation)

The plugin includes:
- Cross-browser compatibility layer
- Safe storage wrapper (localStorage → sessionStorage → memory)
- Feature detection
- Graceful degradation for unsupported features

## Download

Download the standalone plugin files:

- **[accessibility.css](accessibility.css)** - All accessibility styles
- **[accessibility.js](accessibility.js)** - Complete accessibility functionality

Or visit the [home page](index.html) for direct download buttons.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project demonstrates best practices for:
- Web accessibility (WCAG compliance)
- Accessible CAPTCHA implementation
- Screen reader optimization
- Keyboard navigation
- Inclusive design principles

## Support

For questions, issues, or contributions, please visit:
- [GitHub Repository](https://github.com/alexanderdfox/Accessibility-CAPTCHA)
- [Issues](https://github.com/alexanderdfox/Accessibility-CAPTCHA/issues)

## Related Projects

- [WebAuthn/Passkeys](https://webauthn.guide/) - Modern authentication standards
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Web Content Accessibility Guidelines
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - Accessible Rich Internet Applications

---

**Making the web accessible for everyone** 🌐♿

