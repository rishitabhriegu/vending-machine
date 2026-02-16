import React, { useEffect, useState } from "react";
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,} from "recharts";

function App() {
  const [beverages, setBeverages] = useState([]);
  const [cart, setCart] = useState({ items: {}, totalAmount: 0 });

  const [showModal, setShowModal] = useState(false);
  const [newBeverage, setNewBeverage] = useState({
    name: "",
    price: "",
    available: true,
  });

  const [dailySales, setDailySales] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isRegistering, setIsRegistering] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  /* ================= AUTH FETCH ================= */

  const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token");

    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? "Bearer " + token : "",
        ...options.headers,
      },
    });
  };

  /* ================= LOGIN ================= */

  const login = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setIsAuthenticated(true);
      setRole(data.role);

      setUsername("");
      setPassword("");
    } catch {
      alert("Login failed");
    }
  };

  /* ================= REGISTER ================= */

  const register = async () => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordError("");

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error();

      alert("Registration successful! Please login.");
      setIsRegistering(false);
      setUsername("");
      setPassword("");
    } catch {
      setPasswordError("Registration failed. Try different username.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setIsAuthenticated(false);
    setRole(null);
    setBeverages([]);
    setCart({ items: {}, totalAmount: 0 });
    setDailySales(null);
  };

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!isAuthenticated) return;

    authFetch("http://localhost:8080/beverages")
      .then((res) => res.json())
      .then((data) => setBeverages(data));

    loadCart();
  }, [isAuthenticated]);

  /* ================= CART ================= */

  const loadCart = () => {
    authFetch("http://localhost:8080/cart")
      .then((res) => res.json())
      .then((data) =>
        setCart({
          items: data.items || {},
          totalAmount: data.totalAmount || 0,
        })
      );
  };

  const addToCart = (id) => {
    authFetch(`http://localhost:8080/cart/add/${id}`, {
      method: "POST",
    }).then(() => loadCart());
  };

  const checkout = () => {
    authFetch("http://localhost:8080/cart/checkout", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Receipt Generated! Total: ₹" + data.totalAmount);
        loadCart();
      });
  };

  /* ================= DAILY SALES ================= */

  const loadDailySales = () => {
    authFetch("http://localhost:8080/receipts/daily-sales")
      .then((res) => res.json())
      .then((data) => setDailySales(data));
  };

  const sendDailySalesEmail = () => {
    setIsSendingEmail(true);

    authFetch("http://localhost:8080/receipts/daily-sales/email", {
      method: "POST",
    })
      .then((res) => res.text())
      .then((msg) => {
        setIsSendingEmail(false);
        alert(msg);
      })
      .catch(() => {
        setIsSendingEmail(false);
        alert("Failed to send email");
      });
  };

  /*============ GRAPH ==================== */
  const getChartData = () => {
    if (!dailySales) return [];

    return beverages.map((bev) => ({
      name: bev.name,
      quantity: dailySales.itemCounts?.[bev.name] || 0,
    }));
  };

  /* ================= ADD BEVERAGE ================= */

  const addNewBeverage = () => {
    authFetch("http://localhost:8080/beverages", {
      method: "POST",
      body: JSON.stringify({
        name: newBeverage.name,
        price: Number(newBeverage.price),
        available: newBeverage.available,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setShowModal(false);
        setNewBeverage({ name: "", price: "", available: true });

        return authFetch("http://localhost:8080/beverages");
      })
      .then((res) => res.json())
      .then((data) => setBeverages(data));
  };

  /* ================= LOGIN / REGISTER ================= */

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "50px", fontFamily: "Arial" }}>
        <h2>{isRegistering ? "Register" : "Login"}</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value.length >= 6) setPasswordError("");
          }}
        />

        {passwordError && (
          <div style={{ color: "red", marginTop: "5px" }}>
            {passwordError}
          </div>
        )}

        <br /><br />

        {isRegistering ? (
          <>
            <button onClick={register}>Register</button>
            <br /><br />
            <button onClick={() => setIsRegistering(false)}>
              Already have an account? Login
            </button>
          </>
        ) : (
          <>
            <button onClick={login}>Login</button>
            <br /><br />
            <button onClick={() => setIsRegistering(true)}>
              Create new account
            </button>
          </>
        )}
      </div>
    );
  }

  /* ================= MAIN APP ================= */

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>☕ Vending Machine</h1>
        <div>
          {role === "ADMIN" && (
            <button onClick={loadDailySales}>📊 Today's Sales</button>
          )}
          <button onClick={logout} style={{ marginLeft: "10px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* SALES REPORT */}

      {role === "ADMIN" && dailySales && (
        <div
          style={{
            marginTop: "25px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setDailySales(null)}
            style={{
              position: "absolute",
              right: "15px",
              top: "15px",
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
              color: "#888",
            }}
          >
            ✖
          </button>

          <h2 style={{ marginBottom: "20px" }}>
            📊 Today's Sales Report
          </h2>

          {/* SIDE BY SIDE LAYOUT */}
          <div
            style={{
              display: "flex",
              gap: "30px",
              alignItems: "stretch",
            }}
          >
            {/* LEFT SIDE - SUMMARY */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#f9f9f9",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <p><strong>Date:</strong> {dailySales.date}</p>

              <div
                style={{
                  backgroundColor: "#e8f5e9",
                  padding: "15px",
                  borderRadius: "8px",
                  marginTop: "15px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Total Revenue</span>
                <span style={{ color: "#2e7d32" }}>
                  ₹{dailySales.totalRevenue}
                </span>
              </div>

              <div style={{ marginTop: "20px" }}>
                <strong>Total Items Sold:</strong>{" "}
                {Object.values(dailySales.itemCounts || {}).reduce(
                  (sum, val) => sum + val,
                  0
                )}
              </div>

              <button
                onClick={sendDailySalesEmail}
                disabled={isSendingEmail}
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  width: "100%",
                  cursor: "pointer",
                }}
              >
                {isSendingEmail
                  ? "Sending Report..."
                  : "📧 Send Email Report"}
              </button>
            </div>

            {/* RIGHT SIDE - GRAPH */}
            <div
              style={{
                flex: 2,
                backgroundColor: "#f9f9f9",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}



      <div style={{ display: "flex", marginTop: "30px", gap: "30px" }}>
        <div style={{ flex: 1 }}>
          <h2>Beverages</h2>

          {role === "ADMIN" && (
            <button onClick={() => setShowModal(true)}>➕ Add Beverage</button>
          )}

          {beverages.map((bev) => (
            <div
              key={bev.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "10px",
              }}
            >
              <h3>{bev.name}</h3>
              <p>Price: ₹{bev.price}</p>
              <button onClick={() => addToCart(bev.id)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <h2>🛒 Cart</h2>

          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              minHeight: "250px",
            }}
          >
            {Object.values(cart.items || {}).length === 0 && (
              <div style={{ textAlign: "center", color: "#777", marginTop: "40px" }}>
                Your cart is empty ☕
              </div>
            )}

            {Object.values(cart.items || {}).map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <div>
                  <div style={{ fontWeight: "600" }}>
                    {item.beverageName}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    Qty: {item.quantity}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  ₹{item.subtotal}
                </div>
              </div>
            ))}

            {Object.values(cart.items || {}).length > 0 && (
              <>
                <hr style={{ margin: "15px 0" }} />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                  }}
                >
                  <span>Total</span>
                  <span>₹{cart.totalAmount}</span>
                </div>

                <button
                  onClick={checkout}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#2e7d32",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h3>Add New Beverage</h3>

            <input
              type="text"
              placeholder="Name"
              value={newBeverage.name}
              onChange={(e) =>
                setNewBeverage({ ...newBeverage, name: e.target.value })
              }
            />
            <br /><br />

            <input
              type="number"
              placeholder="Price"
              value={newBeverage.price}
              onChange={(e) =>
                setNewBeverage({ ...newBeverage, price: e.target.value })
              }
            />
            <br /><br />

            <button onClick={addNewBeverage}>Submit</button>
            <button
              onClick={() => setShowModal(false)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
