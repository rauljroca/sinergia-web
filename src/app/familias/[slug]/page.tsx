import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'
import FamilyFilterView from '@/components/FamilyFilterView'

export const revalidate = 0;

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    // Consulta adaptada para separar familias principales, subfamilias y sus productos
    const data = await client.fetch(`{
        // 1. Solo las familias principales para la columna izquierda
        "allFamilies": *[_type == "family"] { 
            _id, 
            name, 
            "slug": slug.current 
        },
        // 2. Datos de la familia principal activa
        "currentFamily": *[_type == "family" && slug.current == $slug][0] { 
            _id, 
            name, 
            description 
        },
        // 3. Trae las subfamilias asociadas a esta familia principal
        "subfamilies": *[_type == "subfamily" && family._ref == *[_type == "family" && slug.current == $slug][0]._id] {
            _id,
            name
        },
        // 4. Filtros adicionales de Sanity (Voltaje, Capacidad...)
        "familyFilters": *[_type == "productFilter" && family._ref == *[_type == "family" && slug.current == $slug][0]._id] {
            _id,
            category,
            value
        },
        // 5. Productos que pertenezcan a la familia o a alguna de sus subfamilias
        "products": *[_type == "product" && (mainFamily._ref == *[_type == "family" && slug.current == $slug][0]._id || subfamily._ref in *[_type == "subfamily" && family._ref == *[_type == "family" && slug.current == $slug][0]._id]._id)]{
            _id,
            title,
            "slug": slug.current,
            "imageUrl": catalogImage.asset->url,
            "filterIds": filters[]->_id,
            "subfamilyId": subfamily._ref // Guardamos el ID de su subfamilia para filtrarlo en el cliente
        }
    }`, { slug })

    if (!data.currentFamily) return notFound()

    return (
        <FamilyFilterView
            // EL TRUCO: Al cambiar de ID de familia, React destruye el componente viejo
            // y monta el nuevo reiniciando todos los checkboxes a "activados"
            key={data.currentFamily._id}
            allFamilies={data.allFamilies}
            currentFamily={data.currentFamily}
            subfamilies={data.subfamilies || []}
            familyFilters={data.familyFilters || []}
            products={data.products || []}
        />
    )
}
