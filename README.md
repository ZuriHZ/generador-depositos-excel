# 📊 Generador de Depósitos Excel

Aplicación fullstack para gestión profesional de depósitos bancarios con exportación a Excel, formularios validados y seguridad JWT — construida con React 19, tRPC, Drizzle ORM y PostgreSQL.

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

- 🔧 **Arquitectura**: Migración a monorepo con separación clara client/server/shared
- 🔐 **Seguridad**: Autenticación profesional con Clerk (UI segura, prevención de bots)
- 📊 **Exportación Excel**: Generación de XLSX con formato profesional
- 🎨 **UI/UX**: Shadcn/UI + Tailwind CSS v4 + Framer Motion
- ✅ **Validación**: Zod para schemas compartidos client/server
- 🗄️ **Base de datos**: Drizzle ORM con PostgreSQL (Neon Serverless)

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
│  Middleware Auth → Router → Controllers → Drizzle ORM    │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│               DATABASE (PostgreSQL - Neon)               │
│  users (datos) + deposits (datos financieros)            │
└─────────────────────────────────────────────────────────┘
```

**Estructura Monorepo:**
```
├── client/           # Frontend React 19
├── server/           # Backend Express + tRPC
│   ├── _core/       # Middleware, context, config
│   ├── db.ts        # Database operations
│   └── routers.ts   # tRPC routers
├── shared/           # Tipos y constantes compartidos
├── drizzle/          # Schema y migraciones DB
├── api/              # API routes
└── scripts/          # Utilidades de build
```

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.2 | UI Library |
| Vite | 7.3 | Build tool |
| Tailwind CSS | 4.2 | Utility-first CSS |
| Shadcn/UI | - | Component library |
| tRPC Client | 11.10 | Type-safe API |
| React Query | 5.90 | Server state |
| Framer Motion | 12.34 | Animaciones |
| Wouter | 3.7 | Routing |
| Zod | 4.3 | Validación |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Express | 4.22 | HTTP server |
| tRPC Server | 11.10 | Type-safe API |
| Drizzle ORM | 0.45 | Database ORM |
| PostgreSQL | - | Database |
| Clerk SDK | 2.1 | Autenticación |
| Zod | 4.3 | Validación |

### Base de Datos
| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios con auth, roles (admin/user), timestamps |
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
- **Clerk**: Gestión completa del ciclo de vida de autenticación.
- **tRPC Middleware**: Protección de rutas con `protectedProcedure` inyectando estado de Clerk.
- **Roles**: Admin y User (configurables).
- **Zod**: Validación de inputs en client y server.

### 🎨 UI/UX
- Dashboard con tabla de depósitos
- Formulario con validación en tiempo real
- Modal de edición inline
- Dialog de confirmación para eliminar
- Skeleton loading states
- Dark mode
- Responsive design

---

## 📦 Guía de Inicio Rápido

### Requisitos
- Node.js 18+
- pnpm
- PostgreSQL (Neon)
- Cuenta en Clerk

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd generador-depositos-excel

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL (Neon) y CLERK_KEYS

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
│       │   └── DashboardLayout.tsx
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Login.tsx
│       │   └── NotFound.tsx
│       ├── hooks/
│       ├── contexts/
│       └── lib/
├── server/                    # Backend Express + tRPC
│   ├── _core/
│   │   ├── index.ts          # Entry point Express
│   │   ├── trpc.ts           # tRPC init + middleware
│   │   ├── context.ts        # Request context
│   │   ├── cookies.ts        # Cookie helpers
│   │   ├── env.ts            # Environment variables
│   │   └── vite.ts           # Vite dev/prod serving
│   ├── db.ts                 # Database operations
│   ├── routers.ts            # tRPC routers
│   └── storage.ts            # Storage utilities
├── shared/                    # Tipos compartidos
│   └── const.ts              # Constantes (nombres de cookies, etc.)
├── drizzle/                   # Drizzle ORM
│   ├── schema.ts             # Database schema
│   ├── migrations/           # Migraciones generadas
│   └── relations.ts          # Relaciones entre tablas
├── api/                       # API routes
├── scripts/                   # Build scripts
├── drizzle.config.ts          # Config Drizzle Kit
├── vite.config.ts             # Config Vite
├── vitest.config.ts           # Config Vitest
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencias
```

---

## 🔒 Seguridad

### Autenticación JWT
- Tokens generados con `jose` (librería moderna y segura)
- Almacenados en cookies `httpOnly: true` (no accesibles via JavaScript)
- Expiración de 1 año para sesiones activas
- Validación automática en middleware tRPC

### Hash de Contraseñas
- Bcryptjs con salt rounds automático
- Nunca se almacenan passwords en texto plano

### Protección de Rutas
```typescript
// Solo usuarios autenticados
const protectedProcedure = t.procedure.use(requireUser);

// Solo administradores
const adminProcedure = t.procedure.use(requireAdmin);
```

### Validación de Inputs
- Zod schemas compartidos entre client y server
- Validación automática en tRPC procedures
- Sanitización de datos sensibles

---

## 📊 API Endpoints

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/trpc/auth.login` | Iniciar sesión |
| `POST` | `/api/trpc/auth.logout` | Cerrar sesión |
| `GET` | `/api/trpc/auth.me` | Obtener usuario actual |

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
- **Performance**: Más rápido que Prisma en benchmarks
- **Migraciones**: Genera SQL migrations automáticas

### ¿Por qué Zustand en lugar de Redux?
- **Simplicidad**: Sin reducers ni actions
- **Bundle size**: Mucho más ligero
- **Devtools**: Soporte para Redux DevTools

### ¿Por qué Wouter en lugar de React Router?
- **Tamaño**: ~2KB vs ~12KB de React Router
- **Rendimiento**: APIs más simples y rápidas
- **Compatibilidad**: API similar a React Router

---

## 🚀 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Desarrollo con hot reload |
| `pnpm build` | Build de producción |
| `pnpm start` | Iniciar en producción |
| `pnpm check` | Type check |
| `pnpm format` | Formatear código |
| `pnpm test` | Ejecutar tests |
| `pnpm db:push` | Ejecutar migraciones DB |

---

## 🌐 Despliegue

### Vercel
- Soporte nativo para Vercel con `vercel.json`
- Variables de entorno: `DATABASE_URL`
- Build: `vite build && esbuild server --bundle`

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

---

> 💡 **Construido con React 19 + tRPC + Drizzle** — Gestión financiera profesional con type safety de punta a punta.
