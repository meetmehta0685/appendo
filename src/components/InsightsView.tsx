import React, { useState, useMemo } from 'react';
import { StudentProfile } from '../types';

interface InsightsViewProps {
  studentProfile: StudentProfile;
}

// Company master database
interface CompanyDetail {
  id: string;
  name: string;
  logo: string;
  industry: string;
  overview: string;
  eligibility: string;
  process: string[];
}

const COMPANIES_MASTER: Record<string, CompanyDetail> = {
  google: {
    id: 'google',
    name: 'Google',
    logo: 'G',
    industry: 'Technology',
    overview: 'Google is a global technology leader focusing on search, cloud computing, online advertising, and artificial intelligence.',
    eligibility: 'GPA ≥ 8.5 • No Active Backlogs • CSE / IT / ECE',
    process: ['Online Coding Challenge (2 Questions)', 'Technical Interview 1 (Data Structures)', 'Technical Interview 2 (Systems & Scale)', 'Googleyness & Leadership Interview']
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'M',
    industry: 'Technology',
    overview: 'Microsoft is a multinational technology corporation producing computer software, consumer electronics, and cloud services.',
    eligibility: 'GPA ≥ 8.0 • Max 1 Active Backlog • CSE / IT / ECE / EE',
    process: ['Resume Shortlisting', 'Online Assessment (3 Coding Tasks)', 'Technical Round 1 (Algorithms)', 'Technical Round 2 (System Design)', 'HR Fitment & AA Interview']
  },
  amazon: {
    id: 'amazon',
    name: 'Amazon',
    logo: 'A',
    industry: 'E-commerce & Cloud',
    overview: 'Amazon is a tech giant focusing on e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence.',
    eligibility: 'GPA ≥ 7.5 • No Backlogs • All Engineering Branches',
    process: ['Online OA (Debugging + Coding + Work Style)', 'Technical Interview 1 (DSA)', 'Technical Interview 2 (Behavioral & Leadership Principles)', 'Bar Raiser Round']
  },
  adobe: {
    id: 'adobe',
    name: 'Adobe',
    logo: 'A',
    industry: 'Digital Media Software',
    overview: 'Adobe is a leader in creative and marketing software products, including Photoshop, Acrobat, and Adobe Experience Cloud.',
    eligibility: 'GPA ≥ 8.2 • No Backlogs • CSE / IT / ECE',
    process: ['Online Cognitive & Coding Test', 'Technical Round 1 (DS & OOP)', 'Technical Round 2 (System Architecture)', 'Director Interview']
  },
  tata_motors: {
    id: 'tata_motors',
    name: 'Tata Motors',
    logo: 'T',
    industry: 'Automobile',
    overview: 'Tata Motors is a leading global automobile manufacturer of cars, utility vehicles, buses, trucks, and defense vehicles.',
    eligibility: 'GPA ≥ 6.5 • Max 2 Backlogs • Mechanical / Automobile / Electrical',
    process: ['Aptitude & English Test', 'Technical Test (Core Mechanical)', 'Technical Interview (Projects & Machinery)', 'HR Interview']
  },
  lt: {
    id: 'lt',
    name: 'L&T',
    logo: 'L',
    industry: 'Infrastructure & Engineering',
    overview: 'Larsen & Toubro is a multinational conglomerate engaged in technology, engineering, construction, manufacturing, and financial services.',
    eligibility: 'GPA ≥ 6.0 • No Active Backlogs • Mechanical / Civil / Electrical / Chemical',
    process: ['Online Cognitive Test', 'Core Technical Domain Test', 'Technical Panel Interview', 'Medical Fitness & HR Round']
  },
  siemens: {
    id: 'siemens',
    name: 'Siemens',
    logo: 'S',
    industry: 'Industrial Engineering',
    overview: 'Siemens is a technology company focusing on industry, infrastructure, transport, and healthcare.',
    eligibility: 'GPA ≥ 7.0 • Max 1 Active Backlog • Electrical / Mechanical / ECE / CSE',
    process: ['Online Aptitude + Basic Technical MCQ', 'Technical Interview (Machines & Signals)', 'Managerial & Behavioral Interview', 'HR Final discussion']
  },
  bosch: {
    id: 'bosch',
    name: 'Bosch',
    logo: 'B',
    industry: 'Engineering & Technology',
    overview: 'Bosch is a leading global supplier of technology and services in automotive, industrial technology, and consumer goods.',
    eligibility: 'GPA ≥ 6.5 • No Active Backlogs • Mechanical / Electrical / ECE / Automobile',
    process: ['Aptitude Screening', 'Technical Test (Signals/Thermodynamics)', 'Technical Panel Discussion', 'HR Interview']
  },
  tcs: {
    id: 'tcs',
    name: 'TCS Digital',
    logo: 'T',
    industry: 'IT Consulting',
    overview: 'Tata Consultancy Services is a global leader in IT services, consulting, and business solutions.',
    eligibility: 'GPA ≥ 6.5 • Max 1 Active Backlog • All Branches',
    process: ['National Qualifier Test (NQT - Advanced Cognitive & Coding)', 'Technical Interview (DSA, OOP, DBMS)', 'HR & Managerial Discussion']
  }
};

