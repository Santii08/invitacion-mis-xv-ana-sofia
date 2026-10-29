# ✨ Invitación Digital Mis XV - Ana Sofía ✨

Página web interactiva y elegante para los 15 años de **Ana Sofía**, inspirada en la tarjeta con tonos lila, acuarela azul cielo, rosas y detalles dorados. Incluye sistema de confirmación de asistencia (RSVP) conectado de forma privada a **Google Sheets** y generador de enlaces personalizados para cada invitado.

---

## 📁 Archivos del Proyecto

* **`index.html`**: Página principal de la invitación (portada, cuenta regresiva, música, ubicación con Google Maps/Waze, código de vestimenta, lluvia de sobres y formulario de confirmación).
* **`css/style.css`**: Diseño responsivo y moderno (efectos de luces brillantes, partículas doradas, tipografías elegantes).
* **`js/app.js`**: Lógica de cuenta regresiva al 27 de Noviembre de 2026, reproductor de música, lectura de parámetros de invitado (`?invitado=...&pases=...`) y envío de datos.
* **`google-apps-script.js`**: Código listo para pegar en Google Sheets para recibir las confirmaciones en tu hoja privada.
* **`admin.html`**: Panel de la organizadora para generar enlaces de WhatsApp con pases personalizados y consultar estadísticas.
* **`assets/tarjeta-original.jpg`**: Imagen original de la tarjeta de invitación de Ana Sofía.

---

## 🚀 ¿Cómo probar la invitación en tu computadora?

Solo haz doble clic en `index.html` para abrirlo en tu navegador favorito (Chrome, Edge, etc.).

Para probar cómo se ve la invitación personalizada de un invitado, puedes abrir:
```text
index.html?invitado=Edward+Ramirez&pases=2
```
o
```text
index.html?invitado=Familia+Perez&pases=4
```

---

## 📊 ¿Cómo conectar tu Google Sheets privado? (Solo 2 minutos)

1. Entra a [Google Drive](https://drive.google.com) y crea una nueva **Hoja de cálculo**.
2. Nómbrala: `Confirmaciones - Mis XV Ana Sofia`.
3. En el menú superior de la hoja, haz clic en **Extensiones** > **Apps Script**.
4. Borra lo que aparezca y pega todo el contenido de [`google-apps-script.js`](file:///C:/Users/danie/.gemini/antigravity/scratch/invitacion-mis-xv-ana-sofia/google-apps-script.js).
5. Haz clic en el botón azul superior **Implementar** (Deploy) > **Nueva implementación**.
6. En tipo, selecciona **Aplicación web**.
   * **Ejecutar como:** *Yo* (tu cuenta de Google).
   * **Quién tiene acceso:** *Cualquier usuario* (Anyone).
7. Haz clic en **Implementar**, acepta los permisos de tu cuenta y copia la **URL de la aplicación web** (la que termina en `/exec`).
8. Abre [`js/app.js`](file:///C:/Users/danie/.gemini/antigravity/scratch/invitacion-mis-xv-ana-sofia/js/app.js) y reemplaza la línea:
   ```javascript
   const GOOGLE_SCRIPT_URL = "TU_GOOGLE_APPS_SCRIPT_URL_AQUI";
   ```
   por tu URL copiada. ¡Y listo! Todas las confirmaciones llegarán directo a tu hoja privada.

---

## 🌐 ¿Dónde publicarla gratis en internet para compartirla?

Puedes subir esta carpeta a cualquiera de estas plataformas gratuitas y seguras:
* **GitHub Pages** (gratuito)
* **Vercel** o **Netlify** (simplemente arrastras la carpeta y te da un link al instante)
* **Firebase Hosting**
