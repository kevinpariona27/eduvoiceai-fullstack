# EduVoiceAI API - Documentación

## ?? Descripción

API RESTful para la plataforma EduVoiceAI - Sistema de gestión educativa con asistencia por voz.

Esta API proporciona endpoints completos para:
- **UserProfiles**: Gestión de perfiles de usuario
- **TaskPlans**: Administración de tareas y planes de estudio
- **EventReminders**: Manejo de recordatorios y eventos importantes

## ?? Inicio Rápido

### Requisitos Previos
- .NET 9.0 SDK
- SQL Server (LocalDB o instancia completa)
- Visual Studio 2022 o VS Code

### Ejecutar la API

1. **Restaurar paquetes:**
   ```bash
   dotnet restore
   ```

2. **Ejecutar migraciones:**
   ```bash
   dotnet ef database update --project EduVoiceAI.Infrastructure --startup-project EduVoiceAI.API
   ```

3. **Ejecutar la aplicación:**
   ```bash
   cd EduVoiceAI.API
   dotnet run
   ```

4. **Acceder a Swagger UI:**
   - Abrir navegador en: `https://localhost:5001/swagger` o `http://localhost:5000/swagger`
   - También puedes ir a la raíz `/` que redirige automáticamente a Swagger

## ?? Documentación de Endpoints

### ?? Gestión de Usuarios (`/api/UserProfiles`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/UserProfiles` | Obtener todos los usuarios |
| GET | `/api/UserProfiles/{id}` | Obtener un usuario por ID |
| POST | `/api/UserProfiles` | Crear un nuevo usuario |
| PUT | `/api/UserProfiles/{id}` | Actualizar un usuario existente |
| DELETE | `/api/UserProfiles/{id}` | Eliminar un usuario |

**Ejemplo de Usuario:**
```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@ejemplo.com"
}
```

### ?? Gestión de Tareas (`/api/TaskPlans`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/TaskPlans` | Obtener todas las tareas |
| GET | `/api/TaskPlans/{id}` | Obtener una tarea por ID |
| GET | `/api/TaskPlans/user/{userId}` | Obtener tareas de un usuario |
| POST | `/api/TaskPlans` | Crear una nueva tarea |
| PUT | `/api/TaskPlans/{id}` | Actualizar una tarea |
| PATCH | `/api/TaskPlans/{id}/complete` | Marcar tarea como completada |
| DELETE | `/api/TaskPlans/{id}` | Eliminar una tarea |

**Ejemplo de Tarea:**
```json
{
  "title": "Estudiar matemáticas",
  "description": "Repasar capítulos 1-5 del libro de álgebra",
  "dueDate": "2024-12-31T23:59:59",
  "isCompleted": false,
  "userId": 1
}
```

### ?? Gestión de Eventos (`/api/EventReminders`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/EventReminders` | Obtener todos los eventos |
| GET | `/api/EventReminders/{id}` | Obtener un evento por ID |
| GET | `/api/EventReminders/user/{userId}` | Obtener eventos de un usuario |
| GET | `/api/EventReminders/type/{type}` | Obtener eventos por tipo |
| GET | `/api/EventReminders/upcoming/{days}` | Obtener eventos próximos (N días) |
| POST | `/api/EventReminders` | Crear un nuevo evento |
| PUT | `/api/EventReminders/{id}` | Actualizar un evento |
| DELETE | `/api/EventReminders/{id}` | Eliminar un evento |

**Ejemplo de Evento:**
```json
{
  "title": "Examen Final de Matemáticas",
  "description": "Examen final del curso de Cálculo I",
  "date": "2024-12-20T10:00:00",
  "type": "Examen",
  "userId": 1
}
```

**Tipos de Eventos Comunes:**
- Cumpleaños
- Clase
- Examen
- Reunión
- Tarea
- Proyecto

## ?? Características Técnicas

### Tecnologías Utilizadas
- **.NET 9.0** - Framework principal
- **Entity Framework Core** - ORM para acceso a datos
- **AutoMapper** - Mapeo de entidades a DTOs
- **Swagger/OpenAPI** - Documentación interactiva de API
- **SQL Server** - Base de datos

### Patrones de Diseño
- **Repository Pattern** - Abstracción de acceso a datos
- **Unit of Work** - Gestión de transacciones
- **DTO Pattern** - Transferencia de datos

### Validaciones
Todos los DTOs incluyen validaciones con DataAnnotations:
- `[Required]` - Campos obligatorios
- `[MaxLength]` - Longitud máxima de strings
- `[EmailAddress]` - Formato de email válido

### Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 204 | No Content - Operación exitosa sin contenido |
| 400 | Bad Request - Datos de entrada inválidos |
| 404 | Not Found - Recurso no encontrado |

## ?? Ejemplos de Uso

### Usando cURL

**Crear un usuario:**
```bash
curl -X POST "https://localhost:5001/api/UserProfiles" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria.garcia@ejemplo.com"
  }'
```

**Obtener tareas de un usuario:**
```bash
curl -X GET "https://localhost:5001/api/TaskPlans/user/1"
```

**Marcar tarea como completada:**
```bash
curl -X PATCH "https://localhost:5001/api/TaskPlans/1/complete" \
  -H "Content-Type: application/json" \
  -d 'true'
```

**Obtener eventos próximos (7 días):**
```bash
curl -X GET "https://localhost:5001/api/EventReminders/upcoming/7"
```

## ?? Swagger UI

La interfaz de Swagger incluye:
- ? Documentación completa de todos los endpoints
- ? Ejemplos de solicitudes y respuestas
- ? Prueba interactiva de endpoints ("Try it out")
- ? Esquemas de datos con validaciones
- ? Códigos de respuesta documentados
- ? Filtrado y búsqueda de endpoints
- ? Organización por categorías (Tags)

## ??? Configuración

### Cadena de Conexión
Editar `appsettings.json` o `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=EduVoiceAIDb;Trusted_Connection=true;TrustServerCertificate=true"
  }
}
```

## ?? Licencia

MIT License

## ?? Equipo

EduVoiceAI Team - support@eduvoiceai.com
