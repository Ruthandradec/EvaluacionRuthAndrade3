# Microservicio de Ejemplo

Este es un microservicio de ejemplo que consume un servicio web para obtener datos y los almacena en una base de datos SQLite. También ofrece rutas para buscar en la base de datos y autenticación JWT.

## Requisitos

Asegúrate de tener instalado lo siguiente:

- Node.js

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/Ruthandradec/EvaluacionRuthAndrade3.git
   cd microservicio
2. Instala las dependencias:

   ```bash
      npm install
3. Instala las dependencias:

   ```bash
      npm start
La aplicación estará disponible en http://localhost:3000.

## Estructura de la base de datos
- Tabla posts
   ```bash
      CREATE TABLE IF NOT EXISTS posts (
         id INTEGER PRIMARY KEY,
         userId INTEGER,
         title TEXT,
         body TEXT
      );
## Endpoints
### Autenticación
POST /auth: Autenticación de usuario para obtener un token JWT.


### Almacenamiento de Datos
- GET /fetch-and-store: Consume el servicio web JSONPlaceholder para obtener datos de https://jsonplaceholder.typicode.com/posts y los almacena en la base de datos SQLite. Debe proporcionarse un token JWT en los encabezados de autenticación: **Authorization**.

### Búsqueda en la Base de Datos
- GET /search-post: Permite buscar posts en la base de datos por ID o Título. Debe proporcionarse un token JWT en los encabezados de autenticación: **Authorization**.

## Uso
- Autentica a un usuario utilizando la ruta **/auth** para obtener un token JWT.
  este recibe un json con el usuario y contraseña por defecto
  - **username**: **ruth**
  - **password**: **123**
  ```bash
      {
         "username":"ruth",
         "password":"123"
      }
- Utiliza el token JWT en las rutas protegidas, como **/fetch-and-store** y **/search-post**.
   - la ruta **/search-post** recibe un parametro el cual puede buscarse por ID, o titulo: **filter**
    ```bash
      /search-post?id=1&title=nesciunt
- Utiliza las rutas para almacenar datos, buscar en la base de datos y acceder a rutas protegidas.
### NOTA
Se adjunta el archivo post-man para consumir los servicios con mayor facilidad
