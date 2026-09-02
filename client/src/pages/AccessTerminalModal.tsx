import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bgSpaceship from "../assets/bg-spaceship.jpg";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface QuizQuestion {
  id: number;
  q: string;
  options: string[];
  correct: number;
}

interface DomainConfig {
  title: string;
  accentClass: string;
  glowColor: string;
  badge: string;
  questions: QuizQuestion[];
}

const FALLBACK_DOMAIN_DATA: Record<string, DomainConfig> = {
  DSA: {
    title: "Data Structures & Algorithms Core",
    accentClass: "border-cyan-400 text-cyan-300 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.25)]",
    glowColor: "#22d3ee",
    badge: "Primary Mission",
    questions: [
      { id: 1, q: "Which data structure follows the Last-In, First-Out (LIFO) principle?", options: ["Stack", "Queue", "Binary Tree"], correct: 0 },
      { id: 2, q: "Which operation removes the front element from a Queue?", options: ["Push", "Dequeue", "Pop"], correct: 1 },
      { id: 3, q: "What is the average time complexity for key lookup in a Hash Table?", options: ["O(1)", "O(n)", "O(log n)"], correct: 0 },
      { id: 4, q: "What terminating condition must every recursive function define?", options: ["Base Case", "Break Loop", "Pointer Reset"], correct: 0 },
      { id: 5, q: "Binary Search operates efficiently on what kind of array?", options: ["Sorted Array", "Reversed Array", "Unordered Array"], correct: 0 }
    ]
  },
  HTML5: {
    title: "HTML5 Matrix Node",
    accentClass: "border-cyan-500 text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    glowColor: "#22d3ee",
    badge: "Module 01",
    questions: [
      { id: 1, q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tabular Multi Language"], correct: 0 },
      { id: 2, q: "Which HTML tag is used for the largest heading?", options: ["<heading>", "<h6>", "<h1>"], correct: 2 },
      { id: 3, q: "What is the correct tag for a line break?", options: ["<br>", "<lb>", "<break>"], correct: 0 },
      { id: 4, q: "Which attribute is used to provide alternative text for an image?", options: ["alt", "src", "title"], correct: 0 },
      { id: 5, q: "How do you create a hyperlink in HTML?", options: ["<a href='url'>Link</a>", "<link url='url'>Link</link>", "<hyperlink src='url'>Link</hyperlink>"], correct: 0 }
    ]
  },
  CSS3: {
    title: "CSS3 Cascade Core",
    accentClass: "border-purple-500 text-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
    glowColor: "#c084fc",
    badge: "Module 02",
    questions: [
      { id: 1, q: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"], correct: 1 },
      { id: 2, q: "Where in an HTML document is the correct place to refer to an external style sheet?", options: ["In the <body> section", "At the end of the document", "In the <head> section"], correct: 2 },
      { id: 3, q: "Which property changes text color?", options: ["font-color", "color", "text-color"], correct: 1 },
      { id: 4, q: "How do you make all paragraphs bold?", options: ["p { font-weight: bold; }", "p { text-weight: bold; }", "p { font: bold; }"], correct: 0 },
      { id: 5, q: "Which property controls the space between lines of text?", options: ["line-height", "spacing", "text-height"], correct: 0 }
    ]
  },
  JS: {
    title: "JavaScript Core Stack",
    accentClass: "border-amber-400 text-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.15)]",
    glowColor: "#fbbf24",
    badge: "Module 03",
    questions: [
      { id: 1, q: "How do you write 'Hello World' in an alert box?", options: ["msg('Hello World');", "alertBox('Hello World');", "alert('Hello World');"], correct: 2 },
      { id: 2, q: "How do you create a function in JavaScript?", options: ["function myFunction()", "function:myFunction()", "function = myFunction()"], correct: 0 },
      { id: 3, q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "const"], correct: 1 },
      { id: 4, q: "What is the result of 2 + '2'?", options: ["4", "22", "TypeError"], correct: 1 },
      { id: 5, q: "How do you start a for loop?", options: ["for i = 0; i < 5; i++", "for (let i = 0; i < 5; i++)", "for (i < 5; i++)"], correct: 1 }
    ]
  },
  DBMS: {
    title: "DBMS Transaction Console",
    accentClass: "border-rose-500 text-rose-400 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
    glowColor: "#f43f5e",
    badge: "Module 04",
    questions: [
      { id: 1, q: "What does SQL stand for?", options: ["Structured Query Language", "Strong Question Language", "Structured Question Layout"], correct: 0 },
      { id: 2, q: "Which SQL statement is used to extract data from a database?", options: ["EXTRACT", "GET", "SELECT"], correct: 2 },
      { id: 3, q: "Which clause is used to filter rows?", options: ["WHERE", "FILTER", "ORDER BY"], correct: 0 },
      { id: 4, q: "Which SQL statement adds new rows to a table?", options: ["INSERT INTO", "ADD ROW", "UPDATE TABLE"], correct: 0 },
      { id: 5, q: "What keyword updates existing data in a table?", options: ["MODIFY", "UPDATE", "CHANGE"], correct: 1 }
    ]
  },
  AI: {
    title: "AI Nexus Protocol",
    accentClass: "border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    glowColor: "#10b981",
    badge: "Module 05",
    questions: [
      { id: 1, q: "What does AI stand for?", options: ["Advanced Interface", "Artificial Intelligence", "Auto Increment"], correct: 1 },
      { id: 2, q: "Which field focuses on training machines with data?", options: ["Machine Learning", "Network Design", "Database Management"], correct: 0 },
      { id: 3, q: "Which type of learning uses labeled examples?", options: ["Supervised", "Unsupervised", "Reinforced"], correct: 0 },
      { id: 4, q: "What is a neural network inspired by?", options: ["The human brain", "A web browser", "A database"], correct: 0 },
      { id: 5, q: "Which activation function maps values between 0 and 1?", options: ["Sigmoid", "ReLU", "Tanh"], correct: 0 }
    ]
  }
};

export default function AccessTerminalModal({ 
  selectedDomain = "HTML5", 
  onClose,
  onMissionComplete
}: { 
  selectedDomain?: string; 
  onClose: () => void; 
  onMissionComplete?: () => void;
}) {
  const { refreshUser } = useAuth();
  
  // Safe mappings
  let cleanDomain = selectedDomain;
  if (selectedDomain === "HTML") cleanDomain = "HTML5";
  if (selectedDomain === "CSS") cleanDomain = "CSS3";
  if (selectedDomain === "JavaScript") cleanDomain = "JS";

  const currentConfig = FALLBACK_DOMAIN_DATA[cleanDomain] || FALLBACK_DOMAIN_DATA["HTML5"];

  const [missionId, setMissionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [rewards, setRewards] = useState({ xp: 50, gems: 30 });

  useEffect(() => {
    let active = true;
    const loadMissionAndQuestions = async () => {
      try {
        setLoading(true);
        // 1. Fetch missions to resolve matching mission id
        const mRes = await api.get("/missions");
        const matchingMission = mRes.data.missions?.find((m: any) => m.title === cleanDomain);
        
        if (matchingMission && active) {
          setMissionId(matchingMission.id);
          
          // 2. Fetch questions from resolved ID
          const qRes = await api.get(`/missions/${matchingMission.id}/questions`);
          if (qRes.data.questions && qRes.data.questions.length > 0 && active) {
            setQuestions(qRes.data.questions);
          } else if (active) {
            setQuestions(currentConfig.questions);
          }
        } else if (active) {
          setQuestions(currentConfig.questions);
        }
      } catch (err) {
        console.error("Failed to load mission data from database, using fallbacks:", err);
        if (active) setQuestions(currentConfig.questions);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMissionAndQuestions();
    return () => {
      active = false;
    };
  }, [cleanDomain]);

  const activeQuestion = questions[currentQuestionIdx];

  const handleNext = async () => {
    if (selectedAnswer === null || !activeQuestion) return;

    const isCorrect = selectedAnswer === activeQuestion.correct;
    if (isCorrect) {
      setAnswerStatus("correct");
      setFeedbackMessage("Payload decryption correct! Matrix shard aligned.");
      setHintMessage(null);
      
      window.setTimeout(async () => {
        if (currentQuestionIdx + 1 < questions.length) {
          setCurrentQuestionIdx((prev) => prev + 1);
          setSelectedAnswer(null);
          setAnswerStatus(null);
          setFeedbackMessage(null);
        } else {
          // Submit completed mission to database
          if (missionId) {
            try {
              setSubmitting(true);
              const subRes = await api.post(`/missions/${missionId}/submit`, { score: 100 });
              setRewards({
                xp: subRes.data.xp_gained || 50,
                gems: subRes.data.gems_gained || 30
              });
              await refreshUser();
            } catch (err) {
              console.error("Failed to submit score", err);
            } finally {
              setSubmitting(false);
            }
          }
          setShowSuccess(true);
        }
      }, 1200);
    } else {
      setAnswerStatus("wrong");
      setFeedbackMessage("Anomalous decryption format. Retrying payload link.");
      try {
        // Fetch hints from Archie backend
        const aiRes = await api.post("/ai/chat", { message: `Give me a hint for this question: ${activeQuestion.q}` });
        setHintMessage(aiRes.data.reply);
      } catch {
        setHintMessage("Review core subject documentation. Decryption keys are zero-indexed.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none">
      
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-[#090d16]/95 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col min-h-[480px]"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 opacity-10 mix-blend-screen"
          style={{ backgroundImage: `url(${bgSpaceship})` }}
        />

        <div className="p-5 border-b border-slate-800 flex justify-between items-center relative z-10 bg-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${currentConfig.accentClass}`}>
              {currentConfig.badge}
            </span>
            <h3 className="text-sm font-black text-white font-mono tracking-wider">
              {currentConfig.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer text-lg p-1"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center flex-1 text-cyan-400 font-mono text-sm gap-2">
              <div className="animate-spin text-xl">⏳</div>
              <span>CONNECTING SHARDS...</span>
            </div>
          ) : submitting ? (
            <div className="flex flex-col items-center justify-center flex-1 text-yellow-400 font-mono text-sm gap-2">
              <div className="animate-pulse text-xl">💾</div>
              <span>COMMITTING ENCRYPTED PAYLOAD TO POSTGRES...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.div
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="flex flex-col justify-between h-full space-y-6 flex-1"
                >
                  {activeQuestion ? (
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono mb-4 text-slate-500">
                        <span>SYS_TARGET_DECRYPT // ACTIVE_SHARD</span>
                        <span className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800">
                          SHARD {currentQuestionIdx + 1} / {questions.length}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-white leading-relaxed mb-6">
                        {activeQuestion.q}
                      </h2>

                      <div className="space-y-3">
                        {activeQuestion.options.map((option, idx) => {
                          const isSelected = selectedAnswer === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedAnswer(idx);
                                setAnswerStatus(null);
                                setFeedbackMessage(null);
                              }}
                              className={`w-full text-left p-4 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer flex justify-between items-center ${
                                isSelected
                                  ? currentConfig.accentClass
                                  : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                              }`}
                            >
                              <span>{option}</span>
                              {isSelected && (
                                <div 
                                  className="w-1.5 h-1.5 rounded-full shadow-lg" 
                                  style={{ 
                                    backgroundColor: currentConfig.glowColor,
                                    boxShadow: `0 0 8px ${currentConfig.glowColor}` 
                                  }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {answerStatus && feedbackMessage && (
                        <div className={`rounded-2xl p-4 mt-4 text-xs font-semibold ${answerStatus === "correct" ? "bg-emerald-500/10 border border-emerald-500 text-emerald-300" : "bg-rose-500/10 border border-rose-500 text-rose-300"}`}>
                          <p>{feedbackMessage}</p>
                          {hintMessage && <p className="text-[11px] text-slate-400 mt-2 font-mono leading-relaxed">Hint from Archie: {hintMessage}</p>}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">Questions config anomaly. Try again later.</div>
                  )}

                  <div className="flex justify-between items-center border-t border-slate-800/60 pt-4 mt-4">
                    <button 
                      onClick={() => {
                        setSelectedAnswer(null);
                        setAnswerStatus(null);
                        setFeedbackMessage(null);
                      }}
                      className="text-[10px] font-mono text-slate-500 hover:text-slate-300 uppercase tracking-widest transition cursor-pointer"
                    >
                      Clear Matrix
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={selectedAnswer === null}
                      className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-25 disabled:cursor-not-allowed text-slate-950 font-black px-5 py-2 rounded-xl text-xs font-mono tracking-widest transition shadow-md cursor-pointer"
                    >
                      {currentQuestionIdx + 1 === questions.length ? "COMMIT PAYLOAD ➔" : "NEXT SHARD ➔"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* MISSION COMPLETE SCREEN */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center space-y-5 py-8 h-full flex-1"
                >
                  <div className="text-5xl">🏆</div>
                  <p className="text-cyan-400 font-mono tracking-widest text-[9px] uppercase font-bold">MISSION COMPLETE</p>
                  <h2 className="text-2xl font-black text-white uppercase tracking-wide">{currentConfig.title} Secured</h2>
                  <div className="grid gap-3 sm:grid-cols-2 w-full max-w-lg">
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Reward</p>
                      <p className="mt-3 text-3xl font-black text-cyan-300">+{rewards.xp} XP</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Bonus Gems</p>
                      <p className="mt-3 text-3xl font-black text-emerald-300">+{rewards.gems} Gems</p>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 text-left w-full max-w-lg">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Security Clearance</p>
                    <p className="mt-3 text-lg font-semibold text-white">Next Node Unlocked</p>
                    <p className="mt-2 text-slate-400 text-sm">Your security authorization level has been upgraded. Continue to unlock the next node in the core path.</p>
                  </div>
                  <button
                    onClick={() => {
                      onMissionComplete?.();
                      onClose();
                    }}
                    className="mt-2 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-black transition hover:bg-cyan-400 shadow-md cursor-pointer"
                  >
                    Continue
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}