"""
14_区间DP(石子合并)与树形DP(树的直径)：挖空实战脚手架
请在 TODO 处补齐核心状态转移逻辑：
1. 区间 DP 按长度与分割点合并
2. 树形 DP 后序遍历自底向上汇聚与最长链维护
"""

from typing import List, Tuple

def solve_stone_merge(stones: List[int]) -> int:
    """实战挖空：合并石子区间 DP"""
    n = len(stones)
    if n <= 1:
        return 0
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]
        
    dp = [[0] * n for _ in range(n)]
    
    # 枚举长度 length 从 2 到 n
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            cost = prefix[j + 1] - prefix[i]
            # TODO 1: 枚举分割点 k (i <= k < j)，状态转移取最小值
            for k in range(i, j):
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + cost)
                
    return dp[0][n - 1]

def solve_tree_diameter(n: int, edges: List[Tuple[int, int]]) -> int:
    """实战挖空：树形 DP 求树的最大直径"""
    if n <= 1:
        return 0
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
        
    max_d = 0
    visited = [False] * n
    
    def dfs(u: int) -> int:
        nonlocal max_d
        visited[u] = True
        first_max = 0
        second_max = 0
        
        for v in adj[u]:
            if not visited[v]:
                d = dfs(v) + 1
                if d > first_max:
                    second_max = first_max
                    first_max = d
                elif d > second_max:
                    second_max = d
                    
        # TODO 2: 更新经过当前节点 u 的最长路径
        max_d = max(max_d, first_max + second_max)
        # TODO 3: 返回向下走的最长单链
        return first_max
        
    dfs(0)
    return max_d

if __name__ == "__main__":
    stones = [3, 2, 4, 1]
    ans = solve_stone_merge(stones)
    # 合并过程: 3+2=5, 4+1=5, 5+5=10 -> 总和 5 + 5 + 10 = 20
    assert ans == 20, f"Stone merge scaffold failed: {ans}"
    
    edges = [(0, 1), (1, 2)]
    d_val = solve_tree_diameter(3, edges)
    assert d_val == 2, f"Tree diameter scaffold failed: {d_val}"
    print("[PASS] 14 模块区间 DP 与树形 DP 实战脚手架验证通过！")
