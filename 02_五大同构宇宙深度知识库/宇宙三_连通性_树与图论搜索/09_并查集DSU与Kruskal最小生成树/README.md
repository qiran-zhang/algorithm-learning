# 09 模块：并查集 (DSU) 与 Kruskal 最小生成树

## 一、算法由来与现实痛点 (Origin & Pain Points)
- **痛点**：给定若干个元素，需要动态将两个集合合并，并随时查询任意两个元素是否连通（朋友圈、同属于一个网络集群）。若用搜索或连通图遍历，每次查询都是 $O(V + E)$，高频查询下严重卡顿。
- **破局**：**并查集 (Disjoint Set Union)** 将集合抽象为树形结构，每个集合用树的根节点作为唯一标识：
  1. **路径压缩 (Path Compression)**：在查找根节点时，顺便把途经的所有节点直接挂到根节点下方（树高压扁为 1）；
  2. **按秩合并 (Union by Rank)**：将矮树挂在高树下，避免树高退化。
  - 经此双重优化，单次操作均摊时间复杂度为极其接近常数的 **反阿克曼函数 $O(\alpha(N)) < 5$**（在宇宙原子数量级内都不超过 5），实现近乎 $O(1)$ 的瞬时连通查询！
  - 结合贪心思想（按边权从小到大排序），并查集成为求解 **最小生成树 (MST)** 的 Kruskal 算法的核心引擎！

## 二、算法原理与核心实现 (Intuition & Mechanism)
1. **并查集基础模板**：
   ```python
   class DSU:
       def __init__(self, n):
           self.parent = list(range(n))
       def find(self, x):
           if self.parent[x] != x:
               self.parent[x] = self.find(self.parent[x]) # 路径压缩
           return self.parent[x]
       def union(self, x, y):
           rx, ry = self.find(x), self.find(y)
           if rx != ry:
               self.parent[rx] = ry
               return True
           return False # 原本就已连通
   ```
2. **Kruskal 最小生成树算法**：
   - 将所有边按权值升序排序；
   - 遍历每条边 $(u, v, w)$：利用并查集判断 $u$ 与 $v$ 是否已连通。若不连通，将该边加入生成树并执行 `union(u, v)`；直到选满 $V - 1$ 条边。

## 三、适用范围与题型特征 (Applicability & Triggers)
- **题眼识别**：题目出现“网络连通性判定”、“动态添加连通边”、“最小成本连接所有点”、“检测无向图是否存在环”。

## 四、算法特点与复杂度 (Characteristics & Complexity)
- **时间复杂度**：并查集单次查询/合并均摊 $O(\alpha(N))$；Kruskal 算法瓶颈在边排序 $O(E \log E)$；
- **空间复杂度**：$O(V)$ 存储父节点指针。

<details>
<summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 408 并查集标准定义
struct DSU {
    vector<int> parent;
    DSU(int n) {
        parent.resize(n);
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        if (parent[x] == x) return x;
        return parent[x] = find(parent[x]); // 路径压缩
    }
    bool unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        parent[rx] = ry;
        return true;
    }
};
```
</details>
