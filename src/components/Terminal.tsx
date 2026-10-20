import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { commandNames, commands, isCommandName } from '../data/commands'
import type { CommandName } from '../data/commands'
import { Icon } from './Icon'

type HistoryEntry = {
  id: number
  command: string
  output: ReactNode
}

const MAX_ENTRIES = 100

function outputOf(name: CommandName): ReactNode {
  const command = commands[name]
  if (command.type !== 'output') return null
  return typeof command.output === 'function' ? command.output() : command.output
}

const initialCommands: CommandName[] = ['whoami', 'cat stack']
const initialEntries: HistoryEntry[] = initialCommands.map((command, id) => ({
  id,
  command,
  output: outputOf(command),
}))

function longestCommonPrefix(values: readonly string[]) {
  return values.reduce((prefix, value) => {
    let index = 0
    while (index < prefix.length && index < value.length && prefix[index] === value[index]) {
      index += 1
    }
    return prefix.slice(0, index)
  })
}

// True when no modifier key is held, so the key press is a plain one.
function isPlainKey(event: KeyboardEvent) {
  return !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey
}

function Prompt({ command }: { command: string }) {
  return (
    <span className="prompt">
      <span className="prompt-path" aria-hidden="true">~</span>
      <span className="prompt-chevron" aria-hidden="true">❯</span>
      <span className="prompt-command">{command}</span>
    </span>
  )
}

export function Terminal() {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => initialEntries)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(initialEntries.length)
  const commandHistory = useRef<string[]>([])
  const historyCursor = useRef(-1)

  useEffect(() => {
    const output = outputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [entries])

  function clearTerminal() {
    setEntries([])
  }

  function appendEntry(command: string, output: ReactNode) {
    const id = nextId.current++
    setEntries((previous) => [...previous, { id, command, output }].slice(-MAX_ENTRIES))
  }

  function focusTerminal(event: MouseEvent<HTMLDivElement>) {
    const target = event.target
    if (target instanceof Element && target.closest('a, button')) return
    const selection = window.getSelection()
    if (selection && !selection.isCollapsed) return
    inputRef.current?.focus()
  }

  function execute(raw: string) {
    const command = raw.trim().replace(/\s+/g, ' ')
    if (!command) return

    commandHistory.current.push(command)
    historyCursor.current = -1

    const name = command.toLowerCase()
    if (!isCommandName(name)) {
      appendEntry(
        command,
        <span className="terminal-text terminal-error">command not found: {command}</span>,
      )
    } else if (commands[name].type === 'clear') {
      clearTerminal()
    } else {
      appendEntry(command, outputOf(name))
    }

    setValue('')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    execute(value)
  }

  // Completion works on the raw (lower-cased) input so that the ghost text and
  // Tab / ArrowRight always agree with each other.
  const normalizedValue = value.toLowerCase()
  const matches = normalizedValue
    ? commandNames.filter((name) => name.startsWith(normalizedValue))
    : []
  const ghost =
    matches.length === 1 && matches[0] && matches[0].length > value.length
      ? matches[0].slice(value.length)
      : ''

  function acceptCompletion() {
    if (matches.length === 0) return false
    const completion = longestCommonPrefix(matches)
    if (completion.length <= value.length) return false
    setValue(completion)
    return true
  }

  function historyUp() {
    const items = commandHistory.current
    if (items.length === 0) return
    const next = Math.min(historyCursor.current + 1, items.length - 1)
    historyCursor.current = next
    setValue(items[items.length - 1 - next] ?? '')
  }

  function historyDown() {
    const items = commandHistory.current
    if (historyCursor.current < 0) return
    const next = historyCursor.current - 1
    historyCursor.current = next
    setValue(next < 0 ? '' : (items[items.length - 1 - next] ?? ''))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Tab' && isPlainKey(event)) {
      event.preventDefault()
      acceptCompletion()
      return
    }

    if (event.key === 'ArrowRight' && isPlainKey(event)) {
      const input = event.currentTarget
      const atEnd = input.selectionStart === value.length && input.selectionEnd === value.length
      if (atEnd && acceptCompletion()) event.preventDefault()
      return
    }

    if (event.key === 'ArrowUp' && isPlainKey(event)) {
      event.preventDefault()
      historyUp()
      return
    }

    if (event.key === 'ArrowDown' && isPlainKey(event)) {
      event.preventDefault()
      historyDown()
      return
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault()
      clearTerminal()
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value)
    historyCursor.current = -1
  }

  return (
    <div className="terminal" onClick={focusTerminal}>
      <div className="terminal-bar" aria-hidden="true">
        <span className="terminal-title">
          <Icon name="terminal" size={13} />
          Terminal
        </span>
        <span className="window-controls">
          <span className="window-control minimize" />
          <span className="window-control maximize" />
          <span className="window-control close" />
        </span>
      </div>

      <div className="terminal-output" ref={outputRef}>
        <div className="terminal-log" role="log" aria-label="Terminal output">
          {entries.map((entry) => (
            <div className="terminal-entry" key={entry.id}>
              <p className="terminal-command">
                <Prompt command={entry.command} />
              </p>
              <div className="terminal-result">{entry.output}</div>
            </div>
          ))}
        </div>

        <form className="terminal-form" onSubmit={submit}>
          <span className="prompt" aria-hidden="true">
            <span className="prompt-path">~</span>
            <span className="prompt-chevron">❯</span>
          </span>
          <div className="terminal-input-wrap">
            {value === '' ? <span className="terminal-block-cursor" aria-hidden="true" /> : null}
            {ghost ? (
              <span
                className="terminal-ghost"
                style={{ left: `${value.length}ch` }}
                aria-hidden="true"
              >
                {ghost}
              </span>
            ) : null}
            <input
              ref={inputRef}
              className="terminal-input"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              aria-label="Terminal command"
              data-empty={value === '' || undefined}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
