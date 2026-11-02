# WorkDesk 🛠️ - Gestor de Proyectos y Cotizador Web

**WorkDesk** es una aplicación web SPA (*Single Page Application*) ligera, moderna y funcional diseñada para profesionales independientes y pequeñas empresas. Permite gestionar clientes, crear cotizaciones dinámicas con cálculo de impuestos y controlar órdenes de trabajo con persistencia de datos local.

---

## 📸 Demostración y Vista Previa

> 🔗 **Demo en vivo:** [Ver aplicación en GitHub Pages](https://TU_USUARIO.github.io/NOMBRE_DEL_REPOSITORIO/)  
*(Reemplaza la URL anterior con la tuya una vez que actives GitHub Pages en tu repositorio)*

---

## ✨ Características Principales

- 📊 **Panel de Resumen (Dashboard):** Métricas clave en tiempo real sobre clientes registrados, órdenes activas, completadas e ingresos totales acumulados.
- 👥 **Gestión de Clientes:** Alta y control de clientes con validación para evitar eliminar registros con órdenes de trabajo activas o asociadas.
- 🧮 **Cotizador Dinámico:**
  - Agregar/eliminar ítems o conceptos de forma ilimitada.
  - Aplicación opcional de porcentaje de descuento.
  - Cálculo automático de subtotal, descuento e IVA (19%).
  - Formato de moneda localizado (COP - Pesos Colombianos) mediante `Intl.NumberFormat`.
- 📋 **Gestión de Órdenes de Trabajo:**
  - Conversión directa de una cotización en una orden formal.
  - Filtrado por estado: *Pendiente*, *En progreso* y *Completada*.
  - Cambio interactivo del estado de cada orden desde la lista.
- 💾 **Persistencia de Datos Local:** Integración con la API de `localStorage` para conservar la información del usuario entre sesiones sin requerir base de datos o backend adicional.
- 📱 **Diseño Responsive & Dark Mode:** Interfaz adaptada con un tema oscuro elegante y adaptable a pantallas de escritorio y dispositivos móviles.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Marcado semántico, accesibilidad web (`aria-label`, `aria-live`, etiquetas de control para lectores de pantalla).
- **CSS3:** Variables CSS (Custom Properties), Flexbox, CSS Grid y media queries para diseño adaptativo.
- **JavaScript (Vanilla - ES6+):** 
  - Gestión de estado global de la aplicación.
  - Manipulación eficiente del DOM mediante delegación de eventos.
  - API de internacionalización `Intl.NumberFormat`.
  - API `crypto.randomUUID()` para generación de identificadores únicos.
  - Persistencia de datos en `localStorage`.

---

## 🚀 Instalación y Ejecución Rápida

No requiere instalación de dependencias ni servidores Node.js.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/NOMBRE_DEL_REPOSITORIO.git
   ```

2. **Acceder a la carpeta del proyecto:**
   ```bash
   cd NOMBRE_DEL_REPOSITORIO
   ```

3. **Ejecutar:**
   Simplemente abre el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Firefox, Edge, Safari).

---

## 🌐 Cómo desplegar en GitHub Pages

Para publicar tu proyecto y tener un enlace en vivo que mostrar en tu portafolio o CV:

1. Ve a tu repositorio en **GitHub**.
2. Haz clic en **Settings** (Configuración) > **Pages** (en el menú lateral).
3. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
4. Haz clic en **Save**.
5. En un par de minutos, GitHub te proporcionará el enlace público a tu proyecto.

---

## 👤 Autor

Creado por **Tu Nombre / Nombre de Usuario**  
- GitHub: [@TU_USUARIO](https://github.com/TU_USUARIO)
- LinkedIn: [Tu Perfil de LinkedIn](https://linkedin.com/in/tu-perfil)