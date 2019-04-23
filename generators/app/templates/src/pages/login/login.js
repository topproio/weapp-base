const util = require('../../utils/util.js');
const constant = require('../../utils/constant.js');
Page({
    data: {
        items: ['爱好1', '爱好2', '爱好3']
    },
    formSubmit(event) {
        const {userName} = event.detail.value;
        const {passWord} = event.detail.value;
        const {sex} = event.detail.value;
        const {hobby} = event.detail.value;
        const hoblestr = hobby.length > 0 ? hobby.join(',') : '';
        const userForm = {
            username: '',
            password: '',
            sex: '',
        };
        const userFormProxy = util.getValidateProxy(userForm, constant.validators);
        userFormProxy.username = `${userName}`;
        userFormProxy.password = `${passWord}`;
        userFormProxy.sex = `${sex}`;
        wx.showToast({
            title: '提交成功',
            icon: 'none'
        });
        const datas = {
            hoblestr: hoblestr,
            userName: userName,
            passWord: passWord,
            sex: sex
        };
        console.error('提交成功', datas);
    }
});
