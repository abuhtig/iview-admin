<template>
  <div>
    <Modal
      v-model="isShow1"
      title="修改内容"
      @on-ok="ok"
      @on-cancel="cancel"
    >
  <div>
    <Form ref="table" :model="formItem" :label-width="80">
        <FormItem label="标题">
            <Input v-model="formItem.title" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="分类">
            <Select v-model="formItem.catalog">
                <Option value="ask">提问</Option>
                <Option value="share">分享</Option>
                <Option value="special">专栏</Option>
                <Option value="advise">建议</Option>
            </Select>
        </FormItem>
        <FormItem label="是否结贴">
            <RadioGroup v-model="formItem.isEnd">
                <Radio label="1">未结贴</Radio>
                <Radio label="0">已结贴</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="是否置顶">
            <RadioGroup v-model="formItem.isTop">
                <Radio label="1">置顶</Radio>
                <Radio label="0">不置顶</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="状态">
            <RadioGroup v-model="formItem.status">
                <Radio label="1">禁止评论</Radio>
                <Radio label="0">允许评论</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="标签">
          <Select v-model="formTags" multiple style="width:260px">
            <Option v-for="(item) in tags" :value="item.name" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
    </Form>
  </div>
    </Modal>
  </div>
</template>

<script>
import { getLabel } from '@/api/content'
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
      this.isShow1 = this.isShow
      if (n === true) {
        this.getTags()
      }
    }
  },
  data () {
    return {
      modal1: false,
      isShow1: false,
      tags: [],
      formItem: {
        tid: '',
        uid: '',
        title: '',
        content: '',
        created: '',
        catalog: '',
        fav: '',
        isEnd: '',
        reads: '',
        status: '',
        isTop: '',
        sort: '',
        tags: []
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
    },
    getTags () {
      getLabel({ page: 0, limit: 99 }).then((res) => {
        if (res.code === 200) {
          this.tags = res.data
        }
      })
    }
  },
  setDefaultOptions (o) {
    console.log(o)
    this.tags = o
  },
  computed: {
    formTags: {
      get () {
        return this.formItem.tags.map((o) => o.name)
      },
      set (value) {
        const arr = this.tags.filter(
          (item) => value.indexOf(item.name) !== -1
        )
        this.formItem.tags = arr.map((o) => {
          return {
            classname: o.classname,
            name: o.name
          }
        })
      }
    }
  }
}
</script>

<style>
</style>
