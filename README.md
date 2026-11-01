# Instituto Tecnológico Santa Cruz

Portal institucional estático publicado en [GitHub Pages](https://tecnologico-santa-cruz.github.io/).
HTML, CSS y JavaScript con módulos nativos. No hay framework, compilación,
base de datos ni dependencias de producción.

## Empezar

1. Clona el repositorio o descarga y extrae el ZIP completo.
2. Instala Node.js si todavía no está disponible.
3. En la carpeta del proyecto ejecuta `npm start`.
4. Abre `http://127.0.0.1:4173`.

No hace falta ejecutar `npm install` para ver la web o correr las pruebas de datos.
Los módulos de JavaScript requieren un servidor HTTP: no abrir `index.html` con
doble clic. También sirve un servidor local como Live Server de VS Code.

## Qué editar

| Cambio | Archivo |
| --- | --- |
| Nombres y números de WhatsApp | `src/data/contactos.js` |
| Logo, portada, correo, ubicación, redes y QR | `src/data/institucion.js` |
| Afiches, orden e intervalo del carrusel | `src/data/galeria.js` |
| Noticias y comunicados | `src/data/noticias.js` |
| Enlaces adicionales del directorio | `src/data/accesos.js` |
| Textos generales y estructura de las secciones | `index.html` |
| Colores, tipografía y estilos comunes | `css/base.css` |
| Cabecera, portada y pie | `css/estructura.css` |
| Tarjetas, búsqueda y filtros | `css/directorio.css` |
| Noticias, contacto y QR | `css/contenido.css` |
| Diseño del carrusel | `css/carrusel.css` |

El número y nombre de un contacto se escriben una sola vez. La página genera
con esos datos las tarjetas, la sección de contacto y la ventana de ayuda.
La galería genera automáticamente sus diapositivas e indicadores.

## Organización

```text
index.html                  Estructura y textos de la página
assets/                     Imágenes, logos, QR y afiches públicos
css/
  style.css                 Entrada y orden de los estilos
  base.css                  Elementos compartidos y variables de color
  estructura.css            Cabecera, portada, navegación y pie
  directorio.css            Accesos y filtros
  contenido.css             Noticias, contacto y compartir
  carrusel.css              Galería
src/
  app.js                    Inicializa las secciones
  icons.js                  SVG locales de confianza
  data/                     Información editable, sin lógica del DOM
  components/               Una responsabilidad por módulo
  utils/                    Enlaces seguros y creación de elementos
scripts/                    Servidor local y actualización de versiones
tests/                      Pruebas de datos y navegador
docs/                       Guías para mantener y publicar
AGENTS.md                   Reglas para asistentes de IA
```

Las adaptaciones móviles se encuentran junto a los estilos de su componente,
no repartidas en un archivo separado. Se mantienen las rutas públicas de
`assets/` para que los enlaces a imágenes y descargas ya compartidos funcionen.

## Comprobar cambios

```sh
npm test
```

Para las pruebas completas de navegador, instala las dependencias de desarrollo:

```sh
npm install
npx playwright install chromium
npm run test:browser
```

Las capturas se guardan en `test-results/` y no se suben al repositorio.
Si se usa Chrome instalado, puede seleccionarse con `BROWSER_CHANNEL=chrome`
(en PowerShell: `$env:BROWSER_CHANNEL='chrome'`).

Las pruebas no envían mensajes, formularios ni correos. Comprueban los enlaces
sin activar las conversaciones externas. La prueba del QR descarga una copia local.

## Publicar

1. Comprueba los datos y ejecuta las pruebas.
2. Actualiza la versión de los recursos, por ejemplo:
   `npm run version -- 20261101-2`.
3. Crea un commit o una solicitud de cambios en GitHub.
4. Integra en `main`. Pages publica la raíz del repositorio.
5. Espera el resultado correcto de la publicación y comprueba la web pública.

No hay que subir `node_modules/`, `test-results/` ni archivos privados.
La política de notificaciones de GitHub se administra desde la cuenta del usuario;
este proyecto no incorpora envíos de correo ni servicios de mensajería automática.

Más detalles: [mantenimiento](docs/MANTENIMIENTO.md),
[arquitectura](docs/ARQUITECTURA.md) y [publicación](docs/PUBLICACION.md).
