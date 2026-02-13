using shared_notes_software_server.Data;
using shared_notes_software_server.Helpers;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<DbConnectionFactory>();
builder.Services.AddScoped<DbHelper>();




builder.Services.AddScoped<JwtTokenHelper>();
builder.Services.AddSingleton<JwtTokenHelper>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteDevServer", policy =>
    {
        policy
            //.WithOrigins("http://localhost:5173") 
            .AllowAnyHeader()
            .SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// Configure Kestrel BEFORE Build()
builder.WebHost.ConfigureKestrel(options =>
{
    // HTTP
    options.ListenAnyIP(5171);

    // HTTPS (requires dev certificate installed)
    //options.ListenAnyIP(t171, listen =>
    //{
    //    listen.UseHttps();
    //});
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/updates-check", () =>
{
    return Directory.GetFiles(@"C:\OfficeConnectRelease");
});


app.MapGet("/debug-updates", () =>
{
    var path = @"C:\OfficeConnectRelease\latest.yml";
    return new
    {
        Exists = System.IO.File.Exists(path),
        Files = Directory.Exists(@"C:\OfficeConnectRelease")
            ? Directory.GetFiles(@"C:\OfficeConnectRelease")
            : Array.Empty<string>()
    };
});

app.UseCors("AllowViteDevServer");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
