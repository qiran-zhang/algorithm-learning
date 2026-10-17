# 第 0 章：Python 竞赛内功极速唤醒与双模式转换手册

> **致好久没写 Python 的你**：Python 是算法竞赛与面试中代码最简洁、开发最神速的语言。本手册旨在 15 分钟内快速激活你的 Python 语法记忆，并掌握考场防超时与防踩坑的关键底线。

---

## 一、高频语法极速唤醒（5 分钟速记）

### 1. 切片与逆序（Slicing）
```python
s = [0, 1, 2, 3, 4, 5]
s[1:4]     # [1, 2, 3] 左闭右开
s[::-1]    # [5, 4, 3, 2, 1, 0] 字符串/列表直接翻转
s[::2]     # [0, 2, 4] 隔一个取一个
```

### 2. 列表推导式与二维矩阵初始化（防深浅拷贝陷阱）
```python
# 正确初始化 n 行 m 列全 0 矩阵（深拷贝独立行）
matrix = [[0] * m for _ in range(n)]

# ❌ 严禁写法（所有行指向同一个地址，改一行全改！）：
# bad_matrix = [[0] * m] * n
```

### 3. 解构赋值与极值交换
```python
# 优雅交换两个变量值，无需中间变量 temp
a, b = b, a

# 带星号解构
first, *middle, last = [1, 2, 3, 4, 5]
# first=1, middle=[2, 3, 4], last=5
```

### 4. 排序与自定义 Lambda
```python
intervals = [[1, 4], [2, 3], [3, 6]]
# 按右端点升序排序（区间贪心标配）
intervals.sort(key=lambda x: x[1])

# 多关键字排序：先按第一维降序，若相同则按第二维升序
intervals.sort(key=lambda x: (-x[0], x[1]))
```

---

## 二、竞赛四大神仙标准库

### 1. `collections` 模块（双端队列、计数器、带默认值字典）
```python
from collections import deque, Counter, defaultdict

# 1) deque: O(1) 头部与尾部增删（BFS 与滑动窗口必备）
q = deque([1, 2, 3])
q.append(4)       # 尾部入队
q.appendleft(0)   # 头部入队
val = q.popleft() # 头部出队 O(1)，列表 list.pop(0) 为 O(N) 极慢！

# 2) Counter: 字符与元素频次统计
cnt = Counter("leetcode")
# cnt['e'] -> 3

# 3) defaultdict: 自动初始化默认值，免去 if k not in dict 判断
graph = defaultdict(list)
graph[1].append(2)  # 无需预先 graph[1] = []
```

### 2. `heapq` 模块（小顶堆与优先队列）
```python
import heapq

heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
heapq.heappush(heap, 3)
smallest = heapq.heappop(heap) # 返回 1 (小顶堆)

# 实现大顶堆（存负数）：
max_heap = []
heapq.heappush(max_heap, -val)
largest = -heapq.heappop(max_heap)
```

### 3. `bisect` 模块（二分查找二分插入）
```python
import bisect

arr = [1, 2, 4, 4, 5, 7]
# bisect_left: 查找 >= 目标值的第一个位置（即 lower_bound）
idx1 = bisect.bisect_left(arr, 4)  # 返回 2

# bisect_right: 查找 > 目标值的第一个位置（即 upper_bound）
idx2 = bisect.bisect_right(arr, 4) # 返回 4
```

### 4. `functools.lru_cache` 模块（自动记忆化搜索）
```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# ⚠️ 考场防踩坑：如果处理多组查询数据，查询前必须清理缓存！
fib.cache_clear()
```

---

## 三、双模式转换标准模板

### 模式 A：蓝桥杯 / ACM 竞赛极速读入模板
```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(200000)

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    # 读入所有数字流
    it = iter(lines)
    n = int(next(it))
    m = int(next(it))
    nums = [int(next(it)) for _ in range(n)]
    
    # 业务逻辑
    ans = sum(nums)
    print(ans)

if __name__ == "__main__":
    solve()
```

### 模式 B：力扣 / 保研机试核心代码模板
```python
class Solution:
    def solveProblem(self, nums: list[int], target: int) -> int:
        # 只需关注函数签名与返回值，无需关心输入输出快读
        res = 0
        return res
```
