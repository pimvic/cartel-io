# Testing Guide

Comprehensive testing guide for Kartels.io covering unit tests, integration tests, and end-to-end tests.

---

## Table of Contents

1. [Overview](#overview)
2. [Running Tests](#running-tests)
3. [Unit Tests](#unit-tests)
4. [E2E Tests](#e2e-tests)
5. [Writing Tests](#writing-tests)
6. [CI/CD](#cicd)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Kartels.io uses a comprehensive testing strategy:

- **Unit Tests** - Vitest + Testing Library for component and service testing
- **E2E Tests** - Playwright for end-to-end user flow testing
- **CI/CD** - GitHub Actions for automated testing on every PR

### Testing Stack

- **Vitest** - Fast unit test runner (Vite-native)
- **@testing-library/react** - React component testing utilities
- **@testing-library/user-event** - Simulates user interactions
- **Playwright** - Cross-browser E2E testing
- **GitHub Actions** - CI/CD automation

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests once
bun run test

# Run tests in watch mode (during development)
bun run test:watch

# Run tests with UI (visual interface)
bun run test:ui

# Run tests with coverage report
bun run test:coverage
```

**Coverage reports** are generated in `coverage/` directory.

### E2E Tests

```bash
# Run E2E tests (headless)
bun run test:e2e

# Run E2E tests with UI
bun run test:e2e:ui

# Run E2E tests in debug mode
bun run test:e2e:debug

# Run specific test file
bunx playwright test e2e/auth.spec.ts

# Run tests in specific browser
bunx playwright test --project=chromium
bunx playwright test --project=firefox
bunx playwright test --project=webkit
```

**Test reports** are generated in `playwright-report/` directory.

### Type Checking

```bash
# Run TypeScript type check
bun run typecheck
```

### All Checks (CI equivalent)

```bash
# Run all checks locally
bun run lint && bun run typecheck && bun run test && bun run build
```

---

## Unit Tests

### Test File Structure

```
src/
├── services/
│   ├── auth.service.ts
│   └── auth.service.test.ts       # Unit tests
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Button.test.tsx        # Component tests
└── test/
    ├── setup.ts                   # Global test setup
    └── utils.tsx                  # Test utilities
```

### Example: Service Test

```typescript
// src/services/auth.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as authService from './auth.service';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signIn: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

import { supabase } from '@/integrations/supabase/client';

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sign in user with valid credentials', async () => {
    vi.mocked(supabase.auth.signIn).mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    const result = await authService.signIn({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.user).toBeDefined();
    expect(result.error).toBeNull();
  });
});
```

### Example: Component Test

```typescript
// src/components/ui/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const { user } = renderWithProviders(<Button onClick={handleClick}>Click</Button>);
    
    await user.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Test Utilities

Use `src/test/utils.tsx` for common test helpers:

```typescript
import { renderWithProviders, mockUser, mockSession } from '@/test/utils';

// Render with all providers (Router, Query Client, i18n)
const { getByText } = renderWithProviders(<MyComponent />);

// Use mock data
const testUser = mockUser;
const testSession = mockSession;
```

---

## E2E Tests

### Test File Structure

```
e2e/
├── auth.spec.ts           # Authentication flows
├── dashboard.spec.ts      # Dashboard navigation
└── ...
```

### Example: Auth E2E Test

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login with test credentials', async ({ page }) => {
    await page.goto('/en/login');
    
    await page.getByLabel(/email/i).fill('test@kartels.io');
    await page.getByLabel(/password/i).fill('test');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
```

### Example: Dashboard E2E Test

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login helper
    await page.goto('/en/login');
    await page.getByLabel(/email/i).fill('test@kartels.io');
    await page.getByLabel(/password/i).fill('test');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should navigate to Knowledge Base', async ({ page }) => {
    await page.getByRole('link', { name: /knowledge base/i }).click();
    await expect(page.getByText(/knowledge base/i)).toBeVisible();
  });
});
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:

- Browsers to test (chromium, firefox, webkit)
- Base URL
- Timeouts
- Screenshots/videos on failure
- Parallel execution

---

## Writing Tests

### Unit Test Guidelines

1. **Test one thing at a time**
   ```typescript
   it('should validate email format', () => {
     expect(isValidEmail('test@example.com')).toBe(true);
   });
   ```

2. **Use descriptive test names**
   ```typescript
   it('should return null when user profile does not exist', async () => {
     // ...
   });
   ```

3. **Arrange-Act-Assert pattern**
   ```typescript
   it('should format user display name', () => {
     // Arrange
     const user = { first_name: 'John', last_name: 'Doe' };
     
     // Act
     const result = formatUserDisplayName(user);
     
     // Assert
     expect(result).toBe('John D.');
   });
   ```

4. **Mock external dependencies**
   ```typescript
   vi.mock('@/integrations/supabase/client');
   ```

5. **Test edge cases**
   ```typescript
   it('should handle empty string', () => {
     expect(sanitizeInput('')).toBe('');
   });
   
   it('should handle null values', () => {
     expect(getUserProfile(null)).toBe(null);
   });
   ```

### E2E Test Guidelines

1. **Use semantic locators**
   ```typescript
   // ✅ Good
   await page.getByRole('button', { name: /sign in/i });
   await page.getByLabel(/email/i);
   
   // ❌ Avoid
   await page.locator('#submit-btn');
   await page.locator('.email-input');
   ```

2. **Wait for navigation**
   ```typescript
   await page.getByRole('button', { name: /submit/i }).click();
   await expect(page).toHaveURL(/\/success/);
   ```

3. **Use beforeEach for setup**
   ```typescript
   test.beforeEach(async ({ page }) => {
     await login(page);
   });
   ```

4. **Take screenshots on failure** (auto-configured)

5. **Test across browsers** (use Playwright projects)

---

## CI/CD

### GitHub Actions Workflow

Located at `.github/workflows/ci.yml`, runs on every push and PR:

1. **Lint** - ESLint checks
2. **Type Check** - TypeScript validation
3. **Unit Tests** - Vitest with coverage
4. **Build** - Production build verification
5. **E2E Tests** - Playwright cross-browser tests
6. **Security Scan** - Dependency audit

### Running CI Locally

```bash
# Install dependencies
bun install

# Run all CI checks
bun run lint
bun run typecheck
bun run test
bun run build
bun run test:e2e
```

### CI Status Badges

Add to README.md:

```markdown
![CI](https://github.com/your-org/kartels-io/workflows/CI/badge.svg)
```

---

## Best Practices

### General

- **Write tests first** (TDD) when possible
- **Keep tests simple** - One assertion per test when practical
- **Don't test implementation details** - Test behavior, not internals
- **Use test doubles** - Mock external services (Supabase, APIs)
- **Avoid test interdependence** - Each test should be independent

### Unit Tests

- **Test public APIs only** - Don't test private functions
- **Mock Supabase client** - Never hit real database in unit tests
- **Use `renderWithProviders`** - For components that need Router/Query Client
- **Clean up** - Use `afterEach(cleanup)` (auto-configured)

### E2E Tests

- **Test critical paths** - Login, signup, core features
- **Use test data** - `test@kartels.io` user
- **Keep tests fast** - Don't test every edge case in E2E
- **Run in headless mode** - On CI
- **Retry on flaky tests** - Configured in `playwright.config.ts`

### Coverage Goals

- **Statements**: 70%+
- **Branches**: 65%+
- **Functions**: 70%+
- **Lines**: 70%+

Check coverage:
```bash
bun run test:coverage
open coverage/index.html
```

---

## Troubleshooting

### Common Issues

#### "Test timeout exceeded"

Increase timeout in test:
```typescript
it('slow operation', async () => {
  // ...
}, 15000); // 15 seconds
```

Or globally in `vitest.config.ts`:
```typescript
test: {
  testTimeout: 15000,
}
```

#### "Cannot find module '@/...'"

Check path alias in `vitest.config.ts`:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

#### "Supabase client is not defined"

Mock it properly:
```typescript
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      // ...
    })),
  },
}));
```

#### Playwright "Executable doesn't exist"

Install browsers:
```bash
bunx playwright install
```

#### E2E tests fail on CI but pass locally

- Check timeouts (CI may be slower)
- Ensure test user exists (`test@kartels.io`)
- Check environment variables
- Review CI logs and screenshots

### Debug Tips

**Unit Tests:**
```bash
# Run with UI
bun run test:ui

# Run single test file
bunx vitest run src/services/auth.service.test.ts

# Debug with breakpoints (VS Code)
# Add "debugger" statement and run with debugger
```

**E2E Tests:**
```bash
# Run with UI
bun run test:e2e:ui

# Debug mode (step through tests)
bun run test:e2e:debug

# Run specific test
bunx playwright test e2e/auth.spec.ts -g "should login"

# Show browser
bunx playwright test --headed
```

---

## Additional Resources

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Happy Testing! 🧪**
