<template>
  <div>
    <Form
      ref="table"
      :rules="rules"
      :disabled="!isEdit"
      :model="formItem"
      :label-width="80"
    >
      <FormItem prop="title" label="标题">
        <Input v-model="formItem.title" placeholder="请输入"></Input>
      </FormItem>
      <FormItem prop="path" label="路径">
        <Input v-model="formItem.path" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="排序">
        <Input v-model="formItem.sort" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="菜单类型">
        <Select v-model="formItem.type">
          <Option value="menu">资源</Option>
          <Option value="resouce">目录</Option>
          <Option value="link">链接</Option>
        </Select>
      </FormItem>
      <template v-if="formItem.component !== 'link'">
      <FormItem prop="name" label="组件名称">
        <Input v-model="formItem.name" placeholder="请输入"></Input>
      </FormItem>
        <FormItem label="组件">
        <Input v-model="formItem.component" placeholder="请输入">
          <span slot="prepend">() =>('</span>
          <span slot="append">')</span>
        </Input>
        </FormItem>
              <Row>
        <Col>
          <FormItem label="面包屑">
            <i-switch v-model="formItem.hidelnBread" size="large">
              <span slot="open">true</span>
              <span slot="close">false</span>
            </i-switch>
          </FormItem>
        </Col>
        <Col>
          <FormItem label="菜单">
            <i-switch v-model="formItem.hidelnMenu" size="large">
              <span slot="open">true</span>
              <span slot="close">false</span>
            </i-switch>
          </FormItem></Col
        >
        <Col>
          <FormItem label="缓存">
            <i-switch v-model="formItem.notCache" size="large">
              <span slot="open">true</span>
              <span slot="close">false</span>
            </i-switch>
          </FormItem></Col
        >
      </Row>
      </template>
      <template v-else>
      <FormItem label="链接">
        <Input v-model="formItem.link" placeholder="请输入"></Input>
      </FormItem>
      </template>
      <FormItem label="图标">
        <Input v-model="formItem.icon" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="重定向">
        <Input v-model="formItem.redirect" placeholder="请输入"></Input>
      </FormItem>
      <FormItem v-show="isEdit">
        <Button type="primary" @click="submit">确定</Button>
        <Button style="margin-left: 8px" @click="cancel">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'menuFrom',
  data () {
    return {
      formItem: {
        title: '',
        path: '',
        name: '',
        component: '',
        hidelnBread: false,
        hidelnMenu: false,
        notCache: false,
        icon: '',
        sort: '',
        link: '',
        redirect: '',
        children: '',
        type: '',
        operations: []
      },
      rules: {
        title: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '组件名称不能为空', trigger: 'blur' }]
      },
      treeData: []
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    formItem1: {
      type: Object,
      default: () => {}
    },
    treeData1: {
      type: Array,
      default: () => {}
    },
    treeNode: {
      type: Array,
      default: () => {}
    }
  },
  watch: {
    formItem1 (n, o) {
      this.formItem = { ...n }
    },
    treeData1 (n, o) {
      this.treeData = { ...n }
    }
  },
  methods: {
    submit () {
      this.$refs.table.validate((valid) => {
        if (valid) {
          const data = { ...this.formItem }
          this.$emit('submitEvent', data)
          this.initFrom()
        } else {
          this.$Message.error('请检查输入的数据!')
        }
      })
    },
    cancel () {
      this.initFrom()
    },
    initFrom () {
      this.formItem = {
        title: '',
        path: '',
        name: '',
        component: '',
        hidelnBread: false,
        hidelnMenu: false,
        notCache: false,
        icon: '',
        sort: '',
        link: '',
        redirect: '',
        children: '',
        type: '',
        operations: []
      }
      this.$emit('cancelEvent', false)
    }
  }
}
</script>

<style>
</style>
