using System.Text.Encodings.Web;
using System.Text.Json;

try
{
    string? path = null;
    var debugEnabled = false;

    if (args.Length == 0)
    {
        Console.WriteLine("Path to files to import:");
        path = Console.ReadLine();
    }
    else if (args.Length > 0)
    {
        path = args[0];

        if (args.Length > 1)
            debugEnabled = args[1] == "-d";
    }

    if (path == null || !File.Exists(path))
    {
        Console.WriteLine("Invalid path.");
        return 1;
    }

    var outputDirectory = "../../import/entries";
    if (!Directory.Exists(outputDirectory))
        Directory.CreateDirectory(outputDirectory);

    (List<Experience> experiences, List<string> errors) = await Parser.Parse(path, debugEnabled);

    JsonSerializerOptions jsonSerializerOptions = new()
    {
        IncludeFields = true,
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };
    DateOnly today = DateOnly.FromDateTime(DateTime.Now);
    using FileStream errorOutputFile = File.Create(Path.Combine(outputDirectory, $"error_from_csv-{today.Year}_{today.Month}_{today.Day}.json"));

    if (debugEnabled)
    {
        Console.WriteLine($"Number of records correctly parsed: {experiences.Count}");

        foreach (string error in errors)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Error.WriteLine(error);
            Console.ResetColor();
        }
    }
    await JsonSerializer.SerializeAsync(errorOutputFile, errors, jsonSerializerOptions);

    using FileStream outputFile = File.Create(Path.Combine(outputDirectory, $"from_csv-{today.Year}_{today.Month}_{today.Day}.json"));
    await JsonSerializer.SerializeAsync(outputFile, experiences, jsonSerializerOptions);

    return errors.Count > 0 ? 1 : 0;
}
catch (Exception ex)
{
    Console.WriteLine(ex);
    return 1;
}