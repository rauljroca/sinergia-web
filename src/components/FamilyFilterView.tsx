'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FamilyFilterView({ allFamilies, currentFamily, subfamilies, familyFilters, products }: any) {
    // 1. Estado para las subfamilias: ¡Arrancan todas marcadas por defecto!
    const [selectedSubfamilies, setSelectedSubfamilies] = useState<string[]>(() =>
        subfamilies.map((sub: any) => sub._id)
    )

    // 2. Estado para los filtros técnicos adicionales (Voltaje, Capacidad, etc.)
    const [selectedFilters, setSelectedFilters] = useState<string[]>([])

    // Agrupamos los filtros técnicos por su categoría
    const filtersByCategory = familyFilters.reduce((acc: any, filter: any) => {
        if (!acc[filter.category]) acc[filter.category] = []
        acc[filter.category].push(filter)
        return acc;
    }, {})

    // Manejador para los checkboxes de las subfamilias
    const handleSubfamilyChange = (subfamilyId: string) => {
        setSelectedSubfamilies(prev =>
            prev.includes(subfamilyId) ? prev.filter(id => id !== subfamilyId) : [...prev, subfamilyId]
        )
    }

    // Manejador para los checkboxes de filtros técnicos
    const handleFilterChange = (filterId: string) => {
        setSelectedFilters(prev =>
            prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]
        )
    }

    // DOBLE LÓGICA DE FILTRADO (Subfamilias + Filtros Técnicos)
    const filteredProducts = products.filter((product: any) => {
        // FILTRO A: ¿El producto pertenece a una subfamilia que está activa?
        // (Si el producto no tiene subfamilia asignada, lo dejamos pasar siempre)
        const matchesSubfamily = !product.subfamilyId || selectedSubfamilies.includes(product.subfamilyId)

        // FILTRO B: ¿Cumple con los filtros técnicos seleccionados?
        const matchesTechnical = selectedFilters.length === 0 ||
            selectedFilters.every(id => product.filterIds?.includes(id))

        return matchesSubfamily && matchesTechnical
    })

    return (
        <main style={{ display: 'flex', gap: '40px', padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>

            {/* COLUMNA IZQUIERDA: Menú de Familias Principales y Filtros */}
            <aside style={{ width: '280px', flexShrink: 0, borderRight: '1px solid #eaeaea', paddingRight: '20px' }}>

                <h3>Familias</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
                    {allFamilies.map((fam: any) => {
                        const isActive = fam.slug === currentFamily.slug
                        return (
                            <li key={fam._id} style={{ margin: '8px 0' }}>
                                <Link href={`/familias/${fam.slug}`} style={{
                                    display: 'block',
                                    padding: '10px',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    backgroundColor: isActive ? '#0066cc' : 'transparent',
                                    color: isActive ? '#fff' : '#333',
                                    fontWeight: isActive ? 'bold' : 'normal'
                                }}>
                                    {fam.name} {isActive ? '▼' : '►'}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                {/* BLOQUE DE FILTROS */}
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                    <h3>Filtrar por:</h3>

                    {/* SECCIÓN A: Checkboxes de las Subfamilias de la familia activa */}
                    {subfamilies.length > 0 && (
                        <div style={{ marginBottom: '25px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                Subfamilias
                            </h4>
                            {subfamilies.map((sub: any) => (
                                <label key={sub._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0', cursor: 'pointer', fontSize: '14px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSubfamilies.includes(sub._id)}
                                        onChange={() => handleSubfamilyChange(sub._id)}
                                    />
                                    {sub.name}
                                </label>
                            ))}
                        </div>
                    )}

                    {/* SECCIÓN B: Checkboxes de los filtros técnicos (Voltajes, tipos...) */}
                    {Object.keys(filtersByCategory).map((categoryName) => (
                        <div key={categoryName} style={{ marginBottom: '20px' }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>
                                {categoryName}
                            </h4>
                            {filtersByCategory[categoryName].map((filter: any) => (
                                <label key={filter._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '6px 0', cursor: 'pointer', fontSize: '14px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.includes(filter._id)}
                                        onChange={() => handleFilterChange(filter._id)}
                                    />
                                    {filter.value}
                                </label>
                            ))}
                        </div>
                    ))}
                </div>
            </aside>

            {/* COLUMNA DERECHA: Grid Dinámico de Productos */}
            <section style={{ flex: 1 }}>
                <h1 style={{ fontSize: '32px', margin: '0 0 10px 0' }}>{currentFamily.name}</h1>
                <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.5' }}>{currentFamily.description}</p>

                <h2>Productos Disponibles ({filteredProducts.length})</h2>

                {filteredProducts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        {filteredProducts.map((product: any) => (
                            <div key={product._id} style={{ border: '1px solid #eaeaea', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                <Link href={`/productos/${product.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '140px', objectFit: 'contain', marginBottom: '10px' }} />
                                    ) : (
                                        <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', backgroundColor: '#f5f5f5', borderRadius: '6px', marginBottom: '10px' }}>📦</div>
                                    )}
                                    <h4 style={{ margin: '5px 0 0 0', color: '#0066cc' }}>{product.title}</h4>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#999', marginTop: '20px', fontStyle: 'italic' }}>
                        Ningún producto coincide con la selección actual.
                    </p>
                )}
            </section>
        </main>
    )
}
