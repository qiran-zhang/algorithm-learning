"""
06 模块：单调栈与单调队列
【挖空实战脚手架】practice_scaffold.py
请在带有 # TODO 的区域根据提示补全核心逻辑，运行直到终端输出 ✅ 通关提示！
"""

from typing import List

def next_greater_practice(nums: List[int]) -> List[int]:
    """
    练习：利用单调栈求每个元素右边首个更大元素
    """
    n = len(nums)
    res = [-1] * n
    stack = []
    
    for i, x in enumerate(nums):
        # TODO: 步骤 1：当栈非空且 nums[stack[-1]] < x 时，弹出栈顶下标 idx 并记录 res[idx] = x
        while stack and nums[stack[-1]] < x:
            prev_idx = stack.pop()
            res[prev_idx] = x
        # TODO: 步骤 2：将当前下标 i 压入栈中
        stack.append(i)
        
    return res

if __name__ == "__main__":
    print("正在检验你的 06 挖空练习实现...")
    out = next_greater_practice([2, 1, 2, 4, 3])
    assert out == [4, 2, 4, -1, -1]
    print("🎉 恭喜！06 单调栈挖空练习通关！")
