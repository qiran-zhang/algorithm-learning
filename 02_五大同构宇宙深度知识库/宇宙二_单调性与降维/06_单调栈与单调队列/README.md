# 06 模块：单调栈与单调队列 (极值维护神兵)

## 一、算法由来与现实痛点 (Origin & Pain Points)
- **痛点 1（单调栈）**：求数组中每一个元素“右边第一个比它大的元素”（如气温预测、股票跨度）。两重循环扫描耗时 $O(N^2)$。
- **痛点 2（单调队列）**：滑动窗口在数组上移动，求每个窗口内的最大值。如果每次在窗口内调用 `max()`，耗时 $O(N \times K)$，在大窗口下极慢。
- **破局**：
  - **现实隐喻（视线遮挡）**：操场排队时，矮个子站在高个子身后，后面的人视线全被高个子挡住，矮个子再无出头之日，可以直接从备选集合中淘汰！
  - **单调栈**：让栈内元素严格保持单调递增/递减。当新元素入栈破坏单调性时，弹出被破坏的元素并在此瞬间结算答案，实现**每个元素最多进出栈各 1 次的纯 $O(N)$ 复杂度**！
  - **单调队列**：用双端队列维护区间候选极值，新元素从队尾淘汰比它弱且比它老的元素，队首维护当前窗口最大值，同样纯 $O(N)$！

## 二、算法原理与核心实现 (Intuition & Mechanism)
1. **单调栈（求下一个更大元素）**：
   - 维持栈内元素单调递减；
   - 遍历到 `x` 时，若 `x > stack[-1]`，说明找到了栈顶元素的右侧更大值，栈顶弹出并记录，直到恢复单调递减再将 `x` 入栈。
2. **单调队列（滑动窗口最大值）**：
   - 维护双端队列 `deque` 下标，使对应数值严格单调递减；
   - **出队**：若队首下标已经滑出窗口边界（`q[0] <= i - k`），队首弹出；
   - **淘汰**：若新元素 `nums[i] >= nums[q[-1]]`，队尾持续弹出比它小的值；
   - **入队**：`q.append(i)`，此时队首 `nums[q[0]]` 即为当前窗口最大值。

## 三、适用范围与题型特征 (Applicability & Triggers)
- **题眼识别**：题目要求“下一个更大/更小元素”、“柱状图中最大的矩形”、“接雨水”、“滑动窗口最大值”。

## 四、算法特点与复杂度 (Characteristics & Complexity)
- **时间复杂度**：每个元素最多入队/栈 1 次，出队/栈 1 次，总时间均摊严格 $O(N)$；
- **空间复杂度**：$O(N)$ 存储结构。

## 五、快捷标准库与一行流调用 (Standard Libraries)
```python
from collections import deque
# 单调队列必须使用 deque 以支持 O(1) 首尾同时弹出
mono_queue = deque()
```

<details>
<summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>

```cpp
#include <vector>
#include <deque>
#include <stack>
using namespace std;

// LeetCode 739. 每日温度 (单调栈求右侧更大距离)
vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> res(n, 0);
    stack<int> st; // 存储下标
    for (int i = 0; i < n; i++) {
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int prevIdx = st.top();
            st.pop();
            res[prevIdx] = i - prevIdx;
        }
        st.push(i);
    }
    return res;
}
```
</details>
