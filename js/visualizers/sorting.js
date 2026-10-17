/**
 * @file sorting.js
 * @description 10 Classic Sorting Algorithms Visualizers: Bubble, Selection, Insertion, Shell, Merge, Quick (408), Heap, Counting, Radix (LSD), Bucket.
 * @namespace window.AlgoSystem.visualizers.sorting
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
    DONE: 'DONE'
  };

  const SnapshotFrame = (global.AlgoSystem.Types && global.AlgoSystem.Types.SnapshotFrame) || global.AlgoSystem.SnapshotFrame;

  // Helper for UI stage layer switching
  function switchStageLayer(activeId) {
    if (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function') {
      const layers = document.querySelectorAll('.stage-layer');
      if (layers && layers.length > 0) {
        layers.forEach(el => {
          if (el.id === activeId) {
            el.classList.remove('hidden');
            el.classList.add('active');
          } else {
            el.classList.add('hidden');
            el.classList.remove('active');
          }
        });
        return;
      }
    }
    const layers = ['stageArray', 'stageSvg', 'stageGrid', 'stageSandbox', 'stageHeapDual'];
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

  // Common UI Sync Helper
  function syncInspectorUI(frame) {
    if (!frame) return;

    // 1. Explanation narrative
    const explanationText = document.getElementById('stepExplanationText');
    if (explanationText && frame.explanation) {
      explanationText.innerHTML = frame.explanation;
    }

    // 2. Variable watch panel
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
            <td style="font-size:11px; color:var(--text-muted);">局部变量</td>
          </tr>
        `).join('');
      }
    }

    // 3. Code line highlight
    const codeBlock = document.getElementById('codeBlock');
    if (codeBlock && frame.codeLine) {
      const lines = codeBlock.querySelectorAll('.code-line');
      lines.forEach((line, i) => {
        line.classList.toggle('line-highlight', (i + 1 === frame.codeLine));
      });
    }

    // 4. Action badge
    const actionBadge = document.getElementById('actionBadge');
    if (actionBadge && frame.action) {
      actionBadge.textContent = frame.action;
    }
  }


  // =========================================================================
  // 6 Enhanced Physical Metaphor Stage Renderers (去死板化物理直觉可视重定义)
  // =========================================================================

  // 1. Bubble Sort: Deep-Sea Bubble Chamber (深海气泡上浮实验仓)
  function renderBubbleSortStage(arr, frame, sortedIndices = null) {
    const stageArray = document.getElementById('stageArray');
    if (!stageArray) return;
    switchStageLayer('stageArray');

    const values = Array.isArray(arr) ? arr : [];
    const maxVal = Math.max(...values.map(v => typeof v === 'number' ? Math.abs(v) : 1), 1);
    const indices = Array.isArray(frame.indices) ? frame.indices : [];
    const isDone = frame.action === ActionTypes.DONE;
    const isSwapping = (frame.action === ActionTypes.SWAP || frame.action === ActionTypes.MODIFY);
    const isComparing = frame.action === ActionTypes.COMPARE;
    const sortedSet = sortedIndices || new Set();

    const swappedVar = frame.variables && frame.variables.swapped;
    const currentRound = frame.variables && frame.variables['当前轮次'] ? frame.variables['当前轮次'] : (frame.variables && frame.variables.i !== undefined ? `第 ${frame.variables.i + 1} 轮` : '');

    let html = `
      <div class="bubble-sort-chamber" style="display:flex; flex-direction:column; width:100%; height:100%; padding:12px; background:radial-gradient(circle at 50% 20%, rgba(14, 116, 144, 0.22) 0%, rgba(8, 20, 36, 0.4) 100%); border-radius:var(--radius-md); border:1px solid rgba(56, 189, 248, 0.25); box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12px; color:var(--text-secondary); border-bottom:1px solid rgba(56, 189, 248, 0.15); padding-bottom:6px;">
          <span>🫧 <strong>深海气泡上浮实验仓</strong> (轻气泡上浮升腾，重石沉底结晶)</span>
          <div style="display:flex; gap:12px; align-items:center;">
            ${currentRound ? `<span style="font-size:11px; color:var(--text-muted);">${currentRound}</span>` : ''}
            <span style="font-size:11px; padding:2px 8px; border-radius:10px; background:${swappedVar ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.15)'}; color:${swappedVar ? 'var(--state-sorted)' : 'var(--text-muted)'}; border:1px solid ${swappedVar ? 'var(--state-sorted)' : 'rgba(255,255,255,0.1)'};">
              ${swappedVar ? '⚡ 正在置换 (非完全有序)' : '🔒 零置换检测 (就绪退出)'}
            </span>
          </div>
        </div>
        <div class="bubble-tank-area" style="position:relative; flex:1; display:flex; align-items:flex-end; justify-content:center; gap:8px; width:100%; padding-bottom:10px;">
    `;

    html += values.map((val, idx) => {
      const isSorted = isDone || sortedSet.has(idx);
      const isComparingElement = isComparing && indices.includes(idx);
      const isSwappingElement = isSwapping && indices.includes(idx);

      const sizePct = Math.max(38, Math.min(76, Math.round((Math.abs(val) / maxVal) * 72)));
      const floatUp = isSwappingElement ? 36 : (isComparingElement ? 20 : 0);

      let bubbleBg = 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85) 0%, rgba(56,189,248,0.7) 40%, rgba(14,116,144,0.9) 100%)';
      let borderGlow = '0 0 12px rgba(56,189,248,0.4)';
      let statusTag = '';

      if (isSorted) {
        bubbleBg = 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(16,185,129,0.75) 40%, rgba(6,95,70,0.95) 100%)';
        borderGlow = '0 0 10px rgba(16,185,129,0.5)';
        statusTag = '<span style="font-size:9px; color:var(--state-sorted);">⚓沉底</span>';
      } else if (isSwappingElement) {
        bubbleBg = 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(244,63,94,0.8) 40%, rgba(159,18,57,0.95) 100%)';
        borderGlow = '0 0 16px rgba(244,63,94,0.7)';
        statusTag = '<span style="font-size:9px; color:var(--state-modify);">▲升腾</span>';
      } else if (isComparingElement) {
        bubbleBg = 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(245,158,11,0.8) 40%, rgba(180,83,9,0.95) 100%)';
        borderGlow = '0 0 14px rgba(245,158,11,0.6)';
        statusTag = '<span style="font-size:9px; color:var(--state-compare);">👁️比对</span>';
      }

      return `
        <div class="bubble-column" style="flex:1; max-width:68px; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
          <div class="bubble-sphere" style="width:${sizePct}px; height:${sizePct}px; border-radius:50%; background:${bubbleBg}; box-shadow:${borderGlow}; display:flex; flex-direction:column; align-items:center; justify-content:center; transform:translateY(-${floatUp}px); transition:all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); cursor:default; user-select:none;">
            <span style="font-size:13px; font-weight:bold; color:#0f172a; text-shadow:0 1px 1px rgba(255,255,255,0.8);">${val}</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; margin-top:6px; min-height:28px;">
            ${statusTag}
            <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">[${idx}]</span>
          </div>
        </div>
      `;
    }).join('');

    html += `
        </div>
      </div>
    `;

    stageArray.innerHTML = html;
    syncInspectorUI(frame);
  }

  // 2. Selection Sort: Robot Crane & Radar Scanner (自动化机械爪探针与流水线工作台)
  function renderSelectionSortStage(arr, frame, sortedIndices = null) {
    const stageArray = document.getElementById('stageArray');
    if (!stageArray) return;
    switchStageLayer('stageArray');

    const values = Array.isArray(arr) ? arr : [];
    const maxVal = Math.max(...values.map(v => typeof v === 'number' ? Math.abs(v) : 1), 1);
    const indices = Array.isArray(frame.indices) ? frame.indices : [];
    const isDone = frame.action === ActionTypes.DONE;
    const sortedSet = sortedIndices || new Set();

    const minIdx = (frame.variables && typeof frame.variables.minIdx === 'number') ? frame.variables.minIdx : -1;
    const currentI = (frame.variables && typeof frame.variables.i === 'number') ? frame.variables.i : -1;
    const currentJ = (frame.variables && typeof frame.variables.j === 'number') ? frame.variables.j : -1;

    let html = `
      <div class="selection-sort-stage" style="display:flex; flex-direction:column; width:100%; height:100%; padding:12px; background:linear-gradient(180deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%); border-radius:var(--radius-md); border:1px solid var(--border-default); box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12px; color:var(--text-secondary); border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
          <span>🏗️ <strong>自动化机械爪雷达抓放台</strong> (探针全景扫描，机械爪定位全局极值直发坑位)</span>
          <div style="display:flex; gap:10px; font-size:11px;">
            <span style="color:var(--state-compare);">📡 探针位置: ${currentJ >= 0 ? `[${currentJ}]` : '闲置'}</span>
            <span style="color:var(--state-modify);">🧲 极小值锁定: ${minIdx >= 0 ? `a[${minIdx}]=${values[minIdx]}` : '无'}</span>
          </div>
        </div>
        <div class="crane-bench-area" style="position:relative; flex:1; display:flex; align-items:flex-end; justify-content:center; gap:8px; width:100%; padding-bottom:10px;">
    `;

    html += values.map((val, idx) => {
      const isSorted = isDone || sortedSet.has(idx);
      const isMin = (idx === minIdx);
      const isTargetHole = (idx === currentI && !isSorted);
      const isScanning = (idx === currentJ);
      const isSwapping = (frame.action === ActionTypes.SWAP && indices.includes(idx));

      const heightPct = Math.max(16, Math.min(84, Math.round((Math.abs(val) / maxVal) * 78)));

      let barStyle = 'background:var(--state-default); border:1px solid var(--border-default);';
      let tagBadge = '';

      if (isSorted) {
        barStyle = 'background:var(--state-sorted); border:1px solid #10b981; box-shadow:0 0 8px rgba(16,185,129,0.3);';
        tagBadge = '<span style="font-size:9px; color:var(--state-sorted);">🔒就位</span>';
      } else if (isSwapping) {
        barStyle = 'background:var(--state-modify); border:2px solid #fff; box-shadow:0 0 16px rgba(244,63,94,0.6);';
        tagBadge = '<span style="font-size:9px; color:var(--state-modify);">🧲吊装</span>';
      } else if (isMin) {
        barStyle = 'background:linear-gradient(180deg, #f43f5e 0%, #be123c 100%); border:2px solid #fda4af; box-shadow:0 0 12px rgba(244,63,94,0.5);';
        tagBadge = '<span style="font-size:9px; color:#f43f5e; font-weight:bold;">🧲极小</span>';
      } else if (isScanning) {
        barStyle = 'background:linear-gradient(180deg, #f59e0b 0%, #b45309 100%); border:2px solid #fde68a; box-shadow:0 0 12px rgba(245,158,11,0.5);';
        tagBadge = '<span style="font-size:9px; color:#f59e0b;">📡扫描</span>';
      } else if (isTargetHole) {
        barStyle = 'background:rgba(56,189,248,0.2); border:2px dashed var(--color-primary-hover);';
        tagBadge = '<span style="font-size:9px; color:var(--color-primary-hover);">🎯目标槽</span>';
      }

      return `
        <div class="pallet-column" style="flex:1; max-width:54px; height:100%; display:flex; flex-direction:column; justify-content:flex-end; align-items:center;">
          <div class="crane-pallet" style="height:${heightPct}%; width:100%; border-radius:4px 4px 0 0; display:flex; flex-direction:column; justify-content:space-between; align-items:center; ${barStyle} transition:all 0.22s ease;">
            <span style="font-size:12px; font-weight:bold; color:#ffffff; margin-top:3px; text-shadow:0 1px 2px rgba(0,0,0,0.6);">${val}</span>
            <div style="width:100%; height:4px; background:rgba(0,0,0,0.25);"></div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; margin-top:5px; min-height:26px;">
            ${tagBadge}
            <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">[${idx}]</span>
          </div>
        </div>
      `;
    }).join('');

    html += `
        </div>
      </div>
    `;

    stageArray.innerHTML = html;
    syncInspectorUI(frame);
  }

  // 3. Insertion Sort: Playing Card Hand Rack (扑克牌理牌手牌架)
  function renderInsertionSortStage(arr, frame, sortedIndices = null) {
    const stageArray = document.getElementById('stageArray');
    if (!stageArray) return;
    switchStageLayer('stageArray');

    const values = Array.isArray(arr) ? arr : [];
    const n = values.length;
    const indices = Array.isArray(frame.indices) ? frame.indices : [];
    const isDone = frame.action === ActionTypes.DONE;
    const sortedSet = sortedIndices || new Set();

    const suits = ['♠', '♥', '♣', '♦'];
    const currentI = (frame.variables && typeof frame.variables.i === 'number') ? frame.variables.i : -1;
    const keyVal = (frame.variables && frame.variables.key !== undefined) ? frame.variables.key : null;
    const isComparing = frame.action === ActionTypes.COMPARE;
    const isModifying = frame.action === ActionTypes.MODIFY;

    let html = `
      <div class="insertion-card-table" style="display:flex; flex-direction:column; width:100%; height:100%; padding:12px; background:radial-gradient(ellipse at 50% 30%, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.5) 100%); border-radius:var(--radius-md); border:1px solid rgba(16, 185, 129, 0.25); box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12px; color:var(--text-secondary); border-bottom:1px solid rgba(16, 185, 129, 0.15); padding-bottom:6px;">
          <span>🎴 <strong>扑克牌理牌手牌架</strong> (待插手牌拔起悬浮，左侧有序牌列平移腾挪空位)</span>
          <div style="display:flex; gap:10px; font-size:11px;">
            <span style="color:var(--state-sorted);">有序手牌区: [0..${Math.max(0, currentI)}]</span>
            ${keyVal !== null ? `<span style="color:#dcdcaa; font-weight:bold;">当前抽插手牌: [${keyVal}]</span>` : ''}
          </div>
        </div>
        <div class="card-rack-area" style="position:relative; flex:1; display:flex; align-items:flex-end; justify-content:center; gap:8px; width:100%; padding-bottom:12px;">
    `;

    html += values.map((val, idx) => {
      const suit = suits[Math.abs(val) % 4];
      const isSuitRed = (suit === '♥' || suit === '♦');
      const isLifted = (idx === currentI && !isDone && (frame.action === ActionTypes.HIGHLIGHT || isComparing || isModifying));
      const isShifted = isModifying && indices.includes(idx);
      const isCompared = isComparing && indices.includes(idx);
      const isSorted = isDone || (sortedSet.has(idx) && idx < currentI);

      let cardLift = isLifted ? 'transform:translateY(-36px); box-shadow:0 12px 24px rgba(220,220,170,0.45); border:2px solid #fde68a;' : '';
      let cardBorder = isSorted ? '2px solid #10b981' : '1px solid var(--border-default)';
      let cardBg = 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-subsurface) 100%)';

      if (isShifted) {
        cardBorder = '2px dashed #f43f5e';
      } else if (isCompared) {
        cardBorder = '2px solid #f59e0b';
      }

      return `
        <div class="playing-card-slot" style="flex:1; max-width:56px; height:100%; display:flex; flex-direction:column; justify-content:flex-end; align-items:center;">
          <div class="playing-card" style="width:100%; height:120px; border-radius:6px; background:${cardBg}; border:${cardBorder}; display:flex; flex-direction:column; justify-content:space-between; padding:6px 4px; box-sizing:border-box; ${cardLift} transition:all 0.24s cubic-bezier(0.34, 1.56, 0.64, 1); user-select:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
              <span style="font-size:11px; font-weight:bold; color:var(--text-primary); font-family:var(--font-mono);">${val}</span>
              <span style="font-size:10px; color:${isSuitRed ? '#ef4444' : '#64748b'};">${suit}</span>
            </div>
            <div style="font-size:22px; color:${isSuitRed ? '#ef4444' : 'var(--text-secondary)'}; text-align:center; opacity:0.85;">${suit}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
              <span style="font-size:9px; color:${isSuitRed ? '#ef4444' : '#64748b'};">${suit}</span>
              <span style="font-size:10px; font-weight:bold; color:var(--text-muted); font-family:var(--font-mono);">${val}</span>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; margin-top:5px; min-height:22px;">
            ${isLifted ? '<span style="font-size:9px; color:#fde68a; font-weight:bold;">▲悬浮</span>' : (isShifted ? '<span style="font-size:9px; color:#f43f5e;">➔后移</span>' : '')}
            <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">[${idx}]</span>
          </div>
        </div>
      `;
    }).join('');

    html += `
        </div>
      </div>
    `;

    stageArray.innerHTML = html;
    syncInspectorUI(frame);
  }

  // 4. Shell Sort: Congruence Lanes & Rainbow Gap Arches (彩色同余分道与跨步彩虹拱桥)
  function renderShellSortStage(arr, frame, sortedIndices = null) {
    const stageArray = document.getElementById('stageArray');
    if (!stageArray) return;
    switchStageLayer('stageArray');

    const values = Array.isArray(arr) ? arr : [];
    const n = values.length;
    const maxVal = Math.max(...values.map(v => typeof v === 'number' ? Math.abs(v) : 1), 1);
    const indices = Array.isArray(frame.indices) ? frame.indices : [];
    const isDone = frame.action === ActionTypes.DONE;
    const gap = (frame.state && typeof frame.state.gap === 'number') ? frame.state.gap : (frame.variables && frame.variables.gap ? frame.variables.gap : 1);

    const lanePalette = [
      '#06b6d4', // Cyan
      '#f59e0b', // Amber
      '#8b5cf6', // Violet
      '#10b981', // Emerald
      '#f43f5e'  // Rose
    ];

    let html = `
      <div class="shell-sort-stage" style="display:flex; flex-direction:column; width:100%; height:100%; padding:12px; background:linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.3) 100%); border-radius:var(--radius-md); border:1px solid var(--border-default); box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12px; color:var(--text-secondary); border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
          <span>🌈 <strong>彩色同余分道与跨步彩虹拱桥</strong> (粗调大跨步穿透逆序对，细调平滑收敛)</span>
          <div style="display:flex; gap:10px; font-size:11px; align-items:center;">
            <span style="padding:2px 8px; border-radius:12px; background:rgba(6,182,212,0.15); border:1px solid #06b6d4; color:#06b6d4; font-weight:bold;">
              📏 当前步长 Gap = ${gap} (${gap} 组同余子序列)
            </span>
            <span style="color:var(--text-muted);">${isDone ? '排序完成 (gap=1)' : '正在组内跨步插入'}</span>
          </div>
        </div>
        <div class="shell-lanes-area" style="position:relative; flex:1; display:flex; align-items:flex-end; justify-content:center; gap:8px; width:100%; padding-bottom:10px;">
    `;

    html += values.map((val, idx) => {
      const laneGroup = idx % gap;
      const laneColor = lanePalette[laneGroup % lanePalette.length];
      const isComparing = frame.action === ActionTypes.COMPARE && indices.includes(idx);
      const isModifying = (frame.action === ActionTypes.MODIFY || frame.action === ActionTypes.SWAP) && indices.includes(idx);
      const heightPct = Math.max(16, Math.min(84, Math.round((Math.abs(val) / maxVal) * 78)));

      let borderStyle = `2px solid ${laneColor}`;
      let glow = isComparing ? `box-shadow: 0 0 14px ${laneColor}; transform:translateY(-6px);` : '';

      return `
        <div class="shell-column" style="flex:1; max-width:54px; height:100%; display:flex; flex-direction:column; justify-content:flex-end; align-items:center;">
          <div class="shell-bar" style="height:${heightPct}%; width:100%; border-radius:4px 4px 0 0; background:linear-gradient(180deg, ${laneColor} 0%, rgba(15,23,42,0.8) 100%); border:${borderStyle}; display:flex; flex-direction:column; justify-content:space-between; align-items:center; ${glow} transition:all 0.22s ease;">
            <span style="font-size:12px; font-weight:bold; color:#ffffff; margin-top:3px; text-shadow:0 1px 2px rgba(0,0,0,0.8);">${val}</span>
            <span style="font-size:9px; color:rgba(255,255,255,0.8); margin-bottom:2px;">道${laneGroup}</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; margin-top:5px; min-height:24px;">
            <span style="font-size:9px; color:${laneColor}; font-weight:bold;">%${gap}=${laneGroup}</span>
            <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">[${idx}]</span>
          </div>
        </div>
      `;
    }).join('');

    html += `
        </div>
      </div>
    `;

    stageArray.innerHTML = html;
    syncInspectorUI(frame);
  }

  // 5. Merge Sort: Conveyor Chutes & Zipper Funnel Convergence (分治倾斜传送带与双路拉链合流槽)
  function renderMergeSortStage(arr, frame, sortedIndices = null) {
    const stageArray = document.getElementById('stageArray');
    if (!stageArray) return;
    switchStageLayer('stageArray');

    const values = Array.isArray(arr) ? arr : [];
    const n = values.length;
    const maxVal = Math.max(...values.map(v => typeof v === 'number' ? Math.abs(v) : 1), 1);
    const indices = Array.isArray(frame.indices) ? frame.indices : [];
    const isDone = frame.action === ActionTypes.DONE;

    const L = (frame.variables && typeof frame.variables.L === 'number') ? frame.variables.L : 0;
    const mid = (frame.variables && typeof frame.variables.mid === 'number') ? frame.variables.mid : Math.floor(n / 2);
    const R = (frame.variables && typeof frame.variables.R === 'number') ? frame.variables.R : n - 1;
    const p1 = (frame.variables && typeof frame.variables.p1 === 'number') ? frame.variables.p1 : -1;
    const p2 = (frame.variables && typeof frame.variables.p2 === 'number') ? frame.variables.p2 : -1;

    let html = `
      <div class="merge-sort-chutes" style="display:flex; flex-direction:column; width:100%; height:100%; padding:12px; background:linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%); border-radius:var(--radius-md); border:1px solid var(--border-default); box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12px; color:var(--text-secondary); border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
          <span>🔀 <strong>分治倾斜传送带与双路拉链合流槽</strong> (自顶向下递归分治，底层双指针拉链归并)</span>
          <div style="display:flex; gap:10px; font-size:11px;">
            <span style="color:#06b6d4;">左支路 [${L}..${mid}]</span>
            <span style="color:#f59e0b;">右支路 [${mid + 1}..${R}]</span>
          </div>
        </div>
        <div class="chute-conveyor-area" style="position:relative; flex:1; display:flex; align-items:flex-end; justify-content:center; gap:8px; width:100%; padding-bottom:10px;">
    `;

    html += values.map((val, idx) => {
      const inMergeRange = (idx >= L && idx <= R);
      const isLeftBranch = inMergeRange && (idx <= mid);
      const isRightBranch = inMergeRange && (idx > mid);
      const isPointer1 = (idx === p1);
      const isPointer2 = (idx === p2);
      const heightPct = Math.max(16, Math.min(84, Math.round((Math.abs(val) / maxVal) * 78)));

      let barColor = 'var(--state-default)';
      let badge = '';

      if (isDone) {
        barColor = 'var(--state-sorted)';
        badge = '<span style="font-size:9px; color:var(--state-sorted);">✓有序</span>';
      } else if (isPointer1 || isPointer2) {
        barColor = '#f43f5e';
        badge = `<span style="font-size:9px; color:#f43f5e; font-weight:bold;">${isPointer1 ? '▲P1' : '▲P2'}</span>`;
      } else if (isLeftBranch) {
        barColor = '#06b6d4';
        badge = '<span style="font-size:9px; color:#06b6d4;">左支</span>';
      } else if (isRightBranch) {
        barColor = '#f59e0b';
        badge = '<span style="font-size:9px; color:#f59e0b;">右支</span>';
      }

      return `
        <div class="merge-slot" style="flex:1; max-width:54px; height:100%; display:flex; flex-direction:column; justify-content:flex-end; align-items:center;">
          <div class="conveyor-bar" style="height:${heightPct}%; width:100%; border-radius:4px 4px 0 0; background:${barColor}; display:flex; flex-direction:column; justify-content:space-between; align-items:center; transition:all 0.22s ease;">
            <span style="font-size:12px; font-weight:bold; color:#ffffff; margin-top:3px; text-shadow:0 1px 2px rgba(0,0,0,0.6);">${val}</span>
            <div style="width:100%; height:3px; background:rgba(255,255,255,0.2);"></div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; margin-top:5px; min-height:24px;">
            ${badge}
            <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">[${idx}]</span>
          </div>
        </div>
      `;
    }).join('');

    html += `
        </div>
      </div>
    `;

    stageArray.innerHTML = html;
    syncInspectorUI(frame);
  }

  // 6. Quick Sort: Pivot Balance Scale & 408 Pit Sandpit (黄金天平枢轴基准与408双向挖坑沙盘)
  function renderQuickSortStage(arr, frame, sortedIndices = null) {
    const stageArray = document.getElementById('stageArray');
    if (!stageArray) return;
    switchStageLayer('stageArray');

    const values = Array.isArray(arr) ? arr : [];
    const n = values.length;
    const maxVal = Math.max(...values.map(v => typeof v === 'number' ? Math.abs(v) : 1), 1);
    const indices = Array.isArray(frame.indices) ? frame.indices : [];
    const isDone = frame.action === ActionTypes.DONE;
    const sortedSet = sortedIndices || new Set();

    const pivotVal = (frame.variables && frame.variables.pivot !== undefined) ? frame.variables.pivot : null;
    const low = (frame.variables && typeof frame.variables.low === 'number') ? frame.variables.low : -1;
    const high = (frame.variables && typeof frame.variables.high === 'number') ? frame.variables.high : -1;
    const pitIdx = (frame.variables && (frame.variables['挖坑点'] !== undefined ? frame.variables['挖坑点'] : frame.variables['新坑位']));

    let html = `
      <div class="quicksort-scale-stage" style="display:flex; flex-direction:column; width:100%; height:100%; padding:12px; background:linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.3) 100%); border-radius:var(--radius-md); border:1px solid var(--border-default); box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12px; color:var(--text-secondary); border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
          <span>⚖️ <strong>黄金天平枢轴基准与408双向挖坑沙盘</strong> (枢轴悬浮作基准标尺，相向双指针互为挖坑填坑)</span>
          <div style="display:flex; gap:12px; font-size:11px; align-items:center;">
            ${pivotVal !== null ? `<span style="padding:2px 10px; border-radius:12px; background:rgba(245,158,11,0.2); border:1px solid #f59e0b; color:#fbbf24; font-weight:bold;">⚖️ 基准 Pivot = ${pivotVal}</span>` : ''}
            <span style="color:#38bdf8;">Low: [${low >= 0 ? low : '-'}]</span>
            <span style="color:#f43f5e;">High: [${high >= 0 ? high : '-'}]</span>
          </div>
        </div>
        <div class="scale-sandpit-area" style="position:relative; flex:1; display:flex; align-items:flex-end; justify-content:center; gap:8px; width:100%; padding-bottom:10px;">
    `;

    html += values.map((val, idx) => {
      const isSorted = isDone || sortedSet.has(idx);
      const isLow = (idx === low);
      const isHigh = (idx === high);
      const isPit = (pitIdx !== undefined && idx === Number(pitIdx) && !isSorted);
      const heightPct = Math.max(16, Math.min(84, Math.round((Math.abs(val) / maxVal) * 78)));

      let barBg = 'var(--state-default)';
      let borderStyle = '1px solid var(--border-default)';
      let tagBadge = '';

      if (isSorted) {
        barBg = 'var(--state-sorted)';
        borderStyle = '1px solid #10b981';
        tagBadge = '<span style="font-size:9px; color:var(--state-sorted);">✓归位</span>';
      } else if (isPit) {
        barBg = 'repeating-linear-gradient(45deg, rgba(245,158,11,0.25), rgba(245,158,11,0.25) 6px, rgba(15,23,42,0.8) 6px, rgba(15,23,42,0.8) 12px)';
        borderStyle = '2px dashed #f59e0b';
        tagBadge = '<span style="font-size:9px; color:#f59e0b; font-weight:bold;">🕳️坑位</span>';
      } else if (isLow && isHigh) {
        barBg = '#8b5cf6';
        tagBadge = '<span style="font-size:9px; color:#8b5cf6; font-weight:bold;">碰头</span>';
      } else if (isLow) {
        barBg = '#38bdf8';
        tagBadge = '<span style="font-size:9px; color:#38bdf8; font-weight:bold;">Low➔</span>';
      } else if (isHigh) {
        barBg = '#f43f5e';
        tagBadge = '<span style="font-size:9px; color:#f43f5e; font-weight:bold;">⬅High</span>';
      }

      return `
        <div class="pit-column" style="flex:1; max-width:54px; height:100%; display:flex; flex-direction:column; justify-content:flex-end; align-items:center;">
          <div class="pit-bar" style="height:${heightPct}%; width:100%; border-radius:4px 4px 0 0; background:${barBg}; border:${borderStyle}; display:flex; flex-direction:column; justify-content:space-between; align-items:center; transition:all 0.22s ease;">
            <span style="font-size:12px; font-weight:bold; color:#ffffff; margin-top:3px; text-shadow:0 1px 2px rgba(0,0,0,0.8);">${val}</span>
            <div style="width:100%; height:3px; background:rgba(255,255,255,0.2);"></div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; margin-top:5px; min-height:24px;">
            ${tagBadge}
            <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">[${idx}]</span>
          </div>
        </div>
      `;
    }).join('');

    html += `
        </div>
      </div>
    `;

    stageArray.innerHTML = html;
    syncInspectorUI(frame);
  }

  // Standard Array Bar Stage Renderer
  function renderArrayBars(arr, frame, sortedIndices = null) {
    const stageArray = document.getElementById('stageArray');
    if (!stageArray) return;
    switchStageLayer('stageArray');

    const values = Array.isArray(arr) ? arr : [];
    const maxVal = Math.max(...values.map(v => typeof v === 'number' ? Math.abs(v) : 1), 1);
    const indices = Array.isArray(frame.indices) ? frame.indices : [];

    let barsHtml = '<div class="bars-container" style="display:flex; align-items:flex-end; justify-content:center; gap:8px; width:100%; height:100%; padding:20px 10px;">';
    barsHtml += values.map((val, idx) => {
      let stateClass = '';
      if (frame.action === ActionTypes.DONE) {
        stateClass = 'bar-sorted';
      } else if (sortedIndices && sortedIndices.has(idx)) {
        stateClass = 'bar-sorted';
      } else if (frame.action === ActionTypes.COMPARE && indices.includes(idx)) {
        stateClass = 'bar-compare';
      } else if ((frame.action === ActionTypes.SWAP || frame.action === ActionTypes.MODIFY) && indices.includes(idx)) {
        stateClass = 'bar-modify';
      } else if (frame.action === ActionTypes.MARK_SORTED && indices.includes(idx)) {
        stateClass = 'bar-sorted';
      } else if (frame.action === ActionTypes.HIGHLIGHT && indices.includes(idx)) {
        stateClass = 'bar-auxiliary';
      }

      const heightPct = Math.max(14, Math.min(88, Math.round((Math.abs(val) / maxVal) * 82)));
      return `
        <div class="bar-item ${stateClass}" style="height: ${heightPct}%; flex: 1; max-width: 58px; display:flex; flex-direction:column; justify-content:space-between; align-items:center; border-radius:4px 4px 0 0; transition:height 0.25s, background-color 0.2s;">
          <span class="bar-val" style="font-size:12px; font-weight:bold; margin-top:4px;">${val}</span>
          <span class="bar-idx" style="font-size:11px; color:rgba(255,255,255,0.7); margin-bottom:4px;">[${idx}]</span>
        </div>
      `;
    }).join('');
    barsHtml += '</div>';

    stageArray.innerHTML = barsHtml;
    syncInspectorUI(frame);
  }

  // Heap Sort Dual View (Complete Binary Tree SVG + Sequential Array Bars)
  function renderHeapDualView(arr, frame) {
    const stageHeapDual = document.getElementById('stageHeapDual');
    if (!stageHeapDual) {
      renderArrayBars(arr, frame);
      return;
    }
    switchStageLayer('stageHeapDual');

    const state = frame.state || {};
    const values = Array.isArray(arr) ? arr : (state.arr || []);
    const n = values.length;
    const heapSize = typeof state.heapSize === 'number' ? state.heapSize : n;
    const sortedSet = new Set(Array.isArray(state.sorted) ? state.sorted : []);
    const indices = Array.isArray(frame.indices) ? frame.indices : [];

    // 1. 更新顶部指标标签
    const treeBadge = document.getElementById('heapTreeBadge');
    if (treeBadge) {
      treeBadge.textContent = (frame.action === ActionTypes.DONE) ? '全部有序' : `有效大顶堆: ${heapSize} 节点`;
    }
    const arrayBadge = document.getElementById('heapArrayBadge');
    if (arrayBadge) {
      arrayBadge.textContent = `堆区: [0..${Math.max(0, heapSize - 1)}] | 有序区: [${heapSize}..${n - 1}]`;
    }

    // 2. 绘制上半区完全二叉树 SVG
    const treeSvg = document.getElementById('heapTreeSvg');
    if (treeSvg && n > 0) {
      const nodeCoords = [];
      for (let i = 0; i < n; i++) {
        const depth = Math.floor(Math.log2(i + 1));
        const pos = i - (Math.pow(2, depth) - 1);
        const y = 35 + depth * 55;
        const x = (800 / (Math.pow(2, depth) + 1)) * (pos + 1);
        nodeCoords.push({ x, y });
      }

      let svgHtml = '';
      // 绘制父子边 (仅在有效堆范围内连线)
      for (let i = 0; i < heapSize; i++) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < heapSize) {
          const isHighlight = indices.includes(i) && indices.includes(left);
          const stroke = isHighlight ? 'var(--state-modify)' : 'var(--border-default)';
          const width = isHighlight ? '3' : '1.5';
          svgHtml += `<line x1="${nodeCoords[i].x}" y1="${nodeCoords[i].y}" x2="${nodeCoords[left].x}" y2="${nodeCoords[left].y}" stroke="${stroke}" stroke-width="${width}"/>`;
        }
        if (right < heapSize) {
          const isHighlight = indices.includes(i) && indices.includes(right);
          const stroke = isHighlight ? 'var(--state-modify)' : 'var(--border-default)';
          const width = isHighlight ? '3' : '1.5';
          svgHtml += `<line x1="${nodeCoords[i].x}" y1="${nodeCoords[i].y}" x2="${nodeCoords[right].x}" y2="${nodeCoords[right].y}" stroke="${stroke}" stroke-width="${width}"/>`;
        }
      }

      // 绘制树形圆形节点
      for (let i = 0; i < n; i++) {
        const coord = nodeCoords[i];
        let fillColor = 'var(--bg-card)';
        let strokeColor = 'var(--border-default)';
        let textColor = 'var(--text-primary)';

        if (sortedSet.has(i) || i >= heapSize || frame.action === ActionTypes.DONE) {
          fillColor = 'var(--state-sorted)';
          strokeColor = 'var(--state-sorted)';
          textColor = '#ffffff';
        } else if (indices.includes(i)) {
          if (frame.action === ActionTypes.SWAP || frame.action === ActionTypes.MODIFY) {
            fillColor = 'var(--state-modify)';
            strokeColor = '#ffffff';
            textColor = '#ffffff';
          } else if (frame.action === ActionTypes.COMPARE) {
            fillColor = 'var(--state-compare)';
            strokeColor = '#ffffff';
            textColor = '#1e1e1e';
          } else {
            fillColor = 'var(--state-default)';
            strokeColor = 'var(--color-primary-hover)';
            textColor = '#ffffff';
          }
        }

        svgHtml += `
          <g class="tree-node-group">
            <circle cx="${coord.x}" cy="${coord.y}" r="17" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
            <text x="${coord.x}" y="${coord.y + 5}" text-anchor="middle" font-size="12" font-weight="bold" fill="${textColor}">${values[i]}</text>
            <text x="${coord.x}" y="${coord.y + 27}" text-anchor="middle" font-size="10" fill="var(--text-muted)">[${i}]</text>
          </g>
        `;
      }
      treeSvg.innerHTML = svgHtml;
    }

    // 3. 绘制下半区顺序存储连续数组
    const arrayContainer = document.getElementById('heapArrayBars');
    if (arrayContainer && n > 0) {
      const maxVal = Math.max(...values.map(v => typeof v === 'number' ? Math.abs(v) : 1), 1);
      let barsHtml = values.map((val, idx) => {
        let stateClass = '';
        if (sortedSet.has(idx) || idx >= heapSize || frame.action === ActionTypes.DONE) {
          stateClass = 'bar-sorted';
        } else if (frame.action === ActionTypes.COMPARE && indices.includes(idx)) {
          stateClass = 'bar-compare';
        } else if ((frame.action === ActionTypes.SWAP || frame.action === ActionTypes.MODIFY) && indices.includes(idx)) {
          stateClass = 'bar-modify';
        } else if (indices.includes(idx)) {
          stateClass = 'bar-auxiliary';
        }

        const heightPct = Math.max(16, Math.min(85, Math.round((Math.abs(val) / maxVal) * 80)));
        const isBoundary = (idx === heapSize - 1 && heapSize < n && heapSize > 0);
        const borderRightStyle = isBoundary ? 'border-right: 3px dashed var(--state-pivot); margin-right: 8px;' : '';

        return `
          <div class="bar-item ${stateClass}" style="height: ${heightPct}%; flex: 1; max-width: 48px; display:flex; flex-direction:column; justify-content:space-between; align-items:center; border-radius:4px 4px 0 0; transition:height 0.2s; ${borderRightStyle}">
            <span class="bar-val" style="font-size:11px; font-weight:bold; margin-top:2px;">${val}</span>
            <span class="bar-idx" style="font-size:10px; color:rgba(255,255,255,0.7); margin-bottom:2px;">[${idx}]</span>
          </div>
        `;
      }).join('');
      arrayContainer.innerHTML = barsHtml;
    }

    syncInspectorUI(frame);
  }

  // Counting Sort Dual View (Primary output[] + Auxiliary count[] frequency/prefix-sum bars)
  function renderCountingSortDualView(frame) {
    const stageArray = document.getElementById('stageArray');
    if (!stageArray) return;
    switchStageLayer('stageArray');

    const state = frame.state || {};
    const arr = state.arr || [];
    const count = state.count || [];
    const minVal = typeof state.minVal === 'number' ? state.minVal : 0;
    const maxVal = typeof state.maxVal === 'number' ? state.maxVal : 0;
    const indices = Array.isArray(frame.indices) ? frame.indices : [];
    const isDone = frame.action === ActionTypes.DONE;
    const isOutputPhase = state.phase === 'output' || isDone;

    const maxArrVal = Math.max(...arr.map(v => Math.abs(v)), 1);
    const maxCountVal = Math.max(...count, 1);

    let mainBars = arr.map((val, idx) => {
      let stateClass = '';
      if (isDone) {
        stateClass = 'bar-sorted';
      } else if (state.phase === 'output' && idx === state.outIdx) {
        stateClass = 'bar-modify';
      } else if (indices.includes(idx)) {
        stateClass = 'bar-compare';
      }
      const heightPct = Math.max(16, Math.min(85, Math.round((Math.abs(val) / maxArrVal) * 80)));
      return `
        <div class="bar-item ${stateClass}" style="height:${heightPct}%; flex:1; max-width:54px; display:flex; flex-direction:column; justify-content:space-between; align-items:center; border-radius:4px 4px 0 0; transition:height 0.25s, background-color 0.2s;">
          <span class="bar-val" style="font-size:12px; font-weight:bold; margin-top:2px;">${val}</span>
          <span class="bar-idx" style="font-size:10px; color:rgba(255,255,255,0.7); margin-bottom:2px;">[${idx}]</span>
        </div>
      `;
    }).join('');

    let countBars = count.map((c, k) => {
      const realVal = k + minVal;
      let cState = '';
      if (state.activeIndex === k || (state.phase === 'output' && state.val === realVal)) {
        cState = 'border:2px solid var(--state-modify); background:rgba(244,63,94,0.35);';
      } else if (c > 0) {
        cState = 'background:rgba(56,189,248,0.25); border:1px solid var(--text-secondary);';
      } else {
        cState = 'background:rgba(255,255,255,0.05); border:1px dashed var(--border-subtle);';
      }
      const heightPct = Math.max(14, Math.min(85, Math.round((c / maxCountVal) * 78)));
      return `
        <div class="count-bar-col" style="flex:1; max-width:48px; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
          <div style="height:${heightPct}%; width:100%; border-radius:4px 4px 0 0; display:flex; flex-direction:column; justify-content:space-between; align-items:center; ${cState} transition:all 0.2s;">
            <span style="font-size:11px; font-weight:bold; color:var(--text-code-val); margin-top:2px;">${c}</span>
          </div>
          <span style="font-size:10px; color:var(--text-muted); margin-top:3px;">值:${realVal}</span>
          <span style="font-size:9px; color:var(--text-secondary);">[${k}]</span>
        </div>
      `;
    }).join('');

    stageArray.innerHTML = `
      <div class="noncomp-dual-stage" style="display:flex; flex-direction:column; width:100%; height:100%; gap:10px; padding:10px;">
        <div class="noncomp-upper-area" style="flex:1.1; background:var(--bg-card); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:8px 12px; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:12px; font-weight:600; color:var(--text-secondary);">
            <span>📥 主序列区：${isOutputPhase ? '输出数组 output[] (逆序回填稳定保持)' : '原始待排数组 a[]'}</span>
            <span style="font-size:11px; color:var(--text-muted);">${state.phase === 'output' ? `写入 a[${state.sourceIdx}]=${state.val} -> output[${state.outIdx}]` : (isDone ? '排序完毕' : '频次扫描中')}</span>
          </div>
          <div class="bars-container" style="display:flex; align-items:flex-end; justify-content:center; gap:6px; flex:1; width:100%;">
            ${mainBars}
          </div>
        </div>
        <div class="noncomp-lower-area" style="flex:1; background:var(--bg-card); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:8px 12px; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:12px; font-weight:600; color:var(--text-secondary);">
            <span>📊 辅助统计分栏：count[] 频次与前缀和柱图 (值域 [${minVal} .. ${maxVal}])</span>
            <span style="font-size:11px; color:var(--state-sorted);">${state.phase === 'prefix' ? '前缀和累加中' : (state.phase === 'output' ? '名额消耗中' : '频次统计')}</span>
          </div>
          <div class="count-bars-container" style="display:flex; align-items:flex-end; justify-content:center; gap:6px; flex:1; width:100%;">
            ${countBars}
          </div>
        </div>
      </div>
    `;
    syncInspectorUI(frame);
  }

  // Radix Sort Dual View (Primary a[] + Auxiliary 10 Queue Buckets)
  function renderRadixSortDualView(frame) {
    const stageArray = document.getElementById('stageArray');
    if (!stageArray) return;
    switchStageLayer('stageArray');

    const state = frame.state || {};
    const arr = state.arr || [];
    const buckets = state.buckets || Array.from({ length: 10 }, () => []);
    const activeBucket = state.activeBucket;
    const indices = Array.isArray(frame.indices) ? frame.indices : [];
    const isDone = frame.action === ActionTypes.DONE;
    const maxVal = Math.max(...arr.map(v => Math.abs(v)), 1);

    let mainBars = arr.map((val, idx) => {
      let stateClass = '';
      if (isDone) {
        stateClass = 'bar-sorted';
      } else if (indices.includes(idx)) {
        stateClass = frame.action === ActionTypes.PUSH ? 'bar-compare' : 'bar-modify';
      }
      const heightPct = Math.max(16, Math.min(85, Math.round((Math.abs(val) / maxVal) * 80)));
      return `
        <div class="bar-item ${stateClass}" style="height:${heightPct}%; flex:1; max-width:54px; display:flex; flex-direction:column; justify-content:space-between; align-items:center; border-radius:4px 4px 0 0; transition:height 0.25s, background-color 0.2s;">
          <span class="bar-val" style="font-size:12px; font-weight:bold; margin-top:2px;">${val}</span>
          <span class="bar-idx" style="font-size:10px; color:rgba(255,255,255,0.7); margin-bottom:2px;">[${idx}]</span>
        </div>
      `;
    }).join('');

    let bucketCards = buckets.map((bItems, bIdx) => {
      const isActive = (activeBucket === bIdx);
      const activeStyle = isActive
        ? 'border:2px solid var(--state-modify); background:rgba(244,63,94,0.18); box-shadow:0 0 10px rgba(244,63,94,0.3);'
        : 'border:1px solid var(--border-default); background:var(--bg-subsurface);';
      const itemsHtml = (bItems && bItems.length > 0)
        ? bItems.map(item => `<span style="display:inline-block; padding:1px 5px; font-size:10px; font-family:var(--font-mono); font-weight:bold; background:var(--bg-surface); border-radius:3px; color:var(--text-primary); border:1px solid var(--border-subtle);">${item}</span>`).join(' ')
        : '<span style="font-size:10px; color:var(--text-muted); opacity:0.6;">(空)</span>';

      return `
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; border-radius:var(--radius-sm); padding:4px 6px; ${activeStyle} transition:all 0.2s;">
          <div style="font-size:11px; font-weight:bold; color:${isActive ? 'var(--state-modify)' : 'var(--text-secondary)'}; border-bottom:1px solid var(--border-subtle); padding-bottom:2px; margin-bottom:4px; display:flex; justify-content:space-between;">
            <span>桶 [${bIdx}]</span>
            <span style="font-size:10px; opacity:0.8;">${bItems ? bItems.length : 0}</span>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:3px; overflow-y:auto; max-height:55px;">
            ${itemsHtml}
          </div>
        </div>
      `;
    }).join('');

    stageArray.innerHTML = `
      <div class="noncomp-dual-stage" style="display:flex; flex-direction:column; width:100%; height:100%; gap:10px; padding:10px;">
        <div class="noncomp-upper-area" style="flex:1.2; background:var(--bg-card); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:8px 12px; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:12px; font-weight:600; color:var(--text-secondary);">
            <span>📊 主序列区：当前数组 a[] (十进制按位提取与就地回填)</span>
            <span style="font-size:11px; color:var(--text-muted);">${frame.variables && frame.variables['当前位'] ? '当前位权: ' + frame.variables['当前位'] : '就位'}</span>
          </div>
          <div class="bars-container" style="display:flex; align-items:flex-end; justify-content:center; gap:6px; flex:1; width:100%;">
            ${mainBars}
          </div>
        </div>
        <div class="noncomp-lower-area" style="flex:1; background:var(--bg-card); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:8px 12px; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:12px; font-weight:600; color:var(--text-secondary);">
            <span>📦 LSD 辅助分栏：10 队列分配桶 (Buckets 0 ~ 9)</span>
            <span style="font-size:11px; color:var(--state-sorted);">先进先出 FIFO 保持稳定性</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(10, 1fr); gap:4px; flex:1; width:100%;">
            ${bucketCards}
          </div>
        </div>
      </div>
    `;
    syncInspectorUI(frame);
  }

  // Bucket Sort Dual View (Primary a[] + Auxiliary 5 Interval Buckets)
  function renderBucketSortDualView(frame) {
    const stageArray = document.getElementById('stageArray');
    if (!stageArray) return;
    switchStageLayer('stageArray');

    const state = frame.state || {};
    const arr = state.arr || [];
    const buckets = state.buckets || Array.from({ length: 5 }, () => []);
    const activeBucket = state.activeBucket;
    const bucketCount = state.bucketCount || 5;
    const bucketRange = state.bucketRange || 1;
    const minVal = typeof state.minVal === 'number' ? state.minVal : 0;
    const indices = Array.isArray(frame.indices) ? frame.indices : [];
    const isDone = frame.action === ActionTypes.DONE;
    const maxVal = Math.max(...arr.map(v => Math.abs(v)), 1);

    let mainBars = arr.map((val, idx) => {
      let stateClass = '';
      if (isDone) {
        stateClass = 'bar-sorted';
      } else if (indices.includes(idx)) {
        stateClass = frame.action === ActionTypes.PUSH ? 'bar-compare' : 'bar-modify';
      }
      const heightPct = Math.max(16, Math.min(85, Math.round((Math.abs(val) / maxVal) * 80)));
      return `
        <div class="bar-item ${stateClass}" style="height:${heightPct}%; flex:1; max-width:54px; display:flex; flex-direction:column; justify-content:space-between; align-items:center; border-radius:4px 4px 0 0; transition:height 0.25s, background-color 0.2s;">
          <span class="bar-val" style="font-size:12px; font-weight:bold; margin-top:2px;">${val}</span>
          <span class="bar-idx" style="font-size:10px; color:rgba(255,255,255,0.7); margin-bottom:2px;">[${idx}]</span>
        </div>
      `;
    }).join('');

    let bucketCards = buckets.map((bItems, bIdx) => {
      const isActive = (activeBucket === bIdx);
      const rStart = minVal + bIdx * bucketRange;
      const rEnd = rStart + bucketRange - 1;
      const activeStyle = isActive
        ? 'border:2px solid var(--state-modify); background:rgba(244,63,94,0.18); box-shadow:0 0 10px rgba(244,63,94,0.3);'
        : 'border:1px solid var(--border-default); background:var(--bg-subsurface);';
      const itemsHtml = (bItems && bItems.length > 0)
        ? bItems.map(item => `<span style="display:inline-block; padding:2px 7px; font-size:11px; font-family:var(--font-mono); font-weight:bold; background:var(--bg-surface); border-radius:3px; color:var(--text-primary); border:1px solid var(--border-subtle);">${item}</span>`).join(' ')
        : '<span style="font-size:11px; color:var(--text-muted); opacity:0.6;">(空桶)</span>';

      return `
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; border-radius:var(--radius-md); padding:8px 10px; ${activeStyle} transition:all 0.2s;">
          <div style="font-size:12px; font-weight:bold; color:${isActive ? 'var(--state-modify)' : 'var(--text-secondary)'}; border-bottom:1px solid var(--border-subtle); padding-bottom:4px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
            <span>🪣 大桶 ${bIdx}</span>
            <span style="font-size:10px; color:var(--text-muted); padding:1px 4px; background:var(--bg-input); border-radius:3px;">区间 [${rStart}..${rEnd}]</span>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; overflow-y:auto; flex:1; align-content:flex-start;">
            ${itemsHtml}
          </div>
        </div>
      `;
    }).join('');

    stageArray.innerHTML = `
      <div class="noncomp-dual-stage" style="display:flex; flex-direction:column; width:100%; height:100%; gap:10px; padding:10px;">
        <div class="noncomp-upper-area" style="flex:1.2; background:var(--bg-card); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:8px 12px; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:12px; font-weight:600; color:var(--text-secondary);">
            <span>📊 主序列区：当前数组 a[] (区间分发与有序收集拼接)</span>
            <span style="font-size:11px; color:var(--text-muted);">${frame.action === ActionTypes.DONE ? '全部有序' : '正在映射/排序'}</span>
          </div>
          <div class="bars-container" style="display:flex; align-items:flex-end; justify-content:center; gap:6px; flex:1; width:100%;">
            ${mainBars}
          </div>
        </div>
        <div class="noncomp-lower-area" style="flex:1; background:var(--bg-card); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:8px 12px; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:12px; font-weight:600; color:var(--text-secondary);">
            <span>🪣 辅助分栏：${bucketCount} 个区间大桶 (区间跨度 ${bucketRange})</span>
            <span style="font-size:11px; color:var(--state-sorted);">桶内各自排序</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(${bucketCount}, 1fr); gap:8px; flex:1; width:100%;">
            ${bucketCards}
          </div>
        </div>
      </div>
    `;
    syncInspectorUI(frame);
  }

  // Common Lifecycle Initializer
  function commonInit(algoDef, controller, customData) {
    let inputData = customData;
    if (!inputData) {
      inputData = algoDef.defaultInput;
    }

    // 1. Render pseudocode into #codeBlock
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

    // 2. Render 408 & STL Card into #stlContent
    const stlContent = document.getElementById('stlContent');
    if (stlContent && algoDef.stlCard) {
      stlContent.innerHTML = algoDef.stlCard.content;
    }

    // 3. Generate frames and load into controller
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

  // Common Input Sanitizer for 1D Arrays
  function parseArrayInput(text) {
    if (!text || typeof text !== 'string') {
      return { success: false, error: '输入不能为空' };
    }
    const clean = text.replace(/，/g, ',').replace(/[\[\]]/g, '').trim();
    const parts = clean.split(/[\s,]+/).filter(Boolean);
    const nums = [];
    for (const p of parts) {
      const n = Number(p);
      if (isNaN(n)) return { success: false, error: `非数字元素: "${p}"` };
      nums.push(Math.round(n));
    }
    if (nums.length < 2) return { success: false, error: '至少需要 2 个数字' };
    return { success: true, data: nums.slice(0, 30) };
  }

  // =========================================================================
  // 1. 冒泡排序 (Bubble Sort)
  // =========================================================================
  function generateBubbleSortFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [45, 12, 85, 32, 89, 38, 67, 24];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;
    const sortedSet = new Set();

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { arr: [...a], sorted: Array.from(sortedSet) },
      variables: { i: 0, j: 0, n, swapped: false },
      codeLine: 2,
      explanation: `【算法初始化】待排序序列包含 ${n} 项元素: [${a.join(', ')}]。准备启动冒泡排序外层遍历。`
    }));

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [0],
        state: { arr: [...a], sorted: Array.from(sortedSet) },
        variables: { i, '当前轮次': `第 ${i + 1} 轮`, '未排序边界': n - 1 - i, swapped: false },
        codeLine: 3,
        explanation: `第 ${i + 1} 轮扫描开始：未就位区间为 [0 .. ${n - 1 - i}]，重置标志位 swapped = false。`
      }));

      for (let j = 0; j < n - 1 - i; j++) {
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.COMPARE,
          indices: [j, j + 1],
          state: { arr: [...a], sorted: Array.from(sortedSet) },
          variables: { i, j, 'a[j]': a[j], 'a[j+1]': a[j + 1], swapped },
          codeLine: 6,
          explanation: `比较相邻元素：a[${j}]=${a[j]} 与 a[${j + 1}]=${a[j + 1]}。`
        }));

        if (a[j] > a[j + 1]) {
          const temp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = temp;
          swapped = true;

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.SWAP,
            indices: [j, j + 1],
            state: { arr: [...a], sorted: Array.from(sortedSet) },
            variables: { i, j, '交换': `${temp} <-> ${a[j]}`, swapped: true },
            codeLine: 7,
            explanation: `逆序发现 (${temp} > ${a[j]})！执行相邻交换，标记本轮发生过交换 (swapped = true)。`
          }));
        }
      }

      sortedSet.add(n - 1 - i);
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MARK_SORTED,
        indices: [n - 1 - i],
        state: { arr: [...a], sorted: Array.from(sortedSet) },
        variables: { i, '已沉底元素': a[n - 1 - i], '锁定下标': n - 1 - i },
        codeLine: 8,
        explanation: `第 ${i + 1} 轮扫描完成：本轮最大值 ${a[n - 1 - i]} 已沉底就位，锁死下标 ${n - 1 - i}。`
      }));

      if (!swapped) {
        for (let k = 0; k <= n - 1 - i; k++) sortedSet.add(k);
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.HIGHLIGHT,
          indices: Array.from({ length: n - i }, (_, k) => k),
          state: { arr: [...a], sorted: Array.from(sortedSet) },
          variables: { i, swapped: false, earlyExit: true },
          codeLine: 10,
          explanation: `【提前收敛优化】检测到整轮扫描 0 次交换 (swapped == false)，序列已然完全有序，提前退出循环！`
        }));
        break;
      }
    }

    for (let k = 0; k < n; k++) sortedSet.add(k);
    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: a.map((_, idx) => idx),
      state: { arr: [...a], sorted: Array.from(sortedSet) },
      variables: { status: 'COMPLETE', n },
      codeLine: 11,
      explanation: `🎉 冒泡排序执行完毕！全体元素呈单调非递减有序排列。`
    }));

    return frames;
  }

  const bubbleSortDef = {
    id: 'bubble_sort',
    category: 'sorting',
    name: '冒泡排序',
    en: 'Bubble Sort',
    meta: { tier: 'C组', time: 'O(N²)', space: 'O(1)', stability: '稳定', is408: true, tags: ['交换', '稳定', 'O(N²)'] },
    templates: {
      python: [
        'def bubble_sort(arr):  # 冒泡排序：相邻比对，逆序交换，大数沉底',
        '    n = len(arr)  # 获取待排序序列总长度 N',
        '    for i in range(n - 1):  # 外层循环：共需进行 N-1 轮冒泡扫描',
        '        swapped = False  # 剪枝标志位：记录本轮是否发生过元素交换',
        '        for j in range(n - 1 - i):  # 内层扫描未排序区 [0 .. n-1-i]',
        '            if arr[j] > arr[j + 1]:  # 严格大于才交换，保证相等元素相对次序不变（稳定）',
        '                arr[j], arr[j + 1] = arr[j + 1], arr[j]  # 发现逆序对，上浮轻气泡/下沉重气泡',
        '                swapped = True  # 标记本轮发生了交换，序列尚未完全有序',
        '        if not swapped: break  # 若整轮零交换，说明全局已有序，O(N) 提前终止！',
        '    return arr  # 返回单调非递减有序序列'
      ],
      cpp: [
        'void bubbleSort(vector<int>& arr) { // 冒泡排序（408考研标准带标志位优化版）',
        '    int n = arr.size(); // 获取数组长度 N',
        '    for (int i = 0; i < n - 1; ++i) { // 第 i 轮将第 i 大的元素沉底至 n-1-i',
        '        bool swapped = false; // 提前终止标志位',
        '        for (int j = 0; j < n - 1 - i; ++j) { // 遍历当前无序前缀区间',
        '            if (arr[j] > arr[j + 1]) { // 相邻元素逆序（相等不换以维持稳定性）',
        '                swap(arr[j], arr[j + 1]); // 原地交换相邻逆序元素',
        '                swapped = true; // 记录发生过交换',
        '            }',
        '        }',
        '        if (!swapped) break; // 本趟无交换则直接跳出，最好时间复杂度 O(N)',
        '    }',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>408 核心考点</strong>：冒泡排序是<strong>稳定排序</strong>。每轮必有且仅有一个元素彻底沉底就位。最坏时间复杂度为 $O(N^2)$，最好（带 <code>swapped</code> 标志）为 $O(N)$。</p>
        <p><strong>C++ STL 对照</strong>：<code>std::stable_sort(arr.begin(), arr.end());</code></p>
      `
    },
    defaultInput: [45, 12, 85, 32, 89, 38, 67, 24],
    presets: {
      random: [52, 18, 76, 29, 93, 41, 65, 14],
      reversed: [95, 83, 72, 61, 50, 39, 28, 17],
      nearly_sorted: [10, 20, 28, 35, 42, 60, 55, 70],
      duplicates: [30, 50, 30, 80, 50, 30, 90, 50],
      minimal: [42, 15, 68]
    },
    parseInput: parseArrayInput,
    generateFrames: generateBubbleSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const arr = frame.state && frame.state.arr ? frame.state.arr : (Array.isArray(frame.state) ? frame.state : []);
      const sorted = frame.state && frame.state.sorted ? new Set(frame.state.sorted) : null;
      renderBubbleSortStage(arr, frame, sorted);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 2. 选择排序 (Selection Sort)
  // =========================================================================
  function generateSelectionSortFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [29, 10, 14, 37, 13, 50, 22];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;
    const sortedSet = new Set();

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { arr: [...a], sorted: [] },
      variables: { i: 0, n, '算法': '选择排序' },
      codeLine: 2,
      explanation: `【算法初始化】待排序序列共 ${n} 项元素。选择排序每轮从无序区选出全局最小值填入待填坑位。`
    }));

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [i],
        state: { arr: [...a], sorted: Array.from(sortedSet) },
        variables: { i, minIdx, '当前最小值': a[minIdx] },
        codeLine: 4,
        explanation: `第 ${i + 1} 轮选择：锁定待填充坑位 i = ${i}，暂设最小值为 a[${i}] = ${a[i]}。`
      }));

      for (let j = i + 1; j < n; j++) {
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.COMPARE,
          indices: [j, minIdx],
          state: { arr: [...a], sorted: Array.from(sortedSet) },
          variables: { i, j, minIdx, 'a[j]': a[j], 'a[minIdx]': a[minIdx] },
          codeLine: 6,
          explanation: `探针 j = ${j} 扫描：比较 a[${j}]=${a[j]} 与当前候选最小值 a[${minIdx}]=${a[minIdx]}。`
        }));

        if (a[j] < a[minIdx]) {
          minIdx = j;
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.MODIFY,
            indices: [minIdx],
            state: { arr: [...a], sorted: Array.from(sortedSet) },
            variables: { i, minIdx, '新最小值': a[minIdx] },
            codeLine: 7,
            explanation: `发现更小元素！更新极小值索引 minIdx = ${j} (值为 ${a[j]})。`
          }));
        }
      }

      if (minIdx !== i) {
        const temp = a[i];
        a[i] = a[minIdx];
        a[minIdx] = temp;
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.SWAP,
          indices: [i, minIdx],
          state: { arr: [...a], sorted: Array.from(sortedSet) },
          variables: { i, minIdx, '交换': `${temp} <-> ${a[i]}` },
          codeLine: 9,
          explanation: `极值落位：将找到的全局最小值 ${a[i]} 与坑位 a[${i}](${temp}) 交换位置。`
        }));
      }

      sortedSet.add(i);
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MARK_SORTED,
        indices: [i],
        state: { arr: [...a], sorted: Array.from(sortedSet) },
        variables: { i, '已就位前缀': `[0 .. ${i}]` },
        codeLine: 3,
        explanation: `前缀下标 [0 .. ${i}] 当前已完全有序。`
      }));
    }

    for (let k = 0; k < n; k++) sortedSet.add(k);
    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: a.map((_, idx) => idx),
      state: { arr: [...a], sorted: Array.from(sortedSet) },
      variables: { status: 'COMPLETE' },
      codeLine: 10,
      explanation: `选择排序全部就绪！总比较次数恒为 N(N-1)/2 次。`
    }));

    return frames;
  }

  const selectionSortDef = {
    id: 'selection_sort',
    category: 'sorting',
    name: '选择排序',
    en: 'Selection Sort',
    meta: { tier: 'C组', time: 'O(N²)', space: 'O(1)', stability: '不稳定', is408: true, tags: ['极值扫描', '不稳定', 'O(N²)'] },
    templates: {
      python: [
        'def selection_sort(arr):  # 选择排序：每轮扫描锁定最小值下标，每轮至多交换一次',
        '    n = len(arr)  # 获取序列总长度 N',
        '    for i in range(n - 1):  # i 为当前待填充的目标坑位（有序区末尾）',
        '        min_idx = i  # 机械爪暂定当前坑位 i 为本轮最小值下标',
        '        for j in range(i + 1, n):  # 雷达探针 j 扫描右侧全体未排序区 [i+1 .. n-1]',
        '            if arr[j] < arr[min_idx]:  # 发现比当前记录更小的元素',
        '                min_idx = j  # 仅更新最小值下标 min_idx，不急于交换内存',
        '        if min_idx != i:  # 若最小值不在原坑位 i，执行跨距一把抓交换',
        '            arr[i], arr[min_idx] = arr[min_idx], arr[i]  # 跨距交换可能破坏相等元素次序（不稳定）',
        '    return arr  # 返回排序完成序列'
      ],
      cpp: [
        'void selectionSort(vector<int>& arr) { // 简单选择排序：比较次数恒为 N(N-1)/2',
        '    int n = arr.size(); // 获取数组规模',
        '    for (int i = 0; i < n - 1; ++i) { // 枚举每轮待填入的第 i 小坑位',
        '        int min_idx = i; // 记录无序区 [i..n-1] 最小元素的下标',
        '        for (int j = i + 1; j < n; ++j) { // 线性扫描剩余未排序元素',
        '            if (arr[j] < arr[min_idx]) min_idx = j; // 更新全局最小值游标',
        '        }',
        '        if (min_idx != i) swap(arr[i], arr[min_idx]); // 将本轮最小值一次性换入坑位 i',
        '    }',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>不稳定根源</strong>：长距离跨度交换可能破坏相等元素的相对次序。例如 <code>[5a, 8, 5b, 2]</code>，首轮 <code>5a</code> 与 <code>2</code> 交换后，<code>5a</code> 跑到 <code>5b</code> 之后。</p>
        <p>比较次数与初始排列无关，恒为 $N(N-1)/2$。</p>
      `
    },
    defaultInput: [29, 10, 14, 37, 13, 50, 22],
    presets: {
      random: [45, 12, 85, 32, 89, 38],
      reversed: [90, 70, 50, 30, 10],
      duplicates: [5, 3, 5, 2, 5, 1]
    },
    parseInput: parseArrayInput,
    generateFrames: generateSelectionSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const arr = frame.state && frame.state.arr ? frame.state.arr : (Array.isArray(frame.state) ? frame.state : []);
      const sorted = frame.state && frame.state.sorted ? new Set(frame.state.sorted) : null;
      renderSelectionSortStage(arr, frame, sorted);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 3. 插入排序 (Insertion Sort)
  // =========================================================================
  function generateInsertionSortFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [34, 8, 64, 51, 32, 21];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;
    const sortedSet = new Set([0]);

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.MARK_SORTED,
      indices: [0],
      state: { arr: [...a], sorted: [0] },
      variables: { i: 0, key: a[0], sortedPrefix: 1 },
      codeLine: 2,
      explanation: `基准定义：单元素子数组 a[0]=${a[0]} 天然有序，算法从 i=1 开始逐项抓牌插入。`
    }));

    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [i],
        state: { arr: [...a], sorted: Array.from(sortedSet) },
        variables: { i, j, key, '待插牌': key },
        codeLine: 4,
        explanation: `抓取待插手牌 key = a[${i}] = ${key}，准备向左侧有序区间逆序比对推进。`
      }));

      while (j >= 0 && a[j] > key) {
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.COMPARE,
          indices: [j, j + 1],
          state: { arr: [...a], sorted: Array.from(sortedSet) },
          variables: { i, j, 'a[j]': a[j], key },
          codeLine: 6,
          explanation: `比较：前驱项 a[${j}]=${a[j]} > key(${key})，逆序成立，需要右移腾位。`
        }));

        a[j + 1] = a[j];
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MODIFY,
          indices: [j + 1],
          state: { arr: [...a], sorted: Array.from(sortedSet) },
          variables: { i, j, '右推移位': `a[${j+1}] = a[${j}]` },
          codeLine: 7,
          explanation: `元素 a[${j}]=${a[j]} 向右平移一格腾出坑位 a[${j + 1}]。`
        }));

        j--;
      }

      a[j + 1] = key;
      sortedSet.add(i);

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.SWAP,
        indices: [j + 1],
        state: { arr: [...a], sorted: Array.from(sortedSet) },
        variables: { i, '入位下标': j + 1, key },
        codeLine: 9,
        explanation: `手牌落位：将 key = ${key} 插入下标 ${j + 1}。前缀 [0 .. ${i}] 全局单调递增！`
      }));
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: a.map((_, idx) => idx),
      state: { arr: [...a], sorted: a.map((_, idx) => idx) },
      variables: { status: 'COMPLETE' },
      codeLine: 10,
      explanation: `插入排序圆满结束！在近乎有序时时间复杂度逼近 O(N)。`
    }));

    return frames;
  }

  const insertionSortDef = {
    id: 'insertion_sort',
    category: 'sorting',
    name: '插入排序',
    en: 'Insertion Sort',
    meta: { tier: 'C组', time: 'O(N²)', space: 'O(1)', stability: '稳定', is408: true, tags: ['有序区扩展', '近有序O(N)', '稳定'] },
    templates: {
      python: [
        'def insertion_sort(arr):  # 直接插入排序：扑克牌摸牌理牌，近乎有序时达 O(N)',
        '    n = len(arr)  # 序列总长度 N（默认首张牌 arr[0] 天然有序）',
        '    for i in range(1, n):  # 从第 2 张牌开始依次摸牌插入左侧有序手牌区',
        '        key = arr[i]  # 拔起当前待插手牌暂存至 key，原位腾出空槽',
        '        j = i - 1  # 游标 j 指向左侧有序手牌区的最后一张牌',
        '        while j >= 0 and arr[j] > key:  # 左侧手牌比 key 大时持续向右挪位',
        '            arr[j + 1] = arr[j]  # 大牌向右平移一格（非交换，减少写操作）',
        '            j -= 1  # 游标继续向左回溯比对前一张手牌',
        '        arr[j + 1] = key  # 找到首个 <= key 的位置，将 key 落入右侧空槽',
        '    return arr  # 返回有序序列'
      ],
      cpp: [
        'void insertionSort(vector<int>& arr) { // 直接插入排序（Timsort/Introsort 底层小区间基石）',
        '    int n = arr.size(); // 数组长度',
        '    for (int i = 1; i < n; ++i) { // 依次将 arr[i] 插入前缀有序区 arr[0..i-1]',
        '        int key = arr[i]; // 暂存待插入手牌数值',
        '        int j = i - 1; // 从有序区末端向前扫描',
        '        while (j >= 0 && arr[j] > key) { // 严格大于才后移，保障排序稳定性',
        '            arr[j + 1] = arr[j]; // 元素右移一格腾出插槽',
        '            --j; // 指针左移继续比对',
        '        }',
        '        arr[j + 1] = key; // 将手牌 key 精准嵌入空槽',
        '    }',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>核心优势</strong>：当原数组<strong>近乎有序</strong>时，直接插入排序效率极高，内层比较提前终止，比较与移动次数降至 $O(N)$。常被工业级混合排序（如 Timsort / Introsort）作为小规模子区间（$N \le 16$）的基础排序算法。</p>
      `
    },
    defaultInput: [34, 8, 64, 51, 32, 21],
    presets: {
      nearly_sorted: [5, 10, 15, 25, 20, 30, 35],
      reversed: [60, 50, 40, 30, 20, 10],
      random: [45, 12, 85, 32, 89]
    },
    parseInput: parseArrayInput,
    generateFrames: generateInsertionSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const arr = frame.state && frame.state.arr ? frame.state.arr : (Array.isArray(frame.state) ? frame.state : []);
      const sorted = frame.state && frame.state.sorted ? new Set(frame.state.sorted) : null;
      renderInsertionSortStage(arr, frame, sorted);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 4. 希尔排序 (Shell Sort)
  // =========================================================================
  function generateShellSortFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [49, 38, 65, 97, 76, 13, 27, 49];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;
    let gap = Math.floor(n / 2);

    while (gap > 0) {
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [],
        state: { arr: [...a], gap },
        variables: { gap, n, '分组步长': gap },
        codeLine: 4,
        explanation: `【缩小增量】进入 gap = ${gap} 阶段。数组被逻辑划分为 ${gap} 个跨步同余子序列进行插入排序。`
      }));

      for (let i = gap; i < n; i++) {
        const temp = a[i];
        let j = i;

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.HIGHLIGHT,
          indices: [i, j - gap],
          state: { arr: [...a], gap },
          variables: { gap, i, j, temp, '跨步前驱': j - gap },
          codeLine: 6,
          explanation: `组内抓牌：考察 a[${i}] = ${temp}，与其同组相距 gap=${gap} 的前驱 a[${j - gap}] = ${a[j - gap]} 比对。`
        }));

        while (j >= gap && a[j - gap] > temp) {
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.COMPARE,
            indices: [j - gap, j],
            state: { arr: [...a], gap },
            variables: { gap, j, 'a[j-gap]': a[j - gap], temp },
            codeLine: 8,
            explanation: `跨步比较：a[${j - gap}]=${a[j - gap]} > temp(${temp})，逆序成立。`
          }));

          a[j] = a[j - gap];
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.MODIFY,
            indices: [j],
            state: { arr: [...a], gap },
            variables: { gap, j, '跨步后移': `a[${j}] = a[${j-gap}]` },
            codeLine: 9,
            explanation: `跨步移位：将 a[${j - gap}]=${a[j]} 右推 gap 步填入 a[${j}]。`
          }));

          j -= gap;
        }

        a[j] = temp;
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.SWAP,
          indices: [j],
          state: { arr: [...a], gap },
          variables: { gap, j, temp },
          codeLine: 11,
          explanation: `落入组内指定坑位：a[${j}] = ${temp}。`
        }));
      }

      gap = Math.floor(gap / 2);
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: a.map((_, idx) => idx),
      state: { arr: [...a], gap: 0 },
      variables: { status: 'COMPLETE', finalGap: 0 },
      codeLine: 13,
      explanation: `希尔排序执行完毕，全局元素完全有序！突破了经典比较排序的 O(N²) 壁垒。`
    }));

    return frames;
  }

  const shellSortDef = {
    id: 'shell_sort',
    category: 'sorting',
    name: '希尔排序',
    en: 'Shell Sort',
    meta: { tier: 'B组', time: 'O(N^1.3)', space: 'O(1)', stability: '不稳定', is408: true, tags: ['缩小增量', '突破O(N²)', '不稳定'] },
    templates: {
      python: [
        'def shell_sort(arr):  # 希尔排序：缩小增量分组插入，打破 O(N²) 算力天花板',
        '    n = len(arr)  # 获取数组长度 N',
        '    gap = n // 2  # 初始增量步长取 N/2，将数组逻辑划分为 gap 条同余轨道',
        '    while gap > 0:  # 增量步长逐轮折半，直至 gap = 1 完成最后精调',
        '        for i in range(gap, n):  # 对每个同余子序列交替执行跨步插入排序',
        '            temp = arr[i]  # 拔起当前分组内的待插元素 temp',
        '            j = i  # 记录当前考察下标',
        '            while j >= gap and arr[j - gap] > temp:  # 与同组前驱 arr[j-gap] 跨步比对',
        '                arr[j] = arr[j - gap]  # 同组较大元素向右跨步移动 gap 位',
        '                j -= gap  # 指针按步长 gap 向前跳跃回溯',
        '            arr[j] = temp  # 将 temp 落入同组正确槽位',
        '        gap //= 2  # 缩小增量步长，逼近全局基本有序',
        '    return arr  # 返回排序结果'
      ],
      cpp: [
        'void shellSort(vector<int>& arr) { // 希尔排序（408常考：不稳定、仅适用于顺序存储）',
        '    int n = arr.size(); // 数组总长',
        '    for (int gap = n / 2; gap > 0; gap /= 2) { // 步长序列折半递减至 1',
        '        for (int i = gap; i < n; ++i) { // 多条同余子序列并行交替推进',
        '            int temp = arr[i], j = i; // 暂存待插元素与当前槽位',
        '            while (j >= gap && arr[j - gap] > temp) { // 跨步比较同组前驱元素',
        '                arr[j] = arr[j - gap]; // 前驱大元素跨步后移',
        '                j -= gap; // 沿同余轨道向前回退一个步长',
        '            }',
        '            arr[j] = temp; // 填入当前子序列插槽',
        '        }',
        '    }',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>不稳定原因</strong>：相同元素被分在不同增量子序列中，各自独立排序，相对次序无法保证。</p>
        <p><strong>增量序列</strong>：希尔建议 $gap = \lfloor n/2 \rfloor$，最后一步必须为 $gap = 1$。</p>
      `
    },
    defaultInput: [49, 38, 65, 97, 76, 13, 27, 49],
    presets: {
      random: [80, 30, 60, 40, 20, 10, 50, 70],
      reversed: [90, 80, 70, 60, 50, 40, 30, 20]
    },
    parseInput: parseArrayInput,
    generateFrames: generateShellSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const arr = frame.state && frame.state.arr ? frame.state.arr : (Array.isArray(frame.state) ? frame.state : []);
      renderShellSortStage(arr, frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 5. 归并排序 (Merge Sort)
  // =========================================================================
  function generateMergeSortFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [38, 27, 43, 3, 9, 82, 10];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;

    function runMergeSort(L, R) {
      if (L >= R) return;
      const mid = Math.floor((L + R) / 2);

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [L, mid, R],
        state: { arr: [...a] },
        variables: { L, mid, R, '阶段': '分治折半切分' },
        codeLine: 3,
        explanation: `分治递归：将区间 [${L} .. ${R}] 从中点 mid = ${mid} 折半切分为左右两个子问题。`
      }));

      runMergeSort(L, mid);
      runMergeSort(mid + 1, R);
      merge(L, mid, R);
    }

    function merge(L, mid, R) {
      const temp = [];
      let p1 = L;
      let p2 = mid + 1;

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [L, R],
        state: { arr: [...a] },
        variables: { L, mid, R, p1, p2, '合并区间': `[${L}..${mid}] + [${mid+1}..${R}]` },
        codeLine: 8,
        explanation: `启动双路归并：将两段各自有序的子序列 [${L}..${mid}] 与 [${mid+1}..${R}] 挑选较小者归并入辅助缓冲池。`
      }));

      while (p1 <= mid && p2 <= R) {
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.COMPARE,
          indices: [p1, p2],
          state: { arr: [...a] },
          variables: { L, R, p1, p2, 'a[p1]': a[p1], 'a[p2]': a[p2] },
          codeLine: 12,
          explanation: `比较两路指针对应元素：a[${p1}]=${a[p1]} 与 a[${p2}]=${a[p2]}。`
        }));

        if (a[p1] <= a[p2]) {
          temp.push(a[p1]);
          p1++;
        } else {
          temp.push(a[p2]);
          p2++;
        }
      }

      while (p1 <= mid) {
        temp.push(a[p1++]);
      }
      while (p2 <= R) {
        temp.push(a[p2++]);
      }

      // 刷回原数组
      for (let k = 0; k < temp.length; k++) {
        a[L + k] = temp[k];
      }

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MARK_SORTED,
        indices: Array.from({ length: R - L + 1 }, (_, idx) => L + idx),
        state: { arr: [...a] },
        variables: { L, R, '合并有序段': `[${temp.join(', ')}]` },
        codeLine: 18,
        explanation: `刷回原数组：区间 [${L} .. ${R}] 现已完全局部单调递增有序！`
      }));
    }

    runMergeSort(0, n - 1);

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: a.map((_, idx) => idx),
      state: { arr: [...a] },
      variables: { status: 'COMPLETE' },
      codeLine: 6,
      explanation: `归并排序递归全景回溯完毕！最终全序列呈单调非递减顺序。`
    }));

    return frames;
  }

  const mergeSortDef = {
    id: 'merge_sort',
    category: 'sorting',
    name: '归并排序',
    en: 'Merge Sort',
    meta: { tier: 'B组', time: 'O(N log N)', space: 'O(N)', stability: '稳定', is408: true, tags: ['分治', '逆序对', '稳定', 'O(NlogN)'] },
    templates: {
      python: [
        'def merge_sort(arr, L, R):  # 归并排序：分治折半拆分 + 双指针拉链合并',
        '    if L >= R: return  # 递归基：单元素区间 [L, L] 天然有序',
        '    mid = (L + R) // 2  # 取区间中点 mid，一分为二',
        '    merge_sort(arr, L, mid)  # 递归排好左半子区间 [L .. mid]',
        '    merge_sort(arr, mid + 1, R)  # 递归排好右半子区间 [mid+1 .. R]',
        '    merge(arr, L, mid, R)  # 将两段有序子序列合并为完整有序区间',
        '',
        'def merge(arr, L, mid, R):  # 双指针拉链合流（可顺带统计跨区逆序对）',
        '    temp = []  # 开辟 O(N) 临时辅助合流槽',
        '    p1, p2 = L, mid + 1  # p1 指左半队头，p2 指右半队头',
        '    while p1 <= mid and p2 <= R:  # 左右两轨均有剩余元素时比对队头',
        '        if arr[p1] <= arr[p2]:  # 左 <= 右时优先取左，确保相等元素稳定不乱序',
        '            temp.append(arr[p1]); p1 += 1  # 左轨较小者滑入合流槽',
        '        else:  # 右轨元素更小（此时左轨剩余 mid-p1+1 个元素均与它构成逆序对）',
        '            temp.append(arr[p2]); p2 += 1  # 右轨较小者滑入合流槽',
        '    while p1 <= mid: temp.append(arr[p1]); p1 += 1  # 抄录左半区剩余尾部元素',
        '    while p2 <= R: temp.append(arr[p2]); p2 += 1  # 抄录右半区剩余尾部元素',
        '    arr[L:R+1] = temp  # 将合流槽有序序列刷回原数组 [L .. R]'
      ],
      cpp: [
        'void mergeSort(vector<int>& a, int L, int R) { // 二路归并排序：严格 O(N log N) 稳定排序',
        '    if (L >= R) return; // 递归出口：区间长度 <= 1',
        '    int mid = L + (R - L) / 2; // 防溢出中点计算',
        '    mergeSort(a, L, mid); // 递归左半部 [L..mid]',
        '    mergeSort(a, mid + 1, R); // 递归右半部 [mid+1..R]',
        '    vector<int> tmp; // 临时归并缓冲数组',
        '    int p1 = L, p2 = mid + 1; // 左右有序子区间双指针',
        '    while (p1 <= mid && p2 <= R) { // 拉链式择小合流',
        '        if (a[p1] <= a[p2]) tmp.push_back(a[p1++]); // 取左维持稳定性',
        '        else tmp.push_back(a[p2++]); // 取右（产生 mid - p1 + 1 个逆序对）',
        '    }',
        '    while (p1 <= mid) tmp.push_back(a[p1++]); // 追加左半剩余元素',
        '    while (p2 <= R) tmp.push_back(a[p2++]); // 追加右半剩余元素',
        '    for (int i = 0; i < tmp.size(); ++i) a[L + i] = tmp[i]; // 拷回原数组',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>逆序对应用</strong>：当 <code>a[p1] > a[p2]</code> 时，说明 <code>p1 .. mid</code> 的所有剩余元素均比 <code>a[p2]</code> 大，逆序对贡献数为 <code>mid - p1 + 1</code>。</p>
        <p><strong>C++ STL 对照</strong>：<code>std::inplace_merge</code> 与 <code>std::stable_sort</code>。</p>
      `
    },
    defaultInput: [38, 27, 43, 3, 9, 82, 10],
    presets: {
      random: [70, 50, 30, 20, 10, 40, 60],
      reversed: [80, 70, 60, 50, 40, 30]
    },
    parseInput: parseArrayInput,
    generateFrames: generateMergeSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const arr = frame.state && frame.state.arr ? frame.state.arr : (Array.isArray(frame.state) ? frame.state : []);
      renderMergeSortStage(arr, frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 6. 快速排序 (Quick Sort - 408 相向双指针挖坑法)
  // =========================================================================
  function generateQuickSortFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [49, 38, 65, 97, 76, 13, 27, 49];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;
    const sortedSet = new Set();

    function runQuickSort(low, high) {
      if (low >= high) {
        if (low === high) sortedSet.add(low);
        return;
      }
      const pivotPos = partition(low, high);
      sortedSet.add(pivotPos);
      runQuickSort(low, pivotPos - 1);
      runQuickSort(pivotPos + 1, high);
    }

    function partition(low, high) {
      let l = low;
      let r = high;
      const pivot = a[l];

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [l],
        state: { arr: [...a], sorted: Array.from(sortedSet) },
        variables: { low: l, high: r, pivot, '挖坑点': l },
        codeLine: 8,
        explanation: `【408相向双指针挖坑起手】选定基准 pivot = a[${l}] = ${pivot}（拔出暂存），形成初始坑位 low = ${l}。`
      }));

      while (l < r) {
        while (l < r && a[r] >= pivot) {
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.COMPARE,
            indices: [r, l],
            state: { arr: [...a], sorted: Array.from(sortedSet) },
            variables: { low: l, high: r, pivot, 'a[r]': a[r] },
            codeLine: 10,
            explanation: `high 指针左移：a[${r}]=${a[r]} >= pivot(${pivot})，合规留在右区，high-- 至 ${r - 1}。`
          }));
          r--;
        }

        if (l < r) {
          a[l] = a[r];
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.SWAP,
            indices: [l, r],
            state: { arr: [...a], sorted: Array.from(sortedSet) },
            variables: { low: l, high: r, '填坑': `a[${l}] = ${a[r]}`, '新坑位': r },
            codeLine: 12,
            explanation: `发现小于基准项 a[${r}]=${a[r]} < ${pivot}！填入左侧坑位 a[${l}]，坑位转移至 high = ${r}。`
          }));
        }

        while (l < r && a[l] <= pivot) {
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.COMPARE,
            indices: [l, r],
            state: { arr: [...a], sorted: Array.from(sortedSet) },
            variables: { low: l, high: r, pivot, 'a[l]': a[l] },
            codeLine: 13,
            explanation: `low 指针右移：a[${l}]=${a[l]} <= pivot(${pivot})，合规留在左区，low++ 至 ${l + 1}。`
          }));
          l++;
        }

        if (l < r) {
          a[r] = a[l];
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.SWAP,
            indices: [r, l],
            state: { arr: [...a], sorted: Array.from(sortedSet) },
            variables: { low: l, high: r, '填坑': `a[${r}] = ${a[l]}`, '新坑位': l },
            codeLine: 15,
            explanation: `发现大于基准项 a[${l}]=${a[l]} > ${pivot}！填入右侧坑位 a[${r}]，坑位转移至 low = ${l}。`
          }));
        }
      }

      a[l] = pivot;
      sortedSet.add(l);
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MARK_SORTED,
        indices: [l],
        state: { arr: [...a], sorted: Array.from(sortedSet) },
        variables: { pivotIndex: l, pivot },
        codeLine: 16,
        explanation: `双向指针在下标 ${l} 相遇！基准数 ${pivot} 回填归位，此位置元素永久落定有序！`
      }));

      return l;
    }

    runQuickSort(0, n - 1);

    for (let k = 0; k < n; k++) sortedSet.add(k);
    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: a.map((_, idx) => idx),
      state: { arr: [...a], sorted: Array.from(sortedSet) },
      variables: { status: 'COMPLETE' },
      codeLine: 5,
      explanation: `快速排序分治完成！全体元素单调递增。`
    }));

    return frames;
  }

  const quickSortDef = {
    id: 'quick_sort',
    category: 'sorting',
    name: '快速排序 (408双指针)',
    en: 'Quick Sort (408)',
    meta: { tier: 'B组', time: 'O(N log N)', space: 'O(log N)', stability: '不稳定', is408: true, tags: ['Partition', '相向双指针', '第K小'] },
    templates: {
      python: [
        'def quick_sort(arr, low, high):  # 快速排序：选定枢轴划分左右，平均速度之王',
        '    if low < high:  # 区间至少含 2 个元素时继续分治',
        '        pivot_pos = partition(arr, low, high)  # 挖坑划分，返回枢轴最终就位下标',
        '        quick_sort(arr, low, pivot_pos - 1)  # 递归快排左侧小于等于枢轴的子区间',
        '        quick_sort(arr, pivot_pos + 1, high)  # 递归快排右侧大于等于枢轴的子区间',
        '',
        'def partition(arr, low, high):  # 408 权威相向双指针挖坑填坑法',
        '    pivot = arr[low]  # 拔出首元素作为基准枢轴 pivot，low 处形成初始空坑',
        '    while low < high:  # 左右指针未相遇时交替向中间逼近',
        '        while low < high and arr[high] >= pivot: high -= 1  # high 左移跳过 >= pivot 的合规元素',
        '        arr[low] = arr[high]  # 发现右侧偏小元素，抛入左侧 low 坑位（high 变新坑）',
        '        while low < high and arr[low] <= pivot: low += 1  # low 右移跳过 <= pivot 的合规元素',
        '        arr[high] = arr[low]  # 发现左侧偏大元素，抛入右侧 high 坑位（low 变新坑）',
        '    arr[low] = pivot  # low 与 high 会师于中心坑位，将 pivot 永久填入落锁',
        '    return low  # 返回枢轴最终全局绝对排名位置'
      ],
      cpp: [
        'int partition(vector<int>& a, int low, int high) { // 408 考研标准 Partition 挖坑划分',
        '    int pivot = a[low]; // 提取区间首元素为枢轴基准，low 变为初始空坑',
        '    while (low < high) { // 双指针相向夹逼直至会师',
        '        while (low < high && a[high] >= pivot) --high; // 右指针寻小',
        '        a[low] = a[high]; // 将小于 pivot 的元素填入左坑，high 成为新坑',
        '        while (low < high && a[low] <= pivot) ++low; // 左指针寻大',
        '        a[high] = a[low]; // 将大于 pivot 的元素填入右坑，low 成为新坑',
        '    }',
        '    a[low] = pivot; // 相遇点回填枢轴值，该元素即达最终有序位置',
        '    return low; // 返回分界下标',
        '}',
        'void quickSort(vector<int>& a, int low, int high) { // 快速排序递归主函数',
        '    if (low < high) { // 子区间有效时继续划分',
        '        int p = partition(a, low, high); // 一次划分确定 p 的绝对位置',
        '        quickSort(a, low, p - 1); // 递归左子表',
        '        quickSort(a, p + 1, high); // 递归右子表',
        '    }',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>408 官方权威写法</strong>：严格采用“相向双指针挖坑法”，基准取首元素 <code>pivot = a[low]</code>，<code>high</code> 先动寻小填坑，<code>low</code> 后动寻大填坑，相遇点回填 <code>pivot</code>。</p>
        <p><strong>C++ STL 对照</strong>：<code>std::sort</code> (Introsort 内省排序) 与 <code>std::nth_element</code> (求第K大元素 $O(N)$)。</p>
      `
    },
    defaultInput: [49, 38, 65, 97, 76, 13, 27, 49],
    presets: {
      random: [45, 12, 85, 32, 89, 38, 67, 24],
      nearly_sorted: [10, 20, 25, 40, 35, 50, 60]
    },
    parseInput: parseArrayInput,
    generateFrames: generateQuickSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const arr = frame.state && frame.state.arr ? frame.state.arr : (Array.isArray(frame.state) ? frame.state : []);
      const sorted = frame.state && frame.state.sorted ? new Set(frame.state.sorted) : null;
      renderQuickSortStage(arr, frame, sorted);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 7. 堆排序 (Heap Sort - 大根堆与下沉)
  // =========================================================================
  function generateHeapSortFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [16, 4, 10, 14, 7, 9, 3, 2, 8, 1];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;
    const sortedSet = new Set();

    function siftDown(i, heapSize) {
      let parent = i;
      while (true) {
        let largest = parent;
        const left = 2 * parent + 1;
        const right = 2 * parent + 2;

        if (left < heapSize) {
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.COMPARE,
            indices: [parent, left],
            state: { arr: [...a], heapSize, sorted: Array.from(sortedSet) },
            variables: { parent, left, heapSize, '父': a[parent], '左孩子': a[left] },
            codeLine: 5,
            explanation: `检查大根堆性质：父节点 a[${parent}]=${a[parent]} 与左孩子 a[${left}]=${a[left]} 比对。`
          }));
          if (a[left] > a[largest]) largest = left;
        }

        if (right < heapSize) {
          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.COMPARE,
            indices: [largest, right],
            state: { arr: [...a], heapSize, sorted: Array.from(sortedSet) },
            variables: { largest, right, heapSize, '较大者': a[largest], '右孩子': a[right] },
            codeLine: 7,
            explanation: `父节点/左孩子较大者 a[${largest}]=${a[largest]} 与右孩子 a[${right}]=${a[right]} 比对。`
          }));
          if (a[right] > a[largest]) largest = right;
        }

        if (largest !== parent) {
          const temp = a[parent];
          a[parent] = a[largest];
          a[largest] = temp;

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.SWAP,
            indices: [parent, largest],
            state: { arr: [...a], heapSize, sorted: Array.from(sortedSet) },
            variables: { parent, largest, '交换': `${temp} <-> ${a[parent]}` },
            codeLine: 9,
            explanation: `大顶堆性质被破坏：父节点与较大子节点对调，继续向下递归下沉。`
          }));
          parent = largest;
        } else {
          break;
        }
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { arr: [...a], heapSize: n, sorted: [] },
      variables: { '阶段': '自底向上构建大顶堆', n },
      codeLine: 2,
      explanation: `【阶段一：O(N) 自底向上建堆】从非叶节点 i = ${Math.floor(n / 2) - 1} 倒序下沉，构建大根堆。`
    }));

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      siftDown(i, n);
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.MARK_SORTED,
      indices: [0],
      state: { arr: [...a], heapSize: n, sorted: [] },
      variables: { '大根堆就绪': true, '堆顶最大值': a[0] },
      codeLine: 3,
      explanation: `大根堆构建完成！根节点 a[0]=${a[0]} 稳居全局第一最大值。`
    }));

    for (let end = n - 1; end > 0; end--) {
      const maxVal = a[0];
      a[0] = a[end];
      a[end] = maxVal;
      sortedSet.add(end);

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.SWAP,
        indices: [0, end],
        state: { arr: [...a], heapSize: end, sorted: Array.from(sortedSet) },
        variables: { end, '极值沉底': maxVal, '新堆规模': end },
        codeLine: 12,
        explanation: `【阶段二：极值沉底】将堆顶最大值 ${maxVal} 与有效堆末尾 a[${end}] 交换，下标 ${end} 永久锁定！`
      }));

      siftDown(0, end);
    }

    sortedSet.add(0);
    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: a.map((_, idx) => idx),
      state: { arr: [...a], heapSize: 0, sorted: a.map((_, idx) => idx) },
      variables: { status: 'COMPLETE' },
      codeLine: 15,
      explanation: `堆排序圆满结束！`
    }));

    return frames;
  }

  const heapSortDef = {
    id: 'heap_sort',
    category: 'sorting',
    name: '堆排序',
    en: 'Heap Sort',
    meta: { tier: 'B组', time: 'O(N log N)', space: 'O(1)', stability: '不稳定', is408: true, tags: ['完全二叉树', 'sift_down', '原地排序'] },
    templates: {
      python: [
        'def heap_sort(arr):  # 堆排序：完全二叉树原地最值维护，最坏严格 O(N log N)',
        '    n = len(arr)  # 数组总长（父 i 的左孩子为 2i+1，右孩子为 2i+2）',
        '    for i in range(n // 2 - 1, -1, -1):  # 阶段1：从最后一个非叶节点自底向上线性建堆 O(N)',
        '        sift_down(arr, i, n)  # 下沉调整子树 i，确保父节点 >= 左右孩子',
        '    for end in range(n - 1, 0, -1):  # 阶段2：依次将堆顶最大值交换至末尾封印区',
        '        arr[0], arr[end] = arr[end], arr[0]  # 堆顶极值 arr[0] 与当前堆尾 arr[end] 互换',
        '        sift_down(arr, 0, end)  # 有效堆边界缩减为 end，将新堆顶下沉恢复大根堆性质',
        '    return arr  # 原地输出递增有序序列（空间复杂度 O(1)）'
      ],
      cpp: [
        'void heapSort(vector<int>& arr) { // 堆排序：O(1) 辅助空间，408 必考建堆与下坠次数分析',
        '    int n = arr.size(); // 序列长度',
        '    for (int i = n / 2 - 1; i >= 0; --i) siftDown(arr, i, n); // 自底向上 O(N) 构建初始大根堆',
        '    for (int end = n - 1; end > 0; --end) { // 共执行 N-1 趟取顶与重建',
        '        swap(arr[0], arr[end]); // 堆顶最大值换入数组尾部 [end] 永久封印',
        '        siftDown(arr, 0, end); // 在缩小的堆区间 [0..end-1] 内执行 O(log N) 下滤',
        '    }',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>双重视图</strong>：逻辑上是完全二叉树（父节点 $i$，孩子 $2i+1, 2i+2$），物理上是连续数组。</p>
        <p><strong>C++ STL 对照</strong>：<code>std::make_heap</code>, <code>std::push_heap</code>, <code>std::pop_heap</code>, <code>std::sort_heap</code> 与 <code>std::priority_queue</code>。</p>
      `
    },
    defaultInput: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1],
    presets: {
      random: [35, 12, 78, 45, 90, 23, 67, 51],
      reversed: [90, 80, 70, 60, 50, 40]
    },
    parseInput: parseArrayInput,
    generateFrames: generateHeapSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      const arr = frame.state && frame.state.arr ? frame.state.arr : (Array.isArray(frame.state) ? frame.state : []);
      renderHeapDualView(arr, frame);
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 8. 计数排序 (Counting Sort)
  // =========================================================================
  function generateCountingSortFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [4, 2, 2, 8, 3, 3, 1];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;

    if (n <= 1) {
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: n === 1 ? [0] : [],
        state: { arr: [...a], count: [n], output: [...a], minVal: a[0] || 0, maxVal: a[0] || 0, phase: 'done' },
        variables: { n, status: 'TRIVIAL' },
        codeLine: 1,
        explanation: n === 0 ? '【计数排序】输入序列为空。' : '【计数排序】序列仅含 1 个元素，天然有序。'
      }));
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.DONE,
        indices: n === 1 ? [0] : [],
        state: { arr: [...a], count: [n], output: [...a], minVal: a[0] || 0, maxVal: a[0] || 0, phase: 'done' },
        variables: { status: 'COMPLETE', n },
        codeLine: 10,
        explanation: '计数排序完成！'
      }));
      return frames;
    }

    const minVal = Math.min(...a);
    const maxVal = Math.max(...a);
    const range = maxVal - minVal + 1;
    const count = new Array(range).fill(0);
    const output = new Array(n).fill(0);

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { arr: [...a], count: [...count], output: [...output], minVal, maxVal, phase: 'init' },
      variables: { n, minVal, maxVal, '值域跨度 range': range },
      codeLine: 2,
      explanation: `【计数排序初始化】值域范围 [${minVal} .. ${maxVal}]，构建跨度为 ${range} 的统计桶。`
    }));

    // 1. 频次统计
    for (let i = 0; i < n; i++) {
      const val = a[i];
      count[val - minVal]++;
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.MODIFY,
        indices: [i],
        state: { arr: [...a], count: [...count], output: [...output], minVal, maxVal, phase: 'count', activeIndex: val - minVal, currentAIdx: i },
        variables: { i, val, '对应桶下标': val - minVal, '当前计数值': count[val - minVal] },
        codeLine: 4,
        explanation: `遍历元素 a[${i}]=${val}，桶 count[${val - minVal}] 计数增加至 ${count[val - minVal]}。`
      }));
    }

    // 2. 前缀和累加
    for (let k = 1; k < range; k++) {
      count[k] += count[k - 1];
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [],
        state: { arr: [...a], count: [...count], output: [...output], minVal, maxVal, phase: 'prefix', activeIndex: k },
        variables: { k, '累计元素个数': count[k] },
        codeLine: 6,
        explanation: `前缀和累计：小于等于 ${k + minVal} 的元素共有 ${count[k]} 个。`
      }));
    }

    // 3. 逆序写回 output (稳定核心)
    for (let i = n - 1; i >= 0; i--) {
      const val = a[i];
      const outIdx = count[val - minVal] - 1;
      output[outIdx] = val;
      count[val - minVal]--;

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.SWAP,
        indices: [i],
        state: { arr: [...output], originalArr: [...a], count: [...count], output: [...output], minVal, maxVal, phase: 'output', outIdx, sourceIdx: i, val },
        variables: { i, val, '落入输出下标': outIdx, '剩余可用名额': count[val - minVal] },
        codeLine: 8,
        explanation: `【稳定逆向落位】从原数组逆序读出 a[${i}]=${val}，直接填入 output[${outIdx}]。`
      }));
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: output.map((_, idx) => idx),
      state: { arr: [...output], originalArr: [...a], count: [...count], output: [...output], minVal, maxVal, phase: 'done' },
      variables: { status: 'COMPLETE' },
      codeLine: 10,
      explanation: `计数排序完成！时间复杂度严格为线性 O(N + K)。`
    }));

    return frames;
  }

  const countingSortDef = {
    id: 'counting_sort',
    category: 'sorting',
    name: '计数排序',
    en: 'Counting Sort',
    meta: { tier: 'C组', time: 'O(N+K)', space: 'O(K)', stability: '稳定', is408: false, tags: ['前缀和', '值域映射', '稳定'] },
    templates: {
      python: [
        'def counting_sort(arr):  # 计数排序：值域桶映射 + 前缀和定位，突破 O(NlogN) 比较下界',
        '    min_v, max_v = min(arr), max(arr)  # 扫描锁定值域上下界，支持任意负数偏移映射',
        '    count = [0] * (max_v - min_v + 1)  # 开辟跨度为 K = max-min+1 的量筒计数桶',
        '    for x in arr: count[x - min_v] += 1  # 阶段1：遍历原数组，统计每个数值出现的频次',
        '    for i in range(1, len(count)): count[i] += count[i - 1]  # 阶段2：求前缀和，算出每个值在输出中的末尾名次',
        '    out = [0] * len(arr)  # 开辟与原数组等长的对号入座输出舱',
        '    for x in reversed(arr):  # 阶段3：从右向左逆序遍历原数组（保障稳定性的灵魂步骤！）',
        '        out[count[x - min_v] - 1] = x  # 按前缀和指示的座位号将元素精准填入输出舱',
        '        count[x - min_v] -= 1  # 座位号前移 1 位，供前一个相等元素落座在左边',
        '    return out  # 返回稳定排序结果，总时间复杂度 O(N + K)'
      ],
      cpp: [
        'vector<int> countingSort(const vector<int>& a) { // 计数排序：线性时间稳定非比较排序',
        '    int min_v = *min_element(a.begin(), a.end()); // 提取最小值用于紧凑偏移',
        '    int max_v = *max_element(a.begin(), a.end()); // 提取最大值确定桶数组跨度',
        '    vector<int> count(max_v - min_v + 1, 0), out(a.size()); // 初始化频次桶与输出数组',
        '    for (int x : a) count[x - min_v]++; // 统计各元素频次',
        '    for (size_t i = 1; i < count.size(); ++i) count[i] += count[i-1]; // 前缀和折算排名边界',
        '    for (int i = a.size() - 1; i >= 0; --i) { // 逆序扫描原数组确保相同元素保持原先后次序',
        '        out[--count[a[i] - min_v]] = a[i]; // 先递减计数桶取得 0-based 排名下标并写入',
        '    }',
        '    return out; // 返回稳定有序结果',
        '}'
      ]
    },
    stlCard: {
      title: '📘 考点速查与前缀和映射',
      content: `
        <p><strong>非比较排序之王</strong>：突破了比较排序的 $O(N \\log N)$ 下界。前缀和逆序遍历保证了稳定性。</p>
      `
    },
    defaultInput: [4, 2, 2, 8, 3, 3, 1],
    presets: {
      duplicates: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
      small_range: [10, 12, 11, 15, 12, 10, 14]
    },
    parseInput: parseArrayInput,
    generateFrames: generateCountingSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      if (frame && frame.state && frame.state.count) {
        renderCountingSortDualView(frame);
      } else {
        const arr = frame.state && frame.state.arr ? frame.state.arr : (Array.isArray(frame.state) ? frame.state : []);
        renderArrayBars(arr, frame);
      }
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 9. 基数排序 (Radix Sort - LSD)
  // =========================================================================
  function generateRadixSortFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [170, 45, 75, 90, 802, 24, 2, 66];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;

    // Boundary condition: empty or single element array
    if (n <= 1) {
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: n === 1 ? [0] : [],
        state: { arr: [...a], buckets: Array.from({ length: 10 }, () => []), activeBucket: null },
        variables: { n, status: 'TRIVIAL' },
        codeLine: 1,
        explanation: n === 0 ? '【基数排序】输入序列为空。' : '【基数排序】序列仅含 1 个元素，天然有序。'
      }));
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.DONE,
        indices: n === 1 ? [0] : [],
        state: { arr: [...a], buckets: Array.from({ length: 10 }, () => []), activeBucket: null },
        variables: { status: 'COMPLETE', n },
        codeLine: 12,
        explanation: '排序完成！'
      }));
      return frames;
    }

    const minVal = Math.min(...a);
    const hasNegatives = minVal < 0;
    const offset = hasNegatives ? -minVal : 0;
    const maxVal = Math.max(...a);
    const maxMapped = maxVal + offset;
    let exp = 1;

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { arr: [...a], buckets: Array.from({ length: 10 }, () => []), activeBucket: null },
      variables: hasNegatives
        ? { n, minVal, maxVal, '偏移量 offset': offset, '映射最大值': maxMapped, '位权起点': '个位 (exp=1)' }
        : { n, maxVal, '位权起点': '个位 (exp=1)' },
      codeLine: 2,
      explanation: hasNegatives
        ? `【基数排序 LSD 就绪】检测到负数 (minVal=${minVal})，引入全局非负映射偏移量 Δ=${offset}，值域映射至 [0 .. ${maxMapped}] 进行十进制稳定按位分配。`
        : `【基数排序 LSD 就绪】全序列最高值为 ${maxVal}。从低位到高位依次进行 10 队列分配与收集。`
    }));

    while (Math.floor(maxMapped / exp) > 0 || (exp === 1 && maxMapped === 0)) {
      const buckets = Array.from({ length: 10 }, () => []);
      const digitName = exp === 1 ? '个位' : (exp === 10 ? '十位' : (exp === 100 ? '百位' : `${exp}位`));

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: [],
        state: { arr: [...a], buckets: buckets.map(b => [...b]), activeBucket: null },
        variables: { exp, '当前位': digitName },
        codeLine: 4,
        explanation: `开始针对【${digitName} (exp=${exp})】启动 10 列队列分配。`
      }));

      // 分配 (Distribution Phase)
      for (let i = 0; i < n; i++) {
        const mappedVal = a[i] + offset;
        const digit = Math.floor(mappedVal / exp) % 10;
        buckets[digit].push(a[i]);

        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.PUSH,
          indices: [i],
          state: { arr: [...a], buckets: buckets.map(b => [...b]), activeBucket: digit },
          variables: hasNegatives
            ? { i, val: a[i], '映射非负值': mappedVal, digit, '入桶': `第 ${digit} 号桶` }
            : { i, val: a[i], digit, '入桶': `第 ${digit} 号桶` },
          codeLine: 6,
          explanation: hasNegatives
            ? `元素 a[${i}] = ${a[i]} (非负映射 ${mappedVal}) 的【${digitName}】为 ${digit}，排入第 ${digit} 号队列桶。`
            : `元素 a[${i}] = ${a[i]} 的对应数位为 ${digit}，排入第 ${digit} 号队列桶。`
        }));
      }

      // 收集 (Collection Phase)
      let writeIdx = 0;
      for (let b = 0; b < 10; b++) {
        while (buckets[b].length > 0) {
          const item = buckets[b].shift();
          a[writeIdx] = item;

          frames.push(new SnapshotFrame({
            step: step++,
            action: ActionTypes.POP,
            indices: [writeIdx],
            state: { arr: [...a], buckets: buckets.map(bk => [...bk]), activeBucket: b },
            variables: { '收集自桶': b, writeIdx, item },
            codeLine: 9,
            explanation: `从第 ${b} 号桶弹出元素 ${item} 刷回原数组 a[${writeIdx}]。`
          }));
          writeIdx++;
        }
      }

      exp *= 10;
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: a.map((_, idx) => idx),
      state: { arr: [...a], buckets: Array.from({ length: 10 }, () => []), activeBucket: null },
      variables: { status: 'COMPLETE' },
      codeLine: 12,
      explanation: hasNegatives
        ? `基数排序全部有效位分配与收集完毕！经平移非负映射分配，全序列严格恢复有序。`
        : `基数排序全部有效位分配与收集完毕！`
    }));

    return frames;
  }

  const radixSortDef = {
    id: 'radix_sort',
    category: 'sorting',
    name: '基数排序 (LSD)',
    en: 'Radix Sort (LSD)',
    meta: { tier: 'B组', time: 'O(D(N+K))', space: 'O(N+K)', stability: '稳定', is408: true, tags: ['按位分配', '多关键字', '稳定'] },
    templates: {
      python: [
        'def radix_sort(arr):  # 基数排序(LSD)：从低位到高位多轮按位稳定分桶收集',
        '    if not arr: return arr  # 空序列边界防御',
        '    min_v, max_v = min(arr), max(arr)  # 探测极值，准备兼容负数偏移',
        '    offset = -min_v if min_v < 0 else 0  # 若含负数，引入全局非负平移量 offset',
        '    max_v += offset  # 计算平移后的最大非负整数，决定最高有效位数 D',
        '    exp = 1  # 位权因子：1(个位) -> 10(十位) -> 100(百位)...',
        '    while max_v // exp > 0:  # 由低位向高位逐位执行十进制稳定分配',
        '        buckets = [[] for _ in range(10)]  # 初始化 0 ~ 9 号十联 FIFO 队列试管桶',
        '        for x in arr:  # 分配阶段：提取当前 exp 位上的十进制数字入桶',
        '            buckets[((x + offset) // exp) % 10].append(x)  # 尾部追加保持上轮次序',
        '        arr = [x for b in buckets for x in b]  # 收集阶段：按 0~9 号桶依次先进先出串联',
        '        exp *= 10  # 聚光灯左移一位，进军更高数位',
        '    return arr  # D 轮过后全局严格有序，时间 O(D·(N+10))'
      ],
      cpp: [
        'void radixSort(vector<int>& arr) { // LSD 基数排序（带负数偏移映射通用版）',
        '    if (arr.empty()) return; // 空数组直接返回',
        '    int min_v = *min_element(arr.begin(), a.end()); // 查找最小值',
        '    int offset = min_v < 0 ? -min_v : 0; // 计算非负映射偏移量',
        '    int max_v = *max_element(arr.begin(), arr.end()) + offset; // 映射后最大值',
        '    for (int exp = 1; max_v / exp > 0; exp *= 10) { // 按个位、十位、百位迭代',
        '        vector<int> out(arr.size()), count(10, 0); // 10 进制计数桶与输出缓冲',
        '        for (int x : arr) count[((x + offset) / exp) % 10]++; // 统计当前数位频次',
        '        for (int i = 1; i < 10; ++i) count[i] += count[i-1]; // 前缀和计算落座位置',
        '        for (int i = arr.size() - 1; i >= 0; --i) // 逆序回填保持前序低位稳定性',
        '            out[--count[((arr[i] + offset) / exp) % 10]] = arr[i]; // 按当前位落座',
        '        arr = out; // 覆盖进入下一高位轮次',
        '    }',
        '}'
      ]
    },
    stlCard: {
      title: '📘 408 考研数据结构考点速查',
      content: `
        <p><strong>LSD vs MSD</strong>：LSD（最低位优先）更适合固定小位长整数，每轮分配收集必须保持稳定性；MSD（最高位优先）更适合长文本分治。</p>
        <p><strong>负数支持（值域映射技巧）</strong>：标准基数排序直接取模遇到负数会出现负桶下标。通用解决方案为提取 $minVal$，若 $minVal < 0$ 则引入全局偏移量 $\Delta = -minVal$，按 $(x + \Delta)$ 的十进制数位分配，桶中直接保存真实原数值，利用稳定 FIFO 收集，天然输出 100% 有序序列。</p>
      `
    },
    defaultInput: [170, 45, 75, 90, 802, 24, 2, 66],
    presets: {
      mixed: [329, 457, 657, 839, 436, 720, 355],
      negative: [-15, 23, -8, 0, 42, -50, 16]
    },
    parseInput: parseArrayInput,
    generateFrames: generateRadixSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      if (frame && frame.state && frame.state.buckets) {
        renderRadixSortDualView(frame);
      } else {
        const arr = frame.state && frame.state.arr ? frame.state.arr : (Array.isArray(frame.state) ? frame.state : []);
        renderArrayBars(arr, frame);
      }
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // =========================================================================
  // 10. 桶排序 (Bucket Sort)
  // =========================================================================
  function generateBucketSortFrames(input) {
    const arr = Array.isArray(input) ? [...input] : [29, 25, 3, 49, 9, 37, 21, 43];
    const n = arr.length;
    const a = [...arr];
    const frames = [];
    let step = 0;

    // Boundary condition: empty or single element array
    if (n <= 1) {
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.HIGHLIGHT,
        indices: n === 1 ? [0] : [],
        state: { arr: [...a], buckets: Array.from({ length: 5 }, () => []), activeBucket: null, bucketCount: 5, bucketRange: 1, minVal: a[0] || 0 },
        variables: { n, status: 'TRIVIAL' },
        codeLine: 1,
        explanation: n === 0 ? '【桶排序】输入序列为空。' : '【桶排序】序列仅含 1 个元素，天然有序。'
      }));
      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.DONE,
        indices: n === 1 ? [0] : [],
        state: { arr: [...a], buckets: Array.from({ length: 5 }, () => []), activeBucket: null, bucketCount: 5, bucketRange: 1, minVal: a[0] || 0 },
        variables: { status: 'COMPLETE', n },
        codeLine: 9,
        explanation: '排序完成！'
      }));
      return frames;
    }

    const minVal = Math.min(...a);
    const maxVal = Math.max(...a);
    const bucketCount = 5;
    const bucketRange = Math.max(1, Math.ceil((maxVal - minVal + 1) / bucketCount));
    const buckets = Array.from({ length: bucketCount }, () => []);

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.HIGHLIGHT,
      indices: [],
      state: { arr: [...a], buckets: buckets.map(b => [...b]), activeBucket: null, bucketCount, bucketRange, minVal },
      variables: { minVal, maxVal, bucketCount, bucketRange },
      codeLine: 2,
      explanation: `初始化 ${bucketCount} 个区间大桶，每桶覆盖数值跨度为 ${bucketRange}。`
    }));

    for (let i = 0; i < n; i++) {
      const val = a[i];
      const bIdx = Math.min(bucketCount - 1, Math.floor((val - minVal) / bucketRange));
      buckets[bIdx].push(val);

      frames.push(new SnapshotFrame({
        step: step++,
        action: ActionTypes.PUSH,
        indices: [i],
        state: { arr: [...a], buckets: buckets.map(b => [...b]), activeBucket: bIdx, bucketCount, bucketRange, minVal },
        variables: { i, val, bIdx, '入桶': `桶 ${bIdx}` },
        codeLine: 4,
        explanation: `元素 a[${i}] = ${val} 映射投入第 ${bIdx} 号大桶。`
      }));
    }

    let writeIdx = 0;
    for (let b = 0; b < bucketCount; b++) {
      buckets[b].sort((x, y) => x - y);
      for (const val of buckets[b]) {
        a[writeIdx] = val;
        frames.push(new SnapshotFrame({
          step: step++,
          action: ActionTypes.MODIFY,
          indices: [writeIdx],
          state: { arr: [...a], buckets: buckets.map(bk => [...bk]), activeBucket: b, bucketCount, bucketRange, minVal },
          variables: { b, writeIdx, val },
          codeLine: 7,
          explanation: `从排序好的第 ${b} 号桶中倒出元素 ${val} 填入输出序列 a[${writeIdx}]。`
        }));
        writeIdx++;
      }
    }

    frames.push(new SnapshotFrame({
      step: step++,
      action: ActionTypes.DONE,
      indices: a.map((_, idx) => idx),
      state: { arr: [...a], buckets: buckets.map(b => [...b]), activeBucket: null, bucketCount, bucketRange, minVal },
      variables: { status: 'COMPLETE' },
      codeLine: 9,
      explanation: `桶排序拼接完毕！`
    }));

    return frames;
  }

  const bucketSortDef = {
    id: 'bucket_sort',
    category: 'sorting',
    name: '桶排序',
    en: 'Bucket Sort',
    meta: { tier: 'B组', time: 'O(N+K)', space: 'O(N+K)', stability: '稳定', is408: false, tags: ['区间映射', '外部归并', '稳定'] },
    templates: {
      python: [
        'def bucket_sort(arr, k=5):  # 桶排序：值域均匀切片分桶 + 桶内各自排序 + 顺序拼接',
        '    min_v, max_v = min(arr), max(arr)  # 获取全序列值域跨度 [min_v .. max_v]',
        '    width = max(1, (max_v - min_v + 1) // k + 1)  # 计算每个区间大木桶覆盖的数值宽度',
        '    buckets = [[] for _ in range(k)]  # 创建 k 个并列的区间分拣桶',
        '    for x in arr:  # 分发阶段：将每个元素按线性映射公式投入对应区间桶',
        '        idx = min(k - 1, (x - min_v) // width)  # 计算目标桶编号 idx ∈ [0 .. k-1]',
        '        buckets[idx].append(x)  # 元素滑入第 idx 号区间木桶',
        '    return [x for b in buckets for x in sorted(b)]  # 桶内微缩排序后按桶号依次倒出拼接'
      ],
      cpp: [
        'void bucketSort(vector<int>& arr, int k = 5) { // 桶排序：均匀分布下期望时间 O(N)',
        '    int min_v = *min_element(arr.begin(), arr.end()); // 值域下界',
        '    int max_v = *max_element(arr.begin(), arr.end()); // 值域上界',
        '    int width = max(1, (max_v - min_v + 1) / k + 1); // 单桶覆盖区间宽度',
        '    vector<vector<int>> b(k); // 初始化 k 个区间桶容器',
        '    for (int x : arr) b[min(k - 1, (x - min_v) / width)].push_back(x); // 映射入桶',
        '    arr.clear(); // 清空原数组准备接收有序数据',
        '    for (auto& bucket : b) { // 依次处理 0 ~ k-1 号桶',
        '        sort(bucket.begin(), bucket.end()); // 桶内局部排序',
        '        arr.insert(arr.end(), bucket.begin(), bucket.end()); // 按序拼接回主数组',
        '    }',
        '}'
      ]
    },
    stlCard: {
      title: '📘 算法特点与分治应用',
      content: `
        <p><strong>适用场景</strong>：数据分布均匀时表现为 $O(N)$ 线性时间。若数据高度倾斜，全部落入同一个桶，将退化为桶内算法复杂度。</p>
      `
    },
    defaultInput: [29, 25, 3, 49, 9, 37, 21, 43],
    presets: {
      uniform: [15, 23, 4, 38, 42, 19, 50, 7]
    },
    parseInput: parseArrayInput,
    generateFrames: generateBucketSortFrames,
    run: function(input) { return this.generateFrames(input || this.defaultInput); },
    render: function(frame) {
      if (frame && frame.state && frame.state.buckets) {
        renderBucketSortDualView(frame);
      } else {
        const arr = frame.state && frame.state.arr ? frame.state.arr : (Array.isArray(frame.state) ? frame.state : []);
        renderArrayBars(arr, frame);
      }
    },
    init: function(controller, customData) {
      commonInit(this, controller, customData);
    }
  };

  // Register all 10 sorting algorithms
  const allSortingAlgorithms = [
    bubbleSortDef,
    selectionSortDef,
    insertionSortDef,
    shellSortDef,
    mergeSortDef,
    quickSortDef,
    heapSortDef,
    countingSortDef,
    radixSortDef,
    bucketSortDef
  ];

  allSortingAlgorithms.forEach(def => {
    if (global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.register === 'function') {
      global.AlgoSystem.visualizers.register(def.id, def);
    }
  });

  // Module Export
  global.AlgoSystem.visualizers.sorting = {
    algorithms: allSortingAlgorithms,
    bubbleSort: bubbleSortDef,
    selectionSort: selectionSortDef,
    insertionSort: insertionSortDef,
    shellSort: shellSortDef,
    mergeSort: mergeSortDef,
    quickSort: quickSortDef,
    heapSort: heapSortDef,
    countingSort: countingSortDef,
    radixSort: radixSortDef,
    bucketSort: bucketSortDef
  };

})(typeof window !== 'undefined' ? window : globalThis);
