Page({
    data: {
        hello: '',
        todoList: [],
        playindex: 0,
        hasAuth: false,
        recordStatus: '0' // 0:未开始，1：进行中，2：暂停中
    },
    recordManager: null,
    innerAudioContext: null,
    onReady() {
        this.init();
    },
    onShow() {
        const _this = this;
        wx.authorize({
            scope: 'scope.record',
            success(res) {
                if (res.errMsg === 'authorize:ok') {
                    _this.setData({
                        hasAuth: true
                    });
                }
            }
        });
    },
    init() {
        this.getManager();
        this.initManager();
        this.getInnerManager();
        this.initInnerManager();
    },
    getInnerManager() {
        this.innerAudioContext = wx.createInnerAudioContext();
    },
    initInnerManager() {
        const endedHandler = this.endedHandler.bind(this);
        this.innerAudioContext.onEnded(endedHandler);
    },
    endedHandler() {
        console.log('ended');
        const leng = this.data.todoList.length;
        const nextItem = (this.data.playindex + 1) > leng - 1 ? 0 : (this.data.playindex + 1);
        this.changeItem(nextItem);
    },
    changeItem(index) {
        this.data.todoList.forEach(i => {
            i.play = 'false';
        });
        const {src} = this.data.todoList[index];
        this.data.todoList[index].play = 'true';
        this.innerAudioContext.src = src;
        this.setData({
            playindex: index,
            todoList: this.data.todoList
        });
        this.innerAudioContext.play();
    },
    getManager() {
        const recordManager = wx.getRecorderManager();
        this.recordManager = recordManager;
    },
    initManager() {
        const errorHandler = this.onErrorHandler.bind(this);
        this.recordManager.onError(errorHandler);

        const onPauseHandler = this.onPauseHandler.bind(this);
        this.recordManager.onPause(onPauseHandler);

        const onResumeHandler = this.onResumeHandler.bind(this);
        this.recordManager.onResume(onResumeHandler);

        const onStartHandler = this.onStartHandler.bind(this);
        this.recordManager.onStart(onStartHandler);

        const onStopHandler = this.onStopHandler.bind(this);
        this.recordManager.onStop(onStopHandler);
    },
    onErrorHandler() {
        console.log('error');
    },
    onPauseHandler() {
        // 0:未开始，1：进行中，2：暂停中
        this.setData({
            recordStatus: '2'
        });
        console.log('onPause');
    },
    onResumeHandler() {
        this.setData({
            recordStatus: '1'
        });
        console.log('onResume');
    },
    onStartHandler() {
        this.setData({
            recordStatus: '2'
        });
        this.onAudioPause();
        console.log('onstart');
    },
    onStopHandler(res) {
        const src = res.tempFilePath;
        const date = new Date();
        const _item = {
            src,
            play: 'false',
            time: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        };
        this.data.todoList.push(_item);
        console.log(this.data.todoList);
        this.setData({
            todoList: this.data.todoList,
            recordStatus: '0'
        });
        console.log('onStop', res);
    },
    onAudioPause() {
        this.data.todoList.forEach(i => {
            i.play = 'false';
        });
        this.innerAudioContext.pause();
        this.setData({
            todoList: this.data.todoList
        });
    },
    startRecord(options) {
        // 默认配置
        const defaultOption  = {
            duration: 30000, // 最长时间30s
            sampleRate: 44100, // 采样率44.1kbps
            numberOfChannels: 1, // 第一频道？
            encodeBitRate: 192000, // 码流率192bps
            format: 'aac', // 编码格式aac
            frameSize: 50// 框架大小，什么意思
        };
        // 如果没有options或者options中没有设置，则使用默认配置
        options = this.extend(defaultOption, options);
        this.recordManager.start(options);
    },
    pauseRecord() {
        this.recordManager.pause();
    },
    resumeRecord() {
        this.recordManager.resume();
    },
    stopRecord() {
        this.recordManager.stop();
    },
    onTap_record() {
        // 0:未开始，1：进行中，2：暂停中
        const _this = this;
        let hasAuth = false;
        wx.getSetting({
            success(res) {
                !(res.authSetting['scope.record']) ? hasAuth = false : hasAuth = true;
                _this.setData({hasAuth});
            }
        });
        switch (this.data.recordStatus) {
        case '0': // 未开始
            this.startRecord();
            break;
        case '1': // 进行中
            this.pauseRecord();
            break;
        case '2': // 暂停中
            this.resumeRecord();
            break;
        default:
            this.startRecord();
            break;
        }
    },
    onTap_stop() {
        this.stopRecord();
    },
    onTap_playItem(res) {
        const {index} = res.currentTarget.dataset;
        console.log(res);
        this.changeItem(index);
    },
    // 浅拷贝
    extend(parents, child) {
        const children = child || {};
        for (const prop of Object.keys(parents)) {
            children[prop] = parents[prop];
        }
        return children;
    }
});
