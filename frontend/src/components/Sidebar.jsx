import { useState } from "react";
import FolderTree from "./FolderTree";

export default function Sidebar({ folders, onSelectFolder, loadFolders, token }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [logo, setLogo] = useState("/escudo.png");

  const changeLogo = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const sortedFolders = [...folders].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#f8f9fa" }}>
      {/* CAPÇALERA AJUSTADA */}
      <div style={{ padding: "30px 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", borderBottom: "1px solid #e0e0e0" }}>
        <label style={{ cursor: "pointer" }}>
          <img src={logo} alt="Escut" style={{ width: "85px", height: "auto", objectFit: "contain" }} />
          <input type="file" hidden onChange={changeLogo} />
        </label>
        
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "900", color: "#000", lineHeight: "0.8", margin: 0 }}>X</h1>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#000", margin: 0, letterSpacing: "2px" }}>POLICIAL</h2>
        </div>

        <label style={{ cursor: "pointer" }}>
          <img src={logo} alt="Escut" style={{ width: "85px", height: "auto", objectFit: "contain" }} />
          <input type="file" hidden onChange={changeLogo} />
        </label>
      </div>

      <div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: "800", color: "#1a73e8" }}>{isAdminMode ? "GESTOR" : "USUARI"}</span>
        <button onClick={() => setIsAdminMode(!isAdminMode)} style={{ border: "1px solid #1a73e8", background: isAdminMode ? "#1a73e8" : "none", color: isAdminMode ? "white" : "#1a73e8", padding: "4px 12px", borderRadius: "15px", cursor: "pointer", fontSize: "10px", fontWeight: "bold" }}>
          {isAdminMode ? "TANCAR" : "EDITAR"}
        </button>
      </div>
      
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        <FolderTree folders={sortedFolders} onSelectFolder={onSelectFolder} loadFolders={loadFolders} token={token} isAdminMode={isAdminMode} />
      </div>
    </div>
  );
}
