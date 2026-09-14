import { client } from '@/sanity/client'
import Link from 'next/link'

export const revalidate = 60; // El 0 significa "Cero caché, trae datos frescos siempre" !!! tengo que borrarlo en pro

const query = `*[_type in ["product", "family", "application"]] {
  _type,
  _id,
  "title": coalesce(title, name),
  "slug": slug.current
}`

export default async function Home() {
  const data = await client.fetch(query)

  const apps = data.filter((item: any) => item._type === 'application')

  return (
      <main style={{ padding: '50px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
        <section style={{ marginTop: '30px' }}>
          <h2>🚀 Aplicaciones</h2>
          {apps.map((a: any) => (
              <Link key={a._id} href={`/aplicaciones/${a.slug}`} style={{ display: 'block', margin: '25px' }}>
                {a.title}
              </Link>
          ))}
        </section>
      </main>
  )
}
