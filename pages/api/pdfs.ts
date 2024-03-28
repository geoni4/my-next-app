import { ok } from "assert";
import {promises as fs} from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

type ResourceNode = {
  name: string;
  type: 'folder' | 'file';
  children?: ResourceNode[];
}


const getDirAndFileListInNode = async(
  directoryPath: string,
  pathName: string
  ) =>{
  directoryPath = path.join(directoryPath, pathName)
  const stats = await fs.stat(directoryPath);
    // 폴더면 계속 들어간다
    if(stats.isDirectory()){
      try{
        const dirList = await fs.readdir(directoryPath)
        const childrenPromises: Promise<ResourceNode>[] = dirList.map(async(dir)=>{
          return await getDirAndFileListInNode(directoryPath, dir)
        }) 
        const children = await Promise.all(childrenPromises)
        console.log("yes")
        const data: ResourceNode ={
          name: pathName,
          type: 'folder',
          children: children
        }
        return data
        // 들어가서 파일 없으면 map 안 돈다
      }catch{
        const data: ResourceNode ={
          name: pathName,
          type: 'folder'
        }
        return data
      }
    // 폴더 아니면
    } else{
      const data: ResourceNode ={
        name: pathName,
        type: 'file'
      }
      return data
    }
} 

const getFiles  = async(
  req: NextApiRequest,
  res: NextApiResponse<ResourceNode[]>,
) =>  {
  const OK = 200
  const directoryPath: string = path.join(process.cwd(), "public");

  const resourceData: ResourceNode[] = [
    {
      name: 'Folder1',
      type: 'folder',
      children: [
        { name: 'File1-1.txt', type: 'file' },
        { name: 'File1-2.txt', type: 'file' }
      ]
    },
    {
      name: 'Folder2',
      type: 'folder',
      children: [
        { name: 'Subfolder2-1', type: 'folder', children: [{ name: 'File2-1-1.txt', type: 'file' }] },
        { name: 'File2-2.txt', type: 'file' }
      ]
    }
  ];


  try{
    
    const data = await getDirAndFileListInNode(directoryPath, "files")
    console.log(data)
    // const data = resourceData
    res.status(OK).json([data])
    return
  }catch(err){
    const data = resourceData
    console.log(err)
    res.status(500).json(resourceData)
    return
  }
}

export default getFiles