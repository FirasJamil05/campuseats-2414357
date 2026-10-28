import { Link } from 'react-router'
import { useCart } from '../hooks/useCart.js'

function OrdersPage() {
  const { orders } = useCart()

  return (
    <section>
      <h2 className="section-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="muted">
          No orders yet. <Link to="/">Browse vendors</Link>.
        </p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="card order-card" key={order.id}>
              <h3>Order placed</h3>

              <p className="muted">
                {new Date(order.placedAt).toLocaleString('en-MY')}
              </p>

              <p>
                <strong>Name:</strong> {order.name}
              </p>

              <p>
                <strong>Mahallah:</strong> {order.mahallah}
              </p>

              <p>
                <strong>Pickup Time:</strong> {order.pickupTime}
              </p>

              <ul className="order-items">
                {order.lines.map((line) => (
                  <li key={line.item.id}>
                    <span>
                      {line.item.name} × {line.qty}
                    </span>

                    <span>
                      RM {(line.item.price * line.qty).toFixed(2)}
                    </span>

                    {/* B4: Display saved order notes */}
                    {line.note?.trim() && (
                      <p className="order-saved-note">
                        <strong>Order note:</strong> {line.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              <p className="cart-total">
                Total: RM {order.total.toFixed(2)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default OrdersPage