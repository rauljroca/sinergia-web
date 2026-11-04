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
                    <nav aria-label="Breadcrumb" className="md:col-span-12 text-blue-100 text-base">
                        <ol className="flex flex-wrap items-center gap-2">
                            {/*
                            <li>
                                <Link href="/" className="hover:text-white hover:underline transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li className="text-blue-300">&gt;</li>
                            */}
                            <li>
                                <Link href="/productos/" className="hover:text-white hover:underline transition-colors">
                                    Productos
                                </Link>
                            </li>
                            {/* FAMILIA PRINCIPAL */}
                            {product.mainFamily && (
                                <>
                                    <li className="text-blue-300">&gt;</li>
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
                                    <li className="text-blue-300">&gt;</li>
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
                            <li className="text-blue-300">&gt;</li>
                            <li className="font-semibold text-white truncate max-w-xs md:max-w-none" aria-current="page">
                                {product.title}
                            </li>
                        </ol>
                    </nav>

                    <div className="md:col-span-5">
                        {product.mainImageUrl && (
                            <img
                                src={product.mainImageUrl}
                                alt={product.title}
                                className="w-full rounded-lg"
                            />
                        )}
                    </div>

                    <span className="md:col-span-1"></span>

                    <div className="md:col-span-6">
                        <ol className="flex flex-wrap items-center gap-2
                        mb-4
                        font-semibold text-white text-3xl font-heavy
                        ">
                            {product.subfamily && (
                                <>
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
                            {product.serie && (
                                <>
                                    <li className="font-base">/</li>
                                    <li>
                                        <span className="">
                                            Serie: {product.serie}
                                        </span>
                                    </li>
                                </>
                            )}
                        </ol>

                        {product.styledTitle?.mainTitle || product.styledTitle?.auxTitle ? (
                            <h1 className="text-2xl font-light text-gray-200 mb-6">
                                {product.styledTitle.mainTitle && (<span>{product.styledTitle.mainTitle} </span>)}
                                {product.styledTitle.auxTitle && (<span className="text-7xl text-white">{product.styledTitle.auxTitle}</span>)}
                            </h1>
                        ) : (
                            <h1 className="text-7xl font-light text-white mb-6">{product.title}</h1>
                        )}

                        <p className="text-lg leading-[2] text-white mb-6">{product.description}</p>

                        <p className="flex gap-4 font-bold text-sm text-black">
                            {product.serie && (
                                <span className="
                                      p-3 bg-blue-900 rounded-lg
                                      border-blue-900
                                      text-white"
                                >
                                    Serie: {product.serie}
                                </span>
                            )}
                            {product.downloads && product.downloads.length > 0 && (
                                <a
                                    href="#docs"
                                    rel="noopener noreferrer"
                                    className="
                                    p-3 bg-gray-50 rounded-lg
                                    hover:bg-blue-900 hover:text-white transition-colors"
                                >
                                    Descargas
                                </a>
                            )}
                            <a
                                href="#contact"
                                rel="noopener noreferrer"
                                className="
                                    p-3 bg-gray-50 rounded-lg
                                    hover:bg-blue-900 hover:text-white transition-colors"
                            >
                                Pide presupuesto
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* NAVEGACIÓN INTERNA DE PRODUCTO */}
            <nav className="p-1 bg-blue-100">
                <div className="
                    max-w-6xl mx-auto
                    font-bold text-lg
                    p-8
                    flex justify-items-center-safe
                    grid-cols-1 md:grid-cols-1 gap-8

                    "
                >
                    {product.descriptionBlocks && product.descriptionBlocks.length > 0 && (
                        <a href="#features" className="text-blue-900">Características</a>
                    )}
                    {product.relatedProducts && product.relatedProducts.length > 0 && (
                        <a href="#related" className="text-blue-900">Similares</a>
                    )}
                    {product.downloads && product.downloads.length > 0 && (
                        <a href="#docs" className="text-blue-900">Descargas</a>
                    )}
                    <a href="#contact" className="text-blue-900">Pedir información</a>
                </div>
            </nav>

            {/* CARACTERÍSTICAS DESTACADAS */}
            {product.descriptionBlocks && product.descriptionBlocks.length > 0 && (
                <section className="mt-12 max-w-6xl
                    mx-auto grid
                    grid-cols-1 md:grid-cols-1 gap-8 p-8" id="features">
                    <h3 className="text-2xl font-extrabold mb-4 uppercase">Características destacadas</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                        {product.descriptionBlocks.map((block: any, index: number) => (
                            <div key={index} className={"mb-8"}>
                                {block.iconUrl && (
                                    <img
                                        src={block.iconUrl}
                                        alt={block.title || 'Icono'}
                                        className="w-24 h-24 mb-4 object-contain shrink-0 mt-1"
                                    />
                                )}
                                <div>
                                    {block.title && <h4 className="font-extrabold text-lg text-blue-900">{block.title}</h4>}
                                    {block.text && <p className="text-lg text-gray-600 mt-1">{block.text}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 p-8" id="features">
                <h3 className="text-2xl font-extrabold uppercase">Especificaciones</h3>

                {/* 3. Pintamos los grupos ya ordenados */}
                {groupedFilters && Object.entries(groupedFilters).map(([groupName, options]: any) => (
                    <div key={groupName} className="mb-4">
                        {/* Título del grupo (Ej: "Aplicaciones" o "Tipo") */}
                        <h4 className="font-semibold text-gray-900 uppercase text-sm tracking-wider mb-4">
                            {groupName}
                        </h4>

                        {/* Opciones dentro de ese grupo */}
                        <div className="max-w-6xl mx-auto
                            font-bold text-lg
                            flex justify-items-center-safe gap-12">
                            {options.map((optionName: string, i: number) => (

                                <p key={i} className="flex gap-4 font-bold text-sm text-black

                                      p-3 bg-blue-900 rounded-lg
                                      border-blue-900
                                      text-white"
                                        >
                                    {optionName}
                                </p>

                            ))}
                        </div>
                    </div>
                ))}

                {/* !groupedFilters && (
                    <p className="text-sm text-gray-500">No hay especificaciones marcadas.</p>
                ) */}
            </section>

            {/* LISTADO DE DESCARGAS */}
            {product.downloads && product.downloads.length > 0 && (
                <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 p-8" id="features">
                    <h3 className="text-2xl font-extrabold uppercase">Documentación y Descargas</h3>
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

            {/* PRODUCTOS RELACIONADOS */}
            {product.relatedProducts && product.relatedProducts.length > 0 && (
                <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 p-8" id="docs">
                    <h3 className="text-2xl font-extrabold uppercase">Productos Relacionados</h3>
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
