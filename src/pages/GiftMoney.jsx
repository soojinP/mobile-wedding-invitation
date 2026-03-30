import { useState } from 'react'
import './GiftMoney.css'

const ACCOUNTS = {
  groom: [
    { relation: '신랑', name: '이창민', bank: 'OO은행', account: '000-0000-0000-00' },
    { relation: '신랑 아버지', name: '이OO', bank: 'OO은행', account: '000-0000-0000-00' },
    { relation: '신랑 어머니', name: 'OOO', bank: 'OO은행', account: '000-0000-0000-00' },
  ],
  bride: [
    { relation: '신부', name: '박수진', bank: 'OO은행', account: '000-0000-0000-00' },
    { relation: '신부 아버지', name: '박OO', bank: 'OO은행', account: '000-0000-0000-00' },
    { relation: '신부 어머니', name: 'OOO', bank: 'OO은행', account: '000-0000-0000-00' },
  ],
}

function AccountCard({ info }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(info.account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = info.account
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="account-row">
      <div className="account-info">
        <span className="account-relation">{info.relation}</span>
        <span className="account-name">{info.name}</span>
        <span className="account-detail">{info.bank} {info.account}</span>
      </div>
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? '복사됨' : '복사'}
      </button>
    </div>
  )
}

export default function GiftMoney() {
  const [showGroom, setShowGroom] = useState(false)
  const [showBride, setShowBride] = useState(false)

  return (
    <div className="page gift-page">
      <h2>마음 전하기</h2>

      <p className="gift-message fade-in">
        참석이 어려우신 분들을 위해<br />
        계좌번호를 안내드립니다.
      </p>

      <p className="gift-joke fade-in-delay">
        (직접 오시는 것만으로도 충분하지만<br />
        계좌번호는 일단 적어둡니다)
      </p>

      <div className="divider fade-in-delay" />

      <div className="account-section fade-in-delay-2">
        <button
          className={`account-toggle ${showGroom ? 'open' : ''}`}
          onClick={() => setShowGroom(!showGroom)}
        >
          <span>신랑측 계좌번호</span>
          <span className="toggle-arrow">{showGroom ? '-' : '+'}</span>
        </button>
        {showGroom && (
          <div className="account-list">
            {ACCOUNTS.groom.map((acc, i) => (
              <AccountCard key={i} info={acc} />
            ))}
          </div>
        )}
      </div>

      <div className="account-section fade-in-delay-2">
        <button
          className={`account-toggle ${showBride ? 'open' : ''}`}
          onClick={() => setShowBride(!showBride)}
        >
          <span>신부측 계좌번호</span>
          <span className="toggle-arrow">{showBride ? '-' : '+'}</span>
        </button>
        {showBride && (
          <div className="account-list">
            {ACCOUNTS.bride.map((acc, i) => (
              <AccountCard key={i} info={acc} />
            ))}
          </div>
        )}
      </div>

      <div className="closing fade-in-delay-3">
        <div className="divider" />
        <p className="closing-text">
          창민 & 수진의 새로운 시작을<br />
          축복해 주셔서 감사합니다.
        </p>
        <p className="closing-date">2026. 05. 25</p>
      </div>
    </div>
  )
}
