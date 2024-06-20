const courseService = require(`${process.cwd()}/db/course`)
const R = require(`${process.cwd()}/util/code`)
// 添加
exports.addCourse = async (req, res) => {
    if(!req.body.num) return res.send({ code: R.NOVALID, msg: "号为必填项" })
    let course = req.body
    var { err, isExist } = await courseService.isExistCourseByNum(course.num)
    if (err) return res.cc(err)
    if (isExist) return res.send({ code: R.EXIST, msg: "号重复" })
    var { err, isSuccess } = await courseService.addCourse(course)
    if (err) return res.cc(err)
    if (isSuccess) {
        return res.send({ code: R.SUCCESS, msg: "添加成功" })
    } else {
        return res.send({ code: R.FAIL, msg: "添加失败" })
    }
}

// 分页查询
exports.getCourses = async (req, res) => {
    var { err, courses } = await courseService.getCourses(req.query.page, req.query.limit, req.query.num,req.query.name,req.query.teacher)
    if (err) return res.cc(err)
    var { err, total } = await courseService.getCoursesTotal(req.query.num,req.query.name,req.query.teacher)
    if (err) return res.cc(err)
    return res.send({ code: R.SUCCESS, data: { courses, total }, msg: "查询成功" })
}

// 更新
exports.updateCourse = async (req, res) => {
    // if(!req.body.num) return res.send({ code: R.NOVALID, msg: "学号为必填项" })
    var { err, isExist } = await courseService.isExistCourseByID(req.params.id)
    if (err) return res.cc(err)
    if (!isExist) return res.send({ code: R.EXIST, msg: "不存在" })
    let course = req.body
    course = { ...course, id: req.params.id }
    var { err, isSuccess } = await courseService.updateCourse(course)
    if (err) return res.cc(err)
    if (isSuccess) {
        return res.send({ code: R.SUCCESS, msg: "修改成功" })
    } else {
        return res.send({ code: R.FAIL, msg: "修改失败" })
    }
}

// 删除
exports.delCourse = async (req, res) => {
    var { err, isExist } = await courseService.isExistCourseByID(req.params.id)
    if (err) return res.cc(err)
    if (!isExist) return res.send({ code: R.EXIST, msg: "不存在" })
    var { err, isSuccess } = await courseService.delCourse(req.params.id)
    if (err) return res.cc(err)
    if (isSuccess) {
        return res.send({ code: R.SUCCESS, msg: "删除成功" })
    } else {
        return res.send({ code: R.FAIL, msg: "删除失败" })
    }
}

// 通过号远程搜索
exports.searchCourseByNum = async (req, res) => {
    var { err, courses } = await courseService.getCourseByNumLike(req.params.num)
    if (err) return res.cc(err)
    return res.send({ code: R.SUCCESS, data: { courses }, msg: "搜索成功" })
}