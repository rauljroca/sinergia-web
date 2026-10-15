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
                <div className={styles.topBar}>
                    <a
                        href="https://www.linkedin.com/company/sinergiasl/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialIcon}
                        aria-label="LinkedIn"
                    >
                        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>

                    <a
                        href="https://www.youtube.com/@SinergiaSolucionesS.L"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialIcon}
                        aria-label="YouTube"
                    >
                        <svg className="w-[20px] h-[20px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                    </a>
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
