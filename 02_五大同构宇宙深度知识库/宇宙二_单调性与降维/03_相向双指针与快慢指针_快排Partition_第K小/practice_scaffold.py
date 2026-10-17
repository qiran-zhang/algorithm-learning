"""
03 模块：相向双指针与快慢指针 · 快排 Partition 与第 K 小
【挖空实战脚手架】practice_scaffold.py
请在带有 # TODO 的区域根据提示补全核心逻辑，运行直到终端输出 ✅ 通关提示！
"""

from typing import List

def two_sum_sorted_practice(numbers: List[int], target: int) -> List[int]:
    """
    练习 1：相向对撞双指针求两数和为 target 的下标 (1-based)
    """
    left, right = 0, len(numbers) - 1
    while left < right:
        s = numbers[left] + numbers[right]
        # TODO: 步骤 1：若 s == target，返回 [left + 1, right + 1]
        # TODO: 步骤 2：若 s < target，left 右移
        # TODO: 步骤 3：若 s > target，right 左移
        if s == target:
            return [left + 1, right + 1]
        elif s < target:
            left += 1
        else:
            right -= 1
            
    return []

def partition_practice(arr: List[int], low: int, high: int) -> int:
    """
    练习 2：408 核心快排双向 Partition 轴心切分
    """
    pivot = arr[low]
    i, j = low, high
    while i < j:
        # TODO: 步骤 1：从右向左寻找首个小于 pivot 的数，填入 arr[i]
        while i < j and arr[j] >= pivot:
            j -= 1
        arr[i] = arr[j]
        # TODO: 步骤 2：从左向右寻找首个大于 pivot 的数，填入 arr[j]
        while i < j and arr[i] <= pivot:
            i += 1
        arr[j] = arr[i]
        
    arr[i] = pivot
    return i

if __name__ == "__main__":
    print("正在检验你的 03 挖空练习实现...")
    assert two_sum_sorted_practice([2, 7, 11, 15], 9) == [1, 2]
    
    test_arr = [4, 2, 7, 1, 3]
    p = partition_practice(test_arr, 0, 4)
    # 验证主元左边皆 <= 主元，右边皆 >= 主元
    pivot_val = test_arr[p]
    assert all(x <= pivot_val for x in test_arr[:p])
    assert all(x >= pivot_val for x in test_arr[p+1:])
    
    print("🎉 恭喜！03 双指针与快排 Partition 挖空练习通关！")
