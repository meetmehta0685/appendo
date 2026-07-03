import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { apiClient } from '../api/client';
import { 
  useCodingProblemsQuery, 
  useRunCodeMutation, 
  useSubmitCodeMutation, 
  useToggleCodingBookmarkMutation, 
  useBookmarkedProblemsQuery 
} from '../api/queries';

interface CodingViewProps {
  studentProfile: StudentProfile;
}

export interface Problem {
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

export const codingProblems: Problem[] = [
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
  
  // Track solved and bookmarked problems using API sync
  const [solvedIds, setSolvedIds] = useState<string[]>(['p1']);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // API hooks for dynamic querying
  const { data: dbProblems } = useCodingProblemsQuery();
  const { data: dbBookmarks } = useBookmarkedProblemsQuery(studentProfile.personalEmail || '');
  
  const runMutation = useRunCodeMutation();
  const submitMutation = useSubmitCodeMutation();
  const toggleBookmarkMutation = useToggleCodingBookmarkMutation();

  const activeProblemsList = (dbProblems && dbProblems.length > 0) ? dbProblems : codingProblems;

  // Sync bookmarks from db query
  useEffect(() => {
    if (dbBookmarks) {
      setBookmarkedIds(dbBookmarks);
    }
  }, [dbBookmarks]);

  // Sync initial solved list from student profile subscores list of submissions if any
  useEffect(() => {
    apiClient.get<any[]>(`/coding/submissions?email=${studentProfile.personalEmail || ''}`)
      .then(res => {
        const solved = res.data.filter(s => s.status === 'accepted').map(s => s.problemId);
        if (solved.length > 0) {
          setSolvedIds(solved);
        }
      })
      .catch(() => console.error("Failed to load submission history on init"));
  }, [studentProfile]);

  // Filter problems list
  const filteredProblems = activeProblemsList.filter(p => {
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
    const activeProb = activeProblemsList.find(p => p.id === activeProblemId);
    if (activeProb) {
      setEditorCode(activeProb.boilerplates[lang]);
    }
  };

  const runCodeSimulation = () => {
    if (!activeProblemId) return;
    setConsoleLogs(['Compiling and linking files...', 'Submitting code execution to Judge0 cluster...']);
    setIsCompileSuccess(null);

    runMutation.mutate({
      problemId: activeProblemId,
      language: activeLang,
      codeContent: editorCode,
      customInput: ""
    }, {
      onSuccess: (data) => {
        setConsoleLogs(data.logs);
        setIsCompileSuccess(data.compileSuccess);
      },
      onError: () => {
        setConsoleLogs(['Error reaching remote compiler.', 'Execution failed.']);
        setIsCompileSuccess(false);
      }
    });
  };

  const submitCodeSimulation = () => {
    if (!activeProblemId) return;
    setIsSubmitting(true);
    setConsoleLogs(['Uploading package...', 'Running system evaluation...']);
    setIsCompileSuccess(null);

    submitMutation.mutate({
      email: studentProfile.personalEmail || '',
      problemId: activeProblemId,
      language: activeLang,
      codeContent: editorCode
    }, {
      onSuccess: (data) => {
        setConsoleLogs(data.logs);
        setIsCompileSuccess(data.status === 'ACCEPTED');
        setIsSubmitting(false);
        if (activeProblemId && !solvedIds.includes(activeProblemId)) {
          setSolvedIds(prev => [...prev, activeProblemId]);
        }
      },
      onError: () => {
        setConsoleLogs(['Remote compiler verification error. Submission rejected.']);
        setIsCompileSuccess(false);
        setIsSubmitting(false);
      }
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    toggleBookmarkMutation.mutate({
      email: studentProfile.personalEmail || '',
      problemId: id
    });
  };

  const activeProblem = activeProblemsList.find(p => p.id === activeProblemId);

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
                {solvedIds.length} / {activeProblemsList.length}
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

              <div className="dsa-problems-list">
                {filteredProblems.map(prob => {
                  const isSolved = solvedIds.includes(prob.id);
                  const isBookmarked = bookmarkedIds.includes(prob.id);
                  return (
                    <div key={prob.id} className="dsa-problem-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span 
                          style={{ cursor: 'pointer', fontSize: '16px', color: isBookmarked ? 'var(--accent-orange)' : 'var(--text-secondary)' }}
                          onClick={() => toggleBookmark(prob.id)}
                        >
                          {isBookmarked ? '★' : '☆'}
                        </span>
                        <div>
                          <h4 
                            className="dsa-problem-title" 
                            style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => handleSelectProblem(prob)}
                          >
                            {prob.title}
                            {isSolved && <span style={{ color: 'var(--accent-green)', fontSize: '12px' }}>✓ Solved</span>}
                          </h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {prob.topic} · {prob.company}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className={`diff-tag ${prob.difficulty}`}>
                          {prob.difficulty}
                        </span>
                        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', minWidth: '45px', textAlign: 'right' }}>
                          {prob.acceptance}
                        </span>
                        <button 
                          className="btn-solve-primary"
                          onClick={() => handleSelectProblem(prob)}
                        >
                          Solve
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredProblems.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>
                    No problems match the selected filters.
                  </div>
                )}
              </div>
            </section>

            {/* Sidebar quick actions */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="bento-card" style={{ padding: '20px' }}>
                <span className="section-title-label">Weekly Coding Challenge</span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '8px 0 4px 0' }}>LRU Cache</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="diff-tag medium">medium</span>
                  <button className="btn-solve-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Attempt Challenge
                  </button>
                </div>
              </div>

              <div className="bento-card" style={{ padding: '20px' }}>
                <span className="section-title-label">Recommended Topics</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  <span className="badge-tech" style={{ cursor: 'pointer' }} onClick={() => setSelectedTopic('Arrays')}>Arrays &amp; Vectors</span>
                  <span className="badge-tech" style={{ cursor: 'pointer' }} onClick={() => setSelectedTopic('Trees')}>Binary Trees</span>
                  <span className="badge-tech" style={{ cursor: 'pointer' }} onClick={() => setSelectedTopic('DP')}>Dynamic Programming</span>
                  <span className="badge-tech" style={{ cursor: 'pointer' }} onClick={() => setSelectedTopic('Graphs')}>Graph Search</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        /* IDE Workspace Mode */
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', gap: '16px' }}>
          {/* Top workspace bar */}
          <div className="ide-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                className="btn-solve-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setActiveProblemId(null)}
              >
                &larr; Problems
              </button>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                {activeProblem?.title}
              </h3>
              <span className={`diff-tag ${activeProblem?.difficulty}`}>
                {activeProblem?.difficulty}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <select 
                className="calendar-filter-select"
                style={{ padding: '4px 8px', fontSize: '12px' }}
                value={activeLang}
                onChange={(e) => handleLanguageChange(e.target.value as any)}
              >
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 20</option>
              </select>
            </div>
          </div>

          {/* IDE Split editor / description layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '16px', minHeight: 0 }}>
            {/* Left pane: Description & Constraints */}
            <div className="bento-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
              <div>
                <span className="section-title-label" style={{ fontSize: '10px' }}>Description</span>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>
                  {activeProblem?.description}
                </p>
              </div>

              {activeProblem?.constraints && activeProblem.constraints.length > 0 && (
                <div>
                  <span className="section-title-label" style={{ fontSize: '10px' }}>Constraints</span>
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {activeProblem.constraints.map((c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeProblem?.testCases && activeProblem.testCases.map((tc: any, idx: number) => (
                <div key={idx}>
                  <span className="section-title-label" style={{ fontSize: '10px' }}>Example Test Case {idx + 1}</span>
                  <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><strong>Input:</strong> {tc.input}</div>
                    <div><strong>Output:</strong> {tc.output}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right pane: Editor and Terminal */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr auto 120px', gap: '12px', minHeight: 0 }}>
              {/* Code editor */}
              <div className="bento-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>main.{activeLang === 'python' ? 'py' : activeLang === 'java' ? 'java' : 'cpp'}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Autosaved</span>
                </div>
                <textarea
                  className="code-editor-textarea"
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  style={{
                    flex: 1,
                    resize: 'none',
                    border: 'none',
                    outline: 'none',
                    padding: '12px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5
                  }}
                />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  className="btn-solve-secondary"
                  onClick={runCodeSimulation}
                  disabled={isSubmitting || runMutation.isPending}
                >
                  {runMutation.isPending ? 'Executing...' : 'Run Code'}
                </button>
                <button 
                  className="btn-solve-primary"
                  onClick={submitCodeSimulation}
                  disabled={isSubmitting || submitMutation.isPending}
                >
                  {isSubmitting || submitMutation.isPending ? 'Verifying...' : 'Submit Solution'}
                </button>
              </div>

              {/* Console log outputs */}
              <div className="bento-card" style={{ padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="section-title-label" style={{ fontSize: '9px' }}>Console Logs &amp; compiler output</span>
                <div style={{ fontFamily: 'monospace', fontSize: '11.5px', color: isCompileSuccess === false ? 'var(--accent-red)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {consoleLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                  {consoleLogs.length === 0 && (
                    <div style={{ color: 'var(--text-muted)' }}>Press Run Code or Submit to view results...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
