#!/usr/bin/env python3
"""Local preview server that mimics Firebase Hosting's cleanUrls behaviour.

    python3 serve.py          -> http://localhost:5173

Threaded on purpose: browsers open several connections at once and keep
speculative ones open. A single-threaded server blocks on those and the tab
appears to hang.
"""
import http.server
import mimetypes
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173


class Handler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"          # keep-alive, so no reconnect per asset
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".svg": "image/svg+xml",
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".json": "application/json",
        ".webmanifest": "application/manifest+json",
    }

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def translate_path(self, path):
        """/products -> public/products.html, like Firebase Hosting cleanUrls."""
        full = super().translate_path(path)
        if not os.path.exists(full) and not os.path.splitext(full)[1]:
            html = full.rstrip("/") + ".html"
            if os.path.exists(html):
                return html
        return full

    def send_head(self):
        """Serve public/404.html for unknown paths instead of a bare listing."""
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            fallback = os.path.join(ROOT, "404.html")
            if os.path.exists(fallback):
                try:
                    f = open(fallback, "rb")
                except OSError:
                    return super().send_head()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(os.fstat(f.fileno())[6]))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                return f
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Keep the terminal readable: only report anything that is not a 200/304.
        status = args[1] if len(args) > 1 else ""
        if str(status).startswith(("2", "3")):
            return
        sys.stderr.write("   %s\n" % (fmt % args))


mimetypes.init()

server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
server.daemon_threads = True

print(f"GDB site on http://localhost:{PORT}", flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
