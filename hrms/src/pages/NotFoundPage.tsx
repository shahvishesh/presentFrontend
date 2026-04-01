import { Link, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "560px" }}>
        <h1 style={{ margin: 0, fontSize: "48px" }}>404</h1>
        <p style={{ marginTop: "12px", marginBottom: "8px", fontSize: "22px" }}>
          Page not found
        </p>
        <p style={{ margin: 0, color: "#6b7280" }}>
          No route matches <strong>{location.pathname}</strong>.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link to="/dashboard">Go to Dashboard</Link>
          <Link to="/login">Go to Login</Link>
        </div>
      </div>
    </div>
  );
}
