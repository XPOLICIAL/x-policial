import { useEffect, useState } from "react";

export default function ConsultaModule({ folder }) {

  const [documents, setDocuments] = useState([]);
  const handleFileUpload = async (event) => {

  const file = event.target.files[0];

  const formData = new FormData();
  formData.append("file", file);

  await fetch(
    `https://x-policial-backend.onrender.com/upload-pdf/${folder.id}`,
    {
      method: "POST",
      body: formData
    }
  );

  // tornar a carregar documents
  const response = await fetch(
    `https://x-policial-backend.onrender.com/documents/${folder.id}`
  );

  const data = await response.json();

  setDocuments(data.documents || []);
};
  useEffect(() => {

    async function loadDocuments() {

      const response = await fetch(
        `https://x-policial-backend.onrender.com/documents/${folder.id}`
      );

      const data = await response.json();

      setDocuments(data.documents || []);
    }

    loadDocuments();

  }, [folder.id]);

  return (
    <div>

      <h1>{folder.name}</h1>
      <p>Folder ID: {folder.id}</p>

      <p>Mode: Consulta jurídica</p>

      <h3>Documents disponibles</h3>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      {documents.length === 0 ? (
        <p>No hi ha documents.</p>
      ) : (
        <ul>
  {documents.map((doc) => (
    <li key={doc.id} style={{ display: "flex", gap: "10px" }}>
      <span>📄 {doc.name}</span>

      <button
        onClick={async () => {
          await fetch(
  `https://x-policial-backend.onrender.com/documents/${doc.id}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

          setDocuments(documents.filter((d) => d.id !== doc.id));
        }}
      >
        🗑
      </button>
    </li>
  ))}
</ul>
      )}

    </div>
  );
}
