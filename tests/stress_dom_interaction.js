/**
 * @file tests/stress_dom_interaction.js
 * @description Empirical DOM-level interaction tests for Controls and Calculator.
 */

const fs = require('fs');
const path = require('path');

// Read actual index.html to extract real element IDs
const htmlPath = path.resolve(__dirname, '../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

console.log('================================================================');
console.log('=== EMPIRICAL DOM INTERACTION TEST SUITE: CONTROLS & CALC ===');
console.log('================================================================\n');

// Build lightweight DOM mock matching index.html IDs
const elements = {};
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
    },
    removeChild: function(child) {
      const idx = this.children.indexOf(child);
      if (idx >= 0) this.children.splice(idx, 1);
      child.parentNode = null;
    },
    closest: function(sel) { return null; },
    querySelectorAll: function(sel) { return []; }
  };
  return el;
}

const elementIds = [
  'btnPlayPause', 'btnStepPrev', 'btnStepNext', 'btnReset',
  'timelineSlider', 'stepCounter', 'actionBadge', 'speedSlider',
  'speedValue', 'presetSelect', 'customInput', 'btnApplyInput',
  'btnRandomInput', 'iconPlay', 'iconPause',
  'calculatorModal', 'openCalculatorBtn', 'closeCalcModalBtn',
  'closeCalcModalFooterBtn', 'calcInputN', 'btnRunCalc',
  'calcPresetChips', 'resComplexity', 'resMaxOps', 'resCandidatesList',
  'toastContainer'
];

elementIds.forEach(id => {
  // calculatorModal in index.html starts with 'modal-backdrop hidden'
  const classes = (id === 'calculatorModal') ? ['modal-backdrop', 'hidden'] : [];
  elements[id] = createMockElement(id, 'div', classes);
});

// Setup mock window and document
const windowHandlers = {};
global.window = {
  AlgoSystem: {},
  addEventListener: (evt, handler) => {
    windowHandlers[evt] = windowHandlers[evt] || [];
    windowHandlers[evt].push(handler);
  },
  triggerWindow: (evt, eventObj = {}) => {
    if (windowHandlers[evt]) {
      windowHandlers[evt].forEach(fn => fn(eventObj));
    }
  }
};

global.document = {
  getElementById: (id) => elements[id] || null,
  activeElement: null,
  body: createMockElement('body', 'body'),
  createElement: (tag) => createMockElement('created_' + tag, tag),
  addEventListener: () => {}
};

// Load code
require('../js/engine/types.js');
require('../js/engine/storage.js');
require('../js/engine/controller.js');
require('../js/components/calculator.js');
require('../js/components/controls.js');

const Controls = global.window.AlgoSystem.components.Controls;
const Calculator = global.window.AlgoSystem.components.Calculator;
const PlaybackController = global.window.AlgoSystem.PlaybackController;

const controller = new PlaybackController();
let dataReloadedWith = null;

// Initialize controls with controller and callback
Controls.init({
  controller: controller,
  onDataReload: (data) => {
    dataReloadedWith = data;
  }
});

// Initialize calculator
Calculator.init();

let passCount = 0;
let failCount = 0;

function assert(cond, msg) {
  if (cond) {
    passCount++;
    console.log(`  ✓ [PASS] ${msg}`);
  } else {
    failCount++;
    console.error(`  ✗ [FAIL] ${msg}`);
  }
}

console.log('\n[DOM Test 1: Controls Invalid Input Flow]');
// 1. Enter invalid string "1, 2, abc, 4" into customInput and click Apply
elements['customInput'].value = '1, 2, abc, 4';
elements['btnApplyInput'].trigger('click');

assert(elements['customInput'].classList.contains('shake'), 'Input shake class added on invalid input');
assert(elements['customInput'].classList.contains('input-invalid'), 'input-invalid class added on invalid input');
assert(elements['toastContainer'].children.length > 0, 'Toast container received error notification');
const latestToast = elements['toastContainer'].children[elements['toastContainer'].children.length - 1];
assert(latestToast.textContent.includes('abc'), 'Toast item contains error details ("abc")');
assert(dataReloadedWith === null, 'onDataReload was NOT triggered for invalid input');

console.log('\n[DOM Test 2: Controls Valid Input Flow]');
// 2. Enter valid string "42, 10, 88, 15" into customInput and press Enter key
elements['customInput'].value = '42, 10, 88, 15';
elements['customInput'].trigger('keydown', { key: 'Enter', preventDefault: () => {} });

assert(elements['customInput'].value === '42, 10, 88, 15', 'customInput normalized');
assert(JSON.stringify(dataReloadedWith) === JSON.stringify([42, 10, 88, 15]), 'onDataReload called with parsed numbers');

console.log('\n[DOM Test 3: Controls Truncation Warning (> 35 elements)]');
const largeArr = Array.from({ length: 40 }, (_, i) => i + 1);
elements['customInput'].value = largeArr.join(', ');
elements['btnApplyInput'].trigger('click');

assert(dataReloadedWith.length === 35, 'Large array clamped to exactly 35 elements');
assert(elements['customInput'].value.split(', ').length === 35, 'customInput updated with truncated 35 elements');
const warnToast = elements['toastContainer'].children[elements['toastContainer'].children.length - 1];
assert(warnToast.textContent.includes('自动截断前 35 项'), 'Warning toast emitted for data truncation');

console.log('\n[DOM Test 4: Calculator Modal Open & Close]');
assert(elements['calculatorModal'].classList.contains('hidden'), 'Calculator modal initially hidden');

// Click open button
elements['openCalculatorBtn'].trigger('click');
assert(!elements['calculatorModal'].classList.contains('hidden'), 'Modal visible after clicking open button');
assert(global.document.body.classList.contains('modal-open'), 'body has modal-open class');

// Click close button
elements['closeCalcModalBtn'].trigger('click');
assert(elements['calculatorModal'].classList.contains('hidden'), 'Modal hidden after clicking close button');
assert(!global.document.body.classList.contains('modal-open'), 'body modal-open class removed');

console.log('\n[DOM Test 5: Calculator DOM Calculation Trigger]');
// Open modal and enter N = 5000, click Calculate
Calculator.openModal();
elements['calcInputN'].value = '5000';
elements['btnRunCalc'].trigger('click');

assert(elements['resComplexity'].textContent.includes('O(N²)'), 'resComplexity displays O(N²) for N = 5000');
assert(elements['resMaxOps'].textContent.includes('10⁸'), 'resMaxOps displays 10^8 ops');
assert(elements['resCandidatesList'].innerHTML.includes('0-1 背包与完全背包'), 'resCandidatesList contains Knapsack for N=5000');
assert(elements['resCandidatesList'].innerHTML.includes('最长上升子序列 (LIS)'), 'resCandidatesList contains LIS for N=5000');

console.log('\n[DOM Test 6: Calculator DOM Calculation with Large N = 10^18]');
elements['calcInputN'].value = '10^18';
elements['btnRunCalc'].trigger('click');

assert(elements['resComplexity'].textContent.includes('O(log N)'), 'resComplexity displays O(log N) for N = 10^18');
assert(elements['resCandidatesList'].innerHTML.includes('快速幂与逆元计算'), 'resCandidatesList contains Fast Power for N=10^18');
assert(elements['resCandidatesList'].innerHTML.includes('矩阵快速幂加速递推'), 'resCandidatesList contains Matrix Fast Power for N=10^18');

console.log('\n================================================================');
console.log(`DOM TESTS SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL DOM INTERACTION TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
