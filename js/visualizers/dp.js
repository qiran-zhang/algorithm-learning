/**
 * @file dp.js
 * @description Dynamic Programming Visualizers: 0-1 Knapsack, Complete Knapsack, Stone Merging Interval DP, LIS.
 * @namespace window.AlgoSystem.visualizers.dp
 *
 * 16th Blue Bridge Cup Algorithm Learning & Visualization Platform
 * Zero-CORS, Zero-build, file:// protocol compatible.
 */
(function(global) {
  'use strict';

  global.AlgoSystem = global.AlgoSystem || {};
  global.AlgoSystem.visualizers = global.AlgoSystem.visualizers || {};

  const ActionTypes = (global.AlgoSystem.Types && global.AlgoSystem.Types.ActionTypes) || global.AlgoSystem.ActionTypes || {
    COMPARE: 'COMPARE',
    SWAP: 'SWAP',
    HIGHLIGHT: 'HIGHLIGHT',
    MODIFY: 'MODIFY',
    MARK_SORTED: 'MARK_SORTED',
    BACKTRACK: 'BACKTRACK',
    DONE: 'DONE'
  };

  const SnapshotFrame = (global.AlgoSystem.Types && global.AlgoSystem.Types.SnapshotFrame) || global.AlgoSystem.SnapshotFrame;

  function switchStageLayer(activeId) {
    const layers = ['stageArray', 'stageSvg', 'stageGrid', 'stageSandbox'];
    layers.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === activeId) {
          el.classList.remove('hidden');
          el.classList.add('active');
        } else {
          el.classList.add('hidden');
          el.classList.remove('active');
        }
      }
    });
  }

  function syncInspectorUI(frame) {
    if (!frame) return;

    const explanationText = document.getElementById('stepExplanationText');
    if (explanationText && frame.explanation) {
      explanationText.innerHTML = frame.explanation;
    }

    const watchBody = document.getElementById('watchTableBody');
    if (watchBody && frame.variables) {
      const keys = Object.keys(frame.variables);
      if (keys.length === 0) {
        watchBody.innerHTML = '<tr><td colspan="3" class="table-empty">暂无变量数据</td></tr>';
      } else {
        watchBody.innerHTML = keys.map(k => `
          <tr>
            <td style="color:var(--text-secondary);">${k}</td>
            <td style="font-family:var(--font-mono); font-weight:bold; color:var(--text-primary);">${frame.variables[k]}</td>
            <td style="font-size:11px; color:var(--text-muted);">DP状态</td>
          </tr>
        `).join('');
      }
    }

    const codeBlock = document.getElementById('codeBlock');
    if (codeBlock && frame.codeLine) {
      const lines = codeBlock.querySelectorAll('.code-line');
      lines.forEach((line, i) => {
        line.classList.toggle('line-highlight', (i + 1 === frame.codeLine));
      });
    }

    const actionBadge = document.getElementById('actionBadge');
    if (actionBadge && frame.action) {
      actionBadge.textContent = frame.action;
    }
  }

  function commonInit(algoDef, controller, customData) {
    let inputData = customData || algoDef.defaultInput;

    const codeBlock = document.getElementById('codeBlock');
    if (codeBlock && algoDef.templates) {
      if (global.AlgoSystem && global.AlgoSystem.controls && typeof global.AlgoSystem.controls.renderCurrentCode === 'function') {
        global.AlgoSystem.controls.renderCurrentCode(algoDef.id);
      } else {
        const codeLines = algoDef.templates.python || [];
        codeBlock.innerHTML = codeLines.map((line, idx) => `
          <div class="code-line" data-line="${idx + 1}">
            <span class="line-num">${idx + 1}</span>
            <span class="line-code">${line}</span>
          </div>
        `).join('');
      }
    }

    const stlContent = document.getElementById('stlContent');
    if (stlContent && algoDef.stlCard) {
      stlContent.innerHTML = algoDef.stlCard.content;
    }

    const frames = algoDef.generateFrames(inputData);
    if (controller && typeof controller.loadFrames === 'function') {
      controller.loadFrames(frames);
      if (typeof controller.setRenderer === 'function') {
        controller.setRenderer(function(p) {
          algoDef.render(p.frame);
        });
      } else {
        controller.on('frameChange', function(p) {
          algoDef.render(p.frame);
        });
      }
      algoDef.render(controller.getCurrentFrame());
    }
  }

  // =========================================================================
  // 1. 0-1 背包问题 (0-1 Knapsack)
  // =========================================================================
  function generateKnapsack01Frames(input) {
    let W = 8;
    let items = [
      { id: 1, name: '物品1', w: 2, v: 3 },
      { id: 2, name: '物品2', w: 3, v: 4 },
      { id: 3, name: '物品3', w: 4, v: 5 },
      { id: 4, name: '物品4', w: 5, v: 8 }
    ];

    if (input && typeof input === 'object') {
      if (typeof input.W === 'number') W = Math.max(1, Math.min(15, input.W));
      if (Array.isArray(input.items) && input.items.length > 0) items = input.items.slice(0, 6);
    }

    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
    const frames = [];
    let step = 0;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { type: 'knapsack_01', dp: dp.map(r => [...r]), items, W, currentI: 0, currentJ: 0 },
      matrixData: {
        rows: n + 1,
        cols: W + 1,
        cells: dp.map(r => [...r]),
        highlightCells: [],
        rowLabels: ['0 (无物品)', ...items.map((it, idx) => `${idx + 1} (${it.name || '物' + (idx + 1)}:w=${it.w},v=${it.v})`)],
        colLabels: Array.from({ length: W + 1 }, (_, c) => `容量 ${c}`)
      },
      variables: { N: n, W, '背包类型': '0-1背包 (每件限用1次)' },
      codeLine: 3,
      explanation: `【0-1 背包初始化】创建 ${n + 1}×${W + 1} 状态矩阵。第 0 行与第 0 列为全 0 基元态。`
    }));

    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];
      const { w, v } = item;

      for (let j = 0; j <= W; j++) {
        if (j < w) {
          dp[i][j] = dp[i - 1][j];
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.MODIFY,
            indices: [],
            state: { type: 'knapsack_01', dp: dp.map(r => [...r]), items, W, currentI: i, currentJ: j },
            matrixData: {
              rows: n + 1,
              cols: W + 1,
              cells: dp.map(r => [...r]),
              highlightCells: [
                { row: i - 1, col: j, role: 'read' },
                { row: i, col: j, role: 'write' }
              ],
              rowLabels: ['0 (无物品)', ...items.map((it, idx) => `${idx + 1} (${it.name || '物' + (idx + 1)}:w=${it.w},v=${it.v})`)],
              colLabels: Array.from({ length: W + 1 }, (_, c) => `容量 ${c}`)
            },
            variables: { i, j, '重量 w[i]': w, '决策': `j < w[i] 装不下，继承上方 dp[${i-1}][${j}] = ${dp[i-1][j]}` },
            codeLine: 7,
            explanation: `容量 j = ${j} < 物品重量 w = ${w}，无法装入！dp[${i}][${j}] = dp[${i - 1}][${j}] = ${dp[i][j]}。`
          }));
        } else {
          const notTake = dp[i - 1][j];
          const take = dp[i - 1][j - w] + v;

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.COMPARE,
            indices: [],
            state: { type: 'knapsack_01', dp: dp.map(r => [...r]), items, W, currentI: i, currentJ: j },
            matrixData: {
              rows: n + 1,
              cols: W + 1,
              cells: dp.map(r => [...r]),
              highlightCells: [
                { row: i - 1, col: j, role: 'read' },
                { row: i - 1, col: j - w, role: 'candidate' },
                { row: i, col: j, role: 'write' }
              ],
              rowLabels: ['0 (无物品)', ...items.map((it, idx) => `${idx + 1} (${it.name || '物' + (idx + 1)}:w=${it.w},v=${it.v})`)],
              colLabels: Array.from({ length: W + 1 }, (_, c) => `容量 ${c}`)
            },
            variables: { '不选(正上方)': notTake, '选入(左上方)': `${dp[i-1][j-w]} + ${v} = ${take}`, '容量j': j },
            codeLine: 8,
            explanation: `【0-1背包状态转移】容量 ${j} ≥ ${w}。方案A(不选) = ${notTake}；方案B(选) = dp[${i-1}][${j-w}] + ${v} = ${take}。`
          }));

          dp[i][j] = Math.max(notTake, take);

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.MODIFY,
            indices: [],
            state: { type: 'knapsack_01', dp: dp.map(r => [...r]), items, W, currentI: i, currentJ: j },
            matrixData: {
              rows: n + 1,
              cols: W + 1,
              cells: dp.map(r => [...r]),
              highlightCells: [{ row: i, col: j, role: 'write' }],
              rowLabels: ['0 (无物品)', ...items.map((it, idx) => `${idx + 1} (${it.name || '物' + (idx + 1)}:w=${it.w},v=${it.v})`)],
              colLabels: Array.from({ length: W + 1 }, (_, c) => `容量 ${c}`)
            },
            variables: { '更新 dp[i][j]': dp[i][j], '最优收益': dp[i][j] },
            codeLine: 8,
            explanation: `取两者较大值：dp[${i}][${j}] = max(${notTake}, ${take}) = ${dp[i][j]}。填入状态表格。`
          }));
        }
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { type: 'knapsack_01', dp: dp.map(r => [...r]), items, W, currentI: n, currentJ: W },
      matrixData: {
        rows: n + 1,
        cols: W + 1,
        cells: dp.map(r => [...r]),
        highlightCells: [{ row: n, col: W, role: 'optimal' }],
        rowLabels: ['0 (无物品)', ...items.map((it, idx) => `${idx + 1} (${it.name || '物' + (idx + 1)}:w=${it.w},v=${it.v})`)],
        colLabels: Array.from({ length: W + 1 }, (_, c) => `容量 ${c}`)
      },
      variables: { '全局最大价值': dp[n][W], status: 'COMPLETE' },
      codeLine: 9,
      explanation: `0-1 背包计算完成！在承重上限 ${W} 下，最大总价值为右下角格子 dp[${n}][${W}] = ${dp[n][W]}。`
    }));

    return frames;
  }

  const knapsack01Def = {
    id: 'knapsack_01',
    category: 'dp',
    name: '0-1 背包问题 (2D/1D滚动)',
    en: '0-1 Knapsack',
    meta: { tier: 'B组', time: 'O(N·W)', space: 'O(W)', stability: '稳定', is408: false, tags: ['容量倒序', '选与不选', '最优子结构'] },
    templates: {
      python: [
        'def knapsack_01(W, weights, values):  # 0-1背包问题二维DP解法',
        '    n = len(weights)  # 物品总件数',
        '    dp = [[0] * (W + 1) for _ in range(n + 1)]  # dp[i][j]: 前i件物品在背包容量为j时的最大价值',
        '    for i in range(1, n + 1):  # 阶段枚举：逐一考虑每件可选物品',
        '        w, v = weights[i-1], values[i-1]  # 提取当前物品的重量与价值',
        '        for j in range(W + 1):  # 状态枚举：遍历所有可能的当前背包承重容量',
        '            if j < w: dp[i][j] = dp[i-1][j]  # 剩余容量不足装入当前物品，只能继承上一行决策',
        '            else: dp[i][j] = max(dp[i-1][j], dp[i-1][j-w] + v)  # 状态转移：比较【不选】与【选入并腾出容量】',
        '    return dp[n][W]  # 最终状态：考虑完全部n件物品且总容量为W时的全局最大收益'
      ],
      cpp: [
        'int knapsack01(int W, const vector<int>& wt, const vector<int>& val) {  // 0-1背包问题主函数',
        '    int n = wt.size();  // 物品总数量',
        '    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));  // 二维DP表格初始化',
        '    for (int i = 1; i <= n; ++i) {  // 遍历物品阶段',
        '        int w = wt[i-1], v = val[i-1];  // 当前物品体积与价值',
        '        for (int j = 0; j <= W; ++j) {  // 遍历背包承重状态',
        '            if (j < w) dp[i][j] = dp[i-1][j];  // 容量不足直接继承上方结果',
        '            else dp[i][j] = max(dp[i-1][j], dp[i-1][j-w] + v);  // 状态转移方程取极值',
        '        }',
        '    }',
        '    return dp[n][W];  // 返回右下角最终最优解',
        '}'
      ]
    },
    stlCard: {
      title: '📘 0-1 背包 1D 滚动倒序题眼',
      content: `
        <p><strong>1D 滚动数组为何必须倒序遍历？</strong></p>
        <p>若正序遍历容量 $j$，计算 $dp[j]$ 时 $dp[j-w_i]$ 已经被当前物品 $i$ 更新过，相当于该物品被<strong>多次重复选入</strong>，错误退化成了完全背包！因此 0-1 背包必须从大到小倒序遍历。</p>
      `
    },
    defaultInput: { W: 8, items: [{ id: 1, name: '物品1', w: 2, v: 3 }, { id: 2, name: '物品2', w: 3, v: 4 }, { id: 3, name: '物品3', w: 4, v: 5 }, { id: 4, name: '物品4', w: 5, v: 8 }] },
    presets: {
      standard: { W: 8, items: [{ w: 2, v: 3 }, { w: 3, v: 4 }, { w: 4, v: 5 }, { w: 5, v: 8 }] },
      small: { W: 5, items: [{ w: 2, v: 6 }, { w: 2, v: 3 }, { w: 3, v: 5 }] }
    },
    parseInput: function() { return { success: true, data: knapsack01Def.defaultInput }; },
    generateFrames: generateKnapsack01Frames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      renderDPTable(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 2. 完全背包问题 (Complete Knapsack)
  // =========================================================================
  function generateKnapsackCompleteFrames(input) {
    let W = 7;
    let items = [
      { id: 1, name: '小金条', w: 2, v: 3 },
      { id: 2, name: '中金条', w: 3, v: 5 },
      { id: 3, name: '大金条', w: 4, v: 7 }
    ];

    if (input && typeof input === 'object') {
      if (typeof input.W === 'number') W = Math.max(1, Math.min(15, input.W));
      if (Array.isArray(input.items) && input.items.length > 0) items = input.items.slice(0, 5);
    }

    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
    const frames = [];
    let step = 0;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { type: 'knapsack_complete', dp: dp.map(r => [...r]), items, W, currentI: 0, currentJ: 0 },
      matrixData: {
        rows: n + 1,
        cols: W + 1,
        cells: dp.map(r => [...r]),
        highlightCells: [],
        rowLabels: ['0 (无物品)', ...items.map((it, idx) => `${idx + 1} (${it.name}:w=${it.w},v=${it.v},无限次)`)],
        colLabels: Array.from({ length: W + 1 }, (_, c) => `容量 ${c}`)
      },
      variables: { N: n, W, '类型': '完全背包 (物品可无限复选)' },
      codeLine: 3,
      explanation: `【完全背包状态矩阵就绪】每件物品不限数量，核心在于同一行左侧状态的级联复用！`
    }));

    for (let i = 1; i <= n; i++) {
      const { w, v, name } = items[i - 1];

      for (let j = 0; j <= W; j++) {
        if (j < w) {
          dp[i][j] = dp[i - 1][j];
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.MODIFY,
            indices: [],
            state: { type: 'knapsack_complete', dp: dp.map(r => [...r]), items, W, currentI: i, currentJ: j },
            matrixData: {
              rows: n + 1,
              cols: W + 1,
              cells: dp.map(r => [...r]),
              highlightCells: [
                { row: i - 1, col: j, role: 'read' },
                { row: i, col: j, role: 'write' }
              ],
              rowLabels: ['0 (无物品)', ...items.map((it, idx) => `${idx + 1} (${it.name}:w=${it.w},v=${it.v})`)],
              colLabels: Array.from({ length: W + 1 }, (_, c) => `容量 ${c}`)
            },
            variables: { i, j, '容量不足': `j < ${w} 继承上方 dp[${i-1}][${j}]` },
            codeLine: 7,
            explanation: `容量 ${j} 小于 ${name} 重量 ${w}，无法装入，继承上方 dp[${i - 1}][${j}] = ${dp[i][j]}。`
          }));
        } else {
          const notTake = dp[i - 1][j];
          const takeAgain = dp[i][j - w] + v; // 核心：依赖本行左侧已更新格

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.COMPARE,
            indices: [],
            state: { type: 'knapsack_complete', dp: dp.map(r => [...r]), items, W, currentI: i, currentJ: j },
            matrixData: {
              rows: n + 1,
              cols: W + 1,
              cells: dp.map(r => [...r]),
              highlightCells: [
                { row: i - 1, col: j, role: 'read' },
                { row: i, col: j - w, role: 'candidate' }, // 同行左侧依赖!
                { row: i, col: j, role: 'write' }
              ],
              rowLabels: ['0 (无物品)', ...items.map((it, idx) => `${idx + 1} (${it.name}:w=${it.w},v=${it.v})`)],
              colLabels: Array.from({ length: W + 1 }, (_, c) => `容量 ${c}`)
            },
            variables: {
              '不选本物品': notTake,
              '同行动力学(复用)': `dp[${i}][${j-w}] + ${v} = ${takeAgain}`,
              '题眼': '依赖本行左侧格，赋予无限次再选权利！'
            },
            codeLine: 8,
            explanation: `【完全背包同行动力学】对比格来自【本行左侧】dp[${i}][${j-w}] = ${dp[i][j-w]}，加上价值 ${v} 得 ${takeAgain}。`
          }));

          dp[i][j] = Math.max(notTake, takeAgain);

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.MODIFY,
            indices: [],
            state: { type: 'knapsack_complete', dp: dp.map(r => [...r]), items, W, currentI: i, currentJ: j },
            matrixData: {
              rows: n + 1,
              cols: W + 1,
              cells: dp.map(r => [...r]),
              highlightCells: [{ row: i, col: j, role: 'write' }],
              rowLabels: ['0 (无物品)', ...items.map((it, idx) => `${idx + 1} (${it.name}:w=${it.w},v=${it.v})`)],
              colLabels: Array.from({ length: W + 1 }, (_, c) => `容量 ${c}`)
            },
            variables: { '更新 dp[i][j]': dp[i][j] },
            codeLine: 8,
            explanation: `决断：dp[${i}][${j}] = max(${notTake}, ${takeAgain}) = ${dp[i][j]}。已填入表格。`
          }));
        }
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { type: 'knapsack_complete', dp: dp.map(r => [...r]), items, W, currentI: n, currentJ: W },
      matrixData: {
        rows: n + 1,
        cols: W + 1,
        cells: dp.map(r => [...r]),
        highlightCells: [{ row: n, col: W, role: 'optimal' }],
        rowLabels: ['0 (无物品)', ...items.map((it, idx) => `${idx + 1} (${it.name}:w=${it.w},v=${it.v})`)],
        colLabels: Array.from({ length: W + 1 }, (_, c) => `容量 ${c}`)
      },
      variables: { '完全背包最大总价值': dp[n][W], status: 'COMPLETE' },
      codeLine: 9,
      explanation: `完全背包演算终结！在无限选取支持下，最大总价值为 ${dp[n][W]}。`
    }));

    return frames;
  }

  const knapsackCompleteDef = {
    id: 'knapsack_complete',
    category: 'dp',
    name: '完全背包问题 (正序无限选)',
    en: 'Complete Knapsack',
    meta: { tier: 'B组', time: 'O(N·W)', space: 'O(W)', stability: '稳定', is408: false, tags: ['容量正序', '无限复用', '硬币兑换'] },
    templates: {
      python: [
        'def knapsack_complete(W, weights, values):  # 完全背包问题二维DP解法 (物品可无限复选)',
        '    n = len(weights)  # 物品种类总数',
        '    dp = [[0] * (W + 1) for _ in range(n + 1)]  # dp[i][j]: 考虑前i种物品在容量j下的最大价值',
        '    for i in range(1, n + 1):  # 阶段枚举：逐一引入新的物品种类',
        '        w, v = weights[i-1], values[i-1]  # 提取该种物品的单位重量与价值',
        '        for j in range(W + 1):  # 状态枚举：遍历背包可用容量',
        '            if j < w: dp[i][j] = dp[i-1][j]  # 容量装不下当前物品，继承未用该物品时的最大收益',
        '            else: dp[i][j] = max(dp[i-1][j], dp[i][j-w] + v)  # 核心差异：从当前行 dp[i][j-w] 转移，允许同种物品无限次复用',
        '    return dp[n][W]  # 返回考虑全部种类在满载容量下的全局最优解'
      ],
      cpp: [
        'int knapsackComplete(int W, const vector<int>& wt, const vector<int>& val) {  // 完全背包主函数入口',
        '    int n = wt.size();  // 物品种类数',
        '    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));  // 动态规划状态矩阵初始化',
        '    for (int i = 1; i <= n; ++i) {  // 枚举物品种类',
        '        int w = wt[i-1], v = val[i-1];  // 当前物品规格',
        '        for (int j = 0; j <= W; ++j) {  // 枚举背包承重',
        '            if (j < w) dp[i][j] = dp[i-1][j];  // 空间不足无法选用',
        '            else dp[i][j] = max(dp[i-1][j], dp[i][j-w] + v);  // 从本行左侧转移实现无限复用',
        '        }',
        '    }',
        '    return dp[n][W];  // 返回最终最大价值',
        '}'
      ]
    },
    stlCard: {
      title: '📘 完全背包 1D 滚动正序推导',
      content: `
        <p><strong>1D 滚动正序遍历</strong>：<code>for j in range(w, W + 1): dp[j] = max(dp[j], dp[j - w] + v)</code></p>
        <p>正序遍历使得当前状态 $dp[j]$ 直接基于<strong>本轮刚更新过的</strong> $dp[j-w]$，天然支持无限次重复累选！</p>
      `
    },
    defaultInput: { W: 7, items: [{ id: 1, name: '小金条', w: 2, v: 3 }, { id: 2, name: '中金条', w: 3, v: 5 }, { id: 3, name: '大金条', w: 4, v: 7 }] },
    presets: {
      standard: { W: 7, items: [{ w: 2, v: 3 }, { w: 3, v: 5 }, { w: 4, v: 7 }] }
    },
    parseInput: function() { return { success: true, data: knapsackCompleteDef.defaultInput }; },
    generateFrames: generateKnapsackCompleteFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      renderDPTable(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 3. 区间 DP (Interval DP - 石子合并)
  // =========================================================================
  function generateIntervalDPFrames(input) {
    const stones = (input && Array.isArray(input.stones)) ? input.stones.slice(0, 5) : [3, 4, 2, 5, 1];
    const n = stones.length;
    const prefix = [0];
    for (const s of stones) prefix.push(prefix[prefix.length - 1] + s);
    const getSum = (l, r) => prefix[r + 1] - prefix[l];

    const dp = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => (r === c ? 0 : (r < c ? null : '-')))
    );

    const frames = [];
    let step = 0;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { type: 'interval_dp', dp: dp.map(r => [...r]), stones, len: 1 },
      matrixData: {
        rows: n,
        cols: n,
        cells: dp.map(r => r.map(v => v === null ? '∞' : v)),
        highlightCells: Array.from({ length: n }, (_, i) => ({ row: i, col: i, role: 'read' })),
        rowLabels: stones.map((s, idx) => `起点 ${idx}(重${s})`),
        colLabels: stones.map((_, idx) => `终点 ${idx}`)
      },
      variables: { '石子堆数': n, '主对角线': '单堆无需合并，代价为 0' },
      codeLine: 5,
      explanation: `【区间 DP 上三角矩阵】初始化主对角线 dp[i][i] = 0。接下来按区间跨度 length = 2 .. ${n} 沿对角线平行推进。`
    }));

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        const rangeSum = getSum(i, j);
        dp[i][j] = Infinity;

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.HIGHLIGHT,
          indices: [],
          state: { type: 'interval_dp', dp: dp.map(r => [...r]), stones, len, i, j },
          matrixData: {
            rows: n,
            cols: n,
            cells: dp.map(r => r.map(v => v === Infinity ? '∞' : (v === null ? '' : v))),
            highlightCells: [{ row: i, col: j, role: 'write' }],
            rowLabels: stones.map((s, idx) => `起点 ${idx}(重${s})`),
            colLabels: stones.map((_, idx) => `终点 ${idx}`)
          },
          variables: { '区间长度 len': len, '左端 i': i, '右端 j': j, '区间必付总重': rangeSum },
          codeLine: 8,
          explanation: `考察区间 [${i}..${j}] (长度=${len})，合并该区间的基础重量和为 ${rangeSum}。准备枚举切分点 k。`
        }));

        let bestK = i;
        for (let k = i; k < j; k++) {
          const leftCost = dp[i][k];
          const rightCost = dp[k + 1][j];
          const total = leftCost + rightCost + rangeSum;

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.COMPARE,
            indices: [],
            state: { type: 'interval_dp', dp: dp.map(r => [...r]), stones, len, i, j, k },
            matrixData: {
              rows: n,
              cols: n,
              cells: dp.map(r => r.map(v => v === Infinity ? '∞' : (v === null ? '' : v))),
              highlightCells: [
                { row: i, col: k, role: 'read' },
                { row: k + 1, col: j, role: 'read' },
                { row: i, col: j, role: 'write' }
              ],
              rowLabels: stones.map((s, idx) => `起点 ${idx}(重${s})`),
              colLabels: stones.map((_, idx) => `终点 ${idx}`)
            },
            variables: { '分割点 k': k, '左区间代价': leftCost, '右区间代价': rightCost, '候选总代价': `${leftCost}+${rightCost}+${rangeSum}=${total}` },
            codeLine: 12,
            explanation: `切分点 k = ${k}：左半部 [${i}..${k}] 代价 ${leftCost}，右半部 [${k + 1}..${j}] 代价 ${rightCost}，合并代价 = ${total}。`
          }));

          if (total < dp[i][j]) {
            dp[i][j] = total;
            bestK = k;
          }
        }

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MODIFY,
          indices: [],
          state: { type: 'interval_dp', dp: dp.map(r => [...r]), stones, len, i, j, bestK },
          matrixData: {
            rows: n,
            cols: n,
            cells: dp.map(r => r.map(v => v === Infinity ? '∞' : (v === null ? '' : v))),
            highlightCells: [{ row: i, col: j, role: 'write' }],
            rowLabels: stones.map((s, idx) => `起点 ${idx}(重${s})`),
            colLabels: stones.map((_, idx) => `终点 ${idx}`)
          },
          variables: { '确定 dp[i][j]': dp[i][j], '最优分割点 k*': bestK },
          codeLine: 12,
          explanation: `区间 [${i}..${j}] 决策完毕！最优分割点 k* = ${bestK}，最小代价更新为 ${dp[i][j]}。`
        }));
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { type: 'interval_dp', dp: dp.map(r => [...r]), stones, len: n },
      matrixData: {
        rows: n,
        cols: n,
        cells: dp.map(r => r.map(v => v === Infinity ? '∞' : (v === null ? '' : v))),
        highlightCells: [{ row: 0, col: n - 1, role: 'optimal' }],
        rowLabels: stones.map((s, idx) => `起点 ${idx}(重${s})`),
        colLabels: stones.map((_, idx) => `终点 ${idx}`)
      },
      variables: { '全局最终最小合并代价': dp[0][n - 1], status: 'COMPLETE' },
      codeLine: 13,
      explanation: `区间 DP 石子合并完成！整串序列合并的最小时代价为右上角格子 dp[0][${n - 1}] = ${dp[0][n - 1]}。`
    }));

    return frames;
  }

  const intervalDPDef = {
    id: 'interval_dp',
    category: 'dp',
    name: '区间 DP (石子合并对角推进)',
    en: 'Interval DP',
    meta: { tier: 'B组', time: 'O(N³)', space: 'O(N²)', stability: '稳定', is408: false, tags: ['上三角填表', '步长枚举', '合并代价'] },
    templates: {
      python: [
        'def stone_merge(stones):  # 区间DP石子合并主函数',
        '    n = len(stones)  # 石子堆数',
        '    pref = [0] * (n + 1)  # 前缀和数组用于 O(1) 求解任意区间合并得分',
        '    for i in range(n): pref[i+1] = pref[i] + stones[i]  # 预处理前缀和',
        '    dp = [[0] * n for _ in range(n)]  # dp[i][j]: 将区间 [i..j] 合并成一堆的最小代价',
        '    for length in range(2, n + 1):  # 阶段枚举：区间跨度从 2 递增至 n',
        '        for i in range(n - length + 1):  # 状态枚举：枚举区间左端点 i',
        '            j = i + length - 1; dp[i][j] = float("inf")  # 计算对应右端点 j 并置初值为无穷大',
        '            cost = pref[j+1] - pref[i]  # 本次合并产生的新代价即区间石子总数',
        '            for k in range(i, j):  # 决策枚举：枚举最后一次合并的分割点 k',
        '                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + cost)  # 状态转移求极小值',
        '    return dp[0][n-1]  # 返回全局合并区间 [0..n-1] 的最小代价'
      ],
      cpp: [
        'int stoneMerge(const vector<int>& stones) {  // 区间DP石子合并C++实现',
        '    int n = stones.size();  // 石子堆数量',
        '    vector<int> pref(n + 1, 0);  // 前缀和容器',
        '    for (int i = 0; i < n; ++i) pref[i+1] = pref[i] + stones[i];  // 构建前缀和',
        '    vector<vector<int>> dp(n, vector<int>(n, 0));  // 二维DP矩阵记录区间最小代价',
        '    for (int len = 2; len <= n; ++len) {  // 阶段：步长从小到大枚举',
        '        for (int i = 0; i <= n - len; ++i) {  // 枚举区间起点',
        '            int j = i + len - 1; dp[i][j] = 1e9;  // 确定区间终点',
        '            int cost = pref[j+1] - pref[i];  // 区间求和代价',
        '            for (int k = i; k < j; ++k)',
        '                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + cost);  // 状态转移',
        '        }',
        '    }',
        '    return dp[0][n-1];  // 返回整区间最优合并代价',
        '}'
      ]
    },
    stlCard: {
      title: '📘 区间 DP 填表拓扑序',
      content: `
        <p><strong>外层为何枚举区间长度 <code>len</code>？</strong></p>
        <p>因为 $dp[i][j]$ 严格依赖于更短的子区间 $dp[i][k]$ 与 $dp[k+1][j]$，按步长递增是满足拓扑依赖的唯一正确遍历顺序（上三角沿对角线向外扩张）。</p>
      `
    },
    defaultInput: { stones: [3, 4, 2, 5, 1] },
    presets: {
      standard: { stones: [3, 4, 2, 5, 1] },
      four: { stones: [1, 2, 3, 4] }
    },
    parseInput: function(text) {
      const parts = text.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      return { success: true, data: { stones: parts.slice(0, 5) } };
    },
    generateFrames: generateIntervalDPFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      renderDPTable(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 4. 最长上升子序列 (LIS)
  // =========================================================================
  function generateLISFrames(input) {
    const nums = (input && Array.isArray(input.nums)) ? input.nums.slice(0, 9) : [10, 9, 2, 5, 3, 7, 101, 18];
    const n = nums.length;
    const dp = new Array(n).fill(1);
    const parent = new Array(n).fill(-1);
    const frames = [];
    let step = 0;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { type: 'lis', nums: [...nums], dp: [...dp], i: 0, j: -1 },
      variables: { n, '初始状态': '所有 dp[i] 初始化为 1' },
      codeLine: 4,
      explanation: `【LIS 初始化】序列长度 N = ${n}。所有元素以自身为起点，dp[i] 初始均为 1。`
    }));

    for (let i = 1; i < n; i++) {
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [i],
        state: { type: 'lis', nums: [...nums], dp: [...dp], i, j: -1 },
        variables: { i, 'nums[i]': nums[i], '当前dp[i]': dp[i] },
        codeLine: 5,
        explanation: `考察目标元素 nums[${i}] = ${nums[i]}，从前驱 j = 0..${i - 1} 中寻找较小值进行状态转移。`
      }));

      for (let j = 0; j < i; j++) {
        const isValid = (nums[j] < nums[i]);

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.COMPARE,
          indices: [j, i],
          state: { type: 'lis', nums: [...nums], dp: [...dp], i, j, isValid },
          variables: { j, i, 'nums[j]': nums[j], 'nums[i]': nums[i], '严格递增': isValid, '候选dp': isValid ? dp[j] + 1 : '不可用' },
          codeLine: 7,
          explanation: `比较 nums[${j}]=${nums[j]} 与 nums[${i}]=${nums[i]}：${isValid ? `严格递增成立！候选长度 dp[${j}] + 1 = ${dp[j] + 1}` : '不满足严格递增，跳过。'}`
        }));

        if (isValid && dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          parent[i] = j;

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.MODIFY,
            indices: [i],
            state: { type: 'lis', nums: [...nums], dp: [...dp], i, j },
            variables: { 'dp[i]刷新为': dp[i], '最优前驱': j },
            codeLine: 8,
            explanation: `发现更长上升子序列！刷新 dp[${i}] = ${dp[i]}（前驱挂接至下标 ${j}）。`
          }));
        }
      }
    }

    let maxLen = 0, bestEnd = 0;
    for (let i = 0; i < n; i++) {
      if (dp[i] > maxLen) {
        maxLen = dp[i];
        bestEnd = i;
      }
    }

    const lisIndices = [];
    let curr = bestEnd;
    while (curr !== -1) {
      lisIndices.push(curr);
      curr = parent[curr];
    }
    lisIndices.reverse();

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: lisIndices,
      state: { type: 'lis', nums: [...nums], dp: [...dp], lisIndices, maxLen },
      variables: { 'LIS最长上升子序列长度': maxLen, '最优序列路径': lisIndices.map(idx => nums[idx]).join(' -> ') },
      codeLine: 9,
      explanation: `🎉 LIS 计算终结！最长上升子序列长度为 ${maxLen}。高亮显示的最优路径为: [${lisIndices.map(idx => nums[idx]).join(' -> ')}]。`
    }));

    return frames;
  }

  const lisDef = {
    id: 'lis',
    category: 'dp',
    name: '最长上升子序列 (LIS 状态追踪)',
    en: 'Longest Increasing Subsequence',
    meta: { tier: 'B组', time: 'O(N²)', space: 'O(N)', stability: '稳定', is408: false, tags: ['前驱极值', '二分优化', '线性DP'] },
    templates: {
      python: [
        'def length_of_lis(nums):  # 最长严格递增子序列主函数',
        '    if not nums: return 0  # 空数组边界特判',
        '    n = len(nums)  # 序列总长度',
        '    dp = [1] * n  # dp[i]: 以 nums[i] 结尾的 LIS 最大长度，初始每个单元素长度均为 1',
        '    for i in range(1, n):  # 阶段枚举：遍历当前考虑的序列末尾位置 i',
        '        for j in range(i):  # 决策枚举：寻找前面所有可能的前驱元素 nums[j]',
        '            if nums[j] < nums[i]:  # 满足严格递增条件方可形成转移',
        '                dp[i] = max(dp[i], dp[j] + 1)  # 状态转移：在前驱基础上扩展长度 +1',
        '    return max(dp)  # 全局最优解为所有位置结尾 LIS 的最大值'
      ],
      cpp: [
        'int lengthOfLIS(const vector<int>& nums) {  // 最长递增子序列主函数',
        '    if (nums.empty()) return 0;  // 边界保护',
        '    int n = nums.size();  // 序列长度',
        '    vector<int> dp(n, 1);  // 动态规划数组初始全为1',
        '    for (int i = 1; i < n; ++i) {  // 遍历当前末尾元素',
        '        for (int j = 0; j < i; ++j) {  // 检索所有前驱候选点',
        '            if (nums[j] < nums[i])',
        '                dp[i] = max(dp[i], dp[j] + 1);  // 状态转移方程',
        '        }',
        '    }',
        '    return *max_element(dp.begin(), dp.end());  // 提取全局最大长度',
        '}'
      ]
    },
    stlCard: {
      title: '📘 进阶贪心二分 $O(N \log N)$ (Patience Sort)',
      content: `
        <p><strong>纸牌博弈二分优化</strong>：维护 <code>tails[k]</code> 数组（长度为 $k+1$ 的 LIS 最小末尾）。每次用 <code>std::lower_bound</code> 在 $tails$ 中 $O(\log N)$ 替换或追加，全局加速至 $O(N \log N)$。</p>
      `
    },
    defaultInput: { nums: [10, 9, 2, 5, 3, 7, 101, 18] },
    presets: {
      standard: { nums: [10, 9, 2, 5, 3, 7, 101, 18] },
      increasing: { nums: [1, 2, 3, 4, 5] },
      decreasing: { nums: [5, 4, 3, 2, 1] }
    },
    parseInput: function(text) {
      const parts = text.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      return { success: true, data: { nums: parts.slice(0, 10) } };
    },
    generateFrames: generateLISFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageGrid = document.getElementById('stageGrid');
      if (!stageGrid) return;
      switchStageLayer('stageGrid');

      const state = frame.state || {};
      const nums = state.nums || [];
      const dp = state.dp || [];
      const lisIndices = state.lisIndices || [];
      const curI = state.i;
      const curJ = state.j;

      let html = '<div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; padding:20px;">';
      html += '<div style="display:flex; gap:10px; align-items:flex-end;">';

      nums.forEach((val, idx) => {
        const isLIS = lisIndices.includes(idx) && frame.action === ActionTypes.DONE;
        const isCurrent = (idx === curI);
        const isComparing = (idx === curJ);

        let bg = 'var(--state-default)';
        if (isLIS) bg = '#4ec9b0';
        else if (isCurrent) bg = '#ce9178';
        else if (isComparing) bg = '#dcdcaa';

        html += `
          <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
            <span style="font-size:10px; color:var(--text-muted);">[${idx}]</span>
            <div style="width:48px; height:54px; background:${bg}; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:bold; color:#fff; font-family:var(--font-mono);">
              ${val}
            </div>
            <span style="font-size:11px; font-weight:bold; color:var(--text-secondary);">dp: ${dp[idx]}</span>
          </div>
        `;
      });

      html += '</div></div>';
      stageGrid.innerHTML = html;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // General DP 2D Table Renderer
  function renderDPTable(frame) {
    const stageGrid = document.getElementById('stageGrid');
    if (!stageGrid) return;
    switchStageLayer('stageGrid');

    const matrix = frame.matrixData;
    const state = frame.state || {};
    if (!matrix) return;

    let html = '<div class="dp-visualizer-container" style="display:flex; flex-direction:column; gap:16px; align-items:center; padding:16px;">';

    // 顶部石子堆
    if (state.type === 'interval_dp' && state.stones) {
      html += '<div style="display:flex; gap:6px;">';
      state.stones.forEach((s, idx) => {
        const inRange = (state.i !== undefined && state.j !== undefined && idx >= state.i && idx <= state.j);
        html += `
          <div style="padding:6px 12px; border-radius:4px; font-weight:bold; background:${inRange ? '#dcdcaa' : 'var(--bg-surface)'}; color:${inRange ? '#000' : '#fff'}; border:1px solid var(--border-default);">
            堆${idx}: ${s}
          </div>
        `;
      });
      html += '</div>';
    }

    // 2D 状态表格
    html += '<table class="dp-table" style="border-collapse:collapse; background:var(--bg-surface);">';
    if (matrix.colLabels) {
      html += '<thead><tr><th style="padding:4px 8px; font-size:11px; border:1px solid var(--border-default);">i \\ j</th>';
      matrix.colLabels.forEach(cl => html += `<th style="padding:4px 8px; font-size:11px; border:1px solid var(--border-default);">${cl}</th>`);
      html += '</tr></thead>';
    }

    html += '<tbody>';
    for (let r = 0; r < matrix.rows; r++) {
      html += '<tr>';
      const rowLabel = matrix.rowLabels ? matrix.rowLabels[r] : `行 ${r}`;
      html += `<th style="text-align:right; font-size:11px; white-space:nowrap; padding:4px 8px; border:1px solid var(--border-default);">${rowLabel}</th>`;
      for (let c = 0; c < matrix.cols; c++) {
        const cellVal = matrix.cells[r] ? matrix.cells[r][c] : '';
        const hl = matrix.highlightCells.find(h => h.row === r && h.col === c);
        let bg = 'transparent';
        let color = '#fff';

        if (hl) {
          if (hl.role === 'write' || hl.role === 'optimal') { bg = '#4ec9b0'; color = '#000'; }
          else if (hl.role === 'read') { bg = '#dcdcaa'; color = '#000'; }
          else if (hl.role === 'candidate') { bg = '#c586c0'; color = '#000'; }
        }

        html += `<td style="min-width:38px; height:32px; font-size:12px; text-align:center; border:1px solid var(--border-default); background:${bg}; color:${color}; font-family:var(--font-mono); font-weight:bold;">${cellVal !== null && cellVal !== undefined ? cellVal : ''}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table>';

    html += '</div>';
    stageGrid.innerHTML = html;
    syncInspectorUI(frame);
  }

  // Register all 4 DP algorithms
  const allDPAlgorithms = [
    knapsack01Def,
    knapsackCompleteDef,
    intervalDPDef,
    lisDef
  ];

  allDPAlgorithms.forEach(def => {
    if (global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.register === 'function') {
      global.AlgoSystem.visualizers.register(def.id, def);
    }
  });

  global.AlgoSystem.visualizers.dp = {
    algorithms: allDPAlgorithms,
    knapsack01: knapsack01Def,
    knapsackComplete: knapsackCompleteDef,
    intervalDP: intervalDPDef,
    lis: lisDef
  };

})(typeof window !== 'undefined' ? window : globalThis);
