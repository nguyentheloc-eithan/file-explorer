'use client';

import { File, Folder } from 'lucide-react';

export function FileExplorer() {
  return (
    <div className="h-screen flex bg-[#202020] text-gray-200">
      {/* Main content area */}
      <div className="flex flex-col flex-1">
        <>
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-[1fr_200px_150px_100px] gap-1 p-2 text-sm border-b border-gray-800">
              <div>Name</div>
              <div>Date modified</div>
              <div>Type</div>
              <div>Size</div>
            </div>
            <div className="overflow-auto">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="grid grid-cols-[1fr_200px_150px_100px] gap-1 p-2 text-sm hover:bg-gray-800">
                  <div className="flex items-center gap-2">
                    {file.type === 'File folder' ? (
                      <Folder
                        size={16}
                        className="text-yellow-600"
                      />
                    ) : (
                      <File size={16} />
                    )}
                    {file.name}
                  </div>
                  <div>{file.dateModified}</div>
                  <div>{file.type}</div>
                  <div>{file.size}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

const files = [
  {
    name: '+note',
    dateModified: '19/01/2024 9:16 am',
    type: 'Text Document',
    size: '1 KB',
  },
  {
    name: 'credentials',
    dateModified: '18/11/2023 10:31 pm',
    type: 'JSON Source File',
    size: '1 KB',
  },
  {
    name: 'Document1',
    dateModified: '12/06/2024 4:36 am',
    type: 'WPS PDF Document',
    size: '45 KB',
  },
  {
    name: 'github-recovery-codes',
    dateModified: '19/01/2024 9:20 am',
    type: 'Text Document',
    size: '1 KB',
  },
  {
    name: 'hosts',
    dateModified: '06/10/2023 2:29 pm',
    type: 'Text Document',
    size: '1 KB',
  },
  {
    name: 'key minio',
    dateModified: '18/11/2023 9:38 am',
    type: 'Text Document',
    size: '1 KB',
  },
  {
    name: 'py -m google_auth_oauthlib.tool --c',
    dateModified: '22/06/2024 4:25 pm',
    type: 'Text Document',
    size: '1 KB',
  },
  {
    name: 'name file',
    dateModified: '07/02/2025 10:18 pm',
    type: 'ZIP File',
    size: '6,014 KB',
  },
];
