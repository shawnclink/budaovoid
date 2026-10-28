import re
import sys
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path('/Users/dongshawn/portfolio/archive')

PAIRS = [
    ('raw-dialogues/01-宿命论-非或是.txt', 'monologues/01-宿命论-非或是.md'),
    ('raw-dialogues/02-禅意八问-Special-Normal.txt', 'monologues/02-禅意八问-Special-Normal.md'),
    ('raw-dialogues/03-Motion蝉鸣-白夜行.txt', 'monologues/03-Motion蝉鸣-白夜行.md'),
    ('raw-dialogues/04-社会性相关-弱自由意志.txt', 'monologues/04-社会性相关-弱自由意志.md'),
    ('raw-dialogues/05-哲学补充-系统工程化人生.txt', 'monologues/05-哲学补充-系统工程化人生.md'),
    ('telegram/hedwig-2026-07-03.txt', 'monologues/hedwig-2026-07-03.md'),
]


def normalize(text: str) -> str:
    lines = []
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith('--- [Message'):
            continue
        if stripped.startswith('# '):
            continue
        if stripped.startswith('> 原文日期') or stripped.startswith('原文日期'):
            continue
        stripped = re.sub(r'^\s*>+\s?', '', line)
        stripped = stripped.replace('---', '')
        lines.append(stripped)
    text = ''.join(lines)
    # Only personal pronouns are allowed to change.
    text = re.sub(r'[我你您]', 'P', text)
    # Drop whitespace and punctuation; keep Chinese characters, Latin letters, digits.
    text = re.sub(r'[^\w一-鿿]+', '', text, flags=re.UNICODE)
    return text


for source_name, mono_name in PAIRS:
    source_path = ROOT / source_name
    mono_path = ROOT / mono_name
    if not mono_path.exists():
        print(f'MISSING {mono_name}')
        continue
    source = normalize(source_path.read_text(encoding='utf-8', errors='ignore'))
    mono = normalize(mono_path.read_text(encoding='utf-8', errors='ignore'))
    ratio = SequenceMatcher(None, source, mono, autojunk=False).ratio()
    print(f'{mono_name}: source={len(source)} mono={len(mono)} ratio={ratio:.5f}')
