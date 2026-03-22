// Test script for the EquationSolver class
class EquationSolver {
    constructor() {
        this.variables = {};
    }

    // Parse and evaluate mathematical expressions
    evaluateExpression(expr, x) {
        try {
            // Replace mathematical functions and operators
            let processedExpr = expr.toLowerCase()
                .replace(/\s/g, '')
                .replace(/\^/g, '**')
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/exp/g, 'Math.exp')
                .replace(/log/g, 'Math.log')
                .replace(/sqrt/g, 'Math.sqrt')
                .replace(/abs/g, 'Math.abs')
                .replace(/pi/g, 'Math.PI')
                .replace(/e/g, 'Math.E');

            // Replace x with the actual value
            processedExpr = processedExpr.replace(/x/g, `(${x})`);

            // Evaluate the expression safely
            return Function('"use strict"; return (' + processedExpr + ')')();
        } catch (error) {
            throw new Error(`Invalid expression: ${error.message}`);
        }
    }

    // Find roots using the bisection method
    findRoots(expr, rangeStart, rangeEnd, tolerance = 0.0001, maxIterations = 1000) {
        const roots = [];
        const step = 0.1;

        // Scan for sign changes to find approximate root locations
        for (let x = rangeStart; x < rangeEnd; x += step) {
            try {
                const y1 = this.evaluateExpression(expr, x);
                const y2 = this.evaluateExpression(expr, x + step);

                // Check for sign change (potential root)
                if (y1 * y2 < 0) {
                    const root = this.bisectionMethod(expr, x, x + step, tolerance, maxIterations);
                    if (root !== null && !roots.some(r => Math.abs(r - root) < tolerance * 10)) {
                        roots.push(root);
                    }
                }
                // Check for exact zero
                else if (Math.abs(y1) < tolerance) {
                    if (!roots.some(r => Math.abs(r - x) < tolerance * 10)) {
                        roots.push(x);
                    }
                }
            } catch (error) {
                // Skip points where function is undefined
                continue;
            }
        }

        return roots.sort((a, b) => a - b);
    }

    // Bisection method for root finding
    bisectionMethod(expr, a, b, tolerance, maxIterations) {
        try {
            let fa = this.evaluateExpression(expr, a);
            let fb = this.evaluateExpression(expr, b);

            if (fa * fb > 0) {
                return null; // No root in this interval
            }

            for (let i = 0; i < maxIterations; i++) {
                const c = (a + b) / 2;
                const fc = this.evaluateExpression(expr, c);

                if (Math.abs(fc) < tolerance || Math.abs(b - a) < tolerance) {
                    return c;
                }

                if (fa * fc < 0) {
                    b = c;
                    fb = fc;
                } else {
                    a = c;
                    fa = fc;
                }
            }

            return (a + b) / 2;
        } catch (error) {
            return null;
        }
    }
}

// Test the solver
console.log('Testing Equation Solver...\n');

const solver = new EquationSolver();

// Test 1: Simple quadratic evaluation
console.log('Test 1: Evaluating x^2 + 2*x - 3 at x=1');
try {
    const result1 = solver.evaluateExpression('x^2 + 2*x - 3', 1);
    console.log(`Result: ${result1} (expected: 0)`);
    console.log(result1 === 0 ? '✓ PASS' : '✗ FAIL');
} catch (e) {
    console.log(`✗ FAIL: ${e.message}`);
}

console.log('\nTest 2: Evaluating sin(x) at x=π/2');
try {
    const result2 = solver.evaluateExpression('sin(x)', Math.PI/2);
    console.log(`Result: ${result2.toFixed(6)} (expected: 1.000000)`);
    console.log(Math.abs(result2 - 1) < 0.000001 ? '✓ PASS' : '✗ FAIL');
} catch (e) {
    console.log(`✗ FAIL: ${e.message}`);
}

console.log('\nTest 3: Finding roots of x^2 + 2*x - 3');
try {
    const roots = solver.findRoots('x^2 + 2*x - 3', -5, 5);
    console.log(`Roots found: [${roots.map(r => r.toFixed(6)).join(', ')}]`);
    console.log('Expected: [-3, 1]');
    
    // Check if we found approximately the right roots
    const expectedRoots = [-3, 1];
    let allFound = true;
    for (const expected of expectedRoots) {
        if (!roots.some(root => Math.abs(root - expected) < 0.001)) {
            allFound = false;
            break;
        }
    }
    console.log(allFound && roots.length === 2 ? '✓ PASS' : '✗ FAIL');
} catch (e) {
    console.log(`✗ FAIL: ${e.message}`);
}

console.log('\nTest 4: Finding roots of sin(x) in [-4, 4]');
try {
    const roots = solver.findRoots('sin(x)', -4, 4);
    console.log(`Roots found: [${roots.map(r => r.toFixed(6)).join(', ')}]`);
    console.log('Expected: approximately [-π, 0, π]');
    
    // Check if we found roots near the expected values
    const expectedApprox = [-Math.PI, 0, Math.PI];
    let foundCount = 0;
    for (const expected of expectedApprox) {
        if (roots.some(root => Math.abs(root - expected) < 0.01)) {
            foundCount++;
        }
    }
    console.log(foundCount >= 2 ? '✓ PASS (found most expected roots)' : '✗ FAIL');
} catch (e) {
    console.log(`✗ FAIL: ${e.message}`);
}

console.log('\nTest 5: Error handling for invalid expression');
try {
    solver.evaluateExpression('invalid_function(x)', 1);
    console.log('✗ FAIL: Should have thrown an error');
} catch (e) {
    console.log('✓ PASS: Correctly caught invalid expression');
}

console.log('\n=== Testing Complete ===');