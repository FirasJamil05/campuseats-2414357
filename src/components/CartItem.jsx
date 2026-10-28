import { useCart } from '../hooks/useCart.js'

function CartItem({ line }) {
  const { item, qty, note } = line

  const { changeQty, removeFromCart, changeNote } = useCart()

  return (
    <li className="cart-line">
      <div>
        <p className="cart-name">{item.name}</p>
        <p className="muted">
          RM {item.price.toFixed(2)} each
        </p>
      </div>

      <div className="qty">
        <button
          type="button"
          onClick={() => changeQty(item.id, -1)}
        >
          −
        </button>

        <span>{qty}</span>

        <button
          type="button"
          onClick={() => changeQty(item.id, 1)}
        >
          +
        </button>
      </div>

      <p className="line-total">
        RM {(item.price * qty).toFixed(2)}
      </p>

      <button
        type="button"
        className="link danger"
        onClick={() => removeFromCart(item.id)}
      >
        Remove
      </button>

      {/* Personal feature: Order note */}
      <div className="cart-note">
        <label htmlFor={`note-${item.id}`}>
          Order note
        </label>

        <textarea
          id={`note-${item.id}`}
          rows={3}
          maxLength={200}
          placeholder="e.g. Less spicy, no onions"
          value={note ?? ''}
          onChange={(event) =>
            changeNote(item.id, event.target.value)
          }
        />
      </div>
    </li>
  )
}

export default CartItem