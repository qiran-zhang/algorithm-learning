# 00B 模块：408 与大厂机试必考 · 链表双指针与二叉树遍历

## 一、算法由来与现实痛点 (Origin & Pain Points)
单链表与二叉树是计算机科学最核心的非连续内存数据结构，也是 408 考研数据结构算法大题（占 10-15 分）与各大厂技术面机试出镜率最高的“手撕代码必考项”。
- **痛点**：单链表无法像数组那样支持 $O(1)$ 随机下标访问；二叉树的递归若缺乏系统性的“宏观树拆解思维”，极易陷入局部指针混乱。
- **破局**：
  1. 链表的核心利器是**虚拟头结点 (Dummy Head)** 消除头结点的特判，以及**快慢指针 (Floyd 判圈/中点划分)**；
  2. 二叉树的核心利器是**递归三部曲（终止条件、单层逻辑、返回值）**，以及队列实现的层序遍历（BFS）。

## 二、算法原理与核心实现 (Intuition & Mechanism)
1. **虚拟头结点**：创建 `dummy = ListNode(0, head)`，所有对头结点的删除、插入操作全部统一转化为中间节点的通常操作。
2. **链表反转双指针**：维护 `prev = None, cur = head`，在暂存 `nxt = cur.next` 后将 `cur.next = prev`，随后双双向前推进一步。
3. **二叉树深度与遍历**：
   - 树的最大深度：`max(maxDepth(root.left), maxDepth(root.right)) + 1`；
   - 层序遍历：使用双端队列 `deque`，每轮记录当前层大小 `len(q)`，批量出队并把非空子节点压入。

## 三、适用范围与题型特征 (Applicability & Triggers)
- **题眼识别**：题目要求“原地空间 $O(1)$ 反转单链表”、“判断链表是否存在环”、“二叉树的层序遍历”、“寻找二叉树最近公共祖先 (LCA)”。

## 四、算法特点与复杂度 (Characteristics & Complexity)
- **时间复杂度**：链表遍历 $O(N)$，二叉树每个节点访问一次 $O(N)$；
- **空间复杂度**：链表原地操作 $O(1)$；二叉树递归栈深度最坏 $O(N)$（退化为链表时），平衡时 $O(\log N)$。

## 五、快捷标准库与一行流调用 (Standard Libraries)
在 Python 中通常需要手写简单类节点：
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

<details>
<summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>

```cpp
// 408 考研单链表标准结构体定义
typedef struct LNode {
    int data;
    struct LNode *next;
} LNode, *LinkList;

// 408 必考真题：原地单链表反转
LinkList reverseList(LinkList head) {
    LNode *prev = NULL, *cur = head, *nxt = NULL;
    while (cur != NULL) {
        nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    return prev;
}

// 408 考研二叉树标准结构体定义
typedef struct BiTNode {
    int data;
    struct BiTNode *lchild, *rchild;
} BiTNode, *BiTree;

// 求二叉树深度
int treeDepth(BiTree root) {
    if (root == NULL) return 0;
    int left = treeDepth(root->lchild);
    int right = treeDepth(root->rchild);
    return (left > right ? left : right) + 1;
}
```
</details>
