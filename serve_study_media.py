#!/usr/bin/env python3
"""
Serve Study Media Daemon
<!-- DOE-VERSION: 2026.10.01 -->

Directive: directives/serve_study_media.md

High-performance, threaded HTTP server supporting RFC 7233 byte-range
requests for instant video scrubbing, CORS headers, and path traversal security.

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
mimetypes.add_type("video/mp4", ".mp4")
mimetypes.add_type("video/webm", ".webm")
mimetypes.add_type("video/x-matroska", ".mkv")
mimetypes.add_type("application/json", ".json")
mimetypes.add_type("application/octet-stream", ".pkt")
mimetypes.add_type("application/octet-stream", ".pka")
mimetypes.add_type("application/pdf", ".pdf")

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
    except Exception as e:
        return _APPLIED_CACHE.get("data", {})

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
        self._handle_media_request(send_body=False)

    def do_GET(self):
        if self.path in ["/health", "/healthz", "/ping"]:
            self._handle_health()
            return

        if self.path.startswith("/api/job-finder"):
            self._handle_job_finder()
            return

        self._handle_media_request(send_body=True)

    def _handle_health(self):
        payload = {
            "status": "ok",
            "version": DOE_VERSION,
            "mode": "local_media_vault",
            "root": str(self.server.vault_root)
        }
        data = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(data)

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
                        "stage": stage_str or "Application Submitted",
                        "fit_score": j.get("fit_score", 0),
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
                        "stage": stage_str or "Interview / Screen",
                        "fit_score": j.get("fit_score", 0),
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

    def _handle_media_request(self, send_body: bool = True):
        # 1. Parse and sanitize requested URL path
        parsed_url = urllib.parse.urlparse(self.path)
        rel_path = urllib.parse.unquote(parsed_url.path).lstrip("/")
        
        # Strip optional leading 'media/' prefix
        if rel_path.lower().startswith("media/"):
            rel_path = rel_path[6:]

        raw_target = (self.server.vault_root / rel_path).resolve()

        # 2. Strict Security Boundary Check (OWASP A01 Path Traversal Prevention)
        vault_root = self.server.vault_root.resolve()
        try:
            is_safe = os.path.commonpath([str(vault_root), str(raw_target)]) == str(vault_root)
        except ValueError:
            is_safe = False

        if not is_safe:
            self.send_error(403, "Access Denied: Path outside media vault boundary.")
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
                # Malformed range header
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
                # Suffix byte range
                suffix_len = int(end_str)
                start = max(0, file_size - suffix_len)
                end = file_size - 1
            else:
                self.send_error(400, "Invalid Range Specification")
                return

            # Validate range bounds
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
                    # Browser canceled seeking/request mid-stream (normal playback behavior)
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
        """Clean minimal access log."""
        sys.stdout.write(f"[{self.log_date_time_string()}] {self.address_string()} - {format % args}\n")

def main():
    parser = argparse.ArgumentParser(description="Serve study media with RFC 7233 range support.")
    parser.add_argument("--host", default="127.0.0.1", help="Host interface to bind (default 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8080, help="Port to listen on (default 8080)")
    parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT_ROOT, help="Media vault root directory")
    args = parser.parse_args()

    if not args.vault.exists():
        print(f"Error: Vault directory does not exist: {args.vault}")
        return 1

    server_address = (args.host, args.port)
    try:
        httpd = ThreadedHTTPServer(server_address, MediaRangeRequestHandler)
    except OSError as e:
        # Check for port already in use (WinError 10048 or errno 98)
        if getattr(e, 'winerror', None) == 10048 or getattr(e, 'errno', None) == 98:
            print(f"Media daemon already active on http://{args.host}:{args.port}")
            return 0
        raise

    httpd.vault_root = args.vault

    print(f"============================================================")
    print(f"  Study Media Streaming Daemon v{DOE_VERSION}")
    print(f"  Root:  {args.vault}")
    print(f"  Bind:  http://{args.host}:{args.port}")
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
