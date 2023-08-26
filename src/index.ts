import express from "express"
import {
  InputType,
  generateNewPatch,
  generateOldPackagesPatch,
  clearOldPackages
} from "./actions"
import multer from "multer"
import fs from "fs"

const PORT = process.env.PORT_ADMIN || 3000

const app = express()

const tmpDir = "/temp"
const patchDir = "/patches"

try {
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir)
  }

  if (!fs.existsSync(patchDir)) {
    fs.mkdirSync(patchDir)
  }
} catch (error) {
  console.log(error)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir)
  },
  filename: (req, file, cb) => {
    cb(null, "package.json")
  }
})

app.use(express.json())

app.use(express.static("public"))

app.post(
  `/download`,
  multer({ storage }).single("package-file"),
  (req, res) => {
    const inputType = req.body["input-type"] as InputType
    const packageNames = (req.body["package-names"] ?? "") as string

    if (
      inputType === "names" ||
      inputType === "file" ||
      inputType === "squash"
    ) {
      const patch_name =
        inputType === "squash"
          ? generateOldPackagesPatch({
              patchDir
            })
          : generateNewPatch({
              inputType,
              packageNames,
              tmpDir,
              patchDir
          })
      res.download(patch_name)
      return
    } else {
      res.json({ error: "Invalid input type" })
      return
    }
  }
)

app.get("/clear", (_, res) => {
  clearOldPackages()
  res.json({
    success: "Old packages cleared"
  })
})

const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${PORT}
`)
)
