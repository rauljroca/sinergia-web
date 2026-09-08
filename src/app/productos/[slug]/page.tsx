import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'

export const revalidate = 60; // ¡Recuerda! Mejor 60 que 0 para rendimiento

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    // 1. Hacemos el Fetch
    const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]{
    title,
    description,
    "mainImageUrl": catalogImage.asset->url,
    "filters": filters[]->{
      _id,
      name,
      "groupName": group->title,
      "groupOrder": group->order
    }
  }`, { slug })

    if (!product) return notFound()

    // 2. Agrupamos los filtros usando JavaScript
    // Esto convierte un array plano en un objeto: { "Aplicaciones": ["Industria", "Data center"], "Tipo": ["Monofásicos"] }
    const groupedFilters = product.filters?.reduce((acc: any, filter: any) => {
        const group = filter.groupName || 'Otros'
        if (!acc[group]) acc[group] = []
        acc[group].push(filter.name)
        return acc
    }, {})

    return (
        <main className="max-w-6xl mx-auto p-8 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: Info principal del producto */}
                <div className="md:col-span-2">
                    <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                    <p className="text-lg text-gray-600 mb-6">{product.description}</p>

                    {product.mainImageUrl && (
                        <img
                            src={product.mainImageUrl}
                            alt={product.title}
                            className="w-full rounded-lg"
                        />
                    )}
                </div>

                {/* COLUMNA DERECHA: Los filtros / Especificaciones */}
                <aside className="bg-gray-50 p-6 rounded-lg border border-gray-200 self-start">
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
                </aside>

            </div>
        </main>
    )
}
