import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FacultyHeader from "../components/faculty/FacultyHeader";
import FacultySidebar from "../components/faculty/FacultySidebar";
import AICompanion from "../components/AICompanion";
import OverviewCards from "../components/faculty/OverviewCards";
import StudentProgress from "../components/faculty/StudentProgress";
import RecentActivity from "../components/faculty/RecentActivity";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Plus, Edit2, Trash2, Check, BookOpen, MessageSquare, AlertCircle, FileText, HelpCircle, Users, Award, Settings } from "lucide-react";

export default function Faculty() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Aggregate stats state
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeMissions: 0,
    completedMissions: 0,
    averageXp: 0,
  });

  // Global loading states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Missions Tab States
  const [missions, setMissions] = useState<any[]>([]);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [editingMission, setEditingMission] = useState<any>(null);
  const [missionForm, setMissionForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    xp_reward: 100,
    status: "Active",
    domain_key: "HTML5",
  });

  // Questions Tab States
  const [selectedMissionId, setSelectedMissionId] = useState<string>("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [questionForm, setQuestionForm] = useState({
    q: "",
    opt1: "",
    opt2: "",
    opt3: "",
    correct: 0,
    xp: 20,
  });

  // Students Tab States
  const [students, setStudents] = useState<any[]>([]);
  const [studentAchievements, setStudentAchievements] = useState<any[]>([]);

  // Materials & Announcements Tab States
  const [materials, setMaterials] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    subject: "General",
    url: "",
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
  });

  // Clear messages after 4 seconds
  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  useEffect(() => {
    setProfileName(user?.explorer_name || "");
    setProfileEmail(user?.email || "");
  }, [user]);

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileSaving(true);
    try {
      const response = await api.put("/profile", { explorer_name: profileName, email: profileEmail });
      login(response.data.user, localStorage.getItem("token") || undefined);
      setSuccessMsg("Faculty profile updated successfully.");
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Could not update faculty profile.");
    } finally {
      setProfileSaving(false);
    }
  };


  // Load stats and related datasets based on path
  useEffect(() => {
    if (user?.role !== "faculty") return;

    // Load overall statistics
    api.get("/faculty/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading faculty stats", err));

    if (!tab || tab === "dashboard") {
      // Dashboard overview items
      api.get("/missions").then((res) => setMissions(res.data.missions || []));
      api.get("/faculty/students").then((res) => setStudents(res.data.students || []));
    } else if (tab === "missions") {
      loadMissions();
    } else if (tab === "quizzes") {
      loadMissions();
    } else if (tab === "students" || tab === "reports") {
      api.get("/faculty/students")
        .then((res) => setStudents(res.data.students || []))
        .catch((err) => console.error("Error loading students list", err));
    } else if (tab === "achievements") {
      api.get("/faculty/achievements")
        .then((res) => setStudentAchievements(res.data.student_achievements || []))
        .catch((err) => console.error("Error loading achievements", err));
    } else if (tab === "materials" || tab === "announcements") {
      loadMaterialsAndAnnouncements();
    }
  }, [tab, user]);

  // Fetch Questions when mission changes inside Quizzes tab
  useEffect(() => {
    if (tab === "quizzes" && selectedMissionId) {
      loadQuestions(selectedMissionId);
    } else {
      setQuestions([]);
    }
  }, [selectedMissionId, tab]);

  const loadMissions = () => {
    setLoading(true);
    api.get("/missions")
      .then((res) => {
        setMissions(res.data.missions || []);
        if (res.data.missions?.length > 0 && !selectedMissionId) {
          setSelectedMissionId(res.data.missions[0].id.toString());
        }
      })
      .catch(() => setErrorMsg("Failed to load missions list."))
      .finally(() => setLoading(false));
  };

  const loadQuestions = (mId: string) => {
    setLoading(true);
    api.get(`/missions/${mId}/questions`)
      .then((res) => setQuestions(res.data.questions || []))
      .catch(() => setErrorMsg("Failed to load questions list for this mission."))
      .finally(() => setLoading(false));
  };

  const loadMaterialsAndAnnouncements = () => {
    setLoading(true);
    Promise.all([api.get("/materials"), api.get("/announcements")])
      .then(([matRes, annRes]) => {
        setMaterials(matRes.data.materials || []);
        setAnnouncements(annRes.data.announcements || []);
      })
      .catch(() => setErrorMsg("Failed to load materials or announcements."))
      .finally(() => setLoading(false));
  };

  // --- MISSION OPERATIONS ---
  const handleSaveMission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMission) {
        await api.put(`/faculty/missions/${editingMission.id}`, missionForm);
        setSuccessMsg("Mission updated successfully!");
      } else {
        await api.post("/faculty/missions", missionForm);
        setSuccessMsg("Mission created successfully!");
      }
      setShowMissionModal(false);
      setEditingMission(null);
      setMissionForm({ title: "", description: "", difficulty: "Easy", xp_reward: 100, status: "Active", domain_key: "HTML5" });
      loadMissions();
    } catch (err) {
      setErrorMsg("Failed to save mission. Check input formats.");
    }
  };

  const handleDeleteMission = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this mission? All associated questions will be deleted.")) return;
    try {
      await api.delete(`/faculty/missions/${id}`);
      setSuccessMsg("Mission deleted successfully!");
      loadMissions();
    } catch (err) {
      setErrorMsg("Failed to delete mission.");
    }
  };

  // --- QUESTION OPERATIONS ---
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMissionId) return;

    const payload = {
      mission_id: parseInt(selectedMissionId, 10),
      q: questionForm.q,
      options: [questionForm.opt1, questionForm.opt2, questionForm.opt3],
      correct: questionForm.correct,
      xp: questionForm.xp,
    };

    try {
      if (editingQuestion) {
        await api.put(`/faculty/questions/${editingQuestion.ID}`, payload);
        setSuccessMsg("Question updated successfully!");
      } else {
        await api.post("/faculty/questions", payload);
        setSuccessMsg("Question added successfully!");
      }
      setShowQuestionModal(false);
      setEditingQuestion(null);
      setQuestionForm({ q: "", opt1: "", opt2: "", opt3: "", correct: 0, xp: 20 });
      loadQuestions(selectedMissionId);
    } catch (err) {
      setErrorMsg("Failed to save question.");
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await api.delete(`/faculty/questions/${id}`);
      setSuccessMsg("Question deleted successfully!");
      loadQuestions(selectedMissionId);
    } catch (err) {
      setErrorMsg("Failed to delete question.");
    }
  };

  // --- MATERIALS & ANNOUNCEMENTS OPERATIONS ---
  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/faculty/materials", materialForm);
      setSuccessMsg("Study material uploaded successfully!");
      setMaterialForm({ title: "", description: "", subject: "General", url: "" });
      loadMaterialsAndAnnouncements();
    } catch (err) {
      setErrorMsg("Failed to post study material.");
    }
  };

  const handleDeleteMaterial = async (id: number) => {
    if (!window.confirm("Delete this reference material?")) return;
    try {
      await api.delete(`/faculty/materials/${id}`);
      setSuccessMsg("Material removed.");
      loadMaterialsAndAnnouncements();
    } catch (err) {
      setErrorMsg("Failed to delete material.");
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/faculty/announcements", announcementForm);
      setSuccessMsg("Announcement broadcast successfully!");
      setAnnouncementForm({ title: "", content: "" });
      loadMaterialsAndAnnouncements();
    } catch (err) {
      setErrorMsg("Failed to post announcement.");
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!window.confirm("Delete announcement?")) return;
    try {
      await api.delete(`/faculty/announcements/${id}`);
      setSuccessMsg("Announcement deleted.");
      loadMaterialsAndAnnouncements();
    } catch (err) {
      setErrorMsg("Failed to delete announcement.");
    }
  };

  // Render Sub-Views based on current tab path parameter
  const renderTabContent = () => {
    if (loading && missions.length === 0 && students.length === 0) {
      return (
        <div className="p-8 text-center text-cyan-400 font-mono animate-pulse">
          ACCESSING DATABANK NODE...
        </div>
      );
    }

    switch (tab) {
      case "missions":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#071526cc] p-5 rounded-2xl border border-cyan-500/20">
              <div>
                <h2 className="text-xl font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-2">
                  <FileText size={20} /> MISSION PATH MANAGEMENT
                </h2>
                <p className="text-xs text-gray-400 mt-1">Configure active exploration target paths, difficulty nodes and XP gains.</p>
              </div>
              <button
                onClick={() => {
                  setEditingMission(null);
                  setMissionForm({ title: "", description: "", difficulty: "Easy", xp_reward: 100, status: "Active", domain_key: "HTML5" });
                  setShowMissionModal(true);
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-xl font-black text-xs font-mono tracking-widest cursor-pointer flex items-center gap-2"
              >
                <Plus size={16} /> CREATE MISSION
              </button>
            </div>

            <div className="grid gap-4">
              {missions.map((m) => (
                <div key={m.id} className="bg-[#07101d99] border border-cyan-500/10 hover:border-cyan-500/30 rounded-2xl p-5 flex items-center justify-between transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold font-mono tracking-widest bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                        {m.title}
                      </span>
                      <h3 className="font-bold text-white text-base">{m.subtitle}</h3>
                    </div>
                    <p className="text-xs text-gray-400 max-w-xl">{m.description}</p>
                    <div className="flex items-center gap-6 pt-2 text-[10px] font-mono text-slate-400">
                      <span>XP REWARD: <b className="text-yellow-400">{m.xp} XP</b></span>
                      <span>DIFFICULTY: <b className="text-purple-400">{m.difficulty || 'Easy'}</b></span>
                      <span>STATUS: <b className={m.status === 'Active' ? 'text-green-400' : 'text-amber-400'}>{m.status || 'Active'}</b></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingMission(m);
                        setMissionForm({
                          title: m.subtitle,
                          description: m.description,
                          difficulty: m.difficulty || "Easy",
                          xp_reward: m.xp,
                          status: m.status || "Active",
                          domain_key: m.title,
                        });
                        setShowMissionModal(true);
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40 cursor-pointer"
                      title="Edit Mission"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteMission(m.id)}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 hover:border-rose-500/40 cursor-pointer"
                      title="Delete Mission"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "quizzes":
        return (
          <div className="space-y-6">
            <div className="bg-[#071526cc] p-5 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-2">
                  <HelpCircle size={20} /> SYSTEM DECRYPTION QUIZ BUILDER
                </h2>
                <p className="text-xs text-gray-400 mt-1">Associate verification question payloads with decryptable target nodes.</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedMissionId}
                  onChange={(e) => setSelectedMissionId(e.target.value)}
                  className="bg-[#091625] border border-slate-800 text-xs font-mono text-cyan-300 px-3 py-2.5 rounded-xl outline-none"
                >
                  <option value="" disabled>Select Mission</option>
                  {missions.map((m) => (
                    <option key={m.id} value={m.id}>{m.title} - {m.subtitle}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    if (!selectedMissionId) {
                      setErrorMsg("Please select a mission first.");
                      return;
                    }
                    setEditingQuestion(null);
                    setQuestionForm({ q: "", opt1: "", opt2: "", opt3: "", correct: 0, xp: 20 });
                    setShowQuestionModal(true);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-xl font-black text-xs font-mono tracking-widest cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus size={16} /> ADD QUESTION
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="bg-[#07101d66] border border-dashed border-cyan-500/10 rounded-2xl p-10 text-center text-gray-400 text-sm">
                  Select a mission or add question payloads to load nodes.
                </div>
              ) : (
                questions.map((q, idx) => (
                  <div key={q.ID} className="bg-[#07101d99] border border-cyan-500/10 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">SHARD {idx + 1} // XP VALUE: {q.xp} XP</span>
                        <h4 className="text-sm font-bold text-white mt-1">{q.q}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setQuestionForm({
                              q: q.q,
                              opt1: q.options[0] || "",
                              opt2: q.options[1] || "",
                              opt3: q.options[2] || "",
                              correct: q.correct,
                              xp: q.xp,
                            });
                            setShowQuestionModal(true);
                          }}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40 cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.ID)}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 hover:border-rose-500/40 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {q.options.map((opt: string, oIdx: number) => {
                        const isCorrect = oIdx === q.correct;
                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                              isCorrect
                                ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-400"
                                : "bg-slate-950/60 border-slate-900 text-slate-400"
                            }`}
                          >
                            <span>{opt}</span>
                            {isCorrect && <Check size={14} className="text-emerald-400" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "students":
        return (
          <div className="space-y-6">
            <div className="bg-[#071526cc] p-5 rounded-2xl border border-cyan-500/20">
              <h2 className="text-xl font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-2">
                <Users size={20} /> REGISTERED EXPLORER DIRECTORY
              </h2>
              <p className="text-xs text-gray-400 mt-1">Audit active explorer database parameters, experience levels, and login streaks.</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-cyan-500/10 bg-[#07101d99] shadow-2xl">
              <table className="w-full min-w-[760px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-cyan-500/10 text-cyan-400 font-mono uppercase bg-slate-950/50">
                    <th className="p-4">Explorer Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4 text-center">XP Points</th>
                    <th className="p-4 text-center">Calculated Level</th>
                    <th className="p-4 text-center">Active Streak</th>
                    <th className="p-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/5">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">No student explorers have registered in the database.</td>
                    </tr>
                  ) : (
                    students.map((st) => (
                      <tr key={st.ID} className="hover:bg-cyan-500/5 transition-colors">
                        <td className="p-4 font-bold text-white flex items-center gap-3.5">
                          <div className="h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-400 text-cyan-400 flex items-center justify-center font-bold text-xs">
                            {st.explorer_name?.charAt(0).toUpperCase() || 'E'}
                          </div>
                          {st.explorer_name}
                        </td>
                        <td className="p-4 text-gray-300 font-mono">{st.email}</td>
                        <td className="p-4 text-center text-yellow-400 font-black">{st.xp} XP</td>
                        <td className="p-4 text-center font-bold text-white">Level {st.level}</td>
                        <td className="p-4 text-center text-orange-400 font-black">🔥 {st.streak} Days</td>
                        <td className="p-4 text-slate-400 font-mono">{st.last_active || "No claim history"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div className="bg-[#071526cc] p-5 rounded-2xl border border-cyan-500/20">
              <h2 className="text-xl font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-2">
                <Users size={20} /> STUDENT PROGRESS REPORTS
              </h2>
              <p className="text-xs text-gray-400 mt-1">Review real student XP, levels, streaks, and recorded activity.</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-cyan-500/10 bg-[#07101d99] shadow-2xl">
              <table className="w-full min-w-[680px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-cyan-500/10 text-cyan-400 font-mono uppercase bg-slate-950/50">
                    <th className="p-4">Student</th>
                    <th className="p-4 text-center">XP</th>
                    <th className="p-4 text-center">Level</th>
                    <th className="p-4 text-center">Streak</th>
                    <th className="p-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/5">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">No student data is available yet.</td>
                    </tr>
                  ) : (
                    students.map((st) => (
                      <tr key={st.ID} className="hover:bg-cyan-500/5 transition-colors">
                        <td className="p-4 font-bold text-white">{st.explorer_name}</td>
                        <td className="p-4 text-center text-yellow-400 font-black">{st.xp} XP</td>
                        <td className="p-4 text-center font-bold">Level {st.level}</td>
                        <td className="p-4 text-center text-orange-400 font-black">{st.streak} days</td>
                        <td className="p-4 text-slate-400 font-mono">{st.last_active || "No activity recorded"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "achievements":
        return (
          <div className="space-y-6">
            <div className="bg-[#071526cc] p-5 rounded-2xl border border-cyan-500/20">
              <h2 className="text-xl font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-2">
                <Award size={20} /> ACHIEVEMENT CATALOG
              </h2>
              <p className="text-xs text-gray-400 mt-1">Track achievement unlocks earned by registered student explorers.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {studentAchievements.length === 0 ? (
                <div className="md:col-span-2 rounded-2xl border border-dashed border-cyan-500/20 p-8 text-center text-gray-400">No registered students have unlocked an achievement yet.</div>
              ) : studentAchievements.map((student) => (
                <div key={student.student_id} className="rounded-2xl border border-cyan-500/10 bg-[#07101d99] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white">{student.student_name}</h3>
                      <p className="mt-1 text-xs text-gray-400">Real achievements unlocked by this student</p>
                    </div>
                    <Award size={22} className="shrink-0 text-yellow-400" />
                  </div>
                  <div className="mt-5 border-t border-cyan-500/10 pt-3 text-xs font-mono text-cyan-300">
                    {student.achievements.length === 0 ? "No achievements unlocked yet" : student.achievements.map((achievement: any) => achievement.title).join("  |  ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "assistant":
        return (
          <div className="space-y-6">
            <div className="bg-[#071526cc] p-5 rounded-2xl border border-cyan-500/20">
              <h2 className="text-xl font-bold text-cyan-300 font-mono tracking-wider">ARCHIE AI ASSISTANT</h2>
              <p className="text-xs text-gray-400 mt-1">Ask Archie for help with missions, lessons, and student learning support.</p>
            </div>
            <AICompanion />
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div className="bg-[#071526cc] p-6 rounded-2xl border border-cyan-500/20">
              <h2 className="text-xl font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-2">
                <Settings size={20} /> FACULTY SETTINGS
              </h2>
              <p className="text-xs text-gray-400 mt-2">Manage the faculty account connected to this workspace.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="max-w-2xl rounded-2xl border border-cyan-500/10 bg-[#07101d99] p-6 space-y-5">
              <div className="flex items-center gap-4 border-b border-cyan-500/10 pb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400 text-xl font-bold text-black">{user?.explorer_name?.charAt(0).toUpperCase() || "F"}</div>
                <div><h3 className="text-lg font-bold text-white">Faculty profile</h3><p className="text-xs text-gray-400">Update the real account details used by the workspace.</p></div>
              </div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400">Faculty Name<input value={profileName} onChange={(event) => setProfileName(event.target.value)} required maxLength={80} className="mt-2 w-full rounded-xl border border-slate-800 bg-[#091625] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" /></label>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400">Email Address<input type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-800 bg-[#091625] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" /></label>
              <div className="flex items-center justify-between border-t border-cyan-500/10 pt-4 text-xs"><span className="text-gray-400">Role: <strong className="text-cyan-200">{user?.role || "faculty"}</strong></span><button type="submit" disabled={profileSaving} className="rounded-xl bg-cyan-400 px-5 py-2.5 font-black text-black disabled:opacity-50">{profileSaving ? "SAVING..." : "SAVE PROFILE"}</button></div>
            </form>
          </div>
        );

      case "materials":
      case "announcements":
        return (
          <div className="grid grid-cols-1 gap-6">
            {/* Announcements Panel */}
            {tab === "announcements" && <div className="space-y-4">
              <div className="bg-[#071526cc] p-5 rounded-2xl border border-cyan-500/20">
                <h3 className="font-bold text-sm text-cyan-300 font-mono tracking-wider flex items-center gap-2">
                  <MessageSquare size={16} /> FACULTY ANNOUNCEMENTS
                </h3>
              </div>

              <form onSubmit={handleSaveAnnouncement} className="bg-[#07101d99] border border-cyan-500/10 p-5 rounded-2xl space-y-4">
                <input
                  type="text"
                  placeholder="Announcement Title"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full bg-[#091625] border border-slate-800 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500/50 text-white font-semibold"
                  required
                />
                <textarea
                  placeholder="Announcement message content..."
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  className="w-full h-24 bg-[#091625] border border-slate-800 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500/50 text-white font-medium resize-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs font-mono py-2.5 rounded-xl cursor-pointer"
                >
                  BROADCAST BULLETIN
                </button>
              </form>

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.ID} className="bg-[#07101d66] border border-slate-800 p-4 rounded-xl flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-white">{ann.title}</h4>
                      <p className="text-[11px] text-gray-400">{ann.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.ID)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>}

            {/* Study Reference Materials */}
            {tab === "materials" && <div className="space-y-4">
              <div className="bg-[#071526cc] p-5 rounded-2xl border border-cyan-500/20">
                <h3 className="font-bold text-sm text-cyan-300 font-mono tracking-wider flex items-center gap-2">
                  <BookOpen size={16} /> LEARNING REFERENCE MATERIALS
                </h3>
              </div>

              <form onSubmit={handleSaveMaterial} className="bg-[#07101d99] border border-cyan-500/10 p-5 rounded-2xl space-y-4">
                <input
                  type="text"
                  placeholder="Resource Document Title"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  className="w-full bg-[#091625] border border-slate-800 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500/50 text-white font-semibold"
                  required
                />
                <input
                  type="text"
                  placeholder="Resource URL Link (https://...)"
                  value={materialForm.url}
                  onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })}
                  className="w-full bg-[#091625] border border-slate-800 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500/50 text-white font-mono"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Short description"
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                    className="w-full bg-[#091625] border border-slate-800 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500/50 text-white"
                  />
                  <select
                    value={materialForm.subject}
                    onChange={(e) => setMaterialForm({ ...materialForm, subject: e.target.value })}
                    className="w-full bg-[#091625] border border-slate-800 text-xs px-3 py-2.5 rounded-xl outline-none text-gray-300"
                  >
                    <option value="General">General</option>
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="DBMS">DBMS</option>
                    <option value="AI">AI</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs font-mono py-2.5 rounded-xl cursor-pointer"
                >
                  UPLOAD RESOURCE LINK
                </button>
              </form>

              <div className="space-y-3">
                {materials.map((mat) => (
                  <div key={mat.ID} className="bg-[#07101d66] border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-xs text-white">{mat.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{mat.description || 'Reference Guide'}</p>
                      <a
                        href={mat.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-cyan-400 hover:underline font-mono block mt-1"
                      >
                        {mat.url}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDeleteMaterial(mat.ID)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>}
          </div>
        );

      default:
        // Dashboard Overview view
        return (
          <div className="space-y-6">
            <OverviewCards
              totalStudents={stats.totalStudents}
              activeMissions={stats.activeMissions}
              completedMissions={stats.completedMissions}
              averageXp={stats.averageXp}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mission Progress list */}
              <div className="bg-[#07101dcc] border border-cyan-500/12 rounded-2xl p-5">
                <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3 mb-4">
                  <h3 className="font-bold text-sm text-cyan-300 font-mono tracking-wider flex items-center gap-2">
                    <FileText size={16} /> RECENT EXPLORATION MISSIONS
                  </h3>
                  <button onClick={() => navigate("/faculty/missions")} className="text-xs text-cyan-400 hover:underline cursor-pointer">Manage</button>
                </div>
                <div className="space-y-3">
                  {missions.slice(0, 4).map((m) => (
                    <div key={m.id} className="flex justify-between items-center bg-[#091625]/60 border border-slate-900 p-3 rounded-xl">
                      <div>
                        <h4 className="font-bold text-xs text-white">{m.subtitle}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{m.title} Node // {m.xp} XP</p>
                      </div>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${m.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Overview details */}
              <StudentProgress
                total={stats.totalStudents}
                completed={stats.completedMissions}
                inProgress={stats.totalStudents - stats.completedMissions > 0 ? stats.totalStudents - stats.completedMissions : 0}
                notStarted={0}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Action Activity */}
              <div className="lg:col-span-2">
                <RecentActivity students={students} />
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-[#07101dcc] border border-cyan-500/12 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-sm text-cyan-300 font-mono tracking-wider flex items-center gap-2 border-b border-cyan-500/10 pb-3 mb-2">
                  ⚡ QUICK ACTIONS
                </h3>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <button
                    onClick={() => navigate("/faculty/missions")}
                    className="p-3 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/10 hover:border-cyan-500/30 text-left text-cyan-300 font-bold transition cursor-pointer"
                  >
                    🚀 Manage Mission Nodes
                  </button>
                  <button
                    onClick={() => navigate("/faculty/quizzes")}
                    className="p-3 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/10 hover:border-purple-500/30 text-left text-purple-300 font-bold transition cursor-pointer"
                  >
                    🧪 Edit Quiz Shard Payloads
                  </button>
                  <button
                    onClick={() => navigate("/faculty/materials")}
                    className="p-3 rounded-xl bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/10 hover:border-yellow-500/30 text-left text-yellow-300 font-bold transition cursor-pointer"
                  >
                    📖 Update Library References
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen text-white bg-slate-950 pb-16">
      <FacultyHeader />

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <FacultySidebar />
        </div>

        <main className="min-w-0 space-y-6 lg:col-span-9">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500 text-rose-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check size={14} /> {successMsg}
            </div>
          )}

          {renderTabContent()}
        </main>
      </div>

      {/* --- CREATE/EDIT MISSION MODAL --- */}
      {showMissionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm font-mono tracking-wider">
                {editingMission ? "EDIT EXPLORATION TARGET" : "CREATE NEW DECRYPTION NODE"}
              </h3>
              <button onClick={() => setShowMissionModal(false)} className="text-gray-400 hover:text-rose-400">✕</button>
            </div>

            <form onSubmit={handleSaveMission} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Mission Title</label>
                <input
                  type="text"
                  value={missionForm.title}
                  onChange={(e) => setMissionForm({ ...missionForm, title: e.target.value })}
                  className="w-full bg-[#0b1220] border border-slate-800 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500/50 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Description</label>
                <textarea
                  value={missionForm.description}
                  onChange={(e) => setMissionForm({ ...missionForm, description: e.target.value })}
                  className="w-full h-20 bg-[#0b1220] border border-slate-800 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500/50 text-white resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Domain Node</label>
                  <select
                    value={missionForm.domain_key}
                    onChange={(e) => setMissionForm({ ...missionForm, domain_key: e.target.value })}
                    className="w-full bg-[#0b1220] border border-slate-800 text-xs px-3 py-2.5 rounded-xl outline-none text-gray-200"
                  >
                    <option value="HTML5">HTML5</option>
                    <option value="CSS3">CSS3</option>
                    <option value="JS">JS (JavaScript)</option>
                    <option value="DBMS">DBMS</option>
                    <option value="AI">AI Core</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Difficulty</label>
                  <select
                    value={missionForm.difficulty}
                    onChange={(e) => setMissionForm({ ...missionForm, difficulty: e.target.value })}
                    className="w-full bg-[#0b1220] border border-slate-800 text-xs px-3 py-2.5 rounded-xl outline-none text-gray-200"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">XP Reward</label>
                  <input
                    type="number"
                    value={missionForm.xp_reward}
                    onChange={(e) => setMissionForm({ ...missionForm, xp_reward: parseInt(e.target.value, 10) })}
                    className="w-full bg-[#0b1220] border border-slate-800 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500/50 text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Publish Status</label>
                  <select
                    value={missionForm.status}
                    onChange={(e) => setMissionForm({ ...missionForm, status: e.target.value })}
                    className="w-full bg-[#0b1220] border border-slate-800 text-xs px-3 py-2.5 rounded-xl outline-none text-gray-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMissionModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-gray-400 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-mono font-black tracking-widest cursor-pointer"
                >
                  SAVE NODE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATE/EDIT QUESTION MODAL --- */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm font-mono tracking-wider">
                {editingQuestion ? "EDIT VERIFICATION SHARD" : "ADD QUESTION PAYLOAD"}
              </h3>
              <button onClick={() => setShowQuestionModal(false)} className="text-gray-400 hover:text-rose-400">✕</button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Question Text</label>
                <input
                  type="text"
                  value={questionForm.q}
                  onChange={(e) => setQuestionForm({ ...questionForm, q: e.target.value })}
                  className="w-full bg-[#0b1220] border border-slate-800 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500/50 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase block">Decryption Options</label>
                <input
                  type="text"
                  placeholder="Option 1"
                  value={questionForm.opt1}
                  onChange={(e) => setQuestionForm({ ...questionForm, opt1: e.target.value })}
                  className="w-full bg-[#0b1220] border border-slate-800 px-4 py-2 rounded-xl text-xs outline-none text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Option 2"
                  value={questionForm.opt2}
                  onChange={(e) => setQuestionForm({ ...questionForm, opt2: e.target.value })}
                  className="w-full bg-[#0b1220] border border-slate-800 px-4 py-2 rounded-xl text-xs outline-none text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Option 3"
                  value={questionForm.opt3}
                  onChange={(e) => setQuestionForm({ ...questionForm, opt3: e.target.value })}
                  className="w-full bg-[#0b1220] border border-slate-800 px-4 py-2 rounded-xl text-xs outline-none text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Correct Index</label>
                  <select
                    value={questionForm.correct}
                    onChange={(e) => setQuestionForm({ ...questionForm, correct: parseInt(e.target.value, 10) })}
                    className="w-full bg-[#0b1220] border border-slate-800 text-xs px-3 py-2.5 rounded-xl outline-none text-gray-200"
                  >
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">XP Reward</label>
                  <input
                    type="number"
                    value={questionForm.xp}
                    onChange={(e) => setQuestionForm({ ...questionForm, xp: parseInt(e.target.value, 10) })}
                    className="w-full bg-[#0b1220] border border-slate-800 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500/50 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-gray-400 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-mono font-black tracking-widest cursor-pointer"
                >
                  SAVE PAYLOAD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
