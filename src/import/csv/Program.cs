using System.Text.Encodings.Web;
using System.Text.Json;

try
{
    string? path = null;
    var debugEnabled = false;

    switch (args.Length)
    {
        case 0:
            Console.WriteLine("Path to files to import:");
            path = Console.ReadLine();
            break;

        case 1:
            path = args[0];
            break;

        case 2:
            debugEnabled = args[1] == "-d";
            break;
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

    foreach (string error in errors)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.Error.WriteLine(error);
        Console.ResetColor();
    }

    DateOnly today = DateOnly.FromDateTime(DateTime.Now);
    using FileStream outputFile = File.Create(Path.Combine(outputDirectory, $"from_csv-{today.Year}_{today.Month}_{today.Day}.json"));

    JsonSerializerOptions jsonSerializerOptions = new()
    {
        IncludeFields = true,
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };
    await JsonSerializer.SerializeAsync(outputFile, experiences, jsonSerializerOptions);

    return errors.Count > 0 ? 1 : 0;
}
catch (Exception ex)
{
    Console.WriteLine(ex);
    return 1;
}