import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import your custom spaceship control center artwork asset
import bgSpaceship from "../assets/bg-spaceship.jpg";

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

const DOMAIN_DATA: Record<string, DomainConfig> = {
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
      { id: 5, q: "How do you create a hyperlink in HTML?", options: ["<a href='url'>Link</a>", "<link url='url'>Link</link>", "<hyperlink src='url'>Link</hyperlink>"], correct: 0 },
      { id: 6, q: "Which tag is used to create a paragraph?", options: ["<p>", "<para>", "<text>"], correct: 0 },
      { id: 7, q: "How do you add a comment in HTML?", options: ["<!-- Comment -->", "// Comment", "/* Comment */"], correct: 0 },
      { id: 8, q: "Which HTML element is used to define navigation links?", options: ["<nav>", "<menu>", "<links>"], correct: 0 },
      { id: 9, q: "What does the <title> tag define?", options: ["Page title shown in browser tab", "Title shown on page body", "Title of a section"], correct: 0 },
      { id: 10, q: "Which tag defines a table row?", options: ["<tr>", "<td>", "<table>"], correct: 0 }
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
      { id: 5, q: "Which property controls the space between lines of text?", options: ["line-height", "spacing", "text-height"], correct: 0 },
      { id: 6, q: "What is the correct syntax for a class selector?", options: [".className", "#className", "className"], correct: 0 },
      { id: 7, q: "How do you select an element with id 'header'?", options: ["#header", ".header", "header"], correct: 0 },
      { id: 8, q: "Which property is used to change the background color?", options: ["bgcolor", "background-color", "color"], correct: 1 },
      { id: 9, q: "How do you add a border to an element?", options: ["border: 1px solid black;", "border-style: solid black 1px;", "border-width: 1px;"], correct: 0 },
      { id: 10, q: "Which property controls the element's width?", options: ["width", "size", "length"], correct: 0 }
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
      { id: 5, q: "How do you start a for loop?", options: ["for i = 0; i < 5; i++", "for (let i = 0; i < 5; i++)", "for (i < 5; i++)"], correct: 1 },
      { id: 6, q: "How do you write an if statement in JavaScript?", options: ["if i == 5 then", "if (i == 5)", "if i = 5"], correct: 1 },
      { id: 7, q: "What is the correct way to write a JavaScript array?", options: ["var colors = 'red', 'green', 'blue'", "var colors = ['red', 'green', 'blue']", "var colors = (1:'red', 2:'green')"], correct: 1 },
      { id: 8, q: "How do you find the length of a string?", options: ["string.length", "length(string)", "string.size"], correct: 0 },
      { id: 9, q: "Which method converts JSON to a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()"], correct: 0 },
      { id: 10, q: "Which symbol is used for comments in JavaScript?", options: ["<!-- -->", "//", "**"], correct: 1 }
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
      { id: 4, q: "How do you sort results ascending?", options: ["ORDER BY column ASC", "SORT BY column ASC", "ORDER column ASC"], correct: 0 },
      { id: 5, q: "What is the SQL keyword to count rows?", options: ["COUNT", "SUM", "TOTAL"], correct: 0 },
      { id: 6, q: "Which SQL statement adds new rows to a table?", options: ["INSERT INTO", "ADD ROW", "UPDATE TABLE"], correct: 0 },
      { id: 7, q: "Which SQL keyword is used to remove rows?", options: ["DELETE", "REMOVE", "DROP"], correct: 0 },
      { id: 8, q: "What does JOIN do in SQL?", options: ["Combines rows from two tables", "Deletes rows", "Creates a new table"], correct: 0 },
      { id: 9, q: "Which function returns the highest value?", options: ["MAX()", "HIGH()", "GREATEST()"], correct: 0 },
      { id: 10, q: "What keyword updates existing data in a table?", options: ["MODIFY", "UPDATE", "CHANGE"], correct: 1 }
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
      { id: 3, q: "Which algorithm is often used for classification?", options: ["Linear Regression", "K-Nearest Neighbors", "Heap Sort"], correct: 1 },
      { id: 4, q: "What is the process of improving model performance called?", options: ["Tuning", "Compiling", "Indexing"], correct: 0 },
      { id: 5, q: "Which type of learning uses labeled examples?", options: ["Supervised", "Unsupervised", "Reinforced"], correct: 0 },
      { id: 6, q: "What does NLP stand for?", options: ["Natural Language Processing", "New Logic Process", "Network Layer Protocol"], correct: 0 },
      { id: 7, q: "Which model type is best for sequential data?", options: ["RNN", "CNN", "DNN"], correct: 0 },
      { id: 8, q: "What is a neural network inspired by?", options: ["The human brain", "A web browser", "A database"], correct: 0 },
      { id: 9, q: "Which activation function maps values between 0 and 1?", options: ["Sigmoid", "ReLU", "Tanh"], correct: 0 },
      { id: 10, q: "Which branch of AI learns by trial and error?", options: ["Reinforcement Learning", "Supervised Learning", "Unsupervised Learning"], correct: 0 }
    ]
  }
};

