using System.Text.RegularExpressions;

internal static partial class Parser
{
    [GeneratedRegex("^(?<id>\\d+),\"(?<title>.*)\",\"(?<description>.*)\",(?<context>.*),(?<startDate>.*),(?<endDate>.*),(?<impact>.*),(?<createdAt>.*),(?<updatedAt>.*)$", RegexOptions.IgnoreCase)]
    private static partial Regex ComplexInput();

    [GeneratedRegex("\"\"", RegexOptions.IgnoreCase)]
    private static partial Regex DoubleQuotes();

    internal async static Task<(List<Experience>, List<string>)> Parse(string path, bool debugEnabled)
    {
        List<string> errors = [];
        List<Experience> experiences = [];
        bool skipHeaders = true;

        foreach (string line in await File.ReadAllLinesAsync(path))
        {
            if (skipHeaders)
            {
                skipHeaders = false;
                continue;
            }

            try
            {
                var matches = ComplexInput().Match(line);

                if (matches.Success)
                {
                    var id = matches.Groups["id"].Value;
                    var title = matches.Groups["title"].Value;
                    var description = matches.Groups["description"].Value;
                    var context = matches.Groups["context"].Value;
                    var startDate = matches.Groups["startDate"].Value;
                    var endDate = matches.Groups["endDate"].Value;
                    var impact = matches.Groups["impact"].Value;
                    var createdAt = matches.Groups["createdAt"].Value;
                    var updatedAt = matches.Groups["updatedAt"].Value;

                    if (debugEnabled)
                    {
                        Console.WriteLine('[' + id + ']');
                        Console.WriteLine('[' + title + ']');
                        Console.WriteLine('[' + description + ']');
                        Console.WriteLine('[' + context + ']');
                        Console.WriteLine('[' + startDate + ']');
                        Console.WriteLine('[' + endDate + ']');
                        Console.WriteLine('[' + impact + ']');
                        Console.WriteLine('[' + createdAt + ']');
                        Console.WriteLine('[' + updatedAt + ']');
                    }

                    experiences.Add(
                        new Experience()
                        {
                            Id = int.Parse(id),
                            Title = JoinDoubleQuotes(title),
                            Description = JoinDoubleQuotes(description),
                            Context = context,
                            StartDate = ParseUTC(startDate) ?? new DateTime(),
                            EndDate = ParseUTC(endDate),
                            Impact = impact == "t",
                            CreatedAt = ParseUTC(createdAt) ?? new DateTime(),
                            UpdatedAt = ParseUTC(updatedAt),
                        }
                    );
                }
                else
                    throw new Exception("Not matching regular expression");
            }
            catch (Exception e)
            {
                errors.Add($"{e.Message} ==> {line}");
            }
        }

        return (experiences, errors);
    }

    private static string JoinDoubleQuotes(string raw)
    {
        return DoubleQuotes().Replace(raw, "\"");
    }

    private static DateTime? ParseUTC(string possibleDate)
    {
        if (possibleDate.Length == 0) return null;

        return DateTime.Parse(possibleDate);
    }
}
