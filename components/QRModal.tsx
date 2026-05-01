'use client'
// components/QRModal.tsx
// Opens via custom 'openQRModal' window event (fired from Nav).
// Uses react-qr-code (lightweight, no canvas required).

import { useState, useEffect, useCallback } from 'react'
import QRCode from 'react-qr-code'

type Tab = 'courses' | 'site' | 'contact'

const VCARD = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'FN:Aaron Snowberger Ph.D.',
  'TITLE:AI Researcher & Educator',
  'ORG:Korean Universities',
  'EMAIL;TYPE=INTERNET:hi@aaron.kr',
  'URL:https://aaron.kr',
  'NOTE:Physical AI · CS Education · Jeonju Korea',
  'END:VCARD',
].join('\r\n')

const TABS: { id: Tab; labelEn: string; labelKo: string; url: string; titleEn: string; titleKo: string }[] = [
  {
    id: 'courses',
    labelEn: 'Courses',   labelKo: '강의',
    url: 'https://courses.aaron.kr/',
    titleEn: 'Student Course Page', titleKo: '수강생 강의 페이지',
  },
  {
    id: 'site',
    labelEn: 'Website',   labelKo: '사이트',
    url: 'https://aaron.kr',
    titleEn: 'Personal Site', titleKo: '개인 사이트',
  },
  {
    id: 'contact',
    labelEn: 'Contact',   labelKo: '연락처',
    url: VCARD,
    titleEn: 'Contact Card', titleKo: '연락처 카드',
  },
]

export default function QRModal() {
  const [open, setOpen]       = useState(false)
  const [activeTab, setTab]   = useState<Tab>('courses')

  // ── Listen for the custom event fired by Nav ──────────────────────────────
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('openQRModal', handler)
    return () => window.removeEventListener('openQRModal', handler)
  }, [])

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // ── Download .vcf ─────────────────────────────────────────────────────────
  const downloadVcf = useCallback(() => {
    const blob = new Blob([VCARD], { type: 'text/vcard' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'aaron-snowberger.vcf'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const currentTab = TABS.find((t) => t.id === activeTab)!

  return (
    <div
      className={`modal-bg${open ? ' open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
      role="dialog"
      aria-modal="true"
      aria-label="QR Codes"
      aria-hidden={!open}
    >
      <div className="qr-card">
        {/* Close button */}
        <button
          className="modal-close fs"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="qr-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`qtab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setTab(tab.id)}
            >
              <span className="en">{tab.labelEn}</span>
              <span className="ko">{tab.labelKo}</span>
            </button>
          ))}
        </div>

        {/* Active pane */}
        <div className="qr-pane active" role="tabpanel">
          {/* QR code — white bg required for scanability */}
          <div className="qr-box-lg">
            <QRCode
              value={currentTab.url}
              size={284}
              bgColor="#ffffff"
              fgColor="#000000"
              level={activeTab === 'contact' ? 'M' : 'H'}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          <div className="qr-ptitle">
            <span className="en">{currentTab.titleEn}</span>
            <span className="ko">{currentTab.titleKo}</span>
          </div>

          <div className="qr-purl">
            {activeTab === 'contact' ? (
              <>
                <span className="en">Scan to save · <span dangerouslySetInnerHTML={{ __html: 'hi&#64;aaron.kr' }} /></span>
                <span className="ko">스캔하여 저장 · <span dangerouslySetInnerHTML={{ __html: 'hi&#64;aaron.kr' }} /></span>
              </>
            ) : (
              currentTab.url
            )}
          </div>

          {/* .vcf download — contact tab only */}
          {activeTab === 'contact' && (
            <button className="qr-dl fs" onClick={downloadVcf}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span className="en">Download .vcf</span>
              <span className="ko">.vcf 다운로드</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
