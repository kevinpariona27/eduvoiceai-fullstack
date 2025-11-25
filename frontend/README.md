# EduVoice AI - Frontend

Aplicación web React + TypeScript para el asistente de voz educativo EduVoice AI.

## 🚀 Características

- ✅ Chat interactivo con asistente de IA
- 🎤 Reconocimiento de voz en español
- 📝 Gestión de tareas con funcionalidad completa
- 📅 Calendario de eventos académicos
- 🎨 Interfaz moderna con Material-UI
- 🔄 Navegación con React Router
- 🌐 Integración con backend .NET

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend .NET corriendo en `http://localhost:5187` (configurable)

## 🔧 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd eduvoiceai-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` y configura:
   ```bash
   VITE_API_URL=http://localhost:5187
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   ```
   http://localhost:5173
   ```

## 🌍 Variables de Entorno

Este proyecto usa **Vite** que requiere el prefijo `VITE_` para exponer variables al cliente.

### Variables Disponibles:

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base del backend .NET | `http://localhost:5187` |

### Archivos de Configuración:

- `.env` - Tu configuración local (NO se sube a Git)
- `.env.example` - Plantilla con valores de ejemplo (SÍ se sube a Git)

### Cómo Usar:

```typescript
// En el código TypeScript
const apiUrl = import.meta.env.VITE_API_URL;
```

⚠️ **Importante**: Debes reiniciar el servidor de desarrollo después de cambiar `.env`

📚 **Más información**: Ver [ENV_VARIABLES.md](./ENV_VARIABLES.md)

## 🎓 EduVoice AI - Frontend

Sistema educativo inteligente con asistente de voz, gestión de tareas y calendario de eventos. Desarrollado con **React + TypeScript + Tailwind CSS** y asistido por **GitHub Copilot**.

![EduVoice AI](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Vite](https://img.shields.io/badge/Vite-7.2-purple)

## ✨ Características Principales

### 🔐 Autenticación Completa
- Sistema de registro e inicio de sesión
- Protección de rutas con autenticación
- Persistencia de sesión en localStorage
- Diseño minimalista slate moderno

### 🤖 Asistente Inteligente con Voz
- Chat con IA para consultas educativas
- **Reconocimiento de voz en español**
- Transcripción en tiempo real
- Respuestas contextuales
- Compatible con Chrome, Edge y Safari

### ✓ Gestión Inteligente de Tareas
- Crear, editar y eliminar tareas
- Marcar como completadas
- Prioridades (Alta, Media, Baja)
- **Planificación semanal automática**
- Sincronización con backend .NET

### 📅 Calendario de Eventos
- Visualización de eventos
- Gestión de fechas importantes
- Integración completa

### 🎨 Diseño 100% Responsivo
- **Mobile First**: Optimizado para móviles
- **Menú hamburguesa**: Navegación móvil
- **Colores minimalistas**: Paleta slate elegante
- **Animaciones suaves**: Experiencia fluida

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
Node.js 18+ y npm
Backend .NET API en http://localhost:5187
```

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/eduvoiceai-frontend.git
cd eduvoiceai-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# El archivo .env ya existe con:
# VITE_API_URL=http://localhost:5187

# Iniciar servidor de desarrollo
npm run dev
```

Aplicación disponible en: `http://localhost:5173`

## 📱 Uso

1. **Registrarse**: Crea tu cuenta con nombre, email y contraseña
2. **Iniciar sesión**: Accede con tus credenciales
3. **Chat con IA**: Usa texto o voz para preguntar
4. **Crear tareas**: Organiza tu trabajo con prioridades
5. **Ver calendario**: Gestiona tus eventos

## 🎯 Tecnologías

- **React 18.3** - Framework UI
- **TypeScript 5.6** - Tipado estático
- **Vite 7.2** - Build tool ultra-rápido
- **Tailwind CSS 3.4** - Estilos utility-first
- **Axios** - Cliente HTTP
- **React Router** - Navegación
- **Web Speech API** - Reconocimiento de voz

## 📁 Estructura

```
src/
├── api/              # Configuración API
├── components/       # Componentes reutilizables
│   ├── AssistantChat.tsx
│   ├── EventCalendar.tsx
│   ├── Layout.tsx
│   └── TaskPlanner.tsx
├── context/          # Contextos React
│   └── AuthContext.tsx
├── pages/            # Páginas
│   ├── Events.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   └── Tasks.tsx
└── App.tsx
```

## 🎨 Paleta de Colores Minimalista

- **Principal**: Slate 900 (`#0f172a`)
- **Fondo**: Slate 50 (`#f8fafc`)
- **Tarjetas**: Blanco (`#ffffff`)
- **Bordes**: Slate 200 (`#e2e8f0`)

## 🔧 Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Compilar
npm run preview  # Preview producción
npm run lint     # Linting
```

## 📝 API Backend

El frontend consume estos endpoints:

**Tareas:**
- `GET /api/taskplans` - Listar tareas
- `POST /api/taskplans` - Crear tarea
- `PATCH /api/taskplans/:id` - Actualizar
- `DELETE /api/taskplans/:id` - Eliminar

**IA:**
- `POST /api/ia/ask` - Consultar asistente

**Formato de tarea:**
```json
{
  "Title": "Estudiar",
  "Description": "Matemáticas",
  "DueDate": "2025-11-25T09:00:00",
  "Priority": "Alta",
  "IsCompleted": false,
  "UserId": 1
}
```

## 🤖 Desarrollado con GitHub Copilot

Este proyecto fue desarrollado con la asistencia de **GitHub Copilot**, demostrando cómo la IA puede acelerar el desarrollo de aplicaciones modernas.

### Contribuciones de Copilot:
- ✅ Generación de componentes React
- ✅ Integración de TypeScript
- ✅ Lógica de autenticación
- ✅ Transformación de datos backend/frontend
- ✅ Diseño responsivo con Tailwind
- ✅ Manejo de errores y validaciones

## 📱 Compatibilidad

**Navegadores:**
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+

**Dispositivos:**
- ✅ Móviles (320px+)
- ✅ Tablets (768px+)
- ✅ Desktop (1024px+)

## 🚢 Despliegue

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Subir dist/
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Add: nueva característica'`)
4. Push (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Ver `LICENSE`

## 👨‍💻 Autor

Desarrollado con ❤️ y asistido por **GitHub Copilot**

---

⭐ **¿Te gusta el proyecto? ¡Dale una estrella!**

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
