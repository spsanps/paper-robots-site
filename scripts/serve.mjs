import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server=createServer(async(req,res)=>{try{
  let file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(file !== root.slice(0,-1) && !file.startsWith(root.endsWith(sep) ? root : root+sep)){res.writeHead(403).end();return;}
  try { if((await stat(file)).isDirectory()) file=resolve(file,'index.html'); } catch { /* Handled as 404 below. */ }
  const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'}).end(body);
}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'}).end(await readFile(resolve(root,'404.html')));}});
server.listen(Number(process.env.PORT||4174),'127.0.0.1',()=>console.log(`Paper Robots: http://127.0.0.1:${server.address().port}`));
