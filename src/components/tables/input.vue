<template>
  <div style="display: inline-block; margin: 0 10px">
    <template v-if="item.type === 'select'">
       <Select @on-change="handleChange" v-model="searchValue" style="width: 200px">
        <Option
          v-for="i in item.options"
          :value="i.value"
          :key="i.value"
          >{{ i.key }}</Option
        >
      </Select>
    </template>
    <!-- <template v-else-if="item.type === 'radio'">
      <Select @on-change="handleChange" v-model="searchValue" style="width: 200px">
        <Option
          v-for="i in item.options"
          :value="i.value"
          :key="i.value"
          >{{ i.key }}</Option
        >
      </Select>
    </template> -->
    <template  v-else-if="item.type === 'date'">
      <DatePicker
        @on-change="handleChange"
        type="daterange"
        placement="bottom-end"
        placeholder="Select date"
        style="width: 200px"
      ></DatePicker>
    </template>
    <template v-else>
      <Input
        @on-change="handleChange"
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    value: {
      type: [Array, String],
      default: ''
    }
  },
  data () {
    return {
      searchValue: ''
    }
  },
  methods: {
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    },
    handleChange (value) {
      this.$emit('changeEvent', value)
    }
  },
  computed: {
    inputValue () {
      return this.value
    }
  },
  watch: {
    value () {
      if (this.value === '') {
        this.searchValue = ''
      }
    }
  }
}
</script>

<style>
</style>
