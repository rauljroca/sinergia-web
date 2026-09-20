'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Header.module.css'

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className={styles.header}>
            <div className={styles.container}>

                {/* 1. Barra Superior: Redes Sociales (Alineadas a la derecha) */}
                <div className={styles.topBar}>
                    {/*
                    <a href="#" className={styles.socialIcon} aria-label="Sitio Web">🌐</a>
                    <a href="#" className={styles.socialIcon} aria-label="YouTube">📺</a>
                    */}
                    <a href="https://x.com/Sinergia_SL/" target="_blank" className={styles.socialIcon} aria-label="Twitter" title="Twitter"></a>
                    <a href="https://www.linkedin.com/company/sinergiasl/" target="_blank" className={styles.socialIcon} aria-label="LinkedIn" title="LinkedIn"></a>
                </div>

                {/* 2. Barra Principal: 3 Columnas (Nav - Logo - Partners) */}
                <div className={styles.mainBar}>

                    {/* Botón hamburguesa (Solo visible en pantallas pequeñas) */}
                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    {/* Columna 1: Menú de Navegación (Izquierda) */}
                    <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
                        <Link href="/nosotros" className={styles.navLink}>Nosotros</Link>
                        <Link href="/" className={styles.navLink}>Productos</Link>
                        <Link href="/servicios" className={styles.navLink}>Servicios</Link>
                        <Link href="/aplicaciones" className={styles.navLink}>Aplicaciones</Link>
                        <Link href="/noticias" className={styles.navLink}>Noticias</Link>
                        <Link href="/contacto" className={styles.navLink}>
                            Contacto <span className="ml-1">🔒</span>
                        </Link>
                    </nav>

                    {/* Columna 2: Logo Principal (Centro) */}
                    <div className={styles.logoCenter}>
                        <Link href="/">
                            <img
                                src="/logos/sinergia.svg"
                                alt="Sinergia Soluciones"
                                className={styles.logoMain}
                            />
                        </Link>
                    </div>

                    {/* Columna 3: Logos de Partners (Derecha) */}
                    <div className={styles.partnersBar}>
                        <Image src="/logos/mtu.png" alt="MTU" className={styles.partnerLogo} width={90} height={22} style={{ objectFit: 'contain' }} />
                        <Image src="/logos/alpha.png" alt="Alpha" className={styles.partnerLogo} width={55} height={26} style={{ objectFit: 'contain' }} />
                        <Image src="/logos/borri.png" alt="Borri" className={styles.partnerLogo} width={90} height={22} style={{ objectFit: 'contain' }} />
                        <Image src="/logos/legrand.png" alt="Legrand" className={styles.partnerLogo} width={60} height={26} style={{ objectFit: 'contain' }} />
                    </div>

                </div>
            </div>
        </header>
    )
}
