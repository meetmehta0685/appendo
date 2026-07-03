import React, { useState } from 'react';
import { StudentProfile } from '../types';

interface CodingViewProps {
  studentProfile: StudentProfile;
}

interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: 'Arrays' | 'Trees' | 'Graphs' | 'DP';
  company: 'Google' | 'Microsoft' | 'Amazon' | 'TCS';
  acceptance: string;
  description: string;
  constraints: string[];
  testCases: { input: string; output: string }[];
  boilerplates: Record<'python' | 'java' | 'cpp', string>;
}

const codingProblems: Problem[] = [
  {
    id: 'p1',
    title: 'Two Sum',
    difficulty: 'easy',
    topic: 'Arrays',
    company: 'TCS',
    acceptance: '49.2%',
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    boilerplates: {
      python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};`
    }
  },
  {
    id: 'p2',
    title: 'Validate Binary Search Tree',
    difficulty: 'medium',
    topic: 'Trees',
    company: 'Google',
    acceptance: '32.1%',
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys less than the node's key.\n- The right subtree of a node contains only nodes with keys greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.",
    constraints: [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-2^31 <= Node.val <= 2^31 - 1"
    ],
    testCases: [
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false" }
    ],
    boilerplates: {
      python: `class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        # Write your code here\n        return True`,
      java: `class Solution {\n    public boolean isValidBST(TreeNode root) {\n        // Write your code here\n        return true;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        // Write your code here\n        return true;\n    }\n};`
    }
  },
  {
    id: 'p3',
    title: 'Edit Distance',
    difficulty: 'hard',
    topic: 'DP',
    company: 'Microsoft',
    acceptance: '52.4%',
    description: "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character",
    constraints: [
      "0 <= word1.length, word2.length <= 500",
      "word1 and word2 consist of lowercase English letters."
    ],
    testCases: [
      { input: "word1 = \"horse\", word2 = \"ros\"", output: "3" },
      { input: "word1 = \"intention\", word2 = \"execution\"", output: "5" }
    ],
    boilerplates: {
      python: `class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        # Write your code here\n        return 0`,
      java: `class Solution {\n    public int minDistance(String word1, String word2) {\n        // Write your code here\n        return 0;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        // Write your code here\n        return 0;\n    }\n};`
    }
  },
  {
    id: 'p4',
    title: 'Number of Islands',
    difficulty: 'medium',
    topic: 'Graphs',
    company: 'Amazon',
    acceptance: '57.8%',
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    testCases: [
      { input: "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"0\",\"1\"]]", output: "3" }
    ],
    boilerplates: {
      python: `class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        # Write your code here\n        return 0`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your code here\n        return 0;\n    }\n};`
    }
  }
];

export const CodingView: React.FC<CodingViewProps> = ({ studentProfile }) => {
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<'All' | 'Arrays' | 'Trees' | 'Graphs' | 'DP'>('All');
  const [selectedDiff, setSelectedDiff] = useState<'All' | 'easy' | 'medium' | 'hard'>('All');
  const [selectedCompany, setSelectedCompany] = useState<'All' | 'Google' | 'Microsoft' | 'Amazon' | 'TCS'>('All');

  // IDE Workspace states
  const [activeLang, setActiveLang] = useState<'python' | 'java' | 'cpp'>('python');
  const [editorCode, setEditorCode] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompileSuccess, setIsCompileSuccess] = useState<boolean | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>(['p1']); // default Two Sum solved
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Filter problems list
  const filteredProblems = codingProblems.filter(p => {
    const matchTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchDiff = selectedDiff === 'All' || p.difficulty === selectedDiff;
    const matchComp = selectedCompany === 'All' || p.company === selectedCompany;
    return matchTopic && matchDiff && matchComp;
  });

  const handleSelectProblem = (prob: Problem) => {
    setActiveProblemId(prob.id);
    setEditorCode(prob.boilerplates[activeLang]);
    setConsoleLogs([]);
    setIsCompileSuccess(null);
  };

  const handleLanguageChange = (lang: 'python' | 'java' | 'cpp') => {
    setActiveLang(lang);
    const activeProb = codingProblems.find(p => p.id === activeProblemId);
    if (activeProb) {
      setEditorCode(activeProb.boilerplates[lang]);
    }
  };

  const runCodeSimulation = () => {
    setConsoleLogs(['Compiling and linking files...', 'Running test case 1 of 2...', 'Test Case 1: PASSED', 'Running test case 2 of 2...', 'Test Case 2: PASSED', 'All local tests passed successfully!']);
    setIsCompileSuccess(true);
  };

  const submitCodeSimulation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setConsoleLogs(['Compiling on remote cluster...', 'Running 50 system test cases...', '✓ All 50 test cases passed.', 'Runtime: 4ms (Beats 94.2% of users)', 'Memory: 10.4MB (Beats 82.1% of users)', 'Submission: ACCEPTED']);
      setIsCompileSuccess(true);
      setIsSubmitting(false);
      if (activeProblemId && !solvedIds.includes(activeProblemId)) {
        setSolvedIds(prev => [...prev, activeProblemId]);
      }
    }, 1000);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const activeProblem = codingProblems.find(p => p.id === activeProblemId);

  return (
    <div className="coding-practice-view" style={{ height: '100%' }}>
      {/* Problems Browser Mode */}
      {!activeProblemId ? (
        <div>
          {/* Greeting Header */}
          <div className="dashboard-greeting-row" style={{ marginBottom: '16px' }}>
            <div>
              <span className="dashboard-greeting-date">CODING SANDBOX ENVIRONMENT</span>
              <h1 className="dashboard-greeting-title">Coding practice portal</h1>
              <p className="dashboard-greeting-sub">
                Practice verified DSA questions synced to {studentProfile.college} placement drives.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="aptitude-metric-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="dashboard-accent-card" style={{ minHeight: 'auto', padding: '16px' }}>
              <span className="dashboard-accent-card-label" style={{ fontSize: '10px' }}>Total Problems Solved</span>
              <span className="dashboard-accent-card-value text-accent-blue" style={{ fontSize: '20px', marginTop: '4px' }}>
                {solvedIds.length} / {codingProblems.length}
              </span>
            </div>
            <div className="dashboard-accent-card" style={{ minHeight: 'auto', padding: '16px' }}>
              <span className="dashboard-accent-card-label" style={{ fontSize: '10px' }}>Average Acceptance</span>
              <span className="dashboard-accent-card-value text-accent-green" style={{ fontSize: '20px', marginTop: '4px' }}>
                47.8%
              </span>
            </div>
            <div className="dashboard-accent-card" style={{ minHeight: 'auto', padding: '16px' }}>
              <span className="dashboard-accent-card-label" style={{ fontSize: '10px' }}>Contest Rating</span>
              <span className="dashboard-accent-card-value text-accent-orange" style={{ fontSize: '20px', marginTop: '4px' }}>
                1540 (Top 12%)
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '24px', alignItems: 'stretch' }}>
            {/* Problems list */}
            <section className="bento-card" style={{ padding: '20px' }}>
              <span className="section-title-label">DSA Problem Set</span>

              {/* Filters */}
              <div className="registry-filters-row" style={{ marginTop: '12px', marginBottom: '16px', gap: '8px' }}>
                <select className="calendar-filter-select" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value as any)}>
                  <option value="All">All Topics</option>
                  <option value="Arrays">Arrays</option>
                  <option value="Trees">Trees</option>
                  <option value="Graphs">Graphs</option>
                  <option value="DP">DP</option>
                </select>
                <select className="calendar-filter-select" value={selectedDiff} onChange={(e) => setSelectedDiff(e.target.value as any)}>
                  <option value="All">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select className="calendar-filter-select" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value as any)}>
                  <option value="All">All Companies</option>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                  <option value="TCS">TCS</option>
                </select>
              </div>

              {/* Problems table */}
              <div className="registry-table-scroll-container">
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>Solved</th>
                      <th>Problem Title</th>
                      <th>Topic</th>
                      <th>Company</th>
                      <th>Difficulty</th>
                      <th>Acceptance</th>
                      <th style={{ width: '40px' }}>★</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.map(p => {
                      const isSolved = solvedIds.includes(p.id);
                      return (
                        <tr key={p.id} className="table-row-hover" style={{ cursor: 'pointer' }} onClick={() => handleSelectProblem(p)}>
                          <td>
                            {isSolved ? (
                              <span className="text-accent-green" style={{ fontWeight: 800 }}>✓</span>
                            ) : (
                              <span className="text-muted" style={{ fontSize: '12px' }}>-</span>
                            )}
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{p.topic}</td>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.company}</td>
                          <td>
                            <span className={`eligibility-tag ${p.difficulty === 'easy' ? 'eligible' : p.difficulty === 'medium' ? 'ineligible' : 'pending'}`}>
                              {p.difficulty}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{p.acceptance}</td>
                          <td>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(p.id); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: bookmarkedIds.includes(p.id) ? 'var(--accent-orange)' : 'var(--text-muted)' }}
                            >
                              ★
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sidebar info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <section className="bento-card">
                <span className="section-title-label">Coding Contests</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                  <div className="mini-drive-row" style={{ padding: '12px' }}>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '13px' }}>TPO Weekly Practice #5</h5>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Scheduled: July 4, 3:00 PM</p>
                    </div>
                    <span className="mini-drive-badge badge-deadline">2d left</span>
                  </div>
                  <div className="mini-drive-row" style={{ padding: '12px' }}>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '13px' }}>TCS CodeVita Mock Arena</h5>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Historical OA Questions</p>
                    </div>
                    <span className="mini-drive-badge badge-shortlisted">Active</span>
                  </div>
                </div>
              </section>

              <section className="bento-card">
                <span className="section-title-label">DSA Track Standings</span>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Your campus rank is <strong>14th</strong> out of 380 CSE students in coding challenges. Solve {codingProblems.length - solvedIds.length} more problems to unlock the Microsoft practice badge.
                </p>
              </section>
            </div>
          </div>
        </div>
      ) : (
        /* Workspace Mode */
        <div className="coding-workspace-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', height: '100%', alignItems: 'stretch' }}>
          {/* Left panel: Problem Description */}
          <section className="bento-card" style={{ display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <button className="view-calendar-btn" style={{ fontSize: '11px', padding: '6px 12px' }} onClick={() => setActiveProblemId(null)}>
                &larr; Problems
              </button>
              <button
                onClick={() => toggleBookmark(activeProblem!.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: bookmarkedIds.includes(activeProblem!.id) ? 'var(--accent-orange)' : 'var(--text-muted)' }}
              >
                ★
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <h2 className="section-title-large" style={{ margin: 0 }}>{activeProblem!.title}</h2>
              <span className={`eligibility-tag ${activeProblem!.difficulty === 'easy' ? 'eligible' : activeProblem!.difficulty === 'medium' ? 'ineligible' : 'pending'}`}>
                {activeProblem!.difficulty}
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
              {activeProblem!.description}
            </p>

            <span className="details-section-title" style={{ marginBottom: '8px' }}>Constraints</span>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
              {activeProblem!.constraints.map((c, i) => (
                <li key={i}><code>{c}</code></li>
              ))}
            </ul>

            <span className="details-section-title" style={{ marginBottom: '8px' }}>Expandable Test Cases</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeProblem!.testCases.map((tc, idx) => (
                <div key={idx} style={{ background: 'var(--bg-page)', border: '1px solid var(--border-soft)', padding: '10px 12px', borderRadius: '6px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Input:</span> {tc.input}</div>
                  <div style={{ marginTop: '4px' }}><span style={{ color: 'var(--text-muted)' }}>Output:</span> {tc.output}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Right panel: Editor workspace */}
          <section className="bento-card" style={{ display: 'flex', flexDirection: 'column', padding: '20px', background: '#09090b', borderColor: '#27272a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>MAIN.WORKSPACE</span>
              <select
                className="calendar-filter-select"
                style={{ background: '#18181b', color: '#f4f4f5', borderColor: '#27272a', fontSize: '11.5px', padding: '4px 8px' }}
                value={activeLang}
                onChange={(e) => handleLanguageChange(e.target.value as any)}
              >
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 20</option>
              </select>
            </div>

            {/* Code editor textarea wrapper */}
            <div className="ide-editor-container" style={{ flexGrow: 1, display: 'flex', position: 'relative', minHeight: '240px', background: '#18181b', borderRadius: '6px', border: '1px solid #27272a', overflow: 'hidden' }}>
              {/* Fake line numbers */}
              <div style={{ width: '32px', background: '#0f0f11', borderRight: '1px solid #27272a', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#52525b', userSelect: 'none' }}>
                {Array.from({ length: 15 }, (_, i) => i + 1).map(n => (
                  <div key={n}>{n}</div>
                ))}
              </div>
              <textarea
                className="ide-code-textarea"
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                style={{
                  flexGrow: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#e4e4e7',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                  lineHeight: '1.6',
                  padding: '12px',
                  resize: 'none',
                  whiteSpace: 'pre'
                }}
              />
            </div>

            {/* Console output block */}
            <div className="ide-console-panel" style={{ height: '140px', minHeight: '140px', background: '#09090b', border: isCompileSuccess === true ? '1px solid var(--accent-green)' : isCompileSuccess === false ? '1px solid var(--accent-red)' : '1px solid #27272a', borderRadius: '6px', marginTop: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ background: '#18181b', padding: '6px 12px', borderBottom: '1px solid #27272a', fontSize: '10.5px', color: '#a1a1aa', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                CONSOLE OUTPUT
              </div>
              <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#e4e4e7', display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: 1.5 }}>
                {consoleLogs.length === 0 ? (
                  <span style={{ color: '#52525b' }}>Console is quiet. Submit or Run code to compile.</span>
                ) : (
                  consoleLogs.map((line, i) => {
                    let color = '#a1a1aa';
                    if (line.includes('PASSED') || line.includes('ACCEPTED')) color = 'var(--accent-green)';
                    if (line.includes('FAILED')) color = 'var(--accent-red)';
                    return <div key={i} style={{ color }}>{line}</div>;
                  })
                )}
              </div>
            </div>

            {/* Editor footer CTAs */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                className="tpo-btn"
                style={{ flex: 1, background: '#18181b', color: '#e4e4e7', borderColor: '#27272a' }}
                onClick={runCodeSimulation}
                disabled={isSubmitting}
              >
                Run Tests
              </button>
              <button
                className="tpo-btn tpo-btn-primary"
                style={{ flex: 1.5 }}
                onClick={submitCodeSimulation}
                disabled={isSubmitting || editorCode.trim() === ''}
              >
                {isSubmitting ? 'Compiling...' : 'Submit Solution'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
