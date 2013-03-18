using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text;

namespace HtmlBuilder
{
    class Program
    {
        static void Main(string[] args)
        {            
            var rootPath = args.Length > 0 ? args[0] : GetRootPath();
            var htmlAppPath = Path.Combine(rootPath, "APPLICATION");

            var stubs = new Dictionary<string, string>();
            foreach (var stubPath in Directory.GetFiles(htmlAppPath + "\\Html"))
            {
                var name = Path.GetFileNameWithoutExtension(stubPath);
                var content = File.ReadAllText(stubPath);
                stubs.Add(name, content);
            }

            var devHtml = File.ReadAllText(htmlAppPath + "\\elixir.html");
            var sb = new StringBuilder();

            using (var reader = new StreamReader(htmlAppPath + "\\elixirDev.html"))
            {
                string line;

                while ((line = reader.ReadLine()) != null)
                {
                    Debug.WriteLine(line);
                    var stubName = GetStubName(line, '"');

                    if (string.IsNullOrEmpty(stubName))
                        stubName = GetStubName(line, '\'');

                    if (string.IsNullOrEmpty(stubName))
                        sb.AppendLine(line);
                    else
                        sb.Append(stubs[stubName]);
                }
            }

            File.WriteAllText(htmlAppPath + "\\elixir.html", sb.ToString());
            Console.WriteLine(args[0]);            
        }

        static string GetRootPath()
        {
            var cmdPath = Assembly.GetEntryAssembly().Location;
            var debugPath = Path.GetDirectoryName(cmdPath);
            var debugFolder = new DirectoryInfo(debugPath);
            var gitHubFolder = debugFolder.Parent.Parent.Parent;
            
            return gitHubFolder.FullName;
        }
        static string GetStubName(string line, char terminator)
        {
            var criterion = string.Format("<div class={0}stub ", terminator);

            var index = line.IndexOf(criterion, StringComparison.Ordinal);

            if (index == -1) 
                return string.Empty;

            var start = index + criterion.Length;
            var end = line.IndexOf(terminator, start);
            return line.Substring(start, end - start);
        }
    }
}
