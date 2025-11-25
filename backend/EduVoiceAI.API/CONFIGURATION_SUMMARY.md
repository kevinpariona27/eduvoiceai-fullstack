# ?? Configuración de Program.cs - EduVoiceAI API

## ? Configuración Completada

### 1?? **DbContext con SQL Server**
```csharp
builder.Services.AddDbContext<EduVoiceDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("EduVoiceDb")));
```

**Detalles:**
- ? Usa la cadena de conexión `"EduVoiceDb"` desde `appsettings.json`
- ? Proveedor: **Microsoft.EntityFrameworkCore.SqlServer**
- ? Inyección de dependencias configurada correctamente
- ? Cadena de conexión: `Server=MSI\\MSSQLSERVER01;Database=EduVoiceAIDb;Trusted_Connection=True;TrustServerCertificate=True;`

### 2?? **Unit of Work Pattern**
```csharp
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
```

**Detalles:**
- ? Patrón Repository registrado
- ? Ciclo de vida: **Scoped** (una instancia por request)
- ? Gestión de transacciones centralizada

### 3?? **AutoMapper**
```csharp
builder.Services.AddAutoMapper(typeof(Program).Assembly);
```

**Detalles:**
- ? Escanea el ensamblado actual automáticamente
- ? Detecta todos los perfiles de mapeo (`MappingProfile.cs`)
- ? Mapeo entre entidades y DTOs configurado

### 4?? **Controladores**
```csharp
builder.Services.AddControllers();
```

**Detalles:**
- ? Registra los servicios necesarios para Web API
- ? Soporte para atributos de enrutamiento
- ? Validación de modelos automática

---

## ?? Servicios Registrados en DI Container

| Servicio | Implementación | Ciclo de Vida | Descripción |
|----------|---------------|---------------|-------------|
| `DbContext` | `EduVoiceDbContext` | Scoped | Contexto de Entity Framework |
| `IUnitOfWork` | `UnitOfWork` | Scoped | Patrón Unit of Work |
| `IMapper` | AutoMapper | Singleton | Mapeo de objetos |
| Controllers | - | Transient | Controladores de la API |

---

## ?? Cadena de Conexión

### Ubicación
**Archivo:** `appsettings.json`

```json
{
  "ConnectionStrings": {
    "EduVoiceDb": "Server=MSI\\MSSQLSERVER01;Database=EduVoiceAIDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### Componentes de la Cadena
- **Servidor**: `MSI\\MSSQLSERVER01`
- **Base de datos**: `EduVoiceAIDb`
- **Autenticación**: Windows (Trusted_Connection)
- **Certificado**: Confianza habilitada

---

## ?? Verificación de Configuración

### Paso 1: Verificar que SQL Server está ejecutándose
```bash
# Verificar servicio
services.msc
# Buscar: SQL Server (MSSQLSERVER01)
```

### Paso 2: Verificar la base de datos
```bash
dotnet ef database update --project EduVoiceAI.Infrastructure --startup-project EduVoiceAI.API
```

### Paso 3: Ejecutar la aplicación
```bash
cd EduVoiceAI.API
dotnet run
```

### Paso 4: Verificar en Swagger
- Abrir: `https://localhost:5001/swagger`
- Probar cualquier endpoint
- Si funciona, la configuración es correcta ?

---

## ?? Prueba de Conectividad

### Test Rápido con SQL
```sql
-- Conectarse a la base de datos
USE EduVoiceAIDb;
GO

-- Verificar tablas
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';
GO

-- Resultado esperado:
-- Users
-- TaskItems
-- Events
-- __EFMigrationsHistory
```

---

## ?? Orden de Configuración en Program.cs

### **Fase 1: Configuración de Servicios** (`builder.Services`)
1. ? DbContext con SQL Server
2. ? Unit of Work
3. ? AutoMapper
4. ? Controladores
5. ? Swagger/OpenAPI

### **Fase 2: Pipeline HTTP** (`app.Use*`)
1. ? Swagger (solo en Development)
2. ? HTTPS Redirection
3. ? Map Controllers

---

## ?? Paquetes NuGet Requeridos

Estos paquetes ya están instalados:

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.10" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.10" />
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="9.0.6" />
```

---

## ? Características Adicionales Configuradas

### 1. Swagger con Documentación XML
- Comentarios XML integrados
- Documentación interactiva completa
- Try It Out habilitado

### 2. Redirección Automática
```csharp
app.MapGet("/", () => Results.Redirect("/swagger"))
    .ExcludeFromDescription();
```
- `/` ? redirige a `/swagger` automáticamente

### 3. Configuración Avanzada de Swagger
- Filtros de búsqueda
- Deep linking
- Medición de tiempos
- Organización por tags

---

## ??? Troubleshooting

### Error: "No se puede conectar a SQL Server"
**Solución:**
1. Verificar que SQL Server está ejecutándose
2. Confirmar el nombre del servidor en la cadena de conexión
3. Verificar permisos de Windows Authentication

### Error: "Base de datos no existe"
**Solución:**
```bash
dotnet ef database update --project EduVoiceAI.Infrastructure --startup-project EduVoiceAI.API
```

### Error: "AutoMapper no encuentra los mapeos"
**Solución:**
- Verificar que `MappingProfile.cs` existe en `EduVoiceAI.API/Mapping/`
- El archivo debe heredar de `Profile`

---

## ?? Resumen de Configuración

| Componente | Estado | Notas |
|------------|--------|-------|
| DbContext | ? | Configurado con "EduVoiceDb" |
| SQL Server | ? | Microsoft.EntityFrameworkCore.SqlServer |
| Inyección de Dependencias | ? | Todos los servicios registrados |
| AutoMapper | ? | Escaneo automático del ensamblado |
| Controladores | ? | AddControllers() registrado |
| Swagger | ? | Documentación completa habilitada |

---

## ?? Verificación Final

### Checklist de Configuración
- [x] `AddDbContext` con cadena "EduVoiceDb"
- [x] `UseSqlServer` configurado
- [x] `AddScoped<IUnitOfWork, UnitOfWork>`
- [x] `AddAutoMapper` con ensamblado actual
- [x] `AddControllers()` registrado
- [x] Inyección de dependencias funcionando
- [x] Compilación exitosa
- [x] Migraciones aplicadas

### Comandos de Verificación
```bash
# 1. Build
dotnet build

# 2. Actualizar DB
dotnet ef database update --project EduVoiceAI.Infrastructure --startup-project EduVoiceAI.API

# 3. Ejecutar
dotnet run --project EduVoiceAI.API

# 4. Probar
# Abrir: https://localhost:5001/swagger
```

---

## ? Configuración Completa y Funcional

Todo está correctamente configurado según las mejores prácticas de .NET 9:
- ? **EduVoiceDbContext** registrado con "EduVoiceDb"
- ? **Microsoft.EntityFrameworkCore.SqlServer** en uso
- ? **AutoMapper** configurado
- ? **AddControllers** registrado
- ? **Inyección de dependencias** completa

¡La aplicación está lista para ejecutarse! ??
