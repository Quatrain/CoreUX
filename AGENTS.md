# Agent Instructions & Collaboration Guidelines — Quatrain CoreUX

> **Audience**: AI Coding Agents & Human Pair Programming  
> **Ecosystem**: Quatrain Design System & React/Preact Components  
> **Knowledge Authority**: [AGENTS.okf Knowledge Base](file:///Users/crapougnax/CODE/CRAPOUGNAX/AGENTS.okf/content/index.md)

---

## 🧭 1. Base Guidelines & OKF Routing

All AI agent operations in this workspace **MUST** comply with the standards defined in the centralized knowledge base:
1. 👉 **[Root Rules Index](file:///Users/crapougnax/CODE/CRAPOUGNAX/AGENTS.okf/content/index.md)**
2. 👉 **[Author's Online Gist](https://gist.github.com/crapougnax/47971b85aa73dd702f4372a89858111c)**

---

## 🎨 2. Frontend & UX Design Principles

When building or updating UI components, cards, forms, and grid layouts in CoreUX:

- **High-Glare Mobile UX**: [high-glare-mobile-ux.md](file:///Users/crapougnax/CODE/CRAPOUGNAX/AGENTS.okf/content/frontend-ux/high-glare-mobile-ux.md)
  - 540px container max-width on mobile.
  - Large touch targets (min 76px action rows, 96px bottom navigation bars).
  - Modern, ultra-readable typography (Space Grotesk headers, Nunito body).
- **Contrast & Status Tokens**: [contrast-and-status-tokens.md](file:///Users/crapougnax/CODE/CRAPOUGNAX/AGENTS.okf/content/frontend-ux/contrast-and-status-tokens.md)
  - High-contrast tokens, dark muted card backgrounds with vivid status accents.
  - Explicit dark navy text on yellow/alert pills for maximum outdoor readability.
- **Static CSS Hygiene**: [static-css-and-interaction-hygiene.md](file:///Users/crapougnax/CODE/CRAPOUGNAX/AGENTS.okf/content/frontend-ux/static-css-and-interaction-hygiene.md)
  - Zero dynamic inline styles (`style={{ ... }}`).
  - Pure static CSS with CSS custom properties and modern native pseudo-selectors (`:hover`, `:active`, `:has()`).
- **React Performance & Memoization**: [react-performance-and-memoization.md](file:///Users/crapougnax/CODE/CRAPOUGNAX/AGENTS.okf/content/frontend-ux/react-performance-and-memoization.md)
  - Strict `React.memo`, `useCallback`, and atomic state to prevent high-frequency re-renders.

---

## 🔄 3. GitFlow & Contribution Protocol

- **Default Branch**: Branch out from `develop`: `feat/<issue-id>-<description>` or `fix/...`
- **Conventional Commits**: Format `<type>(<scope>): <summary>` in International English.
- **Pull Requests**: Target `develop`, include closing keywords (`Closes #<issue-id>`).
