import argparse
import pandas as pd
from collections import defaultdict
from pathlib import Path
from typing import Final, List

from models import Timetable, CourseEntry

TIMETABLE_XLSX_PATH: Final[Path] = Path("data/time-table.xlsx")
OUTPUT_JSON_PATH: Final[Path] = Path("data/time-table.json")
OUTPUT_JSON_PATH_MINIFIED: Final[Path] = Path("data/time-table-minified.json")


def merge_duplicate_entries(course_entries: List[CourseEntry]) -> None:
    entry_groups = defaultdict(list)

    for entry in course_entries:
        key = (frozenset(entry.course_code), entry.component)
        entry_groups[key].append(entry)

    merged = []

    for group in entry_groups.values():
        if len(group) == 1:
            merged.append(group[0])
            continue

        base_entry = group[0]

        all_timeslots = []
        all_student_groups = set(base_entry.student_groups)

        for entry in group:
            all_timeslots.extend(entry.timeslots)
            all_student_groups.update(entry.student_groups)

        base_entry.timeslots = all_timeslots
        base_entry.student_groups = sorted(list(all_student_groups))

        merged.append(base_entry)

    course_entries.clear()
    course_entries.extend(merged)


def link_course_components(course_entries: List[CourseEntry]) -> None:
    by_course = defaultdict(list)
    by_section = defaultdict(list)

    for entry in course_entries:
        course_key = frozenset(entry.course_code)
        component_type = entry.component[0]
        section_key = (course_key, component_type)

        by_course[course_key].append(entry.id)
        by_section[section_key].append(entry.id)

    for entry in course_entries:
        course_key = frozenset(entry.course_code)
        component_type = entry.component[0]
        section_key = (course_key, component_type)

        all_related = [eid for eid in by_course[course_key] if eid != entry.id]
        same_section = [eid for eid in by_section[section_key] if eid != entry.id]

        entry.related_entries = all_related
        entry.section_variants = same_section


def parse_excel_to_timetable() -> Timetable:
    from models import TimeSlot

    df = pd.read_excel(TIMETABLE_XLSX_PATH)

    df = df.rename(
        columns={
            "Course Name": "course_name",
            "Course Code": "course_code",
            "Component": "component",
            "Major": "student_groups",
            "Rooms": "room",
            "Day": "days",
            "Start Time": "start_time",
            "End Time": "end_time",
            "Open as UWE": "open_as_uwe",
            "L/T/P Hour": "ltp_hours",
            "Type": "course_type",
        }
    )

    course_entries: List[CourseEntry] = []
    for idx, row in df.iterrows():
        try:
            timeslot = TimeSlot(
                days=row["days"],
                start_time=row["start_time"],
                end_time=row["end_time"],
                room=row["room"],
            )

            entry = CourseEntry(
                course_name=row["course_name"],
                course_code=row["course_code"],
                component=row["component"],
                student_groups=row["student_groups"],
                timeslots=[timeslot],
                open_as_uwe=row["open_as_uwe"],
                ltp_hours=row["ltp_hours"],
            )
            course_entries.append(entry)
        except Exception as e:
            print(f"Error processing row {idx} - {row}: {e}")

    merge_duplicate_entries(course_entries)
    link_course_components(course_entries)

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
