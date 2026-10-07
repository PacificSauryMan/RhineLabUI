# RHINE 1.0.1 · Windows DSH Desktop

适配 **DeepSeek Harness Desktop 0.2.0-rc.2** 的三维档案室主题。

本次更新完善全屏与 70% 最小窗口面积限制的原生安装诊断及修复：

- `check` 同时检查主进程入口、preload 桥接、窗口策略版本与标题栏适配，明确区分“宿主兼容”和“已经完整安装”。
- 对 DSH 更新或重建后入口丢失的情况，重新运行 `install` 可恢复窗口功能；安装先备份，写入后检查完整性，并保留其他本地补丁。
- 发布验证新增 ASAR 与解包安装中“只丢失主进程入口”的复现、检测和修复回归。

**已有用户修复方法：** 下载本版完整 Windows ZIP，解压后完全退出 DSH，使用新包内工具执行：

```powershell
node ./native/rhine-native.cjs check "C:\Path\To\DeepSeek Harness.exe"
node ./native/rhine-native.cjs install "C:\Path\To\DeepSeek Harness.exe"
```

看到 `repair required` 表示需修复，完成后重新启动 DSH。若当前主题正常，仅修复窗口功能无需重装 `.tgz`；单独更新 `.tgz` 也不能修复 DSH 应用文件。窗口策略和主题视觉保持不变。DSH 后续更新可能再次覆盖原生适配，届时需重新检查。

- 三维项目档案、浅深色外观、体素聊天投影与真实会话工作区。
- 连续专注展开/收起、光学组件拆解、开场动画及可选环境声。
- 保留视觉的性能优化：无效输入唤醒清理、波形缓存、可见绘制裁剪、独立阴影覆盖、无损模型压缩、同帧悬停拾取合并与无用深度缓冲移除。
- 带备份和版本检查的 Windows 原生窗口适配工具，支持 ASAR 与解包安装布局。

下载 `dsh-rhine-theme-1.0.1-windows.zip`，解压并阅读 `INSTALL.md`。熟悉 DSH 插件安装且不需要原生工具时，可仅下载 `.tgz`。

安装：在 DSH 内置“插件 → 添加插件”中填入下载后 `.tgz` 文件的绝对路径，完成后确认启用并重启。请勿填入 ZIP 路径。本版部分 CLI 不允许管理 `desktop` profile，推荐使用内置插件管理器。

主题包已编译，无需用户构建。首次安装依赖需要联网，使用主题时资源随包离线提供。更新后完整退出并重启 DSH。

兼容边界：Windows Desktop 0.2.0-rc.2；尚未验证 macOS/Linux 或其他宿主版本。原生适配会修改应用文件并保留备份；DSH 升级后需重新确认兼容性。90 FPS 是可选上限，不是最低性能保证。

发布附件：完整 Windows ZIP、预构建 TGZ、安装说明和 SHA-256 校验文件。本资源包不包含用户 profile、会话、凭据、本机备份、截图或开发环境依赖。
