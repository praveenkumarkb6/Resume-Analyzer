import re
from pathlib import Path

from pypdf import PdfReader
from pypdf.errors import PdfReadError


class PDFExtractionError(Exception):
    """Raised when a PDF cannot be read or parsed."""


class PasswordProtectedPDFError(PDFExtractionError):
    """Raised when a PDF requires a password."""


def clean_extracted_text(text: str) -> str:
    """Normalize extracted whitespace without removing resume content."""
    normalized_text = text.replace("\r\n", "\n").replace("\r", "\n")
    normalized_lines = []

    for line in normalized_text.split("\n"):
        cleaned_line = re.sub(r"[ \t]+", " ", line).strip()
        if cleaned_line or (normalized_lines and normalized_lines[-1] != ""):
            normalized_lines.append(cleaned_line)

    return "\n".join(normalized_lines).strip()


def extract_text_from_pdf(file_path: str | Path) -> dict[str, int | str]:
    """Extract and clean text from every page of a PDF."""
    try:
        reader = PdfReader(str(file_path))
        if reader.is_encrypted:
            raise PasswordProtectedPDFError

        page_text = []
        for page in reader.pages:
            page_text.append(page.extract_text() or "")

        extracted_text = clean_extracted_text("\n\n".join(page_text))
        return {
            "extracted_text": extracted_text,
            "page_count": len(reader.pages),
            "character_count": len(extracted_text),
        }
    except PasswordProtectedPDFError:
        raise
    except (OSError, PdfReadError, ValueError) as error:
        raise PDFExtractionError from error