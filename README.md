# ComfyUI: собираем нейросеть, как конструктор

Материалы мастер-класса для Технопарка МФТИ.

- **Презентация** — [`presentation.html`](presentation.html)
- **Воркфлоу** — папка [`ComfyUI_Workflows/`](ComfyUI_Workflows/)
- **Лендинг** — [`index.html`](index.html)

Ниже — инструкция, как поставить себе всё то же самое и запустить оба воркфлоу.

---

## Что нужно от компьютера

| | Минимум | Комфортно |
|---|---|---|
| Видеокарта | NVIDIA, 8 ГБ видеопамяти | NVIDIA, 16 ГБ и больше |
| Оперативная память | 16 ГБ | 32 ГБ |
| Место на диске | 40 ГБ | 80 ГБ |
| Система | Windows 10/11, Linux, macOS | — |

Пара честных замечаний:

- Без видеокарты NVIDIA тоже запустится, но на процессоре одна картинка будет считаться минутами, а не секундами. На macOS с чипами M1–M4 работает нормально.
- Воркфлоу с мемом (модель **4B**) влезает в 8 ГБ видеопамяти. Воркфлоу со страницей манги (модель **9B** плюс LoRA) хочет 12–16 ГБ.
- Место на диске уходит в основном на модели: один файл — это несколько гигабайт.

---

## Шаг 1. Ставим Stability Matrix

**Stability Matrix** — это менеджер, который сам скачивает и настраивает ComfyUI. Не надо ставить Python, Git и разбираться с командной строкой.

