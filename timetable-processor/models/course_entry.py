import pandas as pd
import re
from enum import StrEnum
from nanoid import generate as gen_nanoid
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Tuple, Union

from models.time_slot import TimeSlot


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
    timeslots: List["TimeSlot"]
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

    @field_validator("open_as_uwe", mode="before")
    def parse_open_as_uwe(cls, value: str) -> bool:
        if value is None or (isinstance(value, float) and pd.isna(value)):
            return False

        if not isinstance(value, str):
            raise ValueError(f"Invalid type for open_as_uwe: {type(value)}")

        return value.strip().lower() == "yes"

    @field_validator("ltp_hours", mode="before")
    def parse_optional_fields(
        cls, value: Union[str, float, None]
    ) -> Optional[Union[str, float]]:
        return none_if_nan(value)


def none_if_nan(value: Union[str, float, None]) -> Optional[Union[str, float]]:
    return value if pd.notna(value) and value != "" else None
