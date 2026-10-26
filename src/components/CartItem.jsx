function CartItem({ line, onChangeQty, onRemove, onChangeNote }) {
  const { item, qty, note } = line

  return (
    <li className="cart-line">
      <div>
        <p className="cart-name">{item.name}</p>
        <p className="muted">RM {item.price.toFixed(2)} each</p>
      </div>

      <div className="qty">
        <button type="button" onClick={() => onChangeQty(item.id, -1)}>−</button>
        <span>{qty}</span>
        <button type="button" onClick={() => onChangeQty(item.id, 1)}>+</button>
      </div>

      <p className="line-total">
        RM {(item.price * qty).toFixed(2)}
      </p>

      <button
        type="button"
        className="link danger"
        onClick={() => onRemove(item.id)}
      >
        Remove
      </button>

      <div className="cart-note">
        <label htmlFor={`note-${item.id}`}>Order note</label>
        <textarea
          id={`note-${item.id}`}
          rows={3}
          placeholder="e.g. Less spicy, no onions"
          value={note ?? ''}
          onChange={(e) => onChangeNote(item.id, e.target.value)}
        />
      </div>
    </li>
  )
}

export default CartItem
