// Player dot: a colored circle with a white ring and the logo (or icon) in the middle.
// Size it with className (e.g. "h-10 w-10"); icons scale with the dot.
const EMOJI = /\p{Extended_Pictographic}/u;

export default function Crest({ player, className = "h-10 w-10", ring = true }) {
  const { logo, mark, photo, color } = player;
  const markSize = EMOJI.test(mark) ? "44cqw" : String(mark).length > 2 ? "28cqw" : "40cqw";

  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        draggable={false}
        className={`shrink-0 rounded-full object-cover ${ring ? "ring-2 ring-white" : ""} ${className}`}
      />
    );
  }

  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full text-white [container-type:inline-size] ${
        ring ? "ring-2 ring-white" : ""
      } ${className}`}
      style={{ background: color || "#6366f1" }}
    >
      {logo ? (
        <img src={logo} alt="" draggable={false} className="h-[60%] w-[60%] rounded-md object-contain" />
      ) : (
        <span className="font-semibold leading-none" style={{ fontSize: markSize }}>
          {mark}
        </span>
      )}
    </div>
  );
}
