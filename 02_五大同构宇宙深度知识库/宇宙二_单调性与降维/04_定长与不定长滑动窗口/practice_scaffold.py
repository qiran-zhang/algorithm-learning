"""
04 模块：定长与不定长滑动窗口
【挖空实战脚手架】practice_scaffold.py
请在带有 # TODO 的区域根据提示补全核心逻辑，运行直到终端输出 ✅ 通关提示！
"""

from typing import List

def length_of_longest_substring_practice(s: str) -> int:
    """
    练习：求无重复字符的最长子串长度 (不定长滑动窗口)
    """
    last_seen = {}
    max_len = 0
    left = 0
    
    for right, char in enumerate(s):
        # TODO: 步骤 1：若当前字符在 last_seen 中且出现位置 >= left，更新 left 为上一次位置 + 1
        # TODO: 步骤 2：在 last_seen 中记录当前字符位置为 right
        # TODO: 步骤 3：更新最大长度 max_len = max(max_len, 当前窗口长度)
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len

if __name__ == "__main__":
    print("正在检验你的 04 挖空练习实现...")
    assert length_of_longest_substring_practice("abcabcbb") == 3
    assert length_of_longest_substring_practice("pwwkew") == 3
    assert length_of_longest_substring_practice("") == 0
    print("🎉 恭喜！04 滑动窗口挖空练习通关！")
