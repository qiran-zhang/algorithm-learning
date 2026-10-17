# 大三零基础算法竞赛 (蓝桥杯B组) × 保研夏令营机试 × 408数据结构 终极总规划与 Antigravity 启动指令

> **说明**：本文档已根据你的全部个性化情况（**蓝桥杯 Python B 组、保研夏令营机试 + 408 考研数据结构 + 大厂机试四合一、每周 8–10 小时精简高 ROI 模式、保留轻量 C++ 408/洛谷折叠对照卡、每个模块标配 `practice_scaffold.py` 挖空练习、PyCharm/VS Code 即点即跑、内置 `.cursorrules` / `CLAUDE.md` 私教协议**）完成了最终定稿。你可以直接将下半部分的 **Prompt Draft** 发给 Antigravity 启动构建。

## 第一部分：针对你个人处境的“四位一体”战略精调总结

### 1. 为什么“每周 8–10 小时”依然能稳拿蓝桥杯 B 组省一/国奖并打通保研 & 408？
你目前同时背负**保研夏令营准备**与**考研数学/408 复习**，时间极其宝贵。之所以每周 8–10 小时（每天约 1.2 小时）完全够用，核心在于我们发现了**【蓝桥杯 B 组】、【保研/大厂机试】与【408 数据结构算法大题】高达 85% 的底层考点重合度**：
- **重合点 1（线性表与单调性）**：408 最爱考的数组/链表双指针与原地操作（如 2010/2015/2019 真题） = 蓝桥杯 B 组与大厂机试必考的**前缀和、差分、双指针、滑动窗口、二分查找、单调栈**。
- **重合点 2（树与图论核心）**：408 必考的二叉树遍历/树高/最近公共祖先（LCA）、图的存储（邻接表/矩阵）、BFS/DFS、最短路（Dijkstra/Floyd）、最小生成树（Kruskal/Prim）、拓扑排序 = 保研夏令营机试与蓝桥杯 B 组中后段大题的绝对主力！
- **重合点 3（分治与动态规划）**：408 选择题与大题常考的归并分治、快速选择（求第 $K$ 小/中位数 $O(N)$）与基础 DP = 蓝桥杯 B 组的夺奖分水岭。
- **彻底砍掉的时间黑洞**：我们为你果断剔除了 408 不考、蓝桥杯 B 组几乎不考或性价比极低的“手写希尔/基数/桶排序、复杂线段树懒标记、博弈论 SG 函数、匈牙利二分图匹配、数位 DP”，直接为你省下 **80+ 小时**拿去复习数学和 408 专业课！

### 2. 专为“每周 8–10 小时”定制的每日微习惯工作流（PyCharm / VS Code）
- **周一至周五（每天 60–75 分钟，零负担不断档）**：
  1. **前 15 分钟（看动画 + 读讲义）**：双击打开 `index.html` 可视化平台，单步播放当天模块的动态演示，阅读该模块的【底层逻辑与母题识别信号】（顺带点开底部的 `<details>` C++ 折叠卡，花 2 分钟眼熟 408 伪代码结构）。
  2. **中间 35 分钟（填挖空脚手架）**：在 PyCharm 或 VS Code 中打开该模块下的 `practice_scaffold.py`，在 `.cursorrules / CLAUDE.md` 苏格拉底私教的启发下，亲手补全挖空的 5–8 行核心代码，点击右上角绿三角 `Run` 直到全部测试显示 `✅ PASS`。
  3. **后 15 分钟（真题变式巩固）**：去洛谷或力扣刷 1 道同构母题（同时练习力扣 `class Solution` 模式与洛谷/蓝桥杯 `sys.stdin` ACM 模式）。
- **周末（周六或周日集中 3 小时）**：
  - 使用 `stress_tester.py` 对本周写过的模板跑一次随机数据对拍，并在 `index.html` 的 24 周进度看板上勾选打卡。

## 第二部分：可直接发给 Antigravity 的更新版总规划 (`implementation_plan.md`)

# 大三零基础算法竞赛(蓝桥杯B组) × 保研机试 × 408数据结构 全景系统实现计划 (8-10h/周 高ROI定制版)

本项目专为**大三备战蓝桥杯 Python B 组、保研夏令营机试、大厂实习机试及考研 408 数据结构**的零基础同学量身定制。针对每周 8–10 小时的精简时间预算，采用**“Python 3 实战主攻 + 408/洛谷 C++ 折叠对照卡 + 每个模块标配 `practice_scaffold.py` 挖空练习 + 零跨域即开即用可视化工作台 + 内置苏格拉底 AI 私教规则”**的工程架构。

### 一、五大核心定制升级 (Tailored Architecture)

