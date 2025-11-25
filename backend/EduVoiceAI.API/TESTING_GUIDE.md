# ?? Guía de Pruebas - EduVoiceAI API

## ?? Inicio Rápido

### 1. Ejecutar la Aplicación

```bash
cd EduVoiceAI.API
dotnet run
```

Verás algo como:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
      Now listening on: http://localhost:5000
```

### 2. Abrir Swagger UI

Abre tu navegador en cualquiera de estas URLs:
- `https://localhost:5001/swagger`
- `http://localhost:5000/swagger`
- `https://localhost:5001/` (redirige automáticamente)

## ? Verificación de Swagger

### Deberías Ver:

#### Encabezado
- **Título**: "EduVoiceAI API - Documentación"
- **Versión**: v1
- **Descripción**: Con información sobre la API
- **Contacto**: EduVoiceAI Team

#### Tres Secciones de Endpoints
1. **?? Gestión de Usuarios** (UserProfiles)
2. **?? Gestión de Tareas** (TaskPlans)
3. **?? Gestión de Eventos** (EventReminders)

## ?? Escenarios de Prueba

### Escenario 1: CRUD de Usuarios

#### Paso 1: Crear un Usuario
1. Expandir `POST /api/UserProfiles`
2. Click en "Try it out"
3. Usar este JSON:
```json
{
  "name": "María García",
  "email": "maria.garcia@ejemplo.com"
}
```
4. Click en "Execute"
5. ? **Resultado esperado**: Código 201, usuario creado con ID

#### Paso 2: Listar Usuarios
1. Expandir `GET /api/UserProfiles`
2. Click en "Try it out"
3. Click en "Execute"
4. ? **Resultado esperado**: Código 200, lista con el usuario creado

#### Paso 3: Obtener Usuario por ID
1. Expandir `GET /api/UserProfiles/{id}`
2. Click en "Try it out"
3. Ingresar el ID del usuario creado (ej: 1)
4. Click en "Execute"
5. ? **Resultado esperado**: Código 200, datos del usuario

#### Paso 4: Actualizar Usuario
1. Expandir `PUT /api/UserProfiles/{id}`
2. Click en "Try it out"
3. Ingresar el ID
4. Modificar el JSON:
```json
{
  "id": 1,
  "name": "María García Rodríguez",
  "email": "maria.garcia@ejemplo.com",
  "createdAt": "2024-01-15T10:00:00Z"
}
```
5. Click en "Execute"
6. ? **Resultado esperado**: Código 204, sin contenido

#### Paso 5: Eliminar Usuario (OPCIONAL)
1. Expandir `DELETE /api/UserProfiles/{id}`
2. Click en "Try it out"
3. Ingresar el ID
4. Click en "Execute"
5. ? **Resultado esperado**: Código 204

---

### Escenario 2: Gestión de Tareas

#### Paso 1: Crear una Tarea
1. Primero, asegúrate de tener un usuario (ID: 1)
2. Expandir `POST /api/TaskPlans`
3. Click en "Try it out"
4. Usar este JSON:
```json
{
  "title": "Estudiar Cálculo",
  "description": "Repasar derivadas e integrales para el examen",
  "dueDate": "2024-12-31T23:59:59",
  "isCompleted": false,
  "userId": 1
}
```
5. Click en "Execute"
6. ? **Resultado esperado**: Código 201, tarea creada

#### Paso 2: Obtener Tareas por Usuario
1. Expandir `GET /api/TaskPlans/user/{userId}`
2. Click en "Try it out"
3. Ingresar userId: 1
4. Click en "Execute"
5. ? **Resultado esperado**: Código 200, lista de tareas del usuario

#### Paso 3: Marcar Tarea como Completada
1. Expandir `PATCH /api/TaskPlans/{id}/complete`
2. Click en "Try it out"
3. Ingresar el ID de la tarea
4. En el body, poner: `true`
5. Click en "Execute"
6. ? **Resultado esperado**: Código 204

#### Paso 4: Verificar el Cambio
1. Usar `GET /api/TaskPlans/{id}`
2. ? **Resultado esperado**: `isCompleted: true`

---

### Escenario 3: Eventos y Recordatorios

#### Paso 1: Crear Varios Eventos
Crear estos tres eventos usando `POST /api/EventReminders`:

**Evento 1 - Examen:**
```json
{
  "title": "Examen de Física",
  "description": "Examen final - Mecánica Cuántica",
  "date": "2024-12-20T10:00:00",
  "type": "Examen",
  "userId": 1
}
```

**Evento 2 - Cumpleaños:**
```json
{
  "title": "Cumpleaños de Juan",
  "description": "Fiesta en su casa",
  "date": "2024-12-25T18:00:00",
  "type": "Cumpleaños",
  "userId": 1
}
```

