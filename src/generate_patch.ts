import { execSync } from "child_process";
import fs from "fs";

export default function (packages = "") {
  const verdaccioTmp = "/verdaccio-tmp";
  try {
    if (!fs.existsSync(verdaccioTmp)) {
      fs.mkdirSync(verdaccioTmp);
    }
  } catch (error) {
    console.log(error);
  }
  process.chdir(verdaccioTmp);

  execSync(`npm i ${packages} --registry=http://verdaccio:4873`);
  execSync("ls -l");
  execSync("rm -rf ./*");
  process.chdir("/verdaccio/storage");

  // in case git repository not inited
  execSync("git init");
  execSync("git add .");
  execSync("git config user.email root@163.com");
  execSync("git config user.name root");
  execSync('git commit -m' + '"chore(update packages): ' + packages + '"');
  const patch_name = `${packages}.patch`;
  execSync(`git format-patch -1 --stdout > ${patch_name}`);
  return patch_name;
}
