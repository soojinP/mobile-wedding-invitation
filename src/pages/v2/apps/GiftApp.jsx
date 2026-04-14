import { useState } from 'react'
import './GiftApp.css'

const ACCOUNTS = {
  groom: [
    { relation: '신랑', name: '이창민', bank: 'OO은행', account: '000-0000-0000-00', kakao: '' },
    { relation: '신랑 아버지', name: '이OO', bank: 'OO은행', account: '000-0000-0000-00', kakao: '' },
    { relation: '신랑 어머니', name: 'OOO', bank: 'OO은행', account: '000-0000-0000-00', kakao: '' },
  ],
  bride: [
    { relation: '신부', name: '박수진', bank: 'OO은행', account: '000-0000-0000-00', kakao: '' },
    { relation: '신부 아버지', name: '박OO', bank: 'OO은행', account: '000-0000-0000-00', kakao: '' },
    { relation: '신부 어머니', name: 'OOO', bank: 'OO은행', account: '000-0000-0000-00', kakao: '' },
  ],
}

function CopyRow({ info }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(info.account)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = info.account
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="gift-row">
      <div className="gift-row-top">
        <div>
          <span className="gift-relation">{info.relation}</span>
          <p className="gift-name">{info.name}</p>
        </div>
        <span className="gift-bank">{info.bank}</span>
      </div>
      <div className="gift-actions">
        <button className="ios-copy-btn" onClick={handleCopy}>
          {copied ? '복사됨 ✓' : '계좌번호 복사'}
        </button>
        {info.kakao && (
          <a className="kakao-pay-btn" href={info.kakao} target="_blank" rel="noopener noreferrer">
            카카오페이 송금
          </a>
        )}
      </div>
    </div>
  )
}

export default function GiftApp() {
  const [tab, setTab] = useState('groom')

  return (
    <div>
      <div className="ios-card" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: '#3c3c43', lineHeight: 1.6 }}>
          참석이 어려우신 분들을 위해<br />계좌번호를 안내드립니다.
        </p>
      </div>

      <div className="ios-segment">
        <button className={tab === 'groom' ? 'active' : ''} onClick={() => setTab('groom')}>
          신랑측
        </button>
        <button className={tab === 'bride' ? 'active' : ''} onClick={() => setTab('bride')}>
          신부측
        </button>
      </div>

      <div className="ios-card">
        {ACCOUNTS[tab].map((acc, i) => (
          <CopyRow key={i} info={acc} />
        ))}
      </div>
    </div>
  )
}
