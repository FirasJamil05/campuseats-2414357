import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'
import MenuList from './components/MenuList.jsx'
import CartPage from './components/CartPage.jsx'
import { Loading, ErrorMessage } from './components/Status.jsx'
import Footer from './components/Footer.jsx'

function App() {
  const [vendors, setVendors] = useState([])
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [completedRequestKey, setCompletedRequestKey] = useState(-1)

  // A new reloadKey means the current request is loading. This also avoids
  // resetting state directly inside an effect (React Hooks lint rule).
  const loading = completedRequestKey !== reloadKey

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/vendors.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load vendors (HTTP ${response.status})`)
        }
        return response.json()
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setVendors(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCompletedRequestKey(reloadKey)
        }
      })

    return () => controller.abort()
  }, [reloadKey])

  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const selectedVendor = vendors.find(
    (v) => v.id === selectedVendorId
  ) || vendors[0]

  // Cart lines have the structure { item, qty, note }.
  const [cart, setCart] = useState([])

  function handleAddToCart(item) {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (line) => line.item.id === item.id
      )

      if (existingItem) {
        return prevCart.map((line) =>
          line.item.id === item.id
            ? { ...line, qty: line.qty + 1 }
            : line
        )
      }

      return [...prevCart, { item, qty: 1, note: '' }]
    })
  }

  function handleChangeQty(itemId, change) {
    setCart((prevCart) =>
      prevCart
        .map((line) =>
          line.item.id === itemId
            ? { ...line, qty: line.qty + change }
            : line
        )
        .filter((line) => line.qty > 0)
    )
  }

  function handleRemove(itemId) {
    setCart((prevCart) =>
      prevCart.filter((line) => line.item.id !== itemId)
    )
  }

  // B6 (matric ending in 7): each cart line owns an editable order note.
  // The textarea is controlled from the state lifted up to App.
  function handleChangeNote(itemId, note) {
    setCart((prevCart) =>
      prevCart.map((line) =>
        line.item.id === itemId ? { ...line, note } : line
      )
    )
  }

  const [view, setView] = useState('menu') // 'menu' | 'cart' | 'done'
  const [lastOrder, setLastOrder] = useState(null)

  function handlePlaceOrder(details) {
    const total = cart.reduce(
      (sum, line) => sum + line.item.price * line.qty,
      0
    )

    // Save the purchased lines (including order notes) before clearing the cart.
    setLastOrder({ ...details, total, lines: cart.map((line) => ({ ...line })) })
    setCart([])
    setView('done')
  }

  const cartCount = cart.reduce(
    (total, line) => total + line.qty,
    0
  )

  let content

  if (view === 'cart') {
    content = (
      <CartPage
        cart={cart}
        onChangeQty={handleChangeQty}
        onRemove={handleRemove}
        onChangeNote={handleChangeNote}
        onPlaceOrder={handlePlaceOrder}
      />
    )
  } else if (view === 'done') {
    content = (
      <section>
        <h2>Order placed.</h2>
        <p>Name: {lastOrder.name}</p>
        <p>Mahallah: {lastOrder.mahallah}</p>
        <p>Pickup Time: {lastOrder.pickupTime}</p>
        <p>Total: RM {lastOrder.total.toFixed(2)}</p>
        {lastOrder.lines.some((line) => line.note?.trim()) && (
          <div>
            <h3>Order notes</h3>
            <ul>
              {lastOrder.lines
                .filter((line) => line.note?.trim())
                .map((line) => (
                  <li key={line.item.id}>
                    {line.item.name}: {line.note}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </section>
    )
  } else if (loading) {
    content = <Loading />
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
  } else {
    content = (
      <>
        <section>
          <h2 className="section-title">Choose a vendor</h2>
          <div className="vendor-grid">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isSelected={vendor.id === selectedVendor?.id}
                onSelect={setSelectedVendorId}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">
            Menu: {selectedVendor?.name}
          </h2>
          {selectedVendor && (
            <MenuList
              items={selectedVendor.menu}
              onAdd={handleAddToCart}
            />
          )}
        </section>
      </>
    )
  }

  return (
    <>
      <Header
        cartCount={cartCount}
        onShowMenu={() => setView('menu')}
        onShowCart={() => setView('cart')}
      />
      <main className="container">{content}</main>
      <Footer />
    </>
  )
}

export default App
