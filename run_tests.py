"""
run_tests.py
============
统一自动化测试驱动入口 (Windows GBK / UTF-8 兼容版)
遍历并执行本项目下所有的 solution_template.py 与 practice_scaffold.py 测试脚本，
验证所有算法模版与挖空实战脚手架 100% 通过。
"""

import os
import sys
import time
import subprocess
from pathlib import Path

# 确保在 Windows 控制台输出 UTF-8 字符时不抛出 GBK 编码异常
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

def run_python_file(file_path: Path) -> tuple[bool, str, float]:
    """执行单个 python 脚本并记录耗时"""
    try:
        start_time = time.time()
        env = dict(os.environ)
        env["PYTHONIOENCODING"] = "utf-8"
        proc = subprocess.run(
            [sys.executable, str(file_path)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=10,
            encoding="utf-8",
            errors="replace",
            env=env
        )
        elapsed = time.time() - start_time
        if proc.returncode == 0:
            return True, proc.stdout.strip(), elapsed
        else:
            return False, proc.stderr.strip() or proc.stdout.strip(), elapsed
    except subprocess.TimeoutExpired:
        return False, "Execution timed out (10s limit)", 10.0
    except Exception as e:
        return False, str(e), time.time() - start_time

def main():
    root_dir = Path(__file__).resolve().parent
    print("=" * 70)
    print("[RUNNER] 蓝桥杯全大纲算法体系 · 统一自动化单元测试驱动器")
    print(f"[PATH]   工作空间根目录: {root_dir}")
    print("=" * 70)

    # 收集待测试脚本
    target_files = []
    
    # 1. 考场工具箱
    toolkit_dir = root_dir / "01_Python竞赛内功与考场工具箱"
    if toolkit_dir.exists():
        for py_file in sorted(toolkit_dir.glob("*.py")):
            target_files.append(py_file)

    # 2. 五大同构宇宙知识库
    kb_dir = root_dir / "02_五大同构宇宙深度知识库"
    if kb_dir.exists():
        for py_file in sorted(kb_dir.rglob("*.py")):
            target_files.append(py_file)

    if not target_files:
        print("[WARN] 未发现待执行的 Python 测试文件！")
        sys.exit(1)

    print(f"[SCAN] 累计发现 {len(target_files)} 个算法模版与练习测试脚本，开始并发验证...\n")

    passed_count = 0
    failed_count = 0
    total_time = 0.0

    for idx, f in enumerate(target_files, 1):
        rel_path = f.relative_to(root_dir)
        success, output, elapsed = run_python_file(f)
        total_time += elapsed

        if success:
            passed_count += 1
            print(f"  [{idx:02d}/{len(target_files):02d}] PASS ({elapsed*1000:5.1f}ms): {rel_path}")
        else:
            failed_count += 1
            print(f"  [{idx:02d}/{len(target_files):02d}] FAIL ({elapsed*1000:5.1f}ms): {rel_path}")
            print(f"       错误详情: {output[:300]}")

    print("\n" + "=" * 70)
    print(f"[REPORT] 测试汇总报告:")
    print(f"   - 总测试脚本数: {len(target_files)}")
    print(f"   - 验证通过:     {passed_count} ({passed_count/len(target_files)*100:.1f}%)")
    print(f"   - 验证失败:     {failed_count}")
    print(f"   - 累计耗时:     {total_time:.2f} 秒")
    print("=" * 70)

    if failed_count == 0:
        print("\n[SUCCESS] 全部算法模板与挖空练习用例 100% 通过！代码质量健壮可靠！")
        sys.exit(0)
    else:
        print(f"\n[FAIL] 存在 {failed_count} 个测试未通过，请检查上述错误详情。")
        sys.exit(1)

if __name__ == "__main__":
    main()
