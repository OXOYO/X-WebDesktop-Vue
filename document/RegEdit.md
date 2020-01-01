## Windows 注册表

  提示：相信大家对Windows中的关联一定不会陌生，我们在资源管理器中双击系统中的某个文件时，系统会自动打开一个程序并会打开它。如双击一个Word文件则会自动调用Microsoft Word，而双击BMP则会自动调用画图程序等等，这就是关联。而大家所不知道的是，其实当我们双击一文件后，Windows会首先在该主键下查找该类文件的扩展名，然后以此扩展名子键中的文件类型信息为基础，再查找该类文件相对应的应用程序信息，最后使用相应的程序来打开我们双击的文件。如我们可以单击“开始”→“程序”→“运行”命令，然后输入“regedit”来启动系统注册表，并单击HKEY_CLASSES_ROOT主键，找到“.bmp”子键（如图2），我们会发现其记录其默认值为“Microsoft Word文档e”，而它的shell-open-command子键则记录的command子键的默认值“C:/WINDOWS/SYSTEM32/MSPAINT.EXE %1”，则表示它是调用C:/WINDOWS/SYSTEM32/MSPAINT.EXE程序来打开我们双击的BMP文件的。
