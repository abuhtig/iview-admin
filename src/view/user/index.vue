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
        @on-selection-change="select"
        @searchEvent="handleSearch"
      >
        <template slot="button">
          <Button
            icon="md-person-add"
            style="margin: 0px 10px"
            type="primary"
            @click="newUser"
            >新增用户</Button
          >
        </template>
      </tables>
      <Row type="flex" justify="space-between" align="middle">
        <Col>
          <Button @click="deletSelect">删除选中</Button>
          <Button style="margin: 10px 10px" @click="editSelect"
            >编辑选中</Button
          >
          <Button type="primary" @click="exportExcel">导出为Excel文件</Button>
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
      <editModal
        :isShow="showEdit"
        :editItem="item"
        :rolesList="rolesList"
        @editEvent="handleEdit"
        @editEventCancel="handleEditCancel"
      ></editModal>
      <addModal
        :isShowadd="showadd"
        :rolesList="rolesList"
        @addEvent="handleadd"
        @addEventCancel="handleaddCancel"
      ></addModal>
      <batchSet
        :isShowbatch="showbatch"
        :rolesList="rolesList"
        @batchEvent="handlebatch"
        @batchCancel="handlebatchCancel"
      ></batchSet>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import dayjs from 'dayjs'
import editModal from './editModal.vue'
import addModal from './addModal.vue'
import batchSet from './batchSet.vue'
import { getRolesName } from '@/api/admin.js'
import {
  getUserList,
  deleteUser,
  editUser,
  addUser,
  batchuser
} from '@/api/users'
export default {
  name: 'user_page',
  components: {
    Tables,
    editModal,
    addModal,
    batchSet
  },
  data () {
    return {
      limit: 10,
      page: 0,
      total: 0,
      showEdit: false,
      showadd: false,
      showbatch: false,
      option: {},
      item: {},
      tableData: [],
      selectData: [],
      rolesList: [],
      columns: [
        { title: '用户名', key: 'name', minWidth: 150, align: 'center', serach: { type: 'input' } },
        { title: '邮箱', key: 'username', minWidth: 190, align: 'center', serach: { type: 'input' } },
        {
          title: '注册时间',
          key: 'created',
          minWidth: 190,
          align: 'center',
          serach: { type: 'date' },
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
            ])
          }
        },
        {
          title: '角色',
          key: 'roles',
          width: 120,
          align: 'center',
          serach: {
            type: 'select',
            options: this.rolesList
          },
          render: (h, params) => {
            return h('div', [h('span', this.rolesName[params.row.roles])])
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
                  innerHTML: params.row.status === '0' ? '正常' : '禁言'
                }
              })
            ])
          }
        },
        {
          title: 'Vip用户',
          key: 'isVip',
          width: 120,
          align: 'center',
          serach: {
            type: 'select',
            options: [
              {
                key: '非VIP',
                value: '0'
              },
              {
                key: '是VIP',
                value: '1'
              }
            ]
          },
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                class:
                  params.row.isVip === '0'
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
        { title: '用户积分', key: 'favs', width: 120, align: 'center', handle: 'true' },
        {
          title: '性别',
          key: 'gender',
          width: 120,
          align: 'center',
          handle: 'true',
          render: (h, params) => {
            return h('div', [h('span', params.row.gender ? '女' : '男')])
          }
        },
        { title: '手机电话', key: 'mobile', width: 120, align: 'center', handle: 'true' },
        { title: '城市', key: 'location', width: 120, align: 'center', handle: 'true' },
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
      ]
    }
  },
  methods: {
    newUser () {
      this.showadd = true
    },
    handleadd (item) {
      addUser(item).then((res) => {
        if (res.code === 200) {
          this.$Message.success('新增成功!')
          this.tableData.splice(0, 0, res.data)
        }
      })
    },
    handleaddCancel (n) {
      this.showadd = n
    },
    getUsers () {
      getUserList({ page: this.page, limit: this.limit, option: this.option }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    _getRolesName () {
      getRolesName().then((res) => {
        if (res.code === 200) {
          this.rolesList = res.data
        }
      })
    },
    handleEdit (item) {
      editUser(item).then((res) => {
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
        content: `确认删除 《${row.name}》 这个用户吗?`,
        onOk: () => {
          deleteUser(row._id)
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
      this.getUsers()
    },
    onPageSizeChange (limt) {
      this.limit = limt
      this.getUsers()
    },
    select (s) {
      this.selectData = s
    },
    deletSelect () {
      if (this.selectData.length === 0) {
        this.$Message.info('请选择要删除的数据')
        return
      }
      const msg = this.selectData.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除${msg}这个用户吗?`,
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
      if (this.selectData.length === 0) {
        this.$Message.info('请选择要修改的数据')
        return
      }
      this.showbatch = true
    },

    handlebatchCancel (bool) {
      this.showbatch = bool
    },
    handlebatch (set) {
      const msg = this.selectData.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '确认修改?',
        content: `确认修改${msg}这些用户吗?`,
        onOk: () => {
          const ids = this.selectData.map((o) => o._id)
          batchuser({ ids: ids, set })
            .then((res) => {
              this.tableData = this.tableData.map((item) => {
                if (ids.includes(item._id)) {
                  for (var keys of Object.keys(set)) {
                    item[keys] = set[keys]
                  }
                }
              })
              this.$Message.success('修改成功!')
            })
            .catch((err) => {
              this.$Message.info('修改失败! 原因：' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('已取消!')
        }
      })
    },
    handleSearch (v) {
      if ((typeof this.option.search !== 'undefined' && v.search !== this.option.search) || this.option === {}) {
        this.page = 0
      }
      this.option = v
      this.getUsers()
    }
  },
  mounted () {
    this.getUsers()
    this._getRolesName()
  },
  computed: {
    rolesName () {
      const tmp = {}
      this.rolesList.forEach((i) => {
        tmp[i.roles] = i.name
      })
      return tmp
    }
  }
}
</script>

<style>
</style>
