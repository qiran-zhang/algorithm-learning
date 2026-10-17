"""
05 模块：二分查找与红蓝染色二分答案
标准解题模板 (带自测断言，支持直接 Run)
"""

import math
from typing import List

def binary_search_red_blue(nums: List[int], target: int) -> int:
    """
    红蓝染色法实现标准二分查找：查找首个 >= target 的元素下标 (lower_bound)
    时间复杂度 O(log N)，空间复杂度 O(1)
    """
    # 染色规则：
    # 红色区间：nums[i] < target  (严格不满足)
    # 蓝色区间：nums[i] >= target (满足条件)
    # 最终 left 指向红色终点，right 指向蓝色起点 (即首个 >= target)
    left = -1
    right = len(nums)
    
    while left + 1 != right:
        mid = (left + right) // 2
        if nums[mid] >= target:
            right = mid  # 染成蓝色
        else:
            left = mid   # 染成红色
            
    return right

def min_eating_speed_koko(piles: List[int], h: int) -> int:
    """
    LeetCode 875: 爱吃香蕉的珂珂 (二分答案母题)
    在速度范围 [1, max(piles)] 内二分最小能吃完的速度 k
    """
    def check(k: int) -> bool:
        # 以速度 k 吃香蕉，计算总耗时
        total_hours = sum(math.ceil(p / k) for p in piles)
        return total_hours <= h

    # 染色规则：
    # 红色：无法在 h 小时内吃完 (check(k) == False)
    # 蓝色：可以在 h 小时内吃完 (check(k) == True)
    left = 0              # 速度为 0 必不可能
    right = max(piles)    # 最大堆速度必然能吃完
    
    while left + 1 != right:
        mid = (left + right) // 2
        if check(mid):
            right = mid  # 染成蓝色，尝试更小速度
        else:
            left = mid   # 染成红色，必须加速
            
    return right

if __name__ == "__main__":
    # 验证红蓝染色二分
    arr = [1, 2, 4, 4, 5, 8]
    assert binary_search_red_blue(arr, 4) == 2 # 第一个 4 下标为 2
    assert binary_search_red_blue(arr, 6) == 5 # 第一个 >= 6 的是 8，下标 5
    assert binary_search_red_blue(arr, 9) == 6 # 不存在，返回 len(arr)
    
    # 验证二分答案：珂珂吃香蕉
    piles = [3, 6, 7, 11]
    h = 8
    ans = min_eating_speed_koko(piles, h)
    assert ans == 4, f"Expected 4, got {ans}"
    
    print("✅ 05 模块二分查找与二分答案标准模板自测通过！")
