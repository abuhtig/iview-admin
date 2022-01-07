<template>
  <div>
    <Modal
      v-model="isShow1"
      title="修改评论"
      @on-ok="ok"
      @on-cancel="cancel"
    >
  <div>
    <Form ref="table" :model="formItem" :label-width="80">
      <template v-if="!batchEdit">
        <FormItem label="文章标题" >
            <Input disabled  v-model="formItem.tid.title" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="用户">
            <Input disabled v-model="formItem.cuid.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="评论内容">
            <Input v-model="formItem.content" type="textarea" placeholder="请输入"></Input>
        </FormItem>
        </template>
          <FormItem label="状态">
              <RadioGroup v-model="formItem.status">
                  <Radio label="1">正常</Radio>
                  <Radio label="0">禁言</Radio>
              </RadioGroup>
          </FormItem>
          <FormItem label="显示">
              <RadioGroup v-model="formItem.isRead">
                  <Radio label="1">隐藏</Radio>
                  <Radio label="0">正常</Radio>
              </RadioGroup>
          </FormItem>
          <FormItem label="最佳评论">
              <RadioGroup v-model="formItem.isBest">
                  <Radio label="1">最佳</Radio>
                  <Radio label="0">无</Radio>
              </RadioGroup>
          </FormItem>
    </Form>
  </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default: () => {}
    },
    batchEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    editItem (n, o) {
      this.formItem = { ...n }
    },
    isShow (n, o) {
      this.isShow1 = this.isShow
    }
  },
  data () {
    return {
      isShow1: false,
      formItem: {
        tid: {
          title: ''
        },
        cuid: {
          name: ''
        },
        content: '',
        status: '1',
        isRead: '0',
        isBest: '0'
      }
    }
  },
  methods: {
    ok () {
      this.$emit('editEvent', this.formItem)
      this.$emit('editEventCancel', false)
    },
    cancel () {
      this.$refs.table.resetFields()
      this.$emit('editEventCancel', false)
    }
  }
}
</script>

<style>
</style>
