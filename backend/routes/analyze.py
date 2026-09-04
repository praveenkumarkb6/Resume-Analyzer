from flask import Blueprint, current_app, jsonify, request

from services.pdf_parser import (
    PDFExtractionError,
    PasswordProtectedPDFError,
    extract_text_from_pdf,
)
from services.skill_extractor import categorize_skills, extract_skills
from services.section_detector import detect_sections
from services.job_matcher import match_resume_to_job
from utils.file_utils import generate_safe_filename, validate_uploaded_file

analyze_bp = Blueprint("analyze", __name__)


@analyze_bp.get("/api/health")
def health_check():
    return jsonify({
        "status": "success",
        "message": "Resume Analyzer backend is running",
    })


@analyze_bp.post("/api/analyze")
def analyze_resume():
    resume = request.files.get("resume")
    validation_error = validate_uploaded_file(resume)
    if validation_error:
        return jsonify({"status": "error", "message": validation_error}), 400

    job_description = request.form.get("job_description", "").strip()
    if not job_description:
        return jsonify({
            "status": "error",
            "message": "Job description is required",
        }), 400

    filename = generate_safe_filename(resume.filename)
    file_path = current_app.config["UPLOAD_FOLDER"] / filename

    try:
        resume.save(file_path)
        extraction_result = extract_text_from_pdf(file_path)
        if not extraction_result["extracted_text"]:
            return jsonify({
                "status": "error",
                "message": (
                    "Could not extract readable text from this PDF. "
                    "Please upload a text-based PDF resume."
                ),
            }), 422

        skills = extract_skills(extraction_result["extracted_text"])
        section_result = detect_sections(extraction_result["extracted_text"])
        matching_result = match_resume_to_job(
            skills,
            job_description,
        )
        if not matching_result["job_description_skills"]:
            return jsonify({
                "status": "error",
                "message": "No recognizable technical skills were found in the job description.",
            }), 422

        return jsonify({
            "status": "success",
            "message": "Resume analyzed successfully",
            "filename": filename,
            **extraction_result,
            "skills": skills,
            "skills_by_category": categorize_skills(skills),
            "skill_count": len(skills),
            **section_result,
            **matching_result,
        }), 200
    except PasswordProtectedPDFError:
        return jsonify({
            "status": "error",
            "message": "This PDF is password protected. Please upload an unlocked PDF resume.",
        }), 422
    except PDFExtractionError:
        return jsonify({
            "status": "error",
            "message": "Unable to read the PDF. Please upload a valid PDF resume.",
        }), 422
    except Exception:
        return jsonify({
            "status": "error",
            "message": "Unable to process the uploaded PDF.",
        }), 500
    finally:
        file_path.unlink(missing_ok=True)