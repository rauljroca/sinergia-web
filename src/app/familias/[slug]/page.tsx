import { client } from '@/sanity/client'
import { notFound } from 'next/navigation'
import FamilyFilterView from '@/components/FamilyFilterView'

export const revalidate = 60;

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    const data = await client.fetch(`{
        // 1. Familias principales (primer nivel)
        "allFamilies": *[_type == "family" && !defined(parent)] { 
            _id, 
            name, 
            "slug": slug.current 
        },

        // 2. Familia activa (con referencia a su Padre si lo tiene)
        "currentFamily": *[_type == "family" && slug.current == $slug][0] { 
            _id, 
            name, 
            description,
            parent->{
                _id,
                name,
                "slug": slug.current
            }
        },

        // 3. Subfamilias: Si es familia Principal trae sus hijas; si es Subfamilia trae sus hermanas
        "subfamilies": *[_type == "family" && (
            parent._ref == *[_type == "family" && slug.current == $slug][0]._id || 
            (defined(*[_type == "family" && slug.current == $slug][0].parent._ref) && parent._ref == *[_type == "family" && slug.current == $slug][0].parent._ref)
        )] {
            _id,
            name,
            "slug": slug.current
        },

        // 4. Filtros técnicos (asociados a esta familia o a su familia Padre)
        "familyFilters": *[_type == "productFilter" && (
            *[_type == "family" && slug.current == $slug][0]._id in families[]._ref ||
            *[_type == "family" && slug.current == $slug][0].parent._ref in families[]._ref
        )] | order(group->order asc) {
            _id,
            name,
            "groupTitle": coalesce(group->title, "Otros")
        },

        // 5. Productos: Coincide si es su mainFamily, su subfamily, o una de sus subfamilias hijas
        "products": *[_type == "product" && (
            mainFamily._ref == *[_type == "family" && slug.current == $slug][0]._id ||
            subfamily._ref == *[_type == "family" && slug.current == $slug][0]._id ||
            subfamily._ref in *[_type == "family" && parent._ref == *[_type == "family" && slug.current == $slug][0]._id]._id
        )]{
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
