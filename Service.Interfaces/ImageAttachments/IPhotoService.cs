namespace Service.Interfaces.ImageAttachments;

using System.Threading.Tasks;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

public interface IPhotoService
{
    Task<ImageUploadResult> AddPhoto(IFormFile file);
    Task<DeletionResult> DeletePhoto(string publicId);
}
