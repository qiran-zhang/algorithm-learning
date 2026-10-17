"""
00A 模块：日期枚举、进制转换与自定义排序贪心
标准解题模板 (带自测断言，支持直接 Run)
"""

import datetime
from typing import List, Tuple

def count_special_days(start_year: int, end_year: int, target_weekday: int = 0) -> int:
    """
    统计指定年份范围内特定星期几（0为周一，6为周日）的总天数
    蓝桥杯常见母题：求 2000 到 2020 年共有多少个周一
    """
    start_date = datetime.date(start_year, 1, 1)
    end_date = datetime.date(end_year, 12, 31)
    delta = datetime.timedelta(days=1)
    
    count = 0
    cur = start_date
    while cur <= end_date:
        if cur.weekday() == target_weekday:
            count += 1
        cur += delta
    return count

def base_conversion(num: int, base: int) -> str:
    """
    将十进制非负整数转化为任意 2-16 进制字符串
    """
    if num == 0:
        return "0"
    digits = "0123456789ABCDEF"
    res = []
    n = num
    while n > 0:
        res.append(digits[n % base])
        n //= base
    return "".join(reversed(res))

def sort_intervals_greedy(intervals: List[List[int]]) -> List[List[int]]:
    """
    区间调度贪心：按右端点升序排序，选择尽可能多的互不重叠区间
    """
    if not intervals:
        return []
    # 按照右端点升序排列
    sorted_intervals = sorted(intervals, key=lambda x: x[1])
    res = [sorted_intervals[0]]
    for cur in sorted_intervals[1:]:
        if cur[0] >= res[-1][1]:
            res.append(cur)
    return res

if __name__ == "__main__":
    # 测试日期枚举：2000年到2000年共有多少个周日 (weekday=6)
    sundays_2000 = count_special_days(2000, 2000, target_weekday=6)
    assert sundays_2000 == 53, f"Expected 53, got {sundays_2000}"
    
    # 测试进制转换
    assert base_conversion(255, 16) == "FF"
    assert base_conversion(13, 2) == "1101"
    assert int("1101", 2) == 13
    
    # 测试区间贪心
    test_intervals = [[1, 4], [2, 3], [3, 5], [4, 6]]
    chosen = sort_intervals_greedy(test_intervals)
    # 最优选择为 [2, 3], [3, 5] 或其他无重叠方案
    assert len(chosen) == 2
    
    print("✅ 00A 模块标准模板全部用例自测通过！")
