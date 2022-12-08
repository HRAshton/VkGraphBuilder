using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NetworkXWrapper;
using VkGraphBuilder.BusinessLogic;

namespace VkGraphBuilder.WebUI.Controllers
{
    public class AnalyzerController : Controller
    {
        private readonly ILogger<AnalyzerController> logger;

        public AnalyzerController(
            ILogger<AnalyzerController> logger,
            NetworkXWrapper.NetworkXWrapper networkXWrapper)
        {
            NetworkXWrapper = networkXWrapper;
            this.logger = logger;
        }

        private NetworkXWrapper.NetworkXWrapper NetworkXWrapper { get; }

        [HttpPut]
        public async Task<AnalyzingResult> Analyze([FromBody] List<EdgeModel> edges)
        {
            var calcStatisticsAsync = await NetworkXWrapper.CalcStatisticsAsync(edges);
            return calcStatisticsAsync;
        }
    }
}