/* ============================================
   Comprehensive Accessibility Plugin - JavaScript
   Plug-and-play accessibility features for any webpage
   
   Usage: Simply include this file and accessibility.css in your HTML:
   <link rel="stylesheet" href="accessibility.css">
   <script src="accessibility.js"></script>
   ============================================ */

(function() {
  'use strict';
  
  // Prevent multiple initializations
  if (window.A11yPlugin && window.A11yPlugin.initialized) {
    return;
  }
  
  /* ---------- Browser Compatibility Layer ---------- */
  
  // Safe localStorage wrapper with fallback
  const safeStorage = {
    setItem: function(key, value) {
      try {
        if (localStorage) {
          localStorage.setItem(key, value);
        } else {
          try {
            sessionStorage.setItem(key, value);
          } catch (e) {
            window._memoryStorage = window._memoryStorage || {};
            window._memoryStorage[key] = value;
          }
        }
      } catch (e) {
        console.warn('Storage not available:', e);
      }
    },
    getItem: function(key) {
      try {
        if (localStorage) {
          return localStorage.getItem(key);
        } else {
          try {
            return sessionStorage.getItem(key);
          } catch (e) {
            return window._memoryStorage && window._memoryStorage[key] || null;
          }
        }
      } catch (e) {
        return null;
      }
    },
    removeItem: function(key) {
      try {
        if (localStorage) {
          localStorage.removeItem(key);
        } else {
          try {
            sessionStorage.removeItem(key);
          } catch (e) {
            if (window._memoryStorage) {
              delete window._memoryStorage[key];
            }
          }
        }
      } catch (e) {
        console.warn('Storage removal failed:', e);
      }
    }
  };
  
  /* ---------- Audio Alert System ---------- */
  
  let audioEnabled = true;
  let audioContext = null;
  
  function initAudioContext() {
    if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
        
        if (audioContext.state === 'suspended') {
          audioContext.resume().catch(e => {
            console.warn('Audio context resume failed:', e);
          });
        }
      } catch (e) {
        console.warn('Audio context initialization failed:', e);
        audioEnabled = false;
      }
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
    if (!audioEnabled) return;
    playTone(523.25, 0.15, 'sine', 0.25);
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.25), 150);
    setTimeout(() => playTone(783.99, 0.2, 'sine', 0.25), 300);
  }
  
  function playErrorSound() {
    if (!audioEnabled) return;
    playTone(440, 0.1, 'square', 0.3);
    setTimeout(() => playTone(349.23, 0.15, 'square', 0.3), 100);
    setTimeout(() => playTone(261.63, 0.2, 'square', 0.3), 250);
  }
  
  function playInfoSound() {
    if (!audioEnabled) return;
    playTone(600, 0.15, 'sine', 0.2);
  }
  
  function toggleAudioAlerts() {
    audioEnabled = !audioEnabled;
    const toggle = document.getElementById('audioToggle');
    if (toggle) {
      toggle.setAttribute('aria-checked', audioEnabled.toString());
      if (audioEnabled) {
        initAudioContext();
        setTimeout(() => playInfoSound(), 100);
        announceToScreenReader('Audio alerts enabled.');
      } else {
        announceToScreenReader('Audio alerts disabled.');
      }
    }
    safeStorage.setItem('audioAlertsEnabled', audioEnabled.toString());
  }
  
  function loadAudioPreference() {
    const saved = safeStorage.getItem('audioAlertsEnabled');
    if (saved !== null) {
      audioEnabled = saved === 'true';
      const toggle = document.getElementById('audioToggle');
      if (toggle) {
        toggle.setAttribute('aria-checked', audioEnabled.toString());
      }
    }
  }
  
  /* ---------- Screen Reader Announcements ---------- */
  
  function ensureLiveRegion() {
    let lr = document.getElementById('a11y-live-region');
    if (!lr) {
      lr = document.createElement('div');
      lr.id = 'a11y-live-region';
      lr.className = 'sr-only';
      lr.setAttribute('aria-live', 'assertive');
      lr.setAttribute('aria-atomic', 'true');
      document.body.appendChild(lr);
    }
    return lr;
  }
  
  function announceToScreenReader(message, priority = 'polite') {
    const lr = ensureLiveRegion();
    lr.setAttribute('aria-live', priority);
    lr.textContent = message;
    
    setTimeout(() => {
      lr.textContent = '';
    }, 1000);
  }
  
  /* ---------- Accessibility State ---------- */
  
  const a11yState = {
    highContrast: false,
    textSize: 100,
    colorScheme: 'default',
    enhancedFocus: false,
    reduceMotion: false,
    simpleLanguage: false,
    readingGuide: false,
    keyboardShortcuts: true,
    tabOrder: false,
    screenReaderMode: 'auto',
    announceChanges: true,
    ariaLive: true,
    voiceControl: false
  };
  
  /* ---------- Inject SVG Filters for Color Blindness ---------- */
  
  function injectSVGFilters() {
    if (document.getElementById('a11y-filters')) return;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'a11y-filters';
    svg.style.cssText = 'position:absolute;width:0;height:0';
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    const protanopia = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    protanopia.id = 'protanopia';
    protanopia.setAttribute('color-interpolation-filters', 'sRGB');
    protanopia.innerHTML = '<feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0"/>';
    
    const deuteranopia = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    deuteranopia.id = 'deuteranopia';
    deuteranopia.setAttribute('color-interpolation-filters', 'sRGB');
    deuteranopia.innerHTML = '<feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0"/>';
    
    const tritanopia = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    tritanopia.id = 'tritanopia';
    tritanopia.setAttribute('color-interpolation-filters', 'sRGB');
    tritanopia.innerHTML = '<feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0"/>';
    
    defs.appendChild(protanopia);
    defs.appendChild(deuteranopia);
    defs.appendChild(tritanopia);
    svg.appendChild(defs);
    document.body.appendChild(svg);
  }
  
  /* ---------- Inject Accessibility Panel HTML ---------- */
  
  function injectAccessibilityPanel() {
    // Check if panel already exists
    if (document.getElementById('a11yToggle')) {
      return;
    }
    
    const panel = document.createElement('div');
    panel.className = 'a11y-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Accessibility settings');
    
    panel.innerHTML = `
      <button id="a11yToggle" class="a11y-toggle" type="button" aria-label="Open accessibility settings" aria-expanded="false" aria-controls="a11yMenu">
        ♿ Accessibility
      </button>
      <div id="a11yMenu" class="a11y-menu" role="menu" aria-labelledby="a11yToggle">
        <div class="a11y-section">
          <h3>Visual Settings</h3>
          
          <div class="a11y-control">
            <label for="highContrast">
              <input type="checkbox" id="highContrast" role="menuitemcheckbox" aria-checked="false">
              <span>High contrast mode</span>
            </label>
          </div>
          
          <div class="a11y-control">
            <label for="textSize">
              <span>Text size:</span>
            </label>
            <input type="range" id="textSize" min="100" max="200" value="100" step="25" aria-label="Text size">
            <span class="a11y-value" id="textSizeValue">100%</span>
          </div>
          
          <div class="a11y-control">
            <label for="colorScheme">
              <span>Color scheme:</span>
            </label>
            <select id="colorScheme" class="a11y-select" role="menuitem" aria-label="Color scheme">
              <option value="default">Default</option>
              <option value="protanopia">Protanopia (red-blind)</option>
              <option value="deuteranopia">Deuteranopia (green-blind)</option>
              <option value="tritanopia">Tritanopia (blue-blind)</option>
              <option value="monochrome">Monochrome</option>
            </select>
          </div>
          
          <div class="a11y-control">
            <label for="enhancedFocus">
              <input type="checkbox" id="enhancedFocus" role="menuitemcheckbox" aria-checked="false">
              <span>Enhanced focus indicators</span>
            </label>
          </div>
        </div>
        
        <div class="a11y-section">
          <h3>Motion & Animation</h3>
          
          <div class="a11y-control">
            <label for="reduceMotion">
              <input type="checkbox" id="reduceMotion" role="menuitemcheckbox" aria-checked="false">
              <span>Reduce motion</span>
            </label>
          </div>
        </div>
        
        <div class="a11y-section">
          <h3>Language & Reading</h3>
          
          <div class="a11y-control">
            <label for="simpleLanguage">
              <input type="checkbox" id="simpleLanguage" role="menuitemcheckbox" aria-checked="false">
              <span>Simplified language</span>
            </label>
          </div>
          
          <div class="a11y-control">
            <label for="readingGuide">
              <input type="checkbox" id="readingGuide" role="menuitemcheckbox" aria-checked="false">
              <span>Reading guide (line highlight)</span>
            </label>
          </div>
        </div>
        
        <div class="a11y-section">
          <h3>Keyboard & Navigation</h3>
          
          <div class="a11y-control">
            <label for="keyboardShortcuts">
              <input type="checkbox" id="keyboardShortcuts" role="menuitemcheckbox" aria-checked="true">
              <span>Enable keyboard shortcuts</span>
            </label>
          </div>
          
          <div class="a11y-control">
            <label for="tabOrder">
              <input type="checkbox" id="tabOrder" role="menuitemcheckbox" aria-checked="false">
              <span>Visual tab order indicator</span>
            </label>
          </div>
        </div>
        
        <div class="a11y-section">
          <h3>Screen Reader</h3>
          
          <div class="a11y-control">
            <label for="screenReaderMode">
              <select id="screenReaderMode" class="a11y-select" role="menuitem" aria-label="Screen reader optimization">
                <option value="auto">Auto-detect</option>
                <option value="nvda">NVDA</option>
                <option value="jaws">JAWS</option>
                <option value="voiceover">VoiceOver (macOS/iOS)</option>
                <option value="talkback">TalkBack (Android)</option>
                <option value="orca">Orca (Linux)</option>
                <option value="narrator">Narrator (Windows)</option>
              </select>
              <span style="font-size:12px;margin-top:4px;display:block">Screen reader optimization</span>
            </label>
          </div>
          
          <div class="a11y-control">
            <label for="announceChanges">
              <input type="checkbox" id="announceChanges" role="menuitemcheckbox" aria-checked="true">
              <span>Announce all changes</span>
            </label>
          </div>
          
          <div class="a11y-control">
            <label for="ariaLive">
              <input type="checkbox" id="ariaLive" role="menuitemcheckbox" aria-checked="true">
              <span>Enhanced ARIA live regions</span>
            </label>
          </div>
        </div>
        
        <div class="a11y-section">
          <button id="resetA11ySettings" class="primary" style="width:100%">Reset to defaults</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
  }
  
  /* ---------- Simplified Language Dictionary ---------- */
  
  const simpleLanguageMap = {
    'Choose verification mode:': 'Pick how to verify:',
    'Automatic (invisible)': 'Automatic',
    'Passkey / WebAuthn': 'Use passkey',
    'Text question': 'Text question',
    'Keyboard-only': 'Keyboard only',
    'Start verification': 'Start',
    'Submit': 'Send',
    'Cancel': 'Stop',
    'Table of Contents': 'Contents',
    'Back to top': 'Top',
    'Last updated': 'Updated'
  };
  
  /* ---------- Screen Reader Detection & Optimization ---------- */
  
  function detectScreenReader() {
    if (a11yState.screenReaderMode !== 'auto') {
      return a11yState.screenReaderMode;
    }
    
    const ua = navigator.userAgent.toLowerCase();
    const isWindows = ua.includes('win');
    const isMac = ua.includes('mac');
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = ua.includes('android');
    const isLinux = ua.includes('linux');
    
    if (window.speechSynthesis && window.speechSynthesis.getVoices().length > 0) {
      if (isMac || isIOS) return 'voiceover';
      if (isWindows) return 'narrator';
    }
    
    if (isWindows) return 'nvda';
    if (isMac || isIOS) return 'voiceover';
    if (isAndroid) return 'talkback';
    if (isLinux) return 'orca';
    
    return 'nvda';
  }
  
  function applyScreenReaderOptimizations() {
    const srMode = detectScreenReader();
    document.body.className = document.body.className.replace(/sr-optimize-\w+/g, '');
    document.body.classList.add(`sr-optimize-${srMode}`);
    
    if (srMode === 'nvda' || srMode === 'jaws') {
      document.querySelectorAll('button').forEach(btn => {
        if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
          btn.setAttribute('aria-label', btn.textContent || 'Button');
        }
      });
    }
    
    if (srMode === 'voiceover') {
      document.querySelectorAll('[role]').forEach(el => {
        if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
          const label = el.textContent.substring(0, 50);
          if (label) el.setAttribute('aria-label', label);
        }
      });
    }
  }
  
  /* ---------- Accessibility Feature Functions ---------- */
  
  function toggleHighContrast(enabled) {
    a11yState.highContrast = enabled;
    if (enabled) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    saveA11ySettings();
    announceToScreenReader(enabled ? 'High contrast mode enabled' : 'High contrast mode disabled');
    if (enabled) playInfoSound();
  }
  
  function setTextSize(size) {
    a11yState.textSize = size;
    document.body.style.fontSize = size + '%';
    const valueEl = document.getElementById('textSizeValue');
    if (valueEl) valueEl.textContent = size + '%';
    saveA11ySettings();
  }
  
  function setColorScheme(scheme) {
    a11yState.colorScheme = scheme;
    document.body.className = document.body.className.replace(/color-\w+/g, '');
    if (scheme !== 'default') {
      document.body.classList.add(`color-${scheme}`);
    }
    saveA11ySettings();
    announceToScreenReader(`Color scheme changed to ${scheme}`);
  }
  
  function toggleEnhancedFocus(enabled) {
    a11yState.enhancedFocus = enabled;
    if (enabled) {
      document.body.classList.add('enhanced-focus');
    } else {
      document.body.classList.remove('enhanced-focus');
    }
    saveA11ySettings();
  }
  
  function toggleReduceMotion(enabled) {
    a11yState.reduceMotion = enabled;
    if (enabled) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    saveA11ySettings();
  }
  
  function toggleSimpleLanguage(enabled) {
    a11yState.simpleLanguage = enabled;
    if (enabled) {
      applySimpleLanguage();
    } else {
      removeSimpleLanguage();
    }
    saveA11ySettings();
    announceToScreenReader(enabled ? 'Simplified language enabled' : 'Simplified language disabled');
  }
  
  function applySimpleLanguage() {
    document.querySelectorAll('*').forEach(el => {
      if (el.children.length === 0 && el.textContent) {
        const text = el.textContent.trim();
        if (simpleLanguageMap[text]) {
          el.setAttribute('data-original-text', text);
          el.textContent = simpleLanguageMap[text];
        }
      }
    });
  }
  
  function removeSimpleLanguage() {
    document.querySelectorAll('[data-original-text]').forEach(el => {
      el.textContent = el.getAttribute('data-original-text');
      el.removeAttribute('data-original-text');
    });
  }
  
  /* ---------- Reading Guide ---------- */
  
  let readingGuideEl = null;
  
  function toggleReadingGuide(enabled) {
    a11yState.readingGuide = enabled;
    if (enabled) {
      if (!readingGuideEl) {
        readingGuideEl = document.createElement('div');
        readingGuideEl.className = 'reading-guide';
        readingGuideEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(readingGuideEl);
      }
      readingGuideEl.classList.add('active');
      updateReadingGuide();
      document.addEventListener('mousemove', updateReadingGuide);
      document.addEventListener('keydown', updateReadingGuideOnKey);
    } else {
      if (readingGuideEl) {
        readingGuideEl.classList.remove('active');
      }
      document.removeEventListener('mousemove', updateReadingGuide);
      document.removeEventListener('keydown', updateReadingGuideOnKey);
    }
    saveA11ySettings();
  }
  
  function updateReadingGuide(e) {
    if (!readingGuideEl || !a11yState.readingGuide) return;
    const y = e ? e.clientY : window.innerHeight / 2;
    readingGuideEl.style.top = (y - 15) + 'px';
    readingGuideEl.style.left = '0';
    readingGuideEl.style.width = '100%';
    readingGuideEl.style.height = '30px';
  }
  
  function updateReadingGuideOnKey(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      setTimeout(() => {
        const focused = document.activeElement;
        if (focused && focused.getBoundingClientRect) {
          const rect = focused.getBoundingClientRect();
          updateReadingGuide({clientY: rect.top + rect.height / 2});
        }
      }, 100);
    }
  }
  
  /* ---------- Tab Order Indicator ---------- */
  
  let tabIndicatorEl = null;
  
  function toggleTabOrder(enabled) {
    a11yState.tabOrder = enabled;
    if (enabled) {
      if (!tabIndicatorEl) {
        tabIndicatorEl = document.createElement('div');
        tabIndicatorEl.className = 'tab-indicator';
        tabIndicatorEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(tabIndicatorEl);
      }
      updateTabIndicator();
      document.addEventListener('keydown', handleTabOrderKey);
      document.addEventListener('focusin', updateTabIndicator);
    } else {
      if (tabIndicatorEl) {
        tabIndicatorEl.classList.remove('active');
      }
      document.removeEventListener('keydown', handleTabOrderKey);
      document.removeEventListener('focusin', updateTabIndicator);
    }
    saveA11ySettings();
  }
  
  function handleTabOrderKey(e) {
    if (e.key === 'Tab') {
      setTimeout(updateTabIndicator, 50);
    }
  }
  
  function updateTabIndicator() {
    if (!tabIndicatorEl || !a11yState.tabOrder) return;
    const focused = document.activeElement;
    if (focused && focused !== document.body) {
      const rect = focused.getBoundingClientRect();
      tabIndicatorEl.style.top = (rect.top - 3) + 'px';
      tabIndicatorEl.style.left = (rect.left - 3) + 'px';
      tabIndicatorEl.style.width = (rect.width + 6) + 'px';
      tabIndicatorEl.style.height = (rect.height + 6) + 'px';
      tabIndicatorEl.classList.add('active');
    }
  }
  
  /* ---------- Settings Management ---------- */
  
  function saveA11ySettings() {
    safeStorage.setItem('a11ySettings', JSON.stringify(a11yState));
  }
  
  function loadA11ySettings() {
    const saved = safeStorage.getItem('a11ySettings');
    if (saved) {
      try {
        const savedSettings = JSON.parse(saved);
        Object.assign(a11yState, savedSettings);
        if (a11yState.keyboardShortcuts === undefined || a11yState.keyboardShortcuts === null) {
          a11yState.keyboardShortcuts = true;
        }
        applyAllA11ySettings();
      } catch (e) {
        console.warn('Failed to load accessibility settings:', e);
        a11yState.keyboardShortcuts = true;
      }
    } else {
      a11yState.keyboardShortcuts = true;
    }
  }
  
  function applyAllA11ySettings() {
    toggleHighContrast(a11yState.highContrast);
    setTextSize(a11yState.textSize);
    setColorScheme(a11yState.colorScheme);
    toggleEnhancedFocus(a11yState.enhancedFocus);
    toggleReduceMotion(a11yState.reduceMotion);
    toggleSimpleLanguage(a11yState.simpleLanguage);
    toggleReadingGuide(a11yState.readingGuide);
    toggleTabOrder(a11yState.tabOrder);
    const kbCheckbox = document.getElementById('keyboardShortcuts');
    if (kbCheckbox) {
      kbCheckbox.checked = a11yState.keyboardShortcuts !== false;
      kbCheckbox.setAttribute('aria-checked', (a11yState.keyboardShortcuts !== false).toString());
    }
    const srModeSelect = document.getElementById('screenReaderMode');
    if (srModeSelect) srModeSelect.value = a11yState.screenReaderMode;
    const announceCheckbox = document.getElementById('announceChanges');
    if (announceCheckbox) announceCheckbox.checked = a11yState.announceChanges;
    const ariaLiveCheckbox = document.getElementById('ariaLive');
    if (ariaLiveCheckbox) ariaLiveCheckbox.checked = a11yState.ariaLive;
    applyScreenReaderOptimizations();
  }
  
  function resetA11ySettings() {
    safeStorage.removeItem('a11ySettings');
    location.reload();
  }
  
  /* ---------- Keyboard Shortcuts ---------- */
  
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (!a11yState.keyboardShortcuts) return;
      
      // Alt + A: Open accessibility menu
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        const toggle = document.getElementById('a11yToggle');
        if (toggle) toggle.click();
      }
      
      // Escape: Close accessibility menu
      if (e.key === 'Escape') {
        const menu = document.getElementById('a11yMenu');
        const toggle = document.getElementById('a11yToggle');
        if (menu && menu.classList.contains('open')) {
          if (toggle) toggle.click();
        }
      }
    });
  }
  
  /* ---------- Initialize All Controls ---------- */
  
  function initializeAccessibilityControls() {
    // Inject panel and filters if needed
    injectAccessibilityPanel();
    injectSVGFilters();
    ensureLiveRegion();
    
    // Get references
    const a11yToggle = document.getElementById('a11yToggle');
    const a11yMenu = document.getElementById('a11yMenu');
    
    if (!a11yToggle || !a11yMenu) {
      console.warn('Accessibility controls not found, retrying...');
      setTimeout(initializeAccessibilityControls, 100);
      return;
    }
    
    // Menu toggle
    a11yToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = a11yMenu.classList.toggle('open');
      a11yToggle.setAttribute('aria-expanded', isOpen.toString());
      if (isOpen) {
        setTimeout(() => a11yMenu.focus(), 50);
      }
    });
    
    // High contrast
    document.getElementById('highContrast')?.addEventListener('change', (e) => {
      toggleHighContrast(e.target.checked);
      e.target.setAttribute('aria-checked', e.target.checked.toString());
    });
    
    // Text size
    const textSizeSlider = document.getElementById('textSize');
    textSizeSlider?.addEventListener('input', (e) => {
      setTextSize(parseInt(e.target.value));
    });
    
    // Color scheme
    document.getElementById('colorScheme')?.addEventListener('change', (e) => {
      setColorScheme(e.target.value);
    });
    
    // Enhanced focus
    document.getElementById('enhancedFocus')?.addEventListener('change', (e) => {
      toggleEnhancedFocus(e.target.checked);
      e.target.setAttribute('aria-checked', e.target.checked.toString());
    });
    
    // Reduce motion
    document.getElementById('reduceMotion')?.addEventListener('change', (e) => {
      toggleReduceMotion(e.target.checked);
      e.target.setAttribute('aria-checked', e.target.checked.toString());
    });
    
    // Simple language
    document.getElementById('simpleLanguage')?.addEventListener('change', (e) => {
      toggleSimpleLanguage(e.target.checked);
      e.target.setAttribute('aria-checked', e.target.checked.toString());
    });
    
    // Reading guide
    document.getElementById('readingGuide')?.addEventListener('change', (e) => {
      toggleReadingGuide(e.target.checked);
      e.target.setAttribute('aria-checked', e.target.checked.toString());
    });
    
    // Keyboard shortcuts
    document.getElementById('keyboardShortcuts')?.addEventListener('change', (e) => {
      a11yState.keyboardShortcuts = e.target.checked;
      saveA11ySettings();
      e.target.setAttribute('aria-checked', e.target.checked.toString());
    });
    
    // Tab order
    document.getElementById('tabOrder')?.addEventListener('change', (e) => {
      toggleTabOrder(e.target.checked);
      e.target.setAttribute('aria-checked', e.target.checked.toString());
    });
    
    // Screen reader mode
    document.getElementById('screenReaderMode')?.addEventListener('change', (e) => {
      a11yState.screenReaderMode = e.target.value;
      applyScreenReaderOptimizations();
      saveA11ySettings();
    });
    
    // Announce changes
    document.getElementById('announceChanges')?.addEventListener('change', (e) => {
      a11yState.announceChanges = e.target.checked;
      saveA11ySettings();
      e.target.setAttribute('aria-checked', e.target.checked.toString());
    });
    
    // ARIA live
    document.getElementById('ariaLive')?.addEventListener('change', (e) => {
      a11yState.ariaLive = e.target.checked;
      saveA11ySettings();
      e.target.setAttribute('aria-checked', e.target.checked.toString());
    });
    
    // Reset button
    document.getElementById('resetA11ySettings')?.addEventListener('click', () => {
      resetA11ySettings();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (a11yMenu && !a11yMenu.contains(e.target) && !a11yToggle.contains(e.target)) {
        if (a11yMenu.classList.contains('open')) {
          a11yMenu.classList.remove('open');
          a11yToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
    
    // Load settings and initialize
    loadA11ySettings();
    loadAudioPreference();
    setupKeyboardShortcuts();
    applyScreenReaderOptimizations();
  }
  
  /* ---------- Initialize on DOM Ready ---------- */
  
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAccessibilityControls);
    } else {
      initializeAccessibilityControls();
    }
    
    // Initialize audio on first user interaction
    document.addEventListener('click', () => {
      if (!audioContext) {
        initAudioContext();
      }
    }, { once: true });
  }
  
  // Start initialization
  init();
  
  // Export for global use
  window.A11yPlugin = {
    initialized: true,
    announceToScreenReader: announceToScreenReader,
    playSuccessSound: playSuccessSound,
    playErrorSound: playErrorSound,
    playInfoSound: playInfoSound,
    toggleHighContrast: toggleHighContrast,
    setTextSize: setTextSize,
    setColorScheme: setColorScheme,
    toggleAudioAlerts: toggleAudioAlerts
  };
  
  // Expose safeStorage globally for compatibility
  window.safeStorage = safeStorage;
  
})();

