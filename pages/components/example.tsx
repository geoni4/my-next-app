
import path from "path";
import React, { useEffect, useState } from 'react';




// 리소스 폴더 데이터 인터페이스
type ResourceNode = {
  name: string;
  type: 'folder' | 'file';
  children?: ResourceNode[];
}

// 리소스 폴더 데이터 예시 (임의로 설정)

// 트리 노드 컴포넌트
const TreeNode: React.FC<{ node: ResourceNode }> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className="ps-2">
      {node.type === 'folder' ? (
        <span className="folder" onClick={toggleFolder}>
          📁 {node.name}
        </span>
      ) : (
        <span>📄 {node.name}</span>
      )}
      {isOpen && node.children && (
        <ul>
          {node.children.map(child => (
            <TreeNode key={child.name} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

// 트리 컴포넌트
const Tree: React.FC<{ data: ResourceNode[] }> = ({ data }) => {
  return (
    <ul>
      {data.map(node => (
        <TreeNode key={node.name} node={node} />
      ))}
    </ul>
  );
};


const Example: React.FC = () =>  {

  const [data, setData] = useState<ResourceNode[]>([]); // 데이터를 저장할 상태 변수 초기화

  useEffect(() => {
    // 컴포넌트가 마운트될 때 데이터 가져오기
    fetchData()
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/pdfs");
      const jsonData = await response.json(); // JSON 형식으로 파싱
      setData(jsonData); // 상태 업데이트
      console.log(jsonData)
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
    }
  };






  return (
    <div>
      <h1>Resource Tree</h1>
      <Tree data={data} />
    </div>
  );
}

export default Example