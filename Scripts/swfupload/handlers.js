//上传对话框消失,选择的文件加入上传队列成功
//（N个文件成功加入队列，就触发N次此事件）
function fileQueued(file) {
    try {
        var progress = new FileProgress(file, this.customSettings.progressTarget);
    } catch (ex) {
        this.debug(ex);
    }

}
//上传对话框消失,选择的文件加入上传队列失败
function fileQueueError(file, errorCode, message) {
    try {
        if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
            alert(message === 0 ? "上传文件大小超过5MB限制。" : "上传文件太多，你可以分批，每次50个上传");
            return;
        }
        var progress = new FileProgress(file, this.customSettings.progressTarget);
        progress.setError();
        switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                //progress.setStatus("File is too big.");
                this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                //progress.setStatus("Cannot upload Zero Byte files.");
                this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                //progress.setStatus("Invalid File Type.");
                this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            default:
                if (file !== null) {
                    //progress.setStatus("Unhandled Error");
                }
                this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
        }
    } catch (ex) {
        this.debug(ex);
    }
}
//当选择文件对话框关闭，并且所有选择文件已经处理完成（加入上传队列成功或者失败）时，此事件被触发
function fileDialogComplete(numFilesSelected, numFilesQueued) {
    //numFilesSelected:选择的文件数目
    //numFilesQueued:此次选择的文件中成功加入队列的文件数目
    try {
        if (numFilesQueued > 0) {
            this.startUpload();// 开始自动上传
        }
    } catch (ex) {
        this.debug(ex);
    }
};
//在文件往服务端上传之前触发此事件，可以在这里完成上传前的最后验证以及其他你需要的操作，例如添加、修改、删除post数据等。
function uploadStart(file) {
    //file 文件信息	
    try {
        // 上传进展
        var progress = new FileProgress(file, this.customSettings.progressTarget);
        //Show/Hide 关闭按钮
        progress.toggleCancel(true, this);
    }
    catch (ex) { }
    //如果函数返回false，那么这个上传不会被启动，并且触发uploadError事件(code为ERROR_CODE_FILE_VALIDATION_FAILED)
    //如果返回true或者无返回，那么将正式启动上传。
    return true;
};
//该事件由flash定时触发，提供三个参数分别访问上传文件对象、已上传的字节数，总共的字节数。因此可以在这个事件中来定时更新页面中的UI元素，以达到及时显示上传进度的效果。
function uploadProgress(file, bytesLoaded, bytesTotal) {  
    try {
        var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
        var progress = new FileProgress(file, this.customSettings.progressTarget);
        progress.setProgress(percent);
    } catch (ex) {
        this.debug(ex);
    }
}
//当文件上传的处理已经完成（这里的完成只是指向目标处理程序发送了Files信息，只管发，不管是否成功接收），并且服务端返回了200的HTTP状态时，触发此事件。
function uploadSuccess(file, serverData) {
    try {
        var progress = new FileProgress(file, this.customSettings.progressTarget);
        progress.setComplete();
    } catch (ex) {
        this.debug(ex);
    }
}
//无论什么时候，只要上传被终止或者没有成功完成，那么该事件都将被触发。
function uploadError(file, errorCode, message) {
    //File参数表示的是上传失败的文件对象。
    //errorCode 参数表示了当前错误的类型。
    //Message参数表示的是错误的描述。  
    try {
        var progress = new FileProgress(file, this.customSettings.progressTarget);
        progress.setError();
        switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                //progress.setStatus("Upload Error: " + message);
                this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                //progress.setStatus("Upload Failed.");
                this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                //progress.setStatus("Server (IO) Error");
                this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                //	progress.setStatus("Security Error");
                this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                //progress.setStatus("Upload limit exceeded.");
                this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                //progress.setStatus("Failed Validation.  Upload skipped.");
                this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                // If there aren't any files left (they were all cancelled) disable the cancel button
                if (this.getStats().files_queued === 0) {
                    //document.getElementById(this.customSettings.cancelButtonId).disabled = true;
                }
                //progress.setStatus("Cancelled");
                //progress.setCancelled();
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                //progress.setStatus("Stopped");
                break;
            default:
                //progress.setStatus("Unhandled Error: " + errorCode);
                this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
        }
    } catch (ex) {
        this.debug(ex);
    }
}
//当上传队列中的一个文件完成了一个上传周期，无论是成功(uoloadSuccess触发)还是失败(uploadError触发)，此事件都会被触发，这也标志着一个文件的上传完成，可以进行下一个文件的上传了。
function uploadComplete(file) { 
    if (this.getStats().successful_uploads !== 0) {
        var oFile = document.getElementById(file.id), self = this;
        oFile.getElementsByTagName("span")[0].onclick = function () {
            oFile.parentNode.removeChild(oFile);
            resetStats.call(self);
        }
    }
}

// This event comes from the Queue Plugin
// 队列插件 返回上传完成之后 执行
function queueComplete() {
    var ret = [], conut = 0, numFilesUploaded = this.getStats().successful_uploads;
    if (numFilesUploaded === 0) {
        ret.push('<div class="photo_noup">未上传图片</div>');
    } else {
        //getFile : 根据file_id或者index来获取文件队列中的文件对象
        for (var i = 0; i < numFilesUploaded; i++) {
            conut += this.getFile(i).size;
        }
        conut = getNiceFileSize(conut);
        ret.push('<div class="pr pl20 photoup_ok"><em class="photo_succes"></em>成功上传 <span>' + numFilesUploaded + ' </span>张照片共&nbsp;<span>' + conut + '</span></div>')
    }
    var status = document.getElementById(this.customSettings.statusTarget);
    status.innerHTML = ret.join("");
}
function getNiceFileSize(bitnum) {
    if (bitnum < 1048576) {
        if (bitnum < 1024) {
            return bitnum + 'Byte';
        } else {
            return Math.ceil(bitnum / 1024) + 'KB';
        }
    } else {
        return Math.ceil(100 * bitnum / 1048576) / 100 + 'MB';
    }
}
function resetStats() {
    //Stats统计对象是可以被修改的。如果你希望在上传完毕之后修改上传成功或者上传失败的统计数目时，那么可以使用该方法。
    var stats = this.getStats();
    stats.successful_uploads--;
    this.setStats(stats);
    queueComplete.call(this);
}
