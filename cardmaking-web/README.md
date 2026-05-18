# 岁月明信片 Web App

这是对原 `cardmaking` 静态 HTML 明信片的架构升级版，入口文件为 `index.html`。

## 推荐运行方式

为了保证预设照片可以正常导出为 PNG，请用本地 Web 服务打开：

```powershell
cd F:\Python\PythonProject1\cardmaking-web
python -m http.server 8787
```

然后访问：

```text
http://127.0.0.1:8787/
```

直接双击 `index.html` 也可以查看和编辑界面，但部分浏览器会限制本地图片进入 Canvas，导致预设照片导出失败。

## 目录结构

```text
cardmaking-web/
├── index.html
├── src/
│   ├── app.js
│   └── styles.css
└── assets/
    └── photos/
```

## 已实现

- 左侧作品管理和照片导入
- 历史作品删除
- 上传照片后可手动裁剪：拖动照片、调整裁剪大小、切换横版/竖版
- 中央正反面明信片画布
- 右侧文字、背面留言、邮编、版式编辑
- 正面文字大小、位置、行距调节
- 正面三行文字可分别拖拽移动，也可用滑杆精调
- 背面文字大小、位置、宽度调节
- 文字主题切换：手写楷体、柔和行书、典雅宋体、清爽黑体
- 照片可直接拖拽移动，支持更大范围的大小、左右、上下调节
- 横版/竖版切换
- 移动端响应式布局
- Canvas 双面 PNG 导出
- 不依赖 html2canvas CDN
