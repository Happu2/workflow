import { uploadPDF } from "../api/pdf";

export default function PDFUpload({ onAddNode }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const res = await uploadPDF(file);

    onAddNode({
      id: `pdf-${Date.now()}`,
      type: "pdf",
      data: {
        name: res.filename,
        text: res.content,
      },
      position: { x: 250, y: 150 },
    });
  };

  return (
    <input
      type="file"
      accept=".pdf"
      onChange={handleUpload}
      className="hidden"
      id="pdf-upload"
    />
  );
}
