var picmax = 3; //限制上传数量
function imgChange() {
	var file = document.getElementById('file').files;
	var imglist = document.querySelectorAll('.upload-Picitem');
	var piclist = document.getElementsByClassName('upload-piclist')[0];
	var filelist = file.length + imglist.length > picmax ? 3 - imglist.length : file.length + imglist.length;
	if (file.length + imglist.length >= 3) {
		var uploadfile = document.getElementsByClassName('upload-file')[0]
		// uploadfile.style.display = "none"
	}
	for (var i = 0; i < filelist; i++) {
		readerfile(file[i]).then(e => {
			var html = document.createElement('div');
			html.className = 'upload-Picitem'
			html.innerHTML = '<img src=' + e + ' alt="pic">'
			piclist.appendChild(html);
		})
	}
}

function readerfile(file) {
	return new Promise((resolve, reject) => {
		var reader = new FileReader();
		reader.addEventListener("load", function() {
			resolve(reader.result);
		}, false)
		if (file) {
			reader.readAsDataURL(file)
		}
	})
}

//提交
function submit() {
	var imglist = []
	var text = document.getElementsByClassName('upload-textarea')[0].value
	var piclist = document.querySelectorAll('.upload-Picitem');
	for (var i = 0; i < piclist.length; i++) {
		imglist.push(piclist[i].lastChild.src)
	}
	console.log("发布内容：", text);
	console.log("图片列表：", imglist);
}
