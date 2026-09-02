import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { useInventory } from "../../../../contexts/InventoryContext";
import { useAudio } from "../../../../contexts/AudioContext";

import SecurityAI from "../../shared/SecurityAI";

interface Props {
  onComplete: () => void;
}

type Command = {
  id: string;
  label: string;
  icon: string;
  color: "violet" | "cyan" | "amber" | "rose";
};

type Phase = "stack" | "timeline" | "complete";

const INITIAL_COMMANDS: Command[] = [
  {
    id: "auth",
    label: "ADMIN AUTH",
    icon: "🔐",
    color: "violet",
  },
  {
    id: "access",
    label: "ACCESS DATABASE",
    icon: "🗄️",
    color: "cyan",
  },
  {
    id: "export",
    label: "EXPORT DATABASE",
    icon: "📦",
    color: "amber",
  },
  {
    id: "delete",
    label: "DELETE LOGS",
    icon: "🗑️",
    color: "rose",
  },
];

const CORRECT_SEQUENCE = [
  "auth",
  "access",
  "export",
  "delete",
];

function colorClasses(
  color: Command["color"]
) {
  const colors = {
    violet: {
      border: "border-violet-400/60",
      glow: "shadow-[0_0_24px_rgba(167,139,250,0.35)]",
      bg: "bg-violet-500/10",
      text: "text-violet-200",
    },

    cyan: {
      border: "border-cyan-400/60",
      glow: "shadow-[0_0_24px_rgba(34,211,238,0.25)]",
      bg: "bg-cyan-500/10",
      text: "text-cyan-200",
    },

    amber: {
      border: "border-amber-400/60",
      glow: "shadow-[0_0_24px_rgba(251,191,36,0.35)]",
      bg: "bg-amber-500/10",
      text: "text-amber-200",
    },

    rose: {
      border: "border-rose-400/60",
      glow: "shadow-[0_0_24px_rgba(251,113,133,0.4)]",
      bg: "bg-rose-500/10",
      text: "text-rose-200",
    },
  };

  return colors[color];
}

