#!/bin/bash
# 사진 최적화 스크립트
# public/photos/originals/ 원본 → public/photos/ 리사이즈 출력
# 가로 최대 1200px, JPEG quality 80%

SRC="public/photos/originals"
DEST="public/photos"
MAX_WIDTH=1200
QUALITY=80

if [ ! -d "$SRC" ]; then
  echo "원본 폴더가 없습니다: $SRC"
  echo "public/photos/originals/ 에 원본 사진을 넣어주세요."
  exit 1
fi

count=0
for file in "$SRC"/*.{jpg,jpeg,png,JPG,JPEG,PNG,heic,HEIC}; do
  [ -f "$file" ] || continue

  filename=$(basename "$file")
  ext="${filename##*.}"
  name="${filename%.*}"
  output="$DEST/${name}.jpg"

  # 현재 가로 크기 확인
  width=$(sips -g pixelWidth "$file" | tail -1 | awk '{print $2}')

  if [ "$width" -gt "$MAX_WIDTH" ]; then
    # 리사이즈 + JPEG 변환
    sips --resampleWidth "$MAX_WIDTH" -s format jpeg -s formatOptions "$QUALITY" "$file" --out "$output" > /dev/null 2>&1
  else
    # 크기는 그대로, JPEG 변환 + 압축만
    sips -s format jpeg -s formatOptions "$QUALITY" "$file" --out "$output" > /dev/null 2>&1
  fi

  original_size=$(stat -f%z "$file")
  new_size=$(stat -f%z "$output")
  orig_kb=$((original_size / 1024))
  new_kb=$((new_size / 1024))
  echo "  ${filename} (${orig_kb}KB) -> ${name}.jpg (${new_kb}KB)"
  count=$((count + 1))
done

if [ "$count" -eq 0 ]; then
  echo "사진을 찾지 못했습니다. $SRC 에 이미지를 넣어주세요."
  exit 1
fi

echo ""
echo "완료! ${count}장 최적화됨 -> $DEST/"
total=$(du -sh "$DEST"/*.jpg 2>/dev/null | tail -1 | awk '{print $1}')
echo "총 용량: $total"
