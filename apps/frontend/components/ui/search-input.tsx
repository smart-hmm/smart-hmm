/* eslint-disable react-hooks/refs */
import { X } from "lucide-react";
import { useRef } from "react";

export function SearchInput({
  search,
  setSearch,
  placeHolder = "", 
}: {
  search: string;
  placeHolder?: string;
  setSearch: (value: string) => void;
}) {
  const mirrorRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="relative w-full md:w-[300px]">
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        placeholder={placeHolder}
        className="w-full bg-surface rounded-md border border-muted px-3 py-2 text-sm"
      />

      <span
        ref={mirrorRef}
        className="invisible absolute left-3 top-1/2 -translate-y-1/2 whitespace-pre text-sm font-normal"
      >
        {search || ""}
      </span>

      {search && (
        <button
          type="button"
          style={{
            left: mirrorRef.current!.offsetWidth + 18,
          }}
          onClick={() => {
            setSearch("");
          }}
          className="absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:opacity-100 opacity-60 
                bg-muted border border-foreground/10 rounded-full p-1 aspect-square cursor-pointer shadow-lg"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
