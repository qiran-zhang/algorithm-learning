"""
stress_tester.py
================
20 行考场防爆核武器：自动化对拍器 (Stress Tester / Duipai)
用于：
1. 用随机数据生成器生成几百组小规模输入
2. 分别运行你的【快速优化解】与【绝不会错的暴力朴素解】
3. 自动对比两者的输出，只要有 1 组不一致立刻停下打印导致错误的最小反例输入！
4. 彻底解决考场上“不知道哪里写挂了”的核心痛点！
"""

import random
import time
from typing import Callable, Any

def random_array(n: int, min_val: int = -100, max_val: int = 100) -> list[int]:
    """生成长度为 n 的随机整型数组"""
    return [random.randint(min_val, max_val) for _ in range(n)]

def brute_force_solution(arr: list[int]) -> int:
    """
    暴力标程：求最大子数组和 (O(N^2) 绝对不会写错的暴力两重循环)
    """
    n = len(arr)
    if n == 0:
        return 0
    max_sum = -float('inf')
    for i in range(n):
        cur = 0
        for j in range(i, n):
            cur += arr[j]
            if cur > max_sum:
                max_sum = cur
    return int(max_sum)

def optimized_solution(arr: list[int]) -> int:
    """
    待测优化解：Kadane 动态规划 (O(N) 线性高效解法)
    """
    if not arr:
        return 0
    max_sum = -float('inf')
    cur = 0
    for x in arr:
        cur = max(x, cur + x)
        max_sum = max(max_sum, cur)
    return int(max_sum)

def run_stress_test(num_trials: int = 200) -> bool:
    """运行自动化对拍"""
    print(f"🚀 开始执行考场自动对拍器 (共 {num_trials} 组随机用例测试)...")
    start_time = time.time()
    
    for i in range(1, num_trials + 1):
        # 随机生成长度 1 到 50 的测试数组
        length = random.randint(1, 50)
        test_data = random_array(length, -1000, 1000)
        
        expected = brute_force_solution(test_data)
        actual = optimized_solution(test_data)
        
        if expected != actual:
            print("\n❌ 发现测试不匹配！已成功拦截隐藏 Bug：")
            print(f"【导致错误的测试输入数据】：{test_data}")
            print(f"【暴力标程预期输出】：{expected}")
            print(f"【你的优化代码实际输出】：{actual}")
            return False
            
        if i % 50 == 0:
            print(f"  已成功通过 {i}/{num_trials} 组高压对拍测试...")
            
    elapsed = time.time() - start_time
    print(f"✅ 全部 {num_trials} 组高压随机对拍测试 100% 匹配！耗时 {elapsed:.2f}s。优化解健壮无懈可击！")
    return True

if __name__ == "__main__":
    success = run_stress_test(200)
    assert success, "对拍发现不一致！"
