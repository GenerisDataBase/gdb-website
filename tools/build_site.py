#!/usr/bin/env python3
import argparse
import re
import shutil
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--source", default="public")
parser.add_argument("--output", default="_site")
parser.add_argument("--version", required=True)
args = parser.parse_args()

source = Path(args.source).resolve()
output = Path(args.output).resolve()
if source == output or output == Path("/") or source not in output.parents and output in source.parents:
    raise SystemExit("Unsafe output directory")

if output.exists():
    shutil.rmtree(output)
shutil.copytree(source, output)

for page in ("products", "qwizzy", "qwizzy-badges", "qwizzy-account-deletion", "contact", "imprint", "privacy", "admin", "setup"):
    target = output / page
    target.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source / f"{page}.html", target / "index.html")

asset_pattern = re.compile(r'(?P<url>/assets/[^"\']+?\.(?:css|js|mjs))(?:\?v=[^"\']+)?(?P<quote>["\'])')
for html_file in output.rglob("*.html"):
    content = html_file.read_text(encoding="utf-8")
    content = asset_pattern.sub(lambda match: f'{match.group("url")}?v={args.version}{match.group("quote")}', content)
    html_file.write_text(content, encoding="utf-8")

module_pattern = re.compile(r'(?P<quote>["\'])(?P<url>(?:/assets/|\./)[^"\']+?\.(?:css|js|mjs))(?:\?v=[^"\']+)?(?P=quote)')
for script_file in [*output.rglob("*.js"), *output.rglob("*.mjs")]:
    content = script_file.read_text(encoding="utf-8")
    content = module_pattern.sub(lambda match: f'{match.group("quote")}{match.group("url")}?v={args.version}{match.group("quote")}', content)
    script_file.write_text(content, encoding="utf-8")

print(f"Built {output} with asset version {args.version}.")
