import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60; // El 0 significa "Cero caché, trae datos frescos siempre" !!! tengo que borrarlo en pro

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    // Pedimos la aplicación y expandimos los productos relacionados
    const application = await client.fetch(`*[_type == "application" && slug.current == $slug][0]{
    name,
    styledTitle {
      mainTitle,
      auxTitle
    },
    description,
    longDescription,
    "mainImageUrl": mainImage.asset->url,
    featureBlocks,
    bloque2 {
      bloque2Title,
      bloque2LongDescription,
      "bloque2mainImageUrl": bloque2.bloque2mainImage.asset->url,
      bloque2mainImage,
      bloque2featureBlocks
    },
    bloque3 {
      bloque3Title,
      bloque3LongDescription,
      "bloque3mainImageUrl": bloque3.bloque3mainImage.asset->url,
      bloque3mainImage,
      bloque3featureBlocks
    },
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
            <p style={{ fontSize: '20px', color: '#666' }}>{application.subTitle}</p>

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

            {(application.bloque2?.bloque2Title || application.bloque2?.bloque2featureBlocks) && (
                <>
                    {application.bloque2?.bloque2Title && (
                        <h2 style={{ marginTop: '20px', fontSize: '36px' }}>{application.bloque2.bloque2Title}</h2>
                    )}
                    {application.bloque2?.bloque2LongDescription && (
                        <p style={{ fontSize: '20px', color: '#666' }}>{application.bloque2.bloque2LongDescription}</p>
                    )}
                    {application.bloque2?.bloque2mainImage && (
                        <img
                            src={application.bloque2?.bloque2mainImageUrl}
                            alt={application.bloque2?.bloque2Title}
                            style={{ width: '100%', borderRadius: '10px', marginTop: '20px', marginBottom: '20px' }}
                        />
                    )}
                    {application.bloque2?.bloque2featureBlocks && (
                        <div style={{ marginTop: '40px' }}>
                            <h3>Características</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {application.bloque2?.bloque2featureBlocks.map((block: any, i: number) => (
                                    <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                        ✔️ {block.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}

            {(application.bloque3?.bloque3Title || application.bloque3?.bloque3featureBlocks) && (
                <>
                    {application.bloque3?.bloque3Title && (
                        <h2 style={{ marginTop: '20px', fontSize: '36px' }}>{application.bloque3.bloque3Title}</h2>
                    )}
                    {application.bloque3?.bloque3LongDescription && (
                        <p style={{ fontSize: '20px', color: '#666' }}>{application.bloque3.bloque3LongDescription}</p>
                    )}
                    {application.bloque3?.bloque3mainImage && (
                        <img
                            src={application.bloque3?.bloque3mainImageUrl}
                            alt={application.bloque3?.bloque3Title}
                            style={{ width: '100%', borderRadius: '10px', marginTop: '20px', marginBottom: '20px' }}
                        />
                    )}
                    {application.bloque3?.bloque3featureBlocks && (
                        <div style={{ marginTop: '40px' }}>
                            <h3>Características</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {application.bloque3?.bloque3featureBlocks.map((block: any, i: number) => (
                                    <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                        ✔️ {block.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}

            {/* Productos relacionados */}
            {application.relatedProducts && (
                <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#eef6ff', borderRadius: '8px' }}>
                    <h3>Equipos recomendados para este sector</h3>
                    <ul>
                        {application.relatedProducts.map((product: any) => (
                            <li key={product._id} style={{ margin: '10px 0' }}>
                                <Link href={`/productos/${product.slug}`} style={{ color: '#0066cc', fontWeight: 'bold' }}>
                                    {product.styledTitle?.mainTitle || product.styledTitle?.auxTitle ? (
                                        <>
                                        {product.styledTitle.mainTitle && (<span>{product.styledTitle.mainTitle} </span>)}
                                        {product.styledTitle.auxTitle && (<span className="text-gray-400 font-normal">{product.styledTitle.auxTitle}</span>)}
                                        </>
                                    ) : (
                                        <>
                                        {product.title}
                                        </>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    )
}
