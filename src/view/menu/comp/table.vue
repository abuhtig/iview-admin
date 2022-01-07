<template>
<div>
  <tables
    ref="tables"
    editable
    searchable
    search-place="top"
    v-model="tableData"
    :columns="columns"
    @on-build="handleBuild"
    @on-trash="handleTrash"
    @on-selection-change="select"
    @searchEvent="handleSearch"
  ><template slot="button">
    <Button
      icon="md-person-add"
      style="margin: 0px 10px"
      type="primary"
      @click="newMenu"
      >新增数据
    </Button>
    </template>
  </tables>
  <Row type="flex" justify="space-between" align="middle">
    <Col>
      <Button @click="deletSelect">删除选中</Button>
      <Button style="margin: 10px 10px" @click="editSelect"
        >编辑选中</Button
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
    <modal
      :isShow="isShow"
      :showEdit="showEdit"
      :editData="editData"
      @editEvent="handleEdit"
      @editEventCancel="handleEditCancel"
    />
</div>
</template>

<script>
import Tables from '_c/tables'
import { getRoutes } from '@/api/login'
import Modal from './tableModal.vue'
export default {
  name: 'menuTable',
  components: {
    Tables,
    Modal
  },
  data () {
    return {
      columns: [
        {
          title: '名称',
          key: 'name',
          align: 'center',
          serach: { type: 'input' }
        },
        {
          title: '类型',
          key: 'type',
          align: 'center',
          serach: {
            type: 'select',
            options: [
              {
                key: 'layui-bg',
                value: 'layui-bg'
              }
            ]
          }
        },
        {
          title: '请求类型',
          key: 'method',
          width: 180,
          align: 'center',
          serach: {
            type: 'date'
          }
          // render: (h, params) => {
          //   return h('div', params.row.method)
          // }
        },
        {
          title: '路径',
          key: 'path',
          width: 180,
          align: 'center',
          serach: {
            type: 'date'
          }
        },
        {
          title: '描述',
          key: 'regmark',
          width: 180,
          align: 'center',
          serach: {
            type: 'date'
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
      total: 0,
      limit: 10,
      page: 0,
      isShow: false,
      showEdit: false,
      editData: {},
      current: 0,
      selectData: []
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  // computed: {
  //   fromItem: {
  //     get () {
  //       return this.tableData
  //     },
  //     set (value) {
  //       return value
  //     }
  //   }
  // },
  methods: {
    newMenu (index) {
      if (this.isEdit === false) {
        return
      }
      this.editData = {}
      this.isShow = true
      this.showEdit = false
      this.current = index
    },
    handleEdit (item) {
      if (!this.showEdit) {
        this.tableData.push(item)
        this.isShow = false
      } else {
        this.tableData.splice(this.current, 1, item)
        this.isShow = false
      }
      this.$emit('on-change', this.tableData)
    },
    handleEditCancel (bool) {
      this.isShow = bool
    },
    handleBuild (item) {
      if (this.isEdit === false) {
        return
      }
      this.editData = item
      this.isShow = true
      this.showEdit = true
    },
    handleTrash (row, index) {
      if (this.isEdit === false) {
        return
      }
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除 《${row.name}》 这个资料吗?`,
        onOk: () => {
          this.tableData.splice(index, 1)
          this.$emit('on-change', this.tableData)
          this.$Message.success('成功删除!')
        },
        onCancel: () => {
          this.$Message.info('已取消!')
        }
      })
    },
    handleSearch () {},
    onPageSizeChange () {},
    onPageChange () {},
    deletSelect () {
      if (this.selectData.length === 0) {
        this.$Message.info('请选择要删除的数据')
        return
      }
      const msg = this.selectData.map((o) => o.tatle).join(',')
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除${msg}资料吗?`,
        onOk: () => {
          const ids = this.selectData.map((o) => o._id)
          deleteUser(ids)
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
      getRoutes().then((res) => {
        // if (res.code === 200) {
        //   const { roles } = res.data
        const roles = res.data
        console.log(JSON.stringify(roles))
        // }
      })
    },
    select (s) {
      this.selectData = s
    }
  }
}
</script>

<style>

</style>
