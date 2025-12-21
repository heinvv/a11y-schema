# Product Requirements Document: Accessibility Patterns Library

**Version:** 1.3
**Date:** December 18, 2024
**Author:** Hein
**Status:** Ready for Implementation

**Key Decisions Finalized:**
- ✅ Package name: `focus-patterns`
- ✅ Strategy: Minimal Core (Tabs only for v1.0)
- ✅ Implementation: Data attribute pattern
- ✅ API: Pure declarative with imperative escape hatch
- ✅ Styling: Zero CSS (examples provided separately)
- ✅ License: MIT (free forever)
- ✅ Analytics: No telemetry in v1.0

---

## Executive Summary

A lightweight, drop-in JavaScript library that provides accessible UI patterns with automatic keyboard handling and ARIA semantics. Think "Bootstrap for accessibility" - developers add markup, get fully accessible components.

**Core Value Proposition:**
- Zero dependencies
- Progressive enhancement
- Battle-tested accessibility
- Minimal learning curve

---

## Problem Statement

Developers struggle to implement accessible UI patterns correctly:
- ARIA specification is complex and technical
- Keyboard handling is intricate and pattern-specific
- Screen reader testing requires specialized knowledge
- Existing solutions require framework adoption or are incomplete
- Bootstrap and similar libraries often have accessibility gaps

**Result:** Inaccessible websites, frustrated users with disabilities, legal risk for companies.

---

## Success Metrics

### Primary Metrics
- **Adoption Rate:** npm downloads, CDN requests
- **Implementation Success:** % of implementations passing WCAG AA automated tests
- **Developer Satisfaction:** GitHub stars, positive feedback ratio

### Secondary Metrics
- **Time to Implementation:** Average time from installation to working component
- **Documentation Engagement:** Docs page views, search effectiveness
- **Community Growth:** Contributors, issues resolved, PR activity

---

## Target Audience

### Primary
1. **Full-stack developers** building traditional web applications
2. **WordPress/CMS developers** needing accessible custom widgets
3. **Junior developers** learning accessibility best practices

### Secondary
1. **Accessibility consultants** needing quick remediation solutions
2. **Design system teams** building component libraries
3. **Freelancers** on tight budgets/timelines

---

## Strategic Options

### Option A: Minimal Core (Recommended for v1)

**Scope:** Tabs only

**Pros:**
- Fast to market (2-3 weeks)
- Proof of concept
- Learn from real usage
- Iterate based on feedback

**Cons:**
- Limited immediate utility
- Harder to gain initial traction

**Timeline:** 3-4 weeks to v1.0

---

### Option B: Essential Patterns Bundle

**Scope:** Tabs, Accordion, Disclosure, Modal

**Pros:**
- Covers 80% of common needs
- Strong launch value
- Demonstrates pattern consistency
- Better initial adoption

**Cons:**
- 2-3x longer development
- More testing surface area
- Delayed market entry

**Timeline:** 8-10 weeks to v1.0

---

### Option C: Framework + Patterns

**Scope:** Core framework + Tabs + plugin architecture

**Pros:**
- Extensible from day one
- Community can add patterns
- Future-proof architecture
- Clear growth path

**Cons:**
- Most complex initial build
- Framework design risk
- Longer before validation

**Timeline:** 10-12 weeks to v1.0

---

## ✅ SELECTED STRATEGY: Minimal Core

**Approach:** Option A - Minimal Core (Tabs only for v1.0)

**Rationale:**
- Fast to market (3-4 weeks)
- Proof of concept with real user feedback
- Learn and iterate based on actual usage
- Lower risk, faster validation

**Phase 1 (Weeks 1-4):** Ship Tabs MVP
**Future phases:** TBD based on v1.0 feedback and adoption

---

## Technical Architecture

### Technology Stack

**Core:**
- Vanilla JavaScript (ES2020+)
- SCSS for styling (optional, just for demos)
- Zero runtime dependencies

**Development:**
- TypeScript (compiled to JS)
- Rollup/Vite for bundling
- Playwright for accessibility testing
- ESLint + Prettier

**Distribution:**
- npm package
- CDN (jsDelivr, unpkg)
- GitHub releases

---

## Implementation Options

### ✅ SELECTED: Option 1: Data Attribute Pattern

```html
<div data-focus="tabs" data-activation="manual">
  <div data-role="tablist" aria-label="Settings">
    <button data-role="tab" data-controls="general">General</button>
    <button data-role="tab" data-controls="privacy">Privacy</button>
  </div>
  <div data-role="tabpanel" id="general">General content</div>
  <div data-role="tabpanel" id="privacy">Privacy content</div>
</div>

<script>
  // Auto-initializes all [data-focus] elements
</script>
```

