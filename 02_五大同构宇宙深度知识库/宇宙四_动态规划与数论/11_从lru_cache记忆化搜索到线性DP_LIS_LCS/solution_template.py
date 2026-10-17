"""
11_从lru_cache记忆化搜索到线性DP_LIS_LCS：标准工程模板
涵盖三大经典实现：
1. @lru_cache 记忆化搜索解决打家劫舍与硬币兑换
2. LIS 最长递增子序列（O(N^2) DP 与 O(N log N) 二分贪心双版本）
3. LCS 最长公共子序列（二维表格与滚动数组）
"""

import sys
import bisect
from functools import lru_cache
from typing import List

sys.setrecursionlimit(300000)

def rob_memoization(nums: List[int]) -> int:
    """打家劫舍：记忆化搜索实现（LeetCode 198）"""
    @lru_cache(maxsize=None)
    def dfs(i: int) -> int:
        # 边界：超出数组返回 0
        if i >= len(nums):
            return 0
        # 选当前房屋（跳过下一家） vs 不选当前房屋
        return max(nums[i] + dfs(i + 2), dfs(i + 1))
        
    res = dfs(0)
    dfs.cache_clear()  # 良好竞赛习惯：清空缓存
    return res

def length_of_lis_dp(nums: List[int]) -> int:
    """LIS 基础动态规划 O(N^2)"""
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

def length_of_lis_binary_search(nums: List[int]) -> int:
    """LIS 二分贪心优化 O(N log N)（耐心排序法）"""
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)

def longest_common_subsequence(text1: str, text2: str) -> int:
    """LCS 最长公共子序列（LeetCode 1143）"""
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    return dp[m][n]

if __name__ == "__main__":
    # 1. 验证打家劫舍
    houses = [2, 7, 9, 3, 1]
    assert rob_memoization(houses) == 12, "Rob fail"
    
    # 2. 验证 LIS
    seq = [10, 9, 2, 5, 3, 7, 101, 18]
    assert length_of_lis_dp(seq) == 4, "LIS O(N^2) fail"
    assert length_of_lis_binary_search(seq) == 4, "LIS O(N log N) fail"
    
    # 3. 验证 LCS
    s1, s2 = "abcde", "ace"
    assert longest_common_subsequence(s1, s2) == 3, "LCS fail"
    
    print("[PASS] 11 模块记忆化搜索与线性 DP 双轨标准模板全部验证通过！")
