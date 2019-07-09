<template>
  <section id="ranklist">
    <div class="toolbar">
      <el-form :inline="true">
        <el-form-item>
          <el-select
            size="small"
            v-model="selectedGame"
            placeholder="请选择游戏"
          >
            <el-option
              v-for="item in gameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            size="small"
            v-model="selectedPeriod"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small">筛选</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="ranks">
      <el-table v-loading="tableLoading" highlight-current-row :data="ranks.data">
        <el-table-column prop="rank" label="排名" width="70"></el-table-column>
        <el-table-column prop="name" label="昵称" width="200">
        </el-table-column>
        <el-table-column prop="score" label="分数" width="150">
        </el-table-column>
        <el-table-column prop="created_at" label="记录时间"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="ranks.total"
        :page-size="ranks.per_page"
        :current-page="ranks.current_page"
        @current-change="handleCurrentChange"
        >
      </el-pagination>
    </div>
  </section>
</template>

<script>
import { scoreList } from '@/requests/rank'
export default {
  name: 'Rank',
  data () {
    let end = new Date()
    let start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    return {
      tableLoading: false,
      selectedGame: '2048',
      selectedPeriod: [start, end],
      gameOptions: [
        {
          value: '2048',
          label: '2048'
        },
        {
          value: 'snake',
          label: '贪吃蛇'
        },
        {
          value: 'pacman',
          label: '吃豆人'
        }
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      ranks: {
        total: 0,
        current_page: 1,
        per_page: 0,
        data: []
      }
      // ranks: [
      //   {
      //     rank: '1',
      //     name: 'kotoyuuko',
      //     score: '10001',
      //     created_at: (new Date()).toLocaleString()
      //   },
      //   {
      //     rank: '2',
      //     name: 'kotoyuuko',
      //     score: '10000',
      //     created_at: (new Date()).toLocaleString()
      //   },
      //   {
      //     rank: '3',
      //     name: 'kotoyuuko',
      //     score: '9999',
      //     created_at: (new Date()).toLocaleString()
      //   }
      // ]
    }
  },
  methods: {
    loadRanks () {
      this.tableLoading = true
      scoreList(this.ranks.current_page).then(res => {
        this.tableLoading = false
        this.ranks.total = res.data.total
        this.ranks.current_page = res.data.current_page
        this.ranks.per_page = res.data.per_page
        this.ranks.data = res.data.data
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '获取排名列表失败'
        })
      })
    },
    handleCurrentChange (page) {
      this.ranks.current_page = page
      this.loadRanks()
    }
  }
}
</script>

<style lang="scss">
#ranklist {
  display: flex;
  flex-direction: column;

  .toolbar {
    padding: 10px 20px;

    .el-select {
      width: 100px;
    }
  }
}
</style>
