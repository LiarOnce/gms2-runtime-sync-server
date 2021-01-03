# gms2-runtime-sync-server

搭建一个自己的 GMS2 Runtime 镜像站.

## Usage

事先上传 `templates` 下的 RSS 文件（部分内容可自行删除）。

配置文件（`config.json`，位于 `configs` 文件夹下）：
```json
{
    "channel": "Stable", //更新通道，可选值为 Stable/NuBeta
    "mirrorURL": "https://gms.magecorn.com" //将要搭建的镜像站地址（需要事先上传模板）
}
```

命令：

```bash
#执行全部流程（生成，下载 ZIP，替换）
npm run start:all 

#仅下载 ZIP
npm run start:onlydownload

#仅生成下载链接
npm run start:onlygenerate

#清除缓存
npm run clean

#应用配置
npm run config

#转换处理后的 JSON 为 RSS (XML)
npm run convert2XML
```

## TODO List

 - [x] 下载  
 - [x] 生成链接
 - [ ] 保留记录