# ?? Ejemplos de Peticiones HTTP - EduVoiceAI API

## ?? UserProfiles API

### Base URL
```
https://localhost:5001/api/UserProfiles
```

---

### ? GET - Obtener todos los usuarios
```http
GET https://localhost:5001/api/UserProfiles
Accept: application/json
```

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan.perez@eduvoice.com",
    "createdAt": "2024-06-15T10:30:00Z"
  },
  {
    "id": 2,
    "name": "María García",
    "email": "maria.garcia@eduvoice.com",
    "createdAt": "2024-08-20T14:15:00Z"
  }
]
```

---

### ? GET - Obtener usuario por ID
```http
GET https://localhost:5001/api/UserProfiles/1
Accept: application/json
```

**Respuesta esperada (200 OK):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan.perez@eduvoice.com",
  "createdAt": "2024-06-15T10:30:00Z"
}
```

---

### ? POST - Crear nuevo usuario

**Petición:**
```http
POST https://localhost:5001/api/UserProfiles
Content-Type: application/json

{
  "name": "Pedro Sánchez",
  "email": "pedro.sanchez@eduvoice.com"
}
```

**Ejemplo con cURL:**
```bash
curl -X POST "https://localhost:5001/api/UserProfiles" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Sánchez",
    "email": "pedro.sanchez@eduvoice.com"
  }'
```

**Ejemplo para Postman/Thunder Client:**
```json
{
  "name": "Pedro Sánchez",
  "email": "pedro.sanchez@eduvoice.com"
}
```

**Respuesta esperada (201 Created):**
```json
{
  "id": 5,
  "name": "Pedro Sánchez",
  "email": "pedro.sanchez@eduvoice.com",
  "createdAt": "2024-12-15T10:00:00Z"
}
```

---

### ? POST - Más ejemplos de creación

**Ejemplo 2 - Usuario femenino:**
```json
{
  "name": "Laura Fernández",
  "email": "laura.fernandez@eduvoice.com"
}
```

**Ejemplo 3 - Usuario con nombre compuesto:**
```json
{
  "name": "José Antonio Ramírez",
  "email": "jose.ramirez@eduvoice.com"
}
```

**Ejemplo 4 - Usuario estudiante:**
```json
{
  "name": "Sofía Morales",
  "email": "sofia.morales@estudiante.com"
}
```

---

### ? PUT - Actualizar usuario existente

**Petición:**
```http
PUT https://localhost:5001/api/UserProfiles/1
Content-Type: application/json

{
  "id": 1,
  "name": "Juan Pérez García",
  "email": "juan.perez.garcia@eduvoice.com",
  "createdAt": "2024-06-15T10:30:00Z"
}
```

**Ejemplo con cURL:**
```bash
curl -X PUT "https://localhost:5001/api/UserProfiles/1" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "name": "Juan Pérez García",
    "email": "juan.perez.garcia@eduvoice.com",
    "createdAt": "2024-06-15T10:30:00Z"
  }'
```

**Respuesta esperada (204 No Content):**
Sin contenido en el cuerpo de la respuesta.

---

### ? PUT - Más ejemplos de actualización

**Ejemplo 2 - Cambiar solo el email:**
```json
{
  "id": 2,
  "name": "María García",
  "email": "maria.garcia.nueva@eduvoice.com",
  "createdAt": "2024-08-20T14:15:00Z"
}
```

**Ejemplo 3 - Actualizar nombre completo:**
```json
{
  "id": 3,
  "name": "Carlos Alberto López Martínez",
  "email": "carlos.lopez@eduvoice.com",
  "createdAt": "2024-09-10T09:00:00Z"
}
```

---

### ? DELETE - Eliminar usuario

```http
DELETE https://localhost:5001/api/UserProfiles/5
```

**Respuesta esperada (204 No Content):**
Sin contenido.

---

## ?? TaskPlans API

### Base URL
```
https://localhost:5001/api/TaskPlans
```

---

