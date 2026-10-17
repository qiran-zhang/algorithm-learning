"""
09 模块：并查集 (DSU) 与 Kruskal 最小生成树
标准解题模板 (带自测断言，支持直接 Run)
"""

from typing import List, Tuple

class DSU:
    """
    并查集模板：路径压缩 + 按秩合并
    单次查询/合并均摊时间复杂度 O(alpha(N))
    """
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [1] * n
        self.components_count = n
        
    def find(self, x: int) -> int:
        """查找根节点并扁平化路径压缩"""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
        
    def union(self, x: int, y: int) -> bool:
        """合并两个集合，若已在同一集合返回 False"""
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False
            
        # 按秩合并：矮树挂高树
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
            
        self.components_count -= 1
        return True
        
    def is_connected(self, x: int, y: int) -> bool:
        return self.find(x) == self.find(y)

def kruskal_mst(n: int, edges: List[Tuple[int, int, int]]) -> Tuple[int, List[Tuple[int, int, int]]]:
    """
    Kruskal 最小生成树算法
    edges: [(u, v, weight), ...] (0-indexed)
    返回: (最小生成树总权值, 选中的边集合)；若图不连通返回 (-1, [])
    """
    # 贪心第一步：按边权升序排序
    sorted_edges = sorted(edges, key=lambda e: e[2])
    dsu = DSU(n)
    mst_weight = 0
    mst_edges = []
    
    for u, v, w in sorted_edges:
        if dsu.union(u, v):
            mst_weight += w
            mst_edges.append((u, v, w))
            if len(mst_edges) == n - 1:
                break
                
    if len(mst_edges) == n - 1:
        return mst_weight, mst_edges
    return -1, []

if __name__ == "__main__":
    # 验证并查集连通性
    dsu = DSU(5)
    assert not dsu.is_connected(0, 1)
    dsu.union(0, 1)
    dsu.union(1, 2)
    assert dsu.is_connected(0, 2)
    assert dsu.components_count == 3
    
    # 验证 Kruskal 最小生成树
    # 4 个顶点，边权如下
    edges = [
        (0, 1, 1),
        (1, 2, 2),
        (0, 2, 3),
        (2, 3, 4),
        (1, 3, 5)
    ]
    weight, chosen_edges = kruskal_mst(4, edges)
    assert weight == 7 # 边 1 + 2 + 4 = 7
    assert len(chosen_edges) == 3
    
    print("✅ 09 模块并查集与 Kruskal 最小生成树标准模板自测通过！")
