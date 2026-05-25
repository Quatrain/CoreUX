# CoreUI - Frontend Architecture & UI Brick System for Quatrain

CoreUI is the frontend companion monorepo of the **Quatrain** ecosystem. It provides headless state controllers, React bindings, and UI components built on top of **Mantine UI**. 

Following a strict **MVC (Model-View-Controller)** pattern, CoreUI decouples business logic, data validation, and visual rendering. Heavy state management, filtering, and model handling reside in headless, framework-agnostic controllers, keeping your React components lightweight, pure, and easy to maintain.

---

## 🎯 Core Principles

- **Framework-Agnostic Headless Controllers**: Core state and business validation live in pure TypeScript classes (like `CoreListManager` and `CoreFormManager`). They are independent of React or any specific rendering library, facilitating testing and long-term maintainability.
- **Strict MVC Separation**: React components subscribe to controller states and handle *only* presentation and user interactions.
- **Consistent & Responsive Design**: Standardized on top of **Mantine UI** for high-quality, modern, accessible, and responsive user experiences.
- **High Performance & Stability**: Built with React performance best practices to avoid unnecessary layout repaints and heavy canvas re-renders.

---

## 📦 Monorepo Architecture & Packages

CoreUI is managed as a Yarn monorepo under `packages/`:

### 🧠 Headless Core & Controllers

#### 🟢 `@quatrain/ui`
The foundational package containing shared styles, Mantine configurations, and core headless controllers:
- **`CoreFormManager`**: The core controller managing form state, dirty tracking, validation, and submission flow.
- *Source*: [packages/ui](file:///Users/crapougnax/CODE/QUATRAIN/CoreUI/packages/ui)

#### 🟢 `@quatrain/ui-list`
Headless, framework-agnostic state controller for complex lists and collection grids:
- **`CoreListManager`**: Manages list filtering, sorting, pagination, and multi-selection state.
- Supports decorators to easily plug in custom behavior.
- *Source*: [packages/ui-list](file:///Users/crapougnax/CODE/QUATRAIN/CoreUI/packages/ui-list)
- *Guide*: Refer to [ui-list/HOWTO.md](file:///Users/crapougnax/CODE/QUATRAIN/CoreUI/packages/ui-list/HOWTO.md) for concrete integration patterns.

---

### ⚛️ React Bindings & Components

#### 🔵 `@quatrain/ui-form-react`
React integration for handling forms based on `@quatrain/core` definitions:
- **`useCoreForm`**: React hook subscribing to a `CoreFormManager` instance.
- **`CoreForm`**: Declarative form component that renders input fields automatically based on metadata.
- *Source*: [packages/ui-form-react](file:///Users/crapougnax/CODE/QUATRAIN/CoreUI/packages/ui-form-react)

#### 🔵 `@quatrain/ui-list-react`
React components and hooks designed to work seamlessly with `CoreListManager`:
- **`useCoreList`**: Subscribes React components to list state updates.
- **`CoreList`**: Table/Grid rendering component with automatic pagination, filtering headers, and built-in internationalization support.
- *Source*: [packages/ui-list-react](file:///Users/crapougnax/CODE/QUATRAIN/CoreUI/packages/ui-list-react)
- *Guide*: Refer to [ui-list-react/HOWTO.md](file:///Users/crapougnax/CODE/QUATRAIN/CoreUI/packages/ui-list-react/HOWTO.md) for usage examples.

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

CoreUI is released under the **AGPL-3.0** (Affero General Public License). This ensures that any enhancements to the open-source frontend core remain free and accessible to the community.
