import { client } from '@/sanity/client'
import Link from 'next/link'

export const revalidate = 0; // El 0 significa "Cero caché, trae datos frescos siempre"

const query = `*[_type in ["product", "family", "application"]] {
  _type,
  _id,
  "title": coalesce(title, name),
  "slug": slug.current
}`

export default async function Home() {
  const data = await client.fetch(query)

  const products = data.filter((item: any) => item._type === 'product')
  const families = data.filter((item: any) => item._type === 'family')
  const apps = data.filter((item: any) => item._type === 'application')

  return (
      <main style={{ padding: '50px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Panel de Control Sinergia</h1>

        <section>
          <h2>📦 Productos</h2>
          {products.map((p: any) => (
              <Link key={p._id} href={`/productos/${p.slug}`} style={{ display: 'block', margin: '5px 0', color: 'blue' }}>
                {p.title}
              </Link>
          ))}
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>📂 Familias</h2>
          {families.map((f: any) => (
              <Link key={f._id} href={`/familias/${f.slug}`} style={{ display: 'block', margin: '5px 0', color: 'green' }}>
                {f.title}
              </Link>
          ))}
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>🚀 Aplicaciones</h2>
          {apps.map((a: any) => (
              <Link key={a._id} href={`/aplicaciones/${a.slug}`} style={{ display: 'block', margin: '5px 0', color: 'orange' }}>
                {a.title}
              </Link>
          ))}
        </section>
      </main>
  )
}
