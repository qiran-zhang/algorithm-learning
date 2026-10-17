"""
09 模块：并查集 (DSU) 与 Kruskal 最小生成树
【挖空实战脚手架】practice_scaffold.py
请在带有 # TODO 的区域根据提示补全核心逻辑，运行直到终端输出 ✅ 通关提示！
"""

from typing import List

class DSUPractice:
    def __init__(self, n: int):
        self.parent = list(range(n))
        
    def find(self, x: int) -> int:
        """
        练习 1：带路径压缩的 find 递归查找
        """
        # TODO: 步骤 1：若 self.parent[x] != x，递归更新 self.parent[x] = self.find(self.parent[x])
        # TODO: 步骤 2：返回 self.parent[x]
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
        
    def union(self, x: int, y: int) -> bool:
        """
        练习 2：集合合并
        """
        # TODO: 步骤 1：找到 x 和 y 的根节点 rx, ry
        # TODO: 步骤 2：若相同返回 False；若不同则令 self.parent[rx] = ry 并返回 True
        rx = self.find(x)
        ry = self.find(y)
        if rx == ry:
            return False
        self.parent[rx] = ry
        return True

if __name__ == "__main__":
    print("正在检验你的 09 挖空练习实现...")
    dsu = DSUPractice(4)
    assert dsu.union(0, 1) is True
    assert dsu.union(1, 2) is True
    assert dsu.union(0, 2) is False # 已连通
    assert dsu.find(0) == dsu.find(2) # 路径压缩验证
    print("🎉 恭喜！09 并查集路径压缩挖空练习通关！")
