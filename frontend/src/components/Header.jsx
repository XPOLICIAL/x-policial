export default function Header({ onLogout }) {

  return (

    <div style={{
      height: "70px",
      background: "#111",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      borderBottom: "1px solid #333"
    }}>

      <img src="/escudo-left.png" style={{height:"40px"}} />

      <h1 style={{margin:0, fontSize:"22px"}}>
        X POLICIAL
      </h1>

      <div style={{display:"flex",alignItems:"center",gap:"20px"}}>

        <img src="/escudo-right.png" style={{height:"40px"}} />

        <button
          onClick={onLogout}
          style={{
            background:"#333",
            color:"white",
            border:"none",
            padding:"8px 12px",
            cursor:"pointer"
          }}
        >
          Logout
        </button>

      </div>

    </div>

  );

}
