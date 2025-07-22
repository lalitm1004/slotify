import json
import pandas as pd
from pathlib import Path
from typing import Final, List

from models import CourseEntry

TIMETABLE_XLSX_PATH: Final[Path] = Path("data/time-table.xlsx")
OUTPUT_JSON_PATH: Final[Path] = Path("data/time-table.json")
OUTPUT_JSON_PATH_MINIFIED: Final[Path] = Path("data/time-table-minified.json")


def parse_excel() -> List[CourseEntry]:
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
            "Remarks": "remarks",
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
                remarks=row["remarks"],
            )
            course_entries.append(entry)
        except Exception as e:
            print(f"Error processing row {idx} - {row}: {e}")

    return course_entries


def save_as_json(
    course_entries: List[CourseEntry],
    minify: bool = False,
) -> None:
    output_path = OUTPUT_JSON_PATH_MINIFIED if minify else OUTPUT_JSON_PATH

    with output_path.open("w", encoding="utf-8") as f:
        json.dump(
            [entry.model_dump() for entry in course_entries],
            f,
            indent=None if minify else 4,
            separators=(",", ":") if minify else None,
            ensure_ascii=False,
        )


def main():
    course_entries = parse_excel()
    save_as_json(course_entries, minify=True)


if __name__ == "__main__":
    main()
