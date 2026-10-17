"""
10_堆优化Dijkstra_Floyd与Kahn拓扑排序：标准工程模板
涵盖三大算法：
1. 堆优化 Dijkstra 单源最短路
2. Floyd-Warshall 全源最短路
3. Kahn 算法拓扑排序与判环
"""

import heapq
from collections import deque
from typing import List, Tuple

def dijkstra_shortest_path(n: int, edges: List[Tuple[int, int, int]], src: int) -> List[int]:
    """堆优化 Dijkstra：求解从 src 到各节点的最短路径
    edges: (u, v, weight)，节点编号 0 ~ n-1
    """
    # 建邻接表
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))  # 无向图双向加边，若有向图只需一条
        
    dist = [float('inf')] * n
    dist[src] = 0
    # 小根堆存储 (当前距离, 节点编号)
    pq = [(0, src)]
    
    while pq:
        d, u = heapq.heappop(pq)
        # 懒惰删除：若出堆距离已大于记录的最短路，直接跳过
        if d > dist[u]:
            continue
            
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
                
    return dist

def floyd_warshall(n: int, edges: List[Tuple[int, int, int]]) -> List[List[float]]:
    """Floyd 全源最短路：求任意两点间距离"""
    INF = float('inf')
    dp = [[INF] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 0
        
    for u, v, w in edges:
        dp[u][v] = min(dp[u][v], w)
        dp[v][u] = min(dp[v][u], w)
        
    # 三重循环：中转点 k 必须在外层！
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dp[i][k] + dp[k][j] < dp[i][j]:
                    dp[i][j] = dp[i][k] + dp[k][j]
                    
    return dp

def kahn_topological_sort(n: int, edges: List[Tuple[int, int]]) -> Tuple[bool, List[int]]:
    """Kahn 算法拓扑排序与判环 (edges: u -> v)
    返回值: (是否为有向无环图 DAG, 拓扑序列)
    """
    adj = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1
        
    # 入度为 0 的节点首先入队
    q = deque([i for i in range(n) if in_degree[i] == 0])
    order = []
    
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
                
    # 若出队节点数等于总节点数，说明不存在环
    is_dag = (len(order) == n)
    return is_dag, order

if __name__ == "__main__":
    # 1. 验证 Dijkstra
    test_edges = [(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)]
    d_ans = dijkstra_shortest_path(4, test_edges, 0)
    # 到 0: 0, 到 1: 3, 到 2: 1, 到 3: 4
    assert d_ans == [0, 3, 1, 4], f"Dijkstra error: {d_ans}"
    
    # 2. 验证 Floyd
    f_ans = floyd_warshall(4, test_edges)
    assert f_ans[0][3] == 4, f"Floyd error: {f_ans[0][3]}"
    
    # 3. 验证 Kahn 拓扑排序 (0 -> 1 -> 2, 0 -> 2)
    dag_edges = [(0, 1), (1, 2), (0, 2)]
    is_dag, topo = kahn_topological_sort(3, dag_edges)
    assert is_dag is True and topo == [0, 1, 2], f"Topo error: {topo}"
    
    # 验证带环图判环
    cycle_edges = [(0, 1), (1, 2), (2, 0)]
    is_cycle_dag, _ = kahn_topological_sort(3, cycle_edges)
    assert is_cycle_dag is False, "Cycle detection failed"
    
    print("[PASS] 10 模块 Dijkstra、Floyd 与 Kahn 拓扑排序标准模板验证通过！")
