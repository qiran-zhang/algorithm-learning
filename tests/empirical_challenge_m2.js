/**
 * @file tests/empirical_challenge_m2.js
 * @description Adversarial empirical stress-testing suite for M2 Sorting and Data Structures visualizers.
 * Designed by Empirical Challenger to stress-test degenerate and boundary conditions.
 */

const path = require('path');
const rootDir = path.resolve(__dirname, '..');

// 1. Setup Mock DOM Environment
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
    addEventListener: function() {},
    focus: function() {},
    select: function() {},
    appendChild: function(c) { this.children.push(c); return c; },
    removeChild: function(c) { return c; },
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; }
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

const standardIds = [
  'stageArray', 'stageSvg', 'stageGrid', 'stageSandbox',
  'stepExplanationText', 'watchTableBody', 'codeBlock',
  'codePre', 'actionBadge', 'stepCounter', 'timelineSlider',
  'stlContent', 'presetSelect', 'customInput'
];
standardIds.forEach(id => mockDocument.getElementById(id));

global.window = global;
global.document = mockDocument;
global.navigator = { userAgent: 'NodeChallengerRunner' };
global.location = { hash: '#sorting/bubble_sort' };

// Load engine and visualizers
require(path.join(rootDir, 'js/engine/types.js'));
require(path.join(rootDir, 'js/engine/storage.js'));
require(path.join(rootDir, 'js/engine/controller.js'));
require(path.join(rootDir, 'js/visualizers/sorting.js'));
require(path.join(rootDir, 'js/visualizers/data_structures.js'));

const results = [];

function recordResult(category, target, testCase, success, detail, exception = null) {
  results.push({
    category,
    target,
    testCase,
    success,
    detail,
    exception: exception ? (exception.stack || exception.toString()) : null
  });
}

