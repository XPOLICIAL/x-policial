import { useState, useEffect } from "react";

export default function Dashboard({ token, onLogout }) {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // URL del teu backend a Render
  const API_URL = "https://x-policial-backend.onrender.com";

  // Carregar carpetes al principi
  useEffect(() => {
    fetch(`${API_URL}/folders`)
      .then((res) => res.json())
      .then((data) => setFolders(data))
      .catch((err) => console.error("Error carregant carpetes:", err));
  }, []);

  const handleAsk = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          folder_id: selectedFolder
        }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("Error en connectar amb el sistema.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>X-POLICIAL DASHBOARD</h1>
        <button onClick={onLogout} style={{ padding: "10px", cursor: "pointer" }}>Tancar sessió</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Selecciona la Carpeta d'Investigació:</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {folders.map((f) => (
            <button 
              key={f.id} 
              onClick={() => setSelectedFolder(f.id)}
              style={{
                padding: "15px 25px",
                backgroundColor: selectedFolder === f.id ? "#1a73e8" : "#f1f3f4",
                color: selectedFolder === f.id ? "white" : "black",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {selectedFolder && (
        <div style={{ marginTop: "30px", borderTop: "2px solid #eee", paddingTop: "20px" }}>
          <h3>Consulta a la IA sobre: {selectedFolder.toUpperCase()}</h3>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Què vols saber d'aquests expedients?"
            style={{ width: "100%", height: "100px", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <button 
            onClick={handleAsk} 
            disabled={loading}
            style={{ marginTop: "10px", padding: "15px", width: "100%", backgroundColor: "#000", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
          >
            {loading ? "Analitzant PDFs..." : "CONSULTAR SISTEMA"}
          </button>

          {answer && (
            <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", borderLeft: "5px solid #1a73e8" }}>
              <strong>Resposta de la IA:</strong>
              <p style={{ lineHeight: "1.6" }}>{answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
