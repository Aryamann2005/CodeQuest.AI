import { executeRemoteCode } from "./api/execute-code.functions";
import { supabase } from "./supabase";

export type CodeLanguage = "javascript" | "python" | "cpp";

export type ChallengeTest = {
  input: Record<string, unknown>;
  expected: unknown;
};

export type TestResult = ChallengeTest & {
  actual?: unknown;
  passed: boolean;
  error?: string;
};

export type RunResult = {
  passed: boolean;
  results: TestResult[];
};

const challengeTests: Record<string, ChallengeTest[]> = {
  "1": [
    { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
    { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
  ],
  "2": [
    { input: { s: "()[]{}" }, expected: true },
    { input: { s: "([)]" }, expected: false },
  ],
  "3": [
    { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expected: [1, 1, 2, 3, 4, 4] },
    { input: { list1: [], list2: [0] }, expected: [0] },
  ],
  "4": [
    { input: { s: "abcabcbb" }, expected: 3 },
    { input: { s: "bbbbb" }, expected: 1 },
  ],
  "5": [
    { input: { l1: [2, 4, 3], l2: [5, 6, 4] }, expected: [7, 0, 8] },
    { input: { l1: [0], l2: [0] }, expected: [0] },
  ],
  "6": [
    { input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: [[-1, -1, 2], [-1, 0, 1]] },
    { input: { nums: [0, 1, 1] }, expected: [] },
  ],
  "7": [
    { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expected: 6 },
    { input: { height: [4, 2, 0, 3, 2, 5] }, expected: 9 },
  ],
  "8": [
    { input: { nums1: [1, 3], nums2: [2] }, expected: 2 },
    { input: { nums1: [1, 2], nums2: [3, 4] }, expected: 2.5 },
  ],
  "9": [
    { input: { root: [1, null, 2, 3] }, expected: [1, 3, 2] },
    { input: { root: [] }, expected: [] },
  ],
  "10": [
    { input: { grid: [["1", "1", "0"], ["0", "1", "0"], ["1", "0", "1"]] }, expected: 3 },
    { input: { grid: [["1", "1"], ["1", "1"]] }, expected: 1 },
  ],
  "11": [
    { input: { begin: "hit", end: "cog", wordList: ["hot", "dot", "dog", "lot", "log", "cog"] }, expected: 5 },
    { input: { begin: "hit", end: "cog", wordList: ["hot", "dot", "dog", "lot", "log"] }, expected: 0 },
  ],
  "12": [
    {
      input: { capacity: 2, operations: [["put", 1, 1], ["put", 2, 2], ["get", 1]] },
      expected: [null, null, 1],
    },
    {
      input: { capacity: 1, operations: [["put", 1, 1], ["put", 2, 2], ["get", 1], ["get", 2]] },
      expected: [null, null, -1, 2],
    },
  ],
};

export function getChallengeTests(challengeId: string) {
  return challengeTests[challengeId] ?? [];
}

const cppChallengeMethods: Record<string, { method: string; signature: string }> = {
  "1": { method: "twoSum", signature: "vector<int> twoSum(vector<int>& nums, int target)" },
  "2": { method: "isValid", signature: "bool isValid(string s)" },
  "3": { method: "mergeTwoLists", signature: "vector<int> mergeTwoLists(vector<int>& list1, vector<int>& list2)" },
  "4": { method: "lengthOfLongestSubstring", signature: "int lengthOfLongestSubstring(string s)" },
  "5": { method: "addTwoNumbers", signature: "vector<int> addTwoNumbers(vector<int>& l1, vector<int>& l2)" },
  "6": { method: "threeSum", signature: "vector<vector<int>> threeSum(vector<int>& nums)" },
  "7": { method: "trap", signature: "int trap(vector<int>& height)" },
  "8": { method: "findMedianSortedArrays", signature: "double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2)" },
  "9": { method: "inorderTraversal", signature: "vector<int> inorderTraversal(vector<optional<int>>& root)" },
  "10": { method: "numIslands", signature: "int numIslands(vector<vector<char>>& grid)" },
  "11": { method: "ladderLength", signature: "int ladderLength(string begin, string end, vector<string>& wordList)" },
  "12": { method: "runCache", signature: "vector<optional<int>> runCache(int capacity, vector<vector<int>>& operations)" },
};

export function createStarterCode(title: string, language: CodeLanguage, challengeId: string) {
  if (language === "python") {
    return `def solve(input):
    # input is a dictionary containing the test-case values.
    # Implement ${title} below.
    return None`;
  }

  if (language === "cpp") {
    const config = cppChallengeMethods[challengeId];
    return `class Solution {
public:
    ${config.signature} {
        // Implement ${title} below.
        return {};
    }
};`;
  }

  return `function solve(input) {
  // input is an object containing the values shown in each test case.
  // Example: const { nums, target } = input;
  // Implement ${title} below.

  return null;
}`;
}

export async function runCode(
  language: CodeLanguage,
  challengeId: string,
  code: string,
  tests: ChallengeTest[],
): Promise<RunResult> {
  if (language === "javascript") return runChallengeCode(code, tests);

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) throw new Error("Sign in before running Python or C++ code.");

  const results: TestResult[] = [];
  for (const test of tests) {
    try {
      const program =
        language === "python"
          ? createPythonProgram(code, test.input)
          : createCppProgram(challengeId, code, test.input);
      const execution = await executeRemoteCode({
        data: { language: language === "cpp" ? "c++" : "python", code: program, accessToken },
      });
      if (execution.error) {
        results.push({ ...test, passed: false, error: execution.error.trim() });
        break;
      }

      const actual = JSON.parse(execution.stdout.trim());
      results.push({ ...test, actual, passed: JSON.stringify(actual) === JSON.stringify(test.expected) });
    } catch (error) {
      results.push({
        ...test,
        passed: false,
        error: error instanceof Error ? error.message : "Remote execution failed.",
      });
      break;
    }
  }

  return { passed: results.length === tests.length && results.every((result) => result.passed), results };
}

function createPythonProgram(code: string, input: Record<string, unknown>) {
  return `${code}

import json
_result = solve(json.loads(${JSON.stringify(JSON.stringify(input))}))
print(json.dumps(_result, separators=(",", ":")))`;
}

function createCppProgram(challengeId: string, code: string, input: Record<string, unknown>) {
  const { method } = cppChallengeMethods[challengeId];
  const declarations = Object.entries(input)
    .map(([name, value]) => createCppDeclaration(challengeId, name, value))
    .join("\n");
  const args = getCppArgumentNames(challengeId, input).join(", ");

  return `#include <bits/stdc++.h>
using namespace std;

${code}

string toJson(const string& value) {
    string out = "\\\"";
    for (char c : value) { if (c == '\\"' || c == '\\\\') out += '\\\\'; out += c; }
    return out + "\\\"";
}
string toJson(char value) { return toJson(string(1, value)); }
string toJson(bool value) { return value ? "true" : "false"; }
template <typename T, enable_if_t<is_arithmetic_v<T> && !is_same_v<T, bool>, int> = 0>
string toJson(T value) { ostringstream out; out << setprecision(15) << value; return out.str(); }
template <typename T> string toJson(const optional<T>& value) { return value ? toJson(*value) : "null"; }
template <typename T> string toJson(const vector<T>& values) {
    string out = "[";
    for (size_t i = 0; i < values.size(); ++i) { if (i) out += ","; out += toJson(values[i]); }
    return out + "]";
}

int main() {
${indent(declarations, 4)}
    auto result = Solution().${method}(${args});
    cout << toJson(result);
    return 0;
}`;
}

function createCppDeclaration(challengeId: string, name: string, value: unknown) {
  if (challengeId === "10" && name === "grid") {
    return `vector<vector<char>> ${name} = ${cppCharGrid(value)};`;
  }
  if (challengeId === "9" && name === "root") {
    return `vector<optional<int>> ${name} = ${cppLiteral(value, true)};`;
  }
  if (challengeId === "12" && name === "operations") {
    return `vector<vector<int>> ${name} = ${cppOperations(value)};`;
  }

  const type = Array.isArray(value)
    ? Array.isArray(value[0])
      ? "vector<vector<int>>"
      : typeof value[0] === "string"
        ? "vector<string>"
        : "vector<int>"
    : typeof value === "string"
      ? "string"
      : "int";
  return `${type} ${name} = ${cppLiteral(value)};`;
}

function getCppArgumentNames(challengeId: string, input: Record<string, unknown>) {
  const orders: Record<string, string[]> = {
    "1": ["nums", "target"], "2": ["s"], "3": ["list1", "list2"], "4": ["s"],
    "5": ["l1", "l2"], "6": ["nums"], "7": ["height"], "8": ["nums1", "nums2"],
    "9": ["root"], "10": ["grid"], "11": ["begin", "end", "wordList"],
    "12": ["capacity", "operations"],
  };
  return (orders[challengeId] ?? Object.keys(input)).filter((name) => name in input);
}

function cppLiteral(value: unknown, optionalNumbers = false): string {
  if (value === null) return optionalNumbers ? "nullopt" : "nullptr";
  if (Array.isArray(value)) return `{${value.map((item) => cppLiteral(item, optionalNumbers)).join(",")}}`;
  if (typeof value === "string") return JSON.stringify(value);
  return String(value);
}

function cppCharGrid(value: unknown) {
  const rows = value as string[][];
  return `{${rows.map((row) => `{${row.map((cell) => `'${cell}'`).join(",")}}`).join(",")}}`;
}

function cppOperations(value: unknown) {
  const operations = value as Array<[string, ...number[]]>;
  return `{${operations
    .map(([operation, ...args]) => `{${operation === "put" ? 1 : 2},${args.join(",")}}`)
    .join(",")}}`;
}

function indent(value: string, spaces: number) {
  const prefix = " ".repeat(spaces);
  return value.split("\n").map((line) => prefix + line).join("\n");
}

export async function runChallengeCode(
  code: string,
  tests: ChallengeTest[],
  timeoutMs = 2000,
): Promise<RunResult> {
  if (tests.length === 0) throw new Error("No tests are configured for this challenge.");

  const workerSource = `
    self.onmessage = async ({ data }) => {
      const serialize = (value) => JSON.stringify(value);
      try {
        const solve = new Function(data.code + "\\n; return typeof solve === 'function' ? solve : null;")();
        if (!solve) throw new Error("Define a function named solve(input).");
        const results = [];
        for (const test of data.tests) {
          try {
            const input = structuredClone(test.input);
            const actual = await solve(input);
            results.push({ ...test, actual, passed: serialize(actual) === serialize(test.expected) });
          } catch (error) {
            results.push({ ...test, passed: false, error: error instanceof Error ? error.message : String(error) });
          }
        }
        self.postMessage({ passed: results.every((result) => result.passed), results });
      } catch (error) {
        self.postMessage({
          passed: false,
          results: data.tests.map((test) => ({
            ...test,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
          })),
        });
      }
    };
  `;

  const workerUrl = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
  const worker = new Worker(workerUrl);

  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve({
        passed: false,
        results: tests.map((test) => ({ ...test, passed: false, error: "Time limit exceeded." })),
      });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<RunResult>) => {
      window.clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve(event.data);
    };

    worker.onerror = () => {
      window.clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve({
        passed: false,
        results: tests.map((test) => ({ ...test, passed: false, error: "The runner could not execute this code." })),
      });
    };

    worker.postMessage({ code, tests });
  });
}
