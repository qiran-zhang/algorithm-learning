"""
01 模块：一维与二维前缀和 · 哈希表枚举右维护左
标准解题模板 (带自测断言，支持直接 Run)
"""

from typing import List
from collections import defaultdict

class PrefixSum1D:
    """一维前缀和类 (O(1) 区间求和)"""
    def __init__(self, nums: List[int]):
        self.prefix = [0] * (len(nums) + 1)
        for i in range(len(nums)):
            self.prefix[i + 1] = self.prefix[i] + nums[i]
            
    def query(self, left: int, right: int) -> int:
        """闭区间 [left, right] 的求和"""
        return self.prefix[right + 1] - self.prefix[left]

class PrefixSum2D:
    """二维前缀和类 (O(1) 矩形区域求和)"""
    def __init__(self, matrix: List[List[int]]):
        if not matrix or not matrix[0]:
            self.s = [[0]]
            return
        m, n = len(matrix), len(matrix[0])
        self.s = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m):
            for j in range(n):
                self.s[i + 1][j + 1] = (
                    self.s[i][j + 1] + self.s[i + 1][j] - self.s[i][j] + matrix[i][j]
                )
                
    def query(self, r1: int, c1: int, r2: int, c2: int) -> int:
        """左上角 (r1, c1) 到右下角 (r2, c2) 的子矩形元素和"""
        return (
            self.s[r2 + 1][c2 + 1]
            - self.s[r1][c2 + 1]
            - self.s[r2 + 1][c1]
            + self.s[r1][c1]
        )

def subarray_sum_equals_k(nums: List[int], k: int) -> int:
    """
    LeetCode 560: 和为 K 的子数组总个数 (前缀和 + 哈希表枚举右维护左)
    时间复杂度 O(N)，空间复杂度 O(N)
    """
    count = 0
    cur_sum = 0
    # prefix_counts[s] 记录前缀和为 s 的出现次数，预置 0: 1 处理从下标 0 开始的子数组
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1
    
    for x in nums:
        cur_sum += x
        # 若存在历史前缀和等于 cur_sum - k，则说明中间子数组和为 k
        if (cur_sum - k) in prefix_counts:
            count += prefix_counts[cur_sum - k]
        prefix_counts[cur_sum] += 1
        
    return count

if __name__ == "__main__":
    # 验证一维前缀和
    ps1 = PrefixSum1D([1, 2, 3, 4, 5])
    assert ps1.query(1, 3) == 9  # 2 + 3 + 4 = 9
    assert ps1.query(0, 4) == 15
    
    # 验证二维前缀和
    mat = [
        [3, 0, 1, 4, 2],
        [5, 6, 3, 2, 1],
        [1, 2, 0, 1, 5],
        [4, 1, 0, 1, 7]
    ]
    ps2 = PrefixSum2D(mat)
    assert ps2.query(2, 1, 3, 3) == 5 # 2+0+1 + 1+0+1 = 5
    
    # 验证哈希表前缀和：和为 K 的子数组
    nums = [1, 1, 1]
    assert subarray_sum_equals_k(nums, 2) == 2
    assert subarray_sum_equals_k([1, -1, 0], 0) == 3
    
    print("✅ 01 模块标准模板全部用例自测通过！")
