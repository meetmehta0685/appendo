import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types';

interface TechnicalCoreViewProps {
  studentProfile: StudentProfile;
  onUpdateProfile: (p: StudentProfile) => void;
}

// Subject and topic details
interface Topic {
  id: string;
  name: string;
  readTime: string;
  content: string;
}

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface MockQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface InterviewQuestion {
  id: string;
  company: string;
  companyLogo: string;
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface SubjectData {
  id: string;
  name: string;
  icon: string;
  color: string; // theme color class
  topics: Topic[];
  mcqs: MCQQuestion[];
  flashcards: Flashcard[];
  mockTest: MockQuestion[];
  interviews: InterviewQuestion[];
  companyPrep: {
    priority: 'High' | 'Medium' | 'Low';
    companies: string[];
    focusAreas: string[];
    tips: string;
  };
}

// Reusable data structure for all three branches
const BRANCH_DATA: Record<'cse' | 'me' | 'ee', SubjectData[]> = {
  cse: [
    {
      id: 'dbms',
      name: 'DBMS',
      icon: '🗄️',
      color: 'blue',
      topics: [
        {
          id: 'dbms-1',
          name: 'Entity-Relationship Model',
          readTime: '5 mins',
          content: 'The ER Model represents the conceptual schema of a database. Key components include: \n1. Entities (Rectangles): Real-world objects. \n2. Attributes (Ellipses): Properties of entities (e.g., Primary keys are underlined). \n3. Relationships (Diamonds): Associations between entities, characterized by cardinality (1:1, 1:N, N:M) and participation constraint (total or partial).'
        },
        {
          id: 'dbms-2',
          name: 'Relational Schema & Normalization',
          readTime: '8 mins',
          content: 'Normalization minimizes data redundancy and avoids anomalies (insert, update, delete). \n- 1NF: Atomic values only. \n- 2NF: 1NF + no partial dependency (all non-prime attributes must fully depend on the primary key). \n- 3NF: 2NF + no transitive dependency (non-prime attributes cannot depend on other non-prime attributes). \n- BCNF: For every functional dependency X -> Y, X must be a superkey.'
        },
        {
          id: 'dbms-3',
          name: 'Transaction ACID Properties',
          readTime: '6 mins',
          content: 'ACID properties guarantee reliability in database transactions: \n- Atomicity: "All or nothing" execution. \n- Consistency: Transaction transitions the database from one valid state to another. \n- Isolation: Concurrent transactions do not interfere (levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable). \n- Durability: Committed updates survive system failures.'
        },
        {
          id: 'dbms-4',
          name: 'Database Indexing (B+ Trees)',
          readTime: '7 mins',
          content: 'Indexing speeds up query execution. B+ Trees are self-balancing search trees widely used in disk storage: \n- Data pointer nodes are only at the leaf level, linked sequentially for fast range queries. \n- Internal nodes only contain search keys to maximize fan-out. \n- Search, insertion, and deletion complexity is O(log n).'
        }
      ],
      mcqs: [
        {
          id: 'dbms-mcq-1',
          question: 'Which normal form is violated if a non-prime attribute is transitively dependent on the primary key?',
          options: ['1NF', '2NF', '3NF', 'BCNF'],
          correctIndex: 2,
          explanation: 'Third Normal Form (3NF) requires that there is no transitive dependency. If a non-prime attribute depends on another non-prime attribute which in turn depends on the key, it violates 3NF.'
        },
        {
          id: 'dbms-mcq-2',
          question: 'In a B+ Tree index, where are the actual data pointers or rows stored?',
          options: ['Only in internal nodes', 'Only in the leaf nodes', 'Both in internal and leaf nodes', 'In the root node only'],
          correctIndex: 1,
          explanation: 'In a B+ tree, internal nodes only store search keys for navigation, while leaf nodes store the actual data records or pointers to them, alongside links to neighboring leaf nodes.'
        }
      ],
      flashcards: [
        { id: 'dbms-fc-1', front: 'What is a Foreign Key constraint?', back: 'A constraint that establishes a link between two tables, ensuring referential integrity by requiring the child values to exist in the parent table primary key column.' },
        { id: 'dbms-fc-2', front: 'Define isolation levels in order of increasing strictness.', back: '1. Read Uncommitted (dirty reads) \n2. Read Committed \n3. Repeatable Read \n4. Serializable (highest isolation, lowest concurrency).' }
      ],
      mockTest: [
        {
          id: 'dbms-mt-1',
          question: 'Which transaction anomaly occurs when a transaction reads data that has been modified by another concurrent transaction but not yet committed?',
          options: ['Dirty Read', 'Non-repeatable Read', 'Phantom Read', 'Lost Update'],
          correctIndex: 0
        },
        {
          id: 'dbms-mt-2',
          question: 'What type of lock prevents any other transaction from reading or writing a data item until the lock is released?',
          options: ['Shared Lock (S)', 'Exclusive Lock (X)', 'Intent Lock (I)', 'Optimistic Lock'],
          correctIndex: 1
        },
        {
          id: 'dbms-mt-3',
          question: 'What is the SQL keyword used to remove all rows from a table quickly without logging individual row deletions?',
          options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'],
          correctIndex: 2
        }
      ],
      interviews: [
        {
          id: 'dbms-int-1',
          company: 'Microsoft',
          companyLogo: 'M',
          question: 'What is the difference between DELETE and TRUNCATE in SQL?',
          answer: 'DELETE is a DML command that removes rows one-by-one and logs each deletion, allowing rollbacks. It can use a WHERE clause. TRUNCATE is a DDL command that deallocates data pages, removes all rows instantly without logging individual deletions (cannot be rolled back in some contexts), and cannot take a WHERE clause.',
          difficulty: 'Medium'
        },
        {
          id: 'dbms-int-2',
          company: 'Google',
          companyLogo: 'G',
          question: 'How do index scans differ from index seek operations, and which is faster?',
          answer: 'An Index Seek uses the tree structure to navigate directly to the specific records that match the query criteria (O(log n) efficiency). An Index Scan traverses the entire index (leaves or pages) to find matches (O(n) efficiency). Index Seek is substantially faster for specific queries.',
          difficulty: 'Hard'
        }
      ],
      companyPrep: {
        priority: 'High',
        companies: ['Amazon', 'Microsoft', 'Oracle', 'TCS'],
        focusAreas: ['Joins & Subqueries', 'Normalization & Normal Forms', 'ACID Transactions', 'SQL Optimization & Indexing'],
        tips: 'Always write SQL queries clearly. Interviewers frequently ask you to write a query to find the "Nth highest salary" or explain transaction deadlock resolution.'
      }
    },
    {
      id: 'os',
      name: 'Operating Systems',
      icon: '💻',
      color: 'violet',
      topics: [
        {
          id: 'os-1',
          name: 'Process Scheduling Algorithms',
          readTime: '6 mins',
          content: 'CPUs schedule processes to maximize throughput and minimize response times: \n- FCFS: Non-preemptive, suffers from Convoy Effect. \n- SJF: Optimal average waiting time (SRTF is preemptive). \n- Round Robin: Time-slice (quantum) based, fair, but context-switching overhead can be high if quantum is too small.'
        },
        {
          id: 'os-2',
          name: 'Virtual Memory & Paging',
          readTime: '7 mins',
          content: 'Virtual memory isolates process address spaces. The physical memory is divided into Frames, and virtual memory into Pages. \n- Page Table: Maps page numbers to frame numbers. \n- TLB (Translation Lookaside Buffer): Cache for page table lookups. \n- Page Fault: Occurs when a page requested is not in RAM, causing disk swap-in.'
        },
        {
          id: 'os-3',
          name: 'Deadlock Conditions & Banker\'s Algorithm',
          readTime: '7 mins',
          content: 'Deadlock occurs when processes are unable to proceed because each holds a resource needed by another. \nFour Coffman Conditions: \n1. Mutual Exclusion \n2. Hold and Wait \n3. No Preemption \n4. Circular Wait. \nBanker\'s Algorithm is used for deadlock avoidance by verifying if allocating resources keeps the system in a "Safe State".'
        }
      ],
      mcqs: [
        {
          id: 'os-mcq-1',
          question: 'Which page replacement policy suffers from Belady\'s Anomaly (where increasing page frames increases page faults)?',
          options: ['LRU (Least Recently Used)', 'Optimal Page Replacement', 'FIFO (First In First Out)', 'LFU (Least Frequently Used)'],
          correctIndex: 2,
          explanation: 'FIFO page replacement suffers from Belady\'s anomaly, where allocating more physical page frames can paradoxically cause more page faults for certain reference strings.'
        }
      ],
      flashcards: [
        { id: 'os-fc-1', front: 'What is Context Switching?', back: 'The procedure of saving the state of the active process (CPU registers, Program Counter) and loading the saved state of another process to resume execution.' },
        { id: 'os-fc-2', front: 'Define a Mutex vs a Semaphore.', back: 'A Mutex is a locking mechanism (binary: locked/unlocked) owned by a single thread. A Semaphore is a signaling mechanism using an integer counter to control access to resource pools.' }
      ],
      mockTest: [
        {
          id: 'os-mt-1',
          question: 'What is a thread share with other threads of the same process?',
          options: ['Registers', 'Stack', 'Code, Data, and OS resources', 'Program Counter'],
          correctIndex: 2
        },
        {
          id: 'os-mt-2',
          question: 'Which CPU scheduling algorithm is optimal in terms of minimizing average waiting time?',
          options: ['Round Robin', 'Shortest Job First (SJF)', 'Priority Scheduling', 'FCFS'],
          correctIndex: 1
        },
        {
          id: 'os-mt-3',
          question: 'What is thrashing?',
          options: ['High CPU utilization', 'High page fault rate causing the system to spend more time swapping than executing', 'Low memory leak cleanup', 'Sudden process termination due to signal'],
          correctIndex: 1
        }
      ],
      interviews: [
        {
          id: 'os-int-1',
          company: 'Google',
          companyLogo: 'G',
          question: 'What is the difference between a process and a thread?',
          answer: 'A process is an independent execution unit with its own virtual address space, file handles, and security context (heavyweight). A thread is the smallest unit of execution within a process; threads share the process memory space (code, data, heap) but maintain their own stacks, registers, and program counters (lightweight).',
          difficulty: 'Easy'
        }
      ],
      companyPrep: {
        priority: 'High',
        companies: ['Google', 'Microsoft', 'NVIDIA', 'Intel'],
        focusAreas: ['Multithreading & Concurrency', 'Semaphores & Mutexes', 'Virtual Memory & Paging', 'CPU Scheduling'],
        tips: 'Expect questions on process synchronization. Be ready to write code for a producer-consumer problem using semaphores.'
      }
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      icon: '🌐',
      color: 'orange',
      topics: [
        {
          id: 'cn-1',
          name: 'OSI Model vs TCP/IP Suite',
          readTime: '6 mins',
          content: 'The OSI Model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. \nThe TCP/IP Model combines layers into 4 or 5: Network Access, Internet, Transport, Application. \n- Data Link: Mac addresses, framing. \n- Network: IP addresses, routing. \n- Transport: End-to-end ports, reliability.'
        },
        {
          id: 'cn-2',
          name: 'TCP vs UDP Protocols',
          readTime: '6 mins',
          content: '- TCP (Transmission Control Protocol): Connection-oriented, reliable (acknowledgments), flow control (sliding window), congestion control. Uses 3-Way Handshake (SYN, SYN-ACK, ACK). \n- UDP (User Datagram Protocol): Connectionless, unreliable (best effort), minimal overhead, fast, used in DNS, streaming, VoIP.'
        }
      ],
      mcqs: [
        {
          id: 'cn-mcq-1',
          question: 'Which port number is standard for HTTPS traffic?',
          options: ['80', '443', '21', '8080'],
          correctIndex: 1,
          explanation: 'Port 80 is used for HTTP (insecure) traffic, while Port 443 is the standard port for secure HTTPS traffic.'
        }
      ],
      flashcards: [
        { id: 'cn-fc-1', front: 'What is ARP (Address Resolution Protocol)?', back: 'ARP maps a known dynamic IPv4 address to its corresponding physical MAC hardware address on a local area network.' }
      ],
      mockTest: [
        {
          id: 'cn-mt-1',
          question: 'Which layer of the OSI model is responsible for routing packets across networks?',
          options: ['Transport Layer', 'Network Layer', 'Data Link Layer', 'Physical Layer'],
          correctIndex: 1
        },
        {
          id: 'cn-mt-2',
          question: 'What is the purpose of the 3-Way Handshake in TCP?',
          options: ['Encrypt transmission keys', 'Establish a reliable connection and sync sequence numbers', 'Validate MAC address routes', 'Authenticate user login'],
          correctIndex: 1
        },
        {
          id: 'cn-mt-3',
          question: 'DNS resolves a hostname into what identifier?',
          options: ['MAC Address', 'Port Number', 'IP Address', 'URL Path'],
          correctIndex: 2
        }
      ],
      interviews: [
        {
          id: 'cn-int-1',
          company: 'Amazon',
          companyLogo: 'A',
          question: 'What happens when you type "www.google.com" in a browser and hit enter?',
          answer: '1. Browser checks cache for IP. 2. DNS lookup (recursive queries) retrieves the IP address. 3. TCP connection is established (3-way handshake) on port 443. 4. TLS handshake secures the session. 5. Browser sends an HTTP GET request. 6. Google servers respond with HTML/CSS/JS. 7. Browser renders the page.',
          difficulty: 'Hard'
        }
      ],
      companyPrep: {
        priority: 'Medium',
        companies: ['Cisco', 'Amazon', 'Cloudflare', 'JPMorgan'],
        focusAreas: ['TCP Handshake & Congestion Control', 'IP Addressing & Subnetting', 'DNS & HTTP/HTTPS Protocols', 'Websockets vs HTTP'],
        tips: 'Understand the difference between IPv4 and IPv6, and how NAT (Network Address Translation) preserves public IP allocations.'
      }
    },
    {
      id: 'oop',
      name: 'OOP',
      icon: '🧩',
      color: 'green',
      topics: [
        {
          id: 'oop-1',
          name: 'The Four Pillars of OOP',
          readTime: '6 mins',
          content: 'Object-Oriented Programming relies on four principles: \n1. Encapsulation: Restricting direct access to data; bundling code and data (private variables, public getters/setters). \n2. Abstraction: Hiding implementation details and exposing a clean interface (abstract classes, interfaces). \n3. Inheritance: Reusing code from base classes to derived classes. \n4. Polymorphism: "Many forms". Method Overloading (compile-time) and Method Overriding (runtime).'
        }
      ],
      mcqs: [
        {
          id: 'oop-mcq-1',
          question: 'Which OOP feature allows a subclass to define a specific implementation of a method that is already provided by its parent class?',
          options: ['Method Overloading', 'Method Overriding', 'Encapsulation', 'Abstraction'],
          correctIndex: 1,
          explanation: 'Method Overriding allows a subclass to provide a specific implementation of a method that has been declared in its superclass, resolved dynamically at runtime.'
        }
      ],
      flashcards: [
        { id: 'oop-fc-1', front: 'Define Polymorphism.', back: 'The ability of a single interface or reference to refer to objects of different classes and execute the correct behavior dynamically (Runtime Polymorphism).' }
      ],
      mockTest: [
        {
          id: 'oop-mt-1',
          question: 'Which SOLID principle states that classes should be open for extension but closed for modification?',
          options: ['Single Responsibility', 'Open-Closed Principle', 'Liskov Substitution', 'Interface Segregation'],
          correctIndex: 1
        },
        {
          id: 'oop-mt-2',
          question: 'What is the purpose of an abstract class?',
          options: ['To define a concrete object instantly', 'To serve as a blueprint/template that must be inherited by subclasses', 'To disable variable definitions', 'To hide code from compilation'],
          correctIndex: 1
        },
        {
          id: 'oop-mt-3',
          question: 'Can you override static methods in Java?',
          options: ['Yes, fully', 'No, they are bound to the class rather than instance and are shadowed, not overridden', 'Yes, only if they are private', 'Only using interfaces'],
          correctIndex: 1
        }
      ],
      interviews: [
        {
          id: 'oop-int-1',
          company: 'Adobe',
          companyLogo: 'A',
          question: 'What is the difference between an Interface and an Abstract Class?',
          answer: 'An Interface represents a contract ("can-do") and supports multiple inheritance; in modern languages, interfaces contain abstract declarations (and default methods in Java). An Abstract Class represents an identity relationship ("is-a") and cannot be instantiated, but can contain state (instance variables) and constructors, which interfaces cannot.',
          difficulty: 'Medium'
        }
      ],
      companyPrep: {
        priority: 'High',
        companies: ['Adobe', 'Goldman Sachs', 'Intuit', 'TCS'],
        focusAreas: ['SOLID Principles', 'Design Patterns (Singleton, Factory, Observer)', 'Virtual Functions & VTables', 'Abstract vs Interfaces'],
        tips: 'Be prepared to design a parking lot or a movie booking system in interviews using OOP principles and diagrams.'
      }
    },
    {
      id: 'dsa-tech',
      name: 'DSA',
      icon: '🧠',
      color: 'blue',
      topics: [
        {
          id: 'dsa-1',
          name: 'Asymptotic Complexity Analysis',
          readTime: '5 mins',
          content: 'Big-O notation describes the limiting behavior of an algorithm: \n- O(1): Constant time (hash table lookup). \n- O(log n): Logarithmic (binary search). \n- O(n): Linear (array traversal). \n- O(n log n): Efficient sorting (Merge Sort, Quick Sort average). \n- O(n^2): Quadratic (nested loops, bubble sort).'
        }
      ],
      mcqs: [
        {
          id: 'dsa-mcq-1',
          question: 'What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (AVL tree)?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctIndex: 1,
          explanation: 'In a balanced BST, search operations require traversal from root to leaf, which is proportional to the tree height. Since the tree is balanced, the height is O(log n).'
        }
      ],
      flashcards: [
        { id: 'dsa-fc-1', front: 'What is dynamic programming?', back: 'An algorithmic technique that solves complex problems by breaking them down into simpler subproblems, storing their results in a table (memoization/tabulation) to avoid redundant calculations.' }
      ],
      mockTest: [
        {
          id: 'dsa-mt-1',
          question: 'Which data structure works on the LIFO (Last In First Out) principle?',
          options: ['Queue', 'Stack', 'Heap', 'Graph'],
          correctIndex: 1
        },
        {
          id: 'dsa-mt-2',
          question: 'Which sorting algorithm has a guaranteed worst-case time complexity of O(n log n)?',
          options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Insertion Sort'],
          correctIndex: 1
        },
        {
          id: 'dsa-mt-3',
          question: 'Which traversal prints a Binary Search Tree (BST) in ascending sorted order?',
          options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'],
          correctIndex: 2
        }
      ],
      interviews: [
        {
          id: 'dsa-int-1',
          company: 'Google',
          companyLogo: 'G',
          question: 'How do you detect a cycle in a directed graph?',
          answer: 'Cycles can be detected using Depth First Search (DFS). Maintain a recursion stack array alongside the visited array. If a node is visited that is already in the current recursion stack, a cycle exists. Alternatively, for directed graphs, use Kahn\'s Algorithm (BFS topological sort); if the sorted array size is less than V, a cycle is present.',
          difficulty: 'Hard'
        }
      ],
      companyPrep: {
        priority: 'High',
        companies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
        focusAreas: ['Graphs & Traversals (BFS/DFS)', 'Dynamic Programming (Knapsack, LCS)', 'Trees & BSTs', 'Hash Tables'],
        tips: 'Master the common patterns: Sliding Window, Two Pointers, DFS/BFS, and Recursion. Start coding by explaining the brute-force approach first.'
      }
    }
  ],
  me: [
    {
      id: 'thermo',
      name: 'Thermodynamics',
      icon: '🔥',
      color: 'orange',
      topics: [
        {
          id: 'me-th-1',
          name: 'Laws of Thermodynamics',
          readTime: '6 mins',
          content: '- Zeroth Law: Defines temperature and thermal equilibrium. \n- First Law: Energy is conserved (dQ = dU + dW). For open systems, uses Steady Flow Energy Equation (SFEE). \n- Second Law: Heat cannot flow spontaneously from cold to hot bodies (Clausius) and no engine can convert all heat into work (Kelvin-Planck). Introduces Entropy.'
        },
        {
          id: 'me-th-2',
          name: 'Power Cycles',
          readTime: '8 mins',
          content: '- Carnot Cycle: Reversible ideal cycle, highest possible efficiency. Uses 4 processes: 2 isothermal, 2 adiabatic. \n- Rankine Cycle: Vapor power cycle, basis for steam power plants. \n- Otto Cycle: Constant-volume heat addition (petrol engines). \n- Diesel Cycle: Constant-pressure heat addition (diesel engines).'
        }
      ],
      mcqs: [
        {
          id: 'me-th-mcq-1',
          question: 'Which thermodynamic cycle consists of two constant-volume (isochoric) and two isentropic processes?',
          options: ['Carnot Cycle', 'Otto Cycle', 'Diesel Cycle', 'Rankine Cycle'],
          correctIndex: 1,
          explanation: 'The Otto cycle consists of: 1. Isentropic compression, 2. Constant-volume heat addition, 3. Isentropic expansion, and 4. Constant-volume heat rejection.'
        }
      ],
      flashcards: [
        { id: 'me-th-fc-1', front: 'What is Clausius Inequality?', back: 'Integral of dQ / T <= 0. Equal to 0 for a reversible cycle, and less than 0 for an irreversible cycle.' }
      ],
      mockTest: [
        {
          id: 'me-th-mt-1',
          question: 'What is the efficiency of a Carnot engine operating between temperatures of 800 K and 400 K?',
          options: ['25%', '50%', '75%', '100%'],
          correctIndex: 1
        },
        {
          id: 'me-th-mt-2',
          question: 'Which property remains constant during an isentropic process?',
          options: ['Temperature', 'Pressure', 'Volume', 'Entropy'],
          correctIndex: 3
        },
        {
          id: 'me-th-mt-3',
          question: 'What is the thermodynamic status of a substance at its triple point?',
          options: ['Solid and Liquid coexist', 'Liquid and Vapor coexist', 'Solid, Liquid, and Vapor coexist in equilibrium', 'Supercritical gas'],
          correctIndex: 2
        }
      ],
      interviews: [
        {
          id: 'me-th-int-1',
          company: 'Tata Motors',
          companyLogo: 'T',
          question: 'Why is a Diesel engine more efficient than a Petrol engine?',
          answer: 'Diesel engines operate at higher compression ratios (typically 15:1 to 22:1) compared to Petrol engines (8:1 to 12:1). Higher compression ratios lead to higher air temperatures during combustion, translating to superior thermal efficiency according to thermodynamics principles. Additionally, there are no throttling losses at intake in diesel engines.',
          difficulty: 'Medium'
        }
      ],
      companyPrep: {
        priority: 'High',
        companies: ['Tata Motors', 'Maruti Suzuki', 'GE Vernova', 'BHEL'],
        focusAreas: ['Otto, Diesel, & Dual Cycles', 'Entropy & Exergy', 'Steam Tables & Rankine cycle', 'SFEE Applications'],
        tips: 'Draw P-V and T-S diagrams clearly when explaining cycles. Know the values of specific heats (Cp, Cv) for air.'
      }
    },
    {
      id: 'som',
      name: 'Strength of Materials (SOM)',
      icon: '🧱',
      color: 'blue',
      topics: [
        {
          id: 'me-som-1',
          name: 'Stress-Strain Diagrams & Hooke\'s Law',
          readTime: '6 mins',
          content: 'Hooke\'s Law states that stress (sigma) is directly proportional to strain (epsilon) within the elastic limit: sigma = E * epsilon, where E is Young\'s Modulus. \n- Yield point: Transition from elastic to plastic deformation. \n- Ultimate Tensile Strength: Maximum stress a material can withstand. \n- Fracture point: Material breaks.'
        },
        {
          id: 'me-som-2',
          name: 'Bending & Torsion',
          readTime: '7 mins',
          content: '- Pure Bending Formula: M/I = sigma/y = E/R, where M is bending moment, I is Area Moment of Inertia, sigma is bending stress, y is distance from neutral axis. \n- Torsion Formula: T/J = tau/r = G*theta/L, where T is torque, J is polar moment of inertia, tau is shear stress, G is shear modulus, theta is angle of twist.'
        }
      ],
      mcqs: [
        {
          id: 'me-som-mcq-1',
          question: 'What is the relation between Young\'s Modulus (E), Shear Modulus (G), and Poisson\'s ratio (v)?',
          options: ['E = 2G(1 - v)', 'E = 2G(1 + v)', 'E = 3G(1 + v)', 'E = G(1 + 2v)'],
          correctIndex: 1,
          explanation: 'Young\'s Modulus and Shear Modulus are related by the elasticity formula: E = 2G(1 + v), where v is Poisson\'s ratio.'
        }
      ],
      flashcards: [
        { id: 'me-som-fc-1', front: 'What is the Polar Moment of Inertia (J) for a solid shaft of diameter D?', back: 'J = (pi * D^4) / 32' }
      ],
      mockTest: [
        {
          id: 'me-som-mt-1',
          question: 'For a cantilever beam loaded with a point load W at the free end, what is the maximum bending moment?',
          options: ['WL', 'WL/2', 'WL/4', 'Zero'],
          correctIndex: 0
        },
        {
          id: 'me-som-mt-2',
          question: 'What is Euler\'s buckling load for a column with both ends hinged?',
          options: ['pi^2 * EI / L^2', '4 * pi^2 * EI / L^2', '2 * pi^2 * EI / L^2', 'pi^2 * EI / (4L^2)'],
          correctIndex: 0
        },
        {
          id: 'me-som-mt-3',
          question: 'What is Poisson\'s ratio for a perfectly incompressible material?',
          options: ['0.0', '0.25', '0.50', '1.0'],
          correctIndex: 2
        }
      ],
      interviews: [
        {
          id: 'me-som-int-1',
          company: 'L&T',
          companyLogo: 'L',
          question: 'What is the difference between stress concentration and fatigue failure?',
          answer: 'Stress concentration occurs due to sudden changes in cross-sectional geometry (holes, notches, sharp corners) causing high local stresses. Fatigue failure is structural damage that occurs when a material is subjected to cyclic or fluctuating loads, leading to progressive cracking even when maximum stress remains below the yield limit.',
          difficulty: 'Medium'
        }
      ],
      companyPrep: {
        priority: 'High',
        companies: ['L&T Heavy Engineering', 'Mahindra', 'DRDO', 'BHEL'],
        focusAreas: ['Shear Force & Bending Moment Diagrams (SFD/BMD)', 'Principal Stresses & Mohr Circle', 'Bending & Torsion theories', 'Slenderness Ratio & Column Buckling'],
        tips: 'Practice drawing SFD and BMD for standard beam configurations (simply supported and cantilever).'
      }
    },
    {
      id: 'mfg',
      name: 'Manufacturing',
      icon: '⚙️',
      color: 'violet',
      topics: [
        {
          id: 'me-mfg-1',
          name: 'Casting & Welding Processes',
          readTime: '6 mins',
          content: '- Casting: Pouring liquid metal into a mold cavity. Key defects include gas porosity, shrinkage, hot tears, and blowholes. \n- Welding: Fusing metals. Types: TIG (Tungsten Inert Gas - uses non-consumable electrode), MIG (Metal Inert Gas - uses consumable wire), Resistance welding (spot, seam).'
        },
        {
          id: 'me-mfg-2',
          name: 'Metal Cutting & Machinability',
          readTime: '6 mins',
          content: 'Taylor\'s Tool Life Equation relates cutting speed (V) and tool life (T): \n V * T^n = C \n where n is the tool exponent (dependent on tool material) and C is a constant. Orthogonal cutting vs oblique cutting.'
        }
      ],
      mcqs: [
        {
          id: 'me-mfg-mcq-1',
          question: 'In which welding process is a non-consumable tungsten electrode used alongside an inert shielding gas?',
          options: ['MIG Welding', 'TIG Welding', 'Submerged Arc Welding', 'SMAW (Stick)'],
          correctIndex: 1,
          explanation: 'TIG (Tungsten Inert Gas) welding uses a non-consumable tungsten electrode to produce the arc, while MIG welding uses a consumable wire electrode.'
        }
      ],
      flashcards: [
        { id: 'me-mfg-fc-1', front: 'State Taylor\'s Tool Life Equation.', back: 'V * T^n = C, where V = cutting speed, T = tool life, n = exponent, C = constant.' }
      ],
      mockTest: [
        {
          id: 'me-mfg-mt-1',
          question: 'What casting defect is caused by the entrapment of gas in the mold?',
          options: ['Shrinkage Cavity', 'Blowholes', 'Hot Tears', 'Cold Shut'],
          correctIndex: 1
        },
        {
          id: 'me-mfg-mt-2',
          question: 'In G-code programming, what does G00 represent?',
          options: ['Linear interpolation (feed rate)', 'Rapid linear positioning', 'Circular interpolation clockwise', 'Dwell'],
          correctIndex: 1
        },
        {
          id: 'me-mfg-mt-3',
          question: 'Which of the following is a non-destructive testing (NDT) method?',
          options: ['Tensile Test', 'Charpy Impact Test', 'Ultrasonic Testing', 'Brinell Hardness Test'],
          correctIndex: 2
        }
      ],
      interviews: [
        {
          id: 'me-mfg-int-1',
          company: 'L&T',
          companyLogo: 'L',
          question: 'What is the role of a riser in sand casting?',
          answer: 'A riser is an extra reservoir of molten metal built into the mold. It supplies liquid metal to the casting cavity as it shrinks during solidification, preventing shrinkage cavities and voids in the final cast component.',
          difficulty: 'Easy'
        }
      ],
      companyPrep: {
        priority: 'Medium',
        companies: ['Maruti Suzuki', 'L&T', 'Godrej', 'Tata Steel'],
        focusAreas: ['Casting Design & Gating Systems', 'Welding Metallurgical Changes', 'Merchant\'s Circle of Forces', 'CNC & G-code / M-code'],
        tips: 'Learn the differences between G-codes (geometric operations) and M-codes (machine operations like coolant/spindle controls).'
      }
    },
    {
      id: 'fluid',
      name: 'Fluid Mechanics',
      icon: '🌊',
      color: 'green',
      topics: [
        {
          id: 'me-fm-1',
          name: 'Viscosity & Bernoulli\'s Equation',
          readTime: '6 mins',
          content: '- Newton\'s Law of Viscosity: Shear stress is proportional to velocity gradient (tau = mu * du/dy). \n- Bernoulli\'s Equation (along a streamline for steady, incompressible, frictionless flow): \n P/rho*g + v^2/2g + z = Constant \n (Pressure head + Velocity head + Datum head = constant).'
        }
      ],
      mcqs: [
        {
          id: 'me-fm-mcq-1',
          question: 'For a laminar flow of fluid in a circular pipe, how does the friction factor relate to the Reynolds number (Re)?',
          options: ['f = 16/Re', 'f = 64/Re', 'f = 0.316/Re^0.25', 'f = 0.079/Re^0.25'],
          correctIndex: 1,
          explanation: 'In laminar pipe flow, the Darcy friction factor f is given by 64 / Re. (If using Fanning friction factor, it is 16/Re).'
        }
      ],
      flashcards: [
        { id: 'me-fm-fc-1', front: 'State Bernoulli\'s Equation.', back: 'P/(rho*g) + v^2/(2g) + z = Constant (represents conservation of mechanical energy for frictionless, incompressible fluid flow).' }
      ],
      mockTest: [
        {
          id: 'me-fm-mt-1',
          question: 'Which device is used to measure the rate of flow of fluid through a pipe?',
          options: ['Pitot Tube', 'Venturimeter', 'Manometer', 'Anemometer'],
          correctIndex: 1
        },
        {
          id: 'me-fm-mt-2',
          question: 'What is a fluid whose viscosity decreases as the rate of shear strain increases called?',
          options: ['Dilatant', 'Pseudoplastic (Shear Thinning)', 'Bingham Plastic', 'Newtonian'],
          correctIndex: 1
        },
        {
          id: 'me-fm-mt-3',
          question: 'Which turbine is an impulse turbine used for high heads and low discharge rates?',
          options: ['Kaplan Turbine', 'Francis Turbine', 'Pelton Wheel', 'Propeller Turbine'],
          correctIndex: 2
        }
      ],
      interviews: [
        {
          id: 'me-fm-int-1',
          company: 'BHEL',
          companyLogo: 'B',
          question: 'What is cavitation in centrifugal pumps, and how can it be avoided?',
          answer: 'Cavitation occurs when local pressure inside the pump falls below the vapor pressure of the liquid, causing bubbles to form. As bubbles move to higher pressure zones, they collapse violently, eroding the impeller. It is avoided by ensuring that the Net Positive Suction Head Available (NPSHa) is greater than the Net Positive Suction Head Required (NPSHr), keeping suction lift low.',
          difficulty: 'Hard'
        }
      ],
      companyPrep: {
        priority: 'High',
        companies: ['BHEL', 'IOCL', 'ONGC', 'Schlumberger'],
        focusAreas: ['Bernoulli & Venturi applications', 'Boundary Layer Theory', 'Laminar vs Turbulent Pipe Flow', 'Impulse vs Reaction Turbines'],
        tips: 'Understand the concept of boundary layer separation and how streamlining reduces pressure drag.'
      }
    }
  ],
  ee: [
    {
      id: 'machines',
      name: 'Machines',
      icon: '⚡',
      color: 'blue',
      topics: [
        {
          id: 'ee-m-1',
          name: 'DC Generators & Motors',
          readTime: '6 mins',
          content: 'DC machines convert mechanical to electrical energy (generator) or vice-versa (motor). \n- Induced EMF: E = (Phi * Z * N * P) / (60 * A). \n- Speed Control of DC Shunt Motors: Speed can be controlled by varying armature voltage (below base speed) or varying field flux (above base speed).'
        },
        {
          id: 'ee-m-2',
          name: 'Transformers & Induction Motors',
          readTime: '7 mins',
          content: '- Transformers: Step up or down AC voltage without changing frequency. Key losses: core loss (hysteresis + eddy current) and copper loss. \n- Induction Motors: "The workhorse of industry". Operates on electromagnetic induction. Key formula: s = (Ns - Nr)/Ns. Rotor speed is always less than synchronous speed.'
        }
      ],
      mcqs: [
        {
          id: 'ee-m-mcq-1',
          question: 'What is the frequency of the rotor current in an induction motor operating with a slip "s" and supply frequency "f"?',
          options: ['f', 's * f', 'f / s', '(1 - s) * f'],
          correctIndex: 1,
          explanation: 'The frequency of the rotor EMF/current is proportional to the slip speed. Rotor frequency fr = s * f, where s is the slip and f is the stator supply frequency.'
        }
      ],
      flashcards: [
        { id: 'ee-m-fc-1', front: 'What is the condition for maximum efficiency in a transformer?', back: 'Variable copper loss equals constant core loss (Pi = Pc).' }
      ],
      mockTest: [
        {
          id: 'ee-m-mt-1',
          question: 'Which test is conducted on a transformer to determine its core losses?',
          options: ['Short Circuit Test', 'Open Circuit Test', 'Sumpner Test', 'Load Test'],
          correctIndex: 1
        },
        {
          id: 'ee-m-mt-2',
          question: 'What type of winding is preferred in a DC machine for high-voltage, low-current application?',
          options: ['Lap Winding', 'Wave Winding', 'Duplex Lap Winding', 'Concentrated Winding'],
          correctIndex: 1
        },
        {
          id: 'ee-m-mt-3',
          question: 'What is the synchronous speed of a 4-pole induction motor connected to a 50Hz supply?',
          options: ['1000 RPM', '1500 RPM', '3000 RPM', '1200 RPM'],
          correctIndex: 1
        }
      ],
      interviews: [
        {
          id: 'ee-m-int-1',
          company: 'Siemens',
          companyLogo: 'S',
          question: 'Why can a transformer not operate on a DC supply?',
          answer: 'Transformer operation is based on Faraday\'s Law of Electromagnetic Induction, which requires a rate of change of magnetic flux (dPhi/dt). Since a DC supply produces a constant current, it creates a static magnetic field (dPhi/dt = 0). Thus, no EMF is induced in the secondary winding, and the primary winding will draw a very high current, potentially burning the winding due to its low resistance.',
          difficulty: 'Easy'
        }
      ],
      companyPrep: {
        priority: 'High',
        companies: ['Siemens', 'ABB', 'Power Grid', 'GE Electrical'],
        focusAreas: ['Transformer OC/SC Tests', 'Induction Motor Torque-Slip curve', 'DC Motor Speed Control methods', 'Synchronous Condensers'],
        tips: 'Be ready to explain how rotating magnetic fields are created in three-phase stator windings.'
      }
    },
    {
      id: 'power',
      name: 'Power Systems',
      icon: '🔌',
      color: 'orange',
      topics: [
        {
          id: 'ee-ps-1',
          name: 'Transmission Line Modeling',
          readTime: '6 mins',
          content: 'Transmission lines are classified by length: \n- Short (< 80 km): Capacitance is neglected. \n- Medium (80-250 km): Capacitance is lumped (Nominal-T or Nominal-Pi models). \n- Long (> 250 km): Distributed parameters. Ferranti Effect: Receiving-end voltage exceeds sending-end voltage under no-load or light-load conditions due to line capacitance.'
        },
        {
          id: 'ee-ps-2',
          name: 'Faults & Load Flow',
          readTime: '7 mins',
          content: '- Faults: Symmetrical (3-phase short) vs Unsymmetrical (Line-to-Ground, Line-to-Line, Double Line-to-Ground). \n- Load Flow: Algorithms to calculate voltage magnitudes and phase angles at buses. Gauss-Seidel (easy to program, slow convergence) vs Newton-Raphson (fast quadratic convergence, requires Jacobian matrix).'
        }
      ],
      mcqs: [
        {
          id: 'ee-ps-mcq-1',
          question: 'What is the Ferranti effect on long transmission lines?',
          options: [
            'Receiving-end voltage is lower than sending-end voltage under heavy load',
            'Receiving-end voltage is higher than sending-end voltage under no-load or light load',
            'Corona discharge causing power loss',
            'System frequency drop due to load spikes'
          ],
          correctIndex: 1,
          explanation: 'The Ferranti effect is the phenomenon where the receiving-end voltage of a transmission line is higher than the sending-end voltage when operating under no-load or very light load conditions.'
        }
      ],
      flashcards: [
        { id: 'ee-ps-fc-1', front: 'What is a Slack Bus in load flow studies?', back: 'A reference bus whose voltage magnitude |V| and phase angle (delta) are specified (usually delta = 0). It absorbs or injects active/reactive power to balance line losses.' }
      ],
      mockTest: [
        {
          id: 'ee-ps-mt-1',
          question: 'Which type of fault is most frequently occurring in overhead transmission lines?',
          options: ['Symmetrical Three-Phase Fault', 'Line-to-Ground Fault (L-G)', 'Line-to-Line Fault (L-L)', 'Double Line-to-Ground Fault (2L-G)'],
          correctIndex: 1
        },
        {
          id: 'ee-ps-mt-2',
          question: 'What does the Jacobian matrix contain in the Newton-Raphson load flow method?',
          options: ['Line impedances', 'Partial derivatives of real and reactive power with respect to voltage magnitude and angle', 'Bus admittance values', 'Fault current components'],
          correctIndex: 1
        },
        {
          id: 'ee-ps-mt-3',
          question: 'Why are bundle conductors used in high voltage transmission lines?',
          options: ['Reduce corona loss and line inductance', 'Increase line resistance', 'Increase voltage rating', 'Decrease capacitance'],
          correctIndex: 0
        }
      ],
      interviews: [
        {
          id: 'ee-ps-int-1',
          company: 'Power Grid',
          companyLogo: 'P',
          question: 'What is the Corona effect and how does it affect transmission lines?',
          answer: 'Corona is the ionization of air surrounding power conductors when the electric field gradient exceeds the breakdown strength of air (approx 30 kV/cm). It is characterized by a violet hiss, ozone gas formation, and radio interference. It causes active power loss. It can be reduced by increasing conductor spacing or using bundle/hollow conductors to increase the effective conductor diameter.',
          difficulty: 'Medium'
        }
      ],
      companyPrep: {
        priority: 'High',
        companies: ['Power Grid', 'NTPC', 'Reliance Power', 'Schneider'],
        focusAreas: ['Symmetrical Components & Sequence Networks', 'Newton-Raphson Load Flow', 'Ferranti Effect & Surge Impedance Loading', 'Circuit Breakers & Distance Relays'],
        tips: 'Understand the difference between circuit breakers (can interrupt fault currents) and isolators (operated only under no-load).'
      }
    },
    {
      id: 'control',
      name: 'Control Systems',
      icon: '📈',
      color: 'violet',
      topics: [
        {
          id: 'ee-cs-1',
          name: 'Transfer Functions & Stability',
          readTime: '6 mins',
          content: 'A Transfer Function is the Laplace transform of output divided by input, assuming zero initial conditions. \n- Stability: A system is stable if all poles of the closed-loop transfer function lie in the left half of the s-plane. \n- Routh-Hurwitz Criterion: Algebraic method to check stability without calculating poles directly.'
        }
      ],
      mcqs: [
        {
          id: 'ee-cs-mcq-1',
          question: 'If a pole of the closed-loop system is located at s = +2 (right half of the s-plane), what is the system stability status?',
          options: ['Stable', 'Unstable', 'Marginally Stable', 'Conditionally Stable'],
          correctIndex: 1,
          explanation: 'Poles in the right half of the s-plane yield positive exponential terms (e.g. e^(2t)) in the time response, which grow without bound, causing the system to be unstable.'
        }
      ],
      flashcards: [
        { id: 'ee-cs-fc-1', front: 'What is a PID controller?', back: 'Proportional-Integral-Derivative controller. P reduces rise time, I eliminates steady-state error, and D reduces overshoot and settles the response.' }
      ],
      mockTest: [
        {
          id: 'ee-cs-mt-1',
          question: 'What is the steady-state error of a Type-0 system subjected to a unit step input?',
          options: ['Zero', 'Infinity', '1 / (1 + Kp)', '1 / Kv'],
          correctIndex: 2
        },
        {
          id: 'ee-cs-mt-2',
          question: 'Which method uses open-loop frequency response to determine the stability and relative stability of a closed-loop system?',
          options: ['Routh-Hurwitz', 'Nyquist Stability Criterion', 'Root Locus', 'State Space'],
          correctIndex: 1
        },
        {
          id: 'ee-cs-mt-3',
          question: 'What does a damping ratio (zeta) equal to 0 represent?',
          options: ['Critically damped system', 'Overdamped system', 'Undamped system', 'Underdamped system'],
          correctIndex: 2
        }
      ],
      interviews: [
        {
          id: 'ee-cs-int-1',
          company: 'Siemens',
          companyLogo: 'S',
          question: 'What is the Gain Margin and Phase Margin, and what do they indicate?',
          answer: 'Gain Margin (GM) is the factor by which the system gain can be increased before the system becomes unstable. Phase Margin (PM) is the additional phase lag that can be introduced before instability. Both are measures of relative stability; a system is stable if both GM and PM are positive (when measured in dB and degrees respectively).',
          difficulty: 'Medium'
        }
      ],
      companyPrep: {
        priority: 'Medium',
        companies: ['Siemens', 'Tesla', 'Honeywell', 'Rockwell Automation'],
        focusAreas: ['Root Locus Construction rules', 'Bode Plots & Nyquist Plots', 'PID Controller effects', 'State Transition Matrix'],
        tips: 'Learn how to construct Bode plots and read Gain Crossover and Phase Crossover frequencies quickly.'
      }
    }
  ]
};

export const TechnicalCoreView: React.FC<TechnicalCoreViewProps> = ({ studentProfile, onUpdateProfile }) => {
  // Determine active branch
  const branchName = studentProfile.branch.toLowerCase();
  let branchKey: 'cse' | 'me' | 'ee' = 'cse';
  let displayName = 'Software Engineering (CSE)';

  if (branchName.includes('mechanical') || branchName.includes('me')) {
    branchKey = 'me';
    displayName = 'Mechanical Engineering (ME)';
  } else if (branchName.includes('electrical') || branchName.includes('ee')) {
    branchKey = 'ee';
    displayName = 'Electrical Engineering (EE)';
  }

  const subjects = BRANCH_DATA[branchKey];

  // Subject and Prep Mode states
  const [selectedSubIndex, setSelectedSubIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'theory' | 'mcq' | 'revision' | 'mock' | 'interview' | 'company'>('theory');

  // Reset selected subject when branch changes
  useEffect(() => {
    setSelectedSubIndex(0);
    setActiveTab('theory');
    // Clean mock test state when changing subjects
    setTestActive(false);
    setTestSubmitted(false);
    setTestAnswers({});
    setTestTimer(180);
    setTestScore(null);
  }, [branchKey]);

  const activeSubject = subjects[selectedSubIndex] || subjects[0];

  // ==================== STATE MANAGEMENT ====================
  // MCQ state
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [mcqSubmitted, setMcqSubmitted] = useState<Record<string, boolean>>({});

  // Flashcards state
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Interview QA answers visibility state
  const [expandedInterviewQs, setExpandedInterviewQs] = useState<Record<string, boolean>>({});

  // Theory read checklist
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`tech_completed_topics_${studentProfile.roll}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Mock test state
  const [testActive, setTestActive] = useState<boolean>(false);
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [testTimer, setTestTimer] = useState<number>(180);
  const [testScore, setTestScore] = useState<number | null>(null);

  // Timer effect for Mock Test
  useEffect(() => {
    let interval: any;
    if (testActive && !testSubmitted && testTimer > 0) {
      interval = setInterval(() => {
        setTestTimer((t) => {
          if (t <= 1) {
            handleMockTestSubmit(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testActive, testSubmitted, testTimer]);

  // Clean MCQ/Flashcard state when active subject changes
  useEffect(() => {
    setMcqAnswers({});
    setMcqSubmitted({});
    setFlippedCards({});
    setExpandedInterviewQs({});
    
    // Clean test states
    setTestActive(false);
    setTestSubmitted(false);
    setTestAnswers({});
    setTestTimer(180);
    setTestScore(null);
  }, [activeSubject.id]);

  // Update profile and score values
  const handleToggleTopic = (topicId: string) => {
    const nextCompleted = {
      ...completedTopics,
      [topicId]: !completedTopics[topicId]
    };
    setCompletedTopics(nextCompleted);
    localStorage.setItem(`tech_completed_topics_${studentProfile.roll}`, JSON.stringify(nextCompleted));

    // Recalculate Tech Score and Readiness
    // Base score is 50, every completed topic adds 5% up to a cap of 95%
    const totalCompleted = Object.values(nextCompleted).filter(Boolean).length;
    const addedScore = Math.min(45, totalCompleted * 5);
    const newTechScore = Math.min(100, 50 + addedScore);

    const updated = {
      ...studentProfile,
      subScores: {
        ...studentProfile.subScores,
        tech: newTechScore
      },
      readiness: Math.min(100, Math.round(
        (studentProfile.subScores.apt + studentProfile.subScores.code + newTechScore + studentProfile.subScores.interview + studentProfile.subScores.resume) / 5
      ))
    };
    onUpdateProfile(updated);
  };

  const handleMcqSelectOption = (qId: string, optIdx: number) => {
    if (mcqSubmitted[qId]) return;
    setMcqAnswers({ ...mcqAnswers, [qId]: optIdx });
  };

  const handleMcqSubmit = (qId: string) => {
    if (mcqAnswers[qId] === undefined || mcqSubmitted[qId]) return;
    setMcqSubmitted({ ...mcqSubmitted, [qId]: true });

    // Slight bump to readiness score for answering MCQs
    const isCorrect = mcqAnswers[qId] === activeSubject.mcqs.find((m) => m.id === qId)?.correctIndex;
    if (isCorrect) {
      const updated = {
        ...studentProfile,
        readiness: Math.min(100, studentProfile.readiness + 1)
      };
      onUpdateProfile(updated);
    }
  };

  const toggleFlashcard = (id: string) => {
    setFlippedCards({ ...flippedCards, [id]: !flippedCards[id] });
  };

  const toggleInterviewQ = (id: string) => {
    setExpandedInterviewQs({ ...expandedInterviewQs, [id]: !expandedInterviewQs[id] });
  };

  // Mock Test functions
  const handleStartMockTest = () => {
    setTestAnswers({});
    setTestSubmitted(false);
    setTestScore(null);
    setTestTimer(180);
    setTestActive(true);
  };

  const handleMockTestSelectOption = (qId: string, optIdx: number) => {
    if (testSubmitted) return;
    setTestAnswers({ ...testAnswers, [qId]: optIdx });
  };

  const handleMockTestSubmit = (autoSubmit = false) => {
    if (!testActive || testSubmitted) return;
    setTestSubmitted(true);
    setTestActive(false);

    // Calculate score
    let correctCount = 0;
    activeSubject.mockTest.forEach((q) => {
      if (testAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / activeSubject.mockTest.length) * 100);
    setTestScore(percent);

    // Update readiness and tech subscore
    const techBump = Math.round(correctCount * 3);
    const updated = {
      ...studentProfile,
      subScores: {
        ...studentProfile.subScores,
        tech: Math.min(100, studentProfile.subScores.tech + techBump)
      },
      readiness: Math.min(100, studentProfile.readiness + 2)
    };
    onUpdateProfile(updated);

    if (autoSubmit) {
      alert(`Time expired! Your mock test has been submitted automatically. Score: ${correctCount}/${activeSubject.mockTest.length} (${percent}%)`);
    } else {
      alert(`Mock test submitted successfully! Score: ${correctCount}/${activeSubject.mockTest.length} (${percent}%)`);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="tech-core-prep-view">
      {/* 1. TOP HEADER SECTION */}
      <div className="dashboard-greeting-row" style={{ marginBottom: '24px' }}>
        <div>
          <span className="dashboard-greeting-date">TECHNICAL CORE PREPARATION</span>
          <h1 className="dashboard-greeting-title">
            {displayName} Core Preparation
          </h1>
          <p className="dashboard-greeting-sub">
            Review core branch subjects, practice MCQs, test your knowledge, and study previous interview questions.
          </p>
        </div>
        <div className="tech-score-card">
          <div className="tech-score-circle">
            <span className="score-num">{studentProfile.subScores.tech}%</span>
            <span className="score-label">Tech Score</span>
          </div>
        </div>
      </div>

      {/* 2. SUBJECTS TABS BAR */}
      <div className="tech-subjects-bar">
        {subjects.map((sub, idx) => (
          <button
            key={sub.id}
            className={`subject-tab-btn ${idx === selectedSubIndex ? 'active' : ''}`}
            onClick={() => setSelectedSubIndex(idx)}
          >
            <span className="sub-icon">{sub.icon}</span>
            <span className="sub-name">{sub.name}</span>
          </button>
        ))}
      </div>

      {/* 3. PREPARATION HUB LAYOUT */}
      <div className="tech-hub-layout">
        {/* Left Side: Category Navigator */}
        <div className="tech-sidebar-panel">
          <span className="section-title-label" style={{ paddingLeft: '8px', marginBottom: '8px' }}>
            Prep Mode
          </span>
          <div className="tech-nav-stack">
            <button
              className={`tech-nav-item ${activeTab === 'theory' ? 'active' : ''}`}
              onClick={() => setActiveTab('theory')}
            >
              <span className="icon">📖</span>
              <span>Theory Guides</span>
            </button>
            <button
              className={`tech-nav-item ${activeTab === 'mcq' ? 'active' : ''}`}
              onClick={() => setActiveTab('mcq')}
            >
              <span className="icon">❓</span>
              <span>Topic MCQs</span>
            </button>
            <button
              className={`tech-nav-item ${activeTab === 'revision' ? 'active' : ''}`}
              onClick={() => setActiveTab('revision')}
            >
              <span className="icon">🗂️</span>
              <span>Revision Cards</span>
            </button>
            <button
              className={`tech-nav-item ${activeTab === 'mock' ? 'active' : ''}`}
              onClick={() => setActiveTab('mock')}
            >
              <span className="icon">⏱️</span>
              <span>Mock Tests</span>
            </button>
            <button
              className={`tech-nav-item ${activeTab === 'interview' ? 'active' : ''}`}
              onClick={() => setActiveTab('interview')}
            >
              <span className="icon">💬</span>
              <span>Interview Qs</span>
            </button>
            <button
              className={`tech-nav-item ${activeTab === 'company' ? 'active' : ''}`}
              onClick={() => setActiveTab('company')}
            >
              <span className="icon">🏢</span>
              <span>Company Prep</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tab Specific Content Panel */}
        <div className="tech-content-panel bento-card">
          <div className="content-panel-header">
            <h2 className="panel-title-text">
              {activeSubject.icon} {activeSubject.name} —{' '}
              {activeTab === 'theory'
                ? 'Theory Guides'
                : activeTab === 'mcq'
                ? 'Topic MCQs'
                : activeTab === 'revision'
                ? 'Revision Flashcards'
                : activeTab === 'mock'
                ? 'Mock Tests'
                : activeTab === 'interview'
                ? 'Previous Interview Questions'
                : 'Company-specific Prep'}
            </h2>
          </div>

          <div className="content-panel-body">
            {/* THEORY GUIDE */}
            {activeTab === 'theory' && (
              <div className="theory-guide-tab">
                <div className="theory-list-container">
                  {activeSubject.topics.map((t) => (
                    <div key={t.id} className="theory-topic-card">
                      <div className="theory-topic-header">
                        <div className="topic-meta">
                          <label className="checkbox-container">
                            <input
                              type="checkbox"
                              checked={!!completedTopics[t.id]}
                              onChange={() => handleToggleTopic(t.id)}
                            />
                            <span className="checkmark"></span>
                          </label>
                          <h3 className={`topic-name ${completedTopics[t.id] ? 'completed' : ''}`}>
                            {t.name}
                          </h3>
                        </div>
                        <span className="read-time">{t.readTime}</span>
                      </div>
                      <div className="topic-body-content">
                        {t.content.split('\n').map((para, pIdx) => (
                          <p key={pIdx} style={{ marginBottom: '8px' }}>
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TOPIC MCQS */}
            {activeTab === 'mcq' && (
              <div className="mcq-practice-tab">
                {activeSubject.mcqs.map((q) => {
                  const hasAnswered = mcqSubmitted[q.id];
                  const selectedIdx = mcqAnswers[q.id];

                  return (
                    <div key={q.id} className="mcq-card">
                      <p className="mcq-question-text">{q.question}</p>
                      <div className="mcq-options-stack">
                        {q.options.map((opt, optIdx) => {
                          let optClass = '';
                          if (selectedIdx === optIdx) {
                            optClass = 'selected';
                          }
                          if (hasAnswered) {
                            if (optIdx === q.correctIndex) {
                              optClass = 'correct';
                            } else if (selectedIdx === optIdx) {
                              optClass = 'incorrect';
                            } else {
                              optClass = 'disabled';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              className={`mcq-opt-btn ${optClass}`}
                              onClick={() => handleMcqSelectOption(q.id, optIdx)}
                              disabled={hasAnswered}
                            >
                              <span className="opt-letter">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="opt-text">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {!hasAnswered && (
                        <button
                          className="tpo-btn tpo-btn-primary mcq-submit-btn"
                          disabled={selectedIdx === undefined}
                          onClick={() => handleMcqSubmit(q.id)}
                        >
                          Submit Answer
                        </button>
                      )}

                      {hasAnswered && (
                        <div className="mcq-explanation-box">
                          <span className="explanation-title">
                            {selectedIdx === q.correctIndex
                              ? '🎉 Correct!'
                              : '❌ Incorrect. Correct answer is option ' + String.fromCharCode(65 + q.correctIndex)}
                          </span>
                          <p className="explanation-desc">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* REVISION FLASHCARDS */}
            {activeTab === 'revision' && (
              <div className="revision-flashcards-tab">
                <p className="tab-instructions">
                  Click on any card to flip and view the answer or key formula.
                </p>
                <div className="flashcard-grid">
                  {activeSubject.flashcards.map((fc) => (
                    <div
                      key={fc.id}
                      className={`flashcard-item ${flippedCards[fc.id] ? 'flipped' : ''}`}
                      onClick={() => toggleFlashcard(fc.id)}
                    >
                      <div className="flashcard-inner">
                        <div className="flashcard-front">
                          <span className="fc-hint">QUESTION / KEY CONCEPT</span>
                          <p className="fc-main-text">{fc.front}</p>
                          <span className="fc-flip-prompt">Click to reveal &rarr;</span>
                        </div>
                        <div className="flashcard-back">
                          <span className="fc-hint">EXPLANATION / ANSWER</span>
                          <p className="fc-main-text">{fc.back}</p>
                          <span className="fc-flip-prompt">&larr; Click to flip back</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MOCK TESTS */}
            {activeTab === 'mock' && (
              <div className="mock-test-tab">
                {!testActive && !testSubmitted && (
                  <div className="mock-intro-box">
                    <span className="mock-badge">PRACTICE ASSESSMENTS</span>
                    <h3>Subject Mock Test: {activeSubject.name}</h3>
                    <p>
                      This test contains {activeSubject.mockTest.length} questions. You will have{' '}
                      <strong>3 minutes</strong> to complete the test. Once started, the timer
                      cannot be paused.
                    </p>
                    <button className="tpo-btn tpo-btn-primary" onClick={handleStartMockTest}>
                      Start Mock Test (180s)
                    </button>
                  </div>
                )}

                {testActive && (
                  <div className="mock-live-box">
                    <div className="mock-test-header">
                      <div className="timer-display">
                        Time Remaining:{' '}
                        <span className={`timer-num ${testTimer < 30 ? 'critical' : ''}`}>
                          {formatTime(testTimer)}
                        </span>
                      </div>
                      <button className="tpo-btn tpo-btn-alert" onClick={() => handleMockTestSubmit(false)}>
                        Submit Test
                      </button>
                    </div>

                    <div className="mock-questions-list">
                      {activeSubject.mockTest.map((q, qIdx) => {
                        const selectedIdx = testAnswers[q.id];

                        return (
                          <div key={q.id} className="mock-q-item">
                            <h4 className="mock-q-title">
                              Question {qIdx + 1}: {q.question}
                            </h4>
                            <div className="mock-options-grid">
                              {q.options.map((opt, optIdx) => (
                                <button
                                  key={optIdx}
                                  className={`mock-opt-cell ${selectedIdx === optIdx ? 'selected' : ''}`}
                                  onClick={() => handleMockTestSelectOption(q.id, optIdx)}
                                >
                                  <span className="opt-letter">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="opt-text">{opt}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {testSubmitted && (
                  <div className="mock-result-box">
                    <span className="result-badge">TEST COMPLETED</span>
                    <h3>Your Performance Report</h3>
                    <div className="score-meter-row">
                      <div className="score-meter">
                        <span className="score-percent">{testScore}%</span>
                        <span className="score-sub text-muted">Accuracy</span>
                      </div>
                      <div className="result-stats">
                        <p>
                          <strong>Total Questions:</strong> {activeSubject.mockTest.length}
                        </p>
                        <p>
                          <strong>Correct Answers:</strong>{' '}
                          {Math.round((testScore || 0) * activeSubject.mockTest.length / 100)}
                        </p>
                        <p>
                          <strong>Status:</strong> Passed (Verified)
                        </p>
                      </div>
                    </div>
                    <button className="tpo-btn tpo-btn-secondary" onClick={handleStartMockTest}>
                      Retake Mock Test
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PREVIOUS INTERVIEW QUESTIONS */}
            {activeTab === 'interview' && (
              <div className="interview-qa-tab">
                <p className="tab-instructions">
                  Real questions asked by recruiters during campus placements.
                </p>
                <div className="interview-qa-stack">
                  {activeSubject.interviews.map((item) => {
                    const isExpanded = !!expandedInterviewQs[item.id];

                    return (
                      <div key={item.id} className="interview-qa-card">
                        <div className="qa-header-row" onClick={() => toggleInterviewQ(item.id)}>
                          <div className="company-and-question">
                            <div className="company-avatar-small" title={item.company}>
                              {item.companyLogo}
                            </div>
                            <span className="qa-question-title">{item.question}</span>
                          </div>
                          <div className="qa-right-meta">
                            <span className={`difficulty-pill ${item.difficulty.toLowerCase()}`}>
                              {item.difficulty}
                            </span>
                            <span className={`expand-arrow ${isExpanded ? 'up' : 'down'}`}>
                              &or;
                            </span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="qa-body-answer">
                            <span className="answer-label">SUGGESTED ANSWER:</span>
                            <p className="answer-text">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* COMPANY SPECIFIC PREPARATION */}
            {activeTab === 'company' && (
              <div className="company-prep-tab">
                <div className="company-prep-grid">
                  <div className="prep-column-left">
                    <span className="meta-label">PLACEMENT RECRUITERS</span>
                    <div className="recruiter-tags-stack">
                      {activeSubject.companyPrep.companies.map((c, cIdx) => (
                        <div key={cIdx} className="recruiter-tag">
                          🏢 {c}
                        </div>
                      ))}
                    </div>

                    <span className="meta-label" style={{ marginTop: '20px' }}>
                      PRIORITY LEVEL
                    </span>
                    <div className={`priority-badge ${activeSubject.companyPrep.priority.toLowerCase()}`}>
                      {activeSubject.companyPrep.priority} Priority Subject
                    </div>
                  </div>

                  <div className="prep-column-right">
                    <span className="meta-label">HIGH-YIELD CORE AREAS</span>
                    <ul className="focus-areas-list">
                      {activeSubject.companyPrep.focusAreas.map((area, aIdx) => (
                        <li key={aIdx}>{area}</li>
                      ))}
                    </ul>

                    <span className="meta-label" style={{ marginTop: '20px' }}>
                      PREP ADVICE & INTERVIEW TIPS
                    </span>
                    <p className="prep-tips-text">{activeSubject.companyPrep.tips}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
