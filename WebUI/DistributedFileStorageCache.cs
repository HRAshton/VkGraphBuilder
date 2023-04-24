using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;

namespace VkGraphBuilder.WebUI;

public class DistributedFileStorageCache : IDistributedCache
{
    private readonly DirectoryInfo folder = new ("cached");
    
    public byte[] Get(string key)
    {
        var task = GetAsync(key);
        task.Wait();
        return task.Result;
    }

    public async Task<byte[]> GetAsync(string key, CancellationToken token = new ())
    {
        var filePath = Path.Combine(folder.FullName, ToFilename(key));
        return File.Exists(filePath) && new FileInfo(filePath).Length is not 0
            ? await File.ReadAllBytesAsync(filePath, token)
            : null;
    }

    public void Refresh(string key)
    {
    }

    public Task RefreshAsync(string key, CancellationToken token = new ())
    {
        return Task.CompletedTask;
    }

    public void Remove(string key)
    {
        var filePath = Path.Combine(folder.FullName, ToFilename(key));
        File.Delete(filePath);
    }

    public Task RemoveAsync(string key, CancellationToken token = new ())
    {
        Remove(key);
        return Task.CompletedTask;
    }

    public void Set(string key, byte[] value, DistributedCacheEntryOptions options)
    {
        SetAsync(key, value, options).Wait();
    }

    public async Task SetAsync(string key, byte[] value, DistributedCacheEntryOptions options,
        CancellationToken token = new ())
    {
        var filePath = Path.Combine(folder.FullName, ToFilename(key));
        await File.WriteAllBytesAsync(filePath, value, token);
    }

    private static string ToFilename(string key)
    {
        using var sha1 = SHA1.Create();
        return Convert.ToHexString(sha1.ComputeHash(Encoding.UTF8.GetBytes(key)));
    }
}