# Boda Lucía y Salvatore

Web de la boda de Lucía Revollar Torres & Salvatore Cordano Alencastre — 28 de noviembre de 2026.

## Paleta

- `#f1ead8` — crema (fondo)
- `#cec4a0` — tan / dorado
- `#8a8e75` — oliva / sage
- `#bec5a4` — sage claro

## Estructura

- `index.html` — página del sobre interactivo (fade in/out al abrir con el sello de lacre)
- `landing.html` — invitación completa: invitación, foto, monograma, confirmación de asistencia,
  recepción, mesa de regalos, cuenta regresiva, ubicación y galería
- `css/base.css` — variables y reglas compartidas por todas las páginas
- `css/envelope.css` — estilos exclusivos de `index.html`
- `css/landing.css` — estilos exclusivos de `landing.html`
- `js/envelope.js` — interacción del sello y transición entre escenas en `index.html`
- `js/landing.js` — animaciones de aparición al hacer scroll en `landing.html`
- `assets/` — sobre, sello y tarjetas de la invitación, más el logo (`Logo.svg`)
- `assets/fotos/` — fotos de la pareja usadas en el header y la galería de `landing.html`

## Deploy

Sitio en vivo: https://bodaluciaysalvatore.vercel.app
