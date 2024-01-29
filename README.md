# gestor-de-inventario

BIENVENIDOS A NUESTRO GESTOR DE INVENTARIO

Integrantes:

-Sergio Gonzalez
-María Suarez

Este proyecto presenta un gestor de inventario completo y fácil de usar. Te permite:

Agregar, editar y eliminar productos de tu inventario.
Ponerle nombre al producto, precio del producto, moneda del precio, una descripción del producto, codigo del producto y cantidad del produto. Tambien se puede editar y eliminar los datos.

Tecnologías utilizadas:

REACT
VITE
TAILWIND

Dependencias a instalar para que funcione el programa:
- Primero se selecciona la carpeta del proyecto con: cd Inventario-App
- Luego se coloca lo siguiente: npm install -D tailwindcss postcss autoprefixer
- Por ultimo colocamos lo siguiente: npx tailwindcss init -p.

En el archivo tailwind.config.js colocamos el siguiente codigo:

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

y listo se ejecuta con npm run dev



