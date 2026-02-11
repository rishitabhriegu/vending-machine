import React, { useEffect, useState } from "react";

function App() {
  const [beverages, setBeverages] = useState([]);
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [newBeverage, setNewBeverage] = useState({
    name: "",
    price: "",
    available: true,
  });

  // Fetch Beverages
  useEffect(() => {
    fetch("http://localhost:8080/beverages")
      .then((res) => res.json())
      .then((data) => setBeverages(data))
      .catch((err) => console.error("Error fetching beverages:", err));
  }, []);

  //Add Beverage
  const addNewBeverage = () => {
    fetch("http://localhost:8080/beverages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        // refresh beverages
        fetch("http://localhost:8080/beverages")
          .then((res) => res.json())
          .then((data) => setBeverages(data));
      })
      .catch((err) => console.error("Error adding beverage:", err));
  };

  // Fetch Cart
  const loadCart = () => {
    fetch("http://localhost:8080/cart")
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error("Error loading cart:", err));
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Add to Cart
  const addToCart = (id) => {
    fetch(`http://localhost:8080/cart/add/${id}`, {
      method: "POST",
    }).then(() => loadCart());
  };

  // Checkout
  const checkout = () => {
    fetch("http://localhost:8080/cart/checkout", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Receipt Generated! Total: $" + data.totalAmount);
        loadCart();
      });
  };

  // Send Daily Sales Email
  const sendDailySales = () => {
    fetch("http://localhost:8080/receipts/daily-sales")
      .then((res) => res.json())
      .then((data) => {
        alert("Daily sales email sent! Total: $" + data.totalRevenue);
      })
      .catch(() => {
        alert("Failed to send daily sales email");
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>☕ Vending Machine</h1>

        <button
          onClick={sendDailySales}
          style={{
            backgroundColor: "#222",
            color: "white",
            padding: "8px 15px",
            border: "none",
            cursor: "pointer",
          }}
        >
          📊 Today's Sales
        </button>
      </div>

      {/* Main Layout */}
      <div style={{ display: "flex", marginTop: "30px", gap: "30px" }}>

        {/* LEFT SIDE - BEVERAGES */}
        <div style={{ flex: 1 }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Beverages</h2>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            ➕ Add Beverage
          </button>
        </div>

          {beverages.map((bev) => (
            <div
              key={bev.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>{bev.name}</h3>
              <p>Price: ${bev.price}</p>
              <button onClick={() => addToCart(bev.id)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE - CART */}
        <div style={{ flex: 1.2 }}>
          <h2>🛒 Cart</h2>

          {cart.items.length === 0 && <p>Cart is empty</p>}

          {/* Cart Header */}
          {cart.items.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 12px",
                fontWeight: "bold",
                borderBottom: "2px solid #ccc",
                marginBottom: "10px",
              }}
            >
              <div style={{ flex: 2 }}>Item</div>
              <div style={{ flex: 1 }}>Price</div>
              <div style={{ flex: 1 }}>Qty</div>
              <div style={{ flex: 1 }}>Subtotal</div>
            </div>
          )}


          {cart.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #eee",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              {/* Name */}
              <div style={{ flex: 2 }}>
                <strong>{item.beverage.name}</strong>
              </div>

              {/* Price */}
              <div style={{ flex: 1 }}>
                ${item.beverage.price}
              </div>

              {/* Quantity */}
              <div style={{ flex: 1 }}>
                Qty: {item.quantity}
              </div>

              {/* Subtotal */}
              <div style={{ flex: 1 }}>
                ${item.subTotal}
              </div>
            </div>
          ))}

          <h3>Total: ${cart.totalAmount}</h3>

          {cart.items.length > 0 && (
            <button
              onClick={checkout}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Checkout
            </button>
          )}
        </div>

      </div>

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
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "300px",
            }}
          >
            <h3>Add New Beverage</h3>

            <input
              type="text"
              placeholder="Beverage Name"
              value={newBeverage.name}
              onChange={(e) =>
                setNewBeverage({ ...newBeverage, name: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
            />

            <input
              type="number"
              placeholder="Price"
              value={newBeverage.price}
              onChange={(e) =>
                setNewBeverage({ ...newBeverage, price: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={addNewBeverage}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
