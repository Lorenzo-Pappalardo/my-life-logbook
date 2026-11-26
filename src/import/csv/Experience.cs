internal class Experience
{
    public required int Id {get; init; }
    public required string Title { get; init; }
    public required string? Description { get; init; }
    public required string Context { get; init; }
    public required DateTime StartDate { get; init; }
    public required DateTime? EndDate { get; init; }
    public required bool Impact { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime? UpdatedAt { get; init; }

    public override string ToString()
    {
        return $"{Id} | {Title} | {Context} | {Impact} | {StartDate} | {EndDate} | {CreatedAt} | {UpdatedAt}";
    }
}