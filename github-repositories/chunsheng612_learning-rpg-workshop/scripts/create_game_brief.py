#!/usr/bin/env python3
"""Create workshop planning documents; never overwrite existing files."""

import argparse
import json
from pathlib import Path
import re
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project_dir", type=Path)
    parser.add_argument("--title", required=True)
    parser.add_argument("--subject", required=True)
    parser.add_argument("--audience", required=True)
    parser.add_argument("--theme", required=True)
    parser.add_argument("--slug", help="Optional lowercase ASCII project identifier")
    args = parser.parse_args()
    for key in ("title", "subject", "audience", "theme"):
        if not getattr(args, key).strip():
            parser.error(f"--{key} cannot be empty")
    slug = args.slug or re.sub(r"[^a-z0-9]+", "-", args.project_dir.name.lower()).strip("-") or "learning-rpg"
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        parser.error("--slug must use lowercase letters, digits and single hyphens")
    root = args.project_dir.expanduser().resolve()
    if root.exists() and not root.is_dir():
        parser.error("project_dir must be a directory")
    destinations = [root / "docs/game-brief.md", root / "docs/production-status.json",
                    root / "reference/art-production/catalog.json"]
    for destination in destinations:
        if destination.exists() or destination.is_symlink():
            parser.error(f"Refusing to overwrite: {destination}")
        for parent in destination.parents:
            if parent.exists() and not parent.is_dir():
                parser.error(f"Parent is not a directory: {parent}")
            if parent.is_symlink() and not parent.resolve().is_relative_to(root):
                parser.error(f"Refusing output outside project through symlink: {parent}")
            if parent == root:
                break
    assets = Path(__file__).resolve().parent.parent / "assets"
    values = {"title": args.title.strip(), "subject": args.subject.strip(),
              "audience": args.audience.strip(), "theme": args.theme.strip(), "slug": slug}
    brief = re.sub(r"\{\{(title|subject|audience|theme|slug)\}\}",
                   lambda match: values[match.group(1)],
                   (assets / "game-brief.md").read_text(encoding="utf-8"))
    catalog = json.loads((assets / "art-catalog.json").read_text(encoding="utf-8"))
    catalog["projectId"] = slug
    status = {
        "schemaVersion": 1, "projectId": slug, "phase": "planning", "scope": "unconfirmed",
        "decisions": [], "assumptions": [], "completed": [], "nextActions": [], "blockers": [],
        "questions": {"draft": 0, "checked": 0, "approved": 0, "active": 0},
        "assets": {"planned": 0, "generated": 0, "reviewed": 0, "integrated": 0, "verified": 0},
        "checks": [], "deployment": {"status": "not-requested", "url": None},
    }
    outputs = [brief, json.dumps(status, ensure_ascii=False, indent=2) + "\n",
               json.dumps(catalog, ensure_ascii=False, indent=2) + "\n"]
    for destination, content in zip(destinations, outputs):
        destination.parent.mkdir(parents=True, exist_ok=True)
        with destination.open("x", encoding="utf-8") as stream:
            stream.write(content)
        print(destination)
    print("Created planning documents only; no game, images, or deployment were created.")


if __name__ == "__main__":
    try:
        main()
    except OSError as error:
        print(f"Unable to create planning documents: {error}", file=sys.stderr)
        sys.exit(1)
