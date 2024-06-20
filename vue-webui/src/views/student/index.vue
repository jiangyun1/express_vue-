<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-col :span="3">
          <el-input
            placeholder="搜索id"
            v-model.lazy="searchNumInput"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-input
            placeholder="搜索用户名"
            v-model.lazy="searchNameInput"
            clearable
          >
          </el-input>
        </el-col>


        <el-col :span="3" :offset="1">
          <el-select
            v-model="selectSexInput"
            placeholder="请选择性别"
            clearable
          >
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1" :offset="0" style="padding-left: 10px">
          <el-button icon="el-icon-search" circle @click="search"></el-button>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-button type="primary" @click="openAddDialog" round
            >添加</el-button
          >
        </el-col>
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
          <!--          <el-table-column align="center" label="ID" width="95">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column> -->
          <el-table-column label="id" width="300" align="center">
            <template slot-scope="scope">
              <el-tag>{{ scope.row.student_num }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="姓名" width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.student_name }}
            </template>
          </el-table-column>
          <el-table-column label="家庭住址">
            <template slot-scope="scope">
              <span>{{ scope.row.student_address }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              <span>{{ scope.row.student_sex | getSex }}</span>
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
                    scope.row.student_num,
                    scope.row.student_name,
                    scope.row.student_grade,
                    scope.row.student_class,
                    scope.row.student_sex
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="500px">
      <el-form
        :model="addForm"
        ref="addForm"
        label-width="90px"
        @submit.native.prevent
        :rules="FormRules"
      >
        <el-form-item label="id" prop="num">
          <el-input placeholder="请输入id" v-model="addForm.num" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="addForm.name" clearable>
          </el-input>
        </el-form-item>
      
              <el-form-item label="家庭住址">
          <el-input
            placeholder="请输入家庭住址"
            v-model="addForm.address"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addForm.sex" placeholder="请选择性别">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="500px">
      <el-form
        :model="editForm"
        ref="editForm"
        label-width="90px"
        @submit.native.prevent
        :rules="FormRules"
      >
        <el-form-item label="id">
          <el-input
            placeholder="请输入id"
            v-model="editForm.num"
            clearable
            :disabled="true"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            placeholder="请输入用户名"
            v-model="editForm.name"
            clearable
          >
          </el-input>
        </el-form-item>
           <el-form-item label="家庭住址">
          <el-input
            placeholder="请输入家庭住址"
            v-model="editForm.address"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editForm.sex" placeholder="请选择性别">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
  getStudents,
  deleteStudent,
  addStudent,
  updateStudent,
} from "@/api/student";

export default {
  data() {
    return {
      sexOptions: [
        {
          value: 0,
          label: "未知",
        },
        {
          value: 1,
          label: "男",
        },
        {
          value: 2,
          label: "女",
        },
      ],
      searchNumInput: "",
      searchNameInput: "",
      searchGradeInput: "",
      searchClassInput: "",
      selectSexInput: null,
      list: null,
      listLoading: true,
      page: 1,
      limit: 10,
      total: 0,
      temp: {
        id: -1,
        num: "",
        name: "",
        grade: "",
        _class: "",
        sex: 0,
      },
      addDialogVisible: false,
      addForm: null,
      editDialogVisible: false,
      editForm: null,
      FormRules: {
        num: [
          {
            required: true,
            message: "请输入id",
            trigger: "blur",
          },
        ],
        sex: [
          {
            required: true,
            message: "请选择性别",
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
  filters: {
    getSex(sexid) {
      const sexMap = {
        0: "未知",
        1: "男",
        2: "女",
      };
      return sexMap[sexid];
    },
  },
  methods: {
    async fetchData({ page, limit, num, name, grade, _class, address, sex }) {
      page = page || this.page;
      limit = limit || this.limit;
      num = num || this.searchNumInput;
      name = name || this.searchNameInput;
      grade = grade || this.searchGradeInput;
      _class = _class || this.searchClassInput;
      address = address;address
      sex = sex || this.selectSexInput;

      this.listLoading = true;
      let res = await getStudents(
        page,
        limit,
        num,
        name,
        grade,
        _class,
        address,
        sex,
      );
      let { students, total } = res.data;
      this.list = students;
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
      let res = await deleteStudent(id);
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
    openEditDialog(id, num, name, grade, _class,address, sex) {
      this.clearEditForm();
      this.editForm = { id, num, name, grade, _class,address, sex };
      this.editDialogVisible = true;
    },
    submitAddForm() {
      this.$refs["addForm"].validate(async (valid) => {
        if (valid) {
          let res = await addStudent(this.addForm);
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
          let res = await updateStudent(this.editForm);
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
  },
};
</script>