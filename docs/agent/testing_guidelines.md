# Unit Testing Guidelines

## Tech Stack

- **Framework**: Vitest 4.0.9
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.2
- **Commands**:
  - `npm test` - run all tests
  - `npm run test:watch` - watch mode

## File Organization

```
src/
  ├── feature.ts
  └── feature.test.ts  # co-located with source
```

- Place tests next to source files: `feature.ts` → `feature.test.ts`
- Use `.test.ts` extension (not `.spec.ts`)
- Root: `PoCs/arcade-shooter/src/`

## Test Structure

### AAA Pattern (Arrange-Act-Assert)

```typescript
it('descriptive test name', () => {
  // Arrange - setup test data
  const input = { x: 0, y: 0, width: 10, height: 10 };

  // Act - execute function
  const result = checkCollision(input, other);

  // Assert - verify outcome
  expect(result).toBe(true);
});
```

### Naming Convention

- **describe**: Function/module name - `describe('checkCollision', () => {})`
- **it**: Behavior being tested - `it('detects collision when objects overlap', () => {})`
- Use active voice, not "should" - "detects collision" not "should detect collision"

## What to Test

### ✅ DO Test

- **Pure functions** (like `checkCollision`) - highest priority
- **Edge cases**: null, undefined, empty, zero, negative
- **Boundaries**: min/max values, touching edges
- **Error conditions**: invalid inputs, exceptions
- **Business logic**: core game mechanics

### ❌ DON'T Test

- Framework internals (Vite, browser APIs)
- Third-party libraries
- Simple getters/setters without logic
- Configuration files

## Rules of Thumb

1. **"None, One, Some"**: Test empty (0), single (1), multiple (>1) items
2. **Coverage Target**: 75-85% for logic, lower OK for UI/rendering
3. **Test Independence**: Each test runs in isolation, no shared state
4. **Fast Tests**: Unit tests should run in milliseconds
5. **One Assertion Focus**: Test one behavior per `it()` block

## Mocking Strategy

### When to Mock

```typescript
// Mock external dependencies
vi.mock('./api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mocked' }))
}));

// Mock in test if outcome-critical (Arrange phase)
it('handles API error', () => {
  const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
  // ... test
});
```

### When NOT to Mock

- Pure functions (test directly)
- Simple utility functions
- TypeScript types/interfaces

## TypeScript Best Practices

```typescript
// Use type inference from Vitest
import { describe, it, expect, vi, type Mock } from 'vitest';

// Type your mocks
const mockFunction = vi.fn<[number, string], boolean>();

// Use generics for fixtures
function createTestEntity<T>(overrides?: Partial<T>): T {
  return { ...defaults, ...overrides } as T;
}
```

## Coverage Guidelines

- **75%+**: Core game logic (collision, physics, scoring)
- **50-75%**: Utilities, helpers
- **<50%**: Acceptable for rendering, UI initialization

Run coverage: add `"test:coverage": "vitest run --coverage"` to package.json

## Common Patterns

### Testing Ranges

```typescript
it('detects collision when objects overlap', () => {
  const a = { x: 0, y: 0, width: 10, height: 10 };
  const b = { x: 5, y: 5, width: 10, height: 10 };
  expect(checkCollision(a, b)).toBe(true);
});

it('detects no collision when objects are adjacent', () => {
  const a = { x: 0, y: 0, width: 10, height: 10 };
  const b = { x: 10, y: 0, width: 10, height: 10 }; // touching edge
  expect(checkCollision(a, b)).toBe(false);
});
```

### Testing Errors

```typescript
it('throws on invalid input', () => {
  expect(() => divide(10, 0)).toThrow('Division by zero');
});
```

### Async Testing

```typescript
it('fetches player data', async () => {
  const data = await loadPlayer(123);
  expect(data.id).toBe(123);
});
```

## Vitest Config (vite.config.ts)

```typescript
test: {
  globals: true,        // use global describe/it/expect
  environment: 'jsdom', // if testing DOM
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    exclude: ['**/*.test.ts', '**/types.ts']
  }
}
```

## Red Flags

- Tests that depend on execution order
- Tests that pass/fail randomly (flaky)
- Tests that take >1s (integration, not unit)
- Testing implementation details vs. behavior
- 100% coverage obsession (diminishing returns)

## Maintenance

- **Green build**: Never commit failing tests
- **Update tests with code**: Tests = living documentation
- **Delete obsolete tests**: Remove tests for deleted features
- **Review test failures**: Don't ignore, fix or update tests