// Historical placement student records
interface PlacementRecord {
  id: string;
  name: string;
  branch: string;
  companyId: string;
  companyName: string;
  role: string;
  package: number; // in LPA
  year: number;
}

const HISTORICAL_PLACEMENTS: PlacementRecord[] = [
  // 2026 Batch
  { id: '26-1', name: 'Aarav Sharma', branch: 'Software & Computing', companyId: 'google', companyName: 'Google', role: 'Software Engineer', package: 42.0, year: 2026 },
  { id: '26-2', name: 'Isha Patel', branch: 'Software & Computing', companyId: 'microsoft', companyName: 'Microsoft', role: 'Software Engineer', package: 28.0, year: 2026 },
  { id: '26-3', name: 'Rohan Gupta', branch: 'EC', companyId: 'amazon', companyName: 'Amazon', role: 'Software Engineer', package: 26.0, year: 2026 },
  { id: '26-4', name: 'Ananya Sen', branch: 'Software & Computing', companyId: 'adobe', companyName: 'Adobe', role: 'Backend Developer', package: 22.0, year: 2026 },
  { id: '26-5', name: 'Kabir Mehta', branch: 'Electrical', companyId: 'tcs', companyName: 'TCS Digital', role: 'Graduate Engineer Trainee', package: 7.5, year: 2026 },
  { id: '26-6', name: 'Meera Nair', branch: 'EC', companyId: 'tcs', companyName: 'TCS Digital', role: 'Graduate Engineer Trainee', package: 7.2, year: 2026 },
  { id: '26-7', name: 'Devansh Joshi', branch: 'Mechanical', companyId: 'tata_motors', companyName: 'Tata Motors', role: 'Graduate Engineer Trainee', package: 8.5, year: 2026 },
  { id: '26-8', name: 'Riya Varma', branch: 'Software & Computing', companyId: 'amazon', companyName: 'Amazon', role: 'Software Engineer', package: 24.5, year: 2026 },
  { id: '26-9', name: 'Sameer Khan', branch: 'Electrical', companyId: 'siemens', companyName: 'Siemens', role: 'Graduate Engineer Trainee', package: 9.0, year: 2026 },
  { id: '26-10', name: 'Tanvi Rao', branch: 'EC', companyId: 'microsoft', companyName: 'Microsoft', role: 'Software Engineer', package: 28.0, year: 2026 },
  { id: '26-11', name: 'Aditya Birla', branch: 'Mechanical', companyId: 'bosch', companyName: 'Bosch', role: 'Design Engineer', package: 7.5, year: 2026 },
  { id: '26-12', name: 'Amit Das', branch: 'Civil', companyId: 'lt', companyName: 'L&T', role: 'Site Engineer', package: 8.0, year: 2026 },
  { id: '26-13', name: 'Karan Singh', branch: 'Automobile', companyId: 'tata_motors', companyName: 'Tata Motors', role: 'Graduate Engineer Trainee', package: 8.2, year: 2026 },
  { id: '26-14', name: 'Neha Gupta', branch: 'Chemical', companyId: 'lt', companyName: 'L&T', role: 'Quality Engineer', package: 7.8, year: 2026 },
  { id: '26-15', name: 'Vikram Seth', branch: 'Aeronautical', companyId: 'bosch', companyName: 'Bosch', role: 'Design Engineer', package: 7.8, year: 2026 },
  { id: '26-16', name: 'Shruti Iyer', branch: 'Software & Computing', companyId: 'google', companyName: 'Google', role: 'Data Analyst', package: 20.5, year: 2026 },
  { id: '26-17', name: 'Nikhil Jain', branch: 'Software & Computing', companyId: 'microsoft', companyName: 'Microsoft', role: 'Business Analyst', package: 16.0, year: 2026 },

  // 2025 Batch
  { id: '25-1', name: 'Arjun Verma', branch: 'Software & Computing', companyId: 'google', companyName: 'Google', role: 'Software Engineer', package: 38.0, year: 2025 },
  { id: '25-2', name: 'Sanya Malhotra', branch: 'Software & Computing', companyId: 'microsoft', companyName: 'Microsoft', role: 'Software Engineer', package: 26.5, year: 2025 },
  { id: '25-3', name: 'Rahul Roy', branch: 'EC', companyId: 'amazon', companyName: 'Amazon', role: 'Software Engineer', package: 23.0, year: 2025 },
  { id: '25-4', name: 'Pooja Hegde', branch: 'Software & Computing', companyId: 'adobe', companyName: 'Adobe', role: 'Backend Developer', package: 21.0, year: 2025 },
  { id: '25-5', name: 'Rithvik Roy', branch: 'Electrical', companyId: 'tcs', companyName: 'TCS Digital', role: 'Graduate Engineer Trainee', package: 7.0, year: 2025 },
  { id: '25-6', name: 'Priya Sharma', branch: 'EC', companyId: 'siemens', companyName: 'Siemens', role: 'Graduate Engineer Trainee', package: 8.5, year: 2025 },
  { id: '25-7', name: 'Varun Dhawan', branch: 'Mechanical', companyId: 'lt', companyName: 'L&T', role: 'Graduate Engineer Trainee', package: 7.5, year: 2025 },
  { id: '25-8', name: 'Kriti Sanon', branch: 'Civil', companyId: 'lt', companyName: 'L&T', role: 'Site Engineer', package: 7.5, year: 2025 },
  { id: '25-9', name: 'Rajkummar Rao', branch: 'Automobile', companyId: 'bosch', companyName: 'Bosch', role: 'Design Engineer', package: 7.2, year: 2025 },

  // 2024 Batch
  { id: '24-1', name: 'Sid Malhotra', branch: 'Software & Computing', companyId: 'microsoft', companyName: 'Microsoft', role: 'Software Engineer', package: 25.0, year: 2024 },
  { id: '24-2', name: 'Kiara Advani', branch: 'Software & Computing', companyId: 'google', companyName: 'Google', role: 'Software Engineer', package: 35.0, year: 2024 },
  { id: '24-3', name: 'Ranbir Kapoor', branch: 'Mechanical', companyId: 'tata_motors', companyName: 'Tata Motors', role: 'Graduate Engineer Trainee', package: 8.0, year: 2024 },
  { id: '24-4', name: 'Alia Bhatt', branch: 'EC', companyId: 'amazon', companyName: 'Amazon', role: 'Software Engineer', package: 22.0, year: 2024 },
  { id: '24-5', name: 'Vicky Kaushal', branch: 'Civil', companyId: 'lt', companyName: 'L&T', role: 'Site Engineer', package: 7.2, year: 2024 },

  // 2023 Batch
  { id: '23-1', name: 'Kartik Aaryan', branch: 'Software & Computing', companyId: 'google', companyName: 'Google', role: 'Software Engineer', package: 32.0, year: 2023 },
  { id: '23-2', name: 'Sara Ali', branch: 'EC', companyId: 'microsoft', companyName: 'Microsoft', role: 'Software Engineer', package: 24.0, year: 2023 },
  { id: '23-3', name: 'Janhvi Kapoor', branch: 'Electrical', companyId: 'siemens', companyName: 'Siemens', role: 'Graduate Engineer Trainee', package: 8.0, year: 2023 },
  { id: '23-4', name: 'Ishaan Khatter', branch: 'Mechanical', companyId: 'bosch', companyName: 'Bosch', role: 'Design Engineer', package: 7.0, year: 2023 }
];

