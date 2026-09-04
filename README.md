# Resume Analyzer

A beginner-friendly full-stack application that extracts resume text from PDF files, identifies technical skills and resume sections, and compares resume skills with a job description.

## Features

- PDF-only resume uploads with temporary-file cleanup
- Text extraction from every PDF page using pypdf
- Deterministic, case-insensitive skill extraction with aliases
- Resume section detection
- Job-description skill matching and technical overlap score
- Missing-skill recommendations focused on technical skills
- Responsive React analysis dashboard

The application does not use an external AI API. The technical match score describes skill overlap only; it is not a hiring or selection prediction.

## Technology stack

- React and Vite
- Python and Flask
- Flask-CORS and python-dotenv
- pypdf for PDF extraction
- Explainable, rule-based matching

## Project layout

- `frontend/`: React user interface
- `backend/`: Flask API and analysis services
- `uploads/`: temporary upload location, excluded from Git

## Local development

Frontend:

```powershell
Set-Location frontend
npm run dev
```

Backend:

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

## API

`POST http://127.0.0.1:5000/api/analyze` accepts multipart form-data with:

- `resume`: a PDF file up to 5 MB
- `job_description`: the job description text

The response includes extracted text and metadata, resume skills and sections, job-description skills, matched and missing skills, a technical skill match score, and recommendations.

Health check:

`GET http://127.0.0.1:5000/api/health`

## Skill and section processing

Technical skills are stored in `backend/data/skills.json`. The backend extracts skills from actual resume text using deterministic, case-insensitive matching. Duplicate matches are removed, canonical display names are preserved, and detected skills are grouped by category. Section detection uses known heading variations and preserves section body text.

## Testing

Run backend tests from `backend`:

```powershell
python -m unittest discover -s tests -p "test*.py"
```

Run frontend checks from `frontend`:

```powershell
npm run build
npm run lint
```

## Example workflow

1. Start Flask and Vite.
2. Open the frontend at `http://localhost:5173`.
3. Upload a text-based PDF resume and enter a job description.
4. Select **Analyze resume** to view the technical match dashboard.

## Limitations

- Scanned/image-only PDFs require OCR, which is not implemented.
- Matching is based on the finite catalog in `backend/data/skills.json`.
- The technical match score is not a hiring decision.
- Production deployment configuration is not included.