**Pros:**
- Clean, semantic markup
- No JavaScript required in HTML
- Progressive enhancement friendly
- Familiar to Bootstrap users

**Cons:**
- Non-standard attributes (though data-* is standard)
- Slightly more verbose

---

### Option 2: Class-Based Pattern

```html
<div class="focus-tabs" data-activation="manual">
  <div class="focus-tablist" aria-label="Settings">
    <button class="focus-tab" data-panel="general">General</button>
    <button class="focus-tab" data-panel="privacy">Privacy</button>
  </div>
  <div class="focus-tabpanel" id="general">General content</div>
  <div class="focus-tabpanel" id="privacy">Privacy content</div>
</div>
```

**Pros:**
- CSS styling hooks built-in
- More concise
- Familiar pattern

**Cons:**
- Classes mix behavior and presentation
- Harder to progressively enhance

---

### Option 3: Web Components

```html
<focus-tabs activation="manual">
  <focus-tablist aria-label="Settings">
    <focus-tab panel="general">General</focus-tab>
    <focus-tab panel="privacy">Privacy</focus-tab>
  </focus-tablist>
  <focus-tabpanel id="general">General content</focus-tabpanel>
  <focus-tabpanel id="privacy">Privacy content</focus-tabpanel>
</focus-tabs>
```

**Pros:**
- Native browser encapsulation
- Future-proof
- Clean HTML
- Scoped styling

**Cons:**
- IE11 requires polyfills
- Shadow DOM accessibility complexity
- Steeper learning curve
- More opinionated

---

## API Design Options

### ✅ SELECTED: Option C (Pure Declarative) with Imperative Escape Hatch

**Decision:** Start with pure declarative API for simplicity, but expose imperative API via global object for power users.

**Implementation:**
```javascript
// Primary usage: Pure declarative (auto-initializes)
<script src="https://cdn.jsdelivr.net/npm/focus-patterns@1"></script>
<div data-focus="tabs">...</div>

// Power users can access imperative API
<script>
  const tabs = window.FocusPatterns.Tabs.init(element, options);
</script>
```

**Rationale:** Lowest barrier to entry for target audience while maintaining flexibility.

---

### Option A: Imperative API

```javascript
import { Tabs } from 'focus-patterns';

const tabs = new Tabs(element, {
  activation: 'manual',
  orientation: 'horizontal',
  onTabChange: (tab) => console.log(tab)
});

tabs.selectTab(2);
tabs.destroy();
```

**Use case:** Dynamic applications, framework integrations

---

### Option B: Declarative + Imperative Hybrid

```javascript
// Auto-init from HTML
import 'focus-patterns'; // Scans and initializes

// Or explicit when needed
import { Tabs } from 'focus-patterns';
const tabs = Tabs.init(element, options);
```

**Use case:** Covers both simple and complex scenarios

---

### Option C: Pure Declarative

```html
<!-- Everything in HTML, zero JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/focus-patterns@1"></script>
<div data-focus="tabs" data-activation="manual" data-on-change="handleTabChange">
  <!-- ... -->
</div>
```

**Use case:** No-code tools, simple websites, rapid prototyping

---

## Feature Requirements

### Phase 1: Tabs Component (MVP)

#### Must Have
- ✅ Keyboard navigation (arrows, Home, End)
- ✅ Automatic ARIA attribute management
- ✅ Manual vs automatic activation modes
- ✅ Horizontal and vertical orientation
- ✅ Proper focus management
- ✅ Screen reader announcements
- ✅ Accessible from initialization

#### Should Have
- ✅ Tab deletion support (optional)
- ✅ Custom event hooks (onChange, onDelete)
- ✅ Programmatic API (selectTab, addTab, removeTab)
- ✅ RTL support

#### Could Have
- ⭕ Tab reordering
- ⭕ Lazy panel loading
- ⭕ Nested tabs support
- ⭕ Icon support

#### Won't Have (v1)
- ❌ Built-in styling/themes
- ❌ Animations (leave to CSS)
- ❌ Server-side rendering
- ❌ Framework-specific adapters

---

### Phase 2: Additional Patterns

1. **Accordion**
   - Single/multi-expand modes
   - Nested accordions
   - Proper ARIA regions

2. **Disclosure Widget**
   - Show/hide content
   - Animated transitions support
   - Multiple instances

