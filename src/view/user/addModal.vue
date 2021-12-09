<template>
  <div>
    <Modal :loading="loading" v-model="isShow" title="新增用户" @on-ok="ok" @on-cancel="cancel">
      <div>
        <Form
          ref="table"
          :model="formItem"
          :rules="rules"
          :label-width="80"
        >
          <FormItem prop="name" label="用户名">
            <Input v-model="formItem.name" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem prop="username" label="邮箱">
            <Input v-model="formItem.username" placeholder="请输入邮箱"></Input>
          </FormItem>
          <FormItem prop="password" label="密码">
            <Input v-model="formItem.password" placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="角色">
            <Select v-model="formItem.roles">
              <Option value="admin">管理员</Option>
              <Option value="super_admin">超级管理员</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </FormItem>
          <FormItem label="VIP">
            <RadioGroup v-model="formItem.isVip">
              <Radio label="1">注册VIP</Radio>
              <Radio label="0">取消VIP</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="性别">
            <RadioGroup v-model="formItem.gender">
              <Radio label="1">女</Radio>
              <Radio label="0">男</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="favs" label="用户积分">
            <Input v-model="formItem.favs" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="城市">
              <Input v-model="formItem.location" placeholder="请输入"></Input>
          </FormItem>
          <FormItem prop="mobile" label="手机电话">
              <Input v-model="formItem.mobile" placeholder="请输入"></Input>
          </FormItem>
          <FormItem prop="favs" label="用户积分">
            <Input v-model="formItem.favs" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="个性签名">
            <Input v-model="formItem.regmark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="这个人很懒,什么也没留下~"></Input>
        </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import { checkUsername, checkName } from '@/api/users.js'
export default {
  props: {
    isShowadd: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isShowadd (n, o) {
      this.isShow = n
    }
  },
  data () {
    const favPassCheck = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入积分'))
      }
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('数值不正确!'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      if (value.length > 16 || value.length < 6) {
        callback(new Error('密码长度为6-16位'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      checkUsername(value).then((res) => {
        if (res.code === 200) {
          callback()
        } else {
          callback(new Error('邮箱重复!'))
        }
      })
    }
    const validatename = (rule, value, callback) => {
      checkName(value).then((res) => {
        if (res.code === 200) {
          callback()
        } else {
          callback(new Error('昵称重复!'))
        }
      })
    }
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('手机格式不正确!'))
      } else {
        callback()
      }
    }
    return {
      isShow: false,
      loading: true,
      formItem: {
        username: '',
        password: '',
        name: '',
        favs: 10,
        created: '',
        status: '0',
        roles: '',
        isVip: '0',
        gender: '0',
        location: '',
        regmark: '这个人很懒,什么也没留下~',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '登录名不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '昵称不能为空', trigger: 'blur' },
          { validator: validatename, trigger: 'blur' },
          {
            type: 'string',
            min: 3,
            message: '昵称长度至少为3位',
            trigger: 'change'
          },
          {
            type: 'string',
            max: 16,
            message: '昵称长度最多为16位',
            trigger: 'change'
          }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        favs: [
          { validator: favPassCheck, trigger: 'change' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ok () {
      this.$refs.table.validate((valid) => {
        if (valid) {
          this.loading = false
          this.$emit('addEventCancel', false)
          this.$emit('addEvent', this.formItem)
        } else {
          this.loading = true
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请检查输入的数据!')
        }
      })
    },
    cancel () {
      // this.$refs.table.resetFields()
      this.$emit('addEventCancel', false)
    }
  },
  mounted () {},
  computed: {}
}
</script>

<style>
</style>
