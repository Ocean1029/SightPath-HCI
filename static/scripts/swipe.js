// https://codepen.io/rudtjd2548/pen/qBodXzO

scaling = false
function onTouchStart(e) {
    if (e.touches.length >= 2) scaling = true;
    else scaling = false
}

function onPointerDown(e) {
    startX = e.screenX
    startY = e.screenY

    e.target.addEventListener('pointermove', onPointerMove)
    e.target.addEventListener('pointerup', onPointerUp)
    e.target.addEventListener('pointerleave', onPointerUp)
    e.target.addEventListener('pointercancel', onPointerUp)
}

const range = 100;
function onPointerMove(e) {
    moveX = e.screenX - startX
    moveY = e.screenY - startY

    if (!scaling) {
        tinderContainer.classList.toggle('tinder_love', moveY < -range);
        tinderContainer.classList.toggle('tinder_nope', moveY > range);
        tinderContainer.classList.toggle('tinder_detail', moveX < -range);
        tinderContainer.classList.toggle('tinder_share', moveX > range);
        
        if (moveX > range) setTransform(range, moveY, 0)
        else if (moveX < -range) setTransform(-range, moveY, 0)
        else setTransform(moveX, moveY, 0)
    }
}

function onPointerUp(e) {
    e.target.removeEventListener('pointermove', onPointerMove)
    e.target.removeEventListener('pointerup', onPointerUp)
    e.target.removeEventListener('pointerleave', onPointerUp)
    e.target.removeEventListener('pointercancel', onPointerUp)

    if (scaling || (Math.abs(moveX) < range && Math.abs(moveY) < range)) cancel()
    else {
        e.target.removeEventListener('pointerdown', onPointerDown)
        complete()
    }
}

function setTransform(x, y, deg, duration) {
    allCards[0].style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`
    if (duration) allCards[0].style.transition = `transform ${duration}ms`
}

function complete() {
    moving = false;
    let action = null;
    
    if (tinderContainer.classList.contains('tinder_love')) {
        moving = true
        tinderContainer.classList.remove('tinder_love');
        action = 'love';
    } else if (tinderContainer.classList.contains('tinder_nope')) {
        moving = true;
        tinderContainer.classList.remove('tinder_nope');
        action = 'nope';
    } else if (tinderContainer.classList.contains('tinder_detail')) {
        moving = true;
        tinderContainer.classList.remove('tinder_detail');
        action = 'detail';
    } else if (tinderContainer.classList.contains('tinder_share')) {
        moving = true;
        tinderContainer.classList.remove('tinder_share');
        action = 'share';
    }

    if (moving) {
        const flyX = Math.sign(moveX) * innerWidth * 1.3
        const flyY = Math.sign(moveY) * innerHeight * 1.3
        setTransform(flyX, flyY, 0, innerWidth / 5)
        
        if (action) {
            storeData(allCards[0].id, action)
        }
    }
    else return

    allCards[0].classList.toggle('removed', !keep);
    setTimeout(function () {
        allCards[0].remove();
        initCards();
        allCards = document.querySelectorAll('.tinder--card');
    }, innerWidth / 5)
}

function cancel() {
    setTransform(0, 0, 0, 100)
    setTimeout(() => allCards[0].style.transition = '', 100)

    tinderContainer.classList.remove('tinder_love');
    tinderContainer.classList.remove('tinder_nope');
    tinderContainer.classList.remove('tinder_detail');
    tinderContainer.classList.remove('tinder_share');
}