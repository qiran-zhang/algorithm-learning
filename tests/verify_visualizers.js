/**
 * @file tests/verify_visualizers.js
 * @description Comprehensive automated verification test suite for all 6 Visualizer modules and 35 algorithms.
 * Tests registration, SnapshotFrame integrity, time-travel, and DOM rendering.
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('=== VISUALIZER MODULES AUTOMATED VERIFICATION SUITE (35 ALGOS) ==');
console.log('================================================================\n');

// 1. Build a robust Mock DOM Environment for Node.js
function createMockElement(id, tagName = 'div', initialClasses = []) {
  const el = {
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
    querySelector: function(sel) {
      return null;
    },
    querySelectorAll: function(sel) {
      return [];
    }
  };
  return el;
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

// Seed standard container IDs from index.html
const standardIds = [
  'stageArray', 'stageSvg', 'stageGrid', 'stageSandbox',
  'stepExplanationText', 'watchTableBody', 'codeBlock',
  'codePre', 'actionBadge', 'stepCounter', 'timelineSlider',
  'stlContent', 'presetSelect', 'customInput'
];
standardIds.forEach(id => mockDocument.getElementById(id));

// Setup global mock
global.window = global;
global.document = mockDocument;
global.navigator = { userAgent: 'NodeTestRunner' };
global.location = { hash: '#sorting/bubble_sort' };

// 2. Load Core Engine
const rootDir = path.resolve(__dirname, '..');
require(path.join(rootDir, 'js/engine/types.js'));
require(path.join(rootDir, 'js/engine/storage.js'));
require(path.join(rootDir, 'js/engine/controller.js'));

// 3. Load All 6 Visualizer Modules
require(path.join(rootDir, 'js/visualizers/sorting.js'));
require(path.join(rootDir, 'js/visualizers/search_strings.js'));
require(path.join(rootDir, 'js/visualizers/data_structures.js'));
require(path.join(rootDir, 'js/visualizers/graphs.js'));
require(path.join(rootDir, 'js/visualizers/dp.js'));
require(path.join(rootDir, 'js/visualizers/math_game.js'));

// Test Harness Counters
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`  ❌ FAILED: ${message}`);
  }
}

// 4. Algorithm Inventory (35 Official Algorithms)
const EXPECTED_ALGORITHMS = [
  // 1. Sorting (10)
  { id: 'bubble_sort', category: 'sorting', name: '冒泡排序' },
  { id: 'selection_sort', category: 'sorting', name: '选择排序' },
  { id: 'insertion_sort', category: 'sorting', name: '插入排序' },
  { id: 'shell_sort', category: 'sorting', name: '希尔排序' },
  { id: 'merge_sort', category: 'sorting', name: '归并排序' },
  { id: 'quick_sort', category: 'sorting', name: '快速排序 (408)' },
  { id: 'heap_sort', category: 'sorting', name: '堆排序' },
  { id: 'counting_sort', category: 'sorting', name: '计数排序' },
  { id: 'radix_sort', category: 'sorting', name: '基数排序 (LSD)' },
  { id: 'bucket_sort', category: 'sorting', name: '桶排序' },

  // 2. Search & Strings (4)
  { id: 'binary_search', category: 'search_strings', name: '二分查找 (红蓝染色)' },
  { id: 'sliding_window', category: 'search_strings', name: '滑动窗口毛毛虫' },
  { id: 'kmp', category: 'search_strings', name: 'KMP 字符串匹配' },
  { id: 'manacher', category: 'search_strings', name: 'Manacher 最长回文子串' },

  // 3. Data Structures (7)
  { id: 'monotonic_stack', category: 'data_structures', name: '单调栈' },
  { id: 'monotonic_queue', category: 'data_structures', name: '单调队列' },
  { id: 'binary_heap', category: 'data_structures', name: '二叉堆/优先队列' },
  { id: 'dsu', category: 'data_structures', name: '并查集' },
  { id: 'trie', category: 'data_structures', name: 'Trie 字典树' },
  { id: 'fenwick_tree', category: 'data_structures', name: '树状数组 (BIT)' },
  { id: 'segment_tree', category: 'data_structures', name: '线段树' },

  // 4. Graphs & Search (6)
  { id: 'bfs_maze', category: 'graphs', name: '网格迷宫 BFS' },
  { id: 'dfs_maze', category: 'graphs', name: '网格迷宫 DFS' },
  { id: 'dijkstra', category: 'graphs', name: 'Dijkstra 最短路' },
  { id: 'topological_sort', category: 'graphs', name: 'Kahn 拓扑排序' },
  { id: 'kruskal', category: 'graphs', name: 'Kruskal 最小生成树' },
  { id: 'eulerian_path', category: 'graphs', name: '欧拉回路/通路' },

  // 5. Dynamic Programming (4)
  { id: 'knapsack_01', category: 'dp', name: '0-1 背包' },
  { id: 'knapsack_complete', category: 'dp', name: '完全背包' },
  { id: 'interval_dp', category: 'dp', name: '区间 DP (石子合并)' },
  { id: 'lis', category: 'dp', name: '最长上升子序列 LIS' },

  // 6. Math, Geometry & Game (4)
  { id: 'prime_sieve', category: 'math_game', name: '素数筛法' },
  { id: 'euclidean_gcd', category: 'math_game', name: '欧几里得辗转相除法' },
  { id: 'bitmask_sandbox', category: 'math_game', name: '32位位运算沙盒' },
  { id: 'nim_game', category: 'math_game', name: '博弈论 Nim 游戏' }
];

console.log(`[TEST SECTION 1] Registration Verification for all 35 Algorithms...`);
assert(global.AlgoSystem && global.AlgoSystem.visualizers, 'window.AlgoSystem.visualizers must exist');
assert(typeof global.AlgoSystem.visualizers.register === 'function', 'visualizers.register must be a function');
assert(typeof global.AlgoSystem.visualizers.get === 'function', 'visualizers.get must be a function');

const regSize = global.AlgoSystem.visualizers.size;
console.log(`  Registered visualizer count: ${regSize}`);
assert(regSize >= 35, `Registry must have at least 35 visualizers, found: ${regSize}`);

console.log(`\n[TEST SECTION 2] Comprehensive Algorithm run(), SnapshotFrame & Render Tests...\n`);

const ActionTypes = global.AlgoSystem.ActionTypes;
const validActions = new Set(Object.values(ActionTypes));

EXPECTED_ALGORITHMS.forEach((spec, idx) => {
  const algoId = spec.id;
  const def = global.AlgoSystem.visualizers.get(algoId);

  assert(def !== null && def !== undefined, `[${idx + 1}/35] Visualizer '${algoId}' must be registered`);
  if (!def) return;

  assert(def.id === algoId, `Visualizer '${algoId}' id property must match`);
  assert(def.category === spec.category, `Visualizer '${algoId}' category must be '${spec.category}'`);
  assert(typeof def.generateFrames === 'function', `Visualizer '${algoId}' generateFrames must be a function`);
  assert(typeof def.run === 'function', `Visualizer '${algoId}' run must be a function`);
  assert(typeof def.render === 'function', `Visualizer '${algoId}' render must be a function`);
  assert(typeof def.init === 'function', `Visualizer '${algoId}' init must be a function`);

  // Run algorithm frames generation
  let frames;
  try {
    frames = def.run();
  } catch (err) {
    assert(false, `Visualizer '${algoId}' run() threw error: ${err.message}`);
    return;
  }

  assert(Array.isArray(frames), `Visualizer '${algoId}' run() must return an array`);
  assert(frames.length >= 2, `Visualizer '${algoId}' frames count must be >= 2 (got ${frames.length})`);

  // Verify SnapshotFrame Contract on sample frames
  let allFramesConform = true;
  let hasExplanation = true;
  let hasValidAction = true;
  let hasValidStep = true;
  let hasState = true;

  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    if (typeof f.step !== 'number') hasValidStep = false;
    if (!f.action || !validActions.has(f.action)) hasValidAction = false;
    if (typeof f.explanation !== 'string' || f.explanation.trim().length === 0) hasExplanation = false;
    if (f.state === undefined || f.state === null) hasState = false;
  }

  assert(hasValidStep, `Visualizer '${algoId}' all frames must have numeric step`);
  assert(hasValidAction, `Visualizer '${algoId}' all frames must have valid ActionTypes action`);
  assert(hasExplanation, `Visualizer '${algoId}' all frames must have non-empty Chinese explanation`);
  assert(hasState, `Visualizer '${algoId}' all frames must maintain non-null state`);

  // Test DOM rendering for first and last frame
  try {
    def.render(frames[0]);
    def.render(frames[frames.length - 1]);
    assert(true, `Visualizer '${algoId}' render() succeeded`);
  } catch (renderErr) {
    assert(false, `Visualizer '${algoId}' render() failed: ${renderErr.message}`);
  }

  console.log(`  ✓ [${idx + 1}/35] PASS: ${spec.name} (${algoId}) — ${frames.length} frames`);
});

console.log(`\n[TEST SECTION 3] Bidirectional Time-Travel & PlaybackController Verification...`);

const testController = global.AlgoSystem.engine.createController({ speed: 100 });
const sampleViz = global.AlgoSystem.visualizers.get('quick_sort');
const sampleFrames = sampleViz.run();

testController.loadFrames(sampleFrames);
assert(testController.getProgress().totalSteps === sampleFrames.length, 'Controller must load all frames');
assert(testController.getProgress().currentStep === 0, 'Controller starts at step 0');

// Step forward
testController.stepForward();
assert(testController.getProgress().currentStep === 1, 'Controller steps forward to 1');

// Jump to midpoint
const midStep = Math.floor(sampleFrames.length / 2);
testController.jumpToStep(midStep);
assert(testController.getProgress().currentStep === midStep, `Controller jumps directly to step ${midStep}`);

// Step backward
testController.stepBackward();
assert(testController.getProgress().currentStep === midStep - 1, 'Controller steps backward');

// Reset to 0
testController.reset();
assert(testController.getProgress().currentStep === 0, 'Controller resets back to step 0');

// Jump to end
testController.jumpToStep(sampleFrames.length - 1);
assert(testController.getProgress().currentStep === sampleFrames.length - 1, 'Controller jumps to end step');

console.log(`  ✓ Bidirectional $O(1)$ time-travel step forward/backward/jump verified!`);

console.log(`\n================================================================`);
console.log(`TEST SUMMARY: ${totalTests} ASSERTIONS`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log(`================================================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 35 ALGORITHMS AND VISUALIZER MODULES VERIFIED SUCCESSFULLY!');
  process.exit(0);
}
