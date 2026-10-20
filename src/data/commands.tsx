import type { ReactNode } from 'react'
import { profile } from './profile'

const sourceUrl = `${profile.github}/aliorpse.me`

export const commandNames = ['whoami', 'cat stack', 'clear', 'source', 'help'] as const
export type CommandName = (typeof commandNames)[number]

export type Command = { type: 'output'; output: ReactNode } | { type: 'clear' }

export const commands: Record<CommandName, Command> = {
  whoami: {
    type: 'output',
    output: <span className="terminal-text">{profile.handle}</span>,
  },
  'cat stack': {
    type: 'output',
    output: <span className="terminal-text">{profile.stack}</span>,
  },
  clear: { type: 'clear' },
  source: {
    type: 'output',
    output: (
      <a className="terminal-link" href={sourceUrl} target="_blank" rel="noreferrer">
        {sourceUrl}
      </a>
    ),
  },
  help: {
    type: 'output',
    output: <span className="terminal-text">commands: {commandNames.join(' · ')}</span>,
  },
}

export function isCommandName(value: string): value is CommandName {
  return (commandNames as readonly string[]).includes(value)
}
