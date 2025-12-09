"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  User, Mail, Phone, Github, Linkedin, Globe, GraduationCap,
  Briefcase, Code, Trophy, Award, Plus, Trash2, Save, Download,
  Eye, EyeOff, ChevronDown, ChevronUp, ArrowLeft, Loader2, Edit3,
  ExternalLink, FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/lib/useCurrentUser";
// Types
interface Education {
  institution: string;
  degree: string;
  field: string;
  score: string;
  scoreType: 'CPI' | 'CGPA' | 'Percentage';
  startYear: string;
  endYear: string;
  current: boolean;
}

interface Project {
  title: string;
  description: string[];
  liveLink: string;
  codeLink: string;
  demoLink: string;
  startDate: string;
  endDate: string;
}

interface Experience {
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  links: { label: string; url: string }[];
}

interface Achievement {
  year: string;
  title: string;
  description: string;
  certificateLink: string;
}

interface CodingProfile {
  platform: string;
  username: string;
  link: string;
  rating: string;
}

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  portfolio: string;
  education: Education[];
  projects: Project[];
  skills: {
    programmingLanguages: string[];
    technologies: string[];
    developerTools: string[];
    concepts: string[];
  };
  experience: Experience[];
  achievements: Achievement[];
  codingProfiles: CodingProfile[];
  templateStyle: 'classic' | 'modern' | 'minimal';
}

const defaultResumeData: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  github: "",
  linkedin: "",
  portfolio: "",
  education: [],
  projects: [],
  skills: {
    programmingLanguages: [],
    technologies: [],
    developerTools: [],
    concepts: []
  },
  experience: [],
  achievements: [],
  codingProfiles: [],
  templateStyle: 'classic'
};

