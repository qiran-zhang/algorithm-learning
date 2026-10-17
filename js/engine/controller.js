/**
 * @file controller.js
 * @description PlaybackController managing state frames, timing loop, and time-travel controls.
 * @namespace window.AlgoSystem.PlaybackController
 *
 * 16th Blue Bridge Cup Algorithm Learning & Visualization Platform
 * Zero-CORS, Zero-build, file:// protocol compatible.
 */
(function(global) {
  'use strict';

  global.AlgoSystem = global.AlgoSystem || {};

  const PlaybackStates = (global.AlgoSystem.Types && global.AlgoSystem.Types.PlaybackStates) || {
    IDLE: 'IDLE',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    FINISHED: 'FINISHED'
  };

  class PlaybackController {
    /**
     * @param {Object} [options]
     * @param {SnapshotFrame[]} [options.frames] - Initial frame sequence
     * @param {number} [options.speed=300] - Initial delay in ms (50 - 1500)
     * @param {Function} [options.onFrameChange] - Frame change hook
     * @param {Function} [options.onStateChange] - State change hook
     * @param {Function} [options.onSpeedChange] - Speed change hook
     */
    constructor(options = {}) {
      this.frames = [];
      this.currentStep = 0;
      this.state = PlaybackStates.IDLE;

      // Speed in ms per frame: 50ms (fast) to 1500ms (slow)
      this.speed = Math.max(50, Math.min(1500, Number(options.speed) || 300));

      // rAF & Timing Handles
      this._rafId = null;
      this._lastFrameTime = null;
      this._boundLoop = this._animationLoop.bind(this);

      // Event Listeners Map: { eventName: Set<Function> }
      this._listeners = {
        frameChange: new Set(),
        stateChange: new Set(),
        speedChange: new Set(),
        reset: new Set(),
        load: new Set()
      };

      // Register initial hooks if supplied
      if (typeof options.onFrameChange === 'function') {
        this.on('frameChange', options.onFrameChange);
      }
      if (typeof options.onStateChange === 'function') {
        this.on('stateChange', options.onStateChange);
      }
      if (typeof options.onSpeedChange === 'function') {
        this.on('speedChange', options.onSpeedChange);
      }

      // Active singleton visualizer renderer
      this._currentRenderer = null;
      this._currentRendererWrapper = null;

      // Load initial frames if provided
      if (Array.isArray(options.frames) && options.frames.length > 0) {
        this.loadFrames(options.frames);
      }
    }

    // ==========================================
    // Event Subscription API
    // ==========================================

    on(event, callback) {
      if (this._listeners[event] && typeof callback === 'function') {
        this._listeners[event].add(callback);
      }
      return this;
    }

    off(event, callback) {
      if (this._listeners[event]) {
        this._listeners[event].delete(callback);
      }
      return this;
    }

    /**
     * Set the active singleton visualizer renderer.
     * Automatically unbinds any previous visualizer renderer to prevent leaks and layer conflicts.
     * @param {Function|null} rendererFn - (payload) => void
     * @returns {PlaybackController}
     */
    setRenderer(rendererFn) {
      if (this._currentRendererWrapper) {
        this.off('frameChange', this._currentRendererWrapper);
        this._currentRendererWrapper = null;
      }
      if (typeof rendererFn === 'function') {
        this._currentRenderer = rendererFn;
        this._currentRendererWrapper = (payload) => {
          try {
            rendererFn(payload);
          } catch (err) {
            console.error('[PlaybackController] Error in active renderer:', err);
          }
        };
        this.on('frameChange', this._currentRendererWrapper);
      } else {
        this._currentRenderer = null;
      }
      return this;
    }

    _emit(event, data) {
      if (this._listeners[event]) {
        this._listeners[event].forEach(cb => {
          try {
            cb(data);
          } catch (err) {
            console.error(`[PlaybackController] Error in '${event}' listener:`, err);
          }
        });
      }
    }

    // ==========================================
    // State & Timing Control
    // ==========================================

    _setState(newState) {
      if (this.state === newState) return;
      const prevState = this.state;
      this.state = newState;
      this._emit('stateChange', { state: this.state, prevState });
    }

    _cancelTimer() {
      if (this._rafId !== null) {
        const cancelRaf = (typeof cancelAnimationFrame === 'function')
          ? cancelAnimationFrame
          : (typeof global !== 'undefined' && typeof global.cancelAnimationFrame === 'function')
            ? global.cancelAnimationFrame
            : null;

        if (cancelRaf) {
          cancelRaf(this._rafId);
        } else if (typeof clearTimeout === 'function') {
          clearTimeout(this._rafId);
        }
        this._rafId = null;
      }
      this._lastFrameTime = null;
    }

    _animationLoop(timestamp) {
      if (this.state !== PlaybackStates.RUNNING) {
        this._cancelTimer();
        return;
      }

      if (this._lastFrameTime === null) {
        this._lastFrameTime = timestamp;
      }

      const elapsed = timestamp - this._lastFrameTime;

      if (elapsed >= this.speed) {
        this._lastFrameTime = timestamp;
        const hasNext = this._advanceStep();
        if (!hasNext) {
          this._cancelTimer();
          return;
        }
      }

      if (typeof requestAnimationFrame === 'function') {
        this._rafId = requestAnimationFrame(this._boundLoop);
      } else {
        this._rafId = setTimeout(() => this._animationLoop(Date.now()), Math.min(16, this.speed));
      }
    }

    _advanceStep() {
      if (this.frames.length === 0) {
        this._setState(PlaybackStates.IDLE);
        return false;
      }

      if (this.currentStep < this.frames.length - 1) {
        this.currentStep++;
        this._notifyFrameChange();
        if (this.currentStep === this.frames.length - 1) {
          this._setState(PlaybackStates.FINISHED);
          return false;
        }
        return true;
      } else {
        this._setState(PlaybackStates.FINISHED);
        return false;
      }
    }

    _notifyFrameChange() {
      const totalSteps = this.frames.length;
      const frame = this.getCurrentFrame();
      const payload = {
        frame: frame,
        currentStep: this.currentStep,
        totalSteps: totalSteps,
        percentage: totalSteps > 1 ? (this.currentStep / (totalSteps - 1)) * 100 : (totalSteps === 1 ? 100 : 0),
        isFirst: this.currentStep === 0,
        isLast: this.currentStep >= totalSteps - 1
      };
      this._emit('frameChange', payload);
    }

    // ==========================================
    // Public Playback Controls
    // ==========================================

    /**
     * Load an array of SnapshotFrame objects into the controller.
     * @param {SnapshotFrame[]} frames
     * @param {boolean} [autoReset=true]
     */
    loadFrames(frames, autoReset = true) {
      this.pause();
      this.frames = Array.isArray(frames) ? frames : [];

      // Auto-tag total steps on frames if validator is available
      const validator = global.AlgoSystem && global.AlgoSystem.validateSnapshotFrame;
      if (typeof validator === 'function') {
        for (let i = 0; i < this.frames.length; i++) {
          validator(this.frames[i], i, this.frames.length);
        }
      }

      if (autoReset) {
        this.currentStep = 0;
        this._setState(PlaybackStates.IDLE);
        this._notifyFrameChange();
      }

      this._emit('load', {
        totalSteps: this.frames.length,
        firstFrame: this.getCurrentFrame()
      });
      return this;
    }

    /**
     * Start automatic forward playback.
     */
    play() {
      if (this.frames.length === 0) return this;
      if (this.state === PlaybackStates.RUNNING) return this;

      // If at end, loop back to start
      if (this.currentStep >= this.frames.length - 1) {
        this.currentStep = 0;
        this._notifyFrameChange();
      }

      this._cancelTimer();
      this._setState(PlaybackStates.RUNNING);
      this._lastFrameTime = null;

      if (typeof requestAnimationFrame === 'function') {
        this._rafId = requestAnimationFrame(this._boundLoop);
      } else {
        this._rafId = setTimeout(() => this._animationLoop(Date.now()), 0);
      }
      return this;
    }

    /**
     * Pause automatic playback.
     */
    pause() {
      this._cancelTimer();
      if (this.state === PlaybackStates.RUNNING) {
        this._setState(PlaybackStates.PAUSED);
      }
      return this;
    }

    /**
     * Toggle play and pause.
     */
    togglePlay() {
      if (this.state === PlaybackStates.RUNNING) {
        this.pause();
      } else {
        this.play();
      }
      return this;
    }

    /**
     * Advance single frame forward.
     */
    stepForward() {
      this.pause();
      if (this.frames.length === 0) return this;

      if (this.currentStep < this.frames.length - 1) {
        this.currentStep++;
        this._notifyFrameChange();
        if (this.currentStep === this.frames.length - 1) {
          this._setState(PlaybackStates.FINISHED);
        } else {
          this._setState(PlaybackStates.PAUSED);
        }
      } else {
        this._setState(PlaybackStates.FINISHED);
      }
      return this;
    }

    /**
     * Rewind single frame backward.
     */
    stepBackward() {
      this.pause();
      if (this.frames.length === 0) return this;

      if (this.currentStep > 0) {
        this.currentStep--;
        this._notifyFrameChange();
        this._setState(PlaybackStates.PAUSED);
      } else {
        this._setState(PlaybackStates.IDLE);
      }
      return this;
    }

    /**
     * Jump directly to a given step index (Timeline scrubbing).
     * @param {number} stepIndex
     */
    jumpToStep(stepIndex) {
      if (this.frames.length === 0) return this;
      const target = Math.max(0, Math.min(this.frames.length - 1, Math.round(Number(stepIndex) || 0)));
      if (target !== this.currentStep) {
        this.currentStep = target;
        this._notifyFrameChange();
        if (this.currentStep === this.frames.length - 1) {
          this._setState(PlaybackStates.FINISHED);
        } else if (this.state === PlaybackStates.FINISHED) {
          this._setState(PlaybackStates.PAUSED);
        }
      }
      return this;
    }

    /**
     * Set playback delay in milliseconds (50ms - 1500ms).
     * @param {number} delayMs
     */
    setSpeed(delayMs) {
      const num = Number(delayMs);
      if (!isNaN(num)) {
        this.speed = Math.max(50, Math.min(1500, Math.round(num)));
        this._emit('speedChange', { speed: this.speed });
      }
      return this;
    }

    /**
     * Get current speed delay in ms.
     * @returns {number}
     */
    getSpeed() {
      return this.speed;
    }

    /**
     * Reset to step 0 and IDLE state.
     */
    reset() {
      this._cancelTimer();
      this.pause();
      this.currentStep = 0;
      this._setState(PlaybackStates.IDLE);
      this._notifyFrameChange();
      this._emit('reset', { currentStep: 0 });
      return this;
    }

    /**
     * Get current SnapshotFrame.
     * @returns {SnapshotFrame|null}
     */
    getCurrentFrame() {
      if (this.frames.length === 0) return null;
      return this.frames[this.currentStep] || null;
    }

    /**
     * Get playback progress summary.
     */
    getProgress() {
      const total = this.frames.length;
      return {
        currentStep: this.currentStep,
        totalSteps: total,
        percentage: total > 1 ? (this.currentStep / (total - 1)) * 100 : (total === 1 ? 100 : 0),
        state: this.state,
        speed: this.speed
      };
    }

    /**
     * Destroy controller and clean up timers/listeners.
     */
    destroy() {
      this._cancelTimer();
      this.pause();
      this.setRenderer(null);
      this.frames = [];
      Object.keys(this._listeners).forEach(event => {
        this._listeners[event].clear();
      });
    }
  }

  // Namespace Exports
  global.AlgoSystem.PlaybackController = PlaybackController;

  // Convenience Factory Method (Matching PROJECT.md engine interface)
  global.AlgoSystem.engine = global.AlgoSystem.engine || {};
  global.AlgoSystem.engine.createController = function(options) {
    return new PlaybackController(options);
  };

})(typeof window !== 'undefined' ? window : globalThis);
