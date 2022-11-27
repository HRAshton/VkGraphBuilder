using System.Collections.Generic;

namespace VkGraphBuilder.BusinessLogic
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<ICollection<T>> ChunkBy<T>(this IEnumerable<T> collection, int chunkSize)
        {
            var nextBatch = new List<T>(chunkSize);
            foreach (var item in collection)
            {
                nextBatch.Add(item);
                if (nextBatch.Count != chunkSize)
                {
                    continue;
                }

                yield return nextBatch;
                nextBatch = new List<T>(chunkSize);
            }

            if (nextBatch.Count > 0)
            {
                yield return nextBatch;
            }
        }
    }
}