### ? GET - Obtener todas las tareas
```http
GET https://localhost:5001/api/TaskPlans
Accept: application/json
```

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Estudiar Matemáticas",
    "description": "Repasar capítulos 1-5 de cálculo diferencial",
    "dueDate": "2024-12-22T23:59:59Z",
    "isCompleted": false,
    "userId": 1
  }
]
```

---

### ? GET - Obtener tarea por ID
```http
GET https://localhost:5001/api/TaskPlans/1
Accept: application/json
```

---

### ? GET - Obtener tareas por usuario
```http
GET https://localhost:5001/api/TaskPlans/user/1
Accept: application/json
```

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Estudiar Matemáticas",
    "description": "Repasar capítulos 1-5 de cálculo diferencial",
    "dueDate": "2024-12-22T23:59:59Z",
    "isCompleted": false,
    "userId": 1
  },
  {
    "id": 2,
    "title": "Proyecto de Física",
    "description": "Completar el proyecto sobre mecánica cuántica",
    "dueDate": "2024-12-29T23:59:59Z",
    "isCompleted": false,
    "userId": 1
  }
]
```

---

### ? POST - Crear nueva tarea

**Ejemplo 1 - Tarea de estudio:**
```http
POST https://localhost:5001/api/TaskPlans
Content-Type: application/json

{
  "title": "Estudiar para Examen de Historia",
  "description": "Repasar los capítulos 10-15 sobre la Segunda Guerra Mundial",
  "dueDate": "2024-12-20T23:59:59",
  "isCompleted": false,
  "userId": 1
}
```

**Ejemplo con cURL:**
```bash
curl -X POST "https://localhost:5001/api/TaskPlans" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudiar para Examen de Historia",
    "description": "Repasar los capítulos 10-15 sobre la Segunda Guerra Mundial",
    "dueDate": "2024-12-20T23:59:59",
    "isCompleted": false,
    "userId": 1
  }'
```

**Respuesta esperada (201 Created):**
```json
{
  "id": 9,
  "title": "Estudiar para Examen de Historia",
  "description": "Repasar los capítulos 10-15 sobre la Segunda Guerra Mundial",
  "dueDate": "2024-12-20T23:59:59Z",
  "isCompleted": false,
  "userId": 1
}
```

---

### ? POST - Más ejemplos de tareas

**Ejemplo 2 - Tarea de programación:**
```json
{
  "title": "Completar Ejercicios de C#",
  "description": "Resolver los ejercicios 1-20 del capítulo de LINQ y Entity Framework",
  "dueDate": "2024-12-18T18:00:00",
  "isCompleted": false,
  "userId": 2
}
```

**Ejemplo 3 - Proyecto largo plazo:**
```json
{
  "title": "Desarrollar API REST",
  "description": "Crear una API completa con .NET 9, Entity Framework y SQL Server para el proyecto final",
  "dueDate": "2025-01-15T23:59:59",
  "isCompleted": false,
  "userId": 2
}
```

**Ejemplo 4 - Tarea de lectura:**
```json
{
  "title": "Leer libro de Clean Code",
  "description": "Leer y tomar notas de los capítulos 1-5 sobre principios SOLID",
  "dueDate": "2024-12-25T20:00:00",
  "isCompleted": false,
  "userId": 3
}
```

**Ejemplo 5 - Tarea corta:**
```json
{
  "title": "Revisar correos académicos",
  "description": "Revisar y responder correos pendientes de profesores",
  "dueDate": "2024-12-16T12:00:00",
  "isCompleted": false,
  "userId": 1
}
```

**Ejemplo 6 - Tarea con fecha específica:**
```json
{
  "title": "Preparar presentación PowerPoint",
  "description": "Crear presentación de 20 slides sobre inteligencia artificial",
  "dueDate": "2024-12-19T09:00:00",
  "isCompleted": false,
  "userId": 4
}
```

---

### ? PUT - Actualizar tarea completa

**Petición:**
```http
PUT https://localhost:5001/api/TaskPlans/1
Content-Type: application/json

{
  "id": 1,
  "title": "Estudiar Matemáticas Avanzadas",
  "description": "Repasar capítulos 1-8 de cálculo diferencial e integral",
  "dueDate": "2024-12-25T23:59:59",
  "isCompleted": false,
  "userId": 1
}
```

