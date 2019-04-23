Page({
    data: {
        animations: ['fadeIn', 'fadeOut', 'bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble'],
        currClass: 'fadeIn animated box',
        animationData: {},
        animateQueue: [],
    },
    loopFlag: true,
    animation: null,
    onPickerChange(v) {
        const pickClssName = this.data.animations[v.detail.value];
        this.setData({
            currClass: pickClssName + ' animated box'
        });
    },
    onTap(v) {
        const t = v.detail.y - v.currentTarget.offsetTop;
        const l = v.detail.x;
        const ani = this.animation;
        const stract = this.data.animateQueue;
        ani.top(t).left(l).rotateZ(getRandomAng()).step();
        this.data.animateQueue.push({
            ani: ani.export(),
            t: t,
            l: l,
            i: stract.length === 0 ? 1 : (stract[stract.length - 1].i + 1)
        });
        this.setData({
            animateQueue: this.data.animateQueue
        });
        this.stractChangeHandler();
        function getRandomAng() {
            return Math.floor(Math.random() * 4) * 360;
        }
    },
    stractChangeHandler() {
        if (!this.loopFlag) {
            return;
        }
        this.loopFlag = false;
        const _this = this;
        loopStract();
        function loopStract() {
            if (_this.data.animateQueue.length === 0) {
                _this.loopFlag = true;
                return;
            } else {
                _this.setData({
                    animationData: _this.data.animateQueue[0].ani
                });
                setTimeout(function () {
                    _this.data.animateQueue.shift();
                    _this.setData({
                        animateQueue: _this.data.animateQueue,
                    });
                    loopStract();
                }, 1000);
            }
        }
    },
    init() {
        const ani = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease'
        });
        ani.top(0).left(0).step();
        this.animation = ani;
        this.setData({
            animationData: ani.export()
        });
    },
    onReady() {
        this.init();
    }
});
