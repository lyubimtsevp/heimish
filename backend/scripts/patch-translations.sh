#!/bin/bash
# Скрипт патча русских переводов Strapi 5
# Запускать после npm install

cd /var/www/api.heimish.ru || exit 1
echo "🔧 Патч русских переводов Strapi 5..."

# 1. Content-Type Builder
for file in node_modules/@strapi/content-type-builder/dist/admin/translations/ru.json.{js,mjs}; do
    if [ -f "$file" ] && ! grep -q "plugin.name.*Конструктор" "$file"; then
        sed -i "/IconPicker.icon.label/a\\    \"plugin.name\": \"Конструктор типов\"," "$file"
    fi
done

# 2. Content-Manager виджеты
for file in node_modules/@strapi/content-manager/dist/admin/translations/ru.json.{js,mjs}; do
    if [ -f "$file" ] && ! grep -q "widget.last-edited.title" "$file"; then
        sed -i "/plugin.name.*Редактор/i\\    \"widget.chart-entries.title\": \"Записи\",\\n    \"widget.last-edited.title\": \"Последние изменённые\",\\n    \"widget.last-published.title\": \"Последние опубликованные\",\\n    \"actions.edit.label\": \"Редактировать\"," "$file"
    fi
done

# 3. Admin переводы
for file in node_modules/@strapi/admin/dist/admin/admin/src/translations/ru.json.{js,mjs}; do
    if [ -f "$file" ] && ! grep -q "content-releases.plugin.name" "$file"; then
        sed -i "/Settings.PageTitle/i\\    \"content-releases.plugin.name\": \"Релизы\",\\n    \"review-workflows.plugin.name\": \"Рецензирование\",\\n    \"Settings.content-history.title\": \"История контента\"," "$file"
    fi
    if [ -f "$file" ] && ! grep -q "HomePage.addWidget.title" "$file"; then
        sed -i "/HomePage.widget.no-permissions/a\\    \"HomePage.addWidget.title\": \"Добавить виджет\",\\n    \"HomePage.addWidget.button\": \"Добавить виджет\"," "$file"
    fi
done

echo "✅ Переводы пропатчены!"
