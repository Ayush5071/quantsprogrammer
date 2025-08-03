"use client";
import { useState, useMemo, useEffect } from "react";

interface Question {
  difficulty: string;
  title: string;
  frequency: number;
  acceptance: number;
  link: string;
  topics: string[];
  id?: string;
}

const goldmanQuestions: Question[] = [
  { difficulty: "HARD", title: "Trapping Rain Water", frequency: 100.0, acceptance: 0.6510194577693873, link: "https://leetcode.com/problems/trapping-rain-water", topics: ["Array", "Two Pointers", "Dynamic Programming", "Stack", "Monotonic Stack"], id: "trapping-rain-water" },
  { difficulty: "HARD", title: "Median of Two Sorted Arrays", frequency: 79.9, acceptance: 0.4381459474078076, link: "https://leetcode.com/problems/median-of-two-sorted-arrays", topics: ["Array", "Binary Search", "Divide and Conquer"], id: "median-of-two-sorted-arrays" },
  { difficulty: "EASY", title: "First Unique Character in a String", frequency: 77.8, acceptance: 0.6369547945291859, link: "https://leetcode.com/problems/first-unique-character-in-a-string", topics: ["Hash Table", "String", "Queue", "Counting"], id: "first-unique-character-in-a-string" },
  { difficulty: "MEDIUM", title: "Fraction to Recurring Decimal", frequency: 76.5, acceptance: 0.2622353839768554, link: "https://leetcode.com/problems/fraction-to-recurring-decimal", topics: ["Hash Table", "Math", "String"], id: "fraction-to-recurring-decimal" },
  { difficulty: "EASY", title: "Best Time to Buy and Sell Stock", frequency: 64.2, acceptance: 0.552596541931788, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock", topics: ["Array", "Dynamic Programming"], id: "best-time-to-buy-and-sell-stock" },
  { difficulty: "MEDIUM", title: "Number of Islands", frequency: 63.6, acceptance: 0.6231992538801062, link: "https://leetcode.com/problems/number-of-islands", topics: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"], id: "number-of-islands" },
  { difficulty: "MEDIUM", title: "Minimum Path Sum", frequency: 62.4, acceptance: 0.6648152266005115, link: "https://leetcode.com/problems/minimum-path-sum", topics: ["Array", "Dynamic Programming", "Matrix"], id: "minimum-path-sum" },
  { difficulty: "MEDIUM", title: "String Compression", frequency: 61.1, acceptance: 0.580915717497265, link: "https://leetcode.com/problems/string-compression", topics: ["Two Pointers", "String"], id: "string-compression" },
  { difficulty: "EASY", title: "Two Sum", frequency: 59.7, acceptance: 0.5577699201817173, link: "https://leetcode.com/problems/two-sum", topics: ["Array", "Hash Table"], id: "two-sum" },
  { difficulty: "MEDIUM", title: "LRU Cache", frequency: 59.7, acceptance: 0.45214550965761185, link: "https://leetcode.com/problems/lru-cache", topics: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"], id: "lru-cache" },
  { difficulty: "MEDIUM", title: "Group Anagrams", frequency: 58.9, acceptance: 0.7092882781909262, link: "https://leetcode.com/problems/group-anagrams", topics: ["Array", "Hash Table", "String", "Sorting"], id: "group-anagrams" },
  { difficulty: "MEDIUM", title: "Find Minimum in Rotated Sorted Array", frequency: 58.9, acceptance: 0.5264826307240257, link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array", topics: ["Array", "Binary Search"], id: "find-minimum-in-rotated-sorted-array" },
  { difficulty: "MEDIUM", title: "Container With Most Water", frequency: 58.9, acceptance: 0.5778283165036205, link: "https://leetcode.com/problems/container-with-most-water", topics: ["Array", "Two Pointers", "Greedy"], id: "container-with-most-water" },
  { difficulty: "MEDIUM", title: "Decode Ways", frequency: 56.4, acceptance: 0.36530982861754346, link: "https://leetcode.com/problems/decode-ways", topics: ["String", "Dynamic Programming"], id: "decode-ways" },
  { difficulty: "MEDIUM", title: "Longest Substring Without Repeating Characters", frequency: 55.5, acceptance: 0.3693616958685081, link: "https://leetcode.com/problems/longest-substring-without-repeating-characters", topics: ["Hash Table", "String", "Sliding Window"], id: "longest-substring-without-repeating-characters" },
  { difficulty: "MEDIUM", title: "Search in Rotated Sorted Array", frequency: 55.5, acceptance: 0.42837216325866995, link: "https://leetcode.com/problems/search-in-rotated-sorted-array", topics: ["Array", "Binary Search"], id: "search-in-rotated-sorted-array" },
  { difficulty: "MEDIUM", title: "Minimize the Maximum of Two Arrays", frequency: 53.5, acceptance: 0.31227262450414156, link: "https://leetcode.com/problems/minimize-the-maximum-of-two-arrays", topics: ["Math", "Binary Search", "Number Theory"], id: "minimize-the-maximum-of-two-arrays" },
  { difficulty: "MEDIUM", title: "Best Time to Buy and Sell Stock II", frequency: 52.4, acceptance: 0.6950025067480458, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii", topics: ["Array", "Dynamic Programming", "Greedy"], id: "best-time-to-buy-and-sell-stock-ii" },
  { difficulty: "MEDIUM", title: "Kth Largest Element in an Array", frequency: 51.2, acceptance: 0.6797700833982673, link: "https://leetcode.com/problems/kth-largest-element-in-an-array", topics: ["Array", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Quickselect"], id: "kth-largest-element-in-an-array" },
  { difficulty: "HARD", title: "Valid Arrangement of Pairs", frequency: 50.0, acceptance: 0.6626068003487359, link: "https://leetcode.com/problems/valid-arrangement-of-pairs", topics: ["Depth-First Search", "Graph", "Eulerian Circuit"], id: "valid-arrangement-of-pairs" },
  { difficulty: "MEDIUM", title: "Merge Intervals", frequency: 48.6, acceptance: 0.49395260388425144, link: "https://leetcode.com/problems/merge-intervals", topics: ["Array", "Sorting"], id: "merge-intervals" },
  { difficulty: "MEDIUM", title: "Construct Smallest Number From DI String", frequency: 48.6, acceptance: 0.858291954685622, link: "https://leetcode.com/problems/construct-smallest-number-from-di-string", topics: ["String", "Backtracking", "Stack", "Greedy"], id: "construct-smallest-number-from-di-string" },
  { difficulty: "MEDIUM", title: "Longest Palindromic Substring", frequency: 48.6, acceptance: 0.35846104860827005, link: "https://leetcode.com/problems/longest-palindromic-substring", topics: ["Two Pointers", "String", "Dynamic Programming"], id: "longest-palindromic-substring" },
  { difficulty: "EASY", title: "Power of Three", frequency: 48.6, acceptance: 0.4802572566132386, link: "https://leetcode.com/problems/power-of-three", topics: ["Math", "Recursion"], id: "power-of-three" },
  { difficulty: "MEDIUM", title: "Longest Increasing Subsequence", frequency: 48.6, acceptance: 0.5780836795005291, link: "https://leetcode.com/problems/longest-increasing-subsequence", topics: ["Array", "Binary Search", "Dynamic Programming"], id: "longest-increasing-subsequence" },
  { difficulty: "MEDIUM", title: "Maximum Subarray", frequency: 48.6, acceptance: 0.5209977640581438, link: "https://leetcode.com/problems/maximum-subarray", topics: ["Array", "Divide and Conquer", "Dynamic Programming"], id: "maximum-subarray" },
  { difficulty: "MEDIUM", title: "Minimum Cost Homecoming of a Robot in a Grid", frequency: 47.2, acceptance: 0.5116018634653288, link: "https://leetcode.com/problems/minimum-cost-homecoming-of-a-robot-in-a-grid", topics: ["Array", "Greedy"], id: "minimum-cost-homecoming-of-a-robot-in-a-grid" },
  { difficulty: "EASY", title: "Valid Parentheses", frequency: 47.2, acceptance: 0.4232282673732945, link: "https://leetcode.com/problems/valid-parentheses", topics: ["String", "Stack"], id: "valid-parentheses" },
  { difficulty: "MEDIUM", title: "Jump Game", frequency: 47.2, acceptance: 0.39479197867291327, link: "https://leetcode.com/problems/jump-game", topics: ["Array", "Dynamic Programming", "Greedy"], id: "jump-game" },
  { difficulty: "HARD", title: "Count Palindromic Subsequences", frequency: 47.2, acceptance: 0.39309342421812343, link: "https://leetcode.com/problems/count-palindromic-subsequences", topics: ["String", "Dynamic Programming"], id: "count-palindromic-subsequences" },
  { difficulty: "MEDIUM", title: "Range Product Queries of Powers", frequency: 47.2, acceptance: 0.41906952851048623, link: "https://leetcode.com/problems/range-product-queries-of-powers", topics: ["Array", "Bit Manipulation", "Prefix Sum"], id: "range-product-queries-of-powers" },
  { difficulty: "EASY", title: "Keep Multiplying Found Values by Two", frequency: 45.6, acceptance: 0.7133261449808213, link: "https://leetcode.com/problems/keep-multiplying-found-values-by-two", topics: ["Array", "Hash Table", "Sorting", "Simulation"], id: "keep-multiplying-found-values-by-two" },
  { difficulty: "MEDIUM", title: "Count Number of Texts", frequency: 45.6, acceptance: 0.4884854532893222, link: "https://leetcode.com/problems/count-number-of-texts", topics: ["Hash Table", "Math", "String", "Dynamic Programming"], id: "count-number-of-texts" },
  { difficulty: "MEDIUM", title: "Find All Good Indices", frequency: 45.6, acceptance: 0.3985184360031191, link: "https://leetcode.com/problems/find-all-good-indices", topics: ["Array", "Dynamic Programming", "Prefix Sum"], id: "find-all-good-indices" },
  { difficulty: "HARD", title: "Sliding Window Maximum", frequency: 45.6, acceptance: 0.47604171417820246, link: "https://leetcode.com/problems/sliding-window-maximum", topics: ["Array", "Queue", "Sliding Window", "Heap (Priority Queue)", "Monotonic Queue"], id: "sliding-window-maximum" },
  { difficulty: "MEDIUM", title: "Successful Pairs of Spells and Potions", frequency: 45.6, acceptance: 0.45497361391492785, link: "https://leetcode.com/problems/successful-pairs-of-spells-and-potions", topics: ["Array", "Two Pointers", "Binary Search", "Sorting"], id: "successful-pairs-of-spells-and-potions" },
  { difficulty: "EASY", title: "Determine if Two Events Have Conflict", frequency: 45.6, acceptance: 0.5234865263935031, link: "https://leetcode.com/problems/determine-if-two-events-have-conflict", topics: ["Array", "String"], id: "determine-if-two-events-have-conflict" },
  { difficulty: "MEDIUM", title: "Search a 2D Matrix", frequency: 43.8, acceptance: 0.5228958306958686, link: "https://leetcode.com/problems/search-a-2d-matrix", topics: ["Array", "Binary Search", "Matrix"], id: "search-a-2d-matrix" },
  { difficulty: "MEDIUM", title: "String to Integer (atoi)", frequency: 43.8, acceptance: 0.19229419795412275, link: "https://leetcode.com/problems/string-to-integer-atoi", topics: ["String"], id: "string-to-integer-atoi" },
  { difficulty: "MEDIUM", title: "Product of Array Except Self", frequency: 43.8, acceptance: 0.6777995792305304, link: "https://leetcode.com/problems/product-of-array-except-self", topics: ["Array", "Prefix Sum"], id: "product-of-array-except-self" },
  { difficulty: "MEDIUM", title: "Subarray Sum Equals K", frequency: 41.8, acceptance: 0.4547619233482047, link: "https://leetcode.com/problems/subarray-sum-equals-k", topics: ["Array", "Hash Table", "Prefix Sum"], id: "subarray-sum-equals-k" },
  { difficulty: "MEDIUM", title: "House Robber", frequency: 41.8, acceptance: 0.5230498335398295, link: "https://leetcode.com/problems/house-robber", topics: ["Array", "Dynamic Programming"], id: "house-robber" },
  { difficulty: "MEDIUM", title: "Pow(x, n)", frequency: 41.8, acceptance: 0.370231906887774, link: "https://leetcode.com/problems/powx-n", topics: ["Math", "Recursion"], id: "powx-n" },
  { difficulty: "MEDIUM", title: "Word Search", frequency: 39.5, acceptance: 0.45266938011238234, link: "https://leetcode.com/problems/word-search", topics: ["Array", "String", "Backtracking", "Depth-First Search", "Matrix"], id: "word-search" },
  { difficulty: "EASY", title: "Linked List Cycle", frequency: 39.5, acceptance: 0.5257064137920662, link: "https://leetcode.com/problems/linked-list-cycle", topics: ["Hash Table", "Linked List", "Two Pointers"], id: "linked-list-cycle" },
  { difficulty: "MEDIUM", title: "Next Permutation", frequency: 39.5, acceptance: 0.4305775328017951, link: "https://leetcode.com/problems/next-permutation", topics: ["Array", "Two Pointers"], id: "next-permutation" },
  { difficulty: "EASY", title: "Pascal's Triangle", frequency: 37.0, acceptance: 0.770215491719448, link: "https://leetcode.com/problems/pascals-triangle", topics: ["Array", "Dynamic Programming"], id: "pascals-triangle" },
  { difficulty: "MEDIUM", title: "Find Peak Element", frequency: 37.0, acceptance: 0.46509227579882145, link: "https://leetcode.com/problems/find-peak-element", topics: ["Array", "Binary Search"], id: "find-peak-element" },
  { difficulty: "EASY", title: "Climbing Stairs", frequency: 37.0, acceptance: 0.5354071840932856, link: "https://leetcode.com/problems/climbing-stairs", topics: ["Math", "Dynamic Programming", "Memoization"], id: "climbing-stairs" },
  { difficulty: "EASY", title: "Sqrt(x)", frequency: 37.0, acceptance: 0.40371786897905787, link: "https://leetcode.com/problems/sqrtx", topics: ["Math", "Binary Search"], id: "sqrtx" },
  { difficulty: "EASY", title: "Missing Number", frequency: 37.0, acceptance: 0.7006535616405187, link: "https://leetcode.com/problems/missing-number", topics: ["Array", "Hash Table", "Math", "Binary Search", "Bit Manipulation", "Sorting"], id: "missing-number" },
  { difficulty: "MEDIUM", title: "Minimum Size Subarray Sum", frequency: 37.0, acceptance: 0.49391032213026165, link: "https://leetcode.com/problems/minimum-size-subarray-sum", topics: ["Array", "Binary Search", "Sliding Window", "Prefix Sum"], id: "minimum-size-subarray-sum" },
  { difficulty: "MEDIUM", title: "Insert Delete GetRandom O(1)", frequency: 37.0, acceptance: 0.549918579117808, link: "https://leetcode.com/problems/insert-delete-getrandom-o1", topics: ["Array", "Hash Table", "Math", "Design", "Randomized"], id: "insert-delete-getrandom-o1" },
  { difficulty: "MEDIUM", title: "Top K Frequent Elements", frequency: 33.9, acceptance: 0.6456598417590443, link: "https://leetcode.com/problems/top-k-frequent-elements", topics: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Bucket Sort", "Counting", "Quickselect"], id: "top-k-frequent-elements" },
  { difficulty: "MEDIUM", title: "Maximum Product Subarray", frequency: 33.9, acceptance: 0.34941614794619197, link: "https://leetcode.com/problems/maximum-product-subarray", topics: ["Array", "Dynamic Programming"], id: "maximum-product-subarray" },
  { difficulty: "MEDIUM", title: "Gas Station", frequency: 33.9, acceptance: 0.46383617781658143, link: "https://leetcode.com/problems/gas-station", topics: ["Array", "Greedy"], id: "gas-station" },
  { difficulty: "MEDIUM", title: "Minimum Number of Arrows to Burst Balloons", frequency: 33.9, acceptance: 0.6039233260349853, link: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons", topics: ["Array", "Greedy", "Sorting"], id: "minimum-number-of-arrows-to-burst-balloons" },
  { difficulty: "HARD", title: "Find Median from Data Stream", frequency: 30.2, acceptance: 0.5327816407313548, link: "https://leetcode.com/problems/find-median-from-data-stream", topics: ["Two Pointers", "Design", "Sorting", "Heap (Priority Queue)", "Data Stream"], id: "find-median-from-data-stream" },
  { difficulty: "MEDIUM", title: "Maximal Square", frequency: 30.2, acceptance: 0.4876133314788993, link: "https://leetcode.com/problems/maximal-square", topics: ["Array", "Dynamic Programming", "Matrix"], id: "maximal-square" },
  { difficulty: "MEDIUM", title: "Decode String", frequency: 30.2, acceptance: 0.6115249906697672, link: "https://leetcode.com/problems/decode-string", topics: ["String", "Stack", "Recursion"], id: "decode-string" },
  { difficulty: "MEDIUM", title: "Maximum XOR of Two Numbers in an Array", frequency: 30.2, acceptance: 0.5322093775396812, link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array", topics: ["Array", "Hash Table", "Bit Manipulation", "Trie"], id: "maximum-xor-of-two-numbers-in-an-array" },
  { difficulty: "EASY", title: "Next Greater Element I", frequency: 30.2, acceptance: 0.7451247376157817, link: "https://leetcode.com/problems/next-greater-element-i", topics: ["Array", "Hash Table", "Stack", "Monotonic Stack"], id: "next-greater-element-i" },
  { difficulty: "HARD", title: "Best Time to Buy and Sell Stock IV", frequency: 30.2, acceptance: 0.47086154391046825, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv", topics: ["Array", "Dynamic Programming"], id: "best-time-to-buy-and-sell-stock-iv" },
  { difficulty: "EASY", title: "Pascal's Triangle II", frequency: 30.2, acceptance: 0.6595100107835754, link: "https://leetcode.com/problems/pascals-triangle-ii", topics: ["Array", "Dynamic Programming"], id: "pascals-triangle-ii" },
  { difficulty: "MEDIUM", title: "Set Matrix Zeroes", frequency: 30.2, acceptance: 0.6070884864800216, link: "https://leetcode.com/problems/set-matrix-zeroes", topics: ["Array", "Hash Table", "Matrix"], id: "set-matrix-zeroes" },
  { difficulty: "MEDIUM", title: "Letter Combinations of a Phone Number", frequency: 30.2, acceptance: 0.6385755061179695, link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number", topics: ["Hash Table", "String", "Backtracking"], id: "letter-combinations-of-a-phone-number" },
  { difficulty: "HARD", title: "N-Queens", frequency: 30.2, acceptance: 0.7281704967757537, link: "https://leetcode.com/problems/n-queens", topics: ["Array", "Backtracking"], id: "n-queens" },
  { difficulty: "EASY", title: "Merge Two Sorted Lists", frequency: 30.2, acceptance: 0.6684089645066709, link: "https://leetcode.com/problems/merge-two-sorted-lists", topics: ["Linked List", "Recursion"], id: "merge-two-sorted-lists" },
  { difficulty: "HARD", title: "The Skyline Problem", frequency: 30.2, acceptance: 0.4396233271583687, link: "https://leetcode.com/problems/the-skyline-problem", topics: ["Array", "Divide and Conquer", "Binary Indexed Tree", "Segment Tree", "Line Sweep", "Heap (Priority Queue)", "Ordered Set"], id: "the-skyline-problem" },
  { difficulty: "MEDIUM", title: "Spiral Matrix", frequency: 30.2, acceptance: 0.5393976057408939, link: "https://leetcode.com/problems/spiral-matrix", topics: ["Array", "Matrix", "Simulation"], id: "spiral-matrix" },
  { difficulty: "HARD", title: "First Missing Positive", frequency: 30.2, acceptance: 0.4108465766394882, link: "https://leetcode.com/problems/first-missing-positive", topics: ["Array", "Hash Table"], id: "first-missing-positive" },
  { difficulty: "MEDIUM", title: "Add Two Numbers", frequency: 30.2, acceptance: 0.4622507291808296, link: "https://leetcode.com/problems/add-two-numbers", topics: ["Linked List", "Math", "Recursion"], id: "add-two-numbers" },
  { difficulty: "EASY", title: "Roman to Integer", frequency: 30.2, acceptance: 0.6486627884371093, link: "https://leetcode.com/problems/roman-to-integer", topics: ["Hash Table", "Math", "String"], id: "roman-to-integer" },
  { difficulty: "EASY", title: "Count Number of Pairs With Absolute Difference K", frequency: 30.2, acceptance: 0.8488583382642377, link: "https://leetcode.com/problems/count-number-of-pairs-with-absolute-difference-k", topics: ["Array", "Hash Table", "Counting"], id: "count-number-of-pairs-with-absolute-difference-k" },
  { difficulty: "HARD", title: "Candy", frequency: 30.2, acceptance: 0.4669979228964262, link: "https://leetcode.com/problems/candy", topics: ["Array", "Greedy"], id: "candy" },
  { difficulty: "MEDIUM", title: "Next Greater Element III", frequency: 25.5, acceptance: 0.34586631403766466, link: "https://leetcode.com/problems/next-greater-element-iii", topics: ["Math", "Two Pointers", "String"], id: "next-greater-element-iii" },
  { difficulty: "MEDIUM", title: "Fraction Addition and Subtraction", frequency: 25.5, acceptance: 0.6614695886090164, link: "https://leetcode.com/problems/fraction-addition-and-subtraction", topics: ["Math", "String", "Simulation"], id: "fraction-addition-and-subtraction" },
  { difficulty: "MEDIUM", title: "3Sum", frequency: 25.5, acceptance: 0.3707094382524759, link: "https://leetcode.com/problems/3sum", topics: ["Array", "Two Pointers", "Sorting"], id: "3sum" },
  { difficulty: "MEDIUM", title: "Permutations", frequency: 25.5, acceptance: 0.8066011364163758, link: "https://leetcode.com/problems/permutations", topics: ["Array", "Backtracking"], id: "permutations" },
  { difficulty: "MEDIUM", title: "Amount of Time for Binary Tree to Be Infected", frequency: 25.5, acceptance: 0.6373515517663223, link: "https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected", topics: ["Hash Table", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], id: "amount-of-time-for-binary-tree-to-be-infected" },
  { difficulty: "EASY", title: "Reverse String", frequency: 25.5, acceptance: 0.7976436563508422, link: "https://leetcode.com/problems/reverse-string", topics: ["Two Pointers", "String"], id: "reverse-string" },
  { difficulty: "MEDIUM", title: "Integer to Roman", frequency: 25.5, acceptance: 0.6861925885666443, link: "https://leetcode.com/problems/integer-to-roman", topics: ["Hash Table", "Math", "String"], id: "integer-to-roman" },
  { difficulty: "MEDIUM", title: "Longest Substring with At Most K Distinct Characters", frequency: 25.5, acceptance: 0.49496202908621634, link: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters", topics: ["Hash Table", "String", "Sliding Window"], id: "longest-substring-with-at-most-k-distinct-characters" },
  { difficulty: "MEDIUM", title: "Permutation in String", frequency: 25.5, acceptance: 0.47247851720550266, link: "https://leetcode.com/problems/permutation-in-string", topics: ["Hash Table", "Two Pointers", "String", "Sliding Window"], id: "permutation-in-string" },
  { difficulty: "MEDIUM", title: "Reorder List", frequency: 25.5, acceptance: 0.6250476843297371, link: "https://leetcode.com/problems/reorder-list", topics: ["Linked List", "Two Pointers", "Stack", "Recursion"], id: "reorder-list" },
  { difficulty: "EASY", title: "Intersection of Two Linked Lists", frequency: 25.5, acceptance: 0.6112536319835228, link: "https://leetcode.com/problems/intersection-of-two-linked-lists", topics: ["Hash Table", "Linked List", "Two Pointers"], id: "intersection-of-two-linked-lists" },
  { difficulty: "MEDIUM", title: "Find the Duplicate Number", frequency: 25.5, acceptance: 0.6283577384693005, link: "https://leetcode.com/problems/find-the-duplicate-number", topics: ["Array", "Two Pointers", "Binary Search", "Bit Manipulation"], id: "find-the-duplicate-number" },
  { difficulty: "MEDIUM", title: "Largest Number", frequency: 25.5, acceptance: 0.412803811932624, link: "https://leetcode.com/problems/largest-number", topics: ["Array", "String", "Greedy", "Sorting"], id: "largest-number" },
  { difficulty: "EASY", title: "Valid Anagram", frequency: 25.5, acceptance: 0.6666090585070029, link: "https://leetcode.com/problems/valid-anagram", topics: ["Hash Table", "String", "Sorting"], id: "valid-anagram" },
  { difficulty: "MEDIUM", title: "Rotate Array", frequency: 25.5, acceptance: 0.4302138242326172, link: "https://leetcode.com/problems/rotate-array", topics: ["Array", "Math", "Two Pointers"], id: "rotate-array" },
  { difficulty: "MEDIUM", title: "Rotate Image", frequency: 25.5, acceptance: 0.7790165261990751, link: "https://leetcode.com/problems/rotate-image", topics: ["Array", "Math", "Matrix"], id: "rotate-image" },
  { difficulty: "MEDIUM", title: "Jump Game II", frequency: 19.1, acceptance: 0.415032966531176, link: "https://leetcode.com/problems/jump-game-ii", topics: ["Array", "Dynamic Programming", "Greedy"], id: "jump-game-ii" },
  { difficulty: "MEDIUM", title: "Valid Sudoku", frequency: 19.1, acceptance: 0.6227675793740958, link: "https://leetcode.com/problems/valid-sudoku", topics: ["Array", "Hash Table", "Matrix"], id: "valid-sudoku" },
  { difficulty: "EASY", title: "Contains Duplicate II", frequency: 19.1, acceptance: 0.4904986450077176, link: "https://leetcode.com/problems/contains-duplicate-ii", topics: ["Array", "Hash Table", "Sliding Window"], id: "contains-duplicate-ii" },
  { difficulty: "MEDIUM", title: "Unique Paths", frequency: 19.1, acceptance: 0.6577287347956182, link: "https://leetcode.com/problems/unique-paths", topics: ["Math", "Dynamic Programming", "Combinatorics"], id: "unique-paths" },
  { difficulty: "EASY", title: "Merge Sorted Array", frequency: 19.1, acceptance: 0.5291952521829845, link: "https://leetcode.com/problems/merge-sorted-array", topics: ["Array", "Two Pointers", "Sorting"], id: "merge-sorted-array" },
  { difficulty: "MEDIUM", title: "Query Kth Smallest Trimmed Number", frequency: 19.1, acceptance: 0.45574055602445074, link: "https://leetcode.com/problems/query-kth-smallest-trimmed-number", topics: ["Array", "String", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Radix Sort", "Quickselect"], id: "query-kth-smallest-trimmed-number" },
  { difficulty: "MEDIUM", title: "Remove Duplicate Letters", frequency: 19.1, acceptance: 0.5135095841552992, link: "https://leetcode.com/problems/remove-duplicate-letters", topics: ["String", "Stack", "Greedy", "Monotonic Stack"], id: "remove-duplicate-letters" },
  { difficulty: "MEDIUM", title: "Zigzag Conversion", frequency: 19.1, acceptance: 0.5160678115303926, link: "https://leetcode.com/problems/zigzag-conversion", topics: ["String"], id: "zigzag-conversion" },
  { difficulty: "MEDIUM", title: "Interleaving String", frequency: 19.1, acceptance: 0.4217918033968859, link: "https://leetcode.com/problems/interleaving-string", topics: ["String", "Dynamic Programming"], id: "interleaving-string" }
];

const difficulties = ["EASY", "MEDIUM", "HARD"];
const allTopics = Array.from(new Set(goldmanQuestions.flatMap(q => q.topics)));

const GoldmanSachsQuestions = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set());

  // Load saved questions from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedGoldmanQuestions');
    if (saved) {
      setSavedQuestions(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save questions to localStorage whenever savedQuestions changes
  useEffect(() => {
    localStorage.setItem('savedGoldmanQuestions', JSON.stringify(Array.from(savedQuestions)));
  }, [savedQuestions]);

  const toggleSaveQuestion = (questionId: string) => {
    setSavedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const filteredQuestions = useMemo(() => {
    let filtered = goldmanQuestions.filter(q =>
      (selectedDifficulty ? q.difficulty === selectedDifficulty : true) &&
      (selectedTopic ? q.topics.includes(selectedTopic) : true)
    );

    if (showSavedOnly) {
      filtered = filtered.filter(q => savedQuestions.has(q.id || ''));
    }

    return filtered;
  }, [selectedDifficulty, selectedTopic, showSavedOnly, savedQuestions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Goldman Sachs DSA & OA Questions
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Complete collection of {goldmanQuestions.length} questions asked by Goldman Sachs
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
          <button
            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
              showSavedOnly 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
            }`}
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            title={showSavedOnly ? "Show all questions" : "Show saved questions only"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {showSavedOnly ? 'Show All' : `Saved (${savedQuestions.size})`}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((q, i) => {
            const isQuestionSaved = savedQuestions.has(q.id || '');
            return (
              <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 flex flex-col gap-3 border border-blue-700/50 hover:scale-105 hover:bg-gray-800/70 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    q.difficulty === "HARD" ? "bg-red-700 text-red-100" : 
                    q.difficulty === "MEDIUM" ? "bg-yellow-700 text-yellow-100" : 
                    "bg-green-700 text-green-100"
                  }`}>
                    {q.difficulty}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Freq: {q.frequency}</span>
                    <button
                      onClick={() => toggleSaveQuestion(q.id || '')}
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        isQuestionSaved 
                          ? 'text-yellow-400 hover:text-yellow-300' 
                          : 'text-gray-400 hover:text-yellow-400'
                      }`}
                      title={isQuestionSaved ? 'Remove from saved' : 'Save question'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <a href={q.link} target="_blank" rel="noopener noreferrer" 
                   className="text-lg font-semibold text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-200">
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
            );
          })}
        </div>
        
        {filteredQuestions.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-lg">
              {showSavedOnly 
                ? "No saved questions found. Start saving questions by clicking the heart icon!"
                : "No questions found for selected filters."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoldmanSachsQuestions;
