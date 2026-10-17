"""
11_从lru_cache记忆化搜索到线性DP_LIS_LCS：挖空实战脚手架
请在 TODO 处补齐关键逻辑：
1. @lru_cache 装饰器与子状态定义
2. LCS 二维状态转移方程填表
"""

from functools import lru_cache
from typing import List

def solve_climbing_stairs_memo(n: int) -> int:
    """实战挖空：记忆化搜索爬楼梯（每次爬 1 或 2 阶，求到第 n 阶的方案数）"""
    # TODO 1: 添加缓存装饰器
    @lru_cache(maxsize=None)
    def dfs(i: int) -> int:
        if i <= 2:
            return i
        # TODO 2: 递归子状态组合
        return dfs(i - 1) + dfs(i - 2)
        
    return dfs(n)

def solve_lcs(text1: str, text2: str) -> int:
    """实战挖空：最长公共子序列填表"""
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                # TODO 3: 字符相同时的状态转移
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                # TODO 4: 字符不同时的状态转移
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    return dp[m][n]

if __name__ == "__main__":
    stairs = solve_climbing_stairs_memo(5)
    assert stairs == 8, f"Climb stairs fail: {stairs}"
    
    lcs_val = solve_lcs("abc", "def")
    assert lcs_val == 0, "LCS disjoint fail"
    
    lcs_val2 = solve_lcs("abcde", "ace")
    assert lcs_val2 == 3, "LCS common fail"
    
    print("[PASS] 11 模块记忆化搜索与 LCS 动态规划脚手架验证通过！")
