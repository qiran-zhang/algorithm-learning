"""
00B 模块：408 与大厂机试必考 · 链表双指针与二叉树遍历
【挖空实战脚手架】practice_scaffold.py
请在带有 # TODO 的区域根据提示补全核心逻辑，运行直到终端输出 ✅ 通关提示！
"""

from typing import Optional, List
from collections import deque

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

def reverse_list_practice(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    练习 1：原地反转单链表
    """
    prev = None
    cur = head
    while cur:
        # TODO: 步骤 1：暂存 cur 的后继节点 nxt
        # TODO: 步骤 2：将 cur.next 指向 prev
        # TODO: 步骤 3：prev 前移到 cur，cur 前移到 nxt
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
        
    return prev

def max_depth_practice(root: Optional[TreeNode]) -> int:
    """
    练习 2：递归求二叉树最大深度
    """
    # TODO: 递归终止条件：若 root 为 None，返回 0
    # TODO: 递归返回 1 + max(左子树深度, 右子树深度)
    if not root:
        return 0
    return max(max_depth_practice(root.left), max_depth_practice(root.right)) + 1

if __name__ == "__main__":
    print("正在检验你的 00B 挖空练习实现...")
    # 测试链表
    n1, n2, n3 = ListNode(1), ListNode(2), ListNode(3)
    n1.next = n2; n2.next = n3
    rev = reverse_list_practice(n1)
    assert rev.val == 3 and rev.next.val == 2 and rev.next.next.val == 1
    
    # 测试二叉树
    t = TreeNode(10, TreeNode(5), TreeNode(15, None, TreeNode(20)))
    depth = max_depth_practice(t)
    assert depth == 3, f"预期深度 3，实际返回 {depth}"
    
    print("🎉 恭喜！00B 挖空实战通关！408 与技术面核心基石已掌握！")
