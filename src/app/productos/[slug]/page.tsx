import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'
import Link from "next/link";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]{
        title,
        styledTitle {
          mainTitle,
          auxTitle
        },
        serie,
        description,
        "mainImageUrl": catalogImage.asset->url,
        mainFamily->{
          name,
          "slug": slug.current
        },
        subfamily->{
          name,
          "slug": slug.current
        },
        descriptionBlocks[] {
            title,
            text,
            "iconUrl": icon.asset->url
        },
        "filters": filters[]->{
          _id,
          name,
          "groupName": group->title,
          "groupOrder": group->order
        },
        downloads[] {
            title,
            "fileUrl": file.asset->url
        },
        relatedProducts[]-> {
            _id,
            title,
            "slug": slug.current,
            "imageUrl": catalogImage.asset->url,
            styledTitle {
                mainTitle,
                auxTitle
            }
        },
    }`, { slug })

    if (!product) return notFound()

    const groupedFilters = product.filters?.reduce((acc: any, filter: any) => {
        const group = filter.groupName || 'Otros'
        if (!acc[group]) acc[group] = []
        acc[group].push(filter.name)
        return acc
    }, {})

    return (
        <main>
            {/* CABECERA AZUL CON MIGAS DE PAN */}
            <div className="font-sans p-8
                bg-linear-to-t from-sky-500 to-blue-900">
                {/* oklch(74.6% 0.16 232.661) */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 p-8">

                    {/* BREADCRUMBS */}
                    <nav aria-label="Breadcrumb" className="md:col-span-12 text-blue-100 text-sm">
                        <ol className="flex flex-wrap items-center gap-2">
                            <li>
                                <Link href="/" className="hover:text-white hover:underline transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li className="text-blue-300">/</li>
                            <li>
                                <Link href="/" className="hover:text-white hover:underline transition-colors">
                                    Productos
                                </Link>
                            </li>
                            {/* FAMILIA PRINCIPAL */}
                            {product.mainFamily && (
                                <>
                                    <li className="text-blue-300">/</li>
                                    <li>
                                        <Link
                                            href={`/familias/${product.mainFamily.slug}`}
                                            className="hover:text-white hover:underline transition-colors"
                                        >
                                            {product.mainFamily.name}
                                        </Link>
                                    </li>
                                </>
                            )}
                            {/* SUBFAMILIA (SI EXISTE) */}
                            {product.subfamily && (
                                <>
                                    <li className="text-blue-300">/</li>
                                    <li>
                                        <Link
                                            href={`/familias/${product.subfamily.slug}`}
                                            className="hover:text-white hover:underline transition-colors"
                                        >
                                            {product.subfamily.name}
                                        </Link>
                                    </li>
                                </>
                            )}
                            {/* PRODUCTO ACTUAL */}
                            <li className="text-blue-300">/</li>
                            <li className="font-semibold text-white truncate max-w-xs md:max-w-none" aria-current="page">
                                {product.title}
                            </li>
                        </ol>
                    </nav>

                    <div className="md:col-span-4">
                        {product.mainImageUrl && (
                            <img
                                src={product.mainImageUrl}
                                alt={product.title}
                                className="w-full rounded-lg"
                            />
                        )}
                    </div>

                    <span className="md:col-span-2"></span>

                    <div className="md:col-span-6">
                        {product.styledTitle?.mainTitle || product.styledTitle?.auxTitle ? (
                            <h1 className="text-4xl text-white font-heavy mb-4">
                                {product.styledTitle.mainTitle && (<span>{product.styledTitle.mainTitle} </span>)}
                                {product.styledTitle.auxTitle && (<span className="text-gray-200 font-normal">{product.styledTitle.auxTitle}</span>)}
                            </h1>
                        ) : (
                            <h1 className="text-4xl text-white font-heavy mb-4">{product.title}</h1>
                        )}
                        <p className="text-lg text-white mb-6">{product.description}</p>
                        {product.serie && (
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded mb-2">
                                Serie: {product.serie}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* CUERPO Y ESPECIFICACIONES */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                {/* COLUMNA IZQUIERDA: Info principal del producto */}
                <div className="md:col-span-2">

                </div>

                {/* COLUMNA DERECHA: Los filtros / Especificaciones */}
                <aside className="self-start">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 self-start">
                        <h3 className="text-xl font-bold mb-6 border-b pb-2">Especificaciones</h3>

                        {/* 3. Pintamos los grupos ya ordenados */}
                        {groupedFilters && Object.entries(groupedFilters).map(([groupName, options]: any) => (
                            <div key={groupName} className="mb-5">
                                {/* Título del grupo (Ej: "Aplicaciones" o "Tipo") */}
                                <h4 className="font-semibold text-gray-800 uppercase text-sm tracking-wider mb-2">
                                    {groupName}
                                </h4>

                                {/* Opciones dentro de ese grupo */}
                                <ul className="space-y-1">
                                    {options.map((optionName: string, i: number) => (
                                        <li key={i} className="text-gray-600 flex items-center gap-2">
                                            <span className="text-blue-500">✓</span> {optionName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {!groupedFilters && (
                            <p className="text-sm text-gray-500">No hay especificaciones marcadas.</p>
                        )}
                    </div>

                    {/* LISTADO DE DESCARGAS */}
                    {product.downloads && product.downloads.length > 0 && (
                        <section className="mt-8 border-t pt-6">
                            <h3 className="text-2xl font-bold mb-4">Documentación y Descargas</h3>
                            <ul className="space-y-3">
                                {product.downloads.map((item: any, idx: number) => (
                                    <li key={idx}>
                                        {item.fileUrl && (
                                            <a
                                                href={item.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 p-3 bg-gray-50 border rounded-lg text-blue-600 hover:bg-blue-50 transition-colors font-medium w-full"
                                            >
                                                📄 {item.title || 'Descargar documento'}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>
            </div>

            {/* CARACTERÍSTICAS DESTACADAS */}
            {product.descriptionBlocks && product.descriptionBlocks.length > 0 && (
                <section className="mt-8 border-t pt-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 p-8">
                    <h3 className="text-2xl font-bold mb-4">Características destacadas</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.descriptionBlocks.map((block: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg bg-gray-50 flex items-start gap-4">
                                {block.iconUrl && (
                                    <img
                                        src={block.iconUrl}
                                        alt={block.title || 'Icono'}
                                        className="w-8 h-8 object-contain shrink-0 mt-1"
                                    />
                                )}
                                <div>
                                    {block.title && <h4 className="font-semibold text-gray-900">{block.title}</h4>}
                                    {block.text && <p className="text-sm text-gray-600 mt-1">{block.text}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* PRODUCTOS RELACIONADOS */}
            {product.relatedProducts && product.relatedProducts.length > 0 && (
                <section className="mt-8 border-t pt-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 p-8">
                    <h3 className="text-2xl font-bold mb-6">Productos Relacionados</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {product.relatedProducts.map((rel: any) => (
                            <div key={rel._id} className="border p-4 rounded-lg text-center hover:shadow-md transition-shadow bg-white">
                                <Link href={`/productos/${rel.slug}`} className="no-underline">
                                    {rel.imageUrl ? (
                                        <img src={rel.imageUrl} alt={rel.title} className="w-full h-36 object-contain mb-3" />
                                    ) : (
                                        <div className="h-36 bg-gray-100 flex items-center justify-center text-4xl rounded mb-3">📦</div>
                                    )}
                                    <h4 className="font-semibold text-blue-600 text-sm">
                                        {rel.styledTitle?.mainTitle || rel.styledTitle?.auxTitle ? (
                                            <>
                                                {rel.styledTitle.mainTitle && <span>{rel.styledTitle.mainTitle} </span>}
                                                {rel.styledTitle.auxTitle && <span className="font-normal text-gray-500">{rel.styledTitle.auxTitle}</span>}
                                            </>
                                        ) : (
                                            rel.title
                                        )}
                                    </h4>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    )
}
