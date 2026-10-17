"""
02 模块：一维与二维差分数组
【挖空实战脚手架】practice_scaffold.py
请在带有 # TODO 的区域根据提示补全核心逻辑，运行直到终端输出 ✅ 通关提示！
"""

from typing import List

def range_add_and_restore_practice(n: int, updates: List[List[int]]) -> List[int]:
    """
    练习：利用差分数组处理多轮区间加法并还原最终数组
    updates: [left, right, val] (0-indexed)
    """
    diff = [0] * (n + 1)
    
    # 步骤 1：处理每次区间修改
    for l, r, val in updates:
        # TODO: diff[l] 增加 val
        # TODO: 若 r + 1 < len(diff)，diff[r + 1] 减去 val
        diff[l] += val
        if r + 1 < len(diff):
            diff[r + 1] -= val
            
    # 步骤 2：前缀和还原出原始长度为 n 的数组
    res = [0] * n
    cur = 0
    for i in range(n):
        # TODO: cur 累加 diff[i]，存入 res[i]
        cur += diff[i]
        res[i] = cur
        
    return res

if __name__ == "__main__":
    print("正在检验你的 02 挖空练习实现...")
    # 对长度为 5 的全 0 数组执行：[0, 2] 加 10，[1, 3] 加 5
    updates = [[0, 2, 10], [1, 3, 5]]
    out = range_add_and_restore_practice(5, updates)
    assert out == [10, 15, 15, 5, 0], f"预期 [10, 15, 15, 5, 0]，实际输出 {out}"
    print("🎉 恭喜！02 差分数组挖空练习通关！区间修改神功已成！")
