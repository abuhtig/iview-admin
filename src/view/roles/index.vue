<template>
  <Row>
    <Col span="4">
      <Card shadow>
        <p slot="title">
          <Icon type="ios-man" />
          角色管理
        </p>
        <a href="#" slot="extra" @click="showAdd">
          <Icon type="ios-loop-strong"></Icon>
          + 新增
        </a>
        <List v-for="(item, index) in rolesList" :key="index + 'roles'">
          <ListItem>
            <div class="flex">
              <span
                @click="upIndex(index)"
                :class="{ listSelect: rolesIndex === index }"
                class="list"
                >{{ item.name }}</span
              >
            </div>
            <div class="icon">
              <li>
                <Icon
                  @click="showEdit(item, index)"
                  size="18"
                  type="ios-build"
                />
              </li>
              &nbsp;&nbsp;
              <li>
                <Icon
                  @click="deletRoles(item, index)"
                  size="18"
                  type="ios-trash"
                />
              </li>
            </div>
          </ListItem>
        </List>
      </Card>
    </Col>
    <Col span="4" style="margin: 0 10px">
      <Card title="管理菜单" shadow icon="ios-menu">
        <Tree
          :data="treeData"
          show-checkbox
          @on-select-change="showTabledata"
        ></Tree>
      </Card>
    </Col>
    <Col span="15">
      <Card title="菜单选项" shadow icon="ios-git-network">
        <template slot="extra">
          <Button type="success" @click="save">保存</Button>&nbsp;&nbsp;
          <Button @click="cancel">取消</Button>
        </template>
        <tables
          ref="tables"
          search-place="top"
          v-model="tableData"
          :columns="columns"
          @on-selection-change="select"
        >
        </tables>
      </Card>
    </Col>
    <modal
      :isShow="isShow"
      :isEdit="isEdit"
      :editData="editData"
      @editEvent="handleEdit"
      @editEventCancel="handleEditCancel"
    />
  </Row>
</template>

<script>
import { getMenus, addRoles, deleteRoles, updataRoles, getRoles } from '@/api/admin.js'
import { modifyNode, getIds, updataTree } from '@/libs/util.js'
import Tables from '_c/tables'
import Modal from './addModal.vue'
export default {
  name: 'roleses',
  components: {
    Tables,
    Modal
  },
  data () {
    return {
      columns: [
        {
          title: '名称',
          width: 180,
          key: 'name',
          align: 'center'
        },
        {
          title: '类型',
          width: 80,
          key: 'type',
          align: 'center'
        },
        {
          title: '请求类型',
          key: 'method',
          width: 180,
          align: 'center'
          // render: (h, params) => {
          //   return h('div', params.row.method)
          // }
        },
        {
          title: '路径',
          key: 'path',
          width: 180,
          align: 'center'
        },
        {
          title: '描述',
          key: 'regmark',
          width: 180,
          align: 'center'
        },
        {
          type: 'selection',
          fixed: 'left',
          width: 60,
          align: 'center'
        }
      ],
      tableData: [],
      isShow: false,
      isEdit: false,
      rolesIndex: '',
      editData: {},
      treeData: [],
      rolesList: [],
      // 树选中的节点
      selectNode: {},
      rolesLIstSave: []
    }
  },
  methods: {
    _getRoles () {
      getRoles().then((res) => {
        if (res.code === 200) {
          this.rolesList = res.data
          this.rolesLIstSave = res.data
        }
      })
    },
    save () {
      if (this.rolesIndex === '') {
        this.$Message.error('请选择要更改的角色')
        return
      }
      this.rolesList[this.rolesIndex].menu = getIds(this.treeData, ['children', 'operations'])
      updataRoles(this.rolesList[this.rolesIndex]).then((res) => {
        if (res.code === 200) {
          this.rolesList[this.rolesIndex] = res.data
          this.$Message.success('保存成功!')
        }
      })
    },
    cancel () {
      modifyNode(this.treeData, null, 'checked', false)
      this.tableData = []
      this.rolesIndex = ''
      this.rolesLIst = this.rolesLIstSave
    },
    upIndex (index) {
      if (this.rolesIndex === '') {
        this.rolesIndex = index
        if (this.rolesList[this.rolesIndex].menu.length === 0) {
          return
        }
        modifyNode(this.treeData, this.rolesList[this.rolesIndex].menu, 'checked', true)
        if (this.selectNode.length > 0 && selectNode.operations) {
          this.tableData = selectNode.operations
        }
      } else {
        modifyNode(this.treeData, null, 'checked', false)
        this.tableData = []
        this.rolesIndex = ''
      }
    },
    handleEditCancel (Bool) {
      this.isShow = Bool
    },
    handleEdit (data) {
      if (this.isEdit) {
        this.rolesList.splice(this.rolesIndex, 1, data)
        delete data.menu
        updataRoles(data).then((res) => {
          if (res.code === 200) {
            this.$Message.success('修改成功!')
          }
        })
        this.isShow = false
        this.isEdit = false
      } else {
        addRoles(data).then((res) => {
          if (res.code === 200) {
            this.rolesList.push(res.data)
            this.$Message.success('保存成功!')
          }
        })
        this.isShow = false
      }
    },
    showAdd () {
      this.isShow = true
      this.editData = {}
    },
    showEdit (item, index) {
      this.editData = item
      this.rolesIndex = index
      this.isEdit = true
      this.isShow = true
    },
    deletRoles (item, index) {
      this.rolesIndex = index
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除 《${item.name}》 这个角色吗?`,
        onOk: () => {
          deleteRoles(item._id)
            .then((res) => {
              if (res.code === 200) {
                this.rolesList.splice(index, 1)
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
      const ids = s.map((o) => o._id)
      if (this.selectNode && this.selectNode.operations) {
        this.selectNode.operations.forEach((item) => {
          if (!ids.includes(item._id)) {
            item._checked = false
          } else {
            item._checked = true
          }
        })
      }
      updataTree(this.treeData, this.selectNode)
    },
    showTabledata (arr, curr) {
      if (this.rolesIndex !== '') {
        curr.operations.map((item) => {
          if (this.rolesList[this.rolesIndex].menu.includes(item._id)) {
            item._checked = true
          }
        })
      }
      this.tableData = curr.operations
      this.selectNode = curr
    },
    _getMenus () {
      getMenus().then((res) => {
        if (res.code === 200) {
          this.treeData = res.data
        }
      })
    }
  },
  mounted () {
    this._getMenus()
    this._getRoles()
  }
}
</script>

<style lang="less" scoped>
.list {
  border-radius: 3px;
  padding: 0 4px;
  cursor: pointer;
  &:hover {
    background-color: #eaf4fe;
  }
  &.listSelect {
    background-color: #d5e8fc;
  }
}

.flex {
  display: block;
  flex: 1;
}

.icon {
  display: inline-flex;
}
</style>
