interface Window {
  naver: {
    maps: {
      Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown
      LatLng: new (lat: number, lng: number) => unknown
      Marker: new (opts: Record<string, unknown>) => unknown
    }
  }
  Kakao: {
    isInitialized: () => boolean
    init: (key: string) => void
    Share: {
      sendDefault: (opts: Record<string, unknown>) => void
    }
  }
}
