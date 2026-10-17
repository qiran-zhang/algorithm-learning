"""
13_数论三剑客_切片筛_GCD_快速幂逆元：标准工程模板
涵盖核心模块：
1. Python 切片极速埃氏筛（0.2s 筛千万质数）
2. 快速幂与二进制幂取模
3. 费马小定理求逆元与大数组合数 C(n, k) % mod
"""

import math
from typing import List

def sieve_primes_slice(n: int) -> List[int]:
    """Python 切片极速埃氏筛：获取 <= n 的所有质数"""
    if n < 2:
        return []
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    # 埃氏筛仅需筛选到 sqrt(n)
    limit = int(n**0.5)
    for p in range(2, limit + 1):
        if is_prime[p]:
            # Python 切片批量赋值，由 C 底层极速执行
            is_prime[p * p : n + 1 : p] = [False] * len(is_prime[p * p : n + 1 : p])
            
    return [i for i, prime in enumerate(is_prime) if prime]

def quick_pow(base: int, exp: int, mod: int) -> int:
    """手写二进制快速幂 (base^exp) % mod"""
    res = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            res = (res * base) % mod
        base = (base * base) % mod
        exp >>= 1
    return res

def mod_inverse_fermat(a: int, p: int) -> int:
    """费马小定理求乘法逆元 (要求 p 为素数且 gcd(a, p) == 1)"""
    return pow(a, p - 2, p)

def combination_mod(n: int, k: int, p: int = 10**9 + 7) -> int:
    """求解 C(n, k) % p，利用阶乘与费马逆元"""
    if k < 0 or k > n:
        return 0
    if k == 0 or k == n:
        return 1
    
    # 计算分子 n! 与分母 (k! * (n-k)!)
    num = 1
    den = 1
    for i in range(1, k + 1):
        num = (num * (n - i + 1)) % p
        den = (den * i) % p
        
    # (num / den) % p == (num * den^(p-2)) % p
    return (num * mod_inverse_fermat(den, p)) % p

if __name__ == "__main__":
    # 1. 验证切片筛
    primes = sieve_primes_slice(30)
    expected_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
    assert primes == expected_primes, f"Primes error: {primes}"
    
    # 2. 验证快速幂
    assert quick_pow(2, 10, 1000) == 24, "Quick pow error"
    assert pow(2, 10, 1000) == 24, "Builtin pow error"
    
    # 3. 验证组合数 C(5, 2) = 10
    c_ans = combination_mod(5, 2)
    assert c_ans == 10, f"Combination error: {c_ans}"
    
    # 4. 验证大组合数 C(10, 3) = 120
    assert combination_mod(10, 3) == 120, "C(10, 3) fail"
    
    print("[PASS] 13 模块数论三剑客（切片筛、快速幂、费马逆元）标准模板全部验证通过！")
