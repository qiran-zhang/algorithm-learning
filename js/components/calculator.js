/**
 * @file calculator.js
 * @description N-second Complexity Recommendation Calculator based on the 10^8 operations rule.
 * @namespace window.AlgoSystem.components.Calculator
 *
 * 16th Blue Bridge Cup Algorithm Learning & Visualization Platform
 * Zero-CORS, Zero-build, file:// protocol compatible.
 */
(function(global) {
  'use strict';

  global.AlgoSystem = global.AlgoSystem || {};
  global.AlgoSystem.components = global.AlgoSystem.components || {};

  // 评测机基准运算量 (1.0s 时限)
  const BASE_OPS_CPP = 1e8;        // C++ 1.0s: ~10^8 次基础运算
  const BASE_OPS_PYTHON = 1.5e7;   // Python 3 1.0s: ~1.5×10^7 次运算

  // 7 大数据规模与蓝桥真题经典模型推荐库
  const COMPLEXITY_MODELS = [
    {
      scaleKey: 'N_LE_10',
      title: '数据规模 N ≤ 10 (全排列爆搜 / 状压)',
      rangeText: 'N ≤ 10',
      allowedComplexity: 'O(N!) 或 O(2^N · N²)',
      models: [
        { name: '全排列爆搜 (DFS Permutations)', cat: 'graphs', desc: '10! = 3.6×10⁶，轻松秒过。题眼：“求全排列方案数、带约束的最佳填数”。', route: '#graphs/dfs_maze' },
        { name: 'N 皇后剪枝回溯', cat: 'graphs', desc: '利用按行放置、列与对角线位运算剪枝。', route: '#graphs/dfs_maze' },
        { name: '旅行商状压搜索 (TSP)', cat: 'dp', desc: '状压记录已访问城市集合，O(2^N · N²) 耗时 < 10ms。', route: '#dp/knapsack_01' }
      ],
      antiPattern: '切勿在此数据量下写复杂的高级数据结构，直接 DFS 暴力枚举是最稳妥拿满分的策略！'
    },
    {
      scaleKey: 'N_LE_20',
      title: '数据规模 N ≤ 20 ~ 25 (状压 DP / 折半搜索)',
      rangeText: '10 < N ≤ 25',
      allowedComplexity: 'O(2^N) 或 O(2^N · N)',
      models: [
        { name: '状态压缩 DP (Bitmask DP)', cat: 'math_game', desc: '2²⁰ ≈ 1.05×10⁶，用整型二进制位表示集合状态，DP 填表极速完成。', route: '#math_game/bitmask_sandbox' },
        { name: '子集生成与二进制枚举', cat: 'math_game', desc: '外层 0 到 (1<<N)-1 循环，枚举所有子集组合。', route: '#math_game/bitmask_sandbox' },
        { name: '折半搜索 (Meet in the Middle)', cat: 'search_strings', desc: '将 N=40 拆分为前后两半各 20 项，分别暴力生成再哈希合并，O(2^(N/2))。', route: '#search_strings/binary_search' }
      ],
      antiPattern: '严禁使用 O(N!)。20! ≈ 2.4×10¹⁸，无论如何优化都会超时数十万年。'
    },
    {
      scaleKey: 'N_LE_500',
      title: '数据规模 N ≤ 500 (O(N³) Floyd / 区间 DP)',
      rangeText: '25 < N ≤ 500',
      allowedComplexity: 'O(N³)',
      models: [
        { name: 'Floyd-Warshall 多源最短路', cat: 'graphs', desc: '三重循环中转点 k, i, j，500³ ≈ 1.25×10⁸（常数极小，C++ 1秒能过，Python需慎重）。', route: '#graphs/dijkstra' },
        { name: '区间 DP (石子合并)', cat: 'dp', desc: '外层步长 len，内层起点 i 与断点 k，O(N³) 填满上三角半矩阵。', route: '#dp/interval_dp' },
        { name: '高斯消元求解线性方程组', cat: 'math_game', desc: '矩阵消元 O(N³)，用于期望 DP 或异或线性基方程。', route: '#math_game/bitmask_sandbox' }
      ],
      antiPattern: '四重循环 O(N⁴) 必定超时。在 Python 3 中 500³ 风险极高，建议尽量利用常数优化或转为 O(N²)。'
    },
    {
      scaleKey: 'N_LE_5000',
      title: '数据规模 N ≤ 5,000 (O(N²) 双重循环 / 基础 DP)',
      rangeText: '500 < N ≤ 5,000',
      allowedComplexity: 'O(N²)',
      models: [
        { name: '0-1 背包与完全背包', cat: 'dp', desc: 'N×W 状态转移，N=1000, W=1000 时仅需 10⁶ 次运算。', route: '#dp/knapsack_01' },
        { name: '最长上升子序列 (LIS) 经典转移', cat: 'dp', desc: '双重循环找前驱最大值，O(N²) 耗时约 25ms。', route: '#dp/lis' },
        { name: '双重循环暴力枚举 / 基础排序', cat: 'sorting', desc: '对所有数对 (i, j) 检验判定，2500 万次运算在时限内稳妥通过。', route: '#sorting/bubble_sort' }
      ],
      antiPattern: '严禁三重循环。若 N=5000，O(N³) = 1.25×10¹¹，必超时暴零。'
    },
    {
      scaleKey: 'N_LE_200000',
      title: '数据规模 N ≤ 2×10⁵ (O(N log N) 高级数据结构与排序)',
      rangeText: '5,000 < N ≤ 2×10⁵',
      allowedComplexity: 'O(N log N)',
      models: [
        { name: '快速排序 / 归并排序 / 堆排序', cat: 'sorting', desc: '2×10⁵ × 18 ≈ 3.6×10⁶ 次操作，省一题目的默认骨架。', route: '#sorting/quick_sort' },
        { name: '二分查找与二分答案 (红蓝染色)', cat: 'search_strings', desc: '值域折半判定，单次 check O(N)，总复杂度 O(N log M)。', route: '#search_strings/binary_search' },
        { name: '树状数组 (BIT) / 线段树', cat: 'data_structures', desc: '单点/区间修改与区间和查询，单次 O(log N)。', route: '#data_structures/fenwick_tree' },
        { name: '堆优化 Dijkstra / Kruskal', cat: 'graphs', desc: '边数 M 级稀疏图上求最短路与最小生成树，O(M log N)。', route: '#graphs/dijkstra' },
        { name: '单调栈 / 单调队列', cat: 'data_structures', desc: '维护滑动窗口最值与下一个更大元素，每个元素进出各一次，O(N) 极速。', route: '#data_structures/monotonic_stack' }
      ],
      antiPattern: '严禁 O(N²) 双重循环！(2×10⁵)² = 4×10¹⁰，绝对超时。必须上二分、双指针或树形数据结构。'
    },
    {
      scaleKey: 'N_LE_10000000',
      title: '数据规模 N ≤ 10⁷ (O(N) 线性扫描 / 双指针 / 筛法)',
      rangeText: '2×10⁵ < N ≤ 10⁷',
      allowedComplexity: 'O(N)',
      models: [
        { name: '前缀和与差分数组', cat: 'search_strings', desc: '一维与二维静态区间查询与修改，O(1) 单次响应，预处理 O(N)。', route: '#search_strings/sliding_window' },
        { name: '滑动窗口 / 相向双指针', cat: 'search_strings', desc: '双指针单调同向推进，总步长 2N，O(N) 时间 O(1) 空间。', route: '#search_strings/sliding_window' },
        { name: '欧拉线性筛素数', cat: 'math_game', desc: '每个合数仅被其最小质因子筛除一次，千万级数据秒级筛完。', route: '#math_game/prime_sieve' },
        { name: 'KMP 模式匹配 / Manacher 最长回文', cat: 'search_strings', desc: '指针不回退，纯线性 O(N) 处理文本串。', route: '#search_strings/kmp' }
      ],
      antiPattern: '严禁写任何排序与二叉搜索树操作 (N log N 在千万规模下已逼近 2.4×10⁸，极易 TLE)。必须采用纯线性扫描。'
    },
    {
      scaleKey: 'N_GE_10_9',
      title: '数据规模 N ≥ 10⁹ ~ 10¹⁸ (O(log N) / O(√N) / O(1))',
      rangeText: 'N ≥ 10⁹ (大整数 / 极大值域)',
      allowedComplexity: 'O(log N) 或 O(√N) 或 O(1)',
      models: [
        { name: '快速幂与逆元计算', cat: 'math_game', desc: '二进制拆分指数，指数 10¹⁸ 仅需 60 次乘法，O(log N)。', route: '#math_game/euclidean_gcd' },
        { name: '矩阵快速幂加速递推', cat: 'math_game', desc: '求第 10¹⁸ 项斐波那契数或状态转移，O(K³ log N)。', route: '#math_game/euclidean_gcd' },
        { name: '欧几里得辗转相除法 (GCD)', cat: 'math_game', desc: '对数级求最大公约数与扩展欧几里得系数。', route: '#math_game/euclidean_gcd' },
        { name: '试除法判定质数 / 数论分块', cat: 'math_game', desc: '枚举至 √N，N=10¹² 时仅需 10⁶ 次循环。', route: '#math_game/prime_sieve' },
        { name: '博弈论 Nim 游戏与位运算公式', cat: 'math_game', desc: '全部堆异或和判定，O(1) 瞬间出解。', route: '#math_game/nim_game' }
      ],
      antiPattern: '严禁对整个数组进行遍历或开辟对应大小的数组空间（内存超限 MLE）。必须用数学推导、二分答案或矩阵加速。'
    }
  ];

  // 内部状态
  let _currentN = 200000;
  let _currentTimeLimit = 1.0;
  let _currentLang = 'cpp'; // 'cpp' | 'python'

  // DOM 节点引用
  let $modal = null;
  let $openBtn = null;
  let $closeBtn = null;
  let $closeFooterBtn = null;
  let $inputN = null;
  let $calcBtn = null;
  let $chipsContainer = null;
  let $resComplexity = null;
  let $resMaxOps = null;
  let $resCandidatesList = null;
  let $langToggle = null;
  let $resTableBody = null;
  let $resAntiPatternBox = null;
  let $resAntiPatternText = null;

  /**
   * 初始化计算器
   */
  function init() {
    cacheElements();
    bindEvents();
    renderAnalysis(_currentN);
  }

  function cacheElements() {
    $modal = document.getElementById('calculatorModal') || document.getElementById('calculator-modal');
    $openBtn = document.getElementById('openCalculatorBtn');
    $closeBtn = document.getElementById('closeCalcModalBtn') || document.getElementById('calc-modal-close');
    $closeFooterBtn = document.getElementById('closeCalcModalFooterBtn');
    $inputN = document.getElementById('calcInputN') || document.getElementById('calc-input-n');
    $calcBtn = document.getElementById('btnRunCalc');
    $chipsContainer = document.getElementById('calcPresetChips') || document.getElementById('calc-chips');
    $resComplexity = document.getElementById('resComplexity');
    $resMaxOps = document.getElementById('resMaxOps');
    $resCandidatesList = document.getElementById('resCandidatesList');
    $langToggle = document.getElementById('calcLangToggle') || document.getElementById('calc-lang-toggle');
    $resTableBody = document.getElementById('resTableBody') || document.getElementById('calcTableBody');
    $resAntiPatternBox = document.getElementById('resAntiPatternBox') || document.getElementById('calcAntiPatternBox');
    $resAntiPatternText = document.getElementById('resAntiPatternText') || document.getElementById('calcAntiPatternText');
  }

  function bindEvents() {
    // 顶部按钮打开弹窗
    if ($openBtn) {
      $openBtn.addEventListener('click', function() {
        openModal();
      });
    }

    // 关闭弹窗按钮
    if ($closeBtn) {
      $closeBtn.addEventListener('click', function() {
        closeModal();
      });
    }

    if ($closeFooterBtn) {
      $closeFooterBtn.addEventListener('click', function() {
        closeModal();
      });
    }

    // 点击背景遮罩关闭
    if ($modal) {
      $modal.addEventListener('click', function(e) {
        if (e.target === $modal) {
          closeModal();
        }
      });
    }

    // ESC 键关闭
    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isModalOpen()) {
        closeModal();
      }
    });

    // 计算按钮
    if ($calcBtn) {
      $calcBtn.addEventListener('click', function() {
        if ($inputN) {
          const val = parseN($inputN.value);
          if (val !== null && val > 0) {
            _currentN = val;
            renderAnalysis(_currentN);
          }
        }
      });
    }

    // 输入框回车
    if ($inputN) {
      $inputN.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = parseN($inputN.value);
          if (val !== null && val > 0) {
            _currentN = val;
            renderAnalysis(_currentN);
          }
        }
      });

      $inputN.addEventListener('input', function(e) {
        const val = parseN(e.target.value);
        if (val !== null && val > 0) {
          _currentN = val;
          renderAnalysis(_currentN);
        }
      });
    }

    // 预设快速 Chips
    if ($chipsContainer) {
      $chipsContainer.addEventListener('click', function(e) {
        const chip = e.target.closest('.chip-n') || e.target.closest('.calc-chip');
        if (chip) {
          const chips = $chipsContainer.querySelectorAll('.chip-n, .calc-chip');
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');

          const nVal = parseFloat(chip.getAttribute('data-val') || chip.getAttribute('data-n'));
          if (!isNaN(nVal) && nVal > 0) {
            _currentN = nVal;
            if ($inputN) {
              $inputN.value = formatRawN(nVal);
            }
            renderAnalysis(_currentN);
          }
        }
      });
    }

    // 语言基准切换 (C++ vs Python 3)
    if ($langToggle) {
      $langToggle.addEventListener('click', function(e) {
        const btn = e.target.closest('.lang-btn');
        if (btn) {
          const lang = btn.getAttribute('data-lang');
          if (lang && (lang === 'cpp' || lang === 'python')) {
            setLanguage(lang);
          }
        }
      });
    }
  }

  function formatRawN(n) {
    if (n >= 1e18) return '1e18';
    if (n >= 1e7) return '1e7';
    if (n === 200000) return '200000';
    return n.toString();
  }

  /**
   * 解析用户输入为数字 (支持科学记数法 1e5, 10^6, 0 等)
   */
  function parseN(str) {
    if (str === null || str === undefined) return null;
    if (typeof str !== 'string' && typeof str !== 'number') return null;
    let s = str.toString().trim().toLowerCase();

    // 处理 10^x 格式
    if (s.includes('^')) {
      const parts = s.split('^');
      const base = parseFloat(parts[0]);
      const exp = parseFloat(parts[1]);
      if (!isNaN(base) && !isNaN(exp)) {
        return Math.pow(base, exp);
      }
    }

    // 处理常规浮点数与科学记数法 (允许 0)
    const parsed = Number(s);
    return (!isNaN(parsed) && isFinite(parsed)) ? parsed : null;
  }

  /**
   * 阶乘安全计算函数 (防溢出)
   */
  function safeFactorial(n) {
    if (n > 20) return Infinity;
    let res = 1;
    for (let i = 2; i <= n; i++) {
      res *= i;
    }
    return res;
  }

  /**
   * 核心复杂度计算
   * @param {number} N
   * @param {number} timeLimit
   * @param {string} lang 'cpp' | 'python'
   */
  function calculateComplexity(N, timeLimit = 1.0, lang = 'cpp') {
    const baseOps = (lang === 'python') ? BASE_OPS_PYTHON : BASE_OPS_CPP;
    const maxBudget = timeLimit * baseOps;

    const log2N = Math.ceil(Math.log2(Math.max(1, N)));
    const sqrtN = Math.floor(Math.sqrt(N));

    const specs = [
      { name: 'O(1)', ops: 1 },
      { name: 'O(log N)', ops: log2N },
      { name: 'O(√N)', ops: (N > 1e16 ? Infinity : sqrtN) },
      { name: 'O(N)', ops: N },
      { name: 'O(N log N)', ops: (N > 1e8 ? Infinity : N * log2N) },
      { name: 'O(N²)', ops: (N > 1e8 ? Infinity : N * N) },
      { name: 'O(N³)', ops: (N > 1e5 ? Infinity : N * N * N) },
      { name: 'O(2^N)', ops: (N > 60 ? Infinity : Math.pow(2, N)) },
      { name: 'O(N!)', ops: safeFactorial(N) }
    ];

    let optimalComplexity = 'O(1)';

    const rows = specs.map(item => {
      let status = 'optimal';
      let statusText = '稳过 (Optimal)';
      let estMs = (item.ops / baseOps) * 1000;

      if (item.ops > 1.5 * maxBudget || item.ops === Infinity) {
        status = 'tle';
        statusText = '超时 (TLE)';
      } else if (item.ops > 0.5 * maxBudget) {
        status = 'feasible';
        statusText = '压线 (卡常风险)';
      }

      if (status === 'optimal' || status === 'feasible') {
        optimalComplexity = item.name;
      }

      return {
        ...item,
        status,
        statusText,
        estMs
      };
    });

    return {
      maxBudget,
      rows,
      optimalComplexity
    };
  }

  function formatEstMs(ms) {
    if (ms === Infinity || isNaN(ms)) return '∞';
    if (ms < 0.001) return '< 0.001 ms';
    if (ms < 1) return '< 1 ms';
    if (ms < 1000) return `${Math.round(ms)} ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)} s`;
    return `> 1 min (${(ms / 1000).toFixed(0)}s)`;
  }

  function formatNumber(num) {
    if (num === Infinity || isNaN(num)) return '∞';
    if (num >= 1e18) return (num / 1e18).toFixed(1) + ' × 10¹⁸';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' 万亿 (10¹²)';
    if (num >= 1e8) return (num / 1e8).toFixed(2) + ' 亿 (10⁸)';
    if (num >= 1e4) return (num / 1e4).toFixed(1) + ' 万 (10⁴)';
    return Math.round(num).toLocaleString('en-US');
  }

  function findMatchedCategory(N) {
    if (N <= 10) return COMPLEXITY_MODELS[0];
    if (N <= 25) return COMPLEXITY_MODELS[1];
    if (N <= 500) return COMPLEXITY_MODELS[2];
    if (N <= 5000) return COMPLEXITY_MODELS[3];
    if (N <= 200000) return COMPLEXITY_MODELS[4];
    if (N <= 10000000) return COMPLEXITY_MODELS[5];
    return COMPLEXITY_MODELS[6];
  }

  function renderAnalysis(N) {
    const analysis = calculateComplexity(N, _currentTimeLimit, _currentLang);
    const matchedCategory = findMatchedCategory(N);

    if ($resComplexity) {
      $resComplexity.textContent = `${analysis.optimalComplexity} (推荐上限)`;
    }

    if ($resMaxOps) {
      $resMaxOps.textContent = `≈ ${formatNumber(analysis.maxBudget)} ops (${_currentTimeLimit}s 时限)`;
    }

    // 渲染 9 阶 Big-O 理论耗时与可行性评测判定表
    if ($resTableBody && Array.isArray(analysis.rows)) {
      let tableHtml = '';
      analysis.rows.forEach(row => {
        const isOptimal = (row.name === analysis.optimalComplexity);
        const rowClass = isOptimal ? 'calc-row row-sweet-spot' : 'calc-row';
        const sweetTag = isOptimal ? '<span class="tag-sweet">推荐上限</span>' : '';
        const badgeClass = `status-badge badge-${row.status}`;
        const estTime = formatEstMs(row.estMs);

        tableHtml += `
          <tr class="${rowClass}">
            <td><strong>${row.name}</strong>${sweetTag}</td>
            <td>${formatNumber(row.ops)}</td>
            <td>${estTime}</td>
            <td><span class="${badgeClass}">${row.statusText}</span></td>
          </tr>
        `;
      });
      $resTableBody.innerHTML = tableHtml;
    }

    if ($resCandidatesList && matchedCategory) {
      let listHtml = '';
      matchedCategory.models.forEach(model => {
        listHtml += `<li><strong>${model.name}</strong>：${model.desc} <a href="${model.route}" style="color: var(--color-primary-hover); margin-left: 6px; text-decoration: none;" onclick="if(window.AlgoSystem && window.AlgoSystem.calculator && window.AlgoSystem.calculator.closeModal) window.AlgoSystem.calculator.closeModal();">前往演示 &rarr;</a></li>`;
      });
      $resCandidatesList.innerHTML = listHtml;
    }

    // 渲染考场反模式避坑警示
    if (matchedCategory && matchedCategory.antiPattern) {
      if ($resAntiPatternText) {
        $resAntiPatternText.textContent = matchedCategory.antiPattern;
      }
      if ($resAntiPatternBox) {
        $resAntiPatternBox.style.display = 'flex';
      }
    } else if ($resAntiPatternBox) {
      $resAntiPatternBox.style.display = 'none';
    }
  }

  function openModal() {
    if (!$modal) cacheElements();
    if ($modal) {
      $modal.classList.remove('hidden');
      document.body.classList.add('modal-open');
      if ($inputN) {
        $inputN.focus();
        $inputN.select();
      }
    }
  }

  function closeModal() {
    if ($modal) {
      $modal.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }
  }

  function isModalOpen() {
    return $modal && !$modal.classList.contains('hidden');
  }

  function setLanguage(lang) {
    _currentLang = (lang === 'python') ? 'python' : 'cpp';
    if ($langToggle) {
      const allBtns = $langToggle.querySelectorAll('.lang-btn');
      allBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === _currentLang);
      });
    }
    renderAnalysis(_currentN);
  }

  function setTimeLimit(limit) {
    const num = Number(limit);
    if (!isNaN(num) && num > 0) {
      _currentTimeLimit = num;
      renderAnalysis(_currentN);
    }
  }

  /**
   * PROJECT.md Contract Implementation:
   * window.AlgoSystem.calculator.recommend(nValue) -> { maxOps, timeComplexity, recommendedAlgos }
   */
  function recommend(nValue) {
    let num = 200000;
    if (nValue !== undefined && nValue !== null) {
      const p = parseN(nValue);
      if (p !== null) {
        if (p <= 0) {
          num = 10;
        } else {
          num = p;
        }
      }
    }
    const res = calculateComplexity(num, 1.0, 'cpp');
    const cat = findMatchedCategory(num);
    return {
      maxOps: res.maxBudget,
      timeComplexity: res.optimalComplexity,
      recommendedAlgos: cat ? cat.models : []
    };
  }

  const Calculator = {
    init: init,
    openModal: openModal,
    closeModal: closeModal,
    isModalOpen: isModalOpen,
    calculateComplexity: calculateComplexity,
    setLanguage: setLanguage,
    setTimeLimit: setTimeLimit,
    recommend: recommend,
    COMPLEXITY_MODELS: COMPLEXITY_MODELS
  };

  global.AlgoSystem.components.Calculator = Calculator;
  global.AlgoSystem.calculator = Calculator;

})(typeof window !== 'undefined' ? window : globalThis);
