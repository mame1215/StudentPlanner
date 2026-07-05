# Student Planner 技術設計書

## ディレクトリ構成（予定）

```
StudentPlanner/

│ index.html
│ style.css
│ app.js

├─css/
│    modal.css
│    calendar.css
│    timetable.css

├─js/
│
├── main.js
├── storage.js
├── ui.js
│
├── todo.js
├── event.js
├── timetable.js
├── subject.js
├── item.js
├── settings.js
│
└── utils.js

```

※最初は app.js だけで実装し、機能が増えたら分割する。

---

# データ構造

## Todo（変更あり。開発引き継ぎとjsファイルを参照）

```javascript
{
    id,
    title,

    deadline,

    start,

    end,

    priority,

    subject,

    tags: [],

    items: [],

    memo,

    completed,

    completedAt
}
```

---

## Event

```javascript
{
    id,

    title,

    start,

    end,

    subject,

    tags: [],

    items: [],

    place,

    memo,

    repeat
}
```

---

## Subject

```javascript
{
    id,

    name,

    defaultItems:[]
}
```

---

## Item

```javascript
{
    id,

    name
}
```

---

## Timetable

```javascript
{
    monday: [],

    tuesday: [],

    wednesday: [],

    thursday: [],

    friday: []
}
```

例

```javascript
monday:[
    subjectId1,
    subjectId3,
    subjectId5
]
```

---

## Settings

```javascript
{
    todoDays,

    theme,

    language
}
```

---

# LocalStorage

当面は一つずつ保存する。

```
todos

events

subjects

items

timetable

settings
```

---

# モジュールの役割

## storage.js

保存・読込のみ担当

```
saveTodos()

loadTodos()

saveEvents()

loadEvents()

・・・
```

---

## todo.js

Todo専用

```
addTodo()

deleteTodo()

updateTodo()

sortTodos()

renderTodos()

completeTodo()
```

---

## event.js

```
addEvent()

deleteEvent()

updateEvent()

renderCalendar()
```

---

## timetable.js

```
loadTimetable()

saveTimetable()

renderTimetable()
```

---

## item.js

```
addItem()

deleteItem()

renderItems()
```

---

## subject.js

```
addSubject()

renderSubjects()
```

---

## ui.js

画面制御のみ担当

```
openModal()

closeModal()

showToast()

scrollToSection()
```

---

## utils.js

共通関数

```
formatDate()

compareDate()

generateId()

sortByPriority()

sortByDeadline()
```

---

# 描画方針

データ変更

↓

LocalStorage保存

↓

render()

の流れを統一する。

例

```
Todo追加

↓

todos.push()

↓

saveTodos()

↓

renderTodos()
```

---

# ソートルール

Todo

1. 期限

2. 優先度

3. タイトル

---

Event

開始日時

---

予定一覧

開始時刻順

Todoは期限時刻として扱う。

---

# ID

UUIDは使わず

```
Date.now()
```

または

```
現在最大ID+1
```

を使用する。

将来的に変更可能。

---

# CSS方針

できるだけ

```
id
```

ではなく

```
class
```

で共通化する。

例

```
.text-input

.primary-button

.secondary-button

.card

.section-title

.modal

.modal-content
```

---

# 命名規則

JavaScript

```
camelCase
```

```
renderTodo()

saveSettings()

addEvent()
```

CSS

```
kebab-case
```

```
task-card

todo-item

primary-button
```

---

# 開発ルール

機能追加するときは

1. データ構造を決める

↓

2. LocalStorage対応

↓

3. UI作成

↓

4. 編集

↓

5. 削除

↓

6. ソート

↓

7. デザイン調整

の順に実装する。

---

# 実装ロードマップ

Phase1

Todo完成

↓

Phase2

教科

↓

Phase3

持ち物

↓

Phase4

時間割

↓

Phase5

イベント

↓

Phase6

カレンダー

↓

Phase7

持ち物自動生成

↓

Phase8

繰り返し予定

↓

Phase9

条件付き予定

↓

Phase10

設定画面

↓

Phase11

リファクタリング

---

# 今後の課題

・Googleカレンダー連携

・通知

・PWA対応

・ダークモード

・CSV入出力

・統計表示

・バックアップ機能

```
```
