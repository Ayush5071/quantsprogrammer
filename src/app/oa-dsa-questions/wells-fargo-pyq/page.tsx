"use client";
import { useState, useMemo } from "react";

interface Question {
  difficulty: string;
  title: string;
  frequency: number;
  acceptance: number;
  link: string;
  topics: string[];
  id: string;
}

const wellsFargoQuestions: Question[] = [
  { difficulty: "MEDIUM", title: "Shortest and Lexicographically Smallest Beautiful String", frequency: 100.0, acceptance: 0.3966286564204264, link: "https://leetcode.com/problems/shortest-and-lexicographically-smallest-beautiful-string", topics: ["String", "Sliding Window"], id: "shortest-and-lexicographically-smallest-beautiful-string" },
  { difficulty: "HARD", title: "Verbal Arithmetic Puzzle", frequency: 86.0, acceptance: 0.3477800583342335, link: "https://leetcode.com/problems/verbal-arithmetic-puzzle", topics: ["Array", "Math", "String", "Backtracking"], id: "verbal-arithmetic-puzzle" },
  { difficulty: "MEDIUM", title: "Find the Safest Path in a Grid", frequency: 70.1, acceptance: 0.48397269180754227, link: "https://leetcode.com/problems/find-the-safest-path-in-a-grid", topics: ["Array", "Binary Search", "Breadth-First Search", "Union Find", "Heap (Priority Queue)", "Matrix"], id: "find-the-safest-path-in-a-grid" },
  { difficulty: "MEDIUM", title: "Minimizing Array After Replacing Pairs With Their Product", frequency: 70.1, acceptance: 0.39923224568138194, link: "https://leetcode.com/problems/minimizing-array-after-replacing-pairs-with-their-product", topics: ["Array", "Dynamic Programming", "Greedy"], id: "minimizing-array-after-replacing-pairs-with-their-product" },
  { difficulty: "MEDIUM", title: "Maximum Number of Weeks for Which You Can Work", frequency: 70.1, acceptance: 0.4134942369616901, link: "https://leetcode.com/problems/maximum-number-of-weeks-for-which-you-can-work", topics: ["Array", "Greedy"], id: "maximum-number-of-weeks-for-which-you-can-work" },
  { difficulty: "MEDIUM", title: "Count and Say", frequency: 60.8, acceptance: 0.6050669323131879, link: "https://leetcode.com/problems/count-and-say", topics: ["String"], id: "count-and-say" },
  { difficulty: "MEDIUM", title: "Best Time to Buy and Sell Stock II", frequency: 60.8, acceptance: 0.6950040034164668, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii", topics: ["Array", "Dynamic Programming", "Greedy"], id: "best-time-to-buy-and-sell-stock-ii" },
  { difficulty: "MEDIUM", title: "Water and Jug Problem", frequency: 60.8, acceptance: 0.4308700875472949, link: "https://leetcode.com/problems/water-and-jug-problem", topics: ["Math", "Depth-First Search", "Breadth-First Search"], id: "water-and-jug-problem" },
  { difficulty: "MEDIUM", title: "Product of Array Except Self", frequency: 60.8, acceptance: 0.6778006914594543, link: "https://leetcode.com/problems/product-of-array-except-self", topics: ["Array", "Prefix Sum"], id: "product-of-array-except-self" },
  { difficulty: "EASY", title: "Rotate String", frequency: 60.8, acceptance: 0.6393953917504719, link: "https://leetcode.com/problems/rotate-string", topics: ["String", "String Matching"], id: "rotate-string" },
  { difficulty: "EASY", title: "Merge Strings Alternately", frequency: 60.8, acceptance: 0.8222980560828816, link: "https://leetcode.com/problems/merge-strings-alternately", topics: ["Two Pointers", "String"], id: "merge-strings-alternately" },
  { difficulty: "EASY", title: "Kth Largest Element in a Stream", frequency: 60.8, acceptance: 0.5985294841468605, link: "https://leetcode.com/problems/kth-largest-element-in-a-stream", topics: ["Tree", "Design", "Binary Search Tree", "Heap (Priority Queue)", "Binary Tree", "Data Stream"], id: "kth-largest-element-in-a-stream" },
  { difficulty: "MEDIUM", title: "Spiral Matrix", frequency: 60.8, acceptance: 0.539398836789508, link: "https://leetcode.com/problems/spiral-matrix", topics: ["Array", "Matrix", "Simulation"], id: "spiral-matrix" },
  { difficulty: "MEDIUM", title: "3Sum", frequency: 60.8, acceptance: 0.37071090682027424, link: "https://leetcode.com/problems/3sum", topics: ["Array", "Two Pointers", "Sorting"], id: "3sum" },
  { difficulty: "EASY", title: "Longest Common Prefix", frequency: 60.8, acceptance: 0.4548317594843367, link: "https://leetcode.com/problems/longest-common-prefix", topics: ["String", "Trie"], id: "longest-common-prefix" },
];

const difficulties = ["EASY", "MEDIUM", "HARD"];
const allTopics = Array.from(new Set(wellsFargoQuestions.flatMap(q => q.topics)));

const WellsFargoQuestions = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const filteredQuestions = useMemo(() => {
    return wellsFargoQuestions.filter(q =>
      (selectedDifficulty ? q.difficulty === selectedDifficulty : true) &&
      (selectedTopic ? q.topics.includes(selectedTopic) : true)
    );
  }, [selectedDifficulty, selectedTopic]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Wells Fargo DSA & OA Questions
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Complete collection of {wellsFargoQuestions.length} questions asked by Wells Fargo
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <select
            className="bg-gray-800 border border-blue-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            title="Filter by difficulty"
            aria-label="Filter by difficulty"
          >
            <option value="">All Difficulties</option>
            {difficulties.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            className="bg-gray-800 border border-blue-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            title="Filter by topic"
            aria-label="Filter by topic"
          >
            <option value="">All Topics</option>
            {allTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((q, i) => (
            <div
              key={i}
              className="group relative bg-gray-800/60 border border-blue-700/40 rounded-2xl shadow-lg p-6 flex flex-col gap-3 hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  q.difficulty === "HARD" ? "bg-red-700 text-red-100" :
                  q.difficulty === "MEDIUM" ? "bg-yellow-700 text-yellow-100" :
                  "bg-green-700 text-green-100"
                }`}>
                  {q.difficulty}
                </span>
                <span className="text-xs text-gray-400">Freq: {q.frequency}</span>
              </div>
              <a
                href={q.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-200"
              >
                {q.title}
              </a>
              <div className="flex flex-wrap gap-1 mt-2">
                {q.topics.map(topic => (
                  <span key={topic} className="bg-blue-900/70 text-blue-200 px-2 py-1 rounded-md text-xs">
                    {topic}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-300">
                <span>Acceptance: {(q.acceptance * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
        {filteredQuestions.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-lg">No questions found for selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellsFargoQuestions;
