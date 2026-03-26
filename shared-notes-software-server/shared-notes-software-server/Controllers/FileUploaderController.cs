using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.Diagnostics;

namespace AngularWithASPDemo.Server.Controllers.Uploader
{
    [ApiController]
    public class FileUploaderController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public FileUploaderController(IWebHostEnvironment env)
        {
            _env = env;
        }

        //[RequestSizeLimit(1073741824)]
        //[RequestFormLimits(MultipartBodyLengthLimit = 1073741824)]
        //[HttpPost("/api/v1/upload-files")]
        //public IActionResult UploadFiles([FromForm] List<IFormFile> files) 
        //{
        //    if (files == null || files.Count == 0)
        //        return BadRequest("No files uploaded.");

        //    string directoryPath = Path.Combine(_env.ContentRootPath, "uploadedFiles");
        //    Directory.CreateDirectory(directoryPath);

        //    var savedFiles = new List<string>();

        //    foreach (var file in files)
        //    {
        //        string timestamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
        //        //string safeName = Path.GetFileNameWithoutExtension(file.FileName);
        //        string extension = Path.GetExtension(file.FileName);
        //        string newName = $"file_{timestamp}{extension}";
        //        string fullPath = Path.Combine(directoryPath, newName);

        //        using (var stream = new FileStream(fullPath, FileMode.Create))
        //            file.CopyTo(stream);

        //        savedFiles.Add($"{newName}");
        //    }

        //    return Ok(savedFiles);
        //}

