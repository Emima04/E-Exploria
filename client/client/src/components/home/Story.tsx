import { motion } from "framer-motion";

export default function Story() {
  return (
    <section className="relative min-h-screen bg-[#050816] overflow-hidden flex items-center justify-center">

      {/* Background Glow */}

      <div className="absolute w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[180px]" />

      {/* Content */}

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-5xl text-center px-8"
      >

        <p className="uppercase tracking-[0.45em] text-cyan-300 text-sm mb-8">
          The Beginning
        </p>

        <h2 className="text-6xl md:text-7xl font-black text-white leading-tight">
          The World Is
          <br />
          Losing Knowledge
        </h2>

        <div className="w-40 h-1 bg-cyan-400 mx-auto mt-10 rounded-full" />

        <p className="mt-12 text-xl leading-10 text-zinc-300">

          Across every academy, valuable knowledge has been scattered,
          encrypted, and hidden inside mysterious escape rooms.

          <br /><br />

          Cyber systems have been compromised.
          Ancient temples conceal forgotten wisdom.
          Space stations have lost critical research.
          Detective archives contain unanswered mysteries.

          <br /><br />

          Only explorers who investigate, solve puzzles,
          and think critically can recover what has been lost.

        </p>

      </motion.div>

    </section>
  );
}