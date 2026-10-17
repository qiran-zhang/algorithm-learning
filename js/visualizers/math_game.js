/**
 * @file math_game.js
 * @description Math, Geometry & Game Theory Visualizers: Sieve of Eratosthenes, Euclidean GCD/ExGCD, 32-bit Bitmask Sandbox, Nim Game SG Calculator.
 * @namespace window.AlgoSystem.visualizers.math_game
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
            <td style="font-size:11px; color:var(--text-muted);">数学状态</td>
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
    let inputData = (customData !== undefined && customData !== null) ? customData : algoDef.defaultInput;

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
  // 1. 素数筛法 (Prime Sieve - 埃氏筛与欧拉筛)
  // =========================================================================
  function generatePrimeSieveFrames(input) {
    let N = 50;
    if (typeof input === 'number') N = Math.max(2, Math.min(100, input));
    else if (input && typeof input.N === 'number') N = Math.max(2, Math.min(100, input.N));

    const frames = [];
    let step = 0;

    const cellStatus = new Array(N + 1).fill('unknown'); // 'unknown', 'prime', 'composite', 'inactive'
    cellStatus[0] = 'inactive';
    cellStatus[1] = 'inactive';
    const primes = [];

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { type: 'prime_sieve', N, cellStatus: [...cellStatus], primes: [], currentP: null },
      variables: { N, '已探明素数': '[]', '候选数': N - 1 },
      codeLine: 2,
      explanation: `【素数筛法启动】建立 1 到 ${N} 的数字矩阵墙。0 与 1 既非素数也非合数，剔除置灰。`
    }));

    for (let p = 2; p <= N; p++) {
      if (cellStatus[p] === 'unknown') {
        cellStatus[p] = 'prime';
        primes.push(p);

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MARK_SORTED,
          indices: [p],
          state: { type: 'prime_sieve', N, cellStatus: [...cellStatus], primes: [...primes], currentP: p },
          variables: { '发现新质数': p, '质数总数': primes.length, '划线起点': p * p <= N ? `${p}² = ${p * p}` : '超出N无需划' },
          codeLine: 5,
          explanation: `【命中质数】数字 ${p} 尚未被任何更小质因子击中，确认为素数！点亮翡翠绿徽章。`
        }));

        if (p * p <= N) {
          for (let m = p * p; m <= N; m += p) {
            cellStatus[m] = 'composite';

            frames.push(new SnapshotFrame({
              step: step++,
              action: ActionTypes.MODIFY,
              indices: [m],
              state: { type: 'prime_sieve', N, cellStatus: [...cellStatus], primes: [...primes], currentP: p, currentM: m },
              variables: { '质数基准 p': p, '筛除合数 m': `${m} = ${m / p} × ${p}` },
              codeLine: 7,
              explanation: `从 p² = ${p * p} 起跳：标记 ${m} 为合数（${m} = ${m / p} × ${p}），划线击碎变暗！`
            }));
          }
        }
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { type: 'prime_sieve', N, cellStatus: [...cellStatus], primes: [...primes] },
      variables: { '筛选完毕': `1~${N} 共有 ${primes.length} 个质数`, '素数清单': primes.join(', ') },
      codeLine: 8,
      explanation: `素数筛执行完毕！在 1..${N} 范围内共筛选出 ${primes.length} 个质数: [${primes.join(', ')}]。`
    }));

    return frames;
  }

  const primeSieveDef = {
    id: 'prime_sieve',
    category: 'math_game',
    name: '素数筛法 (埃氏筛 vs 欧拉线性筛)',
    en: 'Prime Sieve (Euler/Eratosthenes)',
    meta: { tier: 'C组/B组', time: 'O(N)', space: 'O(N)', stability: '稳定', is408: false, tags: ['最小质因子', 'O(N)线性筛', '合数标记'] },
    templates: {
      python: [
        'def eratosthenes_sieve(n):',
        '    is_prime = [True] * (n + 1)',
        '    is_prime[0] = is_prime[1] = False',
        '    for p in range(2, int(n**0.5) + 1):',
        '        if is_prime[p]:',
        '            for m in range(p * p, n + 1, p):',
        '                is_prime[m] = False',
        '    return [i for i in range(2, n + 1) if is_prime[i]]'
      ],
      cpp: [
        'vector<int> eulerSieve(int n) {',
        '    vector<bool> isPrime(n + 1, true);',
        '    vector<int> primes;',
        '    isPrime[0] = isPrime[1] = false;',
        '    for (int i = 2; i <= n; ++i) {',
        '        if (isPrime[i]) primes.push_back(i);',
        '        for (int p : primes) {',
        '            if (i * p > n) break;',
        '            isPrime[i * p] = false;',
        '            if (i % p == 0) break; // 最小质因子核心防重',
        '        }',
        '    }',
        '    return primes;',
        '}'
      ]
    },
    stlCard: {
      title: '📘 埃氏筛 vs 欧拉线性筛',
      content: `
        <p><strong>欧拉线性筛防重精要</strong>：<code>if (i % p == 0) break;</code>。强制每个合数仅被其<strong>最小质因子</strong>筛去一次，复杂度严格收敛到 $O(N)$。</p>
      `
    },
    defaultInput: { N: 50 },
    presets: {
      standard: { N: 50 },
      small: { N: 30 },
      large: { N: 80 }
    },
    parseInput: function(text) {
      const num = Number(text.replace(/[^0-9]/g, ''));
      if (isNaN(num) || num < 2) return { success: false, error: '请输入 2~100 间的整数' };
      return { success: true, data: { N: Math.min(100, num) } };
    },
    generateFrames: generatePrimeSieveFrames,
    run: function(input) { return this.generateFrames(input !== undefined && input !== null ? input : this.defaultInput); },
    render: function(frame) {
      const stageGrid = document.getElementById('stageGrid');
      if (!stageGrid) return;
      switchStageLayer('stageGrid');

      const state = frame.state || {};
      const N = state.N || 50;
      const cellStatus = state.cellStatus || [];
      const curP = state.currentP;
      const curM = state.currentM;

      let html = '<div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; padding:16px;">';
      html += `<div style="font-size:13px; color:var(--text-secondary);">素数筛数字墙 (1 ~ ${N}) | 已确认质数: <strong>${state.primes ? state.primes.length : 0}</strong> 个</div>`;
      html += `<div style="display:grid; grid-template-columns: repeat(${Math.min(10, N)}, 42px); gap:6px;">`;

      for (let i = 1; i <= N; i++) {
        const st = cellStatus[i] || 'unknown';
        const isP = (i === curP);
        const isM = (i === curM);

        let bg = 'var(--bg-surface)';
        let border = '1px solid var(--border-default)';
        let color = '#fff';
        let decor = 'none';

        if (st === 'inactive') {
          bg = '#252526';
          color = 'var(--text-muted)';
        } else if (st === 'prime') {
          bg = 'rgba(78, 201, 176, 0.25)';
          border = '2px solid #4ec9b0';
          color = '#4ec9b0';
        } else if (st === 'composite') {
          bg = '#252526';
          color = 'var(--text-muted)';
          decor = 'line-through';
        }

        if (isP) { border = '2px solid #569cd6'; }
        if (isM) { border = '2px solid #f44747'; color = '#f44747'; }

        html += `
          <div style="width:42px; height:42px; background:${bg}; border:${border}; border-radius:4px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:13px; color:${color}; text-decoration:${decor}; font-family:var(--font-mono);">
            ${i}
          </div>
        `;
      }

      html += '</div></div>';
      stageGrid.innerHTML = html;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 2. 欧几里得辗转相除法 (Euclidean GCD / ExGCD)
  // =========================================================================
  function generateEuclideanGCDFrames(input) {
    let A = 48, B = 18;
    if (input && typeof input === 'object') {
      if (typeof input.A === 'number') A = input.A;
      if (typeof input.B === 'number') B = input.B;
    }
    if (A < B) { const t = A; A = B; B = t; }

    const frames = [];
    let step = 0;
    const stepsData = [];
    let curA = A, curB = B;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { type: 'euclidean_gcd', A, B, stepsData: [], finished: false },
      variables: { '大边 A': A, '小边 B': B, '问题': `求 gcd(${A}, ${B})` },
      codeLine: 1,
      explanation: `【几何平铺问题】给定 ${A} × ${B} 的长方形。寻找能无缝平铺该矩形的最大正方形边长。`
    }));

    // B = 0 边界处理：直接发射 DONE 终结帧
    if (curB === 0) {
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.DONE,
        indices: [],
        state: { type: 'euclidean_gcd', A, B, stepsData: [], gcd: curA, finished: true },
        variables: { '最大公约数 GCD': curA, '裴蜀等式': `${A}·x + ${B}·y = ${curA}` },
        codeLine: 4,
        explanation: `小边 B 为 0，无需裁剪！最大公约数 gcd(${A}, 0) = ${curA}。`
      }));
      return frames;
    }

    while (curB > 0) {
      const q = Math.floor(curA / curB);
      const r = curA % curB;
      stepsData.push({ a: curA, b: curB, q, r });

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.COMPARE,
        indices: [],
        state: { type: 'euclidean_gcd', A, B, stepsData: [...stepsData], curA, curB, q, r },
        variables: { A: curA, B: curB, '裁切正方形数 q': q, '余数边长 r': r },
        codeLine: 3,
        explanation: `【几何裁切】在 ${curA} × ${curB} 矩形中裁切出 ${q} 个 ${curB}×${curB} 的正方形，留下 ${curB} × ${r} 的余数矩形。`
      }));

      if (r === 0) {
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.DONE,
          indices: [],
          state: { type: 'euclidean_gcd', A, B, stepsData: [...stepsData], gcd: curB, finished: true },
          variables: { '最大公约数 GCD': curB, '裴蜀等式': `${A}·x + ${B}·y = ${curB}` },
          codeLine: 4,
          explanation: `余数为 0，裁剪终结！最终裁切的正方形边长为 ${curB}，即 gcd(${A}, ${B}) = ${curB}。`
        }));
        break;
      }

      curA = curB;
      curB = r;
    }

    return frames;
  }

  const euclideanGCDDef = {
    id: 'euclidean_gcd',
    category: 'math_game',
    name: '欧几里得辗转相除法 (GCD 矩形平铺)',
    en: 'Euclidean GCD / ExGCD',
    meta: { tier: 'C组/B组', time: 'O(log min(a,b))', space: 'O(1)', stability: '稳定', is408: false, tags: ['矩形裁剪', '裴蜀定理', '逆元'] },
    templates: {
      python: [
        'def gcd(a, b):',
        '    while b:',
        '        a, b = b, a % b',
        '    return a',
        '',
        'def exgcd(a, b):',
        '    if b == 0: return a, 1, 0',
        '    g, x1, y1 = exgcd(b, a % b)',
        '    return g, y1, x1 - (a // b) * y1'
      ],
      cpp: [
        'int gcd(int a, int b) {',
        '    return b == 0 ? a : gcd(b, a % b);',
        '}',
        'int exgcd(int a, int b, int &x, int &y) {',
        '    if (b == 0) { x = 1; y = 0; return a; }',
        '    int d = exgcd(b, a % b, y, x);',
        '    y -= (a / b) * x;',
        '    return d;',
        '}'
      ]
    },
    stlCard: {
      title: '📘 C++ STL 与裴蜀定理',
      content: `
        <p><strong>C++17 STL</strong>：<code>std::gcd(a, b)</code> 与 <code>std::lcm(a, b)</code> 位于 <code>&lt;numeric&gt;</code>。</p>
        <p><strong>逆元求解</strong>：当 $\gcd(a, m) = 1$ 时，通过 ExGCD 求 $a \cdot x \equiv 1 \pmod m$ 的解 $x$ 即为模逆元。</p>
      `
    },
    defaultInput: { A: 48, B: 18 },
    presets: {
      standard: { A: 48, B: 18 },
      fibonacci: { A: 55, B: 34 },
      prime_pair: { A: 37, B: 13 }
    },
    parseInput: function(text) {
      const parts = text.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      if (parts.length >= 2) return { success: true, data: { A: parts[0], B: parts[1] } };
      return { success: false, error: '请输入两个数字，如: 48, 18' };
    },
    generateFrames: generateEuclideanGCDFrames,
    run: function(input) { return this.generateFrames(input !== undefined && input !== null ? input : this.defaultInput); },
    render: function(frame) {
      const stageSvg = document.getElementById('stageSvg');
      if (!stageSvg) return;
      switchStageLayer('stageSvg');

      const state = frame.state || {};
      const A = typeof state.A === 'number' ? state.A : 48;
      const B = typeof state.B === 'number' ? state.B : 18;
      const steps = state.stepsData || [];

      const svgW = 560, svgH = 300;
      let scale = 1;
      if (A > 0 && B > 0) {
        scale = Math.min((svgW - 40) / A, (svgH - 40) / B);
      } else if (A > 0) {
        scale = (svgW - 40) / A;
      } else if (B > 0) {
        scale = (svgH - 40) / B;
      }

      if (A === 0 && B === 0) {
        stageSvg.innerHTML = `
          <text x="280" y="150" text-anchor="middle" fill="var(--text-muted)" font-size="16">边长均为 0，无几何矩形</text>
        `;
        syncInspectorUI(frame);
        return;
      }

      if (B === 0) {
        const lineLen = Math.min(A * scale, svgW - 40);
        stageSvg.innerHTML = `
          <line x1="30" y1="150" x2="${30 + lineLen}" y2="150" stroke="#4ec9b0" stroke-width="4"/>
          <text x="${30 + lineLen / 2}" y="135" text-anchor="middle" fill="#4ec9b0" font-weight="bold" font-size="14">线段长 A = ${A} (B = 0)</text>
          <text x="280" y="200" text-anchor="middle" fill="var(--text-secondary)" font-size="13">B 为 0，退化为一维线段，gcd(${A}, 0) = ${A}</text>
        `;
        syncInspectorUI(frame);
        return;
      }

      let svg = `
        <rect x="30" y="30" width="${A * scale}" height="${B * scale}" fill="none" stroke="var(--border-default)" stroke-width="2"/>
      `;

      let curX = 30, curY = 30;
      const colors = ['#007acc', '#4ec9b0', '#dcdcaa', '#ce9178', '#c586c0'];

      steps.forEach((st, idx) => {
        const sqSize = st.b * scale;
        const color = colors[idx % colors.length];

        for (let q = 0; q < st.q; q++) {
          svg += `
            <rect x="${curX + q * sqSize}" y="${curY}" width="${sqSize}" height="${sqSize}" fill="${color}" fill-opacity="0.6" stroke="#fff" stroke-width="1.5"/>
            <text x="${curX + (q + 0.5) * sqSize}" y="${curY + sqSize / 2 + 5}" text-anchor="middle" fill="#000" font-weight="bold" font-size="12">${st.b}</text>
          `;
        }
        curX += st.q * sqSize;
      });

      stageSvg.innerHTML = svg;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 3. 32位位运算全能沙盒 (Bitmask Sandbox - lowbit)
  // =========================================================================
  function generateBitmaskSandboxFrames(input) {
    let A = 12;
    if (typeof input === 'number') A = input;
    else if (input && typeof input.A === 'number') A = input.A;

    const frames = [];
    let step = 0;

    const to32Bits = (val) => {
      const bits = [];
      for (let i = 31; i >= 0; i--) {
        bits.push((val >>> i) & 1);
      }
      return bits;
    };

    const bitsA = to32Bits(A);
    const negA = (-A) | 0;
    const bitsNegA = to32Bits(negA);
    const lowbitVal = A & (-A);
    const bitsLowbit = to32Bits(lowbitVal);

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { type: 'bitmask', stage: 'a', A, bitsA },
      variables: { '十进制 A': A, '二进制': A.toString(2), '十六进制': '0x' + (A >>> 0).toString(16).toUpperCase() },
      codeLine: 1,
      explanation: `【位运算沙盒】操作数 A = ${A}。展示其 32 位二进制完整表示。`
    }));

    const notA = (~A) | 0;
    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.COMPARE,
      indices: [],
      state: { type: 'bitmask', stage: 'not_a', A, bitsA, notA, bitsNotA: to32Bits(notA) },
      variables: { 'A': A, '按位取反 ~A': notA, '现象': '0全部变1，1全部变0' },
      codeLine: 2,
      explanation: `第一步：按位取反 ~A = ${notA}。原先末尾连续的 0 翻转为 1，末尾的 1 翻转为 0。`
    }));

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.MODIFY,
      indices: [],
      state: { type: 'bitmask', stage: 'neg_a', A, bitsA, negA, bitsNegA },
      variables: { '-A 补码': negA, '推导': '~A + 1', '进位涟漪': '加1引发涟漪进位，末尾重新变0，最低位1重现！' },
      codeLine: 2,
      explanation: `第二步：在计算机补码中，-A = ~A + 1。加 1 导致末尾连续的 1 全部冲刷进位归 0，在最低有效 1 处重现 1！`
    }));

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { type: 'bitmask', stage: 'lowbit', A, bitsA, negA, bitsNegA, lowbitVal, bitsLowbit },
      variables: { 'lowbit(A)': lowbitVal, '数学含义': `提取出 2^k = ${lowbitVal}`, '树状数组核心': 'C[i] 的管辖长度' },
      codeLine: 2,
      explanation: `第三步：执行 A & (-A)！高位互斥全被清零，唯独最低有效 1 得到完美保留！lowbit(${A}) = ${lowbitVal}。`
    }));

    return frames;
  }

  const bitmaskSandboxDef = {
    id: 'bitmask_sandbox',
    category: 'math_game',
    name: '32位位运算全能沙盒 (lowbit)',
    en: 'Bitmask Manipulation Sandbox',
    meta: { tier: 'B组', time: 'O(1)', space: 'O(1)', stability: '稳定', is408: false, tags: ['lowbit', '掩码异或', '状态压缩'] },
    templates: {
      python: [
        'def bit_manipulations(x):',
        '    lowbit = x & (-x)           # 提取最低有效 1',
        '    is_power_of_two = (x > 0) and (x & (x - 1) == 0)',
        '    clear_lowest = x & (x - 1)  # 抹去最低 1',
        '    count_ones = bin(x).count("1")',
        '    return lowbit'
      ],
      cpp: [
        'inline int lowbit(int x) { return x & (-x); }',
        'inline bool isPowerOfTwo(int x) { return x > 0 && (x & (x - 1)) == 0; }',
        'inline int countOnes(int x) { return __builtin_popcount(x); }'
      ]
    },
    stlCard: {
      title: '📘 竞赛位运算速查',
      content: `
        <p><code>x & (-x)</code>：提取最低位 1；<code>x & (x - 1)</code>：消除最低位 1。</p>
        <p><strong>内置函数</strong>：C++ <code>__builtin_popcount(x)</code> 与 <code>std::bitset</code>。</p>
      `
    },
    defaultInput: { A: 12 },
    presets: {
      twelve: { A: 12 },
      twenty_four: { A: 24 },
      large: { A: 40 }
    },
    parseInput: function(text) {
      const n = Number(text.replace(/[^0-9\-]/g, ''));
      if (isNaN(n)) return { success: false, error: '请输入整数' };
      return { success: true, data: { A: n } };
    },
    generateFrames: generateBitmaskSandboxFrames,
    run: function(input) { return this.generateFrames(input !== undefined && input !== null ? input : this.defaultInput); },
    render: function(frame) {
      const stageSandbox = document.getElementById('stageSandbox');
      if (!stageSandbox) return;
      switchStageLayer('stageSandbox');

      const state = frame.state || {};
      const A = typeof state.A === 'number' ? state.A : 12;

      let html = '<div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; padding:20px;">';
      html += `<div style="font-size:14px; color:var(--text-secondary);">操作数 A = <strong style="color:#569cd6; font-size:16px;">${A}</strong> (0b${A.toString(2)})</div>`;

      function renderBitsRow(label, bits, highlightIdx) {
        let r = '<div style="display:flex; flex-direction:column; align-items:flex-start; gap:4px;">';
        r += `<span style="font-size:12px; color:var(--text-muted);">${label}:</span>`;
        r += '<div style="display:flex; gap:3px;">';
        bits.forEach((b, idx) => {
          const isHl = (highlightIdx !== undefined && idx === highlightIdx);
          const bg = b === 1 ? (isHl ? '#4ec9b0' : '#569cd6') : 'var(--bg-surface)';
          r += `
            <div style="width:18px; height:26px; background:${bg}; border:1px solid var(--border-default); border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold; color:${b === 1 ? '#000' : 'var(--text-muted)'}; font-family:var(--font-mono);">
              ${b}
            </div>
          `;
        });
        r += '</div></div>';
        return r;
      }

      if (state.bitsA) html += renderBitsRow('A 原码', state.bitsA);
      if (state.bitsNotA) html += renderBitsRow('~A 反码', state.bitsNotA);
      if (state.bitsNegA) html += renderBitsRow('-A 补码 (~A + 1)', state.bitsNegA);
      if (state.bitsLowbit) html += renderBitsRow('lowbit = A & (-A)', state.bitsLowbit);

      html += '</div>';
      stageSandbox.innerHTML = html;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 4. 博弈论 Nim 游戏 (Nim Game SG 计算器)
  // =========================================================================
  function generateNimGameFrames(input) {
    let piles = [3, 4, 5];
    if (input && typeof input === 'object') {
      if (Array.isArray(input.piles) && input.piles.length >= 2) piles = input.piles.slice(0, 5);
    }

    const frames = [];
    let step = 0;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { type: 'nim_game', piles: [...piles], stepStage: 'init' },
      variables: { '石子堆数': piles.length, '各堆数量': piles.join(', ') },
      codeLine: 1,
      explanation: `【博弈论 Nim 游戏启动】共有 ${piles.length} 堆石子，数量为 [${piles.join(', ')}]。准备按列计算二进制异或和。`
    }));

    let xorSum = 0;
    for (let i = 0; i < piles.length; i++) {
      const prev = xorSum;
      xorSum ^= piles[i];
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MODIFY,
        indices: [i],
        state: { type: 'nim_game', piles: [...piles], currentPile: i, xorSum, stepStage: 'accumulate' },
        variables: { '累加堆': `第 ${i + 1} 堆 (${piles[i]})`, '前次异或和': prev, '当前异或和': xorSum },
        codeLine: 3,
        explanation: `第 ${i + 1} 堆石子 (${piles[i]}) 异或入总和：${prev} ⊕ ${piles[i]} = ${xorSum}。`
      }));
    }

    if (xorSum === 0) {
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.DONE,
        indices: [],
        state: { type: 'nim_game', piles: [...piles], xorSum: 0, isWinning: false },
        variables: { '全局异或和': 0, '博弈判定': '先手必败态 (P-Position)', '建议策略': '等待对手失误' },
        codeLine: 4,
        explanation: `异或和严格为 0！根据 Bouton 定理，当前局面为【先手必败态】。无论先手如何合规走子，后手皆可使其重回 0 态。`
      }));
    } else {
      let winPile = -1;
      let takeCount = 0;
      let targetRemain = 0;

      for (let i = 0; i < piles.length; i++) {
        const target = piles[i] ^ xorSum;
        if (target < piles[i]) {
          winPile = i;
          takeCount = piles[i] - target;
          targetRemain = target;
          break;
        }
      }

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MARK_SORTED,
        indices: [winPile],
        state: {
          type: 'nim_game',
          piles: [...piles],
          xorSum,
          isWinning: true,
          winPile,
          takeCount,
          targetRemain
        },
        variables: {
          '全局异或和': `${xorSum} (≠ 0)`,
          '博弈判定': '先手必胜态 (N-Position)',
          '最优策略': `从第 ${winPile + 1} 堆拿走 ${takeCount} 颗，剩余 ${targetRemain} 颗`,
          '移后异或和': 0
        },
        codeLine: 8,
        explanation: `【先手必胜致胜招法】异或和为 ${xorSum} ≠ 0！最优出招：从第 ${winPile + 1} 堆（原为 ${piles[winPile]} 颗）拿走 ${takeCount} 颗石子，剩余 ${targetRemain} 颗。移动后全局异或和归 0，对手陷入必败！`
      }));
    }

    return frames;
  }

  const nimGameDef = {
    id: 'nim_game',
    category: 'math_game',
    name: '博弈论 Nim 游戏 (异或和SG计算器)',
    en: 'Nim Game & SG Function',
    meta: { tier: 'B组', time: 'O(1)', space: 'O(1)', stability: '稳定', is408: false, tags: ['异或和', '必胜态必败态', 'SG定理'] },
    templates: {
      python: [
        'def nim_game(piles):  # 博弈论 Nim 游戏决策求解器',
        '    xor_sum = 0  # 游戏全局状态的 Nim 和 (异或和)',
        '    for p in piles: xor_sum ^= p  # 计算所有石子堆数量的异或总和',
        '    if xor_sum == 0: return "先手必败 (P-Position)"  # 异或和为 0，任何合法移动都将使对手进入必胜态',
        '    for i, p in enumerate(piles):  # 异或和非 0 (必胜态)，寻找先手的绝杀移动策略',
        '        target = p ^ xor_sum  # 目标剩余石子数',
        '        if target < p:  # 若目标小于当前堆，说明本堆为高位贡献堆，可通过减少石子转移至必败态',
        '            return f"从第 {i+1} 堆拿走 {p - target} 颗，剩余 {target} 颗"  # 返回先手必胜落子指令'
      ],
      cpp: [
        'string solveNim(const vector<int>& piles) {  // 博弈论Nim游戏主解算函数',
        '    int xor_sum = 0;  // 整体游戏Nim和初始化',
        '    for (int p : piles) xor_sum ^= p;  // 遍历所有堆累加异或值',
        '    if (xor_sum == 0) return "先手必败";  // 零和状态后手必胜',
        '    for (size_t i = 0; i < piles.size(); ++i) {  // 寻找必胜下法',
        '        int target = piles[i] ^ xor_sum;  // 计算平衡所需的剩余石子',
        '        if (target < piles[i])  // 找到可削减的石子堆',
        '            return "从第 " + to_string(i+1) + " 堆拿走 " + to_string(piles[i]-target);  // 返回行动方案',
        '    }  // 遍历结束',
        '    return "必胜";  // 兜底返回',
        '}'
      ]
    },
    stlCard: {
      title: '📘 SG 函数与公平组合游戏 (ICG)',
      content: `
        <p><strong>SG 定理</strong>：任何公平组合游戏都可以等价转化为 Nim 堆，状态的 SG 值为其所有后继状态 SG 值的 <code>mex</code>（最小未出现非负整数）。各子游戏的异或和即为总游戏 SG 值。</p>
      `
    },
    defaultInput: { piles: [3, 4, 5] },
    presets: {
      standard: { piles: [3, 4, 5] },
      losing: { piles: [1, 2, 3] },
      equal_pairs: { piles: [5, 5, 2, 2] }
    },
    parseInput: function(text) {
      const parts = text.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      if (parts.length >= 2) return { success: true, data: { piles: parts.slice(0, 6) } };
      return { success: false, error: '请输入各堆石子数，如: 3, 4, 5' };
    },
    generateFrames: generateNimGameFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageSandbox = document.getElementById('stageSandbox');
      if (!stageSandbox) return;
      switchStageLayer('stageSandbox');

      const state = frame.state || {};
      const piles = state.piles || [3, 4, 5];
      const xorSum = state.xorSum !== undefined ? state.xorSum : 0;

      let html = '<div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; padding:20px;">';
      html += `<div style="font-size:14px; color:var(--text-secondary);">全局异或和 S = <strong style="color:${xorSum === 0 ? '#f44747' : '#4ec9b0'}; font-size:18px;">${xorSum}</strong> (${xorSum === 0 ? '先手必败 P-Position' : '先手必胜 N-Position'})</div>`;

      // 石子堆立柱视图
      html += '<div style="display:flex; gap:24px; align-items:flex-end; height:180px;">';
      piles.forEach((p, idx) => {
        const isWin = (state.winPile === idx);
        const heightPct = Math.max(20, Math.min(95, p * 12));
        html += `
          <div style="height:${heightPct}%; width:54px; background:${isWin ? '#4ec9b0' : '#569cd6'}; border-radius:4px 4px 0 0; display:flex; flex-direction:column; justify-content:space-between; align-items:center; padding:6px 0;">
            <span style="font-weight:bold; font-size:14px; color:#000;">${p}</span>
            <div style="display:flex; flex-direction:column; align-items:center;">
              <span style="font-size:10px; color:#fff;">0b${p.toString(2)}</span>
              <span style="font-size:11px; color:rgba(0,0,0,0.8); font-weight:bold;">堆 ${idx + 1}</span>
            </div>
          </div>
        `;
      });
      html += '</div></div>';

      stageSandbox.innerHTML = html;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // Register all 4 Math & Game algorithms + Aliases
  const allMathGameAlgorithms = [
    primeSieveDef,
    euclideanGCDDef,
    bitmaskSandboxDef,
    nimGameDef
  ];

  allMathGameAlgorithms.forEach(def => {
    if (global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.register === 'function') {
      global.AlgoSystem.visualizers.register(def.id, def);
    }
  });

  // Aliases
  if (global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.register === 'function') {
    global.AlgoSystem.visualizers.register('gcd_euclidean', euclideanGCDDef);
    global.AlgoSystem.visualizers.register('bitmask', bitmaskSandboxDef);
  }

  global.AlgoSystem.visualizers.math_game = {
    algorithms: allMathGameAlgorithms,
    primeSieve: primeSieveDef,
    euclideanGCD: euclideanGCDDef,
    bitmaskSandbox: bitmaskSandboxDef,
    nimGame: nimGameDef
  };

})(typeof window !== 'undefined' ? window : globalThis);