// Collapsible Section Component
const CollapsibleSection = ({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  defaultOpen?: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-violet-400" />
          <span className="text-lg font-semibold text-white">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

// Input Field Component
const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ElementType;
  required?: boolean;
}) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-400 flex items-center gap-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors ${Icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

// Tags Input Component
const TagsInput = ({
  label,
  tags,
  onChange,
  placeholder
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-2 min-h-[42px] flex flex-wrap gap-2 focus-within:border-violet-500 transition-colors">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-violet-600/30 text-violet-300 px-2 py-1 rounded-md text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-red-400 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm"
        />
      </div>
      <p className="text-xs text-gray-500">Press Enter or comma to add</p>
    </div>
  );
};

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
   const user = useCurrentUser();

 if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in - user is null when API returns 401
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Login Required</h1>
          <p className="text-gray-400 text-sm mb-6">
            Sign in to access Resume Builder.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }


  // Fetch existing resume on mount
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get("/api/resume");
        if (response.data.resume) {
          setResumeData(response.data.resume);
        }
        setIsAuthenticated(true);
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/auth/login-required");
        } else {
          console.error("Error fetching resume:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [router]);

  // Save resume
  const saveResume = async () => {
    if (!resumeData.fullName || !resumeData.email || !resumeData.phone) {
      toast.error("Please fill in your name, email, and phone number");
      return;
    }

    setSaving(true);
    try {
      await axios.post("/api/resume", resumeData);
      toast.success("Resume saved successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  // Download as PDF
  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    toast.loading("Generating PDF...", { id: "pdf-download" });

    try {
      // Dynamically import html2pdf
      const html2pdfModule: any = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default;

      const element = resumeRef.current;
      const opt: any = {
        margin: 0,
        filename: `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("PDF downloaded successfully!", { id: "pdf-download" });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.", { id: "pdf-download" });
    }
  };

  // Update handlers
  const updatePersonalInfo = (field: keyof ResumeData, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const updateSkills = (category: keyof ResumeData['skills'], tags: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: tags }
    }));
  };

  // Education handlers
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: "",
        degree: "",
        field: "",
        score: "",
        scoreType: 'Percentage',
        startYear: "",
        endYear: "",
        current: false
      }]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Project handlers
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        title: "",
        description: [""],
        liveLink: "",
        codeLink: "",
        demoLink: "",
        startDate: "",
        endDate: ""
      }]
    }));
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const addProjectBullet = (projectIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === projectIndex 
          ? { ...proj, description: [...proj.description, ""] }
          : proj
      )
    }));
  };

  const updateProjectBullet = (projectIndex: number, bulletIndex: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === projectIndex 
          ? { 
              ...proj, 
              description: proj.description.map((d, j) => j === bulletIndex ? value : d) 
            }
          : proj
      )
    }));
  };

  const removeProjectBullet = (projectIndex: number, bulletIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === projectIndex 
          ? { ...proj, description: proj.description.filter((_, j) => j !== bulletIndex) }
          : proj
      )
    }));
  };

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Experience handlers
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: "",
        organization: "",
        description: "",
        startDate: "",
        endDate: "",
        current: false,
        links: []
      }]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperienceLink = (expIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex 
          ? { ...exp, links: [...exp.links, { label: "", url: "" }] }
          : exp
      )
    }));
  };

  const updateExperienceLink = (expIndex: number, linkIndex: number, field: 'label' | 'url', value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex 
          ? { 
              ...exp, 
              links: exp.links.map((link, j) => 
                j === linkIndex ? { ...link, [field]: value } : link
              ) 
            }
          : exp
      )
    }));
  };

  const removeExperienceLink = (expIndex: number, linkIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex 
          ? { ...exp, links: exp.links.filter((_, j) => j !== linkIndex) }
          : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Achievement handlers
  const addAchievement = () => {
    setResumeData(prev => ({
      ...prev,
      achievements: [...prev.achievements, {
        year: "",
        title: "",
        description: "",
        certificateLink: ""
      }]
    }));
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: string) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) => 
        i === index ? { ...ach, [field]: value } : ach
      )
    }));
  };

  const removeAchievement = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Coding Profile handlers
  const addCodingProfile = () => {
    setResumeData(prev => ({
      ...prev,
      codingProfiles: [...prev.codingProfiles, {
        platform: "",
        username: "",
        link: "",
        rating: ""
      }]
    }));
  };

  const updateCodingProfile = (index: number, field: keyof CodingProfile, value: string) => {
    setResumeData(prev => ({
      ...prev,
      codingProfiles: prev.codingProfiles.map((profile, i) => 
        i === index ? { ...profile, [field]: value } : profile
      )
    }));
  };

  const removeCodingProfile = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      codingProfiles: prev.codingProfiles.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading resume builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/profile")}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-violet-400" />
              <h1 className="text-xl font-bold">Resume Builder</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showPreview 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            
            <button
              onClick={saveResume}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!showPreview ? (
          /* Editor Mode */
          <div className="space-y-6">
            {/* Personal Information */}
            <CollapsibleSection title="Personal Information" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputField
                  label="Full Name"
                  value={resumeData.fullName}
                  onChange={(v) => updatePersonalInfo('fullName', v)}
                  placeholder="John Doe"
                  icon={User}
                  required
                />
                <InputField
                  label="Email"
                  value={resumeData.email}
                  onChange={(v) => updatePersonalInfo('email', v)}
                  placeholder="john@example.com"
                  type="email"
                  icon={Mail}
                  required
                />
                <InputField
                  label="Phone"
                  value={resumeData.phone}
                  onChange={(v) => updatePersonalInfo('phone', v)}
                  placeholder="+91-9876543210"
                  icon={Phone}
                  required
                />
                <InputField
                  label="GitHub"
                  value={resumeData.github}
                  onChange={(v) => updatePersonalInfo('github', v)}
                  placeholder="github.com/username"
                  icon={Github}
                />
                <InputField
                  label="LinkedIn"
                  value={resumeData.linkedin}
                  onChange={(v) => updatePersonalInfo('linkedin', v)}
                  placeholder="linkedin.com/in/username"
                  icon={Linkedin}
                />
                <InputField
                  label="Portfolio"
                  value={resumeData.portfolio}
                  onChange={(v) => updatePersonalInfo('portfolio', v)}
                  placeholder="yourportfolio.com"
                  icon={Globe}
                />
              </div>
            </CollapsibleSection>

            {/* Education */}
            <CollapsibleSection title="Education" icon={GraduationCap}>
              <div className="space-y-4 mt-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm text-violet-400">Education #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Institution"
                        value={edu.institution}
                        onChange={(v) => updateEducation(index, 'institution', v)}
                        placeholder="University Name"
                      />
                      <InputField
                        label="Degree"
                        value={edu.degree}
                        onChange={(v) => updateEducation(index, 'degree', v)}
                        placeholder="B.Tech / B.E. / etc."
                      />
                      <InputField
                        label="Field of Study"
                        value={edu.field}
                        onChange={(v) => updateEducation(index, 'field', v)}
                        placeholder="Computer Science"
                      />
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <InputField
                            label="Score"
                            value={edu.score}
                            onChange={(v) => updateEducation(index, 'score', v)}
                            placeholder="8.5 / 85%"
                          />
                        </div>
                        <div className="w-32">
                          <label className="text-sm text-gray-400">Type</label>
                          <select
                            value={edu.scoreType}
                            onChange={(e) => updateEducation(index, 'scoreType', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-violet-500"
                          >
                            <option value="CPI">CPI</option>
                            <option value="CGPA">CGPA</option>
                            <option value="Percentage">%</option>
                          </select>
                        </div>
                      </div>
                      <InputField
                        label="Start Year"
                        value={edu.startYear}
                        onChange={(v) => updateEducation(index, 'startYear', v)}
                        placeholder="2020"
                      />
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <InputField
                            label="End Year"
                            value={edu.endYear}
                            onChange={(v) => updateEducation(index, 'endYear', v)}
                            placeholder="2024"
                          />
                        </div>
                        <label className="flex items-center gap-2 pb-2">
                          <input
                            type="checkbox"
                            checked={edu.current}
                            onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-violet-600 focus:ring-violet-500"
                          />
                          <span className="text-sm text-gray-400">Current</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEducation}
                  className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-violet-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Education
                </button>
              </div>
            </CollapsibleSection>

            {/* Projects */}
            <CollapsibleSection title="Projects" icon={Code}>
              <div className="space-y-4 mt-4">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm text-violet-400">Project #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Project Title"
                        value={project.title}
                        onChange={(v) => updateProject(index, 'title', v)}
                        placeholder="My Awesome Project"
                      />
                      <div className="flex gap-2">
                        <InputField
                          label="Start Date"
                          value={project.startDate}
                          onChange={(v) => updateProject(index, 'startDate', v)}
                          placeholder="Jan 2024"
                        />
                        <InputField
                          label="End Date"
                          value={project.endDate}
                          onChange={(v) => updateProject(index, 'endDate', v)}
                          placeholder="Mar 2024"
                        />
                      </div>
                      <InputField
                        label="Live Link"
                        value={project.liveLink}
                        onChange={(v) => updateProject(index, 'liveLink', v)}
                        placeholder="https://myproject.com"
                      />
                      <InputField
                        label="Code Repository"
                        value={project.codeLink}
                        onChange={(v) => updateProject(index, 'codeLink', v)}
                        placeholder="https://github.com/..."
                      />
                      <div className="md:col-span-2">
                        <InputField
                          label="Demo/Video Link"
                          value={project.demoLink}
                          onChange={(v) => updateProject(index, 'demoLink', v)}
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                    </div>
                    
                    {/* Project Bullets */}
                    <div className="mt-4">
                      <label className="text-sm text-gray-400 mb-2 block">Description Points</label>
                      {project.description.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex gap-2 mb-2">
                          <span className="text-violet-400 mt-2">•</span>
                          <textarea
                            value={bullet}
                            onChange={(e) => updateProjectBullet(index, bulletIndex, e.target.value)}
                            placeholder="Describe a key feature or achievement..."
                            rows={2}
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeProjectBullet(index, bulletIndex)}
                            className="p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors h-fit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addProjectBullet(index)}
                        className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add bullet point
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProject}
                  className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-violet-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Project
                </button>
              </div>
            </CollapsibleSection>

            {/* Technical Skills */}
            <CollapsibleSection title="Technical Skills" icon={Code}>
              <div className="space-y-4 mt-4">
                <TagsInput
                  label="Programming Languages"
                  tags={resumeData.skills.programmingLanguages}
                  onChange={(tags) => updateSkills('programmingLanguages', tags)}
                  placeholder="C++, JavaScript, Python..."
                />
                <TagsInput
                  label="Technologies & Frameworks"
                  tags={resumeData.skills.technologies}
                  onChange={(tags) => updateSkills('technologies', tags)}
                  placeholder="React, Next.js, Node.js..."
                />
                <TagsInput
                  label="Developer Tools"
                  tags={resumeData.skills.developerTools}
                  onChange={(tags) => updateSkills('developerTools', tags)}
                  placeholder="Git, Docker, VS Code..."
                />
                <TagsInput
                  label="CS Concepts"
                  tags={resumeData.skills.concepts}
                  onChange={(tags) => updateSkills('concepts', tags)}
                  placeholder="Data Structures, Algorithms, OOP..."
                />
              </div>
            </CollapsibleSection>

            {/* Experience / Positions of Responsibility */}
            <CollapsibleSection title="Experience & Positions of Responsibility" icon={Briefcase}>
              <div className="space-y-4 mt-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm text-violet-400">Experience #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Title/Role"
                        value={exp.title}
                        onChange={(v) => updateExperience(index, 'title', v)}
                        placeholder="Lead Developer"
                      />
                      <InputField
                        label="Organization"
                        value={exp.organization}
                        onChange={(v) => updateExperience(index, 'organization', v)}
                        placeholder="Company/Club Name"
                      />
                      <InputField
                        label="Start Date"
                        value={exp.startDate}
                        onChange={(v) => updateExperience(index, 'startDate', v)}
                        placeholder="Jan 2024"
                      />
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <InputField
                            label="End Date"
                            value={exp.endDate}
                            onChange={(v) => updateExperience(index, 'endDate', v)}
                            placeholder="Present"
                          />
                        </div>
                        <label className="flex items-center gap-2 pb-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-violet-600 focus:ring-violet-500"
                          />
                          <span className="text-sm text-gray-400">Current</span>
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          placeholder="Describe your role and achievements..."
                          rows={3}
                          className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
                        />
                      </div>
                    </div>
                    
                    {/* Experience Links */}
                    <div className="mt-4">
                      <label className="text-sm text-gray-400 mb-2 block">Links</label>
                      {exp.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="flex gap-2 mb-2">
                          <input
                            value={link.label}
                            onChange={(e) => updateExperienceLink(index, linkIndex, 'label', e.target.value)}
                            placeholder="Label (e.g., GitHub)"
                            className="w-32 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                          />
                          <input
                            value={link.url}
                            onChange={(e) => updateExperienceLink(index, linkIndex, 'url', e.target.value)}
                            placeholder="URL"
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeExperienceLink(index, linkIndex)}
                            className="p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addExperienceLink(index)}
                        className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add link
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-violet-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Experience
                </button>
              </div>
            </CollapsibleSection>

            {/* Achievements */}
            <CollapsibleSection title="Achievements" icon={Trophy}>
              <div className="space-y-4 mt-4">
                {resumeData.achievements.map((ach, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm text-violet-400">Achievement #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Year"
                        value={ach.year}
                        onChange={(v) => updateAchievement(index, 'year', v)}
                        placeholder="2024"
                      />
                      <InputField
                        label="Title"
                        value={ach.title}
                        onChange={(v) => updateAchievement(index, 'title', v)}
                        placeholder="1st Place - Hackathon"
                      />
                      <div className="md:col-span-2">
                        <InputField
                          label="Description"
                          value={ach.description}
                          onChange={(v) => updateAchievement(index, 'description', v)}
                          placeholder="Brief description of the achievement"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <InputField
                          label="Certificate Link"
                          value={ach.certificateLink}
                          onChange={(v) => updateAchievement(index, 'certificateLink', v)}
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAchievement}
                  className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-violet-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Achievement
                </button>
              </div>
            </CollapsibleSection>

            {/* Coding Profiles */}
            <CollapsibleSection title="Coding Profiles" icon={Award}>
              <div className="space-y-4 mt-4">
                {resumeData.codingProfiles.map((profile, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm text-violet-400">Profile #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeCodingProfile(index)}
                        className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Platform"
                        value={profile.platform}
                        onChange={(v) => updateCodingProfile(index, 'platform', v)}
                        placeholder="LeetCode / Codeforces / etc."
                      />
                      <InputField
                        label="Username"
                        value={profile.username}
                        onChange={(v) => updateCodingProfile(index, 'username', v)}
                        placeholder="your_username"
                      />
                      <InputField
                        label="Profile Link"
                        value={profile.link}
                        onChange={(v) => updateCodingProfile(index, 'link', v)}
                        placeholder="https://leetcode.com/..."
                      />
                      <InputField
                        label="Rating (optional)"
                        value={profile.rating}
                        onChange={(v) => updateCodingProfile(index, 'rating', v)}
                        placeholder="1800 / 5 star / etc."
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCodingProfile}
                  className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-violet-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Coding Profile
                </button>
              </div>
            </CollapsibleSection>
          </div>
        ) : (
          /* Preview Mode */
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-[210mm]">
              <ResumePreview data={resumeData} ref={resumeRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Resume Preview Component - ATS Friendly LaTeX-style (Exact match to template)
const ResumePreview = React.forwardRef<HTMLDivElement, { data: ResumeData }>(
  ({ data }, ref) => {
    return (
      <div 
        ref={ref}
        className="bg-white text-black"
        style={{ 
          fontFamily: "'CMU Serif', 'Computer Modern', 'Latin Modern Roman', 'Times New Roman', serif",
          fontSize: '11pt', 
          lineHeight: '1.15',
          width: '210mm',
          minHeight: '297mm',
          padding: '6mm 12mm 8mm 13mm',
          boxSizing: 'border-box'
        }}
      >
        {/* Header - Centered Name and Contact */}
        <div style={{ textAlign: 'center', marginBottom: '-6mm' }}>
          <h1 style={{ 
            fontSize: '25pt', 
            fontWeight: 'bold', 
            letterSpacing: '0.5px',
            marginBottom: '-0.5mm',
            fontFamily: "'CMU Sans Serif', 'Helvetica Neue', Arial, sans-serif"
          }}>
            {data.fullName || 'Your Name'}
          </h1>
          <div style={{ 
            fontSize: '9pt', 
            color: '#333',
            marginTop: '1mm'
          }}>
            {data.phone && <span>{data.phone}</span>}
            {data.phone && data.email && <span> | </span>}
            {data.email && (
              <a href={`mailto:${data.email}`} style={{ color: '#0000EE', textDecoration: 'none' }}>
                {data.email}
              </a>
            )}
            {data.github && (
              <>
                <span> | </span>
                <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} style={{ color: '#0000EE', textDecoration: 'none' }}>
                  {data.github.replace(/^https?:\/\//, '')}
                </a>
              </>
            )}
            {data.linkedin && (
              <>
                <span> | </span>
                <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} style={{ color: '#0000EE', textDecoration: 'none' }}>
                  LinkedIn
                </a>
              </>
            )}
            {data.portfolio && (
              <>
                <span> | </span>
                <a href={data.portfolio.startsWith('http') ? data.portfolio : `https://${data.portfolio}`} style={{ color: '#0000EE', textDecoration: 'none' }}>
                  Portfolio
                </a>
              </>
            )}
          </div>
        </div>

        {/* Education Section */}
        {data.education.length > 0 && (
          <ResumeSection title="Education">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {data.education.map((edu, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td style={{ fontWeight: 'bold', paddingBottom: '0' }}>{edu.institution}</td>
                      <td style={{ textAlign: 'right', paddingBottom: '0' }}>
                        {edu.scoreType}: {edu.score}{edu.scoreType === 'CPI' ? ` (till ${edu.endYear === 'Present' ? 'current' : edu.endYear.replace(/\D/g, '').slice(-1)}${edu.endYear.includes('Sem') ? '' : 'th Sem'})` : ''}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontStyle: 'italic', paddingTop: '0' }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </td>
                      <td style={{ textAlign: 'right', paddingTop: '0' }}>
                        {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                      </td>
                    </tr>
                    {index < data.education.length - 1 && (
                      <tr><td colSpan={2} style={{ height: '2mm' }}></td></tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </ResumeSection>
        )}

        {/* Personal Projects Section */}
        {data.projects.length > 0 && (
          <ResumeSection title="Personal Projects">
            {data.projects.map((project, index) => (
              <div key={index} style={{ marginBottom: index < data.projects.length - 1 ? '3mm' : '0' }}>
                {/* Project Title and Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 'bold' }}>{project.title}</span>
                  <span style={{ fontStyle: 'italic' }}>{project.startDate} – {project.endDate}</span>
                </div>
                {/* Project Links */}
                {(project.liveLink || project.codeLink || project.demoLink) && (
                  <div style={{ fontSize: '9pt', marginBottom: '1mm' }}>
                    {project.liveLink && (
                      <a href={project.liveLink} style={{ color: '#0000EE', textDecoration: 'none', marginRight: '8px' }}>
                        {project.liveLink.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    {project.codeLink && (
                      <a href={project.codeLink} style={{ color: '#0000EE', textDecoration: 'none', marginRight: '8px' }}>
                        Code
                      </a>
                    )}
                    {project.demoLink && (
                      <a href={project.demoLink} style={{ color: '#0000EE', textDecoration: 'none' }}>
                        Demo
                      </a>
                    )}
                  </div>
                )}
                {/* Project Bullets */}
                <ul style={{ 
                  margin: '0', 
                  paddingLeft: '4mm',
                  listStyleType: 'disc',
                  fontSize: '10.5pt',
                  lineHeight: '1.25'
                }}>
                  {project.description.filter(d => d.trim()).map((bullet, i) => (
                    <li key={i} style={{ marginBottom: '0' }}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </ResumeSection>
        )}

        {/* Technical Skills Section */}
        {(data.skills.programmingLanguages.length > 0 || 
          data.skills.technologies.length > 0 || 
          data.skills.developerTools.length > 0 || 
          data.skills.concepts.length > 0) && (
          <ResumeSection title="Technical Skills">
            <div style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
              {data.skills.programmingLanguages.length > 0 && (
                <p style={{ margin: '0 0 1mm 0' }}>
                  <strong>Programming Languages:</strong> {data.skills.programmingLanguages.join(', ')}
                </p>
              )}
              {data.skills.technologies.length > 0 && (
                <p style={{ margin: '0 0 1mm 0' }}>
                  <strong>Technologies:</strong> {data.skills.technologies.join(', ')}
                </p>
              )}
              {data.skills.developerTools.length > 0 && (
                <p style={{ margin: '0 0 1mm 0' }}>
                  <strong>Developer Tools:</strong> {data.skills.developerTools.join(', ')}
                </p>
              )}
              {data.skills.concepts.length > 0 && (
                <p style={{ margin: '0' }}>
                  <strong>Computer Science Concepts:</strong> {data.skills.concepts.join(', ')}
                </p>
              )}
            </div>
          </ResumeSection>
        )}

        {/* Positions of Responsibility Section */}
        {data.experience.length > 0 && (
          <ResumeSection title="Positions of Responsibility">
            {data.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: index < data.experience.length - 1 ? '2mm' : '0' }}>
                <div style={{ fontSize: '10.5pt' }}>
                  <strong>{exp.title}, {exp.organization}</strong>
                  {exp.startDate && (
                    <span style={{ fontStyle: 'italic' }}> ({exp.startDate} – {exp.current ? 'Present' : exp.endDate})</span>
                  )}
                  {exp.links.length > 0 && (
                    <span>
                      {' '}
                      {exp.links.map((link, i) => (
                        <React.Fragment key={i}>
                          <a href={link.url} style={{ color: '#0000EE', textDecoration: 'none', fontSize: '9pt' }}>
                            {link.label}
                          </a>
                          {i < exp.links.length - 1 && ' '}
                        </React.Fragment>
                      ))}
                    </span>
                  )}
                </div>
                <p style={{ margin: '0', fontSize: '10.5pt' }}>{exp.description}</p>
              </div>
            ))}
          </ResumeSection>
        )}

        {/* Achievements Section */}
        {data.achievements.length > 0 && (
          <ResumeSection title="Achievements">
            {data.achievements.map((ach, index) => (
              <div key={index} style={{ fontSize: '10.5pt', marginBottom: index < data.achievements.length - 1 ? '1mm' : '0' }}>
                <strong>{ach.year}:</strong> {ach.title} – {ach.description}
                {ach.certificateLink && (
                  <a href={ach.certificateLink} style={{ color: '#0000EE', textDecoration: 'none', marginLeft: '4px' }}>
                    Certificate
                  </a>
                )}
              </div>
            ))}
          </ResumeSection>
        )}

        {/* Coding Profiles Section */}
        {data.codingProfiles.length > 0 && (
          <ResumeSection title="Coding Profiles">
            {data.codingProfiles.map((profile, index) => (
              <div key={index} style={{ fontSize: '10.5pt' }}>
                <strong>{profile.platform}:</strong>{' '}
                <a href={profile.link} style={{ color: '#0000EE', textDecoration: 'none' }}>
                  {profile.rating ? `${profile.username} | ${profile.rating}` : profile.username}
                </a>
              </div>
            ))}
          </ResumeSection>
        )}
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

// Section Component for Resume Preview - LaTeX style with scshape title and titlerule
const ResumeSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginTop: '3mm' }}>
    <h2 style={{ 
      fontSize: '12pt',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontVariant: 'small-caps',
      letterSpacing: '0.5px',
      borderBottom: '1px solid black',
      paddingBottom: '0.5mm',
      marginBottom: '2mm',
      marginTop: '0'
    }}>
      {title}
    </h2>
    {children}
  </div>
);

// Keep old Section for compatibility but use ResumeSection
const Section = ResumeSection;
