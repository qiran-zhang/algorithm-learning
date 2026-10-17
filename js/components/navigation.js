/**
 * @file navigation.js
 * @description 22 Categories, 35 Algorithms Navigation Accordion, Search Filter, URL Hash Routing & Mobile Drawer.
 * @namespace window.AlgoSystem.components.Navigation
 *
 * 16th Blue Bridge Cup Algorithm Learning & Visualization Platform
 * Zero-CORS, Zero-build, file:// protocol compatible.
 */
(function(global) {
  'use strict';

  global.AlgoSystem = global.AlgoSystem || {};
  global.AlgoSystem.components = global.AlgoSystem.components || {};

  /**
   * 6 大分类与 35 个全量算法元数据注册表
   */
  const ALGO_NAV_DATA = [
    {
      id: 'sorting',
      name: '1. 基础算法与排序全品类',
      shortName: '经典排序',
      group: 'C/B',
      icon: '📊',
      algorithms: [
        { id: 'bubble_sort', name: '冒泡排序', en: 'Bubble Sort', tier: 'C组', badge: '必考基础', tags: ['交换', '稳定', 'O(N²)'], pinyin: 'maopao,mp,bubble', time: 'O(N²)', space: 'O(1)', stability: '稳定', is408: true },
        { id: 'selection_sort', name: '选择排序', en: 'Selection Sort', tier: 'C组', badge: '必考基础', tags: ['极值扫描', '不稳定', 'O(N²)'], pinyin: 'xuanze,xz,selection', time: 'O(N²)', space: 'O(1)', stability: '不稳定', is408: true },
        { id: 'insertion_sort', name: '插入排序', en: 'Insertion Sort', tier: 'C组', badge: '必考基础', tags: ['有序区扩展', '近有序O(N)', '稳定'], pinyin: 'charu,cr,insertion', time: 'O(N²)', space: 'O(1)', stability: '稳定', is408: true },
        { id: 'shell_sort', name: '希尔排序', en: 'Shell Sort', tier: 'B组', badge: '408考研', tags: ['缩小增量', '突破O(N²)', '不稳定'], pinyin: 'xier,xe,shell', time: 'O(N^1.3)', space: 'O(1)', stability: '不稳定', is408: true },
        { id: 'merge_sort', name: '归并排序', en: 'Merge Sort', tier: 'B组', badge: '408核心', tags: ['分治', '逆序对', '稳定', 'O(NlogN)'], pinyin: 'guibing,gb,merge', time: 'O(N log N)', space: 'O(N)', stability: '稳定', is408: true },
        { id: 'quick_sort', name: '快速排序 (408双指针)', en: 'Quick Sort (408)', tier: 'B组', badge: '省一必考', tags: ['Partition', '相向双指针', '第K小'], pinyin: 'kuaisupaixu,kp,quick', time: 'O(N log N)', space: 'O(log N)', stability: '不稳定', is408: true },
        { id: 'heap_sort', name: '堆排序', en: 'Heap Sort', tier: 'B组', badge: '408高频', tags: ['完全二叉树', 'sift_down', '原地排序'], pinyin: 'duipaixu,dp,heap', time: 'O(N log N)', space: 'O(1)', stability: '不稳定', is408: true },
        { id: 'counting_sort', name: '计数排序', en: 'Counting Sort', tier: 'C组', badge: '线性时间', tags: ['前缀和', '值域映射', '稳定'], pinyin: 'jishu,js,counting', time: 'O(N+K)', space: 'O(K)', stability: '稳定', is408: false },
        { id: 'radix_sort', name: '基数排序 (LSD)', en: 'Radix Sort (LSD)', tier: 'B组', badge: '408重点', tags: ['按位分配', '多关键字', '稳定'], pinyin: 'jishu,radix,lsd', time: 'O(D(N+K))', space: 'O(N+K)', stability: '稳定', is408: true },
        { id: 'bucket_sort', name: '桶排序', en: 'Bucket Sort', tier: 'B组', badge: '区间映射', tags: ['区间分发', '外部归并', '稳定'], pinyin: 'tongpaixu,tp,bucket', time: 'O(N+K)', space: 'O(N+K)', stability: '稳定', is408: false }
      ]
    },
    {
      id: 'search_strings',
      name: '2. 查找、双指针与字符串',
      shortName: '查找与字符串',
      group: 'C/B',
      icon: '🔍',
      algorithms: [
        { id: 'binary_search', name: '二分查找 (红蓝染色折半)', en: 'Binary Search', tier: 'C组', badge: '省一基石', tags: ['区间折半', '二分答案', '单调性'], pinyin: 'erfen,ef,binary,bs', time: 'O(log N)', space: 'O(1)', stability: '稳定', is408: true },
        { id: 'sliding_window', name: '滑动窗口毛毛虫', en: 'Sliding Window', tier: 'B组', badge: '高频题眼', tags: ['双指针', '左右伸缩', '连续子数组'], pinyin: 'huadongchuangkou,hc,window', time: 'O(N)', space: 'O(1)', stability: '稳定', is408: false },
        { id: 'kmp', name: 'KMP 字符串匹配 (next数组)', en: 'KMP Matcher', tier: 'B组', badge: '408考研', tags: ['next数组', '失配回退', '前缀函数'], pinyin: 'kmp,pipei', time: 'O(N+M)', space: 'O(M)', stability: '稳定', is408: true },
        { id: 'manacher', name: 'Manacher 最长回文子串', en: 'Manacher Algorithm', tier: 'B组', badge: '竞赛黑科技', tags: ['马拉车', '回文半径', '对称中心'], pinyin: 'malache,manacher,huiwen', time: 'O(N)', space: 'O(N)', stability: '稳定', is408: false }
      ]
    },
    {
      id: 'data_structures',
      name: '3. 核心数据结构与树形进阶',
      shortName: '数据结构',
      group: 'C/B/A',
      icon: '🌲',
      algorithms: [
        { id: 'monotonic_stack', name: '单调栈 (下一个更大元素)', en: 'Monotonic Stack', tier: 'B组', badge: '大题必备', tags: ['下一个更大元素', '柱状图面积', 'O(N)'], pinyin: 'dantiaozhan,dz,monostack', time: 'O(N)', space: 'O(N)', stability: '稳定', is408: false },
        { id: 'monotonic_queue', name: '单调队列 (滑动窗口最值)', en: 'Monotonic Queue', tier: 'B组', badge: 'DP优化必备', tags: ['滑动窗口最值', '双端队列', 'O(N)'], pinyin: 'dantiaoduilie,dq,monoqueue', time: 'O(N)', space: 'O(K)', stability: '稳定', is408: false },
        { id: 'binary_heap', name: '二叉堆 / 优先队列 (上浮下沉)', en: 'Binary Heap / PQ', tier: 'C组', badge: '408考点', tags: ['sift_up', 'sift_down', '动态最值'], pinyin: 'erchadui,heap,pq', time: 'O(log N)', space: 'O(N)', stability: '不稳定', is408: true },
        { id: 'dsu', name: '并查集 (路径压缩/按秩合并)', en: 'Disjoint Set Union', tier: 'B组', badge: '省一必考', tags: ['连通块', '路径压缩', '启发式合并'], pinyin: 'bingchaji,bcj,dsu', time: 'O(α(N))', space: 'O(N)', stability: '稳定', is408: true },
        { id: 'trie', name: 'Trie 字典树 (前缀检索)', en: 'Prefix Trie', tier: 'B组', badge: '高频考点', tags: ['多叉树', '前缀匹配', '异或最值'], pinyin: 'zidianshu,trie', time: 'O(L)', space: 'O(Σ·N)', stability: '稳定', is408: true },
        { id: 'fenwick_tree', name: '树状数组 (Fenwick lowbit)', en: 'Fenwick Tree (BIT)', tier: 'B组', badge: '省一进阶', tags: ['lowbit', '单点加区间查', '逆序对'], pinyin: 'shuzhuangshuzu,bit,fenwick', time: 'O(log N)', space: 'O(N)', stability: '稳定', is408: false },
        { id: 'segment_tree', name: '线段树 (区间更新Lazy标记)', en: 'Segment Tree', tier: 'B组/A组', badge: '压轴大题', tags: ['区间修改', '懒标记下传', '分治二叉树'], pinyin: 'xianduanshu,segtree', time: 'O(log N)', space: 'O(4N)', stability: '稳定', is408: false }
      ]
    },
    {
      id: 'graphs',
      name: '4. 搜索与图论全景核心',
      shortName: '图论搜索',
      group: 'C/B/A',
      icon: '🕸️',
      algorithms: [
        { id: 'bfs_maze', name: '网格迷宫 BFS (水波纹探索)', en: 'Grid BFS Wavefront', tier: 'C组', badge: '最短路基石', tags: ['FIFO队列', '层序扩展', '无权最短路'], pinyin: 'bfs,migong,breadth', time: 'O(V+E)', space: 'O(V)', stability: '稳定', is408: true },
        { id: 'dfs_maze', name: '网格迷宫 DFS (试探回溯)', en: 'Grid DFS Backtracking', tier: 'C组', badge: '爆搜必考', tags: ['递归栈', '回溯染色', '剪枝'], pinyin: 'dfs,huisu,depth', time: 'O(V+E)', space: 'O(V)', stability: '稳定', is408: true },
        { id: 'dijkstra', name: 'Dijkstra 堆优化单源最短路', en: 'Dijkstra (Heap Optimized)', tier: 'B组', badge: '省一必考', tags: ['贪心松弛', '优先队列', '非负权'], pinyin: 'dijkstra,zuiduanlu', time: 'O(E log V)', space: 'O(V)', stability: '稳定', is408: true },
        { id: 'topological_sort', name: 'Kahn 拓扑排序消入度', en: 'Topological Sort (Kahn)', tier: 'B组', badge: '408高频', tags: ['DAG', '入度消减', '判环'], pinyin: 'tuopusort,tp,topo', time: 'O(V+E)', space: 'O(V)', stability: '稳定', is408: true },
        { id: 'kruskal', name: 'Kruskal 最小生成树 (MST)', en: 'Kruskal MST', tier: 'B组', badge: '408高频', tags: ['并查集判环', '边权贪心', '稀疏图'], pinyin: 'kruskal,shengchengshu,mst', time: 'O(E log E)', space: 'O(V)', stability: '稳定', is408: true },
        { id: 'eulerian_path', name: '欧拉回路 / 通路 (Hierholzer)', en: 'Eulerian Path/Circuit', tier: 'B组', badge: '图论经典', tags: ['度数奇偶', '一笔画', '删边递归'], pinyin: 'oulahuilu,euler', time: 'O(V+E)', space: 'O(V+E)', stability: '稳定', is408: true }
      ]
    },
    {
      id: 'dp',
      name: '5. 动态规划与表格状态转移',
      shortName: '动态规划',
      group: 'C/B/A',
      icon: '📈',
      algorithms: [
        { id: 'knapsack_01', name: '0-1 背包问题 (2D/1D滚动)', en: '0-1 Knapsack', tier: 'B组', badge: 'DP核心', tags: ['容量倒序', '选与不选', '最优子结构'], pinyin: 'beibao01,bb,knapsack', time: 'O(N·W)', space: 'O(W)', stability: '稳定', is408: false },
        { id: 'knapsack_complete', name: '完全背包问题 (正序无限选)', en: 'Complete Knapsack', tier: 'B组', badge: 'DP核心', tags: ['容量正序', '无限复用', '硬币兑换'], pinyin: 'wanquanbeibao,wq,knapsack2', time: 'O(N·W)', space: 'O(W)', stability: '稳定', is408: false },
        { id: 'interval_dp', name: '区间 DP (石子合并对角推进)', en: 'Interval DP', tier: 'B组', badge: 'DP进阶', tags: ['上三角填表', '步长枚举', '合并代价'], pinyin: 'qujiandp,shizi,interval', time: 'O(N³)', space: 'O(N²)', stability: '稳定', is408: false },
        { id: 'lis', name: '最长上升子序列 (LIS 状态追踪)', en: 'Longest Increasing Subsequence', tier: 'B组', badge: '经典题眼', tags: ['前驱极值', '二分优化', '线性DP'], pinyin: 'lis,zichangshangsheng', time: 'O(N²)', space: 'O(N)', stability: '稳定', is408: false }
      ]
    },
    {
      id: 'math_game',
      name: '6. 数学、几何与博弈论',
      shortName: '数学博弈',
      group: 'C/B',
      icon: '🎲',
      algorithms: [
        { id: 'prime_sieve', name: '素数筛法 (埃氏筛 vs 欧拉线性筛)', en: 'Prime Sieve (Euler/Eratosthenes)', tier: 'C组/B组', badge: '数论基础', tags: ['最小质因子', 'O(N)线性筛', '合数标记'], pinyin: 'sushushai,oulasai,prime', time: 'O(N)', space: 'O(N)', stability: '稳定', is408: false },
        { id: 'euclidean_gcd', name: '欧几里得辗转相除法 (GCD 矩形平铺)', en: 'Euclidean GCD / ExGCD', tier: 'C组/B组', badge: '数论必考', tags: ['矩形裁剪', '裴蜀定理', '逆元'], pinyin: 'zhanzhuanxiangchu,gcd,exgcd', time: 'O(log min(a,b))', space: 'O(1)', stability: '稳定', is408: false },
        { id: 'bitmask_sandbox', name: '32位位运算全能沙盒 (lowbit)', en: 'Bitmask Manipulation Sandbox', tier: 'B组', badge: '竞赛利器', tags: ['lowbit', '掩码异或', '状态压缩'], pinyin: 'weiyunsuan,bitmask,sandbox', time: 'O(1)', space: 'O(1)', stability: '稳定', is408: false },
        { id: 'nim_game', name: '博弈论 Nim 游戏 (异或和SG计算器)', en: 'Nim Game & SG Function', tier: 'B组', badge: '博弈精要', tags: ['异或和', '必胜态必败态', 'SG定理'], pinyin: 'boyilun,nim,sg', time: 'O(1)', space: 'O(1)', stability: '稳定', is408: false }
      ]
    }
  ];

  // 算法别名映射表 (兼容不同的命名习惯)
  const ALIAS_MAP = {
    'bubble': 'bubble_sort',
    'selection': 'selection_sort',
    'insertion': 'insertion_sort',
    'shell': 'shell_sort',
    'merge': 'merge_sort',
    'quick': 'quick_sort',
    'heap': 'heap_sort',
    'counting': 'counting_sort',
    'radix': 'radix_sort',
    'bucket': 'bucket_sort',
    'topo_sort': 'topological_sort',
    'eulerian': 'eulerian_path',
    'fenwick': 'fenwick_tree',
    'heap_pq': 'binary_heap',
    'gcd_euclidean': 'euclidean_gcd',
    'bitmask': 'bitmask_sandbox'
  };

  function normalizeAlgoId(algoId) {
    if (!algoId) return 'bubble_sort';
    return ALIAS_MAP[algoId] || algoId;
  }

  // 内部状态
  let _currentCategory = 'sorting';
  let _currentAlgoId = 'bubble_sort';
  let _currentFilter = 'all';
  let _searchQuery = '';
  let _onSelectCallback = null;

  // DOM 引用
  let $sidebar = null;
  let $accordion = null;
  let $searchInput = null;
  let $clearSearchBtn = null;
  let $filterChips = null;
  let $mobileToggleBtn = null;
  let $backdrop = null;

  /**
   * 初始化导航组件
   * @param {Object} options
   * @param {Function} [options.onSelect]
   */
  function init(options) {
    options = options || {};
    _onSelectCallback = typeof options.onSelect === 'function' ? options.onSelect : null;

    $sidebar = document.getElementById('sidebarDrawer') || document.getElementById('sidebar');
    $accordion = document.getElementById('topicAccordion') || document.getElementById('sidebar-nav-list');
    $searchInput = document.getElementById('topicSearchInput') || document.getElementById('nav-search-input');
    $clearSearchBtn = document.getElementById('clearSearchBtn') || document.getElementById('nav-search-clear');
    $filterChips = document.getElementById('groupFilterChips');
    $mobileToggleBtn = document.getElementById('sidebarToggleBtn') || document.getElementById('mobile-menu-toggle');
    $backdrop = document.getElementById('sidebarBackdrop');

    if (!$backdrop) {
      $backdrop = document.createElement('div');
      $backdrop.id = 'sidebarBackdrop';
      $backdrop.className = 'sidebar-backdrop';
      document.body.appendChild($backdrop);
    }

    renderMenu();
    bindEvents();
    initRouting();
  }

  /**
   * 渲染手风琴菜单
   */
  function renderMenu() {
    if (!$accordion) return;

    let html = '';
    let totalMatched = 0;

    ALGO_NAV_DATA.forEach(cat => {
      // 过滤算法
      const matchedAlgos = cat.algorithms.filter(algo => {
        // 1. 组别过滤
        if (_currentFilter !== 'all') {
          if (_currentFilter === 'c' && !algo.tier.includes('C')) return false;
          if (_currentFilter === 'b' && !algo.tier.includes('B')) return false;
          if (_currentFilter === 'a' && !algo.tier.includes('A')) return false;
          if (_currentFilter === '408' && !algo.is408) return false;
        }

        // 2. 文本搜索过滤
        if (_searchQuery) {
          const q = _searchQuery.toLowerCase();
          const matchName = algo.name.toLowerCase().includes(q);
          const matchEn = algo.en.toLowerCase().includes(q);
          const matchId = algo.id.toLowerCase().includes(q);
          const matchPinyin = algo.pinyin && algo.pinyin.toLowerCase().includes(q);
          const matchTags = algo.tags.some(t => t.toLowerCase().includes(q));
          const matchCat = cat.name.toLowerCase().includes(q);
          return matchName || matchEn || matchId || matchPinyin || matchTags || matchCat;
        }

        return true;
      });

      if (matchedAlgos.length === 0 && (_searchQuery || _currentFilter !== 'all')) {
        return; // 过滤模式下隐藏空分类
      }

      totalMatched += matchedAlgos.length;
      const isExpanded = (cat.id === _currentCategory) || (_searchQuery.length > 0) || (_currentFilter !== 'all');

      html += `
        <div class="accordion-group" data-cat="${cat.id}">
          <button class="accordion-header" type="button" aria-expanded="${isExpanded ? 'true' : 'false'}" data-cat="${cat.id}">
            <span class="acc-icon">${cat.icon}</span>
            <span class="acc-title">${cat.name}</span>
            <span class="acc-count">${matchedAlgos.length} 算法</span>
            <svg class="chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="accordion-body ${isExpanded ? '' : 'collapsed'}">
            ${matchedAlgos.map(algo => {
              const isActive = (cat.id === _currentCategory && algo.id === _currentAlgoId);
              return `
                <button class="topic-item ${isActive ? 'active' : ''}" 
                        type="button"
                        data-cat="${cat.id}" 
                        data-algo="${algo.id}">
                  <span>${algo.name}</span>
                  ${algo.is408 ? '<span class="badge-tag tag-408">408</span>' : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    if (totalMatched === 0) {
      html = `
        <div style="padding: 24px 16px; text-align: center; color: var(--text-muted);">
          <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
          <div style="font-size: 13px;">未找到匹配算法</div>
          <div style="font-size: 11px; margin-top: 4px;">可尝试搜索拼音缩写 (如 erfen, kp, bfs)</div>
        </div>
      `;
    }

    $accordion.innerHTML = html;
  }

  /**
   * 绑定事件监听
   */
  function bindEvents() {
    // 手风琴折叠展开与算法条目选择 (事件代理)
    if ($accordion) {
      $accordion.addEventListener('click', function(e) {
        // 检查是否点击了分类头部
        const header = e.target.closest('.accordion-header');
        if (header) {
          const isExpanded = header.getAttribute('aria-expanded') === 'true';
          const body = header.nextElementSibling;
          header.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
          if (body) {
            body.classList.toggle('collapsed', isExpanded);
          }
          return;
        }

        // 检查是否点击了具体算法条目
        const item = e.target.closest('.topic-item');
        if (item) {
          const cat = item.getAttribute('data-cat');
          const algo = item.getAttribute('data-algo');
          select(cat, algo, true);
        }
      });
    }

    // 搜索输入过滤
    if ($searchInput) {
      $searchInput.addEventListener('input', function(e) {
        _searchQuery = e.target.value.trim();
        if ($clearSearchBtn) {
          $clearSearchBtn.classList.toggle('hidden', _searchQuery.length === 0);
        }
        renderMenu();
      });
    }

    // 清空搜索
    if ($clearSearchBtn) {
      $clearSearchBtn.addEventListener('click', function() {
        if ($searchInput) {
          $searchInput.value = '';
          _searchQuery = '';
          $clearSearchBtn.classList.add('hidden');
          renderMenu();
          $searchInput.focus();
        }
      });
    }

    // 组别过滤 Chips
    if ($filterChips) {
      $filterChips.addEventListener('click', function(e) {
        const chip = e.target.closest('.chip');
        if (chip) {
          const allChips = $filterChips.querySelectorAll('.chip');
          allChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          _currentFilter = chip.getAttribute('data-filter') || 'all';
          renderMenu();
        }
      });
    }

    // 移动端汉堡菜单切换
    if ($mobileToggleBtn) {
      $mobileToggleBtn.addEventListener('click', function() {
        toggleMobileDrawer();
      });
    }

    if ($backdrop) {
      $backdrop.addEventListener('click', function() {
        closeMobileDrawer();
      });
    }

    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMobileDrawer();
      }
    });
  }

  /**
   * 路由监听与解析
   */
  function initRouting() {
    window.addEventListener('hashchange', function() {
      handleRoute(window.location.hash);
    });

    if (window.location.hash) {
      handleRoute(window.location.hash);
    } else {
      select('sorting', 'bubble_sort', false);
    }
  }

  function handleRoute(hash) {
    if (!hash || hash === '#') {
      select('sorting', 'bubble_sort', false);
      return;
    }

    const clean = hash.replace(/^#\/?/, '');

    // 特殊页面路由
    if (clean === 'dashboard') {
      const tabDash = document.getElementById('tabDashboard');
      if (tabDash) tabDash.click();
      return;
    }

    if (clean === 'calculator') {
      if (global.AlgoSystem.calculator && typeof global.AlgoSystem.calculator.openModal === 'function') {
        global.AlgoSystem.calculator.openModal();
      }
      return;
    }

    const parts = clean.split('/');
    if (parts.length >= 2) {
      const cat = parts[0];
      const algo = normalizeAlgoId(parts[1]);
      if (findAlgo(cat, algo)) {
        select(cat, algo, false);
        return;
      }
    }

    // 容错降级
    select('sorting', 'bubble_sort', true);
  }

  function findAlgo(category, algoId) {
    const cat = ALGO_NAV_DATA.find(c => c.id === category);
    if (!cat) return null;
    const target = normalizeAlgoId(algoId);
    return cat.algorithms.find(a => a.id === target) || null;
  }

  /**
   * 选中算法
   * @param {string} category
   * @param {string} algoId
   * @param {boolean} updateHash
   */
  function select(category, algoId, updateHash = true) {
    const targetAlgo = normalizeAlgoId(algoId);
    const algoMeta = findAlgo(category, targetAlgo);

    _currentCategory = category;
    _currentAlgoId = targetAlgo;

    if (updateHash) {
      window.location.hash = `#${category}/${targetAlgo}`;
    }

    // 确保界面激活并展开
    renderMenu();
    updateWorkbenchHeader(category, targetAlgo, algoMeta);
    closeMobileDrawer();

    // 存储当前选中的算法
    if (global.AlgoSystem.storage && typeof global.AlgoSystem.storage.set === 'function') {
      const storageKey = (global.AlgoSystem.StorageKeys && global.AlgoSystem.StorageKeys.ACTIVE_TOPIC) || 'LANQIAO_ALGO_ACTIVE_TOPIC_V1';
      global.AlgoSystem.storage.set(storageKey, { category, algoId: targetAlgo });
    }

    // 触发全局算法切换逻辑 (互斥调用杜绝双重重载与重复 Toast)
    if (_onSelectCallback) {
      _onSelectCallback({ category, algoId: targetAlgo, meta: algoMeta });
    } else if (typeof global.AlgoSystem.switchAlgorithm === 'function') {
      global.AlgoSystem.switchAlgorithm(category, targetAlgo, algoMeta);
    }
  }

  function updateWorkbenchHeader(category, algoId, meta) {
    const catMeta = (global.AlgoSystem.CategoryMeta && global.AlgoSystem.CategoryMeta[category]);
    const catName = catMeta ? catMeta.name : category;

    const $catBadge = document.getElementById('algoCategoryBadge') || document.getElementById('currentCategoryTag');
    const $algoTitle = document.getElementById('algoTitle') || document.getElementById('currentAlgoTitle');
    const $groupBadge = document.getElementById('algoGroupBadge');
    const $408Badge = document.getElementById('algo408Badge');
    const $timeVal = document.getElementById('algoTimeComplexity');
    const $spaceVal = document.getElementById('algoSpaceComplexity');
    const $stabilityVal = document.getElementById('algoStability');
    const $complexityBadge = document.getElementById('currentComplexityBadge');

    if ($catBadge) $catBadge.textContent = catName;
    if ($algoTitle && meta) $algoTitle.textContent = `${meta.name} (${meta.en})`;
    if ($groupBadge && meta) $groupBadge.textContent = `${meta.tier} 重点`;
    if ($408Badge && meta) {
      $408Badge.style.display = meta.is408 ? 'inline-block' : 'none';
    }
    if ($timeVal && meta) $timeVal.textContent = meta.time;
    if ($spaceVal && meta) $spaceVal.textContent = meta.space;
    if ($stabilityVal && meta) $stabilityVal.textContent = meta.stability;
    if ($complexityBadge && meta) $complexityBadge.textContent = `${meta.time} / ${meta.space}`;
  }

  function toggleMobileDrawer(forceState) {
    if (!$sidebar) return;
    const isOpen = (typeof forceState === 'boolean') ? forceState : !$sidebar.classList.contains('drawer-open');
    $sidebar.classList.toggle('drawer-open', isOpen);
    if ($backdrop) {
      $backdrop.classList.toggle('active', isOpen);
    }
    document.body.classList.toggle('no-scroll', isOpen);
  }

  function closeMobileDrawer() {
    toggleMobileDrawer(false);
  }

  const Navigation = {
    init: init,
    select: select,
    getCurrent: function() {
      return { category: _currentCategory, algoId: _currentAlgoId, meta: findAlgo(_currentCategory, _currentAlgoId) };
    },
    toggleMobileDrawer: toggleMobileDrawer,
    closeMobileDrawer: closeMobileDrawer,
    categories: ALGO_NAV_DATA,
    findAlgo: findAlgo
  };

  global.AlgoSystem.components.Navigation = Navigation;
  global.AlgoSystem.navigation = Navigation;

})(typeof window !== 'undefined' ? window : globalThis);
