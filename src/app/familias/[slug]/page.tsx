import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    // Pedimos la familia y, de paso, buscamos qué productos la tienen asignada
    const family = await client.fetch(`*[_type == "family" && slug.current == $slug][0]{
    name,
    description,
    "products": *[_type == "product" && mainFamily._ref == ^._id]{
      _id,
      title,
      "slug": slug.current
    }
  }`, { slug })

    if (!family) return notFound()

    return (
        <main style={{ padding: '50px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <Link href="/" style={{ color: 'blue', textDecoration: 'none', fontWeight: 'bold' }}>← Volver a la Home</Link>

            <h1 style={{ marginTop: '20px', fontSize: '36px' }}>{family.name}</h1>
            {family.description && <p style={{ fontSize: '18px', color: '#555', lineHeight: '1.6' }}>{family.description}</p>}

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h2>Productos en esta familia</h2>
                {family.products && family.products.length > 0 ? (
                    <ul style={{ marginTop: '15px' }}>
                        {family.products.map((product: any) => (
                            <li key={product._id} style={{ margin: '10px 0' }}>
                                <Link href={`/productos/${product.slug}`} style={{ color: '#0066cc', textDecoration: 'none' }}>
                                    📦 {product.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: '#777' }}>Aún no hay productos en esta familia.</p>
                )}
            </div>
        </main>
    )
}
