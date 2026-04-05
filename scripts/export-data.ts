/**
 * Firebase 방명록 + RSVP 데이터 다운로드 스크립트 (Admin SDK)
 *
 * 사전 준비:
 *   1. Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성
 *   2. 다운로드된 JSON 파일을 프로젝트 루트에 serviceAccountKey.json으로 저장
 *
 * 사용법:
 *   npx tsx scripts/export-data.ts
 *
 * 결과:
 *   exports/guestbook_YYYY-MM-DD.csv
 *   exports/rsvp_YYYY-MM-DD.csv
 *   exports/rsvp_summary_YYYY-MM-DD.txt
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// 서비스 계정 키 로드
const serviceAccount = JSON.parse(
  readFileSync(join(import.meta.dirname, '..', 'serviceAccountKey.json'), 'utf-8')
)

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const today = new Date().toISOString().split('T')[0]
const exportDir = join(import.meta.dirname, '..', 'exports')

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

async function exportGuestbook() {
  const snapshot = await db.collection('guestbook').orderBy('createdAt', 'desc').get()

  const rows = ['\uFEFF이름,메시지,날짜']
  snapshot.docs.forEach((doc) => {
    const d = doc.data()
    const date = d.createdAt ? d.createdAt.toDate().toISOString().split('T')[0] : ''
    rows.push(`${escapeCsv(d.name)},${escapeCsv(d.text)},${date}`)
  })

  const filename = `guestbook_${today}.csv`
  writeFileSync(join(exportDir, filename), rows.join('\n'), 'utf-8')
  console.log(`방명록: ${snapshot.size}건 → exports/${filename}`)
}

async function exportRsvp() {
  const snapshot = await db.collection('rsvp').orderBy('createdAt', 'desc').get()

  const statusMap: Record<string, string> = {
    attending: '참석',
    not_attending: '불참',
    undecided: '미정',
  }

  const rows = ['\uFEFF이름,참석여부,인원,날짜']
  let totalAttending = 0
  let totalCount = 0
  let totalNotAttending = 0
  let totalUndecided = 0

  snapshot.docs.forEach((doc) => {
    const d = doc.data()
    const date = d.createdAt ? d.createdAt.toDate().toISOString().split('T')[0] : ''
    const statusKr = statusMap[d.status] || d.status
    rows.push(`${escapeCsv(d.name)},${statusKr},${d.count || 0},${date}`)

    if (d.status === 'attending') {
      totalAttending++
      totalCount += d.count || 0
    } else if (d.status === 'not_attending') {
      totalNotAttending++
    } else if (d.status === 'undecided') {
      totalUndecided++
    }
  })

  const filename = `rsvp_${today}.csv`
  writeFileSync(join(exportDir, filename), rows.join('\n'), 'utf-8')
  console.log(`RSVP: ${snapshot.size}건 → exports/${filename}`)

  const summary = [
    `=== RSVP 요약 (${today}) ===`,
    `전체 응답: ${snapshot.size}명`,
    `참석: ${totalAttending}명 (총 ${totalCount}인)`,
    `불참: ${totalNotAttending}명`,
    `미정: ${totalUndecided}명`,
  ].join('\n')

  const summaryFile = `rsvp_summary_${today}.txt`
  writeFileSync(join(exportDir, summaryFile), summary, 'utf-8')
  console.log(`요약 → exports/${summaryFile}`)
  console.log('\n' + summary)
}

async function main() {
  mkdirSync(exportDir, { recursive: true })
  console.log('Firebase Admin SDK로 데이터 다운로드 중...\n')
  await exportGuestbook()
  await exportRsvp()
  console.log('\n완료!')
  process.exit(0)
}

main()
