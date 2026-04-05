import { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
// @ts-expect-error swiper css imports
import 'swiper/css'
// @ts-expect-error swiper css imports
import 'swiper/css/pagination'
// @ts-expect-error swiper css imports
import 'swiper/css/navigation'
import styles from './Gallery.module.css'

interface Props {
  images: string[]
}

export default function Gallery({ images }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [, setCurrentSlide] = useState(0)
  const lightboxSwiperRef = useRef<SwiperType | null>(null)

  return (
    <section className={`section ${styles.gallery}`}>
      <p className="section-title">GALLERY</p>
      <h2 className="section-heading">아름다운 순간</h2>

      <div className={styles.swiperWrap}>
        <Swiper
          modules={[Pagination]}
          pagination={{ type: 'fraction' }}
          spaceBetween={8}
          slidesPerView={1.2}
          centeredSlides
          onSlideChange={(s) => setCurrentSlide(s.activeIndex)}
          className={styles.swiper}
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className={styles.slideItem} onClick={() => setSelected(i)}>
                <img src={img} alt={`갤러리 ${i + 1}`} loading="lazy" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 그리드 썸네일 */}
      <div className={styles.grid}>
        {images.map((img, i) => (
          <div key={i} className={styles.gridItem} onClick={() => setSelected(i)}>
            <img src={img} alt={`갤러리 ${i + 1}`} loading="lazy" />
          </div>
        ))}
      </div>

      {/* 라이트박스 */}
      {selected !== null && (
        <div className={styles.lightbox}>
          <button className={styles.close} onClick={() => setSelected(null)}>×</button>
          <Swiper
            modules={[Navigation]}
            navigation
            initialSlide={selected}
            spaceBetween={0}
            slidesPerView={1}
            onSwiper={(s) => { lightboxSwiperRef.current = s }}
            onSlideChange={(s) => setCurrentSlide(s.activeIndex)}
            className={styles.lightboxSwiper}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <div className={styles.lightboxSlide}>
                  <img src={img} alt={`갤러리 ${i + 1}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={styles.counter}>
            {(lightboxSwiperRef.current?.activeIndex ?? selected) + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  )
}
