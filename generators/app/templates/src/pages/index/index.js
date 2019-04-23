const app = getApp();
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        navInfo: [{
            name: '动画',
            path: '../animate/animate'
        }, {
            name: '音乐',
            path: '../music/music'
        }, {
            name: '录音',
            path: '../record/record'
        }, {
            name: '分享',
            path: '../share/share'
        }, {
            name: '地图',
            path: '../map/map'
        }, {
            name: '照片',
            path: '../carmera/carmera'
        }, {
            name: '登录',
            path: '../login/login'
        }, {
            name: '蓝牙',
            path: '../bluetooth/bluetooth'
        }]
    },
    navHandler(event) {
        const {index} = event.currentTarget.dataset;
        if (index !== 3) {
            wx.navigateTo({
                url: this.data.navInfo[event.target.id].path
            });
        }
    },
    onLoad() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else if (this.data.canIUse) {
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
            };
        } else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            });
        }
    },
    getUserInfo(e) {
        if (e.detail.userInfo) {
            app.globalData.userInfo = e.detail.userInfo;
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            });
        }
    },
    onShareAppMessage(res) {
        let tip = '';
        if (res.from === 'button') {
            tip = '按钮';
        } else {
            tip = '右上角';
        }
        return {
            title: '标题',
            path: '/pages/index/index',
            imageUrl: '/share.jpg',
            success: () => {
                wx.showToast({
                    title: tip + '转发成功',
                    icon: 'none'
                });
            },
            fail: () => {
                wx.showToast({
                    title: tip + '转发失败',
                    icon: 'none'
                });
            },
        };
    }
});
