var webUrl = "http://localhost:8080/"
document.write('<script type="text/javascript" src="/renren-admin/statics/libs/vueDev.js"></script>')
document.write('<script type="text/javascript" src="/renren-admin/statics/libs/iview.min.js"></script>')
document.write('<script type="text/javascript" src="/renren-admin/statics/libs/jquery.min.js"></script>')

//http请求
var httpAjax = function(url, method, data, isFormData, async) {
    return $.ajax({
        url: url,
        type: method,
        data: data,
        headers: {
            "Content-Type" : isFormData ? "application/x-www-form-urlencoded": "application/json;charset=utf-8",
        },
        async: async ? false : true,
        dataType: 'json'
        }).then(function(data){
            return data;
        }, function(data){
            /*iview.Notice.info({title: '请求失败'})*/
            console.log('请求失败')
            console.log(url)
        });
}

//上传文件的ajax请求
var fileAjax = function(url, formData) {
    return $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        contentType : false,
        processData:false
    }).then(function(data){
        return data;
    }, function(data){
        iview.Notice.info({title: '请求失败'})
    });
}


//0，1转true，false
var convertNumberToBoolean = function (number) {
    return number === 1 ? true : false;
}
//true，false转0，1
var convertBooleanToNumber = function (flag) {
    return flag? 1 : 0;
}
//时间格式化工具
var convertDateTime = function (date, fmt) {

    if(!date || date == null) {
        return "";
    }
    date = new Date(date)
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//字典转化
var convertDict = function (dictList, value) {
    var dict = dictList.filter(item => {
        return item.dictValue == value;
    })
    return dict.length > 0?dict[0].dictLabel:"";
}

/**
 * 下载文件
 * @param url  文件地址url
 * @param filename 下载保存的名字
 */
var downloadFile = function(url, filename) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.responseType = "blob";
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (this.status == 200) {
            // var blob = this.response;
            var donwloadName = filename!=undefined ? filename : fileNameFromHeader(xhr.responseURL);
            downloadFileBya(donwloadName, xhr.response);
        }else{
            iview.Message.error("请求下载文件错误，请求错误码：" + this.status);
            return false;
        }
    }
    xhr.send();
}

/**
 * 根据请求头获取附件名
 * @param disposition
 * @returns {string}
 */
var fileNameFromHeader = function(disposition) {
    if (disposition) {
        let index = disposition.lastIndexOf("\/");
        return disposition.substring(index + 1, disposition.length);
    }
    return "undefine_file";
}

/**
 * 生成a元素模拟点击下载
 * @param fileName
 * @param content
 */
var downloadFileBya = function(fileName, content) {
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", true, true);
    if (fileName) {
        aLink.download = fileName;
    }
    aLink.target = "_blank";
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
}

