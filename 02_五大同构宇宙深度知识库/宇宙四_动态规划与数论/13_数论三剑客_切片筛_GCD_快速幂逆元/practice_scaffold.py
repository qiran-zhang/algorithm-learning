"""
13_数论三剑客_切片筛_GCD_快速幂逆元：挖空实战脚手架
请在 TODO 处补齐关键逻辑：
1. 切片筛选素数步长填充
2. 二进制快速幂位运算累乘
"""

from typing import List

def solve_sieve_primes(n: int) -> List[int]:
    """实战挖空：极速筛选素数"""
    if n < 2:
        return []
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    limit = int(n**0.5)
    for p in range(2, limit + 1):
        if is_prime[p]:
            # TODO 1: 使用切片语法将 p 的倍数全标为 False
            is_prime[p * p : n + 1 : p] = [False] * len(is_prime[p * p : n + 1 : p])
            
    return [i for i, prime in enumerate(is_prime) if prime]

def solve_quick_pow(base: int, exp: int, mod: int) -> int:
    """实战挖空：手写二进制快速幂"""
    res = 1
    base %= mod
    while exp > 0:
        # TODO 2: 若最低二进制位为 1，将当前底数累乘至结果中
        if exp & 1:
            res = (res * base) % mod
        # TODO 3: 底数自乘平方，指数右移 1 位
        base = (base * base) % mod
        exp >>= 1
        
    return res

if __name__ == "__main__":
    p_ans = solve_sieve_primes(20)
    assert p_ans == [2, 3, 5, 7, 11, 13, 17, 19], f"Prime scaffold fail: {p_ans}"
    
    pow_ans = solve_quick_pow(3, 5, 1000)
    assert pow_ans == 243, f"Pow scaffold fail: {pow_ans}"
    print("[PASS] 13 模块数论切片筛与快速幂脚手架验证通过！")
