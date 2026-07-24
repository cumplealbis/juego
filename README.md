# Aventura de cumpleaños con pegatinas NFC

Web estática para una experiencia personal de cumpleaños basada en pegatinas NFC, pistas, acertijos y contraseñas. La página principal muestra los capítulos, guarda el progreso en `localStorage` y desbloquea recompensas provisionales conforme se introducen las respuestas correctas.

No usa backend, base de datos, frameworks ni dependencias externas. Está pensada para abrirse localmente y para desplegarse directamente en GitHub Pages.

## Cómo abrirla localmente

Abre `index.html` en el navegador. También puedes abrir directamente cualquiera de las páginas de `pistas/` para simular que una pegatina NFC lleva a esa URL.

## Cómo modificar las contraseñas

Edita `js/config.js`. Todas las contraseñas están centralizadas en `GAME_CONFIG.chapters`.

```javascript
passwords: ["verano"]
```

Puedes usar varias respuestas válidas:

```javascript
passwords: ["barcelona", "bcn"]
```

La comparación ignora mayúsculas, espacios al inicio o final y tildes. Por ejemplo, `Canción`, `cancion` y `  CANCIÓN  ` se consideran equivalentes.

Importante: las contraseñas están visibles en JavaScript. Esto es suficiente para un juego personal, pero no sirve para proteger información sensible.

## Cómo cambiar textos y recompensas

Los textos principales de la aventura y los capítulos están en `js/config.js`:

- `adventure.title`
- `adventure.subtitle`
- `chapters[].title`
- `chapters[].description`
- `chapters[].successMessage`
- `chapters[].rewardHtml`
- `chapters[].nextHint`

Busca los comentarios `PERSONALIZAR` para localizar contenido provisional.

## Cómo sustituir imágenes y audios

Puedes guardar archivos en:

- `assets/images/`
- `assets/audio/`
- `assets/icons/`

Después enlázalos con rutas relativas. Desde `index.html`, por ejemplo:

```html
<img src="./assets/images/foto.jpg" alt="Descripción de la fotografía">
```

Desde una página dentro de `pistas/`, usa:

```html
<img src="../assets/images/foto.jpg" alt="Descripción de la fotografía">
```

Mantén siempre rutas relativas para que GitHub Pages funcione aunque el proyecto esté publicado dentro de una ruta de repositorio.

## Cómo crear una nueva página de pista

1. Copia una página existente de `pistas/`.
2. Cambia el nombre por uno aleatorio, por ejemplo `a7f3c91b.html`.
3. Edita el título, el acertijo, la pista adicional y el contenido provisional.
4. Comprueba que el enlace a CSS siga siendo `../css/styles.css`.
5. Comprueba que el enlace a la página principal siga siendo `../index.html`.
6. Graba la URL completa de esa nueva página en la pegatina NFC.

## Cómo generar un nombre aleatorio para una pista

En la consola del navegador puedes ejecutar:

```javascript
crypto.randomUUID().replaceAll("-", "").slice(0, 8);
```

Ejemplo de resultado:

```text
a7f3c91b
```

Después usa:

```text
a7f3c91b.html
```

Evita nombres secuenciales como `pista-1.html`, `pista-2.html` o `capitulo-3.html`.

## Páginas de pista incluidas

- `pistas/a7f3c91b.html`
- `pistas/d42e8f16.html`
- `pistas/6b1d9c53.html`
- `pistas/f8a4e207.html`

Cada página funciona al abrirse directamente desde una URL NFC. La flecha `← Volver` usa el historial si existe; si no existe, dirige a `../index.html`. También hay un enlace visible a la página principal.

## Cómo desplegar en GitHub Pages

1. Sube estos archivos a un repositorio de GitHub.
2. En el repositorio, ve a `Settings` → `Pages`.
3. Elige la rama y la carpeta raíz del proyecto.
4. GitHub generará una URL similar a:

```text
https://usuario.github.io/nombre-del-repositorio/
```

No cambies las rutas relativas por rutas que empiecen por `/`, porque podrían romperse al publicar en una ruta de repositorio.

## Cómo grabar las pegatinas NFC

Cuando la web esté desplegada, copia la URL completa de cada pista. Por ejemplo:

```text
https://usuario.github.io/nombre-del-repositorio/pistas/a7f3c91b.html
```

Graba esa URL en una pegatina NFC con la aplicación que uses para escribir etiquetas. Repite el proceso con cada pista.

## Cómo borrar el progreso durante las pruebas

En la página principal pulsa `Reiniciar aventura`. El botón borra la clave `birthdayNfcAdventureProgress` de `localStorage` y restaura el estado inicial.

También puedes borrarlo desde la consola del navegador:

```javascript
localStorage.removeItem("birthdayNfcAdventureProgress");
```

## Privacidad e indexación

Todas las páginas incluyen:

```html
<meta name="robots" content="noindex, nofollow">
```

También existe un `robots.txt` con `Disallow: /`. Esto indica a buscadores que no indexen el sitio, pero no garantiza privacidad real. Si el repositorio es público, el código y las URLs pueden verse.

## Estructura del proyecto

```text
/
├── index.html
├── README.md
├── robots.txt
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── config.js
├── assets/
│   ├── images/
│   ├── audio/
│   └── icons/
└── pistas/
    ├── a7f3c91b.html
    ├── d42e8f16.html
    ├── 6b1d9c53.html
    └── f8a4e207.html
```

## Puntos principales de personalización

- Cambia títulos, textos, contraseñas y recompensas en `js/config.js`.
- Cambia acertijos y pistas secundarias en cada archivo de `pistas/`.
- Ajusta colores, espaciados y estilo visual en `css/styles.css`.
- Añade imágenes y audios en `assets/` y enlázalos con rutas relativas.
