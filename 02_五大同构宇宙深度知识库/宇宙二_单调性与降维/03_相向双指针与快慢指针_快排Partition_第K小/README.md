# 03 模块：相向双指针与快慢指针 · 快排 Partition 与第 K 小

## 一、算法由来与现实痛点 (Origin & Pain Points)
- **痛点**：在无序数组中寻找第 $K$ 小的元素，若全量排序再查下标，耗时 $O(N \log N)$；两数之和若两重循环暴力枚举，耗时 $O(N^2)$。
- **破局**：
  1. **单调性降维（相向双指针）**：对有序序列，左指针移动必让和变大，右指针移动必让和变小，天然将两重状态降维到单重 $O(N)$ 扫描；
  2. **快速选择算法 (Quickselect)**：利用快速排序的 **Partition（轴心切分）** 思想，每次只递归包含第 $K$ 小元素的那一半区间，平均时间复杂度降至神奇的 **$O(N)$ 线性时间**！这是 408 考研最核心的算法大题题型之一！

## 二、算法原理与核心实现 (Intuition & Mechanism)
1. **相向对撞双指针（以有序两数和为例）**：
   - 指针分别指向首尾 `left = 0, right = n - 1`；
   - 若 `nums[left] + nums[right] < target`，左指针右移；若 `> target`，右指针左移；若相等则锁定答案。
2. **408 核心快排 Partition 原理**：
   - 选取轴心 `pivot = nums[left]`；
   - 双指针分别向中间靠拢，右侧寻找比 pivot 小的换到左边，左侧寻找比 pivot 大的换到右边，最终将 pivot 放入正确排序位 $P$；
   - 若目标 $K == P$，则直接命中；若 $K < P$，只需往左递归；若 $K > P$，往右递归。

## 三、适用范围与题型特征 (Applicability & Triggers)
- **题眼识别**：题目要求“在 $O(N)$ 时间复杂度内求未排序数组中第 $K$ 大/第 $K$ 小元素”、“盛最多水的容器”、“三数之和为零”。

## 四、算法特点与复杂度 (Characteristics & Complexity)
- **时间复杂度**：相向双指针 $O(N)$；快速选择算法期望时间复杂度 $O(N)$，最坏退化为 $O(N^2)$（随机选主元可彻底防退化）；
- **空间复杂度**：相向双指针 $O(1)$，快速选择递归栈 $O(\log N)$。

## 五、快捷标准库与一行流调用 (Standard Libraries)
```python
import heapq

nums = [3, 2, 1, 5, 6, 4]
# Python 内置快速求第 K 大 / 第 K 小一行流 (基于堆)
top_k_large = heapq.nlargest(2, nums) # [6, 5] -> 第 2 大即为 top_k_large[-1]
```

<details>
<summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>

```cpp
// 408 经典真题：快排双向 Partition 实现
int partition(int A[], int low, int high) {
    int pivot = A[low]; // 选取第一个元素为主元
    while (low < high) {
        while (low < high && A[high] >= pivot) --high;
        A[low] = A[high];
        while (low < high && A[low] <= pivot) ++low;
        A[high] = A[low];
    }
    A[low] = pivot;
    return low; // 返回最终划分枢轴位置
}

// 快速选择求第 K 小元素 (平均 O(N))
int quickSelect(int A[], int low, int high, int k) {
    if (low == high) return A[low];
    int p = partition(A, low, high);
    if (p == k) return A[p];
    else if (k < p) return quickSelect(A, low, p - 1, k);
    else return quickSelect(A, p + 1, high, k);
}
```
</details>
