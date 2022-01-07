<template>
  <div>
    <Row>
      <Col span="6">
        <Card title="树结构管理" shadow>
          <tree
          :isEdit="isEdit"
          :treeData="treeData"
          @addMenuEvent="addMenu"
          @editMenuEvent="editMenu"
          @deletNodeEvent="deletNode"
          @handleTreeChange="handleTree"
          ></tree>
        </Card>
      </Col>
      <Col span="17" offset="1">
        <Card title="管理菜单" dis-hover>
          <from
          :isEdit="isEdit"
          :formItem1="formItem"
          :treeData1="treeData"
          :treeNode="treeNode"
          @submitEvent="submit"
          @cancelEvent="cancel"
          ></from>
        </Card>
      </Col>
      <Col span="24">
        <Card style="margin-top: 5px" shadow title="菜单选项">
          <tables
          :isEdit="isEdit"
          :tableData="tableData"
          @on-change="handleTable"
          ></tables>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { insertMenu, updataTree, getNode, deleteNode } from '@/libs/util.js'
import { addMenu, getMenus, deleteMenu, updataMenu } from '@/api/admin.js'
import Tree from './comp/tree.vue'
import From from './comp/from.vue'
import Tables from './comp/table.vue'
export default {
  naem: 'menu',
  components: {
    Tree,
    From,
    Tables
  },
  data () {
    return {
      isEdit: false,
      treeNode: [],
      treeData: [],
      total: 0,
      limit: 10,
      page: 0,
      type: '',
      tableData: [],
      formItem: {}
    }
  },
  methods: {
    _getMenus () {
      getMenus().then((res) => {
        if (res.code === 200) {
          this.treeData = res.data
        }
      })
    },
    editMenu (item) {
      this.formItem = item
      this.isEdit = true
      this.type = ''
    },
    addMenu (type) {
      this.formItem = {}
      this.type = type
      this.isEdit = true
    },
    deletNode (select) {
      const parent = getNode(this.treeData, select)
      if (parent.nodeKey !== select.nodeKey) {
        updataMenu(parent).then((res) => {
          if (res.code === 200) {
            this.$Message.success('菜单删除成功!')
          }
        })
      } else {
        deleteMenu(parent._id).then((res) => {
          if (res.code === 200) {
            this.$Message.success('菜单删除成功!')
          }
        })
      }
      this.treeData = deleteNode(this.treeData, this.treeNode[0])
      this.treeNode = []
    },
    handleTree (item) {
      if (!this.isEdit) {
        this.treeNode = item
        this.formItem = item[0]
        if (item[0].operations) {
          this.tableData = [...item[0].operations]
        }
      } else {
        this.$Message.error('请在非编辑状态下查看!')
      }
    },
    cancel (item) {
      this.isEdit = item
    },
    submit (data) {
      // 如果填写表格资料,将资料添加到菜单的operations属性里
      data.operations = this.tableData
      this.tableData = []
      if (this.type === 'bro') {
        if (this.treeData.length < 1 || this.treeNode.length === 0) {
          // 第一次或直接添加一级兄弟节点,在没有数据或没有选择数据时
          addMenu(data).then((res) => {
            if (res.code === 200) {
              this.treeData.push(res.data)
              this.$Message.success('菜单添加成功!')
            }
          })
        } else {
          // 兄弟节点添加
          const parent = getNode(this.treeData, this.treeNode[0])
          const selectNode = this.treeNode[0]
          if (parent.nodeKey === selectNode.nodeKey) {
            addMenu(data).then((res) => {
              if (res.code === 200) {
                this.treeData = insertMenu(this.treeData, selectNode, res.data)
                this.$Message.success('菜单添加成功!')
              }
            })
          } else {
            const parent = getNode(this.treeData, this.treeNode[0])
            // 子节点的兄弟节点添加
            updataMenu(parent).then((res) => {
              if (res.code === 200) {
                this.$Message.success('菜单添加成功!')
              }
            })
          }
        }
      } else if (this.type === 'son') {
        if (typeof this.treeNode[0].children === 'undefined') {
          // 子节点添加到children属性里
          this.$set(this.treeNode[0], 'children', [data])
        } else {
          this.$set(this.treeNode[0], 'children', [
            ...this.treeNode[0].children,
            data
          ])
        }
        // 更改操作,直接将父节点整个传出更改
        const parent = getNode(this.treeData, this.treeNode[0])
        updataMenu(parent).then((res) => {
          if (res.code === 200) {
            this.$Message.success('菜单添加成功!')
          }
        })
      } else {
        // type为空时,为编辑菜单选项
        this.treeData = updataTree(this.treeData, data)
        this.$set(this.treeNode, 0, data)
        const parent = getNode(this.treeData, this.treeNode[0])
        updataMenu(parent).then((res) => {
          if (res.code === 200) {
            this.$Message.success('菜单修改成功!')
          }
        })
      }
    },
    handleTable (data) {
      this.tableData = data
    }
  },
  mounted () {
    this._getMenus()
  }
}
</script>

<style>
</style>
