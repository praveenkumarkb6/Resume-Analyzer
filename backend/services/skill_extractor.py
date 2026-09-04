import json
import re
from functools import lru_cache
from pathlib import Path

SKILLS_FILE = Path(__file__).resolve().parent.parent / "data" / "skills.json"
ALIASES = {
    "JS": "JavaScript",
    "Javascript": "JavaScript",
    "Node": "Node.js",
    "ReactJS": "React",
    "ML": "Machine Learning",
    "DL": "Deep Learning",
    "Git Hub": "GitHub",
    "Visual Studio Code": "VS Code",
    "REST API": "REST APIs",
    "fitz": "PyMuPDF",
}


@lru_cache(maxsize=1)
def load_skills() -> dict[str, list[str]]:
    """Load and cache the canonical skill catalog."""
    with SKILLS_FILE.open("r", encoding="utf-8") as skills_file:
        return json.load(skills_file)


def _skill_pattern(skill: str) -> re.Pattern[str]:
    escaped_skill = re.escape(skill).replace(r"\ ", r"\s+")
    edge_characters = r"A-Za-z0-9_.+#-"
    return re.compile(
        rf"(?<![{edge_characters}]){escaped_skill}(?![A-Za-z0-9_+#-]|\.[A-Za-z0-9])",
        re.IGNORECASE,
    )


def extract_skills(text: str) -> list[str]:
    """Return unique canonical skills found in resume text."""
    if not text:
        return []

    catalog = load_skills()
    canonical_names = {
        skill
        for category_skills in catalog.values()
        for skill in category_skills
    }
    candidate_matches = []
    for canonical_name in canonical_names:
        for match in _skill_pattern(canonical_name).finditer(text):
            candidate_matches.append((match.start(), match.end(), canonical_name))

    for alias, canonical_name in ALIASES.items():
        if canonical_name in canonical_names:
            for match in _skill_pattern(alias).finditer(text):
                candidate_matches.append((match.start(), match.end(), canonical_name))

    matches: set[str] = set()
    occupied_ranges = []
    for start, end, canonical_name in sorted(
        candidate_matches,
        key=lambda item: (-(item[1] - item[0]), item[0]),
    ):
        overlaps_existing = any(
            start < occupied_end and end > occupied_start
            for occupied_start, occupied_end in occupied_ranges
        )
        if not overlaps_existing:
            matches.add(canonical_name)
            occupied_ranges.append((start, end))

    return [
        skill
        for category_skills in catalog.values()
        for skill in category_skills
        if skill in matches
    ]


def categorize_skills(skills: list[str]) -> dict[str, list[str]]:
    """Group detected canonical skills by their catalog categories."""
    detected_skills = set(skills)
    return {
        category: [skill for skill in category_skills if skill in detected_skills]
        for category, category_skills in load_skills().items()
        if any(skill in detected_skills for skill in category_skills)
    }