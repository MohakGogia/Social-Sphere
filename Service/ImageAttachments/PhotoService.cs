namespace Service.ImageAttachments;

using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Core.Configuration;
using Microsoft.AspNetCore.Http;
using Service.Interfaces.ImageAttachments;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;

    public PhotoService(CloudinarySettings cloudinarySettings)
    {
        var acc = new Account
            (
            cloudinarySettings.CloudName,
            cloudinarySettings.ApiKey,
            cloudinarySettings.ApiSecret
            );
        _cloudinary = new Cloudinary(acc);
    }

    public async Task<ImageUploadResult> AddPhoto(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        if (file?.Length > 0)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "profile-pics"
            };
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;

    }
    public async Task<DeletionResult> DeletePhoto(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);

        return await _cloudinary.DestroyAsync(deleteParams);
    }
}
