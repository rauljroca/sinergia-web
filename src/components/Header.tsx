import Link from 'next/link'
import styles from './Header.module.css'
import Image from 'next/image'

export default function Header() {
    return (
        <header className={styles.header}>
            {/* 1. Redes Sociales (Arriba a la derecha) */}
            <div className={styles.topBar}>
                <a href="#" className={styles.socialIcon}>🌐</a>
                <a href="#" className={styles.socialIcon}>📺</a>
                <a href="#" className={styles.socialIcon}></a> {/* Puedes usar iconos de librería o texto por ahora */}
            </div>

            {/* 2. Barra Principal (Tres bloques en línea) */}
            <div className={styles.mainBar}>

                {/* Bloque Izquierdo: Menú */}
                <nav className={styles.nav}>
                    <Link href="/nosotros" className={styles.navLink}>Nosotros</Link>
                    <Link href="/" className={styles.navLink}>Productos</Link>
                    <Link href="/servicios" className={styles.navLink}>Servicios</Link>
                    <Link href="/aplicaciones" className={styles.navLink}>Aplicaciones</Link>
                    <Link href="/noticias" className={styles.navLink}>Noticias</Link>
                    <Link href="/contacto" className={styles.navLink}>Contacto 🔒</Link>
                </nav>

                {/* Bloque Central: Logo principal */}
                <div className={styles.logoCenter}>
                    <Link href="/">
                        <img
                            src="/logos/sinergia.svg"
                            alt="Sinergia Soluciones"
                            className={styles.logoMain}
                        />
                    </Link>
                </div>

                {/* Bloque Derecho: Marcas Partners */}
                <div className={styles.partnersBar}>
                    <Image
                        src="/logos/mtu.png"
                        alt="MTU"
                        className={styles.partnerLogo}
                        width="90"
                        height="19"
                        style={{ objectFit: 'cover'}}
                    />
                    <Image
                        src="/logos/alpha.png"
                        alt="Alpha"
                        className={styles.partnerLogo}
                        width="52"
                        height="26"
                        style={{ objectFit: 'cover'}}
                    />
                    <Image
                        src="/logos/borri.png"
                        alt="Borri"
                        className={styles.partnerLogo}
                        width="90"
                        height="21"
                        style={{ objectFit: 'cover'}}
                    />
                    <Image
                        src="/logos/legrand.png"
                        alt="Legrand"
                        className={styles.partnerLogo}
                        width="51"
                        height="26"
                        style={{ objectFit: 'cover'}}
                    />
                </div>
            </div>
        </header>
    )
}
