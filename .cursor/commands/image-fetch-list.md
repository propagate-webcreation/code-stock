# Image Fetch List

Google Drive から画像リストを一括取得します（Step 1 専用コマンド）。

## Context Files

- `memories/image_fetch_workflow.yaml` （v2.0.0 - Step 1 セクション）
- `.cursor/rules/workflows.md` （Image Fetch Workflow セクション）

## Instructions

**このコマンドは Step 1（リスト一括取得）のみを実行します。**

1. **🚨 CRITICAL: 必ず以下のファイルを読み込む:**
   - `memories/image_fetch_workflow.yaml` の Step 0 と Step 1 セクション
2. **OS選択 → リスト取得の順で実行**

## Workflow

### Step 0: OS選択（CRITICAL）
- 最初に必ずユーザーのOSを確認（Mac または Windows）
- OS に応じたコマンドを使用

### Step 1: リスト取得（CRITICAL）
- Google Drive から photos と backgrounds のリストを一括取得
- run_terminal_cmd で **1コマンド**を実行
- scripts/photos_index.json と scripts/backgrounds_index.json を生成

## Output Files

- `scripts/photos_index.json` - 写真リスト（JSON配列形式）
- `scripts/backgrounds_index.json` - 背景リスト（JSON配列形式）

## Next Step

リスト取得完了後、以下のコマンドで画像選定を行ってください：

```
/image-select
```

## Execution Example

**User:** `/image-fetch-list`

**AI Action:**
```
[Step 0] OS選択
AI: 使用しているOSを教えてください: Mac または Windows
User: Mac

[Step 1] リスト一括取得（1コマンド）
  → Mac版コマンド実行
  ✅ scripts/photos_index.json 作成
  ✅ scripts/backgrounds_index.json 作成

✅ リスト取得が完了しました！

次のステップ:
画像を選定するには `/image-select` を実行してください。
```

