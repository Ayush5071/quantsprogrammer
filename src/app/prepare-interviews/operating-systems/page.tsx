"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowUp, BookOpen, ExternalLink, Code, Monitor, Cpu, HardDrive } from "lucide-react";
import { useRouter } from "next/navigation";

const OperatingSystemsPage = () => {
  const router = useRouter();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const sections = [
    { id: "process-thread", title: "Process vs Thread", number: 1 },
    { id: "deadlock", title: "Deadlock", number: 2 },
    { id: "memory-management", title: "Memory Management", number: 3 },
    { id: "scheduling", title: "Scheduling Algorithms", number: 4 },
    { id: "synchronization", title: "Synchronization", number: 5 },
    { id: "context-switching", title: "Context Switching", number: 6 },
    { id: "paging-segmentation", title: "Paging vs Segmentation", number: 7 },
    { id: "page-replacement", title: "Page Replacement", number: 8 },
    { id: "producer-consumer", title: "Producer-Consumer", number: 9 },
    { id: "thread-types", title: "Thread Types", number: 10 },
    { id: "critical-section", title: "Critical Section", number: 11 },
    { id: "demand-paging", title: "Demand Paging", number: 12 },
    { id: "swapping", title: "Swapping", number: 13 },
    { id: "thrashing", title: "Thrashing", number: 14 },
    { id: "file-system", title: "File System", number: 15 },
    { id: "ipc", title: "Inter-Process Communication", number: 16 },
    { id: "bankers-algorithm", title: "Banker's Algorithm", number: 17 },
    { id: "fork-exec", title: "Fork and Exec", number: 18 },
    { id: "signals", title: "Signals", number: 19 },
    { id: "monitors", title: "Monitors", number: 20 },
    { id: "advanced", title: "Advanced & Real Interview Questions", number: 21 },
    { id: "system-internals", title: "System Internals", number: 22 },
    { id: "performance", title: "Performance & Optimization", number: 23 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      {/* Header with Back Button */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-2 text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Operating Systems Interview Questions
              </h1>
              <p className="text-zinc-300 mt-2">
                Comprehensive guide for product-based company interviews
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Index */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Table of Contents
              </h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center gap-3"
                  >
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {section.number}
                    </span>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </div>
              
              {/* Reference Links */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4">References</h4>
                <div className="space-y-2">
                  <a
                    href="https://www.geeksforgeeks.org/operating-system-interview-questions/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">GeeksforGeeks</span>
                  </a>
                  <a
                    href="https://www.interviewbit.com/operating-system-interview-questions/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">InterviewBit</span>
                  </a>
                  <a
                    href="https://www.scaler.com/topics/operating-system-interview-questions/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Scaler</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Introduction */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Operating Systems Interview Guide</h2>
                  <p className="text-zinc-300 text-lg mb-6">
                    This comprehensive guide covers frequently asked Operating Systems interview questions 
                    and their solutions for SDE/product/startup interviews at top product-based companies.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-400">100+</div>
                      <div className="text-zinc-300 text-sm">Questions</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-400">23</div>
                      <div className="text-zinc-300 text-sm">Topics</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4">
                      <div className="text-2xl font-bold text-purple-400">Real</div>
                      <div className="text-zinc-300 text-sm">Examples</div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-400">Code</div>
                      <div className="text-zinc-300 text-sm">Solutions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Process vs Thread */}
              <section id="process-thread" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">1</span>
                  Process vs Thread
                </h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is the difference between a process and a thread?</h3>
                  <div className="bg-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Answer:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-blue-400 font-semibold mb-2">Process:</h5>
                        <ul className="text-zinc-300 space-y-1 text-sm">
                          <li>• Independent program in execution</li>
                          <li>• Has its own memory space</li>
                          <li>• Isolated from other processes</li>
                          <li>• Higher overhead for creation</li>
                          <li>• Inter-process communication required</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-green-400 font-semibold mb-2">Thread:</h5>
                        <ul className="text-zinc-300 space-y-1 text-sm">
                          <li>• Lightweight unit of a process</li>
                          <li>• Shares memory with other threads</li>
                          <li>• Faster context switching</li>
                          <li>• Lower overhead for creation</li>
                          <li>• Direct shared memory access</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-gray-900 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Memory Layout Comparison:</h5>
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`Process Memory Layout:          Thread Memory Layout:
┌─────────────────┐            ┌─────────────────┐
│   Stack (P1)    │            │   Stack (T1)    │
├─────────────────┤            ├─────────────────┤
│   Heap (P1)     │            │   Stack (T2)    │
├─────────────────┤            ├─────────────────┤
│   Data (P1)     │            │  Shared Heap    │
├─────────────────┤            ├─────────────────┤
│   Code (P1)     │            │  Shared Data    │
└─────────────────┘            ├─────────────────┤
                               │  Shared Code    │
┌─────────────────┐            └─────────────────┘
│   Stack (P2)    │
├─────────────────┤
│   Heap (P2)     │
├─────────────────┤
│   Data (P2)     │
├─────────────────┤
│   Code (P2)     │
└─────────────────┘`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Deadlock */}
              <section id="deadlock" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">2</span>
                  Deadlock
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is a deadlock? How can it be prevented, detected, or recovered?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Definition:</h4>
                      <p className="text-zinc-300 mb-4">
                        A deadlock is a situation where two or more processes are waiting indefinitely for resources held by each other.
                      </p>
                      
                      <h4 className="text-lg font-semibold text-white mb-3">Coffman Conditions (All must be true for deadlock):</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3">
                          <h5 className="text-red-400 font-semibold">1. Mutual Exclusion</h5>
                          <p className="text-zinc-300 text-sm">Only one process can use a resource at a time</p>
                        </div>
                        <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-3">
                          <h5 className="text-orange-400 font-semibold">2. Hold and Wait</h5>
                          <p className="text-zinc-300 text-sm">Process holds resources while waiting for others</p>
                        </div>
                        <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3">
                          <h5 className="text-yellow-400 font-semibold">3. No Preemption</h5>
                          <p className="text-zinc-300 text-sm">Resources cannot be forcibly taken from processes</p>
                        </div>
                        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3">
                          <h5 className="text-purple-400 font-semibold">4. Circular Wait</h5>
                          <p className="text-zinc-300 text-sm">Circular chain of processes waiting for resources</p>
                        </div>
                      </div>

                      <h4 className="text-lg font-semibold text-white mb-3">Deadlock Handling Strategies:</h4>
                      <div className="space-y-4">
                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                          <h5 className="text-green-400 font-semibold mb-2">Prevention:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Avoid hold and wait: Acquire all resources at once</li>
                            <li>• Allow preemption: Force release of resources</li>
                            <li>• Impose ordering: Number resources and acquire in order</li>
                          </ul>
                        </div>
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">Detection:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Use wait-for graphs to detect cycles</li>
                            <li>• Run deadlock detection algorithm periodically</li>
                            <li>• Check resource allocation vs availability</li>
                          </ul>
                        </div>
                        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
                          <h5 className="text-red-400 font-semibold mb-2">Recovery:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Kill one or more processes in the cycle</li>
                            <li>• Preempt resources from some processes</li>
                            <li>• Rollback processes to safe state</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Real Interview Example: Dining Philosophers Problem</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Five philosophers sit around a table with five chopsticks. Each needs two chopsticks to eat.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`// Deadlock-prone solution
void philosopher(int i) {
    while(1) {
        think();
        take_chopstick(i);        // Left chopstick
        take_chopstick((i+1)%5);  // Right chopstick - DEADLOCK!
        eat();
        put_chopstick(i);
        put_chopstick((i+1)%5);
    }
}

// Solution: Break circular wait
void philosopher(int i) {
    while(1) {
        think();
        if (i % 2 == 0) {  // Even philosophers: left then right
            take_chopstick(i);
            take_chopstick((i+1)%5);
        } else {           // Odd philosophers: right then left
            take_chopstick((i+1)%5);
            take_chopstick(i);
        }
        eat();
        put_chopstick(i);
        put_chopstick((i+1)%5);
    }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Memory Management */}
              <section id="memory-management" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">3</span>
                  Memory Management
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: Explain virtual memory and paging.</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-blue-400 font-semibold mb-3">Virtual Memory:</h4>
                          <ul className="text-zinc-300 space-y-2 text-sm">
                            <li>• Abstraction that gives processes illusion of large memory</li>
                            <li>• Each process has its own virtual address space</li>
                            <li>• Physical memory can be smaller than virtual memory</li>
                            <li>• Enables multiprogramming and process isolation</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-green-400 font-semibold mb-3">Paging:</h4>
                          <ul className="text-zinc-300 space-y-2 text-sm">
                            <li>• Divides memory into fixed-size pages (usually 4KB)</li>
                            <li>• Uses page tables to map virtual to physical addresses</li>
                            <li>• Eliminates external fragmentation</li>
                            <li>• Supports demand paging and swapping</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Virtual to Physical Address Translation:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`Virtual Address: [Page Number | Offset]
                      |            |
                      v            |
                 Page Table        |
                      |            |
                      v            |
              [Physical Page]      |
                      |            |
                      v            v
Physical Address: [Frame Number | Offset]

Example (32-bit system, 4KB pages):
- Virtual Address: 0x12345678
- Page Size: 4KB (12 bits for offset)
- Page Number: 0x12345 (upper 20 bits)
- Offset: 0x678 (lower 12 bits)
- Page Table[0x12345] = Frame 0x98765
- Physical Address: 0x98765678`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is Translation Lookaside Buffer (TLB)?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        TLB is a small, fast cache that stores recent virtual-to-physical address translations to speed up memory access.
                      </p>
                      <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
                        <h5 className="text-yellow-400 font-semibold mb-2">Memory Access with TLB:</h5>
                        <ol className="text-zinc-300 text-sm space-y-1">
                          <li>1. Check TLB for virtual page number</li>
                          <li>2. TLB Hit: Use physical frame number directly</li>
                          <li>3. TLB Miss: Access page table, update TLB</li>
                          <li>4. Page Fault: Load page from disk if not in memory</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Scheduling Algorithms */}
              <section id="scheduling" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">4</span>
                  CPU Scheduling Algorithms
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What are common CPU scheduling algorithms? Compare their characteristics.</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">FCFS (First Come First Serve)</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Simple, non-preemptive</li>
                            <li>• Fair but inefficient</li>
                            <li>• Convoy effect problem</li>
                            <li>• Average waiting time can be high</li>
                          </ul>
                        </div>
                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                          <h5 className="text-green-400 font-semibold mb-2">SJF (Shortest Job First)</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Optimal for average waiting time</li>
                            <li>• Can be preemptive (SRTF) or non-preemptive</li>
                            <li>• Starvation problem for long jobs</li>
                            <li>• Requires knowledge of burst time</li>
                          </ul>
                        </div>
                        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
                          <h5 className="text-purple-400 font-semibold mb-2">Round Robin</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Time-sliced, preemptive</li>
                            <li>• Fair for all processes</li>
                            <li>• Performance depends on time quantum</li>
                            <li>• Good response time</li>
                          </ul>
                        </div>
                        <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-4">
                          <h5 className="text-orange-400 font-semibold mb-2">Priority Scheduling</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Each process has a priority</li>
                            <li>• Can be preemptive or non-preemptive</li>
                            <li>• Starvation problem for low priority</li>
                            <li>• Solution: Priority aging</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Scheduling Example:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`Processes: P1(burst=10), P2(burst=1), P3(burst=2), P4(burst=1)

FCFS: P1 → P2 → P3 → P4
Gantt: |--P1(10)--|P2|P3|P4|
Wait:  P1=0, P2=10, P3=11, P4=13
Avg Wait Time = (0+10+11+13)/4 = 8.5

SJF: P2 → P4 → P3 → P1  
Gantt: |P2|P4|P3|--P1(10)--|
Wait:  P1=4, P2=0, P3=2, P4=1
Avg Wait Time = (4+0+2+1)/4 = 1.75

Round Robin (quantum=2):
Gantt: |P1|P2|P3|P4|P1|P1|P1|P1|
Wait:  P1=6, P2=1, P3=2, P4=3
Avg Wait Time = (6+1+2+3)/4 = 3`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: Explain Multilevel Queue and Multilevel Feedback Queue scheduling.</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-blue-400 font-semibold mb-2">Multilevel Queue:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Separate queues for different process types</li>
                            <li>• Fixed priority between queues</li>
                            <li>• Each queue can have its own scheduling algorithm</li>
                            <li>• No movement between queues</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-green-400 font-semibold mb-2">Multilevel Feedback Queue:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Processes can move between queues</li>
                            <li>• Aging mechanism prevents starvation</li>
                            <li>• Different time quantums for different levels</li>
                            <li>• Most complex but flexible</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Synchronization */}
              <section id="synchronization" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">5</span>
                  Synchronization
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: How do you achieve synchronization between threads?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Synchronization prevents race conditions and ensures data consistency when multiple threads access shared resources.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">Mutex (Mutual Exclusion):</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Binary lock (locked/unlocked)</li>
                            <li>• Only lock owner can unlock</li>
                            <li>• Blocking synchronization</li>
                            <li>• Prevents race conditions</li>
                          </ul>
                        </div>
                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                          <h5 className="text-green-400 font-semibold mb-2">Semaphore:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Integer counter with atomic operations</li>
                            <li>• Binary (0/1) or counting (n resources)</li>
                            <li>• wait() decrements, signal() increments</li>
                            <li>• Used for resource counting</li>
                          </ul>
                        </div>
                        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
                          <h5 className="text-purple-400 font-semibold mb-2">Condition Variables:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Wait for specific conditions</li>
                            <li>• Used with mutex for complex synchronization</li>
                            <li>• wait() blocks, signal() wakes one thread</li>
                            <li>• broadcast() wakes all waiting threads</li>
                          </ul>
                        </div>
                        <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-4">
                          <h5 className="text-orange-400 font-semibold mb-2">Monitors:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• High-level synchronization construct</li>
                            <li>• Combines mutex and condition variables</li>
                            <li>• Only one thread active in monitor</li>
                            <li>• Language-level support (Java, C#)</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Mutex vs Semaphore Example:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`// Mutex Example (Critical Section)
mutex_t lock = MUTEX_INITIALIZER;

void critical_section() {
    mutex_lock(&lock);
    // Only one thread can execute this block
    shared_variable++;
    mutex_unlock(&lock);
}

// Semaphore Example (Resource Pool)
semaphore_t pool = semaphore_init(5); // 5 resources

void use_resource() {
    semaphore_wait(&pool);    // Acquire resource
    // Use resource (max 5 threads simultaneously)
    process_data();
    semaphore_signal(&pool);  // Release resource
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Context Switching */}
              <section id="context-switching" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">6</span>
                  Context Switching
                </h2>
                
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is context switching? How does it work?</h3>
                  <div className="bg-white/10 rounded-xl p-6">
                    <p className="text-zinc-300 mb-4">
                      Context switching is the process of saving the state of a running process/thread and loading the state of another.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="text-blue-400 font-semibold mb-2">Process Context Switch:</h5>
                        <ul className="text-zinc-300 text-sm space-y-1">
                          <li>• Save CPU registers</li>
                          <li>• Save program counter</li>
                          <li>• Save memory management info</li>
                          <li>• Switch page tables</li>
                          <li>• Flush TLB and caches</li>
                          <li>• Higher overhead (~1000 cycles)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-green-400 font-semibold mb-2">Thread Context Switch:</h5>
                        <ul className="text-zinc-300 text-sm space-y-1">
                          <li>• Save CPU registers</li>
                          <li>• Save stack pointer</li>
                          <li>• No memory management changes</li>
                          <li>• No page table switch</li>
                          <li>• TLB remains valid</li>
                          <li>• Lower overhead (~100 cycles)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Context Switch Steps:</h5>
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`1. Timer Interrupt or System Call triggers context switch
2. Save current process state:
   - CPU registers → PCB (Process Control Block)
   - Program counter → PCB
   - Stack pointer → PCB
   - Memory management info → PCB
3. Select next process from ready queue
4. Load new process state:
   - PCB → CPU registers
   - PCB → Program counter  
   - PCB → Stack pointer
   - Update memory management unit
5. Resume execution of new process

Cost Analysis:
- Direct cost: Save/restore registers (~50-100 cycles)
- Indirect cost: Cache misses, TLB misses (~1000+ cycles)
- Total: Process switch (1000+ cycles), Thread switch (100 cycles)`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Paging vs Segmentation */}
              <section id="paging-segmentation" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">7</span>
                  Paging vs Segmentation
                </h2>
                
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What's the difference between paging and segmentation?</h3>
                  <div className="bg-white/10 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                        <h5 className="text-blue-400 font-semibold mb-2">Paging:</h5>
                        <ul className="text-zinc-300 text-sm space-y-1">
                          <li>• Fixed-size pages (usually 4KB)</li>
                          <li>• Physical division of memory</li>
                          <li>• No external fragmentation</li>
                          <li>• Internal fragmentation possible</li>
                          <li>• Simple hardware support</li>
                          <li>• Pages can be non-contiguous</li>
                        </ul>
                      </div>
                      <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                        <h5 className="text-green-400 font-semibold mb-2">Segmentation:</h5>
                        <ul className="text-zinc-300 text-sm space-y-1">
                          <li>• Variable-size segments</li>
                          <li>• Logical division (code, data, stack)</li>
                          <li>• External fragmentation possible</li>
                          <li>• No internal fragmentation</li>
                          <li>• More complex hardware</li>
                          <li>• Segments have semantic meaning</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Memory Layout Comparison:</h5>
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`Paging Memory Layout:           Segmentation Memory Layout:
┌─────────────────┐            ┌─────────────────┐
│   Page 0 (4KB)  │            │  Code Segment   │ Variable
├─────────────────┤            │    (2KB)        │ Size
│   Page 1 (4KB)  │            ├─────────────────┤
├─────────────────┤            │  Data Segment   │
│   Page 2 (4KB)  │            │    (6KB)        │
├─────────────────┤            ├─────────────────┤
│   Page 3 (4KB)  │            │ Stack Segment   │
└─────────────────┘            │    (3KB)        │
                               └─────────────────┘

Address Translation:
Paging: Virtual Address = [Page# | Offset]
Segmentation: Virtual Address = [Segment# | Offset]

Combined (Segmented Paging):
Virtual Address = [Segment# | Page# | Offset]`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Page Replacement Algorithms */}
              <section id="page-replacement" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">8</span>
                  Page Replacement Algorithms
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: Explain common page replacement algorithms and their performance.</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
                          <h5 className="text-red-400 font-semibold mb-2">FIFO (First In First Out):</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Simple to implement</li>
                            <li>• Uses queue data structure</li>
                            <li>• May suffer from Belady's anomaly</li>
                            <li>• Not optimal performance</li>
                          </ul>
                        </div>
                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                          <h5 className="text-green-400 font-semibold mb-2">LRU (Least Recently Used):</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Good approximation to optimal</li>
                            <li>• Expensive to implement exactly</li>
                            <li>• Uses counters or stack</li>
                            <li>• No Belady's anomaly</li>
                          </ul>
                        </div>
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">Optimal (MIN):</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Theoretical optimal algorithm</li>
                            <li>• Requires future knowledge</li>
                            <li>• Used as benchmark</li>
                            <li>• Lowest page fault rate</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Page Replacement Example:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`Reference String: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5
Frame Size: 3

FIFO Algorithm:
Step | Pages in Memory | Page Fault?
1    | [1]             | Yes (1)
2    | [1,2]           | Yes (2)  
3    | [1,2,3]         | Yes (3)
4    | [4,2,3]         | Yes (4) - Replace 1
5    | [4,2,3]         | No  (1 not in memory)
6    | [4,2,3]         | No  (2 in memory)
7    | [4,5,3]         | Yes (5) - Replace 2
8    | [4,5,3]         | No  (1 not in memory)
9    | [4,5,3]         | No  (2 not in memory)
10   | [1,5,3]         | Yes (3) - Replace 4
11   | [1,2,3]         | Yes (4) - Replace 5
12   | [1,2,5]         | Yes (5) - Replace 3
Total Page Faults: 9

LRU Algorithm:
Step | Pages in Memory | Page Fault?
1    | [1]             | Yes (1)
2    | [1,2]           | Yes (2)
3    | [1,2,3]         | Yes (3)
4    | [4,2,3]         | Yes (4) - Replace 1 (LRU)
5    | [4,2,3]         | No  (1 not in memory)
6    | [4,2,3]         | No  (2 in memory)
7    | [4,2,5]         | Yes (5) - Replace 3 (LRU)
8    | [4,2,5]         | No  (1 not in memory)
9    | [4,2,5]         | No  (2 in memory)
10   | [3,2,5]         | Yes (3) - Replace 4 (LRU)
11   | [3,4,5]         | Yes (4) - Replace 2 (LRU)
12   | [3,4,5]         | No  (5 in memory)
Total Page Faults: 8`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is Belady's Anomaly?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Belady's Anomaly occurs when increasing the number of page frames results in more page faults instead of fewer. 
                        This happens with FIFO but not with LRU or Optimal algorithms.
                      </p>
                      <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
                        <h5 className="text-yellow-400 font-semibold mb-2">Example:</h5>
                        <p className="text-zinc-300 text-sm">
                          Reference string: 1,2,3,4,1,2,5,1,2,3,4,5<br/>
                          With 3 frames: 9 page faults<br/>
                          With 4 frames: 10 page faults (anomaly!)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Producer-Consumer Problem */}
              <section id="producer-consumer" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">9</span>
                  Producer-Consumer Problem
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: How do you solve the producer-consumer problem?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        The producer-consumer problem demonstrates synchronization between processes that share a bounded buffer.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">Problem Description:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Producer creates items and puts in buffer</li>
                            <li>• Consumer takes items from buffer</li>
                            <li>• Buffer has limited capacity</li>
                            <li>• Multiple producers/consumers possible</li>
                          </ul>
                        </div>
                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                          <h5 className="text-green-400 font-semibold mb-2">Synchronization Requirements:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Producer waits if buffer is full</li>
                            <li>• Consumer waits if buffer is empty</li>
                            <li>• Only one process modifies buffer at a time</li>
                            <li>• Prevent race conditions</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Semaphore Solution:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`#include <semaphore.h>

#define BUFFER_SIZE 10
int buffer[BUFFER_SIZE];
int in = 0, out = 0;

semaphore full = 0;        // Number of full slots
semaphore empty = BUFFER_SIZE; // Number of empty slots  
semaphore mutex = 1;       // Mutual exclusion for buffer

// Producer Process
void producer() {
    int item;
    while (1) {
        item = produce_item();     // Create new item
        
        wait(empty);               // Wait for empty slot
        wait(mutex);               // Enter critical section
        
        buffer[in] = item;         // Add item to buffer
        in = (in + 1) % BUFFER_SIZE;
        
        signal(mutex);             // Exit critical section
        signal(full);              // Signal full slot available
    }
}

// Consumer Process  
void consumer() {
    int item;
    while (1) {
        wait(full);                // Wait for full slot
        wait(mutex);               // Enter critical section
        
        item = buffer[out];        // Remove item from buffer
        out = (out + 1) % BUFFER_SIZE;
        
        signal(mutex);             // Exit critical section
        signal(empty);             // Signal empty slot available
        
        consume_item(item);        // Process the item
    }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: Implement producer-consumer using mutex and condition variables.</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Mutex + Condition Variable Solution:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`#include <pthread.h>

