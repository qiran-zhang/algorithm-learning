# 10_堆优化Dijkstra_Floyd与Kahn拓扑排序：加权图与依赖解析

> **适用竞赛**：蓝桥杯（国赛与省赛高频考点）、力扣核心图论题、大厂工程系统依赖调度、408 考研数据结构必考大题

---

## 一、算法由来与痛点（为什么老办法不行）

1. **BFS 无法处理带权图**：BFS 默认“边数少 = 距离短”，但真实地图中，走 1 条高速可能需要 100 公里，走 3 条小道可能只要 10 公里。BFS 无法求解带权图的最短路。
2. **暴力 Dijkstra 的 $O(V^2)$ 困局**：朴素 Dijkstra 每次在所有未确定节点中线性遍历找最小值，当顶点数 $V=10^5$ 时，计算量高达 $10^{10}$，直接超时。
3. **复杂依赖关系的死循环**：在任务调度、先修课程安排、大模块编译顺序中，若存在隐式循环依赖（死锁/环），传统方法难以一次性排序并侦测死锁。

**图论经典三剑客** 彻底攻克了这些痛点：
- **堆优化 Dijkstra**：借助小根堆以 $O(\log V)$ 极速摘取最近节点，将带权最短路压缩到 $O(E \log V)$。
- **Floyd-Warshall**：以精简的 3 重循环解决 $N \le 300$ 的全源任意两点最短路径。
- **Kahn 拓扑排序**：基于入度减治，在 $O(V+E)$ 内完成依赖拓扑展平并敏锐侦测有向环。

---

## 二、算法原理与灵感突破（怎么想到的与底层机制）

### 1. 堆优化 Dijkstra：贪心松弛与优先队列
- **核心机制**：设源点为 $S$，维护 `dist` 数组记录起点到各点的当前已知最短距离。
- **堆维护**：小根堆中存储 `(当前距离, 节点编号)`。
- **松弛操作（Relaxation）**：从堆顶弹出距离最近的节点 $u$，若当前距离大于 `dist[u]` 则跳过（懒惰删除）。遍历 $u$ 的所有出边 $(v, w)$，若 `dist[u] + w < dist[v]`，则更新 `dist[v]` 并将 `(dist[v], v)` 压入堆中。
```text
   heap.pop() -> (dist=3, node=A)
   尝试松弛相邻边:
       A --(weight 2)--> B
       如果 dist[A] + 2 < dist[B]:
           dist[B] = 5
           heap.push((5, B))
```

### 2. Floyd-Warshall：动态规划中转思想
- 状态定义：$dp[k][i][j]$ 表示只允许经过前 $k$ 个节点作为中转站时，从 $i$ 到 $j$ 的最短距离。
- 状态转移（滚动降维到二维）：
  $$dp[i][j] = \min(dp[i][j], dp[i][k] + dp[k][j])$$
- **铁律：最外层必须枚举中转点 $k$！**

### 3. Kahn 拓扑排序：剥洋葱消入度
1. 统计所有节点的入度（即依赖的前置数量）。
2. 将所有入度为 0 的节点（即没有任何前置依赖的任务）全部推入队列。
3. 循环弹出队头，加入拓扑序列，并将其所有后继节点的入度减 1。
4. 若后继节点入度降为 0，立即推入队列。
5. **环检测判定**：若最终拓扑序列长度 $< V$，说明图中必定存在有向环！

---

## 三、适用范围与题眼特征

### 题眼关键词识别
- **“求从 A 到 B 的最小耗时/最少花费，边权均为非负数”** $\to$ 堆优化 Dijkstra。
- **“数据规模 $N \le 300$，求任意两城市间的最短距离”** $\to$ Floyd。
- **“课程表安排”、“编译构建顺序”、“判定任务系统是否存在循环依赖”** $\to$ Kahn 拓扑排序。

### 竞赛避坑防线
- **Dijkstra 严禁用于负权边图**！如果图中包含负权边，贪心原则不再成立，必须使用 Bellman-Ford 或 SPFA 算法。
- **堆重复元素懒惰删除**：在 Python `heapq` 中，若 `d > dist[u]`，必须立即 `continue`，否则会产生大量无效松弛导致时间退化。

---

## 四、算法特点与时空复杂度

| 算法 | 时间复杂度 | 空间复杂度 | 核心特性 |
| :--- | :--- | :--- | :--- |
| **堆优化 Dijkstra** | $O(E \log V)$ | $O(V + E)$ | 贪心思想，非负权图单源最短路最优解 |
| **Floyd-Warshall** | $O(V^3)$ | $O(V^2)$ | 动态规划，全源最短路，代码极短常数极小 |
| **Kahn 拓扑排序** | $O(V + E)$ | $O(V + E)$ | 广搜入度剥离，自然判环与依赖线性化 |

---

## 五、快捷库/一行流与 C++ 408 对照

### Python 标准库最佳实践
```python
import heapq
from collections import deque

# 堆优化 Dijkstra 标准入堆
heap = [(0, start_node)]  # (dist, u)
# Kahn 拓扑队列
q = deque([u for u in range(n) if in_degree[u] == 0])
```

<details>
<summary><b>折叠查看：C++ 20 竞赛模版与 408 核心考点对照</b></summary>

```cpp
#include <vector>
#include <queue>
using namespace std;

// 408 考点：优先队列 Dijkstra 算法实现
vector<int> dijkstra(int n, int start, const vector<vector<pair<int, int>>>& adj) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    // 小根堆，存放 {dist, u}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    dist[start] = 0;
    pq.push({0, start});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue; // 懒惰删除
        
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```
</details>
