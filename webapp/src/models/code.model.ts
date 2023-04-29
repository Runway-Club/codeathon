export interface Code {
    languageID: number;
    languageName?: string;
    code: string;
}

export interface CodeTab {
    id: number;
    currentLanguageID: number;
    currentCode?: string;
    codes: Code[];
}

export const DefaultCodes: Code[] = [
    {
        languageID: 50,
        languageName: "C (GCC 9.2.0)",
        code: "#include <stdio.h>\n\nint main() {\n    int input;\n    scanf(\"%d\", &input);\n\n    printf(\"%d\", input);\n    return 0;\n}"
    },
    {
        languageID: 54,
        languageName: "C++ (GCC 9.2.0)",
        code: "#include <iostream>\n\nint main() {\n    int input;\n    std::cin >> input;\n\n    std::cout << input;\n    return 0;\n}"
    },
    {
        languageID: 51,
        languageName: "C# (Mono 6.6.0.161)",
        code: "using System;\n\npublic class Program {\n    public static void Main() {\n        int input = int.Parse(Console.ReadLine());\n\n        Console.WriteLine(input);\n    }\n}"
    },
    {
        languageID: 57,
        languageName: "Elixir (1.9.4)",
        code: "IO.puts \"Hello World\""
    },
    {
        languageID: 58,
        languageName: "Erlang (OTP 22.2)",
        code: "main(_) ->\n    io:fwrite(\"Hello World\")."
    },
    {
        languageID: 60,
        languageName: "Go (1.13.5)",
        code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var input int\n    fmt.Scan(&input)\n\n    fmt.Println(input)\n}"
    },
    {
        languageID: 62,
        languageName: "Java (OpenJDK 13.0.1)",
        code: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int input = scanner.nextInt();\n\n        System.out.println(input);\n    }\n}"
    },
    {
        languageID: 63,
        languageName: "JavaScript (Node.js 12.14.0)",
        code: "process.stdin.resume();\nprocess.stdin.setEncoding('utf8');\n\nprocess.stdin.on('data', function (chunk) {\n    var input = parseInt(chunk.toString(), 10);\n    console.log(input);\n});"
    },
    {
        languageID: 78,
        languageName: "Kotlin (1.3.70)",
        code: "import java.util.Scanner\n\nfun main(args: Array<String>) {\n    val input = Scanner(System.`in`).nextInt()\n    println(input)\n}"
    },
    {
        languageID: 64,
        languageName: "Lua (5.3.5)",
        code: "input = io.read()\n\nprint(input)"
    },
    {
        languageID: 79,
        languageName: "Objective-C (Clang 7.0.1)",
        code: "#import <Foundation/Foundation.h>\n\nint main(int argc, const char * argv[]) {\n    @autoreleasepool {\n        int input;\n        scanf(\"%d\", &input);\n\n        printf(\"%d\", input);\n    }\n    return 0;\n}"
    },
    {
        languageID: 68,
        languageName: "PHP (7.4.1)",
        code: "<?php\n\n$input = (int) fgets(STDIN);\n\necho $input;"
    },
    {
        languageID: 70,
        languageName: "Python (2.7.17)",
        code: "print raw_input()"
    },
    {
        languageID: 71,
        languageName: "Python (3.8.1)",
        code: "print(input())"
    },

    {
        languageID: 72,
        languageName: "Ruby (2.7.0)",
        code: "input = gets.to_i\n\nputs input"
    },
    {
        languageID: 73,
        languageName: "Rust (1.40.0)",
        code: "use std::io;\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n\n    let input: i32 = input.trim().parse().unwrap();\n\n    println!(\"{}\", input);\n}"
    },
    {
        languageID: 81,
        languageName: "Scala (2.13.2)",
        code: "object Main extends App {\n    val input = scala.io.StdIn.readInt()\n    println(input)\n}"
    },
    {
        languageID: 82,
        languageName: "SQL (SQLite 3.27.2)",
        code: "SELECT 'Hello World'"
    },
    {
        languageID: 83,
        languageName: "Swift (5.2.3)",
        code: "import Foundation\n\nlet input = Int(readLine()!)!\n\nprint(input)"
    },
    {
        languageID: 74,
        languageName: "TypeScript (3.7.4)",
        code: "process.stdin.resume();\nprocess.stdin.setEncoding('utf8');\n\nprocess.stdin.on('data', function (chunk) {\n    var input = parseInt(chunk.toString(), 10);\n    console.log(input);\n});"
    },
]

export const CodeMap = {
    50: "c",
    54: "cpp",
    51: "csharp",
    57: "elixir",
    58: "erl",
    60: "go",
    62: "java",
    63: "javascript",
    78: "kotlin",
    64: "lua",
    79: "objective-c",
    68: "php",
    70: "python",
    71: "python",
    72: "ruby",
    73: "rust",
    81: "scala",
    82: "sql",
    83: "swift",
    74: "typescript",
}


