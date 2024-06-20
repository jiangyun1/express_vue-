<template>
  <div class="app-container">
    <el-container>
      <el-header>

      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
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
              {{ scope.row.gbyy}}
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

    
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-popconfirm
                title="确定删除吗?"
                @onConfirm="deleteRow(scope.row.id)"
                icon="el-icon-info"
                icon-color="red"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-popconfirm>
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="
                  openEditDialog(
                    scope.row.id,
                    scope.row.course_num,
                    scope.row.student_num,
                    scope.row.score
                  )
                "
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[5, 10, 20, 100]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-footer>
    </el-container>


    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="500px">
      <el-form
        :model="editForm"
        ref="editForm"
        label-width="90px"
        @submit.native.prevent
        :rules="FormRules"
      >
        <el-form-item label="号">
          <el-input
            placeholder="请输入号"
            v-model="editForm.cnum"
            clearable
            disabled="true"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="记录人">
          <el-input
            v-model="editForm.jlr"
          ></el-input>
        </el-form-item>
        <el-form-item label="事故现象">
          <el-input
            v-model="editForm.sgxx"
          ></el-input>
        </el-form-item>
        <el-form-item label="直接原因">
          <el-input
            v-model="editForm.zjyy"
          ></el-input>
        </el-form-item>
        <el-form-item label="发生地点">
          <el-input
            v-model="editForm.fsdd"
          ></el-input>
        </el-form-item>
        <el-form-item label="发生时间">
          <el-input
            v-model="editForm.fssj"
          ></el-input>
        </el-form-item>
   
        <el-form-item label="根本原因" >
          <el-input
            v-model="editForm.gbyy"
          ></el-input>
        </el-form-item>
        <el-form-item label="处置步骤">
          <el-input
            v-model="editForm.czbz"
          ></el-input>
        </el-form-item>
        <el-form-item label="处置组织">
          <el-input
            v-model="editForm.czzz"
          ></el-input>
        </el-form-item>
        <el-form-item label="处置要求">
          <el-input
            v-model="editForm.czyq"
          ></el-input>
        </el-form-item>
        <el-form-item label="事故结果">
          <el-input
            v-model="editForm.czsg"
          ></el-input>
        </el-form-item>
        <el-form-item label="善后措施">
          <el-input
            v-model="editForm.shcs"
          ></el-input>
        </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </span>
    </el-dialog>
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
      editForm: null,
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
    console.log(this.$route.query)
    this.editForm = { ...this.temp, id: undefined };
    this.editForm = { ...this.temp };
    this.searchCnumInput=this.$route.query.name
    this.refreshAll();

  },
  methods: {
    async fetchData({ page, limit, cnum, snum }) {
      page = page || this.page;
      limit = limit || this.limit;
      cnum =  this.searchCnumInput;
      snum = this.searchCnumInput;
      this.listLoading = true;
      let res = await getScores(page, limit, cnum, snum);
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
    cleareditForm() {
      this.editForm = { ...this.temp, id: undefined };
    },
    clearEditForm() {
      this.editForm = { ...this.temp };
    },
    openAddDialog() {
      this.cleareditForm();
      this.addDialogVisible = true;
    },
    openEditDialog(id, cnum, snum, score) {
      this.clearEditForm();
      this.editForm = { id, cnum, snum, score };
      this.editDialogVisible = true;
    },
    submiteditForm() {
      this.$refs["editForm"].validate(async (valid) => {
        if (valid) {
          let res = await addScore(this.editForm);
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