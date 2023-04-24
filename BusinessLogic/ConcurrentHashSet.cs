using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace VkGraphBuilder.BusinessLogic;

public class ConcurrentHashSet<T> : IEnumerable<T>
{
    private readonly ConcurrentDictionary<T, byte> dictionary = new ();

    public ConcurrentHashSet()
    {
    }

    public ConcurrentHashSet(params T[] initialValues)
    {
        foreach (var initialValue in initialValues)
        {
            Add(initialValue);
        }
    }

    public int Count => dictionary.Count;

    public IEnumerator<T> GetEnumerator()
    {
        return dictionary.Keys.GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }

    public bool Add(T item)
    {
        return dictionary.TryAdd(item, 0);
    }

    public bool Contains(T item)
    {
        return dictionary.ContainsKey(item);
    }

    public bool Remove(T item)
    {
        return dictionary.TryRemove(item, out _);
    }

    public void Clear()
    {
        dictionary.Clear();
    }
}