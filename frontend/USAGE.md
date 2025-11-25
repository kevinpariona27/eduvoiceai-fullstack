# EduVoice AI - Frontend

Sistema de asistente educativo con IA, autenticación y diseño minimalista.

## 🚀 Características

### ✨ Nuevas Funcionalidades

- **🔐 Sistema de Login/Registro**
  - Registro de nuevos usuarios
  - Inicio de sesión
  - Protección de rutas
  - Persistencia de sesión en localStorage

- **🎨 Diseño Minimalista**
  - Colores slate (gris) para interfaz limpia
  - Totalmente responsivo (móvil, tablet, desktop)
  - Animaciones suaves
  - Componentes modernos con bordes redondeados

- **📱 Interfaz Responsiva**
  - Menú móvil hamburguesa
  - Tarjetas adaptables
  - Textos y espaciados optimizados
  - Funciona perfectamente en cualquier pantalla

### 📋 Funcionalidades Existentes

- 🤖 **Asistente de IA**: Chat con reconocimiento de voz
- ✓ **Gestor de Tareas**: Crear, editar y organizar tareas
- 📅 **Planificación Semanal**: Organización automática por semanas
- 🎤 **Reconocimiento de Voz**: Habla para interactuar

## 🎯 Cómo Usar

### 1. Primer Uso

1. **Abre la aplicación**: `http://localhost:5173`
2. **Verás la pantalla de login**
3. **Haz clic en "Regístrate"**
4. **Completa el formulario**:
   - Nombre completo
   - Correo electrónico
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
5. **Haz clic en "Crear cuenta"**

### 2. Iniciar Sesión

- Usa tu correo y contraseña
- Tu sesión se guarda automáticamente
- No necesitas volver a iniciar sesión cada vez

### 3. Navegación

**🏠 Inicio**
- Chat con el asistente de IA
- Accesos rápidos a tareas y eventos
- Estadísticas de progreso

**✓ Tareas**
- Ver todas tus tareas
- Crear nuevas tareas
- Marcar como completadas
- Eliminar tareas
- Planificación semanal automática

**📅 Eventos**
- Calendario de eventos (próximamente)

## 🎨 Guía de Diseño

### Paleta de Colores

- **Principal**: Slate 900 (#0f172a) - Botones y elementos principales
- **Fondo**: Slate 50 (#f8fafc) - Fondo general
- **Tarjetas**: Blanco (#ffffff) - Contenedores
- **Bordes**: Slate 200 (#e2e8f0) - Separadores
- **Texto**: Slate 900 para títulos, Slate 600 para secundario

### Componentes

- **Bordes**: Redondeados (rounded-xl, rounded-2xl)
- **Sombras**: Suaves y minimalistas
- **Espaciado**: Consistente y amplio
- **Tipografía**: Inter (sistema) para legibilidad

## 🛠️ Comandos

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 📱 Características Responsivas

### Móvil (< 768px)
- Menú hamburguesa
- Layout de una columna
- Botones adaptados
- Texto optimizado

### Tablet (768px - 1024px)
- Dos columnas cuando es posible
- Navegación completa
- Espaciado medio

### Desktop (> 1024px)
- Tres columnas en inicio
- Máximo aprovechamiento del espacio
- Experiencia completa

## 🔒 Seguridad

- Las contraseñas deben tener mínimo 6 caracteres
- La sesión se guarda en localStorage
- Las rutas están protegidas
- Redirección automática al login si no estás autenticado

## 💡 Tips

1. **Usa reconocimiento de voz**: Haz clic en el micrófono para dictar mensajes
2. **Organiza por semanas**: Las tareas se agrupan automáticamente
3. **Accesos rápidos**: Usa los botones del home para navegación rápida
4. **Responsivo**: Funciona perfectamente en tu teléfono

## ⚙️ Variables de Entorno

El archivo `.env` ya está configurado:

```env
VITE_API_URL=http://localhost:5187
```

## 🎯 Próximas Mejoras

- [ ] Integración completa con calendario
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Exportar tareas a PDF
- [ ] Integración con Google Calendar

---

**Desarrollado con ❤️ usando React + TypeScript + Tailwind CSS**
