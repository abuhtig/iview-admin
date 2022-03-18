<template>
  <div>
    <Modal :loading="loading" closable v-model="isShow1" title="上传广告图片" @on-ok="ok" @on-cancel="cancel">
      <div>
          <Form
            ref="table"
            :model="formItem"
            :label-width="90"
            :rules="rules"
          >
          <FormItem prop="file" label="上传图片">
          <input type="file" name="file" accept="image/png,image/gif,image/jpeg" @change="upload">
          </FormItem>
          <FormItem label="图片链接">
            <Input :disabled="disable" v-model="formItem.link" placeholder="请输入链接"></Input>
          </FormItem>
          <FormItem prop="type" label="投放位置">
            <Select v-model="formItem.type" >
              <Option value="horse">首页跑马灯</Option>
            </Select>
          </FormItem>
          <FormItem prop="tid" label="跳转帖子ID">
            <Input v-model="formItem.tid" placeholder="请输入帖子TID"></Input>
          </FormItem>
          <FormItem prop="title" label="标题">
            <Input v-model="formItem.title" placeholder="标题,请输入"></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import { uploadImg } from '@/api/admin'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    editItem (n, o) {
      this.formItem = { ...n }
    },
    isShow (n, o) {
      this.isShow1 = n
    }
  },
  data () {
    const validateFile = (rule, value, callback) => {
      if (this.formData || this.formItem.link) {
        return callback()
      } else {
        return callback(new Error('请选择图片或填写图片路径!'))
      }
    }
    return {
      isShow1: false,
      formItem: {
        title: '',
        type: '',
        link: '',
        tid: ''
      },
      rules: {
        title: [
          { required: true, message: '标题描述不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '投放位置不能为空', trigger: 'blur' }
        ],
        file: [
          { validator: validateFile, trigger: 'blur' }
        ]
      },
      formData: '',
      loading: true,
      disable: false
    }
  },
  methods: {
    ok () {
      this.$refs.table.validate((valid) => {
        if (valid) {
          if (this.formData) {
            uploadImg(this.formData).then((res) => {
              if (res.code === 200) {
                this.formItem.link = res.data
                this.loading = false
                this.$emit('editEventCancel', false)
                this.$emit('editEvent', this.formItem)
              } else {
                this.loading = true
                this.$nextTick(() => (this.loading = true))
                this.$Message.error('图片上传失败,请检查!')
              }
            })
          } else {
            this.loading = false
            this.$emit('editEventCancel', false)
            this.$emit('editEvent', this.formItem)
          }
        } else {
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 3000)
          this.$Message.error('请检查输入的数据!')
        }
      })
    },
    cancel () {
      this.$emit('editEventCancel', false)
    },
    upload (e) {
      const formData = new FormData()
      const file = e.target.files
      if (file.length > 0) {
        this.disable = true
        formData.append('file', file[0])
        this.formData = formData
      }
    }
  }
}
</script>

<style scoped>
.file_input {
  margin-left: 40%;
}
</style>