1. **精准裁剪考纲（聚焦“蓝桥杯 B 组 ∩ 保研/大厂机试 ∩ 408 数据结构”黄金交集）**：
   - 增设**“宇宙零：签到题三剑客与 408 链表/树基石”**（含 Python `datetime` 日期模拟、进制转换、区间贪心排序，以及大厂机试/408 必考的链表指针与二叉树递归遍历）。
   - 聚焦四大同构演化宇宙共 15 个高投产比模块，剔除低性价比偏题，确保每周 8–10 小时即可在 20–24 周内完成从零到省一/机试通关。
2. **首创“三文件模块化练习闭环”（解决手生与眼高手低）**：
   - 每个算法子目录下均包含 3 个标准文件：
     - `README.md`：七维深度精讲 + **双模式输入输出说明（力扣核心代码模式 vs 蓝桥杯 ACM 模式）** + **底部 `<details>` 折叠式 C++ STL / 408 考研数据结构伪代码对照卡**。
     - `solution_template.py`：带详尽中文注释的 Python 3 满分标准模板，底部自带 `if __name__ == "__main__":` 测试用例，支持 PyCharm / VS Code 一键点击运行。
     - `practice_scaffold.py`：**挖空填空实战脚手架**（保留函数签名、步骤提示注释与自动化 `assert` 评测，仅将最关键的 5–8 行状态转移/指针收缩留空 `# TODO`，填对后直接运行即输出绿色通关提示）。
3. **考场防爆核武器与多组数据规范**：
   - 包含 `contest_starter_template.py`（`sys.stdin.readline` 快读、`sys.setrecursionlimit(200000)` 扩栈、多组测试数据 `@lru_cache` 的 `cache_clear()` 清空规范、浮点数精度防坑、力扣模式与 ACM 模式互转模板）。
   - 包含 `stress_tester.py`（20 行 Python 随机数据生成器 + 暴力标程 vs 优化解自动对拍器）与《OI 赛制四阶骗分战术指南》。
4. **双击即用的零依赖交互可视化工作台 (`index.html`)**：
   - 严格采用传统 `<script defer>` 全局命名空间加载（或单页内联架构），**严禁使用会在本地 `file://` 协议下触发 CORS 跨域报错的 ES Module (`type="module"`)**，确保在 Windows 资源管理器直接双击 `index.html` 100% 正常渲染。
   - 内置：6 大动态算法可视化器（经典排序与快排 Partition、二分答案红蓝染色、滑动窗口、单调栈、迷宫 BFS vs DFS、0-1 背包 DP 填表）、交互式“看数据规模 $N$ 秒推算法计算器”、举一反三母题检索库、以及基于 `localStorage` 的 24 周进度打卡看板。
5. **根目录内置 AI 伴学私教协议 (`CLAUDE.md` & `.cursorrules`)**：
   - 在项目根目录自动生成 `CLAUDE.md` 与 `.cursorrules`，配置“苏格拉底式四步启发教学法 + 一题三吃（蓝桥杯/大厂机试/408 映射）复盘卡”。

### 二、全景目录结构规范

