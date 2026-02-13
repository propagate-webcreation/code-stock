# Gist 用コンポーネント JSON に変換

選択または指定された React/TSX コンポーネントを、`lib/utils/component-converter.ts` の形式に従い、**当プロジェクトのインデックス（番号付け）規則**に合わせて Gist アップロード用 JSON に変換する。

## 出力方法（必須）

- **ファイルは作成しない**。JSON ファイルをディスクに書き込んだり、新規ファイルを作成したりしてはいけない。
- **チャット内にのみ出力する**。変換結果は、エージェントチャットの返答として **1 つの Markdown コードブロック**（\`\`\`json ... \`\`\`）で出力する。ユーザーがチャット上でそのブロックをクリックしてそのままコピーできる形式にする。説明文は短くし、コードブロックを目立たせる。
- **コードブロックの直後に、完了メッセージを一言添える**。例：「上記をコピーして Gist アップロードに貼り付けてください。」など、短い一文で終える。

---

## 当プロジェクトのインデックス規則（必須）

- **category**: **フォルダ名ではなく、コンポーネントの内容を見て決める**。コンポーネントの役割・UI・用途を確認し、適切な既存カテゴリを選ぶ（PascalCase）。例: `Hero`, `Header`, `Company`, `Contact`, `Faq`, `CTA`, `Features`, `Footer`, `Gallery`, `Navigation`, `Price`, `Service`, `Voice` など。該当するものがなければ既存の命名に合わせて新規カテゴリを決める。
- **fileName**: **`websitename_section.tsx`** 形式（componentId と対応）。小文字・アンダースコア。例: `nextcorp_about.tsx`, `google_pricing.tsx`, `acme_hero.tsx`。同一 category 内で重複しなければよい。インデックスでは `id = fileName.replace(/\.tsx$/,'').toLowerCase()` で componentId と一致する。
- **componentId**（JSON の **name**）: **`websitename_section`** 形式。小文字・アンダースコア区切り。例: `nextcorp_about`, `google_pricing`。fileName の拡張子を除いた部分と一致させる（`fileName === componentId + '.tsx'`）。

## 出力する JSON の構造

- **name**: 上記 componentId（`websitename_section` 形式。例: `nextcorp_about`, `google_pricing`）
- **type**: 常に `"registry:ui"`
- **description**: `"${category} component ${componentName}"`（componentName は fileName の .tsx 除く。例: `"Company component nextcorp_about"`）
- **files**: 長さ 1 の配列。要素は以下:
  - **path**: `"components/${category}/${fileName}"`（例: `"components/Company/nextcorp_about.tsx"`）。`fileName` は `websitename_section.tsx` 形式。
  - **type**: `"registry:ui"`
  - **content**: コンポーネントのソース全文（`'use client';` を先頭に含める場合はそのまま含める）

## 変換手順

1. **name**（componentId）: `websitename_section` 形式で決める。例: `nextcorp_about`, `google_pricing`。ユーザー指定または category を section に（About→about, Price→pricing）、プロジェクト名から websitename を推測。
2. **fileName**: `name + '.tsx'`（例: `nextcorp_about.tsx`）。componentId と拡張子除いて一致させる。
3. **category**: コンポーネントの詳細（役割・見た目・用途）を見て、適切なカテゴリを選ぶ。ファイルの配置フォルダは参照しない。既存カテゴリ（`Hero`, `Company`, `Price`, `Footer`, `CTA` など）のうち、内容に最も合うものを PascalCase で指定する。
4. 対象の `.tsx` の内容をそのまま `content` に使う。必要なら先頭に `'use client';` を付与。
5. 上記の構造で JSON を組み立て、`JSON.stringify(json, null, 2)` で整形して出力する。

## 出力例（抜粋）

```json
{
  "name": "nextcorp_about",
  "type": "registry:ui",
  "description": "Company component nextcorp_about",
  "files": [
    {
      "path": "components/Company/nextcorp_about.tsx",
      "type": "registry:ui",
      "content": "'use client';\n\nimport ..."
    }
  ]
}
```

（別例: `"name": "google_pricing"`, `"path": "components/Price/google_pricing.tsx"` など、name と fileName を `websitename_section` で統一）

## 補足

- この JSON は `POST /api/upload-component-to-gist` の `componentJson` としてそのまま送れる（本番 Vercel からも利用可能）。
- アプリ内の「JSONをGistにアップロード」UI に貼り付けてアップロードできる。
- **componentId** と **fileName** は `websitename_section` で対応させる（`fileName = componentId + '.tsx'`）。これにより `scan-components` の `id = baseName.toLowerCase()` と整合し、インデックスに問題は出ない。**category** はコンポーネントの内容に基づいて決め、既存カテゴリ名（PascalCase）に合わせる。
