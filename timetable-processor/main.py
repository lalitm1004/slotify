import argparse
import json
import pandas as pd
from pathlib import Path
from typing import Final, List

from models import Timetable, CourseEntry

TIMETABLE_XLSX_PATH: Final[Path] = Path("data/time-table.xlsx")
OUTPUT_JSON_PATH: Final[Path] = Path("data/time-table.json")
OUTPUT_JSON_PATH_MINIFIED: Final[Path] = Path("data/time-table-minified.json")


def parse_excel_to_timetable() -> Timetable:
    df = pd.read_excel(TIMETABLE_XLSX_PATH)

    df = df.rename(
        columns={
            "Course Name": "course_name",
            "Course Code": "course_code",
            "Component": "component",
            "Major": "major",
            "Room": "room",
            "Day": "days",
            "Start Time": "start_time",
            "End Time": "end_time",
            "Seats": "seats",
            "Faculty": "faculty",
            "Open as UWE": "open_as_uwe",
            "L/T/P Hour": "ltp_hours",
            "Type": "course_type",
            "Action": "action",
            "Class Notes": "class_notes",
        }
    )

    course_entries: List[CourseEntry] = []
    for idx, row in df.iterrows():
        try:
            entry = CourseEntry(
                course_name=row["course_name"],
                course_code=row["course_code"],
                component=row["component"],
                major=row["major"],
                room=row["room"],
                days=row["days"],
                start_time=row["start_time"],
                end_time=row["end_time"],
                seats=row["seats"],
                faculty=row["faculty"],
                open_as_uwe=row["open_as_uwe"],
                ltp_hours=row["ltp_hours"],
                course_type=row["course_type"],
                action=row["action"],
                class_notes=row["class_notes"],
            )
            course_entries.append(entry)
        except Exception as e:
            print(f"Error processing row {idx} - {row}: {e}")

    return Timetable(courses=course_entries)


def save_as_json(
    timetable: Timetable,
    minify: bool = False,
) -> None:
    output_path = OUTPUT_JSON_PATH_MINIFIED if minify else OUTPUT_JSON_PATH

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(timetable.model_dump_json(indent=None if minify else 4))


def main():
    parser = argparse.ArgumentParser(description="Convert timetable XLSX to JSON.")
    parser.add_argument("--minify", action="store_true", help="Minify the output JSON")
    args = parser.parse_args()

    timetable = parse_excel_to_timetable()
    print(f"Parsed {len(timetable.courses)} course entries from xlsx file")
    save_as_json(timetable, minify=args.minify)


if __name__ == "__main__":
    main()
