function FileProgress(file, targetID) {
    var fileID = file.id, fileProgressWrapper = document.getElementById(fileID);
    this.fileProgressID = fileID;
    this.fileProgressWrapper = fileProgressWrapper;
    //检测SWFUpload 是否存在
    if (!fileProgressWrapper) {
        // 创建上传文件展示面板
        fileProgressWrapper = document.createElement("tr");
        var oFrag = document.createDocumentFragment();
        fileProgressWrapper.className = "progressWrapper";
        fileProgressWrapper.id = fileID;
        //var ret=[];
        var oTd = document.createElement("td");
        oTd.className = "album_uptab-w1";
        oTd.innerHTML = '<div class="pl10 color_b9">' + file.name + '</div>';
        var oTd02 = document.createElement("td");
        oTd02.className = "album_uptab-w2";
        oTd02.innerHTML = '<div class="albumup-jd"><p></p></div>';
        var oTd03 = document.createElement("td");
        oTd03.className = "album_uptab-w3 tc";
        oTd03.innerHTML = '<span class="close_the_photo"></span>';
        fileProgressWrapper.appendChild(oTd);
        fileProgressWrapper.appendChild(oTd02);
        fileProgressWrapper.appendChild(oTd03);
        //自定义的面板
        document.getElementById(targetID).children[0].appendChild(fileProgressWrapper);
    } else {
        this.reset();
    }
};
FileProgress.prototype.reset = function () {
    this.fileProgressWrapper.getElementsByTagName('p')[0].style.width = 0 + "px";
};
FileProgress.prototype.setProgress = function (percentage) {
    this.fileProgressWrapper.getElementsByTagName('p')[0].style.width = percentage * 134 / 100 + "px";
};
FileProgress.prototype.setComplete = function () {
    this.fileProgressWrapper.getElementsByTagName('p')[0].style.width = 134 + "px";
};
FileProgress.prototype.setError = function () { this.remove() };
FileProgress.prototype.setCancelled = function () { this.remove() };
FileProgress.prototype.setStatus = function (status) { };
// Show/Hide 删除按钮
FileProgress.prototype.toggleCancel = function (show, swfUploadInstance) {
    var oSpan = this.fileProgressWrapper.getElementsByTagName("span")[0];
    oSpan.style.visibility = show ? "visible" : "hidden";
    if (swfUploadInstance) {
        var self = this;
        oSpan.onclick = function () {
            //从上传队列中删除该文 传入ID
            //如果取消的文件是正在上传，那么会触发uploadError事件。
            //如果已经上传完成 不会触发uploadError事件
            swfUploadInstance.cancelUpload(self.fileProgressID);
            return false;
        };
    }
};
FileProgress.prototype.remove = function () {
    if (this.fileProgressWrapper) {
        this.fileProgressWrapper.parentNode.removeChild(this.fileProgressWrapper);
    }
}