#define BUFFER_SIZE 10
int buffer[BUFFER_SIZE];
int count = 0, in = 0, out = 0;

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t not_full = PTHREAD_COND_INITIALIZER;
pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;

void* producer(void* arg) {
    int item;
    while (1) {
        item = produce_item();
        
        pthread_mutex_lock(&mutex);
        
        // Wait while buffer is full
        while (count == BUFFER_SIZE) {
            pthread_cond_wait(&not_full, &mutex);
        }
        
        // Add item to buffer
        buffer[in] = item;
        in = (in + 1) % BUFFER_SIZE;
        count++;
        
        // Signal that buffer is not empty
        pthread_cond_signal(&not_empty);
        
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

void* consumer(void* arg) {
    int item;
    while (1) {
        pthread_mutex_lock(&mutex);
        
        // Wait while buffer is empty
        while (count == 0) {
            pthread_cond_wait(&not_empty, &mutex);
        }
        
        // Remove item from buffer
        item = buffer[out];
        out = (out + 1) % BUFFER_SIZE;
        count--;
        
        // Signal that buffer is not full
        pthread_cond_signal(&not_full);
        
        pthread_mutex_unlock(&mutex);
        
        consume_item(item);
    }
    return NULL;
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Thread Types */}
              <section id="thread-types" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">10</span>
                  User-level vs Kernel-level Threads
                </h2>
                
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is the difference between user-level and kernel-level threads?</h3>
                  <div className="bg-white/10 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                        <h5 className="text-blue-400 font-semibold mb-2">User-level Threads:</h5>
                        <ul className="text-zinc-300 text-sm space-y-1">
                          <li>• Managed by user-space libraries</li>
                          <li>• Kernel unaware of individual threads</li>
                          <li>• Fast context switching</li>
                          <li>• No system calls for thread operations</li>
                          <li>• Blocking I/O blocks entire process</li>
                          <li>• No true parallelism on multicore</li>
                        </ul>
                      </div>
                      <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                        <h5 className="text-green-400 font-semibold mb-2">Kernel-level Threads:</h5>
                        <ul className="text-zinc-300 text-sm space-y-1">
                          <li>• Managed by operating system</li>
                          <li>• Kernel aware of each thread</li>
                          <li>• Higher context switch overhead</li>
                          <li>• System calls required</li>
                          <li>• One thread can block, others continue</li>
                          <li>• True parallelism on multicore</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Threading Models:</h5>
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`1. Many-to-One Model (User-level threads)
   User Threads:    T1  T2  T3  T4
                     \   |   |  /
                      \  |   | /
   Kernel Thread:      \|   |/
                        KT1

   - Multiple user threads map to single kernel thread
   - Examples: GNU Portable Threads, older Java green threads

2. One-to-One Model (Kernel-level threads)  
   User Threads:    T1  T2  T3  T4
                    |   |   |   |
   Kernel Threads:  KT1 KT2 KT3 KT4

   - Each user thread maps to kernel thread
   - Examples: Windows threads, Linux pthread (NPTL)

3. Many-to-Many Model (Hybrid)
   User Threads:    T1  T2  T3  T4  T5  T6
                     \  |   |   |  /   /
                      \ |   |   | /   /
   Kernel Threads:    KT1   KT2   KT3

   - Multiple user threads map to multiple kernel threads
   - Examples: Solaris threads, some versions of AIX`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Critical Section Problem */}
              <section id="critical-section" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">11</span>
                  Critical Section Problem
                </h2>
                
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is the critical section problem? How is it solved?</h3>
                  <div className="bg-white/10 rounded-xl p-6">
                    <p className="text-zinc-300 mb-4">
                      The critical section is code that accesses shared resources and must be executed by only one process at a time.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3">
                        <h5 className="text-red-400 font-semibold mb-1">Mutual Exclusion</h5>
                        <p className="text-zinc-300 text-sm">Only one process in critical section at a time</p>
                      </div>
                      <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3">
                        <h5 className="text-green-400 font-semibold mb-1">Progress</h5>
                        <p className="text-zinc-300 text-sm">Selection of next process cannot be postponed indefinitely</p>
                      </div>
                      <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                        <h5 className="text-blue-400 font-semibold mb-1">Bounded Waiting</h5>
                        <p className="text-zinc-300 text-sm">Limit on times other processes enter CS after a process makes request</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Peterson's Algorithm (Software Solution):</h5>
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`// Shared variables
bool flag[2] = {false, false};  // Interest in entering CS
int turn = 0;                   // Whose turn to enter CS

// Process 0
void process0() {
    while (1) {
        // Entry section
        flag[0] = true;      // Show interest
        turn = 1;            // Give turn to other process
        while (flag[1] && turn == 1) {
            // Busy wait
        }
        
        // Critical section
        critical_section();
        
        // Exit section  
        flag[0] = false;     // No longer interested
        
        // Remainder section
        remainder_section();
    }
}

// Process 1 (similar with indices swapped)
void process1() {
    while (1) {
        flag[1] = true;
        turn = 0;
        while (flag[0] && turn == 0) {
            // Busy wait
        }
        
        critical_section();
        flag[1] = false;
        remainder_section();
    }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Additional Memory Management Topics */}
              <section id="demand-paging" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">12</span>
                  Demand Paging & Memory Management
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is demand paging?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Demand paging loads pages into memory only when needed (on demand), reducing memory usage and startup time.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-blue-400 font-semibold mb-2">Benefits:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Reduced memory usage</li>
                            <li>• Faster program startup</li>
                            <li>• More programs can run simultaneously</li>
                            <li>• I/O operations reduced</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-red-400 font-semibold mb-2">Drawbacks:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Page fault overhead</li>
                            <li>• Disk I/O latency</li>
                            <li>• Complex page replacement logic</li>
                            <li>• Potential thrashing</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is thrashing?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Thrashing occurs when excessive paging activity degrades system performance due to insufficient memory.
                      </p>
                      <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
                        <h5 className="text-red-400 font-semibold mb-2">Causes & Solutions:</h5>
                        <ul className="text-zinc-300 text-sm space-y-1">
                          <li>• <strong>Cause:</strong> Too many processes for available memory</li>
                          <li>• <strong>Solution:</strong> Increase RAM or reduce multiprogramming degree</li>
                          <li>• <strong>Working Set Model:</strong> Keep frequently used pages in memory</li>
                          <li>• <strong>Page Fault Frequency:</strong> Monitor and control page fault rate</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is swapping?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Swapping moves entire processes between main memory and disk to maximize CPU utilization.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`Swapping Process:
1. Medium-term scheduler selects process to swap out
2. Process state saved to swap space on disk
3. Memory freed for other processes
4. When CPU available, process swapped back in
5. May be loaded into different memory location

Swap Space Management:
- Dedicated swap partition (faster)
- Swap file in regular file system (flexible)
- Size typically 1.5-2x physical RAM`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* File System & IPC */}
              <section id="file-system" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">15</span>
                  File System & IPC
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: How does the OS manage files and directories?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h5 className="text-blue-400 font-semibold mb-2">File Allocation Methods:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• <strong>Contiguous:</strong> File blocks are consecutive</li>
                            <li>• <strong>Linked:</strong> Each block points to next</li>
                            <li>• <strong>Indexed:</strong> Index block contains pointers</li>
                            <li>• <strong>FAT:</strong> File Allocation Table</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-green-400 font-semibold mb-2">Directory Structure:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• <strong>Single-level:</strong> All files in one directory</li>
                            <li>• <strong>Two-level:</strong> Separate directory per user</li>
                            <li>• <strong>Tree:</strong> Hierarchical structure</li>
                            <li>• <strong>Acyclic Graph:</strong> Shared subdirectories</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Inode Structure (Unix/Linux):</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`struct inode {
    mode_t    i_mode;      // File type and permissions
    uid_t     i_uid;       // Owner user ID
    gid_t     i_gid;       // Owner group ID
    off_t     i_size;      // File size in bytes
    time_t    i_atime;     // Last access time
    time_t    i_mtime;     // Last modification time
    time_t    i_ctime;     // Last status change time
    blksize_t i_blksize;   // Block size
    blkcnt_t  i_blocks;    // Number of blocks allocated
    
    // Direct block pointers (12)
    __u32     i_block[12];
    
    // Indirect block pointers
    __u32     i_indirect;      // Single indirect
    __u32     i_dindirect;     // Double indirect  
    __u32     i_tindirect;     // Triple indirect
};

File Access Hierarchy:
Direct blocks: 12 × 4KB = 48KB
Single indirect: 1024 × 4KB = 4MB
Double indirect: 1024 × 1024 × 4KB = 4GB
Triple indirect: 1024³ × 4KB = 4TB`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What are IPC mechanisms?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">Message Passing:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Pipes (anonymous and named)</li>
                            <li>• Message queues</li>
                            <li>• Sockets (network communication)</li>
                            <li>• Signals (asynchronous notifications)</li>
                          </ul>
                        </div>
                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                          <h5 className="text-green-400 font-semibold mb-2">Shared Memory:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Fastest IPC mechanism</li>
                            <li>• Requires synchronization</li>
                            <li>• Memory-mapped files</li>
                            <li>• POSIX shared memory</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">IPC Example - Pipes:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`#include <unistd.h>
#include <sys/wait.h>

int main() {
    int pipefd[2];
    pid_t pid;
    char buffer[100];
    
    // Create pipe
    if (pipe(pipefd) == -1) {
        perror("pipe");
        return 1;
    }
    
    pid = fork();
    
    if (pid == 0) {  // Child process (writer)
        close(pipefd[0]);  // Close read end
        write(pipefd[1], "Hello from child!", 17);
        close(pipefd[1]);
        exit(0);
    } else {  // Parent process (reader)
        close(pipefd[1]);  // Close write end
        read(pipefd[0], buffer, sizeof(buffer));
        printf("Received: %s\\n", buffer);
        close(pipefd[0]);
        wait(NULL);  // Wait for child
    }
    
    return 0;
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Banker's Algorithm & Deadlock Avoidance */}
              <section id="bankers-algorithm" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">17</span>
                  Banker's Algorithm
                </h2>
                
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is the Banker's algorithm?</h3>
                  <div className="bg-white/10 rounded-xl p-6">
                    <p className="text-zinc-300 mb-4">
                      Banker's algorithm is a deadlock avoidance algorithm that checks if resource allocation leads to a safe state.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="text-blue-400 font-semibold mb-2">Key Concepts:</h5>
                        <ul className="text-zinc-300 text-sm space-y-1">
                          <li>• <strong>Safe State:</strong> System can allocate resources to all processes in some order</li>
                          <li>• <strong>Unsafe State:</strong> May lead to deadlock</li>
                          <li>• <strong>Available:</strong> Resources currently available</li>
                          <li>• <strong>Max:</strong> Maximum resource need of each process</li>
                          <li>• <strong>Allocation:</strong> Currently allocated resources</li>
                          <li>• <strong>Need:</strong> Max - Allocation</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-green-400 font-semibold mb-2">Algorithm Steps:</h5>
                        <ol className="text-zinc-300 text-sm space-y-1">
                          <li>1. Find process with Need ≤ Available</li>
                          <li>2. Assume it finishes and releases resources</li>
                          <li>3. Add released resources to Available</li>
                          <li>4. Mark process as finished</li>
                          <li>5. Repeat until all processes finish</li>
                          <li>6. If all finish, state is safe</li>
                        </ol>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Banker's Algorithm Example:</h5>
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`Resources: A=10, B=5, C=7
Processes: P0, P1, P2, P3, P4

        Allocation    Max      Need
        A  B  C      A B C    A B C
P0      0  1  0      7 5 3    7 4 3
P1      2  0  0      3 2 2    1 2 2  
P2      3  0  2      9 0 2    6 0 0
P3      2  1  1      2 2 2    0 1 1
P4      0  0  2      4 3 3    4 3 1

Available: A=3, B=3, C=2

Safety Check:
1. P1 can finish (Need=1,2,2 ≤ Available=3,3,2)
   P1 finishes → Available = 3+2,3+0,2+0 = 5,3,2

2. P3 can finish (Need=0,1,1 ≤ Available=5,3,2)  
   P3 finishes → Available = 5+2,3+1,2+1 = 7,4,3

3. P4 can finish (Need=4,3,1 ≤ Available=7,4,3)
   P4 finishes → Available = 7+0,4+0,3+2 = 7,4,5

4. P0 can finish (Need=7,4,3 ≤ Available=7,4,5)
   P0 finishes → Available = 7+0,4+1,5+0 = 7,5,5

5. P2 can finish (Need=6,0,0 ≤ Available=7,5,5)
   P2 finishes → Available = 7+3,5+0,5+2 = 10,5,7

Safe sequence: P1 → P3 → P4 → P0 → P2`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Fork and Exec */}
              <section id="fork-exec" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">18</span>
                  Fork and Exec
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What do fork() and exec() do in Unix/Linux?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">fork():</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Creates new process (child)</li>
                            <li>• Child is exact copy of parent</li>
                            <li>• Returns 0 in child, PID in parent</li>
                            <li>• Both processes continue execution</li>
                            <li>• Copy-on-write optimization</li>
                          </ul>
                        </div>
                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                          <h5 className="text-green-400 font-semibold mb-2">exec():</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Replaces current process image</li>
                            <li>• Loads new program into memory</li>
                            <li>• No new process created</li>
                            <li>• Returns only on error</li>
                            <li>• Family: execl, execv, execp</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Fork and Exec Example:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>

int main() {
    pid_t pid;
    int status;
    
    printf("Before fork: PID = %d\\n", getpid());
    
    pid = fork();
    
    if (pid == -1) {
        perror("fork failed");
        return 1;
    } else if (pid == 0) {
        // Child process
        printf("Child: PID = %d, Parent PID = %d\\n", 
               getpid(), getppid());
        
        // Replace child process with ls command
        execl("/bin/ls", "ls", "-l", NULL);
        
        // This line only executes if exec fails
        perror("exec failed");
        return 1;
    } else {
        // Parent process
        printf("Parent: PID = %d, Child PID = %d\\n", 
               getpid(), pid);
        
        // Wait for child to complete
        wait(&status);
        printf("Child terminated with status %d\\n", status);
    }
    
    return 0;
}

Output:
Before fork: PID = 1234
Parent: PID = 1234, Child PID = 1235  
Child: PID = 1235, Parent PID = 1234
[ls -l output here]
Child terminated with status 0`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What are signals in Unix/Linux?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Signals are asynchronous notifications sent to processes to notify them of events.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-purple-400 font-semibold mb-2">Common Signals:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• <strong>SIGKILL (9):</strong> Terminate immediately</li>
                            <li>• <strong>SIGTERM (15):</strong> Terminate gracefully</li>
                            <li>• <strong>SIGINT (2):</strong> Interrupt (Ctrl+C)</li>
                            <li>• <strong>SIGSEGV (11):</strong> Segmentation fault</li>
                            <li>• <strong>SIGCHLD (17):</strong> Child process terminated</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-orange-400 font-semibold mb-2">Signal Handling:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Default action</li>
                            <li>• Ignore signal</li>
                            <li>• Custom handler function</li>
                            <li>• Some signals cannot be caught</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Advanced & Real Interview Questions */}
              <section id="advanced" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">21</span>
                  Advanced & Real Interview Questions
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: How does the OS implement copy-on-write (COW)?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        When fork() is called, parent and child initially share physical memory pages marked as read-only. 
                        When either process attempts to write, a page fault occurs and the OS creates a private copy.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`COW Implementation:
1. fork() called
2. Child process created with same page table as parent
3. All pages marked as read-only in both processes
4. Both processes share physical memory initially
5. Write attempt by either process triggers page fault
6. Page fault handler:
   - Allocates new physical page
   - Copies content from shared page
   - Updates page table to point to new page
   - Marks new page as read-write
7. Process continues with private copy

Benefits:
- Faster fork() - no immediate copying
- Memory efficient - only copy what's modified
- Lazy allocation - copy only when needed`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: Explain Linux CFS (Completely Fair Scheduler).</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Linux CFS uses a red-black tree to track runnable processes and ensures fairness by scheduling 
                        the process with the least virtual runtime.
                      </p>
                      <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                        <h5 className="text-green-400 font-semibold mb-2">Key Concepts:</h5>
                        <ul className="text-zinc-300 text-sm space-y-1">
                          <li>• Virtual Runtime (vruntime): Tracks CPU time used</li>
                          <li>• Red-Black Tree: Processes sorted by vruntime</li>
                          <li>• Leftmost Process: Always has minimum vruntime</li>
                          <li>• Nice Values: Weight vruntime calculation</li>
                          <li>• Time Slices: Dynamic based on number of runnable processes</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: How would you implement malloc/free?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Basic Malloc Implementation:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`#include <unistd.h>
#include <stddef.h>

// Block header structure
typedef struct block {
    size_t size;
    struct block* next;
    int free;
} block_t;

static block_t* heap_start = NULL;

// Find free block or allocate new one
block_t* find_block(size_t size) {
    block_t* current = heap_start;
    
    while (current) {
        if (current->free && current->size >= size) {
            return current;
        }
        current = current->next;
    }
    return NULL;  // No suitable block found
}

// Request memory from OS
block_t* request_space(size_t size) {
    block_t* block = sbrk(sizeof(block_t) + size);
    if (block == (void*)-1) {
        return NULL;  // sbrk failed
    }
    
    block->size = size;
    block->next = NULL;
    block->free = 0;
    return block;
}

// Our malloc implementation
void* my_malloc(size_t size) {
    if (size <= 0) return NULL;
    
    block_t* block;
    
    if (!heap_start) {  // First allocation
        block = request_space(size);
        if (!block) return NULL;
        heap_start = block;
    } else {
        block = find_block(size);
        if (!block) {  // No free block found
            block = request_space(size);
            if (!block) return NULL;
            
            // Add to end of list
            block_t* current = heap_start;
            while (current->next) {
                current = current->next;
            }
            current->next = block;
        } else {
            block->free = 0;  // Mark as used
        }
    }
    
    return (char*)block + sizeof(block_t);
}

// Our free implementation
void my_free(void* ptr) {
    if (!ptr) return;
    
    block_t* block = (block_t*)((char*)ptr - sizeof(block_t));
    block->free = 1;
    
    // Coalesce adjacent free blocks
    block_t* current = heap_start;
    while (current && current->next) {
        if (current->free && current->next->free) {
            current->size += sizeof(block_t) + current->next->size;
            current->next = current->next->next;
        }
        current = current->next;
    }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: How would you implement a thread pool?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Thread Pool Implementation:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`#include <pthread.h>
#include <stdlib.h>

typedef struct {
    void (*function)(void*);
    void* argument;
} task_t;

typedef struct {
    task_t* tasks;
    int queue_size;
    int front;
    int rear;
    int count;
    
    pthread_t* threads;
    int thread_count;
    int shutdown;
    
    pthread_mutex_t lock;
    pthread_cond_t notify;
} threadpool_t;

void* threadpool_worker(void* pool) {
    threadpool_t* tp = (threadpool_t*)pool;
    task_t task;
    
    while (1) {
        pthread_mutex_lock(&tp->lock);
        
        // Wait for task or shutdown
        while (tp->count == 0 && !tp->shutdown) {
            pthread_cond_wait(&tp->notify, &tp->lock);
        }
        
        if (tp->shutdown) {
            pthread_mutex_unlock(&tp->lock);
            pthread_exit(NULL);
        }
        
        // Get task from queue
        task = tp->tasks[tp->front];
        tp->front = (tp->front + 1) % tp->queue_size;
        tp->count--;
        
        pthread_mutex_unlock(&tp->lock);
        
        // Execute task
        task.function(task.argument);
    }
    
    return NULL;
}

threadpool_t* threadpool_create(int thread_count, int queue_size) {
    threadpool_t* pool = malloc(sizeof(threadpool_t));
    if (!pool) return NULL;
    
    pool->thread_count = thread_count;
    pool->queue_size = queue_size;
    pool->front = pool->rear = pool->count = 0;
    pool->shutdown = 0;
    
    pool->tasks = malloc(sizeof(task_t) * queue_size);
    pool->threads = malloc(sizeof(pthread_t) * thread_count);
    
    pthread_mutex_init(&pool->lock, NULL);
    pthread_cond_init(&pool->notify, NULL);
    
    // Create worker threads
    for (int i = 0; i < thread_count; i++) {
        pthread_create(&pool->threads[i], NULL, 
                      threadpool_worker, pool);
    }
    
    return pool;
}

int threadpool_add_task(threadpool_t* pool, 
                       void (*function)(void*), void* argument) {
    pthread_mutex_lock(&pool->lock);
    
    if (pool->count == pool->queue_size) {
        pthread_mutex_unlock(&pool->lock);
        return -1;  // Queue full
    }
    
    pool->tasks[pool->rear].function = function;
    pool->tasks[pool->rear].argument = argument;
    pool->rear = (pool->rear + 1) % pool->queue_size;
    pool->count++;
    
    pthread_cond_signal(&pool->notify);
    pthread_mutex_unlock(&pool->lock);
    
    return 0;
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: How would you debug a process in uninterruptible sleep (D state)?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Processes in D state are usually waiting for I/O operations and cannot be interrupted by signals.
                      </p>
                      <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
                        <h5 className="text-red-400 font-semibold mb-2">Debugging Steps:</h5>
                        <ol className="text-zinc-300 text-sm space-y-1">
                          <li>1. <strong>Identify the process:</strong> Use <code>ps aux | grep " D "</code></li>
                          <li>2. <strong>Check I/O wait:</strong> Use <code>iotop</code> or <code>iostat</code></li>
                          <li>3. <strong>Trace system calls:</strong> Use <code>strace -p PID</code></li>
                          <li>4. <strong>Check open files:</strong> Use <code>lsof -p PID</code></li>
                          <li>5. <strong>Examine kernel stack:</strong> Check <code>/proc/PID/stack</code></li>
                          <li>6. <strong>Check disk health:</strong> Use <code>dmesg</code> for I/O errors</li>
                          <li>7. <strong>Network issues:</strong> Check network timeouts</li>
                          <li>8. <strong>Last resort:</strong> System reboot if resource permanently unavailable</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* System Internals */}
              <section id="system-internals" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">22</span>
                  System Internals & Architecture
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: How does the OS handle system calls?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        System calls provide the interface between user programs and the kernel, switching from user mode to kernel mode.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">System Call Mechanism:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`System Call Flow:
1. User program calls library function (e.g., read())
2. Library function prepares system call
   - Load system call number into register
   - Load parameters into registers/stack
3. Execute software interrupt/trap instruction
4. CPU switches to kernel mode
5. Kernel system call handler:
   - Save user context
   - Validate parameters
   - Execute kernel function
   - Prepare return value
6. Return to user mode
7. Library function returns to user program

Example - read() system call:
User Code:     read(fd, buffer, count)
Library:       mov eax, SYS_READ    ; System call number
               mov ebx, fd          ; File descriptor  
               mov ecx, buffer      ; Buffer address
               mov edx, count       ; Bytes to read
               int 0x80             ; Software interrupt
Kernel:        sys_read() executes
Return:        eax contains bytes read or error code`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: What is memory-mapped I/O?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Memory-mapped I/O maps device registers or files into the process address space, allowing access through normal memory operations.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-blue-400 font-semibold mb-2">Benefits:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Faster than traditional I/O</li>
                            <li>• No system calls for each access</li>
                            <li>• Shared memory between processes</li>
                            <li>• Simplified programming model</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-red-400 font-semibold mb-2">Use Cases:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• File I/O (mmap)</li>
                            <li>• Device driver communication</li>
                            <li>• Graphics frame buffers</li>
                            <li>• High-performance computing</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: Explain virtual memory protection mechanisms.</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <p className="text-zinc-300 mb-4">
                        Virtual memory protection uses hardware features to control access to memory pages and prevent unauthorized access.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Protection Mechanisms:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`Page Table Entry (x86-64):
Bit 63: Execute Disable (XD/NX)
Bit 2:  User/Supervisor (U/S)
Bit 1:  Read/Write (R/W)  
Bit 0:  Present (P)

Memory Protection:
- Kernel pages: Supervisor only (U/S=0)
- User pages: User accessible (U/S=1)
- Read-only pages: R/W=0
- Writable pages: R/W=1
- Non-executable: XD=1 (stack, heap)
- Executable: XD=0 (code pages)

Access Violations:
- Reading unmapped page → Page Fault
- Writing to read-only page → Protection Fault
- Executing data page → Protection Fault  
- Kernel accessing user page → Meltdown/Spectre protection

Segmentation (additional layer):
- Code Segment: Execute-only
- Data Segment: Read/Write
- Stack Segment: Read/Write, grows down
- Privilege levels: Ring 0 (kernel) to Ring 3 (user)`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Performance & Optimization */}
              <section id="performance" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">23</span>
                  Performance & Optimization
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: How would you optimize system performance?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">CPU Optimization:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Choose appropriate scheduling algorithm</li>
                            <li>• Optimize context switch overhead</li>
                            <li>• Use CPU affinity for cache locality</li>
                            <li>• Load balancing across cores</li>
                          </ul>
                        </div>
                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                          <h5 className="text-green-400 font-semibold mb-2">Memory Optimization:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Optimize page replacement algorithm</li>
                            <li>• Increase memory to reduce swapping</li>
                            <li>• Use huge pages for large datasets</li>
                            <li>• Memory pooling and caching</li>
                          </ul>
                        </div>
                        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
                          <h5 className="text-purple-400 font-semibold mb-2">I/O Optimization:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Use asynchronous I/O</li>
                            <li>• Implement I/O scheduling</li>
                            <li>• Buffer and cache frequently accessed data</li>
                            <li>• RAID for performance and reliability</li>
                          </ul>
                        </div>
                        <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-4">
                          <h5 className="text-orange-400 font-semibold mb-2">System Tuning:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Adjust kernel parameters</li>
                            <li>• Optimize interrupt handling</li>
                            <li>• Use efficient data structures</li>
                            <li>• Monitor system metrics</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">Q: How would you detect and resolve memory leaks?</h3>
                    <div className="bg-white/10 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-red-400 font-semibold mb-2">Detection Tools:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• <strong>Valgrind:</strong> Memory error detector</li>
                            <li>• <strong>AddressSanitizer:</strong> Fast memory error detector</li>
                            <li>• <strong>Static Analysis:</strong> Compile-time checks</li>
                            <li>• <strong>Custom Wrappers:</strong> Track allocations</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-green-400 font-semibold mb-2">Prevention Strategies:</h5>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• <strong>RAII:</strong> Resource Acquisition Is Initialization</li>
                            <li>• <strong>Smart Pointers:</strong> Automatic memory management</li>
                            <li>• <strong>Garbage Collection:</strong> Automatic cleanup</li>
                            <li>• <strong>Code Reviews:</strong> Manual inspection</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6 bg-gray-900 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">Memory Leak Detection Example:</h5>
                        <pre className="text-green-400 text-sm overflow-x-auto">
{`// Custom memory tracking
#ifdef DEBUG
static size_t allocated_bytes = 0;
static int allocation_count = 0;

void* debug_malloc(size_t size, const char* file, int line) {
    void* ptr = malloc(size + sizeof(size_t));
    if (ptr) {
        *(size_t*)ptr = size;
        allocated_bytes += size;
        allocation_count++;
        printf("ALLOC: %zu bytes at %s:%d\\n", size, file, line);
        return (char*)ptr + sizeof(size_t);
    }
    return NULL;
}

void debug_free(void* ptr, const char* file, int line) {
    if (ptr) {
        char* real_ptr = (char*)ptr - sizeof(size_t);
        size_t size = *(size_t*)real_ptr;
        allocated_bytes -= size;
        allocation_count--;
        printf("FREE: %zu bytes at %s:%d\\n", size, file, line);
        free(real_ptr);
    }
}

#define malloc(size) debug_malloc(size, __FILE__, __LINE__)
#define free(ptr) debug_free(ptr, __FILE__, __LINE__)

void report_leaks() {
    if (allocation_count > 0) {
        printf("MEMORY LEAK: %d allocations, %zu bytes\\n", 
               allocation_count, allocated_bytes);
    }
}
#endif`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Tips Section */}
              <section className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Code className="w-6 h-6 text-purple-400" />
                  Tips for OS Interviews
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mt-1 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-blue-400 font-semibold">Draw Diagrams</h4>
                        <p className="text-zinc-300 text-sm">Visualize process/thread models, memory layouts, and scheduling algorithms</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full mt-1 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-green-400 font-semibold">Practice Coding</h4>
                        <p className="text-zinc-300 text-sm">Implement synchronization solutions (producer-consumer, readers-writers, dining philosophers)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-purple-400 rounded-full mt-1 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-purple-400 font-semibold">Know Trade-offs</h4>
                        <p className="text-zinc-300 text-sm">Understand pros/cons of algorithms (LRU vs FIFO, user vs kernel threads)</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mt-1 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-yellow-400 font-semibold">Real-world Context</h4>
                        <p className="text-zinc-300 text-sm">Explain concepts with practical examples and modern system behavior</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full mt-1 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-red-400 font-semibold">Debug Skills</h4>
                        <p className="text-zinc-300 text-sm">Know debugging tools and techniques for system-level problems</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full mt-1 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-cyan-400 font-semibold">Stay Updated</h4>
                        <p className="text-zinc-300 text-sm">Learn about modern OS features (containers, virtualization, cloud computing)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Reference */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Reference Cheat Sheet</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-blue-400 font-semibold mb-2">Process States</h4>
                      <ul className="text-zinc-300 text-xs space-y-1">
                        <li>• New → Ready → Running</li>
                        <li>• Running → Waiting (I/O)</li>
                        <li>• Running → Ready (preempt)</li>
                        <li>• Running → Terminated</li>
                      </ul>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-green-400 font-semibold mb-2">Memory Sizes</h4>
                      <ul className="text-zinc-300 text-xs space-y-1">
                        <li>• Page: 4KB (typical)</li>
                        <li>• TLB: 64-1024 entries</li>
                        <li>• Cache: L1(32KB), L2(256KB), L3(8MB)</li>
                        <li>• Virtual: 48-bit (256TB)</li>
                      </ul>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-purple-400 font-semibold mb-2">Time Complexities</h4>
                      <ul className="text-zinc-300 text-xs space-y-1">
                        <li>• Context Switch: ~1000 cycles</li>
                        <li>• System Call: ~100 cycles</li>
                        <li>• Memory Access: ~100 cycles</li>
                        <li>• Disk I/O: ~10ms</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default OperatingSystemsPage;
