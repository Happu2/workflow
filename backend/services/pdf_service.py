from fastapi import UploadFile
from pypdf import PdfReader

def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Extract text from an uploaded PDF file.
    Works with FastAPI UploadFile.
    """

    reader = PdfReader(file.file)

    text_chunks = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_chunks.append(page_text)

    full_text = "\n".join(text_chunks)

    # Optional cleanup
    return full_text.strip()
