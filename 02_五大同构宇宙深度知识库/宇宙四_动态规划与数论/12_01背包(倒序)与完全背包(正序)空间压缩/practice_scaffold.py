"""
12 模块：0-1 背包 (倒序) 与 完全背包 (正序) 空间压缩
【挖空实战脚手架】practice_scaffold.py
请在带有 # TODO 的区域根据提示补全核心逻辑，运行直到终端输出 ✅ 通关提示！
"""

from typing import List

def knapsack_01_practice(capacity: int, weights: List[int], values: List[int]) -> int:
    """
    练习 1：0-1 背包一维滚动数组空间压缩 (必须倒序)
    """
    dp = [0] * (capacity + 1)
    n = len(weights)
    
    for i in range(n):
        w = weights[i]
        v = values[i]
        # TODO: 从 capacity 倒序遍历到 w（含 w），更新 dp[j] = max(dp[j], dp[j - w] + v)
        for j in range(capacity, w - 1, -1):
            dp[j] = max(dp[j], dp[j - w] + v)
            
    return dp[capacity]

def knapsack_complete_practice(capacity: int, weights: List[int], values: List[int]) -> int:
    """
    练习 2：完全背包一维滚动数组空间压缩 (必须正序)
    """
    dp = [0] * (capacity + 1)
    n = len(weights)
    
    for i in range(n):
        w = weights[i]
        v = values[i]
        # TODO: 从 w 正序遍历到 capacity（含 capacity），更新 dp[j] = max(dp[j], dp[j - w] + v)
        for j in range(w, capacity + 1):
            dp[j] = max(dp[j], dp[j - w] + v)
            
    return dp[capacity]

if __name__ == "__main__":
    print("正在检验你的 12 挖空练习实现...")
    w = [2, 1, 3]
    v = [3, 2, 4]
    assert knapsack_01_practice(4, w, v) == 6
    assert knapsack_complete_practice(4, w, v) == 8
    print("🎉 恭喜！12 背包问题空间压缩挖空练习通关！正序倒序核心心法已彻底领悟！")
