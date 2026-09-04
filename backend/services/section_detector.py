import re

SECTION_HEADINGS = {
    "contact_information": ["Contact Information", "Contact Details", "Contact"],
    "professional_summary": ["Summary", "Professional Summary", "Profile", "About Me"],
    "career_objective": ["Objective", "Career Objective", "Professional Objective"],
    "education": ["Education", "Academic Background", "Educational Qualification"],
    "skills": ["Skills", "Technical Skills", "Skills & Technologies", "Technical Skills & Tools"],
    "work_experience": ["Experience", "Work Experience", "Professional Experience", "Employment History"],
    "internship": ["Internship", "Internships", "Internship Experience"],
    "projects": ["Projects", "Academic Projects", "Personal Projects", "Project Experience"],
    "certifications": ["Certifications", "Certificates", "Courses & Certifications"],
    "achievements": ["Achievements", "Awards", "Honors"],
    "languages": ["Languages", "Languages Known"],
    "interests": ["Interests", "Hobbies", "Interests & Hobbies"],
}


def _normalize_heading(line: str) -> str:
    """Normalize harmless heading punctuation and whitespace for comparison."""
    normalized_line = re.sub(r"^[\s\u2022\-*]+|[\s:]+$", "", line)
    normalized_line = re.sub(r"\s+", " ", normalized_line)
    return normalized_line.casefold()


HEADING_LOOKUP = {
    _normalize_heading(heading): section_name
    for section_name, headings in SECTION_HEADINGS.items()
    for heading in headings
}


def _heading_section(line: str) -> str | None:
    """Return a section key only when the complete line is a known heading."""
    return HEADING_LOOKUP.get(_normalize_heading(line))


def _has_contact_marker(text: str) -> bool:
    return bool(re.search(
        r"(?:[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|(?:\+?\d[\d ()-]{7,}\d)|\b(?:linkedin|github)\b)",
        text,
        re.IGNORECASE,
    ))


def detect_sections(text: str) -> dict[str, dict[str, str] | int]:
    """Detect known resume sections and preserve their original body text."""
    if not text or not text.strip():
        return {"sections": {}, "section_count": 0}

    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    detected_sections: dict[str, str] = {}
    section_ranges: list[tuple[str, int]] = []

    for line_index, line in enumerate(lines):
        section_name = _heading_section(line)
        if section_name and section_name not in detected_sections:
            section_ranges.append((section_name, line_index))

    for range_index, (section_name, heading_index) in enumerate(section_ranges):
        next_heading_index = (
            section_ranges[range_index + 1][1]
            if range_index + 1 < len(section_ranges)
            else len(lines)
        )
        body = "\n".join(lines[heading_index + 1:next_heading_index]).strip()
        detected_sections[section_name] = body

    if section_ranges:
        first_heading_index = section_ranges[0][1]
        preamble = "\n".join(lines[:first_heading_index]).strip()
        if preamble and _has_contact_marker(preamble):
            detected_sections.setdefault("contact_information", preamble)
    elif _has_contact_marker(text):
        detected_sections["contact_information"] = text.strip()

    ordered_sections = {
        section_name: detected_sections[section_name]
        for section_name in SECTION_HEADINGS
        if section_name in detected_sections
    }
    return {"sections": ordered_sections, "section_count": len(ordered_sections)}
