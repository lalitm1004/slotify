from datetime import datetime, timezone
from nanoid import generate as gen_nanoid
from pydantic import BaseModel, Field
from typing import List

from models.course_entry import CourseEntry


class Timetable(BaseModel):
    id: str = Field(default_factory=gen_nanoid)
    courses: List[CourseEntry]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
