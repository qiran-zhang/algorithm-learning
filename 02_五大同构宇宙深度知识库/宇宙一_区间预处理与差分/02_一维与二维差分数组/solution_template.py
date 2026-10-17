"""
02 模块：一维与二维差分数组
标准解题模板 (带自测断言，支持直接 Run)
"""

from typing import List

class Difference1D:
    """一维差分数组：O(1) 区间修改，O(N) 还原数组"""
    def __init__(self, n: int):
        self.n = n
        self.diff = [0] * (n + 1)
        
    def add(self, left: int, right: int, val: int) -> None:
        """闭区间 [left, right] 加上 val"""
        self.diff[left] += val
        if right + 1 < len(self.diff):
            self.diff[right + 1] -= val
            
    def build(self) -> List[int]:
        """求前缀和还原最终数组"""
        res = [0] * self.n
        cur = 0
        for i in range(self.n):
            cur += self.diff[i]
            res[i] = cur
        return res

class Difference2D:
    """二维差分数组：O(1) 矩形区域修改，O(M*N) 还原矩阵"""
    def __init__(self, m: int, n: int):
        self.m = m
        self.n = n
        self.diff = [[0] * (n + 2) for _ in range(m + 2)]
        
    def add(self, r1: int, c1: int, r2: int, c2: int, val: int) -> None:
        """左上角 (r1, c1) 到右下角 (r2, c2) 的矩形区域加上 val (1-based)"""
        self.diff[r1][c1] += val
        self.diff[r1][c2 + 1] -= val
        self.diff[r2 + 1][c1] -= val
        self.diff[r2 + 1][c2 + 1] += val
        
    def build(self) -> List[List[int]]:
        """二维前缀和还原出原矩阵"""
        res = [[0] * (self.n + 1) for _ in range(self.m + 1)]
        for i in range(1, self.m + 1):
            for j in range(1, self.n + 1):
                res[i][j] = (
                    res[i - 1][j]
                    + res[i][j - 1]
                    - res[i - 1][j - 1]
                    + self.diff[i][j]
                )
        # 去除 0 索引哨兵
        return [row[1:self.n + 1] for row in res[1:self.m + 1]]

def corp_flight_bookings(bookings: List[List[int]], n: int) -> List[int]:
    """
    LeetCode 1109. 航班预订统计
    bookings: [first, last, seats] (1-indexed)
    """
    diff = Difference1D(n)
    for first, last, seats in bookings:
        diff.add(first - 1, last - 1, seats)
    return diff.build()

if __name__ == "__main__":
    # 验证一维差分
    bookings = [[1, 2, 10], [2, 3, 20], [2, 5, 25]]
    n = 5
    ans = corp_flight_bookings(bookings, n)
    assert ans == [10, 55, 45, 25, 25]
    
    # 验证二维差分 (地毯问题)
    d2 = Difference2D(3, 3)
    d2.add(1, 1, 2, 2, 1) # 在 (1,1) 到 (2,2) 铺一层地毯
    mat = d2.build()
    expected = [
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 0]
    ]
    assert mat == expected
    
    print("✅ 02 模块差分数组标准模板自测通过！")
