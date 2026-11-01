// Punto de entrada: las funciones de cada sección viven en su propio módulo.
import { institucion } from './data/institucion.js?v=20261101';
import { contactos } from './data/contactos.js?v=20261101';
import { galeria, opcionesGaleria } from './data/galeria.js?v=20261101';
import { noticias } from './data/noticias.js?v=20261101';
import { accesos } from './data/accesos.js?v=20261101';
import { mountIcons } from './utils/dom.js?v=20261101';
import { initInstitucion } from './components/institucion.js?v=20261101';
import { initNavegacion } from './components/navegacion.js?v=20261101';
import { initDirectorio } from './components/directorio.js?v=20261101';
import { initContacto } from './components/contacto.js?v=20261101';
import { initNoticias } from './components/noticias.js?v=20261101';
import { initCarrusel } from './components/carrusel.js?v=20261101';

// Cada inicializador tolera que su sección no exista en otra página.
mountIcons();
initInstitucion(institucion);
initNavegacion();
initDirectorio(institucion, contactos, accesos);
initContacto(contactos, institucion);
initNoticias(noticias);
initCarrusel(galeria, opcionesGaleria);
