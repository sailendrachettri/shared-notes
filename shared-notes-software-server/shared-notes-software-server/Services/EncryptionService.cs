using System.Security.Cryptography;
using System.Text;

public class EncryptionService
{
    private readonly byte[] _key;

    public EncryptionService(IConfiguration configuration)
    {
        var keyString = configuration["EncryptionSettings:Key"];

        if (string.IsNullOrEmpty(keyString) || keyString.Length != 32)
            throw new Exception("Encryption key must be 32 characters.");

        _key = Encoding.UTF8.GetBytes(keyString);
    }

    public string Encrypt(string plainText)
    {
        using var aes = Aes.Create();
        aes.Key = _key;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var encryptedBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

        var result = aes.IV.Concat(encryptedBytes).ToArray();

        return Convert.ToBase64String(result);
    }

    public string Decrypt(string cipherText)
    {
        var fullCipher = Convert.FromBase64String(cipherText);

        using var aes = Aes.Create();
        aes.Key = _key;

        var iv = fullCipher.Take(16).ToArray();
        var cipher = fullCipher.Skip(16).ToArray();

        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor();
        var decryptedBytes = decryptor.TransformFinalBlock(cipher, 0, cipher.Length);

        return Encoding.UTF8.GetString(decryptedBytes);
    }
}
