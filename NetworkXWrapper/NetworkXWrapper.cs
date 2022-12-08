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
        var resultJson = await RunScriptAsync(argsJson);
        var result = JsonConvert.DeserializeObject<AnalyzingResult>(resultJson);

        if (result is null)
        {
            throw new Exception("Analyzer results decoding fault");
        }

        return result;
    }

    private static async Task<string> RunScriptAsync(string jsonEdges)
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
        
        var result = await process.StandardOutput.ReadToEndAsync();

        process.Kill(true);
        File.Delete(graphFilePath);

        if (result is null)
        {
            throw new Exception("Analyzer fault");
        }

        return result;
    }
}