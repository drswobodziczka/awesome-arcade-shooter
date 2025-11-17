# Coding Guidelines

## TDD Methodology

All features must be implemented using Test-Driven Development:

### Development Iteration Cycle

1. **Establish Requirements**
   - Define clear, testable acceptance criteria
   - Break down into small, incremental steps

2. **Write Tests**
   - Write failing tests first
   - Cover edge cases and error conditions

3. **Implement**
   - Write minimal code to pass tests
   - Keep implementation simple and focused

4. **CRITICAL REVIEW** ⚠️
   - **STOP** before moving forward
   - Verify:
     - ✓ Requirements met?
     - ✓ Good practices maintained?
     - ✓ Tests implemented and passing?
     - ✓ Requirements not internally contradictory?

5. **Iterate**
   - Repeat steps 1-4 until complete per specification
   - Refactor when all tests pass

## Core Principles

- Red → Green → Refactor
- Small commits, frequent tests
- No untested code
