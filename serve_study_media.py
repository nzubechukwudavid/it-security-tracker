#!/usr/bin/env python3
"""
Serve Study Media & Web Daemon
<!-- DOE-VERSION: 2026.10.01 -->

Directive: directives/serve_study_media.md

High-performance, threaded HTTP server supporting:
1. Static Web App serving (cockpit / web UI) for 100% offline local usability.
2. RFC 7233 byte-range streaming for instant video seeking.
3. Live Job-Finder pipeline integration with 30s caching.
4. OWASP A01 path traversal boundary security.
5. Idempotent port binding (gracefully handles already running instance).

Usage:
    python execution/serve_study_media.py
    python execution/serve_study_media.py --port 8080 --host 127.0.0.1
"""

import os
import sys
import re
import json
import mimetypes
import argparse
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn
import urllib.parse
import urllib.request
import time

# =============================================================================
# VERSION - Must match directive
# =============================================================================
DOE_VERSION = "2026.10.01"

DEFAULT_VAULT_ROOT = Path(r"C:\Users\David\Desktop\SnapTube Video")
CHUNK_SIZE = 64 * 1024  # 64 KB streaming buffer

# Extra MIME registrations
mimetypes.add_type("text/html; charset=utf-8", ".html")
mimetypes.add_type("text/css; charset=utf-8", ".css")
mimetypes.add_type("application/javascript; charset=utf-8", ".js")
mimetypes.add_type("image/x-icon", ".ico")
mimetypes.add_type("image/png", ".png")
mimetypes.add_type("image/jpeg", ".jpg")
mimetypes.add_type("application/manifest+json", ".webmanifest")
mimetypes.add_type("application/json; charset=utf-8", ".json")
mimetypes.add_type("video/mp4", ".mp4")
mimetypes.add_type("video/webm", ".webm")
mimetypes.add_type("video/x-matroska", ".mkv")
mimetypes.add_type("application/octet-stream", ".pkt")
mimetypes.add_type("application/octet-stream", ".pka")
mimetypes.add_type("application/pdf", ".pdf")

