import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

function fallbackCopy(text: string) {
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.append(field)

  try {
    field.select()
    return document.execCommand('copy')
  } finally {
    field.remove()
  }
}

type CopyButtonProps = {
  text: string
  label: string
  disabled?: boolean
}

export function CopyButton({ text, label, disabled = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    let copiedSuccessfully = true

    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(text)
    } catch {
      copiedSuccessfully = fallbackCopy(text)
    }

    if (!copiedSuccessfully) return

    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <>
      <button
        type="button"
        className="icon-button"
        data-copied={copied || undefined}
        disabled={disabled}
        onClick={copy}
        aria-label={label}
        title={copied ? 'Copied' : label}
      >
        <Icon name={copied ? 'check' : 'copy'} />
      </button>
      <output className="sr-only" aria-live="polite">
        {copied ? 'Copied' : ''}
      </output>
    </>
  )
}
