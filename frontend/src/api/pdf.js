export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem('token');
  const res = await fetch("http://localhost:8003/pdf/upload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData,
  });

  if (!res.ok) throw new Error("PDF upload failed");

  return res.json();
}
