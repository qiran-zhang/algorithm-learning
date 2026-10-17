"""
05 模块：二分查找与红蓝染色二分答案
【挖空实战脚手架】practice_scaffold.py
请在带有 # TODO 的区域根据提示补全核心逻辑，运行直到终端输出 ✅ 通关提示！
"""

from typing import List

def binary_search_practice(nums: List[int], target: int) -> int:
    """
    练习：使用红蓝染色法查找首个 >= target 的元素下标
    """
    left = -1
    right = len(nums)
    
    # TODO: 步骤 1：当 left + 1 != right 时循环
    # TODO: 步骤 2：计算中点 mid = (left + right) // 2
    # TODO: 步骤 3：若 nums[mid] >= target，令 right = mid；否则 left = mid
    while left + 1 != right:
        mid = (left + right) // 2
        if nums[mid] >= target:
            right = mid
        else:
            left = mid
            
    return right

if __name__ == "__main__":
    print("正在检验你的 05 挖空练习实现...")
    arr = [1, 3, 5, 5, 7, 9]
    assert binary_search_practice(arr, 5) == 2
    assert binary_search_practice(arr, 6) == 4
    assert binary_search_practice(arr, 0) == 0
    print("🎉 恭喜！05 红蓝染色二分查找挖空练习通关！")
