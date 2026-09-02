import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Package, X } from "lucide-react";

import { useInventory } from "../../../contexts/InventoryContext";

export default function InventoryBar() {
  const { items } = useInventory();

  const [selectedItem, setSelectedItem] =
    useState<string | null>(null);

  const selected =
    items.find((item) => item.id === selectedItem) ?? null;

  return (
    <>
      {/* =====================================================
          INVENTORY BAR
          ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          z-30
          flex
          h-16
          w-full
          items-center
          border-t
          border-purple-400/20
          bg-[#070912]/90
          px-6
          backdrop-blur-md
        "
      >
        {/* Inventory title */}

        <div className="flex items-center gap-3">
          <Package
            size={18}
            className="text-purple-300"
          />

          <span className="
            text-sm
            font-semibold
            tracking-wide
            text-purple-200
          ">
            INVENTORY
          </span>

          <span className="
            rounded-full
            border
            border-pink-400/20
            bg-pink-400/5
            px-2
            py-0.5
            text-[9px]
            text-pink-300
          ">
            {items.length}
          </span>
        </div>

        {/* Item slots */}

        <div className="ml-8 flex items-center gap-3">

          {/* Empty inventory */}

          {items.length === 0 && (
            <div className="
              flex
              h-10
              items-center
              rounded-lg
              border
              border-zinc-800
              bg-black/20
              px-4
              text-[10px]
              uppercase
              tracking-widest
              text-zinc-600
            ">
              No evidence collected
            </div>
          )}

          {/* Inventory items */}

          {items.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{
                opacity: 0,
                scale: 0.6,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              whileHover={{
                y: -3,
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                setSelectedItem(item.id)
              }
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-pink-400/50
                bg-gradient-to-br
                from-purple-500/15
                via-pink-400/10
                to-amber-300/10
                shadow-[0_0_14px_rgba(244,114,182,0.12)]
                transition
                hover:border-pink-300
                hover:shadow-[0_0_18px_rgba(244,114,182,0.22)]
              "
              title={item.title}
            >
              <span className="
                text-sm
                font-bold
                text-pink-200
              ">
                {index + 1}
              </span>

              {/* New-item glow */}

              <motion.span
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                }}
                className="
                  absolute
                  inset-0
                  rounded-lg
                  border
                  border-pink-300/30
                "
              />
            </motion.button>
          ))}

        </div>
      </div>


      {/* =====================================================
          ITEM INSPECTION WINDOW

          Clicking an inventory item opens this.
          ===================================================== */}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            className="
              absolute
              bottom-20
              left-6
              z-40
              w-[320px]
              rounded-2xl
              border
              border-purple-400/30
              bg-[#090a13]/95
              p-5
              shadow-[0_0_30px_rgba(168,85,247,0.15)]
              backdrop-blur-xl
            "
          >
            <div className="
              flex
              items-start
              justify-between
            ">

              <div>
                <p className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-pink-300
                ">
                  Evidence Item
                </p>

                <h3 className="
                  mt-2
                  text-lg
                  font-bold
                  text-white
                ">
                  {selected.title}
                </h3>
              </div>

              <button
                onClick={() =>
                  setSelectedItem(null)
                }
                className="
                  rounded-lg
                  p-1.5
                  text-zinc-500
                  transition
                  hover:bg-red-500/10
                  hover:text-red-300
                "
              >
                <X size={16} />
              </button>

            </div>

            <div className="
              mt-4
              rounded-xl
              border
              border-purple-400/15
              bg-purple-400/5
              p-4
            ">
              <p className="
                text-xs
                leading-5
                text-zinc-300
              ">
                {selected.description}
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}