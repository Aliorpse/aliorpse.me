import { escapeHtml } from '../lib/html'
import { profile } from './profile'

const sourceUrl = 'https://github.com/Aliorpse/aliorpse.me'

export type CommandEntry = {
  html: string
  clear?: boolean
}

export const commandNames = ['whoami', 'cat stack', 'clear', 'source', 'help'] as const
export type CommandName = (typeof commandNames)[number]

function terminalText(value: string, tone?: 'name' | 'muted') {
  const toneAttribute = tone ? ` data-tone="${tone}"` : ''
  return `<span class="terminal-text"${toneAttribute}>${escapeHtml(value)}</span>`
}

// Values are trusted, static HTML snippets. User input is escaped by the terminal.
export const commands: Record<CommandName, CommandEntry> = {
  whoami: {
    html: terminalText(profile.handle, 'name'),
  },
  'cat stack': {
    html: terminalText(profile.stack, 'muted'),
  },
  clear: {
    html: '',
    clear: true,
  },
  source: {
    html: `<a class="terminal-link" href="${sourceUrl}" target="_blank" rel="noreferrer">${sourceUrl}</a>`,
  },
  help: {
    html: terminalText(`commands: ${commandNames.join(' · ')}`, 'muted'),
  },
}

export function isCommandName(value: string): value is CommandName {
  return (commandNames as readonly string[]).includes(value)
}
