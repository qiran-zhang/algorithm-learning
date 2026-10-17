/**
 * @file types.js
 * @description Core types, enumerations, SnapshotFrame constructor, and validation helpers.
 * @namespace window.AlgoSystem.Types
 *
 * 16th Blue Bridge Cup Algorithm Learning & Visualization Platform
 * Zero-CORS, Zero-build, file:// protocol compatible.
 */
(function(global) {
  'use strict';

  global.AlgoSystem = global.AlgoSystem || {};
  global.AlgoSystem.version = '1.0.0';
  global.AlgoSystem.engine = global.AlgoSystem.engine || {};

  // 0. Visualizer Registry for Milestone 2 Modules
  if (!global.AlgoSystem.visualizers || typeof global.AlgoSystem.visualizers.register !== 'function') {
    const _visualizerRegistry = new Map();
    global.AlgoSystem.visualizers = {
      /**
       * Register an algorithm visualizer definition.
       * @param {string} id - Unique algorithm ID (e.g. 'bubble_sort', 'binary_search')
       * @param {Object} def - Visualizer definition containing metadata, generator, and renderer
       * @returns {boolean} true if registration succeeded, false otherwise
       */
      register: function(id, def) {
        if (!id || typeof id !== 'string' || !def || typeof def !== 'object') {
          console.warn('[AlgoSystem.visualizers] Invalid visualizer registration:', id, def);
          return false;
        }
        if (!def.id) {
          def.id = id;
        }
        _visualizerRegistry.set(id, def);
        return true;
      },

      /**
       * Retrieve a visualizer definition by ID.
       * @param {string} id - Unique algorithm ID
       * @returns {Object|null} Visualizer definition or null if not found
       */
      get: function(id) {
        if (!id || typeof id !== 'string') return null;
        return _visualizerRegistry.get(id) || null;
      },

      /**
       * Check if a visualizer is registered.
       * @param {string} id - Unique algorithm ID
       * @returns {boolean}
       */
      has: function(id) {
        if (!id || typeof id !== 'string') return false;
        return _visualizerRegistry.has(id);
      },

      /**
       * Get all registered visualizers.
       * @returns {Object[]} Array of visualizer definitions
       */
      getAll: function() {
        return Array.from(_visualizerRegistry.values());
      },

      /**
       * Clear all registered visualizers (for testing resets).
       */
      clear: function() {
        _visualizerRegistry.clear();
      },

      /**
       * Number of registered visualizers.
       */
      get size() {
        return _visualizerRegistry.size;
      }
    };
  }

  // 1. Visualizer Categories (6 Major Official Syllabus Categorizations)
  const Categories = Object.freeze({
    SORTING: 'sorting',
    SEARCH_STRINGS: 'search_strings',
    DATA_STRUCTURES: 'data_structures',
    GRAPHS: 'graphs',
    DP: 'dp',
    MATH_GAME: 'math_game'
  });

  // 2. Category Metadata Registry
  const CategoryMeta = Object.freeze({
    [Categories.SORTING]: {
      id: 'sorting',
      name: '十大经典排序全景',
      shortName: '排序算法',
      icon: '📊',
      group: 'C组/B组',
      count: 10,
      description: '冒泡、选择、插入、希尔、归并、快排、堆排、计数、基数、桶排序'
    },
    [Categories.SEARCH_STRINGS]: {
      id: 'search_strings',
      name: '查找、双指针与字符串',
      shortName: '查找与字符串',
      icon: '🔍',
      group: 'C/B',
      count: 4,
      description: '二分查找红蓝染色、滑动窗口毛毛虫、KMP模式匹配、Manacher回文半径'
    },
    [Categories.DATA_STRUCTURES]: {
      id: 'data_structures',
      name: '基础与进阶数据结构',
      shortName: '数据结构',
      icon: '🌲',
      group: 'C/B/A',
      count: 7,
      description: '单调栈、单调队列、二叉堆、并查集DSU、Trie字典树、树状数组BIT、线段树'
    },
    [Categories.GRAPHS]: {
      id: 'graphs',
      name: '搜索与图论算法',
      shortName: '图论搜索',
      icon: '🕸️',
      group: 'C/B',
      count: 6,
      description: '网格BFS迷宫、DFS回溯、Dijkstra堆优化、Kahn拓扑排序、Kruskal最小生成树、欧拉回路'
    },
    [Categories.DP]: {
      id: 'dp',
      name: '动态规划状态转移',
      shortName: '动态规划',
      icon: '🧮',
      group: 'C/B',
      count: 4,
      description: '0-1背包(2D/1D依赖)、完全背包、区间DP石子合并、最长上升子序列LIS'
    },
    [Categories.MATH_GAME]: {
      id: 'math_game',
      name: '数学、几何与博弈论',
      shortName: '数学博弈',
      icon: '🎲',
      group: 'C/B',
      count: 4,
      description: '素数筛(埃氏/欧拉筛)、辗转相除法GCD/ExGCD、位运算沙盒lowbit、Nim游戏SG函数'
    }
  });

  // 3. Action Type Enumeration (Semantic states used by visualizers and UI color tokens)
  const ActionTypes = Object.freeze({
    // Core Required Actions
    COMPARE: 'COMPARE',           // 比较两个元素或边界测试 (Yellow/Amber #dcdcaa)
    SWAP: 'SWAP',                 // 交换两个元素位置 (Red/Crimson #f44747)
    HIGHLIGHT: 'HIGHLIGHT',       // 激活指针、当前聚焦元素、遍历探针 (Blue #569cd6)
    MODIFY: 'MODIFY',             // 单点写入、覆盖、计算赋值 (Red/Orange #f44747)
    MARK_SORTED: 'MARK_SORTED',   // 标记已完成/已就位/命中/锁死 (Emerald Green #4ec9b0)
    BACKTRACK: 'BACKTRACK',       // 试探失败、回溯、弹栈、撤销标记 (Purple #c586c0)

    // Extended Domain Actions
    PUSH: 'PUSH',                 // 入栈 / 入队 / 插入新节点
    POP: 'POP',                   // 出栈 / 出队 / 删除堆顶
    RELAX: 'RELAX',               // 图论边松弛更新最短路
    UPDATE: 'UPDATE',             // 树状数组/线段树/DP表格区间更新
    FOUND: 'FOUND',               // 搜索命中目标值
    DONE: 'DONE'                  // 算法执行终结
  });

  // 4. Playback State Enumeration
  const PlaybackStates = Object.freeze({
    IDLE: 'IDLE',         // 初始已载入或复位态，等待播放
    RUNNING: 'RUNNING',   // 正在按设定速度自动循环推进
    PAUSED: 'PAUSED',     // 暂停态，保留当前帧指针
    FINISHED: 'FINISHED'  // 已抵达最后一帧并停驻
  });

  // 4.1 Action Normalization Helper
  function normalizeAction(action) {
    if (typeof action !== 'string' || !action.trim()) {
      return ActionTypes.HIGHLIGHT;
    }
    const clean = action.trim()
      .replace(/([a-z0-9])([A-Z])/g, (m, p1, p2) => p1 + '_' + p2)
      .replace(/[-\s]+/g, '_')
      .toUpperCase();
    return Object.values(ActionTypes).includes(clean) ? clean : ActionTypes.HIGHLIGHT;
  }

  // 5. Deep Cloning Helper (Zero-dependency, pure JS)
  function cloneState(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (Array.isArray(obj)) {
      const copy = new Array(obj.length);
      for (let i = 0; i < obj.length; i++) {
        copy[i] = cloneState(obj[i]);
      }
      return copy;
    }
    if (obj instanceof Map) {
      const copy = new Map();
      obj.forEach((val, key) => copy.set(key, cloneState(val)));
      return copy;
    }
    if (obj instanceof Set) {
      const copy = new Set();
      obj.forEach(val => copy.add(cloneState(val)));
      return copy;
    }
    const copy = {};
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      copy[key] = cloneState(obj[key]);
    }
    return copy;
  }

  // 6. SnapshotFrame Data Contract Class
  class SnapshotFrame {
    /**
     * @param {Object} options
     * @param {number} options.step - 0-based step index
     * @param {number} [options.totalSteps] - Total steps in run
     * @param {string} options.action - Action enum (e.g. ActionTypes.COMPARE)
     * @param {number[]} [options.indices] - Target element indices
     * @param {*} options.state - Deep data structure snapshot (Array, Grid, Tree, Graph)
     * @param {Object.<string, *>} [options.variables] - Variable watch map (e.g. { i: 1, j: 2, sum: 15 })
     * @param {number} [options.codeLine] - 1-based code line number to highlight in pseudocode panel
     * @param {string} options.explanation - Plain Chinese pedagogical explanation of this step
     * @param {Object} [options.arrayData] - Specialized array visualizer payload
     * @param {Object} [options.matrixData] - Specialized matrix/DP visualizer payload
     * @param {Object} [options.graphData] - Specialized graph visualizer payload
     * @param {Object} [options.treeData] - Specialized tree visualizer payload
     */
    constructor(options = {}) {
      this.step = typeof options.step === 'number' ? options.step : 0;
      this.totalSteps = typeof options.totalSteps === 'number' ? options.totalSteps : 0;
      this.action = normalizeAction(options.action);
      this.indices = Array.isArray(options.indices) ? [...options.indices] : [];
      
      // Automatically clone state to ensure frame immutability
      this.state = options.state !== undefined ? cloneState(options.state) : null;
      
      // Variable watch dictionary
      this.variables = options.variables && typeof options.variables === 'object'
        ? { ...options.variables }
        : {};
        
      this.codeLine = typeof options.codeLine === 'number' && options.codeLine > 0
        ? options.codeLine
        : null;
        
      this.explanation = typeof options.explanation === 'string'
        ? options.explanation
        : (options.description || '');

      // Specialized visual payload attachments (if provided)
      if (options.arrayData) {
        this.arrayData = {
          values: Array.isArray(options.arrayData.values) ? [...options.arrayData.values] : [],
          states: options.arrayData.states ? { ...options.arrayData.states } : {},
          pointers: options.arrayData.pointers ? { ...options.arrayData.pointers } : {}
        };
      }

      if (options.matrixData) {
        this.matrixData = {
          rows: options.matrixData.rows || 0,
          cols: options.matrixData.cols || 0,
          cells: options.matrixData.cells ? options.matrixData.cells.map(row => [...row]) : [],
          highlightCells: Array.isArray(options.matrixData.highlightCells)
            ? options.matrixData.highlightCells.map(c => ({ ...c }))
            : [],
          rowLabels: options.matrixData.rowLabels ? [...options.matrixData.rowLabels] : undefined,
          colLabels: options.matrixData.colLabels ? [...options.matrixData.colLabels] : undefined
        };
      }

      if (options.graphData) {
        this.graphData = cloneState(options.graphData);
      }

      if (options.treeData) {
        this.treeData = cloneState(options.treeData);
      }
    }
  }

  // 7. Validation Helper
  function validateSnapshotFrame(frame, index, total) {
    if (!frame || typeof frame !== 'object') {
      return {
        valid: false,
        error: `Frame at index ${index} must be a non-null object`
      };
    }

    if (typeof frame.step !== 'number') {
      frame.step = index;
    }
    if (typeof frame.totalSteps !== 'number') {
      frame.totalSteps = total;
    }

    // Normalize lowercase, kebab-case, or camelCase actions to uppercase ActionTypes enum values
    frame.action = normalizeAction(frame.action);

    if (typeof frame.explanation !== 'string') {
      frame.explanation = frame.description || `执行步骤 ${index + 1}`;
    }

    if (!Array.isArray(frame.indices)) {
      frame.indices = [];
    }

    if (!frame.variables || typeof frame.variables !== 'object') {
      frame.variables = {};
    }

    return { valid: true, frame };
  }

  // 8. Namespace Exports
  global.AlgoSystem.Types = {
    Categories,
    CategoryMeta,
    ActionTypes,
    PlaybackStates,
    SnapshotFrame,
    cloneState,
    validateSnapshotFrame,
    normalizeAction
  };

  // Direct Conveniences on AlgoSystem (Matching PROJECT.md & visualizer specs)
  global.AlgoSystem.Categories = Categories;
  global.AlgoSystem.CategoryMeta = CategoryMeta;
  global.AlgoSystem.ActionTypes = ActionTypes;
  global.AlgoSystem.PlaybackStates = PlaybackStates;
  global.AlgoSystem.SnapshotFrame = SnapshotFrame;
  global.AlgoSystem.validateSnapshotFrame = validateSnapshotFrame;
  global.AlgoSystem.normalizeAction = normalizeAction;
  global.AlgoSystem.cloneState = cloneState;

})(typeof window !== 'undefined' ? window : globalThis);
