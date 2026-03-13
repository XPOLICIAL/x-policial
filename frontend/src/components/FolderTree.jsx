import { useState } from "react";

export default function FolderTree({ folders, parentId = null, level = 0, onSelectFolder, loadFolders, token, isAdminMode }) {
  const [openFolders, setOpenFolders] = useState({});
  const [docs, setDocs] = useState({});
  const API = "https://x-policial-backend.onrender.com";

  const toggleFolder = async (id) => {
    const isOpening = !openFolders[id];
    setOpenFolders(prev => ({ ...prev, [id]: isOpening }));
    // Només carreguem documents si estem en mode gestor
    if (isOpening && isAdminMode) refreshDocs(id);
  };

  const refreshDocs = async (id) => {
    const res = await fetch(`${API}/documents/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setDocs(prev => ({ ...prev, [id]: Array.isArray(data) ? data : [] }));
  };

  const handleRename = async (e, folder) => {
    e.stopPropagation();
    const newName = prompt("Nou nom per a la carpeta:", folder.name);
    if (!newName || newName === folder.name) return;
    await fetch(`${API}/folders/${folder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName })
    });
    loadFolders();
  };

  const moveFolder = async (e, folder, direction) => {
    e.stopPropagation();
    const currentOrder = folder.order || 0;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    await fetch(`${API}/folders/${folder.id}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder })
    });
    loadFolders();
  };

  const handleDeleteDoc = async (docId, folderId) => {
    if (!confirm("Eliminar aquest document?")) return;
    await fetch(`${API}/documents/${docId}`, { method: "DELETE" });
    refreshDocs(folderId);
  };

  const handleUpload = async (e, folderId) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_id", folderId);
    await fetch(`${API}/upload`, { method: "POST", body: formData });
    refreshDocs(folderId);
  };

  const filtered = folders
    .filter(f => f.parentId === parentId)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      {filtered.map(folder => {
        const isOpen = openFolders[folder.id];
        const hasChildren = folders.some(f => f.parentId === folder.id);

        return (
          <div key={folder.id} style={{ marginLeft: level > 0 ? "15px" : "0", marginBottom: "4px" }}>
            <div 
              onClick={() => { onSelectFolder(folder); toggleFolder(folder.id); }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", cursor: "pointer", borderRadius: "8px" }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e8f0fe"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <span style={{ color: "#3c4043", fontSize: "14px", fontWeight: level === 0 ? "700" : "400", display: "flex", alignItems: "center" }}>
                <span style={{ color: "#1a73e8", marginRight: "8px", fontSize: level === 0 ? "18px" : "14px" }}>
                  {hasChildren ? (isOpen ? "▾" : "▸") : "•"}
                </span>
                <span style={{ marginRight: "8px" }}>📂</span> {folder.name}
              </span>

              {isAdminMode && (
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {level === 0 && (
                    <div style={{ display: "flex", gap: "2px" }}>
                      <span onClick={(e) => moveFolder(e, folder, 'up')} style={{ color: "#1a73e8", padding: "0 2px" }}>↑</span>
                      <span onClick={(e) => moveFolder(e, folder, 'down')} style={{ color: "#1a73e8", padding: "0 2px" }}>↓</span>
                    </div>
                  )}
                  <label style={{ color: "#1a73e8", cursor: "pointer" }}>📤<input type="file" hidden onChange={(e) => handleUpload(e, folder.id)} accept=".pdf" /></label>
                  <span onClick={(e) => handleRename(e, folder)} style={{ cursor: "pointer" }}>✏️</span>
                  <span onClick={(e) => { e.stopPropagation(); const n = prompt("Nom subcarpeta:"); if(n) fetch(`${API}/folders`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name:n, parentId:folder.id})}).then(()=>loadFolders())}} style={{ color: "#1a73e8", fontWeight: "bold" }}>+</span>
                  <span onClick={async (e) => { e.stopPropagation(); if(confirm("Eliminar?")) { await fetch(`${API}/folders/${folder.id}`, {method:"DELETE"}); loadFolders(); } }} style={{ color: "#ea4335", fontWeight: "bold" }}>×</span>
                </div>
              )}
            </div>

            {isOpen && (
              <div style={{ marginLeft: "18px", borderLeft: "1px solid #dadce0", paddingLeft: "5px" }}>
                {/* NOMÉS MOSTRAR DOCUMENTS SI ÉS MODE GESTOR */}
                {isAdminMode && docs[folder.id]?.map(doc => (
                  <div key={doc.id} style={{ padding: "5px 10px", fontSize: "13px", color: "#5f6368", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>📄 {doc.name}</span>
                    <span onClick={() => handleDeleteDoc(doc.id, folder.id)} style={{ color: "#ea4335", cursor: "pointer", fontWeight: "bold", marginLeft: "10px" }}>×</span>
                  </div>
                ))}
                
                <FolderTree 
                  folders={folders} 
                  parentId={folder.id} 
                  level={level + 1} 
                  onSelectFolder={onSelectFolder} 
                  loadFolders={loadFolders} 
                  token={token} 
                  isAdminMode={isAdminMode} 
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
