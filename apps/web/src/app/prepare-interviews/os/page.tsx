"use client";
import React, { useState, useEffect } from "react";
import { ArrowUp, ExternalLink, Book, ChevronRight, Cpu } from "lucide-react";

const osQuestions = [
  {
    id: 1,
    title: "Process vs Thread",
    question: "What is the difference between a process and a thread?",
    answer: `**Process:** Independent program in execution, has its own memory space.
**Thread:** Lightweight unit of a process, shares memory with other threads in the same process.

**Key Differences:**
- Processes are isolated; threads share address space.
- Context switching between processes is costlier than between threads.
- Processes have higher overhead due to separate memory spaces.`,
    code: ``
  },
  {
    id: 2,
    title: "Deadlock",
    question: "What is a deadlock? How can it be prevented, detected, or recovered?",
    answer: `**Deadlock:** Situation where two or more processes are waiting indefinitely for resources held by each other.

**Four Coffman Conditions:**
1. Mutual Exclusion
2. Hold and Wait
3. No Preemption
4. Circular Wait

**Prevention:** Avoid one of the Coffman conditions
**Detection:** Use wait-for graphs to detect cycles
**Recovery:** Kill a process or preempt resources`,
    code: ``
  },
  {
    id: 3,
    title: "Memory Management",
    question: "Explain virtual memory and paging.",
    answer: `**Virtual Memory:** Abstraction that gives processes the illusion of a large, contiguous memory.
**Paging:** Divides memory into fixed-size pages; uses page tables to map virtual to physical addresses.

**Benefits:**
- Efficient memory usage
- Process isolation
- Enables multitasking
- Allows programs larger than physical memory`,
    code: ``
  },
  {
    id: 4,
    title: "CPU Scheduling Algorithms",
    question: "What are common CPU scheduling algorithms?",
    answer: `**FCFS (First Come First Serve):** Simple, non-preemptive
**SJF (Shortest Job First):** Optimal for average waiting time, may cause starvation
**Round Robin:** Time-sliced, fair for all processes
**Priority Scheduling:** Each process has a priority; can be preemptive or non-preemptive
**Multilevel Queue:** Different queues for different process types`,
    code: ``
  },
  {
    id: 5,
    title: "Producer-Consumer Problem",
    question: "How do you solve the producer-consumer problem?",
    answer: `Use semaphores or mutexes to synchronize access to the buffer.
This is a classic synchronization problem that demonstrates the need for proper coordination between processes.`,
    code: `// Producer-Consumer Solution using Semaphores
semaphore full = 0, empty = N, mutex = 1;

Producer() {
    while (true) {
        wait(empty);    // Wait for empty slot
        wait(mutex);    // Enter critical section
        // Add item to buffer
        signal(mutex);  // Exit critical section
        signal(full);   // Signal that buffer has item
    }
}

Consumer() {
    while (true) {
        wait(full);     // Wait for item in buffer
        wait(mutex);    // Enter critical section
        // Remove item from buffer
        signal(mutex);  // Exit critical section
        signal(empty);  // Signal that buffer has empty slot
    }
}`
  },
  {
    id: 6,
    title: "Context Switching",
    question: "What is context switching?",
    answer: `**Context Switch:** The process of saving the state of a running process/thread and loading the state of another.

**Steps involved:**
1. Save current process state (registers, PC, memory maps)
2. Update process control block
3. Select next process to run
4. Load new process state
5. Resume execution

**Cost:** Context switching is more expensive for processes than threads due to memory space changes.`,
    code: ``
  },
  {
    id: 7,
    title: "Page Replacement Algorithms",
    question: "Name and explain common page replacement algorithms.",
    answer: `**FIFO (First In First Out):** Removes oldest page in memory
**LRU (Least Recently Used):** Removes least recently accessed page
**Optimal:** Removes page not needed for longest time (theoretical)
**Clock Algorithm:** Approximation of LRU using reference bits
**LFU (Least Frequently Used):** Removes page with lowest access frequency`,
    code: ``
  },
  {
    id: 8,
    title: "Critical Section Problem",
    question: "What is the critical section problem? How is it solved?",
    answer: `**Critical Section:** Code segment that accesses shared resources that must not be concurrently accessed.

**Requirements for solution:**
1. Mutual Exclusion
2. Progress
3. Bounded Waiting

**Solutions:** Locks, semaphores, monitors, or hardware solutions`,
    code: `// Peterson's Solution for 2 processes
boolean flag[2] = {false, false};
int turn = 0;

Process Pi {
    flag[i] = true;
    turn = j;  // j is the other process
    while (flag[j] && turn == j);
    
    // Critical Section
    
    flag[i] = false;
    
    // Remainder Section
}`
  },
  {
    id: 9,
    title: "Banker's Algorithm",
    question: "What is the Banker's algorithm?",
    answer: `**Banker's Algorithm:** Deadlock avoidance algorithm that checks for safe resource allocation.

**Purpose:** Ensures system never enters unsafe state by simulating resource allocation.

**Data Structures:**
- Available: Available instances of each resource
- Max: Maximum demand of each process
- Allocation: Currently allocated resources
- Need: Remaining resource need

**Safety Algorithm:** Finds if there exists a safe sequence of process execution.`,
    code: `// Banker's Algorithm - Safety Check
bool isSafe(int processes[], int available[], 
           int max[][R], int allocation[][R]) {
    int need[P][R];
    
    // Calculate need matrix
    for (int i = 0; i < P; i++)
        for (int j = 0; j < R; j++)
            need[i][j] = max[i][j] - allocation[i][j];
    
    bool finish[P] = {false};
    int safeSeq[P];
    int work[R];
    
    // Initialize work as available
    for (int i = 0; i < R; i++)
        work[i] = available[i];
    
    int count = 0;
    while (count < P) {
        bool found = false;
        for (int p = 0; p < P; p++) {
            if (finish[p] == false) {
                int j;
                for (j = 0; j < R; j++)
                    if (need[p][j] > work[j])
                        break;
                
                if (j == R) {
                    for (int k = 0; k < R; k++)
                        work[k] += allocation[p][k];
                    
                    safeSeq[count++] = p;
                    finish[p] = true;
                    found = true;
                }
            }
        }
        
        if (found == false) {
            return false; // Unsafe state
        }
    }
    
    return true; // Safe state
}`
  },
  {
    id: 10,
    title: "Inter-Process Communication (IPC)",
    question: "What are IPC mechanisms?",
    answer: `**IPC Mechanisms:**
- **Pipes:** Unidirectional communication between related processes
- **Named Pipes (FIFOs):** Communication between unrelated processes
- **Message Queues:** Structured message passing
- **Shared Memory:** Direct memory sharing (fastest)
- **Sockets:** Network communication
- **Signals:** Asynchronous notifications

**Use Cases:** Data exchange, synchronization, and coordination between processes.`,
    code: `// Shared Memory Example
#include <sys/shm.h>
#include <sys/ipc.h>

// Create shared memory segment
int shmid = shmget(IPC_PRIVATE, 1024, IPC_CREAT | 0666);

// Attach to shared memory
char *shmaddr = (char*) shmat(shmid, NULL, 0);

// Write to shared memory
strcpy(shmaddr, "Hello from shared memory!");

// Read from shared memory
printf("Data: %s\\n", shmaddr);

// Detach and remove
shmdt(shmaddr);
shmctl(shmid, IPC_RMID, NULL);`
  },
  {
    id: 11,
    title: "Threading Models",
    question: "Explain user-level vs kernel-level threads.",
    answer: `**User-level Threads:**
- Managed by user libraries
- Kernel unaware of individual threads
- Fast context switching
- Blocking system calls block entire process

**Kernel-level Threads:**
- Managed by OS kernel
- True parallelism on multiprocessors
- Higher overhead for context switching
- Individual thread blocking doesn't affect others

**Hybrid Models:** Many-to-many, two-level models combine benefits of both.`,
    code: ``
  },
  {
    id: 12,
    title: "Memory Allocation Strategies",
    question: "What are different memory allocation strategies?",
    answer: `**Contiguous Allocation:**
- **First Fit:** Allocate first block that fits
- **Best Fit:** Allocate smallest block that fits
- **Worst Fit:** Allocate largest available block

**Non-contiguous Allocation:**
- **Paging:** Fixed-size blocks (pages)
- **Segmentation:** Variable-size logical units

**Dynamic Allocation:**
- Buddy System
- Slab Allocation
- Free List Management`,
    code: `// Simple Free List Implementation
typedef struct block {
    size_t size;
    struct block* next;
} Block;

Block* free_list = NULL;

void* my_malloc(size_t size) {
    Block* current = free_list;
    Block* prev = NULL;
    
    // Find suitable block (First Fit)
    while (current && current->size < size) {
        prev = current;
        current = current->next;
    }
    
    if (!current) return NULL; // No suitable block
    
    // Remove from free list
    if (prev) prev->next = current->next;
    else free_list = current->next;
    
    return (char*)current + sizeof(Block);
}

void my_free(void* ptr) {
    if (!ptr) return;
    
    Block* block = (Block*)((char*)ptr - sizeof(Block));
    block->next = free_list;
    free_list = block;
}`
  }
];

