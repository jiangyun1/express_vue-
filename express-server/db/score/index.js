const query = require('../mysql')
// const config = require(`${process.cwd()}/config`)
const sd = require("silly-datetime")


exports.isExistScoreByID = async (id) => {
    const sql = `select * from edu_score where id=? and isdel=0`
    let { err, results } = await query(sql, parseInt(id))
    if (err) return { err, isExist: true }
    if (results.length > 0) return { err: null, isExist: true }
    return { err: null, isExist: false }
}



exports.addScore = async ({jlr,sgxx,zjyy, fsdd,fssj,gbyy,czbz,czzz,czyq,czsg,shcs}) => { 
    jlr = jlr || ""
    sgxx = sgxx || ""
    zjyy= zjyy || ""
    fsdd = fsdd || ""
    fssj= fssj || ""
    gbyy = gbyy || ""
    czbz = czbz || ""
    czzz = czzz || ""
    czyq = czyq || ""
    czsg = czsg || ""
    shcs = shcs || ""
    const sql = 'insert into edu_score set ?'
    let { err, results } = await query(sql, { 'jlr': jlr, 'sgxx': sgxx,'zjyy':zjyy, 'fsdd':fsdd,'fssj':fssj,'gbyy':gbyy,'czbz':czbz,'czzz':czzz,'czyq':czyq,'czsg':czsg,'shcs':shcs,'date': sd.format(new Date(),'YYYY-MM-DD HH:mm:ss')});
    // 执行 SQL 语句失败
    if (err) return { err, isSuccess: false }
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return { err: null, isSuccess: false }
    // 添加成功
    return { err: null, isSuccess: true }
}


exports.getScores = async (page, limit, cnum) => {
    let sql = `SELECT
                edu_score.id,
                edu_score.jlr,
                edu_score.sgxx,
                edu_score.zjyy,
                edu_score.date,
                edu_score.fsdd,
                edu_score.fssj,
                edu_score.gbyy,
                edu_score.czbz,
                edu_score.czzz,
                edu_score.czyq,
                edu_score.czsg,
                edu_score.shcs,
                edu_score.alssd,
                edu_score.syd
            FROM
                edu_score
            WHERE `
    let content = []
    if (cnum) {
        sql = sql + "edu_score.sgxx like ? and "
        content.push(`%${cnum}%`)
    }
    sql = sql + `edu_score.isdel = 0`
    sql = sql + " LIMIT ? OFFSET ?"
    content.push(parseInt(limit), parseInt((page - 1) * limit))
    let { err, results } = await query(sql, content)
    if (err) return { err, scores: null }
    return { err: null, scores: results }
}


exports.getScoresTotal = async (cnum) => {
    let sql = `SELECT COUNT(*) FROM
                edu_score
            WHERE `
    let content = []
    if (cnum) {
        sql = sql + "edu_score.sgxx like ? and "
        content.push(`%${cnum}%`)
    }
    sql = sql + `edu_score.isdel = 0`
    let { err, results } = await query(sql, content)
    if (err) return { err, total: -1 }
    return { err: null, total: results[0]['COUNT(*)'] }
}


exports.updateScore = async ({ id,jlr,sgxx,zjyy, fsdd,fssj,gbyy,czbz,czzz,czyq,czsg,shcs }) => {
    jlr = jlr || ""
    sgxx = sgxx || ""
    zjyy= zjyy || ""
    fsdd = fsdd || ""
    fssj= fssj || ""
    gbyy = gbyy || ""
    czbz = czbz || ""
    czzz = czzz || ""
    czyq = czyq || ""
    czsg = czsg || ""
    shcs = shcs || ""
    const sql = 'update edu_score set ? where id = ?'
    let { err, results } = await query(sql, [{'jlr': jlr, 'sgxx': sgxx,'zjyy':zjyy, 'fsdd':fsdd,'fssj':fssj,'gbyy':gbyy,'czbz':czbz,'czzz':czzz,'czyq':czyq,'czsg':czsg,'shcs':shcs,}, parseInt(id)]);
    if (err) return { err, isSuccess: false }
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return { err: null, isSuccess: false }
    // 更新用户成功
    return { err: null, isSuccess: true }
}


exports.delScore = async (id) => {
    const sql = 'update edu_score set isdel = 1 where id = ?'
    let { err, results } = await query(sql, parseInt(id));
    if (err) return { err, isSuccess: false }
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return { err: null, isSuccess: false }
    // 更新用户成功
    return { err: null, isSuccess: true }
}