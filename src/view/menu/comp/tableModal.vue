<template>
  <div>
    <Modal :loading="loading" v-model="isShow1" :title="(showEdit ? '修改' : '新增') + '资源信息'" @on-ok="ok" @on-cancel="cancel">
      <div>
        <Form
          ref="table"
          :model="formItem"
          :rules="rules"
          :label-width="80"
        >
          <FormItem prop="name" label="资源名称">
            <Input v-model="formItem.name" placeholder="请输入资源名称"></Input>
          </FormItem>
          <FormItem prop="type" label="资源类型">
            <Select v-model="formItem.type">
              <Option value="button">按钮</Option>
              <Option value="api">接口</Option>
            </Select>
          </FormItem>
          <FormItem prop="method" label="请求类型">
            <Select v-model="formItem.method">
              <Option value="get">GET</Option>
              <Option value="post">POST</Option>
              <Option value="delete">DELETE</Option>
              <Option value="updata">UPDATA</Option>
            </Select>
          </FormItem>
          <FormItem prop="path" label="路径">
            <Input v-model="formItem.path" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="资源描述">
            <Input type="textarea" v-model="formItem.regmark" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      formItem: {
        name: '',
        type: '',
        method: '',
        path: '',
        regmark: ''
      },
      rules: {
        type: [
          { required: true, message: '资源类型不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '资源名称不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '资源路径不能为空', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请求方法不能为空', trigger: 'blur' }
        ]
      },
      isShow1: false
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    showEdit: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    isShow (n) {
      this.isShow1 = n
    },
    editData () {
      this.formItem = { ...this.editData }
    }
  },
  methods: {
    ok () {
      this.$refs.table.validate((valid) => {
        if (valid) {
          this.$emit('editEvent', this.formItem)
        }
      })
    },
    cancel () {
      this.$emit('editEventCancel', false)
    }
  }
}
</script>

<style>

</style>
