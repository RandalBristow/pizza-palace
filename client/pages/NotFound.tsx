export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#f3f3f3",
        color: "#333333",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "16px", color: "#666666" }}>
        404
      </h1>
      <p style={{ fontSize: "16px", marginBottom: "24px" }}>Page not found</p>
      <a
        href="/"
        style={{
          color: "#0078d4",
          textDecoration: "none",
          fontSize: "14px",
          padding: "8px 16px",
          border: "1px solid #0078d4",
          borderRadius: "3px",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#0078d4";
          e.currentTarget.style.color = "#ffffff";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#0078d4";
        }}
      >
        Back to Form Designer
      </a>
    </div>
  );
}
