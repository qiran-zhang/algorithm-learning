"""
00A 模块：日期枚举、进制转换与自定义排序贪心
【挖空实战脚手架】practice_scaffold.py
请在带有 # TODO 的区域根据提示补全核心逻辑，运行直到终端输出 ✅ 通关提示！
"""

import datetime
from typing import List

def count_special_days_practice(start_year: int, end_year: int, target_weekday: int = 0) -> int:
    """
    练习 1：统计指定年份范围内特定星期几（0为周一，6为周日）的总天数
    """
    start_date = datetime.date(start_year, 1, 1)
    end_date = datetime.date(end_year, 12, 31)
    delta = datetime.timedelta(days=1)
    
    count = 0
    cur = start_date
    while cur <= end_date:
        # TODO: 步骤 1：判断当前日期 cur 的星期是否为 target_weekday，若是则 count 加 1
        # TODO: 步骤 2：将 cur 日期向前递增一天 delta
        # 请在下方补齐 3-4 行核心代码：
        if cur.weekday() == target_weekday:
            count += 1
        cur += delta
        
    return count

def base_conversion_practice(num: int, base: int) -> str:
    """
    练习 2：非负整数的进制转换
    """
    if num == 0:
        return "0"
    digits = "0123456789ABCDEF"
    res = []
    n = num
    while n > 0:
        # TODO: 步骤 1：取余数 digits[n % base] 添加至 res
        # TODO: 步骤 2：n 整除 base
        res.append(digits[n % base])
        n //= base
        
    return "".join(reversed(res))

if __name__ == "__main__":
    print("正在检验你的 00A 挖空练习实现...")
    ans1 = count_special_days_practice(2000, 2000, target_weekday=6)
    assert ans1 == 53, f"预期 53，实际返回 {ans1}"
    
    ans2 = base_conversion_practice(255, 16)
    assert ans2 == "FF", f"预期 FF，实际返回 {ans2}"
    
    print("🎉 恭喜！00A 挖空实战通关！手感激活完毕！")