export const InsightsView: React.FC<InsightsViewProps> = ({ studentProfile }) => {
  // Filters states
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedPackageRange, setSelectedPackageRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Company Modal state
  const [modalCompanyId, setModalCompanyId] = useState<string | null>(null);

  // Pagination state for Student directory
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Reset pagination when filters change
  const handleFilterChange = (setter: Function, val: any) => {
    setter(val);
    setCurrentPage(1);
  };

  // 1. FILTERED DATASETS
  const yearFilteredPlacements = useMemo(() => {
    return HISTORICAL_PLACEMENTS.filter((rec) => rec.year === selectedYear);
  }, [selectedYear]);

  const fullyFilteredPlacements = useMemo(() => {
    return yearFilteredPlacements.filter((rec) => {
      const companyMeta = COMPANIES_MASTER[rec.companyId];
      const matchSearch =
        rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.branch.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchBranch = selectedBranch === 'all' || rec.branch === selectedBranch;
      const matchCompany = selectedCompany === 'all' || rec.companyId === selectedCompany;
      const matchIndustry = selectedIndustry === 'all' || (companyMeta && companyMeta.industry === selectedIndustry);
      const matchRole = selectedRole === 'all' || rec.role === selectedRole;
      
      let matchPackage = true;
      if (selectedPackageRange !== 'all') {
        const pkg = rec.package;
        if (selectedPackageRange === 'above20') matchPackage = pkg >= 20;
        else if (selectedPackageRange === '15to20') matchPackage = pkg >= 15 && pkg < 20;
        else if (selectedPackageRange === '10to15') matchPackage = pkg >= 10 && pkg < 15;
        else if (selectedPackageRange === '5to10') matchPackage = pkg >= 5 && pkg < 10;
        else if (selectedPackageRange === 'below5') matchPackage = pkg < 5;
      }

      return matchSearch && matchBranch && matchCompany && matchIndustry && matchRole && matchPackage;
    });
  }, [yearFilteredPlacements, searchQuery, selectedBranch, selectedCompany, selectedIndustry, selectedRole, selectedPackageRange]);

  // 2. COMPUTED METRICS
  const metrics = useMemo(() => {
    if (yearFilteredPlacements.length === 0) {
      return { totalOffers: 0, highest: 0, average: 0, median: 0, ongoing: 0 };
    }
    const packages = yearFilteredPlacements.map((p) => p.package).sort((a, b) => a - b);
    const totalOffers = yearFilteredPlacements.length;
    const highest = Math.max(...packages);
    const average = parseFloat((packages.reduce((acc, p) => acc + p, 0) / totalOffers).toFixed(1));
    
    // Median
    let median = 0;
    const mid = Math.floor(packages.length / 2);
    if (packages.length % 2 !== 0) {
      median = packages[mid];
    } else {
      median = parseFloat(((packages[mid - 1] + packages[mid]) / 2).toFixed(1));
    }

    // Ongoing placement drives calculation (Google, Microsoft, Adobe are typically active or near-active in July)
    const ongoing = selectedYear === 2026 ? 6 : 0;

    return { totalOffers, highest, average, median, ongoing };
  }, [yearFilteredPlacements, selectedYear]);

  // 3. COMPANY DIRECTORY VISITED DATA
  const companyDirectoryList = useMemo(() => {
    // Group yearFilteredPlacements by companyId to calculate selections count and roles offered
    const groupings: Record<string, { selectedCount: number; roles: Set<string>; maxPkg: number }> = {};
    
    yearFilteredPlacements.forEach((rec) => {
      if (!groupings[rec.companyId]) {
        groupings[rec.companyId] = { selectedCount: 0, roles: new Set(), maxPkg: 0 };
      }
      groupings[rec.companyId].selectedCount += 1;
      groupings[rec.companyId].roles.add(rec.role);
      groupings[rec.companyId].maxPkg = Math.max(groupings[rec.companyId].maxPkg, rec.package);
    });

    return Object.keys(COMPANIES_MASTER).map((compId) => {
      const master = COMPANIES_MASTER[compId];
      const stats = groupings[compId] || { selectedCount: 0, roles: new Set(), maxPkg: 0 };
      
      // Determine hiring branches based on eligibility template
      let branches = 'All Branches';
      if (compId === 'google' || compId === 'microsoft' || compId === 'adobe') {
        branches = 'Software, ECE';
      } else if (compId === 'tata_motors') {
        branches = 'Mechanical, Automobile';
      } else if (compId === 'bosch') {
        branches = 'Mech, Elec, ECE';
      } else if (compId === 'lt') {
        branches = 'Civil, Mech, Electrical';
      }

      return {
        ...master,
        rolesOffered: stats.selectedCount > 0 ? Array.from(stats.roles).join(', ') : 'Software / GET',
        packageText: stats.selectedCount > 0 ? `${stats.maxPkg.toFixed(1)} LPA` : '6.5 - 12 LPA',
        hiringBranches: branches,
        selectedCount: stats.selectedCount,
        visited: stats.selectedCount > 0
      };
    }).filter(c => c.visited || selectedYear === 2026); // show all for active year, else show actual hired
  }, [yearFilteredPlacements, selectedYear]);

  // 4. BRANCH OVERVIEW DYNAMIC STATS
  const branchesList = ['Software & Computing', 'Mechanical', 'Electrical', 'Civil', 'EC', 'Chemical', 'Aeronautical', 'Automobile'];
  
  const branchOverviewStats = useMemo(() => {
    return branchesList.map((branch) => {
      const placements = yearFilteredPlacements.filter((p) => p.branch === branch);
      const studentPlacedCount = placements.length;
      
      // Compute highest and average package
      let highest = 0;
      let average = 0;
      if (studentPlacedCount > 0) {
        highest = Math.max(...placements.map((p) => p.package));
        average = parseFloat((placements.reduce((acc, p) => acc + p.package, 0) / studentPlacedCount).toFixed(1));
      }

      // Estimate companies visited based on student placement company count
      const uniqueCompanies = new Set(placements.map((p) => p.companyId)).size;

      return {
        name: branch,
        companiesVisited: Math.max(uniqueCompanies, studentPlacedCount > 0 ? uniqueCompanies + 2 : 0),
        studentsPlaced: studentPlacedCount,
        highestPackage: highest > 0 ? `${highest.toFixed(1)} LPA` : 'N/A',
        averagePackage: average > 0 ? `${average.toFixed(1)} LPA` : 'N/A'
      };
    });
  }, [yearFilteredPlacements]);

  // 5. PACKAGE DISTRIBUTION COUNTS
  const packageDistribution = useMemo(() => {
    let above20 = 0;
    let range15to20 = 0;
    let range10to15 = 0;
    let range5to10 = 0;
    let below5 = 0;

    yearFilteredPlacements.forEach((p) => {
      const pkg = p.package;
      if (pkg >= 20) above20++;
      else if (pkg >= 15) range15to20++;
      else if (pkg >= 10) range10to15++;
      else if (pkg >= 5) range5to10++;
      else below5++;
    });

    return [
      { label: 'Above 20 LPA', count: above20, color: 'violet' },
      { label: '15–20 LPA', count: range15to20, color: 'blue' },
      { label: '10–15 LPA', count: range10to15, color: 'teal' },
      { label: '5–10 LPA', count: range5to10, color: 'orange' },
      { label: 'Below 5 LPA', count: below5, color: 'red' }
    ];
  }, [yearFilteredPlacements]);

  // 6. ROLE-WISE STATS
  const roleWiseStats = useMemo(() => {
    // Roles list
    const roles = [
      'Software Engineer',
      'Backend Developer',
      'Graduate Engineer Trainee',
      'Design Engineer',
      'Quality Engineer',
      'Site Engineer',
      'Data Analyst',
      'Business Analyst'
    ];

    return roles.map((role) => {
      const count = yearFilteredPlacements.filter((p) => p.role === role).length;
      return { role, count };
    });
  }, [yearFilteredPlacements]);

  // Student list pagination
  const totalPages = Math.max(1, Math.ceil(fullyFilteredPlacements.length / itemsPerPage));
  const paginatedPlacements = useMemo(() => {
    return fullyFilteredPlacements.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [fullyFilteredPlacements, currentPage]);

  const selectedCompanyDetail = useMemo(() => {
    if (!modalCompanyId) return null;
    const master = COMPANIES_MASTER[modalCompanyId];
    if (!master) return null;

    // Filter historical placements for this company
    const placements = HISTORICAL_PLACEMENTS.filter((p) => p.companyId === modalCompanyId);
    
    // Previous selection trends
    const selectionsByYear: Record<number, number> = { 2026: 0, 2025: 0, 2024: 0, 2023: 0 };
    let highestPkg = 0;
    const hiringBranchesSet = new Set<string>();

    placements.forEach((p) => {
      selectionsByYear[p.year] = (selectionsByYear[p.year] || 0) + 1;
      highestPkg = Math.max(highestPkg, p.package);
      hiringBranchesSet.add(p.branch);
    });

    const activeYearPlacements = placements.filter((p) => p.year === selectedYear);

    return {
      ...master,
      highestPackage: highestPkg > 0 ? `${highestPkg.toFixed(1)} LPA` : '6.5 - 28 LPA',
      branchesHired: Array.from(hiringBranchesSet).join(', ') || 'Software, Mechanical, Electrical',
      selectionsHistory: selectionsByYear,
      selectedCountCurrent: activeYearPlacements.length,
      currentYearRoles: Array.from(new Set(activeYearPlacements.map((p) => p.role))).join(', ') || 'Software Developer / Trainee'
    };
  }, [modalCompanyId, selectedYear]);

  return (
    <div className="campus-insights-view">
      {/* 1. PORTAL GREETING */}
      <div className="dashboard-greeting-row" style={{ marginBottom: '24px' }}>
        <div>
          <span className="dashboard-greeting-date">PLACEMENT METRICS & COHORT ARCHIVES</span>
          <h1 className="dashboard-greeting-title">Campus Placement Insights</h1>
          <p className="dashboard-greeting-sub">
            Explore comprehensive campus placement registries, company hiring history, branch analytics, and recruitment patterns.
          </p>
        </div>

        {/* Cohort historical batch selector */}
        <div className="history-cohort-box">
          <span className="cohort-label">CHOOSE BATCH</span>
          <div className="cohort-toggle-buttons">
            {([2026, 2025, 2024, 2023] as const).map((year) => (
              <button
                key={year}
                className={`cohort-btn ${selectedYear === year ? 'active' : ''}`}
                onClick={() => handleFilterChange(setSelectedYear, year)}
              >
                Class of {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CAMPUS PLACEMENT OVERVIEW (Compact Metrics Ribbon) */}
      <div className="insights-overview-row">
        <div className="metric-pill-card">
          <span className="metric-label">Offers Released</span>
          <span className="metric-val">{metrics.totalOffers}</span>
          <span className="metric-sub">This Year</span>
        </div>
        <div className="metric-pill-card">
          <span className="metric-label">Participated Branches</span>
          <span className="metric-val">9</span>
          <span className="metric-sub">Across College</span>
        </div>
        <div className="metric-pill-card">
          <span className="metric-label">Highest Package</span>
          <span className="metric-val text-accent-violet">{metrics.highest.toFixed(1)} LPA</span>
          <span className="metric-sub">Global Offer</span>
        </div>
        <div className="metric-pill-card">
          <span className="metric-label">Average Package</span>
          <span className="metric-val text-accent-blue">{metrics.average.toFixed(1)} LPA</span>
          <span className="metric-sub">Mean CTC</span>
        </div>
        <div className="metric-pill-card">
          <span className="metric-label">Median Package</span>
          <span className="metric-val text-accent-green">{metrics.median.toFixed(1)} LPA</span>
          <span className="metric-sub">Midpoint CTC</span>
        </div>
        {selectedYear === 2026 && (
          <div className="metric-pill-card active-drives">
            <span className="metric-label">Active Drives</span>
            <span className="metric-val text-accent-orange">{metrics.ongoing}</span>
            <span className="metric-sub">OA / Interviews</span>
          </div>
        )}
      </div>

      {/* 3. SEARCH & FILTERS CONTROLS */}
      <div className="bento-card filter-controls-card" style={{ marginBottom: '24px' }}>
        <span className="section-title-label" style={{ marginBottom: '12px', display: 'block' }}>
          Explore Placement Records (Global Search & Filters)
        </span>
        <div className="filters-grid">
          <div className="search-input-wrapper">
            <span className="filter-input-label">Search Query</span>
            <input
              type="text"
              placeholder="Search by student, company, role, or branch..."
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              className="calendar-filter-select"
              style={{ width: '100%' }}
            />
          </div>

          <div className="filter-field">
            <span className="filter-input-label">Branch</span>
            <select
              value={selectedBranch}
              onChange={(e) => handleFilterChange(setSelectedBranch, e.target.value)}
              className="calendar-filter-select"
            >
              <option value="all">All Branches</option>
              {branchesList.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <span className="filter-input-label">Company</span>
            <select
              value={selectedCompany}
              onChange={(e) => handleFilterChange(setSelectedCompany, e.target.value)}
              className="calendar-filter-select"
            >
              <option value="all">All Companies</option>
              {Object.values(COMPANIES_MASTER).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <span className="filter-input-label">Industry</span>
            <select
              value={selectedIndustry}
              onChange={(e) => handleFilterChange(setSelectedIndustry, e.target.value)}
              className="calendar-filter-select"
            >
              <option value="all">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="E-commerce & Cloud">E-commerce</option>
              <option value="Digital Media Software">Digital Media</option>
              <option value="Automobile">Automobile</option>
              <option value="Infrastructure & Engineering">Infrastructure</option>
              <option value="Industrial Engineering">Industrial</option>
              <option value="Engineering & Technology">Engineering</option>
              <option value="IT Consulting">IT Consulting</option>
            </select>
          </div>

          <div className="filter-field">
            <span className="filter-input-label">Job Role</span>
            <select
              value={selectedRole}
              onChange={(e) => handleFilterChange(setSelectedRole, e.target.value)}
              className="calendar-filter-select"
            >
              <option value="all">All Roles</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Graduate Engineer Trainee">Graduate Engineer Trainee</option>
              <option value="Design Engineer">Design Engineer</option>
              <option value="Site Engineer">Site Engineer</option>
              <option value="Quality Engineer">Quality Engineer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Business Analyst">Business Analyst</option>
            </select>
          </div>

          <div className="filter-field">
            <span className="filter-input-label">Package Range</span>
            <select
              value={selectedPackageRange}
              onChange={(e) => handleFilterChange(setSelectedPackageRange, e.target.value)}
              className="calendar-filter-select"
            >
              <option value="all">All Ranges</option>
              <option value="above20">Above 20 LPA</option>
              <option value="15to20">15 – 20 LPA</option>
              <option value="10to15">10 – 15 LPA</option>
              <option value="5to10">5 – 10 LPA</option>
              <option value="below5">Below 5 LPA</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. COMPANY PLACEMENT DIRECTORY */}
      <section className="bento-card" style={{ marginBottom: '24px' }}>
        <span className="section-title-label" style={{ marginBottom: '16px', display: 'block' }}>
          Company Placement Directory
        </span>
        <div className="companies-insights-grid">
          {companyDirectoryList.map((comp) => (
            <div
              key={comp.id}
              className="company-insights-card"
              onClick={() => setModalCompanyId(comp.id)}
            >
              <div className="comp-card-top">
                <div className="comp-avatar-large">{comp.logo}</div>
                <div className="comp-meta">
                  <h3 className="comp-title">{comp.name}</h3>
                  <span className="comp-industry-tag">{comp.industry}</span>
                </div>
              </div>
              <div className="comp-card-details">
                <div className="detail-line">
                  <span className="lbl">Role Offered:</span>
                  <span className="val">{comp.rolesOffered}</span>
                </div>
                <div className="detail-line">
                  <span className="lbl">CTC Package:</span>
                  <span className="val font-semibold">{comp.packageText}</span>
                </div>
                <div className="detail-line">
                  <span className="lbl">Hiring Branches:</span>
                  <span className="val">{comp.hiringBranches}</span>
                </div>
              </div>
              <div className="comp-card-bottom">
                <span className="students-selected-tag">
                  {comp.selectedCount} Selections ({selectedYear})
                </span>
                <span className="view-details-action">View Details &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STUDENT PLACEMENT DIRECTORY */}
      <section className="bento-card" style={{ marginBottom: '24px' }}>
        <div className="registry-header-row" style={{ marginBottom: '16px' }}>
          <div>
            <h3 className="section-title-label">Student Placement Directory</h3>
            <p className="registry-header-sub">Searchable directory of verified placement selections</p>
          </div>
          <div className="records-count-indicator">
            Showing <strong>{fullyFilteredPlacements.length}</strong> of <strong>{yearFilteredPlacements.length}</strong> records
          </div>
        </div>

        <div className="registry-table-scroll-container">
          <table className="stats-table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th>Student Name</th>
                <th>Branch</th>
                <th>Company</th>
                <th>Job Role</th>
                <th>Package (LPA)</th>
                <th>Placement Year</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlacements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted" style={{ padding: '24px' }}>
                    No student placement records match your search or selected filters.
                  </td>
                </tr>
              ) : (
                paginatedPlacements.map((rec) => {
                  const isUser = rec.name.toLowerCase() === studentProfile.name.toLowerCase();
                  return (
                    <tr
                      key={rec.id}
                      className={`table-row-hover ${isUser ? 'user-highlight-row' : ''}`}
                    >
                      <td className="font-semibold text-primary">
                        {rec.name} {isUser && <span className="user-self-badge">(You)</span>}
                      </td>
                      <td className="text-secondary">{rec.branch}</td>
                      <td className="font-semibold text-primary">{rec.companyName}</td>
                      <td className="text-secondary">{rec.role}</td>
                      <td className="font-semibold text-primary">{rec.package.toFixed(1)} LPA</td>
                      <td className="text-secondary">{rec.year}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination-controls" style={{ marginTop: '16px' }}>
            <button
              className="tpo-btn tpo-btn-secondary"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              &larr; Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`tpo-btn ${currentPage === p ? 'tpo-btn-primary' : 'tpo-btn-secondary'} pagination-page-btn`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="tpo-btn tpo-btn-secondary"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next &rarr;
            </button>
          </div>
        )}
      </section>

      {/* 6. DOUBLE-COLUMN: BRANCH-WISE OVERVIEW & PACKAGE DISTRIBUTION */}
      <div className="stats-charts-row" style={{ marginBottom: '24px' }}>
        {/* Left Card: Branch-wise Placements */}
        <div className="bento-card" style={{ flexGrow: 1 }}>
          <span className="section-title-label" style={{ marginBottom: '16px', display: 'block' }}>
            Branch-wise Placement Overview
          </span>
          <div className="branch-grid-overview">
            {branchOverviewStats.map((branch) => (
              <div key={branch.name} className="branch-overview-item-card">
                <h4 className="branch-item-title">{branch.name}</h4>
                <div className="branch-item-metrics">
                  <div className="metric-row">
                    <span className="lbl">Companies Visited:</span>
                    <span className="val font-medium">{branch.companiesVisited}</span>
                  </div>
                  <div className="metric-row">
                    <span className="lbl">Students Placed:</span>
                    <span className="val font-medium">{branch.studentsPlaced}</span>
                  </div>
                  <div className="metric-row">
                    <span className="lbl">Highest CTC:</span>
                    <span className="val font-semibold text-accent-violet">{branch.highestPackage}</span>
                  </div>
                  <div className="metric-row">
                    <span className="lbl">Average CTC:</span>
                    <span className="val font-semibold text-accent-blue">{branch.averagePackage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Package Distribution */}
        <div className="bento-card" style={{ width: '380px', flexShrink: 0 }}>
          <span className="section-title-label" style={{ marginBottom: '16px', display: 'block' }}>
            Package Distribution
          </span>
          <p className="tab-instructions" style={{ marginBottom: '16px', display: 'block' }}>
            Distribution ranges of offers issued in the selected batch.
          </p>
          <div className="package-distribution-stack">
            {packageDistribution.map((dist) => (
              <div key={dist.label} className="package-dist-item">
                <div className="dist-header">
                  <span className="dist-label font-semibold">{dist.label}</span>
                  <span className="dist-count font-bold">{dist.count} Students</span>
                </div>
                <div className="dist-bar-track">
                  <div
                    className={`dist-bar-fill bg-accent-${dist.color}`}
                    style={{ width: `${metrics.totalOffers > 0 ? (dist.count / metrics.totalOffers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. DOUBLE-COLUMN: COMPANY HIRING TRENDS & ROLE-WISE STATISTICS */}
      <div className="stats-charts-row" style={{ marginBottom: '24px' }}>
        {/* Left Card: Company Hiring Trends (Simple Statistics) */}
        <div className="bento-card" style={{ flexGrow: 1 }}>
          <span className="section-title-label" style={{ marginBottom: '16px', display: 'block' }}>
            Company Hiring Trends & Key Allocations
          </span>
          <div className="trends-statistics-list">
            <div className="trend-stat-row">
              <div className="trend-left">
                <div className="trend-company-icon bg-accent-blue">G</div>
                <div>
                  <h4 className="trend-company-title font-semibold">Google</h4>
                  <span className="trend-target-branches">Software Branches</span>
                </div>
              </div>
              <div className="trend-right">
                <span className="trend-count font-semibold">15 Students</span>
                <span className="trend-avg-pkg text-accent-blue">Avg: 22 LPA</span>
              </div>
            </div>

            <div className="trend-stat-row">
              <div className="trend-left">
                <div className="trend-company-icon bg-accent-violet">M</div>
                <div>
                  <h4 className="trend-company-title font-semibold">Microsoft</h4>
                  <span className="trend-target-branches">Software & Computing, ECE</span>
                </div>
              </div>
              <div className="trend-right">
                <span className="trend-count font-semibold">8 Students</span>
                <span className="trend-avg-pkg text-accent-violet">Avg: 28 LPA</span>
              </div>
            </div>

            <div className="trend-stat-row">
              <div className="trend-left">
                <div className="trend-company-icon bg-accent-green">L</div>
                <div>
                  <h4 className="trend-company-title font-semibold">L&T</h4>
                  <span className="trend-target-branches">Civil, Mechanical, Electrical</span>
                </div>
              </div>
              <div className="trend-right">
                <span className="trend-count font-semibold">26 Students</span>
                <span className="trend-avg-pkg text-accent-green">Avg: 8 LPA</span>
              </div>
            </div>

            <div className="trend-stat-row">
              <div className="trend-left">
                <div className="trend-company-icon bg-accent-orange">B</div>
                <div>
                  <h4 className="trend-company-title font-semibold">Bosch</h4>
                  <span className="trend-target-branches">Mechanical, Electrical, ECE</span>
                </div>
              </div>
              <div className="trend-right">
                <span className="trend-count font-semibold">18 Students</span>
                <span className="trend-avg-pkg text-accent-orange">Avg: 7.5 LPA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Role-wise Placement Statistics */}
        <div className="bento-card" style={{ width: '380px', flexShrink: 0 }}>
          <span className="section-title-label" style={{ marginBottom: '16px', display: 'block' }}>
            Role-wise Placement Statistics
          </span>
          <div className="role-stats-stack">
            {roleWiseStats.map((item) => (
              <div key={item.role} className="role-stat-item-row">
                <span className="role-name-text text-secondary">{item.role}</span>
                <span className="role-placed-badge font-bold">
                  {item.count} {item.count === 1 ? 'Student' : 'Students'} Selected
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. COMPANY DETAILS MODAL */}
      {modalCompanyId && selectedCompanyDetail && (
        <div className="modal-overlay" onClick={() => setModalCompanyId(null)}>
          <div className="company-details-drawer bento-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="drawer-header-row">
              <div className="drawer-title-box">
                <div className="drawer-avatar-large">{selectedCompanyDetail.logo}</div>
                <div>
                  <h2>{selectedCompanyDetail.name}</h2>
                  <span className="drawer-subtitle-tag">{selectedCompanyDetail.industry}</span>
                </div>
              </div>
              <button className="close-drawer-btn" onClick={() => setModalCompanyId(null)}>
                &times;
              </button>
            </div>

            {/* Content Body */}
            <div className="drawer-content-body">
              {/* Overview */}
              <div className="drawer-section">
                <span className="meta-label">Company Overview</span>
                <p className="drawer-desc-text">{selectedCompanyDetail.overview}</p>
              </div>

              {/* Recruitment details */}
              <div className="drawer-details-grid">
                <div className="drawer-detail-item">
                  <span className="meta-label">Hiring Branches</span>
                  <span className="drawer-value-text">{selectedCompanyDetail.branchesHired}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="meta-label">Typical Roles Offered</span>
                  <span className="drawer-value-text">{selectedCompanyDetail.currentYearRoles}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="meta-label">Package Bracket</span>
                  <span className="drawer-value-text font-semibold text-accent-blue">{selectedCompanyDetail.highestPackage}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="meta-label">Eligibility Criteria</span>
                  <span className="drawer-value-text font-medium text-accent-red">{selectedCompanyDetail.eligibility}</span>
                </div>
              </div>

              {/* Previous recruitment history */}
              <div className="drawer-section" style={{ marginTop: '20px' }}>
                <span className="meta-label">Previous Selections History</span>
                <div className="selections-history-row">
                  {Object.keys(selectedCompanyDetail.selectionsHistory).sort((a, b) => parseInt(b) - parseInt(a)).map((yearStr) => {
                    const yearNum = parseInt(yearStr);
                    const count = selectedCompanyDetail.selectionsHistory[yearNum] || 0;
                    return (
                      <div key={yearNum} className="history-pill-selection">
                        <span className="yr">Class of {yearNum}:</span>
                        <span className="cnt">{count} Placed</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Placement process */}
              <div className="drawer-section" style={{ marginTop: '20px' }}>
                <span className="meta-label">Campus Placement Process Rounds</span>
                <ol className="placement-process-list">
                  {selectedCompanyDetail.process.map((step, sIdx) => (
                    <li key={sIdx}>
                      <span className="step-num">{sIdx + 1}</span>
                      <span className="step-text">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="drawer-footer">
              <button className="tpo-btn tpo-btn-secondary" onClick={() => setModalCompanyId(null)}>
                Close Directory Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
