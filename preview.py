#!/usr/bin/env python3
"""Serve the local project with byte ranges for native video seeking."""

import argparse
import re
import shutil
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self):
        self.byte_range = None
        range_header = self.headers.get("Range")
        path = Path(self.translate_path(self.path))
        if not range_header or not path.is_file():
            return super().send_head()

        size = path.stat().st_size
        match = re.fullmatch(r"bytes=(\d*)-(\d*)", range_header.strip())
        start, end = 0, size - 1
        valid = bool(match and size)
        if valid:
            first, last = match.groups()
            if first:
                start = int(first)
                end = min(int(last), size - 1) if last else size - 1
            elif last and int(last) > 0:
                start = max(0, size - int(last))
            else:
                valid = False
            valid = valid and 0 <= start <= end < size
        if not valid:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        try:
            source = path.open("rb")
        except OSError:
            self.send_error(404, "File not found")
            return None
        source.seek(start)
        self.byte_range = (start, end)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(str(path)))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Last-Modified", self.date_time_string(path.stat().st_mtime))
        self.end_headers()
        return source

    def copyfile(self, source, outputfile):
        try:
            if self.byte_range is None:
                shutil.copyfileobj(source, outputfile)
                return
            remaining = self.byte_range[1] - self.byte_range[0] + 1
            while remaining:
                data = source.read(min(256 * 1024, remaining))
                if not data:
                    break
                outputfile.write(data)
                remaining -= len(data)
        except (BrokenPipeError, ConnectionResetError):
            pass  # Scrolling away can cancel a video request.


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    root = str(Path(__file__).resolve().parent)

    def handler(*request_args, **request_options):
        return PreviewHandler(*request_args, directory=root, **request_options)

    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"TAPNAV preview: http://127.0.0.1:{args.port}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
