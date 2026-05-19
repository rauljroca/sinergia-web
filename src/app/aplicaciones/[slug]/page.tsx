import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 0; // El 0 significa "Cero caché, trae datos frescos siempre"

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    // Pedimos la aplicación y expandimos los productos relacionados
    const application = await client.fetch(`*[_type == "application" && slug.current == $slug][0]{
    name,
    description,
    longDescription,
    "mainImageUrl": mainImage.asset->url,
    featureBlocks,
    successStories,
    "relatedProducts": relatedProducts[]->{
      _id,
      title,
      "slug": slug.current
    }
  }`, { slug })

    if (!application) return notFound()

    return (
        <main style={{ padding: '50px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <Link href="/" style={{ color: 'blue', textDecoration: 'none', fontWeight: 'bold' }}>← Volver a la Home</Link>

            <h1 style={{ marginTop: '20px', fontSize: '36px' }}>{application.name}</h1>
            <p style={{ fontSize: '20px', color: '#666' }}>{application.description}</p>

            {application.mainImageUrl && (
                <img
                    src={application.mainImageUrl}
                    alt={application.name}
                    style={{ width: '100%', borderRadius: '10px', marginTop: '20px', marginBottom: '20px' }}
                />
            )}

            {application.longDescription && (
                <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
                    <p>{application.longDescription}</p>
                </div>
            )}

            {/* Bloques de características */}
            {application.featureBlocks && (
                <div style={{ marginTop: '40px' }}>
                    <h3>Características</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {application.featureBlocks.map((block: any, i: number) => (
                            <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                ✔️ {block.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Productos relacionados */}
            {application.relatedProducts && (
                <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#eef6ff', borderRadius: '8px' }}>
                    <h3>Equipos recomendados para este sector</h3>
                    <ul>
                        {application.relatedProducts.map((product: any) => (
                            <li key={product._id} style={{ margin: '10px 0' }}>
                                <Link href={`/productos/${product.slug}`} style={{ color: '#0066cc', fontWeight: 'bold' }}>
                                    {product.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    )
}