const usefulLinks = [
  {
    title: "GeeksforGeeks OS",
    url: "https://www.geeksforgeeks.org/operating-systems/",
    description: "Comprehensive OS concepts and examples"
  },
  {
    title: "Operating Systems: Three Easy Pieces",
    url: "http://pages.cs.wisc.edu/~remzi/OSTEP/",
    description: "Free online textbook on operating systems"
  },
  {
    title: "MIT OpenCourseWare OS",
    url: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-828-operating-system-engineering-fall-2012/",
    description: "MIT's complete OS course materials"
  },
  {
    title: "Linux Kernel Documentation",
    url: "https://www.kernel.org/doc/html/latest/",
    description: "Official Linux kernel documentation"
  }
];

const OSDetailPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToQuestion = (id: number) => {
    const element = document.getElementById(`question-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Operating Systems Interview Questions
              </h1>
              <p className="text-zinc-300 text-sm md:text-base">
                Master OS concepts for product-based company interviews
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 sticky top-32">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Book className="w-5 h-5" />
                Contents
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {osQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => scrollToQuestion(q.id)}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-zinc-300 hover:text-white text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-medium">{q.id}.</span>
                      <span className="truncate">{q.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {osQuestions.map((q) => (
                <div
                  key={q.id}
                  id={`question-${q.id}`}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden"
                >
                  {/* Question Header */}
                  <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-white/10 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {q.id}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{q.title}</h3>
                        <p className="text-blue-200 text-lg">{q.question}</p>
                      </div>
                    </div>
                  </div>

                  {/* Answer Content */}
                  <div className="p-6">
                    <div className="prose prose-invert max-w-none">
                      <div className="text-zinc-300 leading-relaxed whitespace-pre-line mb-6">
                        {q.answer}
                      </div>

                      {/* Code Block */}
                      {q.code && (
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 overflow-x-auto">
                          <pre className="text-green-400 text-sm">
                            <code>{q.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Useful Links Section */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <ExternalLink className="w-6 h-6 text-purple-400" />
                  Useful Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {usefulLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 rounded-xl p-6 hover:bg-white/20 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-4">
                        <ExternalLink className="w-5 h-5 text-purple-400 group-hover:text-purple-300 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-white font-semibold mb-2 group-hover:text-purple-300">
                            {link.title}
                          </h3>
                          <p className="text-zinc-400 text-sm">
                            {link.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Study Tips */}
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">💡 Study Tips for OS Interviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-300">
                  <div className="space-y-3">
                    <p>• Draw diagrams for process/thread and memory management questions</p>
                    <p>• Practice writing code for synchronization problems</p>
                    <p>• Understand the tradeoffs between different algorithms</p>
                  </div>
                  <div className="space-y-3">
                    <p>• Be ready to explain real-world OS scenarios</p>
                    <p>• Know the internals of popular operating systems</p>
                    <p>• Practice system design questions related to OS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Scroll to top"
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default OSDetailPage;
