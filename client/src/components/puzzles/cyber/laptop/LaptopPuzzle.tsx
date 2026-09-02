import { motion } from "framer-motion";
import { useState } from "react";

import { useAudio } from "../../../../contexts/AudioContext";
import { useInventory } from "../../../../contexts/InventoryContext";

import SecurityAI from "../../shared/SecurityAI";

interface Props {
  onComplete: () => void;
}

interface Packet {
  id: number;
  source: string;
  destination: string;
  size: string;
  color:
    | "purple"
    | "pink"
    | "yellow"
    | "red";
  evidence: string;
}

type Operation =
  | "enqueue"
  | "dequeue";

const INITIAL_PACKETS: Packet[] = [
  {
    id: 1,
    source: "192.168.10.44",
    destination: "AUTH-SERVER-01",
    size: "48 KB",
    color: "purple",
    evidence: "ADMIN SESSION REQUEST",
  },
  {
    id: 2,
    source: "192.168.10.44",
    destination: "DB-SERVER-02",
    size: "16 KB",
    color: "pink",
    evidence: "DATABASE ACCESS",
  },
  {
    id: 3,
    source: "192.168.10.44",
    destination: "FILE-SERVER-03",
    size: "32 KB",
    color: "yellow",
    evidence: "FILE EXPORT",
  },
];

const INCOMING_PACKETS: Packet[] = [
  {
    id: 4,
    source: "192.168.10.44",
    destination: "LOG-SERVER-04",
    size: "12 KB",
    color: "red",
    evidence: "LOG DELETION",
  },
  {
    id: 5,
    source: "192.168.10.44",
    destination: "ARCHIVE-NODE-05",
    size: "24 KB",
    color: "purple",
    evidence: "EVIDENCE TRANSFER",
  },
];

/*
 * The player must alternate between removing from the
 * front and adding to the rear.
 *
 * This deliberately demonstrates both:
 *
 * DEQUEUE → FRONT
 * ENQUEUE → REAR
 */

const REQUIRED_OPERATIONS: Operation[] = [
  "dequeue",
  "enqueue",
  "dequeue",
  "enqueue",
  "dequeue",
  "dequeue",
  "dequeue",
];

function getPacketColors(
  color: Packet["color"]
) {
  switch (color) {
    case "purple":
      return {
        border: "border-purple-400/60",
        bg: "bg-purple-500/10",
        text: "text-purple-200",
        glow:
          "shadow-[0_0_22px_rgba(192,132,252,0.3)]",
      };

    case "pink":
      return {
        border: "border-pink-400/60",
        bg: "bg-pink-500/10",
        text: "text-pink-200",
        glow:
          "shadow-[0_0_22px_rgba(244,114,182,0.3)]",
      };

    case "yellow":
      return {
        border: "border-yellow-400/60",
        bg: "bg-yellow-500/10",
        text: "text-yellow-200",
        glow:
          "shadow-[0_0_22px_rgba(250,204,21,0.3)]",
      };

    case "red":
      return {
        border: "border-red-400/60",
        bg: "bg-red-500/10",
        text: "text-red-200",
        glow:
          "shadow-[0_0_22px_rgba(248,113,113,0.3)]",
      };

    default:
      return {
        border: "border-purple-400/60",
        bg: "bg-purple-500/10",
        text: "text-purple-200",
        glow:
          "shadow-[0_0_22px_rgba(192,132,252,0.3)]",
      };
  }
}

