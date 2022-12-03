using System;

namespace VkGraphBuilder.BusinessLogic
{
    [Serializable]
    public class EdgeModel
    {
        public EdgeModel()
        {
        }
        
        public EdgeModel(Guid anyKey1, Guid anyKey2, uint weight = 1)
        {
            var (min, max) = GuidUtils.MinMax(anyKey1, anyKey2);
            FromId = min;
            ToId = max;
            Weight = weight;
        }
        
        public Guid FromId { get; set; }

        public Guid ToId { get; set; }

        public uint Weight { get; set; }
    }
}