using System;

namespace VkGraphBuilder.BusinessLogic
{
    [Serializable]
    public class EdgeModel
    {
        public EdgeModel()
        {
        }
        
        public EdgeModel(long anyKey1, long anyKey2, uint weight = 1)
        {
            var (min, max) = GuidUtils.MinMax(anyKey1, anyKey2);
            FromId = min;
            ToId = max;
            Weight = weight;
        }
        
        public long FromId { get; set; }

        public long ToId { get; set; }

        public uint Weight { get; set; }
    }
}