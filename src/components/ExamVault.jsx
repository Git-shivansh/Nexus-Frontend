import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiFileText, FiExternalLink, FiCheck } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import Footer from "./Footer";
// Efficient drag-and-drop file upload using react-dropzone
function FileDropZone({ onFileAccepted }) {
  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({
      accept: { "application/pdf": [] },
      maxFiles: 1,
      onDrop: (files) => {
        if (files && files[0]) onFileAccepted(files[0]);
      },
    });

  const file = acceptedFiles[0];

  return (
    <div
      {...getRootProps()}
      className={`group relative w-full rounded-xl border border-dashed px-4 py-6 md:py-7 text-center transition-all duration-200 cursor-pointer select-none backdrop-blur-sm
        ${
          isDragActive
            ? "border-orange-400  bg-zinc-800"
            : "border-gray-300 hover:border-gray-400 hover:bg-zinc-800"
        }
      `}
      style={{ minHeight: "88px" }}
      aria-label="Upload PDF via drag & drop or click"
    >
      <input {...getInputProps()} />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-100 text-red-600">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 3h6l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
              />
              <path d="M13 3v5h5" />
              <text
                x="9"
                y="16"
                fontSize="6"
                fill="currentColor"
                fontFamily="ui-sans-serif,system-ui"
              >
                PDF
              </text>
            </svg>
          </span>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-800 truncate max-w-[14rem] md:max-w-[18rem]">
              {file.name}
            </div>
            <div className="text-xs text-gray-500">
              {(file.size / (file.size > 900000 ? 1048576 : 1024)).toFixed(1)}{" "}
              {file.size > 900000 ? "MB" : "KB"}
            </div>
          </div>
          <span className="ml-2 hidden text-xs text-gray-400 md:inline">
            Click to replace
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <span
            className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500 transition-colors ${
              isDragActive ? "bg-white-800 text-orange-600" : ""
            }`}
          >
            <img src="/upload-icon.svg" alt="Upload" className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-orange-600">Upload PDF</p>
          <p className="mt-1 text-xs text-gray-500">
            Drag and drop or{" "}
            <span className="text-orange-600 underline decoration-orange-300 underline-offset-2">
              browse
            </span>
          </p>
          <p className="mt-1 text-[10px] text-gray-400">
            Only .pdf, max 1 file
          </p>
        </div>
      )}
    </div>
  );
  // End of FileDropZone (no extra closing brace)
}

const ExamVault = () => {
  const FILTERS_STORAGE_KEY = "examVaultFilters";
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false); // page-level year dropdown
  const [showUploadYearDropdown, setShowUploadYearDropdown] = useState(false); // upload form year dropdown
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Refs for dropdown containers
  const semesterDropdownRef = React.useRef(null);
  const yearDropdownRef = React.useRef(null); // page-level year dropdown ref
  const uploadYearDropdownRef = React.useRef(null); // upload form year dropdown ref
  const branchDropdownRef = React.useRef(null);
  const typeDropdownRef = React.useRef(null);
  const loadSavedFilters = () => {
    try {
      const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
      if (!raw) return {};
      const saved = JSON.parse(raw);
      return saved && typeof saved === "object" ? saved : {};
    } catch {
      return {};
    }
  };
  const [selectedSemester, setSelectedSemester] = useState(() => loadSavedFilters().semester || "I");
  const [selectedBranch, setBranch] = useState(() => loadSavedFilters().branch || "CSE");
  const [selectedYear, setSelectedYear] = useState(() => String(loadSavedFilters().year || "2024"));
  const [selectedExamType, setSelectedExamType] = useState(() => loadSavedFilters().examType || "Mid Sem");
  const [examPapers, setExamPapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    subjectCode: "",
    subjectName: "",
    type: "Mid Sem",
    semester: "I",
    year: "2023",
    branch: "CSE",
  });
  const [uploadFile, setUploadFile] = useState(null);
  // Save filters to localStorage whenever they change
  useEffect(() => {
    try {
      const payload = {
        semester: selectedSemester,
        branch: selectedBranch,
        year: selectedYear,
        examType: selectedExamType,
      };
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [selectedSemester, selectedBranch, selectedYear, selectedExamType]);
  // ...existing code...
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showSemesterDropdown &&
        semesterDropdownRef.current &&
        !semesterDropdownRef.current.contains(event.target)
      ) {
        setShowSemesterDropdown(false);
      }
      if (
        showYearDropdown &&
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setShowYearDropdown(false);
      }
      if (
        showUploadYearDropdown &&
        uploadYearDropdownRef.current &&
        !uploadYearDropdownRef.current.contains(event.target)
      ) {
        setShowUploadYearDropdown(false);
      }
      if (
        showBranchDropdown &&
        branchDropdownRef.current &&
        !branchDropdownRef.current.contains(event.target)
      ) {
        setShowBranchDropdown(false);
      }
      if (
        showTypeDropdown &&
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target)
      ) {
        setShowTypeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showSemesterDropdown,
    showYearDropdown,
    showUploadYearDropdown,
    showBranchDropdown,
    showTypeDropdown,
  ]);

  // Load all papers from local JSON once
  useEffect(() => {
    let active = true;
    const loadJSON = async () => {
      try {
        const res = await fetch("/data/examPapers.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load examPapers.json");
        const data = await res.json();
        if (active) setAllPapers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading local exam papers:", e);
        if (active) setAllPapers([]);
      }
    };
    loadJSON();
    return () => {
      active = false;
    };
  }, []);

  // Filter exam papers from loaded JSON
  const fetchExamPapers = async () => {
    setLoading(true);
    try {
      const romanToNum = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
      const semesterNum = romanToNum[selectedSemester] || 1;
      const filtered = allPapers.filter((paper) => {
        const matches =
          (paper.semester === semesterNum || String(paper.semester) === String(semesterNum)) &&
          String(paper.branch).toUpperCase() === String(selectedBranch).toUpperCase() &&
          String(paper.type) === String(selectedExamType) &&
          String(paper.year) === String(selectedYear);
        const url = typeof paper.fileUrl === "string" ? paper.fileUrl : "";
        const isSupportedLink =
          url.length > 0 && (url.toLowerCase().endsWith(".pdf") || url.includes("drive.google.com"));
        return matches && isSupportedLink;
      });
      setExamPapers(filtered);
    } catch (error) {
      console.error("Error filtering exam papers:", error);
      setExamPapers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamPapers();
    // eslint-disable-next-line
  }, [selectedSemester, selectedBranch, selectedYear, selectedExamType, allPapers]);

  const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const branches = ["CSE", "ECE", "MAE", "MNC"];
  const years = ["2023", "2024", "2025"];
  const examTypes = ["Mid Sem", "End Sem"];

  // No 'All' options; use strict filters

  const PaperCard = ({ paper }) => {
    return (
      <a
        href={paper.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative rounded-xl p-4 md:p-5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 border bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-red-200 hover:border-red-300 shadow-sm hover:shadow-md dark:from-red-900/20 dark:to-red-900/10 dark:hover:from-red-900/30 dark:hover:to-red-900/20 dark:border-red-900/30 dark:hover:border-red-800/50 backdrop-blur-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
      >
        <FiExternalLink
          className="absolute top-2 right-2 h-4 w-4 text-red-400/0 group-hover:text-red-500 transition-colors duration-200 dark:text-red-400/0 dark:group-hover:text-red-300"
          aria-hidden="true"
        />
        <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 mb-2 rounded-full flex items-center justify-center bg-red-200 text-red-600 dark:bg-red-900/40 dark:text-red-300">
          <FiFileText className="w-6 h-6 md:w-7 md:h-7" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="font-extrabold tracking-tight text-base md:text-lg text-gray-800 dark:text-gray-100 mb-1 text-center">
            {paper.subjectCode}
          </div>
          <div className="text-sm md:text-[15px] text-gray-700 dark:text-gray-300 font-medium text-center mb-1">
            {paper.subjectName}
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="min-h-screen w-full">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 text-white rounded-xl p-6 flex-shrink-0 w-full lg:max-w-sm shadow-xl">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Exam Vault</h1>
            <div className="border-t border-gray-600 dark:border-zinc-600 pt-4 mb-4">
              <p className="text-sm text-gray-300 dark:text-gray-400 leading-relaxed">Browse all PYQs by choosing your</p>
              <p className="text-sm text-gray-300 dark:text-gray-400 leading-relaxed">Semester and Branch. Download</p>
              <p className="text-sm text-gray-300 dark:text-gray-400 leading-relaxed">in One click. One place for all.</p>
            </div>
            <button
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium opacity-60 cursor-not-allowed"
              disabled
              aria-disabled="true"
              title="Uploads disabled for now"
            >
              Uploads disabled
            </button>
          </div>

          {/* Upload Resource Popup Form */}
          {showUploadForm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-4 w-full max-w-md relative mx-2 sm:mx-0 overflow-y-auto" style={{ maxHeight: "95vh", minWidth: "0", width: "100%" }}>
                <button
                  className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowUploadForm(false)}
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Upload Resource</h2>
                <form className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subject Code</label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 dark:border-zinc-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-400 min-w-0 mb-2 transition-colors duration-150 hover:border-orange-300 hover:bg-orange-50/30 dark:hover:bg-orange-900/30 hover:shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                        value={uploadForm.subjectCode}
                        onChange={(e) => setUploadForm({ ...uploadForm, subjectCode: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subject Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 dark:border-zinc-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-400 min-w-0 mb-2 transition-colors duration-150 hover:border-orange-300 hover:bg-orange-50/30 dark:hover:bg-orange-900/30 hover:shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                        value={uploadForm.subjectName}
                        onChange={(e) => setUploadForm({ ...uploadForm, subjectName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Type</label>
                      <div className="relative" ref={typeDropdownRef}>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between rounded-md border border-gray-200 dark:border-zinc-600 px-3 py-2 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-400 mb-2 transition-colors duration-150 hover:border-orange-300 hover:bg-orange-50/30 dark:hover:bg-orange-900/30 text-gray-900 dark:text-gray-100"
                          onClick={() => setShowTypeDropdown((prev) => !prev)}
                          tabIndex={0}
                        >
                          <span>{uploadForm.type}</span>
                          <span className="flex items-center justify-center h-full">
                            <img src="/down.svg" alt="Dropdown arrow" className="w-2 h-2 text-gray-200" />
                          </span>
                        </button>
                        {showTypeDropdown && (
                          <div className="absolute left-0 right-0 mt-1 z-10 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-md shadow-lg">
                            {["Mid Sem", "End Sem"].map((type) => (
                              <button
                                key={type}
                                type="button"
                                className={`w-full text-left px-3 text-sm hover:bg-orange-100 dark:hover:bg-orange-900 rounded-md transition-colors ${
                                  uploadForm.type === type ? "bg-orange-50 dark:bg-orange-900 font-semibold text-orange-700 dark:text-orange-300" : "text-gray-700 dark:text-gray-300"
                                }`}
                                onClick={() => {
                                  setUploadForm({ ...uploadForm, type });
                                  setShowTypeDropdown(false);
                                }}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Semester</label>
                      <div className="relative" ref={semesterDropdownRef}>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between rounded-md border border-gray-200 dark:border-zinc-600 px-3 py-1 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-400 mb-2 transition-colors duration-150 hover:border-orange-300 hover:bg-orange-50/30 dark:hover:bg-orange-900/30 text-gray-900 dark:text-gray-100"
                          onClick={() => setShowSemesterDropdown((prev) => !prev)}
                          tabIndex={0}
                        >
                          <span>{uploadForm.semester}</span>
                          <span className="flex items-center justify-center h-full">
                            <img src="/down.svg" alt="Dropdown arrow" className="w-2 h-2 text-gray-200" />
                          </span>
                        </button>
                        {showSemesterDropdown && (
                          <div className="absolute left-0 right-0 z-10 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-md shadow-lg">
                            {semesters.map((sem) => (
                              <button
                                key={sem}
                                type="button"
                                className={`w-full text-left px-3 text-sm hover:bg-orange-100 dark:hover:bg-orange-900 rounded-md transition-colors ${
                                  uploadForm.semester === sem ? "bg-orange-50 dark:bg-orange-900 font-semibold text-orange-700 dark:text-orange-300" : "text-gray-700 dark:text-gray-300"
                                }`}
                                onClick={() => {
                                  setUploadForm({ ...uploadForm, semester: sem });
                                  setShowSemesterDropdown(false);
                                }}
                              >
                                {sem}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Year</label>
                      <div className="relative" ref={uploadYearDropdownRef}>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between rounded-md border border-gray-200 dark:border-zinc-600 px-3 py-1 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-400 mb-2 transition-colors duration-150 hover:border-orange-300 hover:bg-orange-50/30 dark:hover:bg-orange-900/30 text-gray-900 dark:text-gray-100"
                          onClick={() => setShowUploadYearDropdown((prev) => !prev)}
                          tabIndex={0}
                          aria-haspopup="listbox"
                          aria-expanded={showUploadYearDropdown}
                        >
                          <span>{uploadForm.year}</span>
                          <span className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
                            {showUploadYearDropdown ? (
                              <FiChevronUp className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <FiChevronDown className="h-4 w-4" aria-hidden="true" />
                            )}
                          </span>
                        </button>
                        {showUploadYearDropdown && (
                          <div className="absolute left-0 right-0 z-10 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-md shadow-lg">
                            {years.map((year) => (
                              <button
                                key={year}
                                type="button"
                                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-orange-100 dark:hover:bg-orange-900 rounded-md transition-colors ${
                                  uploadForm.year === year ? "bg-orange-50 dark:bg-orange-900 font-semibold text-orange-700 dark:text-orange-300" : "text-gray-700 dark:text-gray-300"
                                }`}
                                onClick={() => {
                                  setUploadForm({ ...uploadForm, year });
                                  setShowUploadYearDropdown(false);
                                }}
                                role="option"
                                aria-selected={uploadForm.year === year}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Branch</label>
                      <div className="relative" ref={branchDropdownRef}>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between rounded-md border border-gray-200 dark:border-zinc-600 px-3 py-1 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-400 mb-2 transition-colors duration-150 hover:border-orange-300 hover:bg-orange-50/30 dark:hover:bg-orange-900/30 text-gray-900 dark:text-gray-100"
                          onClick={() => setShowBranchDropdown((prev) => !prev)}
                          tabIndex={0}
                        >
                          <span>{uploadForm.branch}</span>
                          <span className="flex items-center justify-center h-full">
                            <img src="/down.svg" alt="Dropdown arrow" className="w-2 h-2 text-gray-200" />
                          </span>
                        </button>
                        {showBranchDropdown && (
                          <div className="absolute left-0 right-0 z-10 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-md shadow-lg">
                            {branches.map((branch) => (
                              <button
                                key={branch}
                                type="button"
                                className={`w-full text-left px-3 text-sm hover:bg-orange-100 dark:hover:bg-orange-900 rounded-md transition-colors ${
                                  uploadForm.branch === branch ? "bg-orange-50 dark:bg-orange-900 font-semibold text-orange-700 dark:text-orange-300" : "text-gray-700 dark:text-gray-300"
                                }`}
                                onClick={() => {
                                  setUploadForm({ ...uploadForm, branch });
                                  setShowBranchDropdown(false);
                                }}
                              >
                                {branch}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Upload File (PDF)</label>
                    <div className="w-full min-w-0 mb-2">
                      <FileDropZone onFileAccepted={setUploadFile} />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium mt-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    onClick={async () => {
                      if (!uploadFile) {
                        alert("Please upload a PDF file.");
                        return;
                      }
                      const romanToNum = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
                      const semesterNum = romanToNum[uploadForm.semester] || 1;
                      const yearNum = parseInt(uploadForm.year) || 2023;
                      const formData = new FormData();
                      formData.append("subjectCode", uploadForm.subjectCode);
                      formData.append("subjectName", uploadForm.subjectName);
                      formData.append("type", uploadForm.type);
                      formData.append("semester", semesterNum);
                      formData.append("year", yearNum);
                      formData.append("branch", uploadForm.branch);
                      formData.append("file", uploadFile);
                      try {
                        const response = await fetch("http://localhost:8080/api/resources/upload", {
                          method: "POST",
                          body: formData,
                        });
                        if (!response.ok) {
                          throw new Error("Failed to upload resource");
                        }
                        alert("Resource uploaded successfully!");
                        setShowUploadForm(false);
                        fetchExamPapers();
                      } catch (err) {
                        alert("Error uploading resource: " + err.message);
                      }
                    }}
                  >
                    Upload
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="flex-1 space-y-6 w-full">
            {/* Select Semester */}
            <div>
              <div className="bg-gradient-to-r from-blue-400 to-purple-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
                <h2 className="text-sm font-medium">Select Your Semester</h2>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2" role="radiogroup" aria-label="Select semester">
                {semesters.map((sem) => {
                  const selected = selectedSemester === sem;
                  const base = "px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 hover:scale-[1.02] active:scale-[0.98]";
                  const active = "bg-orange-500 text-white border-orange-500 shadow-sm";
                  const inactive = "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-600 hover:bg-orange-50 dark:hover:bg-orange-900/40 hover:border-orange-300/70 dark:hover:border-orange-400/40";
                  return (
                    <button
                      key={sem}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setSelectedSemester(sem)}
                      className={`${base} ${selected ? active : inactive}`}
                    >
                      {selected && <FiCheck className="inline mr-2 -ml-0.5 h-4 w-4" aria-hidden="true" />}
                      {sem}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Branch */}
            <div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
                <h2 className="text-sm font-medium">Select Your Branch</h2>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2" role="radiogroup" aria-label="Select branch">
                {branches.map((branch) => {
                  const selected = selectedBranch === branch;
                  const base = "px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 hover:scale-[1.02] active:scale-[0.98]";
                  const branchActiveMap = {
                    CSE: "bg-sky-500 text-white border-sky-500",
                    ECE: "bg-violet-500 text-white border-violet-500",
                    MAE: "bg-emerald-500 text-white border-emerald-500",
                    MNC: "bg-rose-500 text-white border-rose-500",
                  };
                  const active = branchActiveMap[branch] || "bg-orange-500 text-white border-orange-500";
                  const inactive = "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-600 hover:bg-orange-50 dark:hover:bg-orange-900/40 hover:border-orange-300/70 dark:hover:border-orange-400/40";
                  return (
                    <button
                      key={branch}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setBranch(branch)}
                      className={`${base} ${selected ? active : inactive}`}
                    >
                      {selected && <FiCheck className="inline mr-2 -ml-0.5 h-4 w-4" aria-hidden="true" />}
                      {branch}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Exam Type */}
            <div>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
                <h2 className="text-sm font-medium">Select Exam Type</h2>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2" role="radiogroup" aria-label="Select exam type">
                {examTypes.map((examType) => {
                  const selected = selectedExamType === examType;
                  const base = "px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 hover:scale-[1.02] active:scale-[0.98]";
                  const active = "bg-orange-500 text-white border-orange-500 shadow-sm";
                  const inactive = "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-600 hover:bg-orange-50 dark:hover:bg-orange-900/40 hover:border-orange-300/70 dark:hover:border-orange-400/40";
                  return (
                    <button
                      key={examType}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setSelectedExamType(examType)}
                      className={`${base} ${selected ? active : inactive}`}
                    >
                      {selected && <FiCheck className="inline mr-2 -ml-0.5 h-4 w-4" aria-hidden="true" />}
                      {examType}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-gray-800 dark:text-gray-200">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/40">Semester</span>
              <span className="font-semibold">{selectedSemester}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 dark:bg-fuchsia-900/20 dark:text-fuchsia-300 dark:border-fuchsia-900/40">Branch</span>
              <span className="font-semibold">{selectedBranch}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/40">Exam Type</span>
              <span className="font-semibold">{selectedExamType}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 relative">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/40 text-sm">Year</span>
            <div className="relative" ref={yearDropdownRef}>
              <button
                type="button"
                className="inline-flex items-center justify-between rounded-lg border border-gray-300 dark:border-zinc-600 px-3 h-7 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-400 text-gray-900 dark:text-gray-100 min-w-[88px]"
                onClick={() => setShowYearDropdown((prev) => !prev)}
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={showYearDropdown}
              >
                <span>{selectedYear}</span>
                <span className="ml-2 flex items-center text-gray-600 dark:text-gray-300">
                  {showYearDropdown ? (
                    <FiChevronUp className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <FiChevronDown className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
              </button>
              {showYearDropdown && (
                <div className="absolute right-0 mt-1 z-10 w-28 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-md shadow-lg">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-orange-100 dark:hover:bg-orange-900 rounded-md transition-colors ${
                        selectedYear === year ? "bg-orange-50 dark:bg-orange-900 font-semibold text-orange-700 dark:text-orange-300" : "text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => {
                        setSelectedYear(year);
                        setShowYearDropdown(false);
                      }}
                      role="option"
                      aria-selected={selectedYear === year}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exam Papers Grid */}
        <div className="mt-6 flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {examPapers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamVault;
