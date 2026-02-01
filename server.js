// HTTPサーバーとSocket.ioを読み込みます
const http = require('http');
const socketIo = require('socket.io');

// サーバーの作成（ポート番号3000で待ち受けます）
const server = http.createServer();
const io = socketIo(server, {
    cors: { origin: "*" } // 他のブラウザからの接続を許可する設定
});

// カウンターの数値をサーバーで保持します
let count = 0;

// ブラウザが接続してきた時のイベント
io.on('connection', (socket) => {
    // 接続した瞬間のブラウザに、現在のカウントを教える
    socket.emit('update_count', count);

    // ブラウザから「add_request」という名前で連絡が来たら実行
    socket.on('add_request', () => {
        count++; // サーバー上の数値を1増やす
        // つながっている「全員」に新しい数値を一斉送信（ブロードキャスト）
        io.emit('update_count', count);
    });
});


// Renderが指定するポート、または3000番を使用する
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`サーバーが起動しました！ポート: ${PORT}`);
});

// // サーバーを起動します
// server.listen(3000, () => {
//     console.log('サーバーが起動しました！ http://localhost:3000');
// });