var vm = new Vue({
	el:'#app',
	data:{
		showList: true,
		title: null,
        loading:false,
        totalSize: 0,
		queryParams:{
			mobile: null,
			sex: null,
            page:1,
            limit:10,
		},
		users: {},
        tableColumns:[
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {
                title: '序号',
                key: 'numberId',
                width: 80,
                render: (h, params) => {
                    return h('div', [
                        h('P', {}, params.index + 1 + (10 * (vm.queryParams.page - 1)))
                    ]);
                }
            },
            {
                title: '手机号码',
                key: 'mobile',
                align: 'center',
                ellipsis: true,
                tooltip: true
            },
            {
                title: '用户昵称',
                key: 'nickName',
                align: 'center',
                ellipsis: true,
                tooltip: true
            },
            {
                title: '头像',
                key: 'pic',
                align:'center',
                render: (h, params) => {
                    return h('div', [
                        h('img', {
                            attrs: {
                                src:params.row.pic,
                            },
                            style: {
                                marginRight: '5px',
                                width: '20px',
                                height: '20px',
                            },
                        })
                    ]);
                }
            },
            {
                title: '状态',
                key: 'status',
                align: 'center',
            },
            {
                title: '性别',
                key: 'sex',
                align: 'center',
            },
            {
                title: '邮箱',
                key: 'email',
                align: 'center',
            },
            {
                title: '创建时间',
                key: 'creationTime',
                align: 'center',
            },
            {
                title: '最近登录时间',
                key: 'lastLoginTime',
                align: 'center',
            },
            {
                title: '操作',
                key: 'action',
                width: 250,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                size: 'small',
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    vm.update(params.row.userId)
                                }
                            }
                        }, '修改')
                    ]);
                }
            }
        ],
        tableData:[],
        selectIdList:[],
        deleteModal:false,
	},
    mounted: function () {
        this.query();
    },
	methods: {
        /**
         * 获取列表
         */
        query: function(){
            this.showList = true;
            this.queryParams.page = 1
            this.queryRequest(this.queryParams)
        },
        /**
         * 列表数据请求
         */
        queryRequest:function(params){
            var data = {
                'page': params.page,
                'limit': params.limit,
                'mobile': params.mobile,
                'sex': params.sex,
            };
            this.$Spin.show();
            // 请求列表
            var that = this;
            httpAjax.call(this, baseURL +"sys/users/list", "GET", data).then(function (res) {
                var code = res.code;
                if (code == 0) {
                    var tempList = [];
                    var list = res.page.list;
                    for (item of list) {
                        var tempObj = {
                            userId:item.userId,
                            mobile: item.mobile,
                            nickName: item.nickName,
                            pic: item.pic,
                            status: item.status == 0 ? '禁用': '正常',
                            sex: item.sex == 0 ? '女': '男',
                            email:item.email,
                            creationTime: convertDateTime(item.creationTime,"yyyy-MM-dd hh:mm"),
                            lastLoginTime: convertDateTime(item.lastLoginTime,"yyyy-MM-dd hh:mm"),
                        };
                        tempList.push(tempObj);
                        tempObj = {};
                    }
                    that.tableData = tempList;
                    that.totalSize = res.page.totalCount;
                    that.$Spin.hide();
                }else {
                    that.$Message.error("加载数据失败！")
                }
            });
        },
        /**
         * 切换上下页
         */
        changePage: function (e) {
            this.loading = true;
            var that = this
            setTimeout(function () {
                that.queryParams.page = e

                that.queryRequest(that.queryParams)
                vm.loading = false;
            }, 1000)
        },
        /**
         * 重置参数
         */
        reset: function(){
            this.queryParams.mobile = null;
            this.queryParams.sex = null;
        },
		add: function(){
			this.showList = false;
            this.title = "新增";
            this.users = {};
		},
		update: function (id) {
			if(id == null){
				return ;
			}
            this.showList = false;
            this.title = "修改";
            this.users = {}

            this.getInfo(id)
		},
		saveOrUpdate: function () {
            var that = this
			var url = vm.users.userId == null ? "sys/users/save" : "sys/users/update";
            httpAjax.call(this, baseURL + url, "POST" ,JSON.stringify(vm.users),false).then(function (res) {
                var code = res.code;
                if(code === 0){
                    that.$Message.success("操作成功！");
                    vm.query()
                }else{
                    that.$Message.error("操作失败！");
                }
            });
		},
        getSelection:function(selection){
            //判断选择的数据长度
            if(selection.length>0){
                //数据长度大于0 先把数据清空，然后拼接数据中的id
                this.selectIdList = [];
                for(var i = 0; i<selection.length; i++){
                    this.selectIdList.push(selection[i].userId);
                }
            }else{
                //如果长度小于等于0 则把数据清空
                this.selectIdList = [];
            }
        },
        /**
         * 显示删除框
         */
        showDeleteModal: function(){   //显示删除框
            this.deleteModal = true;
        },
        /**
         * 取消删除操作
         */
        cancelDelete: function(){
            this.deleteModal = false;
        },
        del: function () {
            this.deleteModal = false;
            var that = this
            httpAjax.call(this, baseURL +"sys/users/delete", "POST", JSON.stringify(vm.selectIdList),false).then(function (res) {
                console.log(res)
                var code = res.code;
                if(code == 0){
                    that.$Message.success("删除成功！");
                    vm.query()
                }else{
                    that.$Message.error("删除失败！");
                }
            });
		},
		getInfo: function(userId){
            var that = this
            httpAjax.call(this, baseURL +"sys/users/info/"+userId, "GET").then(function (res) {
                var code = res.code;
                if(code == 0){
                    vm.users = res.users;
                }else{
                    that.$Message.error("获取数据失败！");
                }
            });
		},
	}
});