const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { PDFDocument: PDFLib } = require('pdf-lib');
const { Document, Packer, Paragraph, Table, TableRow, TableCell } = require('docx');
const ExcelJS = require('exceljs');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu();
};

const createMenu = () => {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu-new-file'),
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow?.webContents.send('menu-open-file'),
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu-save-file'),
        },
        { type: 'separator' },
        {
          label: '导出为',
          submenu: [
            {
              label: '导出为 PDF',
              click: () => mainWindow?.webContents.send('menu-export-pdf'),
            },
            {
              label: '导出为 Word (.docx)',
              click: () => mainWindow?.webContents.send('menu-export-docx'),
            },
            {
              label: '导出为 Excel (.xlsx)',
              click: () => mainWindow?.webContents.send('menu-export-xlsx'),
            },
            {
              label: '导出为 PowerPoint (.pptx)',
              click: () => mainWindow?.webContents.send('menu-export-pptx'),
            },
            {
              label: '导出为 PNG',
              click: () => mainWindow?.webContents.send('menu-export-png'),
            },
          ],
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', click: () => mainWindow?.webContents.send('menu-undo') },
        { label: '重做', accelerator: 'CmdOrCtrl+Y', click: () => mainWindow?.webContents.send('menu-redo') },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', click: () => mainWindow?.webContents.send('menu-cut') },
        { label: '复制', accelerator: 'CmdOrCtrl+C', click: () => mainWindow?.webContents.send('menu-copy') },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', click: () => mainWindow?.webContents.send('menu-paste') },
      ],
    },
    {
      label: '查看',
      submenu: [
        { label: '重新加载', accelerator: 'CmdOrCtrl+R', click: () => mainWindow?.reload() },
        { label: '全屏', accelerator: 'F11', click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()) },
        { type: 'separator' },
        { label: '缩放 +', accelerator: 'CmdOrCtrl+Plus', click: () => mainWindow?.webContents.send('menu-zoom-in') },
        { label: '缩放 -', accelerator: 'CmdOrCtrl+Minus', click: () => mainWindow?.webContents.send('menu-zoom-out') },
        { label: '重置缩放', accelerator: 'CmdOrCtrl+0', click: () => mainWindow?.webContents.send('menu-zoom-reset') },
      ],
    },
    {
      label: '工具',
      submenu: [
        {
          label: '格式转换',
          click: () => mainWindow?.webContents.send('menu-convert'),
        },
        {
          label: 'PDF 编辑',
          click: () => mainWindow?.webContents.send('menu-pdf-edit'),
        },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于 Multi Format Editor Pro',
              message: 'Multi Format Editor Pro v2.0.0',
              detail: '支持 Markdown、PPT、PDF、Word、Excel 和图片编辑，以及多种格式转换',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// IPC 事件处理
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    filters: [
      { name: '所有支持的文件', extensions: ['md', 'pptx', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'docx', 'xlsx', 'xls'] },
      { name: 'Markdown', extensions: ['md'] },
      { name: 'PowerPoint', extensions: ['pptx'] },
      { name: 'PDF', extensions: ['pdf'] },
      { name: 'Word', extensions: ['docx'] },
      { name: 'Excel', extensions: ['xlsx', 'xls'] },
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] },
      { name: '所有文件', extensions: ['*'] },
    ],
  });
  return result;
});

ipcMain.handle('save-file-dialog', async (event, fileType) => {
  const filters = {
    markdown: { name: 'Markdown', extensions: ['md'] },
    pptx: { name: 'PowerPoint', extensions: ['pptx'] },
    pdf: { name: 'PDF', extensions: ['pdf'] },
    docx: { name: 'Word', extensions: ['docx'] },
    xlsx: { name: 'Excel', extensions: ['xlsx'] },
    image: { name: 'Image', extensions: ['png'] },
  };

  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [filters[fileType] || { name: 'All Files', extensions: ['*'] }],
  });
  return result;
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.md') {
      const content = fs.readFileSync(filePath, 'utf-8');
      return { success: true, content, filePath, type: 'markdown' };
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      return { success: true, content: result.value, filePath, type: 'docx' };
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const content = XLSX.utils.sheet_to_csv(sheet);
      return { success: true, content, filePath, type: 'xlsx', metadata: { sheets: workbook.SheetNames } };
    } else {
      const content = fs.readFileSync(filePath, 'utf-8');
      return { success: true, content, filePath };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('convert-pdf-to-word', async (event, pdfPath, outputPath) => {
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFLib.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    
    const paragraphs = pages.map((page, index) => 
      new Paragraph(`[Page ${index + 1}]`)
    );
    
    const doc = new Document({ sections: [{ children: paragraphs }] });
    const docBuffer = await Packer.toBuffer(doc);
    
    fs.writeFileSync(outputPath, docBuffer);
    return { success: true, message: 'PDF 已转换为 Word' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('convert-pdf-to-excel', async (event, pdfPath, outputPath) => {
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFLib.load(pdfBuffer);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Extracted Data');
    
    const pages = pdfDoc.getPages();
    let rowNum = 1;
    
    pages.forEach((page, index) => {
      worksheet.getCell(`A${rowNum}`).value = `Page ${index + 1}`;
      rowNum++;
    });
    
    await workbook.xlsx.writeFile(outputPath);
    return { success: true, message: 'PDF 已转换为 Excel' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('convert-word-to-pdf', async (event, docPath, outputPath) => {
  try {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    
    doc.pipe(stream);
    const result = await mammoth.extractRawText({ path: docPath });
    
    doc.fontSize(12).text(result.value, 50, 50);
    doc.end();
    
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve({ success: true, message: 'Word 已转换为 PDF' }));
      stream.on('error', (err) => reject({ success: false, error: err.message }));
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('convert-excel-to-pdf', async (event, excelPath, outputPath) => {
  try {
    const workbook = XLSX.readFile(excelPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    
    doc.pipe(stream);
    doc.fontSize(10).text(csv, 50, 50);
    doc.end();
    
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve({ success: true, message: 'Excel 已转换为 PDF' }));
      stream.on('error', (err) => reject({ success: false, error: err.message }));
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('edit-pdf', async (event, pdfPath, operations) => {
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFLib.load(pdfBuffer);
    
    // 支持基本的 PDF 编辑操作
    operations.forEach(op => {
      if (op.type === 'add-text') {
        const page = pdfDoc.getPage(op.pageIndex || 0);
        page.drawText(op.text, {
          x: op.x || 50,
          y: op.y || 50,
          size: op.fontSize || 12,
          color: [0, 0, 0],
        });
      } else if (op.type === 'delete-page') {
        pdfDoc.removePage(op.pageIndex || 0);
      }
    });
    
    return { success: true, pdfBuffer: await pdfDoc.save() };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
