<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <!-- <el-col :span="4">
          <el-input
            placeholder="搜索号"
            v-model.lazy="searchCnumInput"
            clearable
          >
          </el-input>
        </el-col> -->
        <el-col :span="4" :offset="1">
          <el-input placeholder="搜索事故现象" v-model.lazy="searchCnumInput" clearable>
          </el-input>
        </el-col>
        <el-col :span="1" :offset="0" style="padding-left: 10px">
          <el-button icon="el-icon-search" circle @click="search"></el-button>
        </el-col>
      </el-header>
      <h2>{{ xiangsidu }}</h2>
      <el-main>
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column align="center" label="ID" width="95">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="记录人" width="300" align="center">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.jlr }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="录入日期" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.date }}
            </template>
          </el-table-column>
          <el-table-column label="事故现象" width="300" align="center">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.sgxx }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发生地点" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.fsdd }}
            </template>
          </el-table-column>

          <el-table-column label="发生时间" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.fssj }}
            </template>
          </el-table-column>
          <el-table-column label="直接原因" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.zjyy }}
            </template>
          </el-table-column>
          <el-table-column label="根本原因" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.gbyy }}
            </template>
          </el-table-column>
          <el-table-column label="处置步骤" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.czbz }}
            </template>
          </el-table-column>
          <el-table-column label="处置组织" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.czzz }}
            </template>
          </el-table-column>
          <el-table-column label="处置要求" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.czyq }}
            </template>
          </el-table-column>
          <el-table-column label="事故结果" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.czsg }}
            </template>
          </el-table-column>
          <el-table-column label="善后措施" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.shcs }}
            </template>
          </el-table-column>
          <el-table-column label="案例相似度" width="200" align="center" v-if="searchCnumInput != ''">
            <template slot-scope="scope">
              {{ strSimilarity2Number(searchCnumInput, scope.row.sgxx) }}
            </template>
          </el-table-column>
          <el-table-column label="适应度" width="200" align="center" v-if="searchCnumInput != ''">
            <template slot-scope="scope">
              {{ strSimilarity2syd(searchCnumInput, scope.row.sgxx) }}
            </template>
          </el-table-column>
          <el-table-column label="" width="200" align="center" v-if="searchCnumInput != ''">
            <template slot-scope="scope">
              <el-button type="primary" @click="yingji(scope.row.sgxx)">应急方案</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-main>
      <el-footer>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[5, 10, 20, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-footer>
    </el-container>



  </div>
</template>

<script>
import {
  getScores,
  deleteScore,
  addScore,
  updateScore,
  searchCnum,
  searchSnum,
} from "@/api/score";
import router from "@/router";

export default {
  data() {
    return {
      searchCnumInput: "",
      searchSnumInput: "",
      cnumloading: false,
      snumloading: false,
      coptions: [],
      soptions: [],
      list: null,
      listLoading: true,
      page: 1,
      limit: 10,
      total: 0,
      temp: {
        id: -1,
        cnum: "",
        snum: "",
        score: 0,
      },
      addDialogVisible: false,
      addForm: null,
      editDialogVisible: false,
      editForm: null,
      FormRules: {
        snum: [
          {
            required: true,
            message: "请输入学号",
            trigger: "blur",
          },
        ],
        cnum: [
          {
            required: true,
            message: "请输入号",
            trigger: "blur",
          },
        ],
        score: [
          {
            required: true,
            message: "请输入成绩",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.addForm = { ...this.temp, id: undefined };
    this.editForm = { ...this.temp };
    this.refreshAll();
  },
  methods: {
    yingji(val) {
      this.$router.push({
        path: '/user',
        query: {
          name:val
        }
      })
    },
    strSimilarity2Number: function (s, t) {
      var n = s.length, m = t.length, d = [];
      var i, j, s_i, t_j, cost;
      if (n == 0) return m;
      if (m == 0) return n;
      for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
      }
      for (j = 0; j <= m; j++) {
        d[0][j] = j;
      }
      for (i = 1; i <= n; i++) {
        s_i = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
          t_j = t.charAt(j - 1);
          if (s_i == t_j) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i][j] = this.Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
      }
      return d[n][m];
    },
    //相似程度，并返回相似度百分比
    strSimilarity2Percent: function (s, t) {
      var l = s.length > t.length ? s.length : t.length;
      var d = this.strSimilarity2Number(s, t);
      return (1 - d / l).toFixed(4);
      this.xiangsidu = (1 - d / l).toFixed(4)
      console.log((1 - d / l).toFixed(4))
    },
    strSimilarity2syd: function (s, t) {
      var l = s.length > t.length ? s.length : t.length;
      var d = this.strSimilarity2Number(s, t);
      return (1 - d / l - 0.02).toFixed(4);
    },
    Minimum: function (a, b, c) {
      return a < b ? (a < c ? a : c) : (b < c ? b : c);
    },
    async fetchData({ page, limit, cnum }) {
      page = page || this.page;
      limit = limit || this.limit;
      cnum = cnum || this.searchCnumInput;
      this.listLoading = true;
      let res = await getScores(page, limit, cnum);
      let { scores, total } = res.data;
      this.list = scores;
      this.total = total;
      this.listLoading = false;
    },
    handleSizeChange(limit) {
      this.fetchData({
        limit,
      });
      this.limit = limit;
    },
    handleCurrentChange(page) {
      this.fetchData({
        page,
      });
      this.page = page;
    },
    refreshAll() {
      this.fetchData({});
    },
    search() {
      this.strSimilarity2Percent('sdhofjodsjf', 'dsdfsdfsdf')
      this.fetchData({
        page: 1,
      });
      this.page = 1;
    },
    async deleteRow(id) {
      let res = await deleteScore(id);
      this.$message({
        message: res.msg,
        type: "success",
      });
      this.refreshAll();
    },
    clearAddForm() {
      this.addForm = { ...this.temp, id: undefined };
    },
    clearEditForm() {
      this.editForm = { ...this.temp };
    },
    openAddDialog() {
      this.clearAddForm();
      this.addDialogVisible = true;
    },
    openEditDialog(id, cnum, snum, score) {
      this.clearEditForm();
      this.editForm = { id, cnum, snum, score };
      this.editDialogVisible = true;
    },
    submitAddForm() {
      this.$refs["addForm"].validate(async (valid) => {
        if (valid) {
          let res = await addScore(this.addForm);
          if (res.code == 200)
            this.$message({
              message: res.msg,
              type: "success",
            });
          this.addDialogVisible = false;
          this.refreshAll();
        }
      });
    },
    submitEditForm() {
      this.$refs["editForm"].validate(async (valid) => {
        if (valid) {
          let res = await updateScore(this.editForm);
          if (res.code == 200)
            this.$message({
              message: res.msg,
              type: "success",
            });
          this.editDialogVisible = false;
          this.refreshAll();
        }
      });
    },
    async remoteSearchCnum(query) {
      if (query !== "") {
        let res = await searchCnum(query);
        this.coptions = res.data.courses;
      } else {
        this.coptions = [];
      }
    },
    async remoteSearchSnum(query) {
      if (query !== "") {
        let res = await searchSnum(query);
        this.soptions = res.data.students;
      } else {
        this.soptions = [];
      }
    },
  },
};
</script>