```text
算法学习/
├── CLAUDE.md                        (AI 私教规则：苏格拉底四步启发 + 蓝桥B组/机试/408三合一伴学协议)
├── .cursorrules                     (与 CLAUDE.md 同构，直接支持 VS Code / Cursor / PyCharm AI 插件)
├── 00_全局规划与考场博弈指南/
│   ├── 01_大三24周精简高ROI备赛日历(每周8-10小时版).md
│   ├── 02_看数据范围N秒推算法与OI赛制四阶骗分法则.md
│   └── 03_蓝桥杯B组_保研机试_408数据结构考点三维映射表.md
├── 01_Python竞赛内功与考场工具箱/
│   ├── Chapter0_Python极速唤醒与力扣_ACM双模式转换手册.md
│   ├── contest_starter_template.py  (6行黄金起手式、多组数据 cache_clear、快读与扩栈模板)
│   ├── stress_tester.py             (20行考场防爆核武器：随机数据生成 + 暴力vs优化自动对拍器)
│   └── cpp_408_stl_cheatsheet.md    (408考研数据结构 C/C++ 指针结构体与洛谷 STL 速查字典)
├── 02_五大同构宇宙深度知识库(含挖空练习脚手架)/
│   ├── 宇宙零_签到题三剑客与408链表树基石/
│   │   ├── 00A_日期枚举_进制转换与自定义排序贪心/ (README.md, solution_template.py, practice_scaffold.py)
│   │   └── 00B_408与大厂机试必考_链表双指针与二叉树遍历/ (README.md, solution_template.py, practice_scaffold.py)
│   ├── 宇宙一_区间预处理与差分/
│   │   ├── 01_一维与二维前缀和_哈希表枚举右维护左/ (README.md, solution_template.py, practice_scaffold.py)
│   │   └── 02_一维与二维差分数组/ (README.md, solution_template.py, practice_scaffold.py)
│   ├── 宇宙二_单调性与降维/
│   │   ├── 03_相向双指针与快慢指针_快排Partition_第K小/ (README.md, solution_template.py, practice_scaffold.py)
│   │   ├── 04_定长与不定长滑动窗口/ (README.md, solution_template.py, practice_scaffold.py)
│   │   ├── 05_二分查找与红蓝染色二分答案/ (README.md, solution_template.py, practice_scaffold.py)
│   │   └── 06_单调栈与单调队列/ (README.md, solution_template.py, practice_scaffold.py)
│   ├── 宇宙三_连通性_树与图论搜索/
│   │   ├── 07_DFS回溯三大模型与四大剪枝/ (README.md, solution_template.py, practice_scaffold.py)
│   │   ├── 08_网格BFS最短路_多源BFS与01BFS/ (README.md, solution_template.py, practice_scaffold.py)
│   │   ├── 09_并查集DSU与Kruskal最小生成树/ (README.md, solution_template.py, practice_scaffold.py)
│   │   └── 10_堆优化Dijkstra_Floyd与Kahn拓扑排序/ (README.md, solution_template.py, practice_scaffold.py)
│   └── 宇宙四_动态规划与数论/
│       ├── 11_从lru_cache记忆化搜索到线性DP_LIS_LCS/ (README.md, solution_template.py, practice_scaffold.py)
│       ├── 12_01背包(倒序)与完全背包(正序)空间压缩/ (README.md, solution_template.py, practice_scaffold.py)
│       ├── 13_数论三剑客_切片筛_GCD_快速幂逆元/ (README.md, solution_template.py, practice_scaffold.py)
│       └── 14_区间DP(石子合并)与树形DP(树的直径)/ (README.md, solution_template.py, practice_scaffold.py)
├── run_tests.py                     (一键自动化测试脚本：自动校验所有 solution_template.py 100% 通过)
├── index.html                       (零跨域即开即用交互式算法可视化工作台主入口)
├── css/
│   └── style.css
└── js/                              (全部采用全局挂载 + <script defer>，严禁 ES Module 触发 file:// 跨域错误)
    ├── app.js
    ├── visualizer_sorting.js
    ├── visualizer_binary_search.js
    ├── visualizer_window.js
    ├── visualizer_stack.js
    ├── visualizer_maze.js
    ├── visualizer_dp.js
    └── n_complexity_calculator.js
```

## 第三部分：可直接发给 Antigravity 的启动提示词 (`prompt_draft.md`)

