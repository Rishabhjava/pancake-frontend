import { useCallback } from 'react'

export const useDrawCanvas = (
  videoRef: React.MutableRefObject<HTMLVideoElement>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement>,
  width: number,
  height: number,
  fps: number,
  canvasInterval: number,
  onVideoEndCallback?: () => void,
) => {
  const video = videoRef?.current
  const canvas = canvasRef?.current
  const isElementReady = video && canvas

  const drawImage = useCallback(() => {
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !video || !context) return
    context.clearRect(0, 0, width, height)
    context.drawImage(video, 0, 0, width, height)
  }, [canvas, video, height, width])

  if (isElementReady) {
    video.onpause = () => {
      clearInterval(canvasInterval)
    }

    video.onended = () => {
      clearInterval(canvasInterval)
    }
    video.onplay = () => {
      window.setInterval(() => {
        drawImage()
      }, 1000 / fps)
    }
  }

  return { drawImage: isElementReady ? drawImage : null }
}