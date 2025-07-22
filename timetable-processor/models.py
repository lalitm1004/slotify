import pandas as pd
import re
from enum import Enum
from nanoid import generate
from pydantic import BaseModel, Field, field_validator
from typing import Any, List, Optional, Tuple, Union


class Day(str, Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"


class ComponentType(str, Enum):
    LECTURE = "LEC"
    TUTORIAL = "TUT"
    PRACTICAL = "PRAC"


class CourseEntry(BaseModel):
    id: str = Field(default_factory=lambda: generate())
    course_name: str
    course_code: str
    component: Tuple[ComponentType, int]
    major: str
    room: Optional[str]
    days: List[Day]
    start_time: Optional[str]
    end_time: Optional[str]
    seats: int
    faculty: Optional[str]
    open_as_uwe: bool
    ltp_hours: Optional[float]
    course_type: Optional[str]
    action: Optional[str]
    class_notes: Optional[str]
    remarks: Optional[str]

    @field_validator("course_code", mode="before")
    def parse_course_code(cls, value: str) -> str:
        if not isinstance(value, str):
            raise ValueError(
                f"Invalid type for course_code: {type(value)}. Expected a string"
            )

        return value.replace("\n", "").strip().upper()

    @field_validator("days", mode="before")
    def parse_days(cls, value: Union[str, float, None]) -> List[Day]:
        if value is None or (isinstance(value, float) and pd.isna(value)):
            return []

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
        }

        if not isinstance(value, str):
            raise ValueError(
                f"Invalid type for days: {type(value)}. Expected a string or NaN"
            )

        value = value.strip()

        if value in longhand_map:
            return [longhand_map[value]]

        result: List[Day] = []
        i = 0
        while i < len(value):
            if value[i : i + 2] == "Th":
                result.append(Day.THURSDAY)
                i += 2
                continue

            ch = value[i]
            if ch in shorthand_map:
                result.append(shorthand_map[ch])
            else:
                raise ValueError(f"Invalid day character: '{ch}' in input '{value}'")
            i += 1

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

        component_type = component_map.get(prefix)
        if component_type is None:
            raise ValueError(f"Unknown component prefix: '{prefix}' in '{value}'")

        return (component_type, int(number))

    @field_validator("start_time", "end_time", mode="before")
    def parse_to_str(cls, value: Any) -> str:
        return str(value).strip()

    @field_validator("faculty", mode="before")
    def parse_faculty(cls, value: str) -> str:
        if not isinstance(value, str):
            raise ValueError(
                f"Invalid type for faculty: {type(value)}. Expected a string"
            )

        return value.replace("\n", "").strip().rstrip(",")

    @field_validator("open_as_uwe", mode="before")
    def parse_open_as_uwe(cls, value: str) -> bool:
        if not isinstance(value, str):
            raise ValueError(
                f"Invalid type for open_as_uwe: {type(value)}. Expected a string"
            )

        return value.strip().lower() == "yes"

    @field_validator(
        "room",
        "start_time",
        "end_time",
        "ltp_hours",
        "course_type",
        "action",
        "class_notes",
        "remarks",
        mode="before",
    )
    def parse_optional_fields(
        cls, value: Union[str, float, None]
    ) -> Optional[Union[str, float]]:
        return none_if_nan(value)


def none_if_nan(val: Union[str, float, None]) -> Optional[Union[str, float]]:
    return val if pd.notna(val) and val != "" else None
