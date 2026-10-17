"""
12 模块：0-1 背包 (倒序) 与 完全背包 (正序) 空间压缩
标准解题模板 (带自测断言，支持直接 Run)
"""

from typing import List

def knapsack_01(capacity: int, weights: List[int], values: List[int]) -> int:
    """
    0-1 背包问题：每个物品最多选 1 次，求背包最大价值
    空间压缩至 O(capacity)，内层容量循环必须【倒序】
    """
    dp = [0] * (capacity + 1)
    n = len(weights)
    
    for i in range(n):
        w = weights[i]
        v = values[i]
        # 必须倒序：从 capacity 倒序到 w
        for j in range(capacity, w - 1, -1):
            dp[j] = max(dp[j], dp[j - w] + v)
            
    return dp[capacity]

def knapsack_complete(capacity: int, weights: List[int], values: List[int]) -> int:
    """
    完全背包问题：每个物品可无限次选取，求背包最大价值
    空间压缩至 O(capacity)，内层容量循环必须【正序】
    """
    dp = [0] * (capacity + 1)
    n = len(weights)
    
    for i in range(n):
        w = weights[i]
        v = values[i]
        # 必须正序：从 w 正序到 capacity
        for j in range(w, capacity + 1):
            dp[j] = max(dp[j], dp[j - w] + v)
            
    return dp[capacity]

def can_partition_subset_sum(nums: List[int]) -> bool:
    """
    LeetCode 416. 分割等和子集 (0-1 背包母题)
    判断是否能将数组分割为两个元素和相等的子集
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for x in nums:
        # 0-1 背包容量倒序
        for j in range(target, x - 1, -1):
            if dp[j - x]:
                dp[j] = True
                
    return dp[target]

if __name__ == "__main__":
    # 验证 0-1 背包
    # 容量 4，物品: (w=2, v=3), (w=1, v=2), (w=3, v=4)
    w1 = [2, 1, 3]
    v1 = [3, 2, 4]
    assert knapsack_01(4, w1, v1) == 6 # 选前两件 w=2+1=3, v=3+2=5，或选第1和第3件不行，选 1+2 件 v=5，选 (w=1,v=2)+(w=3,v=4)=6
    
    # 验证完全背包
    # 容量 4，同上物品可无限选：选 4 个第2件 w=1*4=4, v=2*4=8
    assert knapsack_complete(4, w1, v1) == 8
    
    # 验证分割等和子集
    assert can_partition_subset_sum([1, 5, 11, 5]) is True  # 1+5+5 = 11
    assert can_partition_subset_sum([1, 2, 3, 5]) is False
    
    print("✅ 12 模块背包问题空间压缩标准模板自测通过！")
