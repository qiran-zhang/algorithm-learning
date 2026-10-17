/**
 * @file graphs.js
 * @description Graph & Search Visualizers: Grid BFS Wave, Grid DFS Maze, Dijkstra, Kahn Topological Sort, Kruskal MST, Eulerian Path/Circuit.
 * @namespace window.AlgoSystem.visualizers.graphs
 *
 * 16th Blue Bridge Cup Algorithm Learning & Visualization Platform
 * Zero-CORS, Zero-build, file:// protocol compatible.
 */
(function(global) {
  'use strict';

  global.AlgoSystem = global.AlgoSystem || {};
  global.AlgoSystem.visualizers = global.AlgoSystem.visualizers || {};

  const ActionTypes = (global.AlgoSystem.Types && global.AlgoSystem.Types.ActionTypes) || global.AlgoSystem.ActionTypes || {
    COMPARE: 'COMPARE',
    SWAP: 'SWAP',
    HIGHLIGHT: 'HIGHLIGHT',
    MODIFY: 'MODIFY',
    MARK_SORTED: 'MARK_SORTED',
    BACKTRACK: 'BACKTRACK',
    PUSH: 'PUSH',
    POP: 'POP',
    RELAX: 'RELAX',
    FOUND: 'FOUND',
    DONE: 'DONE'
  };

  const SnapshotFrame = (global.AlgoSystem.Types && global.AlgoSystem.Types.SnapshotFrame) || global.AlgoSystem.SnapshotFrame;

  function switchStageLayer(activeId) {
    const layers = ['stageArray', 'stageSvg', 'stageGrid', 'stageSandbox'];
    layers.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === activeId) {
          el.classList.remove('hidden');
          el.classList.add('active');
        } else {
          el.classList.add('hidden');
          el.classList.remove('active');
        }
      }
    });
  }

  function syncInspectorUI(frame) {
    if (!frame) return;

    const explanationText = document.getElementById('stepExplanationText');
    if (explanationText && frame.explanation) {
      explanationText.innerHTML = frame.explanation;
    }

    const watchBody = document.getElementById('watchTableBody');
    if (watchBody && frame.variables) {
      const keys = Object.keys(frame.variables);
      if (keys.length === 0) {
        watchBody.innerHTML = '<tr><td colspan="3" class="table-empty">暂无变量数据</td></tr>';
      } else {
        watchBody.innerHTML = keys.map(k => `
          <tr>
            <td style="color:var(--text-secondary);">${k}</td>
            <td style="font-family:var(--font-mono); font-weight:bold; color:var(--text-primary);">${frame.variables[k]}</td>
            <td style="font-size:11px; color:var(--text-muted);">图论状态</td>
          </tr>
        `).join('');
      }
    }

    const codeBlock = document.getElementById('codeBlock');
    if (codeBlock && frame.codeLine) {
      const lines = codeBlock.querySelectorAll('.code-line');
      lines.forEach((line, i) => {
        line.classList.toggle('line-highlight', (i + 1 === frame.codeLine));
      });
    }

    const actionBadge = document.getElementById('actionBadge');
    if (actionBadge && frame.action) {
      actionBadge.textContent = frame.action;
    }
  }

  function commonInit(algoDef, controller, customData) {
    let inputData = customData || algoDef.defaultInput;

    const codeBlock = document.getElementById('codeBlock');
    if (codeBlock && algoDef.templates) {
      if (global.AlgoSystem && global.AlgoSystem.controls && typeof global.AlgoSystem.controls.renderCurrentCode === 'function') {
        global.AlgoSystem.controls.renderCurrentCode(algoDef.id);
      } else {
        const codeLines = algoDef.templates.python || [];
        codeBlock.innerHTML = codeLines.map((line, idx) => `
          <div class="code-line" data-line="${idx + 1}">
            <span class="line-num">${idx + 1}</span>
            <span class="line-code">${line}</span>
          </div>
        `).join('');
      }
    }

    const stlContent = document.getElementById('stlContent');
    if (stlContent && algoDef.stlCard) {
      stlContent.innerHTML = algoDef.stlCard.content;
    }

    const frames = algoDef.generateFrames(inputData);
    if (controller && typeof controller.loadFrames === 'function') {
      controller.loadFrames(frames);
      if (typeof controller.setRenderer === 'function') {
        controller.setRenderer(function(p) {
          algoDef.render(p.frame);
        });
      } else {
        controller.on('frameChange', function(p) {
          algoDef.render(p.frame);
        });
      }
      algoDef.render(controller.getCurrentFrame());
    }
  }

  // =========================================================================
  // 1. 网格迷宫 BFS (Grid BFS Wavefront)
  // =========================================================================
  const DEFAULT_MAZE = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]; // 0: 空地, 1: 障碍, 2: 起点(1,1), 3: 终点(5,8)

  function generateBFSMazeFrames(input) {
    const grid = (Array.isArray(input) && Array.isArray(input[0])) 
      ? input.map(r => [...r]) 
      : DEFAULT_MAZE.map(r => [...r]);

    const R = grid.length;
    const C = grid[0].length;
    let start = [1, 1];
    let end = [5, 8];

    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (grid[r][c] === 2) start = [r, c];
        if (grid[r][c] === 3) end = [r, c];
      }
    }

    const frames = [];
    let step = 0;

    const visited = Array.from({ length: R }, () => Array(C).fill(false));
    const parent = Array.from({ length: R }, () => Array(C).fill(null));
    const queue = [];

    visited[start[0]][start[1]] = true;
    queue.push(start);

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { grid, visited: visited.map(r => [...r]), queue: [...queue], path: [] },
      variables: { start: `(${start[0]}, ${start[1]})`, end: `(${end[0]}, ${end[1]})`, '队列规模': 1 },
      codeLine: 2,
      explanation: `【网格 BFS 启动】起点 (${start[0]}, ${start[1]}) 入队，标记已访问。准备水波纹层序扩展。`
    }));

    let found = false;
    const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // 上右下左

    while (queue.length > 0 && !found) {
      const [cr, cc] = queue.shift();

      if (cr === end[0] && cc === end[1]) {
        found = true;
        break;
      }

      for (const [dr, dc] of dirs) {
        const nr = cr + dr;
        const nc = cc + dc;

        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] !== 1 && !visited[nr][nc]) {
          visited[nr][nc] = true;
          parent[nr][nc] = [cr, cc];
          queue.push([nr, nc]);

          const isTarget = (nr === end[0] && nc === end[1]);

          frames.push(new SnapshotFrame({
            step: step++,
            action: isTarget ? ActionTypes.FOUND : ActionTypes.PUSH,
            indices: [],
            state: { grid, visited: visited.map(r => [...r]), queue: [...queue], curr: [nr, nc], path: [] },
            variables: { '扩展新点': `(${nr}, ${nc})`, queueLen: queue.length, '是否终点': isTarget },
            codeLine: isTarget ? 10 : 6,
            explanation: isTarget
              ? `🎉 成功命中迷宫终点 (${nr}, ${nc})！即将启动父节点回溯还原最短路径。`
              : `水波纹扩散：探索到达邻居坐标 (${nr}, ${nc})，加入等待队列。`
          }));

          if (isTarget) {
            found = true;
            break;
          }
        }
      }
    }

    // 回溯最短路
    const path = [];
    if (found) {
      let curr = end;
      while (curr) {
        path.push(curr);
        curr = parent[curr[0]][curr[1]];
      }
      path.reverse();

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MARK_SORTED,
        indices: [],
        state: { grid, visited: visited.map(r => [...r]), queue: [], path },
        variables: { '最短路步数': path.length - 1, '路径坐标数': path.length },
        codeLine: 12,
        explanation: `最短路径回溯完成！最短移动距离为 ${path.length - 1} 步。金色高亮路径已贯穿显示！`
      }));
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { grid, visited: visited.map(r => [...r]), queue: [], path },
      variables: { found, status: 'COMPLETE' },
      codeLine: 13,
      explanation: `BFS 迷宫无权最短路探索圆满结束。`
    }));

    return frames;
  }

  const bfsMazeDef = {
    id: 'bfs_maze',
    category: 'graphs',
    name: '网格迷宫 BFS (水波纹探索)',
    en: 'Grid BFS Wavefront',
    meta: { tier: 'C组', time: 'O(V+E)', space: 'O(V)', stability: '稳定', is408: true, tags: ['FIFO队列', '层序扩展', '无权最短路'] },
    templates: {
      python: [
        'from collections import deque  # 引入双端队列模块提供高效 $O(1)$ 入队出队',
        'def bfs_maze(grid, start, end):  # 网格迷宫无权最短路主函数',
        '    q = deque([start])  # 初始化广搜队列，起点加入队头',
        '    visited = {start}  # 集合记录访问历史，杜绝环路死循环',
        '    parent = {}  # 记录到达当前格点的父前驱，用于逆向回溯路径',
        '    while q:  # 队列不空时持续执行水波纹波前层序扩散',
        '        r, c = q.popleft()  # 队头出队作为当前探索中心',
        '        if (r, c) == end: return reconstruct_path(parent, end)  # 首次碰上终点即为理论最短路径',
        '        for dr, dc in [(-1,0),(0,1),(1,0),(0,-1)]:  # 遍历上下左右四个连通邻居',
        '            nr, nc = r + dr, c + dc  # 计算邻居候选网格坐标',
        '            if valid(nr, nc) and (nr, nc) not in visited:  # 越界检查、障碍物过滤与防重复',
        '                visited.add((nr, nc)); parent[(nr, nc)] = (r, c)  # 标记已访问并挂载父节点指针',
        '                q.append((nr, nc))  # 将新连通邻居推入队列等待下一层波前处理'
      ],
      cpp: [
        '#include <vector>, <queue>, <set>, <map>  // 容器引入',
        'vector<pair<int,int>> bfs_maze(const vector<vector<int>>& grid, pair<int,int> s, pair<int,int> e) {  // 迷宫BFS入口',
        '    queue<pair<int,int>> q; q.push(s);  // 广度优先探索队列初始化并入队起点',
        '    set<pair<int,int>> visited = {s};  // 集合记录已访问格点防重',
        '    map<pair<int,int>, pair<int,int>> parent;  // 记录移动前驱用于路径回溯',
        '    while (!q.empty()) {  // 队列非空持续向外周水波纹扩散',
        '        auto [r, c] = q.front(); q.pop();  // 队头格点出队探索相邻可达分支',
        '        if (make_pair(r, c) == e) return reconstruct_path(parent, e);  // 命中终点回溯构建完整最短路径',
        '        int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};  // 上下左右四向移动偏移量',
        '        for (int d = 0; d < 4; ++d) { int nr = r + dr[d], nc = c + dc[d];  // 计算四周相邻格点候选坐标',
        '            if (valid(nr, nc) && !visited.count({nr, nc})) {  // 判定是否在网格内、非障碍且未曾探索',
        '                visited.insert({nr, nc}); parent[{nr, nc}] = {r, c};  // 标记访问并登记父格点索引',
        '                q.push({nr, nc}); } } } return {};  // 新格点入队并收尾返回'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>无权图最短路</strong>：BFS 首次访问到终点时的搜索深度必然是最短路径长度，队列元素单调递增。</p>
      `
    },
    defaultInput: DEFAULT_MAZE,
    presets: { standard: DEFAULT_MAZE },
    parseInput: function() { return { success: true, data: DEFAULT_MAZE }; },
    generateFrames: generateBFSMazeFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageGrid = document.getElementById('stageGrid');
      if (!stageGrid) return;
      switchStageLayer('stageGrid');

      const state = frame.state || {};
      const grid = state.grid || DEFAULT_MAZE;
      const visited = state.visited || [];
      const path = state.path || [];

      let html = '<div class="maze-container" style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%; padding:16px;">';
      html += '<div style="display:grid; grid-template-columns: repeat(' + grid[0].length + ', 38px); gap:4px;">';

      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
          const val = grid[r][c];
          const isVisited = visited[r] && visited[r][c];
          const isPath = path.some(p => p[0] === r && p[1] === c);

          let bg = 'var(--bg-surface)';
          let border = '1px solid var(--border-default)';
          let text = '';

          if (val === 1) {
            bg = '#1e1e1e';
            border = '1px solid #333';
            text = '🧱';
          } else if (val === 2) {
            bg = '#4ec9b0';
            text = 'S';
          } else if (val === 3) {
            bg = '#f44747';
            text = 'E';
          } else if (isPath) {
            bg = '#dcdcaa';
            text = '★';
          } else if (isVisited) {
            bg = 'rgba(0,122,204,0.3)';
          }

          html += `
            <div style="width:38px; height:38px; background:${bg}; border:${border}; border-radius:4px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; color:#fff;">
              ${text}
            </div>
          `;
        }
      }

      html += '</div></div>';
      stageGrid.innerHTML = html;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 2. 网格迷宫 DFS (Grid DFS Backtrack)
  // =========================================================================
  function generateDFSMazeFrames(input) {
    const grid = (Array.isArray(input) && Array.isArray(input[0])) 
      ? input.map(r => [...r]) 
      : DEFAULT_MAZE.map(r => [...r]);

    const R = grid.length;
    const C = grid[0].length;
    let start = [1, 1];
    let end = [5, 8];

    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (grid[r][c] === 2) start = [r, c];
        if (grid[r][c] === 3) end = [r, c];
      }
    }

    const frames = [];
    let step = 0;
    const visited = Array.from({ length: R }, () => Array(C).fill(false));
    const path = [];
    let found = false;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { grid, visited: visited.map(r => [...r]), path: [] },
      variables: { start: `(${start[0]}, ${start[1]})`, end: `(${end[0]}, ${end[1]})` },
      codeLine: 2,
      explanation: `【网格 DFS 试探回溯】从起点出发，一条路走到黑，碰壁即回溯。`
    }));

    function dfs(r, c) {
      if (found) return;
      visited[r][c] = true;
      path.push([r, c]);

      const isTarget = (r === end[0] && c === end[1]);
      frames.push(new SnapshotFrame({
        step: step++,
        action: isTarget ? ActionTypes.FOUND : ActionTypes.PUSH,
        indices: [],
        state: { grid, visited: visited.map(row => [...row]), path: [...path] },
        variables: { '深入坐标': `(${r}, ${c})`, '递归深度': path.length },
        codeLine: isTarget ? 6 : 4,
        explanation: isTarget
          ? `🎉 DFS 成功抵达终点 (${r}, ${c})！`
          : `递归深入：试探前进至 (${r}, ${c})。`
      }));

      if (isTarget) {
        found = true;
        return;
      }

      const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] !== 1 && !visited[nr][nc]) {
          dfs(nr, nc);
          if (found) return;
        }
      }

      // 回溯
      path.pop();
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.BACKTRACK,
        indices: [],
        state: { grid, visited: visited.map(row => [...row]), path: [...path] },
        variables: { '回退自': `(${r}, ${c})`, '当前栈深': path.length },
        codeLine: 8,
        explanation: `死胡同碰壁！坐标 (${r}, ${c}) 四周不可行，退栈回溯。`
      }));
    }

    dfs(start[0], start[1]);

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { grid, visited: visited.map(row => [...row]), path: [...path] },
      variables: { status: 'COMPLETE', pathLength: path.length },
      codeLine: 10,
      explanation: `DFS 迷宫遍历回溯结束。`
    }));

    return frames;
  }

  const dfsMazeDef = {
    id: 'dfs_maze',
    category: 'graphs',
    name: '网格迷宫 DFS (试探回溯)',
    en: 'Grid DFS Backtracking',
    meta: { tier: 'C组', time: 'O(V+E)', space: 'O(V)', stability: '稳定', is408: true, tags: ['递归栈', '回溯染色', '剪枝'] },
    templates: {
      python: [
        'def dfs(r, c, end, path, visited):  # 递归回溯搜索主函数入口',
        '    if (r, c) == end: return True  # 递归基准：命中终点返回成功',
        '    visited.add((r, c)); path.append((r, c))  # 标记当前格点并压入试探路径栈',
        '    for dr, dc in [(-1,0),(0,1),(1,0),(0,-1)]:  # 尝试向上下左右试探',
        '        nr, nc = r + dr, c + dc  # 计算相邻候选网格坐标',
        '        if valid(nr, nc) and (nr, nc) not in visited:  # 过滤边界越界与死胡同障碍',
        '            if dfs(nr, nc, end, path, visited): return True  # 递归探索深入试探',
        '    path.pop()  # 碰壁回溯：弹出栈顶格点恢复现场',
        '    return False  # 本分支探索无解退出'
      ],
      cpp: [
        'bool dfs(int r, int c, pair<int,int> end, vector<pair<int,int>>& path, set<pair<int,int>>& vis) {  // 深度优先递归试探',
        '    if (make_pair(r, c) == end) return true;  // 命中终点停止深入立即向上层返回成功',
        '    vis.insert({r, c}); path.push_back({r, c});  // 标记已访问并压入当前移动探索路径栈',
        '    int dr[4] = {-1, 0, 1, 0}, dc[4] = {0, 1, 0, -1};  // 上下左右四向移动偏移行列',
        '    for (int i = 0; i < 4; ++i) { int nr = r + dr[i], nc = c + dc[i];  // 计算四周相邻探索格点',
        '        if (valid(nr, nc) && !vis.count({nr, nc})) {  // 邻居合法且未曾访问',
        '            if (dfs(nr, nc, end, path, vis)) return true; } }  // 递归深入试探成功直接逐层击穿返回',
        '    path.pop_back();  // 碰壁触发回溯，弹出当前格点恢复现场',
        '    return false;  // 当前分支穷尽无解返回失败'
      ]
    },
    stlCard: {
      title: '📘 递归系统栈与回溯',
      content: `
        <p><strong>回溯本质</strong>：探索完子树后必须恢复现场（<code>path.pop()</code>）。空间复杂度取决于最大递归深度 $O(V)$。</p>
      `
    },
    defaultInput: DEFAULT_MAZE,
    presets: { standard: DEFAULT_MAZE },
    parseInput: function() { return { success: true, data: DEFAULT_MAZE }; },
    generateFrames: generateDFSMazeFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      bfsMazeDef.render(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 3. Dijkstra 堆优化单源最短路
  // =========================================================================
  const DEFAULT_GRAPH = {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      { u: 0, v: 1, w: 4 },
      { u: 0, v: 2, w: 2 },
      { u: 1, v: 2, w: 1 },
      { u: 1, v: 3, w: 5 },
      { u: 2, v: 3, w: 8 },
      { u: 2, v: 4, w: 10 },
      { u: 3, v: 4, w: 2 }
    ]
  };

  function generateDijkstraFrames(input) {
    const graph = (input && Array.isArray(input.nodes)) ? input : DEFAULT_GRAPH;
    const n = graph.nodes.length;
    const dist = new Array(n).fill(Infinity);
    const visited = new Array(n).fill(false);
    const parent = new Array(n).fill(null);
    const frames = [];
    let step = 0;

    dist[0] = 0;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [0],
      state: { graph, dist: [...dist], visited: [...visited], curr: 0 },
      variables: { '起点': 0, '初始距离表': dist.map(d => d === Infinity ? '∞' : d).join(', ') },
      codeLine: 2,
      explanation: `【Dijkstra 堆优化启动】起点 0 的 dist 置为 0，其余节点置为 ∞。`
    }));

    for (let iter = 0; iter < n; iter++) {
      let u = -1;
      for (let i = 0; i < n; i++) {
        if (!visited[i] && (u === -1 || dist[i] < dist[u])) {
          u = i;
        }
      }

      if (u === -1 || dist[u] === Infinity) break;
      visited[u] = true;

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MARK_SORTED,
        indices: [u],
        state: { graph, dist: [...dist], visited: [...visited], curr: u },
        variables: { '锁定节点': u, '最短距离': dist[u] },
        codeLine: 5,
        explanation: `从优先队列弹出当前最小未确定距离节点 u = ${u} (dist = ${dist[u]})，永久锁定！`
      }));

      // 松弛相邻边
      for (const e of graph.edges) {
        let v = -1;
        if (e.u === u) v = e.v;
        else if (e.v === u) v = e.u;

        if (v !== -1 && !visited[v]) {
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.COMPARE,
            indices: [u, v],
            state: { graph, dist: [...dist], visited: [...visited], curr: u, checking: v },
            variables: { '检查边': `(${u}, ${v}, w=${e.w})`, 'dist[u]+w': dist[u] + e.w, '当前dist[v]': dist[v] === Infinity ? '∞' : dist[v] },
            codeLine: 7,
            explanation: `探测边 (${u}, ${v}) 权值 ${e.w}：dist[${u}] + ${e.w} = ${dist[u] + e.w}。`
          }));

          if (dist[u] + e.w < dist[v]) {
            dist[v] = dist[u] + e.w;
            parent[v] = u;

            frames.push(new SnapshotFrame({
              step: step++,
              action: ActionTypes.RELAX,
              indices: [v],
              state: { graph, dist: [...dist], visited: [...visited], curr: u, relaxed: v },
              variables: { '松弛成功': `dist[${v}] 刷新为 ${dist[v]}` },
              codeLine: 8,
              explanation: `⚡ 边松弛成功！发现更短路径，dist[${v}] 降为 ${dist[v]}！`
            }));
          }
        }
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { graph, dist: [...dist], visited: [...visited] },
      variables: { '单源最短路全部就绪': dist.join(', '), status: 'COMPLETE' },
      codeLine: 10,
      explanation: `Dijkstra 最短路算法执行完毕！各点最短距离为: [${dist.join(', ')}]。`
    }));

    return frames;
  }

  const dijkstraDef = {
    id: 'dijkstra',
    category: 'graphs',
    name: 'Dijkstra 堆优化单源最短路',
    en: 'Dijkstra (Heap Optimized)',
    meta: { tier: 'B组', time: 'O(E log V)', space: 'O(V)', stability: '稳定', is408: true, tags: ['贪心松弛', '优先队列', '非负权'] },
    templates: {
      python: [
        'import heapq  # 引入堆模块构建最小优先队列',
        'def dijkstra(graph, start):  # 单源最短路径主函数',
        '    dist = {start: 0}  # 源点到自身的初始距离为 0',
        '    pq = [(0, start)]  # 最小堆元素为 (当前已知距离, 顶点编号)',
        '    while pq:  # 优先队列不空持续执行贪心松弛',
        '        d, u = heapq.heappop(pq)  # 贪心弹出当前未定点中距离最小者',
        '        if d > dist[u]: continue  # 惰性删除：已存在更短路径则跳过失效旧记录',
        '        for v, w in graph[u]:  # 枚举当前定点的所有出边',
        '            if dist.get(v, float("inf")) > d + w:  # 尝试通过顶点 u 松弛相邻边',
        '                dist[v] = d + w  # 刷新到达邻接点 v 的最短估计值',
        '                heapq.heappush(pq, (d + w, v))  # 将松弛成功的新状态推入优先队列',
        '    return dist  # 返回源点到所有连通节点的最短距离哈希表'
      ],
      cpp: [
        'vector<int> dijkstra(int n, const vector<vector<pair<int,int>>>& adj, int s) {  // 堆优化Dijkstra主函数',
        '    vector<int> dist(n, 1e9);  // 距离数组初始化为正无穷',
        '    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;  // 小顶堆存储 (距离, 顶点)',
        '    dist[s] = 0; pq.push({0, s});  // 起点初始距离归零并推入优先队列',
        '    while (!pq.empty()) {  // 队列非空持续贪心拓展',
        '        auto [d, u] = pq.top(); pq.pop();  // 弹出当前距离最近的顶点',
        '        if (d > dist[u]) continue;  // 过滤无效冗余松弛状态',
        '        for (auto [v, w] : adj[u]) {  // 遍历所有出边尝试三角不等式松弛',
        '            if (dist[v] > d + w) { dist[v] = d + w; pq.push({dist[v], v}); }  // 松弛成功更新距离并入堆',
        '        }',
        '    }',
        '    return dist;  // 返回最短距离数组',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>贪心前提</strong>：边权必须非负！若存在负权边贪心成立性失效，必须改用 Bellman-Ford / SPFA。</p>
      `
    },
    defaultInput: DEFAULT_GRAPH,
    presets: { standard: DEFAULT_GRAPH },
    parseInput: function() { return { success: true, data: DEFAULT_GRAPH }; },
    generateFrames: generateDijkstraFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageSvg = document.getElementById('stageSvg');
      if (!stageSvg) return;
      switchStageLayer('stageSvg');

      const state = frame.state || {};
      const graph = state.graph || DEFAULT_GRAPH;
      const dist = state.dist || [];
      const visited = state.visited || [];
      const n = graph.nodes.length;

      // 极坐标环形布局
      const coords = [];
      const cx = 400, cy = 220, r = 140;
      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        coords[i] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
      }

      let svg = '';
      // 绘制边
      graph.edges.forEach(e => {
        const p1 = coords[e.u], p2 = coords[e.v];
        if (p1 && p2) {
          svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="var(--border-default)" stroke-width="2"/>`;
          svg += `<text x="${(p1.x + p2.x) / 2}" y="${(p1.y + p2.y) / 2 - 4}" fill="#ce9178" font-size="12" font-weight="bold">${e.w}</text>`;
        }
      });

      // 绘制节点
      for (let i = 0; i < n; i++) {
        const isVis = visited[i];
        const isCur = (state.curr === i);
        let color = isVis ? '#4ec9b0' : (isCur ? '#dcdcaa' : 'var(--state-default)');
        const dText = dist[i] === Infinity ? '∞' : dist[i];

        svg += `
          <g transform="translate(${coords[i].x}, ${coords[i].y})">
            <circle r="22" fill="${color}" stroke="#fff" stroke-width="2"/>
            <text text-anchor="middle" dy="5" fill="#000" font-weight="bold" font-size="14">${i}</text>
            <text text-anchor="middle" dy="36" fill="var(--text-secondary)" font-size="11">dist:${dText}</text>
          </g>
        `;
      }

      stageSvg.innerHTML = svg;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 4. Kahn 拓扑排序 (Topological Sort)
  // =========================================================================
  const DEFAULT_DAG = {
    nodes: [0, 1, 2, 3, 4, 5],
    edges: [
      { u: 5, v: 2 },
      { u: 5, v: 0 },
      { u: 4, v: 0 },
      { u: 4, v: 1 },
      { u: 2, v: 3 },
      { u: 3, v: 1 }
    ]
  };

  function generateTopologicalSortFrames(input) {
    const dag = (input && Array.isArray(input.nodes)) ? input : DEFAULT_DAG;
    const n = dag.nodes.length;
    const inDegree = new Array(n).fill(0);

    dag.edges.forEach(e => inDegree[e.v]++);

    const frames = [];
    let step = 0;
    const queue = [];
    const topoOrder = [];

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { dag, inDegree: [...inDegree], queue: [], topoOrder: [] },
      variables: { '初始入度表': inDegree.map((d, i) => `${i}:${d}`).join(', ') },
      codeLine: 2,
      explanation: `【Kahn 拓扑排序启动】统计 DAG 中所有节点入度。入度为 0 的节点进入队列。`
    }));

    for (let i = 0; i < n; i++) {
      if (inDegree[i] === 0) queue.push(i);
    }

    while (queue.length > 0) {
      const u = queue.shift();
      topoOrder.push(u);

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.POP,
        indices: [u],
        state: { dag, inDegree: [...inDegree], queue: [...queue], topoOrder: [...topoOrder], curr: u },
        variables: { '出队节点': u, '当前拓扑序': topoOrder.join(' -> ') },
        codeLine: 5,
        explanation: `节点 ${u} 入度为 0，弹出并加入拓扑排序序列。开始斩断其所有出边。`
      }));

      for (const e of dag.edges) {
        if (e.u === u) {
          const v = e.v;
          inDegree[v]--;

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.MODIFY,
            indices: [v],
            state: { dag, inDegree: [...inDegree], queue: [...queue], topoOrder: [...topoOrder], edge: e },
            variables: { '斩断边': `${u} -> ${v}`, '节点入度更新': `in[${v}] = ${inDegree[v]}` },
            codeLine: 7,
            explanation: `边 (${u} -> ${v}) 移除，邻居 ${v} 的入度消减为 ${inDegree[v]}。`
          }));

          if (inDegree[v] === 0) {
            queue.push(v);
            frames.push(new SnapshotFrame({
              step: step++,
              action: ActionTypes.PUSH,
              indices: [v],
              state: { dag, inDegree: [...inDegree], queue: [...queue], topoOrder: [...topoOrder] },
              variables: { '零入度入队': v },
              codeLine: 8,
              explanation: `节点 ${v} 入度减至 0，加入待处理队列！`
            }));
          }
        }
      }
    }

    const hasCycle = (topoOrder.length < n);
    frames.push(new SnapshotFrame({
      step: step++,
      action: hasCycle ? ActionTypes.BACKTRACK : ActionTypes.DONE,
      indices: [],
      state: { dag, inDegree: [...inDegree], topoOrder: [...topoOrder], hasCycle },
      variables: { '最终拓扑序': topoOrder.join(' -> '), '是否有环': hasCycle ? '存在有向环' : '无环(合法DAG)' },
      codeLine: 10,
      explanation: hasCycle
        ? `⚠️ 检测到环路！拓扑序节点数 ${topoOrder.length} < ${n}，图中存在有向环。`
        : `🎉 拓扑排序完成！全局拓扑序列为: ${topoOrder.join(' -> ')}。`
    }));

    return frames;
  }

  const topologicalSortDef = {
    id: 'topological_sort',
    category: 'graphs',
    name: 'Kahn 拓扑排序消入度',
    en: 'Topological Sort (Kahn)',
    meta: { tier: 'B组', time: 'O(V+E)', space: 'O(V)', stability: '稳定', is408: true, tags: ['DAG', '入度消减', '判环'] },
    templates: {
      python: [
        'def topo_sort(n, edges):  # Kahn 算法拓扑排序主入口',
        '    in_deg = [0] * n  # 统计各顶点入度数组',
        '    adj = [[] for _ in range(n)]  # 初始化邻接表存储图结构',
        '    for u, v in edges: adj[u].append(v); in_deg[v] += 1  # 建图并统计入度',
        '    q = deque([i for i in range(n) if in_deg[i] == 0])  # 将所有入度为 0 的节点推入队列',
        '    order = []  # 记录拓扑排序输出序列',
        '    while q:  # 队列非空持续消减入度',
        '        u = q.popleft(); order.append(u)  # 弹出队头零入度节点加入排序序列',
        '        for v in adj[u]:  # 遍历当前节点的所有下游邻接点',
        '            in_deg[v] -= 1  # 对应邻接点入度减 1 (剥离该前驱依赖)',
        '            if in_deg[v] == 0: q.append(v)  # 若入度归零则推入就绪队列',
        '    return order if len(order) == n else []  # 若排出的节点数等于n则合法，否则图中有环'
      ],
      cpp: [
        'vector<int> topo_sort(int n, const vector<pair<int,int>>& edges) {  // Kahn拓扑排序算法入口',
        '    vector<int> in_deg(n, 0);  // 记录每个顶点的入度数组',
        '    vector<vector<int>> adj(n);  // 邻接表结构存储有向边',
        '    for (auto& [u, v] : edges) { adj[u].push_back(v); in_deg[v]++; }  // 构建邻接表并统计入度',
        '    queue<int> q; for (int i = 0; i < n; ++i) if (in_deg[i] == 0) q.push(i);  // 零入度起点全部入队',
        '    vector<int> order;  // 记录拓扑输出序列',
        '    while (!q.empty()) {  // 队列非空持续消减出度',
        '        int u = q.front(); q.pop(); order.push_back(u);  // 零入度节点弹出加入序列',
        '        for (int v : adj[u]) {  // 遍历所有后继节点',
        '            if (--in_deg[v] == 0) q.push(v);  // 入度减至0后加入等待队列',
        '        }  // 邻接点消减完毕',
        '    } return order.size() == n ? order : vector<int>{}; }  // 若长度等于n返回拓扑序否则有环'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>判环判定准则</strong>：若拓扑序列长度小于顶点数 $V$，则该有向图必然包含<strong>有向环</strong>（AOV 网不可调度）。</p>
      `
    },
    defaultInput: DEFAULT_DAG,
    presets: { standard: DEFAULT_DAG },
    parseInput: function() { return { success: true, data: DEFAULT_DAG }; },
    generateFrames: generateTopologicalSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageSvg = document.getElementById('stageSvg');
      if (!stageSvg) return;
      switchStageLayer('stageSvg');

      const state = frame.state || {};
      const dag = state.dag || DEFAULT_DAG;
      const inDegree = state.inDegree || [];
      const n = dag.nodes.length;

      const coords = [];
      const cx = 400, cy = 200, r = 130;
      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        coords[i] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
      }

      let svg = '<defs><marker id="arrowDAG" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ce9178"/></marker></defs>';

      dag.edges.forEach(e => {
        const p1 = coords[e.u], p2 = coords[e.v];
        if (p1 && p2) {
          svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#ce9178" stroke-width="2" marker-end="url(#arrowDAG)"/>`;
        }
      });

      for (let i = 0; i < n; i++) {
        const isDone = state.topoOrder && state.topoOrder.includes(i);
        const color = isDone ? '#4ec9b0' : 'var(--state-default)';
        svg += `
          <g transform="translate(${coords[i].x}, ${coords[i].y})">
            <circle r="20" fill="${color}" stroke="#fff" stroke-width="2"/>
            <text text-anchor="middle" dy="5" fill="#000" font-weight="bold" font-size="14">${i}</text>
            <text text-anchor="middle" dy="32" fill="var(--text-secondary)" font-size="10">入度:${inDegree[i]}</text>
          </g>
        `;
      }

      stageSvg.innerHTML = svg;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 5. Kruskal 最小生成树 (MST)
  // =========================================================================
  const DEFAULT_MST_GRAPH = {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      { u: 0, v: 1, w: 1 },
      { u: 1, v: 2, w: 2 },
      { u: 0, v: 2, w: 7 },
      { u: 1, v: 3, w: 3 },
      { u: 2, v: 4, w: 4 },
      { u: 3, v: 4, w: 5 }
    ]
  };

  function generateKruskalFrames(input) {
    const graph = (input && Array.isArray(input.nodes)) ? input : DEFAULT_MST_GRAPH;
    const n = graph.nodes.length;
    const edges = [...graph.edges].sort((a, b) => a.w - b.w);
    const parent = Array.from({ length: n }, (_, i) => i);
    const mstEdges = [];
    const frames = [];
    let step = 0;
    let totalWeight = 0;

    function find(x) {
      return parent[x] === x ? x : (parent[x] = find(parent[x]));
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { graph, edges, mstEdges: [], totalWeight: 0 },
      variables: { '边总数': edges.length, '顶点数': n, '排序边权': edges.map(e => e.w).join(' <= ') },
      codeLine: 2,
      explanation: `【Kruskal 最小生成树启动】所有边按权值升序排序。利用并查集判环贪心选边。`
    }));

    for (const e of edges) {
      const rootU = find(e.u);
      const rootV = find(e.v);

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.COMPARE,
        indices: [e.u, e.v],
        state: { graph, edges, mstEdges: [...mstEdges], currentEdge: e, totalWeight },
        variables: { '考察边': `(${e.u}, ${e.v}, w=${e.w})`, rootU, rootV },
        codeLine: 4,
        explanation: `考察权值最小候选边 (${e.u}, ${e.v}) 权值 ${e.w}：端点所属根集合为 ${rootU} 与 ${rootV}。`
      }));

      if (rootU !== rootV) {
        parent[rootU] = rootV;
        mstEdges.push(e);
        totalWeight += e.w;

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MARK_SORTED,
          indices: [e.u, e.v],
          state: { graph, edges, mstEdges: [...mstEdges], currentEdge: e, totalWeight },
          variables: { '采纳边': `(${e.u}, ${e.v})`, '已选边数': mstEdges.length, '总权值': totalWeight },
          codeLine: 6,
          explanation: `两端点不连通，采纳该边！两集合合并，累计生成树权值 +${e.w} = ${totalWeight}。`
        }));

        if (mstEdges.length === n - 1) break;
      } else {
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.BACKTRACK,
          indices: [e.u, e.v],
          state: { graph, edges, mstEdges: [...mstEdges], currentEdge: e, totalWeight },
          variables: { '成环舍弃': `(${e.u}, ${e.v})` },
          codeLine: 8,
          explanation: `⚠️ 端点 ${e.u} 与 ${e.v} 已在同一连通分量，采纳将引发环路，果断舍弃！`
        }));
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { graph, edges, mstEdges: [...mstEdges], totalWeight },
      variables: { 'MST总权值': totalWeight, '包含边数': mstEdges.length, status: 'COMPLETE' },
      codeLine: 10,
      explanation: `Kruskal 最小生成树构建完毕！总权值精准为 ${totalWeight}。`
    }));

    return frames;
  }

  const kruskalDef = {
    id: 'kruskal',
    category: 'graphs',
    name: 'Kruskal 最小生成树 (MST)',
    en: 'Kruskal MST',
    meta: { tier: 'B组', time: 'O(E log E)', space: 'O(V)', stability: '稳定', is408: true, tags: ['并查集判环', '边权贪心', '稀疏图'] },
    templates: {
      python: [
        'def kruskal(n, edges):  # 最小生成树 Kruskal 算法主函数',
        '    edges.sort(key=lambda e: e[2])  # 贪心第一步：将所有边按权值升序排序',
        '    p = list(range(n))  # 初始化并查集，每个顶点各自独立构成一个集合',
        '    def find(x):  # 并查集查根函数，含路径压缩优化',
        '        if p[x] != x: p[x] = find(p[x])  # 递归扁平化树高至 O(α(N))',
        '        return p[x]  # 返回所属集合的绝对代表根',
        '    mst, total = [], 0  # 存储选中的生成树边与累计总权值',
        '    for u, v, w in edges:  # 自小到大贪心挑选边',
        '        ru, rv = find(u), find(v)  # 查询边两端顶点所属集合的根节点',
        '        if ru != rv:  # 若两端不在同一个连通分量中，则选入不会构成环',
        '            p[ru] = rv; mst.append((u, v, w)); total += w  # 合并两集合并累加权重',
        '    return total  # 返回最小生成树最小权值总和'
      ],
      cpp: [
        'int kruskal(int n, vector<tuple<int,int,int>>& edges) {  // 最小生成树主函数入口',
        '    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return get<2>(a) < get<2>(b); });  // 按边权自小到大排序',
        '    vector<int> p(n); iota(p.begin(), p.end(), 0);  // 初始化并查集各节点父指针指向自身',
        '    auto find = [&](auto& self, int x) -> int {  // 递归带路径压缩的查根函数',
        '        return p[x] == x ? x : (p[x] = self(self, p[x]));  // 路径压缩将沿途节点直连根节点',
        '    };  // 闭包函数结束',
        '    int total = 0, count = 0;  // 累计权值总和与合并边计数',
        '    for (auto& [u, v, w] : edges) {  // 贪心从小到大遍历所有候选边',
        '        int ru = find(find, u), rv = find(find, v);  // 查询边两端顶点的所属集合根节点',
        '        if (ru != rv) {  // 若两端未连通则安全并入防止成环',
        '            p[ru] = rv; total += w; if (++count == n - 1) break;  // 合并集合并累加权重',
        '    } } return total; }  // 返回最小生成树总权值'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>稀疏图更优</strong>：Kruskal 算法主要开销在于对边排序 $O(E \log E)$，非常适合稀疏图；稠密图更适合 Prim 算法。</p>
      `
    },
    defaultInput: DEFAULT_MST_GRAPH,
    presets: { standard: DEFAULT_MST_GRAPH },
    parseInput: function() { return { success: true, data: DEFAULT_MST_GRAPH }; },
    generateFrames: generateKruskalFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageSvg = document.getElementById('stageSvg');
      if (!stageSvg) return;
      switchStageLayer('stageSvg');

      const state = frame.state || {};
      const graph = state.graph || DEFAULT_MST_GRAPH;
      const mstEdges = state.mstEdges || [];
      const curEdge = state.currentEdge;
      const n = graph.nodes.length;

      const coords = [];
      const cx = 400, cy = 210, r = 130;
      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        coords[i] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
      }

      let svg = '';
      graph.edges.forEach(e => {
        const p1 = coords[e.u], p2 = coords[e.v];
        if (p1 && p2) {
          const isMST = mstEdges.some(m => (m.u === e.u && m.v === e.v) || (m.u === e.v && m.v === e.u));
          const isCur = curEdge && ((curEdge.u === e.u && curEdge.v === e.v) || (curEdge.u === e.v && curEdge.v === e.u));

          let color = 'var(--border-default)';
          let width = 2;
          if (isMST) { color = '#4ec9b0'; width = 4; }
          else if (isCur) { color = '#dcdcaa'; width = 3; }

          svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${color}" stroke-width="${width}"/>`;
          svg += `<text x="${(p1.x + p2.x) / 2}" y="${(p1.y + p2.y) / 2 - 4}" fill="${isMST ? '#4ec9b0' : '#ce9178'}" font-size="12" font-weight="bold">${e.w}</text>`;
        }
      });

      for (let i = 0; i < n; i++) {
        svg += `
          <g transform="translate(${coords[i].x}, ${coords[i].y})">
            <circle r="20" fill="var(--state-default)" stroke="#fff" stroke-width="2"/>
            <text text-anchor="middle" dy="5" fill="#000" font-weight="bold" font-size="14">${i}</text>
          </g>
        `;
      }

      stageSvg.innerHTML = svg;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 6. 欧拉回路 / 通路 (Eulerian Path/Circuit - Hierholzer)
  // =========================================================================
  const DEFAULT_EULER_GRAPH = {
    nodes: [0, 1, 2, 3, 4],
    edges: [
      { u: 0, v: 1 },
      { u: 1, v: 2 },
      { u: 2, v: 0 },
      { u: 1, v: 3 },
      { u: 3, v: 4 },
      { u: 4, v: 1 }
    ] // 两个三角形蝴蝶图，1号节点度数为 4，其余度数为 2，存在欧拉回路
  };

  function generateEulerianPathFrames(input) {
    const graph = (input && Array.isArray(input.nodes)) ? input : DEFAULT_EULER_GRAPH;
    const n = graph.nodes.length;
    const deg = new Array(n).fill(0);
    graph.edges.forEach(e => { deg[e.u]++; deg[e.v]++; });

    const frames = [];
    let step = 0;

    // 检查度数奇偶
    const oddNodes = [];
    for (let i = 0; i < n; i++) {
      if (deg[i] % 2 !== 0) oddNodes.push(i);
    }

    const isCircuit = (oddNodes.length === 0);
    const isPath = (oddNodes.length === 2);

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { graph, deg: [...deg], path: [] },
      variables: { '奇度数顶点数': oddNodes.length, '判决': isCircuit ? '存在欧拉回路' : (isPath ? '存在欧拉通路' : '无欧拉路径') },
      codeLine: 2,
      explanation: isCircuit
        ? `【欧拉判决】所有节点度数均为偶数，全图必定存在完美的【欧拉回路】！`
        : (isPath ? `【欧拉判决】恰有两个节点度数为奇数，存在【欧拉通路】。` : `无法构成一笔画欧拉路。`)
    }));

    // Hierholzer 遍历模拟
    const adj = Array.from({ length: n }, () => []);
    graph.edges.forEach((e, idx) => {
      adj[e.u].push({ to: e.v, edgeId: idx });
      adj[e.v].push({ to: e.u, edgeId: idx });
    });

    const usedEdge = new Array(graph.edges.length).fill(false);
    const circuit = [];
    const stack = [isPath ? oddNodes[0] : 0];

    while (stack.length > 0) {
      const u = stack[stack.length - 1];
      const nextEdge = adj[u].find(item => !usedEdge[item.edgeId]);

      if (nextEdge) {
        usedEdge[nextEdge.edgeId] = true;
        stack.push(nextEdge.to);
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.PUSH,
          indices: [u, nextEdge.to],
          state: { graph, deg: [...deg], currEdge: nextEdge.edgeId, stack: [...stack], circuit: [...circuit] },
          variables: { '走过边': `${u} - ${nextEdge.to}`, '当前栈顶': nextEdge.to },
          codeLine: 5,
          explanation: `沿边 (${u} - ${nextEdge.to}) 前进，即刻删边防重，新顶点入栈。`
        }));
      } else {
        const popped = stack.pop();
        circuit.push(popped);
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.POP,
          indices: [popped],
          state: { graph, deg: [...deg], stack: [...stack], circuit: [...circuit] },
          variables: { '无边可走回退': popped, '记录欧拉序列': circuit.join(' <- ') },
          codeLine: 7,
          explanation: `顶点 ${popped} 无剩余邻边可走，回溯退栈并记录进欧拉路径。`
        }));
      }
    }

    circuit.reverse();
    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: [],
      state: { graph, deg: [...deg], circuit: [...circuit] },
      variables: { '完整欧拉一笔画轨迹': circuit.join(' -> '), status: 'COMPLETE' },
      codeLine: 9,
      explanation: `Hierholzer 递归回溯完毕！最终欧拉轨迹为: [${circuit.join(' -> ')}]。`
    }));

    return frames;
  }

  const eulerianPathDef = {
    id: 'eulerian_path',
    category: 'graphs',
    name: '欧拉回路 / 通路 (Hierholzer)',
    en: 'Eulerian Path/Circuit',
    meta: { tier: 'B组', time: 'O(V+E)', space: 'O(V+E)', stability: '稳定', is408: true, tags: ['度数奇偶', '一笔画', '删边递归'] },
    templates: {
      python: [
        'def eulerian_path(graph, start):  # Hierholzer 欧拉通路算法主函数',
        '    circuit = []  # 记录逆序欧拉回路节点序列',
        '    def dfs(u):  # 深度优先搜索删边递归',
        '        while graph[u]:  # 当前顶点还有未走的相邻连通边',
        '            v = graph[u].pop()  # 立即走过并移除该边（无向边需对称删）',
        '            graph[v].remove(u)  # 双向移除反向连通边',
        '            dfs(v)  # 深入探索下一节点',
        '        circuit.append(u)  # 所有出边穷尽时，将当前死胡同顶点压入回路',
        '    dfs(start)  # 从指定欧拉起点出发深入遍历',
        '    return circuit[::-1]  # 逆序翻转即得正向欧拉一笔画路径'
      ],
      cpp: [
        'void hierholzer(int u, vector<vector<int>>& adj, vector<int>& path) {  // Hierholzer删边递归算法',
        '    while (!adj[u].empty()) {  // 当当前顶点仍有邻接边时持续探索',
        '        int v = adj[u].back(); adj[u].pop_back();  // 弹出当前末尾边完成走边',
        '        hierholzer(v, adj, path);  // 深入邻接点探索',
        '    }  // 出边穷尽',
        '    path.push_back(u);  // 回溯将节点压入路径序列',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>欧拉图充要条件</strong>：无向连通图中，所有顶点度数均为偶数存在欧拉回路；恰有两个奇度数顶点存在欧拉通路。</p>
      `
    },
    defaultInput: DEFAULT_EULER_GRAPH,
    presets: { standard: DEFAULT_EULER_GRAPH },
    parseInput: function() { return { success: true, data: DEFAULT_EULER_GRAPH }; },
    generateFrames: generateEulerianPathFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const stageSvg = document.getElementById('stageSvg');
      if (!stageSvg) return;
      switchStageLayer('stageSvg');

      const state = frame.state || {};
      const graph = state.graph || DEFAULT_EULER_GRAPH;
      const deg = state.deg || [];
      const n = graph.nodes.length;

      const coords = [];
      const cx = 400, cy = 210, r = 130;
      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        coords[i] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
      }

      let svg = '';
      graph.edges.forEach((e, idx) => {
        const p1 = coords[e.u], p2 = coords[e.v];
        if (p1 && p2) {
          const isPassed = (state.currEdge === idx);
          svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${isPassed ? '#4ec9b0' : 'var(--border-default)'}" stroke-width="${isPassed ? 4 : 2}"/>`;
        }
      });

      for (let i = 0; i < n; i++) {
        const isOdd = (deg[i] % 2 !== 0);
        svg += `
          <g transform="translate(${coords[i].x}, ${coords[i].y})">
            <circle r="20" fill="${isOdd ? '#ce9178' : 'var(--state-default)'}" stroke="#fff" stroke-width="2"/>
            <text text-anchor="middle" dy="5" fill="#000" font-weight="bold" font-size="14">${i}</text>
            <text text-anchor="middle" dy="32" fill="var(--text-secondary)" font-size="10">度:${deg[i]}</text>
          </g>
        `;
      }

      stageSvg.innerHTML = svg;
      syncInspectorUI(frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // Register all 6 Graph algorithms + Aliases
  const allGraphAlgorithms = [
    bfsMazeDef,
    dfsMazeDef,
    dijkstraDef,
    topologicalSortDef,
    kruskalDef,
    eulerianPathDef
  ];

  allGraphAlgorithms.forEach(def => {
    if (global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.register === 'function') {
      global.AlgoSystem.visualizers.register(def.id, def);
    }
  });

  // Aliases
  if (global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.register === 'function') {
    global.AlgoSystem.visualizers.register('topo_sort', topologicalSortDef);
    global.AlgoSystem.visualizers.register('eulerian', eulerianPathDef);
  }

  global.AlgoSystem.visualizers.graphs = {
    algorithms: allGraphAlgorithms,
    bfsMaze: bfsMazeDef,
    dfsMaze: dfsMazeDef,
    dijkstra: dijkstraDef,
    topologicalSort: topologicalSortDef,
    kruskal: kruskalDef,
    eulerianPath: eulerianPathDef
  };

})(typeof window !== 'undefined' ? window : globalThis);
