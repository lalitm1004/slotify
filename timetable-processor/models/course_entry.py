import pandas as pd
import re
from datetime import datetime, time
from enum import StrEnum
from nanoid import generate as gen_nanoid
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Tuple, Union


class Day(StrEnum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"


class ComponentType(StrEnum):
    LECTURE = "LEC"
    TUTORIAL = "TUT"
    PRACTICAL = "PRAC"


class CourseEntry(BaseModel):
    id: str = Field(default_factory=gen_nanoid)
    course_name: str
    course_code: List[str]
    component: Tuple[ComponentType, int]
    student_groups: List[str]
    room: Optional[str]
    days: List[Day]
    start_time: Optional[str]
    end_time: Optional[str]
    ltp_hours: Optional[float]
    open_as_uwe: bool
    section_variants: List[str] = Field(default_factory=list)
    related_entries: List[str] = Field(default_factory=list)

    @field_validator("student_groups", mode="before")
    def parse_student_groups(cls, value: Union[str, float, None]) -> List[str]:
        if value is None or (isinstance(value, float) and pd.isna(value)):
            return []

        if not isinstance(value, str):
            raise ValueError(
                f"Invalid type for student_groups: {type(value)}. Expected a string"
            )

        # Remove commas and split by whitespace
        cleaned = value.replace(",", "").strip()
        return cleaned.split()

    @field_validator("course_code", mode="before")
    def parse_course_code(cls, value: str) -> List[str]:
        if not isinstance(value, str):
            raise ValueError(
                f"Invalid type for course_code: {type(value)}. Expected a string"
            )

        cleaned = value.replace("\n", "").replace("new code", "").strip().upper()
        return cleaned.split("/")

    @field_validator("days", mode="before")
    def parse_days(cls, value: Union[str, float, None]) -> List[Day]:
        if value is None or (isinstance(value, float) and pd.isna(value)):
            return []

        if not isinstance(value, str):
            raise ValueError(
                f"Invalid type for days: {type(value)}. Expected a string or NaN"
            )

        shorthand_map = {
            "M": Day.MONDAY,
            "T": Day.TUESDAY,
            "W": Day.WEDNESDAY,
            "Th": Day.THURSDAY,
            "F": Day.FRIDAY,
            "S": Day.SATURDAY,
        }

        longhand_map = {
            "Mon": Day.MONDAY,
            "Tue": Day.TUESDAY,
            "Wed": Day.WEDNESDAY,
            "Thu": Day.THURSDAY,
            "Fri": Day.FRIDAY,
            "Sat": Day.SATURDAY,
            "Sun": Day.SUNDAY,
            "MON": Day.MONDAY,
            "TUE": Day.TUESDAY,
            "WED": Day.WEDNESDAY,
            "THU": Day.THURSDAY,
            "FRI": Day.FRIDAY,
            "SAT": Day.SATURDAY,
            "SUN": Day.SUNDAY,
        }

        value = value.strip()

        if value in longhand_map:
            return [longhand_map[value]]

        result = []
        i = 0
        while i < len(value):
            if value[i : i + 2] == "Th":
                result.append(Day.THURSDAY)
                i += 2
                continue

            ch = value[i]
            if ch in shorthand_map:
                result.append(shorthand_map[ch])
                i += 1
                continue

            raise ValueError(f"Invalid day character: '{ch}' in input '{value}'")

        return result

    @field_validator("component", mode="before")
    def parse_component(cls, value: str) -> Tuple[ComponentType, int]:
        if not isinstance(value, str):
            raise ValueError(
                f"Invalid type for component: {type(value)}. Expected a string"
            )

        match = re.fullmatch(r"([a-zA-Z]+)(\d+)", value.strip())
        if not match:
            raise ValueError(
                f"Invalid component format: '{value}'. Expected format like 'LEC1', 'TUT1', 'PRAC2'"
            )

        prefix, number = match.groups()
        prefix = prefix.upper()

        component_map = {
            "LEC": ComponentType.LECTURE,
            "TUT": ComponentType.TUTORIAL,
            "PRAC": ComponentType.PRACTICAL,
        }

        if prefix not in component_map:
            raise ValueError(f"Unknown component prefix: '{prefix}'")

        return (component_map[prefix], int(number))

    @field_validator("start_time", "end_time", mode="before")
    def parse_time(cls, value: str) -> Optional[str]:
        if value is None or (isinstance(value, float) and pd.isna(value)):
            return None

        if isinstance(value, time):
            return value.strftime("%H:%M")

        if not isinstance(value, str):
            raise ValueError(f"Invalid type for time: {type(value)}")

        v = value.strip()

        if re.fullmatch(r"\d{1,2}\.\d{2}\s*[APap][Mm]", v):
            v = v.replace(".", ":").upper()

        for pattern in ("%H:%M:%S", "%H:%M", "%I:%M%p"):
            try:
                parsed = datetime.strptime(v, pattern)
                return parsed.strftime("%H:%M")
            except ValueError:
                pass

        raise ValueError(f"Invalid time format: '{value}'")

    @field_validator("open_as_uwe", mode="before")
    def parse_open_as_uwe(cls, value: str) -> bool:
        if value is None or (isinstance(value, float) and pd.isna(value)):
            return False

        if not isinstance(value, str):
            raise ValueError(f"Invalid type for open_as_uwe: {type(value)}")

        return value.strip().lower() == "yes"

    @field_validator(
        "room",
        "start_time",
        "end_time",
        "ltp_hours",
        mode="before",
    )
    def parse_optional_fields(
        cls, value: Union[str, float, None]
    ) -> Optional[Union[str, float]]:
        return none_if_nan(value)


def none_if_nan(value: Union[str, float, None]) -> Optional[Union[str, float]]:
    return value if pd.notna(value) and value != "" else None
