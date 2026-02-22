# TalkInvoice (喋る請求書)

個人事業主向け音声対話型請求書作成アプリ。

## プロジェクト構成 (Architecture)

Clean Architecture + MVVM パターンを採用し、疎結合な設計を行っています。

```text
TalkInvoice/
├── App/                  # アプリのエントリーポイントと設定
├── Models/               # データモデル (SwiftData)
├── Views/                # SwiftUI Views
│   ├── Main/             # メインの音声入力画面
│   ├── History/          # 請求書履歴一覧
│   └── Components/       # 再利用可能なUIコンポーネント
├── ViewModels/           # 画面ロジックと状態管理
├── Services/             # 外部システムとの連携 (Protocol-Oriented)
│   ├── Interfaces/       # プロトコル定義 (疎結合のための契約)
│   ├── Implementations/  # 実装クラス (OpenAI, Speech, PDF)
│   └── Mock/             # テスト用モック
└── Utilities/            # 定数、拡張機能
```

## 技術スタック
- **Language**: Swift 6
- **UI**: SwiftUI
- **Database**: SwiftData
- **AI**: OpenAI API
- **Speech**: SFSpeechRecognizer, AVSpeechSynthesizer
- **PDF**: PDFKit
