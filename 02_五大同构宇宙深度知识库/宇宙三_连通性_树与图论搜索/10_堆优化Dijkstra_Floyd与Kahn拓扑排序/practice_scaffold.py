"""
10_堆优化Dijkstra_Floyd与Kahn拓扑排序：挖空实战脚手架
请在 TODO 处补齐核心逻辑：
1. 堆优化 Dijkstra 的松弛逻辑与懒惰删除
2. Kahn 拓扑排序的入度减少与入队
"""

import heapq
from collections import deque
from typing import List, Tuple

def solve_dijkstra(n: int, edges: List[Tuple[int, int, int]], src: int) -> List[int]:
    """实战挖空：堆优化 Dijkstra 单源最短路"""
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))
        
    dist = [float('inf')] * n
    dist[src] = 0
    # 优先队列维护 (dist, u)
    pq = [(0, src)]
    
    while pq:
        d, u = heapq.heappop(pq)
        # TODO 1: 懒惰删除判断，若当前距离大于已记录的最短路，跳过
        if d > dist[u]:
            continue
            
        for v, w in adj[u]:
            # TODO 2: 松弛操作：若经过 u 到达 v 的距离更短，更新并入堆
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
                
    return dist

def solve_course_schedule(numCourses: int, prerequisites: List[Tuple[int, int]]) -> bool:
    """实战挖空：力扣 207 课程表（Kahn 算法判环）"""
    adj = [[] for _ in range(numCourses)]
    in_degree = [0] * numCourses
    for dest, src in prerequisites:
        adj[src].append(dest)
        in_degree[dest] += 1
        
    # TODO 3: 将所有入度为 0 的课程推入队列
    q = deque([i for i in range(numCourses) if in_degree[i] == 0])
    count = 0
    
    while q:
        u = q.popleft()
        count += 1
        for v in adj[u]:
            # TODO 4: 减少依赖度，若降为 0 则推入队列
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
                
    return count == numCourses

if __name__ == "__main__":
    edges = [(0, 1, 5), (0, 2, 2), (2, 1, 1)]
    ans = solve_dijkstra(3, edges, 0)
    assert ans == [0, 3, 2], f"Dijkstra scaffold failed: {ans}"
    
    can_finish = solve_course_schedule(2, [(1, 0)])
    assert can_finish is True, "Course schedule failed"
    print("[PASS] 10 模块图论最短路与拓扑排序脚手架验证通过！")