```markdown
# Teamwork Project Prompt — Final Approved Version

为大三零基础学生打造兼顾【蓝桥杯 Python B 组省一/国奖、保研夏令营机试、大厂实习机试与考研 408 数据结构】的高 ROI 算法学习与交互可视化工程体系（适配每周 8-10 小时精简备赛节奏）。采用“Python 3 实战主攻 + 底部折叠式 C++ (408/洛谷 STL) 对照卡 + 每个模块标配 `practice_scaffold.py` 挖空填空脚手架 + 本地双击零跨域报错的可视化工作台 + 根目录内置苏格拉底式 AI 私教规则 (`CLAUDE.md` / `.cursorrules`)”的完整架构。

Working directory: c:\Users\28900\Desktop\个人小项目\算法学习
Integrity mode: demo

## Requirements

### R1. 个性化精简备赛规划、考场博弈核武器与 AI 私教协议
1. 在项目根目录生成 `CLAUDE.md` 与 `.cursorrules`，内置针对“蓝桥杯B组 + 保研/大厂机试 + 408数据结构”的苏格拉底式四步启发教学协议与一题三吃复盘规范。
2. 在 `00_全局规划与考场博弈指南/` 下提供每周 8-10 小时的高 ROI 备赛日历、看数据规模 N 秒推算法复杂度表、OI 赛制四阶骗分黄金法则，以及《蓝桥杯B组 × 保研大厂机试 × 408数据结构考点三维映射表》。

### R2. 零跨域即开即用的交互式算法可视化工作台 (Interactive Visualizer Workbench)
在根目录构建 `index.html` + `css/style.css` + `js/*.js`：
1. **硬性兼容要求**：所有 JS 文件必须通过传统 `<script defer src="...">` 与全局对象挂载交互，**严禁使用 `<script type="module">` 或 `import/export`**，确保用户在 Windows 资源管理器直接双击 `index.html`（`file://` 协议）时 100% 零 CORS 报错运行。
2. 包含 6 大动态可视化器（经典排序与 408 快排 Partition 演示、二分答案红蓝染色折半、滑动窗口毛毛虫伸缩、单调栈柱子进出、网格迷宫 BFS 波纹扩散 vs DFS 回溯、0-1 背包 DP Table 填表联动）。
3. 包含交互式“输入数据规模 N 秒推候选算法计算器”、举一反三母题检索卡片库（含 Python 与 C++ 408/STL 对照切换），以及基于 `localStorage` 的 24 周进度打卡看板。

### R3. 第 0 章：Python 竞赛内功唤醒、双模式转换与自动对拍器
在 `01_Python竞赛内功与考场工具箱/` 下提供：
1. `Chapter0_Python极速唤醒与力扣_ACM双模式转换手册.md`：详解 `sys.stdin.readline` 快读、`sys.setrecursionlimit(200000)` 扩栈、多组测试数据 `@lru_cache` 必须调用 `cache_clear()` 防脏数据、浮点数精度防坑，以及**力扣核心代码模式 (`class Solution`) 与蓝桥杯/夏令营 ACM 标准输入输出模式的无缝转换模板**。
2. `contest_starter_template.py` 与 `stress_tester.py`（20行随机数据生成 + 暴力标程 vs 优化解自动对拍脚本，支持 PyCharm/VS Code 直接点击运行）。
3. `cpp_408_stl_cheatsheet.md`：专为读懂洛谷 C++ 题解与应对 408 数据结构算法大题编写的轻量 C/C++ 指针结构体与 STL 映射字典。

### R4. 五大同构宇宙 · 15 大高 ROI 核心模块（含挖空练习脚手架 `practice_scaffold.py`）
在 `02_五大同构宇宙深度知识库(含挖空练习脚手架)/` 下完整实现：
- **宇宙零（签到与机试/408基石）**：00A 日期枚举(`datetime`)/进制转换/自定义排序贪心；00B 链表快慢指针反转与二叉树递归/层序遍历（兼顾大厂手撕与 408 大题）。
- **宇宙一（区间与差分）**：01 一维/二维前缀和 + 哈希表枚举右维护左；02 一维/二维差分数组。
- **宇宙二（单调性与降维）**：03 相向双指针 + 408 快排 Partition 思想求第 K 小 (Quickselect) 与归并求逆序对；04 定长/不定长滑动窗口；05 二分查找与红蓝染色二分答案；06 单调栈与单调队列。
- **宇宙三（搜索与图论）**：07 DFS 回溯三大模型与四大剪枝；08 网格 BFS 最短路、多源 BFS 与 0-1 BFS；09 并查集 (DSU) 与 Kruskal 最小生成树；10 堆优化 Dijkstra、Floyd 与 Kahn 拓扑排序。
- **宇宙四（动态规划与数论）**：11 从 `@lru_cache` 记忆化搜索到线性 DP (Kadane/LIS/LCS)；12 0-1 背包(倒序)与完全背包(正序)空间压缩；13 数论三剑客（切片筛/GCD/快速幂逆元）；14 区间 DP 与树形 DP（树的直径）。
**每个子目录必须严格包含 3 个文件**：
1. `README.md`：按七维深度规范编写，文末固定附带 `<details><summary>📘 点击展开：408 考研数据结构 C/C++ 伪代码与洛谷 STL 题解对照</summary>...</details>` 折叠卡（不干扰日常纯 Python 学习，展开即可对照）。
2. `solution_template.py`：完整 Python 3 标准实现 + `if __name__ == "__main__":` 自测断言，支持 PyCharm/VS Code 一键运行。
3. `practice_scaffold.py`：挖空填空练习脚手架（挖去最核心的 5-8 行状态转移/指针更新并附带 `# TODO` 步骤提示，内置自动化测试验收）。

### R5. 统一自动化测试驱动系统
在根目录提供 `run_tests.py`，执行 `python run_tests.py` 可自动遍历并运行所有模块的 `solution_template.py` 与 `stress_tester.py` 测试套件，确保通过率 100%。

## Acceptance Criteria

- [ ] 根目录包含 `CLAUDE.md` 与 `.cursorrules` 私教协议文件。
- [ ] 根目录 `index.html` 在 `file://` 协议直接双击打开时零控制台报错，6 大可视化模块、N秒推计算器、母题检索器与本地打卡全部正常工作。
- [ ] 15 个核心模块每个子目录下均齐全包含 `README.md`（带 `<details>` C++ 408/STL 折叠卡）、`solution_template.py`、`practice_scaffold.py` 三个文件。
- [ ] 所有 `.py` 文件均包含 `if __name__ == "__main__":` 入口，可在 PyCharm 与 VS Code 中直接单文件右键 Run。
- [ ] 运行 `python run_tests.py` 自动化测试通过率 100%。
```