function isSorted(arr) {
  if (!Array.isArray(arr)) return false;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

// =========================================================================
// PART 1: 10 SORTING ALGORITHMS DEGENERATE CASES
// =========================================================================
const sortingAlgorithms = [
  'bubble_sort',
  'selection_sort',
  'insertion_sort',
  'shell_sort',
  'merge_sort',
  'quick_sort',
  'heap_sort',
  'counting_sort',
  'radix_sort',
  'bucket_sort'
];

const sortingTestCases = [
  { name: 'Already sorted array', input: [1, 2, 3, 4, 5, 6, 7] },
  { name: 'Reverse sorted array', input: [7, 6, 5, 4, 3, 2, 1] },
  { name: 'All identical elements', input: [7, 7, 7, 7, 7] },
  { name: 'Negative numbers', input: [-5, 3, -1, 0, 9] },
  { name: '2-element array', input: [2, 1] },
  { name: 'Odd length parity', input: [9, 1, 4, 7, 2] },
  { name: 'Even length parity', input: [8, 3, 5, 1, 9, 2] },
  { name: 'Single element array', input: [42] },
  { name: 'Large negative array', input: [-10, -20, -5, -1, -50] }
];

sortingAlgorithms.forEach(algoId => {
  const def = global.AlgoSystem.visualizers.get(algoId);
  if (!def) {
    recordResult('sorting', algoId, 'Registration', false, `Algorithm ${algoId} not registered!`);
    return;
  }

  sortingTestCases.forEach(tc => {
    try {
      const inputCopy = [...tc.input];
      const frames = def.run(inputCopy);
      
      if (!Array.isArray(frames) || frames.length === 0) {
        recordResult('sorting', algoId, tc.name, false, 'No frames returned or frames not an array');
        return;
      }

      const lastFrame = frames[frames.length - 1];
      let endArr = null;
      if (lastFrame.state && Array.isArray(lastFrame.state.arr)) {
        endArr = lastFrame.state.arr;
      } else if (Array.isArray(lastFrame.state)) {
        endArr = lastFrame.state;
      }

      if (!endArr) {
        recordResult('sorting', algoId, tc.name, false, `Last frame has no valid array in state: ${JSON.stringify(lastFrame.state)}`);
        return;
      }

      const sorted = isSorted(endArr);
      const sameLength = endArr.length === tc.input.length;
      
      def.render(frames[0]);
      def.render(lastFrame);

      if (sorted && sameLength) {
        recordResult('sorting', algoId, tc.name, true, `Frames: ${frames.length}, Result: [${endArr.join(', ')}]`);
      } else {
        recordResult('sorting', algoId, tc.name, false, `Not sorted or length mismatch. Result: [${endArr.join(', ')}], Expected length: ${tc.input.length}, isSorted: ${sorted}`);
      }
    } catch (err) {
      recordResult('sorting', algoId, tc.name, false, `Exception thrown: ${err.message}`, err);
    }
  });
});

// =========================================================================
// PART 2: 7 DATA STRUCTURES & TREES ADVERSARIAL STRESS TESTS
// =========================================================================

// 1. Monotonic Stack
const monoStackDef = global.AlgoSystem.visualizers.get('monotonic_stack');
if (monoStackDef) {
  // Test 1a: strictly decreasing input
  try {
    const input = [10, 8, 6, 4, 2];
    const frames = monoStackDef.run(input);
    const last = frames[frames.length - 1];
    monoStackDef.render(last);
    const ans = last.state.ans;
    const ok = ans.every(x => x === -1);
    recordResult('data_structures', 'monotonic_stack', 'Strictly decreasing input', ok, `ans=[${ans.join(', ')}]`);
  } catch (e) {
    recordResult('data_structures', 'monotonic_stack', 'Strictly decreasing input', false, e.message, e);
  }

  // Test 1b: strictly increasing input
  try {
    const input = [1, 2, 3, 4, 5];
    const frames = monoStackDef.run(input);
    const last = frames[frames.length - 1];
    monoStackDef.render(last);
    const ans = last.state.ans;
    const expected = [2, 3, 4, 5, -1];
    const ok = JSON.stringify(ans) === JSON.stringify(expected);
    recordResult('data_structures', 'monotonic_stack', 'Strictly increasing input', ok, `ans=[${ans.join(', ')}], expected=[${expected.join(', ')}]`);
  } catch (e) {
    recordResult('data_structures', 'monotonic_stack', 'Strictly increasing input', false, e.message, e);
  }

  // Test 1c: all identical input
  try {
    const input = [5, 5, 5, 5];
    const frames = monoStackDef.run(input);
    const last = frames[frames.length - 1];
    monoStackDef.render(last);
    const ans = last.state.ans;
    const expected = [-1, -1, -1, -1];
    const ok = JSON.stringify(ans) === JSON.stringify(expected);
    recordResult('data_structures', 'monotonic_stack', 'All identical elements', ok, `ans=[${ans.join(', ')}]`);
  } catch (e) {
    recordResult('data_structures', 'monotonic_stack', 'All identical elements', false, e.message, e);
  }
}

// 2. Monotonic Queue
const monoQueueDef = global.AlgoSystem.visualizers.get('monotonic_queue');
if (monoQueueDef) {
  // Test 2a: window size K = 1
  try {
    const input = { nums: [4, 2, 7, 1, 9, 3], k: 1 };
    const frames = monoQueueDef.run(input);
    const last = frames[frames.length - 1];
    monoQueueDef.render(last);
    const res = last.state.results;
    const expected = [4, 2, 7, 1, 9, 3];
    const ok = JSON.stringify(res) === JSON.stringify(expected);
    recordResult('data_structures', 'monotonic_queue', 'Window size K = 1', ok, `results=[${res.join(', ')}], expected=[${expected.join(', ')}]`);
  } catch (e) {
    recordResult('data_structures', 'monotonic_queue', 'Window size K = 1', false, e.message, e);
  }

  // Test 2b: window size K = N
  try {
    const nums = [4, 2, 7, 1, 9, 3];
    const input = { nums, k: nums.length };
    const frames = monoQueueDef.run(input);
    const last = frames[frames.length - 1];
    monoQueueDef.render(last);
    const res = last.state.results;
    const expected = [9];
    const ok = JSON.stringify(res) === JSON.stringify(expected);
    recordResult('data_structures', 'monotonic_queue', 'Window size K = N', ok, `results=[${res.join(', ')}], expected=[${expected.join(', ')}]`);
  } catch (e) {
    recordResult('data_structures', 'monotonic_queue', 'Window size K = N', false, e.message, e);
  }

  // Test 2c: negative numbers in monotonic queue
  try {
    const nums = [-10, -5, -20, -1];
    const input = { nums, k: 2 };
    const frames = monoQueueDef.run(input);
    const last = frames[frames.length - 1];
    monoQueueDef.render(last);
    const res = last.state.results;
    // max([-10, -5]) = -5, max([-5, -20]) = -5, max([-20, -1]) = -1
    const expected = [-5, -5, -1];
    const ok = JSON.stringify(res) === JSON.stringify(expected);
    recordResult('data_structures', 'monotonic_queue', 'Negative numbers in sliding window', ok, `results=[${res.join(', ')}], expected=[${expected.join(', ')}]`);
  } catch (e) {
    recordResult('data_structures', 'monotonic_queue', 'Negative numbers in sliding window', false, e.message, e);
  }
}

// 3. Binary Heap
const heapDef = global.AlgoSystem.visualizers.get('binary_heap');
if (heapDef) {
  // Test 3a: duplicate values
  try {
    const input = [5, 2, 5, 8, 2, 8, 5];
    const frames = heapDef.run(input);
    const last = frames[frames.length - 1];
    heapDef.render(last);
    const heap = last.state.heap;
    let isMaxHeap = true;
    for (let i = 0; i < heap.length; i++) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < heap.length && heap[i] < heap[left]) isMaxHeap = false;
      if (right < heap.length && heap[i] < heap[right]) isMaxHeap = false;
    }
    recordResult('data_structures', 'binary_heap', 'Duplicate values', isMaxHeap, `heap=[${heap.join(', ')}], isMaxHeap=${isMaxHeap}`);
  } catch (e) {
    recordResult('data_structures', 'binary_heap', 'Duplicate values', false, e.message, e);
  }

  // Test 3b: all identical values
  try {
    const input = [3, 3, 3, 3, 3];
    const frames = heapDef.run(input);
    const last = frames[frames.length - 1];
    heapDef.render(last);
    const heap = last.state.heap;
    let isMaxHeap = true;
    for (let i = 0; i < heap.length; i++) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < heap.length && heap[i] < heap[left]) isMaxHeap = false;
      if (right < heap.length && heap[i] < heap[right]) isMaxHeap = false;
    }
    recordResult('data_structures', 'binary_heap', 'All identical values', isMaxHeap, `heap=[${heap.join(', ')}], isMaxHeap=${isMaxHeap}`);
  } catch (e) {
    recordResult('data_structures', 'binary_heap', 'All identical values', false, e.message, e);
  }
}

