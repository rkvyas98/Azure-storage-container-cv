const { Console } = require('console');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var prompt = require('prompt-sync')();
var cv_api = require('./cv')
const chalk = require('chalk');
const download = require('./download.js')
const path = require("path");
const fs = require('fs')

const option = parseInt(prompt("1. Create New Storage Account  \n2. Create a container \n3. Upload Blob to container \n4. List the items in container \n0 For exit   "));

switch (option){
  case 1:
    var storage = prompt('Enter Storage name : ');
    async function test() {
      const { error,stdout, stderr } = await exec('New-AzStorageAccount -ResourceGroupName "mystorageaccs" -Name "'+storage+'" -Location "eastus" -SkuName "Standard_RAGRS" -Kind "StorageV2"',{'shell':'powershell.exe'});
      if (stderr) {
        return {"error": stderr};
      }
      return {"data": stdout};
    };

    test().then( x => {

      console.log('Storage account created')
    }).catch(err=>{
    console.log(err.stderr)
    })
    break;
  
  case 2:
    var storage = prompt('Enter Storage name : ');
    var con = prompt('Enter Container Name : ');
    async function test1() {
      const { error,stdout, stderr } = await exec('$StorageAccount = Get-AzStorageAccount -ResourceGroupName "mystorageaccs" -Name "'+storage+'";$Context = $StorageAccount.Context;New-AzStorageContainer -Name '+con+' -Context $Context -Permission Blob',{'shell':'powershell.exe'});
      if (stderr) {
        return {"error": stderr};
      }
      return {"data": stdout};
    };

    test1().then( x => {

      console.log('Container Created')
    }).catch(err=>{
    console.log(err.stderr)
    })
    break;

  case 3:
    var storage = prompt('Enter Storage name : ');
    var cont = prompt('Enter Container name : ');
    var file = prompt('Enter file path : ');
    var fname = prompt('Enter file name : ');
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(file)) {
      console.log(chalk.red.bold("Invalid File Extension"));
      } else {
        cv_api.imageAna(file,(error,value)=>{
            if (value.adult.isAdultContent == true || value.adult.isRacyContent == true || value.adult.isGoryContent == true){
                console.log('Image contains Adult Content ')
            }
            else{
                download.download(file,"newimg.png",function () { });
                const imagepath = path.join(__dirname, "/newimg.png");
                fs.writeFileSync('abc.txt',JSON.stringify(value))
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(file)) {
          console.log(chalk.red.bold("Invalid File Extension"));
          } else {
            async function test2() {
              const { error,stdout, stderr } = await exec('$StorageAccount = Get-AzStorageAccount -ResourceGroupName "mystorageaccs" -Name "'+storage+
                                                          '";$Context = $StorageAccount.Context;$Blob1HT = @{File = "'+imagepath+
                                                          '" ; Container= "'+cont+'";Blob= "'+fname+'"; Context= $Context};Set-AzStorageBlobContent @Blob1HT',
                                                          {'shell':'powershell.exe'});
              if (stderr) {
                return {"error": stderr};
              }
              return {"data": stdout};
            };
            test2().then( x => {
              console.log(chalk.green.bold('File Uploaded'))
              async function test2() {
                const { error,stdout, stderr } = await exec('$StorageAccount = Get-AzStorageAccount -ResourceGroupName "mystorageaccs" -Name "'+storage+
                '";$Context = $StorageAccount.Context;$Blob2HT = @{File = "C:/Users/Vyas/Desktop/Azure Assignment Storage Containers/abc.txt" ; Container= "'+cont+'";Blob= "'+fname+'.txt"; Context= $Context};Set-AzStorageBlobContent @Blob2HT',
                {'shell':'powershell.exe'});
              if (stderr) {
                return {"error": stderr};
              }
              return {"data": stdout};
            };
            test2().then( x => {
              console.log(chalk.green.bold('File Uploaded'))
              
            }).catch(err=>{
            console.log(err.stderr)
            })
            
            }).catch(err=>{
            console.log(err.stderr)
            })
          }
            }
        })
        break;
      }

  case 4:
    var storage = prompt('Enter Storage name : ');
    var con = prompt('Enter Container Name : ');
    async function test3() {
      const { error,stdout, stderr } = await exec('$StorageAccount = Get-AzStorageAccount -ResourceGroupName "mystorageaccs" -Name "'+storage+'";$Context = $StorageAccount.Context;Get-AzStorageBlob -Container "'+con+'" -Context $Context ',{'shell':'powershell.exe'});
      if (stderr) {
        return {"error": stderr};
      }
      return {"data": stdout};
    };

    test3().then( x => {
      console.log(x)
    }).catch(err=>{
    console.log(err.stderr)
    })
    break;

  default :
  console.log('Enter Valid Option')
}

