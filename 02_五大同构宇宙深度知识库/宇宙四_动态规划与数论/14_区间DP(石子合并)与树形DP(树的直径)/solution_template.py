"""
14_区间DP(石子合并)与树形DP(树的直径)：标准工程模板
涵盖两大高阶结构模型：
1. 区间 DP：相邻石子合并最小代价（前缀和优化）
2. 树形 DP：树的直径与最大不相邻独立集（没有上司的舞会）
"""

import sys
from typing import List, Tuple

sys.setrecursionlimit(300000)

def stone_merge_interval_dp(stones: List[int]) -> int:
    """区间 DP：合并相邻石子的最小得分代价"""
    n = len(stones)
    if n <= 1:
        return 0
        
    # 前缀和快速计算区间和
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]
        
    def range_sum(i: int, j: int) -> int:
        return prefix[j + 1] - prefix[i]
        
    # dp[i][j] 表示合并区间 [i, j] 的最小花费
    INF = float('inf')
    dp = [[0] * n for _ in range(n)]
    
    # 阶段 1：枚举区间长度 length 从 2 到 n
    for length in range(2, n + 1):
        # 阶段 2：枚举左端点 i
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = INF
            cost = range_sum(i, j)
            # 阶段 3：枚举分割点 k (i <= k < j)
            for k in range(i, j):
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + cost)
                
    return dp[0][n - 1]

def tree_diameter(n: int, edges: List[Tuple[int, int]]) -> int:
    """树形 DP：求无向树的直径（边数最长的简单路径）"""
    if n <= 1:
        return 0
        
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
        
    max_diameter = 0
    visited = [False] * n
    
    def dfs(u: int) -> int:
        nonlocal max_diameter
        visited[u] = True
        
        first_max = 0   # 向下走的最长链
        second_max = 0  # 向下走的次长链
        
        for v in adj[u]:
            if not visited[v]:
                d = dfs(v) + 1  # 递归子树返回深度并加 1
                if d > first_max:
                    second_max = first_max
                    first_max = d
                elif d > second_max:
                    second_max = d
                    
        # 更新穿过当前节点 u 的最长路径
        max_diameter = max(max_diameter, first_max + second_max)
        return first_max  # 向父节点回溯返回最大单链长度
        
    dfs(0)
    return max_diameter

if __name__ == "__main__":
    # 1. 验证石子合并
    # 4 堆石子: [1, 3, 5, 2]
    # 最优合并过程：1+3=4 (代价4), 5+2=7 (代价7), 4+7=11 (代价11), 总代价 = 4 + 7 + 11 = 22
    stones_test = [1, 3, 5, 2]
    ans_stones = stone_merge_interval_dp(stones_test)
    assert ans_stones == 22, f"Stone merge fail: {ans_stones}"
    
    # 2. 验证树的直径
    # 树结构: 0 - 1 - 2 - 3, 1 - 4
    # 直径路径: 4 - 1 - 2 - 3 (长度 3) 或 0 - 1 - 2 - 3 (长度 3)
    edges_test = [(0, 1), (1, 2), (2, 3), (1, 4)]
    d_ans = tree_diameter(5, edges_test)
    assert d_ans == 3, f"Tree diameter fail: {d_ans}"
    
    print("[PASS] 14 模块区间 DP 与树形 DP 标准模板全部验证通过！")
