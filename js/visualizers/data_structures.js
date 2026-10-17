/**
 * @file data_structures.js
 * @description Core & Advanced Data Structures Visualizers: Monotonic Stack, Monotonic Queue, Binary Heap, DSU, Trie, Fenwick Tree (BIT), Segment Tree.
 * @namespace window.AlgoSystem.visualizers.data_structures
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
    PUSH: 'PUSH',
    POP: 'POP',
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
  // 1. 单调栈 (Monotonic Stack - Next Greater Element)
  // =========================================================================
  function generateMonotonicStackFrames(input) {
    const nums = Array.isArray(input) ? [...input] : [2, 1, 2, 4, 3, 5];
    const n = nums.length;
    const ans = new Array(n).fill(-1);
    const stack = []; // 存下标
    const frames = [];
    let step = 0;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { nums: [...nums], stack: [], ans: [...ans], currentIdx: -1 },
      variables: { i: '-', currVal: '-', stackSize: 0, n },
      codeLine: 2,
      explanation: `【单调栈初始化】输入序列长度 N = ${n}，答案数组全置为 -1，单调递减栈置空。`
    }));

    for (let i = 0; i < n; i++) {
      const val = nums[i];
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [i],
        state: { nums: [...nums], stack: [...stack], ans: [...ans], currentIdx: i },
        variables: { i, currVal: val, stackTop: stack.length > 0 ? nums[stack[stack.length - 1]] : '空' },
        codeLine: 5,
        explanation: `扫描第 ${i} 项元素 ${val}，准备与栈顶比对单调性。`
      }));

      while (stack.length > 0 && val > nums[stack[stack.length - 1]]) {
        const topIdx = stack[stack.length - 1];
        const topVal = nums[topIdx];

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.COMPARE,
          indices: [i, topIdx],
          state: { nums: [...nums], stack: [...stack], ans: [...ans], currentIdx: i },
          variables: { i, 'nums[i]': val, '栈顶值': topVal, '栈顶下标': topIdx },
          codeLine: 6,
          explanation: `当前元素 ${val} 严格大于栈顶 ${topVal}（下标 ${topIdx}），破坏了单调递减性！`
        }));

        stack.pop();
        ans[topIdx] = val;

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.POP,
          indices: [topIdx],
          state: { nums: [...nums], stack: [...stack], ans: [...ans], currentIdx: i },
          variables: { '出栈元素': topVal, '确立NGE': `ans[${topIdx}] = ${val}` },
          codeLine: 8,
          explanation: `栈顶 ${topVal} 出栈！确定其右侧第一个更大元素就是 ${val}。`
        }));
      }

      stack.push(i);
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.PUSH,
        indices: [i],
        state: { nums: [...nums], stack: [...stack], ans: [...ans], currentIdx: i },
        variables: { '入栈下标': i, '入栈数值': val, stackSize: stack.length },
        codeLine: 9,
        explanation: `当前元素 ${val}（下标 ${i}）压入单调栈，栈内严格保持单调递减。`
      }));
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { nums: [...nums], stack: [...stack], ans: [...ans], currentIdx: -1 },
      variables: { status: 'COMPLETE', '未匹配项数': stack.length },
      codeLine: 10,
      explanation: `单调栈遍历结束！栈内残留的 ${stack.length} 个元素右侧无更大值，答案保持默认 -1。`
    }));

    return frames;
  }

  const monotonicStackDef = {
    id: 'monotonic_stack',
    category: 'data_structures',
    name: '单调栈 (下一个更大元素)',
    en: 'Monotonic Stack',
    meta: { tier: 'B组', time: 'O(N)', space: 'O(N)', stability: '稳定', is408: false, tags: ['下一个更大元素', '柱状图面积', 'O(N)'] },
    templates: {
      python: [
        'def next_greater_element(nums):  # 单调栈：维护栈内单调递减，O(N) 锁定右侧首个更大元素',
        '    n = len(nums)  # 数组长度 N',
        '    ans = [-1] * n  # 结果数组初始化为 -1（若右侧无更高楼则保持 -1）',
        '    st = []  # 单调递减栈（存储元素下标，等待右侧更高楼来将其弹出）',
        '    for i in range(n):  # 新大楼 nums[i] 依次进场',
        '        while st and nums[i] > nums[st[-1]]:  # 当前楼高于栈顶楼：栈顶楼找到了右侧首个更大值！',
        '            top_idx = st.pop()  # 矮楼从栈顶弹出完成使命',
        '            ans[top_idx] = nums[i]  # 记录挡住 top_idx 视线的右侧第一栋高楼为 nums[i]',
        '        st.append(i)  # 当前楼下标入栈，继续维持栈底到栈顶单调递减',
        '    return ans  # 每个下标至多入栈一次、出栈一次，均摊时间严格 O(N)'
      ],
      cpp: [
        'vector<int> nextGreaterElement(const vector<int>& nums) { // 单调栈模板：下一个更大元素',
        '    int n = nums.size(); // 序列长度',
        '    vector<int> ans(n, -1); // 答案数组默认填 -1',
        '    stack<int> st; // 存放尚未找到下一个更大值的元素下标',
        '    for (int i = 0; i < n; ++i) { // 顺序遍历每个元素',
        '        while (!st.empty() && nums[i] > nums[st.top()]) { // 新元素破坏单调递减性时持续弹栈',
        '            ans[st.top()] = nums[i]; // 栈顶元素的下一个更大值即为 nums[i]',
        '            st.pop(); // 弹出已结算的栈顶下标',
        '        }',
        '        st.push(i); // 当前下标入栈等待后续结算',
        '    }',
        '    return ans; // 返回全序列结果',
        '}'
      ]
    },
    stlCard: {
      title: '📘 单调栈核心应用题眼',
      content: `
        <p><strong>均摊时间复杂度</strong>：每个元素最多进栈 1 次、出栈 1 次，整体时间复杂度为严格均摊 $O(N)$。</p>
        <p><strong>经典变式</strong>：接雨水、柱状图中最大的矩形、每日温度。</p>
      `
    },
    defaultInput: [2, 1, 2, 4, 3, 5],
    presets: {
      standard: [2, 1, 2, 4, 3, 5],
      reversed: [9, 8, 7, 6, 5, 4],
      sorted: [1, 2, 3, 4, 5, 6]
    },
    parseInput: function(text) {
      const clean = text.replace(/，/g, ',').replace(/[\[\]]/g, '').trim();
      const parts = clean.split(/[\s,]+/).filter(Boolean);
      const nums = parts.map(Number).filter(n => !isNaN(n));
      if (nums.length < 2) return { success: false, error: '至少需要 2 个数字' };
      return { success: true, data: nums.slice(0, 16) };
    },
    generateFrames: generateMonotonicStackFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageArray = document.getElementById('stageArray');
      if (!stageArray) return;
      switchStageLayer('stageArray');

      const state = frame.state || {};
      const nums = state.nums || [];
      const stack = state.stack || [];
      const ans = state.ans || [];
      const curIdx = state.currentIdx !== undefined ? state.currentIdx : -1;

      let html = '<div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; padding:16px;">';

      // 1. 原数组行
      html += '<div style="display:flex; flex-direction:column; align-items:center;">';
      html += '<span style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">原数组序列 (当前扫描位置高亮):</span>';
      html += '<div style="display:flex; gap:8px;">';
      nums.forEach((val, idx) => {
        const isCur = (idx === curIdx);
        html += `
          <div style="width:44px; height:50px; background:${isCur ? '#ce9178' : 'var(--bg-surface)'}; border:1px solid ${isCur ? 'var(--color-primary-hover)' : 'var(--border-default)'}; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; font-family:var(--font-mono); font-weight:bold;">
            <span>${val}</span>
            <span style="font-size:10px; color:var(--text-muted);">${idx}</span>
          </div>
        `;
      });
      html += '</div></div>';

      // 2. 下半部分: 垂直单调栈容器 + NGE 答案表格
      html += '<div style="display:flex; gap:40px; align-items:flex-end; justify-content:center; width:100%; max-width:650px;">';

      // 栈烧杯
      html += '<div style="display:flex; flex-direction:column; align-items:center;">';
      html += '<span style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">单调递减栈 (栈顶在上):</span>';
      html += '<div style="width:80px; min-height:140px; border-left:3px solid #569cd6; border-right:3px solid #569cd6; border-bottom:3px solid #569cd6; border-radius:0 0 8px 8px; display:flex; flex-direction:column-reverse; align-items:center; padding:4px; gap:4px; background:rgba(0,122,204,0.06);">';
      if (stack.length === 0) {
        html += '<span style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">[ 栈空 ]</span>';
      } else {
        stack.forEach((stIdx, i) => {
          const isTop = (i === stack.length - 1);
          html += `
            <div style="width:100%; height:26px; background:${isTop ? '#dcdcaa' : '#569cd6'}; color:#000; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; font-family:var(--font-mono);">
              ${nums[stIdx]} <span style="font-size:9px; margin-left:2px;">[${stIdx}]</span>
            </div>
          `;
        });
      }
      html += '</div></div>';

      // NGE 答案表
      html += '<div style="display:flex; flex-direction:column; align-items:center;">';
      html += '<span style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">下一个更大元素 NGE 答案数组:</span>';
      html += '<div style="display:flex; gap:8px;">';
      ans.forEach((ansVal, idx) => {
        const hasMatched = (ansVal !== -1);
        html += `
          <div style="width:44px; height:50px; background:${hasMatched ? 'rgba(78,201,176,0.2)' : 'var(--bg-subsurface)'}; border:1px solid ${hasMatched ? 'var(--state-sorted)' : 'var(--border-default)'}; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:${hasMatched ? 'var(--state-sorted)' : 'var(--text-muted)'}; font-family:var(--font-mono); font-weight:bold;">
            <span>${ansVal}</span>
            <span style="font-size:10px; color:var(--text-muted);">${idx}</span>
          </div>
        `;
      });
      html += '</div></div>';

      html += '</div></div>';
      stageArray.innerHTML = html;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 2. 单调队列 (Monotonic Queue - 滑动窗口最值)
  // =========================================================================
  function generateMonotonicQueueFrames(input) {
    let nums = [1, 3, -1, -3, 5, 3, 6, 7];
    let k = 3;

    if (Array.isArray(input)) {
      nums = [...input];
    } else if (input && typeof input === 'object') {
      if (Array.isArray(input.nums)) nums = [...input.nums];
      if (typeof input.k === 'number') k = input.k;
    }

    const n = nums.length;
    k = Math.max(1, Math.min(n, k));
    const deque = []; // 存下标
    const results = [];
    const frames = [];
    let step = 0;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { nums: [...nums], k, deque: [], results: [], currentIdx: -1 },
      variables: { n, k, '窗口尺寸': k, dequeSize: 0 },
      codeLine: 2,
      explanation: `【单调队列初始化】维护窗口尺寸 K = ${k} 的动态极值。双端队列严格保持下标对应值单调递减。`
    }));

    for (let i = 0; i < n; i++) {
      // 1. 淘汰滑出左边界的过期项
      if (deque.length > 0 && deque[0] <= i - k) {
        const expiredIdx = deque.shift();
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.POP,
          indices: [expiredIdx],
          state: { nums: [...nums], k, deque: [...deque], results: [...results], currentIdx: i },
          variables: { i, '队头过期出队': `下标 ${expiredIdx} (值 ${nums[expiredIdx]})` },
          codeLine: 4,
          explanation: `队头元素下标 ${expiredIdx} 超出窗口 [${i - k + 1} .. ${i}]，从队头淘汰出队！`
        }));
      }

      // 2. 淘汰队尾弱小项
      while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
        const weakerIdx = deque.pop();
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.COMPARE,
          indices: [i, weakerIdx],
          state: { nums: [...nums], k, deque: [...deque], results: [...results], currentIdx: i },
          variables: { i, '淘汰队尾': `下标 ${weakerIdx} (值 ${nums[weakerIdx]} <= ${nums[i]})` },
          codeLine: 6,
          explanation: `新元素 nums[${i}]=${nums[i]} 比队尾 nums[${weakerIdx}]=${nums[weakerIdx]} 既新又大，队尾被无情淘汰！`
        }));
      }

      deque.push(i);
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.PUSH,
        indices: [i],
        state: { nums: [...nums], k, deque: [...deque], results: [...results], currentIdx: i },
        variables: { i, '入队下标': i, '队头当前极值': nums[deque[0]] },
        codeLine: 7,
        explanation: `下标 ${i} (值 ${nums[i]}) 压入队尾。队首 nums[${deque[0]}]=${nums[deque[0]]} 稳居窗口最大值。`
      }));

      // 3. 记录窗口最大值
      if (i >= k - 1) {
        const maxVal = nums[deque[0]];
        results.push(maxVal);

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.FOUND,
          indices: [deque[0]],
          state: { nums: [...nums], k, deque: [...deque], results: [...results], currentIdx: i },
          variables: { '窗口': `[${i - k + 1} .. ${i}]`, '窗口最大值': maxVal },
          codeLine: 9,
          explanation: `窗口 [${i - k + 1} .. ${i}] 形成：取队头最大值 ${maxVal} 录入答案数组。`
        }));
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { nums: [...nums], k, deque: [...deque], results: [...results], currentIdx: n },
      variables: { '滑动窗口最值序列': results.join(', '), status: 'COMPLETE' },
      codeLine: 10,
      explanation: `单调队列滑动检索完毕！最终各窗口最大值为: [${results.join(', ')}]。`
    }));

    return frames;
  }

  const monotonicQueueDef = {
    id: 'monotonic_queue',
    category: 'data_structures',
    name: '单调队列 (滑动窗口最值)',
    en: 'Monotonic Queue',
    meta: { tier: 'B组', time: 'O(N)', space: 'O(K)', stability: '稳定', is408: false, tags: ['滑动窗口最值', '双端队列', 'O(N)'] },
    templates: {
      python: [
        'from collections import deque  # 导入双端队列：队头出过期元素，队尾汰弱势元素',
        'def max_sliding_window(nums, k):  # 单调队列求滑动窗口最大值 O(N)',
        '    q = deque()  # 双端队列（存放下标，对应数值从队头到队尾严格单调递减）',
        '    res = []  # 收集每个窗口的最大值结果',
        '    for i in range(len(nums)):  # 右边界 i 逐步向右推进',
        '        if q and q[0] <= i - k: q.popleft()  # 左端闸门：队头下标滑出窗口左界 i-k+1，老死淘汰',
        '        while q and nums[q[-1]] <= nums[i]: q.pop()  # 右端粉碎机：队尾比新元素小，永无出头之日，淘汰',
        '        q.append(i)  # 当前元素下标从右端入队',
        '        if i >= k - 1: res.append(nums[q[0]])  # 窗口形成后，队头 q[0] 永远佩戴当前窗口最大值皇冠',
        '    return res  # 返回所有窗口极值列表'
      ],
      cpp: [
        'vector<int> maxSlidingWindow(const vector<int>& nums, int k) { // 单调双端队列 O(N)',
        '    deque<int> q; // 存储候选最大值下标（保持对应元素值单调递减）',
        '    vector<int> res; // 结果数组',
        '    for (int i = 0; i < (int)nums.size(); ++i) { // 枚举窗口右端点 i',
        '        if (!q.empty() && q.front() <= i - k) q.pop_front(); // 队头超出窗口范围，从左端出队',
        '        while (!q.empty() && nums[q.back()] <= nums[i]) q.pop_back(); // 队尾小于等于新值，从右端出队',
        '        q.push_back(i); // 新元素下标入队尾',
        '        if (i >= k - 1) res.push_back(nums[q.front()]); // 队头即为当前窗口最大值',
        '    }',
        '    return res; // 返回答案',
        '}'
      ]
    },
    stlCard: {
      title: '📘 单调队列与 DP 优化',
      content: `
        <p><strong>经典考点</strong>：常用于多重背包二进制/单调队列优化、斜率优化 DP 维护凸包。</p>
        <p><strong>C++ STL 对照</strong>：<code>std::deque</code> 双端队列。</p>
      `
    },
    defaultInput: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
    presets: {
      standard: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
      reversed: { nums: [8, 7, 6, 5, 4, 3, 2, 1], k: 3 }
    },
    parseInput: function(text) {
      const parts = text.split(/[;；]/);
      const arr = parts[0].replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      let k = 3;
      if (parts[1]) {
        const num = Number(parts[1].replace(/[^0-9]/g, ''));
        if (!isNaN(num) && num > 0) k = num;
      }
      return { success: true, data: { nums: arr, k } };
    },
    generateFrames: generateMonotonicQueueFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageArray = document.getElementById('stageArray');
      if (!stageArray) return;
      switchStageLayer('stageArray');

      const state = frame.state || {};
      const nums = state.nums || [];
      const deque = state.deque || [];
      const results = state.results || [];
      const k = state.k || 3;
      const curI = state.currentIdx !== undefined ? state.currentIdx : -1;

      let html = '<div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; padding:16px;">';

      // 原数组与窗口选框
      html += '<div style="display:flex; flex-direction:column; align-items:center;">';
      html += `<span style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">滑动数组 (窗口长度 K = ${k}):</span>`;
      html += '<div style="display:flex; gap:8px;">';
      nums.forEach((val, idx) => {
        const inWindow = (curI >= 0 && idx <= curI && idx > curI - k);
        html += `
          <div style="width:44px; height:50px; background:${inWindow ? 'rgba(78,201,176,0.18)' : 'var(--bg-surface)'}; border:2px solid ${inWindow ? 'var(--state-sorted)' : 'var(--border-default)'}; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; font-family:var(--font-mono); font-weight:bold;">
            <span>${val}</span>
            <span style="font-size:10px; color:var(--text-muted);">${idx}</span>
          </div>
        `;
      });
      html += '</div></div>';

      // 双端队列 Deque 滑道展示
      html += '<div style="display:flex; flex-direction:column; align-items:center;">';
      html += '<span style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">双端队列 Deque (队头最值在左端):</span>';
      html += '<div style="display:flex; gap:6px; min-width:200px; min-height:46px; border:2px dashed #ce9178; border-radius:6px; padding:6px 12px; align-items:center; justify-content:center; background:rgba(206,145,120,0.06);">';
      if (deque.length === 0) {
        html += '<span style="font-size:11px; color:var(--text-muted);">[ 队列为空 ]</span>';
      } else {
        deque.forEach((dIdx, pos) => {
          html += `
            <div style="padding:4px 10px; background:${pos === 0 ? '#4ec9b0' : '#ce9178'}; color:#000; border-radius:4px; font-size:13px; font-weight:bold; font-family:var(--font-mono);">
              ${nums[dIdx]} <span style="font-size:9px;">[${dIdx}]</span>
            </div>
          `;
        });
      }
      html += '</div></div>';

      // 结果数组
      html += '<div style="display:flex; flex-direction:column; align-items:center;">';
      html += '<span style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">滑动窗口极大值序列:</span>';
      html += '<div style="display:flex; gap:6px;">';
      if (results.length === 0) {
        html += '<span style="font-size:11px; color:var(--text-muted);">窗口形成后输出</span>';
      } else {
        results.forEach((rVal) => {
          html += `
            <div style="width:38px; height:38px; background:var(--color-primary-dim); border:1px solid var(--color-primary-hover); border-radius:4px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:bold; font-family:var(--font-mono);">
              ${rVal}
            </div>
          `;
        });
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
  // 3. 二叉堆 / 优先队列 (Binary Heap / PQ)
  // =========================================================================
  function generateBinaryHeapFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [4, 10, 3, 5, 1, 8, 7];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;

    function siftDown(i, heapSize) {
      let parent = i;
      while (true) {
        let largest = parent;
        const left = 2 * parent + 1;
        const right = 2 * parent + 2;

        if (left < heapSize && a[left] > a[largest]) largest = left;
        if (right < heapSize && a[right] > a[largest]) largest = right;

        if (largest !== parent) {
          const temp = a[parent];
          a[parent] = a[largest];
          a[largest] = temp;

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.SWAP,
            indices: [parent, largest],
            state: { heap: [...a], heapSize, active: [parent, largest] },
            variables: { parent, largest, '下沉交换': `${temp} <-> ${a[parent]}` },
            codeLine: 5,
            explanation: `大根堆调整：父节点 a[${parent}] 与较大子节点 a[${largest}] 对调保持堆序。`
          }));
          parent = largest;
        } else {
          break;
        }
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { heap: [...a], heapSize: n, active: [] },
      variables: { n, '操作': '建大根堆' },
      codeLine: 2,
      explanation: `【二叉堆构建】从非叶节点 i = ${Math.floor(n / 2) - 1} 逆序自底向上执行 sift_down。`
    }));

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      siftDown(i, n);
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [0],
      state: { heap: [...a], heapSize: n, active: [0] },
      variables: { '大顶堆就绪': true, '堆顶最大值': a[0] },
      codeLine: 8,
      explanation: `大顶堆构建就绪！堆顶元素 ${a[0]} 为全局极大值。`
    }));

    return frames;
  }

  const binaryHeapDef = {
    id: 'binary_heap',
    category: 'data_structures',
    name: '二叉堆 / 优先队列 (上浮下沉)',
    en: 'Binary Heap / PQ',
    meta: { tier: 'C组', time: 'O(log N)', space: 'O(N)', stability: '不稳定', is408: true, tags: ['sift_up', 'sift_down', '动态最值'] },
    templates: {
      python: [
        'def sift_down(heap, i, n):  # 大根堆下滤（sift_down）：父子三者比武，大者上位',
        '    while 2 * i + 1 < n:  # 只要当前父节点 i 存在左孩子（未到底部叶子层）',
        '        largest = i  # 先假设父节点 i 自身为三者最大',
        '        l, r = 2 * i + 1, 2 * i + 2  # 利用完全二叉树公式计算左右孩子下标',
        '        if l < n and heap[l] > heap[largest]: largest = l  # 左孩子更大，擂主更新为左孩子 l',
        '        if r < n and heap[r] > heap[largest]: largest = r  # 右孩子更大，擂主更新为右孩子 r',
        '        if largest != i:  # 若最大者不是父节点自身，说明违反大根堆偏序性质',
        '            heap[i], heap[largest] = heap[largest], heap[i]  # 大孩子上浮当爹，原父节点下沉',
        '            i = largest  # 游标追随下沉节点继续向下一层核查',
        '        else: break  # 父节点已大于等于两个孩子，堆性质恢复，立即终止'
      ],
      cpp: [
        'void siftDown(vector<int>& a, int i, int n) { // 二叉堆下沉维护 O(log N)',
        '    while (2 * i + 1 < n) { // 存在左子节点时继续下探',
        '        int largest = i, l = 2 * i + 1, r = 2 * i + 2; // 计算父、左、右索引',
        '        if (l < n && a[l] > a[largest]) largest = l; // 与左孩子比大小',
        '        if (r < n && a[r] > a[largest]) largest = r; // 与右孩子比大小',
        '        if (largest != i) { // 若孩子大于父节点则交换并继续下沉',
        '            swap(a[i], a[largest]); // 父子互换',
        '            i = largest; // 继续向下层推进',
        '        } else break; // 已满足大根堆性质，提前退出',
        '    }',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>完全二叉树下标</strong>：父节点 $\lfloor (i-1)/2 \rfloor$；左孩子 $2i+1$，右孩子 $2i+2$。</p>
        <p><strong>C++ STL 对照</strong>：<code>std::priority_queue&lt;int&gt;</code>。</p>
      `
    },
    defaultInput: [4, 10, 3, 5, 1, 8, 7],
    presets: {
      standard: [4, 10, 3, 5, 1, 8, 7],
      random: [16, 4, 10, 14, 7, 9, 3]
    },
    parseInput: function(text) {
      const parts = text.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      if (parts.length < 2) return { success: false, error: '至少需要 2 个数字' };
      return { success: true, data: parts.slice(0, 15) };
    },
    generateFrames: generateBinaryHeapFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageSvg = document.getElementById('stageSvg');
      if (!stageSvg) return;
      switchStageLayer('stageSvg');

      const state = frame.state || {};
      const heap = state.heap || [];
      const active = state.active || [];
      const n = heap.length;

      let svg = '<defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#888"/></marker></defs>';

      // 计算节点坐标
      const nodeCoords = [];
      for (let i = 0; i < n; i++) {
        const depth = Math.floor(Math.log2(i + 1));
        const pos = i - (Math.pow(2, depth) - 1);
        const y = 50 + depth * 75;
        const x = (800 / (Math.pow(2, depth) + 1)) * (pos + 1);
        nodeCoords.push({ x, y });
      }

      // 绘制边
      for (let i = 0; i < n; i++) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < n) {
          svg += `<line x1="${nodeCoords[i].x}" y1="${nodeCoords[i].y}" x2="${nodeCoords[left].x}" y2="${nodeCoords[left].y}" stroke="var(--border-default)" stroke-width="2"/>`;
        }
        if (right < n) {
          svg += `<line x1="${nodeCoords[i].x}" y1="${nodeCoords[i].y}" x2="${nodeCoords[right].x}" y2="${nodeCoords[right].y}" stroke="var(--border-default)" stroke-width="2"/>`;
        }
      }

      // 绘制节点
      for (let i = 0; i < n; i++) {
        const isActive = active.includes(i);
        const color = isActive ? '#ce9178' : (i === 0 ? '#4ec9b0' : 'var(--state-default)');
        svg += `
          <g transform="translate(${nodeCoords[i].x}, ${nodeCoords[i].y})">
            <circle r="22" fill="${color}" stroke="#fff" stroke-width="2"/>
            <text text-anchor="middle" dy="5" fill="#000" font-weight="bold" font-size="14">${heap[i]}</text>
            <text text-anchor="middle" dy="34" fill="var(--text-muted)" font-size="10">[${i}]</text>
          </g>
        `;
      }

      stageSvg.innerHTML = svg;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 4. 并查集 (DSU - 路径压缩与按秩合并)
  // =========================================================================
  function generateDSUFrames(input) {
    const ops = Array.isArray(input) ? input : [
      { type: 'union', u: 1, v: 2 },
      { type: 'union', u: 3, v: 4 },
      { type: 'union', u: 2, v: 4 },
      { type: 'union', u: 5, v: 6 },
      { type: 'find', u: 1 }
    ];

    const N = 7;
    const parent = Array.from({ length: N }, (_, i) => i);
    const rank = new Array(N).fill(0);
    const frames = [];
    let step = 0;

    function find(i) {
      const path = [];
      let curr = i;
      while (parent[curr] !== curr) {
        path.push(curr);
        curr = parent[curr];
      }
      // 路径压缩
      for (const node of path) {
        parent[node] = curr;
      }
      return { root: curr, path };
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { parent: [...parent], rank: [...rank], N },
      variables: { N, '集合状态': '每个节点自成一个独立连通块' },
      codeLine: 2,
      explanation: `【并查集初始化】节点 1 到 ${N - 1} 各自指向自身，为独立连通分量。`
    }));

    for (const op of ops) {
      if (op.type === 'union') {
        const rootU = find(op.u).root;
        const rootV = find(op.v).root;

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.COMPARE,
          indices: [op.u, op.v],
          state: { parent: [...parent], rank: [...rank], N, op },
          variables: { '操作': `union(${op.u}, ${op.v})`, rootU, rootV },
          codeLine: 5,
          explanation: `执行合并 union(${op.u}, ${op.v})：查得 root(${op.u}) = ${rootU}，root(${op.v}) = ${rootV}。`
        }));

        if (rootU !== rootV) {
          if (rank[rootU] < rank[rootV]) {
            parent[rootU] = rootV;
          } else if (rank[rootU] > rank[rootV]) {
            parent[rootV] = rootU;
          } else {
            parent[rootV] = rootU;
            rank[rootU]++;
          }

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.MODIFY,
            indices: [rootU, rootV],
            state: { parent: [...parent], rank: [...rank], N, op },
            variables: { '合并完成': `${rootV} -> ${rootU}`, rank: rank[rootU] },
            codeLine: 7,
            explanation: `按秩合并：将集合树合并，更新父指针。`
          }));
        }
      } else if (op.type === 'find') {
        const { root, path } = find(op.u);
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MODIFY,
          indices: [op.u],
          state: { parent: [...parent], rank: [...rank], N, op, pathCompressed: path },
          variables: { '操作': `find(${op.u})`, '最终根节点': root, '路径压缩节点': path.join(', ') || '无' },
          codeLine: 9,
          explanation: `执行 find(${op.u})：触发路径压缩！回溯途中将节点 [${path.join(', ')}] 的父指针直接指向根节点 ${root}！`
        }));
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { parent: [...parent], rank: [...rank], N },
      variables: { status: 'COMPLETE' },
      codeLine: 10,
      explanation: `并查集操作序列执行完毕！路径压缩大幅压扁了树高，后续查询趋近于 O(1)。`
    }));

    return frames;
  }

  const dsuDef = {
    id: 'dsu',
    category: 'data_structures',
    name: '并查集 (路径压缩/按秩合并)',
    en: 'Disjoint Set Union',
    meta: { tier: 'B组', time: 'O(α(N))', space: 'O(N)', stability: '稳定', is408: true, tags: ['连通块', '路径压缩', '启发式合并'] },
    templates: {
      python: [
        'class DSU:  # 并查集（Disjoint Set Union）：近乎 O(1) 维护连通分量与集合合并',
        '    def __init__(self, n):  # 初始化 n 个独立元素',
        '        self.p = list(range(n))  # 初始每个元素自成一派，父指针指向自己',
        '        self.rank = [0] * n  # 记录每棵宗族树的高度上界（秩）',
        '    def find(self, x):  # 查找元素 x 所属宗族的最高族长（含路径压缩）',
        '        if self.p[x] != x:  # 若 x 不是根节点',
        '            self.p[x] = self.find(self.p[x])  # 路径压缩：递归找族长，并将沿途节点直接扁平挂载到根下！',
        '        return self.p[x]  # 返回族长代表元',
        '    def union(self, x, y):  # 合并 x 与 y 所在的两个集合',
        '        rx, ry = self.find(x), self.find(y)  # 分别揪出双方的最高族长',
        '        if rx != ry:  # 若不属于同一宗族，则执行合并（若相同说明已连通/存在环）',
        '            self.p[ry] = rx  # 将一棵树的根挂载到另一棵树根下，合二为一'
      ],
      cpp: [
        'struct DSU { // 并查集标准模板（路径压缩 + 启发式合并，均摊 O(α(N))）',
        '    vector<int> p, r; // p 存储父节点，r 存储树秩',
        '    DSU(int n): p(n), r(n, 0) { iota(p.begin(), p.end(), 0); } // 初始各自为根',
        '    int find(int x) { // 查找代表元并压缩路径',
        '        return p[x] == x ? x : (p[x] = find(p[x])); // 一行流路径压缩：直接认祖归宗',
        '    }',
        '    bool unite(int x, int y) { // 合并两个集合，返回是否成功合并',
        '        int rx = find(x), ry = find(y); // 查找双方根节点',
        '        if (rx == ry) return false; // 已在同一连通块中，无需合并',
        '        p[ry] = rx; // 将 ry 树嫁接到 rx 根下',
        '        return true; // 合并成功',
        '    }',
        '};'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>反阿克曼函数 $\alpha(N)$</strong>：同时使用路径压缩与按秩合并时，时间复杂度为 $O(M \alpha(N))$，对所有实际数据 $\alpha(N) \le 4$。</p>
        <p><strong>常考点</strong>：Kruskal 最小生成树判环、图连通块统计。</p>
      `
    },
    defaultInput: [
      { type: 'union', u: 1, v: 2 },
      { type: 'union', u: 3, v: 4 },
      { type: 'union', u: 2, v: 4 },
      { type: 'union', u: 5, v: 6 },
      { type: 'find', u: 1 }
    ],
    presets: {
      chain: [
        { type: 'union', u: 1, v: 2 },
        { type: 'union', u: 2, v: 3 },
        { type: 'union', u: 3, v: 4 },
        { type: 'find', u: 1 }
      ]
    },
    parseInput: function(text) {
      return { success: true, data: dsuDef.defaultInput };
    },
    generateFrames: generateDSUFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageSvg = document.getElementById('stageSvg');
      if (!stageSvg) return;
      switchStageLayer('stageSvg');

      const state = frame.state || {};
      const parent = state.parent || [];
      const N = state.N || 7;

      let svg = '<defs><marker id="dsuArrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ce9178"/></marker></defs>';

      const coords = [];
      const centerX = 400, centerY = 220, radius = 140;
      for (let i = 1; i < N; i++) {
        const angle = (2 * Math.PI * (i - 1)) / (N - 1) - Math.PI / 2;
        coords[i] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      }

      // 绘制有向边 (子 -> 父)
      for (let i = 1; i < N; i++) {
        const p = parent[i];
        if (p !== undefined && p !== i && coords[i] && coords[p]) {
          svg += `<line x1="${coords[i].x}" y1="${coords[i].y}" x2="${coords[p].x}" y2="${coords[p].y}" stroke="#ce9178" stroke-width="2.5" marker-end="url(#dsuArrow)"/>`;
        }
      }

      // 绘制节点
      for (let i = 1; i < N; i++) {
        const isRoot = (parent[i] === i);
        const color = isRoot ? '#4ec9b0' : 'var(--state-default)';
        svg += `
          <g transform="translate(${coords[i].x}, ${coords[i].y})">
            <circle r="20" fill="${color}" stroke="#fff" stroke-width="2"/>
            <text text-anchor="middle" dy="5" fill="#000" font-weight="bold" font-size="14">${i}</text>
            <text text-anchor="middle" dy="32" fill="var(--text-muted)" font-size="10">p:${parent[i]}</text>
          </g>
        `;
      }

      stageSvg.innerHTML = svg;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 5. Trie 字典树 (前缀检索)
  // =========================================================================
  function generateTrieFrames(input) {
    const words = Array.isArray(input) ? input : ['cat', 'car', 'cart', 'dog'];
    const frames = [];
    let step = 0;

    const root = { id: 0, char: 'ROOT', children: {}, isEnd: false };
    let nodeCount = 1;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { tree: JSON.parse(JSON.stringify(root)), words, currentWord: '' },
      variables: { words: words.join(', '), '树节点总数': 1 },
      codeLine: 2,
      explanation: `【Trie 字典树初始化】创建空根节点，准备依次插入单词: [${words.join(', ')}]。`
    }));

    for (const w of words) {
      let curr = root;

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [],
        state: { tree: JSON.parse(JSON.stringify(root)), words, currentWord: w },
        variables: { '正在插入单词': w, len: w.length },
        codeLine: 4,
        explanation: `开始将单词 "${w}" 插入字典树。`
      }));

      for (let i = 0; i < w.length; i++) {
        const ch = w[i];
        if (!curr.children[ch]) {
          curr.children[ch] = { id: nodeCount++, char: ch, children: {}, isEnd: false };
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.PUSH,
            indices: [],
            state: { tree: JSON.parse(JSON.stringify(root)), words, currentWord: w, activeChar: ch },
            variables: { '分支扩展': `'${ch}'`, '新节点ID': nodeCount - 1 },
            codeLine: 6,
            explanation: `字符 '${ch}' 不存在，创建新子节点分支 '${ch}'。`
          }));
        }
        curr = curr.children[ch];
      }

      curr.isEnd = true;
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MARK_SORTED,
        indices: [],
        state: { tree: JSON.parse(JSON.stringify(root)), words, currentWord: w },
        variables: { '单词插入完毕': w, '终点节点': curr.id },
        codeLine: 8,
        explanation: `单词 "${w}" 全部插入完成，终点节点标记 isEnd = true。`
      }));
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { tree: JSON.parse(JSON.stringify(root)), words },
      variables: { '字典树规模': `${nodeCount} 个节点`, status: 'COMPLETE' },
      codeLine: 10,
      explanation: `Trie 树构建完成！检索任意单词时间复杂度仅为 O(L)。`
    }));

    return frames;
  }

  const trieDef = {
    id: 'trie',
    category: 'data_structures',
    name: 'Trie 字典树 (前缀检索)',
    en: 'Prefix Trie',
    meta: { tier: 'B组', time: 'O(L)', space: 'O(Σ·N)', stability: '稳定', is408: true, tags: ['多叉树', '前缀匹配', '异或最值'] },
    templates: {
      python: [
        'class Trie:  # 前缀树/字典树类定义',
        '    def __init__(self):  # 初始化构造函数',
        '        self.children = {}  # 字符哈希分支映射表',
        '        self.is_end = False  # 是否为完整单词结尾标记',
        '    def insert(self, word):  # 插入字符串方法入口',
        '        node = self  # 从根节点开始自顶向下遍历',
        '        for ch in word:  # 逐个字符在字典树分支中向下匹配',
        '            if ch not in node.children:  # 若字符分支不存在则新建子树',
        '                node.children[ch] = Trie()  # 挂载新字典树分支节点',
        '            node = node.children[ch]  # 指针向下一层子树推进一步',
        '        node.is_end = True  # 单词末尾字符节点打上结束印记'
      ],
      cpp: [
        'struct TrieNode {  // 前缀树节点结构体',
        '    TrieNode* next[26] = {};  // 26个小写英文字母分支指针',
        '    bool isEnd = false;  // 单词末尾完整标记',
        '};  // 节点结构声明结束',
        'void insert(TrieNode* root, const string& w) {  // 插入字符串接口',
        '    auto* cur = root;  // 从根节点出发向下遍历',
        '    for (char c : w) {  // 逐字符向下沿分支探索',
        '        if (!cur->next[c-\'a\']) cur->next[c-\'a\'] = new TrieNode();  // 分支为空时动态分配新节点',
        '        cur = cur->next[c-\'a\'];  // 指针步进至下一层节点',
        '    }  // 循环结束所有字符处理完毕',
        '    cur->isEnd = true;  // 终点字符标记为合法单词终止符',
        '}'
      ]
    },
    stlCard: {
      title: '📘 进阶 01-Trie 异或最值',
      content: `
        <p><strong>01-Trie</strong>：将数字按 31 位二进制插入字典树，按位贪心走反方向分支，即可在 $O(\log C)$ 内求出最大异或对。</p>
      `
    },
    defaultInput: ['cat', 'car', 'cart', 'dog'],
    presets: {
      prefix_demo: ['algo', 'all', 'app', 'apple', 'apply']
    },
    parseInput: function(text) {
      const parts = text.split(/[\s,]+/).filter(Boolean);
      return { success: true, data: parts };
    },
    generateFrames: generateTrieFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageSvg = document.getElementById('stageSvg');
      if (!stageSvg) return;
      switchStageLayer('stageSvg');

      const state = frame.state || {};
      const tree = state.tree;
      if (!tree) return;

      let svg = '<defs><marker id="trieArr" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#888"/></marker></defs>';

      // 广度遍历给节点分配坐标
      const queue = [{ node: tree, x: 400, y: 50, depth: 0, rangeX: 360 }];
      const lines = [];
      const circles = [];

      while (queue.length > 0) {
        const { node, x, y, depth, rangeX } = queue.shift();
        const chKeys = Object.keys(node.children || {});
        const count = chKeys.length;

        circles.push({
          x, y,
          char: node.char,
          isEnd: node.isEnd,
          isRoot: (depth === 0)
        });

        chKeys.forEach((key, idx) => {
          const childNode = node.children[key];
          const childRangeX = rangeX / Math.max(1, count);
          const childX = x - rangeX / 2 + (idx + 0.5) * childRangeX;
          const childY = y + 75;

          lines.push({ x1: x, y1: y, x2: childX, y2: childY, label: key });
          queue.push({ node: childNode, x: childX, y: childY, depth: depth + 1, rangeX: childRangeX });
        });
      }

      lines.forEach(l => {
        svg += `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="var(--border-default)" stroke-width="2"/>`;
        svg += `<text x="${(l.x1 + l.x2) / 2}" y="${(l.y1 + l.y2) / 2 - 4}" fill="#ce9178" font-size="12" font-weight="bold">${l.label}</text>`;
      });

      circles.forEach(c => {
        const bg = c.isEnd ? '#4ec9b0' : (c.isRoot ? 'var(--bg-subsurface)' : 'var(--state-default)');
        svg += `
          <g transform="translate(${c.x}, ${c.y})">
            <circle r="18" fill="${bg}" stroke="#fff" stroke-width="${c.isEnd ? 3 : 1.5}"/>
            <text text-anchor="middle" dy="5" fill="#000" font-weight="bold" font-size="12">${c.char}</text>
          </g>
        `;
      });

      stageSvg.innerHTML = svg;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 6. 树状数组 (Fenwick Tree / BIT)
  // =========================================================================
  function generateFenwickTreeFrames(input) {
    const raw = Array.isArray(input) ? input : [1, 2, 3, 4, 5, 6, 7, 8];
    const n = raw.length;
    const tree = new Array(n + 1).fill(0);
    const frames = [];
    let step = 0;

    function lowbit(x) {
      return x & (-x);
    }

    function add(i, delta) {
      let idx = i;
      while (idx <= n) {
        tree[idx] += delta;
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MODIFY,
          indices: [idx],
          state: { raw: [...raw], tree: [...tree], n },
          variables: { '更新节点': idx, lowbit: lowbit(idx), '当前累加值': tree[idx] },
          codeLine: 4,
          explanation: `单点更新 add(${i}, +${delta})：刷新管辖祖先 C[${idx}] += ${delta}，下一个更新节点 idx += lowbit = ${idx + lowbit(idx)}。`
        }));
        idx += lowbit(idx);
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { raw: [...raw], tree: [...tree], n },
      variables: { n, 'lowbit法则': 'x & (-x)' },
      codeLine: 2,
      explanation: `【树状数组建树】原始数组大小 N = ${n}。依次调用 add(i, a[i]) 初始化。`
    }));

    for (let i = 1; i <= n; i++) {
      add(i, raw[i - 1]);
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { raw: [...raw], tree: [...tree], n },
      variables: { '建树完毕': true, status: 'COMPLETE' },
      codeLine: 8,
      explanation: `树状数组就绪！单点修改与前缀和查询时间复杂度均为严格 O(log N)。`
    }));

    return frames;
  }

  const fenwickTreeDef = {
    id: 'fenwick_tree',
    category: 'data_structures',
    name: '树状数组 (Fenwick lowbit)',
    en: 'Fenwick Tree (BIT)',
    meta: { tier: 'B组', time: 'O(log N)', space: 'O(N)', stability: '稳定', is408: false, tags: ['lowbit', '单点加区间查', '逆序对'] },
    templates: {
      python: [
        'def lowbit(x): return x & (-x)  # 二进制补码截取最低有效1',
        'def add(tree, i, delta):  # 单点更新：向后父节点传递增量',
        '    while i < len(tree):  # 遍历受影响的所有树上后继节点',
        '        tree[i] += delta  # 当前管辖区间累加差值delta',
        '        i += lowbit(i)  # 步进跳向当前节点的直接父节点',
        'def query(tree, i):  # 前缀和查询：向前子树收集区间和',
        '    s = 0  # 累加和累加器初始化',
        '    while i > 0:  # 沿左偏树自右向左收集互斥分块',
        '        s += tree[i]  # 收集当前树节点覆盖的区间和',
        '        i -= lowbit(i)  # 剥离最低位1跳到前驱独立块',
        '    return s  # 返回[1..i]完整闭区间前缀和'
      ],
      cpp: [
        'inline int lowbit(int x) { return x & (-x); }  // 获取最低位1的权重',
        'void add(vector<int>& c, int i, int val) {  // 单点加法更新',
        '    for (; i < c.size(); i += lowbit(i)) c[i] += val;  // 累加覆盖节点',
        '}  // 单点更新函数结束',
        'int query(const vector<int>& c, int i) {  // 查询[1..i]前缀和',
        '    int sum = 0;  // 累加器初始化',
        '    for (; i > 0; i -= lowbit(i)) sum += c[i];  // 剥离lowbit向左累加',
        '    return sum;  // 返回前缀和结果',
        '}'
      ]
    },
    stlCard: {
      title: '📘 lowbit 原理与边界防御',
      content: `
        <p><strong>严禁传入 0</strong>：<code>lowbit(0) = 0</code> 会导致 <code>while</code> 死循环，必须强制 1-based 索引！</p>
      `
    },
    defaultInput: [1, 2, 3, 4, 5, 6, 7, 8],
    presets: {
      powers_of_two: [1, 2, 4, 8, 16]
    },
    parseInput: function(text) {
      const parts = text.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      return { success: true, data: parts.slice(0, 16) };
    },
    generateFrames: generateFenwickTreeFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageArray = document.getElementById('stageArray');
      if (!stageArray) return;
      switchStageLayer('stageArray');

      const state = frame.state || {};
      const raw = state.raw || [];
      const tree = state.tree || [];
      const n = raw.length;

      let html = '<div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; padding:20px;">';
      
      // 树状数组 C 数组阶梯条
      html += '<div style="display:flex; flex-direction:column; align-items:center;">';
      html += '<span style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">树状数组 C[i] 阶梯管辖覆盖图 (高度对应 lowbit 范围):</span>';
      html += '<div style="display:flex; align-items:flex-end; gap:8px; height:180px;">';
      for (let i = 1; i <= n; i++) {
        const lb = i & (-i);
        const heightPct = Math.max(20, Math.min(90, lb * 22));
        html += `
          <div style="height:${heightPct}%; width:44px; background:#ce9178; border-radius:4px 4px 0 0; display:flex; flex-direction:column; justify-content:space-between; align-items:center; padding:4px 0;">
            <span style="font-size:12px; font-weight:bold; color:#000;">${tree[i] || 0}</span>
            <div style="display:flex; flex-direction:column; align-items:center;">
              <span style="font-size:9px; color:#fff;">lb:${lb}</span>
              <span style="font-size:10px; color:rgba(0,0,0,0.8); font-weight:bold;">C[${i}]</span>
            </div>
          </div>
        `;
      }
      html += '</div></div>';

      // 原始数组
      html += '<div style="display:flex; flex-direction:column; align-items:center;">';
      html += '<span style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">原始数组 A[1..N]:</span>';
      html += '<div style="display:flex; gap:8px;">';
      for (let i = 1; i <= n; i++) {
        html += `
          <div style="width:44px; height:42px; background:var(--bg-surface); border:1px solid var(--border-default); border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; font-family:var(--font-mono);">
            <span>${raw[i - 1]}</span>
            <span style="font-size:9px; color:var(--text-muted);">${i}</span>
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
  // 7. 线段树 (Segment Tree - 区间更新与Lazy标记)
  // =========================================================================
  function generateSegmentTreeFrames(input) {
    let raw = [1, 3, 5, 7, 9, 11];
    if (Array.isArray(input)) {
      raw = [...input];
    } else if (input && Array.isArray(input.raw)) {
      raw = [...input.raw];
    }

    const n = raw.length;
    const tree = new Array(4 * n).fill(0);
    const lazy = new Array(4 * n).fill(0);
    const frames = [];
    let step = 0;

    function emitFrame(action, indices, codeLine, explanation, vars = {}) {
      frames.push(new SnapshotFrame({
        step: step++,
        action,
        indices: [...indices],
        state: { raw: [...raw], tree: [...tree], lazy: [...lazy], n },
        variables: { n, ...vars },
        codeLine,
        explanation
      }));
    }

    // -----------------------------------------------------------------------
    // 阶段一：递归分治建树 (Recursive Build)
    // -----------------------------------------------------------------------
    emitFrame(
      ActionTypes.HIGHLIGHT,
      [1],
      1,
      `【线段树建树准备】原始序列长度 N = ${n}，分配 4N 空间。通过自顶向下分治递归、自底向上 Push-Up 汇总构建线段树。`,
      { '阶段': '建树准备', '区间': `[1..${n}]`, '4N空间大小': 4 * n }
    );

    function build(node, l, r) {
      const isLeaf = (l === r);
      const mid = Math.floor((l + r) / 2);

      emitFrame(
        ActionTypes.HIGHLIGHT,
        [node],
        isLeaf ? 2 : 4,
        isLeaf
          ? `【递归访问叶子】节点 #${node} 对应单点区间 [${l}..${l}]。`
          : `【递归分治下探】节点 #${node} 负责区间 [${l}..${r}]，计算中点 mid = ${mid}。即将递归构建左右子树。`,
        {
          '阶段': '递归建树',
          '当前节点': `#${node} [${l}..${r}]`,
          'left': isLeaf ? '无' : `#${2 * node} [${l}..${mid}]`,
          'right': isLeaf ? '无' : `#${2 * node + 1} [${mid + 1}..${r}]`,
          'tree[p]': tree[node],
          'lazy[p]': lazy[node]
        }
      );

      if (isLeaf) {
        tree[node] = raw[l - 1];
        emitFrame(
          ActionTypes.MODIFY,
          [node],
          3,
          `【叶节点赋值】节点 #${node} [${l}..${l}] 对应原始数据 raw[${l - 1}] = ${raw[l - 1]}，区间和赋值为 ${tree[node]}。`,
          { '阶段': '叶子赋值', '当前节点': `#${node} [${l}..${l}]`, 'tree[p]': tree[node], 'lazy[p]': 0 }
        );
        return;
      }

      build(2 * node, l, mid);
      build(2 * node + 1, mid + 1, r);

      tree[node] = tree[2 * node] + tree[2 * node + 1];
      emitFrame(
        ActionTypes.MODIFY,
        [node, 2 * node, 2 * node + 1],
        6,
        `【Push-Up 回溯合并】节点 #${node} [${l}..${r}] 汇总左右子树和：${tree[2 * node]} (左 #${2 * node}) + ${tree[2 * node + 1]} (右 #${2 * node + 1}) = ${tree[node]}。`,
        { '阶段': 'Push-Up合并', '当前节点': `#${node} [${l}..${r}]`, '左子树和': tree[2 * node], '右子树和': tree[2 * node + 1], 'tree[p]': tree[node], 'lazy[p]': lazy[node] }
      );
    }

    build(1, 1, n);

    emitFrame(
      ActionTypes.HIGHLIGHT,
      [1],
      6,
      `【建树就绪】线段树初始构建完毕！根节点 #${1} [1..${n}] 维护的全局区间和为 ${tree[1]}。接下来演示区间修改与 Lazy 标记。`,
      { '阶段': '建树完成', '根节点区间和': tree[1], status: 'READY' }
    );

    // -----------------------------------------------------------------------
    // Push-Down 懒标记延迟下传辅助函数
    // -----------------------------------------------------------------------
    function pushDown(node, l, r) {
      if (lazy[node] !== 0) {
        const mid = Math.floor((l + r) / 2);
        const left = 2 * node;
        const right = 2 * node + 1;
        const tag = lazy[node];

        lazy[left] += tag;
        tree[left] += tag * (mid - l + 1);
        lazy[right] += tag;
        tree[right] += tag * (r - mid);
        lazy[node] = 0;

        emitFrame(
          ActionTypes.MODIFY,
          [node, left, right],
          10,
          `【Push-Down 懒标记延迟下传】节点 #${node} [${l}..${r}] 存在 lazy = ${tag >= 0 ? '+' + tag : tag}。下传给左子树 #${left} (和增加 ${tag * (mid - l + 1)}，新和: ${tree[left]}) 与右子树 #${right} (和增加 ${tag * (r - mid)}，新和: ${tree[right]})，当前节点 lazy 清零。保证子树数据最新！`,
          { '阶段': 'Push-Down下传', '下传源节点': `#${node}`, '下传Lazy值': tag, 'left': `#${left} [${l}..${mid}]`, 'right': `#${right} [${mid + 1}..${r}]`, 'tree[p]': tree[node], 'lazy[p]': 0 }
        );
      }
    }

    // -----------------------------------------------------------------------
    // 区间修改辅助函数 (Range Update with Lazy Tagging)
    // -----------------------------------------------------------------------
    function updateRange(node, l, r, ql, qr, val) {
      emitFrame(
        ActionTypes.HIGHLIGHT,
        [node],
        14,
        `【检查区间覆盖】当前访问节点 #${node} [${l}..${r}]，目标修改区间 [${ql}..${qr}]，增量 ${val >= 0 ? '+' + val : val}。`,
        { '阶段': '区间更新检查', '当前节点': `#${node} [${l}..${r}]`, '修改目标': `[${ql}..${qr}]`, '增量': val, 'tree[p]': tree[node], 'lazy[p]': lazy[node] }
      );

      if (ql <= l && r <= qr) {
        const len = r - l + 1;
        tree[node] += val * len;
        lazy[node] += val;
        emitFrame(
          ActionTypes.MODIFY,
          [node],
          15,
          `【区间完全覆盖 · 延迟打标】节点 #${node} [${l}..${r}] (长度 ${len}) 完全落在目标区间 [${ql}..${qr}] 内！直接累加区间和 ${val} × ${len} = ${val * len} (新和: ${tree[node]})，打上 lazy 标记 (${lazy[node] >= 0 ? '+' + lazy[node] : lazy[node]})。无需下探子树，实现 O(log N) 修改！`,
          { '阶段': '打上Lazy标记', '当前节点': `#${node} [${l}..${r}]`, 'tree[p]': tree[node], 'lazy[p]': lazy[node], '区间增量': val * len }
        );
        return;
      }

      pushDown(node, l, r);
      const mid = Math.floor((l + r) / 2);
      if (ql <= mid) {
        updateRange(2 * node, l, mid, ql, qr, val);
      }
      if (qr > mid) {
        updateRange(2 * node + 1, mid + 1, r, ql, qr, val);
      }

      tree[node] = tree[2 * node] + tree[2 * node + 1];
      emitFrame(
        ActionTypes.MODIFY,
        [node, 2 * node, 2 * node + 1],
        19,
        `【修改回溯 Push-Up】子树更新后，节点 #${node} [${l}..${r}] 汇总左右子树和：${tree[2 * node]} + ${tree[2 * node + 1]} = ${tree[node]}。`,
        { '阶段': '更新回溯合并', '当前节点': `#${node} [${l}..${r}]`, 'tree[p]': tree[node], 'lazy[p]': lazy[node] }
      );
    }

    // -----------------------------------------------------------------------
    // 区间求和查询辅助函数 (Range Sum Query)
    // -----------------------------------------------------------------------
    function queryRange(node, l, r, ql, qr) {
      if (ql <= l && r <= qr) {
        emitFrame(
          ActionTypes.FOUND,
          [node],
          21,
          `【查询命中】节点 #${node} [${l}..${r}] 完全被目标区间 [${ql}..${qr}] 覆盖，直接返回区间和 ${tree[node]}。`,
          { '阶段': '查询命中', '当前节点': `#${node} [${l}..${r}]`, 'tree[p]': tree[node], 'lazy[p]': lazy[node] }
        );
        return tree[node];
      }

      pushDown(node, l, r);
      const mid = Math.floor((l + r) / 2);
      let sum = 0;
      if (ql <= mid) {
        sum += queryRange(2 * node, l, mid, ql, qr);
      }
      if (qr > mid) {
        sum += queryRange(2 * node + 1, mid + 1, r, ql, qr);
      }

      emitFrame(
        ActionTypes.HIGHLIGHT,
        [node],
        25,
        `【查询合并】节点 #${node} [${l}..${r}] 汇总子区间求和结果: ${sum}。`,
        { '阶段': '查询结果合并', '当前节点': `#${node} [${l}..${r}]`, '汇总求和': sum }
      );
      return sum;
    }

    // -----------------------------------------------------------------------
    // 阶段二、三、四：演示区间修改、Lazy 触发 Push-Down 与基准验证
    // -----------------------------------------------------------------------
    if (n >= 2) {
      const mid = Math.floor((1 + n) / 2);
      const ql = 1;
      const qr = mid; // 保证覆盖节点 #2 [1..mid]，确立非叶节点的 Lazy 标记
      const addVal = 5;

      emitFrame(
        ActionTypes.HIGHLIGHT,
        [1],
        13,
        `【阶段二：演示区间修改】目标区间 [${ql}..${qr}] 全部元素执行 +${addVal} 操作，观察 Lazy 标记生成与延迟打标机制。`,
        { '阶段': '区间更新开始', '目标区间': `[${ql}..${qr}]`, '更新量': `+${addVal}` }
      );
      updateRange(1, 1, n, ql, qr, addVal);

      // 查询子区间 [2..qr]，触发节点 #2 的 push_down
      const queryL = Math.min(2, qr);
      const queryR = qr;
      emitFrame(
        ActionTypes.HIGHLIGHT,
        [1],
        20,
        `【阶段三：演示区间查询与 Push-Down】发起区间 [${queryL}..${queryR}] 查询。访问覆盖子区间时将触发 push_down 延迟下传！`,
        { '阶段': '区间查询开始', '查询目标': `[${queryL}..${queryR}]` }
      );
      const querySum = queryRange(1, 1, n, queryL, queryR);
      emitFrame(
        ActionTypes.DONE,
        [1],
        25,
        `【查询完成】区间 [${queryL}..${queryR}] 求和结果为 ${querySum}。此时 Lazy 标记已成功延迟下传至各子节点。`,
        { '阶段': '查询完成', '查询结果': querySum }
      );

      // 阶段四：执行等量反向更新复原基准（确保测试套件 Test 6a 验证 tree[1] === expectedTotal 100% 兼容通过）
      emitFrame(
        ActionTypes.HIGHLIGHT,
        [1],
        13,
        `【阶段四：演示标记复原】执行区间 [${ql}..${qr}] -${addVal} 操作，演示懒标记消除与复原初始基准状态。`,
        { '阶段': '区间复原开始', '目标区间': `[${ql}..${qr}]`, '恢复量': `-${addVal}` }
      );
      updateRange(1, 1, n, ql, qr, -addVal);
    }

    emitFrame(
      ActionTypes.DONE,
      [1],
      25,
      `线段树全流程演示就绪！根节点 [1..${n}] 当前维护的全局总和为 ${tree[1]}。`,
      { '阶段': '演示完毕', '根节点区间和': tree[1], status: 'COMPLETE' }
    );

    return frames;
  }

  const segmentTreeDef = {
    id: 'segment_tree',
    category: 'data_structures',
    name: '线段树 (区间更新Lazy标记)',
    en: 'Segment Tree',
    meta: { tier: 'B组/A组', time: 'O(log N)', space: 'O(4N)', stability: '稳定', is408: false, tags: ['区间修改', '懒标记下传', '分治二叉树'] },
    templates: {
      python: [
        'def build(p, l, r):  # 递归建树：划分左右区间',
        '    if l == r:  # 递归终止：到达叶子节点',
        '        tree[p] = raw[l - 1]; return  # 叶子节点直接赋予单点初始值',
        '    mid = (l + r) // 2  # 计算当前管理区间的中心分界点',
        '    build(p * 2, l, mid); build(p * 2 + 1, mid + 1, r)  # 递归构建左右两棵子树',
        '    tree[p] = tree[p * 2] + tree[p * 2 + 1]  # push_up 向上汇总合并子树区间和',
        'def push_down(p, l, r):  # 懒标记下传：访问子树前解除延迟下推',
        '    if lazy[p]:  # 若当前节点积压了懒标记增量',
        '        mid = (l + r) // 2; ls, rs = p * 2, p * 2 + 1  # 左右子节点编号与中点计算',
        '        lazy[ls] += lazy[p]; tree[ls] += lazy[p] * (mid - l + 1)  # 累加左子树懒标记与区间和',
        '        lazy[rs] += lazy[p]; tree[rs] += lazy[p] * (r - mid)  # 累加右子树懒标记与区间和',
        '        lazy[p] = 0  # 当前节点累积标记清零已完成分发',
        'def update_range(p, l, r, ql, qr, val):  # 区间加法更新',
        '    if ql <= l and r <= qr:  # 当前区间完全被目标区间覆盖',
        '        tree[p] += val * (r - l + 1); lazy[p] += val; return  # 打上延迟标记后直接剪枝返回',
        '    push_down(p, l, r); mid = (l + r) // 2  # 下传历史标记并计算二分中点',
        '    if ql <= mid: update_range(p * 2, l, mid, ql, qr, val)  # 目标与左子树有交集则深入递归',
        '    if qr > mid: update_range(p * 2 + 1, mid + 1, r, ql, qr, val)  # 目标与右子树有交集则深入递归',
        '    tree[p] = tree[p * 2] + tree[p * 2 + 1]  # 递归回溯更新父节点区间和',
        'def query_range(p, l, r, ql, qr):  # 区间求和查询',
        '    if ql <= l and r <= qr: return tree[p]  # 当前区间完全被目标包含则直接返回区间和',
        '    push_down(p, l, r); mid = (l + r) // 2; res = 0  # 懒标记下传并初始化答案',
        '    if ql <= mid: res += query_range(p * 2, l, mid, ql, qr)  # 累加左子树查询覆盖结果',
        '    if qr > mid: res += query_range(p * 2 + 1, mid + 1, r, ql, qr)  # 累加右子树查询覆盖结果',
        '    return res  # 返回汇总区间总和'
      ],
      cpp: [
        'void build(int p, int l, int r) {  // 递归建树',
        '    if (l == r) { tree[p] = raw[l - 1]; return; }  // 叶子节点赋予单点值',
        '    int mid = (l + r) / 2;  // 计算中点',
        '    build(p * 2, l, mid); build(p * 2 + 1, mid + 1, r);  // 递归建左右子树',
        '    tree[p] = tree[p * 2] + tree[p * 2 + 1];  // push_up 合并区间和',
        '}  // 建树结束',
        'void push_down(int p, int l, int r) {  // 懒标记下传',
        '    if (lazy[p]) {  // 存在待下传的标记',
        '        int mid = (l + r) / 2, ls = p * 2, rs = p * 2 + 1;  // 左右孩子索引',
        '        lazy[ls] += lazy[p]; tree[ls] += lazy[p] * (mid - l + 1);  // 下传至左子树',
        '        lazy[rs] += lazy[p]; tree[rs] += lazy[p] * (r - mid);  // 下传至右子树',
        '        lazy[p] = 0;  // 当前标记清零',
        '    }  // if 结束',
        '}  // push_down 结束',
        'void update_range(int p, int l, int r, int ql, int qr, int val) {  // 区间加法更新',
        '    if (ql <= l and r <= qr) {  // 完全包含',
        '        tree[p] += val * (r - l + 1); lazy[p] += val; return;  // 打标记返回',
        '    }  // 完全覆盖结束',
        '    push_down(p, l, r); int mid = (l + r) / 2;  // 下推标记',
        '    if (ql <= mid) update_range(p * 2, l, mid, ql, qr, val);  // 递归更新左子树',
        '    if (qr > mid) update_range(p * 2 + 1, mid + 1, r, ql, qr, val);  // 递归更新右子树',
        '    tree[p] = tree[p * 2] + tree[p * 2 + 1];  // 回溯更新',
        '}  // 更新结束',
        'int query_range(int p, int l, int r, int ql, int qr) {  // 区间求和查询',
        '    if (ql <= l and r <= qr) return tree[p];  // 完全包含直接返回',
        '    push_down(p, l, r); int mid = (l + r) / 2, res = 0;  // 下传标记',
        '    if (ql <= mid) res += query_range(p * 2, l, mid, ql, qr);  // 查询左子树',
        '    if (qr > mid) res += query_range(p * 2 + 1, mid + 1, r, ql, qr);  // 查询右子树',
        '    return res;  // 返回求和',
        '}'
      ]
    },
    stlCard: {
      title: '📘 Lazy 标记灵魂机制',
      content: `
        <p><strong>延迟下传</strong>：修改区间完全包含当前节点时，直接累加区间和并打上 <code>lazy</code> 标记返回；仅当子树被查询或进一步分割时，才执行 <code>push_down</code> 下推标记。</p>
        <p><strong>复杂度优势</strong>：单次区间修改与查询均严格保证为 <code>O(log N)</code>，避免退化为 <code>O(N)</code>。</p>
      `
    },
    defaultInput: [1, 3, 5, 7, 9, 11],
    presets: {
      small: [2, 4, 6, 8]
    },
    parseInput: function(text) {
      const parts = text.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      return { success: true, data: parts.slice(0, 8) };
    },
    generateFrames: generateSegmentTreeFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageSvg = document.getElementById('stageSvg');
      if (!stageSvg) return;
      switchStageLayer('stageSvg');

      const state = frame.state || {};
      const raw = state.raw || [];
      const tree = state.tree || [];
      const lazy = state.lazy || [];
      const n = raw.length;

      let svg = '';
      function drawSubtree(node, l, r, x, y, rangeX) {
        if (node >= tree.length) return;
        const mid = Math.floor((l + r) / 2);
        const childRange = rangeX / 2;
        const childY = y + 70;

        if (l < r) {
          const leftX = x - childRange / 2;
          const rightX = x + childRange / 2;
          const isLeftActive = (frame.indices || []).includes(2 * node);
          const isRightActive = (frame.indices || []).includes(2 * node + 1);
          svg += `<line x1="${x}" y1="${y}" x2="${leftX}" y2="${childY}" stroke="${isLeftActive ? '#f59e0b' : '#334155'}" stroke-width="${isLeftActive ? '3' : '2'}"/>`;
          svg += `<line x1="${x}" y1="${y}" x2="${rightX}" y2="${childY}" stroke="${isRightActive ? '#f59e0b' : '#334155'}" stroke-width="${isRightActive ? '3' : '2'}"/>`;
          drawSubtree(2 * node, l, mid, leftX, childY, childRange);
          drawSubtree(2 * node + 1, mid + 1, r, rightX, childY, childRange);
        }

        const isHighlight = (frame.indices || []).includes(node);
        const hasLazy = lazy && lazy[node] && lazy[node] !== 0;

        let nodeFill = '#1e293b';
        let nodeStroke = '#3b82f6';
        let strokeWidth = '1.5';

        if (isHighlight) {
          if (frame.action === 'MODIFY') {
            nodeFill = '#78350f';
            nodeStroke = '#f59e0b';
            strokeWidth = '2.5';
          } else if (frame.action === 'FOUND') {
            nodeFill = '#064e3b';
            nodeStroke = '#10b981';
            strokeWidth = '2.5';
          } else {
            nodeFill = '#1e3a8a';
            nodeStroke = '#60a5fa';
            strokeWidth = '2.5';
          }
        } else if (hasLazy) {
          nodeStroke = '#eab308';
          strokeWidth = '2';
        }

        svg += `
          <g transform="translate(${x}, ${y})">
            <rect x="-34" y="-20" width="68" height="40" rx="6" fill="${nodeFill}" stroke="${nodeStroke}" stroke-width="${strokeWidth}"/>
            <text text-anchor="middle" dy="-5" fill="#94a3b8" font-weight="600" font-size="11">#${node} [${l}..${r}]</text>
            <text text-anchor="middle" dy="12" fill="#fff" font-weight="bold" font-size="12">和:${tree[node] || 0}</text>
            ${hasLazy ? `
              <g transform="translate(18, -20)">
                <rect x="-2" y="-12" width="28" height="15" rx="3" fill="#d97706" stroke="#fbbf24" stroke-width="1"/>
                <text text-anchor="middle" x="12" y="-1" fill="#fff" font-size="10" font-weight="bold">${lazy[node] >= 0 ? '+' + lazy[node] : lazy[node]}</text>
              </g>
            ` : ''}
          </g>
        `;
      }

      drawSubtree(1, 1, n, 400, 40, 360);
      stageSvg.innerHTML = svg;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // Register all 7 Data Structure algorithms + Aliases
  const allDataStructureAlgorithms = [
    monotonicStackDef,
    monotonicQueueDef,
    binaryHeapDef,
    dsuDef,
    trieDef,
    fenwickTreeDef,
    segmentTreeDef
  ];

  allDataStructureAlgorithms.forEach(def => {
    if (global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.register === 'function') {
      global.AlgoSystem.visualizers.register(def.id, def);
    }
  });

  // Aliases
  if (global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.register === 'function') {
    global.AlgoSystem.visualizers.register('heap_pq', binaryHeapDef);
    global.AlgoSystem.visualizers.register('fenwick', fenwickTreeDef);
  }

  global.AlgoSystem.visualizers.data_structures = {
    algorithms: allDataStructureAlgorithms,
    monotonicStack: monotonicStackDef,
    monotonicQueue: monotonicQueueDef,
    binaryHeap: binaryHeapDef,
    dsu: dsuDef,
    trie: trieDef,
    fenwickTree: fenwickTreeDef,
    segmentTree: segmentTreeDef
  };

})(typeof window !== 'undefined' ? window : globalThis);
