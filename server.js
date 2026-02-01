const http = require('http');
const fs = require('fs'); // ファイルを読み込むための道具を追加
const socketIo = require('socket.io');

// サーバーの動作設定
const server = http.createServer((req, res) => {
    // ブラウザからアクセスが来たら index.html を読み込んで返す
    fs.readFile(__dirname + '/index.html', (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
});

const io = socketIo(server, {
    cors: { origin: "*" }
});

let count = 0;

io.on('connection', (socket) => {
    socket.emit('update_count', count);
    socket.on('add_request', () => {
        count++;
        io.emit('update_count', count);
    });
});

// ポート番号は環境変数（PORT）を優先するように変更
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});