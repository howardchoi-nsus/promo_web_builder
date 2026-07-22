"""
Recording 전사 스크립트 (faster-whisper, 로컬 실행용)

사용 환경: 네트워크 제약이 없는 로컬 PC (최초 1회 모델 자동 다운로드)

[설치]
  pip install faster-whisper

[실행 예]
  python transcribe_recording.py "C:\\path\\to\\Recording 20260722155628.m4a"
  # 모델 크기 지정(기본 small): base/small/medium/large-v3
  python transcribe_recording.py "녹음.m4a" --model medium

[출력]
  같은 폴더에
    <파일명>.txt   : 타임스탬프 포함 전사
    <파일명>.srt   : 자막 파일
"""
import sys
import argparse
from pathlib import Path


def fmt_ts(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{s:06.3f}"


def srt_ts(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main() -> int:
    parser = argparse.ArgumentParser(description="faster-whisper 로컬 전사")
    parser.add_argument("audio", help="오디오 파일 경로 (.m4a/.mp3/.wav 등)")
    parser.add_argument("--model", default="small",
                        help="모델 크기: tiny/base/small/medium/large-v3 (기본 small)")
    parser.add_argument("--lang", default="ko", help="언어 코드 (기본 ko)")
    args = parser.parse_args()

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("faster-whisper 미설치. 먼저 실행: pip install faster-whisper")
        return 1

    audio_path = Path(args.audio)
    if not audio_path.exists():
        print(f"파일을 찾을 수 없습니다: {audio_path}")
        return 1

    print(f"[1/2] 모델 로드: {args.model} (최초 1회 다운로드)")
    model = WhisperModel(args.model, device="cpu", compute_type="int8")

    print(f"[2/2] 전사 시작: {audio_path.name}")
    segments, info = model.transcribe(str(audio_path), language=args.lang,
                                      vad_filter=True, beam_size=5)
    print(f"  감지 언어: {info.language} / 길이: {info.duration:.0f}s")

    txt_path = audio_path.with_suffix(".txt")
    srt_path = audio_path.with_suffix(".srt")

    with txt_path.open("w", encoding="utf-8") as ftxt, \
            srt_path.open("w", encoding="utf-8") as fsrt:
        for i, seg in enumerate(segments, 1):
            line = seg.text.strip()
            ftxt.write(f"[{fmt_ts(seg.start)} - {fmt_ts(seg.end)}] {line}\n")
            fsrt.write(f"{i}\n{srt_ts(seg.start)} --> {srt_ts(seg.end)}\n{line}\n\n")
            if i % 20 == 0:
                print(f"  ... {fmt_ts(seg.end)} 진행 중")

    print(f"완료:\n  {txt_path}\n  {srt_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
