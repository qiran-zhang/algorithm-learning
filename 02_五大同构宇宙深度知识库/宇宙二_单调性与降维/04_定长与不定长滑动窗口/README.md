# 04 模块：定长与不定长滑动窗口 (毛毛虫伸缩模型)

## 一、算法由来与现实痛点 (Origin & Pain Points)
- **痛点**：寻找“无重复字符的最长子串”或“和至少为 $S$ 的最短子数组”，暴力两重循环尝试所有子区间 $[i, j]$ 需要 $O(N^2)$。
- **破局**：如果一个区间的性质具有**单调性**（例如窗口内元素全为正数，右边界扩张窗口和增大，左边界收缩窗口和减小），则右指针和左指针都只需向前单向移动，绝无倒退！如同毛毛虫爬行，两个指针各走最多 $N$ 步，将双重嵌套降低为**纯 $O(N)$ 线性单次扫描**！

## 二、算法原理与核心实现 (Intuition & Mechanism)
1. **定长滑动窗口（长度固定为 $K$）**：
   - 先前 $K$ 个元素进窗初始化状态；
   - 从第 $K$ 个元素开始，每一步“右边吃进一个，左边吐出一个”，状态 $O(1)$ 更新。
2. **不定长滑动窗口（最长/最短满足条件区间）**：
   - 核心循环三步走：
     ```python
     left = 0
     for right in range(len(s)):
         # 1. 进窗：将 s[right] 纳入窗口状态
         # 2. 出窗：while 窗口不合法 (如出现重复字符或超标):
         #       将 s[left] 移出窗口，left += 1
         # 3. 统计：记录此时合法的窗口最大/最小长度
     ```

## 三、适用范围与题型特征 (Applicability & Triggers)
- **题眼识别**：题目出现“连续子串 / 连续子数组”、“长度为 K 的子序列平均值”、“无重复字符的最长子串”。
- **适用边界**：要求窗口状态转移具备**单向单调性**。若数组中包含大量负数导致和的增减不再单调，则必须退化为【前缀和 + 哈希表】！

## 四、算法特点与复杂度 (Characteristics & Complexity)
- **时间复杂度**：左右指针各遍历数组一次，严格 $O(N)$；
- **空间复杂度**：通常使用哈希表或定长频次数组记录字符状态，空间复杂度 $O(\Sigma)$ 或 $O(1)$。

## 五、快捷标准库与一行流调用 (Standard Libraries)
```python
from collections import Counter, defaultdict
# 维护窗口内字符出现频次
window_counts = defaultdict(int)
```

<details>
<summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>

```cpp
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

// LeetCode 3. 无重复字符的最长子串 (不定长滑窗)
int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> lastPos;
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s[right];
        if (lastPos.count(c) && lastPos[c] >= left) {
            left = lastPos[c] + 1; // 快速跳过重复字符
        }
        lastPos[c] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}
```
</details>
