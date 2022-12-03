using System;

namespace VkGraphBuilder.BusinessLogic
{
    public static class GuidUtils
    {
        public static Guid ToGuid(long value)
        {
            var guidData = new byte[16];
            Array.Copy(BitConverter.GetBytes(value), guidData, 8);
            return new Guid(guidData);
        }

        public static long ToLong(Guid guid)
        {
            if (BitConverter.ToInt64(guid.ToByteArray(), 8) != 0)
                throw new OverflowException("Value was either too large or too small for an Int64.");
            return BitConverter.ToInt64(guid.ToByteArray(), 0);
        }

        public static (Guid Min, Guid Max) MinMax(Guid guid1, Guid guid2)
        {
            return guid1.CompareTo(guid2) > 0
                ? (guid1, guid2)
                : (guid2, guid1);
        }
    }
}