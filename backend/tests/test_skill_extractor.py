import unittest

from services.skill_extractor import categorize_skills, extract_skills


class SkillExtractorTests(unittest.TestCase):
    def test_basic_skills(self):
        self.assertEqual(extract_skills("Python React SQL Git"), ["Python", "React", "SQL", "Git"])

    def test_case_insensitive_duplicates(self):
        self.assertEqual(extract_skills("PYTHON python Python React React"), ["Python", "React"])

    def test_multi_word_skills(self):
        self.assertEqual(
            extract_skills("Machine Learning and Natural Language Processing"),
            ["Machine Learning", "Natural Language Processing"],
        )

    def test_punctuation_and_short_skill_boundaries(self):
        self.assertEqual(
            extract_skills("Experienced in C++, Java, C#, Python and JavaScript"),
            ["Python", "Java", "C++", "C#", "JavaScript"],
        )
        self.assertEqual(extract_skills("A developer can create clean applications."), [])

    def test_web_stack(self):
        self.assertEqual(
            extract_skills("React, Node.js, Express, HTML, CSS"),
            ["HTML", "CSS", "React", "Node.js", "Express"],
        )

    def test_aliases_and_categories(self):
        skills = extract_skills("JS ReactJS ML DL Git Hub")
        self.assertEqual(
            skills,
            ["JavaScript", "React", "Machine Learning", "Deep Learning", "GitHub"],
        )
        self.assertEqual(
            categorize_skills(["Python", "React", "SQL", "Git"]),
            {
                "programming_languages": ["Python"],
                "web_technologies": ["React"],
                "databases": ["SQL"],
                "version_control": ["Git"],
            },
        )

    def test_no_skills(self):
        self.assertEqual(extract_skills("I am a motivated student looking for opportunities."), [])


if __name__ == "__main__":
    unittest.main()