**Ejemplo con cURL:**
```bash
curl -X PUT "https://localhost:5001/api/TaskPlans/1" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "title": "Estudiar Matemáticas Avanzadas",
    "description": "Repasar capítulos 1-8 de cálculo diferencial e integral",
    "dueDate": "2024-12-25T23:59:59",
    "isCompleted": false,
    "userId": 1
  }'
```

**Respuesta esperada (204 No Content):**
Sin contenido.

---

### ? PUT - Más ejemplos de actualización

**Ejemplo 2 - Marcar como completada y extender fecha:**
```json
{
  "id": 2,
  "title": "Proyecto de Física",
  "description": "Completar el proyecto sobre mecánica cuántica - ACTUALIZADO con más referencias",
  "dueDate": "2025-01-05T23:59:59",
  "isCompleted": true,
  "userId": 1
}
```

**Ejemplo 3 - Cambiar descripción:**
```json
{
  "id": 3,
  "title": "Leer capítulo de Historia",
  "description": "Leer, resumir y crear mapa conceptual del capítulo sobre la Revolución Industrial",
  "dueDate": "2024-12-18T23:59:59",
  "isCompleted": false,
  "userId": 1
}
```

---

### ? PATCH - Marcar tarea como completada

**Marcar como completada:**
```http
PATCH https://localhost:5001/api/TaskPlans/1/complete
Content-Type: application/json

true
```

**Marcar como no completada:**
```http
PATCH https://localhost:5001/api/TaskPlans/1/complete
Content-Type: application/json

false
```

**Ejemplo con cURL (completar):**
```bash
curl -X PATCH "https://localhost:5001/api/TaskPlans/1/complete" \
  -H "Content-Type: application/json" \
  -d 'true'
```

**Ejemplo con cURL (desmarcar):**
```bash
curl -X PATCH "https://localhost:5001/api/TaskPlans/1/complete" \
  -H "Content-Type: application/json" \
  -d 'false'
```

**Respuesta esperada (204 No Content):**
Sin contenido.

---

### ? DELETE - Eliminar tarea

```http
DELETE https://localhost:5001/api/TaskPlans/5
```

---

## ?? EventReminders API

### Base URL
```
https://localhost:5001/api/EventReminders
```

---

### ? GET - Obtener todos los eventos
```http
GET https://localhost:5001/api/EventReminders
Accept: application/json
```

---

### ? GET - Obtener evento por ID
```http
GET https://localhost:5001/api/EventReminders/1
Accept: application/json
```

---

### ? GET - Obtener eventos por usuario
```http
GET https://localhost:5001/api/EventReminders/user/1
Accept: application/json
```

---

### ? GET - Obtener eventos por tipo
```http
GET https://localhost:5001/api/EventReminders/type/Examen
Accept: application/json
```

**Otros tipos disponibles:**
```http
GET https://localhost:5001/api/EventReminders/type/Cumpleaños
GET https://localhost:5001/api/EventReminders/type/Clase
GET https://localhost:5001/api/EventReminders/type/Reunión
GET https://localhost:5001/api/EventReminders/type/Proyecto
```

---

### ? GET - Obtener eventos próximos

**Próximos 7 días:**
```http
GET https://localhost:5001/api/EventReminders/upcoming/7
Accept: application/json
```

**Próximos 30 días:**
```http
GET https://localhost:5001/api/EventReminders/upcoming/30
Accept: application/json
```

**Próximos 90 días:**
```http
GET https://localhost:5001/api/EventReminders/upcoming/90
Accept: application/json
```

---

### ? POST - Crear nuevo evento

**Ejemplo 1 - Examen:**
```http
POST https://localhost:5001/api/EventReminders
Content-Type: application/json

{
  "title": "Examen de Cálculo Integral",
  "description": "Examen final del semestre - incluye todos los temas vistos",
  "date": "2024-12-20T10:00:00",
  "type": "Examen",
  "userId": 1
}
```

**Ejemplo con cURL:**
```bash
curl -X POST "https://localhost:5001/api/EventReminders" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Examen de Cálculo Integral",
    "description": "Examen final del semestre - incluye todos los temas vistos",
    "date": "2024-12-20T10:00:00",
    "type": "Examen",
    "userId": 1
  }'
```

