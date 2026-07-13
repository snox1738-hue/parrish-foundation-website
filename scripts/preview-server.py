#!/usr/bin/env python3
"""Instant local preview for the Parrish Foundation site.

Serves the site folder straight from disk on http://localhost:4181 with
caching fully disabled — every browser refresh shows the current file
state instantly, before anything is even deployed. Runs forever via
launchd (com.parrish.preview).
"""
import http.server
import functools
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 4181


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, *args):
        pass  # keep launchd logs quiet


handler = functools.partial(NoCacheHandler, directory=ROOT)
http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler).serve_forever()
