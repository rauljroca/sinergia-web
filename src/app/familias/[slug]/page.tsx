import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'
import FamilyFilterView from '@/components/FamilyFilterView'

export const revalidate = 60; // Cero caché en desarrollo. Cambiar en producción.

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    // Consulta adaptada para buscar subfamilias por su campo 'parent'
    const data = await client.fetch(`{
        // 1. Traemos solo familias de primer nivel (las que no tienen un padre asignado) para el menú lateral
        "allFamilies": *[_type == "family" && !defined(parent)] { 
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
        // 3. Trae los documentos de tipo 'family' cuyo parent sea esta familia principal
        "subfamilies": *[_type == "family" && parent._ref == *[_type == "family" && slug.current == $slug][0]._id] {
            _id,
            name
        },
        // 4. Filtros técnicos adicionales vinculados a esta familia
        "familyFilters": *[_type == "productFilter" && family._ref == *[_type == "family" && slug.current == $slug][0]._id] {
            _id,
            category,
            value
        },
        // 5. Productos que pertenecen directamente a la familia o a alguna de sus subfamilias hijas
        "products": *[_type == "product" && (mainFamily._ref == *[_type == "family" && slug.current == $slug][0]._id || subfamily._ref in *[_type == "family" && parent._ref == *[_type == "family" && slug.current == $slug][0]._id]._id)]{
            _id,
            title,
            "slug": slug.current,
            "imageUrl": catalogImage.asset->url,
            "filterIds": filters[]->_id,
            "subfamilyId": subfamily._ref,
            styledTitle {
              mainTitle,
              auxTitle
            }
        }
    }`, { slug })

    if (!data.currentFamily) return notFound()

    return (
        <FamilyFilterView
            key={data.currentFamily._id}
            allFamilies={data.allFamilies}
            currentFamily={data.currentFamily}
            subfamilies={data.subfamilies || []}
            familyFilters={data.familyFilters || []}
            products={data.products || []}
        />
    )
}
