export default function CyberHUD() {
  return (
    <>
      <div
        className="
        absolute
        top-8
        left-10
        z-30

        w-[270px]

        rounded-2xl

        bg-black/40
        backdrop-blur-xl

        border
        border-cyan-400/40

        p-5

        shadow-[0_0_25px_rgba(34,211,238,0.2)]
        "
      >

        <p className="text-cyan-300 tracking-[0.3em] text-xs">
          CYBER ACADEMY
        </p>

        <h1 className="text-white text-2xl font-black mt-2">
          Database Systems
        </h1>


        <div className="mt-5">

          <div className="flex justify-between text-xs text-cyan-100">

            <span>
              Progress
            </span>

            <span>
              1 / 20
            </span>

          </div>


          <div
            className="
            mt-3
            h-1.5
            rounded-full
            bg-cyan-950
            overflow-hidden
            "
          >

            <div
              className="
              h-full
              w-[5%]
              bg-cyan-300
              shadow-[0_0_15px_#22d3ee]
              "
            />

          </div>

        </div>


      </div>



      <div
        className="
        absolute
        bottom-8
        left-10
        z-30

        w-[260px]

        rounded-2xl

        bg-black/40
        backdrop-blur-xl

        border
        border-cyan-400/30

        p-4
        "
      >

        <h2 className="text-cyan-300 text-lg font-bold">
          🤖 Cyber Guide
        </h2>

        <p className="text-zinc-300 mt-3 text-xs leading-6">
          Mission node detected.
          Complete challenges to unlock deeper system layers.
        </p>

      </div>

    </>
  );
}