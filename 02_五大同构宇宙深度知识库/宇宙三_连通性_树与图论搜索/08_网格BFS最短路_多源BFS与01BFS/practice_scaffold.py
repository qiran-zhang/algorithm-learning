"""
08_网格BFS最短路_多源BFS与01BFS：挖空实战脚手架
请在 TODO 处补齐核心逻辑：
1. 方向移动与边界安全检查
2. 距离更新与队列入队操作
"""

from collections import deque
from typing import List, Tuple

def solve_maze_steps(grid: List[List[int]], start: Tuple[int, int], end: Tuple[int, int]) -> int:
    """实战挖空：网格迷宫单源最短路"""
    R, C = len(grid), len(grid[0])
    sr, sc = start
    er, ec = end
    
    if grid[sr][sc] == 1 or grid[er][ec] == 1:
        return -1
    if start == end:
        return 0
        
    dist = [[-1] * C for _ in range(R)]
    dist[sr][sc] = 0
    # TODO 1: 初始化 deque 并推入起点
    q = deque([(sr, sc)])
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while q:
        r, c = q.popleft()
        if (r, c) == (er, ec):
            return dist[r][c]
            
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            # TODO 2: 检查边界、非障碍物、且未被访问 (dist == -1)
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 0 and dist[nr][nc] == -1:
                # TODO 3: 更新距离并入队
                dist[nr][nc] = dist[r][c] + 1
                q.append((nr, nc))
                
    return -1

if __name__ == "__main__":
    test_grid = [
        [0, 0, 1],
        [1, 0, 0],
        [0, 0, 0]
    ]
    ans = solve_maze_steps(test_grid, (0, 0), (2, 2))
    assert ans == 4, f"BFS scaffold failed, got {ans}"
    print("[PASS] 08 模块 BFS 迷宫实战脚手架验证通过！")
