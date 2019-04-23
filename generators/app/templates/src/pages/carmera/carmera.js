Page({
    data: {
        showStart: true,
        photoPath: '',
        thumbPath: '',
        videoPath: '',
        imagesList: [],
    },
    takePhoto() {
        const CameraContext = wx.createCameraContext();
        const that = this;
        CameraContext.takePhoto({
            quality: 'high',
            success(res) {
                that.setData({
                    photoPath: res.tempImagePath
                });
            },
        });
    },
    startVideo() {
        const CameraContext = wx.createCameraContext();
        const that = this;
        CameraContext.startRecord({
            timeoutCallback: false,
            success() {
                that.setData({
                    showStart: false,
                });
            },
        });
    },
    endVideo() {
        const CameraContext = wx.createCameraContext();
        const that = this;
        CameraContext.stopRecord({
            timeoutCallback: false,
            success(res) {
                that.setData({
                    showStart: false,
                    thumbPath: res.tempThumbPath,
                    videoPath: res.tempVideoPath,
                });
            },
        });
    },
    getImages() {
        const that = this;
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                if (that.data.imagesList.length > 0) {
                    res.tempFiles.forEach(element => {
                        that.data.imagesList.push(element);
                    });
                } else {
                    that.data.imagesList = res.tempFiles;
                }
                that.setData({
                    imagesList: that.data.imagesList,
                });
            }
        });
    },
    deleteImg(event) {
        const that = this;
        wx.showModal({
            title: '提示',
            content: '是否删除此图片',
            success(res) {
                if (res.confirm) {
                    const {index} = event.currentTarget.dataset;
                    const {imagesList} = that.data.imagesList;
                    imagesList.splice(index, 1);
                    that.setData({
                        imagesList: imagesList,
                    });
                }
            }
        });
    },
    previewImg(event) {
        const {index} = event.currentTarget.dataset;
        const {imagesList} = this.data;
        const imagesArr = [];
        imagesList.forEach(element => {
            imagesArr.push(element.path);
        });
        wx.previewImage({
            current: imagesList[index],
            urls: imagesArr,
        });
    }
});
