const DEBUG = false;
export default function(err: any, req: any, res: any, next: any) {
  const msg = DEBUG ? err.stack : err.message;
  res.status(err.status || 500).send(err.message || '服务端错误');
}
