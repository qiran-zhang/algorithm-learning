"""
07_DFS回溯三大模型与四大剪枝：标准工程模板
涵盖三大经典模型：
1. 子集生成 (选或不选 / 遍历选支)
2. 组合总和 (带重复元素去重剪枝)
3. 全排列 (used 标记与恢复现场)
"""

import sys
from typing import List

# 提高递归深度上限
sys.setrecursionlimit(300000)

def subsets(nums: List[int]) -> List[List[int]]:
    """子集模型：求所有子集（LeetCode 78）"""
    res = []
    path = []
    
    def dfs(start: int):
        # 收集当前节点对应的子集
        res.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            dfs(i + 1)
            path.pop()  # 撤销选择
            
    dfs(0)
    return res

def combination_sum_unique(candidates: List[int], target: int) -> List[List[int]]:
    """组合模型带剪枝：求总和等于 target 的不重复组合（LeetCode 40）"""
    candidates.sort()  # 排序是同层去重与可行性剪枝的前提
    res = []
    path = []
    
    def dfs(start: int, remain: int):
        if remain == 0:
            res.append(list(path))
            return
            
        for i in range(start, len(candidates)):
            # 1. 可行性剪枝：当前数值已大于剩余目标值
            if candidates[i] > remain:
                break
            # 2. 重复性剪枝：同层相同数值跳过，防止解重复
            if i > start and candidates[i] == candidates[i - 1]:
                continue
                
            path.append(candidates[i])
            dfs(i + 1, remain - candidates[i])
            path.pop()  # 撤销现场
            
    dfs(0, target)
    return res

def permute(nums: List[int]) -> List[List[int]]:
    """排列模型：全排列（LeetCode 46）"""
    res = []
    path = []
    used = [False] * len(nums)
    
    def dfs():
        if len(path) == len(nums):
            res.append(list(path))
            return
            
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            dfs()
            path.pop()  # 回溯
            used[i] = False
            
    dfs()
    return res

if __name__ == "__main__":
    # 验证子集
    s_res = subsets([1, 2, 3])
    assert len(s_res) == 8, f"Subsets error: {len(s_res)}"
    
    # 验证去重组合
    c_res = combination_sum_unique([10, 1, 2, 7, 6, 1, 5], 8)
    # 应包含 [1,1,6], [1,2,5], [1,7], [2,6]
    assert len(c_res) == 4, f"Combination sum error: {c_res}"
    
    # 验证全排列
    p_res = permute([1, 2, 3])
    assert len(p_res) == 6, f"Permute error: {len(p_res)}"
    
    print("[PASS] 07 模块 DFS 回溯三大模型与剪枝标准模板全部验证通过！")
