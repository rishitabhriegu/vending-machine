import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [beverages, setBeverages] = useState([]);
  const [cart, setCart] = useState({ items: {}, totalAmount: 0 });

  const [showModal, setShowModal] = useState(false);
  const [newBeverage, setNewBeverage] = useState({
    name: "",
    price: "",
    available: true,
  });

  const [beverageError, setBeverageError] = useState("");

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

  const [toast, setToast] = useState({
    message: "",
    type: "success", // success | error
    visible: false,
  });


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

  const login = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setIsAuthenticated(true);
      setRole(data.role);
      setUsername("");
      setPassword("");
      setPasswordError("");

    } catch (err) {
      setPasswordError(err.message);
    }
  };


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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      showToast("Registration successful! Please login.", "success");
      setIsRegistering(false);
      setUsername("");
      setPassword("");

    } catch (err) {
      setPasswordError(err.message);
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

  useEffect(() => {
    if (!isAuthenticated) return;

    authFetch("http://localhost:8080/beverages")
      .then((res) => res.json())
      .then((data) => setBeverages(data));

    loadCart();
  }, [isAuthenticated]);

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
        showToast("Receipt Generated! Total: $" + data.totalAmount, "success");
        loadCart();
      });
  };

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
        showToast(msg, "success");
      })
      .catch(() => {
        setIsSendingEmail(false);
        showToast("Failed to send email", "error");
      });
  };

  const getChartData = () => {
    if (!dailySales) return [];

    return beverages.map((bev) => ({
      name: bev.name,
      quantity: dailySales.itemCounts?.[bev.name] || 0,
    }));
  };

  const addNewBeverage = () => {
    const name = newBeverage.name.trim();
    const price = Number(newBeverage.price);

    if (!name) {
      setBeverageError("Beverage name is required");
      return;
    }

    if (!newBeverage.price) {
      setBeverageError("Price is required");
      return;
    }

    if (price < 1 || price > 500) {
      setBeverageError("Price must be between 1 and 500");
      return;
    }

    setBeverageError(""); // clear errors

    authFetch("http://localhost:8080/beverages", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        price: price,
        available: newBeverage.available,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();

          if (text && text.toLowerCase().includes("duplicate")) {
            throw new Error("Duplicate entry cannot be added.");
          }

          throw new Error(text || "Duplicate entry cannot be added.");
        }

        return res.json();
      })
      .then(() => {
        setShowModal(false);
        setNewBeverage({ name: "", price: "", available: true });

        return authFetch("http://localhost:8080/beverages");
      })
      .then((res) => res.json())
      .then((data) => setBeverages(data))
      .catch((err) => {
        setBeverageError(err.message);
      });
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000); // auto hide after 3 seconds
  };


  /* ===== LOGIN UI ===== */

  if (!isAuthenticated) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#1976d2,#42a5f5)",
        fontFamily: "Arial"
      }}>
        <div style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "350px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
            {isRegistering ? "Create Account ☕" : "Welcome Back ☕"}
          </h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value.length >= 6) setPasswordError("");
            }}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />

          {passwordError && (
            <div style={{ color: "red", marginTop: "8px" }}>
              {passwordError}
            </div>
          )}

          <button
            onClick={isRegistering ? register : login}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            {isRegistering ? "Register" : "Login"}
          </button>

          <div
            style={{ textAlign: "center", marginTop: "15px", cursor: "pointer", color: "#555" }}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </div>
        </div>
      </div>
    );
  }

      /* ================= MAIN APP ================= */

      return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>☕ Vending Machine</h1>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {role === "ADMIN" && (
                <button
                  onClick={loadDailySales}
                  style={{
                    padding: "6px 14px",
                    fontSize: "14px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  📊 Today's Sales
                </button>
              )}

              <button
                onClick={logout}
                style={{
                  padding: "6px 14px",
                  fontSize: "14px",
                  backgroundColor: "#e53935",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
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
                      ${dailySales.totalRevenue}
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
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    marginTop: "10px",
                    padding: "10px 16px",
                    backgroundColor: "#2e7d32",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "500",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#1b5e20"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#2e7d32"}
                >
                  ➕ Add Beverage
                </button>
              )}

              {beverages.map((bev) => (
                <div
                  key={bev.id}
                  style={{
                    backgroundColor: "white",
                    padding: "18px 20px",
                    marginTop: "15px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "0.2s ease",
                  }}
                >
                  {/* LEFT SIDE */}
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: "600" }}>
                      {bev.name}
                    </div>
                    <div style={{ marginTop: "6px", color: "#555" }}>
                      ${bev.price}
                    </div>
                  </div>

                  {/* RIGHT SIDE BUTTON */}
                  <button
                    onClick={() => addToCart(bev.id)}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
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
                      ${item.subtotal}
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
                      <span>${cart.totalAmount}</span>
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
               backgroundColor: "rgba(0,0,0,0.4)",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               zIndex: 1000,
             }}
           >
             <div
               style={{
                 backgroundColor: "#ffffff",
                 padding: "32px",
                 borderRadius: "16px",
                 width: "360px",
                 boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                 display: "flex",
                 flexDirection: "column",
                 gap: "18px",
               }}
             >
               <h2 style={{ margin: 0, fontWeight: 600 }}>
                 Add New Beverage
               </h2>

               <input
                 type="text"
                 placeholder="Beverage Name"
                 value={newBeverage.name}
                 onChange={(e) => {
                   setNewBeverage({ ...newBeverage, name: e.target.value });
                   setBeverageError("");
                 }}
                 style={{
                   padding: "10px 12px",
                   borderRadius: "8px",
                   border: "1px solid #ddd",
                   fontSize: "14px",
                   outline: "none",
                 }}
               />

               <input
                 type="number"
                 placeholder="Price"
                 value={newBeverage.price}
                 onChange={(e) => {
                   setNewBeverage({ ...newBeverage, price: e.target.value });
                   setBeverageError("");
                 }}
                 style={{
                   padding: "10px 12px",
                   borderRadius: "8px",
                   border: "1px solid #ddd",
                   fontSize: "14px",
                   outline: "none",
                 }}
               />

               {beverageError && (
                 <div style={{ color: "#d32f2f", fontSize: "13px" }}>
                   {beverageError}
                 </div>
               )}

               <div
                 style={{
                   display: "flex",
                   justifyContent: "flex-end",
                   gap: "12px",
                   marginTop: "10px",
                 }}
               >
                 <button
                   onClick={() => setShowModal(false)}
                   style={{
                     padding: "8px 16px",
                     borderRadius: "8px",
                     border: "1px solid #ddd",
                     backgroundColor: "#fff",
                     cursor: "pointer",
                     fontWeight: 500,
                   }}
                 >
                   Cancel
                 </button>

                 <button
                   onClick={addNewBeverage}
                   style={{
                     padding: "8px 18px",
                     borderRadius: "8px",
                     border: "none",
                     backgroundColor: "#1976d2",
                     color: "#fff",
                     cursor: "pointer",
                     fontWeight: 500,
                     boxShadow: "0 2px 8px rgba(25,118,210,0.3)",
                   }}
                 >
                   Add Beverage
                 </button>
               </div>
             </div>
           </div>
         )}

         {toast.visible && (
           <div
             style={{
               position: "fixed",
               bottom: "40px",
               left: "50%",
               transform: "translateX(-50%)",
               backgroundColor:
                 toast.type === "success" ? "#2e7d32" : "#d32f2f",
               color: "white",
               padding: "14px 24px",
               borderRadius: "30px",
               boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
               fontSize: "14px",
               fontWeight: "500",
               zIndex: 2000,
               transition: "all 0.3s ease",
               opacity: toast.visible ? 1 : 0,
             }}
           >
             {toast.message}
           </div>
         )}


        </div>
      );
    }

    export default App;
