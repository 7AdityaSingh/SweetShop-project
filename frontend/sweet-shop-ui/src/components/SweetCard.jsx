import { useState, useContext } from "react";
import api from "../api/api";
import "../styles/SweetCard.css";
import { AuthContext } from "../context/AuthContext";


function SweetCard({ sweet }) {
  const [showBuy, setShowBuy] = useState(false);
  const [qty, setQty] = useState(1);
  const { token } = useContext(AuthContext);


  const handlePurchase = async () => {
  if (!token) {
    alert("Please login to purchase");
    return;
  }

  try {
    await api.post(`/sweets/${sweet.id}/purchase`, {
      quantity: qty,
    });
    window.location.reload();
  } catch {
    alert("Purchase failed");
  }
};

  return (
    <div className="sweet-card">
      <h3>{sweet.name}</h3>
      <p>Category: {sweet.category}</p>
      <p>Price: ₹{sweet.price}</p>
      <p>Available: {sweet.quantity}</p>

      {!showBuy && (
        <button
          disabled={sweet.quantity <= 0}
          onClick={() => setShowBuy(true)}
        >
          {sweet.quantity <= 0 ? "Out of Stock" : "Purchase"}
        </button>
      )}

      {showBuy && (
        <div className="purchase-box">
          <input className="num-box"
            type="number"
            min="1"
            max={sweet.quantity}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />
          <button className="confirm" onClick={handlePurchase}>Confirm</button>
          <button
            className="cancel"
            onClick={() => setShowBuy(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default SweetCard;
