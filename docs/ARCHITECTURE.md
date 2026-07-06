# ARCHITECTURE

## 概要

Student Planner は JavaScript・HTML・CSS のみで構成する。

設計方針

- 可読性を重視する
- 関数は責務を小さくする
- 共通化できる処理は共通化する
- 将来の機能追加を考慮して設計する
- リファクタリングしやすい構成を維持する

---

# データ構造

## Task

```js
{
    id,
    title,

    completed,
    completedAt,

    due,

    plan: {
        start,
        end
    },

    priority,

    subjectId,

    tagIds: [],

    items: [],

    memo
}
```

### completed

完了状態

### completedAt

完了日時

### due

締切

### plan

作業予定

### items

このTodo固有の持ち物

---

## Event

```js
{
    id,
    title,

    start,
    end,

    subjectId,

    tagIds: [],

    items: [],

    memo
}
```

### start

開始日時

### end

終了日時

### items

このイベント固有の持ち物

---

## Subject

```js
{
    id,
    name,
    color,

    defaultItems: []
}
```

defaultItems は教科の規定持ち物。

Todo・Eventで教科を選択した際の初期値として利用する。

---

## Tag

```js
{
    id,
    name,
    color
}
```

---

# ファイル構成（最終予定）

```
index.html
style.css

js/
    app.js

    todo.js
    event.js

    common.js

    storage.js

    tabs.js

    settings.js
```

---

## app.js

役割

- 初期化
- 各モジュールの起動

ビジネスロジックは持たない。

---

## todo.js

Todo機能

担当

- 追加
- 編集
- 削除
- 完了
- 表示
- 持ち物
- 作業予定

追加は入力フォーム

編集はモーダル

---

## event.js

イベント機能

担当

- 追加
- 編集
- 削除
- 表示
- 持ち物

Todo とほぼ同じ構造で実装する。

追加は入力フォーム

編集はモーダル

---

## common.js

共通処理

例

- createLabel()
- renderItemList()
- addItem()
- truncateText()
- loadSubjects()
- loadTags()

など

---

## storage.js

localStorage管理

保存・読込のみ担当する予定。

---

## tabs.js

タブ切り替え

---

## settings.js

設定画面

担当予定

- 教科
- タグ
- 時間割
- 教科規定持ち物

---

# タブ構成

## Home

ダッシュボード。

編集は行わない。

表示内容

- 今日の持ち物
- 今日期限のTodo
- 今日作業予定のTodo
- 今日のイベント
- 今日の時間割
- Todo・Eventを統合したカレンダー

---

## Todo

Todo管理画面

- 追加
- 編集
- 削除
- 完了

---

## Event

イベント管理画面

- 追加
- 編集
- 削除

---

## Items

持ち物一覧。

表示専用。

Todo

Event

Subject.defaultItems

から集計して表示する。

---

## Settings

設定画面

- 教科
- タグ
- 時間割
- 教科規定持ち物

---

# 設計ルール

- 関数は責務を小さくする
- 共通処理は common.js にまとめる
- localStorage は将来 storage.js に分離する
- Todo と Event はできるだけ同じ構造で実装する
- UI・CSS のデザインを統一する
- 機能追加後は必要に応じてリファクタリングを行う