using EduVoiceAI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using EduVoiceAI.Domain.Contracts;
using EduVoiceAI.Infrastructure.Repositories;
using System.Reflection;
using Microsoft.OpenApi.Models;
using EduVoiceAI.Infrastructure.Seed;
using EduVoiceAI.API.Configuration;
using EduVoiceAI.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Configurar EF Core con SQL Server usando la cadena de conexión "EduVoiceDb"
builder.Services.AddDbContext<EduVoiceDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("EduVoiceDb")));

// Registrar Unit of Work y Repositorios
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Configurar opciones de servicios externos
builder.Services.Configure<GeminiAISettings>(
    builder.Configuration.GetSection("GeminiAI"));

builder.Services.Configure<HuggingFaceSettings>(
    builder.Configuration.GetSection("HuggingFace"));

// Configurar HttpClient para IAService
builder.Services.AddHttpClient<IIAService, IAService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
});

// Configurar AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Registrar controladores
builder.Services.AddControllers();

// Configurar Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Información general de la API
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "EduVoiceAI API",
        Version = "v1",
        Description = @"
            API RESTful para la plataforma EduVoiceAI - Sistema de gestión educativa con asistencia por voz.
            
            Esta API proporciona endpoints para:
            - **UserProfiles**: Gestión de perfiles de usuario
            - **TaskPlans**: Administración de tareas y planes de estudio
            - **EventReminders**: Manejo de recordatorios y eventos importantes
            
            Todos los endpoints soportan operaciones CRUD completas y utilizan DTOs para la transferencia de datos.
        ",
        Contact = new OpenApiContact
        {
            Name = "EduVoiceAI Team",
            Email = "support@eduvoiceai.com",
            Url = new Uri("https://eduvoiceai.com")
        },
        License = new OpenApiLicense
        {
            Name = "MIT License",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });

    // Incluir comentarios XML para documentación detallada
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
    }

    // Registrar el filtro para manejar IFormFile correctamente
    options.OperationFilter<EduVoiceAI.API.Configuration.FormFileOperationFilter>();

    // Configurar esquemas con nombres más descriptivos
    options.CustomSchemaIds(type => type.Name);

    // Agregar etiquetas personalizadas para organizar endpoints
    options.TagActionsBy(api =>
    {
        if (api.GroupName != null)
        {
            return new[] { api.GroupName };
        }

        var controllerName = api.ActionDescriptor.RouteValues["controller"];
        return new[] { controllerName ?? "Default" };
    });

    // Ordenar acciones por método HTTP
    options.OrderActionsBy(apiDesc => 
        $"{apiDesc.ActionDescriptor.RouteValues["controller"]}_{apiDesc.HttpMethod}");
});
// 🚀 Configurar CORS antes de Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();
app.UseCors("AllowReactApp");

// Sembrar datos iniciales en la base de datos
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<EduVoiceDbContext>();
        await DbSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocurrió un error al sembrar la base de datos.");
    }
}

// Configurar el pipeline HTTP
if (app.Environment.IsDevelopment())
{
    // Habilitar Swagger UI en desarrollo
    app.UseSwagger();
    
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "EduVoiceAI API v1");
        options.RoutePrefix = "swagger";
        
        // Configuración de la interfaz
        options.DocumentTitle = "EduVoiceAI API - Documentación";
        options.DefaultModelsExpandDepth(2);
        options.DefaultModelExpandDepth(2);
        options.DisplayRequestDuration();
        options.EnableDeepLinking();
        options.EnableFilter();
        options.ShowExtensions();
        
        // Configurar la página para expandir operaciones por defecto
        options.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.List);
        
        // Agregar soporte para pruebas directas desde Swagger
        options.EnableTryItOutByDefault();
    });

    // Redirigir la raíz a Swagger en desarrollo
    app.MapGet("/", () => Results.Redirect("/swagger"))
        .ExcludeFromDescription();
}


app.UseCors("AllowReactApp");


app.UseHttpsRedirection();
app.MapControllers();

app.Run();
