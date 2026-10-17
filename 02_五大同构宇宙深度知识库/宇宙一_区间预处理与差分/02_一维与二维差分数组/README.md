# 02 模块：一维与二维差分数组

## 一、算法由来与现实痛点 (Origin & Pain Points)
- **痛点**：给定长度为 $N$ 的数组，有 $M$ 次操作，每次操作要求将区间 $[L, R]$ 内的所有数字统一加上常数 $C$（如航班预订、公交车上下客）。若每次用暴力循环遍历 $[L, R]$ 累加，复杂度为 $O(M \times N)$。当 $N, M = 10^5$ 时，总操作量达 $10^{10}$ 必 TLE！
- **破局**：差分数组是前缀和的**完全逆运算**。通过巧妙地只在区间的两个端点打上标记（`diff[L] += C, diff[R+1] -= C`），将原本耗时 $O(N)$ 的区间修改降为 **$O(1)$ 常数时间**！最终只需一次前缀和累加还原数组，总复杂度仅为 $O(M + N)$！

## 二、算法原理与核心实现 (Intuition & Mechanism)
1. **一维差分**：
   - 定义：`diff[i] = nums[i] - nums[i-1]`（前缀和的逆运算）；
   - 区间 $[L, R]$ 批量增加 $C$：
     ```python
     diff[L] += C
     if R + 1 < n:
         diff[R + 1] -= C
     ```
   - 最终还原：对 `diff` 数组求一次前缀和即可恢复修改后的 `nums`。
2. **二维差分（矩形批量修改）**：
   - 目标：将左上角 $(x_1, y_1)$ 到右下角 $(x_2, y_2)$ 的矩形区域全加上 $C$；
   - 打标记四步法（容斥原理）：
     ```python
     diff[x1][y1] += C
     diff[x1][y2 + 1] -= C
     diff[x2 + 1][y1] -= C
     diff[x2 + 1][y2 + 1] += C
     ```

## 三、适用范围与题型特征 (Applicability & Triggers)
- **题眼识别**：题目出现“多次对某一区间 [L, R] 批量增加或扣减数值”、“航班预订”、“地毯铺设覆盖”。
- **适用边界**：适用于**所有修改操作全部完成后，最终统一输出或查询一次**的场景（离线静态）。若修改与查询交替进行，需使用树状数组或线段树。

## 四、算法特点与复杂度 (Characteristics & Complexity)
- **时间复杂度**：每次区间修改 $O(1)$，最终前缀和还原 $O(N)$ 或 $O(N \times M)$；
- **空间复杂度**：$O(N)$ 或 $O(N \times M)$ 差分数组。

## 五、快捷标准库与一行流调用 (Standard Libraries)
在 Python 中通常直接使用列表切片或推导式开差分数组：
```python
diff = [0] * (n + 1)
# 还原数组一行流
import itertools
restored = list(itertools.accumulate(diff[:n]))
```

<details>
<summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>

```cpp
#include <vector>
using namespace std;

// 一维差分模板
void rangeAdd(vector<int>& diff, int L, int R, int C) {
    diff[L] += C;
    if (R + 1 < diff.size()) {
        diff[R + 1] -= C;
    }
}

// 还原原始数组
vector<int> restoreArray(const vector<int>& diff) {
    int n = diff.size();
    vector<int> res(n, 0);
    res[0] = diff[0];
    for (int i = 1; i < n; i++) {
        res[i] = res[i - 1] + diff[i];
    }
    return res;
}
```
</details>
