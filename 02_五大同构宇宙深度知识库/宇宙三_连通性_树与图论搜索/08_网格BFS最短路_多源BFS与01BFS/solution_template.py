"""
08_网格BFS最短路_多源BFS与01BFS：标准工程模板
涵盖三大经典应用：
1. 标准网格迷宫单源最短路
2. 多源 BFS（腐烂橘子多扩散源模型）
3. 0-1 BFS 双端队列最短路
"""

from collections import deque
from typing import List, Tuple

def shortest_path_maze(grid: List[List[int]], start: Tuple[int, int], end: Tuple[int, int]) -> int:
    """网格迷宫单源最短路（0 表示空地，1 表示障碍物）"""
    R, C = len(grid), len(grid[0])
    sr, sc = start
    er, ec = end
    
    if grid[sr][sc] == 1 or grid[er][ec] == 1:
        return -1
    if start == end:
        return 0
        
    dist = [[-1] * C for _ in range(R)]
    dist[sr][sc] = 0
    q = deque([(sr, sc)])
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while q:
        r, c = q.popleft()
        if (r, c) == (er, ec):
            return dist[r][c]
            
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 0 and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                q.append((nr, nc))  # 入队即标记
                
    return -1

def oranges_rotting(grid: List[List[int]]) -> int:
    """多源 BFS：腐烂橘子（LeetCode 994）
    0: 空单元格, 1: 新鲜橘子, 2: 腐烂橘子
    """
    R, C = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    
    # 步骤 1：多源初始化，所有腐烂橘子同时入队
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 2:
                q.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1
                
    if fresh == 0:
        return 0
        
    minutes = 0
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    # 步骤 2：按分钟层序扩散
    while q and fresh > 0:
        minutes += 1
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
                    
    return minutes if fresh == 0 else -1

def zero_one_bfs(graph: List[List[Tuple[int, int]]], start: int, n: int) -> List[int]:
    """0-1 BFS：边权仅为 0 和 1 的图单源最短路
    graph[u] 存放 (v, weight)，weight 为 0 或 1
    """
    dist = [float('inf')] * n
    dist[start] = 0
    q = deque([start])
    
    while q:
        u = q.popleft()
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if w == 0:
                    q.appendleft(v)  # 边权为0入队头
                else:
                    q.append(v)      # 边权为1入队尾
                    
    return dist

if __name__ == "__main__":
    # 1. 验证迷宫最短路
    maze = [
        [0, 0, 0, 0],
        [1, 1, 0, 1],
        [0, 0, 0, 0],
        [0, 1, 1, 0]
    ]
    ans_maze = shortest_path_maze(maze, (0, 0), (3, 3))
    assert ans_maze == 6, f"Maze path error: {ans_maze}"
    
    # 2. 验证多源腐烂橘子
    oranges = [
        [2, 1, 1],
        [1, 1, 0],
        [0, 1, 1]
    ]
    ans_rot = oranges_rotting(oranges)
    assert ans_rot == 4, f"Rotting error: {ans_rot}"
    
    print("[PASS] 08 模块网格与多源 BFS 标准模板验证通过！")
