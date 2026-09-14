import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'
import FamilyFilterView from '@/components/FamilyFilterView'

export const revalidate = 60;

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    const data = await client.fetch(`{
        "allFamilies": *[_type == "family" && !defined(parent)] { 
            _id, 
            name, 
            "slug": slug.current 
        },
        "currentFamily": *[_type == "family" && slug.current == $slug][0] { 
            _id, 
            name, 
            description 
        },
        "subfamilies": *[_type == "family" && parent._ref == *[_type == "family" && slug.current == $slug][0]._id] {
            _id,
            name
        },
        // Adaptado al esquema: Filtros asociados a esta familia ordenados por su grupo
        "familyFilters": *[_type == "productFilter" && *[_type == "family" && slug.current == $slug][0]._id in families[]._ref] | order(group->order asc) {
            _id,
            name,
            "groupTitle": coalesce(group->title, "Otros")
        },
        "products": *[_type == "product" && (mainFamily._ref == *[_type == "family" && slug.current == $slug][0]._id || subfamily._ref in *[_type == "family" && parent._ref == *[_type == "family" && slug.current == $slug][0]._id]._id)]{
            _id,
            title,
            "slug": slug.current,
            "imageUrl": catalogImage.asset->url,
            "filterIds": filters[]._ref,
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
