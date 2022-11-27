using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using VkGraphBuilder.BusinessLogic;

namespace VkGraphBuilder.WebUI.Controllers
{
    public class ExportController : Controller
    {
        private readonly ILogger<ExportController> logger;

        public ExportController(ILogger<ExportController> logger, IDistributedCache cache)
        {
            Cache = cache;
            this.logger = logger;
        }

        private IDistributedCache Cache { get; }

        [HttpPost]
        public async Task<Guid> UploadGraph([FromBody] GraphModel graph, CancellationToken cancellationToken)
        {
            var cacheKey = Guid.NewGuid();

            await Cache.SetObjectAsync("export_" + cacheKey, graph, cancellationToken);

            return cacheKey;
        }

        [HttpGet]
        public async Task<FileContentResult> Export(Guid graphId, CancellationToken cancellationToken)
        {
            var graph = await Cache.GetObjectAsync<GraphModel>("export_" + graphId, cancellationToken);

            var tgfContent = new StringBuilder();
            foreach (var node in graph.Nodes)
            {
                var latinName = AnyAscii.Transliteration.Transliterate(node.Name);

                tgfContent.Append($"{node.Id} {latinName}\r\n");
            }

            tgfContent.Append("#\r\n");

            var containsWeights = graph.Edges.Any(edge => edge.Weight != default);
            foreach (var edge in graph.Edges)
            {
                tgfContent.Append($"{edge.FromId} {edge.ToId} {(containsWeights ? edge.Weight : string.Empty)}\r\n");
            }

            var fileContent = File(Encoding.ASCII.GetBytes(tgfContent.ToString()), "text/tgf", "graph.tgf");

            return fileContent;
        }
    }
}