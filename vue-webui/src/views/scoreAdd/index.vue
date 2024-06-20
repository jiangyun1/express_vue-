<template>
  <div class="app-container">

   
      <el-form
        :model="addForm"
        ref="addForm"
        label-width="90px"
        @submit.native.prevent
        :rules="FormRules"
      >
        <el-form-item label="记录人">
          <el-input
            v-model="addForm.jlr"
          ></el-input>
        </el-form-item>
        <el-form-item label="事故现象">
          <el-input
            v-model="addForm.sgxx"
          ></el-input>
        </el-form-item>
        <el-form-item label="直接原因">
          <el-input
            v-model="addForm.zjyy"
          ></el-input>
        </el-form-item>
        <el-form-item label="发生地点">
          <el-input
            v-model="addForm.fsdd"
          ></el-input>
        </el-form-item>
        <el-form-item label="发生时间">
          <el-input
            v-model="addForm.fssj"
          ></el-input>
        </el-form-item>
   
        <el-form-item label="根本原因" >
          <el-input
            v-model="addForm.gbyy"
          ></el-input>
        </el-form-item>
        <el-form-item label="处置步骤">
          <el-input
            v-model="addForm.czbz"
          ></el-input>
        </el-form-item>
        <el-form-item label="处置组织">
          <el-input
            v-model="addForm.czzz"
          ></el-input>
        </el-form-item>
        <el-form-item label="处置要求">
          <el-input
            v-model="addForm.czyq"
          ></el-input>
        </el-form-item>
        <el-form-item label="事故结果">
          <el-input
            v-model="addForm.czsg"
          ></el-input>
        </el-form-item>
        <el-form-item label="善后措施">
          <el-input
            v-model="addForm.shcs"
          ></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </span>

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
  },
  methods: {
    async fetchData({ page, limit, cnum, snum }) {
      page = page || this.page;
      limit = limit || this.limit;
      cnum = cnum || this.searchCnumInput;
      snum = snum || this.searchSnumInput;
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