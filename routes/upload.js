let userModel = require('../schemas/users')
let roleModel = require('../schemas/roles')
let { generatePassword } = require('../utils/random')
let { sendPasswordMail } = require('../utils/sendMail')

router.post('/import-users', uploadExcel.single('file'), async function (req, res, next) {
    if (!req.file) {
        return res.status(404).send({ message: "file not found" })
    }

    let workbook = new exceljs.Workbook();
    let pathFile = path.join(__dirname, '../uploads', req.file.filename)

    await workbook.xlsx.readFile(pathFile)
    let worksheet = workbook.worksheets[0];

    let result = []

    // lấy role USER
    let userRole = await roleModel.findOne({ name: "USER" })

    for (let index = 2; index <= worksheet.rowCount; index++) {
        let row = worksheet.getRow(index)

        let username = row.getCell(1).value
        let email = row.getCell(2).value

        let errors = []

        if (!username) errors.push("username null")
        if (!email) errors.push("email null")

        if (errors.length > 0) {
            result.push({ success: false, data: errors })
            continue
        }

        try {
            let password = generatePassword(16)

            let newUser = new userModel({
                username,
                email,
                password, // sẽ tự hash ở schema
                role: userRole._id
            })

            await newUser.save()

            // gửi mail
            await sendPasswordMail(email, password)

            result.push({
                success: true,
                data: { username, email }
            })

        } catch (err) {
            result.push({
                success: false,
                data: err.message
            })
        }
    }

    fs.unlinkSync(pathFile)

    res.send(result)
})