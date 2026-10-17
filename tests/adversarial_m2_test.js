/**
 * @file tests/adversarial_m2_test.js
 * @description Adversarial empirical stress-test harness for M2 Visualizer Modules:
 * Search & Strings, Graphs, DP, and Math & Game.
 * Executed by Teamwork Challenger (teamwork_preview_challenger_m2_2).
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('=== EMPIRICAL ADVERSARIAL STRESS-TEST HARNESS (M2 MODULES) =====');
console.log('================================================================\n');

// 1. Mock DOM Environment
function createMockElement(id, tagName = 'div', initialClasses = []) {
  return {
    id: id,
    tagName: tagName.toUpperCase(),
    value: '',
    textContent: '',
    innerHTML: '',
    children: [],
    classList: {
      _classes: new Set(initialClasses),
      add: function(...cls) { cls.forEach(c => this._classes.add(c)); },
      remove: function(...cls) { cls.forEach(c => this._classes.delete(c)); },
      contains: function(c) { return this._classes.has(c); },
      toggle: function(c, force) {
        if (force !== undefined) {
          if (force) this.add(c); else this.remove(c);
        } else {
          if (this.contains(c)) this.remove(c); else this.add(c);
        }
      }
    },
    style: {},
    disabled: false,
    offsetWidth: 100,
    addEventListener: function(evt, handler) {
      this._handlers = this._handlers || {};
      this._handlers[evt] = this._handlers[evt] || [];
      this._handlers[evt].push(handler);
    },
    trigger: function(evt, eventObj = {}) {
      if (this._handlers && this._handlers[evt]) {
        this._handlers[evt].forEach(fn => fn(eventObj));
      }
    },
    focus: function() {},
    select: function() {},
    appendChild: function(child) {
      this.children.push(child);
      child.parentNode = this;
      return child;
    },
    removeChild: function(child) {
      const idx = this.children.indexOf(child);
      if (idx !== -1) this.children.splice(idx, 1);
      return child;
    },
    querySelector: function(sel) { return null; },
    querySelectorAll: function(sel) { return []; }
  };
}

const mockDocument = {
  elements: {},
  getElementById: function(id) {
    if (!this.elements[id]) {
      this.elements[id] = createMockElement(id);
    }
    return this.elements[id];
  },
  createElement: function(tag) {
    return createMockElement('dyn_' + Math.random().toString(36).substr(2, 6), tag);
  },
  body: createMockElement('body', 'body')
};

const standardIds = [
  'stageArray', 'stageSvg', 'stageGrid', 'stageSandbox',
  'stepExplanationText', 'watchTableBody', 'codeBlock',
  'codePre', 'actionBadge', 'stepCounter', 'timelineSlider',
  'stlContent', 'presetSelect', 'customInput'
];
standardIds.forEach(id => mockDocument.getElementById(id));

global.window = global;
global.document = mockDocument;
global.navigator = { userAgent: 'AdversarialNodeRunner' };
global.location = { hash: '#test' };

// 2. Load Core Engine & Visualizers
const rootDir = path.resolve(__dirname, '..');
require(path.join(rootDir, 'js/engine/types.js'));
require(path.join(rootDir, 'js/engine/storage.js'));
require(path.join(rootDir, 'js/engine/controller.js'));

require(path.join(rootDir, 'js/visualizers/search_strings.js'));
require(path.join(rootDir, 'js/visualizers/graphs.js'));
require(path.join(rootDir, 'js/visualizers/dp.js'));
require(path.join(rootDir, 'js/visualizers/math_game.js'));

let totalTests = 0;
let passedTests = 0;
let defectCount = 0;
const findings = [];

function recordTest(group, testName, passed, details) {
  totalTests++;
  if (passed) passedTests++;
  const status = passed ? 'PASS' : 'FAIL';
  const prefix = passed ? '✓' : '❌';
  console.log(`  ${prefix} [${status}] [${group}] ${testName}`);
  if (details) console.log(`     -> ${details}`);
}

function recordDefect(group, title, severity, details) {
  defectCount++;
  console.log(`  ⚠️ [DEFECT / ADVERSARIAL FINDING] [${severity}] [${group}] ${title}`);
  console.log(`     -> ${details}`);
  findings.push({ group, title, severity, details });
}

// =========================================================================
// SECTION 1: Search & Strings
// =========================================================================
console.log('\n--- [SECTION 1] Search & Strings Adversarial Tests ---');
const bsDef = global.AlgoSystem.visualizers.get('binary_search');
const swDef = global.AlgoSystem.visualizers.get('sliding_window');
const kmpDef = global.AlgoSystem.visualizers.get('kmp');
const manDef = global.AlgoSystem.visualizers.get('manacher');

// 1.1 Binary Search: target smaller than min
try {
  const frames = bsDef.run({ arr: [10, 20, 30, 40, 50], target: 5 });
  const last = frames[frames.length - 1];
  const ok = last && last.state.found === false && last.state.L === 0 && last.state.R === -1;
  bsDef.render(last);
  recordTest('Search & Strings', 'Binary Search: target smaller than min (target=5 in [10..50])', ok,
    `Frames: ${frames.length}, Found: ${last.state.found}, Final L: ${last.state.L}, Final R: ${last.state.R}`);
} catch (e) {
  recordTest('Search & Strings', 'Binary Search: target smaller than min', false, e.message);
}

// 1.2 Binary Search: target larger than max
try {
  const frames = bsDef.run({ arr: [10, 20, 30, 40, 50], target: 99 });
  const last = frames[frames.length - 1];
  const ok = last && last.state.found === false && last.state.L === 5 && last.state.R === 4;
  bsDef.render(last);
  recordTest('Search & Strings', 'Binary Search: target larger than max (target=99 in [10..50])', ok,
    `Frames: ${frames.length}, Found: ${last.state.found}, Final L: ${last.state.L}, Final R: ${last.state.R}`);
} catch (e) {
  recordTest('Search & Strings', 'Binary Search: target larger than max', false, e.message);
}

// 1.3 Binary Search: target not present (in-between elements)
try {
  const frames = bsDef.run({ arr: [10, 20, 30, 40, 50], target: 25 });
  const last = frames[frames.length - 1];
  const ok = last && last.state.found === false && last.state.L === 2 && last.state.R === 1;
  bsDef.render(last);
  recordTest('Search & Strings', 'Binary Search: target not present (target=25 in [10..50])', ok,
    `Frames: ${frames.length}, Found: ${last.state.found}, Final L: ${last.state.L}, Final R: ${last.state.R}`);
} catch (e) {
  recordTest('Search & Strings', 'Binary Search: target not present', false, e.message);
}

// 1.4 Sliding Window: target sum unreachable
try {
  const frames = swDef.run({ arr: [1, 2, 3, 4, 5], targetSum: 100 });
  const last = frames[frames.length - 1];
  const ok = last && last.state.bestRange === null && last.state.minLen === Infinity && last.action === 'DONE';
  swDef.render(last);
  recordTest('Search & Strings', 'Sliding Window: target sum unreachable (targetSum=100, sum=15)', ok,
    `Frames: ${frames.length}, BestRange: ${last.state.bestRange}, MinLen: ${last.state.minLen}, Action: ${last.action}`);
} catch (e) {
  recordTest('Search & Strings', 'Sliding Window: target sum unreachable', false, e.message);
}

// 1.5 KMP: no match
try {
  const frames = kmpDef.run({ text: 'ABCDEFGH', pattern: 'XYZ' });
  const last = frames[frames.length - 1];
  const ok = last && last.state.matchFound === false;
  kmpDef.render(last);
  recordTest('Search & Strings', 'KMP: no match in text', ok,
    `Frames: ${frames.length}, MatchFound: ${last.state.matchFound}`);
} catch (e) {
  recordTest('Search & Strings', 'KMP: no match in text', false, e.message);
}

// 1.6 KMP: highly periodic pattern "AAAA"
try {
  const frames = kmpDef.run({ text: 'AAAAAA', pattern: 'AAAA' });
  const foundFrames = frames.filter(f => f.action === 'FOUND');
  const last = frames[frames.length - 1];
  const pi = last.state.pi;
  const ok = last && foundFrames.length === 3 && JSON.stringify(pi) === JSON.stringify([0, 1, 2, 3]);
  kmpDef.render(last);
  recordTest('Search & Strings', 'KMP: highly periodic pattern "AAAA" (text: "AAAAAA")', ok,
    `Frames: ${frames.length}, Overlapping Matches: ${foundFrames.length}, pi: [${pi.join(',')}]`);
} catch (e) {
  recordTest('Search & Strings', 'KMP: highly periodic pattern "AAAA"', false, e.message);
}

// 1.7 KMP: highly periodic pattern "ABABA"
try {
  const frames = kmpDef.run({ text: 'ABABABABA', pattern: 'ABABA' });
  const foundFrames = frames.filter(f => f.action === 'FOUND');
  const last = frames[frames.length - 1];
  const pi = last.state.pi;
  const ok = last && foundFrames.length === 3 && JSON.stringify(pi) === JSON.stringify([0, 0, 1, 2, 3]);
  kmpDef.render(last);
  recordTest('Search & Strings', 'KMP: highly periodic pattern "ABABA" (text: "ABABABABA")', ok,
    `Frames: ${frames.length}, Matches: ${foundFrames.length}, pi: [${pi.join(',')}]`);
} catch (e) {
  recordTest('Search & Strings', 'KMP: highly periodic pattern "ABABA"', false, e.message);
}

// 1.8 Manacher: single character "A"
try {
  const frames = manDef.run('A');
  const last = frames[frames.length - 1];
  const ok = last && last.state.longestPal === 'A' && last.state.maxLen === 1;
  manDef.render(last);
  recordTest('Search & Strings', 'Manacher: single character "A"', ok,
    `Frames: ${frames.length}, LongestPal: "${last.state.longestPal}", MaxLen: ${last.state.maxLen}`);
} catch (e) {
  recordTest('Search & Strings', 'Manacher: single character "A"', false, e.message);
}

// 1.9 Manacher: even-length palindrome "ABBA"
try {
  const frames = manDef.run('ABBA');
  const last = frames[frames.length - 1];
  const ok = last && last.state.longestPal === 'ABBA' && last.state.maxLen === 4;
  manDef.render(last);
  recordTest('Search & Strings', 'Manacher: even-length palindrome "ABBA"', ok,
    `Frames: ${frames.length}, LongestPal: "${last.state.longestPal}", MaxLen: ${last.state.maxLen}`);
} catch (e) {
  recordTest('Search & Strings', 'Manacher: even-length palindrome "ABBA"', false, e.message);
}

// =========================================================================
// SECTION 2: Graphs
// =========================================================================
console.log('\n--- [SECTION 2] Graphs Adversarial Tests ---');
const bfsDef = global.AlgoSystem.visualizers.get('bfs_maze');
const dfsDef = global.AlgoSystem.visualizers.get('dfs_maze');
const dijkstraDef = global.AlgoSystem.visualizers.get('dijkstra');
const kruskalDef = global.AlgoSystem.visualizers.get('kruskal');

const BLOCKED_MAZE = [
  [1, 1, 1, 1, 1],
  [1, 2, 1, 0, 1],
  [1, 1, 1, 0, 1],
  [1, 0, 1, 3, 1],
  [1, 1, 1, 1, 1]
];

// 2.1 Maze BFS with blocked exit / unreachable destination
try {
  const frames = bfsDef.run(BLOCKED_MAZE);
  const last = frames[frames.length - 1];
  const ok = last && last.action === 'DONE' && last.state.path.length === 0 && last.variables.found === false;
  bfsDef.render(last);
  recordTest('Graphs', 'Maze BFS: completely blocked exit/unreachable destination', ok,
    `Frames: ${frames.length}, Found: ${last.variables.found}, PathLength: ${last.state.path.length}, Terminated: Gracefully`);
} catch (e) {
  recordTest('Graphs', 'Maze BFS: blocked exit', false, e.message);
}

// 2.2 Maze DFS with blocked exit / unreachable destination
try {
  const frames = dfsDef.run(BLOCKED_MAZE);
  const last = frames[frames.length - 1];
  const ok = last && last.action === 'DONE' && last.state.path.length === 0;
  dfsDef.render(last);
  recordTest('Graphs', 'Maze DFS: completely blocked exit/unreachable destination', ok,
    `Frames: ${frames.length}, FinalPathLength: ${last.state.path.length}, Terminated: Gracefully`);
} catch (e) {
  recordTest('Graphs', 'Maze DFS: blocked exit', false, e.message);
}

// 2.3 Dijkstra on disconnected graph
try {
  const DISCONNECTED_GRAPH = {
    nodes: [0, 1, 2, 3],
    edges: [
      { u: 0, v: 1, w: 4 },
      { u: 2, v: 3, w: 10 }
    ]
  };
  const frames = dijkstraDef.run(DISCONNECTED_GRAPH);
  const last = frames[frames.length - 1];
  const d = last.state.dist;
  const ok = last && last.action === 'DONE' && d[0] === 0 && d[1] === 4 && d[2] === Infinity && d[3] === Infinity;
  dijkstraDef.render(last);
  recordTest('Graphs', 'Dijkstra: disconnected graph (nodes {2,3} unreachable from 0)', ok,
    `Frames: ${frames.length}, Dist: [${d.join(', ')}], Unreachable Nodes remain Infinity`);
} catch (e) {
  recordTest('Graphs', 'Dijkstra: disconnected graph', false, e.message);
}

// 2.4 Kruskal on disconnected graph
try {
  const DISCONNECTED_MST_GRAPH = {
    nodes: [0, 1, 2, 3],
    edges: [
      { u: 0, v: 1, w: 2 },
      { u: 2, v: 3, w: 5 }
    ]
  };
  const frames = kruskalDef.run(DISCONNECTED_MST_GRAPH);
  const last = frames[frames.length - 1];
  const mstEdges = last.state.mstEdges;
  const ok = last && last.action === 'DONE' && mstEdges.length === 2 && last.state.totalWeight === 7;
  kruskalDef.render(last);
  recordTest('Graphs', 'Kruskal: disconnected graph (forest with 2 components)', ok,
    `Frames: ${frames.length}, MST Edges: ${mstEdges.length} (expected 2 < 3), TotalWeight: ${last.state.totalWeight}`);
} catch (e) {
  recordTest('Graphs', 'Kruskal: disconnected graph', false, e.message);
}

// =========================================================================
// SECTION 3: Dynamic Programming
// =========================================================================
console.log('\n--- [SECTION 3] DP Adversarial Tests ---');
const k01Def = global.AlgoSystem.visualizers.get('knapsack_01');
const intDpDef = global.AlgoSystem.visualizers.get('interval_dp');
const lisDef = global.AlgoSystem.visualizers.get('lis');

// 3.1 0-1 Knapsack with item weight strictly exceeding capacity
try {
  const frames = k01Def.run({
    W: 4,
    items: [
      { id: 1, name: '超重A', w: 6, v: 10 },
      { id: 2, name: '超重B', w: 8, v: 20 }
    ]
  });
  const last = frames[frames.length - 1];
  const finalVal = last.state.dp[2][4];
  const ok = last && last.action === 'DONE' && finalVal === 0;
  k01Def.render(last);
  recordTest('DP', '0-1 Knapsack: item weight strictly exceeding capacity (W=4, weights=[6,8])', ok,
    `Frames: ${frames.length}, Final DP[2][4]: ${finalVal} (expected 0)`);
} catch (e) {
  recordTest('DP', '0-1 Knapsack: item weight exceeding capacity', false, e.message);
}

// 3.2 Stone Merging with N = 2
try {
  const frames = intDpDef.run({ stones: [3, 5] });
  const last = frames[frames.length - 1];
  const finalCost = last.state.dp[0][1];
  const ok = last && last.action === 'DONE' && finalCost === 8;
  intDpDef.render(last);
  recordTest('DP', 'Stone Merging: N=2 stones [3, 5]', ok,
    `Frames: ${frames.length}, Min Merge Cost: ${finalCost} (expected 8)`);
} catch (e) {
  recordTest('DP', 'Stone Merging: N=2 stones', false, e.message);
}

// 3.3 Stone Merging with N = 3
try {
  const frames = intDpDef.run({ stones: [3, 4, 2] });
  const last = frames[frames.length - 1];
  const finalCost = last.state.dp[0][2];
  const ok = last && last.action === 'DONE' && finalCost === 15;
  intDpDef.render(last);
  recordTest('DP', 'Stone Merging: N=3 stones [3, 4, 2]', ok,
    `Frames: ${frames.length}, Min Merge Cost: ${finalCost} (expected 15)`);
} catch (e) {
  recordTest('DP', 'Stone Merging: N=3 stones', false, e.message);
}

// 3.4 LIS with strictly decreasing array (LIS length = 1)
try {
  const frames = lisDef.run({ nums: [5, 4, 3, 2, 1] });
  const last = frames[frames.length - 1];
  const ok = last && last.action === 'DONE' && last.state.maxLen === 1 && last.state.lisIndices.length === 1;
  lisDef.render(last);
  recordTest('DP', 'LIS: strictly decreasing array [5, 4, 3, 2, 1]', ok,
    `Frames: ${frames.length}, MaxLen: ${last.state.maxLen} (expected 1), LIS Indices: [${last.state.lisIndices.join(',')}]`);
} catch (e) {
  recordTest('DP', 'LIS: strictly decreasing array', false, e.message);
}

// =========================================================================
// SECTION 4: Math & Game
// =========================================================================
console.log('\n--- [SECTION 4] Math & Game Adversarial Tests ---');
const sieveDef = global.AlgoSystem.visualizers.get('prime_sieve');
const gcdDef = global.AlgoSystem.visualizers.get('euclidean_gcd');
const bitmaskDef = global.AlgoSystem.visualizers.get('bitmask_sandbox');
const nimDef = global.AlgoSystem.visualizers.get('nim_game');

// 4.1 Sieve with small N = 2 & N = 3
try {
  const framesN2 = sieveDef.run({ N: 2 });
  const lastN2 = framesN2[framesN2.length - 1];
  const actualN2 = lastN2.state.N;
  sieveDef.render(lastN2);
  recordTest('Math & Game', 'Prime Sieve: runs without exception on input N=2', true,
    `Frames: ${framesN2.length}, Processed N: ${actualN2}`);

  if (actualN2 !== 2) {
    recordDefect('Math & Game', 'Prime Sieve clamps N=2 to 10', 'MEDIUM',
      `math_game.js:115 clamps input N via Math.max(10, Math.min(100, N)). When input is N=2, it runs for N=10 instead of N=2. parseInput line 229 also enforces N >= 5.`);
  }

  const framesN3 = sieveDef.run({ N: 3 });
  const lastN3 = framesN3[framesN3.length - 1];
  const actualN3 = lastN3.state.N;
  sieveDef.render(lastN3);
  recordTest('Math & Game', 'Prime Sieve: runs without exception on input N=3', true,
    `Frames: ${framesN3.length}, Processed N: ${actualN3}`);
} catch (e) {
  recordTest('Math & Game', 'Prime Sieve: small N', false, e.message);
}

// 4.2 Euclidean GCD: coprime numbers (e.g. 35 and 12)
try {
  const frames = gcdDef.run({ A: 35, B: 12 });
  const last = frames[frames.length - 1];
  const ok = last && last.state.finished === true && last.state.gcd === 1;
  gcdDef.render(last);
  recordTest('Math & Game', 'Euclidean GCD: coprime numbers gcd(35, 12)', ok,
    `Frames: ${frames.length}, GCD: ${last.state.gcd} (expected 1), Steps: ${last.state.stepsData.length}`);
} catch (e) {
  recordTest('Math & Game', 'Euclidean GCD: coprime numbers', false, e.message);
}

// 4.3 Euclidean GCD: identical numbers (e.g. 24 and 24)
try {
  const frames = gcdDef.run({ A: 24, B: 24 });
  const last = frames[frames.length - 1];
  const ok = last && last.state.finished === true && last.state.gcd === 24;
  gcdDef.render(last);
  recordTest('Math & Game', 'Euclidean GCD: identical numbers gcd(24, 24)', ok,
    `Frames: ${frames.length}, GCD: ${last.state.gcd} (expected 24), Steps: ${last.state.stepsData.length}`);
} catch (e) {
  recordTest('Math & Game', 'Euclidean GCD: identical numbers', false, e.message);
}

// 4.4 Euclidean GCD: b = 0 boundary condition gcd(15, 0)
try {
  const frames = gcdDef.run({ A: 15, B: 0 });
  const last = frames[frames.length - 1];
  const hasDone = frames.some(f => f.action === 'DONE');
  const finished = last && last.state && last.state.finished;
  const computedGcd = last && last.state && last.state.gcd;
  gcdDef.render(last);

  recordTest('Math & Game', 'Euclidean GCD: runs on b=0 without throwing exception', true,
    `Frames: ${frames.length}, Has DONE Frame: ${hasDone}, Finished flag: ${finished}, Computed gcd: ${computedGcd}`);

  if (!hasDone || !finished || computedGcd !== 15) {
    recordDefect('Math & Game', 'Euclidean GCD fails to terminate with DONE frame and gcd calculation when b = 0', 'HIGH',
      `math_game.js:318 'while (curB > 0)' skips execution when B=0. The single frame returned is HIGHLIGHT with finished=false and gcd=undefined. Mathematically gcd(15, 0) = 15. Furthermore, line 414 divides by B (0), resulting in scale = Infinity.`);
  }
} catch (e) {
  recordTest('Math & Game', 'Euclidean GCD: b=0', false, e.message);
}

// 4.5 Bitmask lowbit: A = 0
try {
  // Test object-wrapped input { A: 0 }
  const framesObj = bitmaskDef.run({ A: 0 });
  const lastObj = framesObj[framesObj.length - 1];
  const okObj = lastObj && lastObj.action === 'DONE' && lastObj.state.lowbitVal === 0;
  bitmaskDef.render(lastObj);
  recordTest('Math & Game', 'Bitmask lowbit: object input { A: 0 }', okObj,
    `Frames: ${framesObj.length}, lowbit(0) = ${lastObj.state.lowbitVal} (expected 0)`);

  // Test primitive number input 0
  const framesPrim = bitmaskDef.run(0);
  const lastPrim = framesPrim[framesPrim.length - 1];
  bitmaskDef.render(lastPrim);
  if (lastPrim.state.lowbitVal !== 0) {
    recordDefect('Math & Game', 'Bitmask sandbox falsy fallback bug on primitive run(0)', 'MEDIUM',
      `math_game.js:553 uses 'input || this.defaultInput'. When calling run(0), 0 is falsy, so it incorrectly falls back to defaultInput { A: 12 }, producing lowbit=4 instead of 0.`);
  } else {
    recordTest('Math & Game', 'Bitmask lowbit: primitive input run(0)', true,
      `Frames: ${framesPrim.length}, lowbit(0) = ${lastPrim.state.lowbitVal}`);
  }
} catch (e) {
  recordTest('Math & Game', 'Bitmask lowbit: A = 0', false, e.message);
}

// 4.6 Bitmask lowbit: A = 1
try {
  const frames = bitmaskDef.run(1);
  const last = frames[frames.length - 1];
  const ok = last && last.action === 'DONE' && last.state.lowbitVal === 1;
  bitmaskDef.render(last);
  recordTest('Math & Game', 'Bitmask lowbit: A = 1 (1 & -1)', ok,
    `Frames: ${frames.length}, lowbit(1) = ${last.state.lowbitVal} (expected 1)`);
} catch (e) {
  recordTest('Math & Game', 'Bitmask lowbit: A = 1', false, e.message);
}

// 4.7 Bitmask lowbit: powers of 2 (16, 64, 1024)
try {
  const p2Cases = [16, 64, 1024];
  let allP2Pass = true;
  const detailsArr = [];
  for (const p of p2Cases) {
    const frames = bitmaskDef.run(p);
    const last = frames[frames.length - 1];
    if (!last || last.state.lowbitVal !== p) allP2Pass = false;
    detailsArr.push(`lowbit(${p})=${last.state.lowbitVal}`);
    bitmaskDef.render(last);
  }
  recordTest('Math & Game', 'Bitmask lowbit: powers of 2 (16, 64, 1024)', allP2Pass,
    `Results: ${detailsArr.join(', ')}`);
} catch (e) {
  recordTest('Math & Game', 'Bitmask lowbit: powers of 2', false, e.message);
}

// 4.8 Nim Game: P-position (XOR sum = 0)
try {
  const frames = nimDef.run({ piles: [1, 2, 3] });
  const last = frames[frames.length - 1];
  const ok = last && last.action === 'DONE' && last.state.xorSum === 0 && last.state.isWinning === false;
  nimDef.render(last);
  recordTest('Math & Game', 'Nim Game: P-position (XOR sum = 0, piles [1, 2, 3])', ok,
    `Frames: ${frames.length}, xorSum: ${last.state.xorSum}, isWinning: ${last.state.isWinning} (P-Position detected)`);
} catch (e) {
  recordTest('Math & Game', 'Nim Game: P-position', false, e.message);
}

// 4.9 Nim Game: N-position (XOR sum > 0)
try {
  const frames = nimDef.run({ piles: [3, 4, 5] });
  const last = frames[frames.length - 1];
  const ok = last && last.state.xorSum === 2 && last.state.isWinning === true && last.state.winPile !== -1;
  nimDef.render(last);
  recordTest('Math & Game', 'Nim Game: N-position (XOR sum > 0, piles [3, 4, 5])', ok,
    `Frames: ${frames.length}, xorSum: ${last.state.xorSum}, isWinning: ${last.state.isWinning}, winPile: ${last.state.winPile}, takeCount: ${last.state.takeCount}`);
} catch (e) {
  recordTest('Math & Game', 'Nim Game: N-position', false, e.message);
}

// =========================================================================
// SUMMARY
// =========================================================================
console.log('\n================================================================');
console.log(`TOTAL ADVERSARIAL TEST CASES EXECUTED: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`DEFECTS / ADVERSARIAL FINDINGS DISCOVERED: ${defectCount}`);
console.log('================================================================\n');

if (defectCount > 0) {
  console.log('--- DETAILED DEFECT BREAKDOWN ---');
  findings.forEach((f, idx) => {
    console.log(`[Defect #${idx + 1}] [${f.severity}] [${f.group}] ${f.title}`);
    console.log(`  Details: ${f.details}\n`);
  });
}
