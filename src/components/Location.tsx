import { useEffect, useRef } from 'react'
import { isKakaoInApp } from '../lib/kakaoInApp'
import styles from './Location.module.css'

interface Props {
  venue: string
  hall: string
  address: string
  lat: number
  lng: number
  parking: string
  transport: string
  bus?: string
  phone: string
  naverPlaceId?: string
  kakaoPlaceId?: string
  mapImage?: string
}

export default function Location({ venue, hall, address, lat, lng, parking, transport: _transport, bus, phone, naverPlaceId, kakaoPlaceId, mapImage }: Props) {
  void _transport
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID || 'DEMO'}`
    script.async = true
    script.onload = () => {
      if (mapRef.current && window.naver) {
        const map = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(lat, lng),
          zoom: 16,
          scrollWheel: false,
        })
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map,
        })
      }
    }
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [lat, lng])

  // 카카오맵: place.map.kakao.com은 Safari ITP로 외부 링크에서 데이터 로드 실패하므로
  // map.kakao.com/link/ 형식 사용
  const kakaoMapUrl = kakaoPlaceId
    ? `https://map.kakao.com/link/map/${kakaoPlaceId}`
    : `https://map.kakao.com/link/map/${encodeURIComponent(venue)},${lat},${lng}`
  const naverMapUrl = naverPlaceId
    ? `https://map.naver.com/p/entry/place/${naverPlaceId}`
    : `https://map.naver.com/v5/directions/-/${lng},${lat},${encodeURIComponent(venue)}/-/car`
  // 티맵: tmap://route (goalx=경도, goaly=위도, goalname=이름)
  const tmapUrl = `tmap://route?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(venue)}`

  const handleTmap = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) {
      alert('티맵 내비게이션은 모바일에서 이용해주세요.')
      return
    }
    if (isKakaoInApp()) {
      // 카카오톡 인앱브라우저: tmap:// scheme이 차단되므로 외부 브라우저로 우회
      window.location.href =
        'kakaotalk://web/openExternal?url=' +
        encodeURIComponent(tmapUrl)
    } else {
      window.location.href = tmapUrl
    }
  }

  return (
    <section className={`section ${styles.location}`}>
      <p className="section-title">LOCATION</p>
      <h2 className="section-heading">오시는 길</h2>

      <div className={styles.venueInfo}>
        <p className={styles.venueName}>{venue}</p>
        <p className={styles.hallName}>{hall}</p>
        <p className={styles.address}>{address}</p>
      </div>

      <div ref={mapRef} className={styles.map} />

      <div className={styles.navButtons}>
        <a
          href={naverMapUrl}
          className={styles.navBtn}
          onClick={(e) => {
            e.preventDefault()
            if (isKakaoInApp()) {
              window.location.href =
                'kakaotalk://web/openExternal?url=' + encodeURIComponent(naverMapUrl)
            } else {
              window.location.href = naverMapUrl
            }
          }}
        >
          <span className={styles.navIcon}>🗺</span>
          네이버지도
        </a>
        <a
          href={kakaoMapUrl}
          className={styles.navBtn}
          onClick={(e) => {
            e.preventDefault()
            if (isKakaoInApp()) {
              window.location.href =
                'kakaotalk://web/openExternal?url=' + encodeURIComponent(kakaoMapUrl)
            } else {
              window.location.href = kakaoMapUrl
            }
          }}
        >
          <span className={styles.navIcon}>🗺</span>
          카카오맵
        </a>
        <button onClick={handleTmap} className={styles.navBtn}>
          <span className={styles.navIcon}>🚗</span>
          티맵
        </button>
      </div>

      {mapImage && <img src={mapImage} alt="약도" className={styles.mapImage} />}

      <div className={styles.transportInfo}>
        <div className={styles.transportItem}>
          <span className={styles.transportLabel}>전화</span>
          <a href={`tel:${phone}`} style={{ color: 'var(--color-primary-dark)' }}>{phone}</a>
        </div>
        <div className={styles.transportItem}>
          <span className={styles.transportLabel}>지하철</span>
          <div>
            <p><span className={styles.line2}>2호선</span> 삼성역 2번 출구 정면 방향 800m 도보 좌측 건물</p>
            <p style={{ marginTop: '4px' }}><span className={styles.line3}>3호선</span> 학여울역 1번 출구 정면 방향 940m 도보 우측 건물</p>
          </div>
        </div>
        <div className={styles.transportItem}>
          <span className={styles.transportLabel}>셔틀</span>
          <div>
            <p><span className={styles.line2}>2호선</span> 삼성역 3번 출구</p>
            <p style={{ marginTop: '4px' }}><span className={styles.line3}>3호선</span> 학여울역 1번 출구</p>
            <p style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
              10~15분 간격 운행
            </p>
          </div>
        </div>
        {bus && (
          <div className={styles.transportItem}>
            <span className={styles.transportLabel}>버스</span>
            <div>
              <p>간선: 343 / 401</p>
              <p>지선: 4318 / 4319</p>
              <p>광역: 9407 / 9507 / 9607 / 6900</p>
              <p style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                새마을운동중앙회(총회회관, 휘문고 입구방면) 하차 도보 3분<br />
                휘문고교사거리(대치동 은마아파트 방면) 하차 건너편 도보 3분
              </p>
            </div>
          </div>
        )}
        <div className={styles.transportItem}>
          <span className={styles.transportLabel}>자가용</span>
          <span>{parking}</span>
        </div>
      </div>
    </section>
  )
}