3. **Modal Dialog**
   - Focus trapping
   - Backdrop clicks
   - ESC to close
   - Return focus on close

---

## Configuration Options

### Tabs Configuration Schema

```typescript
interface TabsConfig {
  // Activation behavior
  activation?: 'auto' | 'manual'; // default: 'manual'
  
  // Orientation
  orientation?: 'horizontal' | 'vertical'; // default: 'horizontal'
  
  // Deletion
  deletable?: boolean; // default: false
  deleteKey?: string; // default: 'Delete'
  
  // Selection
  defaultTab?: number | string; // default: 0 (first tab)
  
  // Lifecycle hooks
  onInit?: (instance: Tabs) => void;
  onBeforeChange?: (fromTab: number, toTab: number) => boolean | Promise<boolean>;
  onChange?: (tab: number, tabElement: HTMLElement) => void;
  onDelete?: (tab: number) => boolean | Promise<boolean>;
  onDestroy?: () => void;
  
  // Accessibility
  idPrefix?: string; // default: 'tab'
  announceChanges?: boolean; // default: true
  
  // Advanced
  loop?: boolean; // default: true (arrow keys wrap)
  autoFocus?: boolean; // default: true (focus on init)
}
```

---

## Testing Strategy

### Automated Testing

**Unit Tests (Jest/Vitest)**
- ARIA attribute correctness
- Keyboard event handling
- State management
- API methods

**Integration Tests (Playwright)**
- Real keyboard navigation
- Screen reader announcements (via accessibility tree)
- Focus management across browsers
- Multi-instance scenarios

**Accessibility Tests**
- axe-core integration
- WCAG AA compliance
- Color contrast (if styled examples)
- Keyboard-only navigation

---

### Manual Testing Matrix

| Pattern | NVDA/Chrome | JAWS/Chrome | VoiceOver/Safari | TalkBack/Chrome | Narrator/Edge |
|---------|-------------|-------------|------------------|-----------------|---------------|
| Tabs    | ✅          | ✅          | ✅               | ✅              | ✅            |

**Device Matrix:**
- Windows 10/11
- macOS (latest)
- iOS (latest)
- Android (latest)

---

## Documentation Requirements

### Essential Documentation

1. **Quick Start**
   - Installation (npm, CDN)
   - Basic example
   - 5-minute implementation

2. **API Reference**
   - Configuration options
   - Methods
   - Events
   - TypeScript types

3. **Pattern Guidelines**
   - When to use tabs
   - Best practices
   - Accessibility considerations
   - Common mistakes

4. **Examples**
   - Basic tabs
   - Vertical tabs
   - Manual activation
   - Dynamic tabs (add/remove)
   - Integration examples (WordPress, vanilla JS apps)

5. **Testing Guide**
   - How to test implementations
   - Screen reader testing basics
   - Playwright test examples

---

## Distribution Strategy

### Package Formats

```
dist/
├── focus-patterns.js           # UMD, development
├── focus-patterns.min.js       # UMD, production
├── focus-patterns.esm.js       # ES modules
├── focus-patterns.cjs.js       # CommonJS
├── focus-patterns.d.ts         # TypeScript definitions
└── examples/
    ├── minimal.css             # Basic unstyled example
    ├── modern.css              # Modern design example
    └── bootstrap.css           # Bootstrap-style example
```

**Note:** Library ships with ZERO CSS. Example stylesheets provided for reference only.

### Installation Methods

```bash
# npm
npm install focus-patterns

# yarn
yarn add focus-patterns

# pnpm
pnpm add focus-patterns
```

```html
<!-- CDN -->
<script src="https://cdn.jsdelivr.net/npm/focus-patterns@1/dist/focus-patterns.min.js"></script>
```

---

## Browser Support

### Minimum Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android Chrome 90+)

### Polyfills Required
- None for modern browsers
- Consider IE11 polyfills as separate optional package

---

## Comparison with Alternatives

| Feature | focus-patterns | React Aria | Reach UI | Bootstrap | Headless UI |
|---------|---------------|------------|----------|-----------|-------------|
| Framework | None | React | React | jQuery/None | React/Vue |
| Size | ~5KB | ~30KB | ~25KB | ~50KB | ~20KB |
| ARIA Complete | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Vanilla JS | ✅ | ❌ | ❌ | ✅ | ❌ |
| TypeScript | ✅ | ✅ | ✅ | ❌ | ✅ |
| No Styling | ✅ | ✅ | ⚠️ | ❌ | ✅ |
| Learning Curve | Low | Medium | Medium | Low | Medium |

