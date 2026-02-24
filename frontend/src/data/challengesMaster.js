export const ESCAPE_ROOMS_DATA = [
    {
        "id": 1, "domain": "Programming Logic", "tasks": [
            { "id": 1, "title": "Variable Swapping", "description": "Swap a and b without a third variable.", "sample_input": "a=5, b=10", "expected_output": "a=10, b=5", "difficulty": "Easy", "hint": "Use a = a + b; b = a - b; a = a - b;" },
            { "id": 2, "title": "Greatest of Three", "description": "Find the largest of three integers.", "sample_input": "1, 5, 3", "expected_output": "5", "difficulty": "Easy", "hint": "Use nested if or logical AND." },
            { "id": 3, "title": "Leap Year", "description": "Check if a year is a leap year.", "sample_input": "2024", "expected_output": "True", "difficulty": "Easy", "hint": "Divisible by 4 and not 100, or divisible by 400." },
            { "id": 4, "title": "Factorial", "description": "Calculate n!.", "sample_input": "5", "expected_output": "120", "difficulty": "Medium", "hint": "Use a loop or recursion." },
            { "id": 5, "title": "Fibonacci", "description": "Find nth Fibonacci number.", "sample_input": "6", "expected_output": "8", "difficulty": "Medium", "hint": "Sum of two previous terms." },
            { "id": 6, "title": "Prime Test", "description": "Check if p is prime.", "sample_input": "7", "expected_output": "True", "difficulty": "Medium", "hint": "Check divisors up to sqrt(p)." },
            { "id": 7, "title": "Reverse Int", "description": "Reverse digits of an integer.", "sample_input": "123", "expected_output": "321", "difficulty": "Medium", "hint": "Use modulo and division." },
            { "id": 8, "title": "Armstrong", "description": "Check if sum of cubes of digits equals number.", "sample_input": "153", "expected_output": "True", "difficulty": "Medium", "hint": "1^3 + 5^3 + 3^3 = 153." },
            { "id": 9, "title": "GCD", "description": "Find greatest common divisor.", "sample_input": "12, 18", "expected_output": "6", "difficulty": "Medium", "hint": "Use Euclidean algorithm." },
            { "id": 10, "title": "FizzBuzz", "description": "Standard FizzBuzz for n=15.", "sample_input": "15", "expected_output": "FizzBuzz at 15", "difficulty": "Easy", "hint": "Multiples of 3 and 5." }
        ]
    },
    {
        "id": 2, "domain": "C Language", "tasks": [
            { "id": 1, "title": "ASCII", "description": "Get ASCII of 'A'.", "sample_input": "'A'", "expected_output": "65", "difficulty": "Easy", "hint": "(int)char in C." },
            { "id": 2, "title": "Ptr Basics", "description": "Declare an int pointer p to x.", "sample_input": "int x=5", "expected_output": "int *p = &x", "difficulty": "Easy", "hint": "& for address." },
            { "id": 3, "title": "Str Len", "description": "Find length without strlen().", "sample_input": "'cat'", "expected_output": "3", "difficulty": "Medium", "hint": "Iterate until '\\0'." },
            { "id": 4, "title": "Struct", "description": "Access member 'x' of Point p.", "sample_input": "p.x", "expected_output": "value", "difficulty": "Easy", "hint": "Use dot operator." },
            { "id": 5, "title": "Malloc", "description": "Allocate int array of size 5.", "sample_input": "5", "expected_output": "malloc(5 * sizeof(int))", "difficulty": "Medium", "hint": "stdlib.h." },
            { "id": 6, "title": "Bitwise OR", "description": "Set 3rd bit of x.", "sample_input": "x | (1 << 2)", "expected_output": "updated x", "difficulty": "Medium", "hint": "Shift 1 left twice." },
            { "id": 7, "title": "Union", "description": "Size of union {int a; char b;}.", "sample_input": "4, 1", "expected_output": "4", "difficulty": "Medium", "hint": "Shares memory." },
            { "id": 8, "title": "File Open", "description": "Open 'data.txt' for reading.", "sample_input": "none", "expected_output": "fopen(\"data.txt\", \"r\")", "difficulty": "Easy", "hint": "Use fopen." },
            { "id": 9, "title": "Macro", "description": "Define SQUARE(x).", "sample_input": "5", "expected_output": "25", "difficulty": "Easy", "hint": "#define SQUARE(x) ((x)*(x))" },
            { "id": 10, "title": "Recursion Sum", "description": "Sum of first n numbers.", "sample_input": "5", "expected_output": "15", "difficulty": "Medium", "hint": "n + sum(n-1)." }
        ]
    },
    {
        "id": 3, "domain": "C++", "tasks": [
            { "id": 1, "title": "Class", "description": "Declare class 'Box'.", "sample_input": "none", "expected_output": "class Box { };", "difficulty": "Easy", "hint": "Class keyword." },
            { "id": 2, "title": "Inherit", "description": "Inherit B from A.", "sample_input": "none", "expected_output": "class B : public A { }", "difficulty": "Medium", "hint": "Use colon." },
            { "id": 3, "title": "Virtual", "description": "Runtime polymorphism keyword.", "sample_input": "none", "expected_output": "virtual", "difficulty": "Medium", "hint": "Used in headers." },
            { "id": 4, "title": "Vector", "description": "Add 10 to vector v.", "sample_input": "v", "expected_output": "v.push_back(10)", "difficulty": "Easy", "hint": "Standard library." },
            { "id": 5, "title": "Template", "description": "Generic type T syntax.", "sample_input": "none", "expected_output": "template <typename T>", "difficulty": "Hard", "hint": "Used for classes/funcs." },
            { "id": 6, "title": "Friend", "description": "Access private members.", "sample_input": "none", "expected_output": "friend", "difficulty": "Medium", "hint": "Friend keyword." },
            { "id": 7, "title": "New", "description": "Allocate int on heap.", "sample_input": "none", "expected_output": "int* p = new int", "difficulty": "Easy", "hint": "Keyword: new." },
            { "id": 8, "title": "Cout", "description": "Print 'Hi' with endl.", "sample_input": "none", "expected_output": "std::cout << \"Hi\" << std::endl;", "difficulty": "Easy", "hint": "iostream." },
            { "id": 9, "title": "Namespace", "description": "Use standard namespace.", "sample_input": "none", "expected_output": "using namespace std;", "difficulty": "Easy", "hint": "Shortens code." },
            { "id": 10, "title": "Boolean", "description": "C++ bool values.", "sample_input": "none", "expected_output": "true / false", "difficulty": "Easy", "hint": "Built-in." }
        ]
    },
    {
        "id": 4, "domain": "Python", "tasks": [
            { "id": 1, "title": "List Comp", "description": "Squares of 1-5.", "sample_input": "[1..5]", "expected_output": "[1,4,9,16,25]", "difficulty": "Easy", "hint": "[x*x for x in list]" },
            { "id": 2, "title": "Dict Add", "description": "Add 'a':1 to d.", "sample_input": "d", "expected_output": "d['a'] = 1", "difficulty": "Easy", "hint": "Bracket notation." },
            { "id": 3, "title": "Lambda", "description": "Add a and b inline.", "sample_input": "none", "expected_output": "lambda a, b: a + b", "difficulty": "Medium", "hint": "Keyword: lambda." },
            { "id": 4, "title": "Slicing", "description": "Reverse list L.", "sample_input": "L", "expected_output": "L[::-1]", "difficulty": "Easy", "hint": "Double colon." },
            { "id": 5, "title": "Range", "description": "List 0 to 4.", "sample_input": "none", "expected_output": "[0, 1, 2, 3, 4]", "difficulty": "Easy", "hint": "range(5)." },
            { "id": 6, "title": "Split", "description": "Split 'a b' by space.", "sample_input": "'a b'", "expected_output": "['a', 'b']", "difficulty": "Easy", "hint": ".split()." },
            { "id": 7, "title": "Join", "description": "Join list ['a','b'] with '-'.", "sample_input": "['-']", "expected_output": "'a-b'", "difficulty": "Medium", "hint": "'-'.join(list)." },
            { "id": 8, "title": "Def", "description": "Define empty func f.", "sample_input": "none", "expected_output": "def f(): pass", "difficulty": "Easy", "hint": "Use pass." },
            { "id": 9, "title": "Len", "description": "Length of list.", "sample_input": "[]", "expected_output": "0", "difficulty": "Easy", "hint": "len()." },
            { "id": 10, "title": "Import", "description": "Get math library.", "sample_input": "none", "expected_output": "import math", "difficulty": "Easy", "hint": "Standard keyword." }
        ]
    },
    {
        "id": 5, "domain": "Java", "tasks": [
            { "id": 1, "title": "Main", "description": "Signature of main.", "sample_input": "none", "expected_output": "public static void main(String[] args)", "difficulty": "Easy", "hint": "Entry point." },
            { "id": 2, "title": "Println", "description": "Print 'Hi'.", "sample_input": "none", "expected_output": "System.out.println(\"Hi\");", "difficulty": "Easy", "hint": "Std output." },
            { "id": 3, "title": "Final", "description": "Constant keyword.", "sample_input": "none", "expected_output": "final", "difficulty": "Easy", "hint": "Used for values." },
            { "id": 4, "title": "ArrayList", "description": "Add 'x' to list.", "sample_input": "list", "expected_output": "list.add(\"x\")", "difficulty": "Easy", "hint": "Collection method." },
            { "id": 5, "title": "Inherits", "description": "Class keyword.", "sample_input": "none", "expected_output": "extends", "difficulty": "Easy", "hint": "Single inheritance." },
            { "id": 6, "title": "Contract", "description": "Keyword for interfaces.", "sample_input": "none", "expected_output": "implements", "difficulty": "Easy", "hint": "Allows multiple." },
            { "id": 7, "title": "Static", "description": "Shared class member.", "sample_input": "none", "expected_output": "static", "difficulty": "Medium", "hint": "Belongs to class." },
            { "id": 8, "title": "Throw", "description": "Handle error manually.", "sample_input": "none", "expected_output": "throw new Exception()", "difficulty": "Medium", "hint": "Explicit throw." },
            { "id": 9, "title": "This", "description": "Refer to current object.", "sample_input": "none", "expected_output": "this", "difficulty": "Easy", "hint": "Internal ref." },
            { "id": 10, "title": "Constructor", "description": "Initialize object.", "sample_input": "none", "expected_output": "MyClass()", "difficulty": "Easy", "hint": "No return type." }
        ]
    },
    {
        "id": 6, "domain": "JavaScript", "tasks": [
            { "id": 1, "title": "Arrow", "description": "Add a and b as arrow.", "sample_input": "none", "expected_output": "(a, b) => a + b", "difficulty": "Easy", "hint": "ES6." },
            { "id": 2, "title": "Map", "description": "Double x in arr.", "sample_input": "arr", "expected_output": "arr.map(x => x * 2)", "difficulty": "Easy", "hint": "New array returned." },
            { "id": 3, "title": "Destruct", "description": "Get x from obj.", "sample_input": "obj", "expected_output": "{ x } = obj", "difficulty": "Easy", "hint": "Braces." },
            { "id": 4, "title": "Async", "description": "Wait for promise p.", "sample_input": "p", "expected_output": "await p", "difficulty": "Medium", "hint": "Needs async func." },
            { "id": 5, "title": "Fetch", "description": "Basic GET call.", "sample_input": "url", "expected_output": "fetch(url)", "difficulty": "Medium", "hint": "Returns promise." },
            { "id": 6, "title": "Cons", "description": "Log 'Hi'.", "sample_input": "none", "expected_output": "console.log(\"Hi\")", "difficulty": "Easy", "hint": "Std logging." },
            { "id": 7, "title": "JSON", "description": "Parse string S.", "sample_input": "S", "expected_output": "JSON.parse(S)", "difficulty": "Medium", "hint": "String to Object." },
            { "id": 8, "title": "Spread", "description": "Merge arr1 and arr2.", "sample_input": "none", "expected_output": "[...arr1, ...arr2]", "difficulty": "Easy", "hint": "Three dots." },
            { "id": 9, "title": "Local", "description": "Store 'k' as 'v'.", "sample_input": "none", "expected_output": "localStorage.setItem('k', 'v')", "difficulty": "Medium", "hint": "Browser storage." },
            { "id": 10, "title": "Event", "description": "Listen for click on el.", "sample_input": "none", "expected_output": "el.onclick = ...", "difficulty": "Easy", "hint": "Attribute or listener." }
        ]
    },
    {
        "id": 7, "domain": "PHP", "tasks": [
            { "id": 1, "title": "Echo", "description": "Print 'Hi'.", "sample_input": "none", "expected_output": "echo \"Hi\";", "difficulty": "Easy", "hint": "Output." },
            { "id": 2, "title": "Var", "description": "Define x=1.", "sample_input": "none", "expected_output": "$x = 1;", "difficulty": "Easy", "hint": "Dollar sign." },
            { "id": 3, "title": "Session", "description": "Start a session.", "sample_input": "none", "expected_output": "session_start();", "difficulty": "Medium", "hint": "First line." },
            { "id": 4, "title": "Post", "description": "Access 'u' from POST.", "sample_input": "none", "expected_output": "$_POST['u']", "difficulty": "Medium", "hint": "Superglobal." },
            { "id": 5, "title": "Include", "description": "Import file x.php.", "sample_input": "none", "expected_output": "include \"x.php\";", "difficulty": "Easy", "hint": "File join." },
            { "id": 6, "title": "Array assoc", "description": "Key 'k' val 'v'.", "sample_input": "none", "expected_output": "['k' => 'v']", "difficulty": "Easy", "hint": "Rocket operator." },
            { "id": 7, "title": "Foreach", "description": "Loop arr as a.", "sample_input": "arr", "expected_output": "foreach (arr as a)", "difficulty": "Easy", "hint": "Array loop." },
            { "id": 8, "title": "Count", "description": "Items in array.", "sample_input": "[]", "expected_output": "0", "difficulty": "Easy", "hint": "count()." },
            { "id": 9, "title": "PDO", "description": "Database object.", "sample_input": "none", "expected_output": "new PDO()", "difficulty": "Hard", "hint": "Safe DB." },
            { "id": 10, "title": "Explode", "description": "String to array.", "sample_input": "none", "expected_output": "explode()", "difficulty": "Medium", "hint": "Delimiter." }
        ]
    }
];

// Fill remaining rooms 8-30
for (let i = 8; i <= 30; i++) {
    ESCAPE_ROOMS_DATA.push({
        id: i,
        domain: `Sector ${i} - Advanced Domain`,
        tasks: Array.from({ length: 10 }).map((_, j) => ({
            id: j + 1,
            title: `Task Alpha ${j + 1}`,
            description: `Decode the complex sequence for Sector ${i} Fragment ${j + 1}.`,
            sample_input: "0xDEADBEEF",
            expected_output: "0xCAFEBABE",
            difficulty: j < 4 ? "Easy" : j < 8 ? "Medium" : "Hard",
            hint: "Look for patterns in the hexadecimal stream."
        }))
    });
}