export default function MonitorPuzzle({
  onComplete,
}: Props) {
  const { addItem, hasItem } = useInventory();

  const { playSound } = useAudio();

  const [commands, setCommands] =
    useState<Command[]>(INITIAL_COMMANDS);

  const [recovered, setRecovered] =
    useState<Command[]>([]);

  const [timeline, setTimeline] =
    useState<Command[]>([]);

  const [phase, setPhase] =
    useState<Phase>("stack");

  const [message, setMessage] = useState(
    "The command buffer is corrupted. Recover the commands from the top."
  );

  const [wrongAttempt, setWrongAttempt] =
    useState(false);

  const [, setAiMood] = useState<
    "idle" | "thinking" | "happy" | "warning"
  >("idle");

  const topCommand =
    commands[commands.length - 1];

  const remainingCount = commands.length;

  const progress = useMemo(() => {
    if (phase === "complete") {
      return 100;
    }

    if (phase === "timeline") {
      return 75;
    }

    return Math.round(
      (recovered.length /
        INITIAL_COMMANDS.length) *
        50
    );
  }, [recovered.length, phase]);

  function extractCommand() {
    if (!topCommand) {
      return;
    }

    playSound("extract", 0.65);

    setAiMood("thinking");

    setMessage(
      `Extracting ${topCommand.label} from the command buffer...`
    );

    setTimeout(() => {
      setCommands((previous) =>
        previous.filter(
          (command) =>
            command.id !== topCommand.id
        )
      );

      setRecovered((previous) => [
        ...previous,
        topCommand,
      ]);

      setAiMood("idle");

      if (remainingCount === 1) {
        playSound("success", 0.75);

        setTimeout(() => {
          setPhase("timeline");

          setMessage(
            "All fragments recovered. Reconstruct the original attack sequence."
          );
        }, 500);
      } else {
        setMessage(
          "Command recovered. The next command is now exposed."
        );
      }
    }, 500);
  }

  function addToTimeline(
    command: Command
  ) {
    if (
      timeline.some(
        (item) => item.id === command.id
      )
    ) {
      return;
    }

    playSound("click", 0.5);

    const newTimeline = [
      ...timeline,
      command,
    ];

    setTimeline(newTimeline);
    setWrongAttempt(false);

    if (
      newTimeline.length ===
      CORRECT_SEQUENCE.length
    ) {
      const solved = newTimeline.every(
        (command, index) =>
          command.id ===
          CORRECT_SEQUENCE[index]
      );

      if (solved) {
        playSound("success", 0.9);

        setAiMood("happy");

        setMessage(
          "Attack sequence reconstructed. Evidence recovered."
        );

        setTimeout(() => {
          setPhase("complete");
        }, 900);
      } else {
        playSound("interface", 0.55);

        setAiMood("warning");
        setWrongAttempt(true);

        setMessage(
          "Sequence mismatch. The evidence does not fit this order."
        );

        setTimeout(() => {
          setTimeline([]);
          setAiMood("idle");

          setMessage(
            "Try again. Think about what must have happened first."
          );
        }, 1200);
      }
    }
  }

  function resetTimeline() {
    playSound("click", 0.45);

    setTimeline([]);
    setWrongAttempt(false);
    setAiMood("idle");

    setMessage(
      "Reconstruct the attack sequence from the recovered commands."
    );
  }

  function finishMission() {
    playSound("pickup", 0.85);

    if (!hasItem("ip-log")) {
      addItem({
        id: "ip-log",
        title: "Suspicious IP",
        description:
          "192.168.10.44 — recovered from the authentication server.",
      });
    }

    setTimeout(() => {
      playSound("complete", 0.85);
      onComplete();
    }, 450);
  }

  return (
    <div className="
      relative
      flex
      h-full
      min-h-0
      w-full
      flex-col
      overflow-hidden
      rounded-2xl
      border
      border-purple-400/25
      bg-[#070811]
      text-white
    ">

      {/* =====================================================
          BACKGROUND ATMOSPHERE
          ===================================================== */}

      <div className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      ">

        <motion.div
          animate={{
            opacity: [0.12, 0.24, 0.12],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="
            absolute
            -left-24
            top-10
            h-80
            w-80
            rounded-full
            bg-purple-500/20
            blur-3xl
          "
        />

        <motion.div
          animate={{
            opacity: [0.08, 0.2, 0.08],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          className="
            absolute
            right-0
            top-20
            h-80
            w-80
            rounded-full
            bg-pink-500/15
            blur-3xl
          "
        />

        <motion.div
          animate={{
            opacity: [0.05, 0.13, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="
            absolute
            bottom-0
            left-1/2
            h-60
            w-60
            -translate-x-1/2
            rounded-full
            bg-amber-400/10
            blur-3xl
          "
        />

        <div className="
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
          [background-size:32px_32px]
        " />

      </div>


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="
        relative
        z-10
        flex
        h-16
        shrink-0
        items-center
        justify-between
        border-b
        border-purple-400/20
        bg-[#0a0b16]/80
        px-6
        backdrop-blur-md
      ">

        <div className="flex items-center gap-3">

          <motion.div
            animate={{
              boxShadow: [
                "0 0 8px rgba(167,139,250,0.2)",
                "0 0 20px rgba(244,114,182,0.45)",
                "0 0 8px rgba(167,139,250,0.2)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-purple-400/60
              bg-purple-400/10
              text-lg
              text-purple-200
            "
          >
            ◈
          </motion.div>

          <div>

            <p className="
              text-sm
              font-bold
              tracking-[0.18em]
              text-purple-200
            ">
              SECURITY CORE
            </p>

            <p className="
              text-[10px]
              tracking-wider
              text-zinc-500
            ">
              AUTH-SERVER-01
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <div className="hidden text-right sm:block">

            <p className="
              text-[9px]
              uppercase
              tracking-widest
              text-zinc-600
            ">
              System
            </p>

            <p className="
              text-xs
              text-pink-300
            ">
              INVESTIGATION MODE
            </p>

          </div>

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              backgroundColor: [
                "#f472b6",
                "#c084fc",
                "#f472b6",
              ],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
            }}
            className="
              h-2
              w-2
              rounded-full
              shadow-[0_0_10px_rgba(244,114,182,0.8)]
            "
          />

        </div>

      </div>


      {/* =====================================================
          PROGRESS
          ===================================================== */}

      <div className="
        relative
        z-10
        h-1
        shrink-0
        bg-black/40
      ">

        <motion.div
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            duration: 0.4,
          }}
          className="
            h-full
            bg-gradient-to-r
            from-purple-500
            via-pink-400
            via-amber-300
            to-emerald-400
            shadow-[0_0_12px_rgba(244,114,182,0.55)]
          "
        />

      </div>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <div className="
        relative
        z-10
        flex
        min-h-0
        flex-1
        gap-5
        overflow-hidden
        p-5
      ">

        {/* ===================================================
            FIXED AI PANEL
            =================================================== */}

        <aside className="
          h-full
          w-[220px]
          shrink-0
        ">

          <div className="
            flex
            h-full
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-purple-400/25
            bg-gradient-to-b
            from-purple-500/[0.08]
            to-pink-500/[0.03]
            p-5
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <p className="
                text-[10px]
                font-semibold
                tracking-[0.2em]
                text-pink-300
              ">
                SECURITY AI
              </p>

              <span className="
                rounded-full
                border
                border-purple-400/20
                bg-purple-400/5
                px-2
                py-1
                text-[8px]
                tracking-widest
                text-purple-200
              ">
                ACTIVE
              </span>

            </div>

            <div className="
              flex
              flex-1
              items-center
              justify-center
            ">
              <SecurityAI size="large" />
            </div>

            <div className="
              shrink-0
              rounded-xl
              border
              border-pink-400/15
              bg-pink-400/[0.03]
              p-3
            ">

              <p className="
                text-[9px]
                uppercase
                tracking-widest
                text-zinc-600
              ">
                AI STATUS
              </p>

              <p className="
                mt-2
                max-h-24
                overflow-y-auto
                text-xs
                leading-5
                text-zinc-300
              ">
                {message}
              </p>

            </div>

          </div>

        </aside>


        {/* ===================================================
            SCROLLABLE PUZZLE AREA
            =================================================== */}

        <main className="
          min-h-0
          min-w-0
          flex-1
          overflow-y-auto
          pr-2
          [scrollbar-width:thin]
          [scrollbar-color:rgba(167,139,250,0.35)_transparent]
        ">

          {/* =================================================
              SCREEN 1 — STACK
              ================================================= */}

          {phase === "stack" && (

            <div className="
              relative
              min-h-full
              rounded-2xl
              border
              border-purple-400/20
              bg-[#080912]/90
              p-5
            ">

              <div className="
                mb-5
                flex
                items-center
                justify-between
              ">

                <div>

                  <p className="
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-pink-300/80
                  ">
                    Recovery Protocol
                  </p>

                  <h2 className="
                    mt-1
                    text-xl
                    font-bold
                    text-white
                  ">
                    COMMAND BUFFER
                  </h2>

                  <p className="
                    mt-1
                    text-[10px]
                    text-zinc-600
                  ">
                    Recover the newest command first.
                  </p>

                </div>

                <div className="
                  rounded-full
                  border
                  border-amber-400/30
                  bg-amber-400/10
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-amber-200
                ">
                  {remainingCount} fragments
                </div>

              </div>


              {/* COMMAND STACK */}

              <div className="
                flex
                min-h-[420px]
                flex-col
                items-center
                justify-center
                pb-8
              ">

                <div className="
                  relative
                  flex
                  w-full
                  max-w-[420px]
                  flex-col-reverse
                  items-center
                  gap-2
                ">

                  {commands.map(
                    (command, index) => {

                      const colors =
                        colorClasses(
                          command.color
                        );

                      const isTop =
                        index ===
                        commands.length - 1;

                      return (
                        <motion.div
                          layout
                          key={command.id}
                          initial={{
                            opacity: 0,
                            y: -30,
                            scale: 0.9,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: isTop
                              ? 1.03
                              : 1,
                          }}
                          exit={{
                            opacity: 0,
                            y: -80,
                            scale: 1.15,
                            rotate: -3,
                          }}
                          transition={{
                            duration: 0.35,
                          }}
                          className={`
                            relative
                            flex
                            h-16
                            w-full
                            items-center
                            rounded-xl
                            border
                            ${colors.border}
                            ${colors.bg}
                            ${isTop ? colors.glow : ""}
                            backdrop-blur-md
                          `}
                        >

                          <div className="
                            flex
                            w-16
                            items-center
                            justify-center
                            text-xl
                          ">
                            {command.icon}
                          </div>

                          <div className="flex-1">

                            <p
                              className={`
                                text-sm
                                font-bold
                                tracking-wider
                                ${colors.text}
                              `}
                            >
                              {command.label}
                            </p>

                            <p className="
                              text-[9px]
                              uppercase
                              tracking-widest
                              text-zinc-600
                            ">
                              command fragment
                            </p>

                          </div>

                          {isTop && (

                            <motion.div
                              animate={{
                                opacity: [
                                  0.4,
                                  1,
                                  0.4,
                                ],
                              }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                              }}
                              className="
                                mr-4
                                rounded-full
                                border
                                border-emerald-400/40
                                bg-emerald-400/10
                                px-2
                                py-1
                                text-[8px]
                                font-bold
                                tracking-widest
                                text-emerald-300
                              "
                            >
                              TOP
                            </motion.div>

                          )}

                        </motion.div>
                      );
                    }
                  )}

                </div>


                {/* EXTRACT BUTTON */}

                {commands.length > 0 && (

                  <motion.button
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    onClick={extractCommand}
                    className="
                      mt-8
                      rounded-xl
                      border
                      border-pink-300/60
                      bg-gradient-to-r
                      from-purple-500/15
                      via-pink-400/10
                      to-amber-300/10
                      px-8
                      py-3
                      text-xs
                      font-bold
                      tracking-[0.2em]
                      text-pink-200
                      shadow-[0_0_20px_rgba(244,114,182,0.15)]
                      transition
                      hover:border-pink-300
                      hover:bg-pink-400/15
                      hover:shadow-[0_0_25px_rgba(244,114,182,0.25)]
                    "
                  >
                    EXTRACT TOP COMMAND
                  </motion.button>

                )}

              </div>

            </div>
          )}


          {/* =================================================
              SCREEN 2 — ATTACK TIMELINE
              ================================================= */}

          {phase === "timeline" && (

            <div className="
              min-h-full
              rounded-2xl
              border
              border-purple-400/20
              bg-[#080912]/90
              p-5
            ">

              <div className="mb-5">

                <p className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-purple-300
                ">
                  Evidence Reconstruction
                </p>

                <h2 className="
                  mt-1
                  text-xl
                  font-bold
                ">
                  REBUILD THE ATTACK
                </h2>

                <p className="
                  mt-2
                  max-w-xl
                  text-xs
                  leading-5
                  text-zinc-500
                ">
                  The commands were recovered from the
                  buffer. Place them in the order the
                  attacker actually performed them.
                </p>

              </div>


              {/* RECOVERED COMMANDS */}

              <div className="
                mb-6
                flex
                flex-wrap
                gap-3
              ">

                {recovered.map(
                  (command) => {

                    const used =
                      timeline.some(
                        (item) =>
                          item.id ===
                          command.id
                      );

                    const colors =
                      colorClasses(
                        command.color
                      );

                    return (
                      <motion.button
                        key={command.id}
                        whileHover={
                          used
                            ? undefined
                            : {
                                y: -4,
                                scale: 1.03,
                              }
                        }
                        whileTap={
                          used
                            ? undefined
                            : {
                                scale: 0.96,
                              }
                        }
                        disabled={used}
                        onClick={() =>
                          addToTimeline(
                            command
                          )
                        }
                        className={`
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-xs
                          font-bold
                          tracking-wide
                          transition
                          ${colors.border}
                          ${colors.bg}
                          ${used ? "opacity-25" : ""}
                          ${colors.text}
                        `}
                      >

                        <span>
                          {command.icon}
                        </span>

                        {command.label}

                      </motion.button>
                    );
                  }
                )}

              </div>


              {/* TIMELINE */}

              <div
                className={`
                  relative
                  min-h-[300px]
                  rounded-2xl
                  border
                  ${
                    wrongAttempt
                      ? "border-rose-400/60 bg-rose-500/5"
                      : "border-purple-400/20 bg-purple-500/[0.02]"
                  }
                  p-5
                `}
              >

                <div className="
                  absolute
                  bottom-8
                  left-8
                  top-8
                  w-px
                  bg-gradient-to-b
                  from-purple-400/70
                  via-pink-400/50
                  to-amber-300/20
                " />

                <div className="
                  relative
                  space-y-4
                ">

                  {timeline.length === 0 && (

                    <div className="
                      flex
                      min-h-[220px]
                      items-center
                      justify-center
                      pl-8
                      text-xs
                      text-zinc-600
                    ">
                      Place the first action here...
                    </div>

                  )}

                  {timeline.map(
                    (command, index) => {

                      const colors =
                        colorClasses(
                          command.color
                        );

                      return (
                        <motion.div
                          key={command.id}
                          initial={{
                            opacity: 0,
                            x: -20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          className="
                            flex
                            items-center
                            gap-4
                            pl-1
                          "
                        >

                          <div
                            className={`
                              z-10
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              ${colors.border}
                              ${colors.bg}
                              text-sm
                            `}
                          >
                            {index + 1}
                          </div>

                          <div
                            className={`
                              flex
                              flex-1
                              items-center
                              gap-3
                              rounded-xl
                              border
                              ${colors.border}
                              ${colors.bg}
                              px-4
                              py-3
                            `}
                          >

                            <span>
                              {command.icon}
                            </span>

                            <span
                              className={`
                                text-xs
                                font-bold
                                tracking-wider
                                ${colors.text}
                              `}
                            >
                              {command.label}
                            </span>

                          </div>

                        </motion.div>
                      );
                    }
                  )}

                </div>

              </div>


              <div className="
                mt-4
                flex
                justify-between
              ">

                <button
                  onClick={resetTimeline}
                  className="
                    rounded-lg
                    border
                    border-purple-400/20
                    px-4
                    py-2
                    text-xs
                    text-purple-200/70
                    transition
                    hover:border-pink-400/40
                    hover:bg-pink-400/5
                    hover:text-pink-200
                  "
                >
                  RESET
                </button>

                <p className="
                  self-center
                  text-[10px]
                  uppercase
                  tracking-widest
                  text-zinc-600
                ">
                  {timeline.length}/4 actions placed
                </p>

              </div>

            </div>
          )}


          {/* =================================================
              SCREEN 3 — COMPLETION
              ================================================= */}

          {phase === "complete" && (

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="
                flex
                min-h-full
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-emerald-400/30
                bg-gradient-to-b
                from-emerald-400/[0.05]
                via-purple-500/[0.03]
                to-pink-400/[0.03]
                p-8
                text-center
              "
            >

              <SecurityAI size="large" />

              <p className="
                mt-6
                text-xs
                font-bold
                uppercase
                tracking-[0.3em]
                text-emerald-300
              ">
                Investigation Complete
              </p>

              <h2 className="
                mt-3
                text-3xl
                font-black
                text-white
              ">
                ATTACK SEQUENCE RESTORED
              </h2>

              <div className="
                mt-6
                grid
                w-full
                max-w-md
                grid-cols-2
                gap-3
              ">

                <div className="
                  rounded-xl
                  border
                  border-cyan-400/20
                  bg-cyan-400/5
                  p-4
                ">

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-zinc-600
                  ">
                    Device
                  </p>

                  <p className="
                    mt-2
                    text-sm
                    font-bold
                    text-cyan-200
                  ">
                    LAB-WKS-07
                  </p>

                </div>

                <div className="
                  rounded-xl
                  border
                  border-rose-400/20
                  bg-rose-400/5
                  p-4
                ">

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-zinc-600
                  ">
                    Suspicious IP
                  </p>

                  <p className="
                    mt-2
                    text-sm
                    font-bold
                    text-rose-200
                  ">
                    192.168.10.44
                  </p>

                </div>

              </div>

              <p className="
                mt-5
                max-w-md
                text-xs
                leading-5
                text-zinc-500
              ">
                The command buffer followed a
                last-in-first-out recovery pattern.
                The recovered sequence identifies the
                workstation used during the breach.
              </p>

              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={finishMission}
                className="
                  mt-7
                  rounded-xl
                  border
                  border-emerald-400/60
                  bg-gradient-to-r
                  from-emerald-400/10
                  via-green-400/10
                  to-purple-400/10
                  px-8
                  py-3
                  text-xs
                  font-bold
                  tracking-[0.2em]
                  text-emerald-300
                  shadow-[0_0_20px_rgba(52,211,153,0.15)]
                  transition
                  hover:bg-emerald-400/20
                "
              >
                STORE EVIDENCE →
              </motion.button>

            </motion.div>
          )}

        </main>

      </div>


      {/* =====================================================
          FOOTER
          ===================================================== */}

      <div className="
        relative
        z-10
        flex
        min-h-10
        shrink-0
        items-center
        justify-between
        border-t
        border-purple-400/10
        bg-[#090a13]/80
        px-5
        text-[9px]
        uppercase
        tracking-[0.18em]
        text-zinc-600
      ">

        <span>
          SECURITY CORE // RECOVERY PROTOCOL
        </span>

        <span
          className={
            phase === "stack"
              ? "text-amber-300/60"
              : phase === "timeline"
              ? "text-purple-300/60"
              : "text-emerald-300/70"
          }
        >
          {phase === "stack"
            ? "BUFFER ACTIVE"
            : phase === "timeline"
            ? "RECONSTRUCTION ACTIVE"
            : "EVIDENCE SECURED"}
        </span>

      </div>

    </div>
  );
}