#!/bin/bash
# FAQ 多语种本地化后台磨工：每 10 分钟跑一小批（默认 zh+ja），写完就落盘可续跑。
# 通道是免费池限额（每小时约十次调用），所以小步慢跑；没有待办时脚本自己空转退出。
cd "$HOME/workspace/tradego-fasteners-v2" || exit 0
mkdir -p logs
echo "=== $(date '+%F %T') ===" >> logs/faq-l10n.log
python3 scripts/faq-l10n-batch.py --langs "${FAQ_L10N_LANGS:-zh,ja,es,fr,pt,de,ru,ar,hi}" --batch "${FAQ_L10N_BATCH:-3}" >> logs/faq-l10n.log 2>&1
rc=$?
# 全清完时把标记文件写出来，便于后续接入其他语种或下线定时任务
python3 scripts/check-i18n-leakage.py --quiet > logs/faq-l10n-remaining.txt 2>&1
exit $rc
