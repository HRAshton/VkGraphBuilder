using System;

namespace VkGraphBuilder.BusinessLogic
{
    public static class GuidUtils
    {
        public static long ToGuid(long value)
        {
            return value;
        }

        public static long ToLong(long guid)
        {
            return guid;
        }

        public static (long Min, long Max) MinMax(long guid1, long guid2)
        {
            return guid1.CompareTo(guid2) > 0
                ? (guid1, guid2)
                : (guid2, guid1);
        }
    }

    public static class GuidUtils2
    {
        public static Guid ToGuid(long value)
        {
            var guidData = new byte[16];

            Array.Copy(BitConverter.GetBytes(value), guidData, 8);
            return new Guid(guidData);
        }

        public static long ToLong(Guid guid)
        {
            return BitConverter.ToInt64(guid.ToByteArray()[..8], 0);
        }

        public static (Guid Min, Guid Max) MinMax(Guid guid1, Guid guid2)
        {
            return guid1.CompareTo(guid2) > 0
                ? (guid1, guid2)
                : (guid2, guid1);
        }
    }
}