export default function AccessTerminalModal({ 
  selectedDomain = "HTML5", 
  onClose 
}: { 
  selectedDomain?: string; 
  onClose: () => void; 
}) {
  const currentDomain = DOMAIN_DATA[selectedDomain] || DOMAIN_DATA["HTML5"];
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const activeQuestion = currentDomain.questions[currentQuestionIdx];

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === activeQuestion.correct;
    if (isCorrect) {
      const correctMessages = [
        "Yahooo! You're correct!",
        "Nice! Keep going!",
        "Great choice! Let's move ahead!",
        "Correct — you cracked it!",
      ];
      setAnswerStatus("correct");
      setFeedbackMessage(correctMessages[Math.floor(Math.random() * correctMessages.length)]);
      setHintMessage(null);
      window.setTimeout(() => {
        if (currentQuestionIdx + 1 < currentDomain.questions.length) {
          setCurrentQuestionIdx((prev) => prev + 1);
          setSelectedAnswer(null);
          setAnswerStatus(null);
          setFeedbackMessage(null);
        } else {
          setShowSuccess(true);
        }
      }, 1200);
    } else {
      const wrongHints = [
        "Try focusing on what the question asks.",
        "Not quite — think about the syntax.",
        "Close! Review the answer choices again.",
        "Wrong this time, but you can do it!",
      ];
      setAnswerStatus("wrong");
      setFeedbackMessage("That’s not it.");
      setHintMessage(wrongHints[Math.floor(Math.random() * wrongHints.length)]);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setShowSuccess(false);
    setAnswerStatus(null);
    setFeedbackMessage(null);
    setHintMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none">
      
      {/* CARD CONSOLE BOX CONTAINER */}
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-[#090d16]/95 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col min-h-[480px]"
      >
        
        {/* REPLICATED BACKGROUND ASSET ON TERMINAL COMPONENT */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 opacity-10 mix-blend-screen"
          style={{ backgroundImage: `url(${bgSpaceship})` }}
        />

        {/* MODAL WINDOW HEADER */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center relative z-10 bg-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${currentDomain.accentClass}`}>
              {currentDomain.badge}
            </span>
            <h3 className="text-sm font-black text-white font-mono tracking-wider">
              {currentDomain.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* CONTENT WINDOW BODY */}
        <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
          <AnimatePresence mode="wait">
            {!showSuccess ? (
              <motion.div
                key={currentQuestionIdx}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col justify-between h-full space-y-6"
              >
                <div>
                  {/* PROGRESS HEADER MATRIX */}
                  <div className="flex justify-between items-center text-[10px] font-mono mb-4 text-slate-500">
                    <span>SYS_TARGET_DECRYPT // ACTIVE_SHARD</span>
                    <span className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800">
                      SHARD {currentQuestionIdx + 1} / {currentDomain.questions.length}
                    </span>
                  </div>

                  {/* QUESTION TITLE TEXT */}
                  <h2 className="text-base font-bold text-white leading-relaxed mb-6">
                    {activeQuestion.q}
                  </h2>

                  {/* MCQ SELECT OPTIONS LIST */}
                  <div className="space-y-3">
                    {activeQuestion.options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedAnswer(idx)}
                          className={`w-full text-left p-4 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer flex justify-between items-center ${
                            isSelected
                              ? currentDomain.accentClass
                              : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <span>{option}</span>
                          {isSelected && (
                            <div 
                              className="w-1.5 h-1.5 rounded-full shadow-lg" 
                              style={{ 
                                backgroundColor: currentDomain.glowColor,
                                boxShadow: `0 0 8px ${currentDomain.glowColor}` 
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {answerStatus && feedbackMessage && (
                    <div className={`rounded-2xl p-4 mt-4 text-sm font-semibold ${answerStatus === "correct" ? "bg-emerald-500/10 border border-emerald-500 text-emerald-300" : "bg-rose-500/10 border border-rose-500 text-rose-300"}`}>
                      <p>{feedbackMessage}</p>
                      {hintMessage && <p className="text-xs text-slate-400 mt-2">Hint: {hintMessage}</p>}
                    </div>
                  )}
                </div>

                {/* INTERACTIVE ACTIONS PANEL FOOTER */}
                <div className="flex justify-between items-center border-t border-slate-800/60 pt-4 mt-4">
                  <button 
                    onClick={() => setSelectedAnswer(null)}
                    className="text-[10px] font-mono text-slate-500 hover:text-slate-300 uppercase tracking-widest transition cursor-pointer"
                  >
                    Clear Matrix
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-25 disabled:cursor-not-allowed text-slate-950 font-black px-5 py-2 rounded-xl text-xs font-mono tracking-widest transition shadow-md cursor-pointer"
                  >
                    {currentQuestionIdx + 1 === currentDomain.questions.length ? "COMMIT PAYLOAD ➔" : "NEXT SHARD ➔"}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* SUCCESS MATRIX DECRYPTION STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-4 py-8 h-full"
              >
                <div className="text-4xl">💎</div>
                <p className="text-cyan-400 font-mono tracking-widest text-[9px] uppercase font-bold">DECRYPTION SUCCESSFUL</p>
                <h2 className="text-base font-black text-white uppercase tracking-wide">Data Shard Verified</h2>
                <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                  All system nodes are operational. The relational parameters have been recorded inside your local instance profile history registry.
                </p>
                <div className="flex gap-3 w-full max-w-sm pt-4">
                  <button 
                    onClick={handleReset}
                    className="flex-1 bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 font-bold py-2.5 rounded-xl transition text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Retry Shard
                  </button>
                  <button 
                    onClick={onClose}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-2.5 rounded-xl transition text-xs font-mono tracking-wider uppercase cursor-pointer shadow-md"
                  >
                    Exit Node
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}