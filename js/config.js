/* 优德习正 · 扫码测评（活码）前端配置
 * 机构信息在此修改即可，无需动其他代码。
 * 收数据通道：腾讯云 CloudBase 体验版「云函数 + 云存储」（国内可直连、低成本）。
 *   - 家长提交 → 云函数 POST /  → 写入云存储 leads/<时间戳>.json
 *   - 机构后台凭管理密码 GET /?pwd=xxx → 列出所有线索
 * 函数代码见 cloudfunction/index.js；HTTP 触发在「环境管理 → HTTP 访问服务」配置。
 */
window.UDXZ_CONFIG = {
  institution: "优德习正 · 习惯教育",
  slogan: "免费习惯测评 · 扫码即测",
  // 显示在成功页与生成台的机构联系方式（微信/电话均可）
  contactText: "咨询微信：17628422695",
  // 腾讯云 CloudBase「HTTP 访问服务」绑定的默认域名
  // 形如 https://youde-xizheng-live-d9cr621ed869a.<region>.app.tcloudbase.com
  cloudbaseHttp: "https://youde-xizheng-live-d9cr621ed869a-1429754614.ap-shanghai.app.tcloudbase.com",
  // 后台读取密码（与云函数内 ADMIN_PWD 一致，默认 udxz2026）
  adminPwd: "udxz2026"
};
