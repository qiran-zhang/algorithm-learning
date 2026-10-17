# 11_从lru_cache记忆化搜索到线性DP_LIS_LCS：从顶向下到无后效性填表

> **适用竞赛**：蓝桥杯（动态规划分值占比超 30%）、力扣核心 DP 专题、大厂机试、408 算法设计与分析

---

## 一、算法由来与痛点（为什么老办法不行）

在求解最优化问题（如最大收益、最短路径、最长子序列）时：
1. **纯暴力递归的指数级灾难**：求解斐波那契数 $F(n) = F(n-1) + F(n-2)$，递归树展开后存在海量**重叠子问题**（如 $F(30)$ 会被重复计算几千万次），时间复杂度高达 $O(2^n)$。
2. **迭代 DP 的心理门槛**：初学者直接写自底向上的二维 `for` 循环填表时，常常对“循环顺序应该正着跑还是倒着跑”、“边界初值怎么赋”感到摸不着头脑。

**动态规划（Dynamic Programming）** 与 **记忆化搜索（Memoization）** 彻底化解了这一困局：
- **灵感突破**：子问题只要算过一次，就用一张备忘录（哈希表或数组）把它存起来；下次再遇到，直接 $O(1)$ 查表返回！
- 利用 Python 独步武林的 `@functools.lru_cache(None)`，只需在直观的暴力递归函数上加一行装饰器，就能瞬间将其蜕变为高分 DP！

---

## 二、算法原理与灵感突破（怎么想到的与底层机制）

### 1. 记忆化搜索的蜕变机制
```text
           dfs(5)
         /        \
      dfs(4)     dfs(3)  <- 如果 dfs(3) 已经算过并存入 cache
     /      \       |
  dfs(3)  dfs(2)  [O(1)命中直接返回，剪断右半边庞大子树!]
```
- **核心原则**：只要一个递归函数的返回值**仅取决于它的输入参数**（即无后效性，不依赖外部全局可变状态），就可以无脑加 `@lru_cache(None)`！

### 2. 线性 DP 双子星：LIS 与 LCS
1. **最长递增子序列（LIS，LeetCode 300）**：
   - 状态定义：$dp[i]$ 表示以 $nums[i]$ 结尾的最长递增子序列的长度。
   - 转移方程：$dp[i] = \max(dp[j] + 1)$ 对所有 $j < i$ 且 $nums[j] < nums[i]$。
   - 进阶二分贪心：维护递增数组 `tails`，用二分插入（`bisect_left`）将时间优化至 $O(N \log N)$！
2. **最长公共子序列（LCS，LeetCode 1143）**：
   - 状态定义：$dp[i][j]$ 表示字符串 $s_1$ 的前 $i$ 个字符与 $s_2$ 的前 $j$ 个字符的 LCS 长度。
   - 状态转移：
     $$dp[i][j] = \begin{cases} dp[i-1][j-1] + 1 & s_1[i-1] == s_2[j-1] \\ \max(dp[i-1][j], dp[i][j-1]) & s_1[i-1] \ne s_2[j-1] \end{cases}$$

---

## 三、适用范围与题眼特征

### 题眼关键词识别
- **“求最长上升/递增”、“最长公共序列”、“打家劫舍”、“跳跃游戏”**。
- **“求最值”、“求方案总数”、“判定是否可行”**。
- **无后效性检验**：“未来走哪一步，只取决于当前所处的状态，与你过去是怎么走到当前状态的没有任何关系”。

### 竞赛避坑防线
- **递归栈超限**：Python 默认递归深度仅 1000，使用记忆化搜索必须在头部执行 `sys.setrecursionlimit(300000)`。
- **缓存未清空**：多组测试数据（ACM 模式下 `while True:` 读入）时，若使用了全局 `@lru_cache` 的函数，必须在处理新测试数据前调用 `func.cache_clear()`！

---

## 四、算法特点与时空复杂度

| 维度 | 特点 |
| :--- | :--- |
| **时间复杂度** | 记忆化搜索 / 填表 DP：$O(\text{状态总数} \times \text{单次转移代价})$。LIS 朴素为 $O(N^2)$，二分优化为 $O(N \log N)$；LCS 为 $O(N \times M)$。 |
| **空间复杂度** | $O(\text{状态总数})$，滚动数组可优化一维空间。 |
| **适用条件** | 具备**最优子结构**与**重叠子问题**，满足**无后效性**。 |

---

## 五、快捷库/一行流与 C++ 408 对照

### Python 标准库一行流
```python
import bisect
from functools import lru_cache

# 1. 记忆化搜索神级装饰器
@lru_cache(maxsize=None)
def dfs(state_param): ...

# 2. LIS 的 O(N log N) 极简二分实现
def length_of_lis(nums):
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)
```

<details>
<summary><b>折叠查看：C++ 20 竞赛模版与 408 核心考点对照</b></summary>

```cpp
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// 408 考点：最长公共子序列（LCS）动态规划矩阵构建
int longestCommonSubsequence(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}
```
</details>
