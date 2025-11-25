# 🎓 EduVoice AI - Sistema Completo (Fullstack)

> Sistema educativo inteligente con asistente de voz, autenticación y gestión de tareas  
> **Desarrollado completamente con GitHub Copilot**

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![.NET](https://img.shields.io/badge/.NET-8.0-purple.svg)](https://dotnet.microsoft.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## 📦 Estructura del Proyecto

Este es un **monorepo** que contiene tanto el frontend como el backend:

```
eduvoiceai-fullstack/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   ├── package.json
│   └── README.md
│
├── backend/           # .NET 8 Web API
│   ├── EduVoiceAI.API/
│   ├── EduVoiceAI.Domain/
│   ├── EduVoiceAI.Infrastructure/
│   └── EduVoiceAI.sln
│
└── README.md         # Este archivo
```

---

## ✨ Características Principales

### 🎨 Frontend (React)
- ✅ **Sistema de autenticación** con login/registro
- ✅ **Chat inteligente con IA** y reconocimiento de voz en español
- ✅ **Gestor de tareas** con CRUD completo y planificación semanal
- ✅ **Calendario de eventos** integrado
- ✅ **Diseño 100% responsivo** (móvil, tablet, desktop)
- ✅ **Paleta minimalista** con colores slate

### ⚡ Backend (.NET 8)
- ✅ **API RESTful** con arquitectura limpia
- ✅ **Entity Framework Core** para persistencia
- ✅ **SQL Server** como base de datos
- ✅ **CORS configurado** para desarrollo
- ✅ **Endpoints de tareas y eventos**
- ✅ **Validaciones y DTOs**

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- **Node.js** 18 o superior
- **.NET SDK** 8.0 o superior
- **SQL Server** (LocalDB o Express)
- **Git**

---

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/TU_USUARIO/eduvoiceai-fullstack.git
cd eduvoiceai-fullstack
```

---

### 2️⃣ Configurar y Ejecutar el Backend

```bash
# Navegar a la carpeta del backend
cd backend

# Restaurar dependencias
dotnet restore

# Actualizar la cadena de conexión en appsettings.json
# Editar: EduVoiceAI.API/appsettings.json

# Aplicar migraciones (crear base de datos)
cd EduVoiceAI.API
dotnet ef database update

# Ejecutar el backend
dotnet run
```

El backend estará disponible en: **http://localhost:5187**

---

### 3️⃣ Configurar y Ejecutar el Frontend

```bash
# Abrir una nueva terminal
# Navegar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Verificar que .env esté configurado
# VITE_API_URL=http://localhost:5187

# Ejecutar el frontend
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## 📖 Uso del Sistema

### Primera Vez
1. Abrir **http://localhost:5173**
2. Hacer clic en **"Regístrate"**
3. Completar el formulario de registro
4. Iniciar sesión automáticamente

### Funcionalidades
- **💬 Chat con IA**: Escribir o usar el micrófono para voz
- **✓ Crear tareas**: Ir a "Tareas" → "Nueva Tarea"
- **📅 Ver eventos**: Ir a "Eventos" para ver el calendario
- **🚪 Cerrar sesión**: Click en "Salir"

---

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.3 | Framework UI |
| TypeScript | 5.6 | Tipado estático |
| Vite | 7.2 | Build tool |
| Tailwind CSS | 3.4 | Estilos |
| React Router | 6.x | Navegación |
| Axios | 1.x | HTTP client |
| Web Speech API | - | Voz |

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| .NET | 8.0 | Framework |
| ASP.NET Core | 8.0 | Web API |
| Entity Framework Core | 8.0 | ORM |
| SQL Server | 2022 | Base de datos |
| Swagger/OpenAPI | - | Documentación |

---

## 🤖 Desarrollo con GitHub Copilot

Este proyecto fue desarrollado **completamente con GitHub Copilot** como asistente de IA:

### Frontend
- ✅ Componentes React con TypeScript
- ✅ Hooks personalizados (useAuth, useCallback)
- ✅ Integración con APIs REST
- ✅ Estilos Tailwind responsivos
- ✅ Manejo de estados y contextos

### Backend
- ✅ Controladores de API RESTful
- ✅ Entidades y modelos de dominio
- ✅ Repositorios y servicios
- ✅ Migraciones de Entity Framework
- ✅ Configuración de CORS y Swagger

### Documentación
- ✅ README completo
- ✅ Comentarios en código
- ✅ Guías de instalación
- ✅ Documentación de API

---

## 📊 Estadísticas del Proyecto

```
📁 Archivos totales: ~80 archivos
📝 Líneas de código: ~15,000 líneas

Frontend:
   • 33 archivos
   • ~9,000 líneas
   • 7 componentes React
   • 4 páginas

Backend:
   • ~50 archivos
   • ~6,000 líneas
   • 3 proyectos (.API, .Domain, .Infrastructure)
   • 5 controladores
   • 10+ entidades
```

---

## 🔗 API Endpoints

### Tareas
```
GET    /api/taskplans          # Obtener todas las tareas
POST   /api/taskplans          # Crear nueva tarea
PUT    /api/taskplans/{id}     # Actualizar tarea
DELETE /api/taskplans/{id}     # Eliminar tarea
```

### Eventos
```
GET    /api/events             # Obtener todos los eventos
POST   /api/events             # Crear nuevo evento
PUT    /api/events/{id}        # Actualizar evento
DELETE /api/events/{id}        # Eliminar evento
```

### IA Assistant
```
POST   /api/ia/mensaje         # Enviar mensaje al asistente
```

**Documentación completa:** http://localhost:5187/swagger

---

## 🌐 Compatibilidad

### Navegadores
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+

### Dispositivos
- ✅ Móviles (320px+)
- ✅ Tablets (768px+)
- ✅ Desktop (1024px+)

---

## 📁 Estructura Detallada

### Frontend (`/frontend`)
```
src/
├── api/
│   └── api.ts                # Configuración Axios
├── components/
│   ├── AssistantChat.tsx     # Chat con IA
│   ├── EventCalendar.tsx     # Calendario
│   ├── Layout.tsx            # Layout principal
│   └── TaskPlanner.tsx       # Gestor de tareas
├── context/
│   └── AuthContext.tsx       # Autenticación global
├── pages/
│   ├── Events.tsx            # Página de eventos
│   ├── Home.tsx              # Página principal
│   ├── Login.tsx             # Login/Registro
│   └── Tasks.tsx             # Página de tareas
├── App.tsx
└── main.tsx
```

### Backend (`/backend`)
```
EduVoiceAI.API/
├── Controllers/              # Controladores REST
│   ├── TaskPlansController.cs
│   ├── EventsController.cs
│   └── IAController.cs
├── Program.cs               # Configuración principal
└── appsettings.json        # Configuración

EduVoiceAI.Domain/
├── Entities/               # Entidades del dominio
└── Interfaces/            # Interfaces

EduVoiceAI.Infrastructure/
├── Data/                  # DbContext
├── Repositories/         # Repositorios
└── Migrations/          # Migraciones EF
```

---

## 🔒 Seguridad

- ✅ Variables de entorno para configuración sensible
- ✅ CORS configurado para desarrollo
- ✅ Validación de datos en backend
- ✅ Sanitización de entrada de usuario
- ✅ Contraseñas con mínimo de seguridad

---

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar que SQL Server esté corriendo
# Actualizar cadena de conexión en appsettings.json
# Ejecutar migraciones:
dotnet ef database update
```

### Frontend no conecta con backend
```bash
# Verificar que backend esté en http://localhost:5187
# Verificar archivo .env:
# VITE_API_URL=http://localhost:5187
```

### Errores de CORS
```bash
# Verificar que el backend tenga CORS habilitado en Program.cs
# El frontend debe estar en http://localhost:5173
```

---

## 📞 Soporte

**Repositorio GitHub:** https://github.com/TU_USUARIO/eduvoiceai-fullstack  
**Issues:** Reportar bugs o sugerencias en GitHub Issues  
**Documentación:** Ver README.md en carpetas frontend/ y backend/

---

## 🎓 Proyecto Académico

Este proyecto fue desarrollado como parte de un trabajo académico para demostrar las capacidades de **GitHub Copilot** como herramienta de desarrollo asistido por IA.

### Logros
- ✨ **Desarrollo acelerado** - Fullstack completo en tiempo reducido
- ✨ **Código de calidad** - TypeScript + C# con tipado fuerte
- ✨ **Arquitectura limpia** - Frontend/Backend separados
- ✨ **Buenas prácticas** - SOLID, Clean Architecture, DRY
- ✨ **Documentación completa** - READMEs y comentarios

---

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

---

## 🙏 Agradecimientos

- **GitHub Copilot** - Asistente de IA que aceleró el desarrollo
- **React Team** - Por el excelente framework
- **Microsoft .NET Team** - Por la plataforma robusta
- **Tailwind CSS** - Por el sistema de diseño

---

**Desarrollado con ❤️ y GitHub Copilot**  
**© 2025 EduVoice AI**

---

## 🚀 Comandos Rápidos

### Iniciar todo el sistema

**Terminal 1 (Backend):**
```bash
cd backend/EduVoiceAI.API
dotnet run
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

**Acceder a:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5187
- Swagger: http://localhost:5187/swagger