**Respuesta esperada (201 Created):**
```json
{
  "id": 13,
  "title": "Examen de Cálculo Integral",
  "description": "Examen final del semestre - incluye todos los temas vistos",
  "date": "2024-12-20T10:00:00Z",
  "type": "Examen",
  "userId": 1
}
```

---

### ? POST - Más ejemplos de eventos

**Ejemplo 2 - Cumpleaños:**
```json
{
  "title": "Cumpleaños de Pedro",
  "description": "Fiesta de cumpleaños en su casa a las 6 PM",
  "date": "2024-12-28T18:00:00",
  "type": "Cumpleaños",
  "userId": 2
}
```

**Ejemplo 3 - Clase especial:**
```json
{
  "title": "Clase de Repaso",
  "description": "Clase especial de repaso para el examen final de Física",
  "date": "2024-12-17T15:00:00",
  "type": "Clase",
  "userId": 1
}
```

**Ejemplo 4 - Reunión académica:**
```json
{
  "title": "Reunión con Tutor",
  "description": "Reunión de seguimiento académico con el tutor asignado",
  "date": "2024-12-19T11:00:00",
  "type": "Reunión",
  "userId": 3
}
```

**Ejemplo 5 - Entrega de proyecto:**
```json
{
  "title": "Entrega Proyecto Final",
  "description": "Fecha límite para entregar el proyecto final de Ingeniería de Software",
  "date": "2024-12-22T23:59:59",
  "type": "Proyecto",
  "userId": 2
}
```

**Ejemplo 6 - Seminario:**
```json
{
  "title": "Seminario de Machine Learning",
  "description": "Seminario sobre aplicaciones de ML en la industria",
  "date": "2024-12-21T16:00:00",
  "type": "Clase",
  "userId": 4
}
```

**Ejemplo 7 - Defensa de tesis:**
```json
{
  "title": "Defensa de Tesis",
  "description": "Presentación y defensa de tesis de grado ante el jurado",
  "date": "2025-01-10T09:00:00",
  "type": "Presentación",
  "userId": 3
}
```

**Ejemplo 8 - Evento sin descripción:**
```json
{
  "title": "Inscripciones Semestre 2025",
  "date": "2024-12-30T08:00:00",
  "type": "Trámite",
  "userId": 1
}
```

---

### ? PUT - Actualizar evento completo

**Petición:**
```http
PUT https://localhost:5001/api/EventReminders/1
Content-Type: application/json

{
  "id": 1,
  "title": "Examen Final de Matemáticas Avanzadas",
  "description": "Examen final de cálculo diferencial e integral - Aula 305",
  "date": "2024-12-20T10:30:00",
  "type": "Examen",
  "userId": 1
}
```

**Ejemplo con cURL:**
```bash
curl -X PUT "https://localhost:5001/api/EventReminders/1" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "title": "Examen Final de Matemáticas Avanzadas",
    "description": "Examen final de cálculo diferencial e integral - Aula 305",
    "date": "2024-12-20T10:30:00",
    "type": "Examen",
    "userId": 1
  }'
```

**Respuesta esperada (204 No Content):**
Sin contenido.

---

### ? PUT - Más ejemplos de actualización

**Ejemplo 2 - Cambiar fecha y ubicación:**
```json
{
  "id": 2,
  "title": "Entrega de Proyecto de Física",
  "description": "Fecha límite actualizada - Entregar en la oficina del profesor, Edificio B, piso 3",
  "date": "2025-01-05T17:00:00",
  "type": "Proyecto",
  "userId": 1
}
```

**Ejemplo 3 - Actualizar detalles:**
```json
{
  "id": 4,
  "title": "Cumpleaños de María García",
  "description": "Celebración de cumpleaños - Traer regalo y confirmar asistencia",
  "date": "2025-01-05T19:00:00",
  "type": "Cumpleaños",
  "userId": 2
}
```

**Ejemplo 4 - Cambiar tipo de evento:**
```json
{
  "id": 3,
  "title": "Sesión de Tutoría Individual",
  "description": "Cambio de modalidad: ahora será una tutoría grupal",
  "date": "2024-12-17T15:00:00",
  "type": "Clase",
  "userId": 1
}
```

---

### ? DELETE - Eliminar evento

```http
DELETE https://localhost:5001/api/EventReminders/10
```

