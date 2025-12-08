"use client";

import React, { useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  User, Mail, Phone, Github, Linkedin, Globe, GraduationCap,
  Briefcase, Code, Trophy, Plus, Trash2, Download, Eye, EyeOff,
  ChevronDown, ChevronUp, FileText, Link as LinkIcon
} from "lucide-react";

// Types
interface Education {
  institution: string;
  degree: string;
  field: string;
  score: string;
  scoreType: "CGPA" | "Percentage";
  startYear: string;
  endYear: string;
}

interface Project {
  title: string;
  techStack: string;
  bullets: string[];
  liveLink: string;
  codeLink: string;
  date: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  bullets: string[];
  startDate: string;
  endDate: string;
}

interface Achievement {
  text: string;
}

interface ResumeData {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
    databases: string;
  };
  achievements: Achievement[];
}

const defaultData: ResumeData = {
  fullName: "",
  phone: "",
  email: "",
  linkedin: "",
  github: "",
  portfolio: "",
  education: [],
  experience: [],
  projects: [],
  skills: {
    languages: "",
    frameworks: "",
    tools: "",
    databases: "",
  },
  achievements: [],
};

// Collapsible Section
const Section = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-blue-400" />
          <span className="font-medium text-white text-sm">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && <div className="px-4 pb-4 border-t border-gray-700">{children}</div>}
    </div>
  );
};

