# 🛍️ FlexCommerce — Multi-Store Virtual & Visual Customizer

¡Bienvenido a **FlexCommerce**! Una plataforma de comercio electrónico inteligente, multi-nicho y multi-idioma desarrollada con **Astro** y **React**, enriquecida con animaciones físicas avanzadas y controles de personalización en tiempo real. 

Esta web permite alternar dinámicamente entre 4 nichos comerciales preestablecidos (Tecnología, Panadería, Moda de Lujo y Ecología) adaptando instantáneamente los estilos visuales, catálogo, tipografía, paleta de colores y banners del storefront.

---

## ✨ Características Principales

### 🌍 1. Internacionalización (i18n) y Multidivisa Real
* **Soporte Bilingüe**: Traducción completa de la interfaz en **Español** e **Inglés**.
* **Conversión de Divisas en Tiempo Real**: Selector dinámico de monedas (USD `$`, EUR `€`, CLP `CLP$`, etc.) aplicando tasas de cambio automáticas y formateo localizado (con redondeo automático para monedas sin centavos como el CLP).

### ✍️ 2. Sistema de Reseñas y Calificaciones
* **Valoraciones de Clientes**: Pestaña interactiva en la ficha de detalles del producto con histograma de estrellas e inserción de comentarios en tiempo real.
* **Recálculo Dinámico**: El promedio del producto y su puntuación visual se actualizan inmediatamente en el catálogo al añadir opiniones.
* **Moderación Administrativa**: Panel administrativo dedicado para filtrar, buscar y eliminar comentarios no deseados.

### 📦 3. Gestión y Despacho de Pedidos (Admin console)
* **KPIs de Negocio**: Widgets superiores en la consola con estadísticas de ingresos convertidos a la moneda activa, número de pedidos y despachos pendientes.
* **Drawer de Detalle de Órdenes**: Vista desglosada del cliente, datos de envío, y actualizador de estados en vivo.
* **Facturación Física**: Motor de facturación optimizado mediante estilos de impresión CSS (`window.print()`) que genera hojas de facturas perfectamente formateadas ocultando el panel administrativo.
* **Simulador de Correo**: Envío simulado de notificaciones de despacho vía email a los clientes.

### 🎨 4. Personalizador Visual Avanzado de Landing
* **Galería Hero de Stock**: Miniaturas fotográficas de alta resolución basadas en el nicho activo para cambiar el fondo de la landing con un solo click.
* **URL e Input Personalizado**: Caja de texto para incrustar URLs externas de banners a medida.
* **Cinta de Anuncios Promocional (Ribbon Ticker)**: Barra de anuncios superior activable con textos personalizados y presets de color estilizados (*Amber Glow*, *Cyber Ticker*, *Emerald Mint*, *Sunset Rose*, *Indigo Violet*).
* **Descripción a Medida**: Edición reactiva del texto secundario del Hero con opción de restaurar el valor predeterminado del tema.

### 🎬 5. Animaciones Cinematográficas e Interacciones 3D con GSAP
* **Entrada de Elementos Escalonados (Staggers)**: El banner principal y los badges de confianza aparecen secuencialmente mediante transiciones de desplazamiento y desvanecimiento al montar la web o cambiar de tema.
* **Animaciones por Scroll (ScrollTrigger)**: Activación por coordenadas de la aparición del bloque de beneficios y del newsletter conforme el usuario hace scroll hacia abajo.
* **Efecto Hover 3D Tilt en Productos**: Las tarjetas de productos del catálogo siguen la trayectoria del cursor en tres dimensiones con profundidad espacial (`transformPerspective: 800`), rebotando elásticamente (`elastic.out`) al retirar el puntero.
* **Catalog Grid Transitions**: Reaparición fluida de las tarjetas de catálogo al filtrar categorías o rangos de precios.

---

## 🛠️ Tecnologías Utilizadas

* **Framework Core:** [Astro 5](https://astro.build/) (Renderizado ultra rápido y arquitectura de islas).
* **Lógica UI:** [React](https://react.dev/) (Controladores de estado e interactividad en el cliente).
* **Estilos & Diseño:** [Tailwind CSS](https://tailwindcss.com/) (Clases de utilidad adaptables por tema).
* **Biblioteca de Animaciones:** [GSAP (GreenSock)](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/scrolltrigger/) (Físicas, elasticidad y control de viewport).
* **Iconografía:** [Lucide React](https://lucide.dev/) (Set de iconos vectoriales consistentes).
* **Base de Datos (Opcional):** Firebase / Firestore (Sincronización en vivo de productos, pedidos y analíticas en la nube).

---

## 📂 Estructura del Proyecto

```text
/
├── public/                     # Favicon e imágenes estáticas
├── src/
│   ├── components/
│   │   ├── admin/              # Tabs de administración (Catalog, Orders, Reviews, Customize, Analytics)
│   │   ├── store/              # Módulos del storefront (ProductCard, CartDrawer, DetailsModal, Header)
│   │   ├── AdminPanel.jsx      # Panel de Control principal del comercio
│   │   ├── StoreFront.jsx      # Página de inicio y catálogo visual de cara al cliente
│   │   └── App.jsx             # Selector de modo (StoreFront vs Admin)
│   ├── context/
│   │   └── StoreContext.jsx    # Manejo de estados globales (carrito, filtros, idioma, divisa, temas)
│   ├── layouts/
│   │   └── Layout.astro        # Layout general HTML5 con carga de fuentes premium
│   ├── pages/
│   │   └── index.astro         # Punto de entrada de la aplicación
│   ├── styles/
│   │   └── global.css          # Estilos base y variables de tema personalizadas
│   ├── i18n.js                 # Diccionarios de traducciones ES / EN
│   └── mockData.js             # Datos iniciales (Niveles de stock, catálogo de productos y temas)
├── package.json
└── astro.config.mjs
```

---

## 🚀 Comandos de Desarrollo

Todos los comandos se deben ejecutar desde la raíz del proyecto en una terminal:

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala todas las dependencias del proyecto. |
| `astro dev --background` | Inicia el servidor de desarrollo local en segundo plano en `http://localhost:4321`. |
| `astro dev status` | Verifica el estado actual del servidor de desarrollo en segundo plano. |
| `astro dev logs` | Muestra la cola de logs del servidor en segundo plano. |
| `astro dev stop` | Detiene el servidor de desarrollo en segundo plano. |
| `npm run build` | Compila el sitio estático optimizado para producción en la carpeta `./dist/`. |
| `npm run preview` | Previsualiza localmente el build de producción antes de desplegar. |

---

## 🎨 Ajuste y Personalización de Presets

Los valores por defecto de los 4 temas comerciales se encuentran definidos en el diccionario `PRESETS` dentro del archivo `src/mockData.js`. Aquí puedes modificar:
* Slogans iniciales y nombres de marca.
* Paletas de colores Tailwind y gradientes en `colors.primary`, `colors.button` y `colors.accent`.
* Categorías específicas ligadas a cada nicho.
