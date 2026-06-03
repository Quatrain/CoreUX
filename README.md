# Core UX - Frontend Architecture & UX Brick System for Quatrain

Core UX is the frontend companion monorepo of the **Quatrain** ecosystem. It provides headless state controllers, React bindings, and UI components built on top of **Mantine UI**. 

Following a strict **MVC (Model-View-Controller)** pattern, CoreUX decouples business logic, data validation, and visual rendering. Heavy state management, filtering, and model handling reside in headless, framework-agnostic controllers, keeping your React components lightweight, pure, and easy to maintain.

---

## 🎯 Core Principles

- **Framework-Agnostic Headless Controllers**: Core state and business validation live in pure TypeScript classes (like `CoreUXListManager` and `CoreFormManager`). They are independent of React or any specific rendering library, facilitating testing and long-term maintainability.
- **Strict MVC Separation**: React components subscribe to controller states and handle *only* presentation and user interactions.
- **Consistent & Responsive Design**: Standardized on top of **Mantine UI** for high-quality, modern, accessible, and responsive user experiences.
- **High Performance & Stability**: Built with React performance best practices to avoid unnecessary layout repaints and heavy canvas re-renders.

---

## 📦 Monorepo Architecture & Packages

Core UX is managed as a Yarn monorepo under `packages/`:

### 🧠 Headless Core & Controllers

#### 🟢 `@quatrain/ux`
The foundational package containing shared styles, Mantine configurations, and core headless controllers:
- **`CoreFormManager`**: The core controller managing form state, dirty tracking, validation, and submission flow.
- *Source*: [packages/ux](file:///Users/crapougnax/CODE/QUATRAIN/CoreUX/packages/ux)

#### 🟢 `@quatrain/ux-list`
Headless, framework-agnostic state controller for complex lists and collection grids:
- **`CoreListManager`**: Manages list filtering, sorting, pagination, and multi-selection state.
- Supports decorators to easily plug in custom behavior.
- *Source*: [packages/ux-list](file:///Users/crapougnax/CODE/QUATRAIN/CoreUX/packages/ux-list)
- *Guide*: Refer to [ux-list/HOWTO.md](file:///Users/crapougnax/CODE/QUATRAIN/CoreUX/packages/ux-list/HOWTO.md) for concrete integration patterns.

---

### ⚛️ React Bindings & Components

#### 🔵 `@quatrain/ux-form-react`
React integration for handling forms based on `@quatrain/core` definitions:
- **`useCoreForm`**: React hook subscribing to a `CoreFormManager` instance.
- **`CoreForm`**: Declarative form component that renders input fields automatically based on metadata.
- *Source*: [packages/ux-form-react](file:///Users/crapougnax/CODE/QUATRAIN/CoreUX/packages/ux-form-react)

#### 🔵 `@quatrain/ux-list-react`
React components and hooks designed to work seamlessly with `CoreListManager`:
- **`useCoreList`**: Subscribes React components to list state updates.
- **`CoreList`**: Table/Grid rendering component with automatic pagination, filtering headers, and built-in internationalization support.
- *Source*: [packages/ux-list-react](file:///Users/crapougnax/CODE/QUATRAIN/CoreUX/packages/ux-list-react)
- *Guide*: Refer to [ux-list-react/HOWTO.md](file:///Users/crapougnax/CODE/QUATRAIN/CoreUX/packages/ux-list-react/HOWTO.md) for usage examples.

---

## 🛠️ Development & Tooling

This monorepo uses **Yarn Berry (v4)** and **Turbo** to orchestrate builds, tests, and linting.

### Main Commands

Install all dependencies and resolve workspace portals:
```bash
yarn install
```

Build all packages inside the monorepo:
```bash
yarn build
```

Run Jest test suites across all workspaces:
```bash
yarn test
```

Lint the codebase:
```bash
yarn lint
```

---

## ⚖️ License

CoreUX is released under the **AGPL-3.0** (Affero General Public License). This ensures that any enhancements to the open-source frontend core remain free and accessible to the community.
