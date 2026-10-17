"""
00B 模块：408 与大厂机试必考 · 链表双指针与二叉树遍历
标准解题模板 (带自测断言，支持直接 Run)
"""

from typing import Optional, List
from collections import deque

class ListNode:
    """单链表节点"""
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

class TreeNode:
    """二叉树节点"""
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    原地反转单链表 (408 与技术面绝对主力题)
    时间复杂度 O(N)，空间复杂度 O(1)
    """
    prev = None
    cur = head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    return prev

def max_depth_tree(root: Optional[TreeNode]) -> int:
    """
    二叉树最大深度 (后序递归)
    """
    if not root:
        return 0
    return max(max_depth_tree(root.left), max_depth_tree(root.right)) + 1

def level_order_traversal(root: Optional[TreeNode]) -> List[List[int]]:
    """
    二叉树层序遍历 (BFS 队列实现)
    """
    if not root:
        return []
    res = []
    q = deque([root])
    while q:
        level_size = len(q)
        current_level = []
        for _ in range(level_size):
            node = q.popleft()
            current_level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(current_level)
    return res

# 辅助测试函数
def build_linked_list(vals: List[int]) -> Optional[ListNode]:
    dummy = ListNode(0)
    cur = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def linked_list_to_list(head: Optional[ListNode]) -> List[int]:
    res = []
    cur = head
    while cur:
        res.append(cur.val)
        cur = cur.next
    return res

if __name__ == "__main__":
    # 验证链表反转
    l = build_linked_list([1, 2, 3, 4, 5])
    rev = reverse_list(l)
    assert linked_list_to_list(rev) == [5, 4, 3, 2, 1]
    
    # 验证二叉树：构建简单二叉树
    #       1
    #      / \
    #     2   3
    #    /
    #   4
    root = TreeNode(1, TreeNode(2, TreeNode(4)), TreeNode(3))
    assert max_depth_tree(root) == 3
    assert level_order_traversal(root) == [[1], [2, 3], [4]]
    
    print("✅ 00B 模块标准模板全部用例自测通过！")
