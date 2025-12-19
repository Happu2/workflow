from fastapi import APIRouter, UploadFile, File
from services.pdf_service import extract_text_from_pdf
from services.embedding_service import embed_document
from services.chroma_service import store_chunks

router = APIRouter()


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file)
    chunks, embeddings = embed_document(text)
    store_chunks(chunks, embeddings)

    # Return a preview of the text (first 500 characters)
    preview = text[:500] + "..." if len(text) > 500 else text

    return {
        "status": "indexed",
        "chunks": len(chunks),
        "preview": preview,
        "filename": file.filename
    }
