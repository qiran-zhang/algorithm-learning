"""
contest_starter_template.py
===========================
蓝桥杯 Python 软件开发组 / 算法竞赛 考场黄金起手式模版
包含：
1. 极速 I/O (解决几十万行输入 TLE 问题)
2. 递归深度扩容 (防止 DFS 爆栈 RecursionError)
3. 浮点精度保护
4. 多组测试数据 @lru_cache 脏数据清理
5. ACM 模式与力扣 class Solution 模式双向转换示例
"""

import sys
from functools import lru_cache
from collections import deque, Counter, defaultdict
import heapq
import bisect
import math

# 1. 考场快读与扩栈起手式
input = sys.stdin.readline
sys.setrecursionlimit(200000)

# 2. 浮点数比较常数
EPS = 1e-7

def float_equal(a: float, b: float) -> bool:
    """比较两个浮点数是否相等"""
    return abs(a - b) < EPS


# 3. 记忆化搜索模板 (带缓存清理机制)
@lru_cache(maxsize=None)
def memoized_dfs(state: int) -> int:
    """记忆化搜索骨架"""
    if state <= 1:
        return state
    return memoized_dfs(state - 1) + memoized_dfs(state - 2)


# 4. ACM 模式主入口
def solve() -> None:
    """
    单组 / 多组测试数据主处理函数
    """
    # 模拟输入演示
    data = "5 3\n10 20 30 40 50"
    lines = data.strip().split("\n")
    
    n, k = map(int, lines[0].split())
    arr = list(map(int, lines[1].split()))
    
    # 业务逻辑演示：滑动窗口求和
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, n):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
        
    print(f"最大长度为 {k} 的子数组和为: {max_sum}")


# 5. 力扣核心代码模式类
class Solution:
    def maxSubarraySum(self, nums: list[int], k: int) -> int:
        """力扣风格接口"""
        if not nums or k <= 0 or k > len(nums):
            return 0
        window = sum(nums[:k])
        res = window
        for i in range(k, len(nums)):
            window += nums[i] - nums[i - k]
            res = max(res, window)
        return res


if __name__ == "__main__":
    # 验证 ACM 入口
    solve()
    
    # 验证力扣入口
    sol = Solution()
    ans = sol.maxSubarraySum([10, 20, 30, 40, 50], 3)
    assert ans == 120, f"Expected 120, got {ans}"
    
    # 验证记忆化搜索及清理
    val = memoized_dfs(10)
    assert val == 55
    memoized_dfs.cache_clear() # 清除缓存
    
    print("✅ contest_starter_template 所有测试用例自测通过！")
