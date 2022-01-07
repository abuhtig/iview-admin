<template>
  <div>
    <Modal :loading="loading" v-model="isShow1" :title="(isEdit ? '修改' : '新增') + '角色信息'" @on-ok="ok" @on-cancel="cancel">
      <div>
        <Form
          ref="table"
          :model="formItem"
          :rules="rules"
          :label-width="80"
        >
          <FormItem prop="name" label="角色名">
            <Input v-model="formItem.name" placeholder="请输入角色名"></Input>
          </FormItem>
          <FormItem prop="roles" label="角色编码">
            <Input v-model="formItem.roles" placeholder="请输入角色编码"></Input>
          </FormItem>
          <FormItem label="角色描述">
            <Input type="textarea" v-model="formItem.desc" placeholder="请输入描述"></Input>
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
        roles: '',
        desc: '',
        menu: []
      },
      rules: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
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
    isEdit: {
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
