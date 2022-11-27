using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace VkGraphBuilder.BusinessLogic
{
    public static class DistributedCacheExtensions
    {
        public static async Task<T> GetOrAddAsync<T>(
            this IDistributedCache distributedCache,
            string key,
            Func<Task<T>> factory)
            where T : class
        {
            var value = await distributedCache.GetObjectAsync<T>(key);
            if (value is not null)
            {
                return value;
            }

            try
            {
                value = await factory();
            }
            catch
            {
                value = null;
            }

            await distributedCache.SetObjectAsync(key, value);

            return value;
        }

        public static async Task<T> GetObjectAsync<T>(this IDistributedCache distributedCache, string key)
            where T : class
        {
            string serializedValue = await distributedCache.GetStringAsync(key);
            if (serializedValue is null)
            {
                return null;
            }

            var value = JsonConvert.DeserializeObject<T>(serializedValue);

            return value;
        }

        public static async Task SetObjectAsync<T>(this IDistributedCache distributedCache, string key, T value)
            where T : class
        {
            var serializedValue = JsonConvert.SerializeObject(value);

            await distributedCache.SetStringAsync(key, serializedValue);
        }
    }
}