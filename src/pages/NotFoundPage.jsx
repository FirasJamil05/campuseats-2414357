import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <section className="card">
      <h2>404 — Page not found</h2>
      <p>This page does not exist.</p>
      <Link to="/">Back to vendors</Link>
    </section>
  )
}

export default NotFoundPage