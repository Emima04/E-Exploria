import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import background from "../../assets/images/home/hero-background.avif";

interface BootOverlayProps {
  show: boolean;
  onFinish: () => void;
}

const logs = [
  "Authenticating Explorer...",
  "Connecting to Cyber Academy...",
  "Loading Mission Database...",
  "Scanning Digital Environment...",
  "Preparing Escape Room..."
];

export default function BootOverlay({ 
  show,
  onFinish 
}: BootOverlayProps) {

  const [progress, setProgress] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);


  useEffect(() => {

    if (!show) {

      setProgress(0);
      return;

    }


    const cursor = setInterval(() => {

      setCursorVisible((prev) => !prev);

    }, 500);



    const delay = setTimeout(() => {


      const interval = setInterval(() => {


        setProgress((prev) => {


          if (prev >= logs.length) {


            clearInterval(interval);


            setTimeout(() => {

              onFinish();

            }, 1000);


            return prev;

          }


          return prev + 1;


        });


      }, 1300);



      return () => clearInterval(interval);


    }, 1200);



    return () => {

      clearTimeout(delay);

      clearInterval(cursor);

    };


  }, [show, onFinish]);




  if (!show) return null;




  return (

    <motion.div

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      transition={{ duration: 1.4 }}

      className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center"

    >


      {/* Background */}


      <motion.img

        src={background}

        alt="Boot Background"

        initial={{ scale: 1.12 }}

        animate={{ scale: 1.28 }}

        transition={{

          duration: 10,

          ease: "easeInOut",

        }}

        className="absolute inset-0 w-full h-full object-cover"

      />




      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />



      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-cyan-900/20" />





      <div className="relative z-10 w-full max-w-4xl px-8 text-center">



        <div className="flex justify-center items-center text-3xl font-semibold tracking-[0.2em]">


          {/* <span className="text-exploria-gradient color-transparent bg-clip-text">

            Initializing

          </span> */}



          <span

            className={`ml-2 text-blue-400 transition-opacity duration-150 ${
              cursorVisible ? "opacity-100" : "opacity-0"
            }`}

          >
            Initializing
            █
          </span>


        </div>





        <div className="flex justify-center gap-3 mt-16">


          {logs.map((_, index) => (


            <motion.div

              key={index}


              animate={

                progress === index + 1

                  ? { scale: [1, 1.18, 1] }

                  : {}

              }


              transition={{ duration: 0.4 }}


              className={`

                w-10

                h-10

                rounded-sm

                border

                transition-all

                duration-700


                ${

                  progress > index

                    ? "bg-gradient-to-br from-blue-500 to-cyan-500 border-cyan-300 shadow-[0_0_25px_rgba(236,72,153,0.75)]"

                    : "bg-zinc-800 border-zinc-700"

                }

              `}

            />


          ))}


        </div>






        <motion.p

          key={progress}

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          className="mt-14 text-zinc-200 text-xl font-mono"

        >


          {

            progress === 0

            ? "Preparing Interface..."

            : progress === logs.length

            ? "Initialization Complete"

            : logs[progress - 1]

          }


        </motion.p>







        <div className="mt-16 max-w-xl mx-auto text-left space-y-4">


          {logs.slice(0, progress).map((item, index) => (


            <motion.div

              key={index}

              initial={{ opacity: 0, x: -15 }}

              animate={{ opacity: 1, x: 0 }}

              className="flex items-center gap-3"

            >



              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_12px_rgba(236,72,153,0.8)]" />



              <p className="font-mono text-cyan-200">

                {item}

              </p>



            </motion.div>


          ))}



        </div>



      </div>



    </motion.div>


  );

}