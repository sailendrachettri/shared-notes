using Microsoft.Extensions.FileProviders;
using shared_notes_software_server.Data;
using shared_notes_software_server.Helpers;


var builder = WebApplication.CreateBuilder(args);
builder.Host.UseWindowsService();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Host.UseWindowsService();

builder.Services.AddScoped<DbConnectionFactory>();
builder.Services.AddScoped<DbHelper>();




builder.Services.AddScoped<JwtTokenHelper>();
builder.Services.AddSingleton<JwtTokenHelper>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteDevServer", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:44383", "http://localhost:5174") 
            .AllowAnyHeader()
            .SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// Configure Kestrel BEFORE Build()
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1073741824; // 1GB
});
builder.WebHost.ConfigureKestrel(options =>
{
    // HTTP
    options.ListenAnyIP(5171);
    options.Limits.MaxRequestBodySize = 1073741824; // 1 GB

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


app.UseCors("AllowViteDevServer");
app.UseDefaultFiles();
app.UseStaticFiles();

var uploadPath = Path.Combine(builder.Environment.ContentRootPath, "uploadedFiles");
Directory.CreateDirectory(uploadPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadPath),
    RequestPath = "/uploads",
    ServeUnknownFileTypes = true,
    DefaultContentType = "application/octet-stream" // forces download for unknown types
});



app.UseAuthorization();

app.MapControllers();

app.Run();
