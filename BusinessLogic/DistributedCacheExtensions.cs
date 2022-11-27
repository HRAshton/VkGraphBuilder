using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace VkGraphBuilder.BusinessLogic
{
    public static class DistributedCacheExtensions
    {
        public static async Task<T[]> GetOrAddArrayAsync<T>(
            this IDistributedCache distributedCache,
            string key,
            Func<CancellationToken, Task<T[]>> factory,
            CancellationToken cancellationToken = default)
            where T : class
        {
            var value = await distributedCache.GetObjectAsync<T[]>(key, cancellationToken);
            if (value is not null)
            {
                return value;
            }

            try
            {
                value = await factory(cancellationToken);
            }
            catch
            {
                // pass
            }

            value ??= Array.Empty<T>();

            await distributedCache.SetObjectAsync(key, value, cancellationToken);

            return value;
        }

        public static async Task<T> GetObjectAsync<T>(
            this IDistributedCache distributedCache,
            string key,
            CancellationToken cancellationToken = default)
            where T : class
        {
            string serializedValue = await distributedCache.GetStringAsync(key, cancellationToken);
            if (serializedValue is null)
            {
                return null;
            }

            var value = JsonConvert.DeserializeObject<T>(serializedValue);

            return value;
        }

        public static async Task SetObjectAsync<T>(
            this IDistributedCache distributedCache,
            string key,
            T value,
            CancellationToken cancellationToken = default)
            where T : class
        {
            var serializedValue = JsonConvert.SerializeObject(value);

            await distributedCache.SetStringAsync(key, serializedValue, token: cancellationToken);
        }
    }
}