---

## Risks & Mitigation

### Technical Risks

**Risk:** Browser compatibility issues  
**Mitigation:** Comprehensive cross-browser testing, progressive enhancement

**Risk:** Screen reader inconsistencies  
**Mitigation:** Follow APG patterns exactly, test with multiple AT

**Risk:** Performance with many instances  
**Mitigation:** Event delegation, efficient DOM queries, lazy initialization

### Business Risks

**Risk:** Low adoption  
**Mitigation:** Strong documentation, live demos, community building

**Risk:** Maintenance burden  
**Mitigation:** Automated testing, clear contribution guidelines, scope management

**Risk:** Browser native implementation makes obsolete  
**Mitigation:** Legacy support still needed for years, library provides migration path

---

## Launch Plan

### Pre-Launch (Week -2 to 0)
- [ ] Beta testing with 5-10 developers
- [ ] Documentation review
- [ ] Security audit
- [ ] Performance benchmarking
- [ ] Create demo site

### Launch (Week 1)
- [ ] Publish to npm
- [ ] Submit to jsDelivr CDN
- [ ] Announcement on:
  - Twitter/X
  - Reddit (r/webdev, r/javascript)
  - Dev.to article
  - Hacker News
- [ ] Submit to awesome lists
- [ ] Product Hunt (optional)

### Post-Launch (Week 2-4)
- [ ] Monitor issues and feedback
- [ ] Rapid bug fixes
- [ ] Community engagement
- [ ] First tutorial/walkthrough video
- [ ] Case studies from early adopters

---

## Development Roadmap

### v1.0 (Weeks 1-4) - Tabs MVP
- Core tabs implementation
- Basic documentation
- Automated testing
- npm package
- Demo site

### v1.1 (Weeks 5-6) - Accordion
- Accordion pattern
- Updated documentation
- Additional examples

### v1.2 (Weeks 7-8) - Disclosure
- Disclosure widget
- Performance optimizations
- Framework examples

### v2.0 (Weeks 9-12) - Framework + Modal
- Extract common framework
- Plugin architecture
- Modal dialog pattern
- Migration guide

---

## ✅ RESOLVED: Strategic Decisions

1. **Naming:** `focus-patterns` ✅
   - **Rationale:** Clear, memorable, no conflicts with existing tools (Ariakit), "focus" is core to accessibility
   - **Alternatives considered:** `aria-kit` (conflicts with Ariakit), `a11y-schema` (numeronym too confusing), `focus-lint` (sounds like linter)
   - **Action:** Verified npm availability - AVAILABLE ✅

2. **Monetization:** Free forever (MIT License) ✅
   - **Rationale:** Maximize adoption, accessibility should be free, aligns with community values
   - **Future:** Consider GitHub Sponsors for sustainability

3. **Governance:** Solo project initially ✅
   - **Rationale:** Move fast, clear vision, low overhead
   - **Future:** Open to co-maintainers after v1.0 proves concept

4. **CSS:** Zero styling (library provides no CSS) ✅
   - **Rationale:** Maximum flexibility, no style conflicts, smaller bundle size
   - **Support:** Provide example stylesheets in demo/ folder for reference
   - **Documentation:** Include styling guide with best practices

5. **Analytics:** No telemetry in v1.0 ✅
   - **Rationale:** Privacy-first, simpler implementation, no infrastructure needed
   - **Metrics strategy:**
     - Track npm downloads, GitHub stars/issues
     - Community surveys for qualitative feedback
     - Consider opt-in telemetry only if specific questions arise

---

## Naming Analysis: Why `focus-patterns`?

| Criterion | Score | Notes |
|-----------|-------|-------|
| Clarity | ⭐⭐⭐⭐⭐ | "Focus" + "patterns" = immediately clear purpose |
| Pronounceability | ⭐⭐⭐⭐⭐ | "focus-patterns" - crystal clear, no confusion |
| Memorability | ⭐⭐⭐⭐⭐ | Descriptive and easy to remember |
| Availability | ⭐⭐⭐⭐⭐ | VERIFIED available on npm ✅ |
| Approachability | ⭐⭐⭐⭐⭐ | No jargon, "focus" is beginner-friendly |
| No Conflicts | ⭐⭐⭐⭐⭐ | No confusion with Ariakit or other tools |
| Technical Accuracy | ⭐⭐⭐⭐⭐ | Focus management is core to accessibility |
| SEO-friendly | ⭐⭐⭐⭐⭐ | "focus patterns" are natural search terms |
| Professionalism | ⭐⭐⭐⭐⭐ | Focus is fundamental WCAG concept |

