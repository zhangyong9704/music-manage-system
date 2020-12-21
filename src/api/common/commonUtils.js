//判断性别类型
export function getSexType(sex) {
    let str ='';
    switch (sex) {
        case 0:
            str='女'
            break;
        case 1:
            str="男"
            break;
        case 2:
            str="组合"
            break;
        case 3:
            str="未知"
            break;
        default:
            str="未知"
    }
    return str;
}

// 将base64的图片转换为file文件
export function convertBase64UrlToBlob(urlData) {
    let bytes = window.atob(urlData.split(',')[1]);//去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

//上传图片之前的校验
export function beforeUpload(file){
    const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
    if(!isJPG){
        this.$message.error('上传音乐文件只能是MP3格式');
        return false;
    }
    const isLt5M = (file.size / 1024 /1024) < 5;
    if(!isLt5M){
        this.$message.error('上传音乐文件大小不能超过5MB');
        return false;
    }
    return true;
}

//上传图片之前的校验
export function beforeUploadIsTypeFile(file){
    const isMp3 = (file.type === 'mp3')||(file.type === 'mp3');
    if(!isMp3){
        this.$message.error('上传头像图片只能是jpg或png格式');
        return false;
    }
    const isLt2M = (file.size / 1024 /1024) < 2;
    if(!isLt2M){
        this.$message.error('上传头像图片大小不能超过2MB');
        return false;
    }
    return true;
}
