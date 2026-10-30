import Crest from "./Crest";
import { LINES, profile, reserves, squad } from "../data/content";
import { ChevronIcon, ExternalIcon, FileIcon, GitHubIcon, LinkedInIcon } from "./Icons";

const Heading = ({ children, className = "" }) => (
  <h2 className={`text-sm font-semibold uppercase tracking-wide text-zinc-300 ${className}`}>{children}</h2>
);

const Chip = ({ children }) => (
  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-200 ring-1 ring-white/10">{children}</span>
);

function LinkButton({ href, children, primary }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${
        primary ? "bg-white/10 text-white ring-1 ring-yellow-400 hover:bg-white/15" : "bg-white/5 text-zinc-100 hover:bg-white/10"
      }`}
    >
      {children}
    </a>
  );
}

function ProfileCard({ onSelect, withDepth }) {
  return (
    <div className="space-y-5">
      <Heading>Manager</Heading>
      <div className="flex items-center gap-4">
        <img
          src={profile.photo}
          alt={profile.name}
          className="h-20 w-20 rounded-2xl object-cover ring-1 ring-white/20 sm:h-24 sm:w-24"
        />
        <div>
          <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
          <p className="text-sm text-zinc-400">
            {profile.title} @ {profile.org}
          </p>
          <p className="text-sm text-zinc-400">{profile.school}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-zinc-300">{profile.bio}</p>
      <p className="text-sm text-zinc-400">{profile.hint}</p>

      <div className="flex flex-wrap gap-2">
        <LinkButton href={profile.links.resume} primary>
          <FileIcon width={16} height={16} /> Resume
        </LinkButton>
        <LinkButton href={profile.links.github}>
          <GitHubIcon width={16} height={16} /> GitHub
        </LinkButton>
        <LinkButton href={profile.links.linkedin}>
          <LinkedInIcon width={16} height={16} /> LinkedIn
        </LinkButton>
      </div>

      {withDepth && (
        <div className="border-t border-white/10 pt-5">
          <DepthChart onSelect={onSelect} />
        </div>
      )}
    </div>
  );
}

export function DepthChart({ selectedId, onSelect }) {
  const groups = [
    ...["fwd", "mid", "def", "gk"].map((line) => [line, squad.filter((p) => p.line === line)]),
    ["res", reserves],
  ];

  return (
    <div className="space-y-4">
      <Heading>Depth Chart</Heading>
      <button
        type="button"
        onClick={() => onSelect(profile.id)}
        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left transition ${
          selectedId === profile.id ? "bg-white/10 ring-1 ring-yellow-400" : "hover:bg-white/5"
        }`}
      >
        <span aria-hidden>🧑‍💼</span>
        <span className="truncate text-sm text-zinc-100">Manager — {profile.name}</span>
      </button>
      {groups.map(([line, players]) => (
        <div key={line}>
          <div className="mb-2 text-xs uppercase tracking-wide text-zinc-400">{LINES[line]}</div>
          <ul className="space-y-1.5">
            {players.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onSelect(p.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left transition ${
                    p.id === selectedId ? "bg-white/10 ring-1 ring-yellow-400" : "hover:bg-white/5"
                  }`}
                >
                  <Crest player={p} className="h-5 w-5" ring={false} />
                  <span className="truncate text-sm text-zinc-100">
                    {p.pos} — {p.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SkillsCard({ player }) {
  return (
    <div className="space-y-4">
      {Object.entries(player.skills).map(([group, items]) => (
        <div key={group}>
          <div className="mb-2 text-xs uppercase tracking-wide text-zinc-400">{group}</div>
          <div className="flex flex-wrap gap-1.5">
            {items.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-2 pt-1">
        <LinkButton href={profile.links.linkedin} primary>
          <LinkedInIcon width={16} height={16} /> LinkedIn
        </LinkButton>
        <LinkButton href={profile.links.resume}>
          <FileIcon width={16} height={16} /> Resume
        </LinkButton>
      </div>
    </div>
  );
}

function PlayerDetails({ player }) {
  const reserve = player.pos === "RES";
  return (
    <div className="space-y-4">
      <Heading>{reserve ? "Reserves" : "Selected Player"}</Heading>

      {/* logo tile */}
      <div className="flex h-44 items-center justify-center rounded-2xl bg-white/5 p-3 ring-1 ring-white/20">
        {player.logo ? (
          <img src={player.logo} alt={`${player.name} logo`} className="max-h-full max-w-[16rem] rounded-xl object-contain" />
        ) : (
          <div className="flex flex-col items-center">
            <Crest player={player} className="h-24 w-24 shadow-lg" />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">{player.pos}</span>
          {player.number && <span className="text-xs text-zinc-400">#{player.number}</span>}
          {player.captain && (
            <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-semibold text-black">Captain</span>
          )}
        </div>
        <h3 className="mt-2 text-xl font-semibold text-white">{player.name}</h3>
        <p className="text-sm text-zinc-300">{player.role}</p>
        {player.dates && <p className="text-sm text-zinc-400">{player.dates}</p>}
      </div>

      {player.skills ? (
        <SkillsCard player={player} />
      ) : (
        <>
          {player.summary && <p className="text-sm font-medium text-white">{player.summary}</p>}
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-300 marker:text-yellow-400">
            {player.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {player.tools && (
            <div>
              <div className="mb-2 text-xs uppercase tracking-wide text-zinc-400">Tools</div>
              <div className="flex flex-wrap gap-1.5">
                {player.tools.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
          )}
          {player.links && (
            <div className="flex flex-wrap gap-2">
              {player.links.demo && (
                <LinkButton href={player.links.demo} primary>
                  Demo <ExternalIcon />
                </LinkButton>
              )}
              {player.links.code && (
                <LinkButton href={player.links.code}>
                  <GitHubIcon width={16} height={16} /> Code
                </LinkButton>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PlayerCard({ player, onSelect, onPrev, onNext, withDepth = false }) {
  const isProfile = player.id === profile.id;

  return (
    // Only the content area scrolls; the Prev/Next bar stays pinned below it so it never moves
    // between cards of different lengths (when the parent gives the card a fixed height).
    <article className="flex min-h-0 flex-1 flex-col">
      <div data-card-scroll className="panel-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {isProfile ? <ProfileCard onSelect={onSelect} withDepth={withDepth} /> : <PlayerDetails player={player} />}
      </div>

      <nav className="mt-4 flex shrink-0 items-center justify-between border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-zinc-100 transition hover:bg-white/10"
        >
          <ChevronIcon dir="left" width={16} height={16} /> Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-zinc-100 transition hover:bg-white/10"
        >
          Next <ChevronIcon width={16} height={16} />
        </button>
      </nav>
    </article>
  );
}
