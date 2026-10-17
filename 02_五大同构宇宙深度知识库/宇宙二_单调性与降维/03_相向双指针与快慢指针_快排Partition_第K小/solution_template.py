"""
03 模块：相向双指针与快慢指针 · 快排 Partition 与第 K 小
标准解题模板 (带自测断言，支持直接 Run)
"""

import random
from typing import List, Tuple

def two_sum_sorted(numbers: List[int], target: int) -> List[int]:
    """
    LeetCode 167. 两数之和 II - 输入有序数组 (相向双指针)
    时间复杂度 O(N)，空间复杂度 O(1)
    """
    left, right = 0, len(numbers) - 1
    while left < right:
        s = numbers[left] + numbers[right]
        if s == target:
            return [left + 1, right + 1] # 1-based index
        elif s < target:
            left += 1
        else:
            right -= 1
    return []

def partition(arr: List[int], low: int, high: int) -> int:
    """
    408 核心考点：单向/双向快排 Partition
    选取随机主元避免最坏 O(N^2)
    """
    rand_idx = random.randint(low, high)
    arr[low], arr[rand_idx] = arr[rand_idx], arr[low]
    pivot = arr[low]
    
    i, j = low, high
    while i < j:
        while i < j and arr[j] >= pivot:
            j -= 1
        arr[i] = arr[j]
        while i < j and arr[i] <= pivot:
            i += 1
        arr[j] = arr[i]
    arr[i] = pivot
    return i

def quick_select(arr: List[int], low: int, high: int, k_smallest_idx: int) -> int:
    """
    快速选择算法：在平均 O(N) 时间内找出第 k_smallest_idx 小的元素 (0-indexed)
    """
    if low == high:
        return arr[low]
    p = partition(arr, low, high)
    if p == k_smallest_idx:
        return arr[p]
    elif k_smallest_idx < p:
        return quick_select(arr, low, p - 1, k_smallest_idx)
    else:
        return quick_select(arr, p + 1, high, k_smallest_idx)

def find_kth_largest(nums: List[int], k: int) -> int:
    """
    LeetCode 215: 寻找第 K 个最大的元素
    第 K 大等价于第 len(nums) - k 小 (0-indexed)
    """
    a = nums.copy()
    target_idx = len(a) - k
    return quick_select(a, 0, len(a) - 1, target_idx)

if __name__ == "__main__":
    # 验证有序两数之和
    ans1 = two_sum_sorted([2, 7, 11, 15], 9)
    assert ans1 == [1, 2]
    
    # 验证快速选择第 K 大
    nums = [3, 2, 1, 5, 6, 4]
    assert find_kth_largest(nums, 2) == 5
    assert find_kth_largest(nums, 1) == 6
    assert find_kth_largest(nums, 6) == 1
    
    print("✅ 03 模块双指针与快速选择标准模板自测通过！")
