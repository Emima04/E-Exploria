import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface InventoryItem {
  id: string;
  title: string;
  description: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  hasItem: (id: string) => boolean;
}

const InventoryContext =
  createContext<InventoryContextType | null>(null);

const DEMO_USER_ID =
  import.meta.env.VITE_DEMO_USER_ID;

export function InventoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] =
    useState<InventoryItem[]>([]);

  /*
   * ==========================================================
   * LOAD INVENTORY
   *
   * Local state is always allowed to work.
   * Supabase loading happens separately and is fully protected
   * so a database problem cannot break the game.
   * ==========================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadInventory() {
      try {
        const { supabase } = await import(
          "../lib/supabaseClient"
        );

        if (!DEMO_USER_ID) {
          console.warn(
            "VITE_DEMO_USER_ID is missing. Inventory will remain local."
          );
          return;
        }

        const {
          data,
          error,
        } = await supabase
          .from("inventory")
          .select(
            "item_id, item_name, description"
          )
          .eq(
            "user_id",
            DEMO_USER_ID
          )
          .order("obtained_at", {
            ascending: true,
          });

        if (error) {
          console.warn(
            "Could not load inventory from Supabase:",
            error.message
          );
          return;
        }

        if (cancelled) {
          return;
        }

        const loadedItems: InventoryItem[] =
          (data ?? []).map((row: any) => ({
            id: row.item_id,
            title: row.item_name,
            description:
              row.description ?? "",
          }));

        setItems(loadedItems);
      } catch (error) {
        console.warn(
          "Supabase inventory load unavailable:",
          error
        );

        /*
         * Important:
         * do nothing here.
         *
         * The game continues using local React state.
         */
      }
    }

    void loadInventory();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ==========================================================
   * CHECK ITEM
   * ==========================================================
   */

  function hasItem(id: string) {
    return items.some(
      (item) => item.id === id
    );
  }

  /*
   * ==========================================================
   * ADD ITEM
   *
   * The UI updates immediately.
   * Database persistence happens in the background.
   * ==========================================================
   */

  function addItem(item: InventoryItem) {
    if (hasItem(item.id)) {
      return;
    }

    setItems((previous) => {
      if (
        previous.some(
          (existing) =>
            existing.id === item.id
        )
      ) {
        return previous;
      }

      return [...previous, item];
    });

    void saveItem(item);
  }

  /*
   * ==========================================================
   * SAVE ITEM TO SUPABASE
   * ==========================================================
   */

  async function saveItem(
    item: InventoryItem
  ) {
    try {
      const { supabase } = await import(
        "../lib/supabaseClient"
      );

      if (!DEMO_USER_ID) {
        console.warn(
          "VITE_DEMO_USER_ID is missing. Item was kept locally only."
        );
        return;
      }

      const {
        error,
      } = await supabase
        .from("inventory")
        .upsert(
          {
            user_id: DEMO_USER_ID,
            item_id: item.id,
            item_name: item.title,
            description: item.description,
            obtained_from: "monitor",
          },
          {
            onConflict:
              "user_id,item_id",
          }
        );

      if (error) {
        console.warn(
          "Could not save inventory item:",
          error.message
        );
      }
    } catch (error) {
      console.warn(
        "Supabase inventory save unavailable:",
        error
      );
    }
  }

  return (
    <InventoryContext.Provider
      value={{
        items,
        addItem,
        hasItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context =
    useContext(InventoryContext);

  if (!context) {
    throw new Error(
      "useInventory must be used inside InventoryProvider"
    );
  }

  return context;
}