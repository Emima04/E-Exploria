import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Brain, Star, Save, ShieldAlert } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import heroBackground from "../assets/bg-spaceship.jpg";
import { useAuth } from "../context/AuthContext";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  rating: number;
}

const DEFAULT_SKILLS: SkillItem[] = [
  { id: "1", name: "HTML5 Structured Markup", category: "Frontend", rating: 4 },
  { id: "2", name: "CSS3 Matrix Grids & Flexbox", category: "Frontend", rating: 3 },
  { id: "3", name: "JavaScript Async Flow & Loops", category: "Frontend", rating: 2 },
  { id: "4", name: "Relational Queries & SQL", category: "Database", rating: 1 },
];

export default function SkillsPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Frontend");
  const [newSkillRating, setNewSkillRating] = useState(3);
  const [message, setMessage] = useState("");

  const userEmail = user?.email || "guest";

  // Load skills
  useEffect(() => {
    const saved = localStorage.getItem(`skills_${userEmail}`);
    if (saved) {
      try {
        setSkills(JSON.parse(saved));
      } catch {
        setSkills(DEFAULT_SKILLS);
      }
    } else {
      setSkills(DEFAULT_SKILLS);
    }
  }, [userEmail]);

  // Save skills helper
  const saveSkillsList = (list: SkillItem[]) => {
    setSkills(list);
    localStorage.setItem(`skills_${userEmail}`, JSON.stringify(list));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newItem: SkillItem = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      category: newSkillCategory,
      rating: newSkillRating,
    };

    const updated = [newItem, ...skills];
    saveSkillsList(updated);
    setNewSkillName("");
    setNewSkillRating(3);
    setMessage("Skill registered in neural catalog!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteSkill = (id: string) => {
    const updated = skills.filter((item) => item.id !== id);
    saveSkillsList(updated);
  };

  return (
    <div className="relative min-h-screen overflow-y-auto pb-10 text-white">
      {/* Background */}
      <img
        src={heroBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center brightness-110 contrast-110 saturate-125 scale-105"
      />
      <div className="absolute inset-0 bg-[#020617]/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#38bdf855,transparent_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#02061766]" />

      <div className="relative z-10">
        <Navbar />

        <div className="mx-auto mt-8 grid w-[94%] grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            {/* Header Title Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-8 backdrop-blur-xl"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
                  <Brain size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-wide text-cyan-300">EXPLORER SKILLS INVENTORY</h1>
                  <p className="text-sm text-gray-400 mt-1">
                    Catalog your operational abilities and update your neural telemetry profile.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Grid Layout for Skills Form & List */}
            <div className="grid grid-cols-12 gap-6">
              {/* Add Skill Form Card */}
              <div className="col-span-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl h-fit space-y-5"
                >
                  <h2 className="text-xl font-bold text-cyan-300 border-b border-cyan-500/10 pb-3 flex items-center gap-2">
                    <Plus size={20} /> Register New Skill
                  </h2>

                  <form onSubmit={handleAddSkill} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Skill Name</label>
                      <input
                        type="text"
                        placeholder="e.g. React Native, Go API, Python..."
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/40 p-3 text-sm focus:border-cyan-400 focus:outline-none transition text-white"
                        maxLength={50}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value)}
                        className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/40 p-3 text-sm focus:border-cyan-400 focus:outline-none transition text-white [&>option]:bg-slate-950"
                      >
                        <option value="Frontend">Frontend Development</option>
                        <option value="Backend">Backend Systems</option>
                        <option value="Database">Database Management</option>
                        <option value="AI">AI & Machine Learning</option>
                        <option value="CyberSecurity">Cyber Security</option>
                        <option value="General">Other Skill</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Proficiency</label>
                      <div className="flex items-center gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewSkillRating(star)}
                            className="transition hover:scale-110"
                          >
                            <Star
                              size={24}
                              className={star <= newSkillRating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-bold text-black hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] cursor-pointer"
                    >
                      <Save size={16} /> Update Inventory
                    </button>
                  </form>

                  {message && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-lg"
                    >
                      {message}
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Skills List Card */}
              <div className="col-span-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl min-h-[400px] space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3">
                    <h2 className="text-xl font-bold text-cyan-300">Neural Skill Index</h2>
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                      {skills.length} Registered
                    </span>
                  </div>

                  {skills.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-3">
                      <ShieldAlert size={48} className="text-gray-600" />
                      <p className="text-sm">No capabilities cataloged yet. Please register your skills.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <AnimatePresence>
                        {skills.map((skill) => (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:border-cyan-500/30 transition flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-slate-700">
                                  {skill.category}
                                </span>
                                <button
                                  onClick={() => handleDeleteSkill(skill.id)}
                                  className="text-gray-500 hover:text-red-400 transition cursor-pointer opacity-0 group-hover:opacity-100"
                                  title="Remove skill"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                              <h3 className="font-bold text-gray-200 text-sm leading-snug">{skill.name}</h3>
                            </div>

                            <div className="mt-4 flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={14}
                                  className={star <= skill.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}
                                />
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
