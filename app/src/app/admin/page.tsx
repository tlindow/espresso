"use client";

import { useState, useEffect, useCallback } from "react";

interface Session {
  id: string;
  name: string;
  branch: string;
  status: "active" | "idle" | "stopped";
  lastActive: string;
}

interface GitContext {
  branch: string;
  repo: string;
  owner: string;
  vercelPreviewUrl: string;
  prUrl: string;
}

const MOCK_SESSIONS: Session[] = [
  {
    id: "session_01KP96gd7aHupV917quv3jNx",
    name: "terminal-session-switcher",
    branch: "claude/terminal-session-switcher-O7y27",
    status: "active",
    lastActive: "just now",
  },
  {
    id: "session_02AB34cd5eFghI678jklm9nO",
    name: "espresso-cafe-finder",
    branch: "claude/espresso-cafe-finder-TuHAF",
    status: "idle",
    lastActive: "12m ago",
  },
];

function StatusDot({ status }: { status: Session["status"] }) {
  const colors = {
    active: "bg-green-400",
    idle: "bg-amber-400",
    stopped: "bg-zinc-500",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colors[status]}`}
    />
  );
}

function SessionCard({
  session,
  isSelected,
  onSelect,
}: {
  session: Session;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-lg border transition-colors ${
        isSelected
          ? "border-blue-500/50 bg-blue-500/10"
          : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <StatusDot status={session.status} />
          <span className="text-sm font-medium">{session.name}</span>
        </div>
        <span className="text-xs text-zinc-500">{session.lastActive}</span>
      </div>
      <div className="text-xs text-zinc-500 font-mono truncate">
        {session.branch}
      </div>
    </button>
  );
}

function TerminalTab({
  session,
  isActive,
  onClick,
}: {
  session: Session;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-mono rounded-t-md border-x border-t transition-colors ${
        isActive
          ? "border-zinc-700 bg-zinc-900 text-zinc-100"
          : "border-transparent bg-transparent text-zinc-500 hover:text-zinc-300"
      }`}
    >
      <span className="flex items-center gap-1.5">
        <StatusDot status={session.status} />
        {session.name}
      </span>
    </button>
  );
}

