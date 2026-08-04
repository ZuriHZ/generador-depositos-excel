# 📊 Generador de Depósitos Excel — Libro Contable

Aplicación fullstack para gestión profesional de depósitos bancarios con exportación a Excel, formularios validados y autenticación con Clerk — construida con React 19, tRPC, Drizzle ORM y PostgreSQL (Neon).

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)
![tRPC](https://img.shields.io/badge/tRPC-11-398CCB?style=flat-square&logo=tRPC)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square)
![Neon](https://img.shields.io/badge/Neon-00E599?style=flat-square&logo=neon)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk)
![XLSX](https://img.shields.io/badge/Export-XLSX-217346?style=flat-square&logo=microsoftexcel)

---

## 🛠️ Origen y Evolución

Este proyecto fue **generado inicialmente con Manus AI** como base de partida, y posteriormente **personalizado profundamente** con mejoras propias:

- 🔐 **Autenticación**: Migración completa a **Clerk** con login custom email/password (reemplaza JWT + bcrypt)
- 🗄️ **Base de datos**: **Neon PostgreSQL** con SSL validado, schema con `clerkId`
- 🎨 **Diseño**: Rediseño total **"Libro Contable" — Modern Ledger** (estética papel contable vintage)
- 📊 **Exportación Excel**: Generación de XLSX con formato profesional
- ✅ **Validación**: Zod para schemas compartidos client/server

---

## 🎨 Diseño: Libro Contable (Modern Ledger)

El rediseño actual implementa una estética de **libro contable clásico**:

- 📖 **Layout dos páginas** con gutter central tipo pliegue de libro
- 📄 Fondo **paper-cream** con líneas sutiles tipo papel rayado
- ✏️ Formulario con inputs de **solo línea inferior** y date icon SVG custom
- 🦓 Tabla con **zebra-striping**, franjas de color por tipo y badges pill
- 🏛️ **Sello del total** ornamentado con borde doble y flourish SVG (`TotalStamp`)
- 🔲 Botones de borde doble (Generar Excel verde, Limpiar Todo ghost rojo)
- 📱 Mobile: tabs **Formulario/Historial** + cards individuales
- 🔤 Google Fonts: **Source Serif 4** (display), **Inter** (texto), **JetBrains Mono** (números)
- 🎛️ Tokens CSS centralizados (colores, tipografía, spacing, radius)

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React 19)                  │
│  Vite + Tailwind CSS v4 + Shadcn/UI + tRPC Client       │
└───────────────────────┬─────────────────────────────────┘
                        │ tRPC (HTTP)
┌───────────────────────▼─────────────────────────────────┐
│                      SERVER (Express + tRPC)             │
│  Middleware Clerk → Router → Controllers → Drizzle ORM   │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│               DATABASE (PostgreSQL - Neon)               │
│  users (auth Clerk) + deposits (datos financieros)       │
└─────────────────────────────────────────────────────────┘
```

**Estructura Monorepo:**
```
├── client/           # Frontend React 19
├── server/           # Backend Express + tRPC
│   ├── _core/       # Middleware Clerk, context, config
│   ├── db.ts        # Database operations
│   └── routers.ts   # tRPC routers
├── shared/           # Tipos y constantes compartidos
├── drizzle/          # Schema y migraciones DB
├── api/              # API routes (legacy serverless)
└── scripts/          # Utilidades de build
```

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.2 | UI Library |
| Vite | 7.3 | Build tool |
| Tailwind CSS | 4.3 | Utility-first CSS |
| Shadcn/UI | - | Component library |
| tRPC Client | 11.18 | Type-safe API |
| React Query | 5.10 | Server state |
| Framer Motion | 12.4 | Animaciones |
| Wouter | 3.7 | Routing |
| React Hook Form | 7.8 | Formularios |
| Zod | 4.4 | Validación |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Express | 4.22 | HTTP server |
| tRPC Server | 11.18 | Type-safe API |
| Drizzle ORM | 0.45 | Database ORM |
| PostgreSQL | - | Database (Neon) |
| Clerk (`@clerk/express`) | 2.1 | Autenticación |
| Zod | 4.4 | Validación |

### Base de Datos
| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios con `clerkId`, roles (admin/user), timestamps |
| `deposits` | Depósitos bancarios con foreign key a users |

---

## 🚀 Características Principales

### 💰 Gestión de Depósitos
- CRUD completo de depósitos bancarios
- Campos: fecha, número de cuenta, nombre del cliente, monto, tipo de depósito, remito, número de bolsa
- Filtrado por usuario autenticado
- Formularios con validación en tiempo real

### 📊 Exportación Excel
- Generación de archivos XLSX con formato profesional
- Columnas: Fecha, Cuenta, Cliente, Monto, Tipo, Remito, Bolsa
- Formato numérico y de fechas correcto
- Descarga directa desde el navegador

### 🔒 Seguridad
- **Clerk**: Gestión completa del ciclo de vida de autenticación con login custom email/password
- **tRPC Middleware**: Protección de rutas con `protectedProcedure` inyectando estado de Clerk
- **Roles**: Admin y User (configurables)
- **Zod**: Validación de inputs en client y server
- **SSL validado**: Conexión a Neon con verificación real de certificado

### 🎨 UI/UX
- Dashboard con tabla de depósitos (estilo libro contable)
- Formulario con validación en tiempo real
- Modal de edición inline
- Dialog de confirmación para eliminar
- Skeleton loading states
- Dark mode
- Responsive design (tabs en mobile)

---

## 📦 Guía de Inicio Rápido

### Requisitos
- Node.js 18+
- pnpm
- Cuenta en [Neon](https://neon.tech) (PostgreSQL serverless)
- Cuenta en [Clerk](https://clerk.com)

### Variables de Entorno

```env
DATABASE_URL=postgresql://...        # Connection string de Neon
CLERK_SECRET_KEY=sk_test_...         # Clerk secret key (server)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...  # Clerk publishable key (client)
```

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd generador-depositos-excel

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con DATABASE_URL, CLERK_SECRET_KEY y VITE_CLERK_PUBLISHABLE_KEY

# Ejecutar migraciones de BD
pnpm db:push

# Iniciar servidor de desarrollo
pnpm dev
```

### Comandos

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Desarrollo con hot reload (tsx watch) |
| `pnpm build` | Build de producción (Vite + esbuild) |
| `pnpm start` | Iniciar en producción |
| `pnpm check` | Type check con TypeScript |
| `pnpm format` | Formatear con Prettier |
| `pnpm test` | Ejecutar tests con Vitest |
| `pnpm db:push` | Generar y ejecutar migraciones |

---

## 📂 Estructura de Carpetas

```
generador-depositos-excel/
├── client/                    # Frontend React 19
│   └── src/
│       ├── components/
│       │   ├── ui/           # Shadcn/UI
│       │   ├── DepositForm.tsx
│       │   ├── DepositTable.tsx
│       │   ├── EditDepositModal.tsx
│       │   ├── DeleteConfirmDialog.tsx
│       │   ├── TotalStamp.tsx
│       │   ├── AIChatBox.tsx
│       │   └── DashboardLayout.tsx
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Login.tsx
│       │   └── NotFound.tsx
│       ├── hooks/
│       ├── contexts/
│       ├── _core/hooks/     # useAuth (Clerk)
│       └── lib/             # trpc.ts, excelExporter.ts
├── server/                    # Backend Express + tRPC
│   ├── _core/
│   │   ├── index.ts          # Entry point Express
│   │   ├── trpc.ts           # tRPC init + middleware
│   │   ├── clerk.ts          # Config Clerk
│   │   ├── context.ts        # Request context
│   │   └── env.ts            # Environment variables
│   ├── db.ts                 # Database operations
│   └── routers.ts            # tRPC routers
├── shared/                    # Tipos compartidos
│   └── const.ts              # Constantes
├── drizzle/                   # Drizzle ORM
│   ├── schema.ts             # Database schema
│   ├── migrations/           # Migraciones generadas
│   └── relations.ts          # Relaciones entre tablas
├── api/index.ts               # Entry point serverless (legacy)
├── scripts/                   # Build scripts
├── drizzle.config.ts          # Config Drizzle Kit
├── vite.config.ts             # Config Vite
├── vitest.config.ts           # Config Vitest
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencias
```

---

## 📊 API Endpoints

### Autenticación (Clerk)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/trpc/auth.login` | Iniciar sesión (custom email/password) |
| `POST` | `/api/trpc/auth.logout` | Cerrar sesión |
| `GET` | `/api/trpc/auth.me` | Obtener usuario actual |

> Soporta el flujo `needs_client_trust` de Clerk (verificación de email pendiente).

### Depósitos (autenticado)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/trpc/deposits.list` | Listar depósitos del usuario |
| `POST` | `/api/trpc/deposits.create` | Crear nuevo depósito |
| `POST` | `/api/trpc/deposits.update` | Actualizar depósito |
| `POST` | `/api/trpc/deposits.delete` | Eliminar depósito |

---

## 💡 Decisiones Arquitectónicas

### ¿Por qué tRPC?
- **Type safety**: Tipos compartidos entre client/server sin codegen
- **Zero overhead**: Sin esquemas GraphQL ni REST manual
- **Integración perfecta**: Funciona nativamente con React Query

### ¿Por qué Drizzle ORM?
- **TypeScript-first**: Tipos generados del schema
- **SQL-like**: Sintaxis cercana a SQL nativo
- **Migraciones**: Genera SQL migrations automáticas

### ¿Por qué Clerk?
- **Seguridad gestionada**: Sin implementar hash de contraseñas, sesiones ni CSRF
- **Login custom**: Formulario propio email/password manteniendo la estética del proyecto
- **Escalable**: Flujos de verificación de email, 2FA y OAuth listos para activar

### ¿Por qué Neon?
- **PostgreSQL serverless**: Escala a cero cuando no hay tráfico
- **SSL validado**: Conexión con verificación real de certificado
- **Branching**: Branches de BD para desarrollo y previews

---

## 🌐 Despliegue

### Render (Web Service)
- **URL producción**: https://generador-depositos-excel.onrender.com/
- **Config**: `render.yaml` (Blueprint) — Web Service con Node 22
- **Entry point**: `server/_core/index.ts` (servidor Express)
- **Build command**: `pnpm install --frozen-lockfile && pnpm build`
- **Start command**: `pnpm start`
- **Variables de entorno**: `DATABASE_URL`, `CLERK_SECRET_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`
- **Importante**: las variables `VITE_*` se inyectan al compilar el cliente; configurarlas en el dashboard de Render

---

> 💡 **Construido con React 19 + tRPC + Drizzle + Clerk** — Gestión financiera profesional con type safety de punta a punta y estética de libro contable.
