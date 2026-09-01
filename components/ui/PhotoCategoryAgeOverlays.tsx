import { cn } from "@/lib/utils";

export type PhotoCategoryAgeGroup = "contender" | "jury";

/**
 * Category (top-left) + age (bottom-right) on a portrait. Parent frame must use
 * `group/contender` or `group/jury` to match `photoGroup` when `revealOnHover` is true.
 */
export function PhotoCategoryAgeOverlays({
  category,
  age,
  revealOnHover = true,
  photoGroup = "contender",
}: {
  category: string | null | undefined;
  age: number | null | undefined;
  revealOnHover?: boolean;
  photoGroup?: PhotoCategoryAgeGroup;
}) {
  const cat = category?.trim();
  const showAge = age != null && Number.isFinite(age);
  if (!cat && !showAge) return null;

  const hoverReveal =
    photoGroup === "jury"
      ? "opacity-0 transition-opacity duration-500 ease-out group-hover/jury:opacity-100"
      : "opacity-0 transition-opacity duration-500 ease-out group-hover/contender:opacity-100";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[2]",
        revealOnHover ? hoverReveal : "opacity-100",
      )}
    >
      {cat ? (
        <div className="absolute left-3 top-3 border border-[#C5B397]/50 bg-[#131210]/35 px-2.5 py-1 backdrop-blur-sm md:left-4 md:top-4">
          <span className="text-[6px] font-medium uppercase tracking-[0.3em] text-[#C5B397] md:text-[7px]">
            {cat}
          </span>
        </div>
      ) : null}
      {showAge ? (
        <div className="absolute bottom-3 right-3 flex min-h-[2.5rem] min-w-[2.5rem] items-center justify-center bg-black/60 px-2.5 py-1.5 md:bottom-4 md:right-4">
          <span className="font-display text-xl font-light leading-none text-[#C5B397] md:text-2xl">
            {age}
          </span>
        </div>
      ) : null}
    </div>
  );
}
