<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-build="handleBuild"
        @on-trash="handleTrash"
        @searchEvent="handleSearch"
      />
      <Row type="flex" justify="space-between" align="middle">
        <Button style="margin: 10px 0" type="primary" @click="exportExcel"
          >导出为Excel文件</Button
        >
        <Page
          :total="total"
          @on-page-size-change="onPageSizeChange"
          @on-change="onPageChange"
          :page-size="limit"
          :current="page + 1"
          show-total
          show-elevator
          show-sizer
        />
      </Row>
      <editModal
        :isShow="showEdit"
        :editItem="item"
        @editEvent="handleEdit"
        @editEventCancel="handleEditCancel"
      ></editModal>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import dayjs from 'dayjs'
import editModal from './modal/editModal.vue'
import { getTableData, deletePost, editpost } from '@/api/content'
export default {
  name: 'tables_page',
  components: {
    Tables,
    editModal
  },
  data () {
    return {
      limit: 10,
      page: 0,
      total: 0,
      showEdit: false,
      item: {},
      option: {},
      columns: [
        {
          title: '标题',
          key: 'title',
          width: 240,
          align: 'center',
          serach: { type: 'input' }
        },
        {
          title: '创建时间',
          key: 'created',
          width: 180,
          align: 'center',
          serach: { type: 'date' },
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
            ])
          }
        },
        {
          title: '作者',
          key: 'name',
          width: 120,
          align: 'center',
          serach: { type: 'input' },
          render: (h, params) => {
            return h('div', [h('span', params.row.uid.name)])
          }
        },
        {
          title: '分类',
          key: 'catalog',
          width: 120,
          align: 'center',
          serach: {
            type: 'select',
            options: [
              {
                key: '提问',
                value: 'ask'
              },
              {
                key: '分享',
                value: 'share'
              },
              {
                key: '动态',
                value: 'logs'
              },
              {
                key: '公告',
                value: 'notice'
              },
              {
                key: '建议',
                value: 'advise'
              },
              {
                key: '专栏',
                value: 'special'
              }
            ]
          },
          render: (h, params) => {
            switch (params.row.catalog) {
              case 'ask':
                params.row.catalog1 = '提问'
                break
              case 'share':
                params.row.catalog1 = '分享'
                break
              case 'logs':
                params.row.catalog1 = '动态'
                break
              case 'notice':
                params.row.catalog1 = '公告'
                break
              case 'advise':
                params.row.catalog1 = '建议'
                break
              case 'special':
                params.row.catalog1 = '专栏'
                break
            }
            return h('div', [h('span', params.row.catalog1)])
          }
        },
        {
          title: '状态',
          key: 'status',
          width: 120,
          align: 'center',
          serach: {
            type: 'select',
            options: [
              {
                key: '禁言',
                value: '1'
              },
              {
                key: '正常',
                value: '0'
              }
            ]
          },
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                class: 'test',
                props: {
                  color: params.row.status === '0' ? 'success' : 'error'
                },
                domProps: {
                  innerHTML: params.row.status === '0' ? 'on' : 'off'
                }
              })
            ])
          }
        },
        {
          title: '置顶',
          key: 'isTop',
          width: 120,
          align: 'center',
          serach: {
            type: 'select',
            options: [
              {
                key: '置顶',
                value: '1'
              },
              {
                key: '非置顶',
                value: '0'
              }
            ]
          },
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                class:
                  params.row.isTop === '0'
                    ? 'ivu-icon ivu-icon-md-close'
                    : 'ivu-icon ivu-icon-md-checkmark',
                style:
                  params.row.isVip === '0'
                    ? 'color: rgb(237, 64, 20)'
                    : 'color: rgb(25, 190, 107);'
              })
            ])
          }
        },
        {
          title: '标签',
          key: 'tags',
          width: 120,
          align: 'center',
          serach: { type: 'input' },
          render: (h, params) => {
            return h('div', [
              h(
                'span',
                params.row.tags
                  .map((item) => {
                    return item.name
                  })
                  .join('，')
              )
            ])
          }
        },
        {
          title: '结贴',
          key: 'isEnd',
          width: 120,
          align: 'center',
          handle: 'true',
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                class: 'test',
                props: {
                  color: params.row.isEnd === '0' ? 'success' : 'error'
                },
                domProps: {
                  innerHTML: params.row.isEnd === '0' ? '已结贴' : '未结贴'
                }
              })
            ])
          }
        },
        {
          title: '积分',
          key: 'favs',
          width: 120,
          align: 'center',
          handle: 'true'
        },
        {
          title: '阅读量',
          key: 'reads',
          width: 120,
          align: 'center',
          handle: 'true'
        },
        {
          title: '回复量',
          key: 'answer',
          width: 120,
          align: 'center',
          handle: 'true'
        },
        {
          title: '设置',
          fixed: 'right',
          align: 'center',
          width: 140,
          slot: 'action',
          handle: 'true'
        }
        // { title: '内容', key: 'content' }
      ],
      tableData: []
    }
  },
  methods: {
    handleEdit (item) {
      editpost(item).then((res) => {
        if (res.code === 200) {
          this.$Message.success('修改成功!')
        } else {
          this.$Message.info('修改失败!')
        }
      })
    },
    handleEditCancel (bool) {
      this.showEdit = bool
    },
    handleBuild (row, index) {
      this.showEdit = true
      this.item = row
    },
    handleTrash (row, index) {
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除 《${row.title}》 这篇文章吗?`,
        onOk: () => {
          deletePost(row._id)
            .then((res) => {
              this.tableData.splice(index, 1)
              this.$Message.success('成功删除!')
              this.total--
            })
            .catch((err) => {
              this.$Message.info('删除失败! 原因：' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('已取消!')
        }
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    onPageChange (page) {
      this.page = page - 1
      this.getList()
    },
    onPageSizeChange (limt) {
      this.limit = limt
      this.getList()
    },
    getList () {
      getTableData({ page: this.page, limit: this.limit, option: this.option }).then((res) => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    handleSearch (v) {
      if ((typeof this.option.search !== 'undefined' && v.search !== this.option.search) || this.option === {}) {
        this.page = 0
      }
      this.option = v
      this.getList()
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style>
</style>
