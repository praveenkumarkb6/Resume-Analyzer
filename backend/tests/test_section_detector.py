import unittest

from services.section_detector import detect_sections


class SectionDetectorTests(unittest.TestCase):
    def test_normal_resume_sections(self):
        result = detect_sections(
            "John Doe\njohn@example.com\n\nCareer Objective\nPython developer\n\nEducation\nB.Tech\n\nTechnical Skills\nPython, Flask"
        )
        self.assertEqual(result["section_count"], 4)
        self.assertEqual(
            set(result["sections"]),
            {"contact_information", "career_objective", "education", "skills"},
        )
        self.assertEqual(result["sections"]["career_objective"], "Python developer")
        self.assertEqual(result["sections"]["skills"], "Python, Flask")

    def test_case_insensitive_variations(self):
        result = detect_sections(
            "professional summary\nExperienced developer\n\nACADEMIC BACKGROUND:\nB.Tech\n\nPROJECT EXPERIENCE\nResume app"
        )
        self.assertEqual(
            set(result["sections"]),
            {"professional_summary", "education", "projects"},
        )

    def test_multiple_sections_and_preserved_lines(self):
        result = detect_sections(
            "Projects\nProject one\nProject two\n\nCertifications\nPython certificate\n\nLanguages Known\nEnglish"
        )
        self.assertEqual(result["sections"]["projects"], "Project one\nProject two")
        self.assertEqual(result["section_count"], 3)

    def test_missing_sections_and_empty_text(self):
        self.assertEqual(detect_sections("Skills\nPython")["section_count"], 1)
        self.assertEqual(detect_sections(""), {"sections": {}, "section_count": 0})

    def test_normal_sentences_are_not_headings(self):
        result = detect_sections(
            "I have experience in education and projects.\nSummary of my work is below."
        )
        self.assertEqual(result, {"sections": {}, "section_count": 0})

    def test_unusual_formatting_and_remaining_headings(self):
        result = detect_sections(
            "* WORK EXPERIENCE: \nBuilt APIs\n\nHobbies:\nReading\n\nAwards\nHackathon finalist"
        )
        self.assertEqual(
            set(result["sections"]),
            {"work_experience", "interests", "achievements"},
        )


if __name__ == "__main__":
    unittest.main()