//生成随机n长度字符串
var random_string = function(len){
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

/**
 * 封装一个统一上传的函数
 * @param file 文件对象
 * @param options 上传时的文件参数 json对象 {format:['jpg','png'],maxSize: 2} format传对应允许上传的文件后缀，maxSize文件的限制大小,单位为mb
 * @param dirSign 上传目录的标识字符串 如教学报告:jxbg
 * @returns boolean 成功上传返回上传文件的信息数据 否则false
 */
var publicUploadFunc = function(file, dirSign, options = {}){
    return new Promise( (resolve, reject)=>{
        //做基础的文件对象判断
        if(file.name){
            //检查是否有传入上传目录标识
            if(dirSign=='' || dirSign==undefined){
                iview.Message.error("上传目录标识参数异常！");
                resolve(false);
                return false;
            }
            //校验并初始化上传配置options
            //最大文件大小 默认为5mb
            let maxSize = options.maxSize!=undefined ? parseInt(options.maxSize) : 5;
            //允许文件类型后缀数组
            let format = options.format!=undefined ? options.format : ['jpg','jpeg','png','pdf','ppt','pptx','gif','mp4','mp3','doc','docx','xls','xlsx'];
            //获取最后一个.的下标位置
            let suffixIndex = file.name.lastIndexOf('.');
            //文件名则是从0到后缀名.的位置  原始文件名称
            let orginalFileName = file.name.substring(0,suffixIndex);
            //后缀名为下标点位置+1到字符串长度 jpg
            let suffix = file.name.substring(suffixIndex + 1,file.name.length).toLowerCase();
            //检查文件后缀
            if( format.indexOf(suffix) <= -1){
                iview.Message.error('文件' + file.name + "格式错误，上传失败");
                resolve(false);
                return false;
            }
            //检查文件大小
            if( file.size / 1000 / 1024 > maxSize){
                iview.Message.error('文件' + file.name + "大小错误，最大上传大小为：" + maxSize + "mb");
                resolve(false);
                return false;
            }
            //如果后缀和大小都正常则进行获取签名
            //把文件名称改成随机名称
            let randomFileName = random_string(15) + '.' + suffix;
            //1.请求上传oss的签名
            $.ajax({
                url: webUrl + "uploadCommon/getUploadPolicy",
                type: "GET",
                data: {'key':randomFileName,'dirSign':dirSign},
                headers: {
                    "Content-Type" : "application/json;charset=utf-8",
                },
                async: false,
                dataType: 'json'
            }).then(function(res){
                if(res.code === 200 && res.data.list){
                    //获取policy成功后 直接请求oss上传
                    let ossPolicyData = res.data.list;
                    //设置上传表单请求参数
                    let formData = new FormData();
                    //传过去oss中的key 需要把目录dir和文件名key拼接起来带过去
                    formData.append('key', ossPolicyData.dir + ossPolicyData.key);
                    //policy
                    formData.append('policy', ossPolicyData.policy);
                    //accessid
                    formData.append('OSSAccessKeyId', ossPolicyData.accessid);
                    //让oss返回服务器状态为200 默认是204
                    formData.append('success_action_status', '200');
                    //签名 signature
                    formData.append('signature', ossPolicyData.signature);
                    //callback
                    formData.append('callback', ossPolicyData.callback);
                    //附件对象
                    formData.append('file', file);
                    $.ajax({
                        url: res.data.list.host ? res.data.list.host : "http://hq-im.oss-cn-shenzhen.aliyuncs.com",
                        type: "POST",
                        data: formData,
                        /*headers: {
                            //如果加了请求头会先发起一个预请求，检测是否跨域，由于oss服务器已设置了允许跨域，所以不需要加请求头
                            "Access-Control-Allow-Origin" : "*",
                            "Access-Control-Allow-Methods" : "GET, POST"
                        },*/
                        // 告诉jQuery不要去处理发送的数据
                        processData : false,
                        contentType: false,//避免服务器不能正常解析文件---------具体的可以查下这些参数的含义
                        cache: false,//设置为false将不会从浏览器缓存中加载请求信息
                        async: false,
                        dataType: 'json'
                    }).then(function(res){
                        // console.log(res,"ossMsg");
                        //如果status == success 证明文件已经传上了oss并回调到服务器成功 否则回调服务器失败
                        if(res && res.Status=="success"){
                            //定义返回的数据对象
                            let returnData = file; //把原始上传文件的数据返回
                            //把调用需要用到的数据返回回去
                            returnData.orginalFileName = orginalFileName; //文件原文件名称 不带后缀
                            returnData.suffix = suffix; //文件后缀名
                            returnData.url = ossPolicyData.url; //文件下载地址
                            returnData.status = 1; //文件状态默认为1
                            //返回最终的文件数据
                            resolve(returnData);
                            return true;
                        }else{
                            console.log(res)
                            iview.Message.error('上传oss回调服务器失败！');
                            resolve(false);
                            return false;
                        }
                    },function(data){
                        console.log(data)
                        iview.Message.error('文件上传oss失败！');
                        resolve(false);
                        return false;
                    })
                }else{
                    console.log(res.msg)
                    iview.Message.error('获取上传oss的签名数据失败');
                    resolve(false);
                    return false;
                }
            }, function(data){
                iview.Message.error('请求oss签名失败');
                resolve(false);
                return false;
            });

        }else{
            iview.Message.error('原始文件名参数错误：' + file.name);
            resolve(false);
            return false;
        }
    })
}

/**客户端缓存操作方法**/
//设置缓存
var setCacheStorage = function(key,val){
    if(key && val){
        sessionStorage.setItem(key,JSON.stringify(val));
        return true;
    }
}

//获取缓存
var getCacheStorage = function(key){
    if(key){
        return JSON.parse(sessionStorage.getItem(key));
    }
    //console.log(JSON.parse(sessionStorage.getItem(key)));
    return false;
}

//清空缓存
var clearCacheStorage = function(key){
    if(key){
        //清空单个
        sessionStorage.removeItem(key);
    }else{
        //清空所有
        sessionStorage.clear();
    }
}


/**
 * 公共前端导出excel函数
 * @param JSONData  //导出的数据json数组 [{id:1,name:'a',mobile:'135xxxxxxxxx',id:2,name:'b',,mobile:'135xxxxxxxxx'}]
 * @param FileName //导出文件的的保存名称
 * @param title  //表头title数据 array ['ID'，'姓名','手机号']
 * @param filter  //需要过滤掉的对象key值 array ['id']
 * @constructor
 */
var JSONToExcelConvertor = function (JSONData, FileName, title, filter) {
    if (!JSONData) {
        return;
    }
    //转化json为object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var excel = "<table>";

    //设置表头
    var row = "<tr>";

    if (title) {
        //使用标题项
        for (var i in title) {
            row += "<th align='center'>" + title[i] + '</th>';
        }

    } else {
        //不使用标题项
        for (var i in arrData[0]) {
            row += "<th align='center'>" + i + '</th>';
        }
    }

    excel += row + "</tr>";

    //设置数据
    for (var i = 0; i < arrData.length; i++) {
        var row = "<tr>";

        for (var index in arrData[i]) {
            //判断是否有过滤行
            if (filter) {
                if (filter.indexOf(index) == -1) {
                    var value = arrData[i][index] == null ? "" : arrData[i][index];
                    row += '<td>' + value + '</td>';
                }
            } else {
                var value = arrData[i][index] == null ? "" : arrData[i][index];
                row += "<td align='center'>" + value + "</td>";
            }
        }

        excel += row + "</tr>";
    }

    excel += "</table>";

    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "考试设计统计导出列表";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";

    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(
        excelFile);

    var link = document.createElement("a");
    link.href = uri;

    link.style = "visibility:hidden";
    link.download = FileName + ".xls";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//使用微软公开的一个链接预览office类型的文件函数
var reviewOfficeFile = function(url){
    if(url!=''){
        //截取地址最后文件的后缀
        //后缀名为下标点位置+1到字符串长度 jpg
        var suffix = url.substring(url.lastIndexOf('.') + 1,url.length).toLowerCase();
        //定义一个office文件的后缀数组
        var officeTypeArr = ['doc','docx','ppt','pptx','xls','xlsx','mdb'];
        //检查文件的后缀是否office文件
        if(officeTypeArr.indexOf(suffix) >= 0){
            //微软预览接口地址
            var _src = "https://view.officeapps.live.com/op/view.aspx?src=";
            window.open(_src + url);
        }else{
            //非office格式 则直接打开窗口打开
            window.open(url);
        }
        return true;
    }
    //url为空
    console.log(url)
    iview.Message.error('文件地址参数错误');
    return false;
}


/**
 * 公共弹窗modal组件
 */
var CommonSelcetModal = function () {
    return {
        data() {
            return {
                /* 默认搜索条件 */
                search: {
                    page: 1, //默认为第一页
                    limit: 10, //默认一页查询10条数据
                    name: '',
                },
                /* 表格表头数据 */
                tableColumns: [],
                /* 表格数据 */
                tableData: [],
                /* 默认单选配置数据 */
                highlightRow: true,
                /* 是否多选标识 */
                isMultiple: false,
                /* 分页配置数据 */
                total: 0,
                current: 1,
                showTotal: true,
                pageSize: 10,
                /* 已选择的数据数组对象 */
                selectedData: [],
                /* modal层显示标识 */
                visible: false,
                /* 各类型的表头数据 */
                columnsConfig: {},
                /* 存储父级对象字符串 */
                dataSourceStr: null,
                dataShowStr: null,
                /* 多选全选时保留一份数据存储 */
                tempSeclteAllData: [],
                /* 单选显示的名称数据 */
                clickShowName: null,
            };
        },
        id: 'CommonSelcetModal',
        template:
            `
             <Modal :mask-closable="false" v-model="visible" width="800" :closable="false">
                <!-- 筛选框 start -->
                <div style="margin:10px auto">
                    <i-input v-model.trim="search.name" :placeholder="columnsConfig.tips" style="width:40%;"></i-input>
                    <i-button type="primary" icon="ios-search" size="large" @click="changePage(1)">查询</i-button>
                </div>
                <!-- 筛选框 end -->
                <!-- 表格 start -->
                <i-table :columns="tableColumns" :data="tableData" :highlight-row="highlightRow" height="350" @on-current-change="onCurrentChange" @on-select="onSelection" @on-select-cancel="onSelectCancel" @on-select-all="onSelectAll" @on-select-all-cancel="onSelectAllCancel" ></i-table>
                <!-- 表格 end -->
                <!-- 分页 start -->
                <page style="text-align:center;margin:15px 0" :total="total" :page-size="pageSize" :current="search.page" :show-total="showTotal" @on-change="changePage" />
                <!-- 分页 end -->
                <!-- 显示已选择内容 start -->
                <div style="margin: 10px 0;">
                    <tag v-if="isMultiple" v-for="item in selectedData" :key="item.id" style="display:inline-block" color="primary">{{ item.name }}</tag>
                    <tag v-else="clickShowName != null" style="display:inline-block" color="primary">{{ clickShowName }}</tag>
                </div>
                <!-- 显示已选择内容 end -->
                <!-- 重写modal按钮组 start -->
                <div slot="footer" style="text-align: right;">
                    <i-button type="primary" size="large" @click="sureSelectedData">确定</i-button>
                    <i-button type="default" size="large" @click="cancelSelectedData">取消</i-button>
                    <i-button type="error" size="large" @click="clearSelectedData">清空选择</i-button>
                </div>
                <!-- 重写modal按钮组 end -->
            </Modal>
            `,
        methods:{
            /**
             *
             * @param typeKey 传入对应的字符串键值 根据该键值获取对应接口的数据
             * 暂定：产品线：sysProduct 课程：courses 课次：courseClassplanLives 专业：mallProfession 章：courseChapter 节：courseSection 备课资料类型：teachFileType 排课计划：courseClassplan  班型：mallClassType 系统用户： sysUsers 班级：mallClass
             * @param dataSourceStr 需要赋值到父组件中的data属性名字字符串  如：formItem.productId
             * @param dataShowStr 需要赋值到父组件中的data属性中给input框中显示数据的属性名称 如：showName.productName
             * @param searchJson 初始搜索条件json对象如果需要级联则需要传入该值， {productId:1}
             * @param isMultiple 是否多选 默认为单选 多选需要传 true
             * @return 返回json对象
             * {
             *  dataSourceStr:dataSourceStr,
             *  dataShowStr:dataShowStr,
             *  id:选择数据的id数据（多选为id数组）,
             *  name:选择的数据名称数据（多选为，隔开的字符串）
             *  }
             */
            init: function(typeKey = '', dataSourceStr = '', dataShowStr = '', searchJson = {}, isMultiple = false){
                //检查对应的参数数据
                if(!typeKey){
                    console.log(typeKey, "typeKey");
                    iview.Message.error('typeKey参数错误');
                    return false;
                }
                if(!dataSourceStr || !dataShowStr){
                    console.log(dataSourceStr, "dataSourceStr");
                    console.log(dataShowStr, "dataShowStr");
                    iview.Message.error('dataSourceStr或者dataShowStr参数错误');
                    return false;
                }
                //判断对应获取什么数据
                this.columnsConfig = getConfigByTypeKey(typeKey);
                if(this.columnsConfig === false){
                    console.log(typeKey,"typeKey");
                    iview.Message.error('typeKey获取配置失败');
                    return false;
                }

                /** 简单验证通过后逻辑 **/
                //赋值父级的改值名称
                this.dataSourceStr = dataSourceStr;
                //赋值父级的显示值名称
                this.dataShowStr = dataShowStr;
                //1.合并搜索数据
                if(searchJson!=undefined && searchJson!={}){
                    for (var kk in searchJson){
                        this.search[kk] = searchJson[kk];
                    }
                }
                //2.判断是否需要多选
                if(isMultiple){
                    this.isMultiple = true;
                    this.highlightRow = false;
                    this.tableColumns = [
                        {
                            type: 'selection',
                            width: 60,
                            align: 'center',
                        }
                    ];
                }
                //3.设置表格表头数据
                for (kk in this.columnsConfig.columns) {
                    this.tableColumns.push(this.columnsConfig.columns[kk]);
                }
                //4.调用获取数据函数
                this.componentSearch();
                //5.显示组件modal层
                this.visible = true;
            },
            //更换页数
            changePage: function(p){
                //把当前页赋值到search中
                this.search.page = p;
                //调用获取数据函数
                this.componentSearch();
            },
            //单选 表格点击单行选择函数
            onCurrentChange: function(currentRow, oldCurrentRow){
                let keyName = this.columnsConfig.nameKey;
                let idName = this.columnsConfig.idKey;
                //单选 直接把对象赋值到已选对象数据中
                this.selectedData = [{
                    id: currentRow[idName],
                    name: currentRow[keyName]
                }];
                //赋值单选显示名称数据
                this.clickShowName = currentRow[keyName];
            },
            //多选 当选择某项
            onSelection: function(selection, row){
                //选择某选项则直接把该项push进数组
                let keyName = this.columnsConfig.nameKey;
                let idName = this.columnsConfig.idKey;
                let _temp = {
                    id: row[idName],
                    name: row[keyName]
                }
                this.selectedData.push(_temp);
            },
            //多选 当取消选择某项
            onSelectCancel: function(selection, row){
                //当取消某选项时则循环已选中的数据中删除对应数据
                //获取出当前数据的id键值
                let idName = this.columnsConfig.idKey;
                for(i in this.selectedData){
                    if(this.selectedData[i]['id'] == row[idName]){
                        this.selectedData.splice(i, 1);
                    }
                }
            },
            //多选 当全选
            onSelectAll: function(selection){
                //赋值保留一份临时存储的全选数据
                this.tempSeclteAllData = selection;
                let keyName = this.columnsConfig.nameKey;
                let idName = this.columnsConfig.idKey;
                var _selectedData = this.selectedData;
                //当全选时 先判断是否有已选的数据
                if(_selectedData.length > 0){
                    //已经有历史选择记录则需要循环判断是否已存在
                    let tempIds = [];
                    for (i in _selectedData){
                        tempIds.push(_selectedData[i]['id']);
                    }
                    for (i in selection){
                        if(tempIds.indexOf(selection[i][idName]) == -1){
                            _selectedData.push(
                                {
                                    id: selection[i][idName],
                                    name: selection[i][keyName]
                                }
                            )
                        }
                    }
                }else{
                    //没有选择过 直接全部录入
                    for(i in selection){
                        let _temp = {
                            id: selection[i][idName],
                            name: selection[i][keyName]
                        }
                        _selectedData.push(_temp);
                    }
                }
                this.selectedData = _selectedData;
            },
            //多选 取消全选
            onSelectAllCancel: function(selection){
                //获取当前数据的id键值名称
                let idName = this.columnsConfig.idKey;
                let selecetedData = this.selectedData;
                //取消全选 把刚才全选的数据获取出来 然后对比已选择的数据
                if(this.tempSeclteAllData.length > 0 && selecetedData.length > 0){
                    //循环把已选择的数据id取出
                    let tempIds = [];
                    for (i in selecetedData) {
                        tempIds.push(selecetedData[i]['id']);
                    }
                    let needToDel = [];
                    //循环取消全选的数据 把需要删除的id值的数据放入数组中
                    for (i in this.tempSeclteAllData) {
                        if( tempIds.indexOf(this.tempSeclteAllData[i][idName]) != -1){
                            //删除对应的
                            needToDel.push(this.tempSeclteAllData[i][idName]);
                        }
                    }
                    //再次循环已选数据
                    for (i in selecetedData){
                        if(needToDel.indexOf(selecetedData[i]['id']) != -1){
                            selecetedData.splice(i);
                        }
                    }
                }
                //操作完后把临时存储的全选数据重置
                this.tempSeclteAllData = [];
            },
            //点击查询搜索按钮函数
            componentSearch: function(){
                // console.log(this.search)
                let that = this;
                //请求数据
                httpAjax.call(this, that.columnsConfig.url, "GET" , that.search, false, true).then(function(res){
                    if(res.code === 200 && res.data.list.list){
                        //赋值数据总数量
                        that.total = res.data.list.totalCount;
                        let data = res.data.list.list;
                        //循环数据拼接序号字段
                        let _index = 1;//默认开始序号
                        for (kk in data){
                            data[kk].indexNum = _index + (that.search.limit * (that.search.page - 1));
                            _index++;
                        }
                        //判断是否多选 并且已有选择的数据
                        let selecetedData = that.selectedData;
                        if(that.isMultiple && selecetedData.length > 0){
                            //获取当前数据的id值
                            let idName = that.columnsConfig.idKey;
                            let ids = [];
                            for(i in selecetedData){
                                ids.push(selecetedData[i]['id']);
                            }
                            //多选则需要对应把数据循环看是否有在选择之内 有则需要显示已勾选
                            for (i in data){
                                if(ids.indexOf(data[i][idName]) != -1){
                                    data[i]._checked = true;
                                }
                            }
                        }
                        //赋值数据到表格中
                        that.tableData = data;
                        return true;
                    }else{
                        return false;
                    }
                });
            },
            //点击确定按钮
            sureSelectedData: function(){
                if(this.selectedData.length<=0){
                    iview.Message.error('请至少选择一个数据');
                    return false;
                }
                //定义返回的数据对象
                let returnJson = {};
                //获取已选择的数据
                let selectedData = this.selectedData;
                //判断是否多选
                if(this.isMultiple){
                    returnJson.dataSourceStr = this.dataSourceStr; //父组件的接收值的属性字符串
                    returnJson.dataShowStr = this.dataShowStr; //父组件的接收显示名称的属性字符串
                    //循环拼接id为数组 名称使用，隔开
                    let idArr = [];
                    let nameStr = "";
                    for (key in selectedData) {
                        idArr.push(selectedData[key].id);
                        nameStr += selectedData[key].name + ","
                    }
                    //把名称最右边的名字逗号删除
                    nameStr = nameStr.substring(0,nameStr.length-1);
                    returnJson.id = idArr; //赋值数据id
                    returnJson.name = nameStr; //赋值显示的名称
                }else{
                    for (key in selectedData) {
                        returnJson.id = selectedData[key].id; //赋值数据id
                        returnJson.name = selectedData[key].name; //赋值显示的名称
                        returnJson.dataSourceStr = this.dataSourceStr; //父组件的接收值的属性字符串
                        returnJson.dataShowStr = this.dataShowStr; //父组件的接收显示名称的属性字符串
                    }
                }
                this.$emit('on-sure', returnJson);
                //重置搜索条件并关闭modal
                this.cancelSelectedData();
            },
            //点击取消按钮
            cancelSelectedData: function(){
                //重置data数据
                Object.assign(this.$data, this.$options.data())
                this.visible = false;
            },
            //点击清空数据按钮
            clearSelectedData: function(){
                //返回重置数据数据
                let returnJson = {};
                returnJson.id = null; //赋值数据id
                returnJson.name = null; //赋值显示的名称
                returnJson.dataSourceStr = this.dataSourceStr; //父组件的接收值的属性字符串
                returnJson.dataShowStr = this.dataShowStr; //父组件的接收显示名称的属性字符串
                this.$emit('on-sure', returnJson);
                //重置搜索条件并关闭modal
                this.cancelSelectedData();
            }
        }
    }
}

var getConfigByTypeKey = function(key){
    switch (key) {
        //产品线：sysProduct
        case 'sysProduct':
            return {
                url: webUrl + "publicSelect/sysProduct",
                tips: "请输入产品线名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    /*{
                        title: 'ID',
                        key: 'productId',
                    },*/
                    {
                        title: '产品线名称',
                        key: 'productName',
                    }
                ],
                nameKey: "productName",
                idKey: "productId"
            }
            break;
        //课程：courses
        case 'courses':
            return {
                url: webUrl + "publicSelect/coursesData",
                tips: "请输入课程名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    /*{
                        title: 'ID',
                        key: 'courseId',
                    },*/
                    {
                        title: '课程名称',
                        key: 'courseName',
                    },
                    {
                        title: '课程编号',
                        key: 'courseNo',
                    },
                    {
                        title: '创建时间',
                        key: 'creationTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.creationTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                ],
                nameKey: "courseName",
                idKey: "courseId"
            }
            break;
        //课次：courseClassplanLives
        case 'courseClassplanLives':
            return {
                url: webUrl + "publicSelect/courseClassplanLives",
                tips: "请输入课次名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    /*{
                        title: 'ID',
                        key: 'classplanLiveId',
                    },*/
                    {
                        title: '课次名称',
                        key: 'classplanLiveName',
                    },
                    {
                        title: '直播开始时间',
                        key: 'startTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.startTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                    {
                        title: '直播结束时间',
                        key: 'endTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.endTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                ],
                nameKey: "classplanLiveName",
                idKey: "classplanLiveId"
            }
            break;
        //专业：mallProfession
        case 'mallProfession':
            return {
                url: webUrl + "publicSelect/mallProfession",
                tips: "请输入专业名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    /*{
                        title: 'ID',
                        key: 'professionId',
                    },*/
                    {
                        title: '专业名称',
                        key: 'professionName',
                    },
                    {
                        title: '专业说明',
                        key: 'remark',
                    },
                    {
                        title: '创建时间',
                        key: 'creationTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.creationTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                ],
                nameKey: "professionName",
                idKey: "professionId"
            }
            break;
        //章：courseChapter
        case 'courseChapter':
            return {
                url: webUrl + "publicSelect/courseChapter",
                tips: "请输入章名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    {
                        title: 'ID',
                        key: 'chapterId',
                    },
                    {
                        title: '章名称',
                        key: 'chapterName',
                    },
                    {
                        title: '章编号',
                        key: 'chapterNo',
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.createTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                ],
                nameKey: "chapterName",
                idKey: "chapterId"
            }
            break;
        //节：courseSection
        case 'courseSection':
            return {
                url: webUrl + "publicSelect/courseSection",
                tips: "请输入节名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    /*{
                        title: 'ID',
                        key: 'sectionId',
                    },*/
                    {
                        title: '节名称',
                        key: 'sectionName',
                    },
                    {
                        title: '节编号',
                        key: 'sectionNo',
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.createTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                ],
                nameKey: "sectionName",
                idKey: "sectionId"
            }
            break;
        //备课资料类型：teachFileType
        case 'teachFileType':
            return {
                url: webUrl + "publicSelect/teachFileType",
                tips: "请输入备课资料类型名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    /*{
                        title: 'ID',
                        key: 'id',
                    },*/
                    {
                        title: '备课资料类型名称',
                        key: 'name',
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.createTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                ],
                nameKey: "name",
                idKey: "id"
            }
            break;
        //班型：mallClassType
        case 'mallClassType':
            return {
                url: webUrl + "publicSelect/mallClassType",
                tips: "请输入备课资料类型名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    /*{
                        title: 'ID',
                        key: 'classtypeId',
                    },*/
                    {
                        title: '班型名称',
                        key: 'classtypeName',
                    },
                    {
                        title: '备注',
                        key: 'remake',
                    },
                    {
                        title: '创建时间',
                        key: 'creationTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.creationTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                ],
                nameKey: "classtypeName",
                idKey: "classtypeId"
            }
            break;
        //系统用户： sysUsers
        case 'sysUsers':
            return {
                url: webUrl + "publicSelect/sysUsers",
                tips: "请输入用户名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    /*{
                        title: 'ID',
                        key: 'userId',
                    },*/
                    {
                        title: '用户名称',
                        key: 'nickName',
                    },
                    {
                        title: '邮箱',
                        key: 'email',
                    },
                    {
                        title: '手机号',
                        key: 'mobile',
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.createTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                ],
                nameKey: "nickName",
                idKey: "userId"
            }
            break;
        //排课计划：courseClassplan
        case 'courseClassplan':
            return {
                url: webUrl + "publicSelect/coursePlanData",
                tips: "请输入排课计划名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    /*{
                        title: 'ID',
                        key: 'classplanId',
                    },*/
                    {
                        title: '排课计划名称',
                        key: 'classplanName',
                    },
                    {
                        title: '开课日期',
                        key: 'startTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.startTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                    {
                        title: '直播时间说明',
                        key: 'classplanLiveDetail',
                    },
                    {
                        title: '创建时间',
                        key: 'creationTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.creationTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                ],
                nameKey: "classplanName",
                idKey: "classplanId"
            }
            break;
        //班级：mallClass
        case 'mallClass':
            return {
                url: webUrl + "publicSelect/mallClass",
                tips: "请输入班级名称",
                columns: [
                    {
                        title: '序号',
                        key: 'indexNum',
                    },
                    /*{
                        title: 'ID',
                        key: 'classId',
                    },*/
                    {
                        title: '班级名称',
                        key: 'className',
                    },
                    {
                        title: '备注',
                        key: 'remake',
                    },
                    {
                        title: '创建时间',
                        key: 'creationTime',
                        render: (h, params) => {
                            return h('div', [
                                h('P', {}, convertDateTime(params.row.creationTime, 'yyyy-MM-dd hh:mm:ss'))
                            ]);
                        }
                    },
                ],
                nameKey: "className",
                idKey: "classId"
            }
            break;
        default:
            return false;
            break;
    }
}