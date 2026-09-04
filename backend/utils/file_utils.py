from pathlib import Path
from uuid import uuid4

from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"pdf"}
MAX_FILE_SIZE = 5 * 1024 * 1024


def is_allowed_file(filename: str) -> bool:
    """Return whether a filename has an allowed extension."""
    if not filename or "." not in filename:
        return False
    return filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_safe_filename(original_filename: str) -> str:
    """Create a unique, safe PDF filename for temporary storage."""
    cleaned_name = secure_filename(original_filename)
    extension = Path(cleaned_name).suffix.lower() if cleaned_name else ".pdf"
    return f"{uuid4().hex}{extension}"


def validate_uploaded_file(uploaded_file: FileStorage) -> str | None:
    """Validate the uploaded file and return an error message when invalid."""
    if not uploaded_file or not uploaded_file.filename:
        return "Resume PDF is required"
    if not is_allowed_file(uploaded_file.filename):
        return "Only PDF files are allowed"

    uploaded_file.stream.seek(0, 2)
    file_size = uploaded_file.stream.tell()
    uploaded_file.stream.seek(0)
    if file_size >= MAX_FILE_SIZE:
        return "File size must be less than 5 MB"

    return None