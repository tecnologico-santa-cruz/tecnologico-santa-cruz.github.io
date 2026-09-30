# Instituto Tecnológico Santa Cruz — portal web

## Ver la página ahora

Extrae TODO el archivo RAR o ZIP. Abre `index.html` con Chrome, Edge o Firefox. No requiere instalación, servidor, npm ni conexión para ver el diseño y el directorio. Los enlaces a redes sociales sí requieren Internet.

## Publicar en tu GitHub Pages

1. Guarda una copia de tu sitio actual.
2. Abre https://github.com/tecnologico-santa-cruz/tecnologico-santa-cruz.github.io
3. Extrae el paquete en tu computadora.
4. Desde la raíz del repositorio, usa **Add file → Upload files** y arrastra el CONTENIDO de la carpeta extraída: `index.html`, `css`, `js` y `assets`. Deben conservarse las carpetas y sus archivos. Reemplaza `index.html` si ya existe. No subas solo el RAR/ZIP ni una carpeta contenedora adicional.
5. Confirma la carga con **Commit changes**.
6. Si GitHub Pages ya está activo, espera a que termine la publicación y abre https://tecnologico-santa-cruz.github.io/ . Si no está activo, configura Pages para publicar desde la rama `main`, carpeta raíz.
7. Si ves la versión anterior, actualiza con Ctrl + F5.

El `style.css` antiguo de la raíz ya no se utiliza: la página nueva utiliza `css/style.css`.

## Cambios de la versión 2

- Facebook corregido a https://www.facebook.com/Tecnoitsc
- Iconos grandes, centrados y en dos columnas en móviles, siguiendo tu referencia.
- Portada más compacta en móviles para llegar antes a los enlaces.
- Foto de fondo de Santa Cruz de la Sierra incluida localmente.
- Dos contactos reales de WhatsApp con sus nombres.

## Lo que ya incluye

- Diseño adaptable, navegación móvil y accesibilidad básica (teclado, foco, etiquetas, contraste, reducción de movimiento).
- Logo recuperado de tu repositorio, guardado localmente en `assets/logo.png`.
- Iconos SVG locales; sin fuentes, librerías ni imágenes externas obligatorias.
- Directorio con categorías y búsqueda que reconoce palabras sin tildes.
- Facebook, TikTok, sitio institucional, teléfonos, correo y mapa tomados de tu HTML original.
- Accesos directos a los dos WhatsApp y selector flotante de contacto.
- Noticias manuales y enlaces a las publicaciones de Facebook y TikTok.

## Cambiar enlaces y contactos

Abre `js/config.js` con un editor de texto. Conserva las comillas, comas y corchetes.

**WhatsApp:** ya se incluyen los dos contactos facilitados:

- TECNO OFICIAL Luis: +591 74165292, campo `whatsappLuis`.
- Corporativo Tecnológico Santa Cruz: +591 74165293, campo `whatsappCorporativo`.

Los botones abren directamente el chat correspondiente. El botón flotante permite elegir. Para cambiar un número, edita el campo correspondiente en `js/config.js` (solo dígitos, con código de país) y actualiza también las etiquetas visibles de contacto en `js/app.js` e `index.html`.

**Instagram y LinkedIn:** pega las URLs completas en los campos correspondientes. Solo se muestran cuando hay un enlace válido. Facebook y TikTok ya contienen los enlaces aportados.

**Teléfonos, correo y dirección:** edítalos en `js/config.js`.

Antes de publicar, comprueba que los datos originales sigan vigentes y que cada perfil pertenezca al instituto. No se ha verificado la titularidad ni disponibilidad de cada servicio externo.

## Logo y fotografías reales

El logo ya está incluido. Puedes reemplazar `assets/logo.png` por otra versión con el mismo nombre. La portada utiliza la foto de Santa Cruz de la Sierra que facilitaste, con una capa verde para mejorar la lectura. La imagen representa la ciudad; no se presenta como foto del campus. En móvil también aparece suavemente detrás de los accesos.

Para usar una foto real:
1. Guarda la foto como `assets/portada.jpg`.
2. Cambia el valor de `fotoPortada` a `"assets/portada.jpg"` en `js/config.js`.

Usa fotos autorizadas, preferentemente horizontales, de alrededor de 1600 px de ancho y menos de 500 KB. La foto actual se guarda en `assets/santa-cruz.jpg`.

## Publicar noticias

No se inventaron fechas, convocatorias, carreras ni anuncios. Inicialmente la sección remite a las redes existentes. No extrae noticias automáticamente.

Para añadir noticias propias, reemplaza `"noticias": []` en `js/config.js` por:

```js
"noticias": [
  {
    "publicado": true,
    "fecha": "2026-09-30",
    "titulo": "Escribe el título real del comunicado",
    "resumen": "Escribe aquí una descripción breve y verificada.",
    "imagen": "assets/noticia-01.jpg",
    "alt": "Descripción de la fotografía",
    "enlace": "https://www.facebook.com/Tecnoitsc/"
  }
]
```

Es un EJEMPLO DE ESTRUCTURA: sustituye el contenido por datos reales antes de publicarlo. Coloca la imagen en la ruta indicada, o usa `"imagen": ""` para no mostrar una imagen. La fecha usa AAAA-MM-DD. Pega el enlace de la publicación concreta. Pon `"publicado": false` para ocultar una noticia. Se muestran en el orden del archivo: pon la más reciente primero. Separa varias noticias con comas entre los objetos `{ ... }`.

## Archivos

- `index.html`: estructura y textos de la portada.
- `css/style.css`: diseño, colores y adaptación a pantallas.
- `js/config.js`: contactos, logo, foto y noticias.
- `js/app.js`: búsqueda, filtros, menú y ventana de contacto.
- `js/icons.js`: iconos vectoriales incluidos.
- `assets/logo.png`: logo existente del instituto.

La estética usa verde, blanco y formas geométricas como inspiración corporativa. No utiliza el nombre, logo ni recursos gráficos de Schneider Electric. No hay analítica, formularios que recojan datos, inicio de sesión ni panel de administración. Es un sitio estático compatible con GitHub Pages.
