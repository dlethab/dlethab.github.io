import { profile } from "../data/content";
import { useSound } from "../lib/sound";
import { useBest } from "../lib/score";
import ball from "../assets/ball.png";
import { FileIcon, GitHubIcon, LinkedInIcon, SoundIcon } from "./Icons";

const iconBtn = "grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-zinc-200 transition hover:bg-white/10 hover:text-white";

const IconLink = ({ href, label, children }) => (
  <a
    href={href}
    target={href.startsWith("mailto:") ? undefined : "_blank"}
    rel="noreferrer"
    aria-label={label}
    title={label}
    className={iconBtn}
  >
    {children}
  </a>
);

export default function Header({ onHome }) {
  const [soundOn, setSound] = useSound();
  const best = useBest();

  return (
    <header className="mx-auto w-full max-w-7xl shrink-0 px-4 pt-4 lg:px-6 lg:pt-6">
      <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-zinc-800/40 px-4 py-3 backdrop-blur">
        <button type="button" onClick={onHome} className="flex items-center gap-3 text-left">
          <img src={ball} alt="" className="h-11 w-11 shrink-0 drop-shadow transition-transform duration-500 hover:rotate-[200deg]" />
          <span>
            <span className="block text-lg font-semibold leading-tight text-white">{profile.name}</span>
            <span className="block text-sm text-zinc-400">
              {profile.title} @ {profile.org}
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span className="mr-1 hidden text-sm text-zinc-400 md:inline">
            Penalty best: <span className="font-semibold text-yellow-400">{best}/5</span>
          </span>
          <div className="hidden items-center gap-2 sm:flex">
            <IconLink href={profile.links.github} label="GitHub">
              <GitHubIcon />
            </IconLink>
            <IconLink href={profile.links.linkedin} label="LinkedIn">
              <LinkedInIcon />
            </IconLink>
          </div>
          <button
            type="button"
            onClick={() => setSound(!soundOn)}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute sound" : "Turn sound on"}
            title={soundOn ? "Sound on" : "Sound off"}
            className={`${iconBtn} ${soundOn ? "ring-1 ring-yellow-400" : ""}`}
          >
            <SoundIcon on={soundOn} />
          </button>
          <a
            href={profile.links.resume}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm text-white ring-1 ring-yellow-400 transition hover:bg-white/15 sm:inline-flex"
          >
            <FileIcon width={16} height={16} /> Resume
          </a>
        </div>
      </div>
    </header>
  );
}