export default function AdminPage() {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    MOCK_SESSIONS[0].id
  );
  const [gitContext, setGitContext] = useState<GitContext | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "$ claude session list",
    "  session_01KP96gd7a...  terminal-session-switcher  active",
    "  session_02AB34cd5e...  espresso-cafe-finder       idle",
    "",
    "$ claude session resume session_01KP96gd7aHupV917quv3jNx",
    "Resuming session: terminal-session-switcher",
    "Connected to cloud session.",
    "",
  ]);

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  const deriveGitContext = useCallback((session: Session) => {
    const owner = "tlindow";
    const repo = "espresso";
    const branch = session.branch;
    return {
      branch,
      repo,
      owner,
      vercelPreviewUrl: `https://${repo}-git-${branch.replace(/\//g, "-")}-${owner}.vercel.app`,
      prUrl: `https://github.com/${owner}/${repo}/pull?q=head:${branch}`,
    };
  }, []);

  useEffect(() => {
    if (selectedSession) {
      setGitContext(deriveGitContext(selectedSession));
    }
  }, [selectedSession, deriveGitContext]);

  const handleOpenInSafari = (url: string) => {
    window.open(url, "_blank");
  };

  const handleNewSession = () => {
    const id = `session_${Date.now()}`;
    const newSession: Session = {
      id,
      name: "new-session",
      branch: "claude/new-session",
      status: "active",
      lastActive: "just now",
    };
    setSessions((prev) => [...prev, newSession]);
    setSelectedSessionId(id);
    setTerminalOutput((prev) => [
      ...prev,
      "$ claude session start",
      `Started new session: ${id}`,
      "",
    ]);
  };

  const handleResumeSession = (session: Session) => {
    setSelectedSessionId(session.id);
    setTerminalOutput((prev) => [
      ...prev,
      `$ claude session resume ${session.id}`,
      `Resuming session: ${session.name}`,
      "Connected to cloud session.",
      "",
    ]);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === session.id ? { ...s, status: "active" as const, lastActive: "just now" } : s
      )
    );
  };

  return (
    <div className="p-6 grid grid-cols-12 gap-4 h-[calc(100vh-53px)]">
      {/* Left Panel: Claude Code Sessions */}
      <div className="col-span-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Cloud Sessions
          </h2>
          <button
            onClick={handleNewSession}
            className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            + New
          </button>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isSelected={session.id === selectedSessionId}
              onSelect={() => handleResumeSession(session)}
            />
          ))}
        </div>

        {/* Context Panel */}
        {gitContext && (
          <div className="mt-auto border border-zinc-800 rounded-lg p-3 bg-zinc-900">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Context
            </h3>
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-zinc-500">branch</span>
                <div className="font-mono text-zinc-300 truncate">
                  {gitContext.branch}
                </div>
              </div>
              <div>
                <span className="text-zinc-500">repo</span>
                <div className="font-mono text-zinc-300">
                  {gitContext.owner}/{gitContext.repo}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Center Panel: Terminal */}
      <div className="col-span-6 flex flex-col">
        <div className="flex items-end border-b border-zinc-800">
          {sessions.map((session) => (
            <TerminalTab
              key={session.id}
              session={session}
              isActive={session.id === selectedSessionId}
              onClick={() => handleResumeSession(session)}
            />
          ))}
        </div>
        <div className="flex-1 bg-zinc-900 border border-zinc-800 border-t-0 rounded-b-lg p-4 font-mono text-xs leading-relaxed overflow-y-auto">
          {terminalOutput.map((line, i) => (
            <div key={i} className={line.startsWith("$") ? "text-green-400" : "text-zinc-400"}>
              {line || "\u00A0"}
            </div>
          ))}
          <div className="flex items-center text-green-400">
            <span>$ </span>
            <span className="w-2 h-4 bg-green-400 animate-pulse ml-0.5" />
          </div>
        </div>
      </div>

      {/* Right Panel: Vercel Preview + GitHub PR */}
      <div className="col-span-3 flex flex-col gap-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            Quick Open
          </h2>
          <p className="text-xs text-zinc-500 mb-3">
            Opens in Safari for clean separation from your editor.
          </p>
        </div>

        {gitContext && (
          <>
            {/* Vercel Preview */}
            <button
              onClick={() => handleOpenInSafari(gitContext.vercelPreviewUrl)}
              className="w-full text-left p-4 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Vercel Preview</span>
                <svg
                  className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <div className="text-xs text-zinc-500 font-mono truncate">
                {gitContext.vercelPreviewUrl}
              </div>
            </button>

            {/* GitHub PR */}
            <button
              onClick={() => handleOpenInSafari(gitContext.prUrl)}
              className="w-full text-left p-4 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">GitHub PR</span>
                <svg
                  className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <div className="text-xs text-zinc-500 font-mono truncate">
                {gitContext.owner}/{gitContext.repo} #{gitContext.branch.split("/").pop()}
              </div>
            </button>

            {/* Open Both */}
            <button
              onClick={() => {
                handleOpenInSafari(gitContext.vercelPreviewUrl);
                setTimeout(() => handleOpenInSafari(gitContext.prUrl), 300);
              }}
              className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
            >
              Open Both in Safari
            </button>
          </>
        )}

        {/* How it works */}
        <div className="mt-auto border border-zinc-800 rounded-lg p-3 bg-zinc-900/50">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            How this works
          </h3>
          <ul className="text-xs text-zinc-500 space-y-1">
            <li>Each session maps to a Claude Code cloud session</li>
            <li>Terminal tabs switch between active sessions</li>
            <li>Branch is auto-detected from the session</li>
            <li>Vercel preview URL derived from branch name</li>
            <li>Safari keeps previews separate from your editor</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
