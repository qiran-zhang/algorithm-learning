"""
07_DFS回溯三大模型与四大剪枝：挖空实战脚手架
请在 TODO 处补齐关键逻辑（做出选择、递归推进、撤销恢复现场与剪枝判断）。
"""

from typing import List

def solve_subsets(nums: List[int]) -> List[List[int]]:
    """请补齐子集型 DFS 回溯的核心代码"""
    res = []
    path = []
    
    def dfs(start: int):
        res.append(list(path))
        for i in range(start, len(nums)):
            # TODO 1: 做出选择，将 nums[i] 加入 path
            path.append(nums[i])
            # TODO 2: 递归进入下一层
            dfs(i + 1)
            # TODO 3: 撤销选择（恢复现场）
            path.pop()
            
    dfs(0)
    return res

def solve_permute(nums: List[int]) -> List[List[int]]:
    """请补齐全排列型 DFS 回溯的核心代码"""
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
            # TODO 4: 标记 used 并加入 path
            used[i] = True
            path.append(nums[i])
            dfs()
            # TODO 5: 撤销状态
            path.pop()
            used[i] = False
            
    dfs()
    return res

if __name__ == "__main__":
    s_ans = solve_subsets([1, 2, 3])
    assert len(s_ans) == 8, f"Subsets fail: {len(s_ans)}"
    
    p_ans = solve_permute([1, 2, 3])
    assert len(p_ans) == 6, f"Permute fail: {len(p_ans)}"
    print("[PASS] 07 模块 DFS 回溯实战脚手架验证通过！")
