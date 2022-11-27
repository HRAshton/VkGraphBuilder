using System;

namespace VkGraphBuilder.BusinessLogic
{
    [Serializable]
    public class EdgeModel
    {
        public long FromId { get; set; }

        public long ToId { get; set; }

        public uint Weight { get; set; }
    }
}