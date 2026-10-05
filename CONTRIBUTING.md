# 参与 RHINE DSH 主题

感谢帮助改进主题。请先搜索已有 Issues，确认是否已有相同反馈。

## 问题与建议

请说明主题版本、DSH 版本、Windows 版本、复现步骤、预期与实际结果。窗口相关问题请注明是否安装原生适配；性能问题可附显卡、显示分辨率、缩放与主题画质设置。截图和日志请先去除密钥、会话内容与个人路径。

功能建议请描述实际场景及期望行为。原始网页项目的问题可先在上游检索；本主题的兼容性与适配问题由本仓库跟踪。

## 提交代码

1. 从 `dsh-rhine-theme` 分支创建工作分支，并将 PR 目标设为 `dsh-rhine-theme`。
2. 在 `integrations/dsh-rhine-theme` 执行 `npm ci`、`npm test`、`npm run build`。
3. 涉及发布或原生工具时，在 Windows 运行 `npm run release` 和 `node scripts/verify-release.mjs releases/1.0.0/dsh-rhine-theme-1.0.0-windows.zip`。
4. UI 变更请记录真实宿主版本，检查浅深色、小窗口、键盘焦点、减少动态效果与相关业务操作。类型检查和宿主集成验证方法见主题 README。
5. 在 PR 中解释问题、修改效果、验证结果及未验证的部分。保持改动范围集中。

不提交 `node_modules`、构建缓存、用户 profile、凭据或本机调试记录。引入第三方素材须提供来源和允许分发的许可，保留原作者署名与许可文件；不要提交未获分发许可的字体或音视频。