// 4. DSU (Disjoint Set Union)
const dsuDef = global.AlgoSystem.visualizers.get('dsu');
if (dsuDef) {
  // Test 4a: Disconnected components and single elements
  try {
    const ops = [
      { type: 'union', u: 1, v: 2 },
      { type: 'find', u: 3 },
      { type: 'find', u: 5 },
      { type: 'union', u: 4, v: 6 }
    ];
    const frames = dsuDef.run(ops);
    const last = frames[frames.length - 1];
    dsuDef.render(last);
    const parent = last.state.parent;
    function getRoot(x) {
      let curr = x;
      while (parent[curr] !== curr) curr = parent[curr];
      return curr;
    }
    const root1 = getRoot(1);
    const root2 = getRoot(2);
    const root3 = getRoot(3);
    const root4 = getRoot(4);
    const root5 = getRoot(5);
    const root6 = getRoot(6);
    const ok = (root1 === root2) && (root4 === root6) && (root3 === 3) && (root5 === 5) && (root1 !== root3) && (root1 !== root4);
    recordResult('data_structures', 'dsu', 'Disconnected components and single elements', ok, `parent=[${parent.join(', ')}]`);
  } catch (e) {
    recordResult('data_structures', 'dsu', 'Disconnected components and single elements', false, e.message, e);
  }
}

// 5. Fenwick Tree
const fenwickDef = global.AlgoSystem.visualizers.get('fenwick_tree');
if (fenwickDef) {
  // Test 5a: Single element
  try {
    const input = [42];
    const frames = fenwickDef.run(input);
    const last = frames[frames.length - 1];
    fenwickDef.render(last);
    const tree = last.state.tree;
    const ok = tree[1] === 42 && last.state.n === 1;
    recordResult('data_structures', 'fenwick_tree', 'Single element array', ok, `tree=[${tree.join(', ')}]`);
  } catch (e) {
    recordResult('data_structures', 'fenwick_tree', 'Single element array', false, e.message, e);
  }

  // Test 5b: Prefix sum queries verification
  try {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const frames = fenwickDef.run(input);
    const last = frames[frames.length - 1];
    fenwickDef.render(last);
    const tree = last.state.tree;
    function query(i) {
      let s = 0;
      let idx = i;
      while (idx > 0) {
        s += tree[idx];
        idx -= (idx & (-idx));
      }
      return s;
    }
    let allSumsCorrect = true;
    let expectedPrefix = 0;
    for (let i = 1; i <= input.length; i++) {
      expectedPrefix += input[i - 1];
      if (query(i) !== expectedPrefix) {
        allSumsCorrect = false;
        break;
      }
    }
    recordResult('data_structures', 'fenwick_tree', 'Prefix sum queries', allSumsCorrect, `all 8 prefix sums match standard prefix sums`);
  } catch (e) {
    recordResult('data_structures', 'fenwick_tree', 'Prefix sum queries', false, e.message, e);
  }
}

