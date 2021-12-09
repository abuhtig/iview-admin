<template>
  <div>
    <Modal v-model="isShow" title="批量修改用户资料" @on-ok="ok" @on-cancel="cancel">
      <div>
        <Form
          ref="table"
          :model="formItem"
          :label-width="80"
        >
          <FormItem label="角色">
            <Select v-model="formItem.roles">
              <Option value="admin">管理员</Option>
              <Option value="super_admin">超级管理员</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </FormItem>
          <FormItem label="状态">
            <RadioGroup v-model="formItem.status">
              <Radio label="">无修改</Radio>
              <Radio label="0">正常</Radio>
              <Radio label="1">禁言</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="VIP">
            <RadioGroup v-model="formItem.isVip">
              <Radio label="">无修改</Radio>
              <Radio label="1">注册VIP</Radio>
              <Radio label="0">取消VIP</Radio>
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
    isShowbatch: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isShowbatch (n, o) {
      this.isShow = n
    }
  },
  data () {
    return {
      isShow: false,
      formItem: {
        status: '',
        roles: 'user',
        isVip: ''
      }
    }
  },
  methods: {
    ok () {
      this.$emit('batchCancel', false)
      const result = {}
      for (var key of Object.keys(this.formItem)) {
        if (this.formItem[key] !== '') {
          result[key] = this.formItem[key]
        }
      }
      this.$emit('batchEvent', result)
    },
    cancel () {
      this.$emit('batchCancel', false)
    }
  }
}
</script>

<style>
</style>
