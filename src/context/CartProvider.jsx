import { CartContext } from './cart-context.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('campuseats-cart', [])
  const [orders, setOrders] = useLocalStorage('campuseats-orders', [])

  const count = cart.reduce(
    (sum, line) => sum + line.qty,
    0
  )

  const total = cart.reduce(
    (sum, line) => sum + line.item.price * line.qty,
    0
  )

  function addToCart(item) {
    setCart((previous) => {
      const found = previous.find(
        (line) => line.item.id === item.id
      )

      return found
        ? previous.map((line) =>
            line.item.id === item.id
              ? { ...line, qty: line.qty + 1 }
              : line
          )
        : [...previous, { item, qty: 1, note: '' }]
    })
  }

  function changeQty(itemId, delta) {
    setCart((previous) =>
      previous
        .map((line) =>
          line.item.id === itemId
            ? { ...line, qty: line.qty + delta }
            : line
        )
        .filter((line) => line.qty > 0)
    )
  }

  function removeFromCart(itemId) {
    setCart((previous) =>
      previous.filter((line) => line.item.id !== itemId)
    )
  }

  // Personal feature: Order notes per item
  function changeNote(itemId, note) {
    setCart((previous) =>
      previous.map((line) =>
        line.item.id === itemId
          ? { ...line, note }
          : line
      )
    )
  }

  function placeOrder(details) {
    if (cart.length === 0) return

    const order = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      placedAt: new Date().toISOString(),
      ...details,
      lines: cart.map((line) => ({
        ...line,
        item: { ...line.item }
      })),
      total,
    }

    setOrders((previous) => [order, ...previous])
    setCart([])

    return order
  }

  const value = {
    cart,
    orders,
    count,
    total,
    addToCart,
    changeQty,
    removeFromCart,
    changeNote,
    placeOrder,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider