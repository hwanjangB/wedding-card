/**
 * Firebase 방명록 + RSVP 테스트 데이터 초기화 스크립트
 *
 * 사용법:
 *   npx tsx scripts/clear-data.ts
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { join } from 'path'

const serviceAccount = JSON.parse(
  readFileSync(join(import.meta.dirname, '..', 'serviceAccountKey.json'), 'utf-8')
)

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

async function deleteCollection(collectionName: string) {
  const snapshot = await db.collection(collectionName).get()
  if (snapshot.empty) {
    console.log(`${collectionName}: 비어있음 (삭제할 문서 없음)`)
    return
  }

  const batch = db.batch()
  snapshot.docs.forEach((doc) => batch.delete(doc.ref))
  await batch.commit()
  console.log(`${collectionName}: ${snapshot.size}건 삭제 완료`)
}

async function main() {
  console.log('Firebase 테스트 데이터 초기화 중...\n')
  await deleteCollection('guestbook')
  await deleteCollection('rsvp')
  console.log('\n초기화 완료!')
  process.exit(0)
}

main()
