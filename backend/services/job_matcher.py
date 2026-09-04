from services.skill_extractor import extract_skills


def _unique_canonical_skills(skills: list[str]) -> list[str]:
    """Remove duplicate skill names while preserving their first-seen order."""
    unique_skills = []
    seen_skills = set()
    for skill in skills:
        normalized_skill = skill.casefold()
        if normalized_skill not in seen_skills:
            seen_skills.add(normalized_skill)
            unique_skills.append(skill)
    return unique_skills


def build_recommendations(missing_skills: list[str]) -> list[str]:
    """Create focused technical recommendations for missing skills."""
    return [
        f"Consider strengthening your knowledge of {skill}."
        for skill in missing_skills
    ]


def match_resume_to_job(resume_skills: list[str], job_description: str) -> dict[str, object]:
    """Compare resume skills with recognized skills in a job description."""
    job_description_skills = _unique_canonical_skills(extract_skills(job_description))
    unique_resume_skills = _unique_canonical_skills(resume_skills)
    resume_skill_names = {skill.casefold() for skill in unique_resume_skills}

    matched_skills = [
        skill for skill in job_description_skills
        if skill.casefold() in resume_skill_names
    ]
    missing_skills = [
        skill for skill in job_description_skills
        if skill.casefold() not in resume_skill_names
    ]
    total_job_skills = len(job_description_skills)
    matched_skill_count = len(matched_skills)
    match_score = round(
        (matched_skill_count / total_job_skills) * 100,
        1,
    ) if total_job_skills else 0.0

    return {
        "job_description_skills": job_description_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_score": match_score,
        "total_job_skills": total_job_skills,
        "matched_skill_count": matched_skill_count,
        "missing_skill_count": len(missing_skills),
        "recommendations": build_recommendations(missing_skills),
    }
