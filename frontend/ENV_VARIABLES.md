# Variables de Entorno en EduVoice AI Frontend

## 📋 Descripción

Este proyecto usa **variables de entorno** para configurar la URL del backend y otras configuraciones sensibles. Esto permite cambiar fácilmente entre diferentes entornos (desarrollo, staging, producción) sin modificar el código.

## 🔧 Configuración de Vite

**Vite** (el bundler que usa este proyecto) tiene reglas específicas para las variables de entorno:

### ✅ Reglas de Vite para Variables de Entorno:

1. **Prefijo obligatorio `VITE_`**: Solo las variables que empiezan con `VITE_` son expuestas al código del cliente
2. **Acceso mediante `import.meta.env`**: Se accede con `import.meta.env.VITE_NOMBRE_VARIABLE`
3. **No usar `process.env`**: A diferencia de Node.js, Vite usa `import.meta.env`
4. **Son reemplazadas en tiempo de build**: Las variables se insertan estáticamente en el código

### ⚠️ Importante:
- Las variables **NO** se recargan automáticamente - debes reiniciar el servidor de desarrollo después de cambiar `.env`
- Solo las variables con prefijo `VITE_` están disponibles en el código del cliente
- Las variables sin prefijo están disponibles solo en archivos de configuración de Vite

## 📁 Archivos de Variables de Entorno

### `.env`
- Contiene las variables de entorno reales
- **NO se sube a Git** (está en .gitignore)
- Cada desarrollador tiene su propia copia local
- Contiene valores específicos de tu entorno de desarrollo

### `.env.example`
- Plantilla con todas las variables necesarias
- **SÍ se sube a Git**
- Los nuevos desarrolladores copian este archivo como `.env`
- Contiene valores de ejemplo o placeholder

## 🔑 Variables Disponibles

### `VITE_API_URL`
- **Descripción**: URL base del backend .NET API
- **Desarrollo**: `http://localhost:5187`
- **Producción**: URL de tu servidor en Azure/AWS/etc.
- **Uso en código**:
  ```typescript
  const apiUrl = import.meta.env.VITE_API_URL;
  ```

## 🚀 Cómo Usar

### Para un nuevo desarrollador:

1. **Copiar el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Editar `.env` con tus valores:**
   ```bash
   VITE_API_URL=http://localhost:5187
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Verificar en la consola del navegador:**
   - Deberías ver: `🔗 API Base URL: http://localhost:5187`

### Para agregar nuevas variables:

1. **En `.env`:**
   ```bash
   VITE_NUEVA_VARIABLE=valor
   ```

2. **En el código TypeScript:**
   ```typescript
   const miVariable = import.meta.env.VITE_NUEVA_VARIABLE;
   ```

3. **Agregar en `.env.example`:**
   ```bash
   VITE_NUEVA_VARIABLE=valor_de_ejemplo
   ```

4. **Reiniciar el servidor de desarrollo**

## 🌍 Diferentes Entornos

Puedes crear archivos específicos por entorno:

- `.env.development` - Solo en desarrollo
- `.env.production` - Solo en producción
- `.env.local` - Local, sobrescribe otros (no se sube a Git)

**Prioridad de carga:**
1. `.env.local` (mayor prioridad)
2. `.env.[mode].local`
3. `.env.[mode]`
4. `.env`

## 📝 Ejemplo de Uso en el Proyecto

### En `src/api/api.ts`:
```typescript
import axios from "axios";

// Obtener la URL de la API desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5187";

export const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});
```

### Beneficios:
- ✅ Fácil cambio entre desarrollo y producción
- ✅ No hardcodear URLs en el código
- ✅ Configuración centralizada
- ✅ Diferentes valores por desarrollador
- ✅ Seguridad: datos sensibles no en Git

## 🔍 Debugging

### Ver todas las variables disponibles:
```typescript
console.log(import.meta.env);
```

### Verificar una variable específica:
```typescript
console.log("API URL:", import.meta.env.VITE_API_URL);
```

### Si la variable no se carga:
1. Verifica que empiece con `VITE_`
2. Reinicia el servidor de desarrollo (`Ctrl+C` y `npm run dev`)
3. Revisa que `.env` esté en la raíz del proyecto
4. Verifica que no haya errores de sintaxis en `.env`

## 🛡️ Seguridad

### ⚠️ NUNCA pongas en variables `VITE_`:
- Claves API secretas
- Passwords de base de datos
- Tokens de autenticación privados
- Cualquier dato sensible que no deba ser público

### ✅ Recuerda:
- Las variables `VITE_` son **públicas** y están expuestas en el código del cliente
- Cualquiera puede ver su valor inspeccionando el código JavaScript
- Solo usa `VITE_` para URLs públicas y configuraciones no sensibles
- Para datos sensibles, manéjalos solo en el backend

## 📚 Más Información

- [Documentación de Vite sobre Variables de Entorno](https://vitejs.dev/guide/env-and-mode.html)
- [Variables de Entorno en Modo Producción](https://vitejs.dev/guide/env-and-mode.html#production-replacement)
