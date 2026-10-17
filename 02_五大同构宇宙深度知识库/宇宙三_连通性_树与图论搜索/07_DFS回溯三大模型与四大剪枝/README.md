# 07_DFS回溯三大模型与四大剪枝：从树形试探到极速剪枝

> **适用竞赛**：蓝桥杯（C组/B组/A组压轴与大分值暴力搜索必考）、力扣全阶段、大厂机试、408 图的深度优先遍历

---

## 一、算法由来与痛点（为什么老办法不行）

在求解排列组合、子集划分、数独、N皇后、迷宫所有可行解等问题时，暴力多重嵌套 `for` 循环存在致命缺陷：
1. **循环层数未知**：当要求在 $n$ 个数中选 $k$ 个数，且 $k$ 是动态输入时，无法编写 $k$ 层写死的 `for` 循环。
2. **状态空间爆炸**：暴力枚举全排列的复杂度为 $O(n!)$，暴力枚举子集复杂度为 $O(2^n)$。当 $n=20$ 时，$2^{20} \approx 10^6$ 尚可，而 $n! \approx 2.4 \times 10^{18}$，任何计算机都无法承受。
3. **老办法的死胡同**：没有“撞南墙回头”的自我纠错机制，明知当前分支已经不可能凑成解，依然傻傻算完整棵子树。

**DFS 回溯法（Backtracking）** 应运而生：利用递归函数调用栈天然实现“试探—不合适—撤销变更（回溯）—尝试下一分支”的状态树遍历，配合四大剪枝技术，将指数级状态空间大幅修剪。

---

## 二、算法原理与灵感突破（怎么想到的与底层机制）

### 1. 核心灵感：隐式树遍历与现场保护
回溯的本质是 **状态空间树的 DFS 遍历**。每次深入一层递归相当于在树上走向子节点，递归返回相当于回到父节点：
```text
               [ ] (初始空选择)
           /    |    \
        [1]    [2]    [3]        <- 第 1 层递归
       /   \   ...
    [1,2] [1,3]                  <- 第 2 层递归
```
**关键原则：做出选择 -> 递归下探 -> 撤销选择（恢复现场）**。

### 2. 回溯三大基本模型
1. **子集型回溯（选或不选 / 枚举选哪个）**：
   - 典型：`LeetCode 78 子集`、`LeetCode 90 子集 II`
2. **组合型回溯（顺序无关，避免重复计数）**：
   - 依赖 `start_index` 保证递增枚举：`LeetCode 77 组合`、`LeetCode 39 组合总和`
3. **排列型回溯（顺序相关，同一元素不可重用）**：
   - 依赖 `used` 布尔数组或位掩码记录使用状态：`LeetCode 46 全排列`、`LeetCode 47 全排列 II`

### 3. 四大核心剪枝策略（OI赛制拿满分的核心内功）
1. **可行性剪枝（越界/越额立即刹车）**：如当前累计和 `cur_sum + candidate > target`，直接 `break` 或 `return`。
2. **最优性剪枝（已不如当前已知最优解）**：如求最小步数/花费，若 `cur_cost >= min_cost[0]`，后续分支无论多好都不可能刷新纪录，立即截断。
3. **重复性剪枝（排序后跳过同层相同元素）**：`if i > start and nums[i] == nums[i-1]: continue`。
4. **顺序剪枝（大元素优先试探）**：从大到小排序后试探，能更快触发可行性剪枝，极大缩小分支因子。

---

## 三、适用范围与题眼特征

### 题眼关键词识别
- **“求所有可能方案”、“列举所有子集/组合/排列”** $\to$ 100% 回溯。
- **“数独填数”、“N皇后”、“连通块所有路径”、“图的哈密顿回路”** $\to$ 回溯搜索。
- **数据范围特征**：$N \le 12 \sim 15$（提示 $O(N!)$ 全排列）、$N \le 20 \sim 25$（提示 $O(2^N)$ 子集）。

### 禁忌与避坑
- 蓝桥杯 Python 默认递归深度仅 1000，必须加 `sys.setrecursionlimit(300000)`。
- 切勿在递归传参中频繁使用 `path + [x]` 生成新列表（$O(K)$ 内存拷贝极大拖慢速度），应使用 `path.append(x)`、递归后 `path.pop()` 维护全局路径。

---

## 四、算法特点与时空复杂度

| 维度 | 特点 |
| :--- | :--- |
| **时间复杂度** | 子集模型 $O(2^n \cdot n)$，排列模型 $O(n! \cdot n)$。剪枝后实际运行时间常减少 90%~99%。 |
| **空间复杂度** | $O(n)$，仅依赖递归调用栈深度与临时路径 `path` 长度，极其节省空间。 |
| **算法稳定性** | 确定性遍历，同层排序后输出天然有序。 |

---

## 五、快捷库/一行流与 C++ 408 对照

### Python 标准库一行流
Python 自带强悍的 `itertools` 库，在蓝桥杯客观填空题或小数据中可直接秒杀：
```python
import itertools

# 1. 全排列
list(itertools.permutations([1, 2, 3]))  # 产生 (1,2,3), (1,3,2)...

# 2. 组合 (无重复选 k 个)
list(itertools.combinations([1, 2, 3, 4], 2))  # (1,2), (1,3)...

# 3. 笛卡尔积
list(itertools.product([0, 1], repeat=3))  # 相当于枚举 3 位二进制
```

<details>
<summary><b>折叠查看：C++ 20 竞赛模版与 408 核心考点对照</b></summary>

```cpp
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

// 408 考点：树与图的深度优先遍历（递归栈结构）
class Solution {
    vector<vector<int>> res;
    vector<int> path;
    vector<bool> used;

public:
    void dfs(const vector<int>& nums) {
        if (path.size() == nums.size()) {
            res.push_back(path);
            return;
        }
        for (int i = 0; i < nums.size(); ++i) {
            if (used[i]) continue;
            used[i] = true;
            path.push_back(nums[i]);
            dfs(nums);
            path.pop_back();       // 撤销现场
            used[i] = false;
        }
    }
    vector<vector<int>> permute(vector<int>& nums) {
        used.assign(nums.size(), false);
        dfs(nums);
        return res;
    }
};
```
</details>
