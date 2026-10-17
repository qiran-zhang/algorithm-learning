# 05 模块：二分查找与红蓝染色二分答案 (终结死循环)

## 一、算法由来与现实痛点 (Origin & Pain Points)
- **痛点**：在已排序的数亿数据中查找某一个数，若顺序遍历需要 $O(N)$，1秒只能查 1000 万次。而二分查找每次砍掉一半区间，仅需 $\approx 30$ 次判断即可查遍全球数据！
- **学习痛点**：二分查找是所有初学者公认“思路最简单，代码最难写对”的算法（高德纳曾指出：90% 的程序员写出的二分查找都包含死循环或越界 Bug！主要纠结于 `left < right` 还是 `left <= right`，`mid + 1` 还是 `mid`）。
- **破局**：采用现代化的**红蓝染色法（Red-Blue Coloring）**：
  - 将满足条件的染成红色（`is_blue(x) == False`），不满足条件的染成蓝色（`is_blue(x) == True`）；
  - 指针初始 `left = -1, right = n`（虚构边界）；
  - 循环条件永远是 `left + 1 != right`；
  - 最终结果必为 `left` 指向红色终点，`right` 指向蓝色起点，彻底告别死循环！

## 二、算法原理与核心实现 (Intuition & Mechanism)
1. **基础二分查找**：
   - 寻找首个 $\ge target$ 的位置（`lower_bound`）；
   - 定义染色条件：`is_blue = (nums[mid] >= target)`；
   - 最终 `right` 即为答案下标。
2. **二分答案母题（最大化最小值 / 最小化最大值）**：
   - 并不是在有序数组中找数字，而是在**解空间 $[min\_ans, max\_ans]$** 上进行二分！
   - 核心在于编写一个单调的验证函数 `check(mid)`：
     - 如果当速度/容量为 `mid` 时可以完成任务，则说明更高速率必然也能完成（单调可行）；
     - 二分目标是找到临界的最小速度。

## 三、适用范围与题型特征 (Applicability & Triggers)
- **题眼识别**：题目出现“最大化最小值”、“最小化最大值”、“使得所有...的最少天数/最小速度”。
- **经典真题**：爱吃香蕉的珂珂、木材加工、跳石头、分割数组的最大值。

## 四、算法特点与复杂度 (Characteristics & Complexity)
- **时间复杂度**：区间长度折半，二分本身 $O(\log(\text{Range}))$，若单次验证 `check()` 为 $O(N)$，则总时间为 $O(N \log(\text{Range}))$；
- **空间复杂度**：$O(1)$ 常数空间。

## 五、快捷标准库与一行流调用 (Standard Libraries)
```python
import bisect

arr = [1, 3, 5, 5, 8]
# 1. 查找首个 >= 5 的下标 (即 lower_bound)
idx = bisect.bisect_left(arr, 5) # 返回 2

# 2. 查找首个 > 5 的下标 (即 upper_bound)
idx2 = bisect.bisect_right(arr, 5) # 返回 4
```

<details>
<summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// 408 标准折半查找
int binarySearch(int A[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // 防溢出
        if (A[mid] == target) return mid;
        else if (A[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // 未找到
}

// C++ STL 一行流调用
// int idx = lower_bound(arr.begin(), arr.end(), target) - arr.begin();
```
</details>
