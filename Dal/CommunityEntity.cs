namespace Dal;

public class CommunityEntity
{
    public CommunityEntity(int id, string name, string? imageSrc, string extras, string link)
    {
        Id = id;
        Name = name ?? throw new ArgumentNullException(nameof(name));
        ImageSrc = imageSrc;
        Extras = extras ?? throw new ArgumentNullException(nameof(extras));
        Link = link ?? throw new ArgumentNullException(nameof(link));
    }

    public int Id { get; }

    public string Name { get; }

    public string? ImageSrc { get; }

    public string Extras { get; }

    public string Link { get; }
}