**Evento 3 - Clase:**
```json
{
  "title": "Clase de Programación",
  "description": "Introducción a .NET 9",
  "date": "2024-12-15T09:00:00",
  "type": "Clase",
  "userId": 1
}
```

#### Paso 2: Filtrar por Tipo
1. Expandir `GET /api/EventReminders/type/{type}`
2. Click en "Try it out"
3. Ingresar type: `Examen`
4. Click en "Execute"
5. ? **Resultado esperado**: Solo eventos de tipo "Examen"

#### Paso 3: Obtener Eventos Próximos
1. Expandir `GET /api/EventReminders/upcoming/{days}`
2. Click en "Try it out"
3. Ingresar days: `30` (próximos 30 días)
4. Click en "Execute"
5. ? **Resultado esperado**: Eventos ordenados por fecha

#### Paso 4: Eventos por Usuario
1. Expandir `GET /api/EventReminders/user/{userId}`
2. Click en "Try it out"
3. Ingresar userId: 1
4. Click en "Execute"
5. ? **Resultado esperado**: Todos los eventos del usuario

---

## ?? Validaciones a Probar

### Validación 1: Email Inválido
1. Intentar crear usuario con email incorrecto:
```json
{
  "name": "Test Usuario",
  "email": "email-invalido"
}
```
2. ? **Resultado esperado**: Código 400, error de validación

### Validación 2: Campos Obligatorios
1. Intentar crear tarea sin título:
```json
{
  "description": "Solo descripción",
  "dueDate": "2024-12-31T23:59:59",
  "userId": 1
}
```
2. ? **Resultado esperado**: Código 400, error de validación

### Validación 3: Usuario No Existe
1. Intentar crear tarea con userId inexistente:
```json
{
  "title": "Tarea de prueba",
  "description": "Descripción",
  "dueDate": "2024-12-31T23:59:59",
  "userId": 9999
}
```
2. ? **Resultado esperado**: Código 400, "Usuario no existe"

### Validación 4: Recurso No Encontrado
1. Intentar obtener usuario con ID inexistente:
   - `GET /api/UserProfiles/9999`
2. ? **Resultado esperado**: Código 404, "Usuario no encontrado"

---

## ?? Checklist de Verificación

### Funcionalidad General
- [ ] Swagger UI se carga correctamente
- [ ] Título "EduVoiceAI API" visible
- [ ] Versión "v1" mostrada
- [ ] Información de contacto presente

### Controladores Visibles
- [ ] UserProfiles (5 endpoints)
- [ ] TaskPlans (7 endpoints)
- [ ] EventReminders (8 endpoints)

### Documentación
- [ ] Cada endpoint tiene descripción
- [ ] Parámetros documentados
- [ ] Códigos de respuesta visibles
- [ ] Ejemplos de JSON disponibles
- [ ] Esquemas de DTOs completos

### Funcionalidad Try It Out
- [ ] Botón "Try it out" funciona
- [ ] Campos editables aparecen
- [ ] Botón "Execute" funciona
- [ ] Respuestas se muestran correctamente
- [ ] Duración de request visible

### Validaciones
- [ ] Emails inválidos rechazados
- [ ] Campos requeridos validados
- [ ] IDs inexistentes retornan 404
- [ ] Usuario inexistente retorna 400

### CRUD Completo
- [ ] CREATE (POST) funciona
- [ ] READ (GET) funciona
- [ ] UPDATE (PUT) funciona
- [ ] DELETE funciona
- [ ] Filtros personalizados funcionan

---

## ?? Resultado Final Esperado

Al completar todas las pruebas, deberías tener:

? **1 Usuario** creado y verificado
? **1+ Tareas** creadas, algunas completadas
? **3 Eventos** de diferentes tipos
? **Todas las operaciones CRUD** probadas exitosamente
? **Validaciones** funcionando correctamente
? **Filtros** operativos (por usuario, tipo, fechas)

---

## ?? Solución de Problemas

### Error: "No se puede conectar a la base de datos"
- Verificar que SQL Server esté ejecutándose
- Ejecutar: `dotnet ef database update`

### Error: "Usuario no existe" al crear tarea
- Primero crear un usuario con POST /api/UserProfiles
- Usar el ID devuelto en la tarea

### Swagger no muestra comentarios XML
- Verificar que `EduVoiceAI.API.xml` se generó en la carpeta bin
- Compilar de nuevo: `dotnet build`

### Error 500 en cualquier operación
- Revisar logs en la consola
- Verificar cadena de conexión en appsettings.json

---

## ?? Soporte

Si encuentras problemas:
1. Verificar que la base de datos está actualizada
2. Revisar logs en la consola
3. Comprobar que todos los paquetes están restaurados

¡Disfruta probando la API! ??
