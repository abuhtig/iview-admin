<template>
  <div>
    <Modal v-model="isShow" title="批量修改文章资料" @on-ok="ok" @on-cancel="cancel">
      <div>
        <Form
          ref="table"
          :model="formItem"
          :label-width="80"
        >
          <FormItem label="分类">
            <Select v-model="formItem.catalog">
              <Option value="ask">提问</Option>
              <Option value="share">分享</Option>
              <Option value="logs">动态</Option>
              <Option value="notice">公告</Option>
              <Option value="advise">建议</Option>
              <Option value="special">专栏</Option>
            </Select>
          </FormItem>
          <FormItem label="标签">
            <Select v-model="formTags" multiple style="width:260px">
              <Option v-for="(item) in tags" :value="item.name" :key="item.name">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态">
            <RadioGroup v-model="formItem.status">
              <Radio label="">无修改</Radio>
              <Radio label="0">正常</Radio>
              <Radio label="1">禁言</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="置顶">
            <RadioGroup v-model="formItem.isTop">
              <Radio label="">无修改</Radio>
              <Radio label="1">置顶</Radio>
              <Radio label="0">非置顶</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="结贴">
            <RadioGroup v-model="formItem.isEnd">
              <Radio label="">无修改</Radio>
              <Radio label="1">已结贴</Radio>
              <Radio label="0">未结贴</Radio>
            </RadioGroup>
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
    isShowbatch: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isShowbatch (n, o) {
      this.isShow = n
      if (n === true) {
        this.getTags()
      }
    }
  },
  data () {
    return {
      isShow: false,
      tags: [],
      formItem: {
        status: '',
        catalog: '',
        isTop: '',
        tags: '',
        isEnd: ''
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
    },
    getTags () {
      getLabel({ page: 0, limit: 99 }).then((res) => {
        if (res.code === 200) {
          this.tags = res.data
        }
      })
    }
  },
  computed: {
    formTags: {
      get () {
        return ''
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
