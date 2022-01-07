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
        <Button style="margin: 10px 0" type="primary" @click="orshow"
          >新增</Button
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
      <labelModal
        :isShow="showEdit"
        :editItem="item"
        :isbuild="build"
        @editEvent="handleEdit"
        @editEventCancel="handleEditCancel"
      ></labelModal>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import labelModal from './modal/labelModal.vue'
import dayjs from 'dayjs'
import { editLabel, addLabel, getLabel, deleteLabel } from '@/api/content'
export default {
  name: 'label_page',
  components: {
    Tables,
    labelModal
  },
  data () {
    return {
      limit: 10,
      page: 0,
      total: 0,
      showEdit: false,
      build: false,
      item: {},
      option: {},
      columns: [
        {
          title: '标签名',
          key: 'name',
          align: 'center',
          serach: { type: 'input' },
          render: (h, params) => {
            return h('div', [h('span', params.row.name)])
          }
        },
        {
          title: 'class类',
          key: 'classname',
          align: 'center',
          serach: {
            type: 'select',
            options: [
              {
                key: 'layui-bg',
                value: 'layui-bg'
              },
              {
                key: 'layui-bg-gray',
                value: 'layui-bg-gray'
              },
              {
                key: 'layui-bg-orange',
                value: 'layui-bg-orange'
              },
              {
                key: 'layui-bg-green',
                value: 'layui-bg-green'
              },
              {
                key: 'layui-bg-cyan',
                value: 'layui-bg-cyan'
              },
              {
                key: 'layui-bg-blue',
                value: 'layui-bg-blue'
              },
              {
                key: 'layui-bg-black',
                value: 'layui-bg-black'
              }
            ]
          },
          render: (h, params) => {
            return h('div', [h('span', params.row.classname)])
          }
        },
        { title: '创建时间',
          key: 'created',
          width: 180,
          align: 'center',
          serach: {
            type: 'date'
          },
          render: (h, params) => {
            return h('div', [h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))])
          }
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
    handleEdit (item) {
      if (this.build) {
        addLabel(item).then((res) => {
          if (res.code === 200) {
            this.$Message.success('新增成功!')
            this.tableData.push(res.data)
            this.total++
            this.item = {}
          } else {
            this.$Message.info('新增失败!')
          }
        })
        return
      }
      editLabel(item).then((res) => {
        if (res.code === 200) {
          this.$Message.success('修改成功!')
          this.build = false
        } else {
          this.$Message.info('修改失败!')
        }
      })
    },
    handleEditCancel (bool) {
      this.showEdit = bool
      this.build = false
    },
    handleBuild (row, index) {
      this.showEdit = true
      this.item = row
      this.build = false
    },
    handleTrash (row, index) {
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除 《${row.name}》 这个标签吗?`,
        onOk: () => {
          deleteLabel(row._id)
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
      this._getLabel()
    },
    onPageSizeChange (limt) {
      this.limit = limt
      this._getLabel()
    },
    _getLabel () {
      getLabel({ page: this.page, limit: this.limit, option: this.option }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    orshow () {
      this.item = {}
      this.showEdit = true
      this.build = true
    },
    handleSearch (v) {
      if ((typeof this.option.search !== 'undefined' && v.search !== this.option.search) || this.option === {}) {
        this.page = 0
      }
      this.option = v
      this._getLabel()
    }
  },
  mounted () {
    this._getLabel()
  }
}
</script>

<style>
</style>
