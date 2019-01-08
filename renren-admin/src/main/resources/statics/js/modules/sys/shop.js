var vm = new Vue({
    el: '#app',
    data: {
        showList: true,
        title: null,
        loading: false,
        totalSize: 0,
        queryParams: {
            shopName: null,
            shopType: null,
            status: null,
            page: 1,
            limit: 10,
        },
        shop: {},
        tableColumns: [
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
                title: '商品名称',
                key: 'shopName',
                align: 'center',
                ellipsis: true,
                tooltip: true
            },
            {
                title: '商品类型',
                key: 'shopType',
                align: 'center',
                ellipsis: true,
                tooltip: true
            },
            {
                title: '商品状态 0：上架，1：下架',
                key: 'status',
                align: 'center',
                ellipsis: true,
                tooltip: true
            },
            {
                title: '创建时间',
                key: 'createTime',
                align: 'center',
                ellipsis: true,
                tooltip: true
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
                                    vm.update(params.row.id)
                                }
                            }
                        }, '修改')
                    ]);
                }
            }
        ],
        tableData: [],
        selectIdList: [],
        deleteModal: false,
    },
    mounted: function () {
        this.query();
    },
    methods: {
        /**
         * 获取列表
         */
        query: function () {
            this.showList = true;
            this.queryParams.page = 1
            this.queryRequest(this.queryParams)
        },
        /**
         * 列表数据请求
         */
        queryRequest: function (params) {
            this.$Spin.show();
            // 请求列表
            var that = this;
            httpAjax.call(this, baseURL + "sys/shop/list", "GET", params).then(function (res) {
                var code = res.code;
                if (code == 0) {
                    var tempList = [];
                    var list = res.page.list;
                    for (item of list) {
                        var tempObj = {
                            id: item.id,
                            shopName: item.shopName,
                            shopType: item.shopType,
                            status: item.status,
                            createTime: convertDateTime(item.createTime, "yyyy-MM-dd hh:mm:ss"),
                        };
                        tempList.push(tempObj);
                        tempObj = {};
                    }
                    that.tableData = tempList;
                    that.totalSize = res.page.totalCount;
                    that.$Spin.hide();
                } else {
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
        reset: function () {
            this.queryParams.shopName = null;
            this.queryParams.shopType = null;
            this.queryParams.status = null;
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.shop = {};
        },
        update: function (id) {
            if (id == null) {
                return;
            }
            this.showList = false;
            this.title = "修改";
            this.shop = {}

            vm.getInfo(id)
        },
        saveOrUpdate: function () {
            var that = this
            var url = vm.shop.id == null ? "sys/shop/save" : "sys/shop/update";
            httpAjax.call(this, baseURL + url, "POST", JSON.stringify(vm.shop), false).then(function (res) {
                var code = res.code;
                if (code === 0) {
                    that.$Message.success("操作成功！");
                    vm.query()
                } else {
                    that.$Message.error("操作失败！");
                }
            });
        },
        getSelection: function (selection) {
            //判断选择的数据长度
            if (selection.length > 0) {
                //数据长度大于0 先把数据清空，然后拼接数据中的id
                this.selectIdList = [];
                for (var i = 0; i < selection.length; i++) {
                    this.selectIdList.push(selection[i].userId);
                }
            } else {
                //如果长度小于等于0 则把数据清空
                this.selectIdList = [];
            }
        },
        /**
         * 显示删除框
         */
        showDeleteModal: function () {   //显示删除框
            this.deleteModal = true;
        },
        /**
         * 取消删除操作
         */
        cancelDelete: function () {
            this.deleteModal = false;
        },

        del: function () {
            this.deleteModal = false;
            var that = this
            httpAjax.call(this, baseURL + "sys/shop/delete", "POST", JSON.stringify(vm.selectIdList), false).then(function (res) {
                var code = res.code;
                if (code == 0) {
                    that.$Message.success("删除成功！");
                    vm.query()
                } else {
                    that.$Message.error("删除失败！");
                }
            });
        },
        getInfo: function (id) {
            var that = this
            httpAjax.call(this, baseURL + "sys/shop/info/" + id, "GET").then(function (res) {
                var code = res.code;
                if (code == 0) {
                    vm.shop = res.shop;
                } else {
                    that.$Message.error("获取数据失败！");
                }
            });
        },
    }
});