# Mantenimiento de contenido

## Reglas básicas

- Editar cada dato en `src/data/`, no copiarlo en el HTML o componentes.
- Mantener UTF-8, comillas, comas y corchetes válidos.
- Usar información real aprobada por el instituto.
- Antes de publicar: `npm test`, pruebas de navegador y una versión nueva.
- Los teléfonos fijos fueron retirados por indicación del usuario. No recuperarlos
  de versiones antiguas.

## Cambiar o añadir un contacto de WhatsApp

Editar `src/data/contactos.js`:

```js
{
  id: 'canal-nuevo',
  nombre: 'Nombre oficial del canal',
  codigoPais: '591',
  numero: '70000000',
}
```

El número del ejemplo es ficticio: no publicarlo como contacto real.
`codigoPais` y `numero` contienen solo dígitos y son textos, no cantidades.
El `id` debe ser único. El orden de la lista define el orden de aparición.
El cambio se aplica a tarjetas, contacto y ventana de ayuda automáticamente.
Para retirar un contacto, eliminar su objeto de la lista.

## Añadir o retirar un afiche

1. Guardar la imagen en `assets/` con un nombre claro, sin espacios ni tildes.
2. Añadir un objeto en `src/data/galeria.js`:

```js
{
  titulo: 'Título real del comunicado',
  imagen: 'assets/comunicado-nuevo.jpg',
  ancho: 720,
  alto: 1080,
  alt: 'Descripción del contenido del afiche para lectores de pantalla.',
}
```

Las dimensiones corresponden a la imagen original. No hay que editar el HTML
ni crear puntos o flechas. Reordenar la lista cambia el orden del carrusel.
Eliminar un objeto retira el afiche. Con una imagen se ocultan los controles;
con ninguna se oculta la sección. `intervaloMs` controla el avance automático.
La preferencia de movimiento reducido del visitante tiene prioridad.

## Publicar una noticia

Añadir en `src/data/noticias.js`, dentro de la lista:

```js
{
  publicado: false,
  fecha: '2026-11-01',
  titulo: 'Sustituir por el título aprobado',
  resumen: 'Sustituir por el texto aprobado.',
  imagen: 'assets/noticia-nueva.jpg',
  alt: 'Descripción de la imagen.',
  enlace: 'https://www.facebook.com/Tecnoitsc',
}
```

Es un ejemplo, no un anuncio real. Revisar todos los datos y cambiar
`publicado` a `true` solo cuando corresponda. Imagen, fecha y enlace son
opcionales; título y resumen son necesarios. Usar fechas `AAAA-MM-DD`.
Las noticias aparecen en el orden de la lista.

## Redes, dirección, correo y enlaces

Editar `src/data/institucion.js`. Una red con `url: ''` permanece oculta.
Actualizar su descripción si cambia el usuario de la cuenta.
Los accesos adicionales se definen en `src/data/accesos.js`.
Las categorías existentes son `Atención`, `Redes sociales` e `Institución`.
Si se añade otra categoría, añadir también su botón en el HTML.

## Cambiar logo o foto

1. Guardar el archivo en `assets/`.
2. Actualizar `logo` o `fotoPortada` en `src/data/institucion.js`.
3. Para el logo, comprobar cabecera, portada, tarjeta institucional, pie y favicon.

`data-logo` identifica todas las apariciones. El `src` del HTML es solo un
respaldo visual previo a la carga de JavaScript; los datos prevalecen al iniciar.
Preferir un archivo con nombre nuevo cuando cambie una imagen para evitar caché.

## QR y enlace para compartir

En `institucion.js`, `portal` es la dirección que comparte el botón de WhatsApp.
`qr.vector` es la imagen mostrada y `qr.descarga` el archivo descargable.
Si cambia la dirección del portal, regenerar y comprobar también el QR:
una imagen QR existente no cambia su destino al editar un texto de configuración.
No deformarlo, recortarlo ni reducir sus márgenes blancos.

## Evitar copias antiguas en caché

Antes de publicar cambios de código o contenido:

```sh
npm run version -- 20261101-2
```

Usar un identificador nuevo por publicación. El comando actualiza la entrada,
los imports de JavaScript y las hojas de estilo. No modifica imágenes ni datos.
Para una imagen modificada, usar un nombre nuevo o actualizar su URL explícitamente.

## Límites del sistema

Los cambios requieren editar archivos y publicarlos. No hay panel administrativo
ni extracción automática de noticias de Facebook. Si varias personas necesitan
publicar contenido sin tocar archivos, evaluar un gestor de contenidos como
una ampliación independiente; no es necesario para el funcionamiento actual.
