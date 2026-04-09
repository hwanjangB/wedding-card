import type { Plugin } from 'vite'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

/**
 * data.json에서 결혼식 정보를 읽어 public/wedding.ics 정적 파일을 생성하는 Vite 플러그인.
 * public/ 폴더의 파일은 vite가 dev/build 모두에서 그대로 serve/복사한다.
 */
export function generateIcsPlugin(): Plugin {
  function generateIcs() {
    const data = JSON.parse(
      readFileSync(resolve(__dirname, 'src/data.json'), 'utf-8')
    )
    const { date, time, venue, hall, address } = data.wedding
    const groomName = data.groom.name
    const brideName = data.bride.name

    const eventTitle = `💒 ${groomName} ♥ ${brideName} 결혼식`
    const eventLocation = `${venue}${hall ? ' ' + hall : ''} (${address})`
    const eventDesc = `신랑: ${groomName}\\n신부: ${brideName}\\n\\n장소: ${venue}\\n주소: ${address}`

    const dtStart = `${date.replace(/-/g, '')}T${time.replace(':', '')}00`
    const endHour = (parseInt(time.split(':')[0]) + 2)
      .toString()
      .padStart(2, '0')
    const dtEnd = `${date.replace(/-/g, '')}T${endHour}${time.split(':')[1]}00`

    const ics = [
      'BEGIN:VCALENDAR',
      'CALSCALE:GREGORIAN',
      'VERSION:2.0',
      `X-WR-CALNAME:${eventTitle}`,
      'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Seoul',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:+1000',
      'DTSTART:19881009T030000',
      'TZNAME:GMT+9',
      'TZOFFSETTO:+0900',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      'TRANSP:OPAQUE',
      `DTSTART;TZID=Asia/Seoul:${dtStart}`,
      `DTEND;TZID=Asia/Seoul:${dtEnd}`,
      `SUMMARY:${eventTitle}`,
      `LOCATION:${eventLocation}`,
      `DESCRIPTION:${eventDesc}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'DESCRIPTION:미리 알림',
      'ACTION:DISPLAY',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'DESCRIPTION:미리 알림',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const publicDir = resolve(__dirname, 'public')
    mkdirSync(publicDir, { recursive: true })
    writeFileSync(resolve(publicDir, 'wedding.ics'), ics, 'utf-8')
  }

  return {
    name: 'generate-ics',
    // dev/build 모두에서 시작 시 public/에 생성
    buildStart() {
      generateIcs()
    },
  }
}
