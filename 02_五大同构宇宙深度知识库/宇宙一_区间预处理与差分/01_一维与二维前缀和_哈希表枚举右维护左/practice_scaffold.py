"""
01 模块：一维与二维前缀和 · 哈希表枚举右维护左
【挖空实战脚手架】practice_scaffold.py
请在带有 # TODO 的区域根据提示补全核心逻辑，运行直到终端输出 ✅ 通关提示！
"""

from typing import List
from collections import defaultdict

def query_range_sum_practice(nums: List[int], left: int, right: int) -> int:
    """
    练习 1：构建前缀和数组并查询闭区间 [left, right] 的和
    """
    n = len(nums)
    prefix = [0] * (n + 1)
    # TODO: 步骤 1：遍历 nums 构建 prefix 数组，prefix[i + 1] = prefix[i] + nums[i]
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
        
    # TODO: 步骤 2：返回区间和
    return prefix[right + 1] - prefix[left]

def subarray_sum_k_practice(nums: List[int], k: int) -> int:
    """
    练习 2：哈希表维护前缀和，统计和为 k 的连续子数组数量
    """
    count = 0
    cur_sum = 0
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1
    
    for x in nums:
        cur_sum += x
        # TODO: 步骤 1：如果 (cur_sum - k) 在 prefix_counts 中，累加其频次到 count
        # TODO: 步骤 2：在 prefix_counts 中将 cur_sum 的计数加 1
        if (cur_sum - k) in prefix_counts:
            count += prefix_counts[cur_sum - k]
        prefix_counts[cur_sum] += 1
        
    return count

if __name__ == "__main__":
    print("正在检验你的 01 挖空练习实现...")
    assert query_range_sum_practice([1, 2, 3, 4, 5], 1, 3) == 9
    assert subarray_sum_k_practice([1, 1, 1], 2) == 2
    assert subarray_sum_k_practice([1, 2, 3], 3) == 2 # [1, 2] 和 [3]
    print("🎉 恭喜！01 前缀和与哈希表枚举挖空练习通关！")
