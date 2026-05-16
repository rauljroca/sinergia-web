import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'

// 1. Añadimos "Promise" al tipado de los params
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {

    // 2. ¡EL ARREGLO! Ponemos el "await" para esperar a que Next.js lea la URL
    const resolvedParams = await params
    const { slug } = resolvedParams

    // Ahora la consulta ya tiene su $slug correctamente
    const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]{
    title,
    description,
    serie,
    "imageUrl": catalogImage.asset->url,
    descriptionBlocks
  }`, { slug })

    if (!product) return notFound()

    return (
        <main style={{ padding: '50px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <a href="/" style={{ color: 'blue', textDecoration: 'none', fontWeight: 'bold' }}>← Volver a la Home</a>

            <h1 style={{ marginTop: '20px', fontSize: '36px' }}>{product.title}</h1>
            {product.serie && <p style={{ color: 'gray', fontSize: '18px' }}>Serie: {product.serie}</p>}

            {product.imageUrl && (
                <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', marginTop: '20px', border: '1px solid #eaeaea' }}
                />
            )}

            <div style={{ marginTop: '40px' }}>
                <h2>Descripción Técnica</h2>
                {/* Aquí pintamos los bloques que creamos antes */}
                {product.descriptionBlocks?.map((block: any, i: number) => (
                    <div key={i} style={{ borderBottom: '1px solid #eee', padding: '20px 0' }}>
                        <strong style={{ fontSize: '20px', color: '#333' }}>{block.title}</strong>
                        <p style={{ lineHeight: '1.6', color: '#555' }}>{block.text}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}
