# Enterprise Quality Engineering & Test Architecture Framework (Playwright + TypeScript)

![Playwright Tests](https://github.com/Samqwe123/automation-test-framework-poc/actions/workflows/playwright.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.40+-2EAD33?logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)

A dual-layer, production-grade test automation architecture engineered for both **Web UI E2E User Funnels** and **REST API Service Contracts**. Built with **TypeScript**, **Playwright**, and the **Page Object Model (POM)** pattern, backed by a **GitHub Actions** CI/CD pipeline executing headless cross-browser regression suites on every pull request.

---

## Key Architecture & Engineering Highlights

- **Page Object Model (POM):** Decouples UI page locators and user interactions from test logic for high maintainability and minimal refactoring overhead.
- **REST API Abstraction & Contract Validation:** Features a modular API service layer (`BookingService.ts`) with runtime **JSON Schema assertions (`Ajv`)** to catch backend breaking changes and response payload mismatches.
- **Full E2E API Lifecycle Testing:** Validates complex state transitions and entity lifecycles from token authorization through resource creation, updates, and deletion (`full_booking_lifecycle.spec.ts`).
- **Dynamic State & Data Generation:** Integrates dynamic payload generation via `dataGenerator.ts` (`@faker-js/faker`) to eliminate static data pollution and enforce strict test isolation.
- **Deterministic Synchronization:** Eliminates arbitrary timing delays (`page.waitForTimeout`) by relying strictly on explicit state assertions (`toBeVisible`, `toHaveValue`) to eradicate pipeline flakiness.
- **CI/CD Pipeline & Artifacts:** Integrated GitHub Actions workflow running headless multi-browser suites (Chromium, Firefox, WebKit) with automated HTML test report generation and trace artifact uploads on pipeline failures.

---

## Tech Stack

- **Language:** TypeScript
- **Automation Engine:** Playwright Test
- **Design Patterns:** Page Object Model (POM), Service Abstraction Layer
- **Validation & Utility Libraries:** `Ajv` (JSON Schema Contract Validation), `@faker-js/faker` (Dynamic Data Generator)
- **CI/CD Orchestration:** GitHub Actions (`ubuntu-latest`)
- **Reporting & Debugging:** Playwright HTML Reporter, Trace Viewer, Video & Artifact Capture

---

## Directory Structure

```text
├── .github/
│   └── workflows/
│       └── playwright.yml              # GitHub Actions CI/CD workflow pipeline
├── pages/                               # Page Object Model layer (UI Locators & Actions)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutStepOnePage.ts
│   ├── CheckoutStepTwoPage.ts
│   └── CheckoutCompletePage.ts
├── services/                            # API Service Abstraction layer (HTTP Requests)
│   └── BookingService.ts
├── tests/                               # Test Execution layer
│   ├── api/                             # REST API automation specs
│   │   ├── auth-booking.spec.ts        # Authentication token & booking state specs
│   │   ├── full_booking_lifecycle.spec.ts # E2E booking lifecycle & CRUD specs
│   │   └── users.spec.ts               # User CRUD endpoint validation specs
│   └── web/                             # Web UI E2E automation specs
│       ├── cart.spec.ts                # Dynamic shopping cart state specs
│       ├── checkout.spec.ts            # End-to-end checkout funnel specs
│       ├── inventory.spec.ts           # Product catalog & filtering specs
│       └── saucedemo.spec.ts           # Authentication & route guard specs
├── utils/                               # Utilities & schema contract validators
│   ├── dataGenerator.ts                # Dynamic mock data generator (@faker-js/faker)
│   └── schemaValidator.ts               # Ajv JSON Schema validation engine
├── playwright.config.ts                # Global execution, runner, & browser configs
├── package.json                         # Dependencies & execution scripts
└── README.md                            # Framework documentation
```

---

## Quick Start & Execution Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Installation

Clone the repository and install framework dependencies alongside required browser binaries:

```bash
# Clone repository
git clone [https://github.com/Samqwe123/automation-test-framework-poc.git](https://github.com/Samqwe123/automation-test-framework-poc.git)
cd automation-test-framework-poc

# Install npm packages
npm install

# Install Playwright browser engines & OS dependencies
npx playwright install --with-deps
```

### 2. Running Tests Locally

```bash
# Execute full test suite (UI + API) headlessly across all browsers
npx playwright test

# Execute UI E2E tests only in headed mode
npx playwright test tests/web/ --headed

# Execute REST API contract & lifecycle tests only
npx playwright test tests/api/

# Execute tests on a specific browser engine (Chromium)
npx playwright test --project=chromium
```

### 3. Test Reporting & Tracing

Generate and inspect local HTML test execution reports, execution timelines, and failure traces:

```bash
# Open interactive HTML test report
npx playwright show-report

# Inspect detailed trace zip files for debugging failures
npx playwright show-trace test-results/<test-folder>/trace.zip
```