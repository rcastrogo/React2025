# React2025

Proyecto de prueba de concepto SPA en React + TypeScript, con backend ASP.NET Core, varias formas de acceso a datos y distintas capas para trabajar con REST, Razor Pages y componentes reutilizables.

## Qué incluye el proyecto

- **Frontend en React + Vite + TypeScript**
  - Arranque con `ReactProject/src/main.tsx` y `ReactProject/src/App.tsx`.
  - Navegación con `react-router-dom`.
  - Autenticación básica, splash screen inicial y publicación de eventos internos mediante PubSub.
  - Utilidades para manejar scroll/resize con `useDebounce`.

- **Backend ASP.NET Core**
  - API REST en `WebApi/WebApi/Controllers`.
  - Razor Pages en `WebApi/WebApi/Pages`.
  - Endpoints “clásicos” tipo handler en `/ashx/users` y endpoints minimal-like en `/users`.
  - Configuración de CORS, Swagger y serving de estáticos desde `wwwroot`.

- **DAL y negocio**
  - Las entidades del dominio viven en `Negocio` y se cargan mediante métodos como `Load()`, `Load(id)` y `Save()`.
  - El acceso a datos se crea desde `IDbContextBuilder`/`DbContextBuilder`, que construye el contexto a partir de `ConnectionManager`.
  - Hay ejemplos de consulta directa con `SqlDirectQuery` y carga de entidades desde queries.

- **Generación dinámica de código**
  - Existe un sistema histórico de generación dinámica en `CodeGenerator/React2025.pcg`.
  - Define entidades, tablas, propiedades y reglas de mapeo, y sirve como referencia de cómo se obtenían y serializaban datos antes de soluciones tipo mapper moderno.

## Cómo se obtienen y serializan los datos

El proyecto mezcla varias estrategias:

1. **Carga directa de entidades desde la capa de negocio**
   - Ejemplo: `new Usuarios().Load()`, `new Usuario().Load(id)`.
   - Esto se usa en controladores REST, Razor Pages y endpoints de usuario.

2. **Consulta SQL directa**
   - Se usa `SqlDirectQuery.LoadFromQuery(...)` para recuperar datos sin pasar por una capa ORM tradicional.
   - En algunas rutas se devuelve el resultado directamente como JSON.

3. **Serialización personalizada**
   - El backend configura JSON con `WriteIndented = true` e `IncludeFields = true`.
   - Además, el proyecto conserva pruebas y ejemplos de `SmallXmlSerializer`, `ToJsonString()`, `ToXml()` y `FromJsonTo<T>()`.
   - Esto documenta una evolución desde serialización manual/dinámica hacia formatos más cómodos para API y UI.

## Implementaciones REST disponibles

El proyecto tiene varias formas de exponer REST:

- **Controllers ASP.NET Core**
  - `BaseApiController` centraliza respuestas `OkResponse` / `ErrorResponse` y acciones del servidor.
  - `MasterDataTablesController` expone tablas maestras como países, monedas, roles, tipos, etc.
  - `DistribuidoresController` muestra validación, acciones del servidor y respuestas estructuradas.

- **Endpoints estilo handler / legado**
  - `UserController` y `MapUsersEndpoins()` incluyen rutas como `/ashx/users` y `/users`.
  - Es una forma muy útil para mantener compatibilidad con estilos anteriores de aplicación.

- **Razor Pages**
  - `WebApi/WebApi/Pages/Distribuidores.cshtml` renderiza una página server-side.
  - Su PageModel carga datos y también expone endpoints JSON de apoyo.

## Razor Pages

La página `Distribuidores` muestra una tabla HTML generada en servidor a partir de datos obtenidos con `SqlDirectQuery.LoadFromQuery("SELECT * FROM [Distribuidor]")`.

## Tailwind y frontend en desarrollo

El proyecto usa Vite y permite configurar la base pública mediante variables de entorno:

- `ReactProject/.env`
- `ReactProject/.env.production`
- `VITE_APP_BASE_URL`

Puntos importantes para desarrollo:

- Arrancar el frontend con `npm run dev` desde `ReactProject`.
- El backend corre en `https://localhost:7222`.
- Vite está configurado con proxy hacia el backend para facilitar llamadas locales.
- La base de la app se controla con `VITE_APP_BASE_URL`.

## Integración con Vanilla JS

Además del React principal, el proyecto mantiene utilidades y patrones orientados a JavaScript “vanilla” para interoperar con la UI:

- PubSub para comunicación entre módulos.
- Eventos globales como `WINDOW_RESIZE` y `WINDOW_SCROLL`.
- Acciones de servidor para notificaciones, foco, navegación y publicación de eventos.

## Creación de componentes

La estructura de `ReactProject/src` ya separa el frontend en carpetas de:

- `components`
- `Pages`
- `services`
- `hooks`
- `constants`
- `utils`

Eso facilita crear componentes pequeños, reutilizables y orientados a página o a funcionalidad.

## Script de build y despliegue

En `ReactProject/package.json` hay flujo de compilación y despliegue automático:

- `dev`: arranque con Vite
- `build`: compila TypeScript y genera el bundle
- `postbuild`: copia el resultado a `WebApi/WebApi/wwwroot/React2025`
- `deploy`: publica a GitHub Pages

## Enlaces útiles

- Servidor JSON de prueba: `https://my-json-server.typicode.com/rcastrogo/React2025`
- Proyecto frontend: `ReactProject`
- Backend: `WebApi`
- Generador dinámico: `CodeGenerator`

## Nota personal

Este repositorio mezcla varias etapas de evolución del proyecto: generación dinámica, capa de negocio, acceso directo a datos, REST clásico, Razor Pages y React. Si vuelves dentro de unos meses, este README debería servirte como mapa rápido para no perderte.