_builtin_print = print
def print(*args, **kwargs):
    try:
        if sys.stdout is not None:
            _builtin_print(*args, **kwargs)
    except Exception:
        pass

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handles requests in separate threads for non-blocking concurrent playback."""
    daemon_threads = True

JOB_FINDER_ROOT = Path(r"C:\Users\David\Projects\job-finder")

_APPLIED_CACHE = {"timestamp": 0, "data": {}}

def get_live_applied_data():
    now = time.time()
    if now - _APPLIED_CACHE["timestamp"] < 30 and _APPLIED_CACHE["data"]:
        return _APPLIED_CACHE["data"]
    try:
        req = urllib.request.Request(
            "https://david-job-finder.vercel.app/api/applied",
            headers={"User-Agent": "StudyCockpit/2026.10.01"}
        )
        with urllib.request.urlopen(req, timeout=3) as res:
            parsed = json.loads(res.read().decode("utf-8"))
            applied_map = parsed.get("applied", {})
            _APPLIED_CACHE["timestamp"] = now
            _APPLIED_CACHE["data"] = applied_map
            return applied_map
    except Exception:
        return _APPLIED_CACHE.get("data", {})

def resolve_web_root() -> Path:
    """Finds the local web application root (cockpit or web folder)."""
    script_dir = Path(__file__).resolve().parent
    candidates = [
        script_dir / "web",
        script_dir / "cockpit",
        script_dir.parent / "web",
        script_dir.parent / "cockpit",
        Path(r"C:\Users\David\Projects\it-security-tracker\web"),
        Path(r"C:\Users\David\Projects\agentic-workflows-template\cockpit"),
    ]
    for c in candidates:
        if c.exists() and (c / "index.html").exists():
            return c.resolve()
    return script_dir.resolve()

class MediaRangeRequestHandler(BaseHTTPRequestHandler):
    """RFC 7233 compliant byte-range HTTP request handler with security sandboxing."""
    
    protocol_version = "HTTP/1.1"
    server_version = f"StudyMediaDaemon/{DOE_VERSION}"

    def handle(self):
        try:
            super().handle()
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
            pass

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Range, Content-Type, Accept, Cache-Control")
        self.send_header("Access-Control-Expose-Headers", "Content-Range, Accept-Ranges, Content-Length")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def do_HEAD(self):
        self._dispatch_request(send_body=False)

    def do_GET(self):
        self._dispatch_request(send_body=True)

    def _dispatch_request(self, send_body: bool = True):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path in ["/health", "/healthz", "/ping"]:
            if send_body:
                self._handle_health()
            else:
                self.send_response(200)
                self.end_headers()
            return

        if path.startswith("/api/job-finder"):
            if send_body:
                self._handle_job_finder()
            else:
                self.send_response(200)
                self.end_headers()
            return

        rel_path = urllib.parse.unquote(path).lstrip("/")

        # 1. Explicit /media/... requests route to vault_root
        if rel_path.lower().startswith("media/"):
            media_rel = rel_path[6:]
            self._serve_file(self.server.vault_root, media_rel, send_body=send_body)
            return

        # 2. Root or /index.html -> serve index.html from web_root
        if rel_path == "" or rel_path == "index.html":
            self._serve_file(self.server.web_root, "index.html", send_body=send_body)
            return

        # 3. Check if file exists in web_root (css, js, data, icons, manifest, etc.)
        candidate_web = (self.server.web_root / rel_path).resolve()
        if candidate_web.exists() and candidate_web.is_file():
            self._serve_file(self.server.web_root, rel_path, send_body=send_body)
            return

        # 4. Fallback: check vault_root in case file was requested without /media/
        candidate_vault = (self.server.vault_root / rel_path).resolve()
        if candidate_vault.exists() and candidate_vault.is_file():
            self._serve_file(self.server.vault_root, rel_path, send_body=send_body)
            return

        self.send_error(404, f"File Not Found: {rel_path}")

    def _handle_health(self):
        payload = {
            "status": "ok",
            "version": DOE_VERSION,
            "mode": "study_cockpit_daemon",
            "vault_root": str(self.server.vault_root),
            "web_root": str(self.server.web_root)
        }
        data = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.send_cors_headers()
        self.end_headers()
        try:
            self.wfile.write(data)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
            pass

    def _handle_job_finder(self):
        dashboard_file = JOB_FINDER_ROOT / "dashboard_data.json"
        jobs = []
        if dashboard_file.exists():
            try:
                with open(dashboard_file, "r", encoding="utf-8") as f:
                    jobs = json.load(f)
            except Exception:
                pass

        if not jobs:
            try:
                req = urllib.request.Request(
                    "https://david-job-finder.vercel.app/dashboard_data.json",
                    headers={"User-Agent": "StudyCockpit/2026.10.01"}
                )
                with urllib.request.urlopen(req, timeout=4) as res:
                    jobs = json.loads(res.read().decode("utf-8"))
            except Exception:
                pass

        applied_map = get_live_applied_data()

        track_counts = {}
        applied_jobs = []
        all_jobs_enriched = []
        applied_count = 0
        interview_count = 0
        ignored_count = 0

        for j in jobs:
            t = j.get("track", "other")
            track_counts[t] = track_counts.get(t, 0) + 1

            urls = [j.get("effective_url") or "", j.get("job_url") or ""]
            app_info = None
            for u in urls:
                if not u: continue
                app_info = applied_map.get(u) or applied_map.get(u.split("?")[0].rstrip("/"))
                if app_info: break

            job_status = "fresh"
            stage_str = ""
            action_date = (j.get("timestamp") or "")[:10]

            if app_info:
                st = app_info.get("status")
                action_date = (app_info.get("timestamp") or j.get("timestamp") or "")[:10]
                stage_str = app_info.get("stage", "")

                if st == "applied":
                    applied_count += 1
                    job_status = "Applied"
                    applied_jobs.append({
                        "id": j.get("epoch_ts") or j.get("timestamp"),
                        "title": j.get("title"),
                        "company": j.get("company"),
                        "track": j.get("track"),
                        "status": "Applied",
                        "stage": stage_str,
                        "location": j.get("location"),
                        "url": j.get("effective_url") or j.get("job_url"),
                        "date": action_date
                    })
                elif st == "interview":
                    interview_count += 1
                    job_status = "Interview"
                    applied_jobs.append({
                        "id": j.get("epoch_ts") or j.get("timestamp"),
                        "title": j.get("title"),
                        "company": j.get("company"),
                        "track": j.get("track"),
                        "status": "Interview",
                        "stage": stage_str,
                        "location": j.get("location"),
                        "url": j.get("effective_url") or j.get("job_url"),
                        "date": action_date
                    })
                elif st == "ignored":
                    ignored_count += 1
                    job_status = "Ignored"

            all_jobs_enriched.append({
                "id": j.get("epoch_ts") or j.get("timestamp"),
                "title": j.get("title"),
                "company": j.get("company"),
                "track": j.get("track"),
                "status": job_status,
                "stage": stage_str,
                "fit_score": j.get("fit_score", 0),
                "location": j.get("location"),
                "url": j.get("effective_url") or j.get("job_url"),
                "date": action_date
            })

        interviews_list = [a for a in applied_jobs if a["status"] == "Interview"]
        applied_list = [a for a in applied_jobs if a["status"] == "Applied"]
        applied_list.sort(key=lambda x: x.get("date", ""), reverse=True)
        sorted_applied = interviews_list + applied_list

        total_sent = applied_count + interview_count
        fresh_count = len(jobs) - (total_sent + ignored_count)

        payload = {
            "status": "ok",
            "connected": True,
            "hub_url": "https://david-job-finder.vercel.app",
            "total_tracked": len(jobs),
            "applications_sent": total_sent,
            "interviews_count": interview_count,
            "applied_count": applied_count,
            "ignored_count": ignored_count,
            "fresh_count": fresh_count,
            "tracks": track_counts,
            "applied_jobs": sorted_applied,
            "all_jobs": all_jobs_enriched[:120]
        }

        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_cors_headers()
        self.end_headers()
        try:
            self.wfile.write(data)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
            pass

    def _serve_file(self, root_dir: Path, rel_path: str, send_body: bool = True):
        # 1. Parse and sanitize requested URL path
        raw_target = (root_dir / rel_path).resolve()

        # 2. Strict Security Boundary Check (OWASP A01 Path Traversal Prevention)
        root_resolved = root_dir.resolve()
        try:
            is_safe = os.path.commonpath([str(root_resolved), str(raw_target)]) == str(root_resolved)
        except ValueError:
            is_safe = False

        if not is_safe:
            self.send_error(403, "Access Denied: Path outside boundary.")
            return

        if not raw_target.exists() or not raw_target.is_file():
            self.send_error(404, f"File Not Found: {rel_path}")
            return

        file_size = raw_target.stat().st_size
        mime_type, _ = mimetypes.guess_type(str(raw_target))
        if not mime_type:
            mime_type = "application/octet-stream"

        # 3. Check for RFC 7233 Range header
        range_header = self.headers.get("Range")
        
        if range_header:
            range_match = re.match(r"^bytes=(\d*)-(\d*)$", range_header.strip())
            if not range_match:
                self.send_error(400, "Invalid Range Header")
                return

            start_str, end_str = range_match.groups()
            
            if start_str and end_str:
                start = int(start_str)
                end = int(end_str)
            elif start_str:
                start = int(start_str)
                end = file_size - 1
            elif end_str:
                suffix_len = int(end_str)
                start = max(0, file_size - suffix_len)
                end = file_size - 1
            else:
                self.send_error(400, "Invalid Range Specification")
                return

            if start >= file_size or end >= file_size or start > end:
                self.send_response(416)  # Range Not Satisfiable
                self.send_header("Content-Range", f"bytes */{file_size}")
                self.send_cors_headers()
                self.end_headers()
                return

            content_length = end - start + 1
            self.send_response(206)  # Partial Content
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
            self.send_header("Content-Length", str(content_length))
            self.send_header("Accept-Ranges", "bytes")
            self.send_cors_headers()
            self.end_headers()

            if send_body:
                try:
                    with open(raw_target, "rb") as f:
                        f.seek(start)
                        bytes_remaining = content_length
                        while bytes_remaining > 0:
                            read_len = min(CHUNK_SIZE, bytes_remaining)
                            chunk = f.read(read_len)
                            if not chunk:
                                break
                            self.wfile.write(chunk)
                            bytes_remaining -= len(chunk)
                except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
                    pass
        else:
            # Full 200 OK Response
            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(file_size))
            self.send_header("Accept-Ranges", "bytes")
            self.send_cors_headers()
            self.end_headers()

            if send_body:
                try:
                    with open(raw_target, "rb") as f:
                        while True:
                            chunk = f.read(CHUNK_SIZE)
                            if not chunk:
                                break
                            self.wfile.write(chunk)
                except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
                    pass

    def log_message(self, format, *args):
        """Clean minimal access log resilient to windowless pythonw execution."""
        try:
            if sys.stdout is not None:
                sys.stdout.write(f"[{self.log_date_time_string()}] {self.address_string()} - {format % args}\n")
                sys.stdout.flush()
        except Exception:
            pass

def main():
    parser = argparse.ArgumentParser(description="Serve study media & web app with RFC 7233 range support.")
    parser.add_argument("--host", default="127.0.0.1", help="Host interface to bind (default 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8080, help="Port to listen on (default 8080)")
    parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT_ROOT, help="Media vault root directory")
    parser.add_argument("--web", type=Path, default=None, help="Web app root directory")
    args = parser.parse_args()

    if not args.vault.exists():
        print(f"Warning: Vault directory does not exist: {args.vault}")

    web_root = (args.web if args.web else resolve_web_root()).resolve()

    server_address = (args.host, args.port)
    try:
        httpd = ThreadedHTTPServer(server_address, MediaRangeRequestHandler)
    except OSError as e:
        if getattr(e, 'winerror', None) == 10048 or getattr(e, 'errno', None) == 98:
            print(f"Media daemon already active on http://{args.host}:{args.port}")
            return 0
        raise

    httpd.vault_root = args.vault.resolve() if args.vault.exists() else args.vault
    httpd.web_root = web_root

    print(f"============================================================")
    print(f"  Study Cockpit & Media Streaming Daemon v{DOE_VERSION}")
    print(f"  Web:   http://{args.host}:{args.port}/ (Root: {httpd.web_root})")
    print(f"  Vault: {httpd.vault_root}")
    print(f"  CORS:  Enabled (*)")
    print(f"  Range: RFC 7233 (HTTP 206 Partial Content)")
    print(f"============================================================")
    print("Daemon active. Press Ctrl+C to terminate.")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down media daemon...")
        httpd.server_close()
        print("Daemon stopped gracefully.")
        return 0

if __name__ == "__main__":
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    sys.exit(main())
