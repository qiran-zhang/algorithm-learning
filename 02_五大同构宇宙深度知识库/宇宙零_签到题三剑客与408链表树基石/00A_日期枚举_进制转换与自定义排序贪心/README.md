# 00A 模块：日期枚举、进制转换与自定义排序贪心

## 一、算法由来与现实痛点 (Origin & Pain Points)
在蓝桥杯软件赛（Python B/A/C 组）中，前 2–3 道题固定为**填空题或模拟签到题**（占 10–25 分）。这类题目通常以现实生活规则（如：日历星期推算、回文日期、不同进制数位求和、带有权重的排队接水）为背景。
- **痛点**：若手写计算每月天数（大月31天、小月30天、平年28天、闰年29天）极其容易因漏算闰年条件（`year % 4 == 0 and year % 100 != 0 or year % 400 == 0`）而翻车丢分。
- **破局**：Python 内置的 `datetime` 与 `timedelta` 是降维打击神器，可在 2 行内完成任意日期间隔天数与星期迭代！

## 二、算法原理与核心实现 (Intuition & Mechanism)
1. **日期迭代模型**：利用 `datetime.date(y, m, d)` 和步长 `datetime.timedelta(days=1)` 进行自增循环，将日期转化为自然流。
2. **进制转换原理**：
   - 10 进制转 $B$ 进制：除 $B$ 取余，逆序排列；
   - $B$ 进制转 10 进制：按权展开求和，Python 一行流 `int(s, base)`。
3. **自定义排序贪心**：使用 `key=lambda x: ...` 将复杂对象转化为多维排序元组。

## 三、适用范围与题型特征 (Applicability & Triggers)
- **题眼识别**：题目出现“从 2000年1月1日到 2020年10月1日”、“包含多少个星期六”、“各数位在某一进制下之和”；
- **边界防坑**：年份范围在公元后即可直接套用，注意月份为 1–12，日为 1–31。

## 四、算法特点与优劣势 (Characteristics & Complexity)
- **时间复杂度**：通常一年仅 365/366 天，枚举 100 年仅需 $\approx 3.65 \times 10^4$ 次循环，运行耗时不到 0.05 秒。
- **空间复杂度**：$O(1)$ 常数空间。

## 五、快捷标准库与一行流调用 (Standard Libraries)
```python
import datetime

# 1. 计算两个日期的相差天数
d1 = datetime.date(2000, 1, 1)
d2 = datetime.date(2024, 1, 1)
delta_days = (d2 - d1).days

# 2. 星期判定：0 表示周一，6 表示周日
is_sunday = (d1.weekday() == 6)

# 3. 进制转换一行流
bin_str = bin(255)[2:]      # '11111111'
hex_str = hex(255)[2:]      # 'ff'
dec_val = int("1101", 2)    # 13 (二进制转十进制)
```

<details>
<summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

// 408 常见日期平润年天数表
const int DAYS[2][13] = {
    {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31}, // 平年
    {0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31}  // 闰年
};

bool isLeapYear(int year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

// 模拟下一个日期
void nextDate(int &y, int &m, int &d) {
    d++;
    int leap = isLeapYear(y);
    if (d > DAYS[leap][m]) {
        d = 1;
        m++;
        if (m > 12) {
            m = 1;
            y++;
        }
    }
}
```
</details>
