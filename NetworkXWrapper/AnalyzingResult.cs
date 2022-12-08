using Newtonsoft.Json;

namespace NetworkXWrapper;

[Serializable]
public class AnalyzingResult
{
    [JsonProperty("degree")]
    public Dictionary<Guid, float> Degree { get; set; }

    [JsonProperty("degree_centrality")]
    public Dictionary<Guid, float> DegreeCentrality { get; set; }

    [JsonProperty("betweenness_centrality")]
    public Dictionary<Guid, float> BetweennessCentrality { get; set; }

    [JsonProperty("closeness_centrality")]
    public Dictionary<Guid, float> ClosenessCentrality { get; set; }

    [JsonProperty("eigenvector_centrality")]
    public Dictionary<Guid, float> EigenvectorCentrality { get; set; }

    [JsonProperty("katz_centrality")]
    public Dictionary<Guid, float> KatzCentrality { get; set; }

    [JsonProperty("harmonic_centrality")]
    public Dictionary<Guid, float> HarmonicCentrality { get; set; }
}