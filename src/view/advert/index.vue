<template>
  <Card>
    <Table
    :columns="columns1"
    :data="data1"
    @on-selection-change="select"
    ></Table>
    <Button @click="upImage" type="info">上传</Button>
    <Button style="margin: 10px 10px" @click="deletSelect">删除选中</Button>
  <upModal
    :isShow="showEdit"
    @editEvent="handleEdit"
    @editEventCancel="handleEditCancel"
  ></upModal>
  </Card>
</template>

<script>
import { uploadAdvert, getAdvert, deleteAdvert } from '@/api/admin'
import upModal from './upImageModal.vue'
export default {
  name: 'advert',
  components: {
    upModal
  },
  data () {
    return {
      columns1: [
        {
          title: '图片预览',
          key: 'item',
          minWidth: 240,
          render: (h, params) => {
            return h('img', {
              style: {
                verticalAlign: 'middle',
                height: '160px'
              },
              attrs: {
                src: 'https://www.toped.top:444' + params.row.link
              }
            })
          }
        },
        {
          title: '图片标题',
          key: 'title'
        },
        {
          title: '图片链接',
          key: 'link'
        },
        {
          title: '投放位置',
          key: 'type'
        },
        {
          title: '跳转帖子',
          key: 'tid'
        },
        {
          type: 'selection',
          fixed: 'left',
          width: 60,
          align: 'center'
        }
      ],
      showEdit: false,
      data1: [],
      selectData: ''
    }
  },
  methods: {
    upImage () {
      this.showEdit = true
    },
    handleEditCancel (bool) {
      this.showEdit = bool
    },
    handleEdit (data) {
      uploadAdvert(data).then((res) => {
        if (res.code === 200) {
          this.$Message.success('上传更新成功!')
        }
      })
    },
    getAdvertList () {
      getAdvert().then((res) => {
        if (res.code === 200) {
          this.data1 = res.data
        }
      })
    },
    select (q) {
      this.selectData = q
    },
    deletSelect () {
      if (this.selectData.length === 0) {
        this.$Message.info('请选择要删除的数据')
        return
      }
      const msg = this.selectData.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '确认删除?',
        content: `确认删除${msg}这个资源吗?`,
        onOk: () => {
          const ids = this.selectData.map((o) => o._id)
          deleteAdvert(ids)
            .then((res) => {
              if (res.code === 200) {
                this.data1 = this.data1.filter(
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
    }
  },
  mounted () {
    this.getAdvertList()
  }
}
</script>

<style>
</style>
