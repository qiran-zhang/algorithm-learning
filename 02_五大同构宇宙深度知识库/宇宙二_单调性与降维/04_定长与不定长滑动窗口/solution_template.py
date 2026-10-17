"""
04 模块：定长与不定长滑动窗口
标准解题模板 (带自测断言，支持直接 Run)
"""

from typing import List
from collections import defaultdict

def max_sum_fixed_window(nums: List[int], k: int) -> int:
    """
    定长滑动窗口：求长度为 k 的连续子数组的最大和
    时间复杂度 O(N)，空间复杂度 O(1)
    """
    if len(nums) < k or k <= 0:
        return 0
    cur_sum = sum(nums[:k])
    max_sum = cur_sum
    for i in range(k, len(nums)):
        cur_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, cur_sum)
    return max_sum

def length_of_longest_substring(s: str) -> int:
    """
    LeetCode 3: 无重复字符的最长子串 (不定长滑动窗口)
    时间复杂度 O(N)，空间复杂度 O(min(N, Sigma))
    """
    last_seen = {}
    max_len = 0
    left = 0
    
    for right, char in enumerate(s):
        # 若字符在窗口内已出现过，将左边界直接跳跃至其上一次出现位置的下一位
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len

def min_subarray_len_target(target: int, nums: List[int]) -> int:
    """
    LeetCode 209: 和 >= target 的最短连续子数组长度
    时间复杂度 O(N)，空间复杂度 O(1)
    """
    left = 0
    cur_sum = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        cur_sum += nums[right]
        while cur_sum >= target:
            min_len = min(min_len, right - left + 1)
            cur_sum -= nums[left]
            left += 1
            
    return int(min_len) if min_len != float('inf') else 0

if __name__ == "__main__":
    # 验证定长滑窗
    assert max_sum_fixed_window([1, 4, 2, 10, 23, 3, 1, 0, 20], 4) == 39 # 4+2+10+23
    
    # 验证无重复字符最长子串
    assert length_of_longest_substring("abcabcbb") == 3
    assert length_of_longest_substring("bbbbb") == 1
    assert length_of_longest_substring("pwwkew") == 3
    
    # 验证和 >= target 最短子数组
    assert min_subarray_len_target(7, [2, 3, 1, 2, 4, 3]) == 2 # [4, 3]
    
    print("✅ 04 模块滑动窗口标准模板全部用例自测通过！")
