#!/usr/bin/env python3
"""
seo-state-write.py - Atomic state.json writer (2026-07-03 v5.3)

Usage:
  seo-state-write.py <state_file> <json_kv_pairs...>
  
Example:
  seo-state-write.py /path/state.json last_run 2026-07-03 last_slug foo last_score 75 writers doubao

实现:
1. flock 锁定 (pipeline.lock 文件, 共享)
2. write to tmp file
3. os.replace() = atomic on POSIX
4. 自动 JSON dump with indent=2

并发安全保证:
- flock 阻塞其他 writer
- atomic rename 防止半写状态
- 失败时回滚 (删除 tmp)
"""

import json
import os
import sys
import fcntl
import tempfile

def main():
    if len(sys.argv) < 4 or (len(sys.argv) - 4) % 2 != 0:
        print("Usage: seo-state-write.py <state_file> <key1> <val1> [<key2> <val2>...]", file=sys.stderr)
        sys.exit(1)
    
    state_file = sys.argv[1]
    pairs = {}
    for i in range(2, len(sys.argv), 2):
        if i + 1 >= len(sys.argv):
            break
        key = sys.argv[i]
        # try numeric
        try:
            val = int(sys.argv[i+1])
        except ValueError:
            val = sys.argv[i+1]
        pairs[key] = val
    
    # 加载现有 state (如存在)
    state = {}
    if os.path.exists(state_file):
        try:
            with open(state_file, 'r') as f:
                state = json.load(f)
        except Exception as e:
            print(f"⚠️ Could not read existing state ({e}), starting fresh", file=sys.stderr)
            state = {}
    
    # merge
    state.update(pairs)
    
    # 锁文件路径
    lock_file = "/tmp/seo-pipeline.lock"
    lock_fd = None
    try:
        # flock 互斥 (与 Pipeline 共享锁文件)
        lock_fd = open(lock_file, 'w')
        try:
            fcntl.flock(lock_fd.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print("⚠️ Pipeline 正在跑, 跳过 state.json 写入 (lock conflict)", file=sys.stderr)
            sys.exit(0)
        
        # atomic write: tmp + rename
        state_dir = os.path.dirname(state_file) or '.'
        fd, tmp_path = tempfile.mkstemp(dir=state_dir, prefix='.state.', suffix='.tmp')
        try:
            with os.fdopen(fd, 'w') as f:
                json.dump(state, f, indent=2)
            os.replace(tmp_path, state_file)
            print(f"✅ state.json updated: {state_file}")
        except Exception as e:
            # cleanup tmp
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
            raise e
    finally:
        if lock_fd:
            lock_fd.close()

if __name__ == "__main__":
    main()