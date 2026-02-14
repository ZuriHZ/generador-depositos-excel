# 📊 Generador de Depósitos Bancarios a Excel

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-%232596be.svg?style=for-the-badge&logo=trpc&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F015?style=for-the-badge&logo=drizzle&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Este proyecto es una aplicación **Full-Stack** moderna y robusta diseñada para la gestión profesional de depósitos bancarios y su posterior exportación a formatos compatibles con hojas de cálculo.

---

## 🛠️ Origen y Evolución del Proyecto

Este proyecto nació de una base generada con **Manus AI**, la cual utilicé como punto de partida para acelerar el desarrollo inicial. Sin embargo, realicé profundas personalizaciones y mejoras críticas para convertirlo en una herramienta lista para producción:

- **Integración con Supabase**: Reconstruí la capa de datos para conectar el proyecto con una base de datos PostgreSQL hospedada en Supabase, configurando la cadena de conexión y optimizando las consultas con Drizzle ORM.
- **Refactorización del Diseño**: Rediseñé la interfaz de usuario para lograr una estética más limpia, corporativa y profesional, ajustando componentes de Radix UI y personalizando estilos en Tailwind CSS 4.
- **Lógica de Negocio Adaptada**: Ajusté los esquemas de validación (Zod) y los endpoints de tRPC para cumplir con las necesidades específicas de la gestión financiera real.

---

## 🛠️ Stack Tecnológico (Power Stack)

El proyecto utiliza una arquitectura de vanguardia para garantizar el máximo rendimiento y seguridad:

### **Frontend**

- **React 19**: Aprovechando las últimas mejoras de rendimiento y hooks del ecosistema.
- **Tailwind CSS 4**: Motor de estilos de próxima generación para una interfaz ultra-rápida y personalizable.
- **Shadcn/UI & Radix UI**: Componentes de interfaz accesibles, minimalistas y altamente estéticos.
- **Wouter**: Enrutador ligero y eficiente optimizado para aplicaciones modernas.
- **TanStack Query (v5)**: Gestión inteligente de caché y sincronización de datos con el servidor.

### **Backend & API**

- **tRPC**: Comunicación **End-to-End Type-Safe** entre cliente y servidor.
- **Node.js & Express**: Servidor ligero para manejar la lógica de negocio.
- **Zod**: Validación estricta de esquemas y datos.

### **Base de Datos & Almacenamiento**

- **Drizzle ORM**: El ORM más rápido y ligero para TypeScript.
- **PostgreSQL (Supabase)**: Motor de base de datos relacional de alta fiabilidad.

---

## 🚀 Características Principales

- **Gestión Profesional de Depósitos**: Registro detallado con formularios validados.
- **Exportación Inteligente**: Motor basado en `XLSX` para generar reportes en Excel perfectamente formateados.
- **Seguridad Garantizada**:
  - Hash de contraseñas mediante **Bcryptjs**.
  - Autenticación segura con **JOSE (JWT)** y cookies `httpOnly`.
- **Arquitectura Limpia**: Separación clara entre `/client`, `/server` y `/shared`.

---

## 📦 Guía de Inicio Rápido

### Requisitos Previos

- Node.js (v20+)
- **PNPM** (v10)

### 1. Preparación del Entorno

```bash
pnpm install
```

### 2. Configuración de Variables

Crea tu archivo `.env`:

```env
DATABASE_URL="tu_url_de_postgress_supabase"
JWT_SECRET="una_cadena_secreta_para_tokens"
PORT=3000
```

### 3. Sincronización de Base de Datos

```bash
pnpm db:push
```

### 4. Inicializar Administrador

```bash
npx tsx scripts/seed-admin.ts
```

---

## 📂 Estructura del Proyecto

- `client/`: Aplicación React + Vite.
- `server/`: Servidor Express + tRPC.
- `shared/`: Tipos compartidos y esquemas de Zod.
- `drizzle/`: Definiciones de tablas y configuración de base de datos.
- `scripts/`: Herramientas de utilidad y seeding.

---

Desarrollado con precisión, integrando el poder de la IA con el control y personalización del desarrollo especializado. 📈
