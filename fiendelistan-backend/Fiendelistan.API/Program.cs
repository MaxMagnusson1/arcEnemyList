using Fiendelistan.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 💾 Läs connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
    ?? "Host=postgres;Port=5432;Database=fiendelistan;Username=postgres;Password=password123";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("https://myarcenemies.onrender.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

// ✅ MIGRATIONS MÅSTE KÖRAS FÖRST - innan swagger/andra saker
Console.WriteLine("⏳ Startar database migrations...");
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        Console.WriteLine("⏳ Väntar på databaskopplingen...");
        System.Threading.Thread.Sleep(2000); // Vänta 2 sekunder
        
        Console.WriteLine("⏳ Kör migrations...");
        dbContext.Database.Migrate();
        Console.WriteLine("✅ Database migrations körda framgångsrikt!");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"❌ MIGRATIONS MISSLYCKADES: {ex.Message}");
    Console.WriteLine($"❌ Stack trace: {ex.InnerException?.Message}");
    throw; // Låt appen krascha så vi ser problemet
}

// Swagger alltid aktiv
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();