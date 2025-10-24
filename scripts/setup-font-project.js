#!/usr/bin/env node

/**
 * フォント自動化プロジェクト初期設定スクリプト
 * 
 * このスクリプトは新規プロジェクト開始時に1回だけ実行します。
 * globals.cssにTailwind CSS v4用のカスタムユーティリティクラスを追加します。
 * 
 * 使い方:
 *   node scripts/setup-font-project.js
 *   または
 *   npm run setup-font-project
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ANSIカラーコード
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

// メイン処理
function main() {
  log('\n╔════════════════════════════════════════╗', 'bright');
  log('║  フォント自動化プロジェクト初期設定  ║', 'bright');
  log('╚════════════════════════════════════════╝', 'bright');
  
  log('\n[1] globals.css の確認と設定...', 'blue');
  
  const globalsPath = path.join(rootDir, 'app', 'globals.css');
  
  // globals.cssの存在確認
  if (!fs.existsSync(globalsPath)) {
    log(`\n✗ app/globals.css が見つかりません`, 'red');
    log(`プロジェクトのルートディレクトリで実行してください`, 'yellow');
    process.exit(1);
  }
  
  // 既存のglobals.cssを読み込む
  let cssContent = fs.readFileSync(globalsPath, 'utf8');
  const originalContent = cssContent;
  
  log('\n[2] 重複インポートの確認...', 'blue');
  
  // 🚨 CRITICAL: フォントCSSの重複インポートを検出・削除
  const hasActiveCss = cssContent.includes('@import "../lib/fonts/_active.css"') || 
                       cssContent.includes("@import '../lib/fonts/_active.css'");
  const hasVarsCss = cssContent.includes('@import "../lib/fonts/_vars.css"') || 
                     cssContent.includes("@import '../lib/fonts/_vars.css'");
  
  if (hasActiveCss || hasVarsCss) {
    logWarning('⚠️  重複インポートを検出しました！');
    logInfo('globals.css からフォントCSSのインポートを削除します...');
    logInfo('理由: layout.tsx でインポートすることで全ページに適用されます');
    
    // 重複インポートを削除
    cssContent = cssContent.replace(/@import\s+["']\.\.\/lib\/fonts\/_active\.css["'];?\s*\n?/g, '');
    cssContent = cssContent.replace(/@import\s+["']\.\.\/lib\/fonts\/_vars\.css["'];?\s*\n?/g, '');
    
    logSuccess('重複インポートを削除しました');
  } else {
    logSuccess('重複インポートはありません');
  }
  
  // すでに設定済みかチェック
  if (cssContent.includes('@utility font-display') && cssContent.includes('@theme')) {
    logSuccess('カスタムユーティリティクラスと@theme定義は既に設定済みです');
    
    if (cssContent !== originalContent) {
      // 重複削除のみ実行した場合
      fs.writeFileSync(globalsPath, cssContent, 'utf8');
      logSuccess('globals.css を更新しました');
    }
    
    log('\n次は以下のコマンドでフォントを選択してください:', 'cyan');
    log('  npm run setup-fonts:kawaii    # かわいい', 'cyan');
    log('  npm run setup-fonts:elegant   # 上品・高級感', 'cyan');
    log('  npm run setup-fonts:natural   # やさしい・ナチュラル', 'cyan');
    log('  npm run setup-fonts:cool      # かっこいい', 'cyan');
    log('  npm run setup-fonts:simple    # シンプル', 'cyan');
    log('  npm run setup-fonts:pop       # ポップ', 'cyan');
    log('  npm run setup-fonts:wa        # 和風\n', 'cyan');
    return;
  }
  
  log('\n[3] @theme定義とユーティリティクラスを追加中...', 'blue');
  
  // @theme定義を追加（存在しない場合）
  if (!cssContent.includes('@theme')) {
    const themeDefinition = `
@theme {
  /* フォントファミリーの定義 */
  --font-family-display: var(--font-display);
  --font-family-body: var(--font-body);
  --font-family-sans: var(--font-body);
}
`;
    cssContent += themeDefinition;
    logSuccess('@theme定義を追加しました');
  }
  
  // フォントユーティリティクラスを追加（存在しない場合）
  if (!cssContent.includes('@utility font-display')) {
    const fontUtilities = `
/* カスタムフォントユーティリティクラス */
@utility font-display {
  font-family: var(--font-display, var(--font-geist-sans), sans-serif);
}

@utility font-body {
  font-family: var(--font-body, var(--font-geist-sans), sans-serif);
}
`;
    cssContent += fontUtilities;
    logSuccess('ユーティリティクラスを追加しました');
  }
  
  // globals.cssに書き込む
  fs.writeFileSync(globalsPath, cssContent, 'utf8');
  
  logSuccess('globals.css に設定を追加しました');
  
  log('\n╔════════════════════════════════════════╗', 'green');
  log('║  ✓ プロジェクト初期設定完了！        ║', 'green');
  log('╚════════════════════════════════════════╝', 'green');
  
  log('\n次のステップ:', 'bright');
  log('  好きなフォントを選択してください:\n', 'cyan');
  log('  npm run setup-fonts:kawaii    # かわいい', 'cyan');
  log('  npm run setup-fonts:elegant   # 上品・高級感', 'cyan');
  log('  npm run setup-fonts:natural   # やさしい・ナチュラル', 'cyan');
  log('  npm run setup-fonts:cool      # かっこいい', 'cyan');
  log('  npm run setup-fonts:simple    # シンプル', 'cyan');
  log('  npm run setup-fonts:pop       # ポップ', 'cyan');
  log('  npm run setup-fonts:wa        # 和風\n', 'cyan');
  
  logInfo('このスクリプトは1回だけ実行すればOKです。');
  logInfo('次回からはフォント変更コマンドだけで大丈夫です。\n');
}

// エラーハンドリング
process.on('uncaughtException', (error) => {
  log(`\n✗ エラーが発生しました: ${error.message}`, 'red');
  process.exit(1);
});

// 実行
main();
