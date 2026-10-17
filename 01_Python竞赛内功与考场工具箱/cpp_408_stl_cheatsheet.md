# C++ 20 竞赛 STL 与 408 考研数据结构伪代码速查字典

> **专为 Python 主攻选手编写**：旨在让你在 3 分钟内看懂洛谷 C++ 题解与 408 考研算法大题的伪代码。你无需成为 C++ 编译专家，只需掌握核心工具箱的同构映射！

---

## 一、Python 核心数据结构与 C++ STL 同构对照表

| 逻辑数据结构 | Python 3 语法实现 | C++ 20 / 408 STL 对应语法 | 复杂度与底层机制 |
|---|---|---|---|
| **动态数组** | `arr = []`<br>`arr.append(x)`<br>`arr.pop()` | `vector<int> arr;`<br>`arr.push_back(x);`<br>`arr.pop_back();` | 均基于连续内存倍增扩容，尾部插入均摊 $O(1)$ |
| **双端队列 (FIFO)** | `from collections import deque`<br>`q = deque()`<br>`q.append(x); q.popleft()` | `#include <deque>`<br>`deque<int> q;`<br>`q.push_back(x); q.pop_front();` | 均支持头尾 $O(1)$ 插入与删除，BFS 标准容器 |
| **栈 (FILO)** | `stack = []`<br>`stack.append(x)`<br>`top_val = stack[-1]`<br>`stack.pop()` | `#include <stack>`<br>`stack<int> s;`<br>`s.push(x);`<br>`int val = s.top(); s.pop();` | 注意：C++ 的 `pop()` 没有返回值，必须先 `top()` 取值再 `pop()` |
| **哈希表** | `d = {}`<br>`d[key] = val`<br>`if key in d:` | `#include <unordered_map>`<br>`unordered_map<int, int> d;`<br>`d[key] = val;`<br>`if (d.count(key)) ...` | 基于哈希桶拉链法，平均查询 $O(1)$ |
| **哈希集合** | `s = set()`<br>`s.add(x)`<br>`s.remove(x)` | `#include <unordered_set>`<br>`unordered_set<int> s;`<br>`s.insert(x);`<br>`s.erase(x);` | 元素去重，$O(1)$ 判定存在性 |
| **小顶堆 (优先队列)** | `import heapq`<br>`h = []`<br>`heapq.heappush(h, x)`<br>`top = heapq.heappop(h)` | `#include <queue>`<br>`priority_queue<int, vector<int>, greater<int>> pq;`<br>`pq.push(x);`<br>`int top = pq.top(); pq.pop();` | 完全二叉树，插入与弹出 $O(\log N)$ |
| **大顶堆 (优先队列)** | `heapq.heappush(h, -x)`<br>`top = -heapq.heappop(h)` | `priority_queue<int> pq;` (默认就是大顶堆)<br>`pq.push(x);`<br>`int top = pq.top(); pq.pop();` | 动态维护最大值 |
| **有序平衡树** | `from sortedcontainers import SortedList`<br>`sl = SortedList()` | `#include <set>` 或 `<map>`<br>`set<int> s;`<br>`auto it = s.lower_bound(x);` | 红黑树实现，动态维护有序性，$O(\log N)$ 插入与删除 |
| **二分查找 (lower)** | `import bisect`<br>`idx = bisect.bisect_left(arr, x)` | `auto it = lower_bound(arr.begin(), arr.end(), x);`<br>`int idx = it - arr.begin();` | 寻找首个 $\ge x$ 的元素下标 |
| **全排列** | `import itertools`<br>`itertools.permutations(arr)` | `#include <algorithm>`<br>`do { ... } while (next_permutation(arr.begin(), arr.end()));` | 字典序生成下一全排列 |

---

## 二、408 考研数据结构算法大题 C/C++ 评分规范

在 408 考研初试中，算法大题（通常占 10–15 分）要求使用 C/C++ 或伪代码作答。评分采分点如下：

1. **算法设计思想说明（占 3–5 分）**：
   - 用 3–5 句话用中文写清楚你的破题逻辑（例如：“采用相向双指针法，从数组两端向中间扫描……”）。
2. **算法实现代码（占 7–10 分）**：
   - 考官看重的是**循环逻辑、指针更新与边界判断**，无需纠结语法细节（哪怕漏写分号也不扣分）；
   - 常见单链表结点结构体：
     ```c
     typedef struct LNode {
         int data;
         struct LNode *next;
     } LNode, *LinkList;
     ```
   - 常见二叉树结点结构体：
     ```c
     typedef struct BiTNode {
         int data;
         struct BiTNode *lchild, *rchild;
     } BiTNode, *BiTree;
     ```
3. **时空复杂度分析（占 2–3 分）**：
   - 明确写出时间复杂度为 $O(...)$，空间复杂度为 $O(...)$，并简述理由。
