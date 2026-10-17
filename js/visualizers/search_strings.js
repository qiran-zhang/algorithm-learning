/**
 * @file search_strings.js
 * @description Search, Two Pointers & String Visualizers: Binary Search (Red-Blue), Sliding Window, KMP, Manacher.
 * @namespace window.AlgoSystem.visualizers.search_strings
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
    FOUND: 'FOUND',
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
            <td style="font-size:11px; color:var(--text-muted);">状态监视</td>
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
  // 1. 二分查找 (Binary Search - 红蓝染色折半)
  // =========================================================================
  function generateBinarySearchFrames(input) {
    let arr = [12, 19, 27, 35, 42, 58, 64, 76, 83, 91];
    let target = 58;

    if (Array.isArray(input)) {
      arr = [...input];
    } else if (input && typeof input === 'object') {
      if (Array.isArray(input.arr)) arr = [...input.arr];
      if (typeof input.target === 'number') target = input.target;
    }

    arr.sort((x, y) => x - y); // 强制单调有序
    const n = arr.length;
    const frames = [];
    let step = 0;

    let L = 0;
    let R = n - 1;
    const colors = new Array(n).fill('default'); // 'blue' (< target), 'red' (>= target), 'default'

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [L, R],
      state: { arr: [...arr], colors: [...colors], L, R, mid: -1, target },
      variables: { L, R, target, n, '区间': `[${L}..${R}]` },
      codeLine: 2,
      explanation: `【红蓝染色二分就绪】目标值 target = ${target}。闭区间搜索界 L = 0, R = ${n - 1}。`
    }));

    while (L <= R) {
      const mid = Math.floor((L + R) / 2);

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.COMPARE,
        indices: [mid],
        state: { arr: [...arr], colors: [...colors], L, R, mid, target },
        variables: { L, R, mid, 'a[mid]': arr[mid], target },
        codeLine: 4,
        explanation: `探查中点：mid = (${L} + ${R}) // 2 = ${mid}，取值 a[${mid}] = ${arr[mid]}。`
      }));

      if (arr[mid] < target) {
        for (let k = L; k <= mid; k++) colors[k] = 'blue';
        L = mid + 1;

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MODIFY,
          indices: [mid],
          state: { arr: [...arr], colors: [...colors], L, R, mid, target },
          variables: { L, R, mid, '判定': `${arr[mid]} < ${target}`, '染色': '蓝色 (不满足)' },
          codeLine: 6,
          explanation: `a[${mid}]=${arr[mid]} < ${target}：说明左半段全部小于目标，染为蓝色！左界右移 L = mid + 1 = ${L}。`
        }));
      } else {
        for (let k = mid; k <= R; k++) colors[k] = 'red';
        R = mid - 1;

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MODIFY,
          indices: [mid],
          state: { arr: [...arr], colors: [...colors], L, R, mid, target },
          variables: { L, R, mid, '判定': `${arr[mid]} >= ${target}`, '染色': '红色 (候选解)' },
          codeLine: 8,
          explanation: `a[${mid}]=${arr[mid]} >= ${target}：说明右半段均满足 >= target，染为红色！右界左移 R = mid - 1 = ${R}。`
        }));
      }
    }

    const isFound = (L < n && arr[L] === target);
    frames.push(new SnapshotFrame({
      step: step++,
      action: isFound ? ActionTypes.FOUND : ActionTypes.DONE,
      indices: isFound ? [L] : [],
      state: { arr: [...arr], colors: [...colors], L, R, mid: L, target, found: isFound },
      variables: { L, R, 'lower_bound': L, '是否精确命中': isFound, '答案': isFound ? `arr[${L}] = ${target}` : '目标不存在' },
      codeLine: 10,
      explanation: isFound
        ? `🎉 目标精准命中！第一处 >= ${target} 的元素位于下标 L = ${L}。`
        : `二分终止：数组中不存在目标值 ${target}。第一个大于目标的红区左界在 L = ${L}。`
    }));

    return frames;
  }

  const binarySearchDef = {
    id: 'binary_search',
    category: 'search_strings',
    name: '二分查找 (红蓝染色折半)',
    en: 'Binary Search',
    meta: { tier: 'C组', time: 'O(log N)', space: 'O(1)', stability: '稳定', is408: true, tags: ['区间折半', '二分答案', '单调性'] },
    templates: {
      python: [
        'def binary_search(arr, target):  # 红蓝染色二分查找：折半淘汰，寻找首个 >= target 的位置',
        '    L, R = 0, len(arr) - 1  # 初始化闭区间左右液压闸门 [L, R]',
        '    while L <= R:  # 当闭区间尚未坍缩为空集时持续折半',
        '        mid = (L + R) // 2  # 激光瞄准镜锁定当前区间中点 mid',
        '        if arr[mid] < target:  # 中点值偏小，说明 [L .. mid] 全员 < target（染为蓝区）',
        '            L = mid + 1  # 淘汰左半部，左闸门 L 跨越至 mid + 1',
        '        else:  # 中点值 >= target，说明 [mid .. R] 均满足条件（染为红区）',
        '            R = mid - 1  # 右闸门 R 收缩至 mid - 1，继续向左试探更早边界',
        '    return L if L < len(arr) and arr[L] == target else -1  # 循环结束时 L 即红蓝分界点'
      ],
      cpp: [
        'int binarySearch(const vector<int>& a, int target) { // 红蓝染色法 lower_bound 标准实现',
        '    int L = 0, R = (int)a.size() - 1; // 闭区间 [L, R] 初始覆盖全数组',
        '    while (L <= R) { // 区间非空时循环（循环不变量：L-1 恒蓝，R+1 恒红）',
        '        int mid = L + (R - L) / 2; // 防整型溢出的中点计算公式',
        '        if (a[mid] < target) L = mid + 1; // mid 落入蓝区，左边界右推',
        '        else R = mid - 1; // mid 落入红区，右边界左推锁定左界',
        '    }',
        '    return (L < a.size() && a[L] == target) ? L : -1; // 校验分界点 L 是否命中目标',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>红蓝染色法精要</strong>：蓝色代表必定不满足条件，红色代表必定满足条件。循环终止时，指针 $L$ 必定落在第一个红色元素上（即 <code>std::lower_bound</code>）。</p>
        <p><strong>C++ STL 对照</strong>：<code>std::lower_bound</code> 与 <code>std::upper_bound</code>。</p>
      `
    },
    defaultInput: { arr: [12, 19, 27, 35, 42, 58, 64, 76, 83, 91], target: 58 },
    presets: {
      target_in: { arr: [5, 12, 18, 24, 30, 36, 42, 48, 54, 60], target: 36 },
      target_missing: { arr: [10, 20, 30, 40, 50, 60, 70], target: 35 },
      edge_left: { arr: [2, 4, 6, 8, 10, 12], target: 2 }
    },
    parseInput: function(text) {
      const parts = text.split(/[;；]/);
      const arrRes = parseArrayInput(parts[0]);
      if (!arrRes.success) return arrRes;
      let target = 58;
      if (parts[1]) {
        const num = Number(parts[1].replace(/[^0-9\-]/g, ''));
        if (!isNaN(num)) target = num;
      }
      return { success: true, data: { arr: arrRes.data, target } };
    },
    generateFrames: generateBinarySearchFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageArray = document.getElementById('stageArray');
      if (!stageArray) return;
      switchStageLayer('stageArray');

      const state = frame.state || {};
      const arr = state.arr || [];
      const colors = state.colors || [];
      const maxVal = Math.max(...arr, 1);

      let html = '<div class="binary-search-stage" style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; padding:20px 10px;">';
      html += `<div style="font-size:13px; color:var(--text-secondary); margin-bottom:8px;">🎯 检索目标 target = <strong style="color:var(--color-primary-hover); font-size:16px;">${state.target}</strong> (红蓝染色折半)</div>`;
      html += '<div style="display:flex; align-items:flex-end; justify-content:center; gap:8px; width:100%; height:240px;">';

      arr.forEach((val, idx) => {
        const color = colors[idx] || 'default';
        let bgStyle = 'var(--state-default)';
        if (color === 'blue') bgStyle = '#007acc';
        else if (color === 'red') bgStyle = '#f44747';

        if (state.mid === idx) {
          bgStyle = '#dcdcaa'; // 金黄
        }
        if (state.found && state.L === idx) {
          bgStyle = '#4ec9b0'; // 翡翠绿
        }

        const heightPct = Math.max(16, Math.min(88, Math.round((val / maxVal) * 82)));
        html += `
          <div style="height:${heightPct}%; flex:1; max-width:54px; background:${bgStyle}; border-radius:4px 4px 0 0; display:flex; flex-direction:column; justify-content:space-between; align-items:center; transition:all 0.25s;">
            <span style="font-size:12px; font-weight:bold; color:#fff; margin-top:4px;">${val}</span>
            <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:4px;">
              ${state.L === idx ? '<span style="font-size:10px; color:#fff; font-weight:bold;">▲L</span>' : ''}
              ${state.R === idx ? '<span style="font-size:10px; color:#fff; font-weight:bold;">▲R</span>' : ''}
              ${state.mid === idx ? '<span style="font-size:10px; color:#1e1e1e; font-weight:bold;">★mid</span>' : ''}
              <span style="font-size:10px; color:rgba(255,255,255,0.7);">[${idx}]</span>
            </div>
          </div>
        `;
      });

      html += '</div>';
      html += '<div style="font-size:11px; color:var(--text-muted);"><span style="color:#007acc;">■ 蓝色区间</span>: 严格小于目标 | <span style="color:#f44747;">■ 红色区间</span>: 大于等于目标(候选解) | <span style="color:#dcdcaa;">★ mid中点</span></div>';
      html += '</div>';

      stageArray.innerHTML = html;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 2. 滑动窗口毛毛虫 (Sliding Window)
  // =========================================================================
  function generateSlidingWindowFrames(input) {
    let arr = [2, 1, 5, 2, 3, 2, 4, 3];
    let targetSum = 7;

    if (Array.isArray(input)) {
      arr = [...input];
    } else if (input && typeof input === 'object') {
      if (Array.isArray(input.arr)) arr = [...input.arr];
      if (typeof input.targetSum === 'number') targetSum = input.targetSum;
    }

    const n = arr.length;
    const frames = [];
    let step = 0;

    let L = 0;
    let currSum = 0;
    let minLen = Infinity;
    let bestRange = null;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [0],
      state: { arr: [...arr], L: 0, R: 0, currSum: 0, targetSum, bestRange },
      variables: { L: 0, R: 0, currSum: 0, minLen: '无', targetSum },
      codeLine: 2,
      explanation: `【滑动窗口毛毛虫就绪】求和 ≥ ${targetSum} 的最短连续子数组。左右指针在起点对齐。`
    }));

    for (let R = 0; R < n; R++) {
      currSum += arr[R];

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MODIFY,
        indices: [R],
        state: { arr: [...arr], L, R, currSum, targetSum, bestRange },
        variables: { L, R, '吃进元素': arr[R], '窗口当前和': currSum, minLen: minLen === Infinity ? '无' : minLen },
        codeLine: 4,
        explanation: `【毛毛虫探头】右指针 R 扩充至 ${R}，吃进 a[${R}] = ${arr[R]}，当前窗口和达到 ${currSum}。`
      }));

      while (currSum >= targetSum) {
        const curLen = R - L + 1;
        if (curLen < minLen) {
          minLen = curLen;
          bestRange = [L, R];
        }

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.FOUND,
          indices: [L, R],
          state: { arr: [...arr], L, R, currSum, targetSum, bestRange, curLen },
          variables: { L, R, '窗口长度': curLen, '历史最佳长度': minLen, currSum },
          codeLine: 6,
          explanation: `💡 达标！当前窗口和 ${currSum} >= ${targetSum}，捕获有效子序列 [${L}..${R}]，长度 ${curLen}。刷新最佳解 minLen = ${minLen}。`
        }));

        currSum -= arr[L];
        L++;

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.BACKTRACK,
          indices: [L - 1],
          state: { arr: [...arr], L, R, currSum, targetSum, bestRange },
          variables: { L, R, '吐出元素': arr[L - 1], '更新后窗口和': currSum, minLen },
          codeLine: 8,
          explanation: `【毛毛虫缩尾】左指针 L 收缩至 ${L}，吐出 a[${L-1}] = ${arr[L-1]}，窗口瘦身为 [${L}..${R}]，和降为 ${currSum}。`
        }));
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: bestRange ? [bestRange[0], bestRange[1]] : [],
      state: { arr: [...arr], L, R: n - 1, currSum, targetSum, bestRange, minLen },
      variables: { '最终最小长度': minLen === Infinity ? 0 : minLen, bestRange: bestRange ? `[${bestRange[0]}..${bestRange[1]}]` : '无解' },
      codeLine: 10,
      explanation: minLen !== Infinity
        ? `🎉 滑动窗口检索完毕！满足和 ≥ ${targetSum} 的最短长度为 ${minLen} (区间 [${bestRange[0]}..${bestRange[1]}])。`
        : `滑动窗口结束：全数组无可满足和 ≥ ${targetSum} 的子数组。`
    }));

    return frames;
  }

  const slidingWindowDef = {
    id: 'sliding_window',
    category: 'search_strings',
    name: '滑动窗口毛毛虫',
    en: 'Sliding Window',
    meta: { tier: 'B组', time: 'O(N)', space: 'O(1)', stability: '稳定', is408: false, tags: ['双指针', '左右伸缩', '连续子数组'] },
    templates: {
      python: [
        'def min_sub_array_len(target, nums):  # 同向双指针滑动窗口：毛毛虫右扩左缩 O(N)',
        '    L, curr_sum, min_len = 0, 0, float("inf")  # L 为左尾指针，curr_sum 为窗口蓄水池总和',
        '    for R in range(len(nums)):  # R 为右头指针，每步向右吞入一个新元素扩张窗口',
        '        curr_sum += nums[R]  # 右侧新元素汇入窗口能量池',
        '        while curr_sum >= target:  # 一旦能量池达标（>= target），尝试收缩左尾求最短长度',
        '            min_len = min(min_len, R - L + 1)  # 刷新历史最短合规窗口长度记录',
        '            curr_sum -= nums[L]  # 从蓄水池中吐出最左侧元素 nums[L]',
        '            L += 1  # 毛毛虫左尾向右收回一步',
        '    return min_len if min_len != float("inf") else 0  # 每个元素至多进出一次，严格 O(N)'
      ],
      cpp: [
        'int minSubArrayLen(int target, const vector<int>& nums) { // 不定长滑动窗口求最短达标子数组',
        '    int L = 0, sum = 0, ans = 1e9; // 初始化左指针、窗口和与最优解',
        '    for (int R = 0; R < (int)nums.size(); ++R) { // 右指针主动向右扩张',
        '        sum += nums[R]; // 纳入右端点元素',
        '        while (sum >= target) { // 窗口和满足条件时，持续右移左指针精简窗口',
        '            ans = min(ans, R - L + 1); // 更新最小窗口跨度',
        '            sum -= nums[L++]; // 移出左端点并推进 L',
        '        }',
        '    }',
        '    return ans == 1e9 ? 0 : ans; // 若未找到合规区间返回 0',
        '}'
      ]
    },
    stlCard: {
      title: '📘 滑动窗口题眼与复杂度证明',
      content: `
        <p><strong>均摊时间复杂度</strong>：每个元素最多被 $R$ 指针访问一次，被 $L$ 指针弹出一次，均摊为严格 $O(N)$。</p>
        <p><strong>适用场景</strong>：连续子数组极值、和大于/小于某阈值、最长无重复字符子串。</p>
      `
    },
    defaultInput: { arr: [2, 1, 5, 2, 3, 2, 4, 3], targetSum: 7 },
    presets: {
      standard: { arr: [2, 1, 5, 2, 3, 2, 4, 3], targetSum: 7 },
      single_large: { arr: [1, 2, 8, 1, 3], targetSum: 8 },
      all_small: { arr: [1, 1, 1, 1, 1, 1], targetSum: 10 }
    },
    parseInput: function(text) {
      const parts = text.split(/[;；]/);
      const arrRes = parseArrayInput(parts[0]);
      if (!arrRes.success) return arrRes;
      let targetSum = 7;
      if (parts[1]) {
        const num = Number(parts[1].replace(/[^0-9\-]/g, ''));
        if (!isNaN(num)) targetSum = num;
      }
      return { success: true, data: { arr: arrRes.data, targetSum } };
    },
    generateFrames: generateSlidingWindowFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageArray = document.getElementById('stageArray');
      if (!stageArray) return;
      switchStageLayer('stageArray');

      const state = frame.state || {};
      const arr = state.arr || [];
      const maxVal = Math.max(...arr, 1);
      const L = state.L !== undefined ? state.L : 0;
      const R = state.R !== undefined ? state.R : 0;

      let html = '<div class="sliding-window-stage" style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; padding:20px 10px;">';
      html += `<div style="font-size:13px; color:var(--text-secondary);">毛毛虫窗口 <strong>[${L}..${R}]</strong> | 当前和: <strong style="color:var(--state-compare);">${state.currSum || 0}</strong> / 目标和: <strong>${state.targetSum || 7}</strong></div>`;
      html += '<div style="display:flex; align-items:flex-end; justify-content:center; gap:8px; width:100%; height:230px;">';

      arr.forEach((val, idx) => {
        const inWindow = (idx >= L && idx <= R);
        let bgStyle = inWindow ? '#4ec9b0' : 'var(--bg-surface)';
        let borderStyle = inWindow ? '2px solid var(--state-sorted)' : '1px solid var(--border-default)';

        if (state.bestRange && idx >= state.bestRange[0] && idx <= state.bestRange[1] && frame.action === ActionTypes.DONE) {
          bgStyle = '#4ec9b0';
          borderStyle = '2px solid #fff';
        }

        const heightPct = Math.max(16, Math.min(88, Math.round((val / maxVal) * 82)));
        html += `
          <div style="height:${heightPct}%; flex:1; max-width:54px; background:${bgStyle}; border:${borderStyle}; border-radius:4px 4px 0 0; display:flex; flex-direction:column; justify-content:space-between; align-items:center; transition:all 0.25s;">
            <span style="font-size:12px; font-weight:bold; color:${inWindow ? '#000' : '#fff'}; margin-top:4px;">${val}</span>
            <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:4px;">
              ${idx === L ? '<span style="font-size:10px; color:#fff; font-weight:bold;">▲L</span>' : ''}
              ${idx === R ? '<span style="font-size:10px; color:#fff; font-weight:bold;">▲R</span>' : ''}
              <span style="font-size:10px; color:rgba(255,255,255,0.7);">[${idx}]</span>
            </div>
          </div>
        `;
      });

      html += '</div></div>';
      stageArray.innerHTML = html;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 3. KMP 字符串模式匹配
  // =========================================================================
  function generateKMPFrames(input) {
    let text = "ABABABABCABAAB";
    let pattern = "ABABC";

    if (input && typeof input === 'object') {
      if (typeof input.text === 'string' && input.text) text = input.text;
      if (typeof input.pattern === 'string' && input.pattern) pattern = input.pattern;
    }

    const n = text.length;
    const m = pattern.length;
    const frames = [];
    let step = 0;

    // 1. 构建前缀函数 pi / next 数组
    const pi = new Array(m).fill(0);
    let j = 0;
    for (let i = 1; i < m; i++) {
      while (j > 0 && pattern[i] !== pattern[j]) {
        j = pi[j - 1];
      }
      if (pattern[i] === pattern[j]) j++;
      pi[i] = j;
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { text, pattern, pi: [...pi], i: 0, j: 0, offset: 0 },
      variables: { text, pattern, 'π (next表)': `[${pi.join(', ')}]`, '主串长度 N': n, '模式串 M': m },
      codeLine: 2,
      explanation: `【KMP 预计算完成】模式串 "${pattern}" 的最长公共前后缀表 π = [${pi.join(', ')}]，开始在主串中单向滑动比对。`
    }));

    j = 0;
    let matchFound = false;

    for (let i = 0; i < n; i++) {
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.COMPARE,
        indices: [i],
        state: { text, pattern, pi, i, j, offset: i - j },
        variables: { i, j, 'text[i]': text[i], 'pattern[j]': pattern[j] },
        codeLine: 6,
        explanation: `比对字符：主串 text[${i}] = '${text[i]}' 与模式串 pattern[${j}] = '${pattern[j]}'。`
      }));

      while (j > 0 && text[i] !== pattern[j]) {
        const prevJ = j;
        j = pi[j - 1];

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.BACKTRACK,
          indices: [i],
          state: { text, pattern, pi, i, j, offset: i - j },
          variables: { i, '失配回退': `j 从 ${prevJ} 跳跃至 π[${prevJ-1}] = ${j}` },
          codeLine: 8,
          explanation: `⚡ 字符失配！主串指针 i = ${i} 绝不后退，模式串利用前缀表跳跃对齐，j 回退至 ${j}。`
        }));
      }

      if (text[i] === pattern[j]) {
        j++;
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MODIFY,
          indices: [i],
          state: { text, pattern, pi, i, j, offset: i - j + 1 },
          variables: { i, j, '已匹配长度': j },
          codeLine: 10,
          explanation: `字符命中匹配！模式串匹配推进至第 ${j} 位。`
        }));
      }

      if (j === m) {
        matchFound = true;
        const startIdx = i - m + 1;
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.FOUND,
          indices: [startIdx, i],
          state: { text, pattern, pi, i, j, matchStart: startIdx, offset: startIdx },
          variables: { '🎯 完整命中': `起始下标 ${startIdx}`, i, j },
          codeLine: 12,
          explanation: `🎉 模式串完整命中！在主串下标 [${startIdx} .. ${i}] 处发现完整子串 "${pattern}"。`
        }));
        j = pi[j - 1];
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { text, pattern, pi, i: n, j, matchFound },
      variables: { matchFound, status: 'COMPLETE' },
      codeLine: 14,
      explanation: `KMP 全文检索流程完毕！主串指针只向前移动，无任何冗余回溯，时间复杂度严格为 O(N + M)。`
    }));

    return frames;
  }

  const kmpDef = {
    id: 'kmp',
    category: 'search_strings',
    name: 'KMP 字符串匹配 (next数组)',
    en: 'KMP Matcher',
    meta: { tier: 'B组', time: 'O(N+M)', space: 'O(M)', stability: '稳定', is408: true, tags: ['next数组', '失配回退', '前缀函数'] },
    templates: {
      python: [
        'def kmp_search(text, pattern):  # KMP 匹配：主串指针 i 永不回退，利用最长公共前后缀跳跃',
        '    pi = compute_pi(pattern)  # 预处理模式串的前缀函数 pi[]（即 408 的 next 数组）',
        '    j = 0  # j 表示模式串当前已成功匹配的前缀长度',
        '    for i in range(len(text)):  # 主串棘轮指针 i 单向向右扫描，绝不倒退',
        '        while j > 0 and text[i] != pattern[j]:  # 发生失配：抓紧查 pi 表回退模式串指针 j',
        '            j = pi[j - 1]  # 模式串向右滑动，将最长相等前缀直接对齐到刚才的后缀位置',
        '        if text[i] == pattern[j]: j += 1  # 当前字符匹配成功，模式串匹配长度 +1',
        '        if j == len(pattern):  # 模式串全长匹配完毕！',
        '            return i - len(pattern) + 1  # 返回主串中命中的起始下标',
        '            j = pi[j - 1]  # 若需继续寻找下一处匹配，按同样规则回退 j',
        '    return -1  # 主串扫描完毕仍未命中，返回 -1'
      ],
      cpp: [
        'int kmp(const string& s, const string& p) { // KMP 线性时间字符串匹配 O(N + M)',
        '    vector<int> pi = getPi(p); // 预计算模式串最长相等真前后缀长度表',
        '    int j = 0; // 模式串游标 j',
        '    for (int i = 0; i < (int)s.size(); ++i) { // 主串游标 i 单调递增不回退',
        '        while (j > 0 && s[i] != p[j]) j = pi[j - 1]; // 失配时沿失配指针回跳',
        '        if (s[i] == p[j]) ++j; // 字符相等则携手前进',
        '        if (j == (int)p.size()) return i - p.size() + 1; // 完全命中返回首下标',
        '    }',
        '    return -1; // 未找到匹配子串',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>408 核心重难点</strong>：<code>next</code> 数组的手算（最长公共真前后缀长度）。失配时主串指针 $i$ 不动，模式串指针 $j$ 跳至 <code>next[j-1]</code>。</p>
        <p><strong>C++ STL 对照</strong>：C++23 <code>std::string_view::contains</code> 或 <code>std::search(..., std::boyer_moore_searcher)</code>。</p>
      `
    },
    defaultInput: { text: "ABABABABCABAAB", pattern: "ABABC" },
    presets: {
      standard: { text: "ABABABABCABAAB", pattern: "ABABC" },
      repeated: { text: "AAAAABAAAA", pattern: "AAAA" },
      missing: { text: "ABCDEFG", pattern: "XYZ" }
    },
    parseInput: function(text) {
      const parts = text.split(/[;,]/).map(s => s.trim());
      if (parts.length >= 2) {
        return { success: true, data: { text: parts[0], pattern: parts[1] } };
      }
      return { success: false, error: '请输入格式：主串, 模式串' };
    },
    generateFrames: generateKMPFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageArray = document.getElementById('stageArray');
      if (!stageArray) return;
      switchStageLayer('stageArray');

      const state = frame.state || {};
      const text = state.text || '';
      const pattern = state.pattern || '';
      const offset = state.offset !== undefined ? state.offset : 0;
      const curI = state.i !== undefined ? state.i : 0;
      const curJ = state.j !== undefined ? state.j : 0;

      let html = '<div class="kmp-stage" style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; padding:20px;">';
      
      // 主串行
      html += '<div style="display:flex; flex-direction:column; align-items:flex-start;">';
      html += '<span style="font-size:12px; color:var(--text-secondary); margin-bottom:4px;">主串 Text (i 指针单向无后退):</span>';
      html += '<div style="display:flex; gap:6px;">';
      for (let i = 0; i < text.length; i++) {
        const isCurrent = (i === curI);
        const isMatched = (state.matchStart !== undefined && i >= state.matchStart && i < state.matchStart + pattern.length);
        let bg = 'var(--bg-surface)';
        if (isMatched) bg = '#4ec9b0';
        else if (isCurrent) bg = '#dcdcaa';

        html += `
          <div style="width:36px; height:42px; background:${bg}; border:1px solid ${isCurrent ? 'var(--color-primary-hover)' : 'var(--border-default)'}; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:${isCurrent || isMatched ? '#000' : '#fff'}; font-weight:bold; font-family:var(--font-mono);">
            <span>${text[i]}</span>
            <span style="font-size:9px; color:var(--text-muted);">${i}</span>
          </div>
        `;
      }
      html += '</div></div>';

      // 模式串对齐行
      html += '<div style="display:flex; flex-direction:column; align-items:flex-start;">';
      html += '<span style="font-size:12px; color:var(--text-secondary); margin-bottom:4px;">模式串 Pattern (根据 π 数组平滑滑动):</span>';
      html += `<div style="display:flex; gap:6px; margin-left:${Math.max(0, offset * 42)}px; transition:margin-left 0.25s;">`;
      for (let j = 0; j < pattern.length; j++) {
        const isCurrent = (j === curJ);
        html += `
          <div style="width:36px; height:42px; background:${isCurrent ? '#ce9178' : 'var(--bg-subsurface)'}; border:1px solid var(--border-default); border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; font-weight:bold; font-family:var(--font-mono);">
            <span>${pattern[j]}</span>
            <span style="font-size:9px; color:var(--text-muted);">π:${state.pi ? state.pi[j] : 0}</span>
          </div>
        `;
      }
      html += '</div></div>';

      html += '</div>';
      stageArray.innerHTML = html;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 4. Manacher 最长回文子串
  // =========================================================================
  function generateManacherFrames(input) {
    let raw = "abbacdeedcba";
    if (typeof input === 'string' && input) raw = input;
    else if (input && typeof input.raw === 'string' && input.raw) raw = input.raw;

    const frames = [];
    let step = 0;

    // 插桩预处理
    const T = '^#' + raw.split('').join('#') + '#$';
    const n = T.length;
    const P = new Array(n).fill(0);
    let C = 0;
    let R = 0;
    let maxLen = 0;
    let bestCenter = 0;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { raw, T, P: [...P], C: 0, R: 0, i: 0 },
      variables: { raw, '插桩扩展串': T, len: n },
      codeLine: 2,
      explanation: `【插桩预处理】原串 "${raw}" 扩展为 "${T}"，彻底消除奇偶回文长度差异。`
    }));

    for (let i = 1; i < n - 1; i++) {
      const iMirror = 2 * C - i;

      if (i < R) {
        P[i] = Math.min(R - i, P[iMirror]);
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.HIGHLIGHT,
          indices: [i, iMirror],
          state: { raw, T, P: [...P], C, R, i, iMirror },
          variables: { i, C, R, iMirror, 'P[i]继承': P[i] },
          codeLine: 5,
          explanation: `i = ${i} 位于右边界 R = ${R} 内部：利用关于中心 C = ${C} 对称点 i_mirror = ${iMirror}，继承初始半径 P[i] = ${P[i]}。`
        }));
      } else {
        P[i] = 0;
      }

      while (T[i - 1 - P[i]] === T[i + 1 + P[i]]) {
        P[i]++;
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.COMPARE,
          indices: [i - P[i], i + P[i]],
          state: { raw, T, P: [...P], C, R, i },
          variables: { i, '扩展半径': P[i], '对称字符': `'${T[i - P[i]]}' == '${T[i + P[i]]}'` },
          codeLine: 7,
          explanation: `字符对称匹配成功：半径向外扩张 P[${i}] = ${P[i]}。`
        }));
      }

      if (i + P[i] > R) {
        C = i;
        R = i + P[i];
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MODIFY,
          indices: [i],
          state: { raw, T, P: [...P], C, R, i },
          variables: { '新对称中心C': C, '新右边界R': R },
          codeLine: 9,
          explanation: `回文右边界突破！更新最右中心 C = ${C}，最新探索边界 R = ${R}。`
        }));
      }

      if (P[i] > maxLen) {
        maxLen = P[i];
        bestCenter = i;
      }
    }

    const start = Math.floor((bestCenter - maxLen) / 2);
    const longestPal = raw.substring(start, start + maxLen);

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.FOUND,
      indices: [start, start + maxLen - 1],
      state: { raw, T, P, longestPal, maxLen, bestCenter },
      variables: { '最长回文子串': longestPal, '半径': maxLen, '起始位置': start },
      codeLine: 12,
      explanation: `🎉 Manacher 算法检索完毕！最长回文子串为 "${longestPal}"，长度为 ${maxLen}。`
    }));

    return frames;
  }

  const manacherDef = {
    id: 'manacher',
    category: 'search_strings',
    name: 'Manacher 最长回文子串',
    en: 'Manacher Algorithm',
    meta: { tier: 'B组', time: 'O(N)', space: 'O(N)', stability: '稳定', is408: false, tags: ['马拉车', '回文半径', '对称中心'] },
    templates: {
      python: [
        'def manacher(s):  # 马拉车算法：插桩统一奇偶回文，利用回文镜面对称实现 O(N) 线性探测',
        '    T = "^#" + "#".join(s) + "#$"  # 插入 # 号将奇偶回文全部转化为奇回文，首尾加哨兵防越界',
        '    P = [0] * len(T)  # P[i] 记录以 T[i] 为中心的回文扩展半径（恰好等于原串回文长度）',
        '    C = R = 0  # C 为当前最右回文罩的对称镜面中心，R 为最右回文右边界',
        '    for i in range(1, len(T) - 1):  # 依次求解每个位置 i 的回文半径 P[i]',
        '        i_mirror = 2 * C - i  # 计算 i 关于镜面中心 C 的左侧对称镜像点 i_mirror',
        '        if R > i: P[i] = min(R - i, P[i_mirror])  # 若 i 在右界 R 内，直接继承镜像半径与 R-i 的较小值',
        '        while T[i + 1 + P[i]] == T[i - 1 - P[i]]: P[i] += 1  # 在保底半径基础上继续向两侧暴力扩展',
        '        if i + P[i] > R: C, R = i, i + P[i]  # 若新回文右翼冲破 R，更新镜面中心 C 与最右界 R',
        '    max_len, center = max((n, i) for i, n in enumerate(P))  # 找出全局最大回文半径及其中心',
        '    start = (center - max_len) // 2  # 折算回原字符串 s 中的起始下标',
        '    return s[start:start + max_len]  # 切片返回最长回文子串（R 最多右移 N 次，总时间 O(N)）'
      ],
      cpp: [
        'string manacher(const string& s) { // Manacher 线性求最长回文子串 O(N)',
        '    string t = "^"; // 头部哨兵，免去中心扩展时的左越界判断',
        '    for (char c : s) { t += "#"; t += c; } // 插入分隔符 # 统一奇偶长度回文',
        '    t += "#$"; // 尾部哨兵（与头部不同，遇到即自动停止扩展）',
        '    vector<int> p(t.size(), 0); // p[i] 存储以 i 为中心的回文半径',
        '    int c = 0, r = 0; // c 为最右回文中心，r 为最右回文右端点',
        '    for (int i = 1; i < (int)t.size() - 1; ++i) { // 线性扫描插桩串',
        '        int i_mirror = 2 * c - i; // 计算 i 关于中心 c 的对称点',
        '        if (r > i) p[i] = min(r - i, p[i_mirror]); // 利用回文对称性 O(1) 赋予初始半径',
        '        while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) p[i]++; // 尝试向左右继续扩展',
        '        if (i + p[i] > r) { c = i; r = i + p[i]; } // 刷新最右覆盖边界 r 与中心 c',
        '    }',
        '    return s; // 提取最大 p[i] 对应的原串子串返回',
        '}'
      ]
    },
    stlCard: {
      title: '📘 竞赛黑科技原理',
      content: `
        <p><strong>对称性加速</strong>：通过维护回文中心 $C$ 与最右右边界 $R$，内部点直接利用镜像点半径 $P[2C-i]$ 快速初始化，避免了暴力向外延伸，使得整体时间复杂度收敛到严格的 $O(N)$。</p>
      `
    },
    defaultInput: "abbacdeedcba",
    presets: {
      standard: "abbacdeedcba",
      odd_pal: "racecar",
      even_pal: "noon"
    },
    parseInput: function(text) {
      const clean = text.trim();
      if (!clean) return { success: false, error: '输入不能为空' };
      return { success: true, data: clean };
    },
    generateFrames: generateManacherFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageArray = document.getElementById('stageArray');
      if (!stageArray) return;
      switchStageLayer('stageArray');

      const state = frame.state || {};
      const T = state.T || '';
      const P = state.P || [];
      const curI = state.i || 0;

      let html = '<div class="manacher-stage" style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; padding:20px;">';
      html += `<div style="font-size:13px; color:var(--text-secondary);">原串: <strong>${state.raw}</strong> | 最长回文: <strong style="color:var(--state-sorted);">${state.longestPal || '探索中'}</strong></div>`;

      html += '<div style="display:flex; gap:4px; flex-wrap:wrap; justify-content:center;">';
      for (let i = 0; i < T.length; i++) {
        const isCurrent = (i === curI);
        let bg = 'var(--bg-surface)';
        if (isCurrent) bg = '#ce9178';
        else if (i === state.C) bg = '#007acc';

        html += `
          <div style="width:30px; height:48px; background:${bg}; border:1px solid var(--border-default); border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding:4px 0; font-family:var(--font-mono);">
            <span style="font-weight:bold; font-size:13px; color:#fff;">${T[i]}</span>
            <span style="font-size:10px; color:var(--state-compare);">${P[i] || 0}</span>
          </div>
        `;
      }
      html += '</div></div>';

      stageArray.innerHTML = html;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // Register 4 search & string algorithms
  const allSearchStringAlgorithms = [
    binarySearchDef,
    slidingWindowDef,
    kmpDef,
    manacherDef
  ];

  allSearchStringAlgorithms.forEach(def => {
    if (global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.register === 'function') {
      global.AlgoSystem.visualizers.register(def.id, def);
    }
  });

  global.AlgoSystem.visualizers.search_strings = {
    algorithms: allSearchStringAlgorithms,
    binarySearch: binarySearchDef,
    slidingWindow: slidingWindowDef,
    kmp: kmpDef,
    manacher: manacherDef
  };

})(typeof window !== 'undefined' ? window : globalThis);
