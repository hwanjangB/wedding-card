/**
 * 청첩장 초기 설정 스크립트
 *
 * data.json을 기반으로:
 *   1. index.html 메타태그 업데이트
 *   2. 요일 자동 계산
 *
 * 사용법:
 *   npx tsx scripts/setup.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const root = join(import.meta.dirname, '..')
const data = JSON.parse(readFileSync(join(root, 'src', 'data.json'), 'utf-8'))

// 1. 요일 자동 계산
const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
const dateObj = new Date(data.wedding.date + 'T00:00:00')
const dayOfWeek = days[dateObj.getDay()]
const hour = parseInt(data.wedding.time.split(':')[0])
const timeStr = hour < 12 ? `오전 ${hour}시` : `오후 ${hour - 12 || 12}시`
const dateStr = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 ${dayOfWeek} ${timeStr}`

// data.json 업데이트
data.wedding.dayOfWeek = dayOfWeek
data.meta.title = `${data.groom.name} ♥ ${data.bride.name} 결혼합니다`
data.meta.description = dateStr
writeFileSync(join(root, 'src', 'data.json'), JSON.stringify(data, null, 2) + '\n', 'utf-8')
console.log(`✓ data.json 업데이트`)
console.log(`  - 요일: ${dayOfWeek}`)
console.log(`  - 제목: ${data.meta.title}`)
console.log(`  - 설명: ${data.meta.description}`)

// 2. index.html 메타태그 업데이트
let html = readFileSync(join(root, 'index.html'), 'utf-8')
html = html.replace(
  /(<meta name="og:title" content=")([^"]*)(">)/,
  `$1${data.meta.title}$3`
)
html = html.replace(
  /(<meta name="og:description" content=")([^"]*)(">)/,
  `$1${data.meta.description}$3`
)
html = html.replace(
  /(<title>)([^<]*)(<\/title>)/,
  `$1${data.meta.title}$3`
)
writeFileSync(join(root, 'index.html'), html, 'utf-8')
console.log(`✓ index.html 메타태그 업데이트`)

console.log(`\n완료! npm run dev 로 확인하세요.`)
