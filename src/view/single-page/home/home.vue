<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36" :key="trim">
          <p class="smallNum"><i>+</i><count-to :end="infor.diff"/></p>
          <count-to :startVal="infor.count - infor.diff" :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" pieName="内容统计" :value="pieData" text="发帖统计" :key="trim2"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="半年发帖数据" :key="trim3"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { getStats } from '@/api/admin'
import moment from 'dayjs'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '注册用户', icon: 'md-person-add', count: 0, color: '#2d8cf0', diff: 0 },
        { title: '发帖累计', icon: 'md-locate', count: 0, color: '#19be6b', diff: 0 },
        { title: '问答共计', icon: 'md-help-circle', count: 0, color: '#ff9900', diff: 0 },
        { title: '阅读累计', icon: 'md-eye', count: 0, color: '#ed3f14', diff: 0 },
        { title: '本周签到', icon: 'md-checkmark-circle-outline', count: 0, color: '#E46CBB', diff: 0 },
        { title: '本周发帖', icon: 'md-cloud-upload', count: 0, color: '#9A66E4', diff: 0 }
      ],
      pieData: [
        { value: 0, name: '提问' },
        { value: 0, name: '专栏' },
        { value: 0, name: '分享' },
        { value: 0, name: '建议' },
        { value: 0, name: '公告' }
      ],
      barData: {},
      trim: 0,
      trim2: 0,
      trim3: 0
    }
  },
  mounted () {
    //
    this._getStats()
  },
  methods: {
    _getStats () {
      getStats().then((res) => {
        if (res.code === 200) {
          this.inforCardData.forEach((item, index) => {
            item.count = res.data[index][0]
            item.diff = res.data[index][1]
          })
          this.trim = new Date().getTime()
          if (res.data2) {
            const arr = []
            arr.push({ name: '提问', value: res.data2.ask || 0 })
            arr.push({ name: '专栏', value: res.data2.special || 0 })
            arr.push({ name: '分享', value: res.data2.share || 0 })
            arr.push({ name: '建议', value: res.data2.advise || 0 })
            arr.push({ name: '公告', value: res.data2.notice || 0 })
            this.pieData = arr
            this.trim2 = new Date().getTime()
          }
          if (res.data3) {
            const result = {}
            for (let i = 0; i < 6; i++) {
              const key = moment().subtract(5 - i, 'M').format('YYYY-MM')
              result[key] = res.data3[key] || 0
            }
            this.barData = result
            this.trim3 = new Date().getTime()
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
.smallNum{
  position:absolute;
  right: 3px;
  top: 0px;
  color: #19be6b;
  font-size: 18px;
  i{
    position: absolute;
    left: -12px;
  }
}
</style>
