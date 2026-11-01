# Arquitectura

## Flujo de la página

1. `index.html` define secciones, anclajes, textos generales y contenedores.
2. `css/style.css` carga las hojas de estilo por área.
3. `src/app.js` importa datos y llama a cada inicializador.
4. Los componentes crean la interfaz a partir de los datos.

No existen variables globales de aplicación, framework ni servidor de producción.
Los imports son módulos estándar del navegador. El servidor de desarrollo solo
entrega archivos, escucha en la interfaz local y no recibe cambios ni envíos.

## Responsabilidades

| Módulo | Responsabilidad |
| --- | --- |
| `src/data/` | Contenido editable. Sin consultas al DOM ni eventos. |
| `components/institucion.js` | Identidad, enlaces generales, redes, QR y compartir. |
| `components/directorio.js` | Accesos derivados, búsqueda y filtros. |
| `components/contacto.js` | Contactos visibles y diálogo de ayuda. |
| `components/navegacion.js` | Menú móvil y cierre con Escape. |
| `components/carrusel.js` | Diapositivas, indicadores, avance y accesibilidad. |
| `components/noticias.js` | Noticias explícitamente publicadas. |
| `utils/urls.js` | Validación, WhatsApp y formato de etiquetas. |
| `utils/dom.js` | Creación segura de elementos, enlaces e iconos. |

Los componentes reciben sus datos como argumentos. No se llaman entre sí.
Cada inicializador comprueba sus contenedores y puede omitirse su sección sin
impedir que funcionen las demás. Se inicializa cada componente una sola vez
por carga; no se usa un enrutador ni navegación de aplicación de página única.

## Contratos del HTML

- Los `id` que utiliza un componente son su contrato con el HTML.
- `data-logo`, `data-link`, `data-icon`, `data-qr` y `data-share` conectan
  elementos con datos o iconos.
- `.carousel-track` y `.carousel-dots` son contenedores vacíos: no escribir
  diapositivas ni indicadores manuales.
- `#contact-whatsapp` se genera desde la lista de contactos.
- Los textos de datos se insertan con `textContent`, nunca como HTML.
- `innerHTML` se reserva a los SVG locales y revisados de `src/icons.js`.

## CSS

Las variables de color, tipografía y reglas comunes están en `base.css`.
Cada área contiene también sus media queries. El orden de carga está explícito
en `style.css`. Se conservaron el diseño y la cascada existente al separar y
formatear las reglas; las declaraciones sobrescritas de la misma condición se
retiraron sin cambiar el orden de las restantes.

Antes de añadir un estilo, buscar la clase y editar su regla existente.
No añadir bloques «V4», «fix» o parches al final de las hojas.

## Recursos públicos

Se conserva `assets/` y los nombres ya publicados para no romper QR,
descargas ni enlaces a afiches. Hay pocos archivos y sus nombres son descriptivos.
Si el volumen crece, se pueden crear subcarpetas, actualizando las referencias
en datos y preservando las rutas antiguas que se hayan compartido.

## Validación y ampliaciones

`tests/data.test.js` comprueba contratos, recursos y enlaces.
`tests/browser.js` comprueba interacciones, contactos derivados, móviles y el
crecimiento de la galería sin modificar HTML. No requiere el sitio publicado.
Para una nueva sección: crear datos si corresponde, un componente con función
`init...`, el contenedor HTML y su llamada en `src/app.js`; documentar el cambio.
