using System.Diagnostics;
using System.Reflection;
using Newtonsoft.Json;
using VkGraphBuilder.BusinessLogic;

namespace NetworkXWrapper;

public class NetworkXWrapper
{
    public async Task<AnalyzingResult> CalcStatisticsAsync(ICollection<EdgeModel> edges)
    {
        var argsJson = JsonConvert.SerializeObject(edges);
        var result = await RunScriptAsync(argsJson);
        
        if (result is null)
        {
            throw new Exception("Analyzer results decoding fault");
        }

        // var stats = edges
        //     .Select(x => x.FromId)
        //     .Concat(edges.Select(x => x.ToId))
        //     .Distinct()
        //     .ToDictionary(x => x, _ => 0.5f);

        // return new AnalyzingResult
        // {
        //     Degree = stats,
        //     DegreeCentrality = stats,
        //     BetweennessCentrality = stats,
        //     ClosenessCentrality = stats,
        //     EigenvectorCentrality = stats,
        //     KatzCentrality = stats,
        //     HarmonicCentrality = stats,
        // };
        
        return result;
    }

    private static async Task<AnalyzingResult?> RunScriptAsync(string jsonEdges)
    {
        var exeDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!;

        var pythonPath = Path.Combine(exeDir, "venv/Scripts/python.exe");
        var scriptPath = Path.Combine(exeDir, "analyzer.py");

        var graphFilePath = Path.GetTempFileName();
        await File.WriteAllTextAsync(graphFilePath, jsonEdges);

        ProcessStartInfo start = new ()
        {
            FileName = pythonPath,
            Arguments = $"{scriptPath} {graphFilePath}",
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
        };

        using var process = Process.Start(start);

        var resultJson = await process.StandardOutput.ReadToEndAsync();

        process.Kill(true);
        File.Delete(graphFilePath);

        if (resultJson is null)
        {
            throw new Exception("Analyzer fault");
        }

        var result = JsonConvert.DeserializeObject<AnalyzingResult>(resultJson);

        return result;
    }
}