// Input Component
const Input = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ElementType;
  className?: string;
}) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="text-xs text-gray-400">{label}</label>}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 ${
          Icon ? "pl-8" : ""
        }`}
      />
    </div>
  </div>
);

// TextArea Component
const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <div className="space-y-1">
    {label && <label className="text-xs text-gray-400">{label}</label>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
    />
  </div>
);

export default function CreateResumePage() {
  const [data, setData] = useState<ResumeData>(defaultData);
  const [showPreview, setShowPreview] = useState(true);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Update functions
  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Education
  const addEducation = () => {
    update("education", [
      ...data.education,
      { institution: "", degree: "", field: "", score: "", scoreType: "CGPA", startYear: "", endYear: "" },
    ]);
  };

  const updateEducation = (idx: number, field: keyof Education, value: string) => {
    const updated = [...data.education];
    updated[idx] = { ...updated[idx], [field]: value };
    update("education", updated);
  };

  const removeEducation = (idx: number) => {
    update("education", data.education.filter((_, i) => i !== idx));
  };

  // Experience
  const addExperience = () => {
    update("experience", [
      ...data.experience,
      { title: "", company: "", location: "", bullets: [""], startDate: "", endDate: "" },
    ]);
  };

  const updateExperience = (idx: number, field: keyof Experience, value: any) => {
    const updated = [...data.experience];
    updated[idx] = { ...updated[idx], [field]: value };
    update("experience", updated);
  };

  const removeExperience = (idx: number) => {
    update("experience", data.experience.filter((_, i) => i !== idx));
  };

  // Projects
  const addProject = () => {
    update("projects", [
      ...data.projects,
      { title: "", techStack: "", bullets: [""], liveLink: "", codeLink: "", date: "" },
    ]);
  };

  const updateProject = (idx: number, field: keyof Project, value: any) => {
    const updated = [...data.projects];
    updated[idx] = { ...updated[idx], [field]: value };
    update("projects", updated);
  };

  const removeProject = (idx: number) => {
    update("projects", data.projects.filter((_, i) => i !== idx));
  };

  // Achievements
  const addAchievement = () => {
    update("achievements", [...data.achievements, { text: "" }]);
  };

  const updateAchievement = (idx: number, text: string) => {
    const updated = [...data.achievements];
    updated[idx] = { text };
    update("achievements", updated);
  };

  const removeAchievement = (idx: number) => {
    update("achievements", data.achievements.filter((_, i) => i !== idx));
  };

  // Download PDF
  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    toast.loading("Generating PDF...", { id: "pdf" });

    try {
      const html2pdfModule: any = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default;

      const opt = {
        margin: 0,
        filename: `${data.fullName.replace(/\s+/g, "_") || "Resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(resumeRef.current).save();
      toast.success("PDF downloaded!", { id: "pdf" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF", { id: "pdf" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <h1 className="text-lg font-bold">Resume Builder</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto p-4">
        <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "grid-cols-1 max-w-2xl mx-auto"}`}>
          {/* Form */}
          <div className="space-y-4 order-2 lg:order-1">
            {/* Personal Info */}
            <Section title="Personal Information" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                <Input
                  label="Full Name"
                  value={data.fullName}
                  onChange={(v) => update("fullName", v)}
                  placeholder="John Doe"
                  icon={User}
                  className="md:col-span-2"
                />
                <Input
                  label="Phone"
                  value={data.phone}
                  onChange={(v) => update("phone", v)}
                  placeholder="+91-9876543210"
                  icon={Phone}
                />
                <Input
                  label="Email"
                  value={data.email}
                  onChange={(v) => update("email", v)}
                  placeholder="john@email.com"
                  icon={Mail}
                />
                <Input
                  label="LinkedIn"
                  value={data.linkedin}
                  onChange={(v) => update("linkedin", v)}
                  placeholder="linkedin.com/in/johndoe"
                  icon={Linkedin}
                />
                <Input
                  label="GitHub"
                  value={data.github}
                  onChange={(v) => update("github", v)}
                  placeholder="github.com/johndoe"
                  icon={Github}
                />
                <Input
                  label="Portfolio (optional)"
                  value={data.portfolio}
                  onChange={(v) => update("portfolio", v)}
                  placeholder="johndoe.dev"
                  icon={Globe}
                  className="md:col-span-2"
                />
              </div>
            </Section>

            {/* Education */}
            <Section title="Education" icon={GraduationCap}>
              <div className="space-y-3 pt-3">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-gray-400">Education #{idx + 1}</span>
                      <button onClick={() => removeEducation(idx)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Institution Name"
                        value={edu.institution}
                        onChange={(v) => updateEducation(idx, "institution", v)}
                        className="md:col-span-2"
                      />
                      <Input
                        placeholder="Degree (e.g., B.Tech)"
                        value={edu.degree}
                        onChange={(v) => updateEducation(idx, "degree", v)}
                      />
                      <Input
                        placeholder="Field (e.g., Computer Science)"
                        value={edu.field}
                        onChange={(v) => updateEducation(idx, "field", v)}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Score"
                          value={edu.score}
                          onChange={(v) => updateEducation(idx, "score", v)}
                          className="flex-1"
                        />
                        <select
                          value={edu.scoreType}
                          onChange={(e) => updateEducation(idx, "scoreType", e.target.value)}
                          className="bg-gray-800 border border-gray-600 rounded-md px-2 text-sm text-white"
                        >
                          <option value="CGPA">CGPA</option>
                          <option value="Percentage">%</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Start Year"
                          value={edu.startYear}
                          onChange={(v) => updateEducation(idx, "startYear", v)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="End Year"
                          value={edu.endYear}
                          onChange={(v) => updateEducation(idx, "endYear", v)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>
            </Section>

            {/* Experience */}
            <Section title="Experience" icon={Briefcase}>
              <div className="space-y-3 pt-3">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-gray-400">Experience #{idx + 1}</span>
                      <button onClick={() => removeExperience(idx)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(v) => updateExperience(idx, "title", v)}
                      />
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(v) => updateExperience(idx, "company", v)}
                      />
                      <Input
                        placeholder="Location"
                        value={exp.location}
                        onChange={(v) => updateExperience(idx, "location", v)}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(v) => updateExperience(idx, "startDate", v)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="End Date"
                          value={exp.endDate}
                          onChange={(v) => updateExperience(idx, "endDate", v)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Bullet Points (one per line)</label>
                      <textarea
                        value={exp.bullets.join("\n")}
                        onChange={(e) => updateExperience(idx, "bullets", e.target.value.split("\n"))}
                        placeholder="• Developed feature X&#10;• Improved performance by Y%"
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExperience}
                  className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
            </Section>

            {/* Projects */}
            <Section title="Projects" icon={Code}>
              <div className="space-y-3 pt-3">
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-gray-400">Project #{idx + 1}</span>
                      <button onClick={() => removeProject(idx)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Project Title"
                        value={proj.title}
                        onChange={(v) => updateProject(idx, "title", v)}
                      />
                      <Input
                        placeholder="Date (e.g., Jan 2024 - Present)"
                        value={proj.date}
                        onChange={(v) => updateProject(idx, "date", v)}
                      />
                      <Input
                        placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
                        value={proj.techStack}
                        onChange={(v) => updateProject(idx, "techStack", v)}
                        className="md:col-span-2"
                      />
                      <Input
                        placeholder="Live Link (optional)"
                        value={proj.liveLink}
                        onChange={(v) => updateProject(idx, "liveLink", v)}
                        icon={LinkIcon}
                      />
                      <Input
                        placeholder="Code Link (optional)"
                        value={proj.codeLink}
                        onChange={(v) => updateProject(idx, "codeLink", v)}
                        icon={Github}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Description Bullets (one per line)</label>
                      <textarea
                        value={proj.bullets.join("\n")}
                        onChange={(e) => updateProject(idx, "bullets", e.target.value.split("\n"))}
                        placeholder="• Built a feature that does X&#10;• Used technology Y to achieve Z"
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addProject}
                  className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
            </Section>

            {/* Skills */}
            <Section title="Technical Skills" icon={Code}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                <Input
                  label="Languages"
                  value={data.skills.languages}
                  onChange={(v) => update("skills", { ...data.skills, languages: v })}
                  placeholder="C++, Python, JavaScript, TypeScript"
                />
                <Input
                  label="Frameworks/Libraries"
                  value={data.skills.frameworks}
                  onChange={(v) => update("skills", { ...data.skills, frameworks: v })}
                  placeholder="React, Next.js, Node.js, Express"
                />
                <Input
                  label="Developer Tools"
                  value={data.skills.tools}
                  onChange={(v) => update("skills", { ...data.skills, tools: v })}
                  placeholder="Git, Docker, VS Code, Postman"
                />
                <Input
                  label="Databases"
                  value={data.skills.databases}
                  onChange={(v) => update("skills", { ...data.skills, databases: v })}
                  placeholder="MongoDB, PostgreSQL, Redis"
                />
              </div>
            </Section>

            {/* Achievements */}
            <Section title="Achievements" icon={Trophy}>
              <div className="space-y-2 pt-3">
                {data.achievements.map((ach, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={ach.text}
                      onChange={(e) => updateAchievement(idx, e.target.value)}
                      placeholder="Achievement description..."
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <button onClick={() => removeAchievement(idx)} className="text-red-400 hover:text-red-300 px-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addAchievement}
                  className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Achievement
                </button>
              </div>
            </Section>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="order-1 lg:order-2 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
              <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden h-full flex flex-col">
                <div className="px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                  <span className="text-sm font-medium">Live Preview</span>
                  <span className="text-xs text-gray-400">A4 Format</span>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-gray-800">
                  <div className="shadow-2xl mx-auto" style={{ maxWidth: "210mm" }}>
                    <ResumePreview data={data} ref={resumeRef} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Resume Preview - Compact single-page format
const ResumePreview = React.forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white text-black"
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: "9pt",
        lineHeight: "1.2",
        width: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        padding: "8mm 10mm",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2mm" }}>
        <h1
          style={{
            fontSize: "16pt",
            fontWeight: "bold",
            marginBottom: "1mm",
            letterSpacing: "1px",
          }}
        >
          {data.fullName || "Your Name"}
        </h1>
        <div style={{ fontSize: "8pt", color: "#333" }}>
          {[
            data.phone,
            data.email && (
              <a key="email" href={`mailto:${data.email}`} style={{ color: "#0066cc" }}>
                {data.email}
              </a>
            ),
            data.linkedin && (
              <a key="linkedin" href={`https://${data.linkedin.replace(/^https?:\/\//, "")}`} style={{ color: "#0066cc" }}>
                LinkedIn
              </a>
            ),
            data.github && (
              <a key="github" href={`https://${data.github.replace(/^https?:\/\//, "")}`} style={{ color: "#0066cc" }}>
                GitHub
              </a>
            ),
            data.portfolio && (
              <a key="portfolio" href={`https://${data.portfolio.replace(/^https?:\/\//, "")}`} style={{ color: "#0066cc" }}>
                Portfolio
              </a>
            ),
          ]
            .filter(Boolean)
            .map((item, i, arr) => (
              <React.Fragment key={i}>
                {item}
                {i < arr.length - 1 && " | "}
              </React.Fragment>
            ))}
        </div>
      </div>

      {/* Education */}
      {data.education.length > 0 && (
        <SectionBlock title="Education">
          {data.education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: idx < data.education.length - 1 ? "1.5mm" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold", fontSize: "9pt" }}>{edu.institution}</span>
                <span style={{ fontSize: "8pt" }}>
                  {edu.startYear} - {edu.endYear}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8pt" }}>
                <span style={{ fontStyle: "italic" }}>
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </span>
                <span>
                  {edu.scoreType}: {edu.score}
                </span>
              </div>
            </div>
          ))}
        </SectionBlock>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <SectionBlock title="Experience">
          {data.experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: idx < data.experience.length - 1 ? "2mm" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span style={{ fontWeight: "bold" }}>{exp.title}</span>
                  {exp.company && ` | ${exp.company}`}
                  {exp.location && ` | ${exp.location}`}
                </span>
                <span style={{ fontSize: "8pt", fontStyle: "italic" }}>
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "4mm", listStyleType: "disc", fontSize: "8pt" }}>
                {exp.bullets
                  .filter((b) => b.trim())
                  .map((bullet, i) => (
                    <li key={i}>{bullet.replace(/^[•\-]\s*/, "")}</li>
                  ))}
              </ul>
            </div>
          ))}
        </SectionBlock>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <SectionBlock title="Projects">
          {data.projects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: idx < data.projects.length - 1 ? "2mm" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span>
                  <span style={{ fontWeight: "bold" }}>{proj.title}</span>
                  {proj.techStack && (
                    <span style={{ fontSize: "8pt", color: "#444" }}> | {proj.techStack}</span>
                  )}
                  {(proj.liveLink || proj.codeLink) && (
                    <span style={{ fontSize: "7pt", marginLeft: "2mm" }}>
                      {proj.liveLink && (
                        <a href={proj.liveLink} style={{ color: "#0066cc", marginRight: "2mm" }}>
                          Live
                        </a>
                      )}
                      {proj.codeLink && (
                        <a href={proj.codeLink} style={{ color: "#0066cc" }}>
                          Code
                        </a>
                      )}
                    </span>
                  )}
                </span>
                <span style={{ fontSize: "8pt", fontStyle: "italic" }}>{proj.date}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "4mm", listStyleType: "disc", fontSize: "8pt" }}>
                {proj.bullets
                  .filter((b) => b.trim())
                  .map((bullet, i) => (
                    <li key={i}>{bullet.replace(/^[•\-]\s*/, "")}</li>
                  ))}
              </ul>
            </div>
          ))}
        </SectionBlock>
      )}

      {/* Technical Skills */}
      {(data.skills.languages || data.skills.frameworks || data.skills.tools || data.skills.databases) && (
        <SectionBlock title="Technical Skills">
          <div style={{ fontSize: "8pt" }}>
            {data.skills.languages && (
              <p style={{ margin: "0 0 0.5mm 0" }}>
                <strong>Languages:</strong> {data.skills.languages}
              </p>
            )}
            {data.skills.frameworks && (
              <p style={{ margin: "0 0 0.5mm 0" }}>
                <strong>Frameworks/Libraries:</strong> {data.skills.frameworks}
              </p>
            )}
            {data.skills.tools && (
              <p style={{ margin: "0 0 0.5mm 0" }}>
                <strong>Developer Tools:</strong> {data.skills.tools}
              </p>
            )}
            {data.skills.databases && (
              <p style={{ margin: 0 }}>
                <strong>Databases:</strong> {data.skills.databases}
              </p>
            )}
          </div>
        </SectionBlock>
      )}

      {/* Achievements */}
      {data.achievements.filter((a) => a.text.trim()).length > 0 && (
        <SectionBlock title="Achievements">
          <ul style={{ margin: 0, paddingLeft: "4mm", listStyleType: "disc", fontSize: "8pt" }}>
            {data.achievements
              .filter((a) => a.text.trim())
              .map((ach, idx) => (
                <li key={idx}>{ach.text}</li>
              ))}
          </ul>
        </SectionBlock>
      )}
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

// Section Block for Resume
const SectionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "2mm" }}>
    <h2
      style={{
        fontSize: "10pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        borderBottom: "0.5pt solid black",
        paddingBottom: "0.5mm",
        marginBottom: "1.5mm",
        marginTop: "0",
        letterSpacing: "0.5px",
      }}
    >
      {title}
    </h2>
    {children}
  </div>
);
