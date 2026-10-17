# 12 模块：0-1 背包 (倒序) 与 完全背包 (正序) 空间压缩

## 一、算法由来与现实痛点 (Origin & Pain Points)
- **痛点**：背包问题是动态规划最经典的母题，也是最容易把空间写爆的题目。给定容量为 $W$ 的背包和 $N$ 个物品，二维状态 `dp[i][w]` 表示前 $i$ 个物品在容量限制 $w$ 下的最大价值。当 $N = 1000, W = 10000$ 时，二维数组占用空间达 $10^7$ 个整型（约 40MB），且极易引起 CPU 缓存未命中（Cache Miss）。
- **破局（空间压缩终极秘诀）**：
  - 观察状态转移方程：`dp[i][w]` 只依赖上一行 `dp[i-1][...]`，与更早的历史无关！
  - **0-1 背包（每个物品最多选 1 次）**：必须**逆序遍历容量 $w$（从 $W$ 倒序到 $weight[i]$）**！为什么必须倒序？因为如果正序，更新 `dp[w]` 时用到的 `dp[w - weight[i]]` 已经被当前物品更新过了，相当于同一个物品被拿了两次，导致 0-1 背包错误地退化为完全背包！
  - **完全背包（每个物品可选无限次）**：恰恰需要利用本轮刚更新过的状态，因此必须**正序遍历容量 $w$（从 $weight[i]$ 正序到 $W$）**！
  - 仅需颠倒一层循环顺序，空间复杂度直接从 $O(N \times W)$ 暴降为 **$O(W)$**，堪称算法工程的艺术！

## 二、算法原理与核心实现 (Intuition & Mechanism)
1. **0-1 背包空间压缩模板**：
   ```python
   dp = [0] * (capacity + 1)
   for w_i, v_i in items:
       for j in range(capacity, w_i - 1, -1): # 必须倒序！
           dp[j] = max(dp[j], dp[j - w_i] + v_i)
   ```
2. **完全背包空间压缩模板**：
   ```python
   dp = [0] * (capacity + 1)
   for w_i, v_i in items:
       for j in range(w_i, capacity + 1):     # 必须正序！
           dp[j] = max(dp[j], dp[j - w_i] + v_i)
   ```

## 三、适用范围与题型特征 (Applicability & Triggers)
- **题眼识别**：题目出现“在限定预算/体积/重量/时间内，获得最大收益”、“分割等和子集”、“零钱兑换（无限硬币）”。

## 四、算法特点与复杂度 (Characteristics & Complexity)
- **时间复杂度**：伪多项式时间 $O(N \times W)$；
- **空间复杂度**：一维滚动数组 $O(W)$。

<details>
<summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 0-1 背包一维空间压缩 C++
int zeroOneKnapsack(int W, const vector<int>& weights, const vector<int>& values) {
    vector<int> dp(W + 1, 0);
    int n = weights.size();
    for (int i = 0; i < n; i++) {
        for (int j = W; j >= weights[i]; j--) { // 倒序
            dp[j] = max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }
    return dp[W];
}
```
</details>
