const SUITS = { '♠': { s: '♠', w: 4, c: 'black' }, '♥': { s: '♥', w: 3, c: 'red' }, '♦': { s: '♦', w: 2, c: 'red' }, '♣': { s: '♣', w: 1, c: 'black' } };
let p1 = {}, p2 = {};
let activePlayer = 'p1';
let gamePhase = 'p1_base'; 
let baseDeck = [], boostDeck = [];

function initDeck() {
    baseDeck = []; boostDeck = [];
    for (let s in SUITS) {
        for (let v = 1; v <= 13; v++) {
            let text = v;
            if (v === 1) text = 'A'; if (v === 11) text = 'J'; if (v === 12) text = 'Q'; if (v === 13) text = 'K';
            baseDeck.push({ val: v, text: text, suit: SUITS[s], type: (v >= 11 ? 'face' : 'num') });
        }
        boostDeck.push({ val: 2, text: 'J', suit: SUITS[s], type: 'face' });
        boostDeck.push({ val: 3, text: 'Q', suit: SUITS[s], type: 'face' });
        boostDeck.push({ val: 4, text: 'K', suit: SUITS[s], type: 'face' });
    }
    baseDeck.push({ val: 0, suit: { s: 'JK', c: 'joker' }, type: 'joker' });
    baseDeck.push({ val: 0, suit: { s: 'JK', c: 'joker' }, type: 'joker' });
    boostDeck.push({ val: 5, suit: { s: 'JK', c: 'joker' }, type: 'joker' });
    shuffle(baseDeck); shuffle(boostDeck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initGame() {
    initDeck();
    // 内部データをすべてきれいな0に初期化
    p1 = { baseScore: 0, multiplier: 0, phase: 'base', isReverseMode: false, currentCard: null, holdCard: null, lastShiftCard: null, hasUsedBaseHold: false, hasUsedBoostHold: false, totalScore: 0, chainCount: 1, barrierStock: 0 };
    p2 = { baseScore: 0, multiplier: 0, phase: 'base', isReverseMode: false, currentCard: null, holdCard: null, lastShiftCard: null, hasUsedBaseHold: false, hasUsedBoostHold: false, totalScore: 0, chainCount: 1, barrierStock: 0 };
    gamePhase = 'p1_base'; activePlayer = 'p1';
    
    p1.currentCard = baseDeck.pop();
    p1.baseScore = p1.currentCard.type === 'joker' ? 10 : p1.currentCard.val;

    if (p1.currentCard.type !== 'joker' && p1.currentCard.val >= 8) p1.isReverseMode = true;
    if (p1.currentCard.type === 'joker') p1.currentCard.virtualVal = p1.isReverseMode ? 14 : 0;

    document.getElementById('btn-restart').style.display = 'none';
    document.getElementById('log').innerHTML = '';
    
    // ★バグ修正：新しく試合を始める際、画面上の盾の枚数表示（HTML）も強制的に「0個」にリセットします
    document.getElementById('p1-barrier-display').innerText = '🛡️×0';
    document.getElementById('p2-barrier-display').innerText = '🛡️×0';

    toggleControls(true);
    log(`【ゲーム開始】フェーズ1：あなたのベースフェーズ！`);
    log(`最初のカード: [${getCardText(p1.currentCard)}] 。現在の基本点: ${p1.baseScore}点（「${p1.isReverseMode ? 'DOWN' : 'UP'}」開始）`);
    
    updateUI();
}

function getCardText(card) {
    if (!card) return '';
    if (card.type === 'joker') return 'JOKER';
    return card.suit.s + card.text;
}

function renderCardEl(elId, card) {
    const el = document.getElementById(elId); el.className = 'card';
    if (!card) { el.classList.add('empty'); el.innerHTML = ''; return; }
    el.classList.add(card.suit.c || 'black');
    if (card.type === 'joker') {
        el.innerHTML = '🃏<div style="font-size:12px">JOKER</div>';
    } else {
        let numText = card.text;
        if (card.val === 14 || card.val === 0) numText = 'A';
        el.innerHTML = `<div style="position:absolute; top:5px; left:5px; font-size:14px">${card.suit.s}</div>` + numText;
    }
}

function updateUI() {
    ['p1', 'p2'].forEach(pKey => {
        const data = pKey === 'p1' ? p1 : p2;
        document.getElementById(`${pKey}-score`).innerText = data.baseScore;
        let currentMult = data.phase === 'base' ? 1 : (data.multiplier === 0 ? 1 : data.multiplier);
        document.getElementById(`${pKey}-multiplier`).innerText = data.phase === 'base' ? '1.0 (ベース中)' : currentMult + '.0';
        let displayTotal = data.baseScore * currentMult;
        document.getElementById(`${pKey}-total`).innerText = displayTotal;
        data.totalScore = displayTotal;
        renderCardEl(`${pKey}-current`, data.currentCard);
        renderCardEl(`${pKey}-hold`, data.holdCard);
        const banner = document.getElementById(`${pKey}-banner`);
        const holdStatus = document.getElementById(`${pKey}-hold-status`);
        
        if (data.phase === 'base') {
            banner.className = `mode-indicator ${data.isReverseMode ? 'mode-down' : 'mode-up'}`;
            banner.innerText = `ベース: ${data.isReverseMode ? 'DOWN' : 'UP'}`;
            holdStatus.innerText = data.hasUsedBaseHold ? ' (使用済)' : (data.holdCard ? ' (ストック中)' : '');
        } else {
            if (data.phase === 'shift') { banner.className = 'mode-indicator mode-shift'; banner.innerText = 'ブースト: スート判定'; }
            else { banner.className = 'mode-indicator'; banner.style.backgroundColor = '#485460'; banner.innerText = '終了'; }
            holdStatus.innerText = data.hasUsedBoostHold ? ' (使用済)' : (data.holdCard ? ' (ストック中)' : '');
        }
    });
    document.getElementById('p1-panel').className = `player-panel ${activePlayer === 'p1' ? 'active' : ''}`;
    document.getElementById('p2-panel').className = `player-panel com-panel ${activePlayer === 'p2' ? 'active' : ''}`;
    
    if (activePlayer === 'p1') {
        const isBase = gamePhase.includes('base');
        const hasUsed = isBase ? p1.hasUsedBaseHold : p1.hasUsedBoostHold;
        if (hasUsed) {
            document.getElementById('p1-btn-hold').disabled = true;
            document.getElementById('p1-btn-use-hold').disabled = true;
        } else {
            document.getElementById('p1-btn-hold').disabled = p1.holdCard ? true : !p1.currentCard;
            document.getElementById('p1-btn-use-hold').disabled = !p1.holdCard;
        }
        document.getElementById('p1-btn-stand').disabled = isBase;
    }
}


function toggleControls(enable) {
    document.getElementById('p1-btn-hit').disabled = !enable;
    document.getElementById('p1-btn-stand').disabled = !enable;
    document.getElementById('p1-btn-hold').disabled = !enable;
    document.getElementById('p1-btn-use-hold').disabled = !enable;
}

function log(msg) {
    const logBox = document.getElementById('log');
    logBox.innerHTML = msg + '<br>' + logBox.innerHTML;
}

function handleHit() { if (activePlayer === 'p1') executeHit(p1); }
function handleStand() { if (activePlayer === 'p1') executeStand(p1); }
function handleHold() { if (activePlayer === 'p1') executeHold(p1); }
function handleUseHold() { if (activePlayer === 'p1') executeUseHold(p1); }

function executeHit(player) {
    const isBase = gamePhase.includes('base');
    let deck = isBase ? baseDeck : boostDeck;
    
    if (deck.length === 0) {
        log(`【山札がなくなりました！】新しいトランプの山を積み直してシャッフルします。`);
        if (isBase) {
            for (let s in SUITS) {
                for (let v = 1; v <= 13; v++) {
                    let text = v;
                    if (v === 1) text = 'A'; if (v === 11) text = 'J'; if (v === 12) text = 'Q'; if (v === 13) text = 'K';
                    baseDeck.push({ val: v, text: text, suit: SUITS[s], type: (v >= 11 ? 'face' : 'num') });
                }
            }
            baseDeck.push({ val: 0, suit: { s: 'JK', c: 'joker' }, type: 'joker' });
            baseDeck.push({ val: 0, suit: { s: 'JK', c: 'joker' }, type: 'joker' });
            shuffle(baseDeck); deck = baseDeck;
        } else {
            for (let s in SUITS) {
                boostDeck.push({ val: 2, text: 'J', suit: SUITS[s], type: 'face' });
                boostDeck.push({ val: 3, text: 'Q', suit: SUITS[s], type: 'face' });
                boostDeck.push({ val: 4, text: 'K', suit: SUITS[s], type: 'face' });
            }
            boostDeck.push({ val: 5, suit: { s: 'JK', c: 'joker' }, type: 'joker' });
            shuffle(boostDeck); deck = boostDeck;
        }
    }
    
    let nextCard = deck.pop();
    if (isBase) processBaseCard(player, nextCard); else processBoostCard(player, nextCard);
}

function processBaseCard(player, next) {
    const pName = player === p1 ? 'あなた' : 'AI';
    const pKey = player === p1 ? 'p1' : 'p2';
    
    if (player.chainCount === undefined) player.chainCount = 1; 
    player.chainCount++;

    log(`${pName}がカードを引きました: [${getCardText(next)}] (現在 ${player.chainCount}枚目)`);
    
    if (player.barrierStock === undefined) player.barrierStock = 0;

    if (player.chainCount % 7 === 0) {
        player.barrierStock++;
        document.getElementById(`${pKey}-barrier-display`).innerText = `🛡️×${player.barrierStock}`;
        log(`<div class="barrier-log">⚡【S-BARRIER EXPANSION】連鎖ボーナス！${pName}の引いたカードが ${player.chainCount} 枚に到達！【スート防壁（バリア）】が追加されました！ (現在: 🛡️×${player.barrierStock}個所持)</div>`);
    }

    if (next.val === 1 || next.val === 7 || next.type === 'joker') {
        player.currentCard = next;
        if (next.type === 'joker') {
            player.baseScore += 10;
            log(`➡ 【JOKER】判定最有利リセット！(+10点)`);
        } else {
            player.baseScore += next.val;
            player.isReverseMode = !player.isReverseMode;
            log(`➡ 【${next.val===1?'A':'7'}】強制セーフ！判定が「${player.isReverseMode ? 'DOWN' : 'UP'}」に反転し、次も確定セーフ！ (+${next.val}点)`);
        }
        player.currentCard.virtualVal = player.isReverseMode ? 14 : 0;
        updateUI();
        if (activePlayer === 'p2') setTimeout(aiDecision, 1000);
        return;
    }

    let currentTargetVal = (player.currentCard && player.currentCard.virtualVal !== undefined) ? player.currentCard.virtualVal : player.currentCard.val;
    let success = (!player.isReverseMode && next.val >= currentTargetVal) || (player.isReverseMode && next.val <= currentTargetVal);
    player.currentCard = next;
    
    if (success) {
        player.baseScore += next.val;
        log(`➡ 連鎖成功！現在の基本点: ${player.baseScore}点`);
        updateUI();
        if (activePlayer === 'p2') setTimeout(aiDecision, 1000);
    } else {
        log(`⏹ 条件不一致。${pName}のベースフェーズ終了。獲得点は維持されます。`);
        updateUI(); advancePhase();
    }
}

function processBoostCard(player, next) {
    const pName = player === p1 ? 'あなた' : 'AI';
    const pKey = player === p1 ? 'p1' : 'p2';
    log(`${pName}が絵札を引きました: [${getCardText(next)}]`);

    let multValue = 0;
    if (next.text === 'J') multValue = 0;
    if (next.text === 'Q') multValue = 1;
    if (next.text === 'K') multValue = 2;

    if (next.barrierStock === undefined) next.barrierStock = player.barrierStock || 0;

    if (next.type === 'joker') {
        player.currentCard = next;
        if (!player.lastShiftCard) player.multiplier = 3; else player.multiplier += 3;
        log(`➡ 【JOKER】強制セーフ！次を100%成功にリセット。 (+3倍)`);
        player.lastShiftCard = { suit: { w: 0 } };
        updateUI();
        if (activePlayer === 'p2') setTimeout(aiDecision, 1000);
        return;
    }

    player.currentCard = next;

    if (!player.lastShiftCard) {
        player.multiplier = multValue === 0 ? 1 : multValue;
        log(`➡ 初期絵札確定。現在の倍率: ${player.multiplier}倍`);
        player.lastShiftCard = next;
        updateUI();
        if (activePlayer === 'p2') setTimeout(aiDecision, 1000);
    } else {
        if (next.suit.w >= player.lastShiftCard.suit.w) {
            player.multiplier += multValue;
            log(`➡ 連鎖成功！現在の倍率: ${player.multiplier}倍${multValue>0?' (+'+multValue+'倍)':''}`);
            player.lastShiftCard = next;
            updateUI();
            if (activePlayer === 'p2') setTimeout(aiDecision, 1000);
        } else {
            if (player.barrierStock && player.barrierStock > 0) {
                player.barrierStock--;
                document.getElementById(`${pKey}-barrier-display`).innerText = `🛡️×${player.barrierStock}`;
                log(`<div class="barrier-log" style="color:#ffc107; border-color:#ffc107; background-color:rgba(255,193,7,0.1)">🛡️ <b>【防壁が身代わりになりました！】スート連鎖に失敗しましたが、バリアを1個消費して転落を無効化！場札をリセットして継続します。(残りバリア: 🛡️×${player.barrierStock}個)</b></div>`);
                player.lastShiftCard = { suit: { w: 0 } };
                updateUI();
                if (activePlayer === 'p2') setTimeout(aiDecision, 1000);
            } else {
                // ★バースト没収ルールの緩和：基本点はそのまま維持し、倍率だけを1倍に強制固定してフェーズ終了
                log(`❌ <b>スート連鎖ストップ！${pName}のブーストフェーズは終了です。倍率は【 1倍 】に強制リセットされましたが、ベース点（基本点）は保護されます！</b>`);
                player.multiplier = 1;
                player.phase = 'ended';
                updateUI(); advancePhase();
            }
        }
    }
}



function executeStand(player) {
    const pName = player === p1 ? 'あなた' : 'AI';
    if (player.phase === 'shift') {
        player.phase = 'ended';
        log(`🎉 ${pName}が倍率をセーフティ確定！ 【 ${player.baseScore * player.multiplier}点 】`);
        updateUI(); advancePhase();
    }
}

function executeHold(player) {
    const pName = player === p1 ? 'あなた' : 'AI';
    const isBase = gamePhase.includes('base');
    const hasUsed = isBase ? player.hasUsedBaseHold : player.hasUsedBoostHold;
    if (!player.currentCard || hasUsed || player.holdCard) return;

    let temp = player.currentCard;
    if(temp.type === 'joker') temp.val = 0;
    if(temp.val === 0 && temp.type === 'num') temp.val = 1;
    if(temp.val === 14) temp.val = 1;

    log(`${pName}は [${getCardText(temp)}] をホールドしました。`);
    player.holdCard = temp;

    const deck = isBase ? baseDeck : boostDeck;
    if (deck.length > 0) {
        player.currentCard = deck.pop();
        if (isBase) {
            let next = player.currentCard;
            if (next.val === 1 || next.val === 7 || next.type === 'joker') {
                if (next.type === 'joker') {
                    player.baseScore += 10;
                    log(`補填された新しい場札: [${getCardText(next)}] ➡ 【JOKER】判定最有利リセット！(+10点)`);
                } else {
                    player.baseScore += next.val;
                    player.isReverseMode = !player.isReverseMode;
                    let cardName = next.val === 1 ? 'A' : '7';
                    log(`補填された新しい場札: [${getCardText(next)}] ➡ 【${cardName}特殊効果】強制セーフ！判定が「${player.isReverseMode ? 'DOWN' : 'UP'}」に反転し、次も確定セーフ！ (+${next.val}点)`);
                }
                player.currentCard.virtualVal = player.isReverseMode ? 14 : 0;
            } else {
                player.baseScore += player.currentCard.val;
                log(`補填された新しい場札: [${getCardText(player.currentCard)}] (+${player.currentCard.val}点)`);
            }
        } else {
            let multValue = 0;
            if (player.currentCard.text === 'J') multValue = 0;
            if (player.currentCard.text === 'Q') multValue = 3;
            if (player.currentCard.text === 'K') multValue = 4;

            if (player.currentCard.type === 'joker') {
                player.multiplier += 5;
            } else {
                player.multiplier += multValue;
            }
            log(`補填された新しい絵札: [${getCardText(player.currentCard)}]`);
            player.lastShiftCard = { suit: { w: 0 } };
        }
    } else {
        player.currentCard = null;
    }
    updateUI();
    if (activePlayer === 'p2') setTimeout(aiDecision, 1000);
}

function executeUseHold(player) {
    if (!player.holdCard) return;
    const pName = player === p1 ? 'あなた' : 'AI';
    const isBase = gamePhase.includes('base');
    let temp = player.holdCard;
    player.holdCard = null;

    if (isBase) {
        player.hasUsedBaseHold = true;
        player.baseScore += temp.val;
        log(`${pName}はホールドから [${getCardText(temp)}] を出しました。`);
        log(`➡ 【ホールド効果】大小判定無視で強制セーフ！基本点: ${player.baseScore}点`);
        player.currentCard = temp;
        player.currentCard.virtualVal = player.isReverseMode ? 14 : 0;
        updateUI();
        if (activePlayer === 'p2') setTimeout(aiDecision, 1000);
    } else {
        player.hasUsedBoostHold = true;
        log(`${pName}はホールドから [${getCardText(temp)}] を出しました。`);
        
        let multValue = 0;
        if (temp.text === 'J') multValue = 0;
        if (temp.text === 'Q') multValue = 3;
        if (temp.text === 'K') multValue = 4;

        if (temp.type === 'joker') {
            player.multiplier += 5;
        } else {
            player.multiplier += multValue;
        }
        log(`➡ 連鎖成功！現在の倍率: ${player.multiplier}倍`);
        player.currentCard = temp;
        player.lastShiftCard = { suit: { w: 0 } };
        updateUI();
        if (activePlayer === 'p2') setTimeout(aiDecision, 1000);
    }
}

function advancePhase() {
    if (gamePhase === 'p1_base') {
        gamePhase = 'p2_base'; activePlayer = 'p2'; p1.phase = 'shift';
        toggleControls(false); log(`<br> 🤖 【AIのベースフェーズ開始】`);
        setupNextFirstCard(p2);
    } else if (gamePhase === 'p2_base') {
        gamePhase = 'p1_boost'; activePlayer = 'p1'; p2.phase = 'shift';
        toggleControls(true); log(`<br> 🃏 【あなたのブーストフェーズ開始】倍率を稼ぎましょう！`);
        p1.holdCard = null; generateFreshBoostDeck(); setupNextFirstCard(p1);
    } else if (gamePhase === 'p1_boost') {
        gamePhase = 'p2_boost'; activePlayer = 'p2'; p1.phase = 'ended';
        toggleControls(false); log(`<br> 🤖 【AIのブーストフェーズ開始】`);
        p2.holdCard = null; generateFreshBoostDeck(); setupNextFirstCard(p2);
    } else if (gamePhase === 'p2_boost') {
        gamePhase = 'ended'; activePlayer = 'none'; p2.phase = 'ended';
        updateUI(); checkGameResult();
    }
    // ★バグ修正：フェーズ移行時にも確実に最新の画面状態(UP/DOWNカラー)を再描画させてグレー化を防ぎます
    updateUI(); 
}

function generateFreshBoostDeck() {
    boostDeck = [];
    for (let s in SUITS) {
        boostDeck.push({ val: 2, text: 'J', suit: SUITS[s], type: 'face' });
        boostDeck.push({ val: 3, text: 'Q', suit: SUITS[s], type: 'face' });
        boostDeck.push({ val: 4, text: 'K', suit: SUITS[s], type: 'face' });
    }
    boostDeck.push({ val: 5, suit: { s: 'JK', c: 'joker' }, type: 'joker' });
    shuffle(boostDeck);
}

function setupNextFirstCard(player) {
    const isBase = gamePhase.includes('base');
    const deck = isBase ? baseDeck : boostDeck;
    if (deck.length === 0) { finishGameDirectly(); return; }
    player.currentCard = deck.pop();
    
    if (isBase) {
        player.baseScore = player.currentCard.type === 'joker' ? 10 : player.currentCard.val;
        if (player.currentCard.type !== 'joker' && player.currentCard.val >= 8) player.isReverseMode = true;
        log(`${player===p1?'あなた':'AI'}の初期カード: [${getCardText(player.currentCard)}]（「${player.isReverseMode?'DOWN':'UP'}」開始）`);
        if(player.currentCard.type === 'joker') player.currentCard.val = player.isReverseMode ? 14 : 0;
    } else {
        let multValue = 0;
        if (player.currentCard.text === 'J') multValue = 0;
        if (player.currentCard.text === 'Q') multValue = 3;
        if (player.currentCard.text === 'K') multValue = 4;

        if (player.currentCard.type === 'joker') {
            player.multiplier = 5; player.lastShiftCard = { suit: { w: 0 } };
            log(`${player===p1?'あなた':'AI'}の初期カードが [JOKER]！ (5倍)`);
        } else {
            player.multiplier = multValue === 0 ? 1 : multValue;
            log(`${player===p1?'あなた':'AI'}の初期カード: [${getCardText(player.currentCard)}] (初期倍率: ${player.multiplier}倍)`);
            player.lastShiftCard = player.currentCard;
        }
    }
    updateUI();
    if (activePlayer === 'p2') setTimeout(aiDecision, 1000);
}

function aiDecision() {
    if (activePlayer !== 'p2' || gamePhase === 'ended') return;
    const isBase = gamePhase.includes('base');
    if (isBase) {
        let isDangerous = (p2.currentCard.val >= 10 && !p2.isReverseMode) || (p2.currentCard.val <= 4 && p2.isReverseMode);
        if (isDangerous) {
            if (p2.holdCard && !p2.hasUsedBaseHold) executeUseHold(p2);
            else if (!p2.holdCard && !p2.hasUsedBaseHold) executeHold(p2);
            else executeHit(p2);
        } else { executeHit(p2); }
    } else {
        if (p2.baseScore * p2.multiplier > p1.totalScore && p2.multiplier >= 3) {
            log("🤖 AI: 「あなたのスコアを超えたため、安全にSTANDします。」");
            executeStand(p2); return;
        }
        if (p2.lastShiftCard && p2.lastShiftCard.suit.w >= 3) {
            if (p2.baseScore * p2.multiplier < p1.totalScore) {
                if (p2.holdCard && !p2.hasUsedBoostHold) executeUseHold(p2);
                else if (!p2.holdCard && !p2.hasUsedBoostHold) executeHold(p2);
                else { log("🤖 AI: 「負けている！リスク覚悟で引きます！」"); executeHit(p2); }
            } else { log("🤖 AI: 「勝利条件クリア。STANDします。」"); executeStand(p2); }
        } else { executeHit(p2); }
    }
}

function finishGameDirectly() {
    gamePhase = 'ended'; p1.phase = 'ended'; p2.phase = 'ended';
    updateUI(); checkGameResult();
}

function checkGameResult() {
    activePlayer = 'none'; updateUI();
    let resultMsg = p1.totalScore > p2.totalScore ? "🎉 あなたの勝利です！見事な引き際でした！" : (p1.totalScore < p2.totalScore ? "🤖 AIの勝利です！" : "🤝 引き分け（ドロー）です！完璧なまでのシンクロ！");
    log("<br>====================================="); log(`【最終対戦結果】`);
    log(`◆ あなたの合計スコア： ${p1.totalScore} 点`); log(`◆ AIの合計スコア： ${p2.totalScore} 点`);
    log(`<b>${resultMsg}</b>`); log("=====================================<br>");
    document.getElementById('btn-restart').style.display = 'block';
}

initGame();
