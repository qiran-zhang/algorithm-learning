/**
 * @file controls.js
 * @description Playback controls toolbar, timeline scrubber, input sanitizer, and shortcuts.
 * @namespace window.AlgoSystem.components.Controls
 *
 * 16th Blue Bridge Cup Algorithm Learning & Visualization Platform
 * Zero-CORS, Zero-build, file:// protocol compatible.
 */
(function(global) {
  'use strict';

  global.AlgoSystem = global.AlgoSystem || {};
  global.AlgoSystem.components = global.AlgoSystem.components || {};

  let _controller = null;
  let _onDataReloadCallback = null;

  // DOM 元素引用
  let $btnPlayPause = null;
  let $btnStepPrev = null;
  let $btnStepNext = null;
  let $btnReset = null;
  let $timelineSlider = null;
  let $stepCounter = null;
  let $actionBadge = null;
  let $speedSlider = null;
  let $speedValue = null;
  let $presetSelect = null;
  let $customInput = null;
  let $btnApplyInput = null;
  let $btnRandomInput = null;
  let $inputErrorMsg = null;
  let $iconPlay = null;
  let $iconPause = null;

  /**
   * 初始化控制栏
   * @param {Object} options
   * @param {Object} [options.controller] - PlaybackController 实例
   * @param {Function} [options.onDataReload] - 数据变更回调函数 (newData: number[]) => void
   */
  function init(options) {
    options = options || {};
    _onDataReloadCallback = options.onDataReload || null;

    cacheElements();

    if (options.controller) {
      bindController(options.controller);
    }

    bindDOMEvents();
    bindKeyboardShortcuts();
  }

  function cacheElements() {
    $btnPlayPause = document.getElementById('btnPlayPause') || document.getElementById('btn-play-pause');
    $btnStepPrev = document.getElementById('btnStepPrev') || document.getElementById('btn-step-prev');
    $btnStepNext = document.getElementById('btnStepNext') || document.getElementById('btn-step-next');
    $btnReset = document.getElementById('btnReset') || document.getElementById('btn-reset');
    $timelineSlider = document.getElementById('timelineSlider') || document.getElementById('timeline-slider');
    $stepCounter = document.getElementById('stepCounter') || document.getElementById('step-counter');
    $actionBadge = document.getElementById('actionBadge');
    $speedSlider = document.getElementById('speedSlider') || document.getElementById('speed-slider');
    $speedValue = document.getElementById('speedValue') || document.getElementById('speed-label');
    $presetSelect = document.getElementById('presetSelect') || document.getElementById('preset-select');
    $customInput = document.getElementById('customInput') || document.getElementById('custom-input');
    $btnApplyInput = document.getElementById('btnApplyInput') || document.getElementById('btn-apply-input');
    $btnRandomInput = document.getElementById('btnRandomInput') || document.getElementById('btn-random-data');
    $inputErrorMsg = document.getElementById('inputErrorMsg') || document.getElementById('input-error-msg');
    $iconPlay = document.getElementById('iconPlay');
    $iconPause = document.getElementById('iconPause');
  }

  /**
   * 绑定 PlaybackController 实例
   * @param {Object} controller
   */
  function bindController(controller) {
    _controller = controller;
    if (!_controller) return;

    if (typeof _controller.on === 'function') {
      _controller.on('frameChange', function(payload) {
        updateFrameView(payload);
      });

      _controller.on('stateChange', function(payload) {
        updateStateView(payload.state);
      });

      _controller.on('speedChange', function(payload) {
        updateSpeedView(payload.speed);
      });
    }

    // 初始化速度视图
    if ($speedSlider && typeof _controller.getSpeed === 'function') {
      const sp = _controller.getSpeed();
      $speedSlider.value = sp;
      updateSpeedView(sp);
    }
  }

  function bindDOMEvents() {
    // 播放 / 暂停
    if ($btnPlayPause) {
      $btnPlayPause.addEventListener('click', function() {
        if (_controller) _controller.togglePlay();
      });
    }

    // 单步后退
    if ($btnStepPrev) {
      $btnStepPrev.addEventListener('click', function() {
        if (_controller) _controller.stepBackward();
      });
    }

    // 单步前进
    if ($btnStepNext) {
      $btnStepNext.addEventListener('click', function() {
        if (_controller) _controller.stepForward();
      });
    }

    // 复位重置
    if ($btnReset) {
      $btnReset.addEventListener('click', function() {
        if (_controller) _controller.reset();
      });
    }

    // 时间轴拖拽进度条
    if ($timelineSlider) {
      $timelineSlider.addEventListener('input', function(e) {
        const step = parseInt(e.target.value, 10);
        if (_controller && !isNaN(step)) {
          _controller.jumpToStep(step);
        }
      });
    }

    // 速度滑块
    if ($speedSlider) {
      $speedSlider.addEventListener('input', function(e) {
        const delayMs = parseInt(e.target.value, 10);
        updateSpeedView(delayMs);
        if (_controller && typeof _controller.setSpeed === 'function') {
          _controller.setSpeed(delayMs);
        }
      });
    }

    // 预设数据集下拉切换
    if ($presetSelect) {
      $presetSelect.addEventListener('change', function(e) {
        handlePresetChange(e.target.value);
      });
    }

    // 自定义数据装载
    if ($btnApplyInput) {
      $btnApplyInput.addEventListener('click', function() {
        handleApplyCustomInput();
      });
    }

    if ($customInput) {
      $customInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleApplyCustomInput();
        }
      });
    }

    // 随机数据生成
    if ($btnRandomInput) {
      $btnRandomInput.addEventListener('click', function() {
        handleGenerateRandomData();
      });
    }
  }

  function bindKeyboardShortcuts() {
    window.addEventListener('keydown', function(e) {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
        return;
      }

      // Ctrl+B (或 Cmd+B): 切换左侧导航栏
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        const btnToggleLeft = document.getElementById('btnToggleLeftSidebar');
        if (btnToggleLeft) {
          btnToggleLeft.click();
        } else {
          const sidebar = document.getElementById('sidebarDrawer');
          if (sidebar) {
            sidebar.classList.toggle('is-collapsed');
            syncSidebarToggles();
          }
        }
        return;
      }

      // Ctrl+I (或 Cmd+I): 切换右侧代码与检查器面板
      if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        const btnToggleRight = document.getElementById('btnToggleRightInspector');
        if (btnToggleRight) {
          btnToggleRight.click();
        } else {
          const inspector = document.getElementById('inspectorPanel');
          if (inspector) {
            inspector.classList.toggle('is-collapsed');
            syncSidebarToggles();
          }
        }
        return;
      }

      if (!_controller) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          _controller.togglePlay();
          break;
        case 'ArrowLeft':
        case 'KeyJ':
          e.preventDefault();
          _controller.stepBackward();
          break;
        case 'ArrowRight':
        case 'KeyL':
          e.preventDefault();
          _controller.stepForward();
          break;
        case 'KeyR':
          e.preventDefault();
          _controller.reset();
          break;
        default:
          break;
      }
    });
  }

  /**
   * 响应帧更新
   * @param {Object} payload { frame, currentStep, totalSteps, percentage, isFirst, isLast }
   */
  function updateFrameView(payload) {
    const currentStep = payload.currentStep !== undefined ? payload.currentStep : 0;
    const totalSteps = payload.totalSteps !== undefined ? payload.totalSteps : 0;
    const frame = payload.frame;

    // 更新时间轴滑块
    if ($timelineSlider) {
      if (totalSteps <= 0) {
        $timelineSlider.min = '0';
        $timelineSlider.max = '0';
        $timelineSlider.value = '0';
        $timelineSlider.disabled = true;
      } else {
        $timelineSlider.disabled = false;
        $timelineSlider.min = '0';
        $timelineSlider.max = (totalSteps - 1).toString();
        $timelineSlider.value = currentStep.toString();
      }
    }

    // 更新步数指示器
    if ($stepCounter) {
      if (totalSteps <= 0) {
        $stepCounter.textContent = '第 0 / 0 步';
      } else if (currentStep >= totalSteps - 1) {
        $stepCounter.innerHTML = `<span class="step-done">第 ${totalSteps} / ${totalSteps} 步 (完成)</span>`;
      } else {
        $stepCounter.textContent = `第 ${currentStep + 1} / ${totalSteps} 步`;
      }
    }

    // 更新动作徽章
    if ($actionBadge) {
      if (frame && frame.action) {
        $actionBadge.textContent = frame.action;
        $actionBadge.style.display = 'inline-block';
      } else {
        $actionBadge.textContent = 'IDLE';
      }
    }

    // 更新后退与前进按钮禁用状态
    if ($btnStepPrev) {
      $btnStepPrev.disabled = (totalSteps <= 0 || currentStep <= 0);
    }
    if ($btnStepNext) {
      $btnStepNext.disabled = (totalSteps <= 0 || currentStep >= totalSteps - 1);
    }
  }

  /**
   * 响应控制器播放状态切换
   * @param {string} state 'IDLE' | 'RUNNING' | 'PAUSED' | 'FINISHED'
   */
  function updateStateView(state) {
    if (!$btnPlayPause) return;

    if (state === 'RUNNING') {
      if ($iconPlay && $iconPause) {
        $iconPlay.classList.add('hidden');
        $iconPause.classList.remove('hidden');
      } else {
        $btnPlayPause.innerHTML = '❚❚ 暂停';
      }
      $btnPlayPause.classList.add('playing');
      $btnPlayPause.setAttribute('title', '暂停播放 (Space)');
    } else if (state === 'FINISHED') {
      if ($iconPlay && $iconPause) {
        $iconPlay.classList.remove('hidden');
        $iconPause.classList.add('hidden');
      } else {
        $btnPlayPause.innerHTML = '↺ 重放';
      }
      $btnPlayPause.classList.remove('playing');
      $btnPlayPause.setAttribute('title', '重新播放 (Space)');
    } else {
      // IDLE 或 PAUSED
      if ($iconPlay && $iconPause) {
        $iconPlay.classList.remove('hidden');
        $iconPause.classList.add('hidden');
      } else {
        $btnPlayPause.innerHTML = '▶ 播放';
      }
      $btnPlayPause.classList.remove('playing');
      $btnPlayPause.setAttribute('title', '开始播放 (Space)');
    }
  }

  function updateSpeedView(speedMs) {
    if ($speedValue) {
      $speedValue.textContent = `${speedMs}ms`;
    }
  }

  /**
   * 处理数据预设切换
   */
  function handlePresetChange(presetKey) {
    let presetData = null;
    switch (presetKey) {
      case 'random':
        presetData = generateRandomArray(10, 10, 99);
        break;
      case 'reversed':
        presetData = [95, 83, 74, 62, 51, 40, 28, 15];
        break;
      case 'nearly_sorted':
        presetData = [12, 18, 25, 30, 42, 38, 55, 68, 80];
        break;
      case 'few_unique':
      case 'duplicates':
        presetData = [20, 50, 20, 80, 50, 20, 90, 50];
        break;
      case 'minimal':
        presetData = [42, 10, 28, 55, 17];
        break;
      default:
        presetData = [35, 12, 78, 45, 90, 23, 67, 51];
        break;
    }

    if ($customInput) {
      $customInput.value = presetData.join(', ');
    }
    showInputError('');
    notifyDataReload(presetData);
  }

  /**
   * 处理自定义数组应用
   */
  function handleApplyCustomInput() {
    if (!$customInput) return;
    const rawText = $customInput.value;
    const result = sanitizeArrayInput(rawText);

    if (!result.success) {
      showInputError(result.error);
      triggerInputShake();
      showToast(result.error, 'error');
      return;
    }

    showInputError('');
    $customInput.value = result.data.join(', ');

    if (result.warning) {
      showToast(result.warning, 'warn');
    }

    notifyDataReload(result.data);
  }

  /**
   * 严格数组输入校验器 ($N \in [2, 35]$, [-999, 9999])
   */
  function sanitizeArrayInput(text) {
    if (!text || typeof text !== 'string') {
      return { success: false, error: '输入不能为空，请输入逗号隔开的数字序列' };
    }

    // 格式清洗：中英文全角/半角括号、中文逗号规范化
    const cleaned = text.replace(/，/g, ',')
                        .replace(/[\[\]\(\)\{\}\u3010\u3011\uff08\uff09\uff3b\uff3d\uff5b\uff5d【】（）［］｛｝]/g, '')
                        .trim();

    if (!cleaned) {
      return { success: false, error: '输入内容为空' };
    }

    const tokens = cleaned.split(/[\s,]+/).filter(t => t.length > 0);
    const numbers = [];

    for (let i = 0; i < tokens.length; i++) {
      const num = Number(tokens[i]);
      if (isNaN(num)) {
        return { success: false, error: `发现非法非数字字符 "${tokens[i]}"，请修正` };
      }
      if (num < -999 || num > 9999) {
        return { success: false, error: `数值 ${num} 超出安全边界 [-999, 9999]` };
      }
      numbers.push(Math.round(num));
    }

    if (numbers.length < 2) {
      return { success: false, error: '数据项过少，算法演示至少需要 2 个数字' };
    }

    if (numbers.length > 35) {
      const truncated = numbers.slice(0, 35);
      return {
        success: true,
        data: truncated,
        warning: `已自动截断前 35 项数据以保障浏览器流畅运行`
      };
    }

    return { success: true, data: numbers };
  }

  function handleGenerateRandomData() {
    const count = Math.floor(Math.random() * 5) + 8; // 8 - 12 项
    const randomArray = generateRandomArray(count, 5, 95);

    if ($customInput) {
      $customInput.value = randomArray.join(', ');
    }
    showInputError('');
    notifyDataReload(randomArray);
  }

  function generateRandomArray(count, min, max) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
  }

  function notifyDataReload(data) {
    if (_onDataReloadCallback) {
      _onDataReloadCallback(data);
    } else if (typeof global.AlgoSystem.reloadCurrentVisualizer === 'function') {
      global.AlgoSystem.reloadCurrentVisualizer(data);
    }
  }

  function showInputError(msg) {
    if (!$inputErrorMsg) return;
    $inputErrorMsg.textContent = msg || '';
    $inputErrorMsg.style.display = msg ? 'block' : 'none';
  }

  function triggerInputShake() {
    if (!$customInput) return;
    $customInput.classList.remove('shake', 'input-invalid');
    void $customInput.offsetWidth; // 触发重绘
    $customInput.classList.add('shake', 'input-invalid');
    setTimeout(() => {
      $customInput.classList.remove('shake', 'input-invalid');
    }, 400);
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 300ms ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // =========================================================================
  // 主题风格快速切换引擎 (Dark / Cyber Blue / Light / Warm Light Default)
  // =========================================================================
  const THEMES = [
    { id: 'dark-theme', label: '🎨 风格: 暗黑', name: 'VS Code 暗黑', preset: 'VS Code Dark', bg: '#1E1E1E', fg: '#D4D4D4', accent: '#007ACC' },
    { id: 'cyber-blue-theme', label: '🎨 风格: 赛博蓝', name: '科技赛博蓝', preset: 'Cyberpunk Blue', bg: '#070D19', fg: '#F0F6FC', accent: '#0284C7' },
    { id: 'light-theme', label: '🎨 风格: 考场白', name: '清新考场白', preset: 'Clean Light', bg: '#F4F6F9', fg: '#0F172A', accent: '#0284C7' },
    { id: 'warm-light-theme', label: '🎨 风格: 羊皮纸', name: '温润羊皮纸 (Default Light: #FAF4E5)', preset: 'Default Light', bg: '#FAF4E5', fg: '#435155', accent: '#CB4B16' }
  ];

  function initThemeSwitcher() {
    let savedTheme = 'dark-theme';
    try {
      savedTheme = localStorage.getItem('algo_system_theme') || 'dark-theme';
    } catch (e) {}

    applyTheme(savedTheme, false);

    const btnToggle = document.getElementById('btnThemeToggle');
    if (btnToggle) {
      btnToggle.addEventListener('click', function() {
        const currentClass = document.documentElement.className || '';
        const match = currentClass.match(/(dark-theme|cyber-blue-theme|light-theme|warm-light-theme)/);
        const currentId = match ? match[1] : 'dark-theme';
        const currentIndex = THEMES.findIndex(t => t.id === currentId);
        const nextIndex = (currentIndex + 1) % THEMES.length;
        const nextTheme = THEMES[nextIndex];
        applyTheme(nextTheme.id, true);
      });
    }

    initThemeModal();
  }

  function applyTheme(themeId, notify) {
    const themeObj = THEMES.find(t => t.id === themeId) || THEMES[0];
    document.documentElement.classList.remove('dark-theme', 'cyber-blue-theme', 'light-theme', 'warm-light-theme');
    document.documentElement.classList.add(themeObj.id);

    try {
      localStorage.setItem('algo_system_theme', themeObj.id);
    } catch (e) {}

    const btnToggle = document.getElementById('btnThemeToggle');
    if (btnToggle) {
      btnToggle.textContent = themeObj.label;
      btnToggle.title = `当前主题: ${themeObj.name} (点击一键循环切换，或点击调色盘)`;
    }

    const themeNameSpan = document.getElementById('themeName');
    if (themeNameSpan) {
      themeNameSpan.textContent = themeObj.label.replace('🎨 风格: ', '');
    }

    updateThemeModalActiveState(themeObj.id);

    if (notify) {
      showToast(`已切换主题风格: ${themeObj.name}`, 'info');
    }
  }

  function initThemeModal() {
    const modal = document.getElementById('themeModal');
    const openBtn = document.getElementById('btnOpenThemeModal');
    const closeBtn = document.getElementById('closeThemeModalBtn');
    const closeFooterBtn = document.getElementById('closeThemeModalFooterBtn');

    if (!modal) return;

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        const currentClass = document.documentElement.className || '';
        const match = currentClass.match(/(dark-theme|cyber-blue-theme|light-theme|warm-light-theme)/);
        const currentId = match ? match[1] : 'dark-theme';
        updateThemeModalActiveState(currentId);
      });
    }

    const closeModal = () => {
      modal.classList.add('hidden');
      document.body.classList.remove('modal-open');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    const applyBtns = modal.querySelectorAll('.btn-apply-theme');
    applyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tid = btn.getAttribute('data-theme-id');
        if (tid) {
          applyTheme(tid, true);
        }
      });
    });
  }

  function updateThemeModalActiveState(activeId) {
    const modal = document.getElementById('themeModal');
    if (!modal) return;
    const cards = modal.querySelectorAll('.theme-card');
    cards.forEach(card => {
      const isTarget = card.getAttribute('data-theme-id') === activeId;
      if (isTarget) {
        card.classList.add('active');
        const tag = card.querySelector('.theme-active-tag');
        if (tag) tag.style.display = 'inline-block';
        const btn = card.querySelector('.btn-apply-theme');
        if (btn) btn.textContent = '✓ 当前生效中';
      } else {
        card.classList.remove('active');
        const tag = card.querySelector('.theme-active-tag');
        if (tag) tag.style.display = 'none';
        const btn = card.querySelector('.btn-apply-theme');
        if (btn) btn.textContent = '立即应用此风格';
      }
    });
  }

  // =========================================================================
  // 零依赖极速语法高亮与代码模板展示引擎
  // =========================================================================
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function highlightLine(rawCode, lang) {
    if (!rawCode) return '&nbsp;';

    const trimmed = rawCode.trim();
    if (lang === 'cpp') {
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        return `<span class="code-comment">${escapeHtml(rawCode)}</span>`;
      }
    } else {
      if (trimmed.startsWith('#')) {
        return `<span class="code-comment">${escapeHtml(rawCode)}</span>`;
      }
    }

    let codePart = rawCode;
    let commentPart = '';

    if (lang === 'cpp') {
      const idx = rawCode.indexOf('//');
      if (idx !== -1) {
        codePart = rawCode.slice(0, idx);
        commentPart = rawCode.slice(idx);
      }
    } else {
      const idx = rawCode.indexOf('#');
      if (idx !== -1) {
        codePart = rawCode.slice(0, idx);
        commentPart = rawCode.slice(idx);
      }
    }

    const placeholders = [];
    const saveToken = (html) => {
      const key = `___TK${placeholders.length}___`;
      placeholders.push({ key, html });
      return key;
    };

    // 1. Strings
    codePart = codePart.replace(/(["'])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) => {
      return saveToken(`<span class="code-str">${escapeHtml(match)}</span>`);
    });

    // 2. Escape remaining HTML
    codePart = escapeHtml(codePart);

    // 3. Numbers
    codePart = codePart.replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => {
      return saveToken(`<span class="code-num">${match}</span>`);
    });

    // 4. Keywords & Types
    if (lang === 'cpp') {
      const cppKeywords = /\b(auto|bool|break|case|catch|class|const|continue|default|delete|do|double|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/g;
      codePart = codePart.replace(cppKeywords, '<span class="code-kw">$1</span>');

      const cppTypes = /\b(vector|string|queue|priority_queue|stack|deque|set|map|unordered_set|unordered_map|pair|tuple|size_t)\b/g;
      codePart = codePart.replace(cppTypes, '<span class="code-type">$1</span>');

      const cppBuiltins = /\b(push_back|emplace_back|pop|push|top|front|back|size|empty|clear|insert|erase|find|count|swap|sort|reverse|lower_bound|upper_bound|max|min|fill|memset)\b/g;
      codePart = codePart.replace(cppBuiltins, '<span class="code-builtin">$1</span>');
    } else {
      const pyKeywords = /\b(def|return|if|elif|else|for|while|in|break|continue|pass|yield|import|from|as|class|lambda|with|is|not|and|or|True|False|None)\b/g;
      codePart = codePart.replace(pyKeywords, '<span class="code-kw">$1</span>');

      const pyBuiltins = /\b(len|list|dict|set|tuple|print|min|max|sum|sorted|reversed|enumerate|zip|map|filter|int|str|float|bool|abs|all|any|range|append|pop|extend|sort|heapq|heappush|heappop|deque|bisect_left|bisect_right|defaultdict|Counter)\b/g;
      codePart = codePart.replace(pyBuiltins, '<span class="code-builtin">$1</span>');
    }

    // 5. Function invocations
    codePart = codePart.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="code-fn">$1</span>');

    // 6. Restore strings and numbers
    for (let i = placeholders.length - 1; i >= 0; i--) {
      codePart = codePart.replace(placeholders[i].key, placeholders[i].html);
    }

    // 7. Append comment
    if (commentPart) {
      codePart += `<span class="code-comment">${escapeHtml(commentPart)}</span>`;
    }

    return codePart;
  }

  function filterCodeComments(lines, isClean, lang) {
    if (!isClean || !Array.isArray(lines)) return lines || [];
    const result = [];
    for (const rawLine of lines) {
      const trimmed = rawLine.trim();
      if (lang === 'cpp') {
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;
        const stripped = rawLine.replace(/\s*\/\/.*$/, '');
        if (stripped.trim() || rawLine === '') result.push(stripped);
      } else {
        if (trimmed.startsWith('#')) continue;
        const stripped = rawLine.replace(/\s*#.*$/, '');
        if (stripped.trim() || rawLine === '') result.push(stripped);
      }
    }
    return result;
  }

  /**
   * 清理并美化文本中的 LaTeX 标记，适配无 MathJax/KaTeX 运行环境
   * @param {string} text
   * @returns {string}
   */
  function cleanLatex(text) {
    if (!text || typeof text !== 'string') return text || '';
    return text
      .replace(/\\Delta/g, 'Δ')
      .replace(/\\log/g, 'log')
      .replace(/\\le/g, '≤')
      .replace(/\\ge/g, '≥')
      .replace(/\\times/g, '×')
      .replace(/\\approx/g, '≈')
      .replace(/\\neq/g, '≠')
      .replace(/\\alpha/g, 'α')
      .replace(/\\in/g, '∈')
      .replace(/\\cdot/g, '·')
      .replace(/\\sum/g, 'Σ')
      .replace(/\\min/g, 'min')
      .replace(/\\max/g, 'max')
      .replace(/\\mathcal\{O\}/g, 'O')
      .replace(/\$([^\$]+)\$/g, '$1');
  }

  let _currentCodeAlgoId = 'bubble_sort';
  let _currentCodeLang = 'python'; // 'python' | 'cpp'
  let _currentCodeClean = false;   // false: annotated, true: clean

  function renderCurrentCode(algoId, lang, cleanMode) {
    if (algoId) _currentCodeAlgoId = algoId;
    if (lang) _currentCodeLang = lang;
    if (typeof cleanMode === 'boolean') _currentCodeClean = cleanMode;

    const codeBlock = document.getElementById('codeBlock');
    if (!codeBlock) return;

    let algoDef = null;
    if (global.AlgoSystem && global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.get === 'function') {
      algoDef = global.AlgoSystem.visualizers.get(_currentCodeAlgoId);
    }

    if (!algoDef || !algoDef.templates) {
      algoDef = {
        name: _currentCodeAlgoId,
        templates: {
          python: ['# 正在加载算法代码模板...'],
          cpp: ['// 正在加载算法代码模板...']
        }
      };
    }

    let rawLines = algoDef.templates[_currentCodeLang];
    if (!rawLines || rawLines.length === 0) {
      rawLines = algoDef.templates['python'] || ['// 暂无对应语言模板'];
    }

    const filtered = filterCodeComments(rawLines, _currentCodeClean, _currentCodeLang);

    // 单行紧凑输出，消除 <pre> 内部多余空白文本节点导致的多倍空行
    codeBlock.innerHTML = filtered.map((line, idx) => {
      const highlighted = highlightLine(line, _currentCodeLang);
      return `<div class="code-line" data-line="${idx + 1}"><span class="line-num">${idx + 1}</span><span class="line-code">${highlighted}</span></div>`;
    }).join('');
  }

  function initCodeViewerControls() {
    // 语言切换 (Python / C++)
    const langPills = document.getElementById('codeLangPills');
    if (langPills) {
      langPills.addEventListener('click', function(e) {
        const btn = e.target.closest('button[data-lang]');
        if (!btn) return;
        const lang = btn.getAttribute('data-lang');
        const allBtns = langPills.querySelectorAll('button[data-lang]');
        allBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _currentCodeLang = lang;
        renderCurrentCode();
        showToast(`已切换代码语言: ${lang === 'cpp' ? 'C++ 20 (408/竞赛)' : 'Python 3 (蓝桥)'}`, 'info');
      });
    }

    // 注释切换 (详细注释 / 纯净代码)
    const btnComment = document.getElementById('btnToggleComment');
    if (btnComment) {
      btnComment.addEventListener('click', function() {
        _currentCodeClean = !_currentCodeClean;
        if (_currentCodeClean) {
          btnComment.setAttribute('data-mode', 'clean');
          btnComment.textContent = '⚡ 纯净无注释版';
          btnComment.classList.remove('active');
          showToast('已切换至：纯净无注释极速刷题模式', 'info');
        } else {
          btnComment.setAttribute('data-mode', 'annotated');
          btnComment.textContent = '💬 详细注释版';
          btnComment.classList.add('active');
          showToast('已切换至：详细注释精讲教学模式', 'info');
        }
        renderCurrentCode();
      });
    }

    // 复制按钮
    const btnCopy = document.getElementById('btnCopyCode');
    if (btnCopy) {
      btnCopy.addEventListener('click', function() {
        copyCurrentCode();
      });
    }

    // 初始化三道自由拖拽条与代码防截断折行
    initResizablePanes();
  }

  /**
   * 同步左右侧栏折叠状态与顶部/分隔条按钮的高亮状态
   */
  function syncSidebarToggles() {
    if (typeof document === 'undefined') return;
    const sidebar = document.getElementById('sidebarDrawer');
    const inspector = document.getElementById('inspectorPanel');
    const btnToggleLeft = document.getElementById('btnToggleLeftSidebar');
    const btnToggleRight = document.getElementById('btnToggleRightInspector');
    const btnCollapseSidebar = document.getElementById('btnCollapseSidebar');
    const btnCollapseInspector = document.getElementById('btnCollapseInspector');

    if (sidebar) {
      const isLeftCollapsed = sidebar.classList.contains('is-collapsed');
      if (btnToggleLeft) {
        btnToggleLeft.classList.toggle('active', !isLeftCollapsed);
        btnToggleLeft.setAttribute('title', isLeftCollapsed ? '显示左侧导航栏 (快捷键: Ctrl+B)' : '隐藏左侧导航栏 (快捷键: Ctrl+B)');
      }
      if (btnCollapseSidebar) {
        btnCollapseSidebar.classList.toggle('is-collapsed', isLeftCollapsed);
        btnCollapseSidebar.setAttribute('title', isLeftCollapsed ? '展开左侧栏 (Ctrl+B)' : '折叠左侧栏 (Ctrl+B)');
      }
    }

    if (inspector) {
      const isRightCollapsed = inspector.classList.contains('is-collapsed');
      if (btnToggleRight) {
        btnToggleRight.classList.toggle('active', !isRightCollapsed);
        btnToggleRight.setAttribute('title', isRightCollapsed ? '显示右侧代码与联调面板 (快捷键: Ctrl+I)' : '隐藏右侧代码与联调面板 (快捷键: Ctrl+I)');
      }
      if (btnCollapseInspector) {
        btnCollapseInspector.classList.toggle('is-collapsed', isRightCollapsed);
        btnCollapseInspector.setAttribute('title', isRightCollapsed ? '展开右侧栏 (Ctrl+I)' : '折叠右侧栏 (Ctrl+I)');
      }
    }
  }

  /**
   * 初始化三道自由拖拽分隔条与代码折行/宽屏控制器 (红框1/2/3)
   */
  function initResizablePanes() {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem('algo_pane_widths_v1') || '{}');
    } catch (e) {
      saved = {};
    }
    if (saved.sidebar) root.style.setProperty('--width-sidebar', saved.sidebar + 'px');
    if (saved.kbNav) root.style.setProperty('--width-kb-nav', saved.kbNav + 'px');
    if (saved.inspector) root.style.setProperty('--width-inspector', saved.inspector + 'px');

    function bindResizer(resizerId, paneEl, cssVar, minW, maxW, isRightPane, collapseBtnId, storageKey) {
      const resizer = document.getElementById(resizerId);
      const collapseBtn = document.getElementById(collapseBtnId);
      if (!resizer || !paneEl) return;

      let startX = 0, startW = 0;

      resizer.addEventListener('mousedown', function(e) {
        if (e.target === collapseBtn || (collapseBtn && collapseBtn.contains(e.target))) return;
        e.preventDefault();
        paneEl.classList.remove('is-collapsed');
        syncSidebarToggles();
        startX = e.clientX;
        startW = paneEl.getBoundingClientRect().width;
        resizer.classList.add('is-dragging');
        document.body.classList.add('resizing-panes');

        function onMouseMove(ev) {
          const delta = isRightPane ? (startX - ev.clientX) : (ev.clientX - startX);
          const limitMax = typeof maxW === 'function' ? maxW() : maxW;
          const newW = Math.max(minW, Math.min(limitMax, startW + delta));
          root.style.setProperty(cssVar, newW + 'px');
          saved[storageKey] = Math.round(newW);
        }

        function onMouseUp() {
          resizer.classList.remove('is-dragging');
          document.body.classList.remove('resizing-panes');
          try { localStorage.setItem('algo_pane_widths_v1', JSON.stringify(saved)); } catch (err) {}
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      // 双击分隔条或点击迷你按钮：一键折叠/展开（右侧代码栏双击切换宽屏 680px）
      function toggleCollapse(e) {
        if (e) e.stopPropagation();
        const collapsed = paneEl.classList.toggle('is-collapsed');
        if (collapseBtn) {
          collapseBtn.classList.toggle('is-collapsed', collapsed);
        }
        syncSidebarToggles();
      }

      if (collapseBtn) collapseBtn.addEventListener('click', toggleCollapse);

      resizer.addEventListener('dblclick', function() {
        if (isRightPane) {
          paneEl.classList.remove('is-collapsed');
          syncSidebarToggles();
          const curW = paneEl.getBoundingClientRect().width;
          const targetW = curW < 580 ? 680 : 480;
          root.style.setProperty(cssVar, targetW + 'px');
          saved[storageKey] = targetW;
          try { localStorage.setItem('algo_pane_widths_v1', JSON.stringify(saved)); } catch (err) {}
          if (collapseBtn) collapseBtn.classList.remove('is-collapsed');
          const btnExpand = document.getElementById('btnExpandCode');
          if (btnExpand) btnExpand.classList.toggle('active', targetW >= 580);
          showToast(targetW >= 580 ? '已切换至 680px 宽屏看码模式' : '已恢复标准代码面板宽度', 'info');
        } else {
          toggleCollapse();
        }
      });
    }

    bindResizer('resizerSidebar', document.getElementById('sidebarDrawer'), '--width-sidebar', 180, 420, false, 'btnCollapseSidebar', 'sidebar');
    bindResizer('resizerKbNav', document.querySelector('.kb-algo-nav'), '--width-kb-nav', 150, 360, false, 'btnCollapseKbNav', 'kbNav');
    bindResizer('resizerInspector', document.getElementById('inspectorPanel'), '--width-inspector', 320, () => Math.floor(window.innerWidth * 0.65), true, 'btnCollapseInspector', 'inspector');

    // 绑定顶部现代极简侧栏隐藏/展开按钮 (VS Code / Notion 风格图标)
    const btnToggleLeft = document.getElementById('btnToggleLeftSidebar');
    if (btnToggleLeft) {
      btnToggleLeft.addEventListener('click', function() {
        const sidebar = document.getElementById('sidebarDrawer');
        if (!sidebar) return;
        const collapsed = sidebar.classList.toggle('is-collapsed');
        syncSidebarToggles();
        showToast(collapsed ? '已隐藏左侧导航栏 (快捷键: Ctrl+B)' : '已展开左侧导航栏', 'info');
      });
    }

    const btnToggleRight = document.getElementById('btnToggleRightInspector');
    if (btnToggleRight) {
      btnToggleRight.addEventListener('click', function() {
        const inspector = document.getElementById('inspectorPanel');
        if (!inspector) return;
        const collapsed = inspector.classList.toggle('is-collapsed');
        syncSidebarToggles();
        showToast(collapsed ? '已隐藏右侧代码面板 (快捷键: Ctrl+I)' : '已展开右侧代码面板', 'info');
      });
    }

    // 初始化时同步状态
    syncSidebarToggles();

    // 代码自动折行开关（默认开启，确保长代码与注释一次看全）
    const codePre = document.getElementById('codePre');
    const btnWrap = document.getElementById('btnWrapCode');
    if (codePre) codePre.classList.add('wrap-enabled');
    if (btnWrap && codePre) {
      btnWrap.classList.add('active');
      btnWrap.addEventListener('click', function() {
        const enabled = codePre.classList.toggle('wrap-enabled');
        btnWrap.classList.toggle('active', enabled);
        showToast(enabled ? '已开启代码自动折行：无需横向滚动即可看全注释' : '已切换为单行横向滚动模式', 'info');
      });
    }

    // 一键宽屏看码按钮
    const btnExpand = document.getElementById('btnExpandCode');
    if (btnExpand) {
      btnExpand.addEventListener('click', function() {
        const inspector = document.getElementById('inspectorPanel');
        if (!inspector) return;
        inspector.classList.remove('is-collapsed');
        syncSidebarToggles();
        const isWide = btnExpand.classList.toggle('active');
        const targetW = isWide ? 680 : 480;
        root.style.setProperty('--width-inspector', targetW + 'px');
        saved.inspector = targetW;
        try { localStorage.setItem('algo_pane_widths_v1', JSON.stringify(saved)); } catch (err) {}
        showToast(isWide ? '已切换至 680px 宽屏看码模式' : '已恢复标准代码面板宽度', 'info');
      });
    }
  }

  function copyCurrentCode() {
    let algoDef = null;
    if (global.AlgoSystem && global.AlgoSystem.visualizers && typeof global.AlgoSystem.visualizers.get === 'function') {
      algoDef = global.AlgoSystem.visualizers.get(_currentCodeAlgoId);
    }
    const name = algoDef ? algoDef.name : _currentCodeAlgoId;
    const rawLines = (algoDef && algoDef.templates) ? (algoDef.templates[_currentCodeLang] || algoDef.templates['python'] || []) : [];
    const filtered = filterCodeComments(rawLines, _currentCodeClean, _currentCodeLang);
    const textToCopy = filtered.join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`已成功复制 ${name} (${_currentCodeLang === 'cpp' ? 'C++' : 'Python'}) 源码！`, 'info');
      }).catch(() => {
        fallbackCopyText(textToCopy, name);
      });
    } else {
      fallbackCopyText(textToCopy, name);
    }
  }

  function fallbackCopyText(text, name) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`已成功复制 ${name} 源码！`, 'info');
    } catch (err) {
      showToast('复制失败，请手动选取代码块复制', 'warning');
    }
    if (textArea.parentNode) {
      textArea.parentNode.removeChild(textArea);
    }
  }

  const Controls = {
    init: init,
    bindController: bindController,
    sanitizeArrayInput: sanitizeArrayInput,
    generateRandomArray: generateRandomArray,
    showToast: showToast,
    initThemeSwitcher: initThemeSwitcher,
    applyTheme: applyTheme,
    highlightLine: highlightLine,
    filterCodeComments: filterCodeComments,
    cleanLatex: cleanLatex,
    renderCurrentCode: renderCurrentCode,
    initCodeViewerControls: initCodeViewerControls,
    initResizablePanes: initResizablePanes,
    syncSidebarToggles: syncSidebarToggles,
    copyCurrentCode: copyCurrentCode,
    THEMES: THEMES
  };

  global.AlgoSystem.components.Controls = Controls;
  global.AlgoSystem.controls = Controls;

})(typeof window !== 'undefined' ? window : globalThis);
