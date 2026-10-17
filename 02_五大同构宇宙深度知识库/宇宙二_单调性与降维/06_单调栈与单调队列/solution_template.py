"""
06 模块：单调栈与单调队列
标准解题模板 (带自测断言，支持直接 Run)
"""

from typing import List
from collections import deque

def next_greater_elements(nums: List[int]) -> List[int]:
    """
    单调栈：求数组中每个元素右边第一个严格大于它的元素值，若不存在返回 -1
    时间复杂度 O(N)，空间复杂度 O(N)
    """
    n = len(nums)
    res = [-1] * n
    stack = [] # 存储下标，保持栈内对应元素单调递减
    
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            prev_idx = stack.pop()
            res[prev_idx] = x
        stack.append(i)
        
    return res

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    """
    LeetCode 239. 滑动窗口最大值 (单调队列)
    时间复杂度 O(N)，空间复杂度 O(K)
    """
    if not nums or k <= 0:
        return []
    res = []
    q = deque() # 存储下标，保持队列内元素数值严格单调递减
    
    for i, x in enumerate(nums):
        # 1. 淘汰队尾所有 <= 当前值 x 的元素
        while q and nums[q[-1]] <= x:
            q.pop()
        q.append(i)
        
        # 2. 检查队首元素是否已过期超出窗口 [i - k + 1, i]
        if q[0] <= i - k:
            q.popleft()
            
        # 3. 当窗口成型后，队首即为最大值
        if i >= k - 1:
            res.append(nums[q[0]])
            
    return res

if __name__ == "__main__":
    # 验证单调栈
    nums = [2, 1, 2, 4, 3]
    ans1 = next_greater_elements(nums)
    assert ans1 == [4, 2, 4, -1, -1]
    
    # 验证单调队列
    arr = [1, 3, -1, -3, 5, 3, 6, 7]
    ans2 = max_sliding_window(arr, 3)
    assert ans2 == [3, 3, 5, 5, 6, 7]
    
    print("✅ 06 模块单调栈与单调队列标准模板全部用例自测通过！")
