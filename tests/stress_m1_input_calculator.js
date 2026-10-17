/**
 * @file tests/stress_m1_input_calculator.js
 * @description Adversarial empirical stress testing for controls input sanitization and complexity calculator.
 *
 * Runs under Node.js v18+.
 */

const path = require('path');
const fs = require('fs');

// 1. Mock window / globalThis environment
global.window = global;
global.document = {
  getElementById: () => null,
  activeElement: null,
  body: { classList: { add: () => {}, remove: () => {} } },
  addEventListener: () => {}
};

// 2. Load implementation files
require('../js/components/controls.js');
require('../js/components/calculator.js');

const Controls = global.AlgoSystem.components.Controls;
const Calculator = global.AlgoSystem.components.Calculator;

if (!Controls || !Calculator) {
  console.error('FATAL: Failed to load Controls or Calculator components');
  process.exit(1);
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${testName} ${details ? '- ' + details : ''}`);
    failureDetails.push({ testName, details });
  }
}

console.log('================================================================');
console.log('=== EMPIRICAL STRESS TEST SUITE: CONTROLS & CALCULATOR (M1) ===');
console.log('================================================================\n');

// ============================================================================
// SUITE 1: CONTROLS INPUT SANITIZATION (sanitizeArrayInput)
// ============================================================================
console.log('--- SUITE 1: Input Parsing & Sanitization Stress Tests ---');

// 1.1 Empty & Nullish Inputs
console.log('\n[1.1 Empty & Nullish Inputs]');
{
  const r1 = Controls.sanitizeArrayInput('');
  assert(r1.success === false && r1.error.includes('不能为空'), 'Empty string "" is rejected');

  const r2 = Controls.sanitizeArrayInput('   ');
  assert(r2.success === false && r2.error.includes('为空'), 'Whitespace string "   " is rejected');

  const r3 = Controls.sanitizeArrayInput(null);
  assert(r3.success === false, 'null is rejected gracefully without throwing');

  const r4 = Controls.sanitizeArrayInput(undefined);
  assert(r4.success === false, 'undefined is rejected gracefully without throwing');

  const r5 = Controls.sanitizeArrayInput(12345);
  assert(r5.success === false, 'Non-string number 12345 is rejected gracefully');

  const r6 = Controls.sanitizeArrayInput({});
  assert(r6.success === false, 'Object input {} is rejected gracefully');

  const r7 = Controls.sanitizeArrayInput('[]');
  assert(r7.success === false && r7.error.includes('为空'), 'Empty brackets "[]" is rejected as empty');

  const r8 = Controls.sanitizeArrayInput('()');
  assert(r8.success === false && r8.error.includes('为空'), 'Empty parentheses "()" is rejected as empty');
}

// 1.2 Whitespace & Delimiter Robustness
console.log('\n[1.2 Whitespace & Delimiter Robustness]');
{
  const r1 = Controls.sanitizeArrayInput('1, 2, 3, 4, 5');
  assert(r1.success === true && JSON.stringify(r1.data) === JSON.stringify([1, 2, 3, 4, 5]),
    'Standard comma-space format parsed correctly');

  const r2 = Controls.sanitizeArrayInput('1 2 3 4 5');
  assert(r2.success === true && JSON.stringify(r2.data) === JSON.stringify([1, 2, 3, 4, 5]),
    'Space-separated format parsed correctly');

  const r3 = Controls.sanitizeArrayInput('1,2,3,4,5');
  assert(r3.success === true && JSON.stringify(r3.data) === JSON.stringify([1, 2, 3, 4, 5]),
    'Dense comma-separated format parsed correctly');

  const r4 = Controls.sanitizeArrayInput('   1 ,  2 ,   3   , 4 , 5   ');
  assert(r4.success === true && JSON.stringify(r4.data) === JSON.stringify([1, 2, 3, 4, 5]),
    'Messy whitespace & spaces parsed correctly');

  const r5 = Controls.sanitizeArrayInput(',,, 1, 2, 3 ,,,');
  assert(r5.success === true && JSON.stringify(r5.data) === JSON.stringify([1, 2, 3]),
    'Leading & trailing multiple commas parsed correctly');

  const r6 = Controls.sanitizeArrayInput(',,,,,');
  assert(r6.success === false, 'Only commas ",,,,," rejected gracefully');

  const r7 = Controls.sanitizeArrayInput('10，20，30，40');
  assert(r7.success === true && JSON.stringify(r7.data) === JSON.stringify([10, 20, 30, 40]),
    'Chinese full-width commas "，" normalized and parsed correctly');

  const r8 = Controls.sanitizeArrayInput('[10, 20, 30]');
  assert(r8.success === true && JSON.stringify(r8.data) === JSON.stringify([10, 20, 30]),
    'Bracketed array "[10, 20, 30]" parsed correctly');

  const r9 = Controls.sanitizeArrayInput('(10, 20, 30)');
  assert(r9.success === true && JSON.stringify(r9.data) === JSON.stringify([10, 20, 30]),
    'Parenthesized list "(10, 20, 30)" parsed correctly');

  const r10 = Controls.sanitizeArrayInput('{10, 20, 30}');
  assert(r10.success === true && JSON.stringify(r10.data) === JSON.stringify([10, 20, 30]),
    'Braced set "{10, 20, 30}" parsed correctly');
}

// 1.3 Invalid Characters & Non-numeric Strings
console.log('\n[1.3 Invalid Characters & Non-numeric Strings]');
{
  const r1 = Controls.sanitizeArrayInput('1, 2, abc, 4');
  assert(r1.success === false && r1.error.includes('abc'),
    'Invalid characters "1, 2, abc, 4" rejected with specific message');

  const r2 = Controls.sanitizeArrayInput('1, 2, 3.14.15, 4');
  assert(r2.success === false && r2.error.includes('3.14.15'),
    'Malformed number "3.14.15" rejected');

  const r3 = Controls.sanitizeArrayInput('1, 2, @#$%, 4');
  assert(r3.success === false, 'Symbols "@#$%" rejected');

  const r4 = Controls.sanitizeArrayInput('NaN, 1, 2');
  assert(r4.success === false && r4.error.includes('NaN'),
    'String "NaN" rejected as invalid character');

  const r5 = Controls.sanitizeArrayInput('1, 2, undefined, 4');
  assert(r5.success === false && r5.error.includes('undefined'),
    'String "undefined" rejected');

  const r6 = Controls.sanitizeArrayInput('1, 2, null, 4');
  assert(r6.success === false && r6.error.includes('null'),
    'String "null" rejected');
}

// 1.4 Array Length Boundary & Clamping (N in [2, 35])
console.log('\n[1.4 Array Length Boundary & Clamping]');
{
  const r0 = Controls.sanitizeArrayInput('');
  assert(r0.success === false, 'Length 0 rejected');

  const r1 = Controls.sanitizeArrayInput('42');
  assert(r1.success === false && r1.error.includes('至少需要 2 个数字'),
    'Length 1 ("42") rejected because minimum is 2 items');

  const r2 = Controls.sanitizeArrayInput('10, 20');
  assert(r2.success === true && r2.data.length === 2 && !r2.warning,
    'Exact boundary N = 2 accepted without warning');

  const arr35 = Array.from({ length: 35 }, (_, i) => i + 1);
  const r35 = Controls.sanitizeArrayInput(arr35.join(', '));
  assert(r35.success === true && r35.data.length === 35 && !r35.warning,
    'Exact boundary N = 35 accepted without warning');

  const arr36 = Array.from({ length: 36 }, (_, i) => i + 1);
  const r36 = Controls.sanitizeArrayInput(arr36.join(', '));
  assert(r36.success === true && r36.data.length === 35 && r36.warning && r36.warning.includes('自动截断前 35 项'),
    'Boundary N = 36 clamped to 35 with warning');

  const arr1000 = Array.from({ length: 1000 }, (_, i) => (i % 500) + 1);
  const r1000 = Controls.sanitizeArrayInput(arr1000.join(', '));
  assert(r1000.success === true && r1000.data.length === 35 && r1000.warning,
    'Stress test N = 1000 clamped to 35 gracefully');

  const arr50000 = Array.from({ length: 50000 }, (_, i) => (i % 100));
  const r50000 = Controls.sanitizeArrayInput(arr50000.join(', '));
  assert(r50000.success === true && r50000.data.length === 35 && r50000.warning,
    'Extreme stress test N = 50,000 clamped to 35 gracefully without crash');
}

// 1.5 Value Range Boundaries & Extreme Numbers ([-999, 9999])
console.log('\n[1.5 Value Range Boundaries & Extreme Numbers]');
{
  const r1 = Controls.sanitizeArrayInput('-999, 0, 10, 9999');
  assert(r1.success === true && JSON.stringify(r1.data) === JSON.stringify([-999, 0, 10, 9999]),
    'Exact boundary values -999 and 9999 accepted');

  const r2 = Controls.sanitizeArrayInput('-1000, 0, 10');
  assert(r2.success === false && r2.error.includes('超出安全边界'),
    'Below minimum -1000 rejected');

  const r3 = Controls.sanitizeArrayInput('0, 10, 10000');
  assert(r3.success === false && r3.error.includes('超出安全边界'),
    'Above maximum 10000 rejected');

  const r4 = Controls.sanitizeArrayInput('1e12, 1, 2');
  assert(r4.success === false && r4.error.includes('超出安全边界'),
    'Extreme number 1e12 rejected as out of bounds');

  const r5 = Controls.sanitizeArrayInput('-99999, 1, 2');
  assert(r5.success === false && r5.error.includes('超出安全边界'),
    'Extreme negative number -99999 rejected as out of bounds');

  const r6 = Controls.sanitizeArrayInput('Infinity, 1, 2');
  assert(r6.success === false && r6.error.includes('超出安全边界'),
    'String "Infinity" rejected as out of bounds');

  const r7 = Controls.sanitizeArrayInput('-Infinity, 1, 2');
  assert(r7.success === false && r7.error.includes('超出安全边界'),
    'String "-Infinity" rejected as out of bounds');

  const r8 = Controls.sanitizeArrayInput('1.4, 2.6, 3.5');
  assert(r8.success === true && JSON.stringify(r8.data) === JSON.stringify([1, 3, 4]),
    'Floating point numbers rounded to nearest integer (Math.round)');
}


// ============================================================================
// SUITE 2: COMPLEXITY CALCULATOR CALCULATION ENGINE
// ============================================================================
console.log('\n--- SUITE 2: Complexity Calculator Engine Stress Tests ---');

// 2.1 parseN string parsing
console.log('\n[2.1 parseN String Parsing]');
{
  const rec1 = Calculator.recommend('100');
  assert(rec1.timeComplexity === 'O(N³)', 'N = 100 parsed and evaluated to O(N³)');

  const rec2 = Calculator.recommend('1e5');
  assert(rec2.timeComplexity === 'O(N log N)', 'N = "1e5" (100,000) parsed and evaluated to O(N log N)');

  const rec3 = Calculator.recommend('10^6');
  assert(rec3.timeComplexity === 'O(N log N)', 'N = "10^6" (1,000,000) parsed: 2e7 ops <= 1e8 ops evaluates to O(N log N)');

  const rec4 = Calculator.recommend('10^18');
  assert(rec4.timeComplexity === 'O(log N)', 'N = "10^18" parsed and evaluated to O(log N)');

  const rec5 = Calculator.recommend('200000');
  assert(rec5.timeComplexity === 'O(N log N)', 'N = 200000 evaluated to O(N log N)');

  const recInvalid = Calculator.recommend('invalid_abc');
  assert(recInvalid.timeComplexity === 'O(N log N)' && recInvalid.maxOps === 1e8,
    'Invalid input string falls back gracefully to default 200,000');

  const recNull = Calculator.recommend(null);
  assert(recNull.timeComplexity === 'O(N log N)' && recNull.maxOps === 1e8,
    'null falls back gracefully to default 200,000');
}

// 2.2 Boundary values: N in {0, 1, 10, 11, 20, 100, 1000, 10^4, 10^5, 10^6, 10^7, 10^8, 10^9, 10^18}
console.log('\n[2.2 Boundary Values calculateComplexity(N, 1.0, "cpp")]');
const boundaryScales = [
  { N: 0, expectedOptimal: 'O(N!)', note: '0! = 1 ops' },
  { N: 1, expectedOptimal: 'O(N!)', note: '1! = 1 ops' },
  { N: 10, expectedOptimal: 'O(N!)', note: '10! = 3.6e6 ops <= 1.5e8' },
  { N: 11, expectedOptimal: 'O(N!)', note: '11! = 3.99e7 ops <= 1.5e8' },
  { N: 12, expectedOptimal: 'O(2^N)', note: '12! = 4.79e8 > 1.5e8, 2^12 = 4096 ops' },
  { N: 20, expectedOptimal: 'O(2^N)', note: '2^20 = 1.05e6 ops <= 1.5e8' },
  { N: 27, expectedOptimal: 'O(2^N)', note: '2^27 = 1.34e8 ops <= 1.5e8' },
  { N: 28, expectedOptimal: 'O(N³)', note: '2^28 = 2.68e8 > 1.5e8, 28^3 = 21952 ops' },
  { N: 100, expectedOptimal: 'O(N³)', note: '100^3 = 1e6 ops <= 1.5e8' },
  { N: 500, expectedOptimal: 'O(N³)', note: '500^3 = 1.25e8 ops <= 1.5e8' },
  { N: 1000, expectedOptimal: 'O(N²)', note: '1000^3 = 1e9 > 1.5e8, 1000^2 = 1e6 ops' },
  { N: 10000, expectedOptimal: 'O(N²)', note: '10000^2 = 1e8 ops <= 1.5e8' },
  { N: 100000, expectedOptimal: 'O(N log N)', note: '100000^2 = 1e10 > 1.5e8, 1e5 * 17 = 1.7e6 ops' },
  { N: 200000, expectedOptimal: 'O(N log N)', note: '2e5 * 18 = 3.6e6 ops <= 1.5e8' },
  { N: 1000000, expectedOptimal: 'O(N log N)', note: '1e6 * 20 = 2e7 ops <= 1.5e8' },
  { N: 10000000, expectedOptimal: 'O(N)', note: '1e7 * 24 = 2.4e8 > 1.5e8, 1e7 ops <= 1.5e8' },
  { N: 100000000, expectedOptimal: 'O(N)', note: '1e8 ops <= 1.5e8' },
  { N: 1000000000, expectedOptimal: 'O(√N)', note: '1e9 > 1.5e8, sqrt(1e9) = 31622 ops' },
  { N: 1e18, expectedOptimal: 'O(log N)', note: 'sqrt(1e18) = 1e9 > 1.5e8, log2(1e18) = 60 ops' }
];

for (const b of boundaryScales) {
  const res = Calculator.calculateComplexity(b.N, 1.0, 'cpp');
  assert(res && typeof res === 'object', `calculateComplexity(${b.N}) returned valid object`);
  assert(res.maxBudget === 1e8, `calculateComplexity(${b.N}) maxBudget is 1e8 ops`);
  assert(res.optimalComplexity === b.expectedOptimal,
    `N = ${b.N} optimalComplexity expected '${b.expectedOptimal}', got '${res.optimalComplexity}' (${b.note})`);

  // Verify all 9 rows are mathematically well-formed (no NaNs)
  let allRowsValid = true;
  for (const row of res.rows) {
    if (isNaN(row.ops)) {
      allRowsValid = false;
      console.error(`Row ${row.name} has NaN ops for N = ${b.N}`);
    }
    if (isNaN(row.estMs)) {
      allRowsValid = false;
      console.error(`Row ${row.name} has NaN estMs for N = ${b.N}`);
    }
    if (!['optimal', 'feasible', 'tle'].includes(row.status)) {
      allRowsValid = false;
      console.error(`Row ${row.name} has invalid status '${row.status}' for N = ${b.N}`);
    }
  }
  assert(allRowsValid, `All 9 complexity rows well-formed for N = ${b.N}`);
}

// 2.3 Mathematical Overflow Protection Stress Testing
console.log('\n[2.3 Mathematical Overflow & Extreme Values]');
{
  // Test factorial overflow guards
  const resN21 = Calculator.calculateComplexity(21, 1.0, 'cpp');
  const factRow21 = resN21.rows.find(r => r.name === 'O(N!)');
  assert(factRow21.ops === Infinity && factRow21.status === 'tle',
    'safeFactorial guards N > 20 by returning Infinity and status TLE');

  const resN100 = Calculator.calculateComplexity(100, 1.0, 'cpp');
  const factRow100 = resN100.rows.find(r => r.name === 'O(N!)');
  assert(factRow100.ops === Infinity && factRow100.status === 'tle',
    'safeFactorial handles N = 100 gracefully as Infinity');

  // Test 2^N overflow guards
  const resPow60 = Calculator.calculateComplexity(60, 1.0, 'cpp');
  const powRow60 = resPow60.rows.find(r => r.name === 'O(2^N)');
  assert(powRow60.ops === Math.pow(2, 60) && powRow60.status === 'tle',
    '2^60 is evaluated safely as finite float and marked TLE');

  const resPow61 = Calculator.calculateComplexity(61, 1.0, 'cpp');
  const powRow61 = resPow61.rows.find(r => r.name === 'O(2^N)');
  assert(powRow61.ops === Infinity && powRow61.status === 'tle',
    '2^N for N > 60 guarded by returning Infinity and status TLE');

  // Test N^3 overflow guards
  const resCube1e5 = Calculator.calculateComplexity(1e5, 1.0, 'cpp');
  const cubeRow1e5 = resCube1e5.rows.find(r => r.name === 'O(N³)');
  assert(cubeRow1e5.ops === 1e15 && cubeRow1e5.status === 'tle',
    'N^3 for N = 1e5 is finite 1e15 and marked TLE');

  const resCubeOver = Calculator.calculateComplexity(100001, 1.0, 'cpp');
  const cubeRowOver = resCubeOver.rows.find(r => r.name === 'O(N³)');
  assert(cubeRowOver.ops === Infinity && cubeRowOver.status === 'tle',
    'N^3 for N > 1e5 is guarded by returning Infinity');

  // Test N^2 overflow guards
  const resSquare1e8 = Calculator.calculateComplexity(1e8, 1.0, 'cpp');
  const squareRow1e8 = resSquare1e8.rows.find(r => r.name === 'O(N²)');
  assert(squareRow1e8.ops === 1e16 && squareRow1e8.status === 'tle',
    'N^2 for N = 1e8 is finite 1e16 and marked TLE');

  const resSquareOver = Calculator.calculateComplexity(100000001, 1.0, 'cpp');
  const squareRowOver = resSquareOver.rows.find(r => r.name === 'O(N²)');
  assert(squareRowOver.ops === Infinity && squareRowOver.status === 'tle',
    'N^2 for N > 1e8 is guarded by returning Infinity');

  // Test sqrt(N) overflow guards
  const resSqrtOver = Calculator.calculateComplexity(1e17, 1.0, 'cpp');
  const sqrtRowOver = resSqrtOver.rows.find(r => r.name === 'O(√N)');
  assert(sqrtRowOver.ops === Infinity && sqrtRowOver.status === 'tle',
    'sqrt(N) for N > 1e16 is guarded by returning Infinity');

  // Test astronomical numbers (N = 10^100 -> log2(10^100) = 333 ops -> O(log N))
  const resAstro = Calculator.calculateComplexity(1e100, 1.0, 'cpp');
  assert(resAstro.optimalComplexity === 'O(log N)',
    'Astronomical N = 1e100 evaluated accurately to O(log N) with 333 ops');

  // Test Infinity (log2(Infinity) = Infinity -> drops to O(1))
  const resInf = Calculator.calculateComplexity(Infinity, 1.0, 'cpp');
  assert(resInf.optimalComplexity === 'O(1)',
    'N = Infinity handled gracefully without exception, optimalComplexity = O(1)');
}

// 2.4 Language Baseline Operations: C++ (10^8) vs Python 3 (1.5 * 10^7)
console.log('\n[2.4 Language Baseline C++ vs Python 3]');
{
  const resCpp = Calculator.calculateComplexity(11, 1.0, 'cpp');
  const factCpp = resCpp.rows.find(r => r.name === 'O(N!)');
  assert(resCpp.maxBudget === 1e8 && factCpp.status === 'optimal' && resCpp.optimalComplexity === 'O(N!)',
    'C++ 1.0s: N = 11! (3.99e7) passes within 10^8 budget (optimal)');

  const resPy = Calculator.calculateComplexity(11, 1.0, 'python');
  const factPy = resPy.rows.find(r => r.name === 'O(N!)');
  assert(resPy.maxBudget === 1.5e7 && factPy.status === 'tle' && resPy.optimalComplexity === 'O(2^N)',
    'Python 3 1.0s: N = 11! (3.99e7) exceeds 1.5e7 budget (TLE), optimal throttled to O(2^N)');
}

// 2.5 PROJECT.md Interface Contract: recommend(nValue)
console.log('\n[2.5 recommend(nValue) Interface Contract & Candidate Models]');
{
  const testInputs = [
    { in: 10, expectedComplexity: 'O(N!)', minModels: 3 },
    { in: 20, expectedComplexity: 'O(2^N)', minModels: 3 },
    { in: 500, expectedComplexity: 'O(N³)', minModels: 3 },
    { in: 5000, expectedComplexity: 'O(N²)', minModels: 3 },
    { in: 200000, expectedComplexity: 'O(N log N)', minModels: 5 },
    { in: 10000000, expectedComplexity: 'O(N)', minModels: 4 },
    { in: 1e18, expectedComplexity: 'O(log N)', minModels: 5 }
  ];

  for (const t of testInputs) {
    const rec = Calculator.recommend(t.in);
    assert(rec && typeof rec === 'object', `recommend(${t.in}) returns an object`);
    assert(rec.maxOps === 1e8, `recommend(${t.in}) maxOps is 10^8 ops`);
    assert(rec.timeComplexity === t.expectedComplexity,
      `recommend(${t.in}) timeComplexity is '${t.expectedComplexity}'`);
    assert(Array.isArray(rec.recommendedAlgos) && rec.recommendedAlgos.length >= t.minModels,
      `recommend(${t.in}) returned ${rec.recommendedAlgos.length} algorithm models (>= ${t.minModels})`);

    // Verify model fields
    let modelsValid = true;
    for (const m of rec.recommendedAlgos) {
      if (!m.name || !m.cat || !m.desc || !m.route) {
        modelsValid = false;
        console.error(`Invalid model in recommend(${t.in}):`, m);
      }
    }
    assert(modelsValid, `All recommended algorithm models have name, cat, desc, route for N = ${t.in}`);
  }
}

// 2.6 Edge Cases & Subtle Discrepancies
console.log('\n[2.6 Edge Cases & Discrepancy Checks]');
{
  // Edge Case A: N = 0 (Fixed in M1-it2 to default to minimal scale N <= 10 / O(N!))
  const rec0 = Calculator.recommend(0);
  assert(rec0.maxOps === 1e8 && rec0.timeComplexity === 'O(N!)',
    'recommend(0) safely defaults to minimal scale N <= 10 (O(N!)) without exception');

  const recStr0 = Calculator.recommend('0');
  assert(recStr0.maxOps === 1e8 && recStr0.timeComplexity === 'O(N!)',
    'recommend("0") safely defaults to minimal scale N <= 10 (O(N!)) without exception');

  // Edge Case B: N = 11 nuance (calculateComplexity returns O(N!) because 11! = 3.99e7 <= 1e8,
  // but findMatchedCategory(11) returns N_LE_20 bracket which warns against O(N!) because 20! is huge)
  const rec11 = Calculator.recommend(11);
  assert(rec11.timeComplexity === 'O(N!)',
    'recommend(11) correctly identifies O(N!) as mathematically feasible under 10^8 ops (11! = 3.99e7)');

  // Edge Case C: N = 10^8
  // 10^8 operations in C++ is right at 1.0s limit (feasible).
  const rec1e8 = Calculator.recommend(1e8);
  assert(rec1e8.timeComplexity === 'O(N)',
    'recommend(10^8) recognizes O(N) as feasible at exactly 10^8 operations');

  // Edge Case D: N = 10^6
  const rec1e6 = Calculator.recommend(1e6);
  assert(rec1e6.timeComplexity === 'O(N log N)',
    'recommend(10^6) evaluates 2e7 ops as within 10^8 limit, giving O(N log N)');
}

// ============================================================================
// FINAL SUMMARY
// ============================================================================
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('================================================================');

if (failedTests > 0) {
  console.error('\nFailures summary:');
  failureDetails.forEach((f, idx) => {
    console.error(`  ${idx + 1}. ${f.testName}: ${f.details}`);
  });
  process.exit(1);
} else {
  console.log('\nALL EMPIRICAL STRESS TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}
