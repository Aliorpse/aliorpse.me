import { useEffect, useState } from 'react'
import { CopyButton } from './components/CopyButton'
import { Icon } from './components/Icon'
import { formatFingerprint, profile, shortenSshKey } from './data/profile'

function Prompt({ command }: { command?: string }) {
  return (
    <span className="prompt" aria-hidden={command ? undefined : true}>
      <span className="prompt-path" aria-hidden="true">~</span>
      <span className="prompt-chevron" aria-hidden="true">❯</span>
      {command ? <span className="prompt-command">{command}</span> : <span className="cursor" aria-hidden="true" />}
    </span>
  )
}

function App() {
  const [sshKey, setSshKey] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(profile.ssh.href, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`SSH key request failed: ${response.status}`)
        return response.text()
      })
      .then((text) => setSshKey(text.trim()))
      .catch(() => {
        if (!controller.signal.aborted) setSshKey(null)
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="page">
      <a className="wordmark" href="/" aria-label="aliorpse.me — home">
        aliorpse.me
      </a>

      <main className="stage">
        <section className="intro" aria-label="Introduction">
          <div className="terminal">
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

            <div className="terminal-body">
              <p className="line command">
                <Prompt command="whoami" />
              </p>
              <h1 className="name">{profile.handle}</h1>
              <p className="line command second">
                <Prompt command="cat stack" />
              </p>
              <p className="stack">{profile.stack}</p>
              <p className="line command last">
                <Prompt />
              </p>
            </div>
          </div>
        </section>

        <section className="details" aria-label="Contact and keys">
          <div className="group">
            <h2 className="group-title">Contact</h2>
            <ul className="rows">
              <li className="row">
                <span className="row-icon">
                  <Icon name="mail" />
                </span>
                <span className="row-label">Email</span>
                <span className="row-value">
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </span>
                <span className="row-actions">
                  <CopyButton text={profile.email} label="Copy email address" />
                </span>
              </li>

              <li className="row">
                <span className="row-icon">
                  <Icon name="github" />
                </span>
                <span className="row-label">GitHub</span>
                <span className="row-value">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="me noreferrer"
                    aria-label={`${profile.handle} on GitHub (opens in a new tab)`}
                  >
                    {profile.handle}
                    <Icon name="arrow-up-right" size={13} />
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className="group">
            <h2 className="group-title">Keys</h2>
            <ul className="rows">
              <li className="row">
                <span className="row-icon">
                  <Icon name="key" />
                </span>
                <span className="row-label">GPG</span>
                <span className="row-value row-value--fingerprint">
                  {formatFingerprint(profile.gpg.fingerprint)}
                </span>
                <span className="row-actions">
                  <CopyButton text={profile.gpg.fingerprint} label="Copy GPG fingerprint" />
                  <a
                    className="icon-button"
                    href={profile.gpg.href}
                    download={profile.gpg.filename}
                    aria-label="Download GPG public key"
                    title="Download GPG public key"
                  >
                    <Icon name="download" />
                  </a>
                </span>
              </li>

              <li className="row">
                <span className="row-icon">
                  <Icon name="terminal" />
                </span>
                <span className="row-label">SSH</span>
                <span className="row-value row-value--ssh" title={sshKey ?? undefined}>
                  {sshKey ? shortenSshKey(sshKey) : 'ssh-ed25519 …'}
                </span>
                <span className="row-actions">
                  <CopyButton text={sshKey ?? ''} label="Copy SSH public key" disabled={!sshKey} />
                  <a
                    className="icon-button"
                    href={profile.ssh.href}
                    download={profile.ssh.filename}
                    aria-label="Download SSH public key"
                    title="Download SSH public key"
                  >
                    <Icon name="download" />
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
