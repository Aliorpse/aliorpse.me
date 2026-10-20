import type { ReactNode } from 'react'
import { profile } from './profile'

const sourceUrl = `${profile.github}/aliorpse.me`

// `output` may be a function so it can be evaluated lazily, e.g. `help` needs
// `commandNames`, which only exists once `commands` has been built.
export type Command =
  | { type: 'output'; output: ReactNode | (() => ReactNode) }
  | { type: 'clear' }

export const commands = {
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
    output: () => <span className="terminal-text">commands: {commandNames.join(' · ')}</span>,
  },
} satisfies Record<string, Command>

export type CommandName = keyof typeof commands

// Derived from `commands`, so adding a command is a single edit.
export const commandNames = Object.keys(commands) as CommandName[]

export function isCommandName(value: string): value is CommandName {
  return Object.hasOwn(commands, value)
}