**Why "focus" is perfect:**
- **Core accessibility concept** - Keyboard focus is fundamental to WCAG
- **No existing conflicts** - Unlike ARIA (conflicts with Ariakit)
- **Positive connotation** - "Focus on accessibility"
- **Technical accuracy** - Library manages focus and keyboard interaction
- **Beginner-friendly** - Everyone understands "focus"

**Why not other names?**
- **`aria-kit`** ❌ Too similar to Ariakit (major React library)
- **`a11y-schema`** ❌ Numeronym confusing for beginners
- **`focus-lint`** ❌ Sounds like a linter/checker tool

**Decision:** `focus-patterns` - verified available, no conflicts ✅

---

## API Design Evaluation: Pure Declarative Start

### Starting with Pure Declarative (Option C) ✅

**Why this works:**

1. **Target Audience Alignment**
   - WordPress/CMS developers: Drop in script tag, add markup
   - Junior developers: No JavaScript knowledge required
   - Quick prototyping: Fastest path to working component

2. **Progressive Enhancement**
   ```html
   <!-- Works immediately -->
   <script src="cdn.../focus-patterns.js"></script>
   <div data-focus="tabs">...</div>

   <!-- Power users can extend later -->
   <script>
     const tabs = window.FocusPatterns.Tabs.init(el, {
       onChange: (index) => { /* custom logic */ }
     });
   </script>
   ```

3. **Path to Extension**
   - v1.0: Pure declarative primary pattern
   - v1.1+: Document imperative API for advanced use cases
   - Future: Full framework integration guides (React, Vue, Svelte)

**Trade-offs Accepted:**
- Less control for advanced users initially (acceptable - can be added)
- Global namespace pollution (mitigated by single `FocusPatterns` object)
- Event handling via data attributes might feel limiting (can enhance later)

**Verdict:** Best choice for v1.0 target audience. Extensibility path clear.

---

## CSS Strategy: Zero Styling Rationale

### Why Zero CSS is Optimal

**Technical Benefits:**
- **Bundle size:** Keeps promise of <5KB
- **Zero conflicts:** Won't break existing styles
- **Framework agnostic:** Works with any CSS approach (Tailwind, CSS-in-JS, etc.)
- **Flexibility:** Developers style exactly as needed

**User Benefits:**
- **Design freedom:** No opinionated styles to override
- **Brand consistency:** Matches existing design systems
- **Learning:** Forces understanding of accessible styling patterns

**Support Strategy:**
```
demo/examples/
├── minimal.css        # Bare minimum for usability
├── modern.css         # Contemporary design patterns
├── bootstrap.css      # Bootstrap-compatible styles
└── tailwind-example/  # Tailwind utility classes
```

**Documentation Approach:**
1. Explain ARIA doesn't add styles (education)
2. Provide example stylesheets with explanations
3. Best practices guide (focus indicators, color contrast, etc.)
4. Common patterns (vertical tabs, responsive design)

---

## Analytics Strategy: Privacy-First Approach

### v1.0: No Telemetry ✅

**Rationale:**
1. **Privacy:** No data collection, no consent needed, no infrastructure
2. **Trust:** Shows respect for users' privacy
3. **Simplicity:** Fewer moving parts, faster launch
4. **Compliance:** No GDPR/privacy law concerns

### Metrics Strategy Without Telemetry

**Quantitative (Public Data):**
- npm downloads (weekly/monthly trends)
- GitHub stars/forks (community interest)
- CDN requests (jsDelivr stats)
- Issue/PR activity (engagement quality)

**Qualitative (Active Gathering):**
- User surveys (Google Forms, quarterly)
- GitHub Discussions (feature requests, pain points)
- Community showcase (sites using library)
- Direct outreach to power users

### If Telemetry Becomes Needed (v2.0+)

**Opt-In Only:**
```html
<div data-focus="tabs" data-telemetry="true">
```

**What to Collect (anonymized):**
- Pattern usage (tabs vs accordion vs modal)
- Configuration options (manual vs auto activation)
- Browser/AT statistics
- Error rates and types

**What NOT to Collect:**
- User identification
- Content/data
- Page URLs or sensitive info
- Anything without explicit opt-in

---

## Decision Summary & Next Actions

### All Key Decisions Made ✅

