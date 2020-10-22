
var alpha = 0, beta = 0, gamma = 0;             // ジャイロの値を入れる変数を3個用意
var canvas = document.getElementById("canvas"); // ★canvas要素を取得 
var context = canvas.getContext("2d");
var phase = 0;

function deviceMotionRequest() {
    if (DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener("deviceorientation", (dat) => {
                        alpha = -dat.alpha;  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
                        beta = dat.beta;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
                        gamma = dat.gamma;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
                    });
                }
            })
            .catch(console.error);
    } else {
        alert('DeviceMotionEvent.requestPermission is not found')
    }
    phase = 1;
}

function Speak() {
    const btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
        const synth = new SpeechSynthesisUtterance();
        const txt = document.getElementById("instruction");// テキストボックスを取得
        synth.text = txt.innerHTML; // 話す内容
        synth.lang = "ja-JP";   // 言語
        synth.rate = 1.2;       // 速さ
        synth.pitch = 1.0;       // 高さ
        synth.volume = 1.0;       // 音量
        window.speechSynthesis.speak(synth);
    });

}
Speak();


// 指定時間ごとに繰り返し実行される setInterval(実行する内容, 間隔[ms]) タイマーを設定
var timer = window.setInterval(() => {
    displayInstruction();
    drawOrientation();    // displayData 関数を実行
    displayData();
}, 33); // 33msごとに（1秒間に約30回）

var count = 0;
var countup = function () {
    if (phase == 2) count++;
}
var id = setInterval(function () {
    countup();
    if (count > 11) {
        alert("あなたにプログラムされていた内容:\n int time=10;\nwhile(time>0){\ntime--;\nLookAt(smartphone);\nStretch();\n}");
        phase = 3;
        clearInterval(id);

    }
}, 3000);

var timer2 = window.setInterval(() => {
    countup();
}, 1000);

// データを表示する displayData 関数
function displayData() {
    //var txt = document.getElementById("txt3");   // データを表示するdiv要素の取得

    var radianAlpha = alpha * Math.PI / 180;
    //txt.innerHTML = radianAlpha;
    if (phase == 1 && Math.abs(radianAlpha + 3) <= 0.3) {
        alert("あなたにプログラムされていた内容:\n LookAt(SmartPhone);\nTurn(Math.PI);")
        phase++;

    }
    if (phase == 3 && Math.abs(radianAlpha + 3) <= 0.3) {
        alert("あなたにプログラムされていた内容:\n LookAt(SmartPhone);\nTurn(Math.PI);")
        phase++;

    }
}

function drawOrientation() {
    var centerX = canvas.width / 2;            // canvasの中心のX座標
    var centerY = canvas.height / 2;	        // canvasの中心のY座標
    var radius = 100;                          // 枠円の半径および針の長さ
    var radianAlpha = alpha * Math.PI / 180;    // 角度をラジアンに変換
    context.clearRect(0, 0, canvas.width, canvas.height);   // canvasの内容を消す clearRect(x, y, w, h)
    context.beginPath();                        // 描画開始
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);  // 枠円を描く
    context.strokeStyle = "rgb(0, 0, 0)";       // 枠円の線の色
    context.lineWidth = 2;                      // 線の太さ
    context.stroke();                           // 線を描画
    context.beginPath();                        // 描画開始
    context.moveTo(centerX, centerY);           // 中心に移動
    // 線を引く（cosでx座標、sinでy座標が得られる。長さradiusを掛ける。-90度すると真上に向く。）
    context.lineTo(centerX + Math.cos(radianAlpha - Math.PI / 2) * radius,
        centerY + Math.sin(radianAlpha - Math.PI / 2) * radius);
    context.strokeStyle = "rgb(255, 0, 0)";     // 針の線の色
    context.lineWidth = 5;                      // 線の太さ
    context.stroke();                           // 線を描画
}

function displayInstruction() {
    var inst = document.getElementById("instruction");
    var txt = document.getElementById("txt")
    switch (phase) {
        case 0:
            inst.innerHTML = "命令：ジャイロセンサ許可　を押してスタート";
            break;
        case 1:
            inst.innerHTML = "命令：後ろを向いてください。";
            txt.innerHTML = '<img src="./img/backman.png" width = 50% />';
            break;
        case 2:
            inst.innerHTML = "命令：10秒間伸びをしてください。";
            txt.innerHTML = '<img src="./img/nobi.png" width = 50% />';
            break;
        case 3:
            inst.innerHTML = "命令：元の向きに戻ってください。";
            txt.innerHTML = '<img src="./img/normal.png" width = 50% />';
            break;
        case 4:
            inst.innerHTML = "おつかれさまでした。";
            var all = document.getElementById("all");
            all.style.display = "none";
            var program = document.getElementById("program");
            program.innerHTML = "Thank you. You were programmed as below:<br><br>";
            program.innerHTML += "LookAt(SmartPhone);<br>Turn(Math.PI);<br>";
            program.innerHTML += "int time=10;<br>while(time>0){<br>time--;<br>LookAt(SmartPhone);<br>Stretch();<br>}<br>";
            program.innerHTML += "LookAt(SmartPhone);<br>Turn(Math.PI);<br>";
            if (phase == 4) {
                const synth = new SpeechSynthesisUtterance();
                synth.text = "Thank you. You were programed as below:LookAt(SmartPhone);Turn(Math.PI);int time=10;while(time>0){time--;LookAt(smartphone);Stretch();}LookAt(SmartPhone);Turn(Math.PI);"; // 話す内容
                synth.lang = "en-US";   // 言語
                synth.rate = 1.1;       // 速さ
                synth.pitch = 1.0;       // 高さ
                synth.volume = 1.0;       // 音量
                window.speechSynthesis.speak(synth);
                phase++;
            }

            break;



    }
}
