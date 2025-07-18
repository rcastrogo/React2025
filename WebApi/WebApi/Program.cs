
using Dal.Core.Connections;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WebApi.Controllers;
using WebApi.Core.Logging;
using WebApi.Core.Settings;
using WebApi.Services;

// =========================================================================================
// Builder
// =========================================================================================
var builder = WebApplication.CreateBuilder(args);

// =========================================================================================
// Acceso a la configuración
// =========================================================================================
var _appSection = builder.Configuration.GetSection("AppSettings");
var _appSettings = _appSection.Get<AppSettings>();

// =========================================================================================
// Configurar los origenes de datos
// =========================================================================================
ConnectionManager.Configure(builder.Configuration);

// =========================================================================================
// Services
// =========================================================================================
builder.Services.Configure<JsonOptions>(options => {
    options.SerializerOptions.WriteIndented = true;
    options.SerializerOptions.IncludeFields = true;
});

builder.Services.AddScoped<IDbContextBuilder, DbContextBuilder>();
builder.Services.AddSingleton<AppSettings>(_appSection.Get<AppSettings>()); // AppSettings
builder.Services.Configure<AppSettings>(_appSection);                       // IOptions<AppSettings>

// =========================================================================================
// Logging
// =========================================================================================
builder.Logging.ClearProviders();
builder.Services.AddSingleton<ILoggerProvider, CustomLoggerProvider>();
builder.Services.AddCors(options =>
{
  options.AddPolicy("PermitirReact",
  policy =>
  {
    policy.WithOrigins("http://localhost:5173")
          .AllowAnyOrigin()
          .AllowAnyHeader()
          .AllowAnyMethod();
  });
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =========================================================================================
// App
// =========================================================================================
var app = builder.Build();

app.UseCors("PermitirReact");

// =========================================================================================
// Development
// =========================================================================================
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// =========================================================================================
// Routes
// =========================================================================================
//app.MapGet("/", context =>
//{
//  context.Response.Redirect("index.html");
//  return Task.CompletedTask;
//});

app.MapGet("/version", async context => {
  context.Response.StatusCode = (int)System.Net.HttpStatusCode.OK;
  context.Response.ContentType = "text/html";
  await context.Response.WriteAsync("<h2>Version: 1.0</h2>"); 
});

// =========================================================================================
// Start App
// =========================================================================================
app.UseMiddleware<HttpRequestMiddleware>();
app.MapUsersEndpoins();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UsePolLogging();


//app.Use(async (context, next) =>
//{
//  await next();

//  if (context.Response.StatusCode == 404 &&
//      !Path.HasExtension(context.Request.Path.Value) &&
//      !context.Request.Path.Value.StartsWith("/api"))
//  {
//    context.Request.Path = "/";
//    await next();
//  }
//});


AppLogging.Log("WebApi presta y dispuesta!!!");


app.MapControllers(); // Esto activa los controladores RESTful

app.Run();
