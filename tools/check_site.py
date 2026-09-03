#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
PUBLIC_PAGES = ["index", "products", "qwizzy", "qwizzy-badges", "qwizzy-account-deletion", "contact", "imprint", "privacy"]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []
        self.canonicals = []
        self.ids = set()
        self.has_skip_link = False

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "a" and "skip-link" in values.get("class", "").split():
            self.has_skip_link = True
        if tag == "link" and values.get("rel") == "canonical":
            self.canonicals.append(values.get("href", ""))
        for name in ("href", "src"):
            if values.get(name):
                self.references.append(values[name])


def resolves(reference):
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc or reference.startswith(("#", "mailto:", "tel:", "data:")):
        return True
    path = unquote(parsed.path)
    candidate = PUBLIC / path.lstrip("/")
    variants = [candidate]
    if not candidate.suffix:
        variants += [candidate.with_suffix(".html"), candidate / "index.html"]
    return any(item.exists() for item in variants)


errors = []
for html_file in sorted(PUBLIC.glob("*.html")):
    parser = PageParser()
    parser.feed(html_file.read_text(encoding="utf-8"))
    for reference in parser.references:
        if not resolves(reference):
            errors.append(f"{html_file.name}: missing internal reference {reference}")
    if html_file.stem in PUBLIC_PAGES:
        expected = "https://generisdatabase.com/" if html_file.stem == "index" else f"https://generisdatabase.com/{html_file.stem}"
        if parser.canonicals != [expected]:
            errors.append(f"{html_file.name}: canonical must be {expected}")
        if not parser.has_skip_link or "main-content" not in parser.ids:
            errors.append(f"{html_file.name}: accessible skip link or main target is missing")

for retired in ("wiksy", "barlingo"):
    for html_file in PUBLIC.glob("*.html"):
        if f'href="/{retired}' in html_file.read_text(encoding="utf-8").lower():
            errors.append(f"{html_file.name}: retired product link /{retired} remains")

if errors:
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)
print(f"Site verified: {len(list(PUBLIC.glob('*.html')))} pages, links, canonicals and accessibility targets pass.")