1. Идём на [github.com/LykosAI/StabilityMatrix](https://github.com/LykosAI/StabilityMatrix) → раздел **Releases**.
2. Качаем сборку для своей системы:
   - Windows — `StabilityMatrix-win-x64.zip`
   - Linux — `StabilityMatrix-linux-x64.zip`
   - macOS — `StabilityMatrix-macos-arm64.dmg`
3. Распаковываем и запускаем. При первом старте программа спросит, куда складывать модели и пакеты — можно оставить по умолчанию, но лучше выбрать диск, где много места.

> Windows может ругнуться «неизвестный издатель» — это нормально для программ без платной подписи. Жмём «Подробнее» → «Выполнить в любом случае».

---

## Шаг 2. Ставим ComfyUI через Packages

1. В Stability Matrix открываем вкладку **Packages**.
2. Жмём **Add Package**.
3. В списке находим **ComfyUI** → **Install**.
4. Ждём. Программа сама скачает нужную версию Python, все библиотеки и сам ComfyUI — это несколько гигабайт и обычно 5–15 минут.
5. Когда установка закончится, жмём **Launch**. Откроется браузер с интерфейсом ComfyUI.

Если ComfyUI уже стоял раньше, обнови его: в Stability Matrix у пакета есть кнопка **Update**. Воркфлоу из этого репозитория используют модели Flux.2 и требуют свежей версии.

---

## Шаг 3. Включаем ComfyUI Manager

**ComfyUI Manager** — это магазин внутри ComfyUI: через него ставятся дополнительные ноды и качаются модели.

В свежих сборках Manager уже встроен — ищи кнопку **Manager** в правом верхнем углу ComfyUI.

Если кнопки нет, ставим руками:

1. В Stability Matrix у пакета ComfyUI открываем **⋮ → Extensions** (или вкладку **Extensions**).
2. Находим **ComfyUI-Manager** → **Install**.
3. Перезапускаем ComfyUI.

---

## Шаг 4. Качаем модели

Модель — это просто большой файл. Каждый файл кладётся в свою папку внутри `ComfyUI/models/`.

### Проще всего — через Manager

**Manager → Model Manager** → в поиске вбиваем имя файла из таблицы ниже → **Install**. Manager сам положит файл куда надо.

### Что именно нужно

Для **мема** (`meme_generation_example_workflow.json`):

| Файл | Куда кладётся | Прямая ссылка |
|---|---|---|
| `flux-2-klein-4b-fp8.safetensors` | `models/diffusion_models/` | [HuggingFace](https://huggingface.co/black-forest-labs/FLUX.2-klein-4b-fp8/resolve/main/flux-2-klein-4b-fp8.safetensors) |
| `qwen_3_4b.safetensors` | `models/text_encoders/` | [HuggingFace](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/text_encoders/qwen_3_4b.safetensors) |
| `flux2-vae.safetensors` | `models/vae/` | [HuggingFace](https://huggingface.co/Comfy-Org/flux2-dev/resolve/main/split_files/vae/flux2-vae.safetensors) |

Для **страницы манги** (`manga_page_3_panels_v2.json`) нужна модель побольше:

| Файл | Куда кладётся |
|---|---|
| `flux-2-klein-9b-fp8.safetensors` | `models/diffusion_models/` |
| `qwen_3_8b_fp8mixed.safetensors` | `models/text_encoders/` |
| `flux2-vae.safetensors` | `models/vae/` (тот же, что и для мема) |
| `flux2_klein_9b_refcontrol_canny.safetensors` | `models/loras/` |

Эти четыре файла ищи в **Manager → Model Manager** по имени. Прямые ссылки здесь не привожу специально: адреса на HuggingFace у этих сборок меняются, а Manager всегда тянет актуальную.

### Если кладёшь руками

Структура папок такая:

```
ComfyUI/
└── models/
    ├── diffusion_models/
    │   ├── flux-2-klein-4b-fp8.safetensors
    │   └── flux-2-klein-9b-fp8.safetensors
    ├── text_encoders/
    │   ├── qwen_3_4b.safetensors
    │   └── qwen_3_8b_fp8mixed.safetensors
    ├── vae/
    │   └── flux2-vae.safetensors
    └── loras/
        └── flux2_klein_9b_refcontrol_canny.safetensors
```

В Stability Matrix папка `models` общая для всех пакетов — точный путь виден во вкладке **Checkpoints** или в настройках.

После добавления файлов обнови список моделей в ComfyUI: кнопка **R** или перезапуск.

---

## Шаг 5. Открываем воркфлоу

1. Скачай нужный `.json` из папки [`ComfyUI_Workflows/`](ComfyUI_Workflows/).
2. **Перетащи файл прямо в окно ComfyUI.** Схема соберётся сама.
3. В нодах «Загрузить изображение» выбери свои картинки.
4. Поправь текст в нодах с промптом.
5. Жми **Run**.

Готовые картинки появятся в папке `ComfyUI/output/`.

---

## Если что-то не работает

**Красные ноды / «Missing node types»**
Manager → **Install Missing Custom Nodes** → поставить всё, что он предложит → перезапустить ComfyUI.

**«Model not found» или пустой выпадающий список с моделью**
Файл не докачался или лежит не в той папке. Проверь по таблице выше, потом нажми **R** в ComfyUI, чтобы список обновился.

**Ошибка про память: `CUDA out of memory`**
Видеокарте не хватило памяти. Что помогает:
- закрыть игры, браузер с кучей вкладок, всё лишнее;
- взять модель **4B** вместо **9B**;
- уменьшить размер картинки в ноде `EmptyFlux2LatentImage` (например, с 1024 до 768);
- запустить ComfyUI с ключом `--lowvram` (в Stability Matrix это поле **Launch Arguments**).

**Всё считается очень долго**
Скорее всего, работает процессор, а не видеокарта. В Stability Matrix при установке ComfyUI нужно выбрать правильный вариант сборки (CUDA для NVIDIA).

**Картинка получилась страшной**
Это нормально и случается со всеми. Поменяй `noise_seed` (это «бросок кубика»), уточни промпт, добавь отдельным пунктом, чего делать **не** надо — например, про лишние руки.

---

## Что внутри репозитория

```
├── index.html                лендинг со ссылками
├── presentation.html         презентация (reveal.js)
├── config.js                 ссылки на Pages и репозиторий — правятся здесь
├── README.md                 этот файл
├── assets/                   картинки для лендинга и слайдов
│   └── template/             графика из шаблона Avito Start: иконки,
│                             вырезанные фигуры, композиция Q&A
├── presentation/
│   ├── css/                  тема оформления
│   ├── fonts/                Manrope
│   ├── js/                   генератор QR-кодов
│   ├── demos/                интерактивное демо градиентного спуска
│   └── reveal/               reveal.js
└── ComfyUI_Workflows/
    ├── meme_generation_example_workflow.json
    ├── manga_page_3_panels_v2.json
    └── screenshots/          разбор пайплайнов
```

---

## Лицензии

- [reveal.js](https://revealjs.com/) — MIT
- [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) — MIT
- Шрифт [Manrope](https://fonts.google.com/specimen/Manrope) — SIL Open Font License
- Оформление основано на шаблоне Avito Start