export default function LaptopPuzzle({
  onComplete,
}: Props) {
  const { addItem, hasItem } = useInventory();
  const { playSound } = useAudio();

  const [packets, setPackets] =
    useState<Packet[]>(INITIAL_PACKETS);

  const [incomingPackets, setIncomingPackets] =
    useState<Packet[]>(INCOMING_PACKETS);

  const [operationIndex, setOperationIndex] =
    useState(0);

  const [processing, setProcessing] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [message, setMessage] = useState(
    "The intercepted traffic is still in sequence. Follow the queue protocol."
  );

  const [wrongAttempt, setWrongAttempt] =
    useState(false);

  const expectedOperation =
    REQUIRED_OPERATIONS[operationIndex];

  const frontPacket =
    packets.length > 0
      ? packets[0]
      : null;

  const nextIncomingPacket =
    incomingPackets.length > 0
      ? incomingPackets[0]
      : null;

  function performOperation(
    operation: Operation
  ) {
    if (
      processing ||
      completed ||
      expectedOperation !== operation
    ) {
      if (
        !processing &&
        !completed &&
        expectedOperation !== operation
      ) {
        playSound("interface", 0.45);

        setWrongAttempt(true);

        setMessage(
          operation === "dequeue"
            ? "That action would remove the wrong packet. The queue must be handled from the front."
            : "That action would add data at the wrong moment. New packets enter at the rear."
        );

        setTimeout(() => {
          setWrongAttempt(false);

          setMessage(
            expectedOperation === "dequeue"
              ? "The next move is a DEQUEUE from the FRONT."
              : "The next move is an ENQUEUE at the REAR."
          );
        }, 1200);
      }

      return;
    }

    playSound(
      operation === "dequeue"
        ? "extract"
        : "click",
      operation === "dequeue"
        ? 0.65
        : 0.55
    );

    setProcessing(true);
    setWrongAttempt(false);

    if (operation === "dequeue") {
      if (!frontPacket) {
        setProcessing(false);
        return;
      }

      setMessage(
        `Dequeuing Packet ${frontPacket.id} from the FRONT...`
      );

      setTimeout(() => {
        setPackets((previous) =>
          previous.slice(1)
        );

        const nextIndex =
          operationIndex + 1;

        setOperationIndex(nextIndex);
        setProcessing(false);

        if (
          nextIndex <
          REQUIRED_OPERATIONS.length
        ) {
          const nextOperation =
            REQUIRED_OPERATIONS[nextIndex];

          setMessage(
            nextOperation === "enqueue"
              ? "The next packet has not arrived yet. ENQUEUE the new packet at the REAR."
              : "The next oldest packet is ready at the FRONT."
          );
        }
      }, 650);

      return;
    }

    if (!nextIncomingPacket) {
      setProcessing(false);
      return;
    }

    setMessage(
      `Enqueuing Packet ${nextIncomingPacket.id} at the REAR...`
    );

    setTimeout(() => {
      setPackets((previous) => [
        ...previous,
        nextIncomingPacket,
      ]);

      setIncomingPackets((previous) =>
        previous.slice(1)
      );

      const nextIndex =
        operationIndex + 1;

      setOperationIndex(nextIndex);
      setProcessing(false);

      if (
        nextIndex <
        REQUIRED_OPERATIONS.length
      ) {
        const nextOperation =
          REQUIRED_OPERATIONS[nextIndex];

        setMessage(
          nextOperation === "dequeue"
            ? "Packet added to the REAR. Now remove the oldest packet from the FRONT."
            : "Another incoming packet is waiting to enter the REAR."
        );
      }
    }, 650);
  }

  function storeEvidence() {
    if (!hasItem("access-token")) {
      addItem({
        id: "access-token",
        title: "Access Token",
        description:
          "Recovered from the intercepted network packet trail.",
      });
    }

    playSound("pickup", 0.85);

    setTimeout(() => {
      playSound("complete", 0.85);
      onComplete();
    }, 450);
  }

  function finishOperations() {
    playSound("success", 0.9);

    setCompleted(true);

    setMessage(
      "Queue protocol reconstructed. Both ENQUEUE and DEQUEUE operations were completed correctly."
    );
  }

  /*
   * When the final operation is completed,
   * show the completion screen.
   */

  if (
    operationIndex >=
      REQUIRED_OPERATIONS.length &&
    !completed
  ) {
    finishOperations();
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
      border-pink-400/25
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
            opacity: [0.1, 0.22, 0.1],
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
            bg-purple-500/15
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
            opacity: [0.05, 0.12, 0.05],
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
            bg-yellow-400/10
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

        <div>

          <p className="
            text-[10px]
            font-semibold
            tracking-[0.3em]
            text-pink-300/80
          ">
            FORENSIC WORKSTATION
          </p>

          <h2 className="
            mt-1
            text-lg
            font-bold
            text-white
          ">
            PACKET QUEUE
          </h2>

        </div>

        <div className="
          flex
          items-center
          gap-2
        ">

          <span className="
            h-2
            w-2
            animate-pulse
            rounded-full
            bg-pink-300
            shadow-[0_0_8px_rgba(244,114,182,0.8)]
          " />

          <span className="
            text-[10px]
            tracking-widest
            text-pink-300
          ">
            ANALYSIS ACTIVE
          </span>

        </div>

      </div>


      {/* =====================================================
          MAIN AREA
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
            SECURITY AI PANEL
            =================================================== */}

        <aside className="
          hidden
          h-full
          w-[220px]
          shrink-0
          lg:block
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
            PUZZLE AREA
            =================================================== */}

        <main className="
          min-h-0
          min-w-0
          flex-1
          overflow-y-auto
          pr-2
        ">

          {!completed && (

            <div className="
              min-h-full
              rounded-2xl
              border
              border-purple-400/20
              bg-[#080912]/90
              p-5
            ">

              {/* Mission heading */}

              <div className="
                flex
                items-start
                justify-between
              ">

                <div>

                  <p className="
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-purple-300/80
                  ">
                    FIFO FORENSIC TRACE
                  </p>

                  <h1 className="
                    mt-1
                    text-2xl
                    font-bold
                    text-white
                  ">
                    CONTROL THE PACKET QUEUE
                  </h1>

                  <p className="
                    mt-2
                    max-w-xl
                    text-xs
                    leading-5
                    text-zinc-500
                  ">
                    Follow the live packet stream.
                    Remove the oldest packet from the
                    FRONT and add new packets to the REAR.
                  </p>

                </div>

                <div className="
                  rounded-full
                  border
                  border-yellow-400/30
                  bg-yellow-400/10
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-yellow-200
                ">
                  STEP{" "}
                  {Math.min(
                    operationIndex + 1,
                    REQUIRED_OPERATIONS.length
                  )}
                  /
                  {REQUIRED_OPERATIONS.length}
                </div>

              </div>


              {/* =================================================
                  QUEUE VISUALIZATION
                  ================================================= */}

              <div className="
                mt-8
                rounded-2xl
                border
                border-purple-400/15
                bg-black/20
                p-5
              ">

                <div className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  text-[9px]
                  uppercase
                  tracking-widest
                ">

                  <span className="text-pink-300">
                    FRONT
                  </span>

                  <span className="text-zinc-600">
                    PROCESSING ORDER →
                  </span>

                  <span className="text-yellow-300">
                    REAR
                  </span>

                </div>


                {/* Queue */}

                <div className="
                  flex
                  min-h-[180px]
                  items-center
                  gap-3
                  overflow-x-auto
                  pb-2
                ">

                  {packets.map(
                    (packet, index) => {

                      const colors =
                        getPacketColors(
                          packet.color
                        );

                      const isFront =
                        index === 0;

                      const isRear =
                        index ===
                        packets.length - 1;

                      return (
                        <motion.div
                          layout
                          key={packet.id}
                          initial={{
                            opacity: 0,
                            x: 30,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            scale: isFront
                              ? 1.04
                              : 1,
                          }}
                          exit={{
                            opacity: 0,
                            x: -80,
                            scale: 0.8,
                          }}
                          transition={{
                            duration: 0.35,
                          }}
                          className={`
                            relative
                            min-w-[190px]
                            rounded-xl
                            border
                            ${colors.border}
                            ${colors.bg}
                            ${isFront ? colors.glow : ""}
                            p-4
                          `}
                        >

                          {isFront && (
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
                                absolute
                                -top-3
                                left-1/2
                                -translate-x-1/2
                                rounded-full
                                border
                                border-pink-400/50
                                bg-pink-400/10
                                px-3
                                py-1
                                text-[8px]
                                font-bold
                                tracking-widest
                                text-pink-200
                              "
                            >
                              FRONT
                            </motion.div>
                          )}

                          {isRear && (
                            <div className="
                              absolute
                              -bottom-2
                              right-3
                              rounded-full
                              border
                              border-yellow-400/40
                              bg-yellow-400/10
                              px-2
                              py-1
                              text-[7px]
                              font-bold
                              tracking-widest
                              text-yellow-200
                            ">
                              REAR
                            </div>
                          )}

                          <div className="
                            flex
                            items-center
                            justify-between
                          ">

                            <span className={`
                              text-lg
                              font-bold
                              ${colors.text}
                            `}>
                              PACKET {packet.id}
                            </span>

                            <span className="
                              text-[9px]
                              text-zinc-600
                            ">
                              {packet.size}
                            </span>

                          </div>

                          <div className="
                            mt-4
                            space-y-2
                            font-mono
                            text-[10px]
                          ">

                            <p className="text-zinc-500">
                              SRC{" "}
                              <span className={colors.text}>
                                {packet.source}
                              </span>
                            </p>

                            <p className="text-zinc-500">
                              DST{" "}
                              <span className={colors.text}>
                                {packet.destination}
                              </span>
                            </p>

                          </div>

                          <p className={`
                            mt-4
                            text-[9px]
                            uppercase
                            tracking-wider
                            ${colors.text}
                          `}>
                            {packet.evidence}
                          </p>

                        </motion.div>
                      );
                    }
                  )}

                </div>

              </div>


              {/* =================================================
                  OPERATION CONTROLS
                  ================================================= */}

              <div className="
                mt-7
                grid
                gap-4
                md:grid-cols-2
              ">

                {/* DEQUEUE */}

                <div className="
                  rounded-2xl
                  border
                  border-pink-400/20
                  bg-pink-400/[0.03]
                  p-4
                ">

                  <div className="
                    flex
                    items-center
                    justify-between
                  ">

                    <div>

                      <p className="
                        text-[9px]
                        uppercase
                        tracking-widest
                        text-pink-300
                      ">
                        FRONT OPERATION
                      </p>

                      <p className="
                        mt-1
                        text-sm
                        font-bold
                        text-white
                      ">
                        DEQUEUE
                      </p>

                    </div>

                    <span className="
                      text-xl
                    ">
                      ↓
                    </span>

                  </div>

                  <p className="
                    mt-3
                    text-[10px]
                    leading-5
                    text-zinc-500
                  ">
                    Remove the oldest packet from the
                    FRONT of the queue.
                  </p>

                  <button
                    type="button"
                    disabled={
                      processing ||
                      frontPacket === null
                    }
                    onClick={() =>
                      performOperation(
                        "dequeue"
                      )
                    }
                    className="
                      mt-4
                      w-full
                      rounded-xl
                      border
                      border-pink-300/50
                      bg-pink-400/10
                      px-4
                      py-3
                      text-xs
                      font-bold
                      tracking-widest
                      text-pink-200
                      transition
                      hover:bg-pink-400/15
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    DEQUEUE FRONT
                  </button>

                </div>


                {/* ENQUEUE */}

                <div className="
                  rounded-2xl
                  border
                  border-yellow-400/20
                  bg-yellow-400/[0.03]
                  p-4
                ">

                  <div className="
                    flex
                    items-center
                    justify-between
                  ">

                    <div>

                      <p className="
                        text-[9px]
                        uppercase
                        tracking-widest
                        text-yellow-300
                      ">
                        REAR OPERATION
                      </p>

                      <p className="
                        mt-1
                        text-sm
                        font-bold
                        text-white
                      ">
                        ENQUEUE
                      </p>

                    </div>

                    <span className="
                      text-xl
                    ">
                      ↑
                    </span>

                  </div>

                  <p className="
                    mt-3
                    text-[10px]
                    leading-5
                    text-zinc-500
                  ">
                    Add the next incoming packet to the
                    REAR of the queue.
                  </p>

                  <button
                    type="button"
                    disabled={
                      processing ||
                      nextIncomingPacket === null
                    }
                    onClick={() =>
                      performOperation(
                        "enqueue"
                      )
                    }
                    className="
                      mt-4
                      w-full
                      rounded-xl
                      border
                      border-yellow-300/50
                      bg-yellow-400/10
                      px-4
                      py-3
                      text-xs
                      font-bold
                      tracking-widest
                      text-yellow-200
                      transition
                      hover:bg-yellow-400/15
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    ENQUEUE AT REAR
                  </button>

                </div>

              </div>


              {/* =================================================
                  OPERATION STATUS
                  ================================================= */}

              <div className={`
                mt-5
                rounded-xl
                border
                p-4
                ${
                  wrongAttempt
                    ? "border-red-400/40 bg-red-400/5"
                    : "border-purple-400/10 bg-purple-400/[0.03]"
                }
              `}>

                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-zinc-600
                  ">
                    QUEUE PROTOCOL
                  </p>

                  <span className={`
                    text-[9px]
                    font-bold
                    tracking-widest
                    ${
                      wrongAttempt
                        ? "text-red-300"
                        : "text-purple-300"
                    }
                  `}>
                    {wrongAttempt
                      ? "PROTOCOL WARNING"
                      : expectedOperation ===
                        "dequeue"
                      ? "NEXT: DEQUEUE"
                      : "NEXT: ENQUEUE"}
                  </span>

                </div>

                <p className="
                  mt-2
                  text-xs
                  leading-5
                  text-zinc-400
                ">
                  {message}
                </p>

              </div>


              {/* =================================================
                  FIFO CONCEPT
                  ================================================= */}

              <div className="
                mt-5
                flex
                flex-wrap
                items-center
                justify-center
                gap-x-4
                gap-y-2
                rounded-xl
                border
                border-purple-400/10
                bg-purple-400/[0.03]
                px-4
                py-3
              ">

                <span className="
                  text-xs
                  font-bold
                  text-purple-300
                ">
                  QUEUE
                </span>

                <span className="
                  text-[10px]
                  text-zinc-600
                ">
                  FIFO
                </span>

                <span className="
                  text-[10px]
                  text-pink-300/80
                ">
                  DEQUEUE ← FRONT
                </span>

                <span className="
                  text-[10px]
                  text-yellow-300/80
                ">
                  ENQUEUE → REAR
                </span>

              </div>

            </div>
          )}


          {/* =====================================================
              SCREEN — COMPLETION
              ===================================================== */}

          {completed && (

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
                Packet Trail Reconstructed
              </p>

              <h2 className="
                mt-3
                text-3xl
                font-black
                text-white
              ">
                FIFO PROTOCOL COMPLETE
              </h2>

              <div className="
                mt-6
                grid
                w-full
                max-w-lg
                gap-3
                md:grid-cols-2
              ">

                <div className="
                  rounded-xl
                  border
                  border-pink-400/20
                  bg-pink-400/5
                  p-4
                ">

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-zinc-600
                  ">
                    DEQUEUE
                  </p>

                  <p className="
                    mt-2
                    text-sm
                    font-bold
                    text-pink-200
                  ">
                    FRONT → REMOVE
                  </p>

                </div>

                <div className="
                  rounded-xl
                  border
                  border-yellow-400/20
                  bg-yellow-400/5
                  p-4
                ">

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-zinc-600
                  ">
                    ENQUEUE
                  </p>

                  <p className="
                    mt-2
                    text-sm
                    font-bold
                    text-yellow-200
                  ">
                    REAR → ADD
                  </p>

                </div>

              </div>

              <div className="
                mt-6
                w-full
                max-w-md
                rounded-2xl
                border
                border-purple-400/25
                bg-purple-400/5
                p-5
              ">

                <p className="
                  text-[9px]
                  uppercase
                  tracking-widest
                  text-zinc-600
                ">
                  Recovered Evidence
                </p>

                <p className="
                  mt-3
                  text-lg
                  font-bold
                  text-yellow-200
                ">
                  NETWORK ACCESS TOKEN
                </p>

                <p className="
                  mt-2
                  font-mono
                  text-xs
                  text-zinc-400
                ">
                  TRACE-ID: NX-44-FORENSIC
                </p>

              </div>

              <p className="
                mt-5
                max-w-md
                text-xs
                leading-5
                text-zinc-500
              ">
                You controlled the queue by adding new
                packets at the REAR and removing the oldest
                packet from the FRONT. That is FIFO:
                First In, First Out.
              </p>

              <motion.button
                type="button"
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={storeEvidence}
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
                STORE ACCESS TOKEN →
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
          FORENSIC WORKSTATION // QUEUE ANALYSIS
        </span>

        <span
          className={
            completed
              ? "text-emerald-300/70"
              : "text-pink-300/70"
          }
        >
          {completed
            ? "EVIDENCE SECURED"
            : "QUEUE ACTIVE"}
        </span>

      </div>

    </div>
  );
}