| Decision Point | Selection | Rationale |
|----------------|-----------|-----------|
| **Package Name** | `focus-patterns` | Clear, no conflicts, focus is core to a11y |
| **Strategy** | Minimal Core | Fast to market, learn from usage |
| **Scope** | Tabs only (v1.0) | Prove concept, iterate based on feedback |
| **Implementation** | Data attributes | Clean markup, familiar pattern |
| **API** | Pure declarative + escape hatch | Lowest barrier to entry |
| **CSS** | Zero styling | Maximum flexibility, no conflicts |
| **License** | MIT (free forever) | Maximize adoption, align with values |
| **Governance** | Solo (initially) | Move fast, clear vision |
| **Analytics** | None in v1.0 | Privacy-first, simpler launch |

### Immediate Next Steps

1. ✅ **PRD Complete** - All decisions documented
2. ✅ **npm availability verified** - `focus-patterns` is available
3. ⏭️ **Technical spike** - Build basic tabs POC (2-3 days)
4. ⏭️ **Set up repository** - Initialize project with tooling
5. ⏭️ **Begin implementation** - Follow minimal core strategy

### Pre-Launch Checklist

Before starting development, verify:
- [x] npm package name `focus-patterns` available ✅
- [ ] Domain `focus-patterns.com` available (optional, nice-to-have)
- [ ] GitHub organization/repo name available
- [ ] No existing trademark conflicts

---

## Success Criteria for v1.0

**Launch Blockers:**
- [ ] 100% WCAG 2.1 AA compliance
- [ ] Works in all target browsers
- [ ] Passes automated accessibility tests
- [ ] Tested with 3+ screen readers
- [ ] Documentation complete
- [ ] Zero critical bugs

**Success Indicators (3 months post-launch):**
- 1,000+ npm downloads/month
- 100+ GitHub stars
- 5+ community contributions
- Zero outstanding critical accessibility issues
- Positive feedback from accessibility community

---

## Next Steps

1. **Validate approach:** Share with accessibility community for feedback
2. **Choose option:** Decide on Phase 1 scope (tabs only recommended)
3. **Technical spike:** Build proof-of-concept (2-3 days)
4. **Refine PRD:** Update based on POC learnings
5. **Commit:** Set timeline and start development

---

## ✅ RESOLVED: Design Decisions

### Tabs Pattern

1. **Default Tab Selection** ✅
   - **Decision:** Both modes auto-select first tab if none specified
     - If no tab has `aria-selected="true"` in markup, automatically select first tab (index 0)
     - Applies to both forgiving and strict modes
   - **Rationale:** Default selection is about usability, not validation - users should always have a working tabs component

2. **Tabpanel Focusability (`tabindex` Attribute)** ✅
   - **Decision:** Mode-dependent behavior
     - **Forgiving mode (default):** Auto-detect focusable content
       - Panel HAS focusable elements: Don't add `tabindex`
       - Panel HAS NO focusable elements: Add `tabindex="0"` for keyboard scrolling
       - Detection selector: `a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])`
     - **Strict mode:** Never add `tabindex`; let developers handle it
   - **Rationale:** Forgiving mode follows WAI-ARIA APG guidance automatically; strict mode gives full control

---

## ✅ RESOLVED: Architectural Strategy

### Separation of Concerns: Behavior vs. Markup Validation

**Decision:** Forgiving mode by default with optional strict mode via data attribute/config parameter

---

### Implementation Modes

#### Default: Forgiving Mode (Auto-fixes Markup)
**Philosophy:** Library makes accessibility easy by fixing common mistakes

**Behavior:**
```typescript
// tabs.ts handles everything
private setupARIA(): void {
  this.tabs.forEach((tab, index) => {
    const panel = this.panels[index];

    // Auto-generate IDs if missing
    const tabId = tab.id || generateId(`${this.config.idPrefix}-${index}`);
    const panelId = panel.id || generateId(`${this.config.idPrefix}-panel-${index}`);

    tab.id = tabId;
    panel.id = panelId;

    // Fix missing STATIC attributes
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panelId);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);

    // Auto-detect and set tabindex intelligently
    const hasFocusableContent = panel.querySelector(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!hasFocusableContent) {
      panel.setAttribute('tabindex', '0');
    }

    // Set DYNAMIC attributes (initial state)
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');
    panel.hidden = true;
  });

  // Auto-select first tab if none selected
  const preselected = this.tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
  this.selectTab(preselected >= 0 ? preselected : 0, false);
}
```

**Usage:**
```html
<!-- Minimal markup - library fixes everything -->
<div data-focus="tabs">
  <div data-role="tablist" aria-label="Settings">
    <button data-role="tab">Tab 1</button>
    <button data-role="tab">Tab 2</button>
  </div>
  <div data-role="tabpanel">Content 1</div>
  <div data-role="tabpanel">Content 2</div>
</div>
```

**Pros:**
- ✅ Lower barrier to entry
- ✅ Faster adoption
- ✅ Works with minimal markup
- ✅ Intelligent auto-detection (tabindex)

**Cons:**
- ❌ Mixes concerns
- ❌ Larger bundle size
- ❌ Developers may not learn proper patterns

---

#### Optional: Strict Mode (Assumes Valid Markup)
**Philosophy:** Library enhances valid HTML, doesn't fix broken markup

**Activation:**
```html
<!-- Via data attribute -->
<div data-focus="tabs" data-strict="true">...</div>

<!-- Via config -->
<script>
  const tabs = FocusPatterns.Tabs.init(element, { strict: true });
</script>
```

**Behavior:**
```typescript
private setupARIA(): void {
  if (this.config.strict) {
    // VERIFY only - throw errors if invalid
    this.tabs.forEach((tab, index) => {
      const panel = this.panels[index];

      if (!tab.getAttribute('role')) throw new Error('Missing role="tab"');
      if (!panel.getAttribute('role')) throw new Error('Missing role="tabpanel"');
      if (!tab.id) throw new Error('Missing ID on tab');
      if (!panel.id) throw new Error('Missing ID on panel');

      // Only update DYNAMIC attributes
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
      panel.hidden = true;
    });

    // Auto-select first tab if none selected (same as forgiving mode)
    const preselected = this.tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    this.selectTab(preselected >= 0 ? preselected : 0, false);
  } else {
    // ... forgiving mode logic
  }
}
```

**Usage:**
```html
<!-- Complete, valid markup required -->
<div data-focus="tabs" data-strict="true">
  <div role="tablist" aria-label="Settings">
    <button role="tab" id="tab-1" aria-controls="panel-1">Tab 1</button>
    <button role="tab" id="tab-2" aria-controls="panel-2">Tab 2</button>
  </div>
  <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">Content 1</div>
  <div role="tabpanel" id="panel-2" aria-labelledby="tab-2">Content 2</div>
</div>

<!-- Or with explicit selection -->
<div data-focus="tabs" data-strict="true">
  <div role="tablist" aria-label="Settings">
    <button role="tab" id="tab-1" aria-controls="panel-1">Tab 1</button>
    <button role="tab" id="tab-2" aria-controls="panel-2" aria-selected="true">Tab 2</button>
  </div>
  <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">Content 1</div>
  <div role="tabpanel" id="panel-2" aria-labelledby="tab-2">Content 2</div>
</div>
```

**Pros:**
- ✅ Educational - forces correct markup
- ✅ Clear errors when markup is wrong
- ✅ No "magic" behavior

**Cons:**
- ❌ Higher barrier to entry
- ❌ Requires complete markup

---

### Config Interface

```typescript
interface TabsConfig {
  /** Enable strict mode - requires valid markup, no auto-fixing (default: false) */
  strict?: boolean;

  /** Activation behavior: auto or manual (default: manual) */
  activation?: 'auto' | 'manual';

  /** Orientation: horizontal or vertical (default: horizontal) */
  orientation?: 'horizontal' | 'vertical';

  /** Whether arrow keys should loop (default: true) */
  loop?: 'true' | 'false';

  /** Callback when tab changes */
  onChange?: (tabIndex: number, tabElement: HTMLElement) => void;

  /** ID prefix for generated IDs (forgiving mode only, default: 'tab') */
  idPrefix?: string;

  /** Whether to announce tab changes to screen readers (default: true) */
  announceChanges?: boolean;
}
```

---

**Rationale:**
- Default forgiving mode maximizes adoption and ease of use
- Optional strict mode serves teams that want enforcement and education
- Single codebase handles both modes with minimal overhead
- Clear path for beginners → advanced users

---

## Appendix A: Code Examples

### Basic Usage Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tabs Example</title>
  <script src="https://cdn.jsdelivr.net/npm/focus-patterns@1"></script>
