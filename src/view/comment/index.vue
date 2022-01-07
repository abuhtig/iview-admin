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
        @on-selection-change="select"
      />
      <Row type="flex" justify="space-between" align="middle">
        <Col>
          <Button @click="deletSelect">删除选中</Button>
            <Button style="margin: 10px 10px" @click="editSelect"
              >编辑选中</Button>
          <Button style="margin: 10px 0" type="primary" @click="exportExcel"
            >导出为Excel文件</Button
          >
        </Col>
        <Col>
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
        </Col>
      </Row>
      <commentModal
        :isShow="showEdit"
        :editItem="item"
        :batchEdit="batchEdit"
        @editEvent="handleEdit"
        @editEventCancel="handleEditCancel"
      ></commentModal>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import commentModal from './commentModal.vue'
import dayjs from 'dayjs'
import { getcomment, editComment, deleteComment, batchEditComment, batchDeleteComment } from '@/api/admin.js'
export default {
  name: 'comment_page',
  components: {
    Tables,
    commentModal
  },
  data () {
    return {
      limit: 10,
      page: 0,
      total: 0,
      showEdit: false,
      batchEdit: false,
      item: {},
      option: {},
      selectData: [],
      columns: [
        {
          title: '文章标题',
          key: 'title',
          minWidth: 220,
          align: 'center',
          serach: { type: 'input' },
          render: (h, params) => {
            return h('div', [h('span', params.row.tid ? params.row.tid.title : '!!文章已被删除!!')])
          }
        },
        {
          title: '用户',
          key: 'user',
          minWidth: 110,
          align: 'center',
          serach: { type: 'input' },
          render: (h, params) => {
            return h('div', [h('span', params.row.cuid.name)])
          }
        },
        {
          title: '评论内容',
          key: 'content',
          align: 'center',
          minWidth: 220,
          ellipsis: true,
          serach: { type: 'input' },
          render: (h, params) => {
            return h('div', [h('span', params.row.content.replace(/<[^>]*>|<\/[^>]*>/gm, ''))])
          }
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          minWidth: 80,
          serach: { type: 'select',
            options: [
              {
                key: '禁言',
                value: '0'
              },
              {
                key: '正常',
                value: '1'
              }
            ]
          },
          render: (h, params) => {
            return h('div', [h('span', params.row.status === '1' ? '正常' : '禁言')])
          }
        },
        {
          title: '显示',
          key: 'isRead',
          align: 'center',
          minWidth: 80,
          serach: {
            type: 'select',
            options: [
              {
                key: '隐藏',
                value: '1'
              },
              {
                key: '正常',
                value: '0'
              }
            ]
          },
          render: (h, params) => {
            return h('div', [h('span', params.row.isRead === '0' ? '正常' : '隐藏')])
          }
        },
        {
          title: '最佳评论',
          key: 'isBest',
          align: 'center',
          minWidth: 120,
          serach: {
            type: 'select',
            options: [
              {
                key: '无',
                value: '0'
              },
              {
                key: '最佳',
                value: '1'
              }
            ]
          },
          render: (h, params) => {
            return h('div', [h('span', params.row.isBest === '0' ? '无' : '最佳')])
          }
        },
        {
          title: '点赞数',
          key: 'hands',
          align: 'center',
          handle: 'true',
          minWidth: 100,
          serach: { type: 'input' },
          render: (h, params) => {
            return h('div', [h('span', params.row.hands)])
          }
        },
        { title: '创建时间',
          key: 'created',
          width: 180,
          minWidth: 100,
          align: 'center',
          serach: {
            type: 'date'
          },
          render: (h, params) => {
            return h('div', [h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))])
          }
        },
        {
          type: 'selection',
          fixed: 'left',
          width: 60,
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
      ],
      tableData: []
    }
  },
  methods: {
    deletSelect () {
      if (this.selectData.length === 0) {
        this.$Message.info('请选择要删除的数据')
        return
      }
      const content = this.selectData.map(o => o.content)
      const ids = this.selectData.map(o => o._id)
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除 《${content}》 这个评论吗?`,
        onOk: () => {
          batchDeleteComment(ids)
            .then((res) => {
              if (res.code === 200) {
                this.tableData = this.tableData.filter(
                  (item) => !ids.includes(item._id)
                )
                this.$Message.success('成功删除!')
              }
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
    editSelect () {
      if (this.selectData.length === 0) {
        this.$Message.info('请选择要删除的数据')
        return
      }
      this.showEdit = true
      this.batchEdit = true
    },
    select (s) {
      this.selectData = s
    },
    handleEdit (data) {
      let item = { ...data }
      delete item.tid
      delete item.cuid
      if (this.batchEdit === false) {
        editComment(item).then((res) => {
          if (res.code === 200) {
            this.$Message.success('修改成功!')
          } else {
            this.$Message.info('修改失败!')
          }
        })
      } else {
        delete item.content
        const ids = this.selectData.map(o => o._id)
        batchEditComment({ data: item, ids: ids }).then((res) => {
          if (res.code === 200) {
            this.tableData = this.tableData.map((item) => {
              if (ids.includes(item._id)) {
                for (var keys of Object.keys(set)) {
                  item[keys] = set[keys]
                }
              }
            })
            this.$Message.success('修改成功!')
          }
        })
      }
    },
    handleEditCancel (bool) {
      this.showEdit = bool
    },
    handleBuild (row, index) {
      this.batchEdit = false
      this.showEdit = true
      this.item = row
    },
    handleTrash (row, index) {
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除 《${row.content}》 这个评论吗?`,
        onOk: () => {
          deleteComment(row._id)
            .then((res) => {
              if (res.code === 200) {
                this.tableData.splice(index, 1)
                this.$Message.success('成功删除!')
                this.total--
              }
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
    onPageChange (page) {
      this.page = page - 1
      this._getList()
    },
    onPageSizeChange (limt) {
      this.limit = limt
      this._getList()
    },
    _getList () {
      getcomment({ page: this.page, limit: this.limit, option: this.option }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    orshow () {
      this.showEdit = true
    },
    handleSearch (v) {
      if ((typeof this.option.search !== 'undefined' && v.search !== this.option.search) || this.option === {}) {
        this.page = 0
      }
      this.option = v
      this._getList()
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    }
  },
  mounted () {
    this._getList()
  }
}
</script>

<style>
</style>
