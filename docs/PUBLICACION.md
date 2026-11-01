# Desarrollo, comprobación y publicación

## Entorno local

Requiere Node.js con soporte de módulos y `node:test` (Node 22 o posterior).
`npm start` sirve el proyecto en `http://127.0.0.1:4173`.
Para otro puerto: definir `PORT` antes de ejecutar el comando.
No usar doble clic sobre el HTML: los navegadores bloquean imports desde `file:`.

## Pruebas

1. `npm test`: contratos de datos, rutas y enlaces. Sin dependencias.
2. `npm install` y `npx playwright install chromium`: preparación del navegador.
3. `npm run test:browser`: recorrido automático y capturas locales.
4. Revisión visual en computadora y móvil de la sección modificada.

Las pruebas de navegador inyectan datos ficticios solo en el contexto local.
Comprueban que un cambio de contacto se propaga y que un tercer afiche genera
su indicador. Nunca publican esos datos ni envían correos o mensajes.

## GitHub Pages

El sitio se sirve desde la raíz de `main`. No añadir pasos de compilación.
Trabajar preferentemente en una rama y abrir una solicitud de cambios cuando
se modifiquen varias secciones o la arquitectura.

Antes de integrar:

- Revisar el diff y confirmar que no incluye credenciales ni datos de pruebas.
- Ejecutar las comprobaciones relacionadas con el cambio.
- Ejecutar `npm run version -- IDENTIFICADOR-NUEVO`.
- Mantener juntos los módulos, datos, estilos y HTML que dependen entre sí.

Después de integrar:

- Esperar al resultado correcto de `pages build and deployment`.
- Revisar la página pública, las imágenes y los enlaces pertinentes.
- Para revertir, usar el historial de Git. No sobrescribir cambios ajenos ni
  forzar la rama para solucionar un conflicto.

## Subida manual

Si se sube desde el navegador, conservar las rutas completas. No subir solo
`index.html`, un ZIP o una carpeta contenedora. Los imports de `src/` y `css/`
son necesarios. Si se usa una rama, completar todos los archivos antes de
integrarla, para evitar que se publique una versión incompleta.

## Comprobación de caché

Si aparece una versión anterior, comprobar el resultado de Pages y la versión
en los imports antes de volver a publicar. El script de versión incluye todos
los módulos, no solo `src/app.js`. Cambiar únicamente la URL de entrada no
invalida la caché de sus dependencias.
