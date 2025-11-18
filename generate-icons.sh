#!/bin/bash

# Скрипт для создания иконок PWA из одного изображения
# Использование: ./generate-icons.sh path/to/your-logo.png

if [ $# -eq 0 ]; then
    echo "Использование: ./generate-icons.sh path/to/logo.png"
    exit 1
fi

SOURCE_IMAGE=$1

if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Ошибка: Файл $SOURCE_IMAGE не найден"
    exit 1
fi

# Проверка наличия ImageMagick
if ! command -v convert &> /dev/null; then
    echo "ImageMagick не установлен. Установите его:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  Или используйте онлайн-генератор: https://www.pwabuilder.com/imageGenerator"
    exit 1
fi

# Создание директории для иконок
mkdir -p public/icons

# Генерация иконок всех размеров
echo "Генерация иконок..."

convert "$SOURCE_IMAGE" -resize 72x72 public/icons/icon-72x72.png
echo "✓ icon-72x72.png"

convert "$SOURCE_IMAGE" -resize 96x96 public/icons/icon-96x96.png
echo "✓ icon-96x96.png"

convert "$SOURCE_IMAGE" -resize 128x128 public/icons/icon-128x128.png
echo "✓ icon-128x128.png"

convert "$SOURCE_IMAGE" -resize 144x144 public/icons/icon-144x144.png
echo "✓ icon-144x144.png"

convert "$SOURCE_IMAGE" -resize 152x152 public/icons/icon-152x152.png
echo "✓ icon-152x152.png"

convert "$SOURCE_IMAGE" -resize 192x192 public/icons/icon-192x192.png
echo "✓ icon-192x192.png"

convert "$SOURCE_IMAGE" -resize 384x384 public/icons/icon-384x384.png
echo "✓ icon-384x384.png"

convert "$SOURCE_IMAGE" -resize 512x512 public/icons/icon-512x512.png
echo "✓ icon-512x512.png"

echo ""
echo "✅ Все иконки успешно созданы в public/icons/"
echo ""
echo "Следующие шаги:"
echo "1. Проверьте иконки в public/icons/"
echo "2. Настройте backend по инструкции в BACKEND_PUSH_NOTIFICATIONS.md"
echo "3. Протестируйте PWA: npm run build && npm run preview"
