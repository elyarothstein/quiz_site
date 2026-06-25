#!/usr/bin/env python3
"""Rename ready photos for the game as g<number>.jpg, g<number+1>.jpg, etc."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

from PIL import Image, ImageOps


# File extensions this program accepts.
SUPPORTED_PHOTOS = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}


# This function makes filenames sort naturally.
# Example: IMG_2.jpg comes before IMG_10.jpg.
def natural_sort_key(path: Path) -> list[object]:
    """Sort IMG_2 before IMG_10, which feels more like normal photo order."""

    # Split the filename into text and number pieces.
    parts = re.split(r"(\d+)", path.name.lower())

    # Convert number pieces into integers so they sort correctly.
    return [int(part) if part.isdigit() else part for part in parts]


# Keep asking until the user enters a valid folder.
def ask_for_folder(prompt: str) -> Path:
    while True:
        # Ask the user for a folder and convert it into a Path object.
        folder = Path(input(prompt).strip().strip('"')).expanduser()

        # If the folder exists, return it.
        if folder.is_dir():
            return folder

        print(f"That folder does not exist: {folder}")


# Keep asking until the user enters a valid number.
def ask_for_number(prompt: str) -> int:
    while True:
        answer = input(prompt).strip()

        # isdigit() checks if the answer contains only numbers.
        if answer.isdigit():
            return int(answer)

        print("Please enter a number, like 195.")


# Open an image, fix its rotation, convert it to JPG, and save it.
def save_as_game_photo(source: Path, destination: Path) -> None:
    """Save every photo as a correctly rotated JPEG for the game."""

    with Image.open(source) as image:
        # Fix sideways iPhone/camera photos.
        image = ImageOps.exif_transpose(image)

        # Convert to RGB so it can be saved as a normal JPG.
        image = image.convert("RGB")

        # Save the image as a JPG file.
        image.save(destination, "JPEG", quality=92, optimize=True)


# Rename every photo sequentially.
# Example: g195.jpg, g196.jpg, g197.jpg, etc.
def renumber_photos(source: Path, destination: Path, start: int, prefix: str) -> list[Path]:
    # Get all supported photos and sort them in a human-friendly order.
    photos = sorted(
        (
            path
            for path in source.iterdir()
            if path.is_file() and path.suffix.lower() in SUPPORTED_PHOTOS
        ),
        key=natural_sort_key,
    )

    # Stop the program if no photos were found.
    if not photos:
        raise SystemExit(f"No photos found in {source}")

    # Create the destination folder if it does not already exist.
    destination.mkdir(parents=True, exist_ok=True)

    created: list[Path] = []

    # enumerate() gives both the photo and its position: 0, 1, 2, etc.
    for offset, photo in enumerate(photos):
        # Build the new filename.
        # If start is 195, the first file becomes g195.jpg.
        new_name = f"{prefix}{start + offset}.jpg"
        new_path = destination / new_name

        # Stop instead of overwriting an existing file.
        if new_path.exists():
            raise SystemExit(f"Stopped because this file already exists: {new_path}")

        # Save the renamed image.
        save_as_game_photo(photo, new_path)

        # Keep track of the created file.
        created.append(new_path)

    return created


# This is the main function where the program starts.
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Rename a folder of already-checked photos into game photo names."
    )

    parser.add_argument("source", nargs="?", type=Path, help="Folder containing the ready photos")
    parser.add_argument("destination", nargs="?", type=Path, help="Folder to put the renamed photos into")
    parser.add_argument("--start", type=int, help="First number to use, like 195")
    parser.add_argument("--prefix", default="g", help="Filename prefix; default is g")

    # Read any command-line arguments the user supplied.
    args = parser.parse_args()

    # If the user did not type a source folder in the terminal, ask for it.
    source = args.source or ask_for_folder("Folder with the ready photos: ")

    # If the user did not type a destination folder in the terminal, ask for it.
    destination = args.destination or ask_for_folder("Folder to put the renamed photos in: ")

    # If the user did not type --start in the terminal, ask for it.
    start = args.start if args.start is not None else ask_for_number("Starting number: ")

    # Rename the photos.
    created = renumber_photos(source.expanduser(), destination.expanduser(), start, args.prefix)

    first = created[0].name
    last = created[-1].name

    print(f"Done — created {len(created)} photos: {first} through {last}")


# Only run main() when this file is executed directly.
if __name__ == "__main__":
    main()