**Ejemplo con cURL:**
```bash
curl -X DELETE "https://localhost:5001/api/EventReminders/10"
```

---

## ?? Escenarios de Prueba Completos

### Escenario 1: Flujo completo de usuario nuevo

**Paso 1 - Crear usuario:**
```json
POST https://localhost:5001/api/UserProfiles

{
  "name": "Estudiante Nuevo",
  "email": "estudiante.nuevo@eduvoice.com"
}
```

**Paso 2 - Crear tarea para el usuario (usa el ID devuelto):**
```json
POST https://localhost:5001/api/TaskPlans

{
  "title": "Primera Tarea",
  "description": "Mi primera tarea en el sistema",
  "dueDate": "2024-12-20T23:59:59",
  "isCompleted": false,
  "userId": 5
}
```

**Paso 3 - Crear evento para el usuario:**
```json
POST https://localhost:5001/api/EventReminders

{
  "title": "Primer Examen",
  "description": "Mi primer examen registrado",
  "date": "2024-12-21T10:00:00",
  "type": "Examen",
  "userId": 5
}
```

---

### Escenario 2: Gestión de tareas semanales

**Crear múltiples tareas:**
```json
POST https://localhost:5001/api/TaskPlans

// Lunes
{
  "title": "Leer capítulos 1-3",
  "description": "Lectura obligatoria de la semana",
  "dueDate": "2024-12-16T23:59:59",
  "isCompleted": false,
  "userId": 1
}
```

```json
// Miércoles
{
  "title": "Ejercicios de práctica",
  "description": "Completar ejercicios del 1 al 20",
  "dueDate": "2024-12-18T23:59:59",
  "isCompleted": false,
  "userId": 1
}
```

```json
// Viernes
{
  "title": "Entregar trabajo escrito",
  "description": "Ensayo de 1500 palabras sobre el tema asignado",
  "dueDate": "2024-12-20T23:59:59",
  "isCompleted": false,
  "userId": 1
}
```

---

### Escenario 3: Calendario de exámenes

**Crear serie de exámenes:**
```json
POST https://localhost:5001/api/EventReminders

// Matemáticas
{
  "title": "Examen de Matemáticas",
  "description": "Cálculo diferencial - Aula 201",
  "date": "2024-12-20T08:00:00",
  "type": "Examen",
  "userId": 1
}
```

```json
// Física
{
  "title": "Examen de Física",
  "description": "Mecánica clásica - Laboratorio 3",
  "date": "2024-12-21T10:00:00",
  "type": "Examen",
  "userId": 1
}
```

```json
// Programación
{
  "title": "Examen de Programación",
  "description": "C# y .NET - Sala de cómputo A",
  "date": "2024-12-22T14:00:00",
  "type": "Examen",
  "userId": 1
}
```

---

## ?? Notas Importantes

### Formatos de Fecha
- Usar formato ISO 8601: `YYYY-MM-DDTHH:mm:ss`
- Ejemplo: `2024-12-20T10:30:00`
- La API convertirá a UTC automáticamente

### Validaciones
- **Email**: Debe ser un formato válido
- **Título**: Máximo 200 caracteres
- **Descripción**: Máximo 500-1000 caracteres
- **Campos requeridos**: No pueden ser null o vacíos

### Códigos de Estado
- `200 OK`: Operación exitosa (GET)
- `201 Created`: Recurso creado (POST)
- `204 No Content`: Operación exitosa sin contenido (PUT, PATCH, DELETE)
- `400 Bad Request`: Datos inválidos
- `404 Not Found`: Recurso no encontrado

---

## ?? Herramientas Recomendadas

### Swagger UI (Incluido)
- URL: `https://localhost:5001/swagger`
- Pruebas interactivas con botón "Try it out"

### Postman
1. Importar colección desde los ejemplos
2. Configurar variable `baseUrl = https://localhost:5001`
3. Ejecutar peticiones

### Thunder Client (VS Code)
1. Instalar extensión Thunder Client
2. Crear nueva petición
3. Copiar ejemplos directamente

### cURL (Terminal)
- Ejemplos incluidos en cada sección
- Ejecutar desde terminal/PowerShell

---

¡Todos los ejemplos están listos para copiar y probar! ??
