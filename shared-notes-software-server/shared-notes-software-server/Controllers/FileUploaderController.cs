using Microsoft.AspNetCore.Mvc;

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

        [HttpPost("/api/v1/upload-files")]
        public IActionResult UploadFiles([FromForm] List<IFormFile> files) 
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded.");

            string directoryPath = Path.Combine(_env.ContentRootPath, "uploadedFiles");
            Directory.CreateDirectory(directoryPath);

            var savedFiles = new List<string>();

            foreach (var file in files)
            {
                string timestamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                string safeName = Path.GetFileNameWithoutExtension(file.FileName);
                string extension = Path.GetExtension(file.FileName);
                string newName = $"{safeName}_{timestamp}{extension}";
                string fullPath = Path.Combine(directoryPath, newName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                    file.CopyTo(stream);

                savedFiles.Add($"{newName}");
            }

            return Ok(savedFiles);
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
