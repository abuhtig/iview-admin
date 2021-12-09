<template>
  <div>
    <Modal
      v-model="isShow1"
      :title="title1"
      @on-ok="ok"
      @on-cancel="cancel"
    >
  <div>
    <Form ref="table" :model="formItem" :label-width="80">
        <FormItem label="标签名">
            <Input v-model="formItem.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="class类">
            <Select v-model="formItem.classname">
                <Option value="layui-bg">layui-bg</Option>
                <Option value="layui-bg-gray">layui-bg-gray</Option>
                <Option value="layui-bg-orange">layui-bg-orange</Option>
                <Option value="layui-bg-green">layui-bg-green</Option>
                <Option value="layui-bg-cyan">layui-bg-cyan</Option>
                <Option value="layui-bg-blue">layui-bg-blue</Option>
                <Option value="layui-bg-black">layui-bg-black</Option>
            </Select>
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
    isbuild: {
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
        name: '',
        classname: ''
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
  },
  computed: {
    title1: function () {
      return this.isbuild ? '新增标签' : '修改标签'
    }
  }
}
</script>

<style>
</style>
