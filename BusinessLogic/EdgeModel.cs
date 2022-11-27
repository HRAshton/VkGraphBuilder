using System;

namespace VkGraphBuilder.BusinessLogic
{
    [Serializable]
    public class EdgeModel
    {
        public EdgeModel(long anyKey1, long anyKey2, uint weight = 1)
        {
            FromId = Math.Min(anyKey1, anyKey2);
            ToId = Math.Max(anyKey1, anyKey2);
            Weight = weight;
        }
        
        public long FromId { get; set; }

        public long ToId { get; set; }

        public uint Weight { get; set; }
    }
}