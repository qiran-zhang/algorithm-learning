/**
 * @file tests/test_m1_stress.js
 * @description Adversarial challenge and stress-test suite for Milestone 1:
 * - PlaybackController (boundary values, degenerate inputs, lifecycle, rapid toggling)
 * - StorageAdapter (SecurityError sandbox, QuotaExceededError, memory fallback, falsy values)
 * - SnapshotFrame & Types
 */

const assert = require('assert');
const path = require('path');

console.log('===============================================================');
console.log('   M1 ENGINE & STORAGE ADVERSARIAL STRESS TEST SUITE           ');
console.log('===============================================================');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function testCase(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    failedTests++;
    failures.push({ name, error: err.message, stack: err.stack });
    console.log(`  ✗ FAIL: ${name}`);
    console.log(`    -> Error: ${err.message}`);
  }
}

async function asyncTestCase(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    failedTests++;
    failures.push({ name, error: err.message, stack: err.stack });
    console.log(`  ✗ FAIL: ${name}`);
    console.log(`    -> Error: ${err.message}`);
  }
}

// Helper to reset and bootstrap a fresh sandbox environment
function createSandbox(storageMockFactory) {
  const sandbox = {};
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.document = {
    activeElement: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({
      tagName: 'DIV',
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      addEventListener: () => {}
    })
  };
  sandbox.location = { hash: '' };

  // Timer mock / RAF mock
  let timerIdCounter = 1;
  const activeTimers = new Map();
  sandbox.requestAnimationFrame = (cb) => {
    const id = timerIdCounter++;
    const t = setTimeout(() => {
      activeTimers.delete(id);
      cb(Date.now());
    }, 16);
    activeTimers.set(id, t);
    return id;
  };
  sandbox.cancelAnimationFrame = (id) => {
    if (activeTimers.has(id)) {
      clearTimeout(activeTimers.get(id));
      activeTimers.delete(id);
    }
  };
  sandbox._getActiveTimerCount = () => activeTimers.size;

  if (storageMockFactory) {
    storageMockFactory(sandbox);
  }

  // Load modules into sandbox
  const typesPath = path.resolve(__dirname, '../js/engine/types.js');
  const storagePath = path.resolve(__dirname, '../js/engine/storage.js');
  const controllerPath = path.resolve(__dirname, '../js/engine/controller.js');

  const fs = require('fs');
  const vm = require('vm');
  const context = vm.createContext(sandbox);

  vm.runInContext(fs.readFileSync(typesPath, 'utf8'), context);
  vm.runInContext(fs.readFileSync(storagePath, 'utf8'), context);
  vm.runInContext(fs.readFileSync(controllerPath, 'utf8'), context);

  return sandbox;
}

// Run the suites
(async function runAllSuites() {

  // =========================================================================
  // SUITE 1: PlaybackController - Empty frames array controller.loadFrames([])
  // =========================================================================
  console.log('\n--- SUITE 1: Empty Frames Array controller.loadFrames([]) ---');

  {
    const sb = createSandbox();
    const { PlaybackController, SnapshotFrame } = sb.AlgoSystem;
    const controller = new PlaybackController();

    testCase('1.1: loadFrames([]) initializes safely without error', () => {
      controller.loadFrames([]);
      assert.strictEqual(controller.frames.length, 0);
      assert.strictEqual(controller.currentStep, 0);
      assert.strictEqual(controller.state, 'IDLE');
      assert.strictEqual(controller.getCurrentFrame(), null);
    });

    testCase('1.2: getProgress() on empty frames returns zero percentage and step 0', () => {
      const prog = controller.getProgress();
      assert.strictEqual(prog.currentStep, 0);
      assert.strictEqual(prog.totalSteps, 0);
      assert.strictEqual(prog.percentage, 0);
      assert.strictEqual(prog.state, 'IDLE');
    });

    testCase('1.3: stepForward() on empty frames does not throw, underflow or overflow', () => {
      const ret = controller.stepForward();
      assert.strictEqual(ret, controller);
      assert.strictEqual(controller.currentStep, 0);
      assert.strictEqual(controller.getCurrentFrame(), null);
    });

    testCase('1.4: stepBackward() on empty frames does not throw, underflow or overflow', () => {
      const ret = controller.stepBackward();
      assert.strictEqual(ret, controller);
      assert.strictEqual(controller.currentStep, 0);
      assert.strictEqual(controller.getCurrentFrame(), null);
    });

    testCase('1.5: jumpToStep(0), jumpToStep(-5), jumpToStep(99999) on empty frames does not throw', () => {
      controller.jumpToStep(0);
      controller.jumpToStep(-5);
      controller.jumpToStep(99999);
      assert.strictEqual(controller.currentStep, 0);
      assert.strictEqual(controller.getCurrentFrame(), null);
    });

    testCase('1.6: play() on empty frames returns this and does not transition to RUNNING', () => {
      controller.play();
      assert.strictEqual(controller.state, 'IDLE');
      assert.strictEqual(sb._getActiveTimerCount(), 0, 'No timer should be scheduled for empty frames');
    });

    testCase('1.7: reset() and destroy() on empty frames does not throw', () => {
      controller.reset();
      assert.strictEqual(controller.currentStep, 0);
      controller.destroy();
      assert.strictEqual(controller.frames.length, 0);
    });
  }

  // =========================================================================
  // SUITE 2: PlaybackController - Single Frame Array controller.loadFrames([frame0])
  // =========================================================================
  console.log('\n--- SUITE 2: Single Frame Array controller.loadFrames([frame0]) ---');

  {
    const sb = createSandbox();
    const { PlaybackController, SnapshotFrame } = sb.AlgoSystem;
    const controller = new PlaybackController({ speed: 50 });
    const singleFrame = new SnapshotFrame({
      step: 0,
      action: 'HIGHLIGHT',
      state: [42],
      explanation: 'Only single element 42'
    });

    testCase('2.1: loadFrames([singleFrame]) sets step 0 and 100% progress', () => {
      controller.loadFrames([singleFrame]);
      assert.strictEqual(controller.frames.length, 1);
      assert.strictEqual(controller.currentStep, 0);
      assert.strictEqual(controller.getCurrentFrame(), singleFrame);
      const prog = controller.getProgress();
      assert.strictEqual(prog.percentage, 100, 'Single frame must be 100%');
    });

    testCase('2.2: stepBackward() on single frame does not underflow below step 0', () => {
      controller.stepBackward();
      assert.strictEqual(controller.currentStep, 0);
      assert.strictEqual(controller.state, 'IDLE');
      controller.stepBackward();
      assert.strictEqual(controller.currentStep, 0);
    });

    testCase('2.3: stepForward() on single frame sets FINISHED and does not overflow step 0', () => {
      controller.stepForward();
      assert.strictEqual(controller.currentStep, 0);
      assert.strictEqual(controller.state, 'FINISHED');
      controller.stepForward();
      assert.strictEqual(controller.currentStep, 0);
      assert.strictEqual(controller.state, 'FINISHED');
    });

    testCase('2.4: jumpToStep(-5) and jumpToStep(99999) on single frame clamp strictly to 0', () => {
      controller.jumpToStep(-5);
      assert.strictEqual(controller.currentStep, 0);
      controller.jumpToStep(99999);
      assert.strictEqual(controller.currentStep, 0);
      assert.strictEqual(controller.state, 'FINISHED');
    });

    await asyncTestCase('2.5: play() on single frame finishes cleanly without infinite loop', async () => {
      controller.reset();
      controller.play();
      assert.strictEqual(controller.state, 'RUNNING');
      // Wait for at least one animation tick
      await new Promise(r => setTimeout(r, 120));
      assert.strictEqual(controller.state, 'FINISHED');
      assert.strictEqual(controller.currentStep, 0);
      assert.strictEqual(sb._getActiveTimerCount(), 0, 'Timer must be cleaned up after finishing');
    });
  }

  // =========================================================================
  // SUITE 3: PlaybackController - Stepping & Out-of-Bounds jumpToStep
  // =========================================================================
  console.log('\n--- SUITE 3: Boundary Stepping & Out-of-Bounds Scrubbing ---');

  {
    const sb = createSandbox();
    const { PlaybackController, SnapshotFrame } = sb.AlgoSystem;
    const controller = new PlaybackController();
    const frames = [0, 1, 2, 3, 4].map(i => new SnapshotFrame({
      step: i,
      action: 'COMPARE',
      state: [i],
      explanation: `Step ${i}`
    }));
    controller.loadFrames(frames);

    testCase('3.1: Stepping backward at step 0 (100 iterations) does not underflow below 0', () => {
      assert.strictEqual(controller.currentStep, 0);
      for (let i = 0; i < 100; i++) {
        controller.stepBackward();
        assert.strictEqual(controller.currentStep, 0, `Step underflowed at iteration ${i}`);
        assert.strictEqual(controller.state, 'IDLE');
      }
    });

    testCase('3.2: Stepping forward past last step (100 iterations) does not overflow past 4', () => {
      // Step to end
      for (let i = 0; i < 4; i++) {
        controller.stepForward();
      }
      assert.strictEqual(controller.currentStep, 4);
      assert.strictEqual(controller.state, 'FINISHED');

      // Attempt 100 further forward steps
      for (let i = 0; i < 100; i++) {
        controller.stepForward();
        assert.strictEqual(controller.currentStep, 4, `Step overflowed at iteration ${i}`);
        assert.strictEqual(controller.state, 'FINISHED');
      }
    });

    testCase('3.3: jumpToStep(-5), jumpToStep(-99999), jumpToStep(-Infinity) clamp to 0', () => {
      controller.jumpToStep(-5);
      assert.strictEqual(controller.currentStep, 0);
      controller.jumpToStep(-99999);
      assert.strictEqual(controller.currentStep, 0);
      controller.jumpToStep(-Infinity);
      assert.strictEqual(controller.currentStep, 0);
    });

    testCase('3.4: jumpToStep(99999), jumpToStep(Infinity) clamp to last step (4) and set FINISHED', () => {
      controller.jumpToStep(99999);
      assert.strictEqual(controller.currentStep, 4);
      assert.strictEqual(controller.state, 'FINISHED');

      controller.jumpToStep(2);
      assert.strictEqual(controller.currentStep, 2);
      assert.strictEqual(controller.state, 'PAUSED');

      controller.jumpToStep(Infinity);
      assert.strictEqual(controller.currentStep, 4);
      assert.strictEqual(controller.state, 'FINISHED');
    });

    testCase('3.5: jumpToStep with non-numeric inputs (NaN, null, undefined, "abc") defaults safely to 0', () => {
      controller.jumpToStep(3);
      assert.strictEqual(controller.currentStep, 3);
      controller.jumpToStep(NaN);
      assert.strictEqual(controller.currentStep, 0);

      controller.jumpToStep(3);
      controller.jumpToStep(null);
      assert.strictEqual(controller.currentStep, 0);

      controller.jumpToStep(3);
      controller.jumpToStep('invalid_string');
      assert.strictEqual(controller.currentStep, 0);
    });

    testCase('3.6: jumpToStep with float rounds correctly to nearest integer step', () => {
      controller.jumpToStep(2.4);
      assert.strictEqual(controller.currentStep, 2);
      controller.jumpToStep(2.6);
      assert.strictEqual(controller.currentStep, 3);
    });
  }

  // =========================================================================
  // SUITE 4: PlaybackController - Stress, Rapid Toggling & Destroy Lifecycle
  // =========================================================================
  console.log('\n--- SUITE 4: Stress, Rapid Toggling & Destroy Lifecycle ---');

  {
    const sb = createSandbox();
    const { PlaybackController, SnapshotFrame } = sb.AlgoSystem;
    const frames = [0, 1, 2, 3, 4, 5].map(i => new SnapshotFrame({
      step: i,
      action: 'SWAP',
      state: [i],
      explanation: `Step ${i}`
    }));
    const controller = new PlaybackController({ frames });

    testCase('4.1: Rapidly toggling play() and pause() 1000 times in a tight loop does not crash or leak timers', () => {
      for (let i = 0; i < 1000; i++) {
        controller.play();
        controller.pause();
      }
      assert.strictEqual(controller.state, 'PAUSED');
      assert.strictEqual(sb._getActiveTimerCount(), 0, 'All timers must be cleared when paused');
    });

    testCase('4.2: Rapidly calling togglePlay() 1000 times in a tight loop toggles cleanly', () => {
      // Starting from PAUSED
      for (let i = 0; i < 1000; i++) {
        controller.togglePlay();
      }
      // After an even number (1000) of toggles from PAUSED, should be back to PAUSED
      assert.strictEqual(controller.state, 'PAUSED');
      assert.strictEqual(sb._getActiveTimerCount(), 0);
    });

    testCase('4.3: Calling controller.destroy() while RUNNING cleans up timers and frames', () => {
      controller.play();
      assert.strictEqual(controller.state, 'RUNNING');
      assert(sb._getActiveTimerCount() > 0, 'Should have active timer while running');

      controller.destroy();
      assert.strictEqual(sb._getActiveTimerCount(), 0, 'Timer must be cancelled on destroy');
      assert.strictEqual(controller.frames.length, 0, 'Frames must be cleared');
      assert.strictEqual(controller.getCurrentFrame(), null);
    });

    testCase('4.4: Invoking public methods on destroyed controller does not throw', () => {
      controller.play();
      controller.pause();
      controller.stepForward();
      controller.stepBackward();
      controller.jumpToStep(3);
      controller.reset();
      assert.strictEqual(controller.getCurrentFrame(), null);
    });

    testCase('4.5: Multiple consecutive play() calls while running must NOT spawn duplicate timers', () => {
      const c2 = new PlaybackController({ frames });
      c2.play();
      const initialTimerCount = sb._getActiveTimerCount();
      for (let i = 0; i < 10; i++) {
        c2.play();
      }
      const finalTimerCount = sb._getActiveTimerCount();
      c2.pause();
      assert.strictEqual(initialTimerCount, 1, 'Should have exactly 1 timer when playing');
      assert.strictEqual(finalTimerCount, 1, 'Calling play() repeatedly while running must not spawn duplicate timer tasks');
    });
  }

  // =========================================================================
  // SUITE 5: StorageAdapter - Simulated Restricted localStorage (SecurityError Sandbox)
  // =========================================================================
  console.log('\n--- SUITE 5: StorageAdapter - Simulated SecurityError Sandbox ---');

  {
    // Simulate browser environment where localStorage throws SecurityError on access
    const sb = createSandbox((sandbox) => {
      Object.defineProperty(sandbox, 'localStorage', {
        get() {
          const err = new Error('SecurityError: The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        },
        configurable: true
      });
    });

    const { StorageAdapter } = sb.AlgoSystem;
    const adapter = new StorageAdapter({ prefix: 'test_' });

    testCase('5.1: StorageAdapter detects SecurityError and marks isPersistent() as false', () => {
      assert.strictEqual(adapter.isPersistent(), false);
    });

    testCase('5.2: Memory fallback correctly sets and gets primitive values', () => {
      assert.strictEqual(adapter.set('number_val', 12345), true);
      assert.strictEqual(adapter.get('number_val'), 12345);

      assert.strictEqual(adapter.set('string_val', 'Lanqiao Cup 16th'), true);
      assert.strictEqual(adapter.get('string_val'), 'Lanqiao Cup 16th');
    });

    testCase('5.3: Memory fallback correctly preserves complex nested objects and arrays', () => {
      const data = {
        category: 'sorting',
        progress: [1, 2, 3],
        meta: { completed: true, score: 99.5 }
      };
      assert.strictEqual(adapter.set('complex_obj', data), true);
      const retrieved = adapter.get('complex_obj');
      assert.deepStrictEqual(retrieved, data);
    });

    testCase('5.4: Memory fallback has() and remove() work correctly', () => {
      assert.strictEqual(adapter.has('complex_obj'), true);
      assert.strictEqual(adapter.remove('complex_obj'), true);
      assert.strictEqual(adapter.has('complex_obj'), false);
      assert.strictEqual(adapter.get('complex_obj', 'default_missing'), 'default_missing');
    });

    testCase('5.5: Memory fallback exportJSON and importJSON work under SecurityError', () => {
      adapter.set('export_1', 'val1');
      adapter.set('export_2', 'val2');
      const exported = adapter.exportJSON();
      assert(typeof exported === 'string' && exported.includes('val1') && exported.includes('val2'));

      adapter.clear();
      assert.strictEqual(adapter.has('export_1'), false);
      assert.strictEqual(adapter.has('export_2'), false);

      const imported = adapter.importJSON(exported);
      assert.strictEqual(imported, true);
      assert.strictEqual(adapter.get('export_1'), 'val1');
      assert.strictEqual(adapter.get('export_2'), 'val2');
    });
  }

  // =========================================================================
  // SUITE 6: StorageAdapter - Simulated QuotaExceededError (Dynamic Quota Limit)
  // =========================================================================
  console.log('\n--- SUITE 6: StorageAdapter - Simulated QuotaExceededError ---');

  {
    // Simulate browser environment where localStorage is initially accessible,
    // but setItem throws QuotaExceededError when data exceeds simulated quota.
    let quotaLimit = 100; // characters
    const mockStore = {};

    const sb = createSandbox((sandbox) => {
      sandbox.localStorage = {
        setItem(key, value) {
          const serialized = String(value);
          if (serialized.length > quotaLimit) {
            const err = new Error('QuotaExceededError: The quota has been exceeded.');
            err.name = 'QuotaExceededError';
            throw err;
          }
          mockStore[key] = serialized;
        },
        getItem(key) {
          return Object.prototype.hasOwnProperty.call(mockStore, key) ? mockStore[key] : null;
        },
        removeItem(key) {
          delete mockStore[key];
        },
        clear() {
          Object.keys(mockStore).forEach(k => delete mockStore[k]);
        },
        get length() {
          return Object.keys(mockStore).length;
        },
        key(i) {
          return Object.keys(mockStore)[i] || null;
        }
      };
    });

    const { StorageAdapter } = sb.AlgoSystem;
    const adapter = new StorageAdapter();

    testCase('6.1: StorageAdapter initializes with isPersistent() = true under normal quota', () => {
      assert.strictEqual(adapter.isPersistent(), true);
    });

    testCase('6.2: Small payload within quota saves to both localStorage and memoryStore', () => {
      const ok = adapter.set('small_key', { count: 10 });
      assert.strictEqual(ok, true);
      assert.deepStrictEqual(JSON.parse(JSON.stringify(adapter.get('small_key'))), { count: 10 });
      assert(mockStore['small_key'] !== undefined, 'Should be saved in mockStore');
    });

    testCase('6.3: Large payload exceeding quota throws QuotaExceededError on localStorage; memory fallback MUST preserve data across get/set', () => {
      const hugeString = 'X'.repeat(500); // 500 chars > quotaLimit (100)
      const ok = adapter.set('large_key', { data: hugeString });
      assert.strictEqual(ok, true, 'set() should return true as memory store took it');

      // Verify localStorage rejected it due to quota
      assert.strictEqual(mockStore['large_key'], undefined, 'localStorage must not contain large_key due to quota error');

      // Now verify get() still retrieves the data from memory fallback!
      const retrieved = adapter.get('large_key');
      assert(retrieved !== null, 'get("large_key") must not return null/defaultValue');
      assert.deepStrictEqual(retrieved, { data: hugeString }, 'Memory fallback must preserve data across get/set when QuotaExceeded occurs');
    });

    testCase('6.4: has("large_key") returns true and remove("large_key") cleans memoryStore', () => {
      assert.strictEqual(adapter.has('large_key'), true);
      adapter.remove('large_key');
      assert.strictEqual(adapter.has('large_key'), false);
      assert.strictEqual(adapter.get('large_key'), null);
    });
  }

  // =========================================================================
  // SUITE 7: StorageAdapter - Falsy Values & Edge Inputs
  // =========================================================================
  console.log('\n--- SUITE 7: StorageAdapter - Falsy Values & Edge Inputs ---');

  {
    const sb = createSandbox();
    const { StorageAdapter } = sb.AlgoSystem;
    const adapter = new StorageAdapter();

    testCase('7.1: Storing falsy value 0 returns 0, NOT the default fallback', () => {
      adapter.set('key_zero', 0);
      assert.strictEqual(adapter.get('key_zero', 999), 0, 'Must return 0, not defaultValue 999');
    });

    testCase('7.2: Storing falsy value false returns false, NOT defaultValue', () => {
      adapter.set('key_false', false);
      assert.strictEqual(adapter.get('key_false', true), false, 'Must return false, not defaultValue true');
    });

    testCase('7.3: Storing falsy value empty string "" returns "", NOT defaultValue', () => {
      adapter.set('key_empty_str', '');
      assert.strictEqual(adapter.get('key_empty_str', 'fallback'), '', 'Must return "", not defaultValue');
    });

    testCase('7.4: Non-string or empty keys in get/set/has/remove return safe defaults without throwing', () => {
      assert.strictEqual(adapter.get('', 'def'), 'def');
      assert.strictEqual(adapter.get(null, 'def'), 'def');
      assert.strictEqual(adapter.get(undefined, 'def'), 'def');
      assert.strictEqual(adapter.get(123, 'def'), 'def');

      assert.strictEqual(adapter.set('', 'val'), false);
      assert.strictEqual(adapter.set(null, 'val'), false);
      assert.strictEqual(adapter.has(''), false);
      assert.strictEqual(adapter.remove(''), false);
    });
  }

  // =========================================================================
  // Summary & Exit Code
  // =========================================================================
  console.log('\n===============================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  console.log('===============================================================');

  if (failedTests > 0) {
    console.log('\nFAILURES SUMMARY:');
    failures.forEach((f, idx) => {
      console.log(`\n[#${idx + 1}] ${f.name}`);
      console.log(f.error);
    });
    process.exit(1);
  } else {
    console.log('\nALL ADVERSARIAL STRESS TESTS PASSED EMPIRICALLY!');
    process.exit(0);
  }

})();