        [HttpPost("/api/v1/upload-files")]
        [RequestSizeLimit(1073741824)]
        [RequestFormLimits(MultipartBodyLengthLimit = 1073741824)]
        public async Task<IActionResult> UploadFiles([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded.");

            string rootPath = Path.Combine(_env.ContentRootPath, "uploadedFiles");
            string thumbPathDir = Path.Combine(rootPath, "thumbnails");

            Directory.CreateDirectory(rootPath);
            Directory.CreateDirectory(thumbPathDir);

            var results = new List<object>();

            foreach (var file in files)
            {
                if (file == null || file.Length == 0)
                    continue;

                try
                {
                    // 🔐 Generate safe unique name
                    string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    string fileId = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}_{Guid.NewGuid().ToString("N")[..6]}";
                    string newFileName = $"file_{fileId}{extension}";
                    string fullPath = Path.Combine(rootPath, newFileName);

                    // 💾 Save original file
                    await using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    string thumbnailName = null;
                    string thumbnailFullPath = Path.Combine(thumbPathDir, $"thumb_{fileId}.jpg");

                    var contentType = file.ContentType?.ToLower() ?? "";

                    // =========================
                    // IMAGE THUMBNAIL
                    // =========================
                    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

                    var validImageExts = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff" };

                    if (validImageExts.Contains(ext))
                    {
                        try
                        {
                            // 🚫 Optional: skip tiny files
                            if (file.Length < 100)
                            {
                                Console.WriteLine($"[Skip] Too small image: {file.FileName}");
                            }
                            else
                            {
                                using var image = await Image.LoadAsync(fullPath);

                                if (image.Width > 150 || image.Height > 150)
                                {
                                    image.Mutate(x => x.Resize(new ResizeOptions
                                    {
                                        Size = new Size(150, 150),
                                        Mode = ResizeMode.Max
                                    }));
                                }

                                await image.SaveAsJpegAsync(thumbnailFullPath,
                                    new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder { Quality = 35 });

                                var thumbInfo = new FileInfo(thumbnailFullPath);

                                if (thumbInfo.Length < file.Length)
                                {
                                    thumbnailName = Path.GetFileName(thumbnailFullPath);
                                }
                                else
                                {
                                    System.IO.File.Delete(thumbnailFullPath);
                                }
                            }
                        }
                        catch (SixLabors.ImageSharp.UnknownImageFormatException)
                        {
                            Console.WriteLine($"[Invalid Image] {file.FileName}");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[Image Error] {file.FileName} → {ex.Message}");
                        }
                    }

                    // =========================
                    // 🎥 VIDEO THUMBNAIL (JPG frame)
                    // =========================
                    else if (contentType.StartsWith("video/"))
                    {
                        try
                        {
                            // ✅ Direct path to your downloaded ffmpeg.exe — no NuGet package needed
                            string ffmpegExe = @"C:\Users\Nerd\ffmpeg-8.1-full_build\ffmpeg-8.1-full_build\bin\ffmpeg.exe";

                            if (!System.IO.File.Exists(ffmpegExe))
                            {
                                Console.WriteLine($"[Video Thumb ERROR] ffmpeg.exe not found at: {ffmpegExe}");
                            }
                            else
                            {
                                var process = new Process
                                {
                                    StartInfo = new ProcessStartInfo
                                    {
                                        FileName = ffmpegExe,
                                        // -ss 1 = seek to 1 second, -vframes 1 = grab one frame, -vf scale=150:-1 = resize to 150px wide
                                        Arguments = $"-y -ss 00:00:03 -i \"{fullPath}\" -vframes 1 -vf scale=150:-1 \"{thumbnailFullPath}\"",
                                        RedirectStandardError = true,
                                        RedirectStandardOutput = true,
                                        UseShellExecute = false,
                                        CreateNoWindow = true
                                    }
                                };

                                process.Start();
                                string ffmpegOutput = await process.StandardError.ReadToEndAsync(); // ffmpeg logs to stderr
                                await process.WaitForExitAsync();

                                Console.WriteLine($"[Video Thumb] ffmpeg exit code: {process.ExitCode}");
                                Console.WriteLine($"[Video Thumb] ffmpeg output: {ffmpegOutput}");

                                if (process.ExitCode == 0 && System.IO.File.Exists(thumbnailFullPath))
                                {
                                    // ✅ Compress the extracted frame further with ImageSharp
                                    using var thumbImage = await Image.LoadAsync(thumbnailFullPath);
                                    await thumbImage.SaveAsJpegAsync(thumbnailFullPath,
                                        new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder { Quality = 35 });

                                    thumbnailName = Path.GetFileName(thumbnailFullPath);
                                    Console.WriteLine($"[Video Thumb OK] {thumbnailName}");
                                }
                                else
                                {
                                    Console.WriteLine($"[Video Thumb FAILED] Exit: {process.ExitCode}, File exists: {System.IO.File.Exists(thumbnailFullPath)}");
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[Video Thumb ERROR] {ex.GetType().Name}: {ex.Message}");
                        }
                    }

                    // =========================
                    // 📦 OTHER FILES (txt, pdf, docx, xlsx, sql, etc.)
                    // → No thumbnail, just upload cleanly
                    // =========================

                    results.Add(new
                    {
                        file = newFileName,
                        thumbnail = thumbnailName,   // null for non-visual files — handle in UI
                        contentType = contentType,
                        size = file.Length
                    });
                }
                catch (Exception ex)
                {
                    results.Add(new
                    {
                        file = file.FileName,
                        error = ex.Message
                    });
                }
            }

            return Ok(new
            {
                message = "Upload completed",
                files = results
            });
        }

        [HttpPost("/api/v1/delete-files")]
        public IActionResult DeleteFiles([FromBody] List<string> fileNames)
        {
            if (fileNames == null || fileNames.Count == 0)
            {
                return BadRequest(new { message = "Error: File list cannot be empty." });
            }

            var deletedFiles = new List<string>();
            var notFoundFiles = new List<string>();
            var errorFiles = new List<object>();

            string directoryPath = Path.Combine(_env.ContentRootPath, "uploadedFiles");

            foreach (var fileName in fileNames)
            {
                if (string.IsNullOrEmpty(fileName))
                {
                    continue;
                }
                try
                {
                    string safeFileName = Path.GetFileName(fileName);
                    string physicalFilePath = Path.Combine(directoryPath, safeFileName);

                    if (System.IO.File.Exists(physicalFilePath))
                    {
                        System.IO.File.Delete(physicalFilePath);
                        deletedFiles.Add(safeFileName);
                    }
                    else
                    {
                        notFoundFiles.Add(safeFileName);
                    }
                }
                catch (Exception ex)
                {
                    errorFiles.Add(new { file = fileName, message = ex.Message });
                }
            }
            return Ok(new
            {
                message = "Batch delete operation completed.",
                deleted = deletedFiles,
                notFound = notFoundFiles,
                errors = errorFiles
            });
        }
    }
}
