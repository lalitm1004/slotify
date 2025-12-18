import pandas as pd
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Final, List, Tuple

from models import CourseEntry, TimeSlot, Timetable

TIMETABLE_XLSX_PATH: Final[Path] = Path("data/time-table.xlsx")
OUTPUT_JSON_PATH: Final[Path] = Path("data/time-table.json")


def merge_duplicate_entries(course_entries: List[CourseEntry]) -> None:
    entry_groups = defaultdict(list)

    for entry in course_entries:
        key = (frozenset(entry.course_codes), entry.component)
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
        course_key = frozenset(entry.course_codes)
        component_type = entry.component[0]
        section_key = (course_key, component_type)

        by_course[course_key].append(entry.id)
        by_section[section_key].append(entry.id)

    for entry in course_entries:
        course_key = frozenset(entry.course_codes)
        component_type = entry.component[0]
        section_key = (course_key, component_type)

        all_related = [eid for eid in by_course[course_key] if eid != entry.id]
        same_section = [eid for eid in by_section[section_key] if eid != entry.id]

        entry.related_entries = all_related
        entry.section_variants = same_section


def populate_clashing_entries(course_entries: List[CourseEntry]) -> None:
    def time_to_minutes(time_str: str) -> int:
        dt = datetime.strptime(time_str, "%H:%M")
        return dt.hour * 60 + dt.minute

    def timeslots_overlap(slot1: TimeSlot, slot2: TimeSlot) -> bool:
        if not slot1.start_time or not slot1.end_time:
            return False
        if not slot2.start_time or not slot2.end_time:
            return False

        common_days = set(slot1.days) & set(slot2.days)
        if not common_days:
            return False

        start1 = time_to_minutes(slot1.start_time)
        end1 = time_to_minutes(slot1.end_time)
        start2 = time_to_minutes(slot2.start_time)
        end2 = time_to_minutes(slot2.end_time)

        return start1 < end2 and start2 < end1

    def entries_clash(entry1: CourseEntry, entry2: CourseEntry) -> bool:
        for slot1 in entry1.timeslots:
            for slot2 in entry2.timeslots:
                if timeslots_overlap(slot1, slot2):
                    return True
        return False

    for entry in course_entries:
        entry.clashing_entries = []

    for i, entry1 in enumerate(course_entries):
        for entry2 in course_entries[i + 1 :]:
            if entries_clash(entry1, entry2):
                entry1.clashing_entries.append(entry2.id)
                entry2.clashing_entries.append(entry1.id)


def parse_excel_to_timetable() -> Tuple[Timetable, int, int]:
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
                course_codes=row["course_code"],
                component=row["component"],
                student_groups=row["student_groups"],
                timeslots=[timeslot],
                open_as_uwe=row["open_as_uwe"],
            )
            course_entries.append(entry)
        except Exception as e:
            print(f"Error processing row {idx} - {row}: {e}")

    before_dedup = len(course_entries)
    merge_duplicate_entries(course_entries)
    after_dedup = len(course_entries)
    link_course_components(course_entries)
    populate_clashing_entries(course_entries)

    return Timetable(courses=course_entries), before_dedup, after_dedup


def save_as_json(timetable: Timetable, output_path: Path = OUTPUT_JSON_PATH) -> None:
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(timetable.model_dump_json(indent=4))


def main():
    timetable, before_dedup, after_dedup = parse_excel_to_timetable()
    print(f"Deduplicated {before_dedup} -> {after_dedup}")
    print(f"Parsed {len(timetable.courses)} unique course entries from xlsx file")
    save_as_json(timetable)


if __name__ == "__main__":
    main()