// 6. Segment Tree
const segDef = global.AlgoSystem.visualizers.get('segment_tree');
if (segDef) {
  // Test 6a: Build and root sum verification
  try {
    const input = [1, 3, 5, 7, 9, 11];
    const frames = segDef.run(input);
    const last = frames[frames.length - 1];
    segDef.render(last);
    const tree = last.state.tree;
    const expectedTotal = input.reduce((a, b) => a + b, 0);
    const ok = tree[1] === expectedTotal;
    recordResult('data_structures', 'segment_tree', 'Build and root sum verification', ok, `tree[1]=${tree[1]}, expected=${expectedTotal}`);
  } catch (e) {
    recordResult('data_structures', 'segment_tree', 'Build and root sum verification', false, e.message, e);
  }

  // Test 6b: Single element segment tree
  try {
    const input = [99];
    const frames = segDef.run(input);
    const last = frames[frames.length - 1];
    segDef.render(last);
    const tree = last.state.tree;
    const ok = tree[1] === 99;
    recordResult('data_structures', 'segment_tree', 'Single element build', ok, `tree[1]=${tree[1]}, expected=99`);
  } catch (e) {
    recordResult('data_structures', 'segment_tree', 'Single element build', false, e.message, e);
  }

  // Test 6c: Point / Range update functionality check
  try {
    // Check if segment tree frames support update or range update animation
    const frames = segDef.run([1, 3, 5, 7, 9, 11]);
    const updateActions = frames.filter(f => f.action === 'MODIFY' || f.action === 'SWAP' || (f.explanation && f.explanation.includes('更新')));
    const hasUpdates = updateActions.length > 0;
    recordResult('data_structures', 'segment_tree', 'Point/range updates support in frames', hasUpdates, 
      hasUpdates ? 'Found update frames' : 'MISSING: Segment tree only has 2 frames (build start/done), does not simulate or animate point or range updates with lazy tags'
    );
  } catch (e) {
    recordResult('data_structures', 'segment_tree', 'Point/range updates support in frames', false, e.message, e);
  }
}

// 7. Trie
const trieDef = global.AlgoSystem.visualizers.get('trie');
if (trieDef) {
  try {
    const input = ['a', 'ab', 'abc', 'xyz'];
    const frames = trieDef.run(input);
    const last = frames[frames.length - 1];
    trieDef.render(last);
    const tree = last.state.tree;
    const hasA = !!(tree.children && tree.children['a']);
    const hasX = !!(tree.children && tree.children['x']);
    const aEnd = tree.children['a'].isEnd === true;
    const abEnd = tree.children['a'].children['b'].isEnd === true;
    const abcEnd = tree.children['a'].children['b'].children['c'].isEnd === true;
    const ok = hasA && hasX && aEnd && abEnd && abcEnd;
    recordResult('data_structures', 'trie', 'Prefix tree branching and isEnd flags', ok, `hasA=${hasA}, hasX=${hasX}, aEnd=${aEnd}, abEnd=${abEnd}, abcEnd=${abcEnd}`);
  } catch (e) {
    recordResult('data_structures', 'trie', 'Prefix tree branching and isEnd flags', false, e.message, e);
  }
}

// Output summary
console.log('================================================================');
console.log('=== EMPIRICAL CHALLENGE RESULTS SUMMARY ===');
console.log('================================================================');

let total = results.length;
let passed = results.filter(r => r.success).length;
let failed = results.filter(r => !r.success).length;

console.log(`Total test cases: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

console.log('\n--- DETAILED FAILURES ---');
results.filter(r => !r.success).forEach(r => {
  console.log(`❌ [FAIL] [${r.category.toUpperCase()}] ${r.target} -> ${r.testCase}: ${r.detail}`);
  if (r.exception) {
    console.log(`   Stack: ${r.exception}`);
  }
});

console.log('\n--- DETAILED PASSES COUNT: ' + passed + ' ---');

process.exit(failed > 0 ? 1 : 0);
