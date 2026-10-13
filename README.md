# Enterprise UI Test Automation Framework (Playwright + TypeScript)

![Playwright Tests](https://github.com/Samqwe123/automation-test-framework-poc/actions/workflows/playwright.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.40+-2EAD33?logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)

An automated end-to-end (E2E) testing suite engineered for web applications using **Playwright**, **TypeScript**, and the **Page Object Model (POM)** architectural design pattern. Includes a cloud-based **GitHub Actions** CI/CD pipeline executing regression suites headlessly across multi-browser engines on every commit.

---

## Key Architecture & Design Patterns

* **Page Object Model (POM):** Complete separation of UI page locators/actions from test specifications for high maintainability and low refactoring friction.
* **Deterministic Synchronization:** Hardened against timing flakiness and state race conditions by enforcing explicit DOM state validations (`toHaveValue`, `toBeVisible`) over non-deterministic timeouts.
* **Cross-Browser & Multi-Worker Pipeline:** Configured for parallel and sequential execution across Chromium, Firefox, and WebKit (Safari) engines.
* **Continuous Integration (CI/CD):** Fully integrated GitHub Actions workflow running headless test executions with automated HTML test artifact generation.

---

## Tech Stack

* **Language:** TypeScript
* **Test Runner / Automation Engine:** Playwright Test
* **Design Pattern:** Page Object Model (POM)
* **CI/CD Orchestration:** GitHub Actions (`Ubuntu-latest`)
* **Reporting:** Playwright Built-in HTML Reporter & Trace Viewer

---

## Directory Structure

```text
├── .github/
│   └── workflows/
│       └── playwright.yml         # CI/CD pipeline workflow configuration
├── pages/                         # Page Object Model layer
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutStepOnePage.ts
│   ├── CheckoutStepTwoPage.ts
│   └── CheckoutCompletePage.ts
├── tests/                         # Test specification layer
│   └── web/
│       ├── saucedemo.spec.ts      # Authentication & route guard specs
│       ├── cart.spec.ts           # Dynamic shopping cart state specs
│       ├── checkout.spec.ts       # End-to-end checkout funnel specs
│       └── inventory.spec.ts      # Inventory specs        
├── playwright.config.ts           # Global framework configurations
├── package.json                   # Dependencies and scripts
└── README.md                      # Framework documentation