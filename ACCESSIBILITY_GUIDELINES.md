# Accessibility Implementation Guidelines

## Overview

This document provides comprehensive guidelines for implementing accessibility features in web applications, based on WCAG 2.1 Level AA standards and best practices for inclusive design.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Visual Accessibility](#visual-accessibility)
3. [Motor Accessibility](#motor-accessibility)
4. [Cognitive Accessibility](#cognitive-accessibility)
5. [Screen Reader Support](#screen-reader-support)
6. [Keyboard Navigation](#keyboard-navigation)
7. [Audio Feedback](#audio-feedback)
8. [Browser Compatibility](#browser-compatibility)
9. [Implementation Checklist](#implementation-checklist)
10. [Testing Guidelines](#testing-guidelines)

---

## Core Principles

### POUR Framework

- **Perceivable**: Information must be presentable to users in ways they can perceive
- **Operable**: Interface components must be operable by all users
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough for assistive technologies

### Standards Compliance

- Target WCAG 2.1 Level AA compliance
- Support Section 508 requirements (for US)
- Follow EN 301 549 standards (for EU)
- Ensure compliance with local accessibility laws

---

## Visual Accessibility

### 1. High Contrast Mode

**Purpose**: Enable users with low vision to see content clearly.

**Implementation**:

```css
/* High contrast mode styles */
body.high-contrast {
  background: #000 !important;
  color: #fff !important;
}

body.high-contrast .card {
  background: #000 !important;
  border: 3px solid #fff !important;
  color: #fff !important;
}

/* Ensure all text elements are visible */
body.high-contrast h1,
body.high-contrast h2,
body.high-contrast p,
body.high-contrast label {
  color: #fff !important;
}

/* Form elements */
body.high-contrast input,
body.high-contrast select,
body.high-contrast textarea {
  border: 3px solid #fff !important;
  background: #000 !important;
  color: #fff !important;
}

/* Keep meaning with colored messages */
body.high-contrast .success {
  background: #000 !important;
  border: 3px solid #0f0 !important;
  color: #0f0 !important;
}

body.high-contrast .danger {
  background: #000 !important;
  border: 3px solid #f00 !important;
  color: #f00 !important;
}
```

**JavaScript Toggle**:

```javascript
function toggleHighContrast(enabled) {
  if (enabled) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
  // Save preference
  localStorage.setItem('highContrast', enabled);
}
```

### 2. Text Size Controls

**Purpose**: Allow users to increase text size for better readability.

**Implementation**:

```javascript
function setTextSize(size) {
  document.body.style.fontSize = size + '%';
  localStorage.setItem('textSize', size);
}

// Provide slider in UI (100% to 200%)
<input type="range" id="textSize" min="100" max="200" value="100" step="25">
```

**CSS Classes**:

```css
.large-text { font-size: 125%; }
.extra-large-text { font-size: 150%; }
.huge-text { font-size: 200%; }
```

### 3. Color Blindness Support

**Purpose**: Ensure information isn't conveyed by color alone.

**Implementation**:

```css
/* Color blindness filters */
.color-protanopia { filter: url(#protanopia); }
.color-deuteranopia { filter: url(#deuteranopia); }
.color-tritanopia { filter: url(#tritanopia); }
.color-monochrome { filter: grayscale(100%); }

/* Always use icons/text with color indicators */
.status-indicator::before {
  content: "●";
  margin-right: 8px;
}
```

**SVG Filters**:

```html
<svg style="position:absolute;width:0;height:0">
  <defs>
    <filter id="protanopia" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" 
        values="0.567, 0.433, 0, 0, 0  
                0.558, 0.442, 0, 0, 0  
                0, 0.242, 0.758, 0, 0  
                0, 0, 0, 1, 0"/>
    </filter>
    <!-- Add other filters -->
  </defs>
</svg>
```

### 4. Enhanced Focus Indicators

**Purpose**: Make keyboard focus clearly visible.

**Implementation**:

```css
/* Enhanced focus indicators */
.enhanced-focus *:focus-visible {
  outline-width: 4px !important;
  outline-offset: 4px !important;
  outline-color: #2563eb;
}

/* Fallback for older browsers */
*:focus {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

---

## Motor Accessibility

### 1. Keyboard Navigation

**Purpose**: Enable full functionality without mouse.

**Implementation**:

```javascript
// Tab navigation with proper order
function setupKeyboardNavigation() {
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  // Ensure logical tab order
  focusableElements.forEach((el, index) => {
    el.setAttribute('tabindex', index + 1);
  });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Alt + A: Open accessibility menu
  if (e.altKey && e.key === 'a') {
    e.preventDefault();
    openAccessibilityMenu();
  }
  
  // Alt + S: Submit form
  if (e.altKey && e.key === 's') {
    e.preventDefault();
    submitForm();
  }
  
  // Escape: Close modals
  if (e.key === 'Escape') {
    closeModal();
  }
});
```

### 2. Roving Tabindex Pattern

**Purpose**: Enable arrow key navigation in component groups.

**Implementation**:

```javascript
// Radio button group with arrow keys
const radioGroup = document.querySelectorAll('[role="radiogroup"] button');

radioGroup.forEach((btn, index) => {
  btn.setAttribute('tabindex', index === 0 ? '0' : '-1');
  
  btn.addEventListener('keydown', (e) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (!keys.includes(e.key)) return;
    
    e.preventDefault();
    const currentIndex = Array.from(radioGroup).indexOf(btn);
    let nextIndex;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % radioGroup.length;
    } else {
      nextIndex = (currentIndex - 1 + radioGroup.length) % radioGroup.length;
    }
    
    radioGroup[currentIndex].setAttribute('tabindex', '-1');
    radioGroup[nextIndex].setAttribute('tabindex', '0');
    radioGroup[nextIndex].focus();
    radioGroup[nextIndex].click();
  });
});
```

### 3. Large Touch Targets

**Purpose**: Make interactive elements easy to activate.

**Implementation**:

```css
/* Minimum 44x44px touch targets */
button, a, input, select {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

### 4. Switch Control Support

**Purpose**: Enable single-button navigation.

**Implementation**:

```javascript
// Support for switch control scanning
let scanIndex = 0;
const scanElements = [];

function setupSwitchControl() {
  scanElements.push(...document.querySelectorAll('[tabindex="0"]'));
  
  document.addEventListener('keydown', (e) => {
    // Space or Enter acts as "select"
    if (e.key === ' ' || e.key === 'Enter') {
      if (document.activeElement) {
        document.activeElement.click();
      }
    }
    
    // Tab cycles through elements (switch control)
    if (e.key === 'Tab') {
      e.preventDefault();
      scanIndex = (scanIndex + 1) % scanElements.length;
      scanElements[scanIndex].focus();
    }
  });
}
```

---

## Cognitive Accessibility

### 1. Simplified Language Option

**Purpose**: Make content easier to understand.

**Implementation**:

```javascript
const simpleLanguageMap = {
  'Submit': 'Send',
  'Cancel': 'Stop',
  'Continue': 'Next',
  'Error occurred': 'Something went wrong'
};

function toggleSimpleLanguage(enabled) {
  if (enabled) {
    document.querySelectorAll('*').forEach(el => {
      const text = el.textContent.trim();
      if (simpleLanguageMap[text]) {
        el.setAttribute('data-original-text', text);
        el.textContent = simpleLanguageMap[text];
      }
    });
  } else {
    document.querySelectorAll('[data-original-text]').forEach(el => {
      el.textContent = el.getAttribute('data-original-text');
      el.removeAttribute('data-original-text');
    });
  }
}
```

### 2. Reading Guide

**Purpose**: Help users track reading position.

**Implementation**:

```javascript
let readingGuideEl = null;

function toggleReadingGuide(enabled) {
  if (enabled) {
    readingGuideEl = document.createElement('div');
    readingGuideEl.className = 'reading-guide';
    readingGuideEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(readingGuideEl);
    
    document.addEventListener('mousemove', updateReadingGuide);
  } else {
    if (readingGuideEl) {
      readingGuideEl.remove();
    }
    document.removeEventListener('mousemove', updateReadingGuide);
  }
}

function updateReadingGuide(e) {
  readingGuideEl.style.top = (e.clientY - 15) + 'px';
  readingGuideEl.style.width = '100%';
  readingGuideEl.style.height = '30px';
}
```

**CSS**:

```css
.reading-guide {
  position: absolute;
  background: rgba(255, 255, 0, 0.3);
  pointer-events: none;
  z-index: 9999;
}
```

### 3. Reduced Motion

**Purpose**: Respect user motion preferences.

**Implementation**:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.reduce-motion * {
  animation: none !important;
  transition: none !important;
}
```

### 4. Clear Instructions

**Purpose**: Provide step-by-step guidance.

**Implementation**:

```html
<div role="region" aria-labelledby="instructions">
  <h2 id="instructions">Instructions</h2>
  <ol>
    <li>Select your verification method</li>
    <li>Click the "Start" button</li>
    <li>Follow the on-screen prompts</li>
  </ol>
</div>
```

---

## Screen Reader Support

### 1. Semantic HTML

**Purpose**: Provide meaning to assistive technologies.

**Implementation**:

```html
<!-- Use proper HTML5 elements -->
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation items -->
  </nav>
</header>

<main role="main" aria-labelledby="page-title">
  <h1 id="page-title">Page Title</h1>
  <!-- Main content -->
</main>

<aside role="complementary" aria-label="Additional information">
  <!-- Sidebar content -->
</aside>

<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

### 2. ARIA Labels and Descriptions

**Purpose**: Provide context for screen readers.

**Implementation**:

```html
<!-- Buttons with descriptions -->
<button 
  id="submitBtn"
  aria-label="Submit form"
  aria-describedby="submit-description">
  Submit
</button>
<span id="submit-description" class="sr-only">
  Submits your form and processes your request
</span>

<!-- Form fields -->
<label for="email">Email Address</label>
<input 
  type="email"
  id="email"
  aria-required="true"
  aria-invalid="false"
  aria-describedby="email-error email-hint">
<span id="email-hint" class="sr-only">
  Enter your email address to receive notifications
</span>
<span id="email-error" role="alert" aria-live="polite"></span>
```

### 3. Live Regions

**Purpose**: Announce dynamic content changes.

**Implementation**:

```html
<!-- Status updates -->
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  id="status">
  Ready
</div>

<!-- Important alerts -->
<div 
  role="alert" 
  aria-live="assertive" 
  aria-atomic="true"
  id="alert">
  <!-- Critical alerts -->
</div>
```

**JavaScript**:

```javascript
function announceToScreenReader(message, priority = 'polite') {
  const liveRegion = document.getElementById(priority === 'assertive' ? 'alert' : 'status');
  liveRegion.textContent = message;
  
  // Clear after announcement
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 1000);
}
```

### 4. Screen Reader Optimizations

**Purpose**: Optimize for specific screen readers.

**Implementation**:

```javascript
function detectScreenReader() {
  const ua = navigator.userAgent.toLowerCase();
  
  // Check for screen reader indicators
  if (window.speechSynthesis) {
    if (ua.includes('mac') || ua.includes('iphone')) {
      return 'voiceover';
    }
    if (ua.includes('win')) {
      return 'narrator';
    }
  }
  
  // Default based on OS
  if (ua.includes('win')) return 'nvda';
  if (ua.includes('mac')) return 'voiceover';
  if (ua.includes('android')) return 'talkback';
  
  return 'auto';
}

function applyScreenReaderOptimizations() {
  const srMode = detectScreenReader();
  document.body.classList.add(`sr-optimize-${srMode}`);
  
  // NVDA/JAWS specific
  if (srMode === 'nvda' || srMode === 'jaws') {
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.getAttribute('aria-label')) {
        btn.setAttribute('aria-label', btn.textContent || 'Button');
      }
    });
  }
}
```

### 5. Screen Reader Only Content

**Purpose**: Provide additional context not visible on screen.

**Implementation**:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<button>
  <span class="sr-only">Open menu, currently closed</span>
  <span aria-hidden="true">☰</span>
</button>
```

---

## Keyboard Navigation

### 1. Skip Links

**Purpose**: Allow keyboard users to skip repetitive content.

**Implementation**:

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #2563eb;
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 8px;
}
```

### 2. Focus Management

**Purpose**: Ensure logical focus flow.

**Implementation**:

```javascript
function openModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('hidden');
  
  // Trap focus within modal
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusableElements[0].focus();
  
  // Save previous focus
  modal.setAttribute('data-previous-focus', document.activeElement.id);
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
  
  // Return focus
  const previousFocusId = modal.getAttribute('data-previous-focus');
  if (previousFocusId) {
    document.getElementById(previousFocusId).focus();
  }
}
```

### 3. Keyboard Shortcuts

**Purpose**: Provide efficient navigation.

**Implementation**:

```javascript
// Document keyboard shortcuts clearly
const shortcuts = {
  'Alt+A': 'Open accessibility menu',
  'Alt+S': 'Start verification',
  'Escape': 'Close modal/menu',
  'Tab': 'Navigate forward',
  'Shift+Tab': 'Navigate backward'
};

// Display shortcuts help
function showKeyboardShortcuts() {
  const helpText = Object.entries(shortcuts)
    .map(([key, action]) => `${key}: ${action}`)
    .join('\n');
  alert(helpText);
}
```

---

## Audio Feedback

### 1. Audio Alerts

**Purpose**: Provide audio cues for visual events.

**Implementation**:

```javascript
let audioContext = null;
let audioEnabled = true;

function initAudioContext() {
  if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
  }
}

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  if (!audioEnabled || !audioContext) return;
  
  try {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.01);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

function playSuccessSound() {
  playTone(523.25, 0.15, 'sine', 0.25); // C5
  setTimeout(() => playTone(659.25, 0.15, 'sine', 0.25), 150); // E5
  setTimeout(() => playTone(783.99, 0.2, 'sine', 0.25), 300); // G5
}

function playErrorSound() {
  playTone(440, 0.1, 'square', 0.3); // A4
  setTimeout(() => playTone(349.23, 0.15, 'square', 0.3), 100); // F4
  setTimeout(() => playTone(261.63, 0.2, 'square', 0.3), 250); // C4
}
```

### 2. Audio Toggle

**Purpose**: Allow users to control audio feedback.

**Implementation**:

```html
<label>
  <input type="checkbox" id="audioToggle" checked>
  Enable audio alerts
</label>
```

```javascript
function toggleAudioAlerts(enabled) {
  audioEnabled = enabled;
  localStorage.setItem('audioEnabled', enabled);
  
  if (enabled) {
    playInfoSound(); // Test sound
    announceToScreenReader('Audio alerts enabled');
  } else {
    announceToScreenReader('Audio alerts disabled');
  }
}
```

---

## Browser Compatibility

### 1. Feature Detection

**Purpose**: Ensure features work across browsers.

**Implementation**:

```javascript
const browserInfo = {
  supportsWebAuthn: !!(window.PublicKeyCredential && navigator.credentials),
  supportsAudioContext: !!(window.AudioContext || window.webkitAudioContext),
  supportsLocalStorage: (function() {
    try {
      localStorage.setItem('__test__', '1');
      localStorage.removeItem('__test__');
      return true;
    } catch (e) {
      return false;
    }
  })()
};
```

### 2. Polyfills

**Purpose**: Support older browsers.

**Implementation**:

```javascript
// Array.from polyfill
if (!Array.from) {
  Array.from = function(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
  };
}

// Object.assign polyfill
if (typeof Object.assign !== 'function') {
  Object.assign = function(target) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    const to = Object(target);
    for (let index = 1; index < arguments.length; index++) {
      const nextSource = arguments[index];
      if (nextSource != null) {
        for (const nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}
```

### 3. Safe Storage

**Purpose**: Handle storage limitations gracefully.

**Implementation**:

```javascript
const safeStorage = {
  setItem: function(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      try {
        sessionStorage.setItem(key, value);
      } catch (e2) {
        window._memoryStorage = window._memoryStorage || {};
        window._memoryStorage[key] = value;
      }
    }
  },
  getItem: function(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      try {
        return sessionStorage.getItem(key);
      } catch (e2) {
        return window._memoryStorage && window._memoryStorage[key] || null;
      }
    }
  }
};
```

---

## Implementation Checklist

### Visual Accessibility
- [ ] High contrast mode toggle
- [ ] Text size controls (100%-200%)
- [ ] Color blindness filters
- [ ] Enhanced focus indicators
- [ ] Sufficient color contrast (4.5:1 for text, 3:1 for UI)
- [ ] No information conveyed by color alone

### Motor Accessibility
- [ ] Full keyboard navigation
- [ ] Keyboard shortcuts (Alt+A, Alt+S, Escape)
- [ ] Large touch targets (44x44px minimum)
- [ ] No time limits or ability to extend
- [ ] No required timed responses
- [ ] Switch control compatible

### Cognitive Accessibility
- [ ] Simplified language option
- [ ] Reading guide
- [ ] Clear instructions
- [ ] Error prevention
- [ ] Help text available
- [ ] Reduced motion option

### Screen Reader Support
- [ ] Semantic HTML structure
- [ ] ARIA labels and descriptions
- [ ] Live regions for dynamic content
- [ ] Screen reader optimizations
- [ ] Skip links
- [ ] Proper heading hierarchy
- [ ] Form field associations

### Audio & Feedback
- [ ] Audio alerts for events
- [ ] Audio toggle control
- [ ] Text alternatives for audio
- [ ] Visual feedback for audio events

### Browser Compatibility
- [ ] Feature detection
- [ ] Polyfills for older browsers
- [ ] Safe storage fallbacks
- [ ] Graceful degradation
- [ ] Cross-browser testing

---

## Testing Guidelines

### Automated Testing

1. **Lighthouse Accessibility Audit**
   ```bash
   lighthouse https://your-site.com --view --only-categories=accessibility
   ```

2. **axe DevTools**
   - Browser extension for Chrome/Firefox
   - Identifies accessibility violations

3. **WAVE Browser Extension**
   - Visual accessibility evaluation
   - Identifies errors and warnings

### Manual Testing

1. **Keyboard Navigation**
   - Tab through entire page
   - Verify logical focus order
   - Test all interactive elements
   - Verify skip links work

2. **Screen Reader Testing**
   - **NVDA** (Windows, free)
   - **JAWS** (Windows, paid)
   - **VoiceOver** (macOS/iOS, built-in)
   - **TalkBack** (Android, built-in)
   - Verify all content is announced
   - Check form labels and instructions
   - Test dynamic content announcements

3. **Visual Testing**
   - Test high contrast mode
   - Test text size increases
   - Test color blindness filters
   - Verify focus indicators visible
   - Check on different screen sizes

4. **Browser Testing**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)
   - Test with assistive technologies

### User Testing

1. **Include users with disabilities**
   - Visual impairments
   - Motor impairments
   - Cognitive disabilities
   - Hearing impairments

2. **Test scenarios**
   - Complete common tasks
   - Navigate entire application
   - Use with assistive technologies
   - Provide feedback on usability

---

## Resources

### Standards & Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Section 508 Standards](https://www.section508.gov/)
- [EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers
- [NVDA](https://www.nvaccess.org/)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver](https://www.apple.com/accessibility/vision/)
- [TalkBack](https://support.google.com/accessibility/android/answer/6283677)

### Documentation
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)

---

## Conclusion

Accessibility is not a feature—it's a fundamental requirement. By implementing these guidelines, you create an inclusive web experience that works for everyone. Remember:

1. **Start early**: Build accessibility in from the beginning
2. **Test continuously**: Don't wait until the end
3. **Involve users**: Get feedback from people with disabilities
4. **Iterate**: Accessibility is an ongoing process

For questions or improvements to this guide, please refer to the latest WCAG standards and accessibility best practices.

