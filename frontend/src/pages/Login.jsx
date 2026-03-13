import { useState } from "react";

export default function Login({ onLogin }) { // <--- Ara fem servir onLogin
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    
    // El codi d'accés que vulguis. Posem 1234 per provar.
    if (password === "1234") { 
      onLogin("access-granted"); // <--- Cridem a la funció correcta
    } else {
      alert("Codi d'accés incorrecte. Prova amb: 1234");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <img src="/escudo.png" alt="Escut" style={{ width: "130px", marginBottom: "20px" }} />
        <h1 style={{ fontSize: "55px", fontWeight: "900", color: "#000", lineHeight: "0.8", margin: 0 }}>X</h1>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000", margin: 0, letterSpacing: "4px" }}>POLICIAL</h2>
      </div>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px", width: "320px" }}>
        <input 
          type="password" 
          placeholder="Codi d'accés" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "18px", borderRadius: "35px", border: "1px solid #dadce0", outline: "none", fontSize: "18px", textAlign: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}
        />
        <button 
          type="submit"
          style={{ padding: "18px", borderRadius: "35px", border: "none", background: "#1a73e8", color: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(26, 115, 232, 0.3)" }}
        >
          ENTRAR AL SISTEMA
        </button>
      </form>
      
      <p style={{ marginTop: "50px", fontSize: "11px", color: "#bdc1c6", letterSpacing: "2px" }}>UNITAT D'INTEL·LIGÈNCIA OPERATIVA</p>
    </div>
  );
}
