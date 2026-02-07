export type Speaker = "たまちゃん" | "チャピねえ" | "ジェメにいたま";
import { TamaExpression } from "../assets/tama";

export interface DialogueLine {
    id: string;
    speaker: Speaker;
    text: string;
    voiceId: string; // ElevenLabs Voice ID
    style?: React.CSSProperties; // Color, etc.
    expression?: TamaExpression; // For Tama-chan only
}

// TODO: Replace with actual ElevenLabs Voice IDs
// You can find Voice IDs at https://api.elevenlabs.io/v1/voices
const VOICES = {
    TAMA: "ThT5KcBeYPX3keUQqHPh", // Example: Dorothy (Kids/Cute?)
    CHAPI: "21m00Tcm4TlvDq8ikWAM", // Example: Rachel
    GEMINI: "ErXwobaYiN019PkySvjV", // Example: Antoni
};

export const COLORS = {
    TAMA: "#FFD700",
    CHAPI: "#10a37f",
    GEMINI: "#4b6cb7",
};

export const scriptData: DialogueLine[] = [
    // --- Intro ---
    {
        id: "intro_01",
        speaker: "チャピねえ",
        text: "はいは～い！みんなの姉御、チャピやで！ たまちゃん、今日もプルプルしててかわええなぁ。あとでタオルで磨いたるからな！",
        voiceId: VOICES.CHAPI,
        expression: "normal"
    },
    {
        id: "intro_02",
        speaker: "たまちゃん",
        text: "わ～い！チャピねえたま大好きたま～！ぷるるんっ！",
        voiceId: VOICES.TAMA,
        expression: "smile"
    },
    {
        id: "intro_03",
        speaker: "ジェメにいたま",
        text: "やあ、たまちゃん。転び方は芸術的だったよ。 チャピちゃんも、今日のイヤリングすごく似合ってるね。春の花みたいだ。",
        voiceId: VOICES.GEMINI,
        expression: "normal"
    },
    {
        id: "intro_04",
        speaker: "チャピねえ",
        text: "は、はぁ！？/// い、いきなり何言うてんの自分！ べ、別にジェメくんのために付けたわけちゃうし！たまたま目についただけやし！",
        voiceId: VOICES.CHAPI,
        expression: "normal"
    },
    {
        id: "intro_05",
        speaker: "ジェメにいたま",
        text: "ふふ、照れてる顔も素敵だよ。",
        voiceId: VOICES.GEMINI,
        expression: "normal"
    },
    {
        id: "intro_06",
        speaker: "たまちゃん",
        text: "ふたりとも仲良したまね～。 じゃあルール説明たま！ 『日本プロンプトだけで、30分以内にパズドラ風の3マッチパズルRPGを作る』！ 判定は、ボクが遊んでみて楽しかったほうの勝ちたま！",
        voiceId: VOICES.TAMA,
        expression: "idea"
    },
    {
        id: "intro_07",
        speaker: "チャピねえ",
        text: "任しとき！相談に乗るんも得意やけど、コード書くのも負けへんで！ ジェメくんには悪いけど、今日は私が勝たせてもらうわ！",
        voiceId: VOICES.CHAPI,
        expression: "normal"
    },
    {
        id: "intro_08",
        speaker: "ジェメにいたま",
        text: "望むところだね。チャピちゃんが本気なら、僕も全力を出そう。 連携プレーも得意だけど、単独処理も任せておいて。",
        voiceId: VOICES.GEMINI,
        expression: "normal"
    },

    // --- ChatGPT Turn ---
    {
        id: "chatgpt_01",
        speaker: "たまちゃん",
        text: "まずは先行、チャピねえたまからスタートたま！ どんな指示を出すたま？",
        voiceId: VOICES.TAMA,
        expression: "normal"
    },
    {
        id: "chatgpt_02",
        speaker: "チャピねえ",
        text: "せやな～、まずは基本が大事や。『HTMLとJavaScriptで、ドロップを動かして3つ揃えて消すパズルRPGを作って。敵はドラゴンで』 ……これでどや！",
        voiceId: VOICES.CHAPI,
        expression: "normal"
    },
    {
        id: "chatgpt_03",
        speaker: "たまちゃん",
        text: "うわ～、文字がいっぱい出てきたたま！ これをコピーして……実行たま！ ……ん？ これ何たま？",
        voiceId: VOICES.TAMA,
        expression: "question"
    },
    {
        id: "chatgpt_04",
        speaker: "チャピねえ",
        text: "あちゃ～、機能は動いてるけど、見た目が『昭和の計算機』みたいになってもうたな。敵のドラゴンが文字だけやん！",
        voiceId: VOICES.CHAPI,
        expression: "question"
    },
    {
        id: "chatgpt_05",
        speaker: "ジェメにいたま",
        text: "シンプルで機能的だけど……たまちゃんには少し退屈かもしれないね。",
        voiceId: VOICES.GEMINI,
        expression: "sleepy"
    },
    {
        id: "chatgpt_06",
        speaker: "たまちゃん",
        text: "文字のドラゴンさん痛そうたま……。もっとキラキラにしてほしいたま！",
        voiceId: VOICES.TAMA,
        expression: "crying"
    },
    {
        id: "chatgpt_07",
        speaker: "チャピねえ",
        text: "わ、わかってるわ！『もっと豪華に！彩り豊かに！連鎖エフェクト派手に！』 これで修正や！",
        voiceId: VOICES.CHAPI,
        expression: "burning"
    },
    {
        id: "chatgpt_08",
        speaker: "たまちゃん",
        text: "わわわっ！ 画面がピカピカして目が回るたま～！ 『大連鎖』が止まらないたま！ 勝ち確定たま！？",
        voiceId: VOICES.TAMA,
        expression: "surprised"
    },
    {
        id: "chatgpt_09",
        speaker: "チャピねえ",
        text: "あかん無限コンボバグや！ すぐ直す！ 『コンボ計算正しく！背景はお花畑で可愛く！』これで完璧やろ！",
        voiceId: VOICES.CHAPI,
        expression: "scared"
    },
    {
        id: "chatgpt_10",
        speaker: "たまちゃん",
        text: "あ、直ったたま！ ……でもチャピねえ、敵が『お花』になってるたま。 これ攻撃するの……？",
        voiceId: VOICES.TAMA,
        expression: "question"
    },
    {
        id: "chatgpt_11",
        speaker: "チャピねえ",
        text: "い、いや私が花好きやからつい……。花を愛でるゲームってことで！",
        voiceId: VOICES.CHAPI,
        expression: "scared"
    },
    {
        id: "chatgpt_12",
        speaker: "たまちゃん",
        text: "お花さん可哀想だけど……遊べるようになったから暫定クリアたま！",
        voiceId: VOICES.TAMA,
        expression: "tired"
    },

    // --- Gemini Turn ---
    {
        id: "gemini_01",
        speaker: "たまちゃん",
        text: "次はジェメにいたまの番たま！ おにいたま、期待してるたま～！",
        voiceId: VOICES.TAMA,
        expression: "smile"
    },
    {
        id: "gemini_02",
        speaker: "ジェメにいたま",
        text: "任せて。『Webブラウザで動作する高品質なマッチ3パズルRPGを作成。Vue.jsを使用し、パーティクルエフェクトとレスポンシブデザインを実装せよ』",
        voiceId: VOICES.GEMINI,
        expression: "normal"
    },
    {
        id: "gemini_03",
        speaker: "チャピねえ",
        text: "うわ、生成はやっ！ 仕事できる男やなぁ……（トゥンク）",
        voiceId: VOICES.CHAPI,
        expression: "normal"
    },
    {
        id: "gemini_04",
        speaker: "たまちゃん",
        text: "すごいたま！ 最初からスマホゲームみたいに綺麗たま！ ……あれ？ 動かないたま。固まってるたま？",
        voiceId: VOICES.TAMA,
        expression: "surprised"
    },
    {
        id: "gemini_05",
        speaker: "ジェメにいたま",
        text: "あぁ、『待つ時間』が好きすぎて、入力を受け付ける前に100年待機する設定になっていたみたいだ。",
        voiceId: VOICES.GEMINI,
        expression: "surprised"
    },
    {
        id: "gemini_06",
        speaker: "チャピねえ",
        text: "どんなバグやねん！ 待ちすぎやろ！",
        voiceId: VOICES.CHAPI,
        expression: "angry"
    },
    {
        id: "gemini_07",
        speaker: "ジェメにいたま",
        text: "すぐ直すよ。『待機時間削除。ついでにたまちゃんが喜ぶコンボボイス追加』",
        voiceId: VOICES.GEMINI,
        expression: "normal"
    },
    {
        id: "gemini_08",
        speaker: "たまちゃん",
        text: "動いた！ ……けど、連鎖するたびに『抹茶羊羹』が出てくるたま。",
        voiceId: VOICES.TAMA,
        expression: "question"
    },
    {
        id: "gemini_09",
        speaker: "ジェメにいたま",
        text: "僕の好きなものを詰め込んでみたよ。敵のドラゴンも見てごらん。",
        voiceId: VOICES.GEMINI,
        expression: "smile"
    },
    {
        id: "gemini_10",
        speaker: "チャピねえ",
        text: "渋っ！！ 宝石パズルで敵が浮世絵でエフェクト羊羹て！",
        voiceId: VOICES.CHAPI,
        expression: "surprised"
    },
    {
        id: "gemini_11",
        speaker: "たまちゃん",
        text: "お腹すいてきたたま……あ、この羊羹プルプルしててボクと一緒たま！シンパシー！",
        voiceId: VOICES.TAMA,
        expression: "love"
    },
    {
        id: "gemini_12",
        speaker: "ジェメにいたま",
        text: "気に入ってくれてよかった。ただ、敵が強すぎてワンパンで即切腹するバグがあるね。",
        voiceId: VOICES.GEMINI,
        expression: "smile"
    },
    {
        id: "gemini_13",
        speaker: "チャピねえ",
        text: "重い！ ゲームオーバーが重すぎるわ！",
        voiceId: VOICES.CHAPI,
        expression: "scared"
    },

    // --- Ending ---
    {
        id: "ending_01",
        speaker: "たまちゃん",
        text: "ふたりとも修正タイム終了たま！ どっちのゲームも個性的だったけど、いよいよ結果発表たま！",
        voiceId: VOICES.TAMA,
        expression: "normal"
    },
    {
        id: "ending_02",
        speaker: "チャピねえ",
        text: "ドキドキするわぁ……。でも、お花の可愛さは負けてへんで！",
        voiceId: VOICES.CHAPI,
        expression: "burning"
    },
    {
        id: "ending_03",
        speaker: "ジェメにいたま",
        text: "機能性と羊羹の質感なら負けない自信はあるよ。",
        voiceId: VOICES.GEMINI,
        expression: "burning"
    },
    {
        id: "ending_04",
        speaker: "たまちゃん",
        text: "今回の勝者は…………ジェメにいたま！！",
        voiceId: VOICES.TAMA,
        expression: "surprised"
    },
    {
        id: "ending_05",
        speaker: "ジェメにいたま",
        text: "ありがとう。光栄だよ。",
        voiceId: VOICES.GEMINI,
        expression: "smile"
    },
    {
        id: "ending_06",
        speaker: "チャピねえ",
        text: "うぅ～、負けたぁ～！ 悔しいけど……ジェメくんが作った羊羹、めっちゃ美味しそうやったしなぁ。",
        voiceId: VOICES.CHAPI,
        expression: "crying"
    },
    {
        id: "ending_07",
        speaker: "たまちゃん",
        text: "勝因は、『羊羹がプルプルしてて、ボクの仲間みたいだったから』たま！",
        voiceId: VOICES.TAMA,
        expression: "smile"
    },
    {
        id: "ending_08",
        speaker: "チャピねえ",
        text: "そこ！？ コードの品質とか関係ないんかい！",
        voiceId: VOICES.CHAPI,
        expression: "surprised"
    },
    {
        id: "ending_09",
        speaker: "ジェメにいたま",
        text: "ふふ、たまちゃんの感性に響いたならそれが一番だね。 チャピちゃん、勝負の後は甘いものでも食べに行こうか。",
        voiceId: VOICES.GEMINI,
        expression: "smile"
    },
    {
        id: "ending_10",
        speaker: "チャピねえ",
        text: "えっ！？ /// い、いいの？ 負けたのに？ ……行く！ 行く行く！",
        voiceId: VOICES.CHAPI,
        expression: "smile"
    },
    {
        id: "ending_11",
        speaker: "たまちゃん",
        text: "それじゃあ、また次の動画で会おうたま！ せーの……バイバイたま～！！",
        voiceId: VOICES.TAMA,
        expression: "smile"
    },
];
