/**
 * 카카오톡 인앱브라우저 감지 및 우회 유틸리티
 */

export function isKakaoInApp(): boolean {
  return /KAKAOTALK/i.test(navigator.userAgent)
}

/**
 * 카카오톡 인앱브라우저에서 외부 브라우저로 URL을 연다.
 * 일반 브라우저에서는 window.open 사용.
 */
export function openInExternalBrowser(url: string): void {
  if (isKakaoInApp()) {
    window.location.href =
      'kakaotalk://web/openExternal?url=' + encodeURIComponent(url)
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

/**
 * 클립보드 복사 — navigator.clipboard가 안 되면 execCommand fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // navigator.clipboard (HTTPS + secure context)
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fallback으로 진행
    }
  }

  // execCommand fallback (deprecated이지만 인앱브라우저에서 유일한 대안)
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    document.execCommand('copy')
    return true
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}
