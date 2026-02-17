# CTA GTM Auto (Minimal / Always `mcv-trigger`)

目的：
- CTAクリックの「総数」だけを一括計測するため、CTAの親クリック要素に **常に** `mcv-trigger` を付与する。
- GTM側は「Click Classes contains mcv-trigger」の1トリガーで固定し、a/button/Linkの差で設定がブレない運用にする。
- 子要素クリック（img/svg/span/div等）で計測漏れが起きないよう、`pointer-events-none` を自動で付与して必ず潰す。

非目的（やらない）：
- gtm-id / data-gtm-element-id の付与（CTA別の識別・グルーピングは不要）
- GTM側での高度な検知（closest関数等）。GTMは固定手順のみ。

---

## 制約（必須）
- 設定ファイル作成/参照は禁止（gtm.config.ts 等）
- import禁止（GTM_IDS等は禁止）
- 承認されるまでコードを変更しない（候補抽出と一覧提示のみで停止）
- `mcv-trigger` は **常に** 付与する（YES/NO分岐は禁止）

---

## 絶対ルール（事故防止）
1) `mcv-trigger` は **親のクリック要素（CTA本体）だけ** に付ける  
   - 子要素（img/svg/span/div等）には付けない（誤発火・多重発火の原因）
2) クリック漏れ対策として、CTA配下の非インタラクティブ子要素に `pointer-events-none` を付ける  
   - クリックを親に「すり抜け」させる
3) 巨大A禁止：`<a>/<Link>` の中に `<a>/<Link>/<button>` を入れない  
   - 見つけたら自動修正はしない（壊れる可能性が高い）。WARNINGで報告する
4) 既に `mcv-trigger` が付いている要素は二重付与しない

---

## 対象ファイル
優先的に走査：
- app/**/*.(tsx|jsx)
- src/**/*.(tsx|jsx)
- **/*.html

---

## CTA候補の抽出方針（文言縛りに依存しない）
CTA候補＝「主要アクション導線」。
以下を総合して候補抽出する（単一条件に依存しない）：

- <button> / type=submit / role="button"
- <a href="...">（明確な導線）
- Next.js の <Link ...>（next/link）
- ボタンっぽい見た目（rounded, bg/gradient, shadow, h-12/h-14, w-full, font-bold, text-white 等）
- 画像CTA（リンクが画像を包む / CTA画像）

除外（基本除外）：
- ヘッダー/フッターのメニュー列、パンくず、規約/プライバシー等の小リンク群
- 明らかに「主要アクション」ではないテキストリンク群

※ただし、ユーザーが「メニューも全部含めたい」と言った場合は除外方針を緩める。

---

## 実行手順（2パス + 承認ゲート）

### Pass 1：候補抽出（まだ変更しない）
1) 対象を走査（優先：`app/**/*.(tsx|jsx)`, `src/**/*.(tsx|jsx)`, `**/*.html`）
2) a/button/Link を抽出し、CTA候補を選定
3) 候補を一覧化する（ここでは絶対にコードを書き換えない）

#### Pass 1の提示フォーマット（表）
- ID（C1, C2...）
- file path
- 代表行（近い行番号）
- 要素種別（a/button/Link/role=button）
- destination（href / Link href / submit など取れる範囲）
- 既に `mcv-trigger` が付いているか
- WARNING（入れ子a/button、classNameが複雑で自動追記が難しい等）

そして必ず質問して停止：
「どれに `mcv-trigger` を付与しますか？」
- A) 全部
- S) 指定（例：C1,C3,C8）
- E) 除外（例：全適用だがC2,C5は除外）
- N) 何もしない
- R) 再抽出（基準を少し変えて再提示）

※ユーザーの回答が来るまでコード変更は一切しない。

---

### Pass 2：承認された候補だけ編集（付与 + 計測漏れ対策）
ユーザー承認（A/S/E）に従い、対象候補のみ編集する。

#### 2-1 親CTAに `mcv-trigger` を付与（必須）
- 親CTA（a/button/Link/role=button）に `mcv-trigger` を class/className へ追加
- 既に含まれている場合は何もしない
- 子要素には付けない

className追記の安全ルール：
- className が文字列リテラル → 末尾に `mcv-trigger` を追加
- `cn(...)` / `clsx(...)` / `classnames(...)` → 引数に `"mcv-trigger"` を追加
- それ以外の複雑式 → 自動改変で壊すリスクがあるため WARNING を出してスキップ（手動対応）

#### 2-2 子要素クリック問題の解消（必須）
- CTA配下の非インタラクティブ子要素に `pointer-events-none` を追加
  - 対象例：img / svg / span / div / p / strong / em / h1-h6 など
  - 背景用の absolute overlay（div 等）も対象
- 対象外（付与禁止）：
  - a / button / input / textarea / select / label 等のインタラクティブ要素
  - これらがCTAの子にある場合は WARNING（入れ子クリックの可能性）。自動修正はしない

---

## 実行後ログ（必須）
変更後に以下を必ず出力：
- 変更したファイル一覧
- 追加した `mcv-trigger` の総数
- 追加した `pointer-events-none` の総数
- WARNING 一覧（入れ子/複雑className等）

---

## 実装例（参考）

### React/Next（aタグ）
```tsx
<a className="...既存クラス mcv-trigger" href="/contact">
  <span className="pointer-events-none">お問い合わせ</span>
</a>
