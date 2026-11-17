#!/usr/bin/env python3
"""Builds ctube/feed.json from each channel's public YouTube RSS feed.

Run by .github/workflows/ctube-feed.yml every few hours. Uses only the
public feeds (no API key, no quota, no scraping). Shorts are left out.
If a channel's feed fails, its videos from the last good feed.json are kept."""
import json, os, sys, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHANNELS = os.path.join(ROOT, "ctube", "channels.json")
OUT = os.path.join(ROOT, "ctube", "feed.json")
NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015",
      "m": "http://search.yahoo.com/mrss/"}

def fetch(cid):
    url = "https://www.youtube.com/feeds/videos.xml?channel_id=" + cid
    req = urllib.request.Request(url, headers={"User-Agent": "CTube feed builder (chausima.com/ctube)"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()

def parse(xml, ch):
    root = ET.fromstring(xml)
    vids = []
    for e in root.findall("a:entry", NS):
        link = e.find("a:link", NS).get("href", "")
        if "/shorts/" in link:
            continue
        g = e.find("m:group", NS)
        desc = (g.findtext("m:description", "", NS) or "").strip()
        stats = g.find("m:community/m:statistics", NS)
        vids.append({
            "id": e.findtext("yt:videoId", "", NS),
            "t": e.findtext("a:title", "", NS),
            "c": ch["id"],
            "p": e.findtext("a:published", "", NS)[:19] + "Z",
            "v": int(stats.get("views", "0")) if stats is not None else 0,
            "d": desc[:400],
        })
    return vids

def main():
    chans = json.load(open(CHANNELS))
    old = {}
    if os.path.exists(OUT):
        for v in json.load(open(OUT)).get("videos", []):
            old.setdefault(v["c"], []).append(v)
    videos, failed = [], []
    for ch in chans:
        try:
            videos += parse(fetch(ch["id"]), ch)
        except Exception as e:  # keep what we had for this channel
            failed.append(ch["name"]); print("failed:", ch["name"], e, file=sys.stderr)
            videos += old.get(ch["id"], [])
    videos.sort(key=lambda v: v["p"], reverse=True)
    if not videos:
        sys.exit("no videos at all; leaving feed.json alone")
    data = {"updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "channels": chans, "videos": videos}
    # don't create a commit when only the timestamp would change
    if os.path.exists(OUT):
        prev = json.load(open(OUT))
        if prev.get("videos") == videos and prev.get("channels") == chans:
            print("no change"); return
    with open(OUT, "w") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print(len(videos), "videos;", "failed:", failed or "none")

if __name__ == "__main__":
    main()
