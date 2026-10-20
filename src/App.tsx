import { CopyButton } from './components/CopyButton'
import { Icon } from './components/Icon'
import { Terminal } from './components/Terminal'
import { formatFingerprint, profile, shortenSshKey } from './data/profile'

const sshKey = __SSH_PUBLIC_KEY__

function App() {
  return (
    <div className="page">
      <a className="wordmark" href="/" aria-label="aliorpse.me — home">
        aliorpse.me
      </a>

      <main className="stage">
        <section className="intro" aria-label="Introduction">
          <h1 className="sr-only">{profile.handle}</h1>
          <Terminal />
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
                <span className="row-value row-value--ssh" title={sshKey}>
                  {shortenSshKey(sshKey)}
                </span>
                <span className="row-actions">
                  <CopyButton text={sshKey} label="Copy SSH public key" />
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
