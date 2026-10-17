# 01 模块：一维与二维前缀和 · 哈希表枚举右维护左

## 一、算法由来与现实痛点 (Origin & Pain Points)
- **痛点**：给定长度为 $N$ 的数组，有 $Q$ 次查询，每次询问区间 $[L, R]$ 内的所有元素和。如果每次都用 `for` 循环从 $L$ 累加到 $R$，单次查询耗时 $O(N)$，总时间复杂度为 $O(Q \times N)$。当 $N, Q = 10^5$ 时，总运算量高达 $10^{10}$，直接超时 TLE！
- **破局**：在读入数组时花费 $O(N)$ 进行一次预处理，构造前缀和数组 `prefix`，随后每次区间查询通过一次减法在 **$O(1)$ 常数时间** 内直接出结果，将总复杂度降为 $O(N + Q)$！

## 二、算法原理与核心实现 (Intuition & Mechanism)
1. **一维前缀和**：
   - 定义：`prefix[i] = nums[0] + nums[1] + ... + nums[i-1]`（通常开 $N+1$ 长度，`prefix[0] = 0` 作为哨兵）；
   - 递推：`prefix[i] = prefix[i-1] + nums[i-1]`；
   - 查询：区间 $[L, R]$（闭区间）的和即为 `prefix[R+1] - prefix[L]`。
2. **二维前缀和（容斥原理）**：
   - 递推：`s[i][j] = s[i-1][j] + s[i][j-1] - s[i-1][j-1] + matrix[i-1][j-1]`；
   - 子矩形 $(x_1, y_1)$ 到 $(x_2, y_2)$ 和：`s[x2+1][y2+1] - s[x1][y2+1] - s[x2+1][y1] + s[x1][y1]`。
3. **哈希表 + 前缀和（枚举右，维护左）**：
   - 解决“连续子数组和等于 $K$ 的个数”。
   - 寻找满足 `prefix[R] - prefix[L] == K` 的 $L$，即 `prefix[L] == prefix[R] - K`。在遍历 $R$ 的同时用哈希表记录出现过的 `prefix` 频次。

## 三、适用范围与题型特征 (Applicability & Triggers)
- **题眼识别**：题目出现“多次查询静态区间和”、“子数组和为目标值 $K$”、“子矩阵元素和”。
- **适用边界**：仅适用于**静态数组**。若涉及频繁单点修改且需区间求和，必须升级为【树状数组】或【线段树】。

## 四、算法特点与复杂度 (Characteristics & Complexity)
- **时间复杂度**：预处理 $O(N)$ 或 $O(N \times M)$，单次区间查询 $O(1)$；
- **空间复杂度**：$O(N)$ 辅助数组。

## 五、快捷标准库与一行流调用 (Standard Libraries)
```python
import itertools

nums = [1, 2, 3, 4]
# Python 内置前缀累加生成器 (返回迭代器)
accum = list(itertools.accumulate(nums)) # [1, 3, 6, 10]
```

<details>
<summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>

```cpp
#include <vector>
using namespace std;

// 一维前缀和标准类
class NumArray {
    vector<int> prefix;
public:
    NumArray(vector<int>& nums) {
        int n = nums.size();
        prefix.assign(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
};
```
</details>
