# Generador de Depósitos Bancarios a Excel

Este proyecto es una aplicación Full-Stack diseñada para facilitar la creación y gestión de depósitos bancarios, permitiendo exportarlos fácilmente a archivos Excel. Está optimizada para un uso personal (un solo usuario admin) y funciona de forma totalmente independiente.

## 🚀 Características Principales

- **Gestión de Depósitos:** Formulario intuitivo para ingresar datos (fecha, cuenta, cliente, monto, tipo de depósito, remito, bolsa).
- **Exportación a Excel:** Genera archivos `.xlsx` profesionales con formato automático de columnas y moneda.
- **Autenticación Manual:** Sistema de login local (Email/Password) sin dependencias externas (OAuth desactivado para desarrollo/uso local).
- **Seguridad:** Protección de rutas mediante tRPC, Row Level Security (RLS) preparado para Supabase y hashing de contraseñas con Bcrypt.
- **Diseño Moderno:** Interfaz corporativa minimalista construida con Tailwind CSS y componentes de Radix UI.

## 🛠️ Stack Tecnológico

- **Frontend:** React 19, Vite, Tailwind CSS 4, Radix UI, TanStack Query.
- **Backend:** Node.js, Express, tRPC (para una API con tipos seguros).
- **Base de Datos:** PostgreSQL a través de **Supabase**.
- **ORM:** Drizzle ORM.
- **Utilidades:** Lucide React (iconos), XLSX (exportación), Bcryptjs (seguridad).

## 📦 Instalación y Configuración

1.  **Clonar el repositorio:**

    ```bash
    git clone <url-del-repositorio>
    cd generador-depositos-excel
    ```

2.  **Instalar dependencias:**

    ```bash
    pnpm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz (puedes basarte en el ejemplo):

    ```env
    DATABASE_URL="tu-url-de-supabase-postgresql"
    JWT_SECRET="una-clave-secreta-larga-y-segura"
    VITE_APP_ID="manual-dev"
    PORT=3000
    ```

4.  **Preparar la Base de Datos:**
    Sincroniza el esquema con Supabase:

    ```bash
    pnpm db:push
    ```

5.  **Crear Usuario Administrador:**
    Ejecuta el script de seeding para inicializar al admin:
    ```bash
    npx tsx scripts/seed-admin.ts
    ```
    _Credenciales por defecto: `admin@example.com` / `admin`_

## 🚀 Ejecución

### Desarrollo

```bash
pnpm dev
```

La aplicación se abrirá en `http://localhost:3000` (o el siguiente puerto disponible).

### Producción (Local)

```bash
pnpm build
pnpm start
```

## 📂 Estructura del Proyecto

- `/client`: Frontend en React.
- `/server`: Backend en Express + tRPC.
- `/shared`: Tipos y constantes compartidas.
- `/drizzle`: Definición de esquema y migraciones.
- `/scripts`: Utilidades (como la creación de admin).

## 🔒 Notas para el Desarrollador

- **RLS en Supabase:** Se recomienda habilitar RLS en las tablas `users` y `deposits` sin crear políticas públicas. El servidor utiliza una conexión administrativa que ignora RLS, bloqueando cualquier acceso externo no autorizado.
- **Autenticación:** El sistema usa cookies `httpOnly` para la sesión. En desarrollo local, se configura `sameSite: "lax"`.
- **Exportación:** La lógica de Excel se encuentra en `client/src/lib/excelExporter.ts`.

---

Desarrollado con enfoque profesional y minimalista.
