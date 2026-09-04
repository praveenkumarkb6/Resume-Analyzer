import unittest

from services.job_matcher import match_resume_to_job


class JobMatcherTests(unittest.TestCase):
    def test_exact_match(self):
        result = match_resume_to_job(["Python", "Flask", "SQL"], "Python, Flask, SQL")
        self.assertEqual(result["matched_skills"], ["Python", "Flask", "SQL"])
        self.assertEqual(result["missing_skills"], [])
        self.assertEqual(result["match_score"], 100.0)

    def test_partial_match_and_recommendations(self):
        result = match_resume_to_job(
            ["Python", "Flask", "SQL"],
            "Python, Flask, SQL, Docker",
        )
        self.assertEqual(result["matched_skills"], ["Python", "Flask", "SQL"])
        self.assertEqual(result["missing_skills"], ["Docker"])
        self.assertEqual(result["match_score"], 75.0)
        self.assertEqual(
            result["recommendations"],
            ["Consider strengthening your knowledge of Docker."],
        )

    def test_no_match(self):
        result = match_resume_to_job(["Python"], "Java, Docker, AWS")
        self.assertEqual(result["matched_skills"], [])
        self.assertEqual(result["missing_skills"], ["Java", "AWS", "Docker"])
        self.assertEqual(result["match_score"], 0.0)

    def test_case_insensitive_and_duplicate_safe(self):
        result = match_resume_to_job(["python", "Python", "FLASK"], "PYTHON, flask, Python")
        self.assertEqual(result["job_description_skills"], ["Python", "Flask"])
        self.assertEqual(result["matched_skill_count"], 2)
        self.assertEqual(result["match_score"], 100.0)

    def test_alias_matching(self):
        result = match_resume_to_job(
            ["VS Code", "REST APIs", "PyMuPDF"],
            "Visual Studio Code, REST API, fitz",
        )
        self.assertEqual(set(result["job_description_skills"]), {"VS Code", "REST APIs", "PyMuPDF"})
        self.assertEqual(result["total_job_skills"], 3)
        self.assertEqual(result["missing_skills"], [])
        self.assertEqual(result["match_score"], 100.0)

    def test_empty_or_unrecognized_job_description(self):
        empty_result = match_resume_to_job(["Python"], "")
        self.assertEqual(empty_result["total_job_skills"], 0)
        self.assertEqual(empty_result["match_score"], 0.0)
        self.assertEqual(empty_result["recommendations"], [])

        no_skill_result = match_resume_to_job(["Python"], "A motivated developer who communicates well")
        self.assertEqual(no_skill_result["job_description_skills"], [])


if __name__ == "__main__":
    unittest.main()