</head>
<body>
  <div data-focus="tabs">
    <div data-role="tablist" aria-label="Product Info">
      <button data-role="tab" data-controls="description">Description</button>
      <button data-role="tab" data-controls="specs">Specifications</button>
      <button data-role="tab" data-controls="reviews">Reviews</button>
    </div>

    <div data-role="tabpanel" id="description">
      <h2>Product Description</h2>
      <p>Detailed product information...</p>
    </div>

    <div data-role="tabpanel" id="specs">
      <h2>Specifications</h2>
      <ul>
        <li>Dimension: 10" x 8" x 2"</li>
        <li>Weight: 2.5 lbs</li>
      </ul>
    </div>

    <div data-role="tabpanel" id="reviews">
      <h2>Customer Reviews</h2>
      <p>4.5 stars from 120 reviews...</p>
    </div>
  </div>
</body>
</html>
```

### Programmatic Usage Example

```javascript
// Access via global object (when loaded via CDN)
const tabs = window.FocusPatterns.Tabs.init(document.getElementById('myTabs'), {
  activation: 'manual',
  orientation: 'vertical',
  onChange: (tabIndex, tabElement) => {
    console.log(`Switched to tab ${tabIndex}`);
    // Track analytics, load content, etc.
  }
});

// Or via ES modules (when installed via npm)
import { Tabs } from 'focus-patterns';
const tabs = Tabs.init(element, options);

// Programmatic control
tabs.selectTab(2); // Select third tab
tabs.addTab('New Tab', '<p>New content</p>');
tabs.removeTab(0);
tabs.destroy(); // Clean up
```

### WordPress Integration Example

```php
// functions.php
function enqueue_focus_patterns() {
  wp_enqueue_script(
    'focus-patterns',
    'https://cdn.jsdelivr.net/npm/focus-patterns@1',
    array(),
    '1.0.0',
    true
  );
}
add_action('wp_enqueue_scripts', 'enqueue_focus_patterns');

// In template
<div data-focus="tabs">
  <div data-role="tablist" aria-label="<?php echo esc_attr($tab_label); ?>">
    <?php foreach ($tabs as $tab): ?>
      <button data-role="tab" data-controls="<?php echo esc_attr($tab['id']); ?>">
        <?php echo esc_html($tab['title']); ?>
      </button>
    <?php endforeach; ?>
  </div>
  
  <?php foreach ($tabs as $tab): ?>
    <div data-role="tabpanel" id="<?php echo esc_attr($tab['id']); ?>">
      <?php echo wp_kses_post($tab['content']); ?>
    </div>
  <?php endforeach; ?>
</div>
```

---

## Appendix B: Technical Specifications

### File Structure

```
focus-patterns/
├── src/
│   ├── core/
│   │   ├── index.ts
│   │   ├── base-pattern.ts
│   │   └── utils.ts
│   ├── patterns/
│   │   ├── tabs/
│   │   │   ├── index.ts
│   │   │   ├── tabs.ts
│   │   │   └── tabs.test.ts
│   │   └── index.ts
│   └── index.ts
├── tests/
│   ├── e2e/
│   │   └── tabs.spec.ts
│   └── setup.ts
├── docs/
│   ├── getting-started.md
│   ├── api/
│   └── examples/
├── demo/
│   ├── index.html
│   └── examples/
│       ├── minimal.css      # Basic unstyled example
│       ├── modern.css       # Modern design
│       └── bootstrap.css    # Bootstrap-style
├── rollup.config.js
├── tsconfig.json
├── package.json
└── README.md
```

### Bundle Size Targets

- **Tabs only:** < 5KB minified + gzipped
- **Full library (4 patterns):** < 15KB minified + gzipped
- **TypeScript definitions:** < 5KB

### Performance Targets

- **Initialization:** < 10ms per instance
- **Interaction response:** < 16ms (60fps)
- **Memory overhead:** < 50KB per instance
- **No memory leaks:** Must pass leak detection tests

---

## Appendix C: Accessibility Checklist

### Tabs Pattern Compliance

- [ ] `role="tablist"` on container
- [ ] `role="tab"` on each tab button
- [ ] `role="tabpanel"` on each panel
- [ ] `aria-label` or `aria-labelledby` on tablist
- [ ] `aria-controls` links tabs to panels
- [ ] `aria-selected="true"` on active tab
- [ ] `aria-selected="false"` on inactive tabs
- [ ] `aria-labelledby` links panels to tabs
- [ ] `tabindex="0"` on active tab only
- [ ] `tabindex="-1"` on inactive tabs
- [ ] Left/Right arrow navigation works
- [ ] Home/End keys work
- [ ] Focus visible at all times
- [ ] Screen reader announces tab changes
- [ ] Panel content is announced when shown
- [ ] No keyboard traps
- [ ] Works with browser zoom (200%+)
- [ ] Works in high contrast mode
- [ ] Works with reduced motion

