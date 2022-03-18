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
        @on-selection-change="select"
      />
      <Row type="flex" justify="space-between" align="middle">
        <Col>
          <Button @click="deletSelect">删除选中</Button>
          <Button style="margin: 10px 10px" type="primary" @click="exportExcel"
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
      <!-- <editModal
        :isShow="showEdit"
        :editItem="item"
        @editEvent="handleEdit"
        @editEventCancel="handleEditCancel"
      ></editModal>
      <batchSet
        :isShowbatch="showbatch"
        @batchEvent="handlebatch"
        @batchCancel="handlebatchCancel"
      ></batchSet> -->
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import dayjs from 'dayjs'
import { deleteLogs, getlogs } from '@/api/admin.js'
export default {
  name: 'logs_page',
  components: {
    Tables
  },
  data () {
    return {
      limit: 10,
      page: 0,
      total: 0,
      showEdit: false,
      showbatch: false,
      item: {},
      option: {},
      selectData: [],
      columns: [
        {
          type: 'expand',
          key: 'stack',
          maxWidth: 30,
          align: 'center',
          render: (h, params) => {
            return h('p', 'Stack:  ' + params.row.stack)
          }
        },
        {
          type: 'selection',
          maxWidth: 10,
          align: 'center'
        },
        {
          title: '错误码',
          key: 'code',
          maxWidth: 130,
          align: 'center',
          filterMultiple: false,
          filters: [
            {
              label: '404',
              value: '404'
            },
            {
              label: '401',
              value: '401'
            }
          ],
          filterMethod (value, row) {
            if (value === '404') {
              return row.code === '404'
            } else {
              return row.code === '401'
            }
          }
        },
        {
          title: '请求路径',
          key: 'path',
          maxWidth: 140,
          align: 'center'
        },
        {
          title: '请求类型',
          key: 'method',
          maxWidth: 120,
          align: 'center',
          filterMultiple: false,
          filters: [
            {
              label: 'GET',
              value: 'GET'
            },
            {
              label: 'POST',
              value: 'POST'
            }
          ],
          filterMethod (value, row) {
            if (value === 'GET') {
              return row.method === 'GET'
            } else {
              return row.method === 'POST'
            }
          }
        },
        {
          title: '错误消息',
          key: 'message',
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.message)])
          }
        },
        {
          title: '请求参数',
          key: 'param',
          // tooltip: true,
          align: 'center'
        },
        {
          title: '创建时间',
          maxWidth: 170,
          key: 'created',
          align: 'center',
          serach: { type: 'date' },
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
            ])
          }
        },
        {
          title: '用户邮箱',
          maxWidth: 170,
          key: 'username',
          align: 'center'
        }
      ],
      tableData: []
    }
  },
  methods: {
    onPageChange (page) {
      this.page = page - 1
      this.getList()
    },
    onPageSizeChange (limt) {
      this.limit = limt
      this.getList()
    },
    getList () {
      getlogs({ page: this.page, limit: this.limit }).then((res) => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    deletSelect () {
      if (this.selectData.length === 0) {
        this.$Message.info('请选择要删除的数据')
        return
      }
      const msg = this.selectData.map((o) => o.path).join(',')
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除${msg}这些日志吗?`,
        onOk: () => {
          const ids = this.selectData.map((o) => o._id)
          deleteLogs({ ids: ids })
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
    select (s) {
      this.selectData = s
    },
    handlebatchCancel (bool) {
      this.showbatch = bool
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style>
</style>
