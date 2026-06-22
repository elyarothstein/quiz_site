#!/usr/bin/env python3
"""Remove duplicates and blurry photos, then prepare numbered game-ready JPEGs."""

from __future__ import annotations

import argparse
import csv
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter, ImageOps, ImageStat


SUPPORTED = {".jpg", ".jpeg", ".png", ".tif", ".tiff"}
DATE_TAKEN = 36867
DATE_MODIFIED = 306


def capture_time(path: Path) -> datetime:
    with Image.open(path) as image:
        exif = image.getexif()
        value = exif.get(DATE_TAKEN) or exif.get(DATE_MODIFIED)
    if value:
        try:
            return datetime.strptime(str(value), "%Y:%m:%d %H:%M:%S")
        except ValueError:
            pass
    return datetime.fromtimestamp(path.stat().st_mtime)


def difference_hash(path: Path, size: int = 16) -> int:
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image).convert("L")
        image = image.resize((size + 1, size), Image.Resampling.LANCZOS)
        if hasattr(image, "get_flattened_data"):
            pixels = list(image.get_flattened_data())
        else:
            pixels = list(image.getdata())
    value = 0
    for row in range(size):
        start = row * (size + 1)
        for column in range(size):
            value = (value << 1) | (pixels[start + column] > pixels[start + column + 1])
    return value


def sharpness(path: Path) -> float:
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image).convert("L")
        image.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
        return ImageStat.Stat(image.filter(ImageFilter.FIND_EDGES)).var[0]


def blur_score(path: Path) -> float:
    """Return a contrast-normalized detail score; lower values are blurrier."""
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image).convert("L")
        image.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
        contrast = ImageStat.Stat(image).stddev[0]
        softened = image.filter(ImageFilter.GaussianBlur(2))
        high_frequency = ImageChops.difference(image, softened)
        detail = ImageStat.Stat(high_frequency).rms[0]
    return 100 * detail / max(contrast, 1)


def find_groups(files: list[Path], hashes: dict[Path, int], times: dict[Path, datetime]) -> list[list[Path]]:
    parent = {path: path for path in files}

    def root(path: Path) -> Path:
        while parent[path] != path:
            parent[path] = parent[parent[path]]
            path = parent[path]
        return path

    def join(left: Path, right: Path) -> None:
        left_root, right_root = root(left), root(right)
        if left_root != right_root:
            parent[right_root] = left_root

    for index, left in enumerate(files):
        for right in files[index + 1 :]:
            seconds = abs((times[left] - times[right]).total_seconds())
            hash_distance = (hashes[left] ^ hashes[right]).bit_count()
            if seconds <= 2 and hash_distance <= 30:
                join(left, right)

    groups: dict[Path, list[Path]] = {}
    for path in files:
        groups.setdefault(root(path), []).append(path)
    return list(groups.values())


def save_for_game(source: Path, destination: Path, max_edge: int) -> None:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        image.save(destination, "JPEG", quality=90, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Folder containing exported album photos")
    parser.add_argument("destination", type=Path, help="Folder for numbered JPEGs")
    parser.add_argument("--start", type=int, default=1, help="First number to use")
    parser.add_argument("--prefix", default="g", help="Filename prefix")
    parser.add_argument("--max-edge", type=int, default=2048, help="Maximum image edge in pixels")
    parser.add_argument(
        "--blur-threshold",
        type=float,
        default=6.0,
        help="Remove photos scoring below this value (default: 6.0; use 0 to disable)",
    )
    args = parser.parse_args()

    files = sorted(path for path in args.source.iterdir() if path.suffix.lower() in SUPPORTED)
    if not files:
        raise SystemExit(f"No supported photos found in {args.source}")

    times = {path: capture_time(path) for path in files}
    hashes = {path: difference_hash(path) for path in files}
    groups = find_groups(files, hashes, times)
    scores = {path: sharpness(path) for path in files}
    representatives = [max(group, key=lambda path: scores[path]) for group in groups]
    blur_scores = {path: blur_score(path) for path in representatives}
    blurry = [path for path in representatives if blur_scores[path] < args.blur_threshold]
    keepers = [path for path in representatives if path not in blurry]
    keepers.sort(key=lambda path: (times[path], path.name.lower()))

    args.destination.mkdir(parents=True, exist_ok=True)
    manifest_rows = []
    for offset, source in enumerate(keepers):
        destination = args.destination / f"{args.prefix}{args.start + offset}.jpg"
        if destination.exists():
            raise SystemExit(f"Refusing to overwrite {destination}")
        save_for_game(source, destination, args.max_edge)
        group = next(group for group in groups if source in group)
        removed = "; ".join(path.name for path in group if path != source)
        manifest_rows.append(
            (
                "kept",
                destination.name,
                source.name,
                times[source].isoformat(sep=" "),
                f"{blur_scores[source]:.2f}",
                removed,
            )
        )

    for source in sorted(blurry, key=lambda path: (times[path], path.name.lower())):
        manifest_rows.append(
            (
                "removed: blurry",
                "",
                source.name,
                times[source].isoformat(sep=" "),
                f"{blur_scores[source]:.2f}",
                "",
            )
        )

    manifest = args.destination / "photo_manifest.csv"
    with manifest.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            ("status", "game_filename", "source_photo", "date_taken", "blur_score", "duplicates_removed")
        )
        writer.writerows(manifest_rows)

    duplicate_count = len(files) - len(representatives)
    print(
        f"Created {len(keepers)} photos; removed {duplicate_count} near-duplicate burst frames "
        f"and {len(blurry)} blurry photos."
    )
    if keepers:
        print(f"Names: {args.prefix}{args.start}.jpg through {args.prefix}{args.start + len(keepers) - 1}.jpg")


if __name__ == "__main__":
    main()
