<template>
<div class="butt">
    <Button type="primary" :disabled="isEdit" size="small" shape="circle">
      <Icon type="md-add" />
      <Dropdown trigger="click"  @on-click="addMenuEvent">
        新增
        <DropdownMenu slot="list">
          <DropdownItem name="bro">兄弟节点</DropdownItem>
          <DropdownItem :disabled="treeData.length === 0" name="son"
            >子节点</DropdownItem
          >
        </DropdownMenu>
      </Dropdown>
    </Button>
    <Button
      type="warning"
      @click="editMenuEvent"
      size="small"
      :disabled="isEdit"
      shape="circle"
      ><Icon type="md-create" />修改</Button
    >
    <Button
    type="error"
    @click="deletNodeEvent"
    size="small"
    :disabled="isEdit"
    shape="circle"
    ><Icon type="md-trash" />删除</Button
    >
  <Tree @on-select-change="handleTreeChange" :data="treeData"></Tree>
</div>
</template>

<script>
export default {
  name: 'menuTree',
  data () {
    return {
      treeNode: []
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
  },
  methods: {
    addMenuEvent (type) {
      this.$emit('addMenuEvent', type)
    },
    editMenuEvent () {
      if (this.treeNode.length < 1) {
        this.$Message.info('请选择节点修改的位置')
        return
      }
      this.$emit('editMenuEvent', { ...this.treeNode[0] })
    },
    deletNodeEvent () {
      if (this.treeNode.length < 1) {
        this.$Message.info('请选择节点修改的位置')
        return
      }
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除${this.treeNode[0].title}菜单吗?`,
        onOk: () => {
          this.$emit('deletNodeEvent', this.treeNode[0])
        },
        onCancel: () => {
          this.$Message.info('已取消!')
        }
      })
    },
    handleTreeChange (item) {
      this.treeNode = item
      if (item.length > 0) {
        this.$emit('handleTreeChange', item)
      }
    }
  }
}
</script>

<style>
.butt button{
  margin-left: 15px;
}
.ivu-tree{
  margin-left: 15px;
  margin-top: 10px;
}
</style>
