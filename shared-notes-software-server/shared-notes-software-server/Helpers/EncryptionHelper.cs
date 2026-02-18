using System.Security.Cryptography;
using System.Text;

public static class EncryptionHelper
{
    private static readonly string SecretKey = "your-super-secret-key-123456";

    public static string Encrypt(string plainText)
    {
        using var aes = Aes.Create();
        aes.Key = Encoding.UTF8.GetBytes(SecretKey.PadRight(32));
        aes.GenerateIV();

        var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var encryptedBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

        return Convert.ToBase64String(aes.IV.Concat(encryptedBytes).ToArray());
    }

    public static string Decrypt(string cipherText)
    {
        var fullCipher = Convert.FromBase64String(cipherText);

        using var aes = Aes.Create();
        aes.Key = Encoding.UTF8.GetBytes(SecretKey.PadRight(32));

        var iv = fullCipher.Take(16).ToArray();
        var cipher = fullCipher.Skip(16).ToArray();

        aes.IV = iv;

        var decryptor = aes.CreateDecryptor();
        var decryptedBytes = decryptor.TransformFinalBlock(cipher, 0, cipher.Length);

        return Encoding.UTF8.GetString(decryptedBytes);
    }
}
