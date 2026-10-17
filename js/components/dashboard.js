/**
 * @file dashboard.js
 * @description 88-Step Sequential Task Planner Dashboard & 5-Dimension Knowledge Base Browser.
 * @namespace window.AlgoSystem.components.Dashboard
 *
 * 16th Blue Bridge Cup Official Syllabus (22 Categories × 4 Sub-Tasks = 88 Tasks)
 * Zero-CORS, Zero-build, file:// protocol compatible.
 */
(function(global) {
  'use strict';

  global.AlgoSystem = global.AlgoSystem || {};
  global.AlgoSystem.components = global.AlgoSystem.components || {};

  /**
   * 22 大考点门类 × 4 级分任务全景数据表 (88 任务全量定义)
   */
  const DASHBOARD_DATA = [
    // ----------------------------------------------------
    // 大学 C 组 (1 - 10 门类，共 40 任务)
    // ----------------------------------------------------
    {
      catId: 'c_01_enum',
      catNum: 1,
      catName: '枚举',
      tier: 'C组',
      difficulty: '1-3',
      is408: false,
      desc: '穷举所有可能状态，利用数学规律剔除冗余计算，考场签到首选。',
      tasks: [
        { id: 'c01_t1', type: 'learn', name: '【算法内功】枚举痛点、空间换时间剪枝与循环上下界优化', link: null, hint: '理解暴力枚举导致超时 (TLE) 的根本原因及提前跳出策略' },
        { id: 'c01_t2', type: 'easy', name: '【简单母题】LeetCode 1. 两数之和 (哈希辅助枚举)', link: 'https://leetcode.cn/problems/two-sum/', hint: '枚举右维护左，将 O(N²) 枚举优化为 O(N)' },
        { id: 'c01_t3', type: 'mid', name: '【中等突破】洛谷 P1149 [NOIP2008 提高组] 火柴棒等式', link: 'https://www.luogu.com.cn/problem/P1149', hint: '明确数字火柴棍消耗规律，确定合理枚举上界' },
        { id: 'c01_t4', type: 'hard', name: '【困难综合】LeetCode 41. 缺失的第一个正数', link: 'https://leetcode.cn/problems/first-missing-positive/', hint: '原地哈希枚举，常数空间限制' }
      ]
    },
    {
      catId: 'c_02_sort_basic',
      catNum: 2,
      catName: '基础排序 (冒泡/选择/插入)',
      tier: 'C组',
      difficulty: '2-3',
      is408: true,
      desc: '三大 O(N²) 基础比较排序，理解稳定性与元素移动交换机理。',
      tasks: [
        { id: 'c02_t1', type: 'learn', name: '【算法内功】基础排序对比：稳定性差异、逆序对本质与最坏场景', link: null, hint: '冒泡稳定、选择不稳定、插入近有序为 O(N)' },
        { id: 'c02_t2', type: 'easy', name: '【简单母题】洛谷 P1271 【深基9.例1】选举学生会', link: 'https://www.luogu.com.cn/problem/P1271', hint: '小数据量排序与桶计数思想' },
        { id: 'c02_t3', type: 'mid', name: '【中等突破】LeetCode 75. 颜色分类 (荷兰国旗问题)', link: 'https://leetcode.cn/problems/sort-colors/', hint: '三指针原地切分，快速排序核心子步骤' },
        { id: 'c02_t4', type: 'hard', name: '【困难综合】LeetCode 147. 对链表进行插入排序', link: 'https://leetcode.cn/problems/insertion-sort-list/', hint: '链表指针重定向与 408 核心大题考点' }
      ]
    },
    {
      catId: 'c_03_search_basic',
      catNum: 3,
      catName: '搜索 (BFS / DFS 基础)',
      tier: 'C组',
      difficulty: '1-5',
      is408: true,
      desc: '搜索状态树的递归展开与队列波纹探索，网格连通块与最短步数。',
      tasks: [
        { id: 'c03_t1', type: 'learn', name: '【算法内功】DFS 递归栈 vs BFS FIFO 队列：为什么 BFS 保证无权最短路？', link: null, hint: '深入理解状态空间遍历与防止成环 visited 机制' },
        { id: 'c03_t2', type: 'easy', name: '【简单母题】LeetCode 200. 岛屿数量 (网格连通块染色)', link: 'https://leetcode.cn/problems/number-of-islands/', hint: '方向数组偏移量遍历与就地沉岛' },
        { id: 'c03_t3', type: 'mid', name: '【中等突破】LeetCode 1091. 二进制矩阵中的最短路径 (8方向BFS)', link: 'https://leetcode.cn/problems/shortest-path-in-binary-matrix/', hint: '网格波纹扩展，第一条到达终点的路径即最短路径' },
        { id: 'c03_t4', type: 'hard', name: '【困难综合】洛谷 P1443 马的遍历 (多状态与国际象棋走日BFS)', link: 'https://www.luogu.com.cn/problem/P1443', hint: '二维距离数组初始标记为 -1，边界合法性检测' }
      ]
    },
    {
      catId: 'c_04_greedy',
      catNum: 4,
      catName: '贪心',
      tier: 'C组',
      difficulty: '1-5',
      is408: true,
      desc: '局部最优递推全局最优，重点在于贪心策略的可行性数学证明与反例推翻。',
      tasks: [
        { id: 'c04_t1', type: 'learn', name: '【算法内功】贪心选择性质与无后效性证明：微扰交换法法则', link: null, hint: '学会如何用“反证法/交换论证”证明贪心策略的正确性' },
        { id: 'c04_t2', type: 'easy', name: '【简单母题】LeetCode 455. 分发饼干 (双指针贪心匹配)', link: 'https://leetcode.cn/problems/assign-cookies/', hint: '双数组先排序，小饼干优先满足小胃口' },
        { id: 'c04_t3', type: 'mid', name: '【中等突破】LeetCode 435. 无重叠区间 (区间调度贪心)', link: 'https://leetcode.cn/problems/non-overlapping-intervals/', hint: '按右端点升序排序，留出更多后续空间' },
        { id: 'c04_t4', type: 'hard', name: '【困难综合】洛谷 P1080 [NOIP2012 提高组] 国王游戏', link: 'https://www.luogu.com.cn/problem/P1080', hint: '左右手乘积贪心推导 + 高精度乘除，建议学完高精度后巩固' }
      ]
    },
    {
      catId: 'c_05_simulation',
      catNum: 5,
      catName: '模拟',
      tier: 'C组',
      difficulty: '1-3',
      is408: false,
      desc: '蓝桥杯招牌大题，将复杂自然语言规则严丝合缝转化为程序逻辑。',
      tasks: [
        { id: 'c05_t1', type: 'learn', name: '【算法内功】大模拟避坑指南：模块化拆解、状态机抽象与日期 datetime', link: null, hint: '善用 Python datetime 库快速破解蓝桥杯高频日期天数题' },
        { id: 'c05_t2', type: 'easy', name: '【简单母题】蓝桥杯真题：回文日期 (年份/月份/日期有效性校验)', link: 'https://www.lanqiao.cn/problems/498/learning/', hint: '枚举前4位年份，翻转生成后4位验证合法性' },
        { id: 'c05_t3', type: 'mid', name: '【中等突破】LeetCode 54. 螺旋矩阵 (顺时针边界收缩模拟)', link: 'https://leetcode.cn/problems/spiral-matrix/', hint: '维护 top/bottom/left/right 四条边界' },
        { id: 'c05_t4', type: 'hard', name: '【困难综合】洛谷 P1042 [NOIP2003 普及组] 乒乓球 (11分制/21分制连续处理)', link: 'https://www.luogu.com.cn/problem/P1042', hint: '净胜两分规则判定与流式字符输入终止条件' }
      ]
    },
    {
      catId: 'c_06_binary_search',
      catNum: 6,
      catName: '二分',
      tier: 'C组',
      difficulty: '2-5',
      is408: true,
      desc: '单调函数区间折半，红蓝染色法解决查找边界与二分答案母题。',
      tasks: [
        { id: 'c06_t1', type: 'learn', name: '【算法内功】二分终极心法：红蓝染色法彻底终结开闭区间与死循环 + 快捷库 bisect', link: null, hint: '彻底理解 left <= right 与 mid 计算防止整型溢出' },
        { id: 'c06_t2', type: 'easy', name: '【简单母题】LeetCode 704. 二分查找 (标准有序数组二分)', link: 'https://leetcode.cn/problems/binary-search/', hint: '基础对半收缩模板' },
        { id: 'c06_t3', type: 'mid', name: '【中等突破】LeetCode 34. 查找元素的第一个和最后一个位置 (左右边界)', link: 'https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/', hint: '两次二分分别锁定首末下标' },
        { id: 'c06_t4', type: 'hard', name: '【困难综合】LeetCode 875. 爱吃香蕉的珂珂 (二分答案最大化最小值母题)', link: 'https://leetcode.cn/problems/koko-eating-bananas/', hint: '速度单调性验证 check(k) 函数设计' }
      ]
    },
    {
      catId: 'c_07_dp_1d',
      catNum: 7,
      catName: 'DP (普通一维问题)',
      tier: 'C组',
      difficulty: '3-5',
      is408: true,
      desc: '动态规划破冰，掌握最优子结构、状态定义与一维滚动数组空间压缩。',
      tasks: [
        { id: 'c07_t1', type: 'learn', name: '【算法内功】从暴力递归到记忆化搜索再到递推：DP 的核心思维链路', link: null, hint: '重叠子问题消除与 @lru_cache 魔法' },
        { id: 'c07_t2', type: 'easy', name: '【简单母题】LeetCode 70. 爬楼梯 (斐波那契一维递推)', link: 'https://leetcode.cn/problems/climbing-stairs/', hint: '滚动变量压缩至 O(1) 空间' },
        { id: 'c07_t3', type: 'mid', name: '【中等突破】LeetCode 53. 最大子数组和 (Kadane 贪心动态规划)', link: 'https://leetcode.cn/problems/maximum-subarray/', hint: 'dp[i] = max(nums[i], dp[i-1] + nums[i])' },
        { id: 'c07_t4', type: 'hard', name: '【困难综合】LeetCode 198. 打家劫舍 (状态机交替递推)', link: 'https://leetcode.cn/problems/house-robber/', hint: '选与不选的不连续极值决策' }
      ]
    },
    {
      catId: 'c_08_bignum',
      catNum: 8,
      catName: '高精度',
      tier: 'C组',
      difficulty: '1-5',
      is408: true,
      desc: '超大整数运算，Python 原生大数优势与 C++ 字符数组逐位模拟。',
      tasks: [
        { id: 'c08_t1', type: 'learn', name: '【算法内功】高精度加减乘除原理：竖式模拟、进位借位与 Python 极速降维打击', link: null, hint: 'Python 自动处理大整数，C++ 需掌握 vector<int> 模拟' },
        { id: 'c08_t2', type: 'easy', name: '【简单母题】LeetCode 415. 字符串相加 (高精度加法)', link: 'https://leetcode.cn/problems/add-strings/', hint: '双指针从低位向高位模拟竖式相加' },
        { id: 'c08_t3', type: 'mid', name: '【中等突破】LeetCode 43. 字符串相乘 (高精度乘法)', link: 'https://leetcode.cn/problems/multiply-strings/', hint: 'num1[i] * num2[j] 结果累加在 res[i+j+1] 与 res[i+j]' },
        { id: 'c08_t4', type: 'hard', name: '【困难综合】洛谷 P1932 A+B A-B A*B A/B A%B (高精度全家桶)', link: 'https://www.luogu.com.cn/problem/P1932', hint: '蓝桥杯 Python 用户直接一行流解决，C++ 选手必练大题' }
      ]
    },
    {
      catId: 'c_09_ds_linear',
      catNum: 9,
      catName: '数据结构 (栈 / 队列 / 链表)',
      tier: 'C组',
      difficulty: '2-5',
      is408: true,
      desc: '408 核心重合区！顺序存储与链式存储、FILO / FIFO 结构特性。',
      tasks: [
        { id: 'c09_t1', type: 'learn', name: '【算法内功】线性表三剑客底层：数组扩容、循环队列取模与双向链表指针断连', link: null, hint: 'Python collections.deque 双端队列 O(1) 进出原理' },
        { id: 'c09_t2', type: 'easy', name: '【简单母题】LeetCode 20. 有效的括号 (栈匹配括号)', link: 'https://leetcode.cn/problems/valid-parentheses/', hint: '左括号压栈，右括号出栈核对' },
        { id: 'c09_t3', type: 'mid', name: '【中等突破】LeetCode 206. 反转链表 (双指针原地反转)', link: 'https://leetcode.cn/problems/reverse-linked-list/', hint: 'prev/curr 双指针迭代与 408 必考真题' },
        { id: 'c09_t4', type: 'hard', name: '【困难综合】LeetCode 142. 环形链表 II (Floyd 快慢指针判圈算法)', link: 'https://leetcode.cn/problems/linked-list-cycle-ii/', hint: '快慢指针相遇后推导数学公式确定入环节点' }
      ]
    },
    {
      catId: 'c_10_math_basic',
      catNum: 10,
      catName: '初等数论',
      tier: 'C组',
      difficulty: '3-5',
      is408: false,
      desc: '质数判定、埃氏筛与线性筛、辗转相除法最大公约数 GCD。',
      tasks: [
        { id: 'c10_t1', type: 'learn', name: '【算法内功】数论基石：试除法根号N判定、埃氏筛与欧几里得辗转相除法数学证明', link: null, hint: '掌握 gcd(a, b) = gcd(b, a % b) 与切片筛' },
        { id: 'c10_t2', type: 'easy', name: '【简单母题】LeetCode 204. 计数质数 (统计 1-N 质数数量)', link: 'https://leetcode.cn/problems/count-primes/', hint: '埃拉托斯特尼筛法布尔数组标记' },
        { id: 'c10_t3', type: 'mid', name: '【中等突破】洛谷 P1029 [NOIP2001 普及组] 最大公约数和最小公倍数问题', link: 'https://www.luogu.com.cn/problem/P1029', hint: '利用 P * Q = X0 * Y0 与质因数分解穷举' },
        { id: 'c10_t4', type: 'hard', name: '【困难综合】洛谷 P3383 【模板】线性筛素数 (欧拉筛法)', link: 'https://www.luogu.com.cn/problem/P3383', hint: '每个合数仅被其最小质因数筛掉一次，实现纯 O(N)' }
      ]
    },

    // ----------------------------------------------------
    // 大学 B 组 (11 - 18 门类，共 32 任务)
    // ----------------------------------------------------
    {
      catId: 'b_11_sort_advanced',
      catNum: 11,
      catName: '高级排序 (归并/快排/堆/桶/基数)',
      tier: 'B组',
      difficulty: '4-5',
      is408: true,
      desc: '突破 O(N²) 界限的高效分治排序与非比较线性时间排序全集。',
      tasks: [
        { id: 'b11_t1', type: 'learn', name: '【算法内功】O(NlogN) 分治双雄与非比较排序：Partition 轴心切分、堆维护与桶划分', link: null, hint: '掌握 408 核心快排原地双指针划分与归并逆序对' },
        { id: 'b11_t2', type: 'easy', name: '【简单母题】LeetCode 912. 排序数组 (快速排序 / 归并排序模板)', link: 'https://leetcode.cn/problems/sort-an-array/', hint: '三数取中避免最坏 O(N²) 退化' },
        { id: 'b11_t3', type: 'mid', name: '【中等突破】LeetCode 215. 数组中的第 K 个最大元素 (Quickselect 快速选择)', link: 'https://leetcode.cn/problems/kth-largest-element-in-an-array/', hint: '平均 O(N) 期望时间复杂度求第 K 大' },
        { id: 'b11_t4', type: 'hard', name: '【困难综合】LeetCode 剑指Offer 51. 数组中的逆序对', link: 'https://leetcode.cn/problems/shu-zu-zhong-de-ni-xu-dui-lcof/', hint: '归并排序合并过程统计跨区间逆序对，或树状数组解决' }
      ]
    },
    {
      catId: 'b_12_search_advanced',
      catNum: 12,
      catName: '搜索进阶 (剪枝/双向BFS/记忆化/IDA*/A*)',
      tier: 'B组',
      difficulty: '4-7',
      is408: false,
      desc: '搜索状态剪枝优化，双向扩展、记忆化搜索与启发式估价函数。',
      tasks: [
        { id: 'b12_t1', type: 'learn', name: '【算法内功】四大剪枝策略（可行性、最优性、顺序、记忆化）与 A* 启发式原理', link: null, hint: '搜索树爆炸时如何利用估价函数 h(n) <= h*(n) 引导搜索' },
        { id: 'b12_t2', type: 'easy', name: '【简单母题】LeetCode 39. 组合总和 (回溯剪枝)', link: 'https://leetcode.cn/problems/combination-sum/', hint: '先排序，当前和超过 target 时提前 break' },
        { id: 'b12_t3', type: 'mid', name: '【中等突破】LeetCode 127. 单词接龙 (双向 BFS 空间折半探索)', link: 'https://leetcode.cn/problems/word-ladder/', hint: '首尾两端交替向中间波纹扩展，搜索空间从 b^d 降至 2*b^(d/2)' },
        { id: 'b12_t4', type: 'hard', name: '【困难综合】洛谷 P1379 八数码难题 (A* 算法与曼哈顿距离估价)', link: 'https://www.luogu.com.cn/problem/P1379', hint: '康托展开状态哈希，优先队列按 f = g + h 出队' }
      ]
    },
    {
      catId: 'b_13_dp_advanced',
      catNum: 13,
      catName: 'DP 进阶 (背包/树形/状压/数位/DP优化)',
      tier: 'B组',
      difficulty: '4-7',
      is408: false,
      desc: '动态规划大成：背包系列、树上染色决策、位运算掩码状压与单调队列优化。',
      tasks: [
        { id: 'b13_t1', type: 'learn', name: '【算法内功】背包全家桶空间压缩机制（01倒序/完全正序）与状压位掩码', link: null, hint: '树形 DP 换根法、数位 DP 记忆化搜索框架' },
        { id: 'b13_t2', type: 'easy', name: '【简单母题】LeetCode 416. 分割等和子集 (0-1 背包母题)', link: 'https://leetcode.cn/problems/partition-equal-subset-sum/', hint: '转化为容量为 sum/2 的背包是否能恰好装满' },
        { id: 'b13_t3', type: 'mid', name: '【中等突破】LeetCode 300. 最长递增子序列 LIS (动态规划与二分贪心)', link: 'https://leetcode.cn/problems/longest-increasing-subsequence/', hint: 'O(N²) DP 递推进阶到 O(NlogN) 耐心排序扑克牌二分法' },
        { id: 'b13_t4', type: 'hard', name: '【困难综合】洛谷 P1352 没有上司的舞会 (经典树形 DP)', link: 'https://www.luogu.com.cn/problem/P1352', hint: 'dp[u][0/1] 记录上司选或不选，后序 DFS 自底向上合并' }
      ]
    },
    {
      catId: 'b_14_strings',
      catNum: 14,
      catName: '字符串 (哈希 / KMP / Manacher)',
      tier: 'B组',
      difficulty: '4-6',
      is408: true,
      desc: 'Rolling Hash 极速对比、KMP next 数组失配指针、Manacher 线性最长回文。',
      tasks: [
        { id: 'b14_t1', type: 'learn', name: '【算法内功】KMP 前缀函数失配指针数学推导与 Manacher 回文半径对称映射', link: null, hint: '掌握字符串哈希双模数防冲突与 KMP 在 408 中的手工计算 next' },
        { id: 'b14_t2', type: 'easy', name: '【简单母题】LeetCode 28. 找出字符串中第一个匹配项 (KMP 匹配模板)', link: 'https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/', hint: '构建 next 数组进行主串零回退匹配' },
        { id: 'b14_t3', type: 'mid', name: '【中等突破】LeetCode 5. 最长回文子串 (中心扩展与 Manacher 马拉车)', link: 'https://leetcode.cn/problems/longest-palindromic-substring/', hint: '插入特殊字符 # 统一奇偶长度，维护最大右边界 R 与中心 C' },
        { id: 'b14_t4', type: 'hard', name: '【困难综合】洛谷 P3370 【模板】字符串哈希 (滚动哈希冲突防范)', link: 'https://www.luogu.com.cn/problem/P3370', hint: '选取底数 Base=131, Mod=1e9+7，实现 O(1) 区间哈希比较' }
      ]
    },
    {
      catId: 'b_15_graph_theory',
      catNum: 15,
      catName: '图论 (最短路/生成树/拓扑/连通性/LCA)',
      tier: 'B组',
      difficulty: '5-7',
      is408: true,
      desc: '408 与蓝桥杯高分核心：Dijkstra/Floyd、Kruskal/Prim、Tarjan 强连通分量与 LCA。',
      tasks: [
        { id: 'b15_t1', type: 'learn', name: '【算法内功】最短路四剑客适用矩阵、并查集贪心生成树与倍增 LCA 原理', link: null, hint: 'Dijkstra 非负权松弛、Bellman-Ford 负权环检测、Floyd 三重循环' },
        { id: 'b15_t2', type: 'easy', name: '【简单母题】LeetCode 207. 课程表 (Kahn 拓扑排序有向图判环)', link: 'https://leetcode.cn/problems/course-schedule/', hint: '入度数组统计，入度为 0 节点进队列消边' },
        { id: 'b15_t3', type: 'mid', name: '【中等突破】洛谷 P4779 【模板】单源最短路径 (Dijkstra 堆优化标准版)', link: 'https://www.luogu.com.cn/problem/P4779', hint: '优先队列 pair(dis, u) 维护未访问最小距离' },
        { id: 'b15_t4', type: 'hard', name: '【困难综合】洛谷 P3379 【模板】最近公共祖先 (LCA 树上倍增法)', link: 'https://www.luogu.com.cn/problem/P3379', hint: 'fa[u][i] 预处理 2^i 级祖先，对齐深度后同步跳跃' }
      ]
    },
    {
      catId: 'b_16_math_advanced',
      catNum: 16,
      catName: '数学 (排列组合/二项式/容斥/逆元/高斯消元)',
      tier: 'B组',
      difficulty: '5-7',
      is408: false,
      desc: '费马小定理求逆元、矩阵快速幂加速递推、高斯消元解线性方程组。',
      tasks: [
        { id: 'b16_t1', type: 'learn', name: '【算法内功】模意义下的除法变乘法：乘法逆元与矩阵乘法快速幂原理', link: null, hint: '快速幂 pow(a, p-2, p) 费马小定理与杨辉三角组合数预处理' },
        { id: 'b16_t2', type: 'easy', name: '【简单母题】LeetCode 50. Pow(x, n) (二分快速幂)', link: 'https://leetcode.cn/problems/powx-n/', hint: '二进制拆分指数，实现 O(log N) 快速幂' },
        { id: 'b16_t3', type: 'mid', name: '【中等突破】洛谷 P3811 【模板】乘法逆元 (三种逆元求法)', link: 'https://www.luogu.com.cn/problem/P3811', hint: '线性递推求 1-N 的乘法逆元 inv[i] = (p - p/i) * inv[p%i] % p' },
        { id: 'b16_t4', type: 'hard', name: '【困难综合】洛谷 P3389 【模板】高斯消元法 (线性方程组消元求解)', link: 'https://www.luogu.com.cn/problem/P3389', hint: '列主元消去法，判定唯一解、无解或无穷多解' }
      ]
    },
    {
      catId: 'b_17_ds_advanced',
      catNum: 17,
      catName: '高级数据结构 (ST表/树状数组/线段树/Trie/并查集)',
      tier: 'B组',
      difficulty: '5-7',
      is408: true,
      desc: '区间最值 RMQ、lowbit 动态前缀和与区间批量修改 Lazy 线段树。',
      tasks: [
        { id: 'b17_t1', type: 'learn', name: '【算法内功】RMQ 倍增 ST 表、树状数组 lowbit 原理与线段树区间懒标记传递', link: null, hint: '深入理解线段树 push_down 与 push_up 维护区间和' },
        { id: 'b17_t2', type: 'easy', name: '【简单母题】LeetCode 208. 实现 Trie 前缀树 (字典树构建与查询)', link: 'https://leetcode.cn/problems/implement-trie-prefix-tree/', hint: '26 叉树节点映射与 isEnd 单词终结标记' },
        { id: 'b17_t3', type: 'mid', name: '【中等突破】洛谷 P3374 【模板】树状数组 1 (单点增加，区间求和)', link: 'https://www.luogu.com.cn/problem/P3374', hint: 'lowbit(x) = x & -x，单点更新与前缀和查询 O(log N)' },
        { id: 'b17_t4', type: 'hard', name: '【困难综合】洛谷 P3372 【模板】线段树 1 (区间加法与区间求和)', link: 'https://www.luogu.com.cn/problem/P3372', hint: '懒标记 (Lazy Tag) 延迟下发，蓝桥杯大题压轴利器' }
      ]
    },
    {
      catId: 'b_18_geom_game',
      catNum: 18,
      catName: '计算几何与博弈 (位置判定/概率论/博弈论SG)',
      tier: 'B组',
      difficulty: '6-7+',
      is408: false,
      desc: '二维向量叉乘判定线段相交、马尔可夫链期望 DP、Nim 游戏与 SG 函数。',
      tasks: [
        { id: 'b18_t1', type: 'learn', name: '【算法内功】向量叉乘的几何物理意义与 Sprague-Grundy (SG) 定理', link: null, hint: '异或和为 0 的必败态判定与 mex 运算定义' },
        { id: 'b18_t2', type: 'easy', name: '【简单母题】LeetCode 292. Nim 游戏 (巴什博弈取石子)', link: 'https://leetcode.cn/problems/nim-game/', hint: 'n % 4 != 0 则先手必胜' },
        { id: 'b18_t3', type: 'mid', name: '【中等突破】洛谷 P2197 【模板】nim 游戏 (经典多堆石子异或和)', link: 'https://www.luogu.com.cn/problem/P2197', hint: '所有堆石子数异或和 XOR != 0 则先手必胜' },
        { id: 'b18_t4', type: 'hard', name: '【困难综合】LeetCode 837. 新 21 点 (概率与期望滑动窗口 DP)', link: 'https://leetcode.cn/problems/new-21-game/', hint: '概率逆推与滑动窗口优化状态转移求和' }
      ]
    },

    // ----------------------------------------------------
    // 大学 A 组 / 研究生组高阶全景 (19 - 22 门类，共 16 任务)
    // ----------------------------------------------------
    {
      catId: 'a_19_strings_master',
      catNum: 19,
      catName: '高级字符串 (AC自动机/后缀数组SA/SAM/回文树)',
      tier: 'A组/研',
      difficulty: '7-10',
      is408: false,
      desc: '多模式串匹配 AC 自动机、后缀数组 SA 与后缀自动机 SAM。',
      tasks: [
        { id: 'a19_t1', type: 'learn', name: '【算法内功】Trie 树加 KMP 失配指针生成 AC 自动机，以及后缀数组高度数组 height', link: null, hint: '多模串匹配在有向无环图上的失配转移' },
        { id: 'a19_t2', type: 'easy', name: '【简单母题】洛谷 P3808 【模板】AC 自动机 (简单版)', link: 'https://www.luogu.com.cn/problem/P3808', hint: '构建 fail 指针与 BFS 字典树遍历' },
        { id: 'a19_t3', type: 'mid', name: '【中等突破】洛谷 P3809 【模板】后缀排序 (SA 倍增算法)', link: 'https://www.luogu.com.cn/problem/P3809', hint: '倍增法基数排序构造 sa 数组与 rk 数组' },
        { id: 'a19_t4', type: 'hard', name: '【困难综合】洛谷 P3804 【模板】后缀自动机 (SAM 线性构建)', link: 'https://www.luogu.com.cn/problem/P3804', hint: 'endpos 等价类状态机，解决所有子串统计问题' }
      ]
    },
    {
      catId: 'a_20_network_flow',
      catNum: 20,
      catName: '高级图论 (网络流 / 一般图匹配)',
      tier: 'A组/研',
      difficulty: '8-10',
      is408: false,
      desc: '最大流最小割定理、Dinic 增广路算法与最小费用最大流 MCMF。',
      tasks: [
        { id: 'a20_t1', type: 'learn', name: '【算法内功】网络流三定律：容量限制、斜对称性与流量守恒，残量网络反向边原理', link: null, hint: '反向弧允许流量“反悔”，BFS 分层与 DFS 当前弧优化' },
        { id: 'a20_t2', type: 'easy', name: '【简单母题】洛谷 P3376 【模板】网络最大流 (Dinic 算法标准版)', link: 'https://www.luogu.com.cn/problem/P3376', hint: '分层图 BFS 标记深度，多路增广 DFS' },
        { id: 'a20_t3', type: 'mid', name: '【中等突破】洛谷 P3381 【模板】最小费用最大流 (MCMF)', link: 'https://www.luogu.com.cn/problem/P3381', hint: 'SPFA 寻找费用最短增广路进行消圈' },
        { id: 'a20_t4', type: 'hard', name: '【困难综合】洛谷 P2763 试题库问题 (二分图多重匹配转网络流模型)', link: 'https://www.luogu.com.cn/problem/P2763', hint: '建立超级源点 S 与超级汇点 T 求解最大流割集' }
      ]
    },
    {
      catId: 'a_21_math_master',
      catNum: 21,
      catName: '高等数学 (生成函数/莫比乌斯反演/快速傅里叶FFT)',
      tier: 'A组/研',
      difficulty: '8-10',
      is408: false,
      desc: '普通生成函数 OGF、莫比乌斯反演狄利克雷卷积与 FFT/NTT 快速多项式乘法。',
      tasks: [
        { id: 'a21_t1', type: 'learn', name: '【算法内功】多项式点值表示法与单位复数根性质：FFT 分治蝶形运算推导', link: null, hint: '把多项式乘法从 O(N²) 降低到 O(N log N) 的数学突破' },
        { id: 'a21_t2', type: 'easy', name: '【简单母题】洛谷 P3803 【模板】多项式乘法 (FFT 快速傅里叶变换)', link: 'https://www.luogu.com.cn/problem/P3803', hint: '位逆序置换与蝶形迭代运算' },
        { id: 'a21_t3', type: 'mid', name: '【中等突破】洛谷 P3455 [POI2007] ZAP-Queries (莫比乌斯反演基础)', link: 'https://www.luogu.com.cn/problem/P3455', hint: '整除分块加速求和，线性筛预处理 μ 函数' },
        { id: 'a21_t4', type: 'hard', name: '【困难综合】洛谷 P4721 【模板】分治乘法 (NTT 原根快速数论变换)', link: 'https://www.luogu.com.cn/problem/P4721', hint: '取模 998244353 原根 g=3 消除浮点数精度误差' }
      ]
    },
    {
      catId: 'a_22_ds_master',
      catNum: 22,
      catName: '顶级数据结构 (树链剖分/动态开点/平衡树/可持久化/LCT)',
      tier: 'A组/研',
      difficulty: '7-10',
      is408: false,
      desc: '树上路径转线性区间重链剖分、手写 Treap/Splay、可持久化主席树。',
      tasks: [
        { id: 'a22_t1', type: 'learn', name: '【算法内功】重儿子与重链剖分原理、可持久化线段树历史版本复用机制', link: null, hint: '树上操作全部映射到 DFS 序后借助线段树维护' },
        { id: 'a22_t2', type: 'easy', name: '【简单母题】洛谷 P3384 【模板】重链剖分 / 树链剖分', link: 'https://www.luogu.com.cn/problem/P3384', hint: '两遍 DFS 划分轻重链，跳重链更新路径与子树' },
        { id: 'a22_t3', type: 'mid', name: '【中等突破】洛谷 P3834 【模板】可持久化线段树 2 (主席树静态区间第K小)', link: 'https://www.luogu.com.cn/problem/P3834', hint: '前缀和权值线段树历史版本，在 root[r] - root[l-1] 上二分' },
        { id: 'a22_t4', type: 'hard', name: '【困难综合】洛谷 P3369 【模板】普通平衡树 (Treap / FHQ-Treap 分裂合并)', link: 'https://www.luogu.com.cn/problem/P3369', hint: '按值或按大小分裂，无须复杂旋转即可支持插入、删除、排名' }
      ]
    }
  ];

  // =========================================================================
  // 35 大独立算法五维精准深度档案 (小类粒度全量覆盖)
  // =========================================================================
  const SINGLE_ALGO_5D_DATA = [
    // 1. 冒泡排序
    {
      id: 'bubble_sort',
      name: '冒泡排序',
      en: 'Bubble Sort',
      category: '基础排序',
      catId: 'c_02_sort_basic',
      tier: 'C组',
      difficulty: '1',
      is408: true,
      dimensions: {
        origin: '早期计算机对无序数据进行排序时，缺乏高效算法。最朴素想法是“相邻两两比对，逆序则交换”，像水底气泡一样逐步浮出最大值。痛点是即便数组几乎有序，原始冒泡仍会傻傻执行 O(N²) 次比较，对于大规模数据（N ≥ 10⁵）耗时超数秒直接 TLE。',
        principle: '利用相邻元素两两比较与局部交换，每经过一轮扫描，当前未排序区间的最大值必然沉底至区间末端。核心灵感引入 swapped 标志位：若某一轮完整扫描未发生任何元素交换，证明全局已呈现单调有序，可提前 break 终止循环。',
        applicability: '适用于教学演示、考研 408 基础概念考察（稳定性识别）、极小规模序列（N ≤ 50）或近乎完全有序的数据。考场题眼：“必须稳定排序”、“相邻元素只允许两两交换”。',
        features: '时间复杂度最好 O(N)（带标志位且已初序），平均与最坏 O(N²)；空间复杂度 O(1) 原地排序；稳定排序（相等元素不交换）。',
        libraries: 'Python 中无需手写冒泡，通用排序直接用 arr.sort() 或 sorted(arr)（底层为 Timsort，时间 O(N log N) 且稳定）；C++ 直接调用 std::stable_sort(arr.begin(), arr.end()) 保障稳定性。'
      },
      eli5: {
        origin: '想象体育课一排高矮不一的同学按身高从矮到高排队，老师如果是个近视眼，每次只能看清紧挨着的两个同学。最笨的办法就是从排头走到排尾，只要看到左边比右边高就让他俩换位置。但痛点是：如果全班本来就已经排好队了，近视眼老师还是傻乎乎地来回走几十趟，人一多（比如 10 万人）当场累趴下超时。',
        principle: '【手把手小剧场】拿 `[5, 3, 8, 1]` 举例：第 1 轮从左往右两两比对：`5` 和 `3` 比，`5` 大则换位变成 `[3, 5, 8, 1]`；接着 `5` 和 `8` 比不用换；`8` 和 `1` 比换位变成 `[3, 5, 1, 8]`——看！全场最大的 `8` 像最重的铁球一样沉到了最右边（或者说轻气泡浮到了左边）！每走完一轮，最右边就多一个锁定不动的最高个子。聪明人的灵感是配一个记事本 `swapped`：如果哪一轮从头走到尾**一次换位都没发生**，说明全班早就排齐了，直接吹哨收工（`break`）！',
        applicability: '【做题暗号】① 题目明确问你“每次只允许交换相邻的两个元素，最少交换几次能排好序”；② 408 选择题问你“第一趟排序后最后一个元素必定就位且稳定的排序是哪个”；③ 数据量极小（几十个数）或者数据本来就基本排好序了。',
        features: '【大白话算账】① **快不快**：慢！1 万个数要比对约 5000 万次，只适合已经差不多排好序的情况（走一趟就停）；② **省不省地**：极省！就在原座位上两两换位置，不需要借用额外空椅子（空间 `O(1)`）；③ **稳不稳**：非常稳！如果小明和小红一样高（都是 170cm），小明原本站在小红左边，因为只有“左边严格高于右边（`>`）”才换位，相等不换，排完序小明一定还在小红左边。',
        libraries: '【考场抄近道】正式比赛千万别自己手写两层循环冒泡（必超时 TLE）！Python 直接写 `arr.sort()`（原地排好）或 `sorted(arr)`（返回新列表）；C++ 直接写 `std::sort(arr.begin(), arr.end())`，底层会自动用超快的混合算法 0.01 秒搞定。'
      }
    },
    // 2. 选择排序
    {
      id: 'selection_sort',
      name: '选择排序',
      en: 'Selection Sort',
      category: '基础排序',
      catId: 'c_02_sort_basic',
      tier: 'C组',
      difficulty: '1',
      is408: true,
      dimensions: {
        origin: '冒泡排序虽然直观，但在逆序严重时频繁交换内存，写操作开销极其昂贵。计算机科学家构想：能否每一轮仅定位最小值下标，每轮只发生至多一次交换？选择排序由此诞生。',
        principle: '将数组划分为“已排序前缀”与“未排序后缀”。每轮在未排序后缀中线性扫描找出绝对最小值（记其下标为 min_idx），随后将其与未排序区间的第一个元素进行一次交换。',
        applicability: '写操作成本极高而读操作廉价的特殊硬件或存储介质；408 数据结构真题高频考察“第 k 趟排序后的状态”。',
        features: '无论数据初始状态如何，比较次数恒为 N(N-1)/2，时间复杂度最好/最坏/平均恒为 O(N²)；空间 O(1)；不稳定排序（如 [5, 8, 5, 2] 第一趟将首位 5 与 2 交换后破坏了两个 5 的相对次序）。',
        libraries: 'Python 使用 min(arr) 与下标查找；C++ STL 提供 std::min_element(arr.begin() + i, arr.end()) 可快速获取区间最小迭代器。'
      },
      eli5: {
        origin: '冒泡排序有个坏毛病：只要看见逆序就立刻让两个人起身换座位，一趟下来全班同学屁股抬起坐下几十次（写内存次数太多）。于是有人想：能不能先只用眼睛看、拿手指记下最矮那个人坐哪儿，等整排看完了，再让他和排头换一次座位？',
        principle: '【手把手小剧场】还是排 `[5, 3, 8, 1]`：第 1 轮我们要填 0 号座位。先用左手按住 0 号位的 `5`（暂定它最小，`min_idx = 0`），右手探针往后扫：看到 `3` 比 `5` 小，左手改指着 `3` 的位置（还不换座位！）；看到 `8` 跳过；看到 `1` 比 `3` 还小，左手改指着 `1` 的位置。扫到底后，左手锁定的 `1` 就是全场最矮，让 `1` 和 0 号位的 `5` 一次性对调，变成 `[1, 3, 8, 5]`！每轮只换一次座位，省力极了。',
        applicability: '【做题暗号】① 搬运物品代价极高（比如交换两个大箱子很累，但用眼睛看贴纸数字很轻松），要求“元素交换次数最少”；② 408 真题问“哪种排序的比较次数与初始数组是否有序完全无关（不管排没排好都要傻看 N(N-1)/2 次）”。',
        features: '【大白话算账】① **快不快**：依然慢！哪怕全班本来就是整齐的，它也会固执地每一轮从头看到尾（最好最坏都是 `O(N²)`）；② **省不省地**：就在原位对调，零额外空间；③ **稳不稳（易错考点）**：**不稳定！** 举个活生生的反例：`[5a, 8, 5b, 2]`（两个 5 分前后），第 1 轮找到全场最小是末尾的 `2`，把排头的 `5a` 和末尾的 `2` 远距离对调后变成 `[2, 8, 5b, 5a]`——原本在前面的 `5a` 直接飞到了 `5b` 后面！',
        libraries: '【考场抄近道】如果只想找数组里最小值的下标：Python 直接用 `min_idx = arr.index(min(arr))`；C++ 用 `int min_idx = min_element(arr.begin(), arr.end()) - arr.begin();`，一行搞定。'
      }
    },
    // 3. 插入排序
    {
      id: 'insertion_sort',
      name: '插入排序',
      en: 'Insertion Sort',
      category: '基础排序',
      catId: 'c_02_sort_basic',
      tier: 'C组',
      difficulty: '2',
      is408: true,
      dimensions: {
        origin: '现实生活中人类整理扑克牌时，绝不会反复全量比较，而是摸一张新牌插入到已理好的手牌中。老算法无法高效处理流式动态到来的新元素。',
        principle: '构建有序序列。对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并腾挪后移插入。近乎有序的数据下几乎无需移位。',
        applicability: '小规模数组（N ≤ 30）或基本有序序列；常作为高级分治排序（如快速排序、归并排序、Timsort）递归到底层的剪枝基石。',
        features: '时间复杂度最好 O(N)（完全升序），最坏/平均 O(N²)；空间 O(1) 原地操作；稳定排序；自适应性极佳。',
        libraries: 'Python 内置库 bisect.insort(arr, x) 可利用二分查找快速将元素有序插入列表；C++ 使用 std::upper_bound 结合 vector::insert。'
      },
      eli5: {
        origin: '想想你平时斗地主摸扑克牌是怎么理牌的？你绝对不会把 17 张牌全摸完摊在桌上一遍遍找最小值，而是左手捏着已经排好序的牌，右手每摸起一张新牌，就往左手里从右往左比对，插进合适的位置。',
        principle: '【手把手小剧场】理牌 `[5, 3, 8, 1]`：起初左手只有一张 `[5]`（单张牌天然排好序）。① 摸起 `3`（拎在半空叫 `key`），和左手的 `5` 比，`5` 比 `3` 大，就把 `5` 往右挪一格腾出空位，把 `3` 插进去变成 `[3, 5]`；② 摸起 `8`，比左手的 `5` 大，不用挪，直接排在末尾得 `[3, 5, 8]`；③ 摸起 `1`，先让 `8` 右移、再让 `5` 右移、再让 `3` 右移，最后把 `1` 插到最左边的空位，变成 `[1, 3, 5, 8]`！',
        applicability: '【做题暗号】① 数据像流水一样一个接一个发给你，要求随时保持手头数据有序；② 数组“几乎已经排好序了，只有个别元素放错了位置”——此时插入排序几乎不用挪牌，一扫而过速度堪比光速 `O(N)`！',
        features: '【大白话算账】① **快不快**：平时很慢（`O(N²)`），但遇到“基本有序”的数组直接起飞变成 `O(N)`！所以 Python 和 C++ 标准库在切分到最后只剩十几个元素时，都会偷偷切换成插入排序收尾；② **稳不稳**：稳！摸起新牌遇到一样大的老牌时，乖乖插在老牌右边，绝不插队。',
        libraries: '【考场抄近道】想往一个已经排好序的数组里动态插一个新数并保持有序：Python 千万别重新 `.sort()`，直接 `import bisect; bisect.insort(arr, x)` 二分定位插入；C++ 用 `arr.insert(upper_bound(arr.begin(), arr.end(), x), x);`。'
      }
    },
    // 4. 希尔排序
    {
      id: 'shell_sort',
      name: '希尔排序',
      en: 'Shell Sort',
      category: '进阶排序',
      catId: 'b_01_sort_advanced',
      tier: 'B组',
      difficulty: '3',
      is408: true,
      dimensions: {
        origin: '直接插入排序每次只能将元素移动一位，若一个极小元素恰好在数组最末端，必须将其一步一步前移 N 次，效率大打折扣。Donald Shell 在 1959 年打破了 O(N²) 排序算法的算力天花板。',
        principle: '步长增量分组插入排序。设置递减步长增量序列（如 gap = n/2, n/4, ..., 1），对相同距离的分组进行直接插入排序。随着 gap 缩小，整个序列宏观上趋向于“基本有序”，使最终 gap=1 的插入排序以极快速度完成。',
        applicability: '中等规模数据（N ≤ 10⁴），不需要使用递归且对栈空间有极度严苛限制（如嵌入式单片机竞赛）场景；408 常考增量序列分析。',
        features: '时间复杂度取决于增量序列选取（Hibbard 序列为 O(N^1.5)，Sedgewick 序列可达 O(N^4/3)）；空间 O(1)；不稳定排序（同值元素在不同分组中相对位置可能颠倒）。',
        libraries: '竞赛与蓝桥杯通常不手写希尔排序，若规模达到 10⁴ 以上建议直接使用 Python arr.sort() 或 C++ std::sort()。'
      },
      eli5: {
        origin: '插入排序怕什么？怕最小的乌龟住在数组最右边（比如 `[9, 8, 7, 6, 5, 1]` 里的 `1`），因为插入排序每次只能挪一格，`1` 要一步步挪到排头得挪 N 次。希尔老爷子想：能不能让元素先跨着大步子（比如隔 4 格一跳）交换，让排尾的小乌龟几大步就跳到排头附近，最后再做一遍微调？',
        principle: '【手把手小剧场】假设有 8 个数，我们先定步长 `gap = 4`：把第 `0, 4` 号分一组、第 `1, 5` 号分一组、第 `2, 6` 号分一组、第 `3, 7` 号分一组，每组内部各自做插入排序——这样哪怕在最末尾的第 7 号元素，一步就能跨越 4 格跳到第 3 号！接着步长缩半为 `gap = 2`（奇偶位置各成一组精调），最后步长变为 `gap = 1` 做普通插入排序。因为前面几轮跨步已经把数组理得八九不离十了，最后一轮几乎不用挪动就瞬间完成！',
        applicability: '【做题暗号】基本只出现在 **408 考研数据结构选择题**里！常考题型：给你一个数组和增量 `d = 3`，问你“一趟希尔排序后的数组长什么样”（窍门：把下标除以 `3` 余数相同的元素用同色笔圈出来，在圈内单独从小到大排好再填回去即可！）。',
        features: '【大白话算账】① **快不快**：人类历史上第一个突破 `O(N²)` 魔咒的算法，大约 `O(N^1.3)`；② **稳不稳**：**不稳定！** 因为两个相同的数可能一个被分在偶数步长组、一个被分在奇数步长组，各自跨大步跳跃时很容易擦肩而过把先后顺序搞反。',
        libraries: '【考场抄近道】机试做题永远不需要手写希尔排序，直接调 `arr.sort()` / `std::sort()`；但在笔试遇到希尔排序手算题时，记住“隔 `gap` 个挑出来单独排”就能 10 秒拿分。'
      }
    },
    // 5. 归并排序
    {
      id: 'merge_sort',
      name: '归并排序',
      en: 'Merge Sort',
      category: '进阶排序',
      catId: 'b_01_sort_advanced',
      tier: 'B组',
      difficulty: '4',
      is408: true,
      dimensions: {
        origin: '约翰·冯·诺依曼在 1945 年提出。痛点在于普通比较排序难以将大规模问题严格降维到稳定的线性对数级，且外排序（海量数据无法一次性装入内存）缺乏通用方案。',
        principle: '分治法（Divide and Conquer）。将待排序数组对半二分（Divide），递归将左右两个子数组排好序，最后利用双指针合并两个有序数组（Conquer）。',
        applicability: '严格要求最坏时间复杂度为 O(N log N) 且必须稳定的场景；经典逆序对计数问题（如力扣剑指 Offer 51）；链表排序（LeetCode 148，链表归并无需辅助数组，空间仅 O(1)）。',
        features: '时间复杂度在最好、最坏、平均情况下均恒为严格的 O(N log N)，性能极度平稳；需要 O(N) 辅助临时数组；稳定排序。',
        libraries: 'Python 的 arr.sort() 底层 Timsort 正是归并排序与插入排序的巅峰结合体；C++ 提供了 std::inplace_merge(first, middle, last) 原地归并两段连续有序区间。'
      },
      eli5: {
        origin: '如果给你 10 万份打乱的考卷让你一个人排，你要排到猴年马月；但如果你把考卷一劈两半交给两个组长，组长再一劈两半交给组员……拆到最后每个人手里只有 1 张卷子（不用排就是整齐的），然后再两摞两摞地按大小像拉拉链一样合起来，几分钟就能排完 10 万份！',
        principle: '【手把手小剧场】核心动作叫**“拉链合并（Merge）”**：假设左手有一摞排好序的牌 `[2, 6]`，右手有一摞排好序的牌 `[1, 4]`，桌上放一个空盘子 `temp`。我们只看左右两摞最上面那张牌：`2` 和 `1` 比，`1` 小，把右手 `1` 放进盘子；接着 `2` 和 `4` 比，`2` 小，把左手 `2` 放进盘子；接着 `6` 和 `4` 比，把 `4` 放进盘子；最后把剩下的 `6` 放进盘子，得到 `[1, 2, 4, 6]`！【隐藏彩蛋】当右手的 `1` 比左手的 `2` 小时，因为左手那摞是递增的，说明左手剩下的 `[2, 6]` **全比 `1` 大**，一下子就抓出了 2 个“左大右小”的逆序对！',
        applicability: '【做题暗号】① **求数组中的逆序对个数**（蓝桥杯与剑指 Offer 经典母题，一边归并一边顺手把 `mid - p1 + 1` 加进答案）；② 给链表排序（链表不能随机访问但改指针极快）；③ 要求任何极端数据下都绝不退化、且必须稳定的排序。',
        features: '【大白话算账】① **快不快**：极稳的学霸！无论数据怎么刁钻，永远是 `O(N log N)`（劈开 `log N` 层，每层拉链合并扫一遍 `N`）；② **费不费内存**：这是它唯一的缺点——桌子上必须腾出一个和原数组一样大的空盘子 `temp`（额外空间 `O(N)`）；③ **稳不稳**：稳！两边牌一样大时先拿左边的，绝不乱序。',
        libraries: '【考场抄近道】Python 的 `arr.sort()` 底层就是归并排序的改良版（Timsort）；C++ 如果想把同一数组里相邻的两段有序区间 `[L, mid)` 和 `[mid, R)` 原地合起来，直接调 `std::inplace_merge(a.begin()+L, a.begin()+mid, a.begin()+R);`。'
      }
    },
    // 6. 快速排序
    {
      id: 'quick_sort',
      name: '快速排序',
      en: 'Quick Sort',
      category: '进阶排序',
      catId: 'b_01_sort_advanced',
      tier: 'B组',
      difficulty: '4',
      is408: true,
      dimensions: {
        origin: '归并排序需要开辟额外的 O(N) 辅助数组内存，在早期内存极其稀缺的计算机上代价沉重。托尼·霍尔 (C.A.R. Hoare) 寻求一种既拥有 O(N log N) 高效性又能原地划分的排序算法。',
        principle: '基准划分与双向奔赴。选取一个基准值（pivot），利用双指针碰撞从两侧向中间扫描，将小于 pivot 的扔到左边，大于 pivot 的扔到右边，从而将 pivot 确立在最终全局就位的位置上，然后递归处理左右两半。',
        applicability: '所有通用内存内部排序的首选，也是绝大多数编程语言标准库的底层骨架；考场求解“数组中第 K 大元素”的快速选择算法（QuickSelect，平均 O(N)）。',
        features: '平均时间复杂度 O(N log N)，且常数因子极小，被称为实际运行速度之王；空间递归栈 O(log N)；不稳定排序；最坏情况（完全有序且固定选首元素作为 pivot）退化为 O(N²)，防退化策略：三数取中法或随机化 pivot。',
        libraries: 'Python 使用随机 pivot 快排或 sorted(arr)；C++ 使用 std::sort(arr.begin(), arr.end())（底层为快速排序 + 堆排序 + 插入排序组合而成的 Introsort 内省排序）。'
      },
      eli5: {
        origin: '归并排序虽然快，但每次都要多占一倍的内存盘子（`O(N)` 空间）。霍尔爵士想：能不能不借盘子，就在原数组里挑一个“标兵（`pivot`）”，把比标兵矮的全赶到他左边，比标兵高的全赶到他右边？这样标兵自己就站在了最终正确的绝对排名上！',
        principle: '【手把手小剧场：408 挖坑填坑法】排 `[4, 7, 2, 5]`：① 把排头的 `4` 拔出来当标兵拎在手里（`pivot = 4`），0 号位就变成了一个**空坑**；② 先派右保安 `high` 从最右边往左找“比 4 矮的人”：`5` 高跳过，看到 `2` 比 `4` 矮！把 `2` 拎起来扔进左边的 0 号坑里，现在 `2` 原来的位置变成了新坑；③ 改派左保安 `low` 从左往右找“比 4 高的人”：看到 `7` 比 `4` 高！把 `7` 扔进右边刚才的新坑里，现在 `7` 的位置又变成了坑；④ 左右保安在 `7` 原来的坑位碰头会师（`low == high`），把手里的标兵 `4` 填进这个坑里，变成 `[2, 4, 7, 5]`——看！`4` 左边全比它小，右边全比它大，`4` 这辈子都不用再动了！',
        applicability: '【做题暗号】① 通用数组排序首选；② **求数组中第 K 大/第 K 小的元素（快速选择 Quickselect）**：每次标兵落坑后看一眼坑位下标，如果坑位刚好是第 K 个直接交卷，否则只去左边或右边其中一半找，时间直接降到惊人的 `O(N)`！',
        features: '【大白话算账】① **快不快**：平均速度之王（`O(N log N)` 且无多余拷贝），但有个**致命软肋**：如果数组本来就是排好序的 `[1, 2, 3, 4, 5]`，你还死脑筋每次拿排头的 `1` 当标兵，结果右边一个比它小的都没有，每次只能排好 1 个数，直接退化成龟速 `O(N²)`（破解法：随机抽一个人当标兵！）；② **省不省地**：原地挖坑填坑，只需 `O(log N)` 递归记事本；③ **稳不稳**：远距离扔进坑里，**不稳定**。',
        libraries: '【考场抄近道】C++ 的 `std::sort()` 底层就是快排（遇到退化自动切堆排）；如果题目只让你求“第 K 小的数”，C++ 直接一行 `std::nth_element(a.begin(), a.begin() + k, a.end());`，平均 `O(N)` 直接把第 K 小的数放到 `a[k]`！'
      }
    },
    // 7. 堆排序
    {
      id: 'heap_sort',
      name: '堆排序',
      en: 'Heap Sort',
      category: '进阶排序',
      catId: 'b_01_sort_advanced',
      tier: 'B组',
      difficulty: '5',
      is408: true,
      dimensions: {
        origin: '选择排序每一轮为了挑出最大值都要耗费 O(N) 遍历，而快速排序在最坏退化场景下会蜕变成 O(N²)。J. W. J. Williams 发明了二叉堆结构，旨在将最值维护降低到对数级。',
        principle: '利用完全二叉树的父子节点索引代数关系（下标 i 的左孩子为 2i+1，右孩子为 2i+2，父节点为 ⌊(i-1)/2⌋），自底向上线性建堆（O(N)），随后不断将堆顶最大值与堆尾交换，并将堆大小减 1，执行下滤调整（sift_down），实现空间 O(1) 原地排序。',
        applicability: '需要绝对保证最坏时间复杂度为 O(N log N) 且只允许 O(1) 辅助空间的系统内核与嵌入式系统；实时数据流 Top-K 问题。',
        features: '时间复杂度最好、最坏、平均均为严格的 O(N log N)；空间复杂度 O(1)；不稳定排序（堆调整过程中父子交换可能跨越相同元素）。',
        libraries: 'Python 内置 import heapq，使用 heapq.heapify(arr) 线性建小顶堆，heapq.heappop 弹出最小值；C++ 使用 std::make_heap、std::push_heap、std::pop_heap 或 std::priority_queue。'
      },
      eli5: {
        origin: '选择排序每轮为了找最大值都要把全班扫一遍（太慢）；快排遇到倒霉数据又会退化成 `O(N²)`，归并排序又要多占一倍内存。有没有一种既只用 `O(1)` 原地空间、最坏情况也绝对是 `O(N log N)` 的全能战士？那就是把数组当成一棵“金字塔家族树（完全二叉树）”来管的堆排序！',
        principle: '【手把手小剧场】我们不用真的画树，直接在数组里定规矩：**0 号是老祖宗，任何位置 `i` 的左儿子是 `2i+1`，右儿子是 `2i+2`**。大根堆的家规只有一条：**任何当爹的数字必须大于等于他的两个儿子**（所以 0 号老祖宗一定是全场最大值！）。排序分两步：① **立家规（建堆）**：从最后一排有儿子的家长往上挨个检查，如果哪个爹比儿子小，就跟大儿子换位下沉（`sift_down`）；② **摘皇冠封印**：把 0 号老祖宗（全场最大）和数组最后一个位置对调，并在最后一个位置拉起警戒线（它已经排好序退隐江湖了），然后让刚被换到 0 号位的小辈往下沉到合适位置，选出新一代最大值老祖宗，周而复始！',
        applicability: '【做题暗号】① 内存极度受限且绝不允许最坏情况超时的系统；② 动态维护“当前前 K 大元素（Top-K）”；③ 408 考研必考手算题：“给定序列初始建堆后的数组是什么？插入/删除一个元素后怎么上浮下沉？”',
        features: '【大白话算账】① **快不快**：非常稳健！建堆只需 `O(N)`，每次选出最大值只需顺着树高往下走 `log N` 步，总时间雷打不动 `O(N log N)`；② **省不省地**：完全在原数组里靠下标公式认亲戚，零额外内存 `O(1)`；③ **稳不稳**：父子跨位置交换，**不稳定**。',
        libraries: '【考场抄近道】Python 自带 `import heapq`（注意 Python 默认是小顶堆，想当大顶堆只需把数字取负号 `-x` 存进去）：`heapq.heapify(arr)` 一秒建堆，`heapq.heappop(arr)` 弹出最小值；C++ 直接用 `priority_queue<int> pq;`（默认大顶堆）。'
      }
    },
    // 8. 计数排序
    {
      id: 'counting_sort',
      name: '计数排序',
      en: 'Counting Sort',
      category: '基础排序',
      catId: 'c_02_sort_basic',
      tier: 'C组',
      difficulty: '2',
      is408: true,
      dimensions: {
        origin: '所有基于比较的排序算法都有数学证明的理论下界 Ω(N log N)。当数据范围有限（如考试分数 0-100、年龄 1-150）时，能否突破比较排序的下限，做到线性时间 O(N)？',
        principle: '非比较型桶思想。利用数值本身作为数组下标开辟计数桶统计频次，随后计算前缀和锁定每个数值最终在结果数组中的分布边界，逆序填充以保持稳定性。',
        applicability: '数据为非负整数且极值差值不大（max - min ≤ 10⁶）；常作为基数排序的子过程。',
        features: '时间复杂度 O(N + K)，其中 K 为数据范围跨度；空间复杂度 O(K)；稳定排序；缺点是无法直接处理浮点数或跨度过大的离散数值。',
        libraries: 'Python 使用 collections.Counter 统计频次；C++ 使用 std::vector<int> count(range, 0)。'
      },
      eli5: {
        origin: '前面所有排序都要“两两比大小”，数学家早就证明了：只要靠比大小排序，哪怕神仙下凡也快不过 `O(N log N)`。但如果全校 100 万名高考生按总分（0~750 分）排名，难道也要两两比大小吗？直接准备 751 个贴着 `0分` 到 `750分` 标签的塑料桶，考多少分就往几号桶里画一笔正字，最后按桶号抄出来不就完了吗！',
        principle: '【手把手小剧场】假设给 `[4, 2a, 2b, 3]` 排序（最小是 2，最大是 4）：① **画正字统计频次**：准备 `2号、3号、4号` 三个量筒，扫一遍数组，`2号桶`记 2 次，`3号桶`记 1 次，`4号桶`记 1 次，得到 `count = [2, 1, 1]`；② **算前缀和定座位号**：从左往右累加桶里的数，变成 `count = [2, 3, 4]`——意思是：考 2 分的人占最后第 2 个座位（即座位 0 和 1），考 3 分的人占第 3 个座位（座位 2），考 4 分的人占第 4 个座位（座位 3）；③ **倒着点名入座（保稳定）**：从原数组**最右边往左**点名，先点到 `2b`，看 2 号桶写着 `2`，就坐进第 2 个座位（下标 1），然后把桶上数字减一变成 `1`；再点到 `2a`，坐进第 1 个座位（下标 0）——`2a` 稳稳坐在 `2b` 左边！',
        applicability: '【做题暗号】题目里的数字都是**整数**，而且**最大值和最小值的差距（值域跨度 K）不大**（比如年龄 0~120、成绩 0~1000、数组元素都在 `-10^5 ~ 10^5` 之间），要求突破 `O(N log N)` 达到极速线性时间 `O(N)`！',
        features: '【大白话算账】① **快不快**：快到飞起！不用任何比大小，扫两遍就排完，时间 `O(N + K)`；② **致命弱点**：怕“贫富差距太大”！如果只有 3 个数 `[1, 2, 1000000000]`，你要开 10 亿个空桶，内存当场撑爆（此时要用基数排序或离散化）；③ **稳不稳**：倒着回填时**绝对稳定**。',
        libraries: '【考场抄近道】Python 统计每个数出现几次直接用 `from collections import Counter; cnt = Counter(arr)`，一行生成频次字典；C++ 若值域在 `10^6` 以内，直接开全局静态数组 `int cnt[1000005];`。'
      }
    },
    // 9. 基数排序
    {
      id: 'radix_sort',
      name: '基数排序',
      en: 'Radix Sort',
      category: '进阶排序',
      catId: 'b_01_sort_advanced',
      tier: 'B组',
      difficulty: '4',
      is408: true,
      dimensions: {
        origin: '当数据范围跨度很大（如电话号码、身份证号、32位整数范围达到 10⁹）时，计数排序无法开辟如此庞大的内存桶，而比较排序又受制于 O(N log N)。',
        principle: '多关键字低位优先（LSD）或高位优先（MSD）排序。将每个整数按数位拆解，从个位、十位依次到最高位，对每一位执行一轮稳定的计数排序（10个桶或256个桶），经历固定位数 d 轮之后，全局自动呈现单调有序。',
        applicability: '定长字符串排序、32位/64位海量无符号整数排序；考研 408 核心概念大题。',
        features: '时间复杂度 O(d · (N + r))，其中 d 为最大位数，r 为基数（十进制 r=10）；空间复杂度 O(N + r)；稳定排序。',
        libraries: '蓝桥杯与力扣竞赛中如需超高速排序，直接用 Python arr.sort() 或手写 256 进制基数排序（位运算提取字节）。'
      },
      eli5: {
        origin: '刚才计数排序怕什么？怕数字太大（比如排 11 位手机号码或身份证号），不可能开 1000 亿个桶！那怎么办？我们只准备 `0 ~ 9` 这 **10 个试管桶**，先按每个数的“个位数”分进 10 个桶里收起来，再按“十位数”分进 10 个桶里收起来，最后按“百位数”分一轮——只用 10 个桶就把再大的数字也排得服服帖帖！',
        principle: '【手把手小剧场】排 `[62, 15, 22, 12]`：① **第一轮看个位**：`62, 22, 12` 个位都是 `2`，按先后顺序排进 `2号试管`；`15` 个位是 `5` 进 `5号试管`。按 0~9 号试管依次倒出来，变成 `[62, 22, 12, 15]`（此时个位已经有序）；② **第二轮看十位**：`12` 和 `15` 十位都是 `1`，依次进 `1号试管`（因为 `12` 在前面先入管，所以在管底）；`22` 进 `2号试管`；`62` 进 `6号试管`。再按 0~9 号试管先进先出倒出来，变成 `[12, 15, 22, 62]`！为什么十位都是 `1` 的 `12` 和 `15` 顺序没乱？因为上一轮个位排好的先后顺序被队列试管稳稳保护住了！',
        applicability: '【做题暗号】① 海量固定位数的整数（如 32 位整数、电话号码、日期 `YYYYMMDD`）或定长字符串排序；② 408 考研常考：“基数排序每一趟分配收集必须依赖哪种稳定排序作为子过程？”（答：计数排序/队列桶）。',
        features: '【大白话算账】① **快不快**：假设数字最多有 `D` 位（比如亿级整数也就 9 位），只需要跑 `D` 轮，时间 `O(D · N)`，属于线性时间；② **负数小窍门**：如果有负数（比如 `-15`），只需先找出全场最小值 `-15`，给所有数统一加上 `+15` 变成非负数去排，排完再减回来即可！',
        libraries: '【考场抄近道】在 Python 中写多关键字排序（类似基数思想）只需用元组 key：`arr.sort(key=lambda x: (x // 100, (x // 10) % 10, x % 10))`。'
      }
    },
    // 10. 桶排序
    {
      id: 'bucket_sort',
      name: '桶排序',
      en: 'Bucket Sort',
      category: '进阶排序',
      catId: 'b_01_sort_advanced',
      tier: 'B组',
      difficulty: '3',
      is408: true,
      dimensions: {
        origin: '针对在连续区间内均匀分布的浮点数，传统离散计数排序失效，比较排序常数较大。',
        principle: '映射分割思想。根据数据范围划分若干连续区间的子桶，利用映射函数将元素分派至各个桶中，在桶内调用快速/插入排序，最后按桶编号依次合并。',
        applicability: '数据在已知范围内近似均匀分布的浮点数集合（如高考百分比、归一化特征向量）。',
        features: '若分布均匀且桶数量合理，平均时间复杂度可逼近 O(N)；最坏所有数据挤入同一桶退化为 O(N²)；空间复杂度 O(N + M)；稳定性取决于桶内排序算法。',
        libraries: '工业级引擎中通过分桶并发并行处理海量分布式数据（如 MapReduce）。'
      },
      eli5: {
        origin: '如果给你一堆带小数点的身高数据 `[1.72, 1.65, 1.81, 1.68]`，计数排序傻眼了（小数没法当数组下标），或者数据均匀分布在 `0 ~ 100` 之间。我们干脆搬来 5 个贴着范围标签的大木桶（比如 `[0~20)`, `[20~40)`...），先把数字按范围扔进大木桶，每个桶里只有寥寥几个数，在桶里随便排一下，最后把 5 个桶顺着倒出来就齐活了！',
        principle: '【手把手小剧场】排 `[29, 25, 3, 49, 9]`（范围 3~49）：① **造桶分拣**：摆好 5 个区间大桶：`0号桶[0~11)`、`1号桶[11~22)`、`2号桶[22~33)`、`3号桶[33~44)`、`4号桶[44~55)`。把 `3, 9` 扔进 0 号桶，把 `29, 25` 扔进 2 号桶，把 `49` 扔进 4 号桶；② **桶内小整理**：0 号桶里 `[3, 9]` 排好，2 号桶里 `[29, 25]` 排成 `[25, 29]`；③ **开闸拼接**：把 0~4 号桶依次连起来，直接得到 `[3, 9, 25, 29, 49]`！',
        applicability: '【做题暗号】① 数据是**均匀分布**的浮点数或整数；② 力扣经典变形题“最大间距（LeetCode 164）”：利用抽屉原理分桶，在 `O(N)` 时间内找出排序后相邻元素的最大差值。',
        features: '【大白话算账】① **快不快**：只要数据不扎堆（每个桶分到的元素差不多），平均速度就是 `O(N)`；② **最怕什么**：最怕所有人全挤进同一个桶里（比如 99 个数都是 `1~2`，只有 1 个数是 `10000`），那这个桶又得自己排半天，退回普通排序速度。',
        libraries: '【考场抄近道】分桶公式必背：`bucket_idx = min(k - 1, (x - min_v) // width)`，加上 `min(k - 1, ...)` 可以完美防止最大值刚好越界掉到第 `k` 个不存在的桶里。'
      }
    },
    // 11. 二分查找
    {
      id: 'binary_search',
      name: '二分查找与二分答案',
      en: 'Binary Search',
      category: '查找与字符串',
      catId: 'c_06_binary_search',
      tier: 'C组',
      difficulty: '2',
      is408: true,
      dimensions: {
        origin: '在长度为 N 的有序序列中，线性顺序查找需要 O(N)，面对 10⁹ 次高频查询系统直接崩溃。',
        principle: '单调性区间折半。利用数据序列的单调非递减性，每次比对中点 mid，根据大小关系一次性淘汰半数候选区间，利用红蓝染色法精确划定左右边界。',
        applicability: '有序数组精确定位、求解满足某种条件的最小值/最大值（二分答案，题眼为“求最大值的最小值”或“最小值的最大值”）。',
        features: '时间复杂度 O(log N)；空间复杂度 O(1)；考场关键避坑：mid = left + (right - left) // 2 防止整数溢出，开闭区间边界更新规则需保持一致。',
        libraries: 'Python 使用 import bisect，bisect.bisect_left(arr, x) 寻找首个 ≥ x 的位置，bisect.bisect_right(arr, x) 寻找首个 > x 的位置；C++ STL 提供 std::lower_bound 与 std::upper_bound。'
      },
      eli5: {
        origin: '我心里想一个 `1 ~ 1000` 之间的数字让你猜，每次告诉你“猜大了”还是“猜小了”。傻瓜才会从 1, 2, 3 挨个问（最多要问 1000 次）；聪明人第一口先猜正中间的 `500`——如果我说“猜小了”，那么 `1 ~ 500` 整整五百个数当场全部排除！1000 个数最多猜 10 次必中，10 亿个数也只需猜 30 次！',
        principle: '【手把手小剧场：红蓝染色法永不死循环】很多新手写二分最怕搞不清 `L = mid` 还是 `mid + 1`，其实用**“红蓝染色法”**一招就能终结痛苦！假设我们要在排好序的 `[2, 5, 5, 8, 9]` 里找**第一个 `>= 5` 的位置**：我们把所有 `< 5` 的不合格数字涂成**蓝色**，把所有 `>= 5` 的合格数字涂成**红色**。左右设两扇门 `L=0, R=4`。每次看正中间 `mid`：如果 `arr[mid] < 5`（是蓝的），说明 `mid` 及它左边全是蓝的，`L` 直接跨到 `mid + 1`；如果 `arr[mid] >= 5`（是红的），说明 `mid` 及它右边全是红的，`R` 退到 `mid - 1`。当 `L > R` 两扇门交错关上时，**`L` 指着的位置永远是第一块红砖（即第一个 `>= 5` 的位置）**，一行多余判断都不用改！',
        applicability: '【做题暗号】① 数组已经排好序，找某个数或左右边界；② **蓝桥杯省一必考王牌——“二分答案”**：只要你在题目里看到**“求最大的最小值”**或**“求最小的最大值”**（比如：爱吃香蕉的珂珂求最慢吃速、跳石头求最短跳跃距离的最大值），99% 是二分答案！直接猜一个答案 `mid`，写个 `check(mid)` 看看够不够用，够用就缩右界，不够就扩左界！',
        features: '【大白话算账】① **快不快**：宇宙级快！每次砍掉一半（`O(log N)`），哪怕数据范围到 `10^18`，二分也只需要循环 60 次；② **唯一前提**：必须有**“单调性”**（即以某个点为界，左边全不行、右边全行，像红蓝两半一样分明）。',
        libraries: '【考场抄近道】Python 直接 `import bisect`：`bisect.bisect_left(arr, x)` 就是找第一个 `>= x` 的下标，`bisect.bisect_right(arr, x)` 就是找第一个 `> x` 的下标；C++ 对应 `std::lower_bound` 和 `std::upper_bound`，考场直接调库零失误！'
      }
    },
    // 12. 双指针
    {
      id: 'two_pointers',
      name: '双指针与滑动窗口',
      en: 'Two Pointers & Sliding Window',
      category: '查找与字符串',
      catId: 'c_08_two_pointers',
      tier: 'C组',
      difficulty: '3',
      is408: false,
      dimensions: {
        origin: '子数组区间统计与双数配对暴力枚举为 O(N²)，容易发生重复子问题扫描。',
        principle: '单调协同推进。利用左右指针同向滑动（滑动窗口维持连续子区间性质）或相向碰撞（两头夹逼求解有序配对），指针单调移动永不回退，将两重嵌套循环转化为单次线性扫描。',
        applicability: '盛最多水的容器、三数之和、无重复字符的最长子串、和至少为 K 的最短子数组。',
        features: '时间复杂度 O(N)；空间复杂度 O(1)；核心题眼识别：“连续子数组”、“有序数组配对”、“窗口扩张与收缩”。',
        libraries: 'Python 结合 collections.defaultdict 或 Counter 维护窗口内哈希频次；C++ 使用双迭代器配合数组计数。'
      },
      eli5: {
        origin: '如果让你在一排数字里找“最短的一段连续子数组，使它们的和至少达到 7”，笨办法是把每一个起点 `i` 到每一个终点 `j` 全加一遍（两层循环 `O(N²)`），做了无数次重复加法。其实完全可以让两个指针像一只**毛毛虫**一样在数组上爬：脑袋往前伸一口（加右边），肚子饱了尾巴就往前缩一口（减左边）！',
        principle: '【手把手小剧场】在 `[2, 3, 1, 2, 4, 3]` 里找和 `>= 7` 的最短连续段：毛毛虫左尾巴 `L=0`，右脑袋 `R` 一步步往右吃：① 吃进 `2, 3, 1`（肚子里总和 `6 < 7`，不够饱）；② 再吃进 `2`（总和变成 `8 >= 7`，饱了！此时长度是 4）；③ 既然饱了，试试能不能吐掉左尾巴减肥：吐掉最左边的 `2`（`L` 右移到 1），肚子里还剩 `6 < 7`，饿了停下；④ 右脑袋继续吃进 `4`（总和 `10 >= 7`），左尾巴连续吐掉 `3` 和 `1`（只剩 `[4, 3]`，总和 `7 >= 7`，长度缩到了 2！）。整个过程脑袋和尾巴都只往右爬、绝不走回头路，只扫一遍就找出了最优解！',
        applicability: '【做题暗号】题目出现**“连续子数组 / 连续子串”**，并且求“最长/最短/个数”，同时满足“窗口越长越容易达标（或越短越容易达标，比如无重复字符子串）”。',
        features: '【大白话算账】虽然代码里写了一个 `for` 套一个 `while`，但千万别以为它是 `O(N²)`！因为每个数字最多被右脑袋吃进去 1 次、被左尾巴吐出来 1 次，加起来总共最多操作 `2N` 次，是纯正的 `O(N)` 极速算法！',
        libraries: '【考场抄近道】如果窗口里要统计各种字符出现了几次，Python 直接配一个 `from collections import Counter; win = Counter()`，右扩 `win[s[R]] += 1`，左缩 `win[s[L]] -= 1`。'
      }
    },
    // 13. KMP
    {
      id: 'kmp',
      name: 'KMP 字符串匹配',
      en: 'Knuth-Morris-Pratt',
      category: '查找与字符串',
      catId: 'b_07_kmp_ac',
      tier: 'B组',
      difficulty: '5',
      is408: true,
      dimensions: {
        origin: '文本串匹配模式串时，朴素暴力匹配一旦字符不相等，文本串指针必须回退，最坏时间复杂度高达 O(N × M)。',
        principle: '最长公共前后缀（next/lps 数组）。预先计算模式串自身的最长相等真前后缀长度，失配时主串指针不回退，模式串指针根据 next 数组直接跳跃到前缀后一位继续比对。',
        applicability: '单模式串在长文本中的单次或多次匹配定位、周期串最小循环节判定。',
        features: '时间复杂度严格 O(N + M)；空间复杂度 O(M)（next 数组）；408 核心考点 next 数组与 nextval 数组手算。',
        libraries: 'Python 字符串包含直接用 "needle" in haystack 或 haystack.find(needle)（底层基于高度优化的 fastsearch / Boyer-Moore 算法）；C++ 使用 std::string::find。'
      },
      eli5: {
        origin: '在一篇长文章 `ABABABC` 里找词组 `ABABC`。笨办法是：前 4 个字母 `ABAB` 都对上了，第 5 个字母文章是 `A` 而词组是 `C`，没对上！笨办法会把文章指针倒退回第 2 个字母重新从头比对。但如果文章有 100 万字，每次差最后一个字母就倒退重来，会慢到崩溃！三位大神（K、M、P）发现：刚才既然前 4 个字母 `ABAB` 已经对上了，我们其实已经知道文章这 4 个字母长啥样了，根本不用倒退文章指针！',
        principle: '【手把手小剧场】看词组 `ABABC` 的前 4 个已对上的字母 `ABAB`：它的最前面两个字母是 `AB`（真前缀），最后面两个字母也是 `AB`（真后缀）！既然失配前文章末尾刚刚出现过 `AB`，我们直接把词组往右一推，用词组开头的 `AB` 直接对准文章刚才末尾的 `AB`，接着比第 3 个字母就行了！为此我们提前给词组算好一张“后悔药备忘录 `pi[]`（也就是 408 的 `next` 数组）”，记录每个位置失配时该退回第几个字母。',
        applicability: '【做题暗号】① 在超长文本串里找某个模式串出现的所有位置；② **求字符串的最小循环节**（比如 `abcabcabc` 是由 `abc` 重复拼成的，最小循环节长度永远等于 `n - pi[n-1]`！）；③ 408 考研必考手算 `next` 和 `nextval` 数组。',
        features: '【大白话算账】文章指针 `i` 像棘轮一样**永远只往右走、绝不后退半步**，词组指针 `j` 最多往前跳多少次就最多退多少次，总时间严格 `O(N + M)`！',
        libraries: '【考场抄近道】如果机试只让你找子串位置而不考 `next` 数组性质，Python 直接用 `text.find(pattern)`（底层 C 语言 Boyer-Moore 极速搜索），C++ 用 `s.find(p)`，一行秒杀！'
      }
    },
    // 14. 字典树 Trie
    {
      id: 'trie',
      name: '字典树 (前缀树)',
      en: 'Trie Tree',
      category: '查找与字符串',
      catId: 'b_08_trie',
      tier: 'B组',
      difficulty: '4',
      is408: true,
      dimensions: {
        origin: '海量字符串前缀查询与统计若存入普通哈希表，无法快速识别公共前缀，空间膨胀且无法支持动态自动补全。',
        principle: '多叉树字符边复用。利用树形结构将公共前缀的字符节点完全合并共享，从根到某一节点的路径即代表对应前缀，配合标记位判定单词终结。',
        applicability: '前缀匹配、拼写检查自动补全、01-Trie 异或最大值查询。',
        features: '查询与插入时间与字符串长度 L 成正比为 O(L)，与词库总容量无关；空间根据字符集大小而定。',
        libraries: 'Python 用嵌套字典 trie = {} 快速实现（trie.setdefault(char, {})）；C++ 数组静态开点 int son[N][26], cnt[N], idx;。'
      },
      eli5: {
        origin: '当你在百度搜索框敲入 `ca` 时，下拉框为什么能在 1 毫秒内蹦出 `cat`, `car`, `cart`？如果去几千万个单词里挨个比对前两个字母早卡死了。字典树（Trie）把所有单词的公共前缀合并成地铁线路图：从总站出发，走 `c -> a` 这两站路，所有以 `ca` 开头的词全都挂在这站后面的分支上！',
        principle: '【手把手小剧场】树根 `ROOT` 不存字母，每条树枝代表一个字母。插入 `cat`：从根走出 `c -> a -> t`，并在 `t` 节点点亮一颗**终点星标 `is_end = True`**（表示到此是一个完整单词）；接着插入 `car`：顺着现成的 `c -> a` 走两步（完全复用！），在 `a` 下面新分叉出一个 `r` 并点亮星标；再插入 `cart`：顺着 `c -> a -> r` 走到头，再往下挂一个 `t` 点亮星标。这样查一个长度为 `L` 的词在不在，哪怕词典里有 1 亿个词，也只需顺着字母走 `L` 步！',
        applicability: '【做题暗号】① 海量字符串的**前缀匹配、词频统计、自动补全**；② **0-1 字典树求最大异或对**（把每个整数拆成 32 位二进制 0/1 字符串塞进字典树，找异或最大时每一步尽量往相反的 0/1 分支走，贪心必胜！）。',
        features: '【大白话算账】查询速度只跟你要查的单词有几个字母（`O(L)`）有关，跟词库里有几百万个词毫无关系！缺点是比较吃内存（可以用静态二维数组 `son[N][26]` 省内存）。',
        libraries: '【考场抄近道】Python 考场极速写 Trie 小技巧：不用写 `class`，直接用嵌套字典 `trie = {}`！插入单词只需 `node = trie`，遍历字母 `node = node.setdefault(ch, {})`，最后 `node[\'#\'] = True` 当终点标记，5 行搞定！'
      }
    },
    // 15. 单调栈与单调队列
    {
      id: 'stack_queue',
      name: '单调栈与单调队列',
      en: 'Monotonic Stack / Queue',
      category: '数据结构',
      catId: 'c_10_queue_stack',
      tier: 'C组',
      difficulty: '4',
      is408: true,
      dimensions: {
        origin: '寻找数组中每个元素“下一个更大元素”或“滑动窗口最大值”，暴力比对为 O(N²) 或 O(N × K)。',
        principle: '单调递增/递减维护淘汰冗余。单调栈维持栈内元素单调，新元素入栈前弹出所有被其破坏单调性的元素（即这些被弹出的元素找到了“下一个更大”）；单调队列双端弹出，队头始终为窗口极值。',
        applicability: '每日温度、接雨水、柱状图中最大的矩形、滑动窗口最大值。',
        features: '每个元素至多入栈/入队一次、出栈/出队一次，均摊时间复杂度为严格的 O(N)；空间复杂度 O(N)。',
        libraries: 'Python 使用 collections.deque 实现双端队列；C++ 使用 std::deque 或 std::stack。'
      },
      eli5: {
        origin: '想象一排高矮不一的人排成一列全部面向右边，每个人想知道“我往右看，第一个比我高（挡住我视线）的人是谁？”。笨办法是每个人都往后挨个比一遍（O(N²)）。其实只要维护一个“待配对候诊室（单调栈）”：矮个子还没等到比他高的人就先在栈里等着，一旦来了一个大高个，就能把栈里比他矮的人全解放出来！若要查滑动窗口极值，则升级为双端开口的单调队列。',
        principle: '【手把手小剧场】① 单调栈（每日温度）：给 [2, 1, 5, 3] 找右边更大数，2 和 1 依次进栈 [2, 1]；当 5 进场时，比栈顶 1 和 2 都高，连续弹出 1 和 2 成功配对！② 单调队列（大厂淘汰制）：新员工入职从右边进，凡是能力不如新员工且入职更早的老员工（nums[q[-1]] <= nums[i]），全从右口辞退（pop）；左口过期员工按时退休（popleft），第一把交椅永远是窗口极值！',
        applicability: '【做题暗号】只要题目问“左边/右边第一个比它大/比它小的元素在哪”，或者经典变形题：每日温度、接雨水、柱状图中最大的矩形；以及求“滑动窗口最大值/最小值”，闭着眼睛直接掏单调栈与单调队列！',
        features: '【大白话算账】每个人最多进栈/进队一次、被轰出一次，绝不会二进宫，所以总时间是极速的 O(N)！记住口诀：找下一个更大用单调递减栈，找下一个更小用单调递增栈（存下标既能算跨距又能查数值）；滑动窗口极值用双端单调队列。',
        libraries: '【考场抄近道】Python 单调栈直接拿普通列表 st = []（st.append(i) 入栈，st.pop() 出栈）；单调队列必须用 from collections import deque（千万别用 list.pop(0)，那是 O(N) 会超时！deque.popleft() 才是真 O(1)）；C++ 用 std::stack 与 std::deque。'
      }
    },
    // 16. 优先队列 (堆)
    {
      id: 'heap',
      name: '优先队列 (二叉堆)',
      en: 'Priority Queue (Binary Heap)',
      category: '数据结构',
      catId: 'b_02_tree_heap',
      tier: 'B组',
      difficulty: '3',
      is408: true,
      dimensions: {
        origin: '需要在动态数据流中随时插入新元素并实时获取当前全局极值（最大值或最小值）。若用排序数组维护插入需 O(N)，若用无序数组获取最值需 O(N)。',
        principle: '完全二叉树偏序维护。利用完全二叉树的父子约束（大顶堆父节点 ≥ 子节点），插入元素时上滤（sift_up，对数时间），弹出极值时将堆尾填补堆顶并下滤（sift_down，对数时间）。',
        applicability: 'Top-K 元素统计、合并 K 个有序链表、Dijkstra 堆优化、中位数动态流维护（对顶堆）。',
        features: '建堆 O(N)，单次插入与删除 O(log N)，获取堆顶 O(1)；空间复杂度 O(N)。',
        libraries: 'Python import heapq（默认为小顶堆，大顶堆存取相反数 -x）；C++ 使用 #include <queue> 中的 std::priority_queue<int>（默认大顶堆，小顶堆加 greater<int>）。'
      },
      eli5: {
        origin: '医院急诊室看病不能完全按“先来后到”排队，如果有危重病人随时插进来，医生每次喊号都必须喊“当前候诊室里病情最重的那个人”。如果用普通数组每次排一遍序太慢，用二叉堆实现的“优先队列”就能在极短时间内随时塞人、随时揪出最值！',
        principle: '【手把手小剧场】二叉堆就是一棵严守等级制度的完全二叉树（大顶堆里爹永远比儿子大）。只有两个核心动作：① **新官上任三把火（上浮 `sift_up`）**：新插进来的数字先委屈坐在最末尾的叶子位，然后跟它亲爹比大小，比爹大就跟爹换位往上爬，一路爬到不比爹大为止；② **老王退位选新王（下沉 `sift_down`）**：把堆顶老祖宗（最大值）请走后，把最末尾的小辈临时拎到堆顶当代理老王，小辈德不配位，就跟左右两个儿子里较大的那个换位往下沉，一路沉到比儿子都大为止。因为树只有 `log N` 层，上浮下沉最多只需十几步！',
        applicability: '【做题暗号】① 动态数据流中反复“插入元素”并“取出当前最大/最小值”；② 合并 K 个升序链表、前 K 个高频元素、数据流的中位数（用一个大顶堆管左半边 + 一个小顶堆管右半边，俗称“对顶堆”）。',
        features: '【大白话算账】查看最值 `O(1)`（直接看堆顶 `heap[0]`），插入和删除最值都是 `O(log N)`，一次性把乱序数组建成堆只需 `O(N)`。',
        libraries: '【考场抄近道】Python `import heapq`：记住它是**小顶堆**（每次弹出最小），想求最大只需存入 `-x`，弹出时再取负 `-heapq.heappop(h)`；C++ `priority_queue<int>` 默认是**大顶堆**，想变小顶堆写 `priority_queue<int, vector<int>, greater<int>>`。'
      }
    },
    // 17. 并查集
    {
      id: 'union_find',
      name: '并查集 (Disjoint Set)',
      en: 'Union-Find',
      category: '数据结构',
      catId: 'b_04_union_find',
      tier: 'B组',
      difficulty: '3',
      is408: true,
      dimensions: {
        origin: '动态图连通性判断（两个节点是否在同一连通分量中）或不断合并集合，若每次都用广度优先搜索 BFS 遍历染色，时间复杂度高达 O(V)。',
        principle: '树形代表元与路径压缩。每个元素维护其父节点指针，根节点为其所属集合的代表元；通过“路径压缩”（查询时递归将沿途节点的父节点直接指向根节点）与“按秩合并”（深度小的树合并到深度大的树下），将树高压平到极致。',
        applicability: '无向图连通分支计数、图判环、Kruskal 最小生成树、带权并查集（如食物链问题）。',
        features: '时间复杂度每次操作为反阿克曼函数 O(α(N))，在宇宙可观测粒子数范围内 α(N) ≤ 4，等同于常数级别 O(1)；空间复杂度 O(N)。',
        libraries: 'Python 使用列表 p = list(range(n)) 配合简短两行递归 find(x) 实现；C++ 数组静态维护 iota(p.begin(), p.end(), 0)。'
      },
      eli5: {
        origin: '江湖上有 10 万个大侠，不断有人结拜成同门帮派。如果随时问你“张三和李四是不是一伙的？”，要是每次都顺着关系网去搜一遍会慢死。并查集想了个绝招：每个帮派选一个最高总瓢把子（族长），所有人不管隔了多少辈，知道总瓢把子是谁后，直接把自己的介绍人改成总瓢把子本人！',
        principle: '【手把手小剧场】起初每个人自成一派，自己的老大就是自己（`p[i] = i`）。假设 1 号认 2 号当大哥，2 号认 3 号当大哥，3 号认 4 号当总瓢把子，原本是一条长藤 `1 -> 2 -> 3 -> 4`。现在 1 号去查自己的总瓢把子（`find(1)`）：一路顺藤摸瓜问到 4 号后，回来的路上顺手施展**“路径压缩魔法”**——让 1 号、2 号、3 号的直属上司全部直接改成 `4`！下次再问 1 号是谁的人，抬头看一步就是 4 号！如果要把两个帮派合并（`union(x, y)`），只需让双方总瓢把子拜个把子（`p[root_x] = root_y`），两个万人大帮瞬间合二为一！',
        applicability: '【做题暗号】① **判断图的连通性 / 统计有几个连通块（朋友圈数量）**；② **判断无向图里加一条边会不会形成环**（如果边的两个端点在加边前已经是同一个总瓢把子，再连一条边必成环！）；③ Kruskal 最小生成树。',
        features: '【大白话算账】加了“路径压缩”之后，每次查询和合并的耗时叫反阿克曼函数 `O(α(N))`——在人类已知宇宙的原子总数范围内，`α(N)` 都不会超过 4，完全等同于瞬间完成的 `O(1)`！',
        libraries: '【考场抄近道】并查集是全蓝桥杯最好背的黄金模板，Python 核心就 4 行：`p = list(range(n))`；`def find(x): p[x] = find(p[x]) if p[x] != x else x; return p[x]`，考场 30 秒默写完毕！'
      }
    },
    // 18. 树状数组
    {
      id: 'fenwick',
      name: '树状数组 (Fenwick Tree / BIT)',
      en: 'Binary Indexed Tree',
      category: '数据结构',
      catId: 'a_02_fenwick_tree',
      tier: 'A组',
      difficulty: '6',
      is408: false,
      dimensions: {
        origin: '普通数组前缀和查询为 O(1)，但单点修改需更新后续所有前缀和，开销为 O(N)；普通数组单点修改 O(1)，但区间查询需累加，开销为 O(N)。',
        principle: '二进制末位 1 覆盖区间划分。利用 lowbit(x) = x & (-x)，将每个位置 x 管理的区间长度定义为其二进制最低位的值，从而构建跳跃前缀覆盖树。',
        applicability: '单点修改 + 区间查询（动态前缀和）、求逆序对数、配合差分实现区间修改 + 单点查询。',
        features: '时间复杂度单点更新与前缀和查询均为严格 O(log N)；空间仅需 O(N) 原生数组，常数极小，代码量极短（仅需 5-10 行），执行速度远快于线段树。',
        libraries: '蓝桥杯与考研竞赛中推荐手写，核心只需 def lowbit(x): return x & -x，add(i, v) 与 query(i) 循环位移。'
      },
      eli5: {
        origin: '如果有一个数组，老板既让你频繁“把第 `i` 个位置的数字改一下”，又让你频繁算“前 `k` 个数字加起来是多少”。如果只用普通数组，改数字快但每次从头加到尾慢；如果提前算好前缀和数组，查总和快但每改一个数就要把后面所有前缀和全改一遍！树状数组利用二进制把区间切成大小不同的阶梯管辖块，让“改数字”和“查总和”都只要跳几步就搞定！',
        principle: '【手把手小剧场】秘密全在 `lowbit(x) = x & (-x)`（取出二进制最末尾那个 `1` 代表的数值，比如 `6` 的二进制是 `110₂`，末尾 `10₂` 就是 `2`）：规定 `tree[x]` 专门负责管辖从它自己往左数 `lowbit(x)` 个元素的和！比如：① 奇数号的 `tree[1], tree[3], tree[5], tree[7]` 的 `lowbit` 都是 1，只管自己 1 个人（村长）；② `tree[2], tree[6]` 的 `lowbit` 是 2，管 2 个人（镇长）；③ `tree[4]` 管 `1~4` 共 4 个人（县长）；④ `tree[8]` 管 `1~8` 全村 8 个人（省长）。当你想查前 7 个人的总和 `query(7)` 时：`7 = 4 + 2 + 1`，先问 7 号村长（拿第7个），跳到 `7-1=6` 问 6 号镇长（拿5~6号），再跳到 `6-2=4` 问 4 号县长（拿1~4号），只问 3 个人就拼出了前 7 个人的总和！',
        applicability: '【做题暗号】① **单点修改 + 区间求和**（动态前缀和）；② **求逆序对 / 三元上升子序列个数**（按数值当下标往树状数组里打点，边插边查前面有几个比它小/大的数）。',
        features: '【大白话算账】修改和查询都只需最多跳 `log N` 次（100 万数据最多跳 20 次），而且代码只有短短 10 行，比线段树短 5 倍、快 3 倍、省 4 倍内存！**唯一铁律：下标必须从 `1` 开始算，绝对不能用下标 `0`（因为 `lowbit(0) = 0` 会原地死循环）！**',
        libraries: '【考场抄近道】记住两个循环方向相反：**单点加 `add` 是往上找上级汇报，所以是 `i += i & -i`；前缀查 `query` 是往左拼积木，所以是 `i -= i & -i`**！'
      }
    },
    // 19. 线段树
    {
      id: 'segment_tree',
      name: '线段树 (Segment Tree)',
      en: 'Segment Tree',
      category: '数据结构',
      catId: 'a_03_segment_tree',
      tier: 'A组',
      difficulty: '7',
      is408: false,
      dimensions: {
        origin: '树状数组擅长单点修改和前缀和，但对于复杂的“区间修改 + 区间最值查询”、“区间赋值”等复合操作无法直接应对。',
        principle: '二叉递归区间拆解与懒惰标记（Lazy Tag）。将整个区间 [1, N] 递归对半拆分成一棵平衡二叉树，每个节点维护对应区间的统计值。区间更新时打上 lazy 标记暂停向下传递，待下一次真正访问子节点时再下推（push_down），避免无谓遍历。',
        applicability: '区间加/乘 + 区间求和/最值/GCD、扫描线算法求矩形面积并。',
        features: '建树 O(N)，单次区间更新与查询严格 O(log N)；空间开销通常为 4N。',
        libraries: '蓝桥杯中手写经典四板斧：push_up、push_down、modify、query；Python 可用类封装或扁平数组。'
      },
      eli5: {
        origin: '树状数组虽然短小精悍，但如果老板提出更过分的要求：“把第 100 号到第 50000 号之间所有员工的工资统一加 500 块，然后立刻告诉我第 200 号到第 8000 号里的最高工资是多少”，树状数组就招架不住了。线段树把整个数组像切生日蛋糕一样不断对半切分，再配上“懒人记账贴纸（Lazy Tag）”，再大的区间修改也能一秒记账完毕！',
        principle: '【手把手小剧场】线段树是一棵管区间的二叉树：大老板 `tree[1]` 管 `[1..8]` 全公司，左副总管 `[1..4]`，右副总管 `[5..8]`，直到最底层员工各自管 `[1..1]`。**核心神技叫“懒人记账（Lazy Tag）”**：如果老板下令给 `[1..4]` 所有人每人发 100 元奖金，左副总一看：“`[1..4]` 不正好归我全权管辖吗！”于是左副总直接在自己账本总和上加上 `4 × 100 = 400` 元，并在自己脑门上贴一张便签 **`lazy = +100`（意思是：这笔钱我先替下面的人记着，暂时不跑腿发给底下的小队长了）**，当场交差！只有等哪天老板非要查 `[1..2]` 的具体账目、不得不找左副总下面的小队长时，左副总才顺手把脑门上的 `+100` 便签撕下来传给左右两个小队长（这叫 `push_down` 下传）。',
        applicability: '【做题暗号】蓝桥杯压轴大题常客！凡是涉及**“区间批量加/乘/赋值修改” + “区间求和/求最大最小值/求最大公因数”**，无脑上线段树。',
        features: '【大白话算账】不管你修改的区间有几百万长，只要被某个节点的管辖范围完全包住，当场贴上懒人便签就停下，每次区间修改和区间查询都严格只需 `O(log N)`！注意：**线段树的数组空间必须开到原数组长度的 4 倍（`4 * N`）才不会越界**。',
        libraries: '【考场抄近道】熟记线段树四大固定套路函数：`build`（对半建树）、`push_up`（左右儿子账目加给老爹）、`push_down`（老爹撕下懒人便签发给两个儿子）、`update/query`（包住就贴签返回，没包住就先 `push_down` 再分头找左右儿子）。'
      }
    },
    // 20. 哈希表
    {
      id: 'hash_table',
      name: '哈希表与散列表',
      en: 'Hash Table',
      category: '数据结构',
      catId: 'c_09_hash',
      tier: 'C组',
      difficulty: '2',
      is408: true,
      dimensions: {
        origin: '在数据集合中查找一个元素是否存在，线性顺序查找需 O(N)，二分查找需先消耗 O(N log N) 排序且仅支持静态数组。',
        principle: '散列函数直接定址。将任意类型（整数、字符串、元组）通过哈希函数映射为定长内存桶下标，发生碰撞时通过链地址法（拉链法）或开放寻址法（线性探测）解决冲突。',
        applicability: '高频 O(1) 查找、两数之和、词频统计、状态去重记忆化。',
        features: '理想情况下插入、删除、查找均为均摊 O(1)；极端情况下哈希碰撞严重退化为 O(N)；需注意 408 考点装填因子 α = n / m 与探测序列。',
        libraries: 'Python 的字典 dict 和集合 set（基于极其强大的结合开放寻址的紧凑哈希表）；C++ STL 的 std::unordered_map 和 std::unordered_set。'
      },
      eli5: {
        origin: '去图书馆找一本书，如果按编号顺序挨个书架找要 `O(N)`，二分查找也得 `O(log N)`。哈希表就像一位拥有超强记忆力的图书管理员：你报出书名，他用一个数学公式（哈希函数）一算，当场算出“这本书就在 37 号抽屉！”，一步到位直接拉开抽屉拿书，耗时 `O(1)`！',
        principle: '【手把手小剧场】假设我们有 10 个抽屉（编号 `0 ~ 9`），哈希公式是 `抽屉号 = 数字 % 10`。存数字 `23` 时，`23 % 10 = 3`，直接放进 3 号抽屉。但万一接下来又要存 `53` 呢？`53 % 10` 也是 `3`！两个不同的数抢同一个抽屉，这就叫**“哈希冲突（碰撞）”**。解决冲突有两个经典办法：① **拉链法（链地址法）**：3 号抽屉里不直接塞书，而是挂一根绳子（链表），`23` 和 `53` 顺着绳子串成一串挂在 3 号抽屉下；② **线性探测法（开放定址法）**：`53` 一看 3 号抽屉有人了，就礼貌地往后看 4 号抽屉空不空，空就坐 4 号，不空再看 5 号！',
        applicability: '【做题暗号】① 瞬间判断某个元素“以前有没有出现过”（去重、查存在性）；② 统计每个元素出现的次数；③ **两数之和（枚举右边，去哈希表里一眼查出左边有没有 `target - x`）**。',
        features: '【大白话算账】增、删、查平均全都是瞬间完成的 `O(1)`！但代价是哈希表内部元素是没有顺序的，而且 408 考研常考手算“线性探测法的平均查找成功/失败长度（ASL）”。',
        libraries: '【考场抄近道】Python 的 `dict`（`{}`）和 `set` 就是天然的超级哈希表，统计默认字典用 `from collections import defaultdict`；C++ 用 `unordered_map` 和 `unordered_set`（比带排序的 `map` 快得多）。'
      }
    },
    // 21. 链表
    {
      id: 'linked_list',
      name: '链表与双向链表',
      en: 'Linked List',
      category: '数据结构',
      catId: 'c_10_queue_stack',
      tier: 'C组',
      difficulty: '2',
      is408: true,
      dimensions: {
        origin: '顺序存储的数组在头部或中间插入/删除元素时，需要搬迁后续全部元素，时间复杂度高达 O(N)，且扩容时必须重新开辟连续内存块。',
        principle: '游标指针离散存储。每个节点包含数据域和后继指针域（双向链表增加前驱指针），插入与删除只需断开旧指针并重定向新指针，无需腾挪任何现有数据。',
        applicability: 'LRU 缓存机制（哈希表 + 双向链表）、高频在序列两端和中间任意指定位置增删、408 考研综合大题（快慢指针找中点、环形链表入口、反转链表）。',
        features: '已知前驱/当前节点时增删节点时间 O(1)；随机寻址访问时间 O(N)（不支持下标随机访问）；额外空间开销包含指针字段。',
        libraries: 'Python 使用内置类手写 ListNode，双端队列用 collections.deque；C++ STL 提供 std::list（双向链表）和 std::forward_list（单向链表）。'
      },
      eli5: {
        origin: '数组就像电影院里焊死的一排连体座椅：如果中间第 3 号座位临时要加塞一个人，从第 3 号到第 1000 号的所有人都得站起来往后挪一个座位（`O(N)`）。链表就像小朋友手拉手做游戏：每个人左手拿着自己的数据，右手拉着下一个人的衣角（`next` 指针）。想在张三和李四中间加塞一个王五？只需张三松开李四的手改拉王五，王五再拉住李四，后面一万个人纹丝不动（`O(1)`）！',
        principle: '【手把手小剧场：两大必考神技】① **原地反转链表**：要把 `1 -> 2 -> 3` 变成 `3 -> 2 -> 1`，只需要准备 `prev`（前人）和 `curr`（当前人）两个指针，每个人松开拉着后面人的手，转身去拉前面人 `prev` 的手即可（注意转身前先用 `nxt = curr.next` 记住后面是谁，不然手一松后面整串人都丢了！）；② **快慢指针（龟兔赛跑）**：找链表中点或判断链表有没有环，派乌龟 `slow` 每次走 1 步、兔子 `fast` 每次走 2 步——如果链表有环，兔子一定会在环里从背后追上乌龟撞个满怀！',
        applicability: '【做题暗号】① 频繁在序列头部或中间已知位置插入、删除元素；② **LRU 缓存淘汰算法**（哈希表 + 双向链表）；③ 408 考研与大厂面试必考：反转链表、环形链表入口、合并两个有序链表。',
        features: '【大白话算账】已知节点位置时插删只需改一下拉手指针 `O(1)`；但缺点是不能像数组那样直接喊“第 500 号是谁”（不支持随机下标访问），必须从排头第一个人顺着手拉手摸过去（`O(N)`）。',
        libraries: '【考场抄近道】在蓝桥杯如果题目让你模拟频繁在队伍中间插队、踢人，在 Python/C++ 里千万别真的new指针链表，直接用**数组模拟静态双链表**（开两个数组 `L[i]` 和 `R[i]` 分别存 `i` 的左手是谁、右手是谁），速度快 10 倍且绝不内存泄漏！'
      }
    },
    // 22. 图的遍历 BFS/DFS
    {
      id: 'graph_bfs_dfs',
      name: '图的遍历 (BFS/DFS)',
      en: 'Graph Traversal (BFS / DFS)',
      category: '图论算法',
      catId: 'c_03_search_basic',
      tier: 'C组',
      difficulty: '2',
      is408: true,
      dimensions: {
        origin: '复杂网络结构中节点多对多连接，包含回路甚至自环，若盲目遍历会陷入死循环或遍历不全。',
        principle: 'visited 状态标记与递归/队列驱动。DFS 沿着一条分支纵深探索到底，遇到已访问或死路则回溯；BFS 借助队列逐层像水波纹一样外扩，首次到达某节点时的步数即为无权图最短路。',
        applicability: '连通块染色（岛屿问题）、拓扑排序预处理、树的直径、走迷宫最短步数。',
        features: '邻接表实现下时空复杂度均为 O(V + E)；DFS 消耗递归系统栈空间，深树可能 RecursionError；BFS 队列占用宽度空间。',
        libraries: 'Python 构建图直接用字典或列表 graph = collections.defaultdict(list)；C++ 使用 vector<int> g[N]。'
      },
      eli5: {
        origin: '走一个陌生的迷宫找出口，人类有两种完全不同的探路性格：**DFS（深度优先）是“一根筋探险家”**，牵着一团毛线选一条路闷头走到黑，撞上死胡同就顺着毛线退回上一个岔路口换条路试；**BFS（广度优先）是“倒水波纹法”**，往起点倒一盆水，水波纹以每秒 1 格的速度同时往四面八方漫延，哪股水波最先漫到出口，走了几秒就是绝对的最短步数！',
        principle: '【手把手小剧场】为什么求“最少走几步走出迷宫”必须用 BFS 而不能用 DFS？因为 DFS 一根筋走到底，第一条碰到出口的路可能是绕了十八弯的远路；而 BFS 用一个**“先来后到排队管（FIFO 队列）”**：起点（0步）先入队 -> 弹出起点，把离起点 1 步的所有邻居入队 -> 再把离起点 2 步的所有邻居入队……队列里永远按 `0步、1步、2步、3步` 严格分层推进，所以**水波第一次碰到终点的那一瞬间，步数 100% 是最短的**！',
        applicability: '【做题暗号】① **求无权图/网格迷宫的“最短步数 / 最少操作次数”** 👉 必用 **BFS**；② **求“所有可能的路径方案 / 排列组合 / 连通块染色（岛屿数量）”** 👉 必用 **DFS 回溯**。',
        features: '【大白话算账】两者都会把可达的格子访问一遍，时间都是 `O(V + E)`。**极其重要的防超时死穴**：BFS 必须在**把邻居塞进队列的那一瞬间（`q.append` 时）就立刻给它盖上 `visited` 已访问章**，千万不能等弹出队列时才盖章，否则同一个格子会被周围四个邻居重复塞进队列几十次，当场内存爆炸！',
        libraries: '【考场抄近道】Python 写 DFS 递归如果层数超过 1000 层，开头必须加上救命代码 `import sys; sys.setrecursionlimit(200000)` 防止爆栈；写 BFS 必用 `collections.deque`。'
      }
    },
    // 23. Dijkstra 最短路
    {
      id: 'dijkstra',
      name: '单源最短路 Dijkstra',
      en: 'Dijkstra Algorithm',
      category: '图论算法',
      catId: 'b_05_dijkstra_spfa',
      tier: 'B组',
      difficulty: '4',
      is408: true,
      dimensions: {
        origin: '加权图中权值各异，无权图的简单 BFS 无法保证先到达的路径权值和最小；暴力穷举路径出现指数级爆炸。',
        principle: '贪心松弛与优先队列。基于非负权值特性，维护源点到各顶点的当前最短距离 dist。每一步挑出当前未确定顶点中距离最小者，其最短路已板上钉钉（不可能再通过其他未访问点绕出更短距离），进而拿它去松弛其所有出边邻居。',
        applicability: '网络路由、地图导航、所有边权严格为非负数的单源最短路径求解。',
        features: '堆优化版本时间复杂度为 O(E log V)；空间复杂度 O(V + E)；致命痛点：不能处理任何负权边（存在负权边会导致贪心前提崩溃）。',
        libraries: 'Python 使用 heapq 存储 (dist, u) 二元组；C++ 使用 priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> 实现小顶堆。'
      },
      eli5: {
        origin: '刚才迷宫里每走一步都算 1 步（边没有权重），所以水波纹 BFS 谁先到谁就最短。但如果在真实的高德地图上导航，从北京经天津到上海虽然要转 2 趟车（2步），但耗时 4 小时；直飞某种慢车虽然只走 1 步，却要 10 小时！当每条路长短（路费/耗时）不一样时，普通队列就不灵了，必须把普通队列升级成**“谁离起点总路程最短，谁就先出队”的小顶堆优先队列**——这就是 Dijkstra！',
        principle: '【手把手小剧场】每个人手里拿一张记分牌 `dist[]`，起初起点 `0号城` 记 `0公里`，其他城市全记 `∞（无穷远）`。每一步做两件事：① **挑最近**：从小顶堆候诊榜里喊出当前距离起点最近的城市 `u`（因为路上没有负数过路费，绕道别的城市只会更远，所以 `u` 的最短距离已经铁板钉钉了！）；② **借道砍价（专业词叫“松弛 Relax”）**：站在城市 `u` 往它的所有邻居城市 `v` 看，如果“先到 `u` 的路程 + 从 `u` 走到 `v` 的路程 < `v` 牌子上原本写的路程”，说明借道 `u` 走更近！立刻把 `v` 牌子上的距离改成这个更小的数，并把新成绩塞进小顶堆候诊榜！',
        applicability: '【做题暗号】地图导航、网络路由、最少花费送信——只要图里**所有边的权重都是非负数（`>= 0`）**，求从起点出发到某点（或所有点）的最短路径，无脑直接默写堆优化 Dijkstra！',
        features: '【大白话算账】时间复杂度 `O(E log V)`，十万条边也是眨眼算完。**唯一天敌：绝对不能有“负权边”**（比如走某条路不仅不花钱还倒贴你 100 块，那刚才“当前最近就铁板钉钉”的前提就破产了，遇到负权边必须换 Bellman-Ford / SPFA）。',
        libraries: '【考场抄近道】小顶堆里一定要把**距离 `d` 放在元组第一个位置 `(d, u)`**（因为 Python `heapq` 和 C++ `pair` 都是默认按第一个元素比大小！），出堆后加一句 `if d > dist[u]: continue` 就能直接跳过堆里过期的旧账单。'
      }
    },
    // 24. Bellman-Ford / SPFA
    {
      id: 'bellman_ford',
      name: '负权图最短路 Bellman-Ford / SPFA',
      en: 'Bellman-Ford & SPFA',
      category: '图论算法',
      catId: 'b_05_dijkstra_spfa',
      tier: 'B组',
      difficulty: '5',
      is408: true,
      dimensions: {
        origin: 'Dijkstra 无法处理存在负权边的网络，更无法检测图中是否存在导致最短路可以无限缩小的“负权回路（Negative Cycle）”。',
        principle: '动态规划全局松弛与队列优化。基于任何无环最短路至多包含 V-1 条边的定理，对全部边执行 V-1 轮松弛；若第 V 轮仍能成功松弛，证明存在负权环。SPFA 引入队列仅将距离发生改变的节点加入队列以优化常数。',
        applicability: '包含负权边的最短路径、差分约束系统、负权环判定。',
        features: 'Bellman-Ford 时间复杂度为 O(V · E)，稳定防卡；SPFA 平均时间 O(k · E)（k 为小常数），但在出题人构造的网格图上会退化为 O(V · E)。',
        libraries: '蓝桥杯与竞赛中如无负权尽量用 Dijkstra，有负权用 SPFA 并警惕退化防护。'
      },
      eli5: {
        origin: '如果图里真的有“走这条路能倒赚路费（负权边）”，甚至有一个“绕一圈路费反而倒减 50 块的时光机死循环（负权环）”，Dijkstra 就彻底失灵了。Bellman-Ford 的思路朴素而霸道：既然从起点到任何城市的最短路最多只会经过 `V - 1` 条边，那我就不管三七二十一，把全图所有边拿出来挨个做 `V - 1` 轮“借道砍价（松弛）”！',
        principle: '【手把手小剧场】第 1 轮扫遍所有边，找出所有“最多走 1 条边”的最短路；第 2 轮再扫遍所有边，找出“最多走 2 条边”的最短路……连做 `V - 1` 轮后，所有正常最短路必定全部算出来了！**怎么抓“负权环”？** 再多做第 `V` 轮扫描，如果到了第 `V` 轮居然还能继续砍价变小，说明图里一定有个能无限刷钱的“负权死循环”！而 **SPFA** 就是它的聪明改良版：上一轮只有成功降过价的城市 `u`，才有资格在下一轮去帮它的邻居降价，所以用一个队列只存刚刚降过价的城市，省去了大量无效扫描。',
        applicability: '【做题暗号】① 题目明确说**边权可能为负数**；② 让你判断图里**是否存在负权回路**；③ **差分约束系统**（一堆形如 `x_i - x_j <= c` 的不等式求可行解）。',
        features: '【大白话算账】标准 Bellman-Ford 时间是实打实的 `O(V · E)`；SPFA 平时极快接近 `O(E)`，但在没有负权边的图上千万别手贱用 SPFA，因为出题人会专门造网格图把 SPFA 卡回 `O(V · E)` 超时——**正权图死磕 Dijkstra，有负权才用 Bellman-Ford / SPFA**！',
        libraries: '【考场抄近道】如果题目限制“最多只能中转 K 次航班求最便宜机票（LeetCode 787）”，直接写 `K + 1` 轮 Bellman-Ford（每轮基于上一轮的 `dist` 备份数组去更新），10 行代码秒杀！'
      }
    },
    // 25. Floyd 全源最短路
    {
      id: 'floyd',
      name: '全源最短路 Floyd-Warshall',
      en: 'Floyd-Warshall',
      category: '图论算法',
      catId: 'b_05_dijkstra_spfa',
      tier: 'B组',
      difficulty: '3',
      is408: true,
      dimensions: {
        origin: '需要查询任意两点 (u, v) 之间的最短距离，若调用 V 次 Dijkstra 或 SPFA，代码繁琐且拓扑分析复杂。',
        principle: '动态规划中继点迭代。设 dp[k][i][j] 表示仅允许经过前 k 个顶点作为中继转折点时，从 i 到 j 的最短距离。状态转移：dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])。',
        applicability: '小规模密集图（V ≤ 400）的全源最短路求解、传递闭包（图的连通可达性矩阵推导）。',
        features: '极其简洁的 3 重循环代码；时间复杂度恒为严格 O(V³)；空间滚动压缩后为 O(V²)；允许存在负权边，但不能有负权回路。',
        libraries: 'Python 直接初始化二维邻接矩阵列表；C++ 使用二维数组 memset(dist, 0x3f, sizeof dist)。'
      },
      eli5: {
        origin: '如果题目不是只问你从 1 号城出发，而是有 1 万次询问，每次随便报两个城市 `(i, j)` 问你最短多远（全源最短路）。要是调 N 次 Dijkstra 代码又长又麻烦。Floyd 大神写出了一段全算法界最神奇的 **4 行三重循环代码**：依次允许大家借道 1 号城、2 号城……直到 N 号城当跳板，算完之后任意两座城市的最短路全在二维表里了！',
        principle: '【手把手小剧场】想象城市之间修路，起初只允许两座城市之间直达。① 第 1 阶段：开放 `0号城` 作为中转站，检查全图所有点对 `(i, j)`，看看“从 `i` 先到 `0` 再从 `0` 到 `j`”是不是比原来 `i -> j` 更近？近就更新 `dp[i][j] = min(dp[i][j], dp[i][0] + dp[0][j])`；② 第 2 阶段：再开放 `1号城` 也允许当中转站……直到把所有城市都开放完，任意两点间的最短路就彻底炼成了！【铁律警告】**中转站 `k` 必须写在最外层第一重循环**！如果把 `k` 写在最里层，很多路还没借道前面的跳板就固定死了，结果必错！',
        applicability: '【做题暗号】① **节点数量很少（通常 `V <= 200 ~ 400`）**，且需要频繁查询**任意两点之间**的最短距离；② 求图的传递闭包（判断任意两点能否互相到达）或求最小环。',
        features: '【大白话算账】代码极短（核心仅 4 行），支持负权边；但时间复杂度是死板的 `O(V³)`——所以看清数据范围：如果点数 `V = 200`，`200³ = 800万` 轻松满分；如果 `V = 2000`，`2000³ = 80亿` 必超时！',
        libraries: '【考场抄近道】初始化二维矩阵时，自己到自己 `dp[i][i] = 0`，其余设为无穷大 `float(\'inf\')`（C++ 用 `0x3f3f3f3f`，因为两个 `0x3f3f3f3f` 相加不会撑爆 `int` 溢出变负数！）。'
      }
    },
    // 26. 最小生成树
    {
      id: 'prim_kruskal',
      name: '最小生成树 (Kruskal / Prim)',
      en: 'Minimum Spanning Tree',
      category: '图论算法',
      catId: 'b_06_mst',
      tier: 'B组',
      difficulty: '4',
      is408: true,
      dimensions: {
        origin: '需要在带权连通图中选取 V-1 条边将所有节点连通，同时使得边权总和最小（如铺设电网、通信光缆最低造价）。',
        principle: '加权贪心生长。Kruskal（加边法）：将所有边按权值升序排序，借助并查集依次贪心加入不会造成回路的边直至连通；Prim（加点法）：从单点出发，利用优先队列贪心选取已选点集与未选点集之间权值最小的割边。',
        applicability: 'Kruskal 适合稀疏图（E ≪ V²），Prim 适合稠密图（E ≈ V²）。',
        features: 'Kruskal 时间复杂度 O(E log E)，代码极其优雅（排序 + 并查集）；Prim 堆优化时间为 O(E log V)。',
        libraries: '竞赛中最推荐 Kruskal，使用 Python edges.sort(key=lambda x: x[2]) + 并查集模板，不到 15 行搞定。'
      },
      eli5: {
        origin: '要在 N 个偏远村庄之间拉电线，要求每个村都能通上电（全连通），怎么拉电线才能让总造价最便宜？显然 N 个村只需要 `N - 1` 根电线（多拉一根就会形成多余的圈浪费钱）。Kruskal 的想法直白到小学生都能懂：**把所有能拉的电线按造价从便宜到贵排个序，只要这根电线连着的两个村还没通上电，就买下它！**',
        principle: '【手把手小剧场】假设有 4 个村庄，候选电线按价格排序后是：`1-2(1万)`、`2-3(2万)`、`1-3(3万)`、`3-4(4万)`。① 先看最便宜的 `1-2(1万)`：1 村和 2 村没通电，买！现在 `{1, 2}` 是一个通电阵营；② 看 `2-3(2万)`：2 村和 3 村不在同一阵营，买！现在 `{1, 2, 3}` 连成一片了；③ 看 `1-3(3万)`：查一下并查集发现 **1 村和 3 村早就通过 2 村连在一起了**，再买这根线就绕成圈浪费钱了，直接扔掉！④ 看 `3-4(4万)`：把 4 村也接入电网，凑齐了 `4 - 1 = 3` 根电线，总价 `1+2+4 = 7万` 全村通电收工！',
        applicability: '【做题暗号】修路、铺设光缆、连接所有岛屿的最低总成本、或者“为了让全图连通，最长那条边的最小值是多少（瓶颈生成树）”。',
        features: '【大白话算账】Kruskal 只需“排个序 + 并查集判环”，时间 `O(E log E)`，代码极其好写，适合边不算太多的稀疏图；如果图里的边密密麻麻（稠密图），则用按点扩张的 Prim 算法。',
        libraries: '【考场抄近道】如果跑完循环后买下的电线总数不到 `N - 1` 根，说明原图本身就是断开的孤岛，无法全村通电（按题目要求输出 `-1` 或 `impossible`）。'
      }
    },
    // 27. 拓扑排序
    {
      id: 'topological_sort',
      name: '拓扑排序 (Kahn 算法)',
      en: 'Topological Sort',
      category: '图论算法',
      catId: 'b_06_mst',
      tier: 'B组',
      difficulty: '3',
      is408: true,
      dimensions: {
        origin: '具有依赖关系的任务流（如大学课程先修依赖、软件编译包依赖），如何安排线性执行序列？如何判定依赖关系中是否存在死循环（有向图判环）？',
        principle: '入度清零与拓扑剥离。统计所有节点的入度（in-degree），将所有入度为 0 的节点（无任何前置依赖）推入队列；每次从队头出队一个节点，将其在图中删除，并将其所有邻接节点的入度减 1，若减为 0 则加入队列。',
        applicability: '有向无环图（DAG）的任务编排、判断有向图是否存在环、拓扑序上的动态规划。',
        features: '时间复杂度 O(V + E)；空间复杂度 O(V + E)；若最终出队节点总数 < V，则证明图中必定存在有向环。',
        libraries: 'Python 使用标准库 graphlib.TopologicalSorter（Python 3.9+ 官方自带！无需手写任何拓扑代码）；C++ 使用队列结合入度数组手写。'
      },
      eli5: {
        origin: '大学选课时，想学《算法设计》必须先学完《数据结构》，想学《数据结构》必须先学完《C语言》——这种“谁必须排在谁前面”的先后依赖关系网，怎么排出一份合法的学习先后顺序表？如果两门课互相要求先修对方（死锁成环），怎么一眼揪出来？这就是拓扑排序！',
        principle: '【手把手小剧场】我们给每门课挂上“前置依赖锁（专业词叫**入度 `in_degree`**，即有几个箭头指着它）”：`C语言` 不需要任何前置课（0 把锁），`数据结构` 有 1 把锁（等 C 语言），`算法` 有 1 把锁（等数据结构）。① **找 0 锁课**：把所有 0 把锁的课（`C语言`）推进“就绪可学队列”；② **修完拆锁**：学完 `C语言` 后，顺着它指出的箭头，把 `数据结构` 头上的锁拆掉 1 把；③ **解锁入队**：`数据结构` 的锁变成了 0 把！立刻把它也推进就绪队列……如果最后所有 N 门课都顺利解锁修完，排出的顺序就是拓扑序；如果队列空了还有课没解锁，说明剩下的课一定在互相死锁绕圈（有环）！',
        applicability: '【做题暗号】① **课程表 / 任务先后依赖编排 / 判断有向图里有没有环**；② **在有向无环图（DAG）上做动态规划**（比如求工程最早完工时间、食物链条数，必须先按拓扑序排好才能递推）。',
        features: '【大白话算账】每个点和每条边只会被拆锁扫描一次，时间 `O(V + E)`。注意：如果题目要求“输出字典序最小的拓扑序列”，只需把普通队列 `deque` 换成小顶堆 `heapq`（每次优先弹出编号最小的 0 锁课）即可！',
        libraries: '【考场抄近道】Python 3.9+ 标准库其实自带了拓扑排序神器：`from graphlib import TopologicalSorter`！但手写 Kahn 算法也只需 10 行，还能顺便维护 DP 状态，建议掌握手写模板。'
      }
    },
    // 28. 线性 DP
    {
      id: 'dp_linear',
      name: '线性 DP / 最长上升子序列 LIS',
      en: 'Linear DP / LIS',
      category: '动态规划',
      catId: 'c_07_dp_1d',
      tier: 'C组',
      difficulty: '3',
      is408: true,
      dimensions: {
        origin: '寻找数组中的最长单调上升子序列，暴力枚举所有子序列可能性高达 O(2^N)，出现指数级组合爆炸。',
        principle: '无后效性与最优子结构。定义状态 dp[i] 为以第 i 个元素结尾的最长上升子序列长度，转移时仅需在满足 arr[j] < arr[i] 的前驱状态中取最大值再加 1；进阶贪心 + 二分可将复杂度进一步压至对数级。',
        applicability: '最长上升子序列、最大连续子数组和、打家劫舍、数字三角形。',
        features: '朴素动态规划时间复杂度 O(N²)；贪心 + 耐心排序二分优化后时间可达 O(N log N)；空间复杂度 O(N)。',
        libraries: 'Python 使用 bisect.bisect_left 结合耐受数组贪心替换维护当前递增尾部；C++ 使用 std::lower_bound。'
      },
      eli5: {
        origin: '动态规划（DP）听名字高大上，其实大白话就四个字：**“记账接力”**！比如在 `[10, 9, 2, 5, 3, 7]` 里挑出尽可能多的数（不用挨着），要求从左往右越来越大（最长上升子序列 LIS）。如果暴力把所有挑法全试一遍要试 `2^N` 次；但如果每走到一个数，只问它前面那些比它矮的数：“兄弟，到你这儿最长能排几个？我在你后面接一个！”，算过的账记在本子上绝不重算，瞬间就变快了！',
        principle: '【手把手小剧场】给每个数字配一张记分牌 `dp[i]`，表示“以第 `i` 个数收尾的递增队伍最长有几个人”（保底自己一个人，所以起初全填 `1`）。看 `[2, 5, 3, 7]`：① `2` 记 `1`；② 走到 `5`：回头看前面的 `2` 比 `5` 小，`5` 接在 `2` 后面，队伍变成 `1 + 1 = 2` 人；③ 走到 `3`：回头看，`5` 比 `3` 大接不上，只能接在 `2` 后面，记 `1 + 1 = 2` 人；④ 走到 `7`：回头一看，`2(1人)、5(2人)、3(2人)` 全比 `7` 小！`7` 当然挑队伍最长的 `5`（或 `3`）后面接上去，变成 `2 + 1 = 3` 人（即 `[2, 5, 7]`）！',
        applicability: '【做题暗号】求序列的最长递增子序列（LIS）、最长公共子序列（LCS）、最大连续子数组和、打家劫舍、爬楼梯、合唱队形（正着求一遍 LIS + 倒着求一遍 LIS）。',
        features: '【大白话算账】普通回头看一遍是 `O(N²)`（适合 `N <= 5000`）；如果 `N = 100000`，可以用“贪心 + 二分替换”把复杂度压到 `O(N log N)`（维护一个最小末尾潜力股数组，用 `bisect_left` 替换）。',
        libraries: '【考场抄近道】注意最后答案是 `max(dp)`（全场记分牌里的最高分），**千万别写成 `dp[-1]`**，因为最长的递增队伍不一定是以数组最后一个数收尾的！'
      }
    },
    // 29. 背包 DP
    {
      id: 'knapsack_01',
      name: '0-1 背包与完全背包',
      en: '0-1 & Complete Knapsack',
      category: '动态规划',
      catId: 'b_03_knapsack',
      tier: 'B组',
      difficulty: '4',
      is408: true,
      dimensions: {
        origin: '容量有限的背包如何装载物品使得总价值最高，每件物品仅有一件。暴力枚举为 O(2^N)，贪心单位价值在整除不尽时被反例轻易推翻。',
        principle: '子问题状态表格递推。定义 dp[i][j] 为前 i 件物品在容量上限为 j 时的最大总价值，转移为“不选物品 i”与“选物品 i 并继承前 i-1 件在容量 j - w[i] 下的最佳解”取较大者；空间滚动优化为一维逆序更新（0-1背包）或正序更新（完全背包）。',
        applicability: '体积与价值优化、分割等和子集、零钱兑换、目标和组合。',
        features: '时间复杂度 O(N · V)（伪多项式时间）；一维空间优化后空间仅需 O(V)；注意 0-1 背包容积循环必须逆序以保证每件物品只用一次！',
        libraries: 'Python 使用一维列表 dp = [0] * (V + 1)，配合简洁双层循环。'
      },
      eli5: {
        origin: '你背着一个最多能装 `7 斤` 的书包去寻宝，面前有 3 块金条：`小金条(2斤, 值3万)`、`中金条(3斤, 值5万)`、`大金条(4斤, 值7万)`。如果**每块金条只有 1 块**（选了就没了），叫 **0-1 背包**；如果每块金条旁边都有一台**无限补货机**（只要装得下可以拿无数块同样的），就叫**完全背包**！怎么装才能拿走最值钱的宝贝？',
        principle: '【手把手小剧场：一眼看穿两者的唯一区别】我们画一张二维账本 `dp[i][j]`（代表只考虑前 `i` 种金条、书包容量为 `j` 斤时的最高价值）。每面对第 `i` 种金条（重 `w`，值 `v`），你站在容量 `j` 的格子里把两个选择放到天平上比大小：① **不拿这块金条**：书包容量没少，直接照抄**正上方上一行**的账目 `dp[i-1][j]`；② **拿一块这金条**：必须先在书包里腾出 `w` 斤空位（剩 `j - w` 斤），加上这块的价值 `v`。那剩下的 `j - w` 斤查哪里的账本？👉 **0-1 背包因为每种只能拿 1 块，必须查【上一行左上方】的 `dp[i-1][j-w] + v`**；👉 **完全背包因为可以拿完一块再拿一块，直接查【同一行左边】刚刚算好的 `dp[i][j-w] + v`**！全宇宙最难混的背包双雄，其实代码只差一个 `i-1` 和 `i`！',
        applicability: '【做题暗号】① 给一个总容量/总预算/总时间，求最多能装多少价值或有多少种凑法；② 经典变形：**分割等和子集**（能否挑出几个数凑成总和的一半 👉 0-1背包）、**零钱兑换**（硬币无限用凑出金额 👉 完全背包）。',
        features: '【大白话算账】时间 `O(N · W)`。如果把二维表格压缩成一维数组 `dp[j]` 省内存，记住八字真言：**“0-1 背包容量倒着循环（防重复拿），完全背包容量正着循环（借力重复拿）”**！',
        libraries: '【考场抄近道】如果题目没那么卡内存，考场上直接写二维数组 `dp[n+1][W+1]` 最稳妥，完全不用担心一维正序倒序搞混丢分！'
      }
    },
    // 30. 区间 DP
    {
      id: 'dp_interval',
      name: '区间 DP (石子合并)',
      en: 'Interval DP',
      category: '动态规划',
      catId: 'a_01_state_interval_dp',
      tier: 'A组',
      difficulty: '6',
      is408: false,
      dimensions: {
        origin: '环形或链式相邻石子两两合并，得分与合并次序息息相关。贪心选择当前局部最小两堆合并在全局往往导致糟糕解。',
        principle: '从小区间向大区间层层递推。定义 dp[i][j] 为合并区间 [i, j] 内所有石子的最小或最大得分。按区间长度 len 从 2 递增到 n 外层循环，内层枚举分割断点 k ∈ [i, j-1]，利用前缀和快速获取合并产生的新增代价。',
        applicability: '石子合并、括号匹配加权、多边形三角剖分、矩阵连乘最优顺序。',
        features: '时间复杂度标准版 O(N³)（四边形不等式优化后可达 O(N²)）；空间复杂度 O(N²)；环形问题倍长为 2N 展开处理。',
        libraries: 'Python 使用记忆化搜索 @functools.lru_cache(None) 递归实现，代码逻辑更加自然不易写错边界。'
      },
      eli5: {
        origin: '地上排着 4 堆石子 `[3, 4, 2, 5]`，每次只允许把**紧挨着的两堆**合在一起，付出的体力等于这两堆石子加起来的重量。怎么安排合并先后顺序，才能花最少的体力把它们合成一大堆？如果你贪心地每次挑当前最小的两堆合，最后算出来往往不是全局最省力的！',
        principle: '【手把手小剧场】逆向思维：不管前面怎么合，**最后一步**一定是把左边合成的一大堆 `[i..k]` 和右边合成的一大堆 `[k+1..j]` 合二为一！这就像一把激光刀 `k` 在区间 `[i..j]` 中间挨个位置切一刀试试：总代价 = `左边大堆的历史合并费 dp[i][k]` + `右边大堆的历史合并费 dp[k+1][j]` + `最后合体这一把的石子总重 sum(i..j)`。因为算长区间必须先用到短区间的结果，所以**最外层第一重循环必须按区间长度 `length = 2, 3, ..., N` 从短到长算**（在表格里就是沿着斜对角线往右上角一层层推）！',
        applicability: '【做题暗号】石子合并、戳气球、切木棍最小成本、最长回文子序列、括号配对——凡是“小段合成大段、大段由左右两小段拼成”且 `N <= 300` 的题，统统是区间 DP！',
        features: '【大白话算账】三层循环（第一层长度 `len`，第二层起点 `i`，第三层切刀 `k`），时间复杂度 `O(N³)`。如果题目说石子排成一圈（环形石子合并），只需把数组复制一份接在屁股后面变成 `2N` 长度破环成链即可！',
        libraries: '【考场抄近道】在 Python 中如果怕写错三层循环的下标边界，直接用记忆化搜索 `@functools.lru_cache(None)` 写递归函数 `dfs(i, j)` 枚举切刀 `k`，逻辑天然而清晰，绝不会写反循环顺序！'
      }
    },
    // 31. 树形 DP
    {
      id: 'dp_tree',
      name: '树形 DP (没有上司的舞会)',
      en: 'Tree DP',
      category: '动态规划',
      catId: 'a_01_state_interval_dp',
      tier: 'A组',
      difficulty: '6',
      is408: false,
      dimensions: {
        origin: '树形层次组织中，每个节点有权值，但选了上司就不能选直接下属，如何求出全树可选最大权重和？全图搜索状态分支过于庞杂。',
        principle: '自底向上后序遍历汇聚。树天然具有递归子结构，通过 DFS 深入叶子节点，定义 dp[u][0] 为不选节点 u 时的子树最大值，dp[u][1] 为选中节点 u 时的子树最大值。子树结果全部算出后汇聚至根节点。',
        applicability: '没有上司的舞会、树的重心、树的直径、二叉树中的最大路径和、监控二叉树。',
        features: '每个节点与其相连边仅被访问常数次，时间复杂度严格 O(N)；空间复杂度递归栈深度 O(H)。',
        libraries: 'Python 递归深树时需先设置 sys.setrecursionlimit(200000) 防止爆栈；C++ 配合邻接表直接递归。'
      },
      eli5: {
        origin: '公司办年会，每个人有个快乐值，但有个奇葩规矩：如果某个领导去了，他的直接下属就紧张得不敢去（不能同时选父节点和子节点）。怎么挑参会名单才能让全场总快乐值最高？',
        principle: '【手把手小剧场】每个部门领导 `u` 拿一张双格账单：`dp[u][0]` 记“领导 `u` **不去**时，他整个部门能凑出的最高快乐值”；`dp[u][1]` 记“领导 `u` **去**时，他整个部门的最高快乐值”。派人从最底层没有手下的普通员工往上汇报（后序 DFS）：① 如果领导 `u` **决定去（`dp[u][1]`）**，那他的直属下属 `v` 统统不能去，只能加上所有下属的 `dp[v][0]`；② 如果领导 `u` **决定不去（`dp[u][0]`）**，那每个下属 `v` 去不去都随意，直接挑下属 `max(dp[v][0], dp[v][1])` 较大值加起来！等汇报到大老板根节点时，看一眼大老板去还是不去更高就完事了！',
        applicability: '【做题暗号】题目给的是一棵树（或者 `N` 个点 `N-1` 条边的连通图），求树上最大独立集（没有上司的舞会）、树的直径（树上最远两点的距离）、树的重心、二叉树监控摄像头。',
        features: '【大白话算账】自底向上每个节点只汇报一次，时间复杂度是极快的 `O(N)`。',
        libraries: '【考场抄近道】Python 写树上 DFS 递归前，一定记得第一行写 `import sys; sys.setrecursionlimit(300000)`，否则树退化成一条长链时必报 `RecursionError`！'
      }
    },
    // 32. 欧几里得与线性筛
    {
      id: 'gcd_sieve',
      name: '欧几里得 GCD 与线性筛素数',
      en: 'Euclidean GCD & Linear Sieve',
      category: '数学与博弈',
      catId: 'c_04_greedy',
      tier: 'C组',
      difficulty: '2',
      is408: true,
      dimensions: {
        origin: '求两个超大整数的最大公约数若用因数分解需 O(√N)；在区间 [1, N] 内筛选素数，朴素检验每个数耗时 O(N √N)，埃氏筛因重复标记合数耗时 O(N log log N)。',
        principle: '辗转相除余数化简与每个合数只被其最小质因数筛除一次。欧几里得算法基于 gcd(a, b) = gcd(b, a mod b)；欧拉线性筛利用质数数组与 if (i % primes[j] == 0) break; 核心剪枝，确保每个合数仅被其最小质因子筛选一次。',
        applicability: '分式化简、模逆元前置、区间素数打表统计、欧拉函数计算。',
        features: 'GCD 时间复杂度对数级 O(log(min(a, b)))；线性筛时间复杂度为严格的线性 O(N)；空间复杂度 O(N)。',
        libraries: 'Python 内置 import math，math.gcd(a, b)（底层 C 加速，支持多参数）；C++ 17 官方提供 std::gcd(a, b) 与 std::lcm(a, b)。'
      },
      eli5: {
        origin: '数论有两座大厦基石：① 怎么一口气找出 100 万以内的所有质数（素数）？如果每个数都去除以 `2 ~ √n` 会慢死；② 怎么求两个大数的最大公约数 `gcd(48, 18)`？',
        principle: '【手把手小剧场】① **素数筛法（倍数连坐消消乐）**：把 `2 ~ N` 列成一张百数表。先圈出 `2` 是素数，然后像机关枪一样把 `2` 的所有倍数（`4, 6, 8, 10...`）全部划掉！接着看下一个没被划掉的 `3` 是素数，再从 `3×3=9` 开始把 `3` 的倍数（`9, 12, 15...`）全划掉（这就叫埃氏筛）；而更牛的**欧拉线性筛**加了一条铁律 `if i % p == 0: break`，保证像 `12` 这样的合数只会被它的最小质因子 `2`（`6×2`）划掉一次，绝不再被 `3`（`4×3`）重复划第二次，达到纯粹的 `O(N)`！② **欧几里得辗转相除（铺瓷砖法）**：想用最大的正方形瓷砖严丝合缝铺满 `48 × 18` 的长方形房间，先切出两个 `18 × 18` 的大正方形，还剩下一条 `18 × 12` 的窄条；接着在窄条里切出一个 `12 × 12` 的正方形，最后剩 `12 × 6`，刚好被两个 `6 × 6` 的正方形铺满！所以最大公约数就是 `6`（口诀：`gcd(a, b) = gcd(b, a % b)`）！',
        applicability: '【做题暗号】分数化简、周期相遇最小公倍数 `lcm(a, b) = a * b // gcd(a, b)`、质因数分解、打表统计区间素数个数。',
        features: '【大白话算账】辗转相除法每两步数字至少缩水一半，求百亿大数的 GCD 也只需十几次取模 `O(log N)`；线性筛找出 1000 万以内的所有素数只需不到 0.1 秒！',
        libraries: '【考场抄近道】求最大公约数和最小公倍数**千万别手写**！Python 直接调内置 C 加速库 `import math; math.gcd(a, b)` 和 `math.lcm(a, b)`；C++17 直接调 `std::gcd(a, b)` 和 `std::lcm(a, b)`（在 `<numeric>` 头文件里）！'
      }
    },
    // 33. 快速幂与逆元
    {
      id: 'fast_pow',
      name: '快速幂与模逆元',
      en: 'Fast Exponentiation & Modular Inverse',
      category: '数学与博弈',
      catId: 'c_04_greedy',
      tier: 'C组',
      difficulty: '3',
      is408: false,
      dimensions: {
        origin: '计算 a^b mod m，当 b 达到 10¹⁸ 时，直接循环累乘需要跑数百年直接 TLE；且运算过程中数值急剧膨胀溢出。',
        principle: '二进制指数展开与倍增思想。将幂指数 b 拆解为二进制位，a^b = a^(∑ 2^(k_i))。每循环一步底数自我平方（a ← a² mod m），遇指数二进制当前位为 1 则乘入答案中；费马小定理结合快速幂直接在 O(log m) 时间内求出模逆元。',
        applicability: '大数取模、组合数取模除法运算（乘以逆元）、矩阵快速幂加速递推（Fibonacci 数列）。',
        features: '时间复杂度极度压缩至对数级 O(log b)；空间复杂度 O(1) 常数；每一步相乘后立刻取模防止溢出。',
        libraries: 'Python 原生内置三参数版本的 pow(a, b, mod) 已经自动使用了高度优化的快速幂算法！无需手写；C++ 手写 5 行模板函数。'
      },
      eli5: {
        origin: '如果题目让你算 `3 的 10亿次方 除以 1000000007 的余数`，你要是写个循环把 `3` 乘 10 亿次，电脑得算好几秒直接判超时（TLE）。但如果你利用“平方翻倍”：`3¹ -> 3² -> 3⁴ -> 3⁸ -> 3¹⁶...`，只需要乘 30 次就能飙到 10 亿次方！',
        principle: '【手把手小剧场】怎么算 `3¹³`？把指数 `13` 拆成二进制：`13 = 8 + 4 + 1 = (1101)₂`。这就好比你有面值为 `3¹、3²、3⁴、3⁸` 的翻倍砝码，我们一边让底数自己平方翻倍（`a = a * a % mod`），一边看指数 `13` 的二进制末位是不是 `1`：如果是 `1`，就把当前翻倍好的砝码乘进答案里（`3¹³ = 3⁸ × 3⁴ × 3¹`），总共只算了 4 步！【什么是模逆元？】在取模的世界里，加、减、乘都能随时取模，唯独**除法不能直接取模**（`(a / b) % p` 是错的！）。费马小定理告诉我们：当模数 `p` 是质数时，**除以 `b` 完全等价于乘以 `b 的 (p-2) 次方`**！直接用快速幂算出 `pow(b, p-2, p)` 就是 `b` 的乘法逆元！',
        applicability: '【做题暗号】① 指数很大（`10^9 ~ 10^18`）的幂运算取模；② 组合数求方案数时遇到分数除法对 `10^9 + 7` 或 `998244353` 取模。',
        features: '【大白话算账】把 10 亿次乘法直接压缩成 30 次乘法，时间复杂度 `O(log b)`，空间 `O(1)`。',
        libraries: '【考场抄近道】**Python 选手最大的考场福利**：Python 内置的 `pow(a, b, mod)` 填上第 3 个参数后，底层就是用 C 语言写的超级快速幂！甚至在 Python 3.8+ 中直接写 `pow(b, -1, p)` 就能直接算出模逆元，一行代码都不需要手写！'
      }
    },
    // 34. 博弈论 Nim
    {
      id: 'game_nim',
      name: '博弈论 Nim 游戏与 SG 定理',
      en: 'Game Theory (Nim & SG Theorem)',
      category: '数学与博弈',
      catId: 'a_05_game_theory',
      tier: 'A组',
      difficulty: '7',
      is408: false,
      dimensions: {
        origin: '多堆石子取子博弈，双方均采取最优策略，状态分支组合爆炸，朴素极小化极大算法对抗搜索在稍多石子数时即死机。',
        principle: '异或和与 Sprague-Grundy 定理。查尔斯·布顿 (Charles Bouton) 证明了 Nim 游戏的必胜充要条件为所有堆石子数的异或和（XOR sum）不为 0；对于更复杂的无偏组合博弈游戏，利用有向图游戏的 Mex 运算将任意游戏抽象为等价单一堆大小为 SG(x) 的 Nim 堆。',
        applicability: '石子合并对抗博弈、翻硬币游戏、阶梯博弈、Nim 变种。',
        features: '时间复杂度异或和仅需 O(N) 极速判定；空间复杂度 O(1)；考场神仙解法，看透规律直接一行代码 AC。',
        libraries: 'Python 使用 functools.reduce(lambda x, y: x ^ y, piles) 计算整体异或和；C++ 结合 ^ 运算符累加。'
      },
      eli5: {
        origin: '桌上有 3 堆石子 `[3, 4, 5]`，你和对手轮流从任意一堆里拿走至少 1 颗石子（拿多少不限，但不能跨堆拿），谁拿走最后一颗石子谁就赢。如果两个人都绝顶聪明，先拿的人到底是必胜还是必败？第一步该怎么拿？',
        principle: '【手把手小剧场】千万别去画成千上万种拿法的树！数学家 Bouton 发现了降维打击的天机：**把每堆石子数写成二进制对齐排成表，看每一竖列 `1` 的个数是奇数还是偶数（即算全部石子堆的异或和 `3 ^ 4 ^ 5`）**！为什么？因为最终获胜的终点状态是全桌 0 颗石子 `[0, 0, 0]`（所有二进制列都是偶数个 1，异或和 `= 0`）。如果你算出来当前异或和**不等于 0**（比如 `3 ^ 4 ^ 5 = 2 != 0`），你只需从某堆里拿走几颗石子（把第 1 堆的 `3` 拿走 2 颗变成 `1`，使场面变成 `[1, 4, 5]`，异或和变成 `0`）扔给对手！对手面对异或和为 `0` 的局面，不管他从哪堆拿走几颗，必然会把至少一列的偶数个 1 变成奇数个 1（异或和变回非 0），你再顺手把它抹平回 `0`……对手永远在给你打工，直到你拿走最后一颗！',
        applicability: '【做题暗号】两人轮流操作、规则完全公平、不能弃权、最后无法操作者判负的博弈题，看到多堆独立游戏直接算异或和（Nim 和）。',
        features: '【大白话算账】不管有几万堆石子、每堆有几亿颗，只需把所有数字做一遍异或 `^`，`O(N)` 瞬间出结果：**异或和 `!= 0` 先手必胜，异或和 `== 0` 先手必败**！',
        libraries: '【考场抄近道】Python 一行算完所有石子堆的异或和：`from functools import reduce; from operator import xor; win = reduce(xor, piles) != 0`。'
      }
    },
    // 35. 前缀和与差分
    {
      id: 'prefix_diff',
      name: '前缀和与一维/二维差分',
      en: 'Prefix Sum & Difference Array',
      category: '数学与博弈',
      catId: 'c_05_simulation',
      tier: 'C组',
      difficulty: '2',
      is408: false,
      dimensions: {
        origin: '频繁对数组的一段区间 [l, r] 进行加法修改（如加 d），若每次暴力遍历修改开销为 O(N)，M 次操作总耗时高达 O(M · N)。',
        principle: '微积分互逆映射思想。前缀和是累加积分，差分是离散导数；区间 [l, r] 全部加上 d，等价于在其差分数组上仅修改两个端点：diff[l] += d 与 diff[r+1] -= d，将 O(N) 修改降为 O(1)，最后做一遍前缀和即可还原全貌。',
        applicability: '高频区间加减操作离线批量更新、二维矩阵区域增减（二维差分）、二维子矩阵和快速查询。',
        features: '修改操作时间 O(1)，最终前缀还原时间 O(N)；空间复杂度 O(N) 或 O(N × M)；注意边界 r+1 必须在数组有效索引内。',
        libraries: 'Python 使用 itertools.accumulate 快速求前缀和；C++ STL 提供 std::partial_sum。'
      },
      eli5: {
        origin: '想象有一排 10 万个储蓄罐，老板连续下了 10 万道指令：“把第 100 号到第 50000 号储蓄罐里每个都投 5 块钱”。如果每次都傻傻从 100 遍历跑到 50000 挨个投币，得累瘫超时。差分法就像在两头放小纸条：在 100 号放 +5，在 50001 号放 -5，只要两步就交差！',
        principle: '【手把手小剧场：借道记账与水流累加】前缀和与差分是一对互逆的神仙兄弟！前缀和就像水库蓄水量（不断累加历史注水量）；差分就像进水阀门变化率。要给区间 [L, R] 批量加上 d，只需在 L 处把阀门开大 diff[L] += d（水流从这开始变大），在 R + 1 处把阀门关小 diff[R+1] -= d（水流从这恢复原样）。全部批量修改做完后，从左往右扫一遍算前缀和，水流哗啦啦一冲，中间所有的储蓄罐瞬间全自动加上了 d！',
        applicability: '【做题暗号】① 频繁对连续区间做批量加减数值，最后统一查结果；② 二维差分与二维前缀和（区域地毯覆盖、航线高度统计、子矩阵求和）。',
        features: '【大白话算账】每次区间修改只需 O(1) 改两头！最后还原只需 O(N) 扫一遍。比线段树简单 100 倍！注意数组长度要留出 R+1 的空位防越界。',
        libraries: '【考场抄近道】Python 快速求前缀和直接用 from itertools import accumulate; pref = [0] + list(accumulate(arr))；C++ 用 std::partial_sum(arr.begin(), arr.end(), pref.begin());。'
      }
    },
    // 36. Manacher 最长回文子串
    {
      id: 'manacher',
      name: 'Manacher 最长回文子串',
      en: 'Manacher Algorithm',
      category: '查找与字符串',
      catId: 'b_14_strings',
      tier: 'B组',
      difficulty: '5',
      is408: true,
      dimensions: {
        origin: '传统中心扩展法在最坏情况下（如全 a 字符串）耗时高达 O(N²)，且需要分奇数长度和偶数长度两种繁琐情况讨论。',
        principle: '插符统一步长与回文对称镜像复用。在字符间插入特殊符号（如 #）统一奇偶，维护当前最右回文边界 R 与对称中心 C，利用关于中心 C 的对称点 i_mirror 历史半径直接初始化当前点半径，跳过大量重复扩展。',
        applicability: '最长回文子串长度及其具体串输出、回文串计数、回文前后缀划分与博弈判定。',
        features: '时间复杂度严格线性 O(N)，最右边界 R 单调推进绝不回退；空间复杂度插入字符后为 O(N)。',
        libraries: '竞赛中推荐手写马拉车模板（核心仅 15 行代码）；Python 原生切片与中心扩展在小数据下可用。'
      },
      eli5: {
        origin: '回文串就是正着读反着读都一样的词（比如 `aba` 或 `abba`）。找最长回文子串时有两个头疼事：① 奇数长（`aba` 中心是 `b`）和偶数长（`abba` 中心在两个 `b` 缝隙里）要分两套代码写；② 每个位置都往两边扩一遍要 `O(N²)`。马拉车（Manacher）算法用两个绝妙点子把这两个麻烦全灭了！',
        principle: '【手把手小剧场】**第一招（插栏杆统一奇偶）**：在每个字母中间都插一个井号 `#`，比如 `aba` 变成 `#a#b#a#`（7个字符，奇数），`abba` 变成 `#a#b#b#a#`（9个字符，也是奇数！），从此天下再无偶回文！**第二招（照镜子偷懒）**：我们在往右扫描时，记住当前伸得最远的那个大回文罩子的**中心镜面 `C`** 和**最右边缘 `R`**。当走到 `C` 右边的位置 `i`（还在罩子 `R` 里面）时，因为大回文罩子左右完全对称，直接看 `i` 在镜子左边对应的孪生兄弟 `i_mirror = 2C - i` 的回文半径有多长，直接抄过来当保底半径，超出 `R` 的部分再继续往外扩两步就行！',
        applicability: '【做题暗号】字符串长度达到 `10^5 ~ 10^6`，要求在 `O(N)` 线性时间内求出“最长回文子串的长度”或“全串一共有多少个回文子串”。',
        features: '【大白话算账】因为只有冲破最右边界 `R` 时才会真的去做字符比对，而 `R` 从头到尾最多往右走 `2N` 步，所以哪怕代码里有 `while` 循环，总时间依然是不可思议的纯 `O(N)`！',
        libraries: '【考场抄近道】插桩串里算出的回文半径 `P[i]` 有个神奇巧合：**`P[i]` 的数值刚好就等于它在原字符串里对应的真实回文长度**，连换算都省了！'
      }
    },
    // 37. 欧拉回路/通路
    {
      id: 'eulerian_path',
      name: '欧拉回路与欧拉通路',
      en: 'Eulerian Path & Circuit',
      category: '图论算法',
      catId: 'b_15_graph_theory',
      tier: 'B组',
      difficulty: '5',
      is408: true,
      dimensions: {
        origin: '一笔画问题（哥尼斯堡七桥问题）是图论发轫之源。如何在不重复走过任何一条边的前提下遍历全图所有边？盲目回溯搜索会遇到指数级深搜分支爆炸。',
        principle: '度数奇偶判定与 Hierholzer 删边倒序入栈。无向图全偶度数存在回路，恰有两个奇度数点存在通路；通过递归深度优先遍历，走过一条边立刻从邻接表中删除（当前弧优化），在回溯时将顶点推入结果栈，最后逆序输出。',
        applicability: '一笔画问题、重构飞行航线（LeetCode 332）、DNA 测序重组片段连接（De Bruijn 图）。',
        features: '时间复杂度严格线性 O(V + E)；空间复杂度递归栈与结果数组为 O(V + E)；必须使用当前弧优化否则在完全图稠密多重边下退化为 O(E²)。',
        libraries: 'Python 使用 defaultdict(list) 并对出边排序后执行 dfs 循环弹出；C++ 使用 head/head 链式前向星当前弧优化。'
      },
      eli5: {
        origin: '小时候玩过的“一笔画图形”游戏：笔尖不离开纸面，把图里每一条线都刚好走一遍、绝不重复走。18 世纪大数学家欧拉研究哥尼斯堡七桥问题时，一举找出了什么样的图能一笔画完的铁律，而 Hierholzer 算法则给出了怎么把这一笔画路线打印出来的神仙写法。',
        principle: '【手把手小剧场】首先背下**欧拉一笔画判别铁律**（看每个点连着几条线，即度数）：① 如果全图所有点的连线数都是**偶数**（有进必有出），从随便哪个点出发都能一笔画完并回到起点（叫**欧拉回路**）；② 如果只有**恰好 2 个点**连线数是奇数，必须从一个奇数点出发、在另一个奇数点收尾（叫**欧拉通路**）；③ 其他情况统统画不出来！怎么找出路线？**“走过即拆桥 + 死胡同倒着记”**：顺着线随便走，每走过一条线就把它擦掉；一旦走到某个点无路可走了（死胡同），就把这个点记到本子末尾，然后退回上一步继续把剩下的小圈走完，最后把本子上的记录**倒过来念**，就是完美的一笔画路线！',
        applicability: '【做题暗号】重新安排行程（机票首尾相接用完所有机票，LeetCode 332）、破解密码箱（De Bruijn 序列）、单词接龙一笔画完所有词。',
        features: '【大白话算账】每条边只走一次就被拆掉，时间复杂度 `O(V + E)`。为什么死胡同要倒着记？因为最先走入死胡同的那个点，恰恰是整趟一笔画旅途真正的终点！',
        libraries: '【考场抄近道】如果题目要求“输出字典序最小的一笔画路径”，只需在建图后把每个点的邻居列表先排个序，每次优先挑编号最小的邻居走即可。'
      }
    },
    // 38. 32位位运算沙盒
    {
      id: 'bitmask_sandbox',
      name: '32位位运算与状态压缩',
      en: '32-Bit Bitmask & Sandbox',
      category: '数学与博弈',
      catId: 'b_18_geom_game',
      tier: 'B组',
      difficulty: '4',
      is408: false,
      dimensions: {
        origin: '小规模集合（N ≤ 20）子集枚举或状态传递时，使用数组或集合对象开销极大，内存占用高且哈希比对严重拖慢运行效率。',
        principle: '以二进制整数位映射集合布尔状态。利用位与 &、位或 |、异或 ^、取反 ~ 及移位运算，在 CPU 寄存器级别单周期完成并集、交集、对称差、子集枚举和最低有效位提取 (lowbit)。',
        applicability: '旅行商问题 (TSP) 状压 DP、八皇后棋盘掩码、集合划分极值问题、状态空间压缩与去重。',
        features: '单次位操作耗时恒为 O(1) CPU 单周期时钟，运行速度极快；状态总数为 2^N，当 N > 25 时状态数超过 3×10⁷ 需警惕内存空间溢出。',
        libraries: 'Python 使用 bin(x).count("1") 或 x.bit_count()（Python 3.10+ 高速内置）；C++ 使用 __builtin_popcount(x) 与 __builtin_ctz(x)。'
      },
      eli5: {
        origin: '电脑底层只认识 `0` 和 `1`（二进制）。普通加减乘除是把数字当整体算，而位运算是直接同时拨动 32 个二进制开关，不仅速度是 CPU 最顶级的 1 纳秒级，还能用一个整数的二进制开关来表示“哪几个物品被选了（状态压缩）”！',
        principle: '【手把手小剧场：四大必背魔法开关】拿数字 `x = 12`（二进制是 `1100₂`，代表第 3 位和第 2 位亮灯）举例：① **`x & (x - 1)`（精准关掉最右边那盏亮着的灯）**：`12 - 1 = 11`（二进制 `1011₂`），`1100₂ & 1011₂ = 1000₂`（最右边的 `1` 被抹掉了！用它循环抹 `1` 就能极速数出有几个 1，也能判断一个数是不是 2 的整数次幂）；② **`x & (-x)`（只保留最右边那盏亮着的灯 `lowbit`）**：在计算机补码里，负数 `-x` 就是“把 `x` 的 0 和 1 全反过来再加 1”，一做按位与 `&`，前面全抵消，只剩最低位的 `100₂ = 4` 亮着！③ **判断第 `k` 位是不是 1**：`(x >> k) & 1`；④ **把第 `k` 位点亮为 1**：`x | (1 << k)`。',
        applicability: '【做题暗号】① 只出现一次的数字（全员异或 `^`，因为相同的两个数异或等于 `0`，`a ^ a = 0`）；② 枚举所有子集 / 旅行商问题（状态压缩 DP，`N <= 20` 时用一个整数代替布尔数组）。',
        features: '【大白话算账】所有操作都是 `O(1)` 硬件指令级。唯一避坑点：在 C++ 和 Python 中，**位运算符（`&`, `|`, `^`, `<<`, `>>`）的优先级比加减法和比较号（`==`, `<`）还低**，拿不准时一定要顺手多套一层括号！',
        libraries: '【考场抄近道】统计一个整数二进制里有几个 `1`：Python 3.10+ 直接调 `x.bit_count()`（或 `bin(x).count(\'1\')`）；C++ 直接调神仙内置函数 `__builtin_popcount(x)`（`long long` 用 `__builtin_popcountll(x)`）。'
      }
    }
  ];

  /**
   * 标准 35 算法与 5D 知识库 ID 双向映射表
   */
  const ALGO_ID_ALIAS_MAP = {
    'sliding_window': 'two_pointers',
    'two_pointers': 'two_pointers',
    'monotonic_stack': 'stack_queue',
    'monotonic_queue': 'stack_queue',
    'stack_queue': 'stack_queue',
    'binary_heap': 'heap',
    'heap': 'heap',
    'dsu': 'union_find',
    'union_find': 'union_find',
    'fenwick_tree': 'fenwick',
    'fenwick': 'fenwick',
    'bfs_maze': 'graph_bfs_dfs',
    'dfs_maze': 'graph_bfs_dfs',
    'graph_bfs_dfs': 'graph_bfs_dfs',
    'kruskal': 'prim_kruskal',
    'prim_kruskal': 'prim_kruskal',
    'knapsack_complete': 'knapsack_01',
    'interval_dp': 'dp_interval',
    'dp_interval': 'dp_interval',
    'lis': 'dp_linear',
    'dp_linear': 'dp_linear',
    'prime_sieve': 'gcd_sieve',
    'euclidean_gcd': 'gcd_sieve',
    'gcd_sieve': 'gcd_sieve',
    'nim_game': 'game_nim',
    'game_nim': 'game_nim'
  };

  /**
   * 5D 知识库别名反查 Visualizer 运行 ID 映射表
   */
  const ALIAS_TO_VIZ_ID_MAP = {
    'two_pointers': 'sliding_window',
    'stack_queue': 'monotonic_stack',
    'heap': 'binary_heap',
    'union_find': 'dsu',
    'fenwick': 'fenwick_tree',
    'graph_bfs_dfs': 'bfs_maze',
    'prim_kruskal': 'kruskal',
    'dp_interval': 'interval_dp',
    'dp_linear': 'lis',
    'gcd_sieve': 'prime_sieve',
    'game_nim': 'nim_game'
  };

  /**
   * 22 大考点门类默认跳转主算法映射表
   */
  const CAT_TO_PRIMARY_ALGO_MAP = {
    'c_01_enum': 'two_pointers',
    'c_02_sort_basic': 'bubble_sort',
    'c_03_search_basic': 'bfs_maze',
    'c_04_greedy': 'euclidean_gcd',
    'c_05_simulation': 'prefix_diff',
    'c_06_binary_search': 'binary_search',
    'c_07_dp_1d': 'dp_linear',
    'c_08_bignum': 'fast_pow',
    'c_09_ds_linear': 'stack_queue',
    'c_10_math_basic': 'prime_sieve',
    'b_11_sort_advanced': 'quick_sort',
    'b_12_search_advanced': 'dfs_maze',
    'b_13_dp_advanced': 'knapsack_01',
    'b_14_strings': 'kmp',
    'b_15_graph_theory': 'dijkstra',
    'b_16_math_advanced': 'fast_pow',
    'b_17_ds_advanced': 'fenwick_tree',
    'b_18_geom_game': 'nim_game',
    'a_19_strings_master': 'trie',
    'a_20_network_flow': 'topological_sort',
    'a_21_math_master': 'fast_pow',
    'a_22_ds_master': 'segment_tree'
  };

  /**
   * 可视化演示算法 ID 到 88 任务分类的智能映射表 (精准关联 DASHBOARD_DATA 中的 22 大考点门类)
   */
  const ALGO_TO_CAT_MAP = {
    // 基础排序 -> c_02_sort_basic (第 2 章)
    'bubble_sort': 'c_02_sort_basic',
    'selection_sort': 'c_02_sort_basic',
    'insertion_sort': 'c_02_sort_basic',
    'counting_sort': 'c_02_sort_basic',

    // 进阶高效排序 -> b_11_sort_advanced (第 11 章)
    'shell_sort': 'b_11_sort_advanced',
    'merge_sort': 'b_11_sort_advanced',
    'quick_sort': 'b_11_sort_advanced',
    'heap_sort': 'b_11_sort_advanced',
    'radix_sort': 'b_11_sort_advanced',
    'bucket_sort': 'b_11_sort_advanced',

    // 二分查找 -> c_06_binary_search (第 6 章)
    'binary_search': 'c_06_binary_search',

    // 字符串 -> b_14_strings (第 14 章)
    'sliding_window': 'c_09_ds_linear',
    'two_pointers': 'c_09_ds_linear',
    'kmp': 'b_14_strings',
    'manacher': 'b_14_strings',
    'trie': 'b_14_strings',

    // 线性与基础数据结构 -> c_09_ds_linear (第 9 章)
    'stack_queue': 'c_09_ds_linear',
    'monotonic_stack': 'c_09_ds_linear',
    'monotonic_queue': 'c_09_ds_linear',
    'linked_list': 'c_09_ds_linear',
    'hash_table': 'c_09_ds_linear',

    // 进阶树与堆 / 并查集 -> b_17_ds_advanced (第 17 章)
    'heap': 'b_17_ds_advanced',
    'binary_heap': 'b_17_ds_advanced',
    'union_find': 'b_17_ds_advanced',
    'dsu': 'b_17_ds_advanced',

    // 顶级数据结构 (树状数组 / 线段树) -> b_17_ds_advanced (第 17 章) / a_22_ds_master
    'fenwick': 'b_17_ds_advanced',
    'fenwick_tree': 'b_17_ds_advanced',
    'segment_tree': 'b_17_ds_advanced',

    // 图遍历与搜索 -> c_03_search_basic (第 3 章)
    'graph_bfs_dfs': 'c_03_search_basic',
    'bfs_maze': 'c_03_search_basic',
    'dfs_maze': 'c_03_search_basic',

    // 高阶图论 (最短路 / 生成树 / 拓扑排序 / 欧拉回路) -> b_15_graph_theory (第 15 章)
    'dijkstra': 'b_15_graph_theory',
    'bellman_ford': 'b_15_graph_theory',
    'floyd': 'b_15_graph_theory',
    'prim_kruskal': 'b_15_graph_theory',
    'kruskal': 'b_15_graph_theory',
    'topological_sort': 'b_15_graph_theory',
    'eulerian_path': 'b_15_graph_theory',

    // 线性 DP -> c_07_dp_1d (第 7 章)
    'dp_linear': 'c_07_dp_1d',
    'lis': 'c_07_dp_1d',

    // 进阶背包 / 区间 DP / 树形 DP -> b_13_dp_advanced (第 13 章)
    'knapsack_01': 'b_13_dp_advanced',
    'knapsack_complete': 'b_13_dp_advanced',
    'dp_interval': 'b_13_dp_advanced',
    'interval_dp': 'b_13_dp_advanced',
    'dp_tree': 'b_13_dp_advanced',

    // 初等与高阶数论 -> c_10_math_basic / b_16_math_advanced
    'gcd_sieve': 'c_10_math_basic',
    'prime_sieve': 'c_10_math_basic',
    'euclidean_gcd': 'c_10_math_basic',
    'fast_pow': 'b_16_math_advanced',

    // 博弈论与位运算 -> b_18_geom_game (第 18 章)
    'game_nim': 'b_18_geom_game',
    'nim_game': 'b_18_geom_game',
    'bitmask_sandbox': 'b_18_geom_game',

    // 模拟与前缀和 -> c_05_simulation (第 5 章)
    'prefix_diff': 'c_05_simulation'
  };

  /**
   * 考场必备工具箱内置源码与考纲资料库
   */
  const TOOLBOX_RESOURCES = {
    template: `"""
蓝桥杯 Python 软件开发组 / 算法竞赛 考场黄金起手式模版
包含：
1. 极速 I/O (解决几十万行输入 TLE 问题)
2. 递归深度扩容 (防止 DFS 爆栈 RecursionError)
3. 浮点精度保护
4. 多组测试数据 @lru_cache 脏数据清理
5. ACM 模式与力扣 class Solution 模式双向转换示例
"""

import sys
from functools import lru_cache
from collections import deque, Counter, defaultdict
import heapq
import bisect
import math

# 1. 考场快读与扩栈起手式
input = sys.stdin.readline
sys.setrecursionlimit(200000)

# 2. 浮点数比较常数
EPS = 1e-7

def float_equal(a: float, b: float) -> bool:
    """比较两个浮点数是否相等"""
    return abs(a - b) < EPS


# 3. 记忆化搜索模板 (带缓存清理机制)
@lru_cache(maxsize=None)
def memoized_dfs(state: int) -> int:
    """记忆化搜索骨架"""
    if state <= 1:
        return state
    return memoized_dfs(state - 1) + memoized_dfs(state - 2)


# 4. ACM 模式主入口
def solve() -> None:
    """
    单组 / 多组测试数据主处理函数
    """
    lines = sys.stdin.read().split()
    if not lines:
        return
    # 考场核心算法业务逻辑实现...
    pass


# 5. 力扣核心代码模式类
class Solution:
    def solveProblem(self, nums: list[int]) -> int:
        """力扣风格接口"""
        return 0


if __name__ == "__main__":
    solve()
`,
    duipai: `"""
20 行考场防爆核武器：自动化对拍器 (Stress Tester / Duipai)
用于：
1. 用随机数据生成器生成几百组小规模输入
2. 分别运行你的【快速优化解】与【绝不会错的暴力朴素解】
3. 自动对比两者的输出，只要有 1 组不一致立刻停下打印导致错误的最小反例输入！
4. 彻底解决考场上“不知道哪里写挂了”的核心痛点！
"""

import random
import time

def random_array(n: int, min_val: int = -100, max_val: int = 100) -> list[int]:
    """生成长度为 n 的随机整型数组"""
    return [random.randint(min_val, max_val) for _ in range(n)]

def brute_force_solution(arr: list[int]) -> int:
    """
    暴力标程：求最大子数组和 (O(N^2) 绝对不会写错的两重暴力循环)
    """
    n = len(arr)
    if n == 0:
        return 0
    max_sum = -float('inf')
    for i in range(n):
        cur = 0
        for j in range(i, n):
            cur += arr[j]
            if cur > max_sum:
                max_sum = cur
    return int(max_sum)

def optimized_solution(arr: list[int]) -> int:
    """
    待测优化解：Kadane 动态规划 (O(N) 线性高效解法)
    """
    if not arr:
        return 0
    max_sum = -float('inf')
    cur = 0
    for x in arr:
        cur = max(x, cur + x)
        max_sum = max(max_sum, cur)
    return int(max_sum)

def run_stress_test(num_trials: int = 200) -> bool:
    """运行自动化高压对拍"""
    print(f"🚀 开始执行考场自动对拍器 (共 {num_trials} 组随机用例测试)...")
    start_time = time.time()
    
    for i in range(1, num_trials + 1):
        # 随机生成长度 1 到 50 的测试数组
        length = random.randint(1, 50)
        test_data = random_array(length, -1000, 1000)
        
        expected = brute_force_solution(test_data)
        actual = optimized_solution(test_data)
        
        if expected != actual:
            print("\\n❌ 发现测试不匹配！已成功拦截隐藏 Bug：")
            print(f"【导致错误的测试输入数据】：{test_data}")
            print(f"【暴力标程预期输出】：{expected}")
            print(f"【你的优化代码实际输出】：{actual}")
            return False
            
        if i % 50 == 0:
            print(f"  已成功通过 {i}/{num_trials} 组高压对拍测试...")
            
    elapsed = time.time() - start_time
    print(f"✅ 全部 {num_trials} 组高压随机对拍测试 100% 匹配！耗时 {elapsed:.2f}s。优化解健壮无懈可击！")
    return True

if __name__ == "__main__":
    run_stress_test(200)
`,
    mapping408: `# 蓝桥杯 B 组 × 保研大厂机试 × 408 考研数据结构考点三维映射表

> **一鱼三吃核心原理**：蓝桥杯、保研机试与 408 数据结构算法题考查的底层思维高度重合（重合度超过 85%）。只要把算法逻辑弄通透，即可同时兼顾竞赛拿奖、保研机试通关与考研 408 算法大题满分！

---

## 一、三维核心考点映射矩阵

| 算法与数据结构核心模块 | 蓝桥杯 Python B 组考向 | 保研夏令营 / 大厂技术机试考向 | 408 计算机考研算法大题考向 | 跨考场复用复习建议 |
|---|---|---|---|---|
| **数组双指针与原地逆序** | 区间贪心、相向指针、两数和变式 | 力扣经典 Top 100（盛水最多的容器、三数之和） | 408 历年真题最爱考点（2010循环左移、2011中位数、2018未出现最小正整数） | 学会空间 O(1) 的原地三步翻转法，408 满分写法 |
| **单链表操作与快慢指针** | 极少考查链表指针，通常用 list 模拟 | 核心代码手撕题（反转链表、合并K个有序链表、判断环） | 408 历年高频真题（2009倒数第k个结点、2012公共后缀、2015绝对值去重、2019重排链表） | 用 Python 理解快慢指针判圈与断链逻辑，记住 C/C++ 结构体指针写法 |
| **二叉树遍历与树的性质** | 树形 DP、求树的直径、最近公共祖先 (LCA) | 二叉树层序遍历、最近公共祖先、二叉搜索树 BST 验证 | 408 绝对主力题（2014带权路径长度 WPL、2017表达式树转中缀、2022二叉搜索树判断） | 熟练掌握前中后序递归展开，以及层序遍历队列模板 |
| **二分查找与二分答案** | 蓝桥杯大题高频分水岭（最大化最小值） | 力扣中等/困难（爱吃香蕉的珂珂、分割数组最大值） | 折半查找过程推导、ASL 平均查找长度、中位数查找 | 记住红蓝染色模板，二分答案的核心在于设计单调的 check() 函数 |
| **滑动窗口与单调队列** | 连续子数组极值、和为 K 的最长子串 | 经典高频题（滑动窗口最大值、最小覆盖子串） | 循环队列队满队空条件、队列在滑动窗口中的应用 | 用 collections.deque 双端队列维护单调递减性质 |
| **图的存储与深度/广度优先搜索** | 迷宫连通块、染色问题、图的判环 | 岛屿数量、太平洋大西洋水流、拓扑排序课程表 | 邻接表与邻接矩阵转换、DFS 生成树、BFS 最短路径树 | 记住邻接表 graph = defaultdict(list) 与 visited 集合防死循环 |
| **单源最短路 (Dijkstra)** | 带权网格图、网络延迟、交通费用大题 | 单源最短路、带限制的最短路径（K 站中转） | 408 经典大题与选择题手算松弛过程（表格填写） | 掌握 heapq 堆优化版 Dijkstra，时间复杂度 O(E log V) |
| **最小生成树 (Kruskal/Prim)** | 并查集连通图成本最小化 | 连接所有点的最小费用、水资源分配 | 408 手算过程推导与判定边权唯一时 MST 唯一性 | Kruskal 核心在于边权升序排序后使用并查集判环贪心选边 |
| **动态规划 (背包与 LIS/LCS)** | 0-1 背包、完全背包、数字三角形、最长递增子序列 | 零钱兑换、最长公共子序列、编辑距离 | 408 较少考复杂 DP，主要考查动态规划与分治思想辨析 | 掌握滚动数组将空间压缩为一维的技巧，彻底理解无后效性 |
`
  };

  /**
   * 88 阶梯任务规划看板与五维深度知识库控制器
   */
  const Dashboard = {
    _data: DASHBOARD_DATA,
    _singleAlgo5D: SINGLE_ALGO_5D_DATA,
    _activeKbAlgoId: 'bubble_sort',
    _kbViewMode: 'dual', // 'dual' (双轨对照) | 'eli5' (仅看小白版) | 'pro' (仅看专业版)

    setKbMode: function(mode) {
      if (!['dual', 'eli5', 'pro'].includes(mode)) return;
      this._kbViewMode = mode;
      this._renderKbDetailCard(this._activeKbAlgoId);
      if (global.AlgoSystem && global.AlgoSystem.controls && typeof global.AlgoSystem.controls.showToast === 'function') {
        const modeLabel = mode === 'dual' ? '双轨对照模式（小白通俗 + 专业考场）' : (mode === 'eli5' ? '小白秒懂大白话模式' : '专业考场速查模式');
        global.AlgoSystem.controls.showToast(`已切换讲解视角：${modeLabel}`, 'info');
      }
    },
    _storage: {
      get: (k, d) => d,
      set: () => true
    },
    _progress: {},
    _currentFilter: 'all',
    _searchQuery: '',
    _currentInspectingAlgoId: 'bubble_sort',

    init: function() {
      if (global.AlgoSystem && global.AlgoSystem.engine && typeof global.AlgoSystem.engine.createStorage === 'function') {
        this._storage = global.AlgoSystem.engine.createStorage();
      } else {
        this._storage = {
          get: (k, d) => d,
          set: () => true
        };
      }

      this._loadProgress();
      this._renderDashboardCards();
      this._renderKnowledgeBase();
      this._bindEvents();
      this._updateStats();

      // 初始渲染当前算法的打卡任务
      this.renderCurrentAlgoTasks(this._currentInspectingAlgoId);
    },

    _loadProgress: function() {
      try {
        const stored = (this._storage && typeof this._storage.get === 'function')
          ? this._storage.get('LANQIAO_ALGO_DASHBOARD_PROGRESS_V1', {})
          : {};
        this._progress = (stored && typeof stored === 'object') ? stored : {};
      } catch (e) {
        this._progress = {};
      }
    },

    _saveProgress: function() {
      try {
        if (this._storage && typeof this._storage.set === 'function') {
          this._storage.set('LANQIAO_ALGO_DASHBOARD_PROGRESS_V1', this._progress);
        }
      } catch (e) {
        console.warn('Failed to save progress to storage:', e);
      }
    },

    toggleTask: function(taskId) {
      if (!taskId) return;
      this._progress[taskId] = !this._progress[taskId];
      this._saveProgress();
      this._updateStats();

      // 同步更新 88 任务大看板的对应复选框
      const cb = document.querySelector(`.task-checkbox[data-task-id="${taskId}"]`);
      if (cb) {
        cb.checked = !!this._progress[taskId];
        const row = cb.closest('.task-item-row');
        if (row) {
          row.classList.toggle('task-done', !!this._progress[taskId]);
        }
      }

      // 同步更新右侧 Inspector 打卡面板
      this.renderCurrentAlgoTasks(this._currentInspectingAlgoId);

      // 显示打卡提示
      if (global.AlgoSystem.controls && typeof global.AlgoSystem.controls.showToast === 'function') {
        const stateStr = this._progress[taskId] ? '已完成打卡 ✅' : '已取消打卡 ⚪';
        global.AlgoSystem.controls.showToast(`${stateStr}`, 'info');
      }
    },

    resetProgress: function() {
      if (!confirm('确定要清空全部 88 项阶梯做题打卡进度吗？此操作不可逆。')) {
        return;
      }
      this._progress = {};
      this._saveProgress();
      this._renderDashboardCards();
      this._updateStats();
      this.renderCurrentAlgoTasks(this._currentInspectingAlgoId);
      if (global.AlgoSystem.controls && typeof global.AlgoSystem.controls.showToast === 'function') {
        global.AlgoSystem.controls.showToast('已重置全部打卡进度为 0', 'info');
      }
    },

    _updateStats: function() {
      let totalTasks = 0;
      let totalDone = 0;
      let cTotal = 0, cDone = 0;
      let bTotal = 0, bDone = 0;
      let aTotal = 0, aDone = 0;
      let p408Total = 0, p408Done = 0;

      this._data.forEach(cat => {
        cat.tasks.forEach(task => {
          totalTasks++;
          const isDone = !!this._progress[task.id];
          if (isDone) totalDone++;

          if (cat.tier === 'C组') {
            cTotal++;
            if (isDone) cDone++;
          } else if (cat.tier === 'B组') {
            bTotal++;
            if (isDone) bDone++;
          } else if (cat.tier.includes('A组')) {
            aTotal++;
            if (isDone) aDone++;
          }

          if (cat.is408) {
            p408Total++;
            if (isDone) p408Done++;
          }
        });
      });

      const pct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;
      const progressText = document.getElementById('progressText');
      const progressPercent = document.getElementById('progressPercent');
      if (progressText) progressText.textContent = `${totalDone} / ${totalTasks}`;
      if (progressPercent) progressPercent.textContent = `${pct}%`;

      // C 组
      const cPct = cTotal > 0 ? Math.round((cDone / cTotal) * 100) : 0;
      const barC = document.getElementById('barGroupC');
      const txtC = document.getElementById('textGroupC');
      if (barC) barC.style.width = `${cPct}%`;
      if (txtC) txtC.textContent = `${cDone} / ${cTotal} (${cPct}%)`;

      // B 组
      const bPct = bTotal > 0 ? Math.round((bDone / bTotal) * 100) : 0;
      const barB = document.getElementById('barGroupB');
      const txtB = document.getElementById('textGroupB');
      if (barB) barB.style.width = `${bPct}%`;
      if (txtB) txtB.textContent = `${bDone} / ${bTotal} (${bPct}%)`;

      // A 组
      const aPct = aTotal > 0 ? Math.round((aDone / aTotal) * 100) : 0;
      const barA = document.getElementById('barGroupA');
      const txtA = document.getElementById('textGroupA');
      if (barA) barA.style.width = `${aPct}%`;
      if (txtA) txtA.textContent = `${aDone} / ${aTotal} (${aPct}%)`;

      // 408
      const pPct = p408Total > 0 ? Math.round((p408Done / p408Total) * 100) : 0;
      const bar408 = document.getElementById('bar408');
      const txt408 = document.getElementById('text408');
      if (bar408) bar408.style.width = `${pPct}%`;
      if (txt408) txt408.textContent = `${p408Done} / ${p408Total} (${pPct}%)`;
    },

    _renderDashboardCards: function() {
      const container = document.getElementById('dashboardCardsGrid');
      if (!container) return;

      const q = this._searchQuery.toLowerCase().trim();
      const filter = this._currentFilter;

      const cardsHtml = this._data.map(cat => {
        if (filter === 'c' && cat.tier !== 'C组') return '';
        if (filter === 'b' && cat.tier !== 'B组') return '';
        if (filter === '408' && !cat.is408) return '';

        const matchSearch = !q ||
          cat.catName.toLowerCase().includes(q) ||
          cat.desc.toLowerCase().includes(q) ||
          cat.tasks.some(t => t.name.toLowerCase().includes(q));

        if (!matchSearch) return '';

        if (filter === 'uncompleted') {
          const hasUncompleted = cat.tasks.some(t => !this._progress[t.id]);
          if (!hasUncompleted) return '';
        }

        const tierBadgeClass = cat.tier === 'C组' ? 'badge-c' : (cat.tier === 'B组' ? 'badge-b' : 'badge-a');
        const doneCount = cat.tasks.filter(t => !!this._progress[t.id]).length;

        const tasksHtml = cat.tasks.map(task => {
          const isDone = !!this._progress[task.id];
          const taskClass = isDone ? 'task-item-row task-done' : 'task-item-row';
          const typeBadge = task.type === 'learn' ? '<span class="task-badge badge-learn">内功打卡</span>' :
                            task.type === 'easy' ? '<span class="task-badge badge-easy">简单母题</span>' :
                            task.type === 'mid' ? '<span class="task-badge badge-mid">中等突破</span>' :
                            '<span class="task-badge badge-hard">综合难题</span>';

          const titleWithLink = task.link
            ? `<a href="${task.link}" target="_blank" rel="noopener noreferrer" class="task-link" title="点击跳转在线 OJ">${task.name} ↗</a>`
            : `<span class="task-plain-title">${task.name}</span>`;

          const hintHtml = task.hint ? `<div class="task-hint-text">💡 ${task.hint}</div>` : '';

          return `
            <div class="${taskClass}">
              <label class="task-checkbox-label">
                <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${isDone ? 'checked' : ''} onchange="window.AlgoSystem.components.Dashboard.toggleTask('${task.id}')">
                <span class="custom-checkbox-box"></span>
              </label>
              <div class="task-info-content">
                <div class="task-title-line">
                  ${typeBadge}
                  ${titleWithLink}
                </div>
                ${hintHtml}
              </div>
            </div>
          `;
        }).join('');

        const primaryAlgoId = CAT_TO_PRIMARY_ALGO_MAP[cat.catId] || 'bubble_sort';

        return `
          <div class="dashboard-cat-card" id="card_${cat.catId}">
            <div class="card-header-bar">
              <div class="card-header-left">
                <span class="cat-number-badge">第 ${cat.catNum} 章</span>
                <h3 class="cat-title">${cat.catName}</h3>
                <span class="badge-tier ${tierBadgeClass}">${cat.tier}</span>
                ${cat.is408 ? '<span class="badge-408">408考研重合</span>' : ''}
              </div>
              <div class="card-header-right">
                <span class="cat-diff-tag">难度: ${cat.difficulty}</span>
                <span class="cat-done-progress">${doneCount} / 4</span>
              </div>
            </div>
            <p class="card-desc">${cat.desc}</p>
            <div class="card-action-bar">
              <button type="button" class="btn-card-action btn-jump-viz" onclick="window.AlgoSystem.components.Dashboard.jumpToVisualizer('${primaryAlgoId}')" title="跳转至当前大纲核心算法动态演进">▶ 演进实验</button>
              <button type="button" class="btn-card-action btn-jump-kb" onclick="window.AlgoSystem.components.Dashboard.jumpToKnowledge('${primaryAlgoId}')" title="跳转至五维深度知识库体系拆解">📖 五维知识</button>
            </div>
            <div class="card-tasks-list">
              ${tasksHtml}
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = cardsHtml || '<div class="empty-results">未找到匹配的学习任务，请尝试调整搜索词或筛选条件。</div>';
    },

    /**
     * 渲染五维深度知识库 (左侧抽屉式单算法索引 + 右侧精准五维大卡片)
     */
    _renderKnowledgeBase: function() {
      const listContainer = document.getElementById('kbAlgoList');
      if (!listContainer) return;

      const countBadge = document.getElementById('kbAlgoCount');
      if (countBadge) {
        countBadge.textContent = `${this._singleAlgo5D.length} 核心算法`;
      }

      const navButtonsHtml = this._singleAlgo5D.map(algo => {
        const isActive = algo.id === this._activeKbAlgoId;
        const tierClass = algo.tier === 'C组' ? 'badge-c' : (algo.tier === 'B组' ? 'badge-b' : 'badge-a');
        return `
          <button class="kb-algo-btn ${isActive ? 'active' : ''}" data-algo-id="${algo.id}">
            <span class="kb-btn-name">${algo.name}</span>
            <span class="kb-btn-tier badge-tier ${tierClass}">${algo.tier}</span>
          </button>
        `;
      }).join('');

      listContainer.innerHTML = navButtonsHtml;

      // 绑定抽屉导航点击
      listContainer.querySelectorAll('.kb-algo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const algoId = btn.getAttribute('data-algo-id');
          this.selectKbAlgo(algoId);
        });
      });

      // 渲染当前选中的单个算法五维卡片
      this._renderKbDetailCard(this._activeKbAlgoId);
    },

    selectKbAlgo: function(algoId) {
      if (!algoId) return;
      this._activeKbAlgoId = algoId;

      const listContainer = document.getElementById('kbAlgoList');
      if (listContainer) {
        listContainer.querySelectorAll('.kb-algo-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-algo-id') === algoId);
        });
      }

      this._renderKbDetailCard(algoId);
    },

    _renderKbDetailCard: function(algoId) {
      const cardWrap = document.getElementById('kbDetailCard');
      if (!cardWrap) return;

      const targetId = ALGO_ID_ALIAS_MAP[algoId] || algoId;
      const algo = this._singleAlgo5D.find(a => a.id === algoId || a.id === targetId) || this._singleAlgo5D[0];
      if (!algo) return;

      const mode = this._kbViewMode || 'dual';
      const tierBadgeClass = algo.tier === 'C组' ? 'badge-c' : (algo.tier === 'B组' ? 'badge-b' : 'badge-a');
      const eli5 = algo.eli5 || {};
      cardWrap.classList.add('active');

      const renderDimContent = (key) => {
        const proText = (algo.dimensions && algo.dimensions[key]) ? algo.dimensions[key] : '';
        const eli5Text = eli5[key] || '';
        if (mode === 'pro' || !eli5Text) {
          return `<div class="dim-block dim-pro"><span class="dim-mode-tag tag-pro">🎓 专业考场版</span><p>${proText}</p></div>`;
        }
        if (mode === 'eli5') {
          return `<div class="dim-block dim-eli5"><span class="dim-mode-tag tag-eli5">🌱 小白秒懂版</span><p>${eli5Text}</p></div>`;
        }
        return `
          <div class="dim-block dim-eli5">
            <span class="dim-mode-tag tag-eli5">🌱 小白秒懂大白话（生活比喻 + 实例推演）</span>
            <p>${eli5Text}</p>
          </div>
          <div class="dim-block dim-pro">
            <span class="dim-mode-tag tag-pro">🎓 专业考场严谨表述（408 / 蓝桥核心术语）</span>
            <p>${proText}</p>
          </div>
        `;
      };

      cardWrap.innerHTML = `
        <div class="kb-card-header">
          <div>
            <h3>${algo.name} <span class="kb-en-sub">(${algo.en})</span></h3>
            <div class="kb-cat-sub">所属门类：${algo.category} · 难度系数：${algo.difficulty} / 10</div>
          </div>
          <div class="kb-mode-switch" role="group" aria-label="讲解深浅度切换">
            <button class="pill ${mode === 'dual' ? 'active' : ''}" onclick="window.AlgoSystem.components.Dashboard.setKbMode('dual')">🌗 双轨对照</button>
            <button class="pill ${mode === 'eli5' ? 'active' : ''}" onclick="window.AlgoSystem.components.Dashboard.setKbMode('eli5')">🌱 小白秒懂版</button>
            <button class="pill ${mode === 'pro' ? 'active' : ''}" onclick="window.AlgoSystem.components.Dashboard.setKbMode('pro')">🎓 专业考场版</button>
          </div>
        </div>
        <div class="kb-dimensions-grid">
          <div class="kb-dimension-box dim-origin">
            <div class="dim-title"><span class="dim-icon">🏛️</span> 1. 算法由来与痛点（为什么老办法不行？）</div>
            ${renderDimContent('origin')}
          </div>
          <div class="kb-dimension-box dim-principle">
            <div class="dim-title"><span class="dim-icon">💡</span> 2. 算法原理与灵感闪光（手把手推演它是怎么跑的？）</div>
            ${renderDimContent('principle')}
          </div>
          <div class="kb-dimension-box dim-scope">
            <div class="dim-title"><span class="dim-icon">🎯</span> 3. 适用范围与题型特征（题目出现什么暗号就用它？）</div>
            ${renderDimContent('applicability')}
          </div>
          <div class="kb-dimension-box dim-feature">
            <div class="dim-title"><span class="dim-icon">⚖️</span> 4. 算法特点与优劣势（快不快？费不费内存？稳不稳？）</div>
            ${renderDimContent('features')}
          </div>
          <div class="kb-dimension-box dim-libs">
            <div class="dim-title"><span class="dim-icon">⚡</span> 5. 考场偷懒调库一行流（Python / C++ 怎么直接抄近道？）</div>
            ${renderDimContent('libraries')}
          </div>
        </div>
      `;
    },

    /**
     * 在右侧 Inspector 面板实时渲染当前算法的 4 级阶梯打卡任务
     */
    renderCurrentAlgoTasks: function(algoId) {
      this._currentInspectingAlgoId = algoId || 'bubble_sort';
      const container = document.getElementById('currentAlgoTaskWrap');
      if (!container) return;

      const targetKbId = ALGO_ID_ALIAS_MAP[this._currentInspectingAlgoId] || this._currentInspectingAlgoId;
      const catId = ALGO_TO_CAT_MAP[this._currentInspectingAlgoId] || ALGO_TO_CAT_MAP[targetKbId] || 'c_02_sort_basic';
      const cat = this._data.find(c => c.catId === catId) || this._data[1];
      const singleAlgo = this._singleAlgo5D.find(a => a.id === this._currentInspectingAlgoId || a.id === targetKbId) || { name: cat.catName, tier: cat.tier };

      const doneCount = cat.tasks.filter(t => !!this._progress[t.id]).length;
      const tierBadgeClass = cat.tier === 'C组' ? 'badge-c' : (cat.tier === 'B组' ? 'badge-b' : 'badge-a');

      const tasksListHtml = cat.tasks.map(task => {
        const isDone = !!this._progress[task.id];
        const taskClass = isDone ? 'task-item-card task-done' : 'task-item-card';
        const typeBadge = task.type === 'learn' ? '<span class="task-badge badge-learn">内功打卡</span>' :
                          task.type === 'easy' ? '<span class="task-badge badge-easy">简单母题</span>' :
                          task.type === 'mid' ? '<span class="task-badge badge-mid">中等突破</span>' :
                          '<span class="task-badge badge-hard">综合难题</span>';

        const titleHtml = task.link
          ? `<a href="${task.link}" target="_blank" rel="noopener noreferrer" class="task-link" title="点击跳转在线 OJ 做题">${task.name} ↗</a>`
          : `<span class="task-plain-title">${task.name}</span>`;

        return `
          <div class="${taskClass}">
            <div class="task-card-top">
              <label class="task-checkbox-label">
                <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${isDone ? 'checked' : ''} onchange="window.AlgoSystem.components.Dashboard.toggleTask('${task.id}')">
                <span class="custom-checkbox-box"></span>
              </label>
              <div class="task-card-title-wrap">
                <div class="task-card-badges">${typeBadge}</div>
                <div class="task-card-title">${titleHtml}</div>
              </div>
            </div>
            ${task.hint ? `<div class="task-card-hint">💡 考点题眼：${task.hint}</div>` : ''}
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <div class="task-pane-header">
          <div class="task-pane-title-box">
            <h4>🎯 ${singleAlgo.name} 考点通关打卡</h4>
            <div class="task-pane-sub">对应官方大纲：第 ${cat.catNum} 章 ${cat.catName}</div>
          </div>
          <div class="task-pane-progress-box">
            <span class="badge-tier ${tierBadgeClass}">${cat.tier}</span>
            <span class="task-done-badge">${doneCount} / 4 已打卡</span>
          </div>
        </div>
        <div class="task-pane-list">
          ${tasksListHtml}
        </div>
      `;
    },

    /**
     * 一键跳转至算法可视化器
     */
    jumpToVisualizer: function(algoId) {
      if (!algoId) return;
      const vizId = ALIAS_TO_VIZ_ID_MAP[algoId] || algoId;
      const vizTab = document.querySelector('.nav-tab[data-view="visualizer"]');
      if (vizTab) vizTab.click();
      if (global.AlgoSystem && global.AlgoSystem.navigation && typeof global.AlgoSystem.navigation.select === 'function') {
        global.AlgoSystem.navigation.select(vizId);
      }
    },

    /**
     * 一键跳转至五维知识库
     */
    jumpToKnowledge: function(algoId) {
      if (!algoId) return;
      const kbId = ALGO_ID_ALIAS_MAP[algoId] || algoId;
      const kbTab = document.querySelector('.nav-tab[data-view="knowledge"]');
      if (kbTab) kbTab.click();
      this.selectKbAlgo(kbId);
      const kbView = document.getElementById('viewKnowledge');
      if (kbView) kbView.scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * 导出打卡进度 JSON 文件
     */
    exportProgress: function() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this._progress, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `algo_system_progress_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      if (global.AlgoSystem.controls && typeof global.AlgoSystem.controls.showToast === 'function') {
        global.AlgoSystem.controls.showToast('打卡进度已成功导出 JSON 备份！', 'success');
      }
    },

    /**
     * 导入本地打卡进度 JSON 数据
     */
    importProgress: function(content) {
      try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('无效的 JSON 格式');
        }
        this._progress = parsed;
        this._saveProgress();
        this._renderDashboardCards();
        this._updateStats();
        this.renderCurrentAlgoTasks(this._currentInspectingAlgoId);
        if (global.AlgoSystem.controls && typeof global.AlgoSystem.controls.showToast === 'function') {
          global.AlgoSystem.controls.showToast('打卡进度已成功恢复！', 'success');
        }
        return true;
      } catch (err) {
        if (global.AlgoSystem.controls && typeof global.AlgoSystem.controls.showToast === 'function') {
          global.AlgoSystem.controls.showToast('导入失败：' + err.message, 'error');
        }
        return false;
      }
    },

    /**
     * 备赛工具箱模态框管理
     */
    openToolboxModal: function(tabName) {
      const modal = document.getElementById('toolboxModal');
      if (!modal) return;
      modal.classList.remove('hidden');
      if (tabName) this.switchToolboxTab(tabName);
    },

    closeToolboxModal: function() {
      const modal = document.getElementById('toolboxModal');
      if (modal) modal.classList.add('hidden');
    },

    switchToolboxTab: function(tabKey) {
      const tabs = document.querySelectorAll('.toolbox-tab-btn');
      tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabKey));

      const contents = document.querySelectorAll('.toolbox-tab-content');
      contents.forEach(c => {
        const isTarget = c.id === `toolboxTabContent_${tabKey}`;
        c.classList.toggle('active', isTarget);
        c.classList.toggle('hidden', !isTarget);
      });
    },

    copyToolboxText: function(type) {
      let textToCopy = '';
      if (type === 'template') {
        const el = document.getElementById('toolboxCode_template');
        textToCopy = el ? el.textContent : '';
      } else if (type === 'duipai') {
        const el = document.getElementById('toolboxCode_duipai');
        textToCopy = el ? el.textContent : '';
      } else if (type === 'mapping408') {
        textToCopy = TOOLBOX_RESOURCES.mapping408;
      }

      if (textToCopy && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          if (global.AlgoSystem.controls && typeof global.AlgoSystem.controls.showToast === 'function') {
            global.AlgoSystem.controls.showToast('资料源码已成功复制到剪贴板 📋', 'success');
          }
        }).catch(() => {
          fallbackCopy(textToCopy);
        });
      } else {
        fallbackCopy(textToCopy);
      }

      function fallbackCopy(str) {
        const ta = document.createElement('textarea');
        ta.value = str;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          document.execCommand('copy');
          if (global.AlgoSystem.controls && typeof global.AlgoSystem.controls.showToast === 'function') {
            global.AlgoSystem.controls.showToast('资料源码已成功复制到剪贴板 📋', 'success');
          }
        } catch (e) {
          alert('复制失败，请手动选取复制');
        }
        document.body.removeChild(ta);
      }
    },

    _initToolbox: function() {
      const codeTpl = document.getElementById('toolboxCode_template');
      if (codeTpl) codeTpl.textContent = TOOLBOX_RESOURCES.template;

      const codeDui = document.getElementById('toolboxCode_duipai');
      if (codeDui) codeDui.textContent = TOOLBOX_RESOURCES.duipai;

      const mdBox = document.getElementById('toolboxMd_mapping408');
      if (mdBox) {
        // Simple fast markdown table rendering
        mdBox.innerHTML = `
          <div style="font-size:13px; line-height:1.6; color:var(--text-primary);">
            <div style="padding:10px 14px; background:rgba(0,122,204,0.1); border-left:3px solid var(--color-primary-hover); border-radius:4px; margin-bottom:14px;">
              <strong>🎯 一鱼三吃核心原理：</strong>蓝桥杯、保研机试与 408 数据结构算法题考查的底层思维高度重合（重合度超过 85%）。只要把算法逻辑弄通透，即可同时兼顾竞赛拿奖、保研机试通关与考研 408 算法大题满分！
            </div>
            <table class="calc-table" style="width:100%; font-size:12px; margin-top:10px;">
              <thead>
                <tr>
                  <th style="padding:8px;">算法数据结构核心模块</th>
                  <th style="padding:8px;">蓝桥杯考向</th>
                  <th style="padding:8px;">保研机试/大厂</th>
                  <th style="padding:8px;">408 计算机考研算法大题</th>
                  <th style="padding:8px;">跨考场复习建议</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:6px; font-weight:bold; color:var(--color-primary-hover);">数组双指针与原地逆序</td>
                  <td style="padding:6px;">区间贪心、相向指针、两数和变式</td>
                  <td style="padding:6px;">盛水最多的容器、三数之和</td>
                  <td style="padding:6px;">2010循环左移、2011中位数、2018未出现最小正整数</td>
                  <td style="padding:6px; color:var(--state-sorted);">掌握空间 O(1) 原地三步翻转法</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:bold; color:var(--color-primary-hover);">单链表与快慢指针</td>
                  <td style="padding:6px;">通常用 list 模拟</td>
                  <td style="padding:6px;">反转链表、合并K个链表、判环</td>
                  <td style="padding:6px;">2009倒数第k个、2012公共后缀、2015去重、2019重排</td>
                  <td style="padding:6px; color:var(--state-sorted);">Python 理解判圈，记住 C/C++ 结构体指针</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:bold; color:var(--color-primary-hover);">二叉树遍历与性质</td>
                  <td style="padding:6px;">树形 DP、直径、LCA</td>
                  <td style="padding:6px;">层序遍历、LCA、BST 验证</td>
                  <td style="padding:6px;">2014带权路径长度 WPL、2017转中缀、2022BST判断</td>
                  <td style="padding:6px; color:var(--state-sorted);">熟练掌握前中后序递归展开与层序队列</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:bold; color:var(--color-primary-hover);">二分查找与二分答案</td>
                  <td style="padding:6px;">大题高频分水岭 (最大化最小值)</td>
                  <td style="padding:6px;">爱吃香蕉的珂珂、分割数组最大值</td>
                  <td style="padding:6px;">折半推导、ASL 平均查找长度、中位数</td>
                  <td style="padding:6px; color:var(--state-sorted);">红蓝染色模板，核心设计单调 check()</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:bold; color:var(--color-primary-hover);">滑动窗口与单调队列</td>
                  <td style="padding:6px;">连续子数组极值、和为 K 最长子串</td>
                  <td style="padding:6px;">滑动窗口最大值、最小覆盖子串</td>
                  <td style="padding:6px;">循环队列队满队空条件、队列在滑窗应用</td>
                  <td style="padding:6px; color:var(--state-sorted);">collections.deque 维护单调性</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:bold; color:var(--color-primary-hover);">图遍历 BFS / DFS</td>
                  <td style="padding:6px;">迷宫连通块、染色、图判环</td>
                  <td style="padding:6px;">岛屿数量、水流、拓扑排序课程表</td>
                  <td style="padding:6px;">邻接表/邻接矩阵转换、DFS生成树、BFS最短路树</td>
                  <td style="padding:6px; color:var(--state-sorted);">邻接表 graph=defaultdict(list) + visited</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:bold; color:var(--color-primary-hover);">单源最短路 Dijkstra</td>
                  <td style="padding:6px;">带权网格图、网络延迟、交通费用</td>
                  <td style="padding:6px;">单源最短路、K 站中转限制</td>
                  <td style="padding:6px;">经典选择大题手算松弛过程 (表格填写)</td>
                  <td style="padding:6px; color:var(--state-sorted);">heapq 堆优化版 Dijkstra, O(E log V)</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:bold; color:var(--color-primary-hover);">最小生成树 Kruskal</td>
                  <td style="padding:6px;">并查集连通图成本最小化</td>
                  <td style="padding:6px;">连接所有点最小费用、水资源分配</td>
                  <td style="padding:6px;">边权唯一时 MST 唯一性与手算推导</td>
                  <td style="padding:6px; color:var(--state-sorted);">边权升序排序 + 并查集判环贪心选边</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:bold; color:var(--color-primary-hover);">动态规划 (背包/LIS)</td>
                  <td style="padding:6px;">0-1/完全背包、数字三角形、LIS</td>
                  <td style="padding:6px;">零钱兑换、最长公共子序列、编辑距离</td>
                  <td style="padding:6px;">动态规划与分治思想辨析</td>
                  <td style="padding:6px; color:var(--state-sorted);">滚动数组空间压缩一维，理解无后效性</td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      }
    },

    _bindEvents: function() {
      const searchInput = document.getElementById('dashboardSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this._searchQuery = e.target.value;
          this._renderDashboardCards();
        });
      }

      const radioFilterGroup = document.querySelector('.filter-radio-group');
      if (radioFilterGroup) {
        radioFilterGroup.addEventListener('change', (e) => {
          if (e.target.name === 'dashFilter') {
            this._currentFilter = e.target.value;
            this._renderDashboardCards();
          }
        });
      }

      const resetBtn = document.getElementById('resetAllProgressBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.resetProgress();
        });
      }

      // 备赛工具箱模态框绑定
      const btnOpenToolbox = document.getElementById('btnOpenToolbox');
      if (btnOpenToolbox) {
        btnOpenToolbox.addEventListener('click', () => {
          this.openToolboxModal('template');
        });
      }

      const closeToolboxModalBtn = document.getElementById('closeToolboxModalBtn');
      if (closeToolboxModalBtn) {
        closeToolboxModalBtn.addEventListener('click', () => {
          this.closeToolboxModal();
        });
      }

      const closeToolboxModalFooterBtn = document.getElementById('closeToolboxModalFooterBtn');
      if (closeToolboxModalFooterBtn) {
        closeToolboxModalFooterBtn.addEventListener('click', () => {
          this.closeToolboxModal();
        });
      }

      const toolboxTabs = document.getElementById('toolboxTabs');
      if (toolboxTabs) {
        toolboxTabs.addEventListener('click', (e) => {
          const tabBtn = e.target.closest('.toolbox-tab-btn');
          if (tabBtn) {
            const tabKey = tabBtn.getAttribute('data-tab');
            this.switchToolboxTab(tabKey);
          }
        });
      }

      // 导入 / 导出打卡进度
      const btnExportProgress = document.getElementById('btnExportProgress');
      if (btnExportProgress) {
        btnExportProgress.addEventListener('click', () => {
          this.exportProgress();
        });
      }

      const btnImportProgress = document.getElementById('btnImportProgress');
      const importProgressFileInput = document.getElementById('importProgressFileInput');
      if (btnImportProgress && importProgressFileInput) {
        btnImportProgress.addEventListener('click', () => {
          importProgressFileInput.click();
        });

        importProgressFileInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              this.importProgress(evt.target.result);
              importProgressFileInput.value = '';
            };
            reader.readAsText(file);
          }
        });
      }

      this._initToolbox();
    }
  };

  global.AlgoSystem.components.Dashboard = Dashboard;
  global.AlgoSystem.dashboard = Dashboard;

  document.addEventListener('DOMContentLoaded', function() {
    Dashboard.init();
  });

})(typeof window !== 'undefined